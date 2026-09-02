// ============================================================
// SciLab Reaction Lab - Molecule Renderer
// Supports every molecule in data/molecules.js
// ============================================================

import * as THREE from "three";
import { getMolecule } from "../data/molecules.js";

const ELEMENTS = {
    H:  { color: 0xffffff, radius: 0.20 },
    O:  { color: 0xff3333, radius: 0.30 },
    C:  { color: 0x444444, radius: 0.27 },
    N:  { color: 0x3366ff, radius: 0.28 },
    Na: { color: 0xaa88ff, radius: 0.32 },
    Cl: { color: 0x55cc55, radius: 0.31 },
    Zn: { color: 0x8888aa, radius: 0.32 },
    Ca: { color: 0xaaaaaa, radius: 0.33 },
    K:  { color: 0xbb77ff, radius: 0.33 },
    Fe: { color: 0xcc7733, radius: 0.32 },
    Cu: { color: 0xcc6633, radius: 0.31 },
    S:  { color: 0xffcc33, radius: 0.29 }
};

export class MoleculeRenderer {
    constructor(scene) {
        this.scene = scene;

        this.atomSegments = 20;
        this.bondSegments = 10;
    }

    create(formula, position) {
        const molecule = new THREE.Group();

        molecule.userData = {
            formula,
            type: "molecule"
        };

        const definition =
            getMolecule(formula);

        if (!definition) {
            this.createUnknown(molecule);
        } else {
            this.createFromAtoms(
                molecule,
                formula,
                definition.atoms
            );
        }

        if (position) {
            molecule.position.copy(position);
        }

        if (this.scene) {
            this.scene.add(molecule);
        }

        return molecule;
    }

    getElement(element) {
        return (
            ELEMENTS[element] ||
            {
                color: 0x888888,
                radius: 0.25
            }
        );
    }

    atom(radius, color, position) {
        const geometry =
            new THREE.SphereGeometry(
                radius,
                this.atomSegments,
                this.atomSegments
            );

        const material =
            new THREE.MeshStandardMaterial({
                color,
                roughness: 0.35,
                metalness: 0.05
            });

        const mesh =
            new THREE.Mesh(
                geometry,
                material
            );

        mesh.position.copy(position);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    bond(start, end) {
        const direction =
            new THREE.Vector3()
                .subVectors(end, start);

        const length =
            direction.length();

        if (length <= 0) {
            return new THREE.Group();
        }

        const geometry =
            new THREE.CylinderGeometry(
                0.065,
                0.065,
                length,
                this.bondSegments
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x777777,
                roughness: 0.5,
                metalness: 0.1
            });

        const mesh =
            new THREE.Mesh(
                geometry,
                material
            );

        mesh.position
            .copy(start)
            .add(end)
            .multiplyScalar(0.5);

        mesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
        );

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return mesh;
    }

    createFromAtoms(
        group,
        formula,
        atoms
    ) {
        const positions =
            this.getPositions(
                formula,
                atoms.length
            );

        for (
            let i = 0;
            i < atoms.length;
            i++
        ) {
            const element =
                this.getElement(
                    atoms[i]
                );

            group.add(
                this.atom(
                    element.radius,
                    element.color,
                    positions[i]
                )
            );
        }

        for (
            let i = 0;
            i < positions.length - 1;
            i++
        ) {
            group.add(
                this.bond(
                    positions[i],
                    positions[i + 1]
                )
            );
        }

        if (formula === "H2O") {
            group.rotation.z = 0;
        }
    }

    getPositions(formula, count) {
        const special = {
            H2: [
                [-0.28, 0, 0],
                [ 0.28, 0, 0]
            ],

            O2: [
                [-0.35, 0, 0],
                [ 0.35, 0, 0]
            ],

            H2O: [
                [-0.38, 0.25, 0],
                [ 0,     0,    0],
                [ 0.38, 0.25, 0]
            ],

            CO2: [
                [-0.48, 0, 0],
                [ 0,    0, 0],
                [ 0.48, 0, 0]
            ],

            CH4: [
                [ 0,    0,    0],
                [-0.38, 0.35, 0],
                [ 0.38, 0.35, 0],
                [-0.28,-0.35, 0],
                [ 0.28,-0.35, 0]
            ],

            NH3: [
                [ 0,    0,    0],
                [-0.38, 0.30, 0],
                [ 0.38, 0.30, 0],
                [ 0,   -0.38, 0]
            ],

            NaOH: [
                [-0.42, 0, 0],
                [ 0,    0, 0],
                [ 0.42, 0, 0]
            ],

            CaCO3: [
                [-0.58, 0, 0],
                [ 0,    0, 0],
                [ 0.48, 0.30, 0],
                [ 0.48,-0.30, 0],
                [ 0.72, 0, 0]
            ],

            KClO3: [
                [-0.55, 0, 0],
                [ 0,    0, 0],
                [ 0.45, 0.30, 0],
                [ 0.45,-0.30, 0],
                [ 0.70, 0, 0]
            ],

            CuSO4: [
                [-0.70, 0, 0],
                [-0.15, 0, 0],
                [ 0.25, 0.38, 0],
                [ 0.25,-0.38, 0],
                [ 0.65, 0.25, 0],
                [ 0.65,-0.25, 0]
            ],

            FeSO4: [
                [-0.70, 0, 0],
                [-0.15, 0, 0],
                [ 0.25, 0.38, 0],
                [ 0.25,-0.38, 0],
                [ 0.65, 0.25, 0],
                [ 0.65,-0.25, 0]
            ]
        };

        if (special[formula]) {
            return special[formula].map(
                p =>
                    new THREE.Vector3(
                        p[0],
                        p[1],
                        p[2]
                    )
            );
        }

        const positions = [];

        const radius = Math.max(
            0.25,
            (count - 1) * 0.22
        );

        for (let i = 0; i < count; i++) {
            const angle =
                count === 1
                    ? 0
                    : (
                        i /
                        (count - 1)
                    ) * Math.PI * 1.2 -
                      Math.PI * 0.6;

            positions.push(
                new THREE.Vector3(
                    Math.cos(angle) * radius * 0.5,
                    Math.sin(angle) * radius * 0.5,
                    0
                )
            );
        }

        return positions;
    }

    createUnknown(group) {
        group.add(
            this.atom(
                0.25,
                0x888888,
                new THREE.Vector3(0, 0, 0)
            )
        );
    }

    disposeMolecule(molecule) {
        if (!molecule) {
            return;
        }

        molecule.traverse(object => {
            if (
                object.geometry &&
                typeof object.geometry.dispose ===
                "function"
            ) {
                object.geometry.dispose();
            }

            if (object.material) {
                if (Array.isArray(object.material)) {
                    for (
                        const material
                        of object.material
                    ) {
                        material?.dispose?.();
                    }
                } else {
                    object.material.dispose?.();
                }
            }
        });

        molecule.removeFromParent();
    }
}
