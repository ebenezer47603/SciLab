// ============================================================
// SciLab - Biology
// DigestiveSystem.js
// ============================================================

import * as THREE from "three";


export class DigestiveSystem {

    constructor() {

        this.group =
            new THREE.Group();

        this.group.name =
            "Digestive System";

        this.selectable =
            [];

        this.create();
    }


    create() {

        // ====================================================
        // ESOPHAGUS
        // ====================================================

        const esophagus =
            new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.18,
                    0.21,
                    2.7,
                    24
                ),
                new THREE.MeshStandardMaterial({
                    color:
                        0xd79a82
                })
            );


        esophagus.position.y =
            2.7;


        this.addPart(
            esophagus,
            "Esophagus",
            "Esophagus",
            "Carries swallowed food from the mouth to the stomach.",
            "Itwara ibiryo byamizwe bikabijyana mu gifu."
        );


        // ====================================================
        // STOMACH
        // ====================================================

        const stomach =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    1.0,
                    32,
                    24
                ),
                new THREE.MeshStandardMaterial({
                    color:
                        0xe08a79
                })
            );


        stomach.scale.set(
            1.35,
            0.95,
            0.85
        );


        stomach.position.set(
            -0.9,
            0.9,
            0
        );


        this.addPart(
            stomach,
            "Stomach",
            "Igifu",
            "Stores food and begins digestion using acids and enzymes.",
            "Igifu kibika ibiryo kandi kigatangiza igogorwa hifashishijwe acids na enzymes."
        );


        // ====================================================
        // SMALL INTESTINE
        // ====================================================

        const curve =
            new THREE.CatmullRomCurve3([
                new THREE.Vector3(
                    -0.2,
                    0.4,
                    0
                ),

                new THREE.Vector3(
                    0.9,
                    0.2,
                    0.2
                ),

                new THREE.Vector3(
                    -0.1,
                    -0.4,
                    0
                ),

                new THREE.Vector3(
                    0.9,
                    -0.8,
                    -0.1
                ),

                new THREE.Vector3(
                    -0.5,
                    -1.1,
                    0
                )
            ]);


        const smallIntestine =
            new THREE.Mesh(
                new THREE.TubeGeometry(
                    curve,
                    90,
                    0.15,
                    16,
                    false
                ),
                new THREE.MeshStandardMaterial({
                    color:
                        0xcf8067
                })
            );


        this.addPart(
            smallIntestine,
            "Small Intestine",
            "Amara mato",
            "Absorbs most nutrients from digested food.",
            "Akura intungamubiri nyinshi mu biryo byamaze kugogorwa."
        );


        // ====================================================
        // LARGE INTESTINE
        // ====================================================

        const largeIntestine =
            new THREE.Mesh(
                new THREE.TorusGeometry(
                    1.25,
                    0.18,
                    16,
                    48
                ),
                new THREE.MeshStandardMaterial({
                    color:
                        0xa96452
                })
            );


        largeIntestine.rotation.x =
            Math.PI / 2;


        largeIntestine.scale.set(
            1,
            0.75,
            1
        );


        largeIntestine.position.y =
            -0.3;


        this.addPart(
            largeIntestine,
            "Large Intestine",
            "Amara manini",
            "Absorbs water and helps form feces.",
            "Akura amazi kandi igafasha gukora umwanda."
        );


        // ====================================================
        // LIVER
        // ====================================================

        const liver =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.9,
                    28,
                    20
                ),
                new THREE.MeshStandardMaterial({
                    color:
                        0x7d3f2b
                })
            );


        liver.scale.set(
            1.5,
            0.7,
            0.9
        );


        liver.position.set(
            1.05,
            1.2,
            0
        );


        this.addPart(
            liver,
            "Liver",
            "Umwijima",
            "The liver produces bile and performs many metabolic functions.",
            "Umwijima ukora bile kandi ukagira uruhare mu mikorere myinshi ya metabolism."
        );


        // ====================================================
        // PANCREAS
        // ====================================================

        const pancreas =
            new THREE.Mesh(
                new THREE.CapsuleGeometry(
                    0.18,
                    1.2,
                    8,
                    16
                ),
                new THREE.MeshStandardMaterial({
                    color:
                        0xe3b58a
                })
            );


        pancreas.rotation.z =
            Math.PI / 2;


        pancreas.position.set(
            0,
            0.3,
            0.7
        );


        this.addPart(
            pancreas,
            "Pancreas",
            "Pancreas",
            "Produces digestive enzymes and hormones including insulin.",
            "Pancreas ikora enzymes z'igogorwa na hormones zirimo insulin."
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
                "digestive",

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

        this.group.rotation.y +=
            delta * 0.03;
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