// ============================================================
// SciLab - Main Application
// main.js
// ============================================================

import "./style.css";
import "./styles/biology.css";
import "./styles/physics.css";
import "./styles/home.css";
import "./styles/chemistry.css";


// ============================================================
// COMPONENTS
// ============================================================

import {
    Navbar
} from "./components/Navbar.js";

import {
    Footer
} from "./components/Footer.js";

// ============================================================
// MAIN PAGES
// ============================================================

import {
    Home
} from "./pages/Home.js";

import {
    Physics
} from "./pages/Physics.js";

import {
    Chemistry
} from "./pages/Chemistry.js";

import {
    Biology
} from "./pages/Biology.js";


import {
    Atom
} from "./pages/Atom.js";

import {
    PH
} from "./pages/PH.js";

// ============================================================
// BIOLOGY SIMULATION PAGE
// ============================================================

import {
    createBiologySimulationPage,
    cleanupBiologySimulation
} from "./pages/BiologySimulation.js";

// ============================================================
// PHYSICS SIMULATION PAGE
// ============================================================

import {
    createPhysicsSimulationPage,
    cleanupPhysicsSimulation
} from "./pages/PhysicsSimulation.js";

// ============================================================
// MOLECULE BUILDER
// ============================================================

import {
    MoleculeBuilder,
    initMoleculeBuilder
} from "./simulations/moleculeBuilder/MoleculeBuilder.js";

// ============================================================
// CORE ENGINE
// ============================================================

import {
    createEngine
} from "./core/engine.js";

// ============================================================
// ATOM CONTROLS
// ============================================================

import {
    initializeAtomControls
} from "./simulations/atom/AtomControls.js";

// ============================================================
// REACTION SIMULATOR
// ============================================================

import {
    ReactionSimulator
} from "./simulations/reaction/index.js";

// ============================================================
// pH SIMULATOR
// ============================================================

import {
    PHSimulator
} from "./simulations/ph/PHSimulator.js";

// ============================================================
// ROUTER
// ============================================================

import {
    registerRoute,
    getRoute,
    hasRoute
} from "./core/router.js";

// ============================================================
// APP
// ============================================================

const app = document.querySelector("#app");

if (!app) {
    throw new Error(
        "SciLab: #app element was not found."
    );
}

// ============================================================
// REACTION PAGE
// ============================================================

function Reaction() {

    return `
        <section
            id="reaction"
            class="reaction-page"
        >

            <div
                class="reaction-header"
            >

                <h1>
                    Chemical Reaction Simulator
                </h1>

                <p>
                    Explore molecular collisions,
                    energy and reaction rates.
                </p>

            </div>

            <div
                id="reaction-container"
                class="reaction-container"
            ></div>

        </section>
    `;
}

// ============================================================
// MAIN ROUTES
// ============================================================

registerRoute(
    "home",
    Home
);

registerRoute(
    "physics",
    Physics
);

registerRoute(
    "chemistry",
    Chemistry
);

registerRoute(
    "biology",
    Biology
);


registerRoute(
    "atom",
    Atom
);

registerRoute(
    "molecule",
    MoleculeBuilder
);

registerRoute(
    "reaction",
    Reaction
);

registerRoute(
    "ph",
    PH
);

// ============================================================
// BIOLOGY ROUTES
// ============================================================

registerRoute(
    "biology-cells",
    () =>
        createBiologySimulationPage(
            "cells"
        )
);

registerRoute(
    "biology-circulation",
    () =>
        createBiologySimulationPage(
            "circulation"
        )
);

registerRoute(
    "biology-osmosis",
    () =>
        createBiologySimulationPage(
            "osmosis"
        )
);

registerRoute(
    "biology-photosynthesis",
    () =>
        createBiologySimulationPage(
            "photosynthesis"
        )
);

registerRoute(
    "biology-enzyme",
    () =>
        createBiologySimulationPage(
            "enzyme"
        )
);

// ============================================================
// PHYSICS ROUTES
// ============================================================

registerRoute(
    "physics-lens",
    () =>
        createPhysicsSimulationPage(
            "lens"
        )
);

registerRoute(
    "physics-magnetic",
    () =>
        createPhysicsSimulationPage(
            "magnetic"
        )
);

registerRoute(
    "physics-motor",
    () =>
        createPhysicsSimulationPage(
            "motor"
        )
);

registerRoute(
    "physics-solar-system",
    () =>
        createPhysicsSimulationPage(
            "solar"
        )
);

registerRoute(
    "physics-virtual-lab",
    () =>
        createPhysicsSimulationPage(
            "virtual"
        )
);

// ============================================================
// CURRENT PAGE CLEANUP
// ============================================================

let currentCleanup = null;

function cleanupCurrentPage() {

    if (
        typeof currentCleanup !==
        "function"
    ) {
        return;
    }

    try {

        currentCleanup();

    } catch (error) {

        console.error(
            "SciLab cleanup error:",
            error
        );

    }

    currentCleanup = null;
}

// ============================================================
// GET PAGE
// ============================================================

function getPage(
    pageName
) {

    if (
        !pageName ||
        !hasRoute(pageName)
    ) {
        return null;
    }

    return getRoute(pageName);
}

// ============================================================
// NORMALIZE ROUTE
// ============================================================

function normalizeRoute(
    value
) {

    return String(
        value || ""
    )
        .replace(
            /^#/,
            ""
        )
        .trim();

}

// ============================================================
// RENDER
// ============================================================

export function render(
    pageName = "home"
) {

    const route =
        normalizeRoute(pageName);

    cleanupCurrentPage();

    const Page =
        getPage(route);

    // --------------------------------------------------------
    // 404
    // --------------------------------------------------------

    if (!Page) {

        app.innerHTML = `

            ${Navbar()}

            <main
                id="page-content"
                class="error-page"
            >

                <div
                    class="error-container"
                >

                    <h1>
                        404
                    </h1>

                    <h2>
                        Page Not Found
                    </h2>

                    <p>
                        The page
                        <strong>
                            ${route}
                        </strong>
                        does not exist.
                    </p>

                    <button
                        type="button"
                        data-page="home"
                    >
                        Go Home
                    </button>

                </div>

            </main>

            ${Footer()}

        `;

        return;
    }

    // --------------------------------------------------------
    // RENDER PAGE
    // --------------------------------------------------------

    try {

        app.innerHTML = `

            ${Navbar()}

            <main
                id="page-content"
            >

                ${Page()}

            </main>

            ${Footer()}

        `;

    } catch (error) {

        console.error(
            "SciLab page render error:",
            error
        );

        app.innerHTML = `

            ${Navbar()}

            <main
                id="page-content"
            >

                <div
                    class="error-container"
                >

                    <h1>
                        Something went wrong
                    </h1>

                    <p>
                        Failed to load this page.
                    </p>

                    <button
                        type="button"
                        data-page="home"
                    >
                        Back Home
                    </button>

                </div>

            </main>

            ${Footer()}

        `;

        return;
    }

    // --------------------------------------------------------
    // INITIALIZE PAGE
    // --------------------------------------------------------

    initializePage(route);
}

// ============================================================
// INITIALIZE PAGE
// ============================================================

function initializePage(
    pageName
) {

    switch (pageName) {

        // ====================================================
        // BIOLOGY
        // ====================================================

        case "biology-cells":

        case "biology-circulation":

        case "biology-osmosis":

        case "biology-photosynthesis":

        case "biology-enzyme":

            initializeBiologySimulationPage();

            break;

        // ====================================================
        // PHYSICS
        // ====================================================

        case "physics-lens":

        case "physics-magnetic":

        case "physics-motor":

        case "physics-solar-system":

        case "physics-virtual-lab":

            initializePhysicsSimulationPage();

            break;

        // ====================================================
        // ATOM
        // ====================================================

        case "atom":

            initializeAtomSimulator();

            break;

        // ====================================================
    

        // ====================================================
        // MOLECULE
        // ====================================================

        case "molecule":

            initializeMoleculeSimulator();

            break;

        // ====================================================
        // REACTION
        // ====================================================

        case "reaction":

            initializeReaction();

            break;

        // ====================================================
        // pH
        // ====================================================

        case "ph":

            initializePHSimulator();

            break;

        // ====================================================
        // STATIC PAGES
        // ====================================================

        case "home":

        case "physics":

        case "chemistry":

        case "biology":

            break;

        default:

            break;
    }
}

// ============================================================
// BIOLOGY SIMULATION INITIALIZER
// ============================================================

function initializeBiologySimulationPage() {

    currentCleanup = () => {

        try {

            cleanupBiologySimulation();

        } catch (error) {

            console.warn(
                "Biology cleanup error:",
                error
            );

        }

    };
}

// ============================================================
// PHYSICS SIMULATION INITIALIZER
// ============================================================

function initializePhysicsSimulationPage() {

    currentCleanup = () => {

        try {

            cleanupPhysicsSimulation();

        } catch (error) {

            console.warn(
                "Physics cleanup error:",
                error
            );

        }

    };
}

// ============================================================
// ATOM SIMULATOR
// ============================================================

function initializeAtomSimulator() {

    const container =
        document.getElementById(
            "engine-container"
        );

    if (!container) {

        console.warn(
            "Atom: #engine-container not found."
        );

        return;
    }

    try {

        const engine =
            createEngine(container);

        if (!engine) {

            console.error(
                "Atom: createEngine() failed."
            );

            return;
        }

        if (
            engine.scene &&
            typeof initializeAtomControls ===
            "function"
        ) {

            initializeAtomControls(
                engine.scene
            );
        }

        currentCleanup = () => {

            try {

                engine?.dispose?.();

            } catch (error) {

                console.warn(
                    "Atom cleanup error:",
                    error
                );

            }

        };

    } catch (error) {

        console.error(
            "Atom simulator error:",
            error
        );

    }
}

// ============================================================
// ENGINE TEST
// ============================================================



// ============================================================
// MOLECULE BUILDER
// ============================================================

function initializeMoleculeSimulator() {

    setTimeout(
        () => {

            try {

                if (
                    typeof initMoleculeBuilder !==
                    "function"
                ) {

                    console.error(
                        "Molecule Builder initializer is not available."
                    );

                    return;
                }

                initMoleculeBuilder();

            } catch (error) {

                console.error(
                    "Molecule Builder error:",
                    error
                );

            }

        },
        0
    );
}

// ============================================================
// REACTION SIMULATOR
// ============================================================

function initializeReaction() {

    try {

        console.log(
            "SciLab: Initializing Reaction Simulator..."
        );


        // ----------------------------------------------------
        // CREATE REACTION SIMULATOR
        // ----------------------------------------------------

        const simulator =
            new ReactionSimulator();


        if (!simulator) {

            console.error(
                "Reaction: simulator could not be created."
            );

            return;
        }


        // ----------------------------------------------------
        // START SIMULATION
        // ----------------------------------------------------

        if (
            typeof simulator.start ===
            "function"
        ) {

            simulator.start();
        }


        // ----------------------------------------------------
        // CLEANUP
        // ----------------------------------------------------

        currentCleanup = () => {

            console.log(
                "SciLab: Cleaning Reaction Simulator..."
            );


            try {

                if (
                    typeof simulator.stop ===
                    "function"
                ) {

                    simulator.stop();
                }

            } catch (error) {

                console.warn(
                    "Reaction stop error:",
                    error
                );

            }


            try {

                if (
                    typeof simulator.destroy ===
                    "function"
                ) {

                    simulator.destroy();

                } else if (
                    typeof simulator.dispose ===
                    "function"
                ) {

                    simulator.dispose();
                }

            } catch (error) {

                console.warn(
                    "Reaction cleanup error:",
                    error
                );

            }

        };


        console.log(
            "SciLab: Reaction Simulator ready 🧪"
        );

    } catch (error) {

        console.error(
            "Reaction Simulator error:",
            error
        );

    }
}

// ============================================================
// pH SIMULATOR
// ============================================================

function initializePHSimulator() {

    const sceneContainer =
        document.getElementById(
            "ph-scene-container"
        );

    const controlsContainer =
        document.getElementById(
            "ph-controls"
        );

    if (!sceneContainer) {

        console.warn(
            "pH: #ph-scene-container not found."
        );

        return;
    }

    if (!controlsContainer) {

        console.warn(
            "pH: #ph-controls not found."
        );

        return;
    }

    try {

        const simulator =
            new PHSimulator();

        simulator.mount(
            sceneContainer,
            controlsContainer
        );

        const sceneController =
            simulator.getSceneController?.();

        sceneController?.render?.();

        simulator.start?.();

        currentCleanup = () => {

            try {

                simulator?.stop?.();

            } catch (error) {

                console.warn(
                    "pH stop error:",
                    error
                );

            }

            try {

                simulator?.dispose?.();

            } catch (error) {

                console.warn(
                    "pH cleanup error:",
                    error
                );

            }

        };

    } catch (error) {

        console.error(
            "pH Simulator error:",
            error
        );

    }
}

// ============================================================
// NORMAL PAGE NAVIGATION
// ============================================================

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-page]"
            );

        if (!button) {
            return;
        }

        const pageName =
            normalizeRoute(
                button.dataset.page
            );

        if (
            !pageName ||
            !hasRoute(pageName)
        ) {
            return;
        }

        event.preventDefault();

        if (
            window.location.hash ===
            `#${pageName}`
        ) {
            return;
        }

        history.pushState(
            {
                page:
                    pageName
            },
            "",
            `#${pageName}`
        );

        render(
            pageName
        );

    }
);

// ============================================================
// HASH NAVIGATION
// ============================================================

window.addEventListener(
    "hashchange",
    () => {

        const pageName =
            normalizeRoute(
                window.location.hash
            );

        if (!pageName) {
            return;
        }

        if (!hasRoute(pageName)) {

            console.warn(
                `SciLab: route "${pageName}" is not registered.`
            );

            return;
        }

        render(
            pageName
        );
    }
);

// ============================================================
// BROWSER BACK / FORWARD
// ============================================================

window.addEventListener(
    "popstate",
    event => {

        const pageName =
            event.state?.page ||
            normalizeRoute(
                window.location.hash
            ) ||
            "home";

        render(
            hasRoute(pageName)
                ? pageName
                : "home"
        );
    }
);

// ============================================================
// INITIAL PAGE
// ============================================================

const initialHash =
    normalizeRoute(
        window.location.hash
    );

const initialPage =
    initialHash &&
    hasRoute(initialHash)
        ? initialHash
        : "home";

if (
    !initialHash ||
    !hasRoute(initialHash)
) {

    history.replaceState(
        {
            page:
                "home"
        },
        "",
        "#home"
    );
}

render(
    initialPage
);

// ============================================================
// GLOBAL ERRORS
// ============================================================

window.addEventListener(
    "error",
    event => {

        console.error(
            "SciLab Runtime Error:",
            event.error ||
            event.message
        );

    }
);

window.addEventListener(
    "unhandledrejection",
    event => {

        console.error(
            "SciLab Promise Error:",
            event.reason
        );

    }
);

// ============================================================
// START
// ============================================================

console.log(
    "SciLab started successfully 🚀"
);

console.log(
    "Physics Laboratory Ready ⚛️"
);

console.log(
    "Biology Laboratory Ready 🧬"
);

console.log(
    "Chemistry Laboratory Ready 🧪"
);