// ============================================================
// SciLab - Biology Laboratory
// Osmosis Laboratory
// Osmosis.js
// ============================================================

import * as THREE from "three";


// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_OUTSIDE_SOLUTE = 10;
const DEFAULT_INSIDE_SOLUTE = 4;
const DEFAULT_PERMEABILITY = 75;
const DEFAULT_TEMPERATURE = 25;

const BASE_CELL_RADIUS = 3.15;

const MIN_VOLUME = 58;
const MAX_VOLUME = 148;

// Water visible in the environment.
const OUTSIDE_WATER_COUNT = 100;
const INSIDE_WATER_COUNT = 85;

// Solute.
const OUTSIDE_SOLUTE_COUNT = 34;
const INSIDE_SOLUTE_COUNT = 14;

// Actual crossing molecules.
const CROSSING_WATER_COUNT = 36;


// ============================================================
// HELPERS
// ============================================================

function clamp(
    value,
    min,
    max
) {

    return THREE.MathUtils.clamp(
        Number(value) || 0,
        min,
        max
    );

}


// ============================================================
// OSMOSIS CLASS
// ============================================================

export class Osmosis {

    constructor() {

        // ------------------------------------------------------
        // ROOT
        // ------------------------------------------------------

        this.group =
            new THREE.Group();

        this.group.name =
            "Osmosis Laboratory";

            this.group.scale.setScalar(
    7.55
);


        // ------------------------------------------------------
        // STATE
        // ------------------------------------------------------

        this.running =
            false;

        this.elapsed =
            0;

        this.temperature =
            DEFAULT_TEMPERATURE;

        this.timeScale =
            1;


        this.outsideSolute =
            DEFAULT_OUTSIDE_SOLUTE;

        this.insideSolute =
            DEFAULT_INSIDE_SOLUTE;

        this.membranePermeability =
            DEFAULT_PERMEABILITY;


        // ------------------------------------------------------
        // CELL STATE
        // ------------------------------------------------------

        this.cellVolume =
            100;

        this.cellScale =
            1;

        this.targetCellScale =
            1;


        // ------------------------------------------------------
        // OSMOSIS STATE
        // ------------------------------------------------------

        this.waterFlow =
            0;

        this.flowDirection =
            0;

        this.equilibrium =
            0;


        // ------------------------------------------------------
        // ARRAYS
        // ------------------------------------------------------

        this.selectable =
            [];

        this.waterParticles =
            [];

        this.insideWaterParticles =
            [];

        this.outsideWaterParticles =
            [];

        this.soluteParticles =
            [];

        this.crossingWaterParticles =
            [];


        // ------------------------------------------------------
        // FLOW STATISTICS
        // ------------------------------------------------------

        this.waterEntered =
            0;

        this.waterExited =
            0;


        // ------------------------------------------------------
        // VISUAL
        // ------------------------------------------------------

        this.flowPulse =
            0;


        // ------------------------------------------------------
        // CREATE
        // ------------------------------------------------------

        this.createLab();

        this.recalculate();

    }


    // ========================================================
    // CREATE LAB
    // ========================================================

    createLab() {

        this.createCellBody();

        this.createCytoplasm();

        this.createMembrane();

        this.createNucleus();

        this.createMembraneGlow();

        this.createWaterParticles();

        this.createSoluteParticles();

        this.createCrossingWater();

        this.createMembraneRing();

    }


    // ========================================================
    // CELL BODY
    // ========================================================

    createCellBody() {

        const geometry =
            new THREE.SphereGeometry(
                BASE_CELL_RADIUS,
                96,
                64
            );


        const material =
            new THREE.MeshPhysicalMaterial({

                color:
                    0x39cfc3,

                transparent:
                    true,

                opacity:
                    0.24,

                roughness:
                    0.12,

                metalness:
                    0,

                transmission:
                    0.28,

                thickness:
                    0.75,

                clearcoat:
                    1,

                clearcoatRoughness:
                    0.08,

                side:
                    THREE.DoubleSide

            });


        this.cell =
            new THREE.Mesh(
                geometry,
                material
            );


        this.cell.scale.set(
            1.18,
            1.00,
            0.91
        );


        this.cell.name =
            "Cell";


        this.cell.userData = {

            name:
                "Cell",

            type:
                "osmosis-cell",

            description:
                "A living animal cell surrounded by a selectively permeable membrane.",

            descriptionRw:
                "Cell iri kurebwa hamwe na membrane yemerera amazi kunyuramo.",

            teacher:
                "Water moves across the selectively permeable membrane toward the side with the higher effective solute concentration."

        };


        this.group.add(
            this.cell
        );


        this.selectable.push(
            this.cell
        );

    }


    // ========================================================
    // CYTOPLASM
    // ========================================================

    createCytoplasm() {

        const geometry =
            new THREE.SphereGeometry(
                BASE_CELL_RADIUS * 0.91,
                80,
                56
            );


        const material =
            new THREE.MeshPhysicalMaterial({

                color:
                    0x58e5d4,

                transparent:
                    true,

                opacity:
                    0.14,

                roughness:
                    0.18,

                transmission:
                    0.32,

                thickness:
                    0.5,

                side:
                    THREE.DoubleSide

            });


        this.cytoplasm =
            new THREE.Mesh(
                geometry,
                material
            );


        this.cytoplasm.scale.set(
            1.16,
            0.97,
            0.89
        );


        this.cytoplasm.name =
            "Cytoplasm";


        this.cytoplasm.userData = {

            name:
                "Cytoplasm",

            type:
                "cytoplasm",

            description:
                "The fluid interior of the cell.",

            descriptionRw:
                "Igice cy'amazi kiba imbere muri cell.",

            teacher:
                "When water enters or leaves the cell, the cell volume changes."

        };


        this.group.add(
            this.cytoplasm
        );


        this.selectable.push(
            this.cytoplasm
        );

    }


    // ========================================================
    // MEMBRANE
    // ========================================================

    createMembrane() {

        const geometry =
            new THREE.SphereGeometry(
                BASE_CELL_RADIUS * 1.025,
                96,
                64
            );


        const material =
            new THREE.MeshPhysicalMaterial({

                color:
                    0xa5fff1,

                transparent:
                    true,

                opacity:
                    0.34,

                roughness:
                    0.06,

                transmission:
                    0.52,

                thickness:
                    0.30,

                clearcoat:
                    1,

                clearcoatRoughness:
                    0.04,

                side:
                    THREE.DoubleSide

            });


        this.membrane =
            new THREE.Mesh(
                geometry,
                material
            );


        this.membrane.scale.set(
            1.20,
            1.01,
            0.92
        );


        this.membrane.name =
            "Cell Membrane";


        this.membrane.userData = {

            name:
                "Cell Membrane",

            type:
                "membrane",

            description:
                "A selectively permeable membrane that allows water molecules to cross while restricting many solute particles.",

            descriptionRw:
                "Membrane yemerera amazi kunyuramo ariko ikabuza solute nyinshi kunyuramo.",

            teacher:
                "Osmosis occurs because the selectively permeable membrane allows water to cross but restricts solute particles."

        };


        this.group.add(
            this.membrane
        );


        this.selectable.push(
            this.membrane
        );

    }


    // ========================================================
    // MEMBRANE GLOW
    // ========================================================

    createMembraneGlow() {

        const geometry =
            new THREE.SphereGeometry(
                BASE_CELL_RADIUS * 1.045,
                64,
                48
            );


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    0x9ffff3,

                transparent:
                    true,

                opacity:
                    0.08,

                side:
                    THREE.BackSide

            });


        this.membraneGlow =
            new THREE.Mesh(
                geometry,
                material
            );


        this.membraneGlow.scale.set(
            1.20,
            1.01,
            0.92
        );


        this.group.add(
            this.membraneGlow
        );

    }


    // ========================================================
    // NUCLEUS
    // ========================================================

    createNucleus() {

        const geometry =
            new THREE.SphereGeometry(
                1.0,
                64,
                48
            );


        const material =
            new THREE.MeshPhysicalMaterial({

                color:
                    0x8068d9,

                transparent:
                    true,

                opacity:
                    0.42,

                roughness:
                    0.18,

                transmission:
                    0.18,

                clearcoat:
                    0.8

            });


        this.nucleus =
            new THREE.Mesh(
                geometry,
                material
            );


        this.nucleus.position.set(
            -0.25,
            0.1,
            0
        );


        this.nucleus.scale.set(
            1.05,
            0.90,
            0.84
        );


        this.nucleus.name =
            "Nucleus";


        this.nucleus.userData = {

            name:
                "Nucleus",

            type:
                "nucleus",

            description:
                "The nucleus contains the genetic material of the cell.",

            descriptionRw:
                "Nucleus ibamo genetic material ya cell.",

            teacher:
                "The nucleus is shown for biological context. Osmosis occurs across the cell membrane."

        };


        this.group.add(
            this.nucleus
        );


        this.selectable.push(
            this.nucleus
        );

    }


    // ========================================================
    // WATER PARTICLES
    // ========================================================

    createWaterParticles() {

        const geometry =
            new THREE.SphereGeometry(
                0.075,
                12,
                10
            );


        // ----------------------------------------------------
        // OUTSIDE WATER
        // ----------------------------------------------------

        for (
            let i = 0;
            i < OUTSIDE_WATER_COUNT;
            i++
        ) {

            const material =
                new THREE.MeshPhysicalMaterial({

                    color:
                        0x5bbcff,

                    emissive:
                        0x103e72,

                    emissiveIntensity:
                        0.15,

                    roughness:
                        0.16,

                    transmission:
                        0.08

                });


            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                );


            const side =
                i % 2 === 0
                    ? -1
                    : 1;


            const x =
                side *
                (
                    4.0 +
                    Math.random() *
                    3.1
                );


            const y =
                (
                    Math.random() -
                    0.5
                ) *
                6.2;


            const z =
                (
                    Math.random() -
                    0.5
                ) *
                4.8;


            particle.position.set(
                x,
                y,
                z
            );


            particle.userData = {

                type:
                    "water",

                region:
                    "outside",

                side,

                baseX:
                    x,

                baseY:
                    y,

                baseZ:
                    z,

                speed:
                    0.45 +
                    Math.random() *
                    0.75,

                phase:
                    Math.random() *
                    Math.PI *
                    2,

                targetX:
                    x,

                crossing:
                    false

            };


            particle.name =
                "Water Molecule";


            this.group.add(
                particle
            );


            this.waterParticles.push(
                particle
            );


            this.outsideWaterParticles.push(
                particle
            );

        }


        // ----------------------------------------------------
        // INSIDE WATER
        // ----------------------------------------------------

        for (
            let i = 0;
            i < INSIDE_WATER_COUNT;
            i++
        ) {

            const particle =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.072,
                        12,
                        10
                    ),

                    new THREE.MeshPhysicalMaterial({

                        color:
                            0x68c9ff,

                        emissive:
                            0x104e80,

                        emissiveIntensity:
                            0.16,

                        roughness:
                            0.15,

                        transmission:
                            0.08

                    })

                );


            const radius =
                Math.sqrt(
                    Math.random()
                ) *
                2.35;


            const angle =
                Math.random() *
                Math.PI *
                2;


            const x =
                Math.cos(angle) *
                radius *
                0.82;


            const y =
                Math.sin(angle) *
                radius *
                0.70;


            const z =
                (
                    Math.random() -
                    0.5
                ) *
                3.8;


            particle.position.set(
                x,
                y,
                z
            );


            particle.userData = {

                type:
                    "water",

                region:
                    "inside",

                baseX:
                    x,

                baseY:
                    y,

                baseZ:
                    z,

                speed:
                    0.45 +
                    Math.random() *
                    0.75,

                phase:
                    Math.random() *
                    Math.PI *
                    2,

                crossing:
                    false

            };


            particle.name =
                "Water Molecule";


            this.group.add(
                particle
            );


            this.waterParticles.push(
                particle
            );


            this.insideWaterParticles.push(
                particle
            );

        }

    }


    // ========================================================
    // SOLUTE
    // ========================================================

    createSoluteParticles() {

        // ----------------------------------------------------
        // OUTSIDE SOLUTE
        // ----------------------------------------------------

        for (
            let i = 0;
            i < OUTSIDE_SOLUTE_COUNT;
            i++
        ) {

            const particle =
                this.createSolute(
                    "outside"
                );


            const side =
                i % 2 === 0
                    ? -1
                    : 1;


            particle.position.set(

                side *
                (
                    4.0 +
                    Math.random() *
                    2.6
                ),

                (
                    Math.random() -
                    0.5
                ) *
                5.7,

                (
                    Math.random() -
                    0.5
                ) *
                4.3

            );


            this.group.add(
                particle
            );


            this.soluteParticles.push(
                particle
            );


            this.selectable.push(
                particle
            );

        }


        // ----------------------------------------------------
        // INSIDE SOLUTE
        // ----------------------------------------------------

        for (
            let i = 0;
            i < INSIDE_SOLUTE_COUNT;
            i++
        ) {

            const particle =
                this.createSolute(
                    "inside"
                );


            const radius =
                Math.random() *
                2.15;


            const angle =
                Math.random() *
                Math.PI *
                2;


            particle.position.set(

                Math.cos(angle) *
                radius,

                Math.sin(angle) *
                radius,

                (
                    Math.random() -
                    0.5
                ) *
                3.3

            );


            this.group.add(
                particle
            );


            this.soluteParticles.push(
                particle
            );


            this.selectable.push(
                particle
            );

        }

    }


    // ========================================================
    // CREATE SOLUTE
    // ========================================================

    createSolute(
        region
    ) {

        const material =
            new THREE.MeshPhysicalMaterial({

                color:
                    0xffa348,

                emissive:
                    0x6c2707,

                emissiveIntensity:
                    0.22,

                roughness:
                    0.22,

                metalness:
                    0.02

            });


        const particle =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.145,
                    18,
                    14
                ),

                material

            );


        particle.name =
            "Solute Particle";


        particle.userData = {

            name:
                "Solute Particle",

            type:
                "solute",

            region,

            speed:
                0.22 +
                Math.random() *
                0.40,

            phase:
                Math.random() *
                Math.PI *
                2,

            description:
                "A solute particle restricted by the selectively permeable membrane.",

            descriptionRw:
                "Solute particle idashobora kwambuka membrane mu buryo busanzwe.",

            teacher:
                "Solute particles are restricted by the selectively permeable membrane."

        };


        return particle;

    }


    // ========================================================
    // CROSSING WATER
    // ========================================================

    createCrossingWater() {

        const geometry =
            new THREE.SphereGeometry(
                0.10,
                14,
                12
            );


        for (
            let i = 0;
            i < CROSSING_WATER_COUNT;
            i++
        ) {

            const material =
                new THREE.MeshPhysicalMaterial({

                    color:
                        0x8edcff,

                    emissive:
                        0x176b9d,

                    emissiveIntensity:
                        0.28,

                    transparent:
                        true,

                    opacity:
                        0.95,

                    roughness:
                        0.10,

                    transmission:
                        0.08

                });


            const particle =
                new THREE.Mesh(
                    geometry,
                    material
                );


            particle.visible =
                false;


            particle.userData = {

                active:
                    false,

                progress:
                    i /
                    CROSSING_WATER_COUNT,

                direction:
                    1,

                lane:
                    (
                        Math.random() -
                        0.5
                    ) *
                    3.2,

                depth:
                    (
                        Math.random() -
                        0.5
                    ) *
                    2.2,

                speed:
                    0.35 +
                    Math.random() *
                    0.55,

                phase:
                    Math.random() *
                    Math.PI *
                    2

            };


            particle.name =
                "Water Molecule Crossing Membrane";


            this.group.add(
                particle
            );


            this.crossingWaterParticles.push(
                particle
            );

        }

    }


    // ========================================================
    // MEMBRANE RING
    // ========================================================

    createMembraneRing() {

        const geometry =
            new THREE.TorusGeometry(
                BASE_CELL_RADIUS * 1.04,
                0.025,
                16,
                96
            );


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    0x9efff4,

                transparent:
                    true,

                opacity:
                    0.25

            });


        this.membraneRing =
            new THREE.Mesh(
                geometry,
                material
            );


        this.membraneRing.rotation.x =
            Math.PI / 2;


        this.membraneRing.scale.set(
            1.20,
            0.92,
            1
        );


        this.group.add(
            this.membraneRing
        );

    }


    // ========================================================
    // RECALCULATE
    // ========================================================

    recalculate() {

        const difference =
            this.outsideSolute -
            this.insideSolute;


        const absoluteDifference =
            Math.abs(
                difference
            );


        // ----------------------------------------------------
        // DIRECTION
        // ----------------------------------------------------

        if (
            difference > 0.35
        ) {

            // Outside has more solute.
            // Water enters cell.

            this.flowDirection =
                1;

        }

        else if (
            difference < -0.35
        ) {

            // Inside has more solute.
            // Water leaves cell.

            this.flowDirection =
                -1;

        }

        else {

            this.flowDirection =
                0;

        }


        // ----------------------------------------------------
        // FLOW STRENGTH
        // ----------------------------------------------------

        this.waterFlow =
            clamp(

                absoluteDifference *
                (
                    this.membranePermeability /
                    100
                ) *
                1.35,

                0,

                30

            );


        // ----------------------------------------------------
        // EQUILIBRIUM
        // ----------------------------------------------------

        this.equilibrium =
            clamp(

                100 -
                absoluteDifference *
                7,

                0,

                100

            );


        // ----------------------------------------------------
        // TARGET VOLUME
        // ----------------------------------------------------

        let targetVolume =
            100 +
            difference *
            4.2;


        targetVolume =
            clamp(

                targetVolume,

                MIN_VOLUME,

                MAX_VOLUME

            );


        this.targetCellScale =
            Math.sqrt(
                targetVolume /
                100
            );


        this.targetCellScale =
            clamp(

                this.targetCellScale,

                0.76,

                1.24

            );

    }


    // ========================================================
    // SET OUTSIDE SOLUTE
    // ========================================================

    setOutsideSolute(
        value
    ) {

        this.outsideSolute =
            clamp(
                value,
                0,
                100
            );


        this.recalculate();

    }


    // ========================================================
    // SET INSIDE SOLUTE
    // ========================================================

    setInsideSolute(
        value
    ) {

        this.insideSolute =
            clamp(
                value,
                0,
                100
            );


        this.recalculate();

    }


    // ========================================================
    // SET PERMEABILITY
    // ========================================================

    setPermeability(
        value
    ) {

        this.membranePermeability =
            clamp(
                value,
                0,
                100
            );


        this.recalculate();

    }


    // ========================================================
    // SET TEMPERATURE
    // ========================================================

    setTemperature(
        value
    ) {

        this.temperature =
            clamp(
                value,
                0,
                100
            );


        this.timeScale =
            clamp(

                this.temperature /
                25,

                0.25,

                3

            );

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

        this.hideCrossingWater();

    }


    // ========================================================
    // RESET
    // ========================================================

    reset() {

        this.running =
            false;

        this.elapsed =
            0;

        this.outsideSolute =
            DEFAULT_OUTSIDE_SOLUTE;

        this.insideSolute =
            DEFAULT_INSIDE_SOLUTE;

        this.membranePermeability =
            DEFAULT_PERMEABILITY;

        this.temperature =
            DEFAULT_TEMPERATURE;

        this.timeScale =
            1;

        this.cellVolume =
            100;

        this.cellScale =
            1;

        this.targetCellScale =
            1;

        this.waterEntered =
            0;

        this.waterExited =
            0;

        this.flowPulse =
            0;


        this.recalculate();

        this.resetParticles();

    }


    // ========================================================
    // UPDATE
    // ========================================================

    update(
        delta
    ) {

        if (
            !Number.isFinite(delta)
        ) {

            return;

        }


        delta =
            Math.min(
                delta,
                0.05
            );


        this.elapsed +=
            delta *
            this.timeScale;


        // ----------------------------------------------------
        // ALWAYS MOVE MOLECULES
        // ----------------------------------------------------

        this.animateOutsideWater(
            delta
        );

        this.animateInsideWater(
            delta
        );

        this.animateSolute(
            delta
        );


        // ----------------------------------------------------
        // OSMOSIS
        // ----------------------------------------------------

        if (
            this.running
        ) {

            this.animateWaterTransfer(
                delta
            );

            this.updateCellVolume(
                delta
            );

        }

        else {

            this.hideCrossingWater();

            this.smoothCell(
                delta
            );

        }


        // ----------------------------------------------------
        // MEMBRANE
        // ----------------------------------------------------

        this.animateMembrane(
            delta
        );

    }


    // ========================================================
    // OUTSIDE WATER
    // ========================================================

    animateOutsideWater(
        delta
    ) {

        this.outsideWaterParticles.forEach(
            particle => {

                const data =
                    particle.userData;


                if (
                    data.crossing
                ) {

                    return;

                }


                const t =
                    this.elapsed *
                    data.speed +
                    data.phase;


                particle.position.y +=

                    Math.sin(
                        t
                    ) *
                    delta *
                    0.10;


                particle.position.z +=

                    Math.cos(
                        t *
                        0.77
                    ) *
                    delta *
                    0.075;


                // Keep outside molecules outside.
                const minimumX =
                    3.70;


                if (
                    data.side < 0
                ) {

                    particle.position.x =
                        Math.min(
                            particle.position.x,
                            -minimumX
                        );

                }

                else {

                    particle.position.x =
                        Math.max(
                            particle.position.x,
                            minimumX
                        );

                }

            }
        );

    }


    // ========================================================
    // INSIDE WATER
    // ========================================================

    animateInsideWater(
        delta
    ) {

        const limitX =
            BASE_CELL_RADIUS *
            0.82 *
            this.cellScale;


        const limitY =
            BASE_CELL_RADIUS *
            0.70 *
            this.cellScale;


        this.insideWaterParticles.forEach(
            particle => {

                const data =
                    particle.userData;


                if (
                    data.crossing
                ) {

                    return;

                }


                const t =
                    this.elapsed *
                    data.speed +
                    data.phase;


                particle.position.y +=

                    Math.sin(
                        t
                    ) *
                    delta *
                    0.085;


                particle.position.z +=

                    Math.cos(
                        t *
                        0.71
                    ) *
                    delta *
                    0.065;


                particle.position.x =
                    clamp(

                        particle.position.x,

                        -limitX,

                        limitX

                    );


                particle.position.y =
                    clamp(

                        particle.position.y,

                        -limitY,

                        limitY

                    );

            }
        );

    }


    // ========================================================
    // SOLUTE
    // ========================================================

    animateSolute(
        delta
    ) {

        this.soluteParticles.forEach(
            particle => {

                const data =
                    particle.userData;


                const t =
                    this.elapsed *
                    data.speed +
                    data.phase;


                particle.position.y +=

                    Math.sin(
                        t
                    ) *
                    delta *
                    0.06;


                particle.position.z +=

                    Math.cos(
                        t *
                        0.8
                    ) *
                    delta *
                    0.045;


                // Solute outside cannot enter.
                if (
                    data.region ===
                    "outside"
                ) {

                    if (
                        particle.position.x <
                        -3.7
                    ) {

                        particle.position.x =
                            Math.min(
                                particle.position.x,
                                -3.7
                            );

                    }

                    else if (
                        particle.position.x >
                        3.7
                    ) {

                        particle.position.x =
                            Math.max(
                                particle.position.x,
                                3.7
                            );

                    }

                }

            }
        );

    }


    // ========================================================
    // REAL WATER TRANSFER
    // ========================================================

    animateWaterTransfer(
        delta
    ) {

        if (
            this.flowDirection === 0 ||
            this.waterFlow < 0.05
        ) {

            this.hideCrossingWater();

            return;

        }


        // ----------------------------------------------------
        // MOVEMENT SPEED
        // ----------------------------------------------------

        const speed =
            (
                0.16 +
                this.waterFlow *
                0.022
            ) *
            this.timeScale;


        // ----------------------------------------------------
        // ACTUAL WATER MOLECULES
        // ----------------------------------------------------

        this.crossingWaterParticles.forEach(
            particle => {

                const data =
                    particle.userData;


                // Start a molecule.
                if (
                    !data.active
                ) {

                    data.active =
                        true;

                    data.progress =
                        Math.random();

                    data.direction =
                        this.flowDirection;

                    data.lane =
                        (
                            Math.random() -
                            0.5
                        ) *
                        2.8;

                    data.depth =
                        (
                            Math.random() -
                            0.5
                        ) *
                        2.2;

                }


                data.progress +=

                    delta *
                    speed *
                    data.speed;


                // ------------------------------------------------
                // MOVEMENT
                // ------------------------------------------------

                const startX =
                    data.direction > 0
                        ? -6.0
                        : 6.0;


                const endX =
                    data.direction > 0
                        ? 1.45
                        : -1.45;


                const x =
                    THREE.MathUtils.lerp(

                        startX,

                        endX,

                        data.progress

                    );


                const wave =
                    Math.sin(

                        data.progress *
                        Math.PI *
                        6 +
                        data.phase

                    ) *
                    0.20;


                const y =
                    data.lane +
                    wave;


                const z =
                    data.depth +
                    Math.cos(

                        data.progress *
                        Math.PI *
                        5 +
                        data.phase

                    ) *
                    0.20;


                particle.position.set(
                    x,
                    y,
                    z
                );


                particle.visible =
                    true;


                // ------------------------------------------------
                // WHEN IT REACHES CELL
                // ------------------------------------------------

                if (
                    data.progress >=
                    1
                ) {

                    this.completeWaterTransfer(
                        particle,
                        data.direction
                    );

                }

            }
        );

    }


    // ========================================================
    // COMPLETE WATER TRANSFER
    // ========================================================

    completeWaterTransfer(
        particle,
        direction
    ) {

        const data =
            particle.userData;


        // ----------------------------------------------------
        // WATER ENTERS CELL
        // ----------------------------------------------------

        if (
            direction > 0
        ) {

            this.waterEntered++;


            this.addWaterInside();

        }


        // ----------------------------------------------------
        // WATER LEAVES CELL
        // ----------------------------------------------------

        else {

            this.waterExited++;


            this.removeWaterInside();

        }


        // Restart molecule from outside.
        data.progress =
            0;

        data.direction =
            this.flowDirection;


        data.lane =
            (
                Math.random() -
                0.5
            ) *
            2.8;


        data.depth =
            (
                Math.random() -
                0.5
            ) *
            2.2;


        particle.visible =
            true;

    }


    // ========================================================
    // ADD WATER INSIDE
    // ========================================================

    addWaterInside() {

        if (
            this.outsideWaterParticles.length ===
            0
        ) {

            return;

        }


        const source =
            this.outsideWaterParticles[
                Math.floor(
                    Math.random() *
                    this.outsideWaterParticles.length
                )
            ];


        if (!source) {
            return;
        }


        // Move the real molecule into the cell.
        source.userData.crossing =
            false;

        source.userData.region =
            "inside";


        // Remove from outside array.
        const outsideIndex =
            this.outsideWaterParticles.indexOf(
                source
            );


        if (
            outsideIndex >= 0
        ) {

            this.outsideWaterParticles.splice(
                outsideIndex,
                1
            );

        }


        // Add to inside array.
        if (
            !this.insideWaterParticles.includes(
                source
            )
        ) {

            this.insideWaterParticles.push(
                source
            );

        }


        // Give it an actual inside position.
        const angle =
            Math.random() *
            Math.PI *
            2;


        const radius =
            Math.sqrt(
                Math.random()
            ) *
            2.0 *
            this.cellScale;


        source.position.set(

            Math.cos(angle) *
            radius,

            Math.sin(angle) *
            radius *
            0.75,

            (
                Math.random() -
                0.5
            ) *
            3.0 *
            this.cellScale

        );


        source.userData.baseX =
            source.position.x;

        source.userData.baseY =
            source.position.y;

        source.userData.baseZ =
            source.position.z;

    }


    // ========================================================
    // REMOVE WATER INSIDE
    // ========================================================

    removeWaterInside() {

        if (
            this.insideWaterParticles.length <=
            12
        ) {

            return;

        }


        const index =
            Math.floor(

                Math.random() *
                this.insideWaterParticles.length

            );


        const source =
            this.insideWaterParticles[
                index
            ];


        if (!source) {
            return;
        }


        // Remove from inside.
        this.insideWaterParticles.splice(
            index,
            1
        );


        // Put it outside.
        source.userData.region =
            "outside";

        source.userData.crossing =
            false;


        source.userData.side =
            Math.random() < 0.5
                ? -1
                : 1;


        const side =
            source.userData.side;


        source.position.set(

            side *
            (
                4.0 +
                Math.random() *
                2.0
            ),

            (
                Math.random() -
                0.5
            ) *
            5.5,

            (
                Math.random() -
                0.5
            ) *
            4.5

        );


        source.userData.baseX =
            source.position.x;

        source.userData.baseY =
            source.position.y;

        source.userData.baseZ =
            source.position.z;


        if (
            !this.outsideWaterParticles.includes(
                source
            )
        ) {

            this.outsideWaterParticles.push(
                source
            );

        }

    }


    // ========================================================
    // CELL VOLUME
    // ========================================================

    updateCellVolume(
        delta
    ) {

        const difference =
            this.outsideSolute -
            this.insideSolute;


        // Stronger gradient = faster volume response.
        const gradient =
            Math.abs(
                difference
            ) /
            100;


        const response =
            (
                0.18 +
                gradient *
                1.65
            ) *
            (
                this.membranePermeability /
                100
            );


        const targetVolume =
            clamp(

                100 +
                difference *
                4.2,

                MIN_VOLUME,

                MAX_VOLUME

            );


        this.cellVolume +=

            (
                targetVolume -
                this.cellVolume
            ) *
            delta *
            response;


        this.cellVolume =
            clamp(

                this.cellVolume,

                MIN_VOLUME,

                MAX_VOLUME

            );


        // ----------------------------------------------------
        // SCALE
        // ----------------------------------------------------

        const desiredScale =
            Math.sqrt(
                this.cellVolume /
                100
            );


        this.cellScale =
            THREE.MathUtils.lerp(

                this.cellScale,

                desiredScale,

                Math.min(
                    1,
                    delta *
                    2.4
                )

            );


        this.applyCellScale();

    }


    // ========================================================
    // SMOOTH CELL
    // ========================================================

    smoothCell(
        delta
    ) {

        this.cellScale =
            THREE.MathUtils.lerp(

                this.cellScale,

                this.targetCellScale,

                Math.min(
                    1,
                    delta *
                    0.45
                )

            );


        this.applyCellScale();

    }


    // ========================================================
    // APPLY CELL SCALE
    // ========================================================

    applyCellScale() {

        const scale =
            this.cellScale;


        // Cell.
        this.cell.scale.set(

            1.18 *
            scale,

            1.00 *
            scale,

            0.91 *
            scale

        );


        // Cytoplasm.
        this.cytoplasm.scale.set(

            1.16 *
            scale,

            0.97 *
            scale,

            0.89 *
            scale

        );


        // Membrane.
        this.membrane.scale.set(

            1.20 *
            scale,

            1.01 *
            scale,

            0.92 *
            scale

        );


        // Glow.
        this.membraneGlow.scale.set(

            1.20 *
            scale,

            1.01 *
            scale,

            0.92 *
            scale

        );


        // Nucleus.
        this.nucleus.scale.set(

            1.05 *
            scale,

            0.90 *
            scale,

            0.84 *
            scale

        );


        // Ring.
        if (
            this.membraneRing
        ) {

            this.membraneRing.scale.set(

                1.20 *
                scale,

                0.92 *
                scale,

                1

            );

        }

    }


    // ========================================================
    // MEMBRANE ANIMATION
    // ========================================================

    animateMembrane(
        delta
    ) {

        this.flowPulse +=
            delta *
            2.2;


        const pulse =
            Math.sin(
                this.flowPulse
            ) *
            0.035;


        if (
            this.membrane
        ) {

            this.membrane.material.opacity =
                0.34 +
                pulse;

        }


        if (
            this.membraneGlow
        ) {

            this.membraneGlow.material.opacity =
                0.075 +
                Math.abs(
                    pulse
                );

        }


        if (
            this.membraneRing
        ) {

            this.membraneRing.material.opacity =
                0.20 +
                Math.abs(
                    pulse
                ) *
                2;

        }

    }


    // ========================================================
    // HIDE CROSSING WATER
    // ========================================================

    hideCrossingWater() {

        this.crossingWaterParticles.forEach(
            particle => {

                particle.visible =
                    false;

            }
        );

    }


    // ========================================================
    // RESET PARTICLES
    // ========================================================

    resetParticles() {

        // ----------------------------------------------------
        // Reset water arrays.
        // ----------------------------------------------------

        this.insideWaterParticles =
            [];

        this.outsideWaterParticles =
            [];


        // ----------------------------------------------------
        // Restore all normal water molecules.
        // ----------------------------------------------------

        this.waterParticles.forEach(
            (
                particle,
                index
            ) => {

                const inside =
                    index <
                    INSIDE_WATER_COUNT;


                const data =
                    particle.userData;


                data.crossing =
                    false;


                data.region =
                    inside
                        ? "inside"
                        : "outside";


                if (
                    inside
                ) {

                    const radius =
                        Math.sqrt(
                            Math.random()
                        ) *
                        2.25;


                    const angle =
                        Math.random() *
                        Math.PI *
                        2;


                    particle.position.set(

                        Math.cos(angle) *
                        radius *
                        0.82,

                        Math.sin(angle) *
                        radius *
                        0.70,

                        (
                            Math.random() -
                            0.5
                        ) *
                        3.6

                    );


                    this.insideWaterParticles.push(
                        particle
                    );

                }

                else {

                    const side =
                        Math.random() <
                        0.5
                            ? -1
                            : 1;


                    particle.position.set(

                        side *
                        (
                            4.0 +
                            Math.random() *
                            2.8
                        ),

                        (
                            Math.random() -
                            0.5
                        ) *
                        5.8,

                        (
                            Math.random() -
                            0.5
                        ) *
                        4.6

                    );


                    data.side =
                        side;


                    this.outsideWaterParticles.push(
                        particle
                    );

                }


                data.baseX =
                    particle.position.x;

                data.baseY =
                    particle.position.y;

                data.baseZ =
                    particle.position.z;

            }
        );


        // ----------------------------------------------------
        // Reset crossing particles.
        // ----------------------------------------------------

        this.crossingWaterParticles.forEach(
            (
                particle,
                index
            ) => {

                particle.userData.active =
                    false;

                particle.userData.progress =
                    index /
                    CROSSING_WATER_COUNT;

                particle.visible =
                    false;

            }
        );

    }


    // ========================================================
    // GET STATE
    // ========================================================

    getState() {

        let direction =
            "No net movement";


        if (
            this.flowDirection > 0
        ) {

            direction =
                "Outside → Cell";

        }

        else if (
            this.flowDirection < 0
        ) {

            direction =
                "Cell → Outside";

        }


        return {

            outsideSolute:
                this.outsideSolute,

            insideSolute:
                this.insideSolute,

            permeability:
                this.membranePermeability,

            cellVolume:
                this.cellVolume,

            waterFlow:
                this.waterFlow,

            equilibrium:
                this.equilibrium,

            temperature:
                this.temperature,

            running:
                this.running,

            paused:
                !this.running,

            direction,

            flowDirection:
                this.flowDirection,

            waterEntered:
                this.waterEntered,

            waterExited:
                this.waterExited,

            outsideWater:
                this.outsideWaterParticles.length,

            insideWater:
                this.insideWaterParticles.length

        };

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

                    }

                    else {

                        object.material.dispose();

                    }

                }

            }
        );


        this.waterParticles =
            [];

        this.insideWaterParticles =
            [];

        this.outsideWaterParticles =
            [];

        this.soluteParticles =
            [];

        this.crossingWaterParticles =
            [];

        this.selectable =
            [];


        this.group.clear();

    }

}