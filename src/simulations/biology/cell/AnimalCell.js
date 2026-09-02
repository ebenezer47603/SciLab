// ============================================================
// SciLab - Biology Laboratory
// AnimalCell.js
// ============================================================

import * as THREE from "three";

import {
    createNucleus,
    createMitochondrion,
    createGolgi,
    createEndoplasmicReticulum,
    createRibosome,
    createLysosome,
    createCentriole,
    createVesicle
} from "./CellOrganelles.js";


// ============================================================
// ANIMAL CELL
// ============================================================

export class AnimalCell {

    constructor() {

        // ----------------------------------------------------
        // ROOT GROUP
        // ----------------------------------------------------

        this.group =
    new THREE.Group();

this.group.name =
    "Animal Cell";

this.group.scale.setScalar(
    7.55
);


        // ----------------------------------------------------
        // SELECTABLE OBJECTS
        // ----------------------------------------------------

        this.selectable =
            [];


        // ----------------------------------------------------
        // BUILD CELL
        // ----------------------------------------------------

        this.createMembrane();

        this.createCytoplasm();

        this.createOrganelles();

    }


    // ========================================================
    // CELL MEMBRANE
    // ========================================================

    createMembrane() {

        const geometry =
            new THREE.SphereGeometry(
                4.5,
                96,
                64
            );


        const material =
            new THREE.MeshPhysicalMaterial({

                color:
                    0x3d8bfd,

                transparent:
                    true,

                opacity:
                    0.18,

                transmission:
                    0.18,

                thickness:
                    0.65,

                roughness:
                    0.08,

                metalness:
                    0.0,

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


        membrane.scale.set(
            1.25,
            0.90,
            1.0
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
                "The cell membrane is a selectively permeable boundary that controls what enters and leaves the animal cell.",

            descriptionRw:
                "Cell membrane ni igice kirinda cell kandi igenzura ibinjira n'ibisohoka muri cell.",

            teacher:
                "The cell membrane maintains the internal environment of the cell and regulates movement of substances.",

            color:
                "#3d8bfd"

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
            new THREE.SphereGeometry(
                4.22,
                64,
                48
            );


        const material =
            new THREE.MeshPhysicalMaterial({

                color:
                    0x74c7ec,

                transparent:
                    true,

                opacity:
                    0.11,

                roughness:
                    0.25,

                transmission:
                    0.08,

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


        cytoplasm.scale.set(
            1.18,
            0.84,
            0.95
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
                "Cytoplasm is the jelly-like material inside the cell where many metabolic reactions occur.",

            descriptionRw:
                "Cytoplasm ni ibintu bisa na gel biri muri cell aho reactions nyinshi za metabolism zibera.",

            teacher:
                "The cytoplasm surrounds the organelles and provides an environment for many cellular chemical reactions.",

            color:
                "#74c7ec"

        };


        this.group.add(
            cytoplasm
        );


        this.selectable.push(
            cytoplasm
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
            1.15
        );


        nucleus.position.set(
            0,
            0.15,
            0
        );


        this.group.add(
            nucleus
        );


        this.selectable.push(
            nucleus
        );


        // ====================================================
        // MITOCHONDRIA
        // ====================================================

        const mitochondria = [

            [-2.55, 1.55, 1.0, 0.15],

            [2.45, 1.55, -0.65, -0.35],

            [-2.45, -1.65, -0.75, 0.30],

            [2.35, -1.55, 0.85, -0.20],

            [0.85, 2.55, -1.25, 0.10],

            [-0.75, -2.55, 1.15, 0.40],

            [3.05, 0.15, 0.65, 0.25],

            [-3.05, -0.05, -0.55, -0.30]

        ];


        mitochondria.forEach(
            data => {

                const organelle =
                    createMitochondrion(
                        ...data
                    );


                organelle.userData =
                    organelle.userData || {};


                organelle.userData.type =
                    "organelle";


                this.group.add(
                    organelle
                );


                this.selectable.push(
                    organelle
                );

            }
        );


        // ====================================================
        // GOLGI APPARATUS
        // ====================================================

        const golgi =
            createGolgi();


        golgi.position.set(
            -2.35,
            0.1,
            1.95
        );


        golgi.rotation.y =
            -0.35;


        golgi.scale.set(
            0.95,
            0.95,
            0.95
        );


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


        er.position.set(
            0.35,
            0.25,
            0.55
        );


        er.scale.set(
            0.92,
            0.92,
            0.92
        );


        this.group.add(
            er
        );


        this.selectable.push(
            er
        );


        // ====================================================
        // RIBOSOMES
        // ====================================================

        for (
            let i = 0;
            i < 48;
            i++
        ) {

            const angle =
                Math.random() *
                Math.PI *
                2;


            const radius =
                2.35 +
                Math.random() *
                1.05;


            const x =
                Math.cos(angle) *
                radius;


            const y =
                (
                    Math.random() -
                    0.5
                ) *
                4.7;


            const z =
                Math.sin(angle) *
                radius;


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
        // LYSOSOMES
        // ====================================================

        const lysosomes = [

            [-1.95, 0.85, -2.05],

            [1.90, -0.75, -2.10],

            [0.90, 2.05, 1.50],

            [-0.85, -2.15, -1.75],

            [2.75, 0.35, -1.25]

        ];


        lysosomes.forEach(
            position => {

                const lysosome =
                    createLysosome(
                        ...position
                    );


                this.group.add(
                    lysosome
                );


                this.selectable.push(
                    lysosome
                );

            }
        );


        // ====================================================
        // CENTRIOLES
        // ====================================================

        const centrioleA =
            createCentriole(
                1.45,
                -0.45,
                1.65
            );


        const centrioleB =
            createCentriole(
                1.75,
                -0.45,
                1.65
            );


        centrioleB.rotation.z =
            Math.PI / 2;


        this.group.add(
            centrioleA,
            centrioleB
        );


        this.selectable.push(
            centrioleA,
            centrioleB
        );


        // ====================================================
        // VESICLES
        // ====================================================

        const vesicles = [

            [-3.05, 1.80, 1.45],

            [2.85, 1.05, 1.60],

            [2.85, -1.75, 1.30],

            [-2.85, -1.85, 1.20],

            [0.15, 3.05, -0.75],

            [-0.20, -3.00, 0.70]

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
        // Slow cell rotation
        // ----------------------------------------------------

        this.group.rotation.y +=
            delta *
            0.035;


        // ----------------------------------------------------
        // Very subtle floating motion
        // ----------------------------------------------------

        const time =
            performance.now() *
            0.0004;


        this.group.position.y =
            Math.sin(time) *
            0.04;

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