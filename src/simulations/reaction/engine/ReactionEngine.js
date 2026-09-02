// ============================================================
// SciLab Reaction Lab
// ReactionEngine.js
// ============================================================

import * as THREE from "three";

import { CollisionEngine } from "./CollisionEngine.js";
import { defaultReaction } from "../data/reactions.js";
import { ReactionState } from "../core/ReactionState.js";


export class ReactionEngine {

    constructor(reaction = defaultReaction) {

        this.reaction = reaction;

        this.state =
            new ReactionState();

        this.collisionEngine =
            new CollisionEngine(0.9);

        this.moleculeSystem = null;

        this.reactionCooldown = 0;

        this.reactionInterval = 0.12;

        this.targetBatches = 1;

        this.reset();
    }


    // ========================================================
    // CONNECT MOLECULE SYSTEM
    // ========================================================

    setMoleculeSystem(system) {

        this.moleculeSystem = system;

        this.targetBatches =
            this.calculateAvailableBatches();
    }


    // ========================================================
    // CHANGE REACTION
    // ========================================================

    setReaction(reaction) {

        if (!reaction) {
            return;
        }

        this.reaction = reaction;

        this.reset();
    }


    // ========================================================
    // START
    // ========================================================

    start() {

        if (this.isComplete()) {
            return;
        }

        this.state.start();
    }


    // ========================================================
    // PAUSE
    // ========================================================

    pause() {

        this.state.pause();
    }


    // ========================================================
    // RESUME
    // ========================================================

    resume() {

        this.state.resume();
    }


    // ========================================================
    // STOP
    // ========================================================

    stop() {

        this.state.stop();
    }


    // ========================================================
    // RESET
    // ========================================================

    reset() {

        this.state.reset();

        this.state.reactants =
            (this.reaction?.reactants || [])
                .map(item => ({
                    ...item
                }));

        this.state.products =
            (this.reaction?.products || [])
                .map(item => ({
                    ...item
                }));


        this.state.energy.activationEnergy =
            Number(
                this.reaction?.activationEnergy
            ) || 0;


        this.state.energy.enthalpy =
            Number(
                this.reaction?.enthalpy
            ) || 0;


        this.state.collisions = 0;

        this.state.completedSteps = 0;

        this.state.progress = 0;

        this.state.reactionRate = 0;

        this.state.energy.released = 0;

        this.reactionCooldown = 0;


        this.targetBatches =
            this.calculateAvailableBatches();


        this.calculateReactionRate();
    }


    // ========================================================
    // TEMPERATURE
    // ========================================================

    setTemperature(temperature) {

        const value =
            Number(temperature);


        if (!Number.isFinite(value)) {
            return;
        }


        this.state.temperature =
            Math.max(
                0,
                value
            );


        this.calculateReactionRate();
    }


    getTemperature() {

        return this.state.temperature;
    }


    // ========================================================
    // REACTION RATE
    // ========================================================

    calculateReactionRate() {

        const temperature =
            Number(
                this.state.temperature
            ) || 0;


        const minimum =
            Number(
                this.reaction?.minTemperature
            ) || 0;


        const optimal =
            Number(
                this.reaction?.optimalTemperature
            ) || minimum;


        // Too cold

        if (
            temperature < minimum
        ) {

            this.state.reactionRate = 0;

            return 0;
        }


        // No temperature range specified

        if (
            optimal <= minimum
        ) {

            this.state.reactionRate = 1;

            return 1;
        }


        const normalized =
            (
                temperature - minimum
            ) /
            (
                optimal - minimum
            );


        this.state.reactionRate =
            Math.max(
                0,
                Math.min(
                    1,
                    normalized
                )
            );


        return this.state.reactionRate;
    }


    // ========================================================
    // UPDATE
    // ========================================================

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


        // ----------------------------------------------------
        // Time
        // ----------------------------------------------------

        this.state.elapsedTime +=
            deltaTime;


        // ----------------------------------------------------
        // Calculate reaction speed
        // ----------------------------------------------------

        this.calculateReactionRate();


        // ----------------------------------------------------
        // Need molecule system
        // ----------------------------------------------------

        if (!this.moleculeSystem) {
            return;
        }


        // ----------------------------------------------------
        // Move molecules
        // ----------------------------------------------------

        this.moleculeSystem.update(
            deltaTime,
            this.state.temperature
        );


        const molecules =
            this.moleculeSystem.getMolecules();


        // ----------------------------------------------------
        // Collision detection
        // ----------------------------------------------------

        const collisions =
            this.collisionEngine.detect(
                molecules
            );


        this.state.collisions =
            collisions.length;


        // ----------------------------------------------------
        // Reaction cooldown
        // ----------------------------------------------------

        this.reactionCooldown =
            Math.max(
                0,
                this.reactionCooldown -
                deltaTime
            );


        // ----------------------------------------------------
        // Temperature too low
        // ----------------------------------------------------

        if (
            this.state.reactionRate <= 0
        ) {

            return;
        }


        // ----------------------------------------------------
        // Wait between reactions
        // ----------------------------------------------------

        if (
            this.reactionCooldown > 0
        ) {

            return;
        }


        // ----------------------------------------------------
        // Find reactive collision
        // ----------------------------------------------------

        const reactiveCollision =
            this.collisionEngine
                .findReactiveCollision(
                    molecules,
                    this.reaction
                );


        /*
         * A reaction can happen when:
         *
         * 1. Compatible molecules collide
         *
         * OR
         *
         * 2. There is only one reactant.
         *
         * Example:
         *
         * CaCO3 → CaO + CO2
         */

        const canReact =
            Boolean(
                reactiveCollision
            ) ||
            (
                Array.isArray(
                    this.reaction?.reactants
                ) &&
                this.reaction.reactants.length === 1
            );


        if (!canReact) {
            return;
        }


        // ----------------------------------------------------
        // Perform reaction
        // ----------------------------------------------------

        this.performReaction();


        // ----------------------------------------------------
        // Complete?
        // ----------------------------------------------------

        if (
            this.state.progress >= 1
        ) {

            this.state.progress = 1;

            this.state.isRunning = false;

            this.onReactionComplete();
        }
    }


    // ========================================================
    // FIND REACTANT BATCH
    // ========================================================

    findReactantBatch() {

        if (!this.moleculeSystem) {
            return null;
        }


        const available =
            this.moleculeSystem
                .getMolecules();


        const selected = [];


        for (
            const requirement
            of this.reaction?.reactants || []
        ) {

            const coefficient =
                Math.max(
                    1,
                    Number(
                        requirement.coefficient
                    ) || 1
                );


            const matches =
                available.filter(
                    molecule =>
                        molecule.formula ===
                        requirement.formula &&
                        !selected.includes(
                            molecule
                        )
                );


            if (
                matches.length <
                coefficient
            ) {

                return null;
            }


            selected.push(
                ...matches.slice(
                    0,
                    coefficient
                )
            );
        }


        return selected;
    }


    // ========================================================
    // PERFORM REACTION
    // ========================================================

    performReaction() {

        const batch =
            this.findReactantBatch();


        if (
            !batch ||
            batch.length === 0
        ) {

            return false;
        }


        // ----------------------------------------------------
        // Calculate center
        // ----------------------------------------------------

        const positions =
            batch
                .map(
                    molecule =>
                        molecule.position?.clone()
                )
                .filter(Boolean);


        let center =
            new THREE.Vector3();


        if (positions.length > 0) {

            for (
                const position
                of positions
            ) {

                center.add(
                    position
                );
            }


            center.multiplyScalar(
                1 / positions.length
            );
        }


        // ----------------------------------------------------
        // Remove reactants
        // ----------------------------------------------------

        for (
            const molecule
            of batch
        ) {

            this.moleculeSystem.remove(
                molecule
            );
        }


        // ----------------------------------------------------
        // Create products
        // ----------------------------------------------------

        let productIndex = 0;


        for (
            const product
            of this.reaction?.products || []
        ) {

            const coefficient =
                Math.max(
                    1,
                    Number(
                        product.coefficient
                    ) || 1
                );


            for (
                let i = 0;
                i < coefficient;
                i++
            ) {

                const source =
                    positions[
                        productIndex %
                        Math.max(
                            1,
                            positions.length
                        )
                    ];


                const position =
                    source
                        ? source.clone()
                        : center.clone();


                // ------------------------------------------------
                // Product explosion / separation
                // ------------------------------------------------

                const direction =
                    new THREE.Vector3(
                        Math.random() - 0.5,
                        Math.random() - 0.5,
                        Math.random() - 0.5
                    );


                if (
                    direction.lengthSq() < 0.001
                ) {

                    direction.set(
                        1,
                        0,
                        0
                    );
                }


                direction.normalize();


                position.add(
                    direction.multiplyScalar(
                        0.18
                    )
                );


                const created =
                    this.moleculeSystem
                        .createProduct(
                            product.formula,
                            position
                        );


                // Give product an outward velocity

                if (
                    created &&
                    created.velocity
                ) {

                    created.velocity.copy(
                        direction
                    );


                    created.velocity
                        .multiplyScalar(
                            0.8 +
                            this.state.reactionRate
                        );
                }


                productIndex++;
            }
        }


        // ----------------------------------------------------
        // Progress
        // ----------------------------------------------------

        this.state.completedSteps++;


        const total =
            Math.max(
                1,
                this.targetBatches
            );


        this.state.progress =
            Math.min(
                1,
                this.state.completedSteps /
                total
            );


        // ----------------------------------------------------
        // Reaction cooldown
        // ----------------------------------------------------

        /*
         * Higher temperature/rate =
         * shorter cooldown.
         */

        const rate =
            Math.max(
                0.05,
                this.state.reactionRate
            );


        this.reactionCooldown =
            this.reactionInterval /
            rate;


        return true;
    }


    // ========================================================
    // AVAILABLE REACTION BATCHES
    // ========================================================

    calculateAvailableBatches() {

        if (!this.moleculeSystem) {
            return 1;
        }


        const molecules =
            this.moleculeSystem
                .getMolecules();


        const reactants =
            this.reaction?.reactants || [];


        if (
            reactants.length === 0
        ) {

            return 1;
        }


        let minimum =
            Infinity;


        for (
            const item
            of reactants
        ) {

            const coefficient =
                Math.max(
                    1,
                    Number(
                        item.coefficient
                    ) || 1
                );


            const count =
                molecules.filter(
                    molecule =>
                        molecule.formula ===
                        item.formula
                ).length;


            const batches =
                Math.floor(
                    count /
                    coefficient
                );


            minimum =
                Math.min(
                    minimum,
                    batches
                );
        }


        if (
            !Number.isFinite(minimum)
        ) {

            return 1;
        }


        return Math.max(
            1,
            minimum
        );
    }


    // ========================================================
    // COMPLETE REACTION
    // ========================================================

    onReactionComplete() {

        const enthalpy =
            Number(
                this.reaction?.enthalpy
            ) || 0;


        if (
            this.reaction?.exothermic
        ) {

            this.state.energy.released =
                Math.abs(
                    enthalpy
                );

        } else {

            this.state.energy.released =
                0;
        }
    }


    // ========================================================
    // GET PROGRESS
    // ========================================================

    getProgressPercent() {

        return Math.round(
            Math.max(
                0,
                Math.min(
                    1,
                    this.state.progress
                )
            ) * 100
        );
    }


    // ========================================================
    // GET RATE
    // ========================================================

    getReactionRatePercent() {

        return Math.round(
            Math.max(
                0,
                Math.min(
                    1,
                    this.state.reactionRate
                )
            ) * 100
        );
    }


    // ========================================================
    // GET COLLISIONS
    // ========================================================

    getCollisionCount() {

        return (
            Number(
                this.state.collisions
            ) || 0
        );
    }


    // ========================================================
    // GET STATE
    // ========================================================

    getState() {

        return this.state;
    }


    // ========================================================
    // GET REACTION
    // ========================================================

    getReaction() {

        return this.reaction;
    }


    // ========================================================
    // STATUS
    // ========================================================

    isRunning() {

        return Boolean(
            this.state.isRunning
        );
    }


    isPaused() {

        return Boolean(
            this.state.isPaused
        );
    }


    isComplete() {

        return (
            Number(
                this.state.progress
            ) >= 1
        );
    }
}