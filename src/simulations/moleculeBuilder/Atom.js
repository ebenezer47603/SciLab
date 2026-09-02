import * as THREE from "three";

// ============================================================
// SciLab Molecule Builder
// Atom.js
// ============================================================

const ELEMENTS = {

    H: {
        color: 0xffffff,
        radius: 0.25
    },

    C: {
        color: 0x333333,
        radius: 0.34
    },

    N: {
        color: 0x3050f8,
        radius: 0.33
    },

    O: {
        color: 0xff2222,
        radius: 0.32
    },

    F: {
        color: 0x90e050,
        radius: 0.30
    },

    Cl: {
        color: 0x1ff01f,
        radius: 0.34
    },

    S: {
        color: 0xffff00,
        radius: 0.36
    },

    P: {
        color: 0xff8000,
        radius: 0.36
    },

    B: {
        color: 0xffb5b5,
        radius: 0.30
    },

    Be: {
        color: 0xc2ff00,
        radius: 0.30
    },

    default: {
        color: 0xaaaaaa,
        radius: 0.30
    }

};


// ============================================================
// Create atom
// ============================================================

export function createAtom(atomData) {

    const element =
        atomData.element || "X";

    const data =
        ELEMENTS[element] ||
        ELEMENTS.default;


    // --------------------------------------------------------
    // Atom group
    // --------------------------------------------------------

    const atomGroup =
        new THREE.Group();

    atomGroup.name =
        `Atom_${element}_${atomData.index ?? 0}`;


    // --------------------------------------------------------
    // Sphere
    // --------------------------------------------------------

    const geometry =
        new THREE.SphereGeometry(
            data.radius,
            40,
            40
        );


    const material =
        new THREE.MeshStandardMaterial({

            color: data.color,

            metalness: 0.15,

            roughness: 0.28

        });


    const sphere =
        new THREE.Mesh(
            geometry,
            material
        );


    sphere.castShadow = true;

    sphere.receiveShadow = true;


    // --------------------------------------------------------
    // Position
    // --------------------------------------------------------

    sphere.position.set(

        atomData.x || 0,

        atomData.y || 0,

        atomData.z || 0

    );


    atomGroup.add(
        sphere
    );


    // --------------------------------------------------------
    // Store atom information
    // --------------------------------------------------------

    atomGroup.userData = {

        element,

        index:
            atomData.index ?? 0,

        x:
            atomData.x || 0,

        y:
            atomData.y || 0,

        z:
            atomData.z || 0

    };


    return atomGroup;

}


// ============================================================
// Get element information
// ============================================================

export function getElementInfo(
    element
) {

    return (
        ELEMENTS[element] ||
        ELEMENTS.default
    );

}