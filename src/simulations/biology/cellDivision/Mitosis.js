// ============================================================
// SciLab - Biology
// Mitosis.js
// ============================================================

import * as THREE from "three";


export class Mitosis {

    constructor() {

        this.group =
            new THREE.Group();

        this.group.name =
            "Mitosis";

        this.selectable = [];

        this.time = 0;

        this.create();
    }


    create() {

        // Cell body

        const cell =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    2.6,
                    40,
                    28
                ),
                new THREE.MeshPhysicalMaterial({

                    color:
                        0x4cc9f0,

                    transparent:
                        true,

                    opacity:
                        0.16,

                    roughness:
                        0.2,

                    transmission:
                        0.08
                })
            );


        cell.name =
            "Cell";


        cell.userData = {

            type:
                "mitosis",

            name:
                "Cell",

            nameRw:
                "Akagari",

            description:
                "A cell undergoing mitosis.",

            descriptionRw:
                "Akagari kari gukora mitosis."
        };


        this.group.add(
            cell
        );


        this.selectable.push(
            cell
        );


        // Nucleus

        this.nucleus =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.8,
                    28,
                    20
                ),
                new THREE.MeshStandardMaterial({
                    color:
                        0x7c3aed
                })
            );


        this.nucleus.name =
            "Nucleus";


        this.nucleus.userData = {

            type:
                "mitosis",

            name:
                "Nucleus",

            nameRw:
                "Nucleus",

            description:
                "The nucleus contains the genetic material involved in cell division.",

            descriptionRw:
                "Nucleus ibika genetic material ikoreshwa mu igabanywamo rya cell."
        };


        this.group.add(
            this.nucleus
        );


        this.selectable.push(
            this.nucleus
        );


        // Chromosomes

        this.chromosomes =
            new THREE.Group();


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const chromosome =
                new THREE.Group();


            chromosome.userData = {

                type:
                    "chromosome",

                name:
                    "Chromosome",

                nameRw:
                    "Chromosome",

                description:
                    "Chromosomes carry genetic information.",

                descriptionRw:
                    "Chromosomes zitwara amakuru y'irondakoko."
            };


            const material =
                new THREE.MeshStandardMaterial({
                    color:
                        i % 2 === 0
                            ? 0xf72585
                            : 0xffc857
                });


            const a =
                new THREE.Mesh(
                    new THREE.CapsuleGeometry(
                        0.08,
                        0.5,
                        6,
                        10
                    ),
                    material
                );


            const b =
                new THREE.Mesh(
                    new THREE.CapsuleGeometry(
                        0.08,
                        0.5,
                        6,
                        10
                    ),
                    material
                );


            a.position.x =
                -0.12;

            b.position.x =
                0.12;


            chromosome.add(
                a,
                b
            );


            chromosome.position.set(
                (
                    i - 3.5
                ) * 0.35,
                0,
                0
            );


            this.chromosomes.add(
                chromosome
            );


            this.selectable.push(
                chromosome
            );
        }


        this.group.add(
            this.chromosomes
        );
    }


    update(
        delta
    ) {

        this.time +=
            delta;


        const cycle =
            this.time % 8;


        if (
            cycle < 2
        ) {

            this.nucleus.scale.setScalar(
                1 -
                cycle * 0.15
            );

        } else {

            this.nucleus.scale.setScalar(
                0.7
            );
        }


        if (
            cycle < 4
        ) {

            this.chromosomes.rotation.z +=
                delta * 0.25;

        } else if (
            cycle < 6
        ) {

            this.chromosomes.position.x =
                Math.sin(
                    this.time
                ) * 0.7;

        } else {

            this.chromosomes.rotation.z -=
                delta * 0.15;
        }
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