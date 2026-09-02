// ============================================================
// SciLab Reaction Lab - Reaction Simulator
// ReactionSimulator.js
// ============================================================

import { ReactionEngine } from "../engine/ReactionEngine.js";
import { MoleculeSystem } from "../systems/MoleculeSystem.js";
import { ReactionScene } from "../scene/ReactionScene.js";

import {
    defaultReaction,
    getReaction
} from "../data/reactions.js";

// ============================================================
// REACTION SIMULATOR
// ============================================================

export class ReactionSimulator {

    constructor(
        reaction = defaultReaction
    ) {

        this.scene =
            new ReactionScene();

        this.molecules =
            new MoleculeSystem(
                this.scene.getScene()
            );

        this.engine =
            new ReactionEngine(
                reaction
            );

        this.engine.setMoleculeSystem(
            this.molecules
        );

        this.animationFrame =
            null;

        this.lastTime =
            0;

        this.running =
            false;

        this.destroyed =
            false;

        // ----------------------------------------------------
        // Interaction is OFF initially
        // ----------------------------------------------------

        this.interactionEnabled =
            false;

        this.createInitialMolecules();

        this.scene.render();
    }

    // ========================================================
    // CREATE INITIAL MOLECULES
    // ========================================================

    createInitialMolecules() {

        this.molecules.clear();

        // ----------------------------------------------------
        // IMPORTANT:
        // New reaction is NOT complete yet.
        // ----------------------------------------------------

        if (
            typeof this.molecules.resetReactionState ===
            "function"
        ) {

            this.molecules.resetReactionState();
        }

        const reaction =
            this.engine.getReaction();

        if (!reaction) {

            return;
        }

        for (
            const item
            of reaction.reactants || []
        ) {

            const coefficient =
                Math.max(
                    1,
                    Number(
                        item.coefficient
                    ) || 1
                );

            const count =
                coefficient * 10;

            this.molecules.addMany(
                item.formula,
                count
            );
        }

        this.engine.reset();

        // ----------------------------------------------------
        // Lock molecule interaction
        // ----------------------------------------------------

        this.setInteractionEnabled(
            false
        );
    }

    // ========================================================
    // SET REACTION
    // ========================================================

    setReaction(
        reactionOrId
    ) {

        const reaction =
            typeof reactionOrId === "string"
                ? getReaction(
                    reactionOrId
                )
                : reactionOrId;

        if (!reaction) {

            return;
        }

        this.stop();

        this.engine.setReaction(
            reaction
        );

        this.createInitialMolecules();

        this.scene.render();
    }

    // ========================================================
    // MOUNT
    // ========================================================

    mount(
        container
    ) {

        if (
            !container
        ) {

            return;
        }

        if (
            this.scene &&
            typeof this.scene.mount ===
            "function"
        ) {

            this.scene.mount(
                container
            );
        }

        this.setupMoleculeInteraction();
    }

    // ========================================================
    // SETUP INTERACTION
    // ========================================================

    setupMoleculeInteraction() {

        if (
            !this.scene ||
            !this.molecules
        ) {

            return;
        }

        const camera =
            typeof this.scene.getCamera ===
            "function"
                ? this.scene.getCamera()
                : null;

        let domElement =
            null;

        if (
            typeof this.scene.getRenderer ===
            "function"
        ) {

            const renderer =
                this.scene.getRenderer();

            if (
                renderer &&
                renderer.domElement
            ) {

                domElement =
                    renderer.domElement;
            }
        }

        // ----------------------------------------------------
        // Try common renderer property
        // ----------------------------------------------------

        if (
            !domElement &&
            this.scene.renderer &&
            this.scene.renderer.domElement
        ) {

            domElement =
                this.scene.renderer.domElement;
        }

        // ----------------------------------------------------
        // Try canvas
        // ----------------------------------------------------

        if (
            !domElement &&
            typeof this.scene.getCanvas ===
            "function"
        ) {

            domElement =
                this.scene.getCanvas();
        }

        if (
            camera &&
            domElement
        ) {

            this.molecules.enableInteraction(
                camera,
                domElement
            );

            // ------------------------------------------------
            // IMPORTANT:
            // Do NOT automatically enable dragging here.
            // The reaction state controls it.
            // ------------------------------------------------

            this.molecules.setInteractionEnabled(
                this.interactionEnabled
            );
        }
    }

    // ========================================================
    // INTERACTION ENABLE / DISABLE
    // ========================================================

    setInteractionEnabled(
        enabled
    ) {

        this.interactionEnabled =
            Boolean(
                enabled
            );

        if (
            this.molecules &&
            typeof this.molecules.setInteractionEnabled ===
            "function"
        ) {

            this.molecules.setInteractionEnabled(
                this.interactionEnabled
            );
        }
    }

    // ========================================================
    // START
    // ========================================================

    start() {

        if (
            this.destroyed ||
            this.running
        ) {

            return;
        }

        // ----------------------------------------------------
        // Reaction starts -> lock dragging
        // ----------------------------------------------------

        this.setInteractionEnabled(
            false
        );

        if (
            this.molecules &&
            typeof this.molecules.setReactionComplete ===
            "function"
        ) {

            this.molecules.setReactionComplete(
                false
            );
        }

        this.running =
            true;

        this.engine.start();

        this.lastTime =
            performance.now();

        this.animationFrame =
            requestAnimationFrame(
                this.animate.bind(this)
            );
    }

    // ========================================================
    // PAUSE
    // ========================================================

    pause() {

        this.engine.pause();
    }

    // ========================================================
    // RESUME
    // ========================================================

    resume() {

        if (
            this.destroyed
        ) {

            return;
        }

        // ----------------------------------------------------
        // Resume reaction -> lock interaction
        // ----------------------------------------------------

        this.setInteractionEnabled(
            false
        );

        if (
            this.molecules &&
            typeof this.molecules.setReactionComplete ===
            "function"
        ) {

            this.molecules.setReactionComplete(
                false
            );
        }

        this.engine.resume();

        if (
            !this.running
        ) {

            this.running =
                true;

            this.lastTime =
                performance.now();

            this.animationFrame =
                requestAnimationFrame(
                    this.animate.bind(this)
                );
        }
    }

    // ========================================================
    // STOP
    // ========================================================

    stop() {

        this.engine.stop();

        this.running =
            false;

        if (
            this.animationFrame !== null
        ) {

            cancelAnimationFrame(
                this.animationFrame
            );

            this.animationFrame =
                null;
        }

        // ----------------------------------------------------
        // Stop does NOT mean reaction completed.
        // Keep dragging disabled.
        // ----------------------------------------------------

        this.setInteractionEnabled(
            false
        );
    }

    // ========================================================
    // RESET
    // ========================================================

    reset() {

        this.stop();

        // ----------------------------------------------------
        // Reset -> reaction is NOT complete
        // ----------------------------------------------------

        if (
            this.molecules &&
            typeof this.molecules.setReactionComplete ===
            "function"
        ) {

            this.molecules.setReactionComplete(
                false
            );
        }

        this.setInteractionEnabled(
            false
        );

        this.molecules.clear();

        this.engine.reset();

        this.createInitialMolecules();

        this.scene.render();
    }

    // ========================================================
    // TEMPERATURE
    // ========================================================

    setTemperature(
        temperature
    ) {

        this.engine.setTemperature(
            temperature
        );
    }

    // ========================================================
    // UPDATE
    // ========================================================

    update(
        deltaTime
    ) {

        this.engine.update(
            deltaTime
        );
    }

    // ========================================================
    // ANIMATION
    // ========================================================

    animate(
        currentTime
    ) {

        if (
            !this.running ||
            this.destroyed
        ) {

            return;
        }

        let deltaTime =
            (
                currentTime -
                this.lastTime
            ) / 1000;

        this.lastTime =
            currentTime;

        deltaTime =
            Math.min(
                Math.max(
                    deltaTime,
                    0
                ),
                0.05
            );

        this.update(
            deltaTime
        );

        this.scene.render();

        // ----------------------------------------------------
        // IMPORTANT:
        // Check reaction completion
        // ----------------------------------------------------

        if (
            typeof this.engine.isComplete ===
            "function" &&
            this.engine.isComplete()
        ) {

            this.running =
                false;

            this.animationFrame =
                null;

            // ------------------------------------------------
            // IMPORTANT FIX:
            // Tell MoleculeSystem that reaction is complete.
            // This enables molecule dragging.
            // ------------------------------------------------

            if (
                this.molecules &&
                typeof this.molecules.setReactionComplete ===
                "function"
            ) {

                this.molecules.setReactionComplete(
                    true
                );
            }

            // ------------------------------------------------
            // Enable interaction AFTER reaction completion.
            // ------------------------------------------------

            this.setInteractionEnabled(
                true
            );

            this.scene.render();

            return;
        }

        if (
            this.running &&
            !this.destroyed
        ) {

            this.animationFrame =
                requestAnimationFrame(
                    this.animate.bind(this)
                );
        }
    }

    // ========================================================
    // GET SCENE
    // ========================================================

    getScene() {

        return this.scene.getScene();
    }

    // ========================================================
    // GET CAMERA
    // ========================================================

    getCamera() {

        return this.scene.getCamera();
    }

    // ========================================================
    // GET SCENE CONTROLLER
    // ========================================================

    getSceneController() {

        return this.scene;
    }

    // ========================================================
    // GET ENGINE
    // ========================================================

    getEngine() {

        return this.engine;
    }

    // ========================================================
    // GET MOLECULES
    // ========================================================

    getMolecules() {

        return this.molecules;
    }

    // ========================================================
    // GET REACTION
    // ========================================================

    getReaction() {

        return this.engine.getReaction();
    }

    // ========================================================
    // GET TEMPERATURE
    // ========================================================

    getTemperature() {

        return this.engine.getTemperature();
    }

    // ========================================================
    // GET PROGRESS
    // ========================================================

    getProgress() {

        return this.engine.getProgressPercent();
    }

    // ========================================================
    // GET REACTION RATE
    // ========================================================

    getReactionRate() {

        return this.engine.getReactionRatePercent();
    }

    // ========================================================
    // GET STATE
    // ========================================================

    getState() {

        return this.engine.getState();
    }

    // ========================================================
    // GET COLLISION COUNT
    // ========================================================

    getCollisionCount() {

        return this.engine.getCollisionCount();
    }

    // ========================================================
    // GET MOLECULE COUNTS
    // ========================================================

    getMoleculeCounts() {

        return this.molecules.getCounts();
    }

    // ========================================================
    // IS RUNNING
    // ========================================================

    isRunning() {

        return this.engine.isRunning();
    }

    // ========================================================
    // IS PAUSED
    // ========================================================

    isPaused() {

        return this.engine.isPaused();
    }

    // ========================================================
    // IS COMPLETE
    // ========================================================

    isComplete() {

        return this.engine.isComplete();
    }

    // ========================================================
    // DISPOSE
    // ========================================================

    dispose() {

        if (
            this.destroyed
        ) {

            return;
        }

        this.stop();

        // ----------------------------------------------------
        // Disable interaction
        // ----------------------------------------------------

        this.setInteractionEnabled(
            false
        );

        if (
            this.molecules &&
            typeof this.molecules.disableInteraction ===
            "function"
        ) {

            this.molecules.disableInteraction();
        }

        if (
            this.molecules &&
            typeof this.molecules.dispose ===
            "function"
        ) {

            this.molecules.dispose();
        }

        if (
            this.scene &&
            typeof this.scene.dispose ===
            "function"
        ) {

            this.scene.dispose();
        }

        this.destroyed =
            true;
    }

    // ========================================================
    // DESTROY
    // ========================================================

    destroy() {

        this.dispose();
    }
}