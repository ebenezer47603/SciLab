// ============================================================
// SciLab - Reaction Simulator
// ReactionSimulator.js
// ============================================================

import { ReactionEngine } from "../engine/ReactionEngine.js";
import { MoleculeSystem } from "../systems/MoleculeSystem.js";
import { ReactionScene } from "../scene/ReactionScene.js";
import { ReactionAnimation } from "../animation/ReactionAnimation.js";

// ============================================================
// REACTION SIMULATOR
// ============================================================

export class ReactionSimulator {

    // ========================================================
    // CONSTRUCTOR
    // ========================================================

    constructor() {

        // ----------------------------------------------------
        // THREE.JS SCENE
        // ----------------------------------------------------

        this.scene =
            new ReactionScene();

        // ----------------------------------------------------
        // MOLECULE SYSTEM
        // ----------------------------------------------------

        this.molecules =
            new MoleculeSystem(
                this.scene.getScene()
            );

        // ----------------------------------------------------
        // REACTION ENGINE
        // ----------------------------------------------------

        this.engine =
            new ReactionEngine();

        // ----------------------------------------------------
        // CONNECT ENGINE TO MOLECULE SYSTEM
        // ----------------------------------------------------

        this.engine.setMoleculeSystem(
            this.molecules
        );

        // ----------------------------------------------------
        // REACTION ANIMATION
        // ----------------------------------------------------

        this.animation =
            new ReactionAnimation(
                this.scene.getScene()
            );

        // ----------------------------------------------------
        // INITIAL MOLECULES
        // ----------------------------------------------------

        this.createInitialMolecules();
    }

    // ========================================================
    // CREATE INITIAL MOLECULES
    // ========================================================

    createInitialMolecules() {

        if (!this.molecules) {
            return;
        }

        // ----------------------------------------------------
        // Remove old molecules
        // ----------------------------------------------------

        this.molecules.clear();

        // ----------------------------------------------------
        // Hydrogen
        // ----------------------------------------------------

        this.molecules.addMany(
            "H2",
            20
        );

        // ----------------------------------------------------
        // Oxygen
        // ----------------------------------------------------

        this.molecules.addMany(
            "O2",
            10
        );
    }

    // ========================================================
    // START
    // ========================================================

    start() {

        if (
            this.engine &&
            typeof this.engine.start ===
            "function"
        ) {

            this.engine.start();
        }
    }

    // ========================================================
    // PAUSE
    // ========================================================

    pause() {

        if (
            this.engine &&
            typeof this.engine.pause ===
            "function"
        ) {

            this.engine.pause();
        }
    }

    // ========================================================
    // RESUME
    // ========================================================

    resume() {

        if (
            this.engine &&
            typeof this.engine.resume ===
            "function"
        ) {

            this.engine.resume();
        }
    }

    // ========================================================
    // STOP
    // ========================================================

    stop() {

        if (
            this.engine &&
            typeof this.engine.stop ===
            "function"
        ) {

            this.engine.stop();
        }
    }

    // ========================================================
    // RESET
    // ========================================================

    reset() {

        // ----------------------------------------------------
        // Reset reaction engine
        // ----------------------------------------------------

        if (
            this.engine &&
            typeof this.engine.reset ===
            "function"
        ) {

            this.engine.reset();
        }

        // ----------------------------------------------------
        // Recreate initial molecules
        // ----------------------------------------------------

        this.createInitialMolecules();

        // ----------------------------------------------------
        // Clear animation
        // ----------------------------------------------------

        if (
            this.animation &&
            typeof this.animation.clear ===
            "function"
        ) {

            this.animation.clear();
        }
    }

    // ========================================================
    // TEMPERATURE
    // ========================================================

    setTemperature(
        temperature
    ) {

        if (
            this.engine &&
            typeof this.engine.setTemperature ===
            "function"
        ) {

            this.engine.setTemperature(
                temperature
            );
        }
    }

    // ========================================================
    // UPDATE
    // ========================================================

    update(
        deltaTime
    ) {

        // ----------------------------------------------------
        // Update reaction engine
        // ----------------------------------------------------

        if (
            this.engine &&
            typeof this.engine.update ===
            "function"
        ) {

            this.engine.update(
                deltaTime
            );
        }

        // ----------------------------------------------------
        // Update visual animation
        // ----------------------------------------------------

        if (
            this.animation &&
            typeof this.animation.update ===
            "function"
        ) {

            this.animation.update(
                deltaTime
            );
        }
    }

    // ========================================================
    // GET THREE.JS SCENE
    // ========================================================

    getScene() {

        if (
            this.scene &&
            typeof this.scene.getScene ===
            "function"
        ) {

            return this.scene.getScene();
        }

        return null;
    }

    // ========================================================
    // GET CAMERA
    // ========================================================

    getCamera() {

        if (
            this.scene &&
            typeof this.scene.getCamera ===
            "function"
        ) {

            return this.scene.getCamera();
        }

        return null;
    }

    // ========================================================
    // GET REACTION ENGINE
    // ========================================================

    getEngine() {

        return this.engine;
    }

    // ========================================================
    // GET MOLECULE SYSTEM
    // ========================================================

    getMolecules() {

        return this.molecules;
    }

    // ========================================================
    // GET ANIMATION
    // ========================================================

    getAnimation() {

        return this.animation;
    }

    // ========================================================
    // DISPOSE
    // ========================================================

    dispose() {

        // ----------------------------------------------------
        // Stop engine
        // ----------------------------------------------------

        if (
            this.engine &&
            typeof this.engine.stop ===
            "function"
        ) {

            this.engine.stop();
        }

        // ----------------------------------------------------
        // Clear animation
        // ----------------------------------------------------

        if (
            this.animation &&
            typeof this.animation.clear ===
            "function"
        ) {

            this.animation.clear();
        }

        // ----------------------------------------------------
        // Clear molecules
        // ----------------------------------------------------

        if (
            this.molecules &&
            typeof this.molecules.clear ===
            "function"
        ) {

            this.molecules.clear();
        }

        // ----------------------------------------------------
        // Dispose engine if supported
        // ----------------------------------------------------

        if (
            this.engine &&
            typeof this.engine.dispose ===
            "function"
        ) {

            this.engine.dispose();
        }

        // ----------------------------------------------------
        // Dispose animation if supported
        // ----------------------------------------------------

        if (
            this.animation &&
            typeof this.animation.dispose ===
            "function"
        ) {

            this.animation.dispose();
        }

        // ----------------------------------------------------
        // Dispose scene if supported
        // ----------------------------------------------------

        if (
            this.scene &&
            typeof this.scene.dispose ===
            "function"
        ) {

            this.scene.dispose();
        }

        // ----------------------------------------------------
        // Release references
        // ----------------------------------------------------

        this.animation = null;
        this.molecules = null;
        this.engine = null;
        this.scene = null;
    }
}