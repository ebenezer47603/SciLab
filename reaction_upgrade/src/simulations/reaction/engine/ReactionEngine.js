// ============================================================
// SciLab Reaction Lab - Generic Reaction Engine
// ============================================================

import { CollisionEngine } from "./CollisionEngine.js";
import {
    defaultReaction
} from "../data/reactions.js";
import { ReactionState } from "../core/ReactionState.js";

export class ReactionEngine {
    constructor(reaction = defaultReaction) {
        this.reaction = reaction;
        this.state = new ReactionState();

        this.collisionEngine =
            new CollisionEngine(0.9);

        this.moleculeSystem = null;

        this.reactionCooldown = 0;
        this.reactionInterval = 0.08;

        this.reset();
    }

    setMoleculeSystem(moleculeSystem) {
        this.moleculeSystem = moleculeSystem;
    }

    setReaction(reaction) {
        if (!reaction) {
            return;
        }

        this.reaction = reaction;
        this.reset();
    }

    start() {
        this.state.start();
    }

    pause() {
        this.state.pause();
    }

    resume() {
        this.state.resume();
    }

    stop() {
        this.state.stop();
    }

    reset() {
        this.state.reset();

        this.state.reactants =
            (this.reaction.reactants || [])
                .map(item => ({ ...item }));

        this.state.products =
            (this.reaction.products || [])
                .map(item => ({ ...item }));

        this.state.energy.activationEnergy =
            Number(this.reaction.activationEnergy) || 0;

        this.state.energy.enthalpy =
            Number(this.reaction.enthalpy) || 0;

        this.reactionCooldown = 0;
        this.targetBatches = 1;

        if (this.moleculeSystem) {
            this.targetBatches =
                this.calculateAvailableBatches();
        }

        this.calculateReactionRate();
    }

    setTemperature(temperature) {
        this.state.temperature = Math.max(
            0,
            Number(temperature) || 0
        );

        this.calculateReactionRate();
    }

    calculateReactionRate() {
        const temperature =
            this.state.temperature;

        const minimum =
            Number(this.reaction.minTemperature) || 0;

        const optimal =
            Number(this.reaction.optimalTemperature) ||
            minimum;

        if (temperature < minimum) {
            this.state.reactionRate = 0;
            return 0;
        }

        if (optimal <= minimum) {
            this.state.reactionRate = 1;
            return 1;
        }

        this.state.reactionRate = Math.max(
            0,
            Math.min(
                1,
                (temperature - minimum) /
                (optimal - minimum)
            )
        );

        return this.state.reactionRate;
    }

    update(deltaTime) {
        if (
            !this.state.isRunning ||
            this.state.isPaused
        ) {
            return;
        }

        if (
            !Number.isFinite(deltaTime) ||
            deltaTime <= 0
        ) {
            return;
        }

        this.state.elapsedTime += deltaTime;

        this.calculateReactionRate();

        if (!this.moleculeSystem) {
            return;
        }

        this.moleculeSystem.update(
            deltaTime,
            this.state.temperature
        );

        const molecules =
            this.moleculeSystem.getMolecules();

        const collisions =
            this.collisionEngine.detect(
                molecules
            );

        this.state.collisions =
            collisions.length;

        this.reactionCooldown =
            Math.max(
                0,
                this.reactionCooldown -
                deltaTime
            );

        if (
            this.state.reactionRate <= 0 ||
            this.reactionCooldown > 0
        ) {
            return;
        }

        const collision =
            this.collisionEngine
                .findReactiveCollision(
                    molecules,
                    this.reaction
                );

        if (
            collision ||
            this.reaction.reactants.length === 1
        ) {
            this.performReaction();
        }

        if (this.state.progress >= 1) {
            this.state.progress = 1;
            this.state.isRunning = false;
            this.onReactionComplete();
        }
    }

    findReactantBatch() {
        if (!this.moleculeSystem) {
            return null;
        }

        const available =
            this.moleculeSystem.getMolecules();

        const selected = [];

        for (
            const requirement
            of this.reaction.reactants
        ) {
            const matches =
                available.filter(
                    molecule =>
                        molecule.formula ===
                        requirement.formula &&
                        !selected.includes(molecule)
                );

            if (
                matches.length <
                requirement.coefficient
            ) {
                return null;
            }

            selected.push(
                ...matches.slice(
                    0,
                    requirement.coefficient
                )
            );
        }

        return selected;
    }

    performReaction() {
        const batch =
            this.findReactantBatch();

        if (
            !batch ||
            !batch.length
        ) {
            return false;
        }

        const positions =
            batch.map(
                molecule =>
                    molecule.position.clone()
            );

        const center =
            positions.reduce(
                (sum, position) =>
                    sum.add(position),
                positions[0].clone()
            ).multiplyScalar(
                1 / positions.length
            );

        for (const molecule of batch) {
            this.moleculeSystem.remove(
                molecule
            );
        }

        for (
            const product
            of this.reaction.products
        ) {
            for (
                let i = 0;
                i < product.coefficient;
                i++
            ) {
                const offset =
                    positions[i % positions.length]
                        ?.clone()
                        .sub(center)
                        .multiplyScalar(0.25) ||
                    { x: 0, y: 0, z: 0 };

                const position =
                    center.clone();

                if (
                    typeof offset.x ===
                    "number"
                ) {
                    position.add(offset);
                }

                this.moleculeSystem
                    .createProduct(
                        product.formula,
                        position
                    );
            }
        }

        this.state.completedSteps++;

        const progressStep =
            1 /
            Math.max(
                1,
                this.targetBatches
            );

        this.state.progress =
            Math.min(
                1,
                this.state.progress +
                progressStep *
                Math.max(
                    0.15,
                    this.state.reactionRate
                )
            );

        this.reactionCooldown =
            this.reactionInterval;

        return true;
    }

    calculateAvailableBatches() {
        if (!this.moleculeSystem) {
            return 1;
        }

        const molecules =
            this.moleculeSystem.getMolecules();

        const batches =
            this.reaction.reactants.reduce(
                (minimum, item) => {
                    const count =
                        molecules.filter(
                            molecule =>
                                molecule.formula ===
                                item.formula
                        ).length;

                    return Math.min(
                        minimum,
                        Math.floor(
                            count /
                            item.coefficient
                        )
                    );
                },
                Infinity
            );

        return Number.isFinite(batches)
            ? Math.max(1, batches)
            : 1;
    }

    onReactionComplete() {
        this.state.energy.released =
            this.reaction.exothermic
                ? Math.abs(
                    Number(
                        this.reaction.enthalpy
                    ) || 0
                )
                : 0;
    }

    getProgressPercent() {
        return Math.round(
            this.state.progress * 100
        );
    }

    getReactionRatePercent() {
        return Math.round(
            this.state.reactionRate * 100
        );
    }

    getTemperature() {
        return this.state.temperature;
    }

    getState() {
        return this.state;
    }

    getReaction() {
        return this.reaction;
    }

    isRunning() {
        return this.state.isRunning;
    }

    isPaused() {
        return this.state.isPaused;
    }

    isComplete() {
        return this.state.progress >= 1;
    }
}
