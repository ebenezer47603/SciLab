// ============================================================
// SciLab - Biology
// RespiratorySystem.js
// ============================================================

import * as THREE from "three";


export class RespiratorySystem {

    constructor() {

        this.group =
            new THREE.Group();

        this.group.name =
            "Respiratory System";

        this.selectable =
            [];

        this.time =
            0;

        this.create();
    }


    create() {

        const airwayMaterial =
            new THREE.MeshStandardMaterial({
                color:
                    0xd68a8a,

                roughness:
                    0.55
            });


        // ====================================================
        // TRACHEA
        // ====================================================

        const trachea =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.22,
                    0.27,
                    3.0,
                    28
                ),
                airwayMaterial
            );


        trachea.position.y =
            2.6;


        this.addPart(
            trachea,
            "Trachea",
            "Trachea",
            "Carries air toward the lungs.",
            "Itwara umwuka ikawujyana mu bihaha."
        );


        // ====================================================
        // LEFT LUNG
        // ====================================================

        const leftLung =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    1.4,
                    32,
                    24
                ),
                new THREE.MeshStandardMaterial({
                    color:
                        0xe47d89
                })
            );


        leftLung.scale.set(
            0.85,
            1.25,
            0.72
        );


        leftLung.position.set(
            -1.35,
            0.4,
            0
        );


        this.addPart(
            leftLung,
            "Left Lung",
            "Igihaha cy'ibumoso",
            "The left lung exchanges oxygen and carbon dioxide.",
            "Igihaha cy'ibumoso gifasha guhanahana oxygen na carbon dioxide."
        );


        // ====================================================
        // RIGHT LUNG
        // ====================================================

        const rightLung =
            leftLung.clone();


        rightLung.position.x =
            1.35;


        this.addPart(
            rightLung,
            "Right Lung",
            "Igihaha cy'iburyo",
            "The right lung exchanges oxygen and carbon dioxide.",
            "Igihaha cy'iburyo gifasha guhanahana oxygen na carbon dioxide."
        );


        // ====================================================
        // DIAPHRAGM
        // ====================================================

        const diaphragm =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    2.0,
                    32,
                    18,
                    0,
                    Math.PI * 2,
                    0,
                    Math.PI / 2
                ),
                new THREE.MeshStandardMaterial({
                    color:
                        0xf0bb82
                })
            );


        diaphragm.scale.set(
            1.15,
            0.45,
            0.75
        );


        diaphragm.position.y =
            -1.05;


        this.addPart(
            diaphragm,
            "Diaphragm",
            "Diaphragm",
            "Helps move air into and out of the lungs.",
            "Ifasha kwinjiza no gusohora umwuka mu bihaha."
        );


        // ====================================================
        // BRONCHI
        // ====================================================

        this.createBronchus(
            -0.65
        );

        this.createBronchus(
            0.65
        );
    }


    createBronchus(
        x
    ) {

        const bronchus =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.13,
                    0.09,
                    1.9,
                    20
                ),
                new THREE.MeshStandardMaterial({
                    color:
                        0xc66d76
                })
            );


        bronchus.rotation.z =
            x < 0
                ? Math.PI / 4
                : -Math.PI / 4;


        bronchus.position.set(
            x,
            1.15,
            0
        );


        this.addPart(
            bronchus,
            x < 0
                ? "Left Bronchus"
                : "Right Bronchus",
            x < 0
                ? "Bronchus y'ibumoso"
                : "Bronchus y'iburyo",
            "Carries air from the trachea into the lung.",
            "Itwara umwuka iva muri trachea ikajya mu gihaha."
        );
    }


    addPart(
        object,
        name,
        nameRw,
        description,
        descriptionRw
    ) {

        object.userData = {

            type:
                "respiratory",

            name,

            nameRw,

            description,

            descriptionRw
        };


        this.group.add(
            object
        );


        this.selectable.push(
            object
        );
    }


    update(
        delta
    ) {

        this.time +=
            delta;


        const breath =
            1 +
            Math.sin(
                this.time * 2
            ) *
            0.035;


        this.group.scale.set(
            breath,
            breath,
            breath
        );
    }


    getObject() {
        return this.group;
    }


    getSelectableObjects() {
        return this.selectable;
    }


    dispose() {

        this.group.traverse(
            object => {

                object.geometry?.dispose();

                if (
                    object.material
                ) {

                    object.material.dispose();
                }
            }
        );

        this.selectable = [];
    }
}