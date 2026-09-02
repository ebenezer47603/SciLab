import { elements } from "../../data/elements.js";

import {
    createAtom,
    playAtom,
    pauseAtom
} from "./AtomScene.js";

import { atomInfo } from "./AtomInfo.js";

let currentElement = elements[0];

export function initializeAtomControls(scene) {

    const selector = document.getElementById("element-select");

    const buildButton = document.getElementById("build-atom");

    const resetButton = document.getElementById("reset-atom");

    const playButton = document.getElementById("play-atom");

    const pauseButton = document.getElementById("pause-atom");

    const infoPanel = document.getElementById("atom-info");

    const teacherPanel = document.getElementById("teacher-info");

    if (
        !selector ||
        !buildButton ||
        !resetButton ||
        !playButton ||
        !pauseButton
    ) {
        return;
    }

    // Default element

    currentElement = elements[0];

    selector.value = currentElement.number;

    infoPanel.innerHTML = atomInfo(currentElement);

    teacherPanel.innerHTML = teacherText(currentElement);

    createAtom(scene, currentElement);

    // Element selection

    selector.addEventListener("change", () => {

        currentElement = elements.find(

            element =>

                element.number === Number(selector.value)

        );

        infoPanel.innerHTML = atomInfo(currentElement);

        teacherPanel.innerHTML = teacherText(currentElement);

    });

    // Build Atom

    buildButton.addEventListener("click", () => {

        createAtom(scene, currentElement);

    });

    // Reset Atom

    resetButton.addEventListener("click", () => {

        createAtom(scene, currentElement);

        playAtom();

    });

    // Play

    playButton.addEventListener("click", () => {

        playAtom();

    });

    // Pause

    pauseButton.addEventListener("click", () => {

        pauseAtom();

    });

}

function teacherText(element) {

    return `

        <h3>${element.name} (${element.symbol})</h3>

        <p>

            <strong>Atomic Number:</strong>
            ${element.number}

        </p>

        <p>

            <strong>Protons:</strong>
            ${element.protons}

        </p>

        <p>

            <strong>Neutrons:</strong>
            ${element.neutrons}

        </p>

        <p>

            <strong>Electrons:</strong>
            ${element.electrons}

        </p>

        <p>

            <strong>Electron Configuration:</strong>

            ${element.shells.join(" , ")}

        </p>

        <hr>

        <p>

            <b>Teacher Note</b>

        </p>

        <p>

            This atom follows the Bohr Model.

            Electrons move around the nucleus in shells.

            The first shell (K) holds up to 2 electrons.

            The second shell (L) holds up to 8 electrons.

            The third shell (M) holds up to 8 electrons for the first twenty elements.

            The fourth shell (N) begins with Potassium and Calcium.

        </p>

    `;

}