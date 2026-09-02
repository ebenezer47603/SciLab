import { createEngine } from "../../core/engine.js";
import { createAtom, updateAtom } from "./AtomScene.js";
import { initializeAtomControls } from "./AtomControls.js";
import { elements } from "../../data/elements.js";

let engine = null;

export function startAtomSimulator() {

    const container = document.getElementById("engine-container");

    if (!container) return;

    container.innerHTML = "";

    engine = createEngine(container, () => {

        updateAtom();

    });

    // Default Element
    createAtom(engine.scene, elements[0]);

    // Activate Controls
    initializeAtomControls(engine.scene);

}