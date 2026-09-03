// ============================================================
// SciLab - Biology Laboratory
// EnzymeActivity.js
//
// Advanced 3D Enzyme-Substrate Simulation
//
// Concept:
//
//        SUBSTRATE
//             ↓
//        ┌─────────┐
//        │ OPENING │
//        │   ↓     │
//     ┌──┴─────────┴──┐
//     │    ENZYME     │
//     │               │
//     │ ACTIVE SITE   │
//     │    POCKET     │
//     └───────────────┘
//
// Substrate → Active Site → Binding → Catalysis → Products
// ============================================================

import * as THREE from "three";

export class EnzymeActivity {

    constructor() {

        // ========================================================
        // ROOT
        // ========================================================

        this.group =
            new THREE.Group();

        this.group.name =
            "Enzyme Activity";

        // ========================================================
        // STATE
        // ========================================================

        this.running = false;

        this.paused = false;

        this.phase =
            "ready";

        this.phaseTime = 0;

        this.time = 0;

        // ========================================================
        // BIOLOGICAL PARAMETERS
        // ========================================================

        this.temperature = 37;

        this.pH = 7;

        this.substrateConcentration = 60;

        this.enzymeConcentration = 50;

        // ========================================================
        // CALCULATED
        // ========================================================

        this.activity = 0;

        this.reactionRate = 0;

        this.temperatureFactor = 1;

        this.pHFactor = 1;

        this.productFormation = 0;

        // ========================================================
        // OBJECTS
        // ========================================================

        this.enzyme = null;

        this.activeSite = null;

        this.substrate = null;

        this.product1 = null;

        this.product2 = null;

        this.activeSiteOpening = null;

        this.activeSiteInner = null;

        this.activeSiteGlow = null;

        this.activeSiteLabel = null;

        this.selectable = [];

        this.particles = [];

        // ========================================================
        // CONSTANT POSITIONS
        //
        // +Z = FRONT
        // ========================================================

        this.activeSitePosition =
            new THREE.Vector3(
                0,
                0,
                2.05
            );

        // ========================================================
        // BUILD
        // ========================================================

        this.createEnzyme();

        this.createActiveSite();

        this.createSubstrate();

        this.createProducts();

        this.createParticles();

        this.calculateActivity();

        this.reset();
    }

    // ============================================================
    // CREATE ENZYME
    // ============================================================

    createEnzyme() {

        const enzyme =
            new THREE.Group();

        enzyme.name =
            "Enzyme Protein";

        enzyme.userData = {

            type:
                "enzyme",

            name:
                "Enzyme",

            description:
                "A biological catalyst containing a specific active site.",

            function:
                "The enzyme binds its substrate at the active site and facilitates chemical transformation."
        };

        // ========================================================
        // PROTEIN MATERIALS
        // ========================================================

        const mainMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x6651d9,

                roughness:
                    0.42,

                metalness:
                    0.02,

                emissive:
                    0x120b35,

                emissiveIntensity:
                    0.15
            });

        const secondaryMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x4936ad,

                roughness:
                    0.48,

                metalness:
                    0.01,

                emissive:
                    0x0d0828,

                emissiveIntensity:
                    0.10
            });

        // ========================================================
        // IMPORTANT:
        //
        // Instead of putting a solid sphere in front of the
        // active site, we construct the enzyme around the pocket.
        //
        // This leaves a REAL VISIBLE OPENING.
        // ========================================================

        const lobes = [

            // upper left
            {
                x: -1.45,
                y: 1.25,
                z: 0,
                sx: 1.20,
                sy: 1.05,
                sz: 1.00
            },

            // upper center
            {
                x: 0,
                y: 1.55,
                z: 0,
                sx: 1.30,
                sy: 0.90,
                sz: 1.00
            },

            // upper right
            {
                x: 1.45,
                y: 1.25,
                z: 0,
                sx: 1.20,
                sy: 1.05,
                sz: 1.00
            },

            // left
            {
                x: -1.75,
                y: 0,
                z: 0,
                sx: 1.05,
                sy: 1.35,
                sz: 1.00
            },

            // right
            {
                x: 1.75,
                y: 0,
                z: 0,
                sx: 1.05,
                sy: 1.35,
                sz: 1.00
            },

            // lower left
            {
                x: -1.35,
                y: -1.25,
                z: 0,
                sx: 1.20,
                sy: 1.00,
                sz: 1.00
            },

            // lower center
            {
                x: 0,
                y: -1.45,
                z: 0,
                sx: 1.35,
                sy: 0.90,
                sz: 1.00
            },

            // lower right
            {
                x: 1.35,
                y: -1.25,
                z: 0,
                sx: 1.20,
                sy: 1.00,
                sz: 1.00
            }
        ];

        // ========================================================
        // CREATE PROTEIN LOBES
        // ========================================================

        lobes.forEach(
            (data, index) => {

                const geometry =
                    new THREE.SphereGeometry(
                        1.15,
                        32,
                        24
                    );

                const mesh =
                    new THREE.Mesh(
                        geometry,
                        index % 2 === 0
                            ? mainMaterial
                            : secondaryMaterial
                    );

                mesh.position.set(
                    data.x,
                    data.y,
                    data.z
                );

                mesh.scale.set(
                    data.sx,
                    data.sy,
                    data.sz
                );

                enzyme.add(
                    mesh
                );
            }
        );

        // ========================================================
        // BACK PROTEIN MASS
        //
        // It stays behind the active site.
        // ========================================================

        const backGeometry =
            new THREE.SphereGeometry(
                1.65,
                40,
                30
            );

        const back =
            new THREE.Mesh(
                backGeometry,
                secondaryMaterial
            );

        back.position.set(
            0,
            0,
            -0.75
        );

        back.scale.set(
            1.35,
            1.10,
            0.75
        );

        enzyme.add(
            back
        );

        // ========================================================
        // PROTEIN SURFACE DETAILS
        // ========================================================

        for (
            let i = 0;
            i < 16;
            i++
        ) {

            const angle =
                (
                    i /
                    16
                ) *
                Math.PI *
                2;

            const radius =
                2.15;

            const geometry =
                new THREE.SphereGeometry(
                    0.09 +
                    Math.random() *
                    0.07,
                    12,
                    10
                );

            const material =
                new THREE.MeshStandardMaterial({

                    color:
                        0xb4a9ff,

                    roughness:
                        0.35,

                    emissive:
                        0x20164f,

                    emissiveIntensity:
                        0.15
                });

            const detail =
                new THREE.Mesh(
                    geometry,
                    material
                );

            detail.position.set(

                Math.cos(angle) *
                radius,

                Math.sin(angle) *
                radius,

                0.10
            );

            enzyme.add(
                detail
            );
        }

        // ========================================================
        // ENZYME GROUP
        // ========================================================

        this.enzyme =
            enzyme;

        this.group.add(
            enzyme
        );

        this.selectable.push(
            enzyme
        );
    }

    // ============================================================
    // ACTIVE SITE
    // ============================================================

    createActiveSite() {

        const site =
            new THREE.Group();

        site.name =
            "Active Site";

        site.position.copy(
            this.activeSitePosition
        );

        site.userData = {

            type:
                "active-site",

            name:
                "Active Site",

            description:
                "The specific pocket where the substrate binds.",

            function:
                "The active site provides the complementary shape and chemical environment required for substrate binding and catalysis."
        };

        // ========================================================
        // DEEP POCKET
        // ========================================================

        const pocketGeometry =
            new THREE.SphereGeometry(
                0.82,
                48,
                32
            );

        const pocketMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x03151b,

                roughness:
                    0.08,

                metalness:
                    0,

                emissive:
                    0x063b42,

                emissiveIntensity:
                    1.1,

                transparent:
                    true,

                opacity:
                    0.98,

                side:
                    THREE.DoubleSide,

                depthWrite:
                    false
            });

        const pocket =
            new THREE.Mesh(
                pocketGeometry,
                pocketMaterial
            );

        pocket.scale.set(
            1.28,
            0.88,
            0.52
        );

        pocket.position.z =
            0.18;

        site.add(
            pocket
        );

        this.activeSiteInner =
            pocket;

        // ========================================================
        // DEEP INNER CORE
        // ========================================================

        const coreGeometry =
            new THREE.SphereGeometry(
                0.42,
                32,
                24
            );

        const coreMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0x001114,

                transparent:
                    true,

                opacity:
                    0.98,

                depthWrite:
                    false
            });

        const core =
            new THREE.Mesh(
                coreGeometry,
                coreMaterial
            );

        core.scale.set(
            1.45,
            0.80,
            0.35
        );

        core.position.z =
            0.48;

        site.add(
            core
        );

        // ========================================================
        // ACTIVE SITE RIM
        // ========================================================

        const rimGeometry =
            new THREE.TorusGeometry(
                0.76,
                0.115,
                20,
                64
            );

        const rimMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0x38e7c4,

                roughness:
                    0.18,

                emissive:
                    0x0a8d76,

                emissiveIntensity:
                    0.9
            });

        const rim =
            new THREE.Mesh(
                rimGeometry,
                rimMaterial
            );

        rim.rotation.x =
            Math.PI / 2;

        rim.scale.set(
            1.35,
            0.82,
            1
        );

        site.add(
            rim
        );

        // ========================================================
        // OPENING
        //
        // This clearly marks where the substrate enters.
        // ========================================================

        const openingGeometry =
            new THREE.RingGeometry(
                0.48,
                0.70,
                64
            );

        const openingMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0x7dfff0,

                transparent:
                    true,

                opacity:
                    0.42,

                side:
                    THREE.DoubleSide,

                depthWrite:
                    false
            });

        const opening =
            new THREE.Mesh(
                openingGeometry,
                openingMaterial
            );

        opening.rotation.x =
            Math.PI / 2;

        opening.scale.set(
            1.30,
            0.80,
            1
        );

        opening.position.z =
            -0.38;

        site.add(
            opening
        );

        this.activeSiteOpening =
            opening;

        // ========================================================
        // CATALYTIC CENTER
        // ========================================================

        const catalyticGeometry =
            new THREE.SphereGeometry(
                0.15,
                24,
                16
            );

        const catalyticMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0xd9fff8
            });

        const catalytic =
            new THREE.Mesh(
                catalyticGeometry,
                catalyticMaterial
            );

        catalytic.position.set(
            0,
            0,
            0.58
        );

        site.add(
            catalytic
        );

        // ========================================================
        // GLOW
        // ========================================================

        const glowGeometry =
            new THREE.SphereGeometry(
                1.0,
                32,
                24
            );

        const glowMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0x24e8c4,

                transparent:
                    true,

                opacity:
                    0.07,

                depthWrite:
                    false,

                blending:
                    THREE.AdditiveBlending
            });

        const glow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );

        glow.scale.set(
            1.50,
            0.95,
            0.65
        );

        glow.position.z =
            0.05;

        site.add(
            glow
        );

        this.activeSiteGlow =
            glow;

        // ========================================================
        // ADD ACTIVE SITE
        // ========================================================

        this.activeSite =
            site;

        this.group.add(
            site
        );

        this.selectable.push(
            site
        );
    }

    // ============================================================
    // SUBSTRATE
    // ============================================================

    createSubstrate() {

        const substrate =
            new THREE.Group();

        substrate.name =
            "Substrate";

        substrate.userData = {

            type:
                "substrate",

            name:
                "Substrate",

            description:
                "A molecule with a complementary shape that binds to the enzyme active site."
        };

        // ========================================================
        // MAIN BODY
        // ========================================================

        const bodyGeometry =
            new THREE.SphereGeometry(
                0.43,
                32,
                24
            );

        const bodyMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0xffc928,

                roughness:
                    0.24,

                metalness:
                    0.02,

                emissive:
                    0x4f3600,

                emissiveIntensity:
                    0.16
            });

        const body =
            new THREE.Mesh(
                bodyGeometry,
                bodyMaterial
            );

        body.scale.set(
            1.25,
            0.82,
            0.90
        );

        substrate.add(
            body
        );

        // ========================================================
        // BINDING HEAD
        // ========================================================

        const headGeometry =
            new THREE.CapsuleGeometry(
                0.30,
                0.55,
                8,
                20
            );

        const headMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0xffe16a,

                roughness:
                    0.20,

                emissive:
                    0x654800,

                emissiveIntensity:
                    0.15
            });

        const head =
            new THREE.Mesh(
                headGeometry,
                headMaterial
            );

        head.rotation.x =
            Math.PI / 2;

        head.position.z =
            0.50;

        head.scale.set(
            0.95,
            0.95,
            0.85
        );

        substrate.add(
            head
        );

        // ========================================================
        // CHEMICAL GROUPS
        // ========================================================

        const groupMaterial =
            new THREE.MeshStandardMaterial({

                color:
                    0xfff4b2,

                roughness:
                    0.18,

                emissive:
                    0x554200,

                emissiveIntensity:
                    0.10
            });

        const positions = [

            [-0.30, 0.30, 0],

            [0.30, -0.30, 0],

            [-0.15, -0.40, 0.10]
        ];

        positions.forEach(
            position => {

                const geometry =
                    new THREE.SphereGeometry(
                        0.13,
                        18,
                        14
                    );

                const atom =
                    new THREE.Mesh(
                        geometry,
                        groupMaterial.clone()
                    );

                atom.position.set(
                    position[0],
                    position[1],
                    position[2]
                );

                substrate.add(
                    atom
                );
            }
        );

        // ========================================================
        // START POSITION
        //
        // SUBSTRATE STARTS IN FRONT OF CAMERA / ENZYME.
        // ========================================================

        substrate.position.set(
            0,
            0,
            6.0
        );

        this.substrate =
            substrate;

        this.group.add(
            substrate
        );

        this.selectable.push(
            substrate
        );
    }

    // ============================================================
    // PRODUCTS
    // ============================================================

    createProducts() {

        this.product1 =
            this.createProduct(
                "Product 1",
                0x49e58c
            );

        this.product2 =
            this.createProduct(
                "Product 2",
                0x4aa9ff
            );

        this.product1.visible =
            false;

        this.product2.visible =
            false;

        this.product1.position.set(
            0,
            1.4,
            2.0
        );

        this.product2.position.set(
            0,
            -1.4,
            2.0
        );

        this.group.add(
            this.product1,
            this.product2
        );

        this.selectable.push(
            this.product1,
            this.product2
        );
    }

    // ============================================================
    // PRODUCT CREATOR
    // ============================================================

    createProduct(
        name,
        color
    ) {

        const product =
            new THREE.Group();

        product.name =
            name;

        product.userData = {

            type:
                "product",

            name:
                name,

            description:
                "A molecule produced after enzymatic catalysis."
        };

        const material =
            new THREE.MeshStandardMaterial({

                color:
                    color,

                roughness:
                    0.25,

                emissive:
                    color,

                emissiveIntensity:
                    0.12
            });

        const mainGeometry =
            new THREE.SphereGeometry(
                0.36,
                28,
                20
            );

        const main =
            new THREE.Mesh(
                mainGeometry,
                material
            );

        product.add(
            main
        );

        const smallGeometry =
            new THREE.SphereGeometry(
                0.17,
                20,
                16
            );

        const small =
            new THREE.Mesh(
                smallGeometry,
                material.clone()
            );

        small.position.set(
            0.35,
            0.22,
            0
        );

        product.add(
            small
        );

        return product;
    }

    // ============================================================
    // PARTICLES
    // ============================================================

    createParticles() {

        for (
            let i = 0;
            i < 32;
            i++
        ) {

            const geometry =
                new THREE.SphereGeometry(
                    0.025 +
                    Math.random() * 0.035,
                    8,
                    8
                );

            const material =
                new THREE.MeshBasicMaterial({

                    color:
                        0x70ffe6,

                    transparent:
                        true,

                    opacity:
                        0.70,

                    depthWrite:
                        false
                });

            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                );

            particle.visible =
                false;

            particle.userData = {

                angle:
                    Math.random() *
                    Math.PI *
                    2,

                radius:
                    0.25 +
                    Math.random() *
                    0.75,

                speed:
                    0.7 +
                    Math.random() *
                    1.4,

                phase:
                    Math.random() *
                    Math.PI *
                    2
            };

            this.group.add(
                particle
            );

            this.particles.push(
                particle
            );
        }
    }

    // ============================================================
    // ACTIVITY CALCULATION
    // ============================================================

    calculateActivity() {

        // --------------------------------------------------------
        // TEMPERATURE
        // Optimal temperature = 37 C
        // --------------------------------------------------------

        const temperatureDistance =
            Math.abs(
                this.temperature -
                37
            );

        this.temperatureFactor =
            Math.exp(
                -(
                    temperatureDistance *
                    temperatureDistance
                ) /
                (
                    2 *
                    16 *
                    16
                )
            );

        // --------------------------------------------------------
        // pH
        // Optimal pH = 7
        // --------------------------------------------------------

        const pHDistance =
            Math.abs(
                this.pH -
                7
            );

        this.pHFactor =
            Math.exp(
                -(
                    pHDistance *
                    pHDistance
                ) /
                (
                    2 *
                    2 *
                    2
                )
            );

        // --------------------------------------------------------
        // SUBSTRATE
        // --------------------------------------------------------

        const km =
            35;

        const substrateFactor =
            this.substrateConcentration /
            (
                km +
                this.substrateConcentration
            );

        // --------------------------------------------------------
        // ENZYME
        // --------------------------------------------------------

        const enzymeFactor =
            THREE.MathUtils.clamp(
                this.enzymeConcentration /
                100,
                0,
                1
            );

        // --------------------------------------------------------
        // FINAL
        // --------------------------------------------------------

        this.activity =
            THREE.MathUtils.clamp(

                this.temperatureFactor *
                this.pHFactor *
                substrateFactor *
                enzymeFactor *
                100,

                0,
                100
            );

        this.reactionRate =
            this.activity *
            0.85;

        return this.activity;
    }

    // ============================================================
    // TEMPERATURE
    // ============================================================

    setTemperature(
        value
    ) {

        this.temperature =
            THREE.MathUtils.clamp(
                Number(value),
                0,
                100
            );

        this.calculateActivity();
    }

    // ============================================================
    // pH
    // ============================================================

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

    // ============================================================
    // SUBSTRATE
    // ============================================================

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

    // ============================================================
    // ENZYME
    // ============================================================

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

    // ============================================================
    // START
    // ============================================================

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
                "approach";

            this.phaseTime =
                0;
        }
    }

    // ============================================================
    // PAUSE
    // ============================================================

    pause() {

        if (
            !this.running
        ) {

            return;
        }

        this.paused =
            !this.paused;
    }

    // ============================================================
    // RESET
    // ============================================================

    reset() {

        this.running =
            false;

        this.paused =
            false;

        this.phase =
            "ready";

        this.phaseTime =
            0;

        this.time =
            0;

        this.productFormation =
            0;

        this.calculateActivity();

        // --------------------------------------------------------
        // ENZYME
        // --------------------------------------------------------

        if (
            this.enzyme
        ) {

            this.enzyme.position.set(
                0,
                0,
                0
            );

            this.enzyme.rotation.set(
                0,
                0,
                0
            );

            this.enzyme.scale.set(
                1,
                1,
                1
            );
        }

        // --------------------------------------------------------
        // ACTIVE SITE
        // --------------------------------------------------------

        if (
            this.activeSite
        ) {

            this.activeSite.scale.set(
                1,
                1,
                1
            );
        }

        // --------------------------------------------------------
        // SUBSTRATE
        // --------------------------------------------------------

        if (
            this.substrate
        ) {

            this.substrate.visible =
                true;

            this.substrate.position.set(
                0,
                0,
                6.0
            );

            this.substrate.rotation.set(
                0,
                0,
                0
            );

            this.substrate.scale.set(
                1,
                1,
                1
            );
        }

        // --------------------------------------------------------
        // PRODUCTS
        // --------------------------------------------------------

        if (
            this.product1
        ) {

            this.product1.visible =
                false;

            this.product1.position.set(
                0,
                1.4,
                2.0
            );

            this.product1.scale.setScalar(
                1
            );
        }

        if (
            this.product2
        ) {

            this.product2.visible =
                false;

            this.product2.position.set(
                0,
                -1.4,
                2.0
            );

            this.product2.scale.setScalar(
                1
            );
        }

        // --------------------------------------------------------
        // PARTICLES
        // --------------------------------------------------------

        this.particles.forEach(
            particle => {

                particle.visible =
                    false;
            }
        );
    }

    // ============================================================
    // UPDATE
    // ============================================================

    update(
        delta
    ) {

        const dt =
            THREE.MathUtils.clamp(
                Number(delta) || 0.016,
                0,
                0.1
            );

        this.time +=
            dt;

        // ========================================================
        // ACTIVE SITE ANIMATION
        // ========================================================

        if (
            this.activeSiteGlow
        ) {

            const pulse =
                0.075 +
                (
                    Math.sin(
                        this.time * 4
                    ) *
                    0.025
                );

            this.activeSiteGlow.material.opacity =
                pulse;
        }

        if (
            this.activeSiteOpening
        ) {

            const pulse =
                0.36 +
                (
                    Math.sin(
                        this.time * 5
                    ) *
                    0.08
                );

            this.activeSiteOpening.material.opacity =
                pulse;
        }

        // ========================================================
        // PAUSED / STOPPED
        // ========================================================

        if (
            !this.running ||
            this.paused
        ) {

            return;
        }

        this.phaseTime +=
            dt;

        // ========================================================
        // PHASE 1
        // APPROACH
        // ========================================================

        if (
            this.phase ===
            "approach"
        ) {

            const duration =
                3.2;

            const t =
                THREE.MathUtils.clamp(
                    this.phaseTime /
                    duration,
                    0,
                    1
                );

            const eased =
                t *
                t *
                (
                    3 -
                    2 *
                    t
                );

            // ----------------------------------------------------
            // SUBSTRATE MOVES STRAIGHT INTO OPENING
            // ----------------------------------------------------

            this.substrate.position.x =
                THREE.MathUtils.lerp(
                    0,
                    0,
                    eased
                );

            this.substrate.position.y =
                Math.sin(
                    this.time * 3
                ) *
                0.05 *
                (
                    1 - eased
                );

            this.substrate.position.z =
                THREE.MathUtils.lerp(
                    6.0,
                    2.95,
                    eased
                );

            // ----------------------------------------------------
            // ROTATION
            // ----------------------------------------------------

            this.substrate.rotation.z =
                Math.sin(
                    this.time * 2
                ) *
                0.04;

            // ----------------------------------------------------
            // FINISH
            // ----------------------------------------------------

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

        // ========================================================
        // PHASE 2
        // BINDING
        // ========================================================

        else if (
            this.phase ===
            "binding"
        ) {

            const duration =
                1.8;

            const t =
                THREE.MathUtils.clamp(
                    this.phaseTime /
                    duration,
                    0,
                    1
                );

            const eased =
                t *
                t *
                (
                    3 -
                    2 *
                    t
                );

            // ----------------------------------------------------
            // ENTER POCKET
            // ----------------------------------------------------

            this.substrate.position.z =
                THREE.MathUtils.lerp(
                    2.95,
                    2.18,
                    eased
                );

            // ----------------------------------------------------
            // CENTER
            // ----------------------------------------------------

            this.substrate.position.x =
                THREE.MathUtils.lerp(
                    0,
                    0,
                    eased
                );

            this.substrate.position.y =
                THREE.MathUtils.lerp(
                    0,
                    0,
                    eased
                );

            // ----------------------------------------------------
            // FIT
            // ----------------------------------------------------

            const fit =
                Math.sin(
                    t *
                    Math.PI
                );

            const scale =
                1 -
                fit *
                0.12;

            this.substrate.scale.set(
                scale,
                scale,
                scale
            );

            // ----------------------------------------------------
            // ENZYME INDUCED FIT
            // ----------------------------------------------------

            this.enzyme.scale.set(

                1 -
                fit * 0.015,

                1 +
                fit * 0.015,

                1 -
                fit * 0.01
            );

            // ----------------------------------------------------
            // ACTIVE SITE RESPONSE
            // ----------------------------------------------------

            if (
                this.activeSite
            ) {

                this.activeSite.scale.set(

                    1 +
                    fit * 0.045,

                    1 -
                    fit * 0.025,

                    1
                );
            }

            // ----------------------------------------------------
            // BINDING COMPLETE
            // ----------------------------------------------------

            if (
                t >=
                1
            ) {

                this.substrate.position.set(
                    0,
                    0,
                    2.18
                );

                this.substrate.rotation.set(
                    0,
                    0,
                    0
                );

                this.substrate.scale.set(
                    0.88,
                    0.88,
                    0.88
                );

                this.phase =
                    "catalysis";

                this.phaseTime =
                    0;

                this.showParticles(
                    true
                );
            }
        }

        // ========================================================
        // PHASE 3
        // CATALYSIS
        // ========================================================

        else if (
            this.phase ===
            "catalysis"
        ) {

            const speed =
                THREE.MathUtils.lerp(
                    0.65,
                    2.0,
                    this.activity /
                    100
                );

            const duration =
                THREE.MathUtils.clamp(
                    4.0 /
                    speed,
                    2.0,
                    5.0
                );

            const t =
                THREE.MathUtils.clamp(
                    this.phaseTime /
                    duration,
                    0,
                    1
                );

            // ----------------------------------------------------
            // ENERGY PULSE
            // ----------------------------------------------------

            const pulse =
                1 +
                Math.sin(
                    this.phaseTime * 10
                ) *
                0.025;

            if (
                this.activeSite
            ) {

                this.activeSite.scale.set(
                    pulse,
                    2 - pulse,
                    pulse
                );
            }

            // ----------------------------------------------------
            // SUBSTRATE BREAKING
            // ----------------------------------------------------

            const reaction =
                THREE.MathUtils.smoothstep(
                    t,
                    0.15,
                    0.85
                );

            if (
                this.substrate
            ) {

                this.substrate.scale.set(

                    0.88 -
                    reaction * 0.30,

                    0.88 -
                    reaction * 0.12,

                    0.88 -
                    reaction * 0.12
                );

                this.substrate.rotation.y =
                    reaction *
                    Math.PI *
                    0.5;
            }

            // ----------------------------------------------------
            // PRODUCTS APPEAR
            // ----------------------------------------------------

            if (
                t >
                0.35
            ) {

                this.product1.visible =
                    true;

                this.product2.visible =
                    true;

                const p =
                    THREE.MathUtils.smoothstep(
                        t,
                        0.35,
                        1
                    );

                this.productFormation =
                    p *
                    this.activity;

                // ------------------------------------------------
                // PRODUCT 1
                // ------------------------------------------------

                this.product1.position.set(

                    THREE.MathUtils.lerp(
                        0,
                        2.6,
                        p
                    ),

                    THREE.MathUtils.lerp(
                        0,
                        0.85,
                        p
                    ),

                    THREE.MathUtils.lerp(
                        2.18,
                        1.4,
                        p
                    )
                );

                this.product1.scale.setScalar(
                    0.15 +
                    p * 0.85
                );

                // ------------------------------------------------
                // PRODUCT 2
                // ------------------------------------------------

                this.product2.position.set(

                    THREE.MathUtils.lerp(
                        0,
                        2.6,
                        p
                    ),

                    THREE.MathUtils.lerp(
                        0,
                        -0.85,
                        p
                    ),

                    THREE.MathUtils.lerp(
                        2.18,
                        1.4,
                        p
                    )
                );

                this.product2.scale.setScalar(
                    0.15 +
                    p * 0.85
                );
            }

            // ----------------------------------------------------
            // PARTICLES
            // ----------------------------------------------------

            this.updateParticles();

            // ----------------------------------------------------
            // COMPLETE
            // ----------------------------------------------------

            if (
                t >=
                1
            ) {

                this.substrate.visible =
                    false;

                this.phase =
                    "release";

                this.phaseTime =
                    0;
            }
        }

        // ========================================================
        // PHASE 4
        // RELEASE
        // ========================================================

        else if (
            this.phase ===
            "release"
        ) {

            const duration =
                2.0;

            const t =
                THREE.MathUtils.clamp(
                    this.phaseTime /
                    duration,
                    0,
                    1
                );

            const eased =
                t *
                t *
                (
                    3 -
                    2 *
                    t
                );

            // ----------------------------------------------------
            // PRODUCT 1
            // ----------------------------------------------------

            this.product1.position.x =
                THREE.MathUtils.lerp(
                    2.6,
                    5.0,
                    eased
                );

            this.product1.position.y =
                THREE.MathUtils.lerp(
                    0.85,
                    1.8,
                    eased
                );

            this.product1.position.z =
                THREE.MathUtils.lerp(
                    1.4,
                    0.5,
                    eased
                );

            this.product1.rotation.y +=
                dt;

            // ----------------------------------------------------
            // PRODUCT 2
            // ----------------------------------------------------

            this.product2.position.x =
                THREE.MathUtils.lerp(
                    2.6,
                    5.0,
                    eased
                );

            this.product2.position.y =
                THREE.MathUtils.lerp(
                    -0.85,
                    -1.8,
                    eased
                );

            this.product2.position.z =
                THREE.MathUtils.lerp(
                    1.4,
                    0.5,
                    eased
                );

            this.product2.rotation.y -=
                dt;

            // ----------------------------------------------------
            // ENZYME RETURNS
            // ----------------------------------------------------

            this.enzyme.scale.lerp(
                new THREE.Vector3(
                    1,
                    1,
                    1
                ),
                0.08
            );

            if (
                t >=
                1
            ) {

                this.phase =
                    "complete";

                this.running =
                    false;

                this.showParticles(
                    false
                );
            }
        }
    }

    // ============================================================
    // PARTICLES
    // ============================================================

    showParticles(
        visible
    ) {

        this.particles.forEach(
            particle => {

                particle.visible =
                    visible;
            }
        );
    }

    // ============================================================
    // UPDATE PARTICLES
    // ============================================================

    updateParticles() {

        if (
            this.phase !==
                "catalysis"
        ) {

            return;
        }

        this.particles.forEach(
            particle => {

                const data =
                    particle.userData;

                const angle =
                    data.angle +
                    this.time *
                    data.speed;

                const radius =
                    data.radius;

                particle.position.set(

                    Math.cos(angle) *
                    radius,

                    Math.sin(angle) *
                    radius *
                    0.65,

                    2.20 +
                    Math.sin(
                        angle * 1.7 +
                        data.phase
                    ) *
                    0.28
                );
            }
        );
    }

    // ============================================================
    // PHASE DESCRIPTION
    // ============================================================

    getPhaseDescription() {

        switch (
            this.phase
        ) {

            case "ready":

                return (
                    "Ready — the enzyme and substrate are separated."
                );

            case "approach":

                return (
                    "The substrate is approaching the active-site opening."
                );

            case "binding":

                return (
                    "The substrate is entering the active-site pocket and forming an enzyme-substrate complex."
                );

            case "catalysis":

                return (
                    "Catalysis is occurring inside the active site."
                );

            case "release":

                return (
                    "The products are leaving the active site."
                );

            case "complete":

                return (
                    "Reaction complete. The enzyme remains available for another substrate."
                );

            default:

                return (
                    "Enzyme activity simulation."
                );
        }
    }

    // ============================================================
    // STATE
    // ============================================================

    getState() {

        return {

            phase:
                this.phase,

            phaseDescription:
                this.getPhaseDescription(),

            temperature:
                this.temperature,

            pH:
                this.pH,

            substrateConcentration:
                this.substrateConcentration,

            enzymeConcentration:
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

            running:
                this.running,

            paused:
                this.paused
        };
    }

    // ============================================================
    // OBJECT ACCESS
    // ============================================================

    getObject() {

        return this.group;
    }

    // ============================================================
    // SELECTABLE OBJECTS
    // ============================================================

    getSelectableObjects() {

        return this.selectable;
    }

    // ============================================================
    // ACTIVE SITE
    // ============================================================

    getActiveSite() {

        return this.activeSite;
    }

    // ============================================================
    // ENZYME
    // ============================================================

    getEnzyme() {

        return this.enzyme;
    }

    // ============================================================
    // SUBSTRATE
    // ============================================================

    getSubstrate() {

        return this.substrate;
    }

    // ============================================================
    // PRODUCTS
    // ============================================================

    getProducts() {

        return {

            product1:
                this.product1,

            product2:
                this.product2
        };
    }

    // ============================================================
    // DISPOSE
    // ============================================================

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

        this.group.clear();

        this.selectable = [];

        this.particles = [];

        this.enzyme = null;

        this.activeSite = null;

        this.substrate = null;

        this.product1 = null;

        this.product2 = null;

        this.activeSiteOpening = null;

        this.activeSiteInner = null;

        this.activeSiteGlow = null;
    }
}