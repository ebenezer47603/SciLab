// ============================================================
// SciLab - Physics Simulation Laboratory
// PhysicsSimulation.js
// ============================================================

import * as THREE from "three";

import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls.js";

import {
    LensOptics
} from "../simulations/physics/LensOptics.js";

import {
    MagneticInduction
} from "../simulations/physics/MagneticInduction.js";

import {
    ElectricMotor
} from "../simulations/physics/ElectricMotor.js";

import {
    SolarSystem
} from "../simulations/physics/SolarSystem.js";

import {
    VirtualPhysicsLab
} from "../simulations/physics/VirtualPhysicsLab.js";


// ============================================================
// SIMULATOR MAP
// ============================================================

const SIMULATORS = {

    lens: {
        title: "Lens & Ray Optics Lab",
        subtitle: "Optics",
        icon: "🔍",
        route: "physics-lens",
        classRef: LensOptics,
        accent: "#60a5fa",

        description:
            "Investigate focal length, object position, principal rays, image distance, magnification and image formation.",

        teacher:
            "Use the object-position buttons to demonstrate how a convex lens forms real or virtual images. Switch to a concave lens to demonstrate virtual, upright and diminished images."
    },


    magnetic: {
        title: "Magnetic Induction Simulator",
        subtitle: "Electromagnetism",
        icon: "🧲",
        route: "physics-magnetic",
        classRef: MagneticInduction,
        accent: "#38bdf8",

        description:
            "Move a magnet through a coil and observe induced EMF, current, magnetic flux and electrical power.",

        teacher:
            "A changing magnetic flux through a conducting coil can produce an induced electromotive force."
    },


    motor: {
        title: "Electric Motor Simulator",
        subtitle: "Electromagnetism",
        icon: "⚙️",
        route: "physics-motor",
        classRef: ElectricMotor,
        accent: "#f59e0b",

        description:
            "Explore how current in a magnetic field produces torque and rotational motion.",

        teacher:
            "A current-carrying coil in a magnetic field experiences torque and can convert electrical energy into mechanical motion."
    },


    solar: {
        title: "3D Solar System Simulator",
        subtitle: "Astronomy",
        icon: "☀️",
        route: "physics-solar-system",
        classRef: SolarSystem,
        accent: "#facc15",

        description:
            "Explore the Sun, planets, moons, asteroid belt, Kuiper Belt, orbital paths and planetary properties in 3D.",

        teacher:
            "Select planets and Solar System components to compare distance, gravity, size, moons and orbital periods."
    },


    virtual: {
        title: "Virtual Physics Lab",
        subtitle: "Experimental Physics",
        icon: "🔬",
        route: "physics-virtual-lab",
        classRef: VirtualPhysicsLab,
        accent: "#a78bfa",

        description:
            "Run classroom-style experiments with controlled parameters, live measurements and teacher guidance.",

        teacher:
            "Use controlled parameters to demonstrate physical laws, observe measurements and guide students through scientific reasoning."
    }

};


// ============================================================
// SOLAR SYSTEM GALLERY
// ============================================================

const solarSystemGallery = [

    {
        title: "Solar System Overview",

        description:
            "Overview of the Sun, planets and major orbital regions of the Solar System.",

        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Solar%20system.jpg"
    },


    {
        title: "The Sun",

        description:
            "The Sun is the central star and the main source of energy in the Solar System.",

        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Sun920607.jpg"
    },


    {
        title: "Mercury",

        description:
            "Mercury is the smallest major planet and the closest planet to the Sun.",

        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Mercury_in_true_color.jpg"
    },


    {
        title: "Venus",

        description:
            "Venus is a rocky planet with a very thick atmosphere and high surface temperatures.",

        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Venus-globe.jpg"
    },


    {
        title: "Earth",

        description:
            "Earth is the third planet from the Sun and has liquid water and a life-supporting atmosphere.",

        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/The_Earth_seen_from_Apollo_17.jpg"
    },


    {
        title: "Mars",

        description:
            "Mars is a rocky desert planet known for its reddish surface.",

        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/OSIRIS_Mars_true_color.jpg"
    },


    {
        title: "Jupiter",

        description:
            "Jupiter is the largest planet in the Solar System and a gas giant.",

        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Jupiter_by_Cassini-Huygens.jpg"
    },


    {
        title: "Saturn",

        description:
            "Saturn is a gas giant with a spectacular system of rings.",

        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Saturn_during_Equinox.jpg"
    },


    {
        title: "Uranus",

        description:
            "Uranus is an ice giant with an unusually tilted axis.",

        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Uranus2.jpg"
    },


    {
        title: "Neptune",

        description:
            "Neptune is the farthest major planet from the Sun and has very strong atmospheric winds.",

        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Neptune_Full.jpg"
    },


    {
        title: "Pluto",

        description:
            "Pluto is a dwarf planet in the outer Solar System.",

        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Pluto_in_True_Color_-_High_Res.jpg"
    },


    {
        title: "Asteroid Belt",

        description:
            "The asteroid belt contains many rocky objects mainly between Mars and Jupiter.",

        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Asteroid_Belt.jpg"
    },


    {
        title: "Planetary Orbits",

        description:
            "Planets travel around the Sun along orbital paths at different distances and periods.",

        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Orbital_planes.jpg"
    },


    {
        title: "Kuiper Belt",

        description:
            "The Kuiper Belt is a distant region beyond Neptune containing icy bodies and dwarf planets.",

        image:
            "https://commons.wikimedia.org/wiki/Special:FilePath/Kuiper_Belt.jpg"
    }

];


// ============================================================
// GLOBAL STATE
// ============================================================

let activeSimulator = null;

let activeMode = "lens";

let cleanup = null;

let graphHistory = [];

let selectedObject = null;

let hoveredObject = null;


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// ============================================================
// GET SIMULATOR DATA
// ============================================================

function getSimulatorData(mode) {

    return (
        SIMULATORS[mode] ||
        SIMULATORS.lens
    );

}


// ============================================================
// LAB CARDS
// ============================================================

function createLabCards(currentMode) {

    return Object.entries(
        SIMULATORS
    )
        .map(
            ([key, data], index) => `

                <button
                    type="button"
                    class="
                        physics-3d-lab-card
                        ${
                            key === currentMode
                                ? "is-active"
                                : ""
                        }
                    "
                    data-physics-mode="${escapeHtml(key)}"
                    style="
                        --lab-accent:${escapeHtml(data.accent)};
                    "
                    aria-label="Open ${escapeHtml(data.title)}"
                >

                    <span
                        class="
                            physics-3d-card-glow
                        "
                    ></span>


                    <span
                        class="
                            physics-3d-card-orbit
                            orbit-one
                        "
                    ></span>


                    <span
                        class="
                            physics-3d-card-orbit
                            orbit-two
                        "
                    ></span>


                    <span
                        class="
                            physics-3d-card-icon
                        "
                    >
                        ${data.icon}
                    </span>


                    <span
                        class="
                            physics-3d-card-number
                        "
                    >
                        ${String(index + 1).padStart(2, "0")}
                    </span>


                    <span
                        class="
                            physics-3d-card-status
                        "
                    >
                        ● READY
                    </span>


                    <span
                        class="
                            physics-3d-card-title
                        "
                    >
                        ${escapeHtml(data.title)}
                    </span>


                    <span
                        class="
                            physics-3d-card-subtitle
                        "
                    >
                        ${escapeHtml(data.subtitle)}
                    </span>

                </button>

            `
        )
        .join("");

}


// ============================================================
// SLIDER
// ============================================================

function slider(
    id,
    label,
    min,
    max,
    step,
    value,
    outputId,
    suffix = ""
) {

    return `

        <label
            class="
                physics-control-slider
            "
        >

            <div
                class="
                    physics-slider-head
                "
            >

                <span>
                    ${escapeHtml(label)}
                </span>


                <output
                    id="${outputId}"
                >
                    ${escapeHtml(value)}${suffix}
                </output>

            </div>


            <input
                id="${id}"
                type="range"
                min="${min}"
                max="${max}"
                step="${step}"
                value="${value}"
            />

        </label>

    `;

}


// ============================================================
// LENS POSITION BUTTONS
// ============================================================

function lensPositionButtons() {

    return `

        <div
            class="
                physics-lens-scenario
            "
        >

            <div
                class="
                    physics-lens-scenario-title
                "
            >
                OBJECT POSITION
            </div>


            <div
                class="
                    physics-lens-scenario-grid
                "
            >

                <button
                    type="button"
                    class="
                        physics-lens-scenario-btn
                    "
                    data-lens-scenario="infinity"
                >
                    ∞
                </button>


                <button
                    type="button"
                    class="
                        physics-lens-scenario-btn
                    "
                    data-lens-scenario="beyond-2f"
                >
                    &gt;2F
                </button>


                <button
                    type="button"
                    class="
                        physics-lens-scenario-btn
                    "
                    data-lens-scenario="2f"
                >
                    2F
                </button>


                <button
                    type="button"
                    class="
                        physics-lens-scenario-btn
                    "
                    data-lens-scenario="between-f-2f"
                >
                    F–2F
                </button>


                <button
                    type="button"
                    class="
                        physics-lens-scenario-btn
                    "
                    data-lens-scenario="f"
                >
                    F
                </button>


                <button
                    type="button"
                    class="
                        physics-lens-scenario-btn
                    "
                    data-lens-scenario="inside-f"
                >
                    O–F
                </button>

            </div>

        </div>


        <div
            class="
                physics-lens-ray-options
            "
        >

            <label
                class="
                    physics-check-row
                "
            >

                <input
                    id="p-show-rays"
                    type="checkbox"
                    checked
                />

                <span>
                    Show Principal Rays
                </span>

            </label>


            <label
                class="
                    physics-check-row
                "
            >

                <input
                    id="p-show-labels"
                    type="checkbox"
                    checked
                />

                <span>
                    Show F / 2F / O Labels
                </span>

            </label>

        </div>

    `;

}


// ============================================================
// CONTROLS
// ============================================================

function buildControls(
    mode,
    simulation
) {

    if (mode === "lens") {

        return `

            <label
                class="
                    physics-control-field
                "
            >

                <span>
                    Lens Type
                </span>


                <select
                    id="p-lens-type"
                >

                    <option value="convex">
                        Convex Lens
                    </option>

                    <option value="concave">
                        Concave Lens
                    </option>

                </select>

            </label>


            ${lensPositionButtons()}


            ${slider(
                "p-focal",
                "Focal Length",
                1,
                8,
                0.5,
                simulation.focalLength,
                "p-focal-value",
                " units"
            )}


            ${slider(
                "p-distance",
                "Object Distance",
                2,
                14,
                0.5,
                Number.isFinite(
                    simulation.objectDistance
                )
                    ? simulation.objectDistance
                    : 14,
                "p-distance-value",
                " units"
            )}


            ${slider(
                "p-height",
                "Object Height",
                0.5,
                5,
                0.25,
                simulation.objectHeight,
                "p-height-value",
                " units"
            )}

        `;

    }


    if (mode === "magnetic") {

        return `

            ${slider(
                "p-strength",
                "Magnet Strength",
                0,
                2,
                0.1,
                simulation.strength,
                "p-strength-value"
            )}


            ${slider(
                "p-speed",
                "Movement Speed",
                0,
                4,
                0.1,
                simulation.speed,
                "p-speed-value"
            )}


            ${slider(
                "p-turns",
                "Coil Turns",
                20,
                500,
                10,
                simulation.turns,
                "p-turns-value"
            )}


            ${slider(
                "p-resistance",
                "Resistance",
                1,
                50,
                1,
                simulation.resistance,
                "p-resistance-value",
                " Ω"
            )}

        `;

    }


    if (mode === "motor") {

        return `

            ${slider(
                "p-voltage",
                "Voltage",
                0,
                24,
                1,
                simulation.voltage,
                "p-voltage-value",
                " V"
            )}


            ${slider(
                "p-current",
                "Current",
                0,
                8,
                0.1,
                simulation.currentInput,
                "p-current-value",
                " A"
            )}


            ${slider(
                "p-field",
                "Magnetic Field",
                0,
                2,
                0.1,
                simulation.field,
                "p-field-value"
            )}


            ${slider(
                "p-coil-turns",
                "Coil Turns",
                20,
                300,
                10,
                simulation.turns,
                "p-coil-turns-value"
            )}

        `;

    }


    if (mode === "solar") {

        return `

            ${slider(
                "p-solar-speed",
                "Simulation Speed",
                0.1,
                4,
                0.1,
                simulation.speed,
                "p-solar-speed-value",
                "×"
            )}


            <label
                class="
                    physics-control-field
                "
            >

                <span>
                    Planet Focus
                </span>


                <select
                    id="p-focus"
                >

                    <option value="Earth">
                        Earth
                    </option>

                    <option value="Mercury">
                        Mercury
                    </option>

                    <option value="Venus">
                        Venus
                    </option>

                    <option value="Mars">
                        Mars
                    </option>

                    <option value="Jupiter">
                        Jupiter
                    </option>

                    <option value="Saturn">
                        Saturn
                    </option>

                    <option value="Uranus">
                        Uranus
                    </option>

                    <option value="Neptune">
                        Neptune
                    </option>

                    <option value="Pluto">
                        Pluto
                    </option>

                </select>

            </label>


            <label
                class="
                    physics-check-row
                "
            >

                <input
                    id="p-orbits"
                    type="checkbox"
                    checked
                />

                <span>
                    Show Orbit Paths
                </span>

            </label>


            <label
                class="
                    physics-check-row
                "
            >

                <input
                    id="p-labels"
                    type="checkbox"
                    checked
                />

                <span>
                    Show Planet Labels
                </span>

            </label>


            <label
                class="
                    physics-check-row
                "
            >

                <input
                    id="p-asteroids"
                    type="checkbox"
                    checked
                />

                <span>
                    Show Asteroid Belt
                </span>

            </label>


            <label
                class="
                    physics-check-row
                "
            >

                <input
                    id="p-kuiper"
                    type="checkbox"
                    checked
                />

                <span>
                    Show Kuiper Belt
                </span>

            </label>


            <label
                class="
                    physics-check-row
                "
            >

                <input
                    id="p-education-mode"
                    type="checkbox"
                    checked
                />

                <span>
                    Teacher Mode
                </span>

            </label>

        `;

    }


    return `

        <label
            class="
                physics-control-field
            "
        >

            <span>
                Experiment
            </span>


            <select
                id="p-exp"
            >

                <option value="Pendulum">
                    Pendulum
                </option>

                <option value="Spring">
                    Spring
                </option>

                <option value="Projectile">
                    Projectile
                </option>

                <option value="Collision">
                    Collision
                </option>

            </select>

        </label>


        <div
            id="virtual-controls"
        ></div>

    `;

}


// ============================================================
// VIRTUAL CONTROLS
// ============================================================

function buildVirtualControls(
    simulation
) {

    const container =
        document.getElementById(
            "virtual-controls"
        );


    if (!container) {

        return;

    }


    const experiment =
        simulation.experiment ||
        "Pendulum";


    if (
        experiment ===
        "Pendulum"
    ) {

        container.innerHTML = `

            ${slider(
                "v-length",
                "Length",
                0.4,
                3,
                0.1,
                simulation.length ?? 1.2,
                "v-length-value",
                " m"
            )}


            ${slider(
                "v-angle",
                "Angle",
                2,
                35,
                1,
                simulation.angle ?? 15,
                "v-angle-value",
                "°"
            )}

        `;

        return;

    }


    container.innerHTML = `

        <div
            class="
                physics-virtual-note
            "
        >
            This experiment is ready for
            additional controls.
        </div>

    `;

}


// ============================================================
// NUMBER FORMATTER
// ============================================================

function formatNumber(
    value,
    digits = 2
) {

    if (
        value === Infinity ||
        value === -Infinity
    ) {

        return "∞";

    }


    if (
        value === null ||
        value === undefined
    ) {

        return "—";

    }


    if (
        Number.isNaN(
            Number(value)
        )
    ) {

        return "—";

    }


    if (
        !Number.isFinite(
            Number(value)
        )
    ) {

        return "∞";

    }


    return Number(
        value
    ).toFixed(
        digits
    );

}


// ============================================================
// RESULT ROWS
// ============================================================

function resultRows(
    state,
    mode
) {

    if (
        mode ===
        "lens"
    ) {

        return [

            [
                "Object Position",
                state.objectPosition ||
                state.scenario ||
                "—"
            ],

            [
                "Focal Length",
                `${formatNumber(
                    state.focalLength
                )} units`
            ],

            [
                "Object Distance",
                Number.isFinite(
                    state.objectDistance
                )
                    ? `${formatNumber(
                        state.objectDistance
                    )} units`
                    : "∞"
            ],

            [
                "Image Distance",
                Number.isFinite(
                    state.imageDistance
                )
                    ? `${formatNumber(
                        state.imageDistance
                    )} units`
                    : "∞"
            ],

            [
                "Magnification",
                formatNumber(
                    state.magnification
                )
            ],

            [
                "Image Height",
                Number.isFinite(
                    state.imageHeight
                )
                    ? `${formatNumber(
                        state.imageHeight
                    )} units`
                    : "∞"
            ],

            [
                "Nature",
                state.nature ||
                state.imageType ||
                "—"
            ],

            [
                "Orientation",
                state.orientation ||
                "—"
            ],

            [
                "Size",
                state.size ||
                "—"
            ]

        ];

    }


    if (
        mode ===
        "magnetic"
    ) {

        return [

            [
                "Induced EMF",
                `${formatNumber(
                    state.emf,
                    3
                )} V`
            ],

            [
                "Current",
                `${formatNumber(
                    state.current,
                    3
                )} A`
            ],

            [
                "Magnetic Flux",
                `${formatNumber(
                    state.flux,
                    4
                )} Wb`
            ],

            [
                "Power",
                `${formatNumber(
                    state.power,
                    3
                )} W`
            ],

            [
                "Direction",
                state.direction ||
                "None"
            ]

        ];

    }


    if (
        mode ===
        "motor"
    ) {

        return [

            [
                "Torque",
                `${formatNumber(
                    state.torque,
                    3
                )} N·m`
            ],

            [
                "Rotation",
                `${formatNumber(
                    state.rpm,
                    0
                )} RPM`
            ],

            [
                "Current",
                `${formatNumber(
                    state.current,
                    2
                )} A`
            ],

            [
                "Power",
                `${formatNumber(
                    state.power,
                    1
                )} W`
            ],

            [
                "Efficiency",
                `${formatNumber(
                    state.efficiency,
                    0
                )}%`
            ]

        ];

    }


    if (
        mode ===
        "solar"
    ) {

        return [

            [
                "Selected",
                state.selected ||
                "Earth"
            ],

            [
                "Distance",
                state.distanceAU !==
                null &&
                state.distanceAU !==
                undefined
                    ? `${formatNumber(
                        state.distanceAU,
                        2
                    )} AU`
                    : "—"
            ],

            [
                "Diameter",
                state.diameterKm
                    ? `${Number(
                        state.diameterKm
                    ).toLocaleString()} km`
                    : "—"
            ],

            [
                "Gravity",
                state.gravity !==
                null &&
                state.gravity !==
                undefined
                    ? `${formatNumber(
                        state.gravity,
                        2
                    )} m/s²`
                    : "—"
            ],

            [
                "Orbital Period",
                state.periodDays
                    ? `${Number(
                        state.periodDays
                    ).toLocaleString()} days`
                    : "—"
            ],

            [
                "Moons",
                state.moons !==
                null &&
                state.moons !==
                undefined
                    ? String(
                        state.moons
                    )
                    : "—"
            ]

        ];

    }


    return [

        [
            "Experiment",
            state.experiment ||
            "Pendulum"
        ],

        [
            "Length",
            state.length !==
            undefined
                ? `${formatNumber(
                    state.length
                )} m`
                : "—"
        ],

        [
            "Angle",
            state.angle !==
            undefined
                ? `${formatNumber(
                    state.angle
                )}°`
                : "—"
        ],

        [
            "Period",
            state.period !==
            undefined
                ? `${formatNumber(
                    state.period
                )} s`
                : "—"
        ]

    ];

}


// ============================================================
// RESULTS HTML
// ============================================================

function renderResults(
    state,
    mode
) {

    return resultRows(
        state,
        mode
    )
        .map(
            (
                [label, value]
            ) => `

                <div
                    class="
                        physics-live-result
                    "
                >

                    <span>
                        ${escapeHtml(label)}
                    </span>


                    <strong>
                        ${escapeHtml(value)}
                    </strong>

                </div>

            `
        )
        .join("");

}


// ============================================================
// GRAPH VALUE
// ============================================================

function graphValue(
    state,
    mode
) {

    if (
        mode ===
        "magnetic"
    ) {

        return Number(
            state.emf
        ) || 0;

    }


    if (
        mode ===
        "motor"
    ) {

        return Number(
            state.rpm
        ) || 0;

    }


    if (
        mode ===
        "solar"
    ) {

        return Number(
            state.speed
        ) || 0;

    }


    if (
        mode ===
        "lens"
    ) {

        return Number.isFinite(
            state.imageDistance
        )
            ? state.imageDistance
            : 0;

    }


    return Number(
        state.angle
    ) || 0;

}


// ============================================================
// GRAPH LABEL
// ============================================================

function graphLabel(
    state,
    mode
) {

    if (
        mode ===
        "magnetic"
    ) {

        return "Induced EMF";

    }


    if (
        mode ===
        "motor"
    ) {

        return "RPM";

    }


    if (
        mode ===
        "solar"
    ) {

        return "Simulation Speed";

    }


    if (
        mode ===
        "lens"
    ) {

        return "Image Distance";

    }


    return (
        state.experiment ||
        "Experiment Value"
    );

}


// ============================================================
// DRAW GRAPH
// ============================================================

function drawGraph(
    canvas,
    history,
    label
) {

    if (!canvas) {

        return;

    }


    const context =
        canvas.getContext(
            "2d"
        );


    if (!context) {

        return;

    }


    const width =
        canvas.width;


    const height =
        canvas.height;


    context.clearRect(
        0,
        0,
        width,
        height
    );


    context.strokeStyle =
        "rgba(148,163,184,.14)";


    context.lineWidth =
        1;


    for (
        let y = 28;
        y < height - 25;
        y += 38
    ) {

        context.beginPath();

        context.moveTo(
            45,
            y
        );

        context.lineTo(
            width - 18,
            y
        );

        context.stroke();

    }


    if (
        history.length >=
        2
    ) {

        const maxAbs =
            Math.max(
                1,
                ...history.map(
                    value =>
                        Math.abs(value)
                )
            );


        const min =
            -maxAbs;


        const max =
            maxAbs;


        const chartWidth =
            width -
            70;


        const chartHeight =
            height -
            55;


        context.strokeStyle =
            "#60a5fa";


        context.lineWidth =
            2.5;


        context.beginPath();


        history.forEach(
            (
                value,
                index
            ) => {

                const x =
                    45 +
                    (
                        index /
                        Math.max(
                            1,
                            history.length - 1
                        )
                    ) *
                    chartWidth;


                const y =
                    20 +
                    (
                        1 -
                        (
                            (
                                value -
                                min
                            ) /
                            (
                                max -
                                min
                            )
                        )
                    ) *
                    chartHeight;


                if (
                    index ===
                    0
                ) {

                    context.moveTo(
                        x,
                        y
                    );

                } else {

                    context.lineTo(
                        x,
                        y
                    );

                }

            }
        );


        context.stroke();

    }


    context.fillStyle =
        "#94a3b8";


    context.font =
        "12px Arial";


    context.fillText(
        label,
        10,
        17
    );

}


// ============================================================
// TEACHER EXPLANATION
// ============================================================

function getTeacherExplanation(
    mode,
    state = null
) {

    if (
        mode ===
        "lens"
    ) {

        if (!state) {

            return (
                "Select an object position to observe how principal rays determine the image."
            );

        }


        return (

            `${state.nature || state.imageType || "Observe the rays."} ` +

            `The object is ${String(
                state.objectPosition ||
                state.scenario ||
                "at the selected position"
            ).toLowerCase()}. ` +

            (
                state.lensType === "convex"
                    ? "For a convex lens, use the parallel ray, optical-center ray and focal ray to locate the image."
                    : "For a concave lens, the refracted rays diverge and their backward extensions locate the virtual image."
            )

        );

    }


    if (
        mode ===
        "magnetic"
    ) {

        return (
            "Move the magnet faster, increase coil turns or change magnet strength and observe induced EMF."
        );

    }


    if (
        mode ===
        "motor"
    ) {

        return (
            "Increase current or magnetic field strength and observe how torque and rotation respond."
        );

    }


    if (
        mode ===
        "solar"
    ) {

        return (
            "Select a planet or Solar System component. Compare distance, diameter, gravity, moons and orbital period."
        );

    }


    return (
        "Change the experiment parameters and observe the resulting physical quantities."
    );

}


// ============================================================
// SOLAR GALLERY
// ============================================================

function createSolarGallery() {

    return `

        <section
            id="physics-gallery-view"
            class="
                physics-gallery-view
            "
            hidden
        >

            <div
                class="
                    physics-gallery-view-header
                "
            >

                <div>

                    <span>
                        SCILAB • ASTRONOMY
                    </span>


                    <h3>
                        Solar System Gallery
                    </h3>


                    <p>
                        Explore educational images of
                        the Sun, planets and major
                        Solar System components.
                    </p>

                </div>


                <button
                    id="physics-gallery-back"
                    type="button"
                    class="
                        physics-sim-btn
                        primary
                    "
                >
                    ← Back to 3D
                </button>

            </div>


            <div
                id="solar-system-gallery-grid"
                class="
                    solar-system-gallery-grid
                "
            ></div>

        </section>

    `;

}


// ============================================================
// RENDER GALLERY
// ============================================================

function renderSolarGallery() {

    const grid =
        document.getElementById(
            "solar-system-gallery-grid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML =
        solarSystemGallery
            .map(
                item => `

                    <article
                        class="
                            solar-gallery-card
                        "
                    >

                        <div
                            class="
                                solar-gallery-image-box
                            "
                        >

                            <img
                                src="${escapeHtml(
                                    item.image
                                )}"
                                alt="${escapeHtml(
                                    item.title
                                )}"
                                loading="lazy"
                            />

                        </div>


                        <div
                            class="
                                solar-gallery-card-body
                            "
                        >

                            <span
                                class="
                                    solar-gallery-label
                                "
                            >
                                SOLAR SYSTEM
                            </span>


                            <h4>
                                ${escapeHtml(
                                    item.title
                                )}
                            </h4>


                            <p>
                                ${escapeHtml(
                                    item.description
                                )}
                            </p>

                        </div>

                    </article>

                `
            )
            .join("");

}


// ============================================================
// PAGE HTML
// ============================================================

function buildPage(
    mode
) {

    const data =
        getSimulatorData(
            mode
        );


    return `

        <section
            id="physics-simulation-page"
            class="
                physics-simulation-page
                physics-mode-${escapeHtml(mode)}
            "
            data-mode="${escapeHtml(mode)}"
        >

            <!-- =================================================
                 HEADER
            ================================================= -->

            <header
                class="
                    physics-simulation-header
                "
            >

                <div>

                    <span
                        class="
                            physics-simulation-kicker
                        "
                    >
                        SCILAB • PHYSICS • INTERACTIVE LAB
                    </span>


                    <h1
                        id="physics-sim-title"
                    >
                        ${escapeHtml(
                            data.title
                        )}
                    </h1>


                    <p
                        id="physics-sim-description"
                    >
                        ${escapeHtml(
                            data.description
                        )}
                    </p>

                </div>


                <button
                    type="button"
                    id="physics-sim-back"
                    class="
                        physics-back-button
                    "
                >
                    ← Physics
                </button>

            </header>


            <!-- =================================================
                 LAB CARDS
            ================================================= -->

            <section
                class="
                    physics-3d-lab-selector
                "
            >

                <div
                    class="
                        physics-selector-heading
                    "
                >

                    <div>

                        <span>
                            PHYSICS LABS
                        </span>


                        <h2>
                            Choose another laboratory
                        </h2>

                    </div>


                    <span
                        class="
                            physics-selector-status
                        "
                    >
                        05 LABS READY
                    </span>

                </div>


                <div
                    id="physics-3d-lab-cards"
                    class="
                        physics-3d-lab-cards
                    "
                >

                    ${createLabCards(
                        mode
                    )}

                </div>

            </section>


            <!-- =================================================
                 TOOLBAR
            ================================================= -->

            <section
                class="
                    physics-sim-toolbar
                "
            >

                <button
                    type="button"
                    id="physics-start"
                    class="
                        physics-sim-btn
                        primary
                    "
                >
                    ▶ Start
                </button>


                <button
                    type="button"
                    id="physics-pause"
                    class="
                        physics-sim-btn
                    "
                >
                    ⏸ Pause
                </button>


                <button
                    type="button"
                    id="physics-reset"
                    class="
                        physics-sim-btn
                    "
                >
                    ↺ Reset
                </button>


                <button
                    type="button"
                    id="physics-rotate"
                    class="
                        physics-sim-btn
                    "
                >
                    ◉ Auto Rotate
                </button>


                ${
                    mode ===
                    "solar"
                        ? `
                            <button
                                type="button"
                                id="physics-gallery-open"
                                class="
                                    physics-sim-btn
                                "
                            >
                                🖼 Solar System Gallery
                            </button>
                        `
                        : ""
                }


                <span
                    id="physics-status"
                    class="
                        physics-sim-status
                    "
                >
                    READY
                </span>

            </section>


            <!-- =================================================
                 MAIN WORKSPACE
            ================================================= -->

            <main
                class="
                    physics-sim-workspace
                "
            >

                <!-- =============================================
                     CONTROLS
                ============================================== -->

                <aside
                    class="
                        physics-panel
                        physics-controls-panel
                    "
                >

                    <div
                        class="
                            physics-panel-header
                        "
                    >

                        <span>
                            CONTROLS
                        </span>


                        <small>
                            Experiment parameters
                        </small>

                    </div>


                    <div
                        id="physics-controls"
                        class="
                            physics-controls-content
                        "
                    ></div>

                </aside>


                <!-- =============================================
                     CENTER 3D
                ============================================== -->

                <section
                    class="
                        physics-panel
                        physics-3d-panel
                    "
                >

                    <div
                        class="
                            physics-panel-header
                        "
                    >

                        <span>
                            LIVE 3D SIMULATION
                        </span>


                        <small
                            id="physics-live-phase"
                        >
                            READY
                        </small>

                    </div>


                    <div
                        class="
                            physics-center-view
                        "
                    >

                        <div
                            id="physics-canvas"
                            class="
                                physics-canvas
                            "
                        ></div>


                        <div
                            id="physics-hover-tooltip"
                            class="
                                physics-hover-tooltip
                            "
                            hidden
                        ></div>


                        ${
                            mode ===
                            "solar"
                                ? createSolarGallery()
                                : ""
                        }

                    </div>


                    <div
                        id="physics-selection-info"
                        class="
                            physics-selection-info
                        "
                    >

                        <span>
                            SELECTED STRUCTURE
                        </span>


                        <strong>
                            Nothing selected
                        </strong>


                        <p>
                            Click an object in the
                            3D simulation to learn more.
                        </p>

                    </div>

                </section>


                <!-- =============================================
                     RESULTS
                ============================================== -->

                <aside
                    class="
                        physics-panel
                        physics-results-panel
                    "
                >

                    <div
                        class="
                            physics-panel-header
                        "
                    >

                        <span>
                            LIVE RESULTS
                        </span>


                        <small>
                            Calculated values
                        </small>

                    </div>


                    <div
                        id="physics-results"
                        class="
                            physics-results
                        "
                    ></div>

                </aside>

            </main>


            <!-- =================================================
                 BOTTOM
            ================================================= -->

            <section
                class="
                    physics-bottom-grid
                "
            >

                <div
                    class="
                        physics-panel
                        physics-teacher-panel
                    "
                >

                    <div
                        class="
                            physics-panel-header
                        "
                    >

                        <span>
                            TEACHER MODE
                        </span>


                        <small>
                            Classroom explanation
                        </small>

                    </div>


                    <div
                        class="
                            physics-teacher-content
                        "
                    >

                        <span
                            class="
                                physics-teacher-badge
                            "
                        >
                            👨‍🏫 TEACHER READY
                        </span>


                        <h3>
                            Guided Observation
                        </h3>


                        <p
                            id="physics-teacher-text"
                        >
                            ${escapeHtml(
                                data.teacher
                            )}
                        </p>

                    </div>

                </div>


                <div
                    class="
                        physics-panel
                        physics-graph-panel
                    "
                >

                    <div
                        class="
                            physics-panel-header
                        "
                    >

                        <span>
                            LIVE GRAPH
                        </span>


                        <small
                            id="physics-graph-label"
                        >
                            Value
                        </small>

                    </div>


                    <canvas
                        id="physics-graph"
                        width="1000"
                        height="260"
                    ></canvas>

                </div>

            </section>

        </section>

    `;

}


// ============================================================
// CREATE PAGE
// ============================================================

export function createPhysicsSimulationPage(
    mode
) {

    const safeMode =
        SIMULATORS[mode]
            ? mode
            : "lens";


    setTimeout(
        () => {

            init(
                safeMode
            );

        },
        0
    );


    return buildPage(
        safeMode
    );

}


// ============================================================
// INITIALIZE
// ============================================================

function init(
    mode
) {

    cleanup?.();


    activeMode =
        mode;


    graphHistory =
        [];

    selectedObject =
        null;

    hoveredObject =
        null;


    const data =
        getSimulatorData(
            mode
        );


    const canvasContainer =
        document.getElementById(
            "physics-canvas"
        );


    const controlsContainer =
        document.getElementById(
            "physics-controls"
        );


    const resultsContainer =
        document.getElementById(
            "physics-results"
        );


    const graphCanvas =
        document.getElementById(
            "physics-graph"
        );


    const teacherText =
        document.getElementById(
            "physics-teacher-text"
        );


    const livePhase =
        document.getElementById(
            "physics-live-phase"
        );


    const status =
        document.getElementById(
            "physics-status"
        );


    const tooltip =
        document.getElementById(
            "physics-hover-tooltip"
        );


    if (
        !canvasContainer ||
        !controlsContainer
    ) {

        console.warn(
            "Physics: required containers not found."
        );

        return;

    }


    // ========================================================
    // CREATE SIMULATOR
    // ========================================================

    const Simulation =
        data.classRef;


    try {

        activeSimulator =
            new Simulation();

    } catch (error) {

        console.error(
            "Physics simulator creation failed:",
            error
        );

        return;

    }


    // ========================================================
    // CONTROLS
    // ========================================================

    controlsContainer.innerHTML =
        buildControls(
            mode,
            activeSimulator
        );


    // ========================================================
    // SCENE
    // ========================================================

    const scene =
        new THREE.Scene();


    scene.background =
        new THREE.Color(
            0x020814
        );


    // ========================================================
    // CAMERA
    // ========================================================

    const camera =
        new THREE.PerspectiveCamera(
            mode === "solar"
                ? 45
                : 42,
            1,
            0.05,
            4000
        );


    camera.position.set(
        10,
        5,
        12
    );


    // ========================================================
    // RENDERER
    // ========================================================

    const renderer =
        new THREE.WebGLRenderer({

            antialias:
                true,

            alpha:
                false,

            powerPreference:
                "high-performance"

        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    renderer.shadowMap.enabled =
        true;


    renderer.shadowMap.type =
        THREE.PCFShadowMap;


    renderer.domElement.style.display =
        "block";


    renderer.domElement.style.width =
        "100%";


    renderer.domElement.style.height =
        "100%";


    canvasContainer.innerHTML =
        "";


    canvasContainer.appendChild(
        renderer.domElement
    );


    // ========================================================
    // LIGHTING
    // ========================================================

    const ambient =
        new THREE.AmbientLight(
            0xffffff,
            mode === "solar"
                ? 1.0
                : 1.4
        );


    scene.add(
        ambient
    );


    const key =
        new THREE.DirectionalLight(
            0xffffff,
            2.1
        );


    key.position.set(
        8,
        12,
        10
    );


    key.castShadow =
        true;


    scene.add(
        key
    );


    const fill =
        new THREE.DirectionalLight(
            0x60a5fa,
            1.5
        );


    fill.position.set(
        -8,
        6,
        -6
    );


    scene.add(
        fill
    );


    const rim =
        new THREE.PointLight(
            0xa78bfa,
            1.4,
            100
        );


    rim.position.set(
        0,
        5,
        -10
    );


    scene.add(
        rim
    );


    // ========================================================
    // ORBIT CONTROLS
    // ========================================================

    const orbitControls =
        new OrbitControls(
            camera,
            renderer.domElement
        );


    orbitControls.enableDamping =
        true;


    orbitControls.dampingFactor =
        0.07;


    orbitControls.enablePan =
        true;


    orbitControls.screenSpacePanning =
        true;


    orbitControls.minDistance =
        mode === "solar"
            ? 6
            : 1;


    orbitControls.maxDistance =
        mode === "solar"
            ? 220
            : 100;


    orbitControls.rotateSpeed =
        0.65;


    orbitControls.zoomSpeed =
        0.9;


    orbitControls.panSpeed =
        0.65;


    orbitControls.autoRotate =
        false;


    orbitControls.autoRotateSpeed =
        0.65;


    // ========================================================
    // SIMULATION OBJECT
    // ========================================================

    const simulationObject =
        activeSimulator.getObject?.();


    if (
        !simulationObject
    ) {

        console.error(
            "Physics: simulator returned no 3D object."
        );

        return;

    }


    scene.add(
        simulationObject
    );


    simulationObject.traverse(
        object => {

            if (
                object.isMesh
            ) {

                object.castShadow =
                    true;

                object.receiveShadow =
                    true;

            }

        }
    );


    // ========================================================
    // CAMERA FIT
    // ========================================================

    const fitCamera =
        (
            targetObject = simulationObject,
            forceDistance = null
        ) => {

            if (!targetObject) {

                return;

            }


            targetObject.updateMatrixWorld(
                true
            );


            const box =
                new THREE.Box3()
                    .setFromObject(
                        targetObject
                    );


            if (
                box.isEmpty()
            ) {

                return;

            }


            const center =
                box.getCenter(
                    new THREE.Vector3()
                );


            const size =
                box.getSize(
                    new THREE.Vector3()
                );


            const maxDimension =
                Math.max(
                    size.x,
                    size.y,
                    size.z,
                    1
                );


            let distance;


            if (
                forceDistance !==
                null
            ) {

                distance =
                    forceDistance;

            } else if (
                mode ===
                "solar"
            ) {

                distance =
                    Math.max(
                        maxDimension *
                        0.72,
                        48
                    );

            } else if (
                mode ===
                "lens"
            ) {

                distance =
                    Math.max(
                        maxDimension *
                        1.15,
                        7
                    );

            } else {

                distance =
                    Math.max(
                        maxDimension *
                        1.08,
                        7
                    );

            }


            if (
                mode ===
                "solar"
            ) {

                camera.position.set(

                    center.x,

                    center.y +
                        distance *
                        0.42,

                    center.z +
                        distance

                );

            } else if (
                mode ===
                "lens"
            ) {

                // More front-on for teaching lens optics.

                camera.position.set(

                    center.x,

                    center.y +
                        distance *
                        0.10,

                    center.z +
                        distance

                );

            } else {

                camera.position.set(

                    center.x +
                        distance *
                        0.76,

                    center.y +
                        distance *
                        0.30,

                    center.z +
                        distance *
                        0.76

                );

            }


            orbitControls.target.copy(
                center
            );


            camera.lookAt(
                center
            );


            orbitControls.update();

        };


    // ========================================================
    // RESIZE
    // ========================================================

    const resize =
        () => {

            const width =
                Math.max(
                    canvasContainer.clientWidth ||
                        1,
                    1
                );


            const height =
                Math.max(
                    canvasContainer.clientHeight ||
                        1,
                    1
                );


            renderer.setSize(
                width,
                height,
                false
            );


            camera.aspect =
                width /
                height;


            camera.updateProjectionMatrix();

        };


    resize();


    requestAnimationFrame(
        () => {

            resize();


            if (
                mode ===
                "solar"
            ) {

                fitCamera(
                    simulationObject,
                    48
                );

            } else {

                fitCamera();

            }

        }
    );


    // ========================================================
    // RAYCASTER
    // ========================================================

    const raycaster =
        new THREE.Raycaster();


    const pointer =
        new THREE.Vector2();


    let pointerDownX =
        0;


    let pointerDownY =
        0;


    // ========================================================
    // RESOLVE COMPONENT DATA
    // ========================================================

    const resolveComponentData =
        object => {

            let current =
                object;


            while (
                current &&
                !current.userData?.name
            ) {

                current =
                    current.parent;

            }


            if (
                !current
            ) {

                return null;

            }


            if (
                activeSimulator
                    ?.getEducationalData
            ) {

                return (
                    activeSimulator
                        .getEducationalData(
                            current.userData?.name ||
                            current.name
                        ) ||
                    current.userData ||
                    null
                );

            }


            return (
                current.userData ||
                null
            );

        };


    // ========================================================
    // SELECTION PANEL
    // ========================================================

    const updateSelectionPanel =
        dataObject => {

            const panel =
                document.getElementById(
                    "physics-selection-info"
                );


            if (!panel) {

                return;

            }


            if (!dataObject) {

                panel.innerHTML = `

                    <span>
                        SELECTED STRUCTURE
                    </span>


                    <strong>
                        Nothing selected
                    </strong>


                    <p>
                        Click an object in the
                        3D simulation to learn more.
                    </p>

                `;

                return;

            }


            const facts =
                Array.isArray(
                    dataObject.facts
                )
                    ? dataObject.facts
                    : [];


            const stats =
                dataObject.stats ||
                {};


            const factHtml =
                facts.length
                    ? `

                        <div
                            class="
                                physics-selection-facts
                            "
                        >

                            ${facts
                                .map(
                                    fact => `
                                        <div>
                                            • ${escapeHtml(
                                                fact
                                            )}
                                        </div>
                                    `
                                )
                                .join("")
                            }

                        </div>

                    `
                    : "";


            const statsHtml =
                Object.keys(
                    stats
                ).length
                    ? `

                        <div
                            class="
                                physics-selection-stats
                            "
                        >

                            ${Object.entries(
                                stats
                            )
                                .map(
                                    (
                                        [
                                            label,
                                            value
                                        ]
                                    ) => `

                                        <div>

                                            <span>
                                                ${escapeHtml(
                                                    label
                                                )}
                                            </span>


                                            <strong>
                                                ${escapeHtml(
                                                    value
                                                )}
                                            </strong>

                                        </div>

                                    `
                                )
                                .join("")
                            }

                        </div>

                    `
                    : "";


            panel.innerHTML = `

                <span>
                    ${escapeHtml(
                        dataObject.category ||
                        "SELECTED STRUCTURE"
                    )}
                </span>


                <strong>
                    ${escapeHtml(
                        dataObject.name ||
                        "Unknown"
                    )}
                </strong>


                <p>
                    ${escapeHtml(
                        dataObject.description ||
                        ""
                    )}
                </p>


                ${factHtml}


                ${statsHtml}

            `;

        };


    // ========================================================
    // SELECT OBJECT
    // ========================================================

    const selectObject =
        event => {

            const selectable =
                activeSimulator
                    ?.getSelectableObjects?.() ||
                [];


            if (
                !selectable.length
            ) {

                return;

            }


            const rect =
                renderer
                    .domElement
                    .getBoundingClientRect();


            if (
                rect.width <=
                0 ||
                rect.height <=
                0
            ) {

                return;

            }


            pointer.x =
                (
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width
                ) *
                2 -
                1;


            pointer.y =
                -(
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height
                ) *
                2 +
                1;


            raycaster.setFromCamera(
                pointer,
                camera
            );


            const hits =
                raycaster.intersectObjects(
                    selectable,
                    true
                );


            if (
                !hits.length
            ) {

                return;

            }


            selectedObject =
                hits[0].object;


            const dataObject =
                resolveComponentData(
                    selectedObject
                );


            if (
                !dataObject
            ) {

                return;

            }


            updateSelectionPanel(
                dataObject
            );


            if (
                teacherText
            ) {

                teacherText.textContent =
                    dataObject.teacher ||
                    dataObject.description ||
                    "";

            }


            if (
                mode ===
                "solar"
            ) {

                activeSimulator
                    ?.selectComponent?.(
                        selectedObject
                    );


                if (
                    dataObject.type ===
                    "planet"
                ) {

                    const target =
                        new THREE.Vector3();


                    selectedObject
                        .getWorldPosition(
                            target
                        );


                    orbitControls.target.copy(
                        target
                    );


                    camera.lookAt(
                        target
                    );


                    orbitControls.update();

                }

            }

        };


    // ========================================================
    // POINTER DOWN
    // ========================================================

    const pointerDown =
        event => {

            pointerDownX =
                event.clientX;


            pointerDownY =
                event.clientY;

        };


    // ========================================================
    // POINTER UP
    // ========================================================

    const pointerUp =
        event => {

            const movement =
                Math.hypot(

                    event.clientX -
                        pointerDownX,

                    event.clientY -
                        pointerDownY

                );


            if (
                movement >
                7
            ) {

                return;

            }


            selectObject(
                event
            );

        };


    renderer.domElement.addEventListener(
        "pointerdown",
        pointerDown
    );


    renderer.domElement.addEventListener(
        "pointerup",
        pointerUp
    );


    // ========================================================
    // HOVER TOOLTIP
    // ========================================================

    const updateHover =
        event => {

            if (!tooltip) {

                return;

            }


            const objects =
                activeSimulator
                    ?.getHoverableObjects?.() ||
                activeSimulator
                    ?.getSelectableObjects?.() ||
                [];


            if (
                !objects.length
            ) {

                tooltip.hidden =
                    true;

                return;

            }


            const rect =
                renderer
                    .domElement
                    .getBoundingClientRect();


            pointer.x =
                (
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width
                ) *
                2 -
                1;


            pointer.y =
                -(
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height
                ) *
                2 +
                1;


            raycaster.setFromCamera(
                pointer,
                camera
            );


            const hits =
                raycaster.intersectObjects(
                    objects,
                    true
                );


            if (
                !hits.length
            ) {

                hoveredObject =
                    null;

                tooltip.hidden =
                    true;

                renderer.domElement.style.cursor =
                    "default";

                return;

            }


            hoveredObject =
                hits[0].object;


            const dataObject =
                resolveComponentData(
                    hoveredObject
                );


            if (
                !dataObject
            ) {

                tooltip.hidden =
                    true;

                return;

            }


            tooltip.innerHTML = `

                <strong>
                    ${escapeHtml(
                        dataObject.name ||
                        "Component"
                    )}
                </strong>


                <span>
                    ${escapeHtml(
                        dataObject.category ||
                        "Physics"
                    )}
                </span>

            `;


            tooltip.hidden =
                false;


            tooltip.style.left =
                `${
                    event.clientX -
                    rect.left +
                    15
                }px`;


            tooltip.style.top =
                `${
                    event.clientY -
                    rect.top +
                    15
                }px`;


            renderer.domElement.style.cursor =
                "pointer";

        };


    renderer.domElement.addEventListener(
        "pointermove",
        updateHover
    );


    renderer.domElement.addEventListener(
        "pointerleave",
        () => {

            hoveredObject =
                null;


            if (
                tooltip
            ) {

                tooltip.hidden =
                    true;

            }


            renderer.domElement.style.cursor =
                "default";

        }
    );


    // ========================================================
    // LENS UI HELPERS
    // ========================================================

    const getLensScenarioButtons =
        () =>
            Array.from(
                document.querySelectorAll(
                    "[data-lens-scenario]"
                )
            );


    const updateLensScenarioButtons =
        scenario => {

            getLensScenarioButtons()
                .forEach(
                    button => {

                        button.classList.toggle(
                            "is-active",
                            button.dataset
                                .lensScenario ===
                            scenario
                        );

                    }
                );

        };


    const refreshLensControls =
        state => {

            if (
                mode !==
                "lens"
            ) {

                return;

            }


            const focalInput =
                document.getElementById(
                    "p-focal"
                );


            const focalOutput =
                document.getElementById(
                    "p-focal-value"
                );


            const distanceInput =
                document.getElementById(
                    "p-distance"
                );


            const distanceOutput =
                document.getElementById(
                    "p-distance-value"
                );


            const heightInput =
                document.getElementById(
                    "p-height"
                );


            const heightOutput =
                document.getElementById(
                    "p-height-value"
                );


            const lensTypeSelect =
                document.getElementById(
                    "p-lens-type"
                );


            const showRays =
                document.getElementById(
                    "p-show-rays"
                );


            const showLabels =
                document.getElementById(
                    "p-show-labels"
                );


            if (
                focalInput &&
                Number.isFinite(
                    state.focalLength
                )
            ) {

                focalInput.value =
                    String(
                        state.focalLength
                    );

            }


            if (
                focalOutput
            ) {

                focalOutput.textContent =
                    `${formatNumber(
                        state.focalLength
                    )} units`;

            }


            if (
                distanceInput
            ) {

                if (
                    Number.isFinite(
                        state.objectDistance
                    )
                ) {

                    distanceInput.value =
                        String(
                            Math.min(
                                14,
                                state.objectDistance
                            )
                        );

                    distanceInput.disabled =
                        false;

                } else {

                    distanceInput.disabled =
                        true;

                    distanceInput.value =
                        distanceInput.max;

                }

            }


            if (
                distanceOutput
            ) {

                distanceOutput.textContent =
                    Number.isFinite(
                        state.objectDistance
                    )
                        ? `${formatNumber(
                            state.objectDistance
                        )} units`
                        : "∞";

            }


            if (
                heightInput &&
                Number.isFinite(
                    state.objectHeight
                )
            ) {

                heightInput.value =
                    String(
                        state.objectHeight
                    );

            }


            if (
                heightOutput
            ) {

                heightOutput.textContent =
                    `${formatNumber(
                        state.objectHeight
                    )} units`;

            }


            if (
                lensTypeSelect
            ) {

                lensTypeSelect.value =
                    state.lensType ||
                    "convex";

            }


            if (
                showRays
            ) {

                showRays.checked =
                    activeSimulator
                        .showRays !==
                    false;

            }


            if (
                showLabels
            ) {

                showLabels.checked =
                    activeSimulator
                        .showLabels !==
                    false;

            }


            updateLensScenarioButtons(
                state.scenario
            );

        };


    // ========================================================
    // REFRESH UI
    // ========================================================

    const refresh =
        () => {

            const state =
                activeSimulator
                    ?.getState?.();


            if (
                !state
            ) {

                return;

            }


            if (
                resultsContainer
            ) {

                resultsContainer.innerHTML =
                    renderResults(
                        state,
                        mode
                    );

            }


            if (
                livePhase
            ) {

                livePhase.textContent =
                    state.objectPosition ||
                    state.selected ||
                    state.direction ||
                    state.experiment ||
                    "LIVE";

            }


            if (
                mode ===
                "lens"
            ) {

                refreshLensControls(
                    state
                );

            }


            if (
                !selectedObject &&
                teacherText
            ) {

                teacherText.textContent =
                    getTeacherExplanation(
                        mode,
                        state
                    );

            }


            const currentValue =
                graphValue(
                    state,
                    mode
                );


            graphHistory.push(
                Number.isFinite(
                    currentValue
                )
                    ? currentValue
                    : 0
            );


            if (
                graphHistory.length >
                120
            ) {

                graphHistory.shift();

            }


            drawGraph(
                graphCanvas,
                graphHistory,
                graphLabel(
                    state,
                    mode
                )
            );


            const graphLabelElement =
                document.getElementById(
                    "physics-graph-label"
                );


            if (
                graphLabelElement
            ) {

                graphLabelElement.textContent =
                    graphLabel(
                        state,
                        mode
                    );

            }

        };


    // ========================================================
    // BIND SLIDER
    // ========================================================

    const bindSlider =
        (
            id,
            setter,
            outputId,
            suffix = ""
        ) => {

            const input =
                document.getElementById(
                    id
                );


            if (
                !input
            ) {

                return;

            }


            input.addEventListener(
                "input",
                () => {

                    try {

                        setter?.(
                            input.value
                        );

                    } catch (
                        error
                    ) {

                        console.warn(
                            `Physics control ${id} failed:`,
                            error
                        );

                    }


                    const output =
                        document.getElementById(
                            outputId
                        );


                    if (
                        output
                    ) {

                        output.textContent =
                            `${input.value}${suffix}`;

                    }


                    refresh();

                }
            );

        };


    // ========================================================
    // LENS CONTROLS
    // ========================================================

    if (
        mode ===
        "lens"
    ) {

        // ----------------------------------------------------
        // Lens type
        // ----------------------------------------------------

        document
            .getElementById(
                "p-lens-type"
            )
            ?.addEventListener(
                "change",
                event => {

                    activeSimulator
                        ?.setLensType?.(
                            event.target.value
                        );


                    selectedObject =
                        null;


                    updateSelectionPanel(
                        null
                    );


                    requestAnimationFrame(
                        () => {

                            fitCamera();

                        }
                    );


                    refresh();

                }
            );


        // ----------------------------------------------------
        // Scenario buttons
        // ----------------------------------------------------

        getLensScenarioButtons()
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const scenario =
                                button.dataset
                                    .lensScenario;


                            if (
                                !scenario
                            ) {

                                return;

                            }


                            activeSimulator
                                ?.setScenario?.(
                                    scenario
                                );


                            selectedObject =
                                null;


                            updateSelectionPanel(
                                null
                            );


                            updateLensScenarioButtons(
                                scenario
                            );


                            requestAnimationFrame(
                                () => {

                                    fitCamera();

                                }
                            );


                            refresh();

                        }
                    );

                }
            );


        // ----------------------------------------------------
        // Focal length
        // ----------------------------------------------------

        bindSlider(

            "p-focal",

            value =>
                activeSimulator
                    ?.setFocalLength?.(
                        value
                    ),

            "p-focal-value",

            " units"

        );


        // ----------------------------------------------------
        // Object distance
        // ----------------------------------------------------

        bindSlider(

            "p-distance",

            value => {

                activeSimulator
                    ?.setObjectDistance?.(
                        value
                    );

                updateLensScenarioButtons(
                    "custom"
                );

            },

            "p-distance-value",

            " units"

        );


        // ----------------------------------------------------
        // Object height
        // ----------------------------------------------------

        bindSlider(

            "p-height",

            value =>
                activeSimulator
                    ?.setObjectHeight?.(
                        value
                    ),

            "p-height-value",

            " units"

        );


        // ----------------------------------------------------
        // Rays
        // ----------------------------------------------------

        document
            .getElementById(
                "p-show-rays"
            )
            ?.addEventListener(
                "change",
                event => {

                    activeSimulator
                        ?.setShowRays?.(
                            event.target.checked
                        );


                    refresh();

                }
            );


        // ----------------------------------------------------
        // Labels
        // ----------------------------------------------------

        document
            .getElementById(
                "p-show-labels"
            )
            ?.addEventListener(
                "change",
                event => {

                    activeSimulator
                        ?.setShowLabels?.(
                            event.target.checked
                        );


                    refresh();

                }
            );

    }


    // ========================================================
    // MAGNETIC CONTROLS
    // ========================================================

    if (
        mode ===
        "magnetic"
    ) {

        bindSlider(

            "p-strength",

            value =>
                activeSimulator
                    ?.setMagnetStrength?.(
                        value
                    ),

            "p-strength-value"

        );


        bindSlider(

            "p-speed",

            value =>
                activeSimulator
                    ?.setSpeed?.(
                        value
                    ),

            "p-speed-value"

        );


        bindSlider(

            "p-turns",

            value =>
                activeSimulator
                    ?.setCoilTurns?.(
                        value
                    ),

            "p-turns-value"

        );


        bindSlider(

            "p-resistance",

            value =>
                activeSimulator
                    ?.setResistance?.(
                        value
                    ),

            "p-resistance-value",

            " Ω"

        );

    }


    // ========================================================
    // MOTOR CONTROLS
    // ========================================================

    if (
        mode ===
        "motor"
    ) {

        bindSlider(

            "p-voltage",

            value =>
                activeSimulator
                    ?.setVoltage?.(
                        value
                    ),

            "p-voltage-value",

            " V"

        );


        bindSlider(

            "p-current",

            value =>
                activeSimulator
                    ?.setCurrent?.(
                        value
                    ),

            "p-current-value",

            " A"

        );


        bindSlider(

            "p-field",

            value =>
                activeSimulator
                    ?.setField?.(
                        value
                    ),

            "p-field-value"

        );


        bindSlider(

            "p-coil-turns",

            value =>
                activeSimulator
                    ?.setTurns?.(
                        value
                    ),

            "p-coil-turns-value"

        );

    }


    // ========================================================
    // SOLAR CONTROLS
    // ========================================================

    if (
        mode ===
        "solar"
    ) {

        bindSlider(

            "p-solar-speed",

            value =>
                activeSimulator
                    ?.setSpeed?.(
                        value
                    ),

            "p-solar-speed-value",

            "×"

        );


        document
            .getElementById(
                "p-focus"
            )
            ?.addEventListener(
                "change",
                event => {

                    const selectedName =
                        event.target.value;


                    activeSimulator
                        ?.setFocus?.(
                            selectedName
                        );


                    let targetObject =
                        null;


                    activeSimulator
                        ?.getObject?.()
                        ?.traverse?.(
                            object => {

                                if (
                                    !targetObject &&
                                    object.name ===
                                    selectedName
                                ) {

                                    targetObject =
                                        object;

                                }

                            }
                        );


                    if (
                        targetObject
                    ) {

                        const target =
                            new THREE.Vector3();


                        targetObject
                            .getWorldPosition(
                                target
                            );


                        orbitControls.target.copy(
                            target
                        );


                        camera.lookAt(
                            target
                        );


                        orbitControls.update();

                    }


                    refresh();

                }
            );


        document
            .getElementById(
                "p-orbits"
            )
            ?.addEventListener(
                "change",
                event => {

                    activeSimulator
                        ?.setShowOrbits?.(
                            event.target.checked
                        );

                }
            );


        document
            .getElementById(
                "p-labels"
            )
            ?.addEventListener(
                "change",
                event => {

                    activeSimulator
                        ?.setShowLabels?.(
                            event.target.checked
                        );

                }
            );


        document
            .getElementById(
                "p-asteroids"
            )
            ?.addEventListener(
                "change",
                event => {

                    activeSimulator
                        ?.setShowAsteroids?.(
                            event.target.checked
                        );

                }
            );


        document
            .getElementById(
                "p-kuiper"
            )
            ?.addEventListener(
                "change",
                event => {

                    activeSimulator
                        ?.setShowKuiperBelt?.(
                            event.target.checked
                        );

                }
            );


        document
            .getElementById(
                "p-education-mode"
            )
            ?.addEventListener(
                "change",
                event => {

                    activeSimulator
                        ?.setEducationMode?.(
                            event.target.checked
                                ? "teacher"
                                : "student"
                        );


                    if (
                        teacherText
                    ) {

                        teacherText.textContent =
                            event.target.checked
                                ? getTeacherExplanation(
                                    "solar"
                                )
                                : (
                                    "Select a planet or Solar System component to discover its properties."
                                );

                    }

                }
            );


        // ====================================================
        // SOLAR GALLERY
        // ====================================================

        const galleryView =
            document.getElementById(
                "physics-gallery-view"
            );


        const galleryOpen =
            document.getElementById(
                "physics-gallery-open"
            );


        const galleryBack =
            document.getElementById(
                "physics-gallery-back"
            );


        if (
            galleryView &&
            galleryOpen
        ) {

            renderSolarGallery();


            galleryOpen.addEventListener(
                "click",
                () => {

                    canvasContainer.hidden =
                        true;


                    galleryView.hidden =
                        false;


                    galleryOpen.textContent =
                        "✕ Close Gallery";


                    if (
                        tooltip
                    ) {

                        tooltip.hidden =
                            true;

                    }


                    window.scrollTo({

                        top:
                            0,

                        behavior:
                            "smooth"

                    });

                }
            );

        }


        if (
            galleryView &&
            galleryBack
        ) {

            galleryBack.addEventListener(
                "click",
                () => {

                    galleryView.hidden =
                        true;


                    canvasContainer.hidden =
                        false;


                    if (
                        galleryOpen
                    ) {

                        galleryOpen.textContent =
                            "🖼 Solar System Gallery";

                    }


                    requestAnimationFrame(
                        () => {

                            resize();


                            fitCamera(
                                simulationObject,
                                48
                            );


                            renderer.render(
                                scene,
                                camera
                            );

                        }
                    );


                    window.scrollTo({

                        top:
                            0,

                        behavior:
                            "smooth"

                    });

                }
            );

        }

    }


    // ========================================================
    // VIRTUAL LAB
    // ========================================================

    if (
        mode ===
        "virtual"
    ) {

        buildVirtualControls(
            activeSimulator
        );


        document
            .getElementById(
                "p-exp"
            )
            ?.addEventListener(
                "change",
                event => {

                    activeSimulator
                        ?.setExperiment?.(
                            event.target.value
                        );


                    graphHistory =
                        [];


                    buildVirtualControls(
                        activeSimulator
                    );


                    bindVirtualControls();


                    fitCamera();


                    refresh();

                }
            );


        bindVirtualControls();

    }


    // ========================================================
    // VIRTUAL BINDINGS
    // ========================================================

    function bindVirtualControls() {

        bindSlider(

            "v-length",

            value =>
                activeSimulator
                    ?.setLength?.(
                        value
                    ),

            "v-length-value",

            " m"

        );


        bindSlider(

            "v-angle",

            value =>
                activeSimulator
                    ?.setAngle?.(
                        value
                    ),

            "v-angle-value",

            "°"

        );


        bindSlider(

            "v-gravity",

            value =>
                activeSimulator
                    ?.setGravity?.(
                        value
                    ),

            "v-gravity-value",

            " m/s²"

        );


        bindSlider(

            "v-force",

            value =>
                activeSimulator
                    ?.setForce?.(
                        value
                    ),

            "v-force-value",

            " N"

        );


        bindSlider(

            "v-k",

            value =>
                activeSimulator
                    ?.setSpringConstant?.(
                        value
                    ),

            "v-k-value",

            " N/m"

        );


        bindSlider(

            "v-speed",

            value =>
                activeSimulator
                    ?.setLaunchSpeed?.(
                        value
                    ),

            "v-speed-value",

            " m/s"

        );


        bindSlider(

            "v-ma",

            value =>
                activeSimulator
                    ?.setMassA?.(
                        value
                    ),

            "v-ma-value",

            " kg"

        );


        bindSlider(

            "v-mb",

            value =>
                activeSimulator
                    ?.setMassB?.(
                        value
                    ),

            "v-mb-value",

            " kg"

        );


        bindSlider(

            "v-va",

            value =>
                activeSimulator
                    ?.setVelocityA?.(
                        value
                    ),

            "v-va-value",

            " m/s"

        );


        bindSlider(

            "v-vb",

            value =>
                activeSimulator
                    ?.setVelocityB?.(
                        value
                    ),

            "v-vb-value",

            " m/s"

        );

    }


    // ========================================================
    // START
    // ========================================================

    document
        .getElementById(
            "physics-start"
        )
        ?.addEventListener(
            "click",
            () => {

                activeSimulator
                    ?.start?.();


                if (
                    status
                ) {

                    status.textContent =
                        "RUNNING";

                }

            }
        );


    // ========================================================
    // PAUSE
    // ========================================================

    document
        .getElementById(
            "physics-pause"
        )
        ?.addEventListener(
            "click",
            () => {

                activeSimulator
                    ?.pause?.();


                if (
                    status
                ) {

                    status.textContent =
                        "PAUSED";

                }

            }
        );


    // ========================================================
    // RESET
    // ========================================================

    document
        .getElementById(
            "physics-reset"
        )
        ?.addEventListener(
            "click",
            () => {

                activeSimulator
                    ?.reset?.();


                graphHistory =
                    [];


                selectedObject =
                    null;


                hoveredObject =
                    null;


                updateSelectionPanel(
                    null
                );


                if (
                    teacherText
                ) {

                    teacherText.textContent =
                        getTeacherExplanation(
                            mode,
                            activeSimulator
                                ?.getState?.()
                        );

                }


                if (
                    status
                ) {

                    status.textContent =
                        "READY";

                }


                fitCamera();


                refresh();

            }
        );


    // ========================================================
    // AUTO ROTATE
    // ========================================================

    let autoRotate =
        false;


    document
        .getElementById(
            "physics-rotate"
        )
        ?.addEventListener(
            "click",
            event => {

                autoRotate =
                    !autoRotate;


                orbitControls.autoRotate =
                    autoRotate;


                event.currentTarget.textContent =
                    autoRotate
                        ? "⏸ Stop Rotation"
                        : "◉ Auto Rotate";

            }
        );


    // ========================================================
    // BACK TO PHYSICS
    // ========================================================

    document
        .getElementById(
            "physics-sim-back"
        )
        ?.addEventListener(
            "click",
            () => {

                window.location.hash =
                    "physics";

            }
        );


    // ========================================================
    // SWITCH LAB
    // ========================================================

    document
        .querySelectorAll(
            "[data-physics-mode]"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        const nextMode =
                            card.dataset
                                .physicsMode;


                        if (
                            nextMode ===
                            activeMode
                        ) {

                            return;

                        }


                        const route =
                            SIMULATORS[
                                nextMode
                            ]?.route;


                        if (
                            route
                        ) {

                            window.location.hash =
                                route;

                        }

                    }
                );

            }
        );


    // ========================================================
    // RESIZE
    // ========================================================

    const onResize =
        () => {

            resize();

        };


    window.addEventListener(
        "resize",
        onResize
    );


    // ========================================================
    // ANIMATION LOOP
    // ========================================================

    let lastTime =
        performance.now();


    let accumulator =
        0;


    let animationFrame =
        null;


    const animate =
        now => {

            if (
                !activeSimulator
            ) {

                return;

            }


            const delta =
                Math.min(
                    0.05,
                    (
                        now -
                        lastTime
                    ) /
                    1000
                );


            lastTime =
                now;


            accumulator +=
                delta;


            activeSimulator
                ?.update?.(
                    delta
                );


            orbitControls.update();


            renderer.render(
                scene,
                camera
            );


            if (
                accumulator >=
                0.08
            ) {

                accumulator =
                    0;


                refresh();

            }


            animationFrame =
                requestAnimationFrame(
                    animate
                );

        };


    animationFrame =
        requestAnimationFrame(
            animate
        );


    // ========================================================
    // INITIAL REFRESH
    // ========================================================

    refresh();


    // ========================================================
    // CLEANUP
    // ========================================================

    cleanup =
        () => {

            window.removeEventListener(
                "resize",
                onResize
            );


            renderer
                .domElement
                .removeEventListener(
                    "pointerdown",
                    pointerDown
                );


            renderer
                .domElement
                .removeEventListener(
                    "pointerup",
                    pointerUp
                );


            renderer
                .domElement
                .removeEventListener(
                    "pointermove",
                    updateHover
                );


            orbitControls.dispose();


            if (
                animationFrame
            ) {

                cancelAnimationFrame(
                    animationFrame
                );

            }


            activeSimulator
                ?.dispose?.();


            scene.clear();


            renderer.dispose();


            if (
                renderer.forceContextLoss
            ) {

                try {

                    renderer.forceContextLoss();

                } catch (
                    error
                ) {

                    console.warn(
                        "Physics renderer cleanup warning:",
                        error
                    );

                }

            }


            if (
                renderer.domElement.parentNode
            ) {

                renderer
                    .domElement
                    .parentNode
                    .removeChild(
                        renderer.domElement
                    );

            }


            activeSimulator =
                null;


            selectedObject =
                null;


            hoveredObject =
                null;

        };

}


// ============================================================
// CLEANUP EXPORT
// ============================================================

export function cleanupPhysicsSimulation() {

    cleanup?.();

    cleanup =
        null;

    activeSimulator =
        null;

    graphHistory =
        [];

    selectedObject =
        null;

    hoveredObject =
        null;

}


// ============================================================
// GET ACTIVE SIMULATOR
// ============================================================

export function getPhysicsSimulator() {

    return activeSimulator;

}


// ============================================================
// GET CURRENT MODE
// ============================================================

export function getPhysicsMode() {

    return activeMode;

}