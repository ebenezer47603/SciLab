import { CollisionEngine } from "./CollisionEngine.js";
import { ReactionState } from "../core/ReactionState.js";
import { ReactionRateSystem } from "../systems/ReactionRateSystem.js";
import { defaultReaction } from "../data/reactions.js";

export class ReactionEngine {
    constructor(reaction = defaultReaction) {
        this.reaction = reaction;

        this.state = new ReactionState();

        this.collisionEngine =
            new CollisionEngine();

        this.rateSystem =
            new ReactionRateSystem(
                reaction
            );

        this.moleculeSystem = null;

        this.reactionCooldown = 0;

        this.reset();
    }

    setMoleculeSystem(moleculeSystem) {
        this.moleculeSystem = moleculeSystem;
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
            this.reaction.reactants.map(
                item => ({ ...item })
            );

        this.state.products =
            this.reaction.products.map(
                item => ({ ...item })
            );

        this.state.energy.activationEnergy =
            this.reaction.activationEnergy;

        this.state.energy.enthalpy =
            this.reaction.enthalpy;

        this.rateSystem.reset();

        this.reactionCooldown = 0;

        this.calculateReactionRate();
    }

    setTemperature(temperature) {
        this.rateSystem.setTemperature(
            temperature
        );

        this.state.temperature =
            this.rateSystem.getTemperature();

        this.calculateReactionRate();
    }

    calculateReactionRate() {
        this.state.reactionRate =
            this.rateSystem.getRate();

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

        if (this.reactionCooldown > 0) {
            this.reactionCooldown -= deltaTime;
        }

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

        if (
            this.state.reactionRate <= 0 ||
            this.reactionCooldown > 0
        ) {
            return;
        }

        for (const [a, b] of collisions) {
            if (
                this.collisionEngine.isReactive(
                    a,
                    b
                )
            ) {
                const reacted =
                    this.performReaction(a, b);

                if (reacted) {
                    break;
                }
            }
        }

        if (this.state.progress >= 1) {
            this.state.progress = 1;

            this.state.isRunning = false;

            this.onReactionComplete();
        }
    }

    performReaction(a, b) {
        if (!this.moleculeSystem) {
            return false;
        }

        const molecules =
            this.moleculeSystem.getMolecules();

        const h2 =
            a?.formula === "H2"
                ? a
                : b?.formula === "H2"
                    ? b
                    : null;

        const o2 =
            a?.formula === "O2"
                ? a
                : b?.formula === "O2"
                    ? b
                    : null;

        if (!h2 || !o2) {
            return false;
        }

        const secondH2 =
            molecules.find(
                molecule =>
                    molecule !== h2 &&
                    molecule.formula === "H2"
            );

        if (!secondH2) {
            return false;
        }

        const position1 =
            this.getReactionPosition(
                h2,
                o2
            );

        const position2 =
            this.getReactionPosition(
                secondH2,
                o2
            );

        this.moleculeSystem.remove(h2);

        this.moleculeSystem.remove(
            secondH2
        );

        this.moleculeSystem.remove(o2);

        this.moleculeSystem.createProduct(
            "H2O",
            position1
        );

        this.moleculeSystem.createProduct(
            "H2O",
            position2
        );

        this.state.successfulReactions += 1;

        this.state.progress =
            Math.min(
                1,
                this.state.progress +
                0.05 *
                this.state.reactionRate
            );

        this.reactionCooldown = 0.15;

        return true;
    }

    getReactionPosition(a, b) {
        if (
            !a?.position ||
            !b?.position
        ) {
            return null;
        }

        return a.position
            .clone()
            .add(b.position)
            .multiplyScalar(0.5);
    }

    onReactionComplete() {
        this.state.energy.released =
            this.reaction.exothermic
                ? Math.abs(
                    this.reaction.enthalpy
                )
                : 0;
    }

    getProgress() {
        return this.state.progress;
    }

    getProgressPercent() {
        return Math.round(
            this.state.progress * 100
        );
    }

    getReactionRate() {
        return this.state.reactionRate;
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
}