// ============================================================
// SciLab - Biology
// Meiosis.js
// ============================================================

import * as THREE from "three";


export class Meiosis {

    constructor() {

        this.group =
            new THREE.Group();

        this.group.name =
            "Meiosis";

        this.selectable = [];

        this.time = 0;

        this.create();
    }


    create() {

        const colors = [
            0xf72585,
            0x4cc9f0,
            0xffc857,
            0x4ade80
        ];


        const positions = [

            [-2.4, 1.7, 0],

            [2.4, 1.7, 0],

            [-2.4, -1.7, 0],

            [2.4, -1.7, 0]

        ];


        positions.forEach(
            (position, index) => {

                const cell =
                    new THREE.Mesh(
                        new THREE.SphereGeometry(
                            1.0,
                            28,
                            20
                        ),
                        new THREE.MeshPhysicalMaterial({

                            color:
                                colors[index],

                            transparent:
                                true,

                            opacity:
                                0.34,

                            roughness:
                                0.25
                        })
                    );


                cell.position.set(
                    ...position
                );


                cell.name =
                    `Gamete ${index + 1}`;


                cell.userData = {

                    type:
                        "meiosis",

                    name:
                        `Gamete ${index + 1}`,

                    nameRw:
                        `Gamete ${index + 1}`,

                    description:
                        "A haploid cell produced through meiosis.",

                    descriptionRw:
                        "Akagari ka haploid kaboneka nyuma ya meiosis."
                };


                this.group.add(
                    cell
                );


                this.selectable.push(
                    cell
                );
            }
        );


        this.chromosomes =
            new THREE.Group();


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const chromosome =
                new THREE.Mesh(
                    new THREE.CapsuleGeometry(
                        0.09,
                        0.55,
                        6,
                        10
                    ),
                    new THREE.MeshStandardMaterial({
                        color:
                            colors[
                                i %
                                colors.length
                            ]
                    })
                );


            chromosome.position.set(
                (
                    i - 3.5
                ) * 0.35,
                0,
                0.5
            );


            chromosome.name =
                "Chromosome";


            chromosome.userData = {

                type:
                    "chromosome",

                name:
                    "Chromosome",

                nameRw:
                    "Chromosome",

                description:
                    "Chromosomes carry genetic information during meiosis.",

                descriptionRw:
                    "Chromosomes zitwara amakuru y'irondakoko mu gihe cya meiosis."
            };


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


        this.chromosomes.rotation.z +=
            delta * 0.18;


        const pulse =
            1 +
            Math.sin(
                this.time * 2
            ) * 0.04;


        this.group.scale.setScalar(
            pulse
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