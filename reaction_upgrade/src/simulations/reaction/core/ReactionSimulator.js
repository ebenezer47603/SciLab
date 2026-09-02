// ============================================================
// SciLab Reaction Lab - Reaction Simulator
// ============================================================

import { ReactionEngine } from "../engine/ReactionEngine.js";
import { MoleculeSystem } from "../systems/MoleculeSystem.js";
import { ReactionScene } from "../scene/ReactionScene.js";
import {
    defaultReaction,
    getReaction
} from "../data/reactions.js";

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

        this.createInitialMolecules();
    }

    createInitialMolecules() {
        this.molecules.clear();

        const reaction =
            this.engine.getReaction();

        for (
            const item
            of reaction.reactants
        ) {
            // Keep the familiar H2:20 / O2:10
            // ratio while making every reaction
            // automatically balanced by coefficient.
            const count =
                Math.max(
                    5,
                    item.coefficient * 10
                );

            this.molecules.addMany(
                item.formula,
                count
            );
        }
    }

    setReaction(reactionOrId) {
        const reaction =
            typeof reactionOrId === "string"
                ? getReaction(
                    reactionOrId
                )
                : reactionOrId;

        if (!reaction) {
            return;
        }

        this.engine.setReaction(
            reaction
        );

        this.createInitialMolecules();
    }

    start() {
        this.engine.start();
    }

    pause() {
        this.engine.pause();
    }

    resume() {
        this.engine.resume();
    }

    stop() {
        this.engine.stop();
    }

    reset() {
        this.engine.reset();
        this.createInitialMolecules();
    }

    setTemperature(
        temperature
    ) {
        this.engine.setTemperature(
            temperature
        );
    }

    update(deltaTime) {
        this.engine.update(
            deltaTime
        );
    }

    getScene() {
        return this.scene.getScene();
    }

    getCamera() {
        return this.scene.getCamera();
    }

    getEngine() {
        return this.engine;
    }

    getMolecules() {
        return this.molecules;
    }

    getReaction() {
        return this.engine.getReaction();
    }
}
