import * as THREE from "three";

import { createNucleus } from "./Nucleus.js";
import { createShells } from "./Shells.js";
import {
    createElectrons,
    animateElectrons
} from "./Electrons.js";

let atomGroup = null;

// Animation state
let isPlaying = true;

export function createAtom(scene, element) {

    if (atomGroup) {

        scene.remove(atomGroup);

    }

    atomGroup = new THREE.Group();

    createNucleus(atomGroup, element);
    createShells(atomGroup, element);
    createElectrons(atomGroup, element);

    scene.add(atomGroup);

}

export function updateAtom() {

    if (!atomGroup) return;

    if (!isPlaying) return;

    atomGroup.rotation.y += 0.002;

    animateElectrons(atomGroup);

}

export function playAtom() {

    isPlaying = true;

}

export function pauseAtom() {

    isPlaying = false;

}

export function clearAtom(scene) {

    if (!atomGroup) return;

    scene.remove(atomGroup);

    atomGroup = null;

}

export function getAtom() {

    return atomGroup;

}