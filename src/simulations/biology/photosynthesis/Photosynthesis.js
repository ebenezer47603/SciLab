// ============================================================
// SciLab - Biology
// Photosynthesis.js
// Environmental Photosynthesis Laboratory
// ============================================================

import * as THREE from "three";


// ============================================================
// COLORS
// ============================================================

const COLORS = {

    sky:
        0x071827,

    soil:
        0x513421,

    soilLight:
        0x6b442b,

    trunk:
        0x6e472b,

    branch:
        0x7b5030,

    leaf:
        0x1f8f45,

    leafLight:
        0x4ade80,

    leafDark:
        0x166534,

    water:
        0x1687b8,

    waterLight:
        0x67e8f9,

    sun:
        0xffd166,

    sunLight:
        0xfff0a6,

    co2:
        0xd8b4fe,

    co2Glow:
        0x8b5cf6,

    oxygen:
        0x67e8f9,

    oxygenGlow:
        0x06b6d4,

    glucose:
        0xfacc15,

    glucoseGlow:
        0xeab308,

    chloroplast:
        0x7bea5b,

    chlorophyll:
        0x14532d,

    nucleus:
        0xc084fc,

    skin:
        0xb77958,

    shirt:
        0x3b82f6,

    pants:
        0x1e293b,

    shoe:
        0x111827,

    arrowCO2:
        0xc084fc,

    arrowWater:
        0x38bdf8,

    arrowLight:
        0xffe08a,

    arrowOxygen:
        0x67e8f9,

    arrowGlucose:
        0xfacc15

};


// ============================================================
// PHOTOSYNTHESIS
// ============================================================

export class Photosynthesis {

    constructor() {

        // ----------------------------------------------------
        // MAIN GROUP
        // ----------------------------------------------------

        this.group =
            new THREE.Group();

        this.group.name =
            "Photosynthesis Laboratory";

            this.group.scale.setScalar(
    4.00
);


        // IMPORTANT:
        // Do NOT scale the whole scene.
        // BiologySimulator.fitObject() needs normal
        // world coordinates to frame the scene correctly.


        // ----------------------------------------------------
        // STATE
        // ----------------------------------------------------

        this.selectable =
            [];

        this.time =
            0;

        this.running =
            true;

        this.focused =
            false;

        this.reactionStage =
            "ready";


        // ----------------------------------------------------
        // PARTICLES
        // ----------------------------------------------------

        this.waterParticles =
            [];

        this.co2Particles =
            [];

        this.oxygenParticles =
            [];

        this.glucoseParticles =
            [];

        this.reactionParticles =
            [];


        // ----------------------------------------------------
        // OBJECT COLLECTIONS
        // ----------------------------------------------------

        this.sunRays =
            [];

        this.leaves =
            [];

        this.chloroplastObjects =
            [];

        this.flowArrows =
            [];

        this.waterArrows =
            [];

        this.co2Arrows =
            [];

        this.oxygenArrows =
            [];

        this.lightArrows =
            [];


        // ----------------------------------------------------
        // IMPORTANT REFERENCES
        // ----------------------------------------------------

        this.sun =
            null;

        this.person =
            null;

        this.tree =
            null;

        this.rootGroup =
            null;

        this.focusGroup =
            null;

        this.leafFocus =
            null;


        // ----------------------------------------------------
        // BUILD SCENE
        // ----------------------------------------------------

        this.createWorld();

    }


    // ========================================================
    // WORLD
    // ========================================================

    createWorld() {

        this.createGround();

        this.createLake();

        this.createTree();

        this.createPerson();

        this.createSun();

        this.createWaterTransport();

        this.createCarbonDioxide();

        this.createLeafFocus();

        this.createReactionParticles();

        this.createOxygen();

        this.createGlucose();

        this.createFlowArrows();

    }


    // ========================================================
    // GROUND
    // ========================================================

    createGround() {

        const ground =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    10.5,
                    11.0,
                    0.8,
                    64
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        COLORS.soil,

                    roughness:
                        0.92

                })

            );


        ground.position.set(
            0,
            -4.75,
            0
        );


        ground.name =
            "Soil";


        ground.userData = {

            name:
                "Soil",

            type:
                "environment",

            description:
                "Soil contains water and mineral ions that plant roots absorb.",

            teacher:
                "Roots absorb water and minerals from the soil. Water is transported upward through xylem tissue."

        };


        this.group.add(
            ground
        );


        this.selectable.push(
            ground
        );


        // ----------------------------------------------------
        // SOIL TOP
        // ----------------------------------------------------

        const soilTop =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    10.5,
                    10.5,
                    0.18,
                    64
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        COLORS.soilLight,

                    roughness:
                        1.0

                })

            );


        soilTop.position.y =
            -4.31;


        this.group.add(
            soilTop
        );


        // ----------------------------------------------------
        // SMALL ROCKS
        // ----------------------------------------------------

        for (
            let i = 0;
            i < 18;
            i++
        ) {

            const rock =
                new THREE.Mesh(

                    new THREE.DodecahedronGeometry(
                        0.08 +
                        Math.random() *
                        0.12,
                        0
                    ),

                    new THREE.MeshStandardMaterial({

                        color:
                            0x3f2a20,

                        roughness:
                            1

                    })

                );


            const angle =
                Math.random() *
                Math.PI *
                2;


            const radius =
                2 +
                Math.random() *
                7;


            rock.position.set(

                Math.cos(angle) *
                radius,

                -4.17,

                Math.sin(angle) *
                radius

            );


            this.group.add(
                rock
            );

        }

    }


    // ========================================================
    // LAKE
    // ========================================================

    createLake() {

        const lakeGroup =
            new THREE.Group();


        lakeGroup.position.set(
            -7.2,
            0,
            1.1
        );


        lakeGroup.name =
            "Lake";


        lakeGroup.userData = {

            name:
                "Lake",

            type:
                "water-source",

            description:
                "Water from the environment can be absorbed by plant roots and transported to leaves.",

            teacher:
                "Roots absorb water from the surrounding environment. Xylem carries water toward the leaves."

        };


        // ----------------------------------------------------
        // MAIN WATER
        // ----------------------------------------------------

        const lake =
            new THREE.Mesh(

                new THREE.CircleGeometry(
                    3.5,
                    64
                ),

                new THREE.MeshPhysicalMaterial({

                    color:
                        COLORS.water,

                    transparent:
                        true,

                    opacity:
                        0.9,

                    roughness:
                        0.08,

                    metalness:
                        0.02,

                    transmission:
                        0.08

                })

            );


        lake.rotation.x =
            -Math.PI / 2;


        lake.position.y =
            0.58;


        lake.scale.set(
            1.25,
            0.80,
            1
        );


        lake.name =
            "Lake Water";


        lake.userData = {

            name:
                "Lake Water",

            type:
                "water-source",

            description:
                "Water is an essential reactant in photosynthesis and is transported to leaves through the plant.",

            teacher:
                "Water reaches the leaf through the xylem system."

        };


        lakeGroup.add(
            lake
        );


        this.selectable.push(
            lake
        );


        // ----------------------------------------------------
        // INNER HIGHLIGHT
        // ----------------------------------------------------

        const highlight =
            new THREE.Mesh(

                new THREE.CircleGeometry(
                    2.7,
                    64
                ),

                new THREE.MeshBasicMaterial({

                    color:
                        COLORS.waterLight,

                    transparent:
                        true,

                    opacity:
                        0.09

                })

            );


        highlight.rotation.x =
            -Math.PI / 2;


        highlight.position.y =
            0.61;


        lakeGroup.add(
            highlight
        );


        // ----------------------------------------------------
        // WATER RIPPLES
        // ----------------------------------------------------

        for (
            let i = 0;
            i < 5;
            i++
        ) {

            const ring =
                new THREE.Mesh(

                    new THREE.RingGeometry(
                        0.6 +
                        i * 0.48,

                        0.65 +
                        i * 0.48,

                        64
                    ),

                    new THREE.MeshBasicMaterial({

                        color:
                            COLORS.waterLight,

                        transparent:
                            true,

                        opacity:
                            0.10

                    })

                );


            ring.rotation.x =
                -Math.PI / 2;


            ring.position.y =
                0.63;


            lakeGroup.add(
                ring
            );

        }


        this.group.add(
            lakeGroup
        );


        this.lakeGroup =
            lakeGroup;

    }


    // ========================================================
    // TREE
    // ========================================================

    createTree() {

        this.tree =
            new THREE.Group();


        this.tree.name =
            "Tree";


        // ----------------------------------------------------
        // TRUNK
        // ----------------------------------------------------

        const trunk =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.75,
                    1.15,
                    8.5,
                    32
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        COLORS.trunk,

                    roughness:
                        0.88

                })

            );


        trunk.position.set(
            0,
            -0.05,
            0
        );


        trunk.name =
            "Tree Trunk";


        trunk.userData = {

            name:
                "Tree Trunk",

            type:
                "plant-structure",

            description:
                "The trunk supports the tree and transports water and sugars.",

            teacher:
                "Xylem transports water upward, while phloem distributes sugars through the plant."

        };


        this.tree.add(
            trunk
        );


        this.selectable.push(
            trunk
        );


        // ----------------------------------------------------
        // ROOTS
        // ----------------------------------------------------

        this.rootGroup =
            new THREE.Group();


        this.rootGroup.name =
            "Roots";


        this.rootGroup.userData = {

            name:
                "Roots",

            type:
                "plant-structure",

            description:
                "Roots absorb water and mineral ions from the soil.",

            teacher:
                "Water enters through the roots before being transported upward through xylem."

        };


        const rootPositions = [

            [-1.0, -3.75, 0.0, -0.35],
            [0.9, -3.75, 0.1, 0.35],
            [-1.6, -3.65, 0.4, -0.55],
            [1.5, -3.65, -0.3, 0.55],
            [0.0, -3.7, -0.8, 0.0]

        ];


        rootPositions.forEach(
            data => {

                const root =
                    new THREE.Mesh(

                        new THREE.CylinderGeometry(
                            0.08,
                            0.18,
                            2.6,
                            12
                        ),

                        new THREE.MeshStandardMaterial({

                            color:
                                COLORS.branch,

                            roughness:
                                0.95

                        })

                    );


                root.position.set(
                    data[0],
                    data[1],
                    data[2]
                );


                root.rotation.z =
                    data[3];


                root.name =
                    "Root";


                root.userData = {

                    name:
                        "Root",

                    type:
                        "plant-structure",

                    description:
                        "Roots absorb water and minerals from the soil.",

                    teacher:
                        "Root tissues take up water which then enters the xylem."

                };


                this.rootGroup.add(
                    root
                );


                this.selectable.push(
                    root
                );

            }
        );


        this.tree.add(
            this.rootGroup
        );


        // ----------------------------------------------------
        // BRANCHES
        // ----------------------------------------------------

        this.createBranch(
            -1.2,
            2.1,
            0,
            -0.55,
            3.3
        );


        this.createBranch(
            1.2,
            2.3,
            0,
            0.55,
            3.3
        );


        this.createBranch(
            -1.8,
            3.8,
            -0.15,
            -0.72,
            2.7
        );


        this.createBranch(
            1.8,
            3.9,
            0.15,
            0.72,
            2.7
        );


        this.createBranch(
            0,
            4.3,
            0,
            0,
            3.2
        );


        // ----------------------------------------------------
        // MAIN CANOPY
        // ----------------------------------------------------

        const canopy = [

            [-2.8, 4.9, 0.0, 1.65],

            [-1.6, 5.6, 0.2, 1.9],

            [-0.4, 6.1, -0.2, 1.85],

            [0.8, 6.2, 0.1, 2.0],

            [2.0, 5.7, -0.15, 1.8],

            [3.0, 5.0, 0.1, 1.65],

            [-2.4, 5.8, -0.7, 1.45],

            [2.5, 5.7, 0.7, 1.45],

            [-1.0, 6.6, -0.5, 1.4],

            [0.8, 6.8, 0.35, 1.45]

        ];


        canopy.forEach(
            data => {

                this.createLeafCluster(
                    ...data
                );

            }
        );


        this.group.add(
            this.tree
        );

    }


    // ========================================================
    // BRANCH
    // ========================================================

    createBranch(
        x,
        y,
        z,
        rotationZ,
        length
    ) {

        const branch =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.22,
                    0.42,
                    length,
                    20
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        COLORS.branch,

                    roughness:
                        0.9

                })

            );


        branch.position.set(
            x,
            y,
            z
        );


        branch.rotation.z =
            rotationZ;


        branch.name =
            "Branch";


        branch.userData = {

            name:
                "Branch",

            type:
                "plant-structure",

            description:
                "Branches support leaves and distribute water and sugars.",

            teacher:
                "Branches support leaves where photosynthesis and gas exchange occur."

        };


        this.tree.add(
            branch
        );


        this.selectable.push(
            branch
        );

    }


    // ========================================================
    // LEAF CLUSTER
    // ========================================================

    createLeafCluster(
        x,
        y,
        z,
        scale = 1
    ) {

        const cluster =
            new THREE.Group();


        cluster.position.set(
            x,
            y,
            z
        );


        cluster.scale.setScalar(
            scale
        );


        cluster.name =
            "Leaf Cluster";


        cluster.userData = {

            name:
                "Leaf Cluster",

            type:
                "leaf",

            description:
                "Leaves are major sites of photosynthesis and gas exchange.",

            teacher:
                "Leaves contain chloroplast-rich cells where carbon dioxide, water and light energy are used."

        };


        for (
            let i = 0;
            i < 9;
            i++
        ) {

            const leaf =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.72,
                        20,
                        14
                    ),

                    new THREE.MeshStandardMaterial({

                        color:
                            i % 3 === 0
                                ? COLORS.leafLight
                                : i % 3 === 1
                                    ? COLORS.leaf
                                    : COLORS.leafDark,

                        roughness:
                            0.68

                    })

                );


            const angle =
                (
                    i /
                    9
                ) *
                Math.PI *
                2;


            const radius =
                0.72 +
                (
                    i %
                    2
                ) *
                0.12;


            leaf.position.set(

                Math.cos(angle) *
                radius,

                (
                    i % 3 -
                    1
                ) *
                0.18,

                Math.sin(angle) *
                radius

            );


            leaf.scale.set(
                1.6,
                0.46,
                0.9
            );


            leaf.rotation.y =
                angle;


            leaf.rotation.z =
                Math.sin(angle) *
                0.22;


            leaf.name =
                "Leaf";


            leaf.userData = {

                name:
                    "Leaf",

                type:
                    "leaf",

                description:
                    "Leaves contain chloroplasts where photosynthesis occurs.",

                teacher:
                    "Carbon dioxide enters the leaf through stomata while chloroplasts absorb light energy."

            };


            cluster.add(
                leaf
            );


            this.selectable.push(
                leaf
            );


            this.leaves.push(
                leaf
            );

        }


        this.tree.add(
            cluster
        );

    }


    // ========================================================
    // PERSON
    // ========================================================

    createPerson() {

        const person =
            new THREE.Group();


        person.position.set(
            7.0,
            -3.1,
            1.8
        );


        person.name =
            "Person";


        person.userData = {

            name:
                "Person",

            type:
                "carbon-dioxide-source",

            description:
                "A person releases carbon dioxide when exhaling.",

            teacher:
                "Humans release carbon dioxide during respiration. Plants can use atmospheric CO₂ during photosynthesis."

        };


        // ----------------------------------------------------
        // HEAD
        // ----------------------------------------------------

        const head =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.55,
                    24,
                    18
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        COLORS.skin,

                    roughness:
                        0.82

                })

            );


        head.position.y =
            1.95;


        person.add(
            head
        );


        // ----------------------------------------------------
        // BODY
        // ----------------------------------------------------

        const body =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.6,
                    0.72,
                    1.7,
                    24
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        COLORS.shirt,

                    roughness:
                        0.72

                })

            );


        body.position.y =
            0.6;


        person.add(
            body
        );


        // ----------------------------------------------------
        // LEGS
        // ----------------------------------------------------

        const legLeft =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.2,
                    0.24,
                    1.35,
                    16
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        COLORS.pants

                })

            );


        legLeft.position.set(
            -0.28,
            -0.85,
            0
        );


        person.add(
            legLeft
        );


        const legRight =
            legLeft.clone();


        legRight.position.x =
            0.28;


        person.add(
            legRight
        );


        // ----------------------------------------------------
        // SHOES
        // ----------------------------------------------------

        const shoeLeft =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.22,
                    16,
                    12
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        COLORS.shoe

                })

            );


        shoeLeft.scale.set(
            1.2,
            0.55,
            1.5
        );


        shoeLeft.position.set(
            -0.28,
            -1.56,
            0.18
        );


        person.add(
            shoeLeft
        );


        const shoeRight =
            shoeLeft.clone();


        shoeRight.position.x =
            0.28;


        person.add(
            shoeRight
        );


        // ----------------------------------------------------
        // ARMS
        // ----------------------------------------------------

        const armLeft =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.16,
                    0.18,
                    1.25,
                    16
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        COLORS.shirt

                })

            );


        armLeft.rotation.z =
            -0.5;


        armLeft.position.set(
            -0.78,
            0.75,
            0
        );


        person.add(
            armLeft
        );


        const armRight =
            armLeft.clone();


        armRight.rotation.z =
            0.5;


        armRight.position.x =
            0.78;


        person.add(
            armRight
        );


        this.group.add(
            person
        );


        this.selectable.push(
            person
        );


        this.person =
            person;


        // ----------------------------------------------------
        // EXHALED CO2 PARTICLES
        // ----------------------------------------------------

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const particle =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.13,
                        14,
                        10
                    ),

                    new THREE.MeshStandardMaterial({

                        color:
                            COLORS.co2,

                        emissive:
                            COLORS.co2Glow,

                        emissiveIntensity:
                            0.4

                    })

                );


            particle.position.set(

                6.15 -
                Math.random() *
                0.7,

                1.15 +
                Math.random() *
                0.8,

                (
                    Math.random() -
                    0.5
                ) *
                0.6

            );


            particle.userData = {

                name:
                    "Exhaled Carbon Dioxide",

                type:
                    "input",

                description:
                    "Carbon dioxide released by the person can enter the plant through the leaves.",

                teacher:
                    "CO₂ is an essential reactant used to build glucose."

            };


            this.group.add(
                particle
            );


            this.co2Particles.push(
                particle
            );

        }

    }


    // ========================================================
    // SUN
    // ========================================================

    createSun() {

        const sunGroup =
            new THREE.Group();


        sunGroup.position.set(
            -7.6,
            7.7,
            -2.5
        );


        sunGroup.name =
            "Sun";


        sunGroup.userData = {

            name:
                "Sunlight",

            type:
                "input",

            description:
                "Sunlight provides the energy required for photosynthesis.",

            teacher:
                "Chlorophyll captures light energy from the Sun."

        };


        // ----------------------------------------------------
        // CORE
        // ----------------------------------------------------

        const core =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    1.15,
                    32,
                    20
                ),

                new THREE.MeshBasicMaterial({

                    color:
                        COLORS.sun

                })

            );


        core.name =
            "Sun Core";


        sunGroup.add(
            core
        );


        this.selectable.push(
            sunGroup
        );


        // ----------------------------------------------------
        // SUN RAYS
        // ----------------------------------------------------

        for (
            let i = 0;
            i < 16;
            i++
        ) {

            const ray =
                new THREE.Mesh(

                    new THREE.CylinderGeometry(
                        0.055,
                        0.055,
                        1.75,
                        8
                    ),

                    new THREE.MeshBasicMaterial({

                        color:
                            COLORS.sunLight

                    })

                );


            const angle =
                (
                    i /
                    16
                ) *
                Math.PI *
                2;


            ray.position.set(

                Math.cos(angle) *
                1.85,

                Math.sin(angle) *
                1.85,

                0

            );


            ray.rotation.z =
                -angle;


            sunGroup.add(
                ray
            );


            this.sunRays.push(
                ray
            );

        }


        // ----------------------------------------------------
        // GLOW
        // ----------------------------------------------------

        const glow =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    1.65,
                    32,
                    20
                ),

                new THREE.MeshBasicMaterial({

                    color:
                        COLORS.sunLight,

                    transparent:
                        true,

                    opacity:
                        0.12

                })

            );


        sunGroup.add(
            glow
        );


        // ----------------------------------------------------
        // LIGHT
        // ----------------------------------------------------

        const point =
            new THREE.PointLight(
                COLORS.sun,
                5,
                35
            );


        sunGroup.add(
            point
        );


        this.group.add(
            sunGroup
        );


        this.sun =
            sunGroup;

    }


    // ========================================================
    // WATER TRANSPORT
    // ========================================================

    createWaterTransport() {

        for (
            let i = 0;
            i < 16;
            i++
        ) {

            const water =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.105,
                        12,
                        10
                    ),

                    new THREE.MeshStandardMaterial({

                        color:
                            COLORS.waterLight,

                        emissive:
                            0x0369a1,

                        emissiveIntensity:
                            0.3

                    })

                );


            water.position.set(

                (
                    Math.random() -
                    0.5
                ) *
                0.35,

                -3.85 +
                Math.random() *
                7.8,

                (
                    Math.random() -
                    0.5
                ) *
                0.35

            );


            water.name =
                "Water Molecule";


            water.userData = {

                name:
                    "Water",

                type:
                    "input",

                description:
                    "Water travels upward through the plant toward the leaves.",

                teacher:
                    "Water absorbed by roots travels through xylem to photosynthetic tissues."

            };


            this.group.add(
                water
            );


            this.selectable.push(
                water
            );


            this.waterParticles.push(
                water
            );

        }

    }


    // ========================================================
    // CARBON DIOXIDE
    // ========================================================

    createCarbonDioxide() {

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const co2 =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.12,
                        14,
                        10
                    ),

                    new THREE.MeshStandardMaterial({

                        color:
                            COLORS.co2,

                        emissive:
                            COLORS.co2Glow,

                        emissiveIntensity:
                            0.35

                    })

                );


            co2.position.set(

                4.7 +
                Math.random() *
                2.6,

                3.3 +
                Math.random() *
                3.3,

                (
                    Math.random() -
                    0.5
                ) *
                2.8

            );


            co2.name =
                "Carbon Dioxide";


            co2.userData = {

                name:
                    "Carbon Dioxide",

                type:
                    "input",

                description:
                    "Carbon dioxide enters leaves through stomata.",

                teacher:
                    "CO₂ supplies carbon atoms used to build glucose."

            };


            this.group.add(
                co2
            );


            this.selectable.push(
                co2
            );


            this.co2Particles.push(
                co2
            );

        }

    }


    // ========================================================
    // LEAF FOCUS
    // ========================================================

    createLeafFocus() {

        const focus =
            new THREE.Group();


        focus.position.set(
            4.0,
            6.4,
            2.0
        );


        focus.rotation.y =
            -0.35;


        focus.name =
            "Leaf Focus";


        focus.userData = {

            name:
                "Leaf Focus",

            type:
                "focus-leaf",

            description:
                "A close-up model of a leaf and its chloroplasts.",

            teacher:
                "This enlarged leaf helps visualize where photosynthesis occurs."

        };


        // ----------------------------------------------------
        // OUTER LEAF
        // ----------------------------------------------------

        const leaf =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    1.3,
                    32,
                    22
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        COLORS.leafLight,

                    roughness:
                        0.6

                })

            );


        leaf.scale.set(
            1.75,
            0.38,
            1.15
        );


        leaf.rotation.z =
            -0.18;


        leaf.name =
            "Photosynthesis Leaf";


        leaf.userData = {

            name:
                "Photosynthesis Leaf",

            type:
                "focus-leaf",

            description:
                "This enlarged leaf contains chloroplasts where photosynthesis takes place.",

            teacher:
                "Click or focus on the leaf to observe chloroplasts and the photosynthetic reaction."

        };


        focus.add(
            leaf
        );


        this.selectable.push(
            leaf
        );


        // ----------------------------------------------------
        // MIDRIB
        // ----------------------------------------------------

        const midrib =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.045,
                    0.045,
                    3.7,
                    12
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0x166534

                })

            );


        midrib.rotation.z =
            Math.PI / 2;


        midrib.position.z =
            0.15;


        focus.add(
            midrib
        );


        // ----------------------------------------------------
        // CHLOROPLASTS
        // ----------------------------------------------------

        const chloroplastPositions = [

            [-0.80, 0.04, 0.25],

            [-0.40, -0.08, 0.45],

            [0.0, 0.10, 0.38],

            [0.45, -0.05, 0.35],

            [0.82, 0.08, 0.20],

            [-0.15, 0.04, -0.40]

        ];


        chloroplastPositions.forEach(
            position => {

                const chloroplast =
                    this.createChloroplast();


                chloroplast.position.set(
                    ...position
                );


                focus.add(
                    chloroplast
                );


                this.selectable.push(
                    chloroplast
                );


                this.chloroplastObjects.push(
                    chloroplast
                );

            }
        );


        // ----------------------------------------------------
        // FOCUS RING
        // ----------------------------------------------------

        const border =
            new THREE.Mesh(

                new THREE.RingGeometry(
                    2.0,
                    2.06,
                    64
                ),

                new THREE.MeshBasicMaterial({

                    color:
                        COLORS.oxygen,

                    transparent:
                        true,

                    opacity:
                        0.28,

                    side:
                        THREE.DoubleSide

                })

            );


        border.rotation.x =
            Math.PI / 2;


        border.position.y =
            0.03;


        focus.add(
            border
        );


        this.group.add(
            focus
        );


        this.focusGroup =
            focus;


        this.leafFocus =
            leaf;

    }


    // ========================================================
    // CHLOROPLAST
    // ========================================================

    createChloroplast() {

        const group =
            new THREE.Group();


        group.name =
            "Chloroplast";


        group.userData = {

            name:
                "Chloroplast",

            type:
                "chloroplast",

            description:
                "Chloroplasts contain chlorophyll and are the main site of photosynthesis.",

            teacher:
                "Light energy, carbon dioxide and water are used inside chloroplasts to produce glucose and oxygen."

        };


        const body =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.28,
                    18,
                    12
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        COLORS.chloroplast,

                    emissive:
                        COLORS.chlorophyll,

                    emissiveIntensity:
                        0.4

                })

            );


        body.scale.set(
            1.65,
            0.65,
            0.65
        );


        group.add(
            body
        );


        // ----------------------------------------------------
        // THYLAKOID DISCS
        // ----------------------------------------------------

        for (
            let i = -2;
            i <= 2;
            i++
        ) {

            const disc =
                new THREE.Mesh(

                    new THREE.CylinderGeometry(
                        0.10,
                        0.10,
                        0.035,
                        16
                    ),

                    new THREE.MeshStandardMaterial({

                        color:
                            COLORS.chlorophyll,

                        roughness:
                            0.55

                    })

                );


            disc.rotation.z =
                Math.PI / 2;


            disc.position.y =
                i * 0.08;


            group.add(
                disc
            );

        }


        return group;

    }


    // ========================================================
    // REACTION PARTICLES
    // ========================================================

    createReactionParticles() {

        for (
            let i = 0;
            i < 24;
            i++
        ) {

            const particle =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.055,
                        10,
                        8
                    ),

                    new THREE.MeshBasicMaterial({

                        color:
                            0xffffff,

                        transparent:
                            true,

                        opacity:
                            0.78

                    })

                );


            particle.visible =
                false;


            this.group.add(
                particle
            );


            this.reactionParticles.push(
                particle
            );

        }

    }


    // ========================================================
    // OXYGEN
    // ========================================================

    createOxygen() {

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const oxygen =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.13,
                        14,
                        10
                    ),

                    new THREE.MeshStandardMaterial({

                        color:
                            COLORS.oxygen,

                        emissive:
                            COLORS.oxygenGlow,

                        emissiveIntensity:
                            0.4

                    })

                );


            oxygen.position.set(

                1.0 +
                Math.random() *
                2.2,

                4.4 +
                Math.random() *
                2.5,

                (
                    Math.random() -
                    0.5
                ) *
                2

            );


            oxygen.name =
                "Oxygen";


            oxygen.userData = {

                name:
                    "Oxygen",

                type:
                    "product",

                description:
                    "Oxygen is produced during photosynthesis and released into the atmosphere.",

                teacher:
                    "Oxygen formed during photosynthesis can diffuse out of the leaf."

            };


            this.group.add(
                oxygen
            );


            this.selectable.push(
                oxygen
            );


            this.oxygenParticles.push(
                oxygen
            );

        }

    }


    // ========================================================
    // GLUCOSE
    // ========================================================

    createGlucose() {

        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const glucose =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.15,
                        14,
                        10
                    ),

                    new THREE.MeshStandardMaterial({

                        color:
                            COLORS.glucose,

                        emissive:
                            COLORS.glucoseGlow,

                        emissiveIntensity:
                            0.3

                    })

                );


            glucose.position.set(

                0.6 +
                Math.random() *
                1.8,

                4.2 +
                Math.random() *
                1.6,

                (
                    Math.random() -
                    0.5
                ) *
                1.4

            );


            glucose.name =
                "Glucose";


            glucose.userData = {

                name:
                    "Glucose",

                type:
                    "product",

                description:
                    "Glucose is a sugar produced by photosynthesis and stores chemical energy.",

                teacher:
                    "Plants use glucose for respiration, growth, transport and storage."

            };


            this.group.add(
                glucose
            );


            this.selectable.push(
                glucose
            );


            this.glucoseParticles.push(
                glucose
            );

        }

    }


    // ========================================================
    // FLOW ARROWS
    // ========================================================

    createFlowArrows() {

        // ----------------------------------------------------
        // WATER ARROW
        // Lake -> Roots
        // ----------------------------------------------------

        this.createArrow(

            new THREE.Vector3(
                -5.0,
                -3.6,
                1.1
            ),

            new THREE.Vector3(
                -1.1,
                -3.35,
                0
            ),

            COLORS.arrowWater,

            this.waterArrows,

            "Water Flow"

        );


        this.createArrow(

            new THREE.Vector3(
                -0.4,
                -3.0,
                0
            ),

            new THREE.Vector3(
                0.0,
                3.7,
                0
            ),

            COLORS.arrowWater,

            this.waterArrows,

            "Water Transport"

        );


        // ----------------------------------------------------
        // CO2 ARROWS
        // Person -> Leaves
        // ----------------------------------------------------

        this.createArrow(

            new THREE.Vector3(
                5.8,
                1.9,
                1.8
            ),

            new THREE.Vector3(
                2.8,
                4.7,
                1.0
            ),

            COLORS.arrowCO2,

            this.co2Arrows,

            "CO₂"

        );


        this.createArrow(

            new THREE.Vector3(
                4.6,
                4.3,
                1.0
            ),

            new THREE.Vector3(
                1.5,
                5.7,
                0.5
            ),

            COLORS.arrowCO2,

            this.co2Arrows,

            "CO₂"

        );


        // ----------------------------------------------------
        // SUNLIGHT ARROW
        // Sun -> Leaf
        // ----------------------------------------------------

        this.createArrow(

            new THREE.Vector3(
                -6.6,
                6.8,
                -1.8
            ),

            new THREE.Vector3(
                -0.8,
                6.0,
                0
            ),

            COLORS.arrowLight,

            this.lightArrows,

            "Light Energy"

        );


        // ----------------------------------------------------
        // OXYGEN
        // Leaf -> Atmosphere
        // ----------------------------------------------------

        this.createArrow(

            new THREE.Vector3(
                1.5,
                6.2,
                0.8
            ),

            new THREE.Vector3(
                2.8,
                8.1,
                1.0
            ),

            COLORS.arrowOxygen,

            this.oxygenArrows,

            "O₂"

        );


        // ----------------------------------------------------
        // GLUCOSE
        // Leaf -> Plant
        // ----------------------------------------------------

        this.createArrow(

            new THREE.Vector3(
                1.8,
                5.9,
                -0.2
            ),

            new THREE.Vector3(
                0.7,
                3.6,
                0
            ),

            COLORS.arrowGlucose,

            this.flowArrows,

            "Glucose"

        );

    }


    // ========================================================
    // CREATE ARROW
    // ========================================================

    createArrow(
        start,
        end,
        color,
        collection,
        name
    ) {

        const direction =
            new THREE.Vector3()
                .subVectors(
                    end,
                    start
                );


        const length =
            direction.length();


        if (
            length <=
            0.01
        ) {

            return;

        }


        direction.normalize();


        const arrow =
            new THREE.ArrowHelper(

                direction,

                start,

                length,

                color,

                Math.min(
                    0.5,
                    length * 0.12
                ),

                Math.min(
                    0.22,
                    length * 0.05
                )

            );


        arrow.name =
            name;


        arrow.userData = {

            name,

            type:
                "transport-arrow",

            description:
                `The arrow shows the direction of ${name.toLowerCase()}.`

        };


        this.group.add(
            arrow
        );


        collection.push(
            arrow
        );

        this.flowArrows.push(
            arrow
        );

    }


    // ========================================================
    // WATER ANIMATION
    // ========================================================

    updateWater(delta) {

    this.waterParticles.forEach(
        (particle, index) => {

            // ------------------------------------------------
            // LOOP PROGRESS
            // ------------------------------------------------

            let p =
                particle.userData.waterProgress;

            if (
                typeof p !== "number"
            ) {

                p =
                    index /
                    this.waterParticles.length;

            }


            p +=
                delta *
                (
                    0.055 +
                    (
                        index % 4
                    ) *
                    0.006
                );


            if (p > 1) {
                p = 0;
            }


            particle.userData.waterProgress =
                p;


            // ------------------------------------------------
            // WATER PATH
            //
            // 0.00 - 0.18 = LAKE
            // 0.18 - 0.35 = ROOTS
            // 0.35 - 0.78 = XYLEM / TRUNK
            // 0.78 - 1.00 = LEAF
            // ------------------------------------------------

            let position =
                new THREE.Vector3();


            // =================================================
            // LAKE → ROOTS
            // =================================================

            if (p < 0.18) {

                const t =
                    p /
                    0.18;


                const start =
                    new THREE.Vector3(
                        -7.2,
                        -3.75,
                        1.1
                    );


                const end =
                    new THREE.Vector3(
                        -1.0,
                        -3.45,
                        0
                    );


                position.lerpVectors(
                    start,
                    end,
                    t
                );


                // small water wobble

                position.y +=
                    Math.sin(
                        this.time *
                        3 +
                        index
                    ) *
                    0.08;


                position.z +=
                    Math.cos(
                        this.time *
                        2 +
                        index
                    ) *
                    0.08;

            }


            // =================================================
            // ROOTS → TRUNK
            // =================================================

            else if (p < 0.35) {

                const t =
                    (
                        p -
                        0.18
                    ) /
                    0.17;


                const start =
                    new THREE.Vector3(
                        -1.0,
                        -3.45,
                        0
                    );


                const end =
                    new THREE.Vector3(
                        0,
                        -2.8,
                        0
                    );


                position.lerpVectors(
                    start,
                    end,
                    t
                );

            }


            // =================================================
            // TRUNK / XYLEM
            // =================================================

            else if (p < 0.78) {

                const t =
                    (
                        p -
                        0.35
                    ) /
                    0.43;


                const start =
                    new THREE.Vector3(
                        0,
                        -2.8,
                        0
                    );


                const end =
                    new THREE.Vector3(
                        0.15,
                        4.5,
                        0
                    );


                position.lerpVectors(
                    start,
                    end,
                    t
                );


                // tiny movement inside xylem

                position.x +=
                    Math.sin(
                        this.time *
                        4 +
                        index
                    ) *
                    0.05;


                position.z +=
                    Math.cos(
                        this.time *
                        3 +
                        index
                    ) *
                    0.05;

            }


            // =================================================
            // TRUNK → LEAF
            // =================================================

            else {

                const t =
                    (
                        p -
                        0.78
                    ) /
                    0.22;


                const start =
                    new THREE.Vector3(
                        0.15,
                        4.5,
                        0
                    );


                const end =
                    new THREE.Vector3(
                        2.2,
                        5.9,
                        0.5
                    );


                position.lerpVectors(
                    start,
                    end,
                    t
                );


                position.x +=
                    Math.sin(
                        this.time *
                        2 +
                        index
                    ) *
                    0.08;


                position.y +=
                    Math.cos(
                        this.time *
                        2 +
                        index
                    ) *
                    0.05;

            }


            // ------------------------------------------------
            // APPLY
            // ------------------------------------------------

            particle.position.copy(
                position
            );

        }
    );

}


    // ========================================================
    // CO2 ANIMATION
    // ========================================================

    updateCO2(
        delta
    ) {

        this.co2Particles.forEach(
            (
                particle,
                index
            ) => {

                particle.position.x -=
                    delta *
                    (
                        0.32 +
                        (
                            index %
                            3
                        ) *
                        0.09
                    );


                particle.position.y +=
                    Math.sin(
                        this.time *
                        1.2 +
                        index
                    ) *
                    delta *
                    0.16;


                particle.position.z +=
                    Math.cos(
                        this.time *
                        0.7 +
                        index
                    ) *
                    delta *
                    0.04;


                if (
                    particle.position.x <
                    1.1
                ) {

                    particle.position.x =
                        6.8;


                    particle.position.y =
                        2.2 +
                        Math.random() *
                        4.2;


                    particle.position.z =
                        (
                            Math.random() -
                            0.5
                        ) *
                        2.5;

                }

            }
        );

    }


    // ========================================================
    // PRODUCT ANIMATION
    // ========================================================

    updateProducts(
        delta
    ) {

        this.oxygenParticles.forEach(
            (
                particle,
                index
            ) => {

                particle.position.y +=
                    delta *
                    (
                        0.28 +
                        (
                            index %
                            3
                        ) *
                        0.05
                    );


                particle.position.x +=
                    Math.sin(
                        this.time +
                        index
                    ) *
                    delta *
                    0.12;


                if (
                    particle.position.y >
                    8.5
                ) {

                    particle.position.y =
                        4.2;

                    particle.position.x =
                        1.0 +
                        Math.random() *
                        2.2;

                }

            }
        );


        this.glucoseParticles.forEach(
            (
                particle,
                index
            ) => {

                particle.position.y -=
                    delta *
                    0.10;


                particle.position.x +=
                    Math.sin(
                        this.time *
                        0.8 +
                        index
                    ) *
                    delta *
                    0.06;

            }
        );

    }


    // ========================================================
    // SUN ANIMATION
    // ========================================================

    updateSun(
        delta
    ) {

        if (!this.sun) {
            return;
        }


        this.sun.rotation.z +=
            delta *
            0.14;


        this.sunRays.forEach(
            (
                ray,
                index
            ) => {

                ray.scale.y =
                    0.88 +
                    Math.sin(
                        this.time *
                        2.0 +
                        index
                    ) *
                    0.10;

            }
        );

    }


    // ========================================================
    // LEAF ANIMATION
    // ========================================================

    updateLeaves() {

        this.leaves.forEach(
            (
                leaf,
                index
            ) => {

                const sway =
                    Math.sin(
                        this.time *
                        1.2 +
                        index *
                        0.3
                    ) *
                    0.018;


                leaf.rotation.z =
                    sway;

            }
        );

    }


    // ========================================================
    // CHLOROPLAST ANIMATION
    // ========================================================

    updateChloroplasts() {

        const pulse =
            1 +
            Math.sin(
                this.time *
                4.0
            ) *
            0.10;


        this.chloroplastObjects.forEach(
            chloroplast => {

                chloroplast.scale.setScalar(
                    pulse
                );

            }
        );

    }


    // ========================================================
    // REACTION ANIMATION
    // ========================================================

    updateReactionParticles() {

        const active =
            this.focused;


        this.reactionParticles.forEach(
            (
                particle,
                index
            ) => {

                particle.visible =
                    active;


                if (!active) {
                    return;
                }


                const angle =
                    this.time *
                    2.4 +
                    index *
                    0.58;


                const radius =
                    0.18 +
                    (
                        index %
                        6
                    ) *
                    0.07;


                const center =
                    this.focusGroup
                        ?.position;


                if (!center) {
                    return;
                }


                particle.position.set(

                    center.x +
                    Math.cos(angle) *
                    radius,

                    center.y +
                    Math.sin(angle) *
                    radius,

                    center.z +
                    Math.sin(
                        angle *
                        1.7
                    ) *
                    radius

                );

            }
        );

    }


    // ========================================================
    // ARROW PULSE
    // ========================================================

    updateArrows() {

        const all =
            [

                ...this.waterArrows,

                ...this.co2Arrows,

                ...this.lightArrows,

                ...this.oxygenArrows,

                ...this.flowArrows

            ];


        all.forEach(
            (
                arrow,
                index
            ) => {

                const pulse =
                    1 +
                    Math.sin(
                        this.time *
                        2.5 +
                        index
                    ) *
                    0.06;


                arrow.scale.set(
                    pulse,
                    pulse,
                    pulse
                );

            }
        );

    }


    // ========================================================
    // UPDATE
    // ========================================================

    update(
        delta
    ) {

        if (!this.running) {
            return;
        }


        this.time +=
            delta;


        this.updateWater(
            delta
        );


        this.updateCO2(
            delta
        );


        this.updateProducts(
            delta
        );


        this.updateSun(
            delta
        );


        this.updateLeaves();


        this.updateChloroplasts();


        this.updateReactionParticles();


        this.updateArrows();


        // ----------------------------------------------------
        // FOCUS LEAF MOTION
        // ----------------------------------------------------

        if (
            this.focusGroup
        ) {

            this.focusGroup.rotation.z =
                Math.sin(
                    this.time *
                    0.7
                ) *
                0.02;

        }

    }


    // ========================================================
    // START
    // ========================================================

    start() {

        this.running =
            true;

    }


    // ========================================================
    // PAUSE
    // ========================================================

    pause() {

        this.running =
            false;

    }


    // ========================================================
    // RESET
    // ========================================================

    reset() {

        this.time =
            0;

        this.running =
            true;

        this.focused =
            false;

        this.reactionStage =
            "ready";


        this.reactionParticles.forEach(
            particle => {

                particle.visible =
                    false;

            }
        );

    }


    // ========================================================
    // FOCUS LEAF
    // ========================================================

    focusLeaf() {

        this.focused =
            true;


        this.reactionStage =
            "chloroplast";


        if (
            !this.focusGroup
        ) {

            return null;

        }


        return {

            target:
                this.focusGroup,

            position:
                new THREE.Vector3(
                    8,
                    5.8,
                    9
                )

        };

    }


    // ========================================================
    // GET FOCUS TARGET
    // ========================================================

    getFocusTarget() {

        return (
            this.focusGroup ||
            null
        );

    }


    // ========================================================
    // GET REACTION STAGE
    // ========================================================

    getReactionStage() {

        return this.reactionStage;

    }


    // ========================================================
    // SET FOCUS
    // ========================================================

    setFocused(
        value
    ) {

        this.focused =
            Boolean(
                value
            );


        this.reactionStage =
            this.focused
                ? "chloroplast"
                : "ready";

    }


    // ========================================================
    // GET OBJECT
    // ========================================================

    getObject() {

        return this.group;

    }


    // ========================================================
    // GET SELECTABLE
    // ========================================================

    getSelectableObjects() {

        return this.selectable;

    }


    // ========================================================
    // RESIZE
    // ========================================================

    resize() {

        // BiologySimulator handles camera and renderer resize.

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


        this.waterParticles =
            [];


        this.co2Particles =
            [];


        this.oxygenParticles =
            [];


        this.glucoseParticles =
            [];


        this.reactionParticles =
            [];


        this.leaves =
            [];


        this.chloroplastObjects =
            [];


        this.flowArrows =
            [];


        this.waterArrows =
            [];


        this.co2Arrows =
            [];


        this.oxygenArrows =
            [];


        this.lightArrows =
            [];

    }

}