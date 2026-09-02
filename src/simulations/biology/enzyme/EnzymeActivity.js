// ============================================================
// SciLab - Biology
// EnzymeActivity.js
// Interactive Enzyme Activity Laboratory
// ============================================================

import * as THREE from "three";


export class EnzymeActivity {

    constructor() {

        this.group =
            new THREE.Group();

        this.group.name =
            "Enzyme Activity";

        this.selectable =
            [];

        this.time =
            0;

        this.running =
            false;

        this.paused =
            false;

        this.phase =
            "ready";

        this.phaseTime =
            0;

        // ====================================================
        // EXPERIMENT PARAMETERS
        // ====================================================

        this.temperature =
            37;

        this.pH =
            7;

        this.substrateConcentration =
            60;

        this.enzymeConcentration =
            50;

        // ====================================================
        // RESULTS
        // ====================================================

        this.activity =
            0;

        this.reactionRate =
            0;

        this.productFormation =
            0;

        this.temperatureFactor =
            1;

        this.pHFactor =
            1;

        // ====================================================
        // OBJECTS
        // ====================================================

        this.enzyme =
            null;

        this.substrate =
            null;

        this.activeSite =
            null;

        this.product1 =
            null;

        this.product2 =
            null;

        this.createExperiment();

        this.reset();

    }


    // ========================================================
    // CREATE EXPERIMENT
    // ========================================================

    createExperiment() {

        // ====================================================
        // ENZYME
        // ====================================================

        const enzyme =
            new THREE.Mesh(

                new THREE.TorusKnotGeometry(
                    1.6,
                    0.48,
                    96,
                    20
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0x7655d9,

                    roughness:
                        0.32,

                    metalness:
                        0.04

                })

            );


        enzyme.name =
            "Enzyme";


        enzyme.userData = {

            name:
                "Enzyme",

            type:
                "enzyme",

            description:
                "An enzyme is a biological catalyst that speeds up a chemical reaction without being consumed.",

            teacher:
                "Enzymes lower activation energy and make biochemical reactions more efficient."

        };


        this.enzyme =
            enzyme;


        this.group.add(
            enzyme
        );


        this.selectable.push(
            enzyme
        );


        // ====================================================
        // ACTIVE SITE
        // ====================================================

        const activeSite =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.62,
                    24,
                    18
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0x2dd4bf,

                    transparent:
                        true,

                    opacity:
                        0.8,

                    roughness:
                        0.2

                })

            );


        activeSite.position.set(
            1.2,
            0,
            0
        );


        activeSite.scale.set(
            1.2,
            0.72,
            0.72
        );


        activeSite.name =
            "Active Site";


        activeSite.userData = {

            name:
                "Active Site",

            type:
                "active-site",

            description:
                "The active site is the region of the enzyme where the substrate binds.",

            teacher:
                "The active site has a specific shape that allows particular substrates to bind."

        };


        this.activeSite =
            activeSite;


        this.group.add(
            activeSite
        );


        this.selectable.push(
            activeSite
        );


        // ====================================================
        // SUBSTRATE
        // ====================================================

        const substrate =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.6,
                    0.64,
                    0.72
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0xf4c542,

                    roughness:
                        0.28

                })

            );


        substrate.position.set(
            -4.2,
            0,
            0
        );


        substrate.name =
            "Substrate";


        substrate.userData = {

            name:
                "Substrate",

            type:
                "substrate",

            description:
                "The substrate is the molecule that binds to the active site of an enzyme.",

            teacher:
                "The substrate approaches the active site and forms an enzyme-substrate complex."

        };


        this.substrate =
            substrate;


        this.group.add(
            substrate
        );


        this.selectable.push(
            substrate
        );


        // ====================================================
        // PRODUCT 1
        // ====================================================

        const product1 =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.42,
                    24,
                    18
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0x4ade80,

                    roughness:
                        0.25

                })

            );


        product1.position.set(
            4.0,
            1.1,
            0
        );


        product1.name =
            "Product 1";


        product1.userData = {

            name:
                "Product 1",

            type:
                "product",

            description:
                "One of the products formed after the enzymatic reaction.",

            teacher:
                "Products are released after catalysis while the enzyme remains available."

        };


        this.product1 =
            product1;


        this.group.add(
            product1
        );


        this.selectable.push(
            product1
        );


        // ====================================================
        // PRODUCT 2
        // ====================================================

        const product2 =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.42,
                    24,
                    18
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0x4cb6ff,

                    roughness:
                        0.25

                })

            );


        product2.position.set(
            4.0,
            -1.1,
            0
        );


        product2.name =
            "Product 2";


        product2.userData = {

            name:
                "Product 2",

            type:
                "product",

            description:
                "A second product formed after the catalytic reaction.",

            teacher:
                "Products leave the active site after the reaction is complete."

        };


        this.product2 =
            product2;


        this.group.add(
            product2
        );


        this.selectable.push(
            product2
        );


        this.setProductVisibility(
            0
        );

    }


    // ========================================================
    // CALCULATE ACTIVITY
    // ========================================================

    calculateActivity() {

        // Temperature optimum around 37°C
        const temperatureDistance =
            Math.abs(
                this.temperature -
                37
            );


        this.temperatureFactor =
            Math.max(
                0,
                1 -
                temperatureDistance /
                45
            );


        // pH optimum around 7
        const pHDistance =
            Math.abs(
                this.pH -
                7
            );


        this.pHFactor =
            Math.max(
                0,
                1 -
                pHDistance /
                7
            );


        const substrateFactor =
            this.substrateConcentration /
            100;


        const enzymeFactor =
            this.enzymeConcentration /
            100;


        this.activity =
            Math.max(
                0,
                Math.min(
                    100,
                    this.temperatureFactor *
                    this.pHFactor *
                    Math.min(
                        1,
                        substrateFactor * 1.35
                    ) *
                    (
                        0.35 +
                        enzymeFactor * 0.65
                    ) *
                    100
                )
            );


        this.reactionRate =
            this.activity *
            0.85;


    }


    // ========================================================
    // PARAMETERS
    // ========================================================

    setTemperature(
        value
    ) {

        this.temperature =
            THREE.MathUtils.clamp(
                Number(value),
                0,
                80
            );

        this.calculateActivity();

    }


    setPH(
        value
    ) {

        this.pH =
            THREE.MathUtils.clamp(
                Number(value),
                0,
                14
            );

        this.calculateActivity();

    }


    setSubstrateConcentration(
        value
    ) {

        this.substrateConcentration =
            THREE.MathUtils.clamp(
                Number(value),
                0,
                100
            );

        this.calculateActivity();

    }


    setEnzymeConcentration(
        value
    ) {

        this.enzymeConcentration =
            THREE.MathUtils.clamp(
                Number(value),
                0,
                100
            );

        this.calculateActivity();

    }


    // ========================================================
    // STATE
    // ========================================================

    getState() {

        return {

            temperature:
                this.temperature,

            pH:
                this.pH,

            substrate:
                this.substrateConcentration,

            enzyme:
                this.enzymeConcentration,

            activity:
                this.activity,

            reactionRate:
                this.reactionRate,

            productFormation:
                this.productFormation,

            temperatureFactor:
                this.temperatureFactor,

            pHFactor:
                this.pHFactor,

            phase:
                this.phase,

            phaseDescription:
                this.getPhaseDescription()

        };

    }


    // ========================================================
    // PHASE DESCRIPTION
    // ========================================================

    getPhaseDescription() {

        switch (
            this.phase
        ) {

            case "moving":

                return (
                    "The substrate is approaching the enzyme's active site."
                );


            case "binding":

                return (
                    "The substrate fits into the active site and forms an enzyme-substrate complex."
                );


            case "catalysis":

                return (
                    "Catalysis is occurring and new products are forming."
                );


            case "release":

                return (
                    "Products are leaving the active site."
                );


            case "complete":

                return (
                    "Reaction complete — the enzyme is ready for another reaction."
                );


            default:

                return (
                    "Ready — press Start Reaction."
                );

        }

    }


    // ========================================================
    // START
    // ========================================================

    start() {

        if (
            this.phase ===
            "complete"
        ) {

            this.reset();

        }


        this.running =
            true;

        this.paused =
            false;


        if (
            this.phase ===
            "ready"
        ) {

            this.phase =
                "moving";

            this.phaseTime =
                0;

        }

    }


    // ========================================================
    // PAUSE
    // ========================================================

    pause() {

        this.paused =
            !this.paused;

    }


    // ========================================================
    // RESET
    // ========================================================

    reset() {

        this.running =
            false;

        this.paused =
            false;

        this.time =
            0;

        this.phase =
            "ready";

        this.phaseTime =
            0;

        this.productFormation =
            0;

        this.calculateActivity();


        if (this.substrate) {

            this.substrate.position.set(
                -4.2,
                0,
                0
            );

            this.substrate.rotation.set(
                0,
                0,
                0
            );

            this.substrate.visible =
                true;

        }


        if (this.product1) {

            this.product1.position.set(
                4.0,
                1.1,
                0
            );

            this.product1.visible =
                false;

        }


        if (this.product2) {

            this.product2.position.set(
                4.0,
                -1.1,
                0
            );

            this.product2.visible =
                false;

        }


        if (this.enzyme) {

            this.enzyme.scale.setScalar(
                1
            );

        }

    }


    // ========================================================
    // PRODUCT VISIBILITY
    // ========================================================

    setProductVisibility(
        value
    ) {

        const visible =
            value >
            0.02;


        if (this.product1) {

            this.product1.visible =
                visible;

        }


        if (this.product2) {

            this.product2.visible =
                visible;

        }

    }


    // ========================================================
    // UPDATE
    // ========================================================

    update(
        delta
    ) {

        this.time +=
            delta;


        if (
            !this.running ||
            this.paused
        ) {

            return;

        }


        this.phaseTime +=
            delta;


        // ====================================================
        // APPROACH
        // ====================================================

        if (
            this.phase ===
            "moving"
        ) {

            const duration =
                2.4;


            const t =
                THREE.MathUtils.clamp(
                    this.phaseTime /
                    duration,
                    0,
                    1
                );


            const eased =
                t < 0.5
                    ? 2 * t * t
                    : 1 -
                        Math.pow(
                            -2 * t + 2,
                            2
                        ) /
                        2;


            this.substrate.position.x =
                THREE.MathUtils.lerp(
                    -4.2,
                    1.65,
                    eased
                );


            this.substrate.position.y =
                Math.sin(
                    this.time *
                    3
                ) *
                0.06;


            if (
                t >=
                1
            ) {

                this.phase =
                    "binding";

                this.phaseTime =
                    0;

            }

        }


        // ====================================================
        // BINDING
        // ====================================================

        else if (
            this.phase ===
            "binding"
        ) {

            this.substrate.position.x =
                1.65;


            this.substrate.position.y =
                Math.sin(
                    this.time *
                    5
                ) *
                0.04;


            this.enzyme.scale.setScalar(
                1 +
                Math.sin(
                    this.time *
                    5
                ) *
                0.012
            );


            if (
                this.phaseTime >=
                1.3
            ) {

                this.phase =
                    "catalysis";

                this.phaseTime =
                    0;

            }

        }


        // ====================================================
        // CATALYSIS
        // ====================================================

        else if (
            this.phase ===
            "catalysis"
        ) {

            this.substrate.position.x =
                1.65;


            const pulse =
                1 +
                Math.sin(
                    this.phaseTime *
                    12
                ) *
                0.035;


            this.enzyme.scale.setScalar(
                pulse
            );


            const t =
                THREE.MathUtils.clamp(
                    this.phaseTime /
                    2.0,
                    0,
                    1
                );


            this.productFormation =
                t *
                this.activity;


            this.setProductVisibility(
                t
            );


            if (
                this.product1
            ) {

                this.product1.position.set(
                    1.45 -
                    t *
                    1.3,

                    t *
                    1.1,

                    0
                );

            }


            if (
                this.product2
            ) {

                this.product2.position.set(
                    1.85 +
                    t *
                    1.3,

                    -t *
                    1.1,

                    0
                );

            }


            this.substrate.scale.set(
                1 -
                t *
                0.5,

                1 -
                t *
                0.25,

                1 -
                t *
                0.25
            );


            if (
                t >=
                1
            ) {

                this.phase =
                    "release";

                this.phaseTime =
                    0;

            }

        }


        // ====================================================
        // RELEASE
        // ====================================================

        else if (
            this.phase ===
            "release"
        ) {

            const t =
                THREE.MathUtils.clamp(
                    this.phaseTime /
                    1.8,
                    0,
                    1
                );


            if (
                this.product1
            ) {

                this.product1.position.x =
                    0.15 -
                    t *
                    3.7;

                this.product1.position.y =
                    1.1 +
                    t *
                    0.65;

            }


            if (
                this.product2
            ) {

                this.product2.position.x =
                    3.15 +
                    t *
                    2.3;

                this.product2.position.y =
                    -1.1 -
                    t *
                    0.65;

            }


            this.productFormation =
                this.activity;


            this.enzyme.scale.setScalar(
                1
            );


            if (
                t >=
                1
            ) {

                this.phase =
                    "complete";

                this.phaseTime =
                    0;

            }

        }


        // ====================================================
        // COMPLETE
        // ====================================================

        else if (
            this.phase ===
            "complete"
        ) {

            this.running =
                false;

        }

    }


    // ========================================================
    // OBJECT GETTER
    // ========================================================

    getObject() {

        return this.group;

    }


    // ========================================================
    // SELECTABLE OBJECTS
    // ========================================================

    getSelectableObjects() {

        return this.selectable;

    }


    // ========================================================
    // DISPOSE
    // ========================================================

    dispose() {

        this.group.traverse(
            object => {

                if (
                    object.geometry
                ) {

                    object.geometry.dispose();

                }


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

                                material.dispose();

                            }
                        );

                    } else {

                        object.material.dispose();

                    }

                }

            }
        );


        this.selectable =
            [];

        this.enzyme =
            null;

        this.substrate =
            null;

        this.activeSite =
            null;

        this.product1 =
            null;

        this.product2 =
            null;

    }

}