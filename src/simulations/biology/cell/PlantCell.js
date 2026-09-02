// ============================================================
// SciLab - Biology Laboratory
// PlantCell.js
// ============================================================

import * as THREE from "three";

import {
    createNucleus,
    createMitochondrion,
    createChloroplast,
    createVacuole,
    createGolgi,
    createEndoplasmicReticulum,
    createRibosome,
    createVesicle
} from "./CellOrganelles.js";


// ============================================================
// PLANT CELL
// ============================================================

export class PlantCell {

    constructor() {

        // ----------------------------------------------------
        // ROOT GROUP
        // ----------------------------------------------------

        this.group =
            new THREE.Group();

        this.group.name =
            "Plant Cell";

            this.group.scale.setScalar(
    7.25
);


        // ----------------------------------------------------
        // SELECTABLE OBJECTS
        // ----------------------------------------------------

        this.selectable =
            [];


        // ----------------------------------------------------
        // BUILD CELL
        // ----------------------------------------------------

        this.createCellWall();

        this.createMembrane();

        this.createCytoplasm();

        this.createVacuole();

        this.createOrganelles();

    }


    // ========================================================
    // CELL WALL
    // ========================================================

    createCellWall() {

        const geometry =
            new THREE.BoxGeometry(
                10,
                7.2,
                7.2
            );


        const edges =
            new THREE.EdgesGeometry(
                geometry
            );


        const material =
            new THREE.LineBasicMaterial({

                color:
                    0x59c36a,

                transparent:
                    true,

                opacity:
                    0.9

            });


        const wall =
            new THREE.LineSegments(
                edges,
                material
            );


        wall.name =
            "Cell Wall";


        wall.userData = {

            type:
                "cell-structure",

            name:
                "Cell Wall",

            nameRw:
                "Cell Wall",

            description:
                "The cell wall is a rigid outer layer that provides support, protection and shape to the plant cell.",

            descriptionRw:
                "Cell wall ni igice gikomeye cyo hanze gishimangira, kirinda kandi kigafasha plant cell kugira shape.",

            teacher:
                "The plant cell wall is mainly made of cellulose and provides structural support and protection."

        };


        this.group.add(
            wall
        );


        this.selectable.push(
            wall
        );

    }


    // ========================================================
    // CELL MEMBRANE
    // ========================================================

    createMembrane() {

        const geometry =
            new THREE.BoxGeometry(
                9.55,
                6.75,
                6.75
            );


        const material =
            new THREE.MeshPhysicalMaterial({

                color:
                    0x73db7f,

                transparent:
                    true,

                opacity:
                    0.14,

                transmission:
                    0.15,

                thickness:
                    0.5,

                roughness:
                    0.12,

                side:
                    THREE.DoubleSide,

                depthWrite:
                    false

            });


        const membrane =
            new THREE.Mesh(
                geometry,
                material
            );


        membrane.name =
            "Cell Membrane";


        membrane.userData = {

            type:
                "cell-structure",

            name:
                "Cell Membrane",

            nameRw:
                "Cell Membrane",

            description:
                "The cell membrane is a selectively permeable boundary that regulates movement of substances into and out of the plant cell.",

            descriptionRw:
                "Cell membrane ni umupaka uhitamo ibyinjira n'ibisohoka muri plant cell.",

            teacher:
                "The cell membrane controls the movement of water, ions and other substances across the cell boundary."

        };


        this.group.add(
            membrane
        );


        this.selectable.push(
            membrane
        );

    }


    // ========================================================
    // CYTOPLASM
    // ========================================================

    createCytoplasm() {

        const geometry =
            new THREE.BoxGeometry(
                9.0,
                6.2,
                6.2
            );


        const material =
            new THREE.MeshPhysicalMaterial({

                color:
                    0x9be7a5,

                transparent:
                    true,

                opacity:
                    0.08,

                roughness:
                    0.30,

                transmission:
                    0.06,

                depthWrite:
                    false,

                side:
                    THREE.DoubleSide

            });


        const cytoplasm =
            new THREE.Mesh(
                geometry,
                material
            );


        cytoplasm.name =
            "Cytoplasm";


        cytoplasm.userData = {

            type:
                "cell-structure",

            name:
                "Cytoplasm",

            nameRw:
                "Cytoplasm",

            description:
                "Cytoplasm is the jelly-like material surrounding the organelles where many metabolic reactions occur.",

            descriptionRw:
                "Cytoplasm ni ibintu bisa na gel bikikije organelles aho reactions nyinshi za metabolism zibera.",

            teacher:
                "The cytoplasm surrounds the organelles and provides an environment for many chemical reactions."

        };


        this.group.add(
            cytoplasm
        );


        this.selectable.push(
            cytoplasm
        );

    }


    // ========================================================
    // CENTRAL VACUOLE
    // ========================================================

    createVacuole() {

        const vacuole =
            createVacuole();


        vacuole.scale.set(
            1.45,
            1.05,
            1.10
        );


        vacuole.position.set(
            0.4,
            0,
            -0.2
        );


        this.group.add(
            vacuole
        );


        this.selectable.push(
            vacuole
        );

    }


    // ========================================================
    // ORGANELLES
    // ========================================================

    createOrganelles() {

        // ====================================================
        // NUCLEUS
        // ====================================================

        const nucleus =
            createNucleus();


        nucleus.scale.setScalar(
            0.82
        );


        nucleus.position.set(
            -2.55,
            0.15,
            1.15
        );


        this.group.add(
            nucleus
        );


        this.selectable.push(
            nucleus
        );


        // ====================================================
        // CHLOROPLASTS
        // ====================================================

        const chloroplastPositions = [

            [-3.25, 2.25, 2.15],

            [3.10, 2.05, -2.05],

            [-3.05, -2.25, -2.05],

            [3.05, -2.15, 2.05],

            [0.0, 2.75, 2.20],

            [0.0, -2.75, -2.05],

            [-4.05, 0.0, 1.60],

            [4.05, 0.0, -1.45]

        ];


        chloroplastPositions.forEach(
            position => {

                const chloroplast =
                    createChloroplast(
                        ...position
                    );


                chloroplast.scale.set(
                    0.95,
                    0.95,
                    0.95
                );


                this.group.add(
                    chloroplast
                );


                this.selectable.push(
                    chloroplast
                );

            }
        );


        // ====================================================
        // MITOCHONDRIA
        // ====================================================

        const mitochondria = [

            [-1.45, 2.15, -2.15, 0.15],

            [2.05, -2.15, -2.00, -0.30],

            [1.55, 2.30, 2.00, 0.25],

            [-2.25, -0.20, -2.35, -0.15]

        ];


        mitochondria.forEach(
            data => {

                const mitochondrion =
                    createMitochondrion(
                        ...data
                    );


                mitochondrion.scale.multiplyScalar(
                    0.70
                );


                this.group.add(
                    mitochondrion
                );


                this.selectable.push(
                    mitochondrion
                );

            }
        );


        // ====================================================
        // GOLGI APPARATUS
        // ====================================================

        const golgi =
            createGolgi();


        golgi.scale.multiplyScalar(
            0.78
        );


        golgi.position.set(
            2.10,
            0.05,
            2.00
        );


        golgi.rotation.y =
            -0.25;


        this.group.add(
            golgi
        );


        this.selectable.push(
            golgi
        );


        // ====================================================
        // ENDOPLASMIC RETICULUM
        // ====================================================

        const er =
            createEndoplasmicReticulum();


        er.scale.multiplyScalar(
            0.72
        );


        er.position.set(
            -0.20,
            -0.35,
            0.40
        );


        this.group.add(
            er
        );


        this.selectable.push(
            er
        );


        // ====================================================
        // FREE RIBOSOMES
        // ====================================================

        for (
            let i = 0;
            i < 42;
            i++
        ) {

            const x =
                (
                    Math.random() -
                    0.5
                ) *
                7.2;


            const y =
                (
                    Math.random() -
                    0.5
                ) *
                5.1;


            const z =
                (
                    Math.random() -
                    0.5
                ) *
                5.1;


            // Keep free ribosomes away
            // from the central vacuole area.

            if (
                Math.abs(x) < 1.4 &&
                Math.abs(z) < 1.7
            ) {

                continue;

            }


            const ribosome =
                createRibosome(
                    x,
                    y,
                    z
                );


            this.group.add(
                ribosome
            );


            this.selectable.push(
                ribosome
            );

        }


        // ====================================================
        // VESICLES
        // ====================================================

        const vesicles = [

            [-3.25, 1.05, -2.15],

            [3.00, 1.35, 1.50],

            [-2.65, -1.75, 1.80],

            [2.55, -1.45, -1.80],

            [0.55, 2.55, -1.70],

            [-0.55, -2.55, 1.70]

        ];


        vesicles.forEach(
            position => {

                const vesicle =
                    createVesicle(
                        ...position
                    );


                this.group.add(
                    vesicle
                );


                this.selectable.push(
                    vesicle
                );

            }
        );

    }


    // ========================================================
    // GET OBJECT
    // ========================================================

    getObject() {

        return this.group;

    }


    // ========================================================
    // GET SELECTABLE OBJECTS
    // ========================================================

    getSelectableObjects() {

        return this.selectable;

    }


    // ========================================================
    // UPDATE
    // ========================================================

    update(
        delta
    ) {

        if (!this.group) {
            return;
        }


        // ----------------------------------------------------
        // Gentle rotation
        // ----------------------------------------------------

        this.group.rotation.y +=
            delta *
            0.025;


        // ----------------------------------------------------
        // Small floating motion
        // ----------------------------------------------------

        const time =
            performance.now() *
            0.00035;


        this.group.position.y =
            Math.sin(time) *
            0.035;

    }


    // ========================================================
    // DISPOSE
    // ========================================================

    dispose() {

        if (!this.group) {
            return;
        }


        this.group.traverse(
            object => {

                // --------------------------------------------
                // GEOMETRY
                // --------------------------------------------

                if (
                    object.geometry
                ) {

                    object.geometry.dispose();

                }


                // --------------------------------------------
                // MATERIAL
                // --------------------------------------------

                if (
                    object.material
                ) {

                    if (
                        Array.isArray(
                            object.material
                        )
                    ) {

                        object.material.forEach(
                            material => {

                                if (
                                    material &&
                                    typeof material.dispose ===
                                    "function"
                                ) {

                                    material.dispose();

                                }

                            }
                        );

                    } else {

                        if (
                            typeof object.material.dispose ===
                            "function"
                        ) {

                            object.material.dispose();

                        }

                    }

                }

            }
        );


        this.selectable =
            [];


        this.group.clear();

    }

}