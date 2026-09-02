// ============================================================
// SciLab - Molecule Renderer
// MoleculeRenderer.js
// ============================================================

import * as THREE from "three";

// ============================================================
// MOLECULE RENDERER
// ============================================================

export class MoleculeRenderer {

    constructor(scene) {

        this.scene = scene;

        this.atomSegments = 24;

        this.bondSegments = 12;
    }

    // ========================================================
    // CREATE MOLECULE
    // ========================================================

    create(
        formula,
        position
    ) {

        const molecule =
            new THREE.Group();

        molecule.userData = {
            formula,
            type: "molecule"
        };

        // ----------------------------------------------------
        // MOLECULE TYPE
        // ----------------------------------------------------

        switch (formula) {

            case "H2":

                this.createH2(
                    molecule
                );

                break;

            case "O2":

                this.createO2(
                    molecule
                );

                break;

            case "H2O":

                this.createH2O(
                    molecule
                );

                break;

            default:

                this.createUnknown(
                    molecule
                );

                break;
        }

        // ----------------------------------------------------
        // POSITION
        // ----------------------------------------------------

        if (position) {

            molecule.position.copy(
                position
            );
        }

        // ----------------------------------------------------
        // ADD TO SCENE
        // ----------------------------------------------------

        if (this.scene) {

            this.scene.add(
                molecule
            );
        }

        return molecule;
    }

    // ========================================================
    // CREATE ATOM
    // ========================================================

    atom(
        radius,
        color,
        position
    ) {

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

        mesh.position.copy(
            position
        );

        mesh.castShadow = true;

        mesh.receiveShadow = true;

        return mesh;
    }

    // ========================================================
    // CREATE BOND
    // ========================================================

    bond(
        start,
        end
    ) {

        const direction =
            new THREE.Vector3()
                .subVectors(
                    end,
                    start
                );

        const length =
            direction.length();

        if (length <= 0) {

            return new THREE.Group();
        }

        const geometry =
            new THREE.CylinderGeometry(
                0.08,
                0.08,
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

        // ----------------------------------------------------
        // CENTER BOND
        // ----------------------------------------------------

        mesh.position
            .copy(start)
            .add(end)
            .multiplyScalar(0.5);

        // ----------------------------------------------------
        // ROTATE CYLINDER
        // ----------------------------------------------------

        mesh.quaternion.setFromUnitVectors(
            new THREE.Vector3(
                0,
                1,
                0
            ),
            direction.normalize()
        );

        mesh.castShadow = true;

        mesh.receiveShadow = true;

        return mesh;
    }

    // ========================================================
    // H2
    // ========================================================

    createH2(
        group
    ) {

        const hydrogen1 =
            new THREE.Vector3(
                -0.28,
                0,
                0
            );

        const hydrogen2 =
            new THREE.Vector3(
                0.28,
                0,
                0
            );

        // ----------------------------------------------------
        // HYDROGEN 1
        // ----------------------------------------------------

        group.add(
            this.atom(
                0.2,
                0xffffff,
                hydrogen1
            )
        );

        // ----------------------------------------------------
        // HYDROGEN 2
        // ----------------------------------------------------

        group.add(
            this.atom(
                0.2,
                0xffffff,
                hydrogen2
            )
        );

        // ----------------------------------------------------
        // H-H BOND
        // ----------------------------------------------------

        group.add(
            this.bond(
                hydrogen1,
                hydrogen2
            )
        );
    }

    // ========================================================
    // O2
    // ========================================================

    createO2(
        group
    ) {

        const oxygen1 =
            new THREE.Vector3(
                -0.35,
                0,
                0
            );

        const oxygen2 =
            new THREE.Vector3(
                0.35,
                0,
                0
            );

        // ----------------------------------------------------
        // OXYGEN 1
        // ----------------------------------------------------

        group.add(
            this.atom(
                0.3,
                0xff3333,
                oxygen1
            )
        );

        // ----------------------------------------------------
        // OXYGEN 2
        // ----------------------------------------------------

        group.add(
            this.atom(
                0.3,
                0xff3333,
                oxygen2
            )
        );

        // ----------------------------------------------------
        // FIRST O=O BOND
        // ----------------------------------------------------

        group.add(
            this.bond(
                new THREE.Vector3(
                    -0.35,
                    0.07,
                    0
                ),
                new THREE.Vector3(
                    0.35,
                    0.07,
                    0
                )
            )
        );

        // ----------------------------------------------------
        // SECOND O=O BOND
        // ----------------------------------------------------

        group.add(
            this.bond(
                new THREE.Vector3(
                    -0.35,
                    -0.07,
                    0
                ),
                new THREE.Vector3(
                    0.35,
                    -0.07,
                    0
                )
            )
        );
    }

    // ========================================================
    // H2O
    // ========================================================

    createH2O(
        group
    ) {

        const oxygen =
            new THREE.Vector3(
                0,
                0,
                0
            );

        const hydrogen1 =
            new THREE.Vector3(
                -0.38,
                0.25,
                0
            );

        const hydrogen2 =
            new THREE.Vector3(
                0.38,
                0.25,
                0
            );

        // ----------------------------------------------------
        // OXYGEN
        // ----------------------------------------------------

        group.add(
            this.atom(
                0.3,
                0xff3333,
                oxygen
            )
        );

        // ----------------------------------------------------
        // HYDROGEN 1
        // ----------------------------------------------------

        group.add(
            this.atom(
                0.2,
                0xffffff,
                hydrogen1
            )
        );

        // ----------------------------------------------------
        // HYDROGEN 2
        // ----------------------------------------------------

        group.add(
            this.atom(
                0.2,
                0xffffff,
                hydrogen2
            )
        );

        // ----------------------------------------------------
        // O-H BOND 1
        // ----------------------------------------------------

        group.add(
            this.bond(
                oxygen,
                hydrogen1
            )
        );

        // ----------------------------------------------------
        // O-H BOND 2
        // ----------------------------------------------------

        group.add(
            this.bond(
                oxygen,
                hydrogen2
            )
        );
    }

    // ========================================================
    // UNKNOWN MOLECULE
    // ========================================================

    createUnknown(
        group
    ) {

        group.add(
            this.atom(
                0.25,
                0x888888,
                new THREE.Vector3(
                    0,
                    0,
                    0
                )
            )
        );
    }

    // ========================================================
    // DISPOSE MOLECULE
    // ========================================================

    disposeMolecule(
        molecule
    ) {

        if (!molecule) {

            return;
        }

        molecule.traverse(
            (object) => {

                // --------------------------------------------
                // GEOMETRY
                // --------------------------------------------

                if (
                    object.geometry &&
                    typeof object.geometry.dispose ===
                        "function"
                ) {

                    object.geometry.dispose();
                }

                // --------------------------------------------
                // MATERIAL
                // --------------------------------------------

                if (object.material) {

                    if (
                        Array.isArray(
                            object.material
                        )
                    ) {

                        object.material.forEach(
                            (material) => {

                                if (
                                    material &&
                                    typeof material.dispose ===
                                        "function"
                                ) {

                                    material.dispose();
                                }
                            }
                        );

                    } else if (
                        typeof object.material.dispose ===
                            "function"
                    ) {

                        object.material.dispose();
                    }
                }
            }
        );

        // ----------------------------------------------------
        // REMOVE FROM PARENT
        // ----------------------------------------------------

        molecule.removeFromParent();
    }

    // ========================================================
    // CLEAR MOLECULES
    // ========================================================

    clear() {

        if (!this.scene) {

            return;
        }

        const molecules = [];

        // ----------------------------------------------------
        // FIND MOLECULES
        // ----------------------------------------------------

        this.scene.traverse(
            (object) => {

                if (
                    object.userData &&
                    object.userData.type ===
                        "molecule"
                ) {

                    molecules.push(
                        object
                    );
                }
            }
        );

        // ----------------------------------------------------
        // DISPOSE MOLECULES
        // ----------------------------------------------------

        for (
            const molecule
            of molecules
        ) {

            this.disposeMolecule(
                molecule
            );
        }
    }
}