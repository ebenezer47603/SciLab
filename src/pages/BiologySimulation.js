// ============================================================
// SciLab - Biology Simulation Page
// BiologySimulation.js
// ============================================================

import {
    BiologySimulator
} from "../simulations/biology/core/BiologySimulator.js";


// ============================================================
// PAGE INFORMATION
// ============================================================

const simulationInfo = {

    cells: {
        title:
            "Animal Cell & Plant Cell",

        description:
            "Explore cellular structures and organelles through interactive 3D models."
    },


    circulation: {
        title:
            "Heart & Blood Circulation",

        description:
            "Explore the human heart, blood vessels, circulation pathways and the movement of blood through the body."
    },


    osmosis: {
        title:
            "Osmosis & Cell Membrane",

        description:
            "Investigate how water moves across a selectively permeable membrane."
    },


    photosynthesis: {
        title:
            "Photosynthesis Laboratory",

        description:
            "Watch an animated photosynthesis process from sunlight, water and carbon dioxide to glucose and oxygen."
    },


    enzyme: {
        title:
            "Enzyme Activity Laboratory",

        description:
            "Explore how temperature, pH, substrate concentration and enzyme concentration affect enzyme activity."
    }

};


// ============================================================
// GLOBAL STATE
// ============================================================

let simulator = null;

let cleanup = null;

let activeCellMode =
    "plant-cell";

let activeGalleryMode =
    "plant-cell";

let currentGalleryIndex =
    0;


// ============================================================
// MEDIA URL
// ============================================================

function mediaUrl(
    fileName
) {

    return (
        "https://commons.wikimedia.org/wiki/Special:FilePath/" +
        encodeURIComponent(
            fileName
        )
    );

}


// ============================================================
// GALLERY DATA
// ============================================================

const galleryData = {

    // ========================================================
    // PLANT CELL
    // ========================================================

    "plant-cell": [

        {
            title:
                "Plant Cell Structure",

            description:
                "Detailed labelled diagram showing the major structures of a typical plant cell.",

            image:
                mediaUrl(
                    "Plant cell structure-en.svg"
                )
        },


        {
            title:
                "Plant Cell",

            description:
                "Basic labelled diagram of a plant cell suitable for biology education.",

            image:
                mediaUrl(
                    "Plantcell.svg"
                )
        },


        {
            title:
                "Modern Plant Cell",

            description:
                "Modern educational visualization of a plant cell.",

            image:
                mediaUrl(
                    "202403 plant cell.svg"
                )
        },


        {
            title:
                "Plant Cell Structure 2",

            description:
                "Alternative detailed visualization of plant-cell structure.",

            image:
                mediaUrl(
                    "Plant cell structure svg 2.svg"
                )
        },


        {
            title:
                "Plant Cell Types",

            description:
                "Illustration showing different plant cell types.",

            image:
                mediaUrl(
                    "Plant cell types.svg"
                )
        },


        {
            title:
                "Simple Plant Cell",

            description:
                "Simple educational diagram identifying the main structures of a plant cell.",

            image:
                mediaUrl(
                    "Simple diagram of plant cell (numbers).svg"
                )
        },


        {
            title:
                "Chloroplast",

            description:
                "Detailed diagram of a chloroplast, the main organelle involved in photosynthesis.",

            image:
                mediaUrl(
                    "Chloroplast.svg"
                )
        },


        {
            title:
                "Plant Cell Vacuole",

            description:
                "Diagram focusing on the large central vacuole of a plant cell.",

            image:
                mediaUrl(
                    "Plant cell structure svg vacuole.svg"
                )
        },


        {
            title:
                "Plant Cell Labels",

            description:
                "Detailed diagram identifying many organelles and structures in a plant cell.",

            image:
                mediaUrl(
                    "Plant cell structure svg labels.svg"
                )
        }

    ],


    // ========================================================
    // ANIMAL CELL
    // ========================================================

    "animal-cell": [

        {
            title:
                "Animal Cell",

            description:
                "Detailed visualization of the components of a typical animal cell.",

            image:
                mediaUrl(
                    "Animal Cell.svg"
                )
        },


        {
            title:
                "Animal Cell Structure",

            description:
                "Detailed labelled diagram of a typical animal cell.",

            image:
                mediaUrl(
                    "Animal cell structure en.svg"
                )
        },


        {
            title:
                "P Cell",

            description:
                "Detailed animal-cell diagram showing nucleus, ribosomes, ER, Golgi, lysosomes and other structures.",

            image:
                mediaUrl(
                    "P Cell.svg"
                )
        },


        {
            title:
                "Biological Cell",

            description:
                "Detailed educational diagram of a typical animal cell and its organelles.",

            image:
                mediaUrl(
                    "Biological cell.svg"
                )
        },


        {
            title:
                "Cell Nucleus",

            description:
                "Detailed visualization of the eukaryotic cell nucleus.",

            image:
                mediaUrl(
                    "Cell nucleus.svg"
                )
        },


        {
            title:
                "Golgi Apparatus",

            description:
                "Detailed diagram of the Golgi apparatus and its structure.",

            image:
                mediaUrl(
                    "Golgi apparatus (standalone version)-en.svg"
                )
        },


        {
            title:
                "Lysosome Digestion",

            description:
                "Diagram showing how lysosomes digest and recycle cellular materials.",

            image:
                mediaUrl(
                    "Lysosomes Digestion.svg"
                )
        },


        {
            title:
                "Cell Vacuole",

            description:
                "Diagram highlighting a vacuole within a biological cell.",

            image:
                mediaUrl(
                    "Biological cell vacuole.svg"
                )
        },


        {
            title:
                "Golgi Apparatus - Borderless",

            description:
                "Alternative detailed diagram of the Golgi apparatus.",

            image:
                mediaUrl(
                    "Golgi apparatus (borderless version)-en.svg"
                )
        },


        {
            title:
                "Golgi Numbers Version",

            description:
                "Numbered educational diagram of the Golgi apparatus.",

            image:
                mediaUrl(
                    "Golgi apparatus (numbers version).svg"
                )
        }

    ],

// ========================================================
// OSMOSIS
// ========================================================

osmosis: [

    {
        title:
            "Osmosis",

        description:
            "Water moves across a selectively permeable membrane toward the side with higher solute concentration.",

        image:
            mediaUrl(
                "Osmosis diagram.svg"
            )
    },


    {
        title:
            "Basic Osmosis",

        description:
            "A simple diagram showing water movement across a semipermeable membrane.",

        image:
            mediaUrl(
                "Semipermeable membrane.svg"
            )
    },


    {
        title:
            "Hypotonic Solution",

        description:
            "In a hypotonic environment, water tends to enter the cell.",

        image:
            mediaUrl(
                "Hypotonic cell diagram.svg"
            )
    },


    {
        title:
            "Isotonic Solution",

        description:
            "In an isotonic environment, water moves in both directions with no net movement.",

        image:
            mediaUrl(
                "Isotonic cell diagram.svg"
            )
    },


    {
        title:
            "Hypertonic Solution",

        description:
            "In a hypertonic environment, water tends to leave the cell.",

        image:
            mediaUrl(
                "Hypertonic cell diagram.svg"
            )
    },


    {
        title:
            "Hypotonic • Isotonic • Hypertonic",

        description:
            "Compare the effects of three different osmotic environments on animal and plant cells.",

        image:
            mediaUrl(
                "Hypertonic Isotonic Hypotonic.png"
            )
    },


    {
        title:
            "Animal Cell Osmosis",

        description:
            "Animal cells can swell when water enters and shrink when water leaves.",

        image:
            mediaUrl(
                "Osmosis animal cell.svg"
            )
    },


    {
        title:
            "Plant Cell Osmosis",

        description:
            "Plant cells respond to water movement differently because the cell wall provides structural support.",

        image:
            mediaUrl(
                "Plant cell osmosis.svg"
            )
    },


    {
        title:
            "Plasmolysis",

        description:
            "When a plant cell loses substantial water, the cell membrane can pull away from the cell wall.",

        image:
            mediaUrl(
                "Plasmolysis diagram.svg"
            )
    },


    {
        title:
            "Turgor Pressure",

        description:
            "Water entering a plant cell increases internal pressure and helps the cell become turgid.",

        image:
            mediaUrl(
                "Turgor pressure plant cell.svg"
            )
    },


    {
        title:
            "Cell Membrane",

        description:
            "The plasma membrane forms the selectively permeable boundary surrounding the cell.",

        image:
            mediaUrl(
                "Cell membrane detailed diagram en.svg"
            )
    },


    {
        title:
            "Phospholipid Bilayer",

        description:
            "The phospholipid bilayer forms the basic structure of the cell membrane.",

        image:
            mediaUrl(
                "Phospholipid bilayer.svg"
            )
    },


    {
        title:
            "Aquaporins",

        description:
            "Aquaporin proteins provide channels through which water can cross cell membranes rapidly.",

        image:
            mediaUrl(
                "Aquaporin water channel.svg"
            )
    },


    {
        title:
            "Osmosis Diagram",

        description:
            "Water moves through the selectively permeable membrane while many solutes remain restricted.",

        image:
            mediaUrl(
                "Osmosis.svg"
            )
    },


    {
        title:
            "Plant Cell Vacuole",

        description:
            "The central vacuole stores water and contributes to pressure and water balance in plant cells.",

        image:
            mediaUrl(
                "Plant cell structure svg vacuole.svg"
            )
    },


    {
        title:
            "Water Movement Across Membrane",

        description:
            "A visual representation of water molecules crossing a semipermeable membrane.",

        image:
            mediaUrl(
                "Water movement membrane.svg"
            )
    },


    {
        title:
            "Osmotic Equilibrium",

        description:
            "As the osmotic difference decreases, the net movement of water approaches equilibrium.",

        image:
            mediaUrl(
                "Osmotic equilibrium.svg"
            )
    },


    {
        title:
            "Cell Swelling",

        description:
            "Water entering an animal cell can increase its volume and cause the cell to swell.",

        image:
            mediaUrl(
                "Cell swelling osmosis.svg"
            )
    },


    {
        title:
            "Cell Shrinking",

        description:
            "Water leaving an animal cell can reduce its volume and cause the cell to shrink.",

        image:
            mediaUrl(
                "Cell shrinking osmosis.svg"
            )
    },


    {
        title:
            "Osmosis — Water Movement",

        description:
            "Watch an educational explanation of osmosis and water movement across a semipermeable membrane.",

        video:
            "https://www.youtube.com/embed/rCNlG_j_gSM"
    }

],


    // ========================================================
    // PHOTOSYNTHESIS
    // ========================================================

    photosynthesis: [

        {
            title:
                "Photosynthesis Overview",

            description:
                "Overview of the complete photosynthesis process.",

            image:
                mediaUrl(
                    "Photosynthesis overview.png"
                )
        },


        {
            title:
                "Photosynthesis",

            description:
                "Educational representation of the photosynthesis reaction.",

            image:
                mediaUrl(
                    "Photosynthesis.png"
                )
        },


        {
            title:
                "Photosynthesis Animation",

            description:
                "Animated representation of the photosynthesis process.",

            image:
                mediaUrl(
                    "Photosynthesis.gif"
                )
        },


        {
            title:
                "Chloroplast",

            description:
                "Chloroplasts contain chlorophyll and are the main site of photosynthesis.",

            image:
                mediaUrl(
                    "Chloroplast.svg"
                )
        },


        {
            title:
                "Plant Cell",

            description:
                "Plant cells contain chloroplasts and other structures required for photosynthesis.",

            image:
                mediaUrl(
                    "Plantcell.svg"
                )
        }

    ],


    // ========================================================
    // ENZYME
    // ========================================================

    enzyme: [

        {
            title:
                "Enzyme Action",

            description:
                "Enzymes catalyze reactions through specific interactions with substrates.",

            image:
                mediaUrl(
                    "Enzyme action.png"
                )
        },


        {
            title:
                "Enzyme Activity",

            description:
                "Enzyme activity depends on environmental conditions.",

            image:
                mediaUrl(
                    "Enzyme_activity.svg"
                )
        },


        {
            title:
                "Enzyme-Substrate Binding",

            description:
                "The substrate binds to the active site of an enzyme.",

            image:
                mediaUrl(
                    "Enzyme-substrate binding.png"
                )
        },


        {
            title:
                "Enzyme-Substrate Complex",

            description:
                "The enzyme-substrate complex forms before products are released.",

            image:
                mediaUrl(
                    "Enzyme-substrate complex.png"
                )
        },


        {
            title:
                "Induced Fit",

            description:
                "The active site changes shape as a substrate binds to the enzyme.",

            image:
                mediaUrl(
                    "Hexokinase induced fit.svg"
                )
        },


        {
            title:
                "Enzyme Denaturation",

            description:
                "Extreme conditions can change enzyme structure and reduce activity.",

            image:
                mediaUrl(
                    "Denaturation in Enzymes.jpg"
                )
        }

    ],


    // ========================================================
// CIRCULATION
// ========================================================

circulation: [

    {
        title:
            "Human Circulatory System",

        description:
            "Overview of the major arteries and veins of the human body.",

        image:
            mediaUrl(
                "Circulatory System en.svg"
            )
    },


    {
        title:
            "Circulatory System",

        description:
            "Educational diagram showing the human circulatory system.",

        image:
            mediaUrl(
                "Circulatory System en rendersvg.png"
            )
    },


    {
        title:
            "Human Heart",

        description:
            "The human heart contains four chambers and major blood vessels.",

        image:
            mediaUrl(
                "Diagram of the human heart.svg"
            )
    },


    {
        title:
            "Heart and Circulation",

        description:
            "Four-chambered heart with the major vessels involved in circulation.",

        image:
            mediaUrl(
                "Mammalian Heart and Circulation.PNG"
            )
    },


    {
        title:
            "Circulation Pathway",

        description:
            "Diagram showing pulmonary and systemic circulation pathways.",

        image:
            mediaUrl(
                "Haultain and Ferguson - diagram of circulation.svg"
            )
    },


    {
        title:
            "Circulatory Anatomy",

        description:
            "Detailed educational view of the human circulatory system.",

        image:
            mediaUrl(
                "Diagram of the circulatory system Wellcome L0050337.jpg"
            )
    },


    {
        title:
            "Human Heart Anatomy",

        description:
            "Anatomical diagram showing the chambers, valves and major vessels of the heart.",

        image:
            mediaUrl(
                "Human heart diagram en.svg"
            )
    },


    {
        title:
            "Heart Chambers",

        description:
            "Educational diagram of the four chambers of the human heart.",

        image:
            mediaUrl(
                "Heart chambers.svg"
            )
    },


    {
        title:
            "Pulmonary Circulation",

        description:
            "Blood travels between the heart and lungs through the pulmonary circulation.",

        image:
            mediaUrl(
                "Pulmonary circulation.svg"
            )
    },


    {
        title:
            "Blood Vessels",

        description:
            "Arteries, veins and capillaries form the network that transports blood throughout the body.",

        image:
            mediaUrl(
                "Blood vessel.svg"
            )
    },

            {
            title:
                "Human Circulatory System",

            description:
                "Schematic view of pulmonary and systemic circulation in the human body.",

            image:
                mediaUrl(
                    "Human circulatory system.svg"
                )
        },


        {
            title:
                "Heart Circulation Diagram",

            description:
                "Diagram showing blood circulation through the chambers of the heart.",

            image:
                mediaUrl(
                    "Heart circulation diagram.svg"
                )
        },


        {
            title:
                "Pulmonary Circuit",

            description:
                "Educational diagram showing the circulation of blood between the heart and lungs.",

            image:
                mediaUrl(
                    "Pulmonary circuit.svg"
                )
        },


        {
            title:
                "Pulmonary Circulation",

            description:
                "Diagram showing the pulmonary circulation pathway.",

            image:
                mediaUrl(
                    "Heart. Pulmonary circulation (blood) * Corazón. Circuito pulmonar (sangre).svg"
                )
        },


        {
            title:
                "Systemic and Pulmonary Circulation",

            description:
                "Overview of both systemic and pulmonary circulation.",

            image:
                mediaUrl(
                    "202410 Systemic and pulmonary circulation.svg"
                )
        },


        {
            title:
                "Blood Oxygenation",

            description:
                "Shows how blood becomes oxygenated in the lungs and travels to organs and tissues.",

            image:
                mediaUrl(
                    "Blood oxygenation to the pulmonary and systemic circulation.svg"
                )
        },


        {
            title:
                "Blood Flow Through the Heart",

            description:
                "Educational diagram illustrating pulmonary and systemic blood flow through the heart.",

            image:
                mediaUrl(
                    "2101 Blood Flow Through the Heart.svg"
                )
        },


        {
            title:
                "Diagram of the Human Heart",

            description:
                "Detailed anatomical diagram of the human heart and its major structures.",

            image:
                mediaUrl(
                    "Diagram of the human heart (multilingual).svg"
                )
        },


        {
            title:
                "Human Heart Scheme",

            description:
                "Simplified scheme showing the chambers, vessels and valves of the human heart.",

            image:
                mediaUrl(
                    "Human heart (scheme) * Corazón humano (esquema).svg"
                )
        },


        {
            title:
                "Pulmonary Blood Circulation",

            description:
                "Diagram showing arterial and venous blood circulation through the pulmonary system.",

            image:
                mediaUrl(
                    "Pulmonary Blood Circulation.png"
                )
        }
    

]

    

};


// ============================================================
// CREATE PAGE
// ============================================================

export function createBiologySimulationPage(
    mode
) {

    const data =
        simulationInfo[mode] ||
        simulationInfo.cells;


    activeGalleryMode =
        mode === "cells"
            ? activeCellMode
            : mode;


    setTimeout(
        () => init(mode),
        0
    );


    return `

        <section
            class="biology-simulation-page"
            id="biology-simulation-page"
            data-mode="${mode}"
        >

            <header
                class="biology-simulation-header"
            >

                <div>

                    <span
                        class="biology-simulation-kicker"
                    >
                        SCILAB • BIOLOGY • VIRTUAL LAB
                    </span>


                    <h1>
                        ${data.title}
                    </h1>


                    <p>
                        ${data.description}
                    </p>

                </div>


                <button
                    id="biology-sim-back"
                    class="biology-back-button"
                    type="button"
                >
                    ← Biology
                </button>

            </header>


            ${
                mode === "osmosis"

                    ? createOsmosisLab()

                    : mode === "enzyme"

                        ? createEnzymeLab()

                        : mode === "photosynthesis"

                            ? createPhotosynthesisLab()

                            : createStandardSimulation(
                                mode
                            )
            }

        </section>

    `;

}


// ============================================================
// STANDARD 3D SIMULATION
// ============================================================

function createStandardSimulation(
    mode
) {

    return `

        <div
            class="biology-simulation-toolbar"
        >

            <button
                id="biology-sim-rotate"
                type="button"
                class="biology-simulation-control"
            >
                ▶ Auto Rotate
            </button>


            <button
                id="biology-sim-reset"
                type="button"
                class="biology-simulation-control"
            >
                ↺ Reset View
            </button>


            <button
                id="biology-gallery-open"
                type="button"
                class="biology-simulation-control"
            >
                🖼 Gallery
            </button>


            ${
                mode === "cells"

                    ? `

                        <button
                            id="biology-plant-btn"
                            type="button"
                            class="
                                biology-simulation-control
                                is-active
                            "
                        >
                            🌱 Plant Cell
                        </button>


                        <button
                            id="biology-animal-btn"
                            type="button"
                            class="biology-simulation-control"
                        >
                            🧫 Animal Cell
                        </button>

                    `

                    : ""
            }

        </div>


        <main
            id="biology-simulation-view"
            class="biology-simulation-view"
        >

            <div
                id="biology-simulation-workspace"
                class="biology-simulation-workspace"
            >

                <div
                    class="biology-simulation-stage"
                >

                    <div
                        id="biology-simulation-container"
                        class="biology-simulation-container"
                    ></div>


                    ${createGalleryPage()}

                </div>


                <aside
                    class="biology-simulation-info"
                >

                    <span
                        class="biology-info-label"
                    >
                        SELECTED STRUCTURE
                    </span>


                    <h2
                        id="biology-selected-name"
                    >
                        Nothing selected
                    </h2>


                    <p
                        id="biology-selected-description"
                    >
                        Click a structure in the simulation
                        to learn more.
                    </p>


                    <div
                        id="biology-teacher-panel"
                        class="biology-teacher-panel"
                    >

                        <span>
                            TEACHER MODE
                        </span>


                        <h3>
                            Guided Lesson
                        </h3>


                        <p
                            id="biology-teacher-text"
                        >
                            Select a structure to begin the lesson.
                        </p>

                    </div>

                </aside>

            </div>

        </main>

    `;

}


// ============================================================
// PHOTOSYNTHESIS LABORATORY
// ============================================================

function createPhotosynthesisLab() {

    return `

        <section
            class="photosynthesis-lab"
            id="photosynthesis-lab"
        >

            <!-- =================================================
                 HEADER
            ================================================= -->

            <div
                class="photosynthesis-lab-header"
            >

                <div>

                    <span
                        class="photosynthesis-kicker"
                    >
                        SCILAB • BIOLOGY • ANIMATED LAB
                    </span>


                    <h2>
                        🌱 Photosynthesis Animation
                    </h2>


                    <p>
                        Watch sunlight, water and carbon dioxide
                        move into the plant, reach the chloroplast,
                        and produce glucose and oxygen.
                    </p>

                </div>


                <div
                    id="photosynthesis-status"
                    class="photosynthesis-status"
                >
                    READY
                </div>

            </div>


            <!-- =================================================
                 CONTROLS
            ================================================= -->

            <div
                class="photosynthesis-toolbar"
            >

                <button
                    id="photosynthesis-start"
                    type="button"
                    class="photosynthesis-control primary"
                >
                    ▶ Play Animation
                </button>


                <button
                    id="photosynthesis-pause"
                    type="button"
                    class="photosynthesis-control"
                >
                    ⏸ Pause
                </button>


                <button
                    id="photosynthesis-reset"
                    type="button"
                    class="photosynthesis-control"
                >
                    ↺ Restart
                </button>


                <button
                    id="photosynthesis-gallery-open"
                    type="button"
                    class="photosynthesis-control"
                >
                    🖼 Gallery
                </button>


                <button
                    id="photosynthesis-speed"
                    type="button"
                    class="photosynthesis-control"
                >
                    ⚡ 1×
                </button>

            </div>


            <!-- =================================================
                 STAGE TRACK
            ================================================= -->

            <div
                class="photosynthesis-stage-track"
            >

                <div
                    class="photosynthesis-stage-step"
                    data-stage="0"
                >

                    <span>
                        01
                    </span>

                    <strong>
                        🌳 Plant
                    </strong>

                </div>


                <div
                    class="photosynthesis-stage-line"
                ></div>


                <div
                    class="photosynthesis-stage-step"
                    data-stage="1"
                >

                    <span>
                        02
                    </span>

                    <strong>
                        💧 Water
                    </strong>

                </div>


                <div
                    class="photosynthesis-stage-line"
                ></div>


                <div
                    class="photosynthesis-stage-step"
                    data-stage="2"
                >

                    <span>
                        03
                    </span>

                    <strong>
                        🫧 CO₂
                    </strong>

                </div>


                <div
                    class="photosynthesis-stage-line"
                ></div>


                <div
                    class="photosynthesis-stage-step"
                    data-stage="3"
                >

                    <span>
                        04
                    </span>

                    <strong>
                        ☀️ Light
                    </strong>

                </div>


                <div
                    class="photosynthesis-stage-line"
                ></div>


                <div
                    class="photosynthesis-stage-step"
                    data-stage="4"
                >

                    <span>
                        05
                    </span>

                    <strong>
                        🟢 Chloroplast
                    </strong>

                </div>


                <div
                    class="photosynthesis-stage-line"
                ></div>


                <div
                    class="photosynthesis-stage-step"
                    data-stage="5"
                >

                    <span>
                        06
                    </span>

                    <strong>
                        ⚡ Reaction
                    </strong>

                </div>


                <div
                    class="photosynthesis-stage-line"
                ></div>


                <div
                    class="photosynthesis-stage-step"
                    data-stage="6"
                >

                    <span>
                        07
                    </span>

                    <strong>
                        🍬 Products
                    </strong>

                </div>

            </div>


            <!-- =================================================
                 MAIN WORKSPACE
            ================================================= -->

            <div
                class="photosynthesis-workspace"
            >

                <!-- =============================================
                     3D ANIMATION
                ============================================== -->

                <div
                    class="photosynthesis-simulation-panel"
                >

                    <div
                        class="photosynthesis-simulation-header"
                    >

                        <span>
                            LIVE ANIMATION
                        </span>


                        <span
                            id="photosynthesis-stage-label"
                        >
                            Plant
                        </span>

                    </div>


                    <div
                        id="biology-simulation-container"
                        class="photosynthesis-canvas"
                    ></div>


                    <div
                        class="photosynthesis-caption"
                    >

                        <span
                            id="photosynthesis-message"
                        >
                            Press Play Animation to begin.
                        </span>

                    </div>

                </div>


                <!-- =============================================
                     RESULTS
                ============================================== -->

                <aside
                    class="photosynthesis-results"
                >

                    <div
                        class="photosynthesis-results-header"
                    >

                        <span>
                            LIVE PROCESS
                        </span>


                        <strong>
                            Photosynthesis
                        </strong>

                    </div>


                    <div
                        class="photosynthesis-result-card"
                    >

                        <span>
                            INPUT
                        </span>


                        <h3>
                            ☀️ Light Energy
                        </h3>


                        <p>
                            Energy captured by chlorophyll.
                        </p>

                    </div>


                    <div
                        class="photosynthesis-result-card"
                    >

                        <span>
                            INPUT
                        </span>


                        <h3>
                            💧 Water
                        </h3>


                        <p>
                            Absorbed from soil through roots.
                        </p>

                    </div>


                    <div
                        class="photosynthesis-result-card"
                    >

                        <span>
                            INPUT
                        </span>


                        <h3>
                            🫧 Carbon Dioxide
                        </h3>


                        <p>
                            Enters the leaf through stomata.
                        </p>

                    </div>


                    <div
                        class="photosynthesis-equation"
                    >

                        <span>
                            PHOTOSYNTHESIS
                        </span>


                        <strong>
                            CO₂ + H₂O + Light
                        </strong>


                        <div>
                            ↓
                        </div>


                        <strong>
                            🍬 Glucose + 🫧 O₂
                        </strong>

                    </div>


                    <div
                        class="photosynthesis-production-grid"
                    >

                        <div>

                            <span>
                                OXYGEN
                            </span>


                            <strong
                                id="photosynthesis-oxygen"
                            >
                                0
                            </strong>

                        </div>


                        <div>

                            <span>
                                GLUCOSE
                            </span>


                            <strong
                                id="photosynthesis-glucose"
                            >
                                0
                            </strong>

                        </div>

                    </div>

                </aside>

            </div>


            <!-- =================================================
                 GALLERY
            ================================================= -->

            ${createGalleryPage()}

        </section>

    `;

}


// ============================================================
// ENZYME LAB
// ============================================================

function createEnzymeLab() {

    return `

        <section
            class="enzyme-lab"
            id="enzyme-lab"
        >

            <div
                class="enzyme-lab-header"
            >

                <div>

                    <span
                        class="enzyme-kicker"
                    >
                        SCILAB • BIOLOGY • VIRTUAL LAB
                    </span>


                    <h2>
                        Enzyme Activity Laboratory
                    </h2>


                    <p>
                        Investigate how temperature,
                        pH, substrate concentration
                        and enzyme concentration affect
                        enzyme activity.
                    </p>

                </div>


                <div
                    id="enzyme-status"
                    class="enzyme-status"
                >
                    READY
                </div>

            </div>


            <div
                class="enzyme-lab-grid"
            >

                <aside
                    class="enzyme-controls"
                >

                    <div
                        class="enzyme-panel-title"
                    >
                        EXPERIMENT CONTROLS
                    </div>


                    <label>
                        Temperature

                        <output
                            id="enzyme-temperature-value"
                        >
                            37°C
                        </output>
                    </label>


                    <input
                        id="enzyme-temperature"
                        type="range"
                        min="0"
                        max="80"
                        step="1"
                        value="37"
                    />


                    <label>
                        pH

                        <output
                            id="enzyme-ph-value"
                        >
                            7.0
                        </output>
                    </label>


                    <input
                        id="enzyme-ph"
                        type="range"
                        min="0"
                        max="14"
                        step="0.1"
                        value="7"
                    />


                    <label>
                        Substrate Concentration

                        <output
                            id="enzyme-substrate-value"
                        >
                            60%
                        </output>
                    </label>


                    <input
                        id="enzyme-substrate"
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value="60"
                    />


                    <label>
                        Enzyme Concentration

                        <output
                            id="enzyme-concentration-value"
                        >
                            50%
                        </output>
                    </label>


                    <input
                        id="enzyme-concentration"
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value="50"
                    />


                    <div
                        class="enzyme-control-actions"
                    >

                        <button
                            id="enzyme-start"
                            type="button"
                        >
                            ▶ Start Reaction
                        </button>


                        <button
                            id="enzyme-pause"
                            type="button"
                        >
                            ⏸ Pause
                        </button>


                        <button
                            id="enzyme-reset"
                            type="button"
                        >
                            ↺ Reset
                        </button>

                    </div>


                    <button
                        id="enzyme-gallery-open"
                        type="button"
                        class="
                            biology-simulation-control
                            enzyme-gallery-button
                        "
                    >
                        🖼 View Enzyme Images
                    </button>

                </aside>


                <div
                    class="enzyme-simulation-panel"
                >

                    <div
                        class="enzyme-simulation-header"
                    >

                        <span>
                            LIVE SIMULATION
                        </span>


                        <span
                            id="enzyme-reaction-state"
                        >
                            Ready — press Start Reaction.
                        </span>

                    </div>


                    <div
                        id="biology-simulation-container"
                        class="enzyme-canvas"
                    ></div>


                    <div
                        class="enzyme-simulation-caption"
                    >
                        Substrate → binding → enzyme-substrate
                        complex → catalysis → products → release.
                    </div>

                </div>


                <aside
                    class="enzyme-results"
                >

                    <div
                        class="enzyme-panel-title"
                    >
                        LIVE RESULTS
                    </div>


                    <div
                        class="enzyme-result"
                    >

                        <span>
                            Enzyme Activity
                        </span>


                        <strong
                            id="enzyme-activity"
                        >
                            0%
                        </strong>

                    </div>


                    <div
                        class="enzyme-result"
                    >

                        <span>
                            Reaction Rate
                        </span>


                        <strong
                            id="enzyme-rate"
                        >
                            0
                        </strong>

                    </div>


                    <div
                        class="enzyme-result"
                    >

                        <span>
                            Product Formation
                        </span>


                        <strong
                            id="enzyme-product"
                        >
                            0%
                        </strong>

                    </div>


                    <div
                        class="enzyme-result"
                    >

                        <span>
                            Temperature Factor
                        </span>


                        <strong
                            id="enzyme-temp-factor"
                        >
                            0%
                        </strong>

                    </div>


                    <div
                        class="enzyme-result"
                    >

                        <span>
                            pH Factor
                        </span>


                        <strong
                            id="enzyme-ph-factor"
                        >
                            0%
                        </strong>

                    </div>


                    <div
                        class="enzyme-state-card"
                    >

                        <span>
                            REACTION STATE
                        </span>


                        <strong
                            id="enzyme-state"
                        >
                            READY
                        </strong>


                        <small
                            id="enzyme-state-text"
                        >
                            Adjust the controls and
                            start the experiment.
                        </small>

                    </div>

                </aside>

            </div>


            <section
                class="enzyme-graph-panel"
            >

                <div
                    class="enzyme-graph-heading"
                >

                    <span>
                        LIVE GRAPH
                    </span>


                    <h3>
                        Reaction Rate Over Time
                    </h3>

                </div>


                <canvas
                    id="enzyme-graph"
                    width="1200"
                    height="300"
                ></canvas>

            </section>


            <section
                class="enzyme-explanation"
            >

                <span>
                    WHAT IS HAPPENING?
                </span>


                <h3>
                    Enzyme Catalysis
                </h3>


                <p
                    id="enzyme-explanation-text"
                >
                    The substrate approaches the enzyme's
                    active site, binds to it, undergoes
                    catalysis, and products are released.
                    The enzyme remains available to catalyze
                    another reaction.
                </p>

            </section>


            ${createGalleryPage()}

        </section>

    `;

}


// ============================================================
// OSMOSIS LAB
// ============================================================

function createOsmosisLab() {

    return `

        <section
            class="osmosis-lab"
            id="osmosis-lab"
        >

            <div
                class="osmosis-lab-header"
            >

                <div>

                    <span
                        class="osmosis-kicker"
                    >
                        SCILAB • BIOLOGY • VIRTUAL LAB
                    </span>


                    <h2>
                        Osmosis Laboratory
                    </h2>


                    <p>
                        Investigate how water moves across
                        a selectively permeable membrane.
                    </p>

                </div>


                <div
                    id="osmosis-status"
                    class="osmosis-status"
                >
                    READY
                </div>

            </div>


            <div
                class="osmosis-lab-grid"
            >

                <aside
                    class="osmosis-controls"
                >

                    <div
                        class="osmosis-panel-title"
                    >
                        EXPERIMENT CONTROLS
                    </div>


                    <label>
                        Inside Solute

                        <output
                            id="osmosis-outside-value"
                        >
                            10%
                        </output>
                    </label>


                    <input
                        id="osmosis-outside"
                        type="range"
                        min="0"
                        max="30"
                        value="10"
                    />


                    <label>
                        Outside Solute

                        <output
                            id="osmosis-inside-value"
                        >
                            4%
                        </output>
                    </label>


                    <input
                        id="osmosis-inside"
                        type="range"
                        min="0"
                        max="30"
                        value="4"
                    />


                    <label>
                        Membrane Permeability

                        <output
                            id="osmosis-permeability-value"
                        >
                            75%
                        </output>
                    </label>


                    <input
                        id="osmosis-permeability"
                        type="range"
                        min="0"
                        max="100"
                        value="75"
                    />


                    <label>
                        Temperature

                        <output
                            id="osmosis-temperature-value"
                        >
                            25°C
                        </output>
                    </label>


                    <input
                        id="osmosis-temperature"
                        type="range"
                        min="5"
                        max="45"
                        value="25"
                    />


                    <div
                        class="osmosis-control-actions"
                    >

                        <button
                            id="osmosis-start"
                            type="button"
                        >
                            ▶ Start
                        </button>


                        <button
                            id="osmosis-pause"
                            type="button"
                        >
                            ⏸ Pause
                        </button>


                        <button
                            id="osmosis-reset"
                            type="button"
                        >
                            ↺ Reset
                        </button>

                    </div>


                    <button
                        id="osmosis-gallery-open"
                        type="button"
                        class="
                            biology-simulation-control
                            osmosis-gallery-button
                        "
                    >
                        🖼 View Osmosis Images
                    </button>

                </aside>


                <div
                    class="osmosis-simulation-panel"
                >

                    <div
                        class="osmosis-simulation-header"
                    >

                        <span>
                            LIVE SIMULATION
                        </span>


                        <span
                            id="osmosis-direction"
                        >
                            Calculating...
                        </span>

                    </div>


                    <div
                        id="osmosis-canvas"
                        class="osmosis-canvas"
                    ></div>


                    <div
                        class="osmosis-simulation-caption"
                    >
                        Water molecules move randomly while
                        the highlighted particles represent
                        the net osmotic movement.
                    </div>

                </div>


                <aside
                    class="osmosis-results"
                >

                    <div
                        class="osmosis-panel-title"
                    >
                        LIVE RESULTS
                    </div>


                    <div
                        class="osmosis-result"
                    >

                        <span>
                            Cell Volume
                        </span>


                        <strong
                            id="osmosis-cell-volume"
                        >
                            100%
                        </strong>

                    </div>


                    <div
                        class="osmosis-result"
                    >

                        <span>
                            Water Flow
                        </span>


                        <strong
                            id="osmosis-water-flow"
                        >
                            0.0
                        </strong>

                    </div>


                    <div
                        class="osmosis-result"
                    >

                        <span>
                            Equilibrium
                        </span>


                        <strong
                            id="osmosis-equilibrium"
                        >
                            6.0
                        </strong>

                    </div>


                    <div
                        class="osmosis-result"
                    >

                        <span>
                            Inside Solute
                        </span>


                        <strong
                            id="osmosis-result-outside"
                        >
                            10%
                        </strong>

                    </div>


                    <div
                        class="osmosis-result"
                    >

                        <span>
                            Outside Solute
                        </span>


                        <strong
                            id="osmosis-result-inside"
                        >
                            4%
                        </strong>

                    </div>


                    <div
                        class="osmosis-direction-card"
                    >

                        <span>
                            NET WATER MOVEMENT
                        </span>


                        <strong
                            id="osmosis-net-direction"
                        >
                            →
                        </strong>


                        <small
                            id="osmosis-direction-text"
                        >
                            Toward the higher effective
                            solute concentration.
                        </small>

                    </div>

                </aside>

            </div>


            <section
                class="osmosis-graph-panel"
            >

                <div
                    class="osmosis-graph-heading"
                >

                    <span>
                        LIVE GRAPH
                    </span>


                    <h3>
                        Cell Volume Over Time
                    </h3>

                </div>


                <canvas
                    id="osmosis-graph"
                    width="1200"
                    height="300"
                ></canvas>

            </section>


            <section
                class="osmosis-explanation"
            >

                <span>
                    WHAT IS HAPPENING?
                </span>


                <h3>
                    Osmosis
                </h3>


                <p
                    id="osmosis-explanation-text"
                >
                    Water moves across a selectively permeable
                    membrane toward the side with greater
                    effective solute concentration until
                    dynamic equilibrium is approached.
                </p>

            </section>


            ${createGalleryPage()}

        </section>

    `;

}


// ============================================================
// GALLERY PAGE
// ============================================================

function createGalleryPage() {

    return `

        <section
            id="biology-gallery-page"
            class="biology-gallery-page"
            hidden
        >

            <div
                class="biology-gallery-page-header"
            >

                <div>

                    <span
                        class="biology-info-label"
                    >
                        IMAGE GALLERY
                    </span>


                    <h2
                        id="biology-gallery-page-title"
                    >
                        Related Images
                    </h2>


                    <p
                        id="biology-gallery-page-description"
                    >
                        Explore educational images related
                        to this simulation.
                    </p>

                </div>


                <button
                    id="biology-gallery-back"
                    type="button"
                    class="biology-simulation-control"
                >
                    ← Back to Simulation
                </button>

            </div>


            <div
                class="biology-gallery-feature"
            >

                <button
                    id="biology-gallery-prev"
                    type="button"
                    class="biology-gallery-nav"
                    aria-label="Previous image"
                >
                    ←
                </button>


                <div
                    class="biology-gallery-feature-image-wrap"
                >

                    <img
                        id="biology-gallery-main-image"
                        class="biology-gallery-main-image"
                        src=""
                        alt=""
                        loading="eager"
                        referrerpolicy="no-referrer"
                    />


                    <div
                        class="biology-gallery-image-caption"
                    >

                        <h3
                            id="biology-gallery-main-title"
                        ></h3>


                        <p
                            id="biology-gallery-main-description"
                        ></p>

                    </div>

                </div>


                <button
                    id="biology-gallery-next"
                    type="button"
                    class="biology-gallery-nav"
                    aria-label="Next image"
                >
                    →
                </button>

            </div>


            <div
                id="biology-gallery-page-grid"
                class="biology-gallery-page-grid"
            ></div>

        </section>

    `;

}


// ============================================================
// GALLERY HELPERS
// ============================================================

function getGalleryItems(
    mode
) {

    return (
        galleryData[mode] ||
        []
    );

}


// ============================================================
// GALLERY TITLE
// ============================================================

function getGalleryTitle(
    mode
) {

    switch (
        mode
    ) {

        case "plant-cell":

            return "Plant Cell";


        case "animal-cell":

            return "Animal Cell";


        case "osmosis":

            return "Osmosis";


        case "photosynthesis":

            return "Photosynthesis";


        case "enzyme":

            return "Enzyme";


        case "circulation":

            return "Circulation";


        default:

            return "Biology";

    }

}


// ============================================================
// RENDER FULL GALLERY
// ============================================================

function renderGalleryPage(
    mode
) {

    const grid =
        document.getElementById(
            "biology-gallery-page-grid"
        );


    if (!grid) {
        return;
    }


    const images =
        getGalleryItems(
            mode
        );


    if (!images.length) {

        grid.innerHTML = `

            <div
                class="biology-gallery-empty"
            >
                No images available.
            </div>

        `;

        return;

    }


    const title =
        document.getElementById(
            "biology-gallery-page-title"
        );


    const description =
        document.getElementById(
            "biology-gallery-page-description"
        );


    if (title) {

        title.textContent =
            `${getGalleryTitle(mode)} Gallery`;

    }


    if (description) {

        description.textContent =
            `Explore educational images related to ${getGalleryTitle(mode)}.`;

    }


    grid.innerHTML =
        images
            .map(
                (
                    item,
                    index
                ) => `

                    <button
                        type="button"
                        class="
                            biology-gallery-page-item
                            ${
                                index ===
                                currentGalleryIndex
                                    ? "is-active"
                                    : ""
                            }
                        "
                        data-gallery-page-index="${index}"
                    >

                        <img
                            src="${item.image}"
                            alt="${item.title}"
                            loading="lazy"
                            referrerpolicy="no-referrer"
                        />


                        <span>
                            ${item.title}
                        </span>

                    </button>

                `
            )
            .join("");


    grid
        .querySelectorAll(
            "[data-gallery-page-index]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        currentGalleryIndex =
                            Number(
                                button.dataset
                                    .galleryPageIndex
                            );


                        showGalleryImage(
                            mode,
                            currentGalleryIndex
                        );

                    }
                );

            }
        );

}


// ============================================================
// OPEN GALLERY
// ============================================================

function openGalleryPage(
    mode,
    index = 0
) {

    const galleryPage =
        document.getElementById(
            "biology-gallery-page"
        );


    const simulationContainer =
        document.getElementById(
            "biology-simulation-container"
        );


    if (!galleryPage) {
        return;
    }


    const images =
        getGalleryItems(
            mode
        );


    if (!images.length) {
        return;
    }


    activeGalleryMode =
        mode;


    currentGalleryIndex =
        index;


    if (simulationContainer) {

        simulationContainer.hidden =
            true;

    }


    galleryPage.hidden =
        false;


    renderGalleryPage(
        mode
    );


    showGalleryImage(
        mode,
        index
    );

}


// ============================================================
// SHOW GALLERY IMAGE
// ============================================================

function showGalleryImage(
    mode,
    index
) {

    const images =
        getGalleryItems(
            mode
        );


    if (!images.length) {
        return;
    }


    if (
        index < 0
    ) {

        index =
            images.length -
            1;

    }


    if (
        index >=
        images.length
    ) {

        index =
            0;

    }


    currentGalleryIndex =
        index;


    const item =
        images[
            currentGalleryIndex
        ];


    const image =
        document.getElementById(
            "biology-gallery-main-image"
        );


    const title =
        document.getElementById(
            "biology-gallery-main-title"
        );


    const description =
        document.getElementById(
            "biology-gallery-main-description"
        );


    if (image) {

        image.style.opacity =
            "0";


        image.src =
            item.image;


        image.alt =
            item.title;


        image.onload =
            () => {

                image.style.opacity =
                    "1";

            };


        image.onerror =
            () => {

                image.style.opacity =
                    "1";

                console.warn(
                    "SciLab Gallery image failed:",
                    item.image
                );

            };

    }


    if (title) {

        title.textContent =
            item.title;

    }


    if (description) {

        description.textContent =
            item.description;

    }


    updateGalleryActiveState();

}


// ============================================================
// ACTIVE GALLERY THUMBNAIL
// ============================================================

function updateGalleryActiveState() {

    document
        .querySelectorAll(
            "[data-gallery-page-index]"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "is-active",

                    Number(
                        button.dataset
                            .galleryPageIndex
                    ) ===
                    currentGalleryIndex
                );

            }
        );

}


// ============================================================
// CLOSE GALLERY
// ============================================================

function closeGalleryPage() {

    const galleryPage =
        document.getElementById(
            "biology-gallery-page"
        );


    const simulationContainer =
        document.getElementById(
            "biology-simulation-container"
        );


    if (galleryPage) {

        galleryPage.hidden =
            true;

    }


    if (simulationContainer) {

        simulationContainer.hidden =
            false;

    }


    requestAnimationFrame(
        () => {

            simulator?.resize?.();

        }
    );

}


// ============================================================
// PHOTOSYNTHESIS CONTROLS
// ============================================================

function initPhotosynthesisControls() {

    const simulation =
        simulator?.getCurrentSimulation?.();


    if (!simulation) {
        return null;
    }


    const start =
        document.getElementById(
            "photosynthesis-start"
        );


    const pause =
        document.getElementById(
            "photosynthesis-pause"
        );


    const reset =
        document.getElementById(
            "photosynthesis-reset"
        );


    const speed =
        document.getElementById(
            "photosynthesis-speed"
        );


    const gallery =
        document.getElementById(
            "photosynthesis-gallery-open"
        );


    const status =
        document.getElementById(
            "photosynthesis-status"
        );


    const oxygen =
        document.getElementById(
            "photosynthesis-oxygen"
        );


    const glucose =
        document.getElementById(
            "photosynthesis-glucose"
        );


    const stageLabel =
        document.getElementById(
            "photosynthesis-stage-label"
        );


    const message =
        document.getElementById(
            "photosynthesis-message"
        );


    const stageElements =
        document.querySelectorAll(
            ".photosynthesis-stage-step"
        );


    const stageNames = [

        "Plant",

        "Water",

        "Carbon Dioxide",

        "Light Energy",

        "Chloroplast",

        "Photosynthesis Reaction",

        "Glucose + Oxygen"

    ];


    const stageMessages = [

        "The plant is ready to begin photosynthesis.",

        "Water is absorbed from the soil and transported upward.",

        "Carbon dioxide enters the leaf from the air.",

        "Light energy reaches the leaf and is captured by chlorophyll.",

        "The process moves into the chloroplast.",

        "Light energy, carbon dioxide and water are used in the photosynthetic reaction.",

        "Glucose is formed while oxygen is released."

    ];


    const updateUI =
        () => {

            const state =
                simulation.getState?.();


            if (!state) {
                return;
            }


            // ---------------------------------------------
            // NUMBERS
            // ---------------------------------------------

            if (oxygen) {

                oxygen.textContent =
                    Math.floor(
                        state.oxygenProduced ||
                        0
                    );

            }


            if (glucose) {

                glucose.textContent =
                    Math.floor(
                        state.glucoseProduced ||
                        0
                    );

            }


            // ---------------------------------------------
            // STAGE
            // ---------------------------------------------

            const stage =
                Number(
                    state.stage ||
                    0
                );


            if (stageLabel) {

                stageLabel.textContent =
                    stageNames[
                        stage
                    ] ||
                    "Photosynthesis";

            }


            if (message) {

                message.textContent =
                    stageMessages[
                        stage
                    ] ||
                    "Photosynthesis is taking place.";

            }


            // ---------------------------------------------
            // ACTIVE STAGE
            // ---------------------------------------------

            stageElements.forEach(
                element => {

                    const elementStage =
                        Number(
                            element.dataset.stage
                        );


                    element.classList.toggle(
                        "active",

                        elementStage ===
                        stage
                    );


                    element.classList.toggle(
                        "completed",

                        elementStage <
                        stage
                    );

                }
            );


            // ---------------------------------------------
            // STATUS
            // ---------------------------------------------

            if (status) {

                if (
                    state.paused
                ) {

                    status.textContent =
                        "PAUSED";

                }

                else if (
                    state.running
                ) {

                    status.textContent =
                        "RUNNING";

                }

                else {

                    status.textContent =
                        "READY";

                }

            }


            // ---------------------------------------------
            // SPEED
            // ---------------------------------------------

            if (speed) {

                speed.textContent =
                    `⚡ ${Number(
                        state.animationSpeed ||
                        1
                    ).toFixed(2)}×`;

            }

        };


    // ========================================================
    // PLAY
    // ========================================================

    start?.addEventListener(
        "click",
        () => {

            simulation.start();


            if (
                simulation.paused
            ) {

                simulation.paused =
                    false;

            }


            updateUI();

        }
    );


    // ========================================================
    // PAUSE
    // ========================================================

    pause?.addEventListener(
        "click",
        () => {

            simulation.pause();

            updateUI();

        }
    );


    // ========================================================
    // RESET
    // ========================================================

    reset?.addEventListener(
        "click",
        () => {

            simulation.reset();

            updateUI();

        }
    );


    // ========================================================
    // SPEED
    // ========================================================

    speed?.addEventListener(
        "click",
        () => {

            const current =
                Number(
                    simulation.animationSpeed ||
                    1
                );


            let next;


            if (
                current <
                1
            ) {

                next =
                    1;

            }

            else if (
                current <
                2
            ) {

                next =
                    2;

            }

            else if (
                current <
                3
            ) {

                next =
                    3;

            }

            else {

                next =
                    0.5;

            }


            simulation.setAnimationSpeed?.(
                next
            );


            updateUI();

        }
    );


    // ========================================================
    // GALLERY
    // ========================================================

    gallery?.addEventListener(
        "click",
        () => {

            openGalleryPage(
                "photosynthesis",
                0
            );

        }
    );


    // ========================================================
    // STATE TIMER
    // ========================================================

    const timer =
        window.setInterval(
            () => {

                if (
                    !simulator ||
                    simulator.getCurrentMode?.() !==
                    "photosynthesis"
                ) {

                    return;

                }


                updateUI();

            },
            120
        );


    updateUI();


    return () => {

        window.clearInterval(
            timer
        );

    };

}


// ============================================================
// OSMOSIS GRAPH
// ============================================================

let osmosisGraphHistory =
    [];


function drawOsmosisGraph() {

    const canvas =
        document.getElementById(
            "osmosis-graph"
        );


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


    context.globalAlpha =
        0.15;


    context.strokeStyle =
        "#ffffff";


    for (
        let y = 40;
        y < height - 35;
        y += 45
    ) {

        context.beginPath();


        context.moveTo(
            55,
            y
        );


        context.lineTo(
            width - 30,
            y
        );


        context.stroke();

    }


    context.globalAlpha =
        1;


    context.beginPath();


    context.moveTo(
        55,
        20
    );


    context.lineTo(
        55,
        height - 35
    );


    context.lineTo(
        width - 30,
        height - 35
    );


    context.stroke();


    context.fillStyle =
        "#ffffff";


    context.font =
        "12px Arial";


    context.fillText(
        "Cell Volume (%)",
        8,
        22
    );


    context.fillText(
        "Time",
        width - 55,
        height - 10
    );


    if (
        osmosisGraphHistory.length <
        2
    ) {

        return;

    }


    const min =
        60;


    const max =
        140;


    const chartWidth =
        width -
        85;


    const chartHeight =
        height -
        60;


    context.beginPath();


    osmosisGraphHistory.forEach(
        (
            value,
            index
        ) => {

            const x =
                55 +
                (
                    index /
                    (
                        osmosisGraphHistory.length -
                        1
                    )
                ) *
                chartWidth;


            const normalized =
                (
                    value -
                    min
                ) /
                (
                    max -
                    min
                );


            const y =
                20 +
                (
                    1 -
                    normalized
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

            }

            else {

                context.lineTo(
                    x,
                    y
                );

            }

        }
    );


    context.strokeStyle =
        "#62d7ff";


    context.lineWidth =
        3;


    context.stroke();

}


// ============================================================
// ENZYME GRAPH
// ============================================================

let enzymeGraphHistory =
    [];


function drawEnzymeGraph() {

    const canvas =
        document.getElementById(
            "enzyme-graph"
        );


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


    context.globalAlpha =
        0.15;


    context.strokeStyle =
        "#ffffff";


    for (
        let y = 40;
        y < height - 35;
        y += 45
    ) {

        context.beginPath();


        context.moveTo(
            55,
            y
        );


        context.lineTo(
            width - 30,
            y
        );


        context.stroke();

    }


    context.globalAlpha =
        1;


    context.beginPath();


    context.moveTo(
        55,
        20
    );


    context.lineTo(
        55,
        height - 35
    );


    context.lineTo(
        width - 30,
        height - 35
    );


    context.stroke();


    context.fillStyle =
        "#ffffff";


    context.font =
        "12px Arial";


    context.fillText(
        "Reaction Rate",
        8,
        22
    );


    context.fillText(
        "Time",
        width - 55,
        height - 10
    );


    if (
        enzymeGraphHistory.length <
        2
    ) {

        return;

    }


    const chartWidth =
        width -
        85;


    const chartHeight =
        height -
        60;


    context.beginPath();


    enzymeGraphHistory.forEach(
        (
            value,
            index
        ) => {

            const x =
                55 +
                (
                    index /
                    (
                        enzymeGraphHistory.length -
                        1
                    )
                ) *
                chartWidth;


            const normalized =
                Math.max(
                    0,
                    Math.min(
                        1,
                        value /
                        100
                    )
                );


            const y =
                20 +
                (
                    1 -
                    normalized
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

            }

            else {

                context.lineTo(
                    x,
                    y
                );

            }

        }
    );


    context.strokeStyle =
        "#b985ff";


    context.lineWidth =
        3;


    context.stroke();

}


// ============================================================
// OSMOSIS CONTROLS
// ============================================================

function initOsmosisControls() {

    const simulation =
        simulator?.getCurrentSimulation?.();


    if (!simulation) {
        return null;
    }


    const outside =
        document.getElementById(
            "osmosis-outside"
        );


    const inside =
        document.getElementById(
            "osmosis-inside"
        );


    const permeability =
        document.getElementById(
            "osmosis-permeability"
        );


    const temperature =
        document.getElementById(
            "osmosis-temperature"
        );


    const outsideValue =
        document.getElementById(
            "osmosis-outside-value"
        );


    const insideValue =
        document.getElementById(
            "osmosis-inside-value"
        );


    const permeabilityValue =
        document.getElementById(
            "osmosis-permeability-value"
        );


    const temperatureValue =
        document.getElementById(
            "osmosis-temperature-value"
        );


    const status =
        document.getElementById(
            "osmosis-status"
        );


    const cellVolume =
        document.getElementById(
            "osmosis-cell-volume"
        );


    const waterFlow =
        document.getElementById(
            "osmosis-water-flow"
        );


    const equilibrium =
        document.getElementById(
            "osmosis-equilibrium"
        );


    const resultOutside =
        document.getElementById(
            "osmosis-result-outside"
        );


    const resultInside =
        document.getElementById(
            "osmosis-result-inside"
        );


    const direction =
        document.getElementById(
            "osmosis-direction"
        );


    const netDirection =
        document.getElementById(
            "osmosis-net-direction"
        );


    const directionText =
        document.getElementById(
            "osmosis-direction-text"
        );


    const updateUI =
        () => {

            const state =
                simulation.getState?.();


            if (!state) {
                return;
            }


            if (outsideValue) {

                outsideValue.textContent =
                    `${state.outsideSolute}%`;

            }


            if (insideValue) {

                insideValue.textContent =
                    `${state.insideSolute}%`;

            }


            if (permeabilityValue) {

                permeabilityValue.textContent =
                    `${state.permeability}%`;

            }


            if (temperatureValue) {

                temperatureValue.textContent =
                    `${temperature?.value || 25}°C`;

            }


            if (cellVolume) {

                cellVolume.textContent =
                    `${state.cellVolume.toFixed(1)}%`;

            }


            if (waterFlow) {

                waterFlow.textContent =
                    state.waterFlow.toFixed(1);

            }


            if (equilibrium) {

                equilibrium.textContent =
                    state.equilibrium.toFixed(1);

            }


            if (resultOutside) {

                resultOutside.textContent =
                    `${state.outsideSolute}%`;

            }


            if (resultInside) {

                resultInside.textContent =
                    `${state.insideSolute}%`;

            }


            if (
                state.outsideSolute >
                state.insideSolute
            ) {

                if (direction) {

                    direction.textContent =
                        "Outside → Cell";

                }


                if (netDirection) {

                    netDirection.textContent =
                        "→";

                }


                if (directionText) {

                    directionText.textContent =
                        "Water moves toward the side with greater effective solute concentration.";

                }

            }

            else if (
                state.insideSolute >
                state.outsideSolute
            ) {

                if (direction) {

                    direction.textContent =
                        "Cell → Outside";

                }


                if (netDirection) {

                    netDirection.textContent =
                        "←";

                }


                if (directionText) {

                    directionText.textContent =
                        "Water moves toward the side with greater effective solute concentration.";

                }

            }

            else {

                if (direction) {

                    direction.textContent =
                        "No net movement";

                }


                if (netDirection) {

                    netDirection.textContent =
                        "↔";

                }


                if (directionText) {

                    directionText.textContent =
                        "The system is approaching dynamic equilibrium.";

                }

            }

        };


    outside?.addEventListener(
        "input",
        () => {

            simulation.setOutsideSolute(
                Number(
                    outside.value
                )
            );


            updateUI();

        }
    );


    inside?.addEventListener(
        "input",
        () => {

            simulation.setInsideSolute(
                Number(
                    inside.value
                )
            );


            updateUI();

        }
    );


    permeability?.addEventListener(
        "input",
        () => {

            simulation.setPermeability(
                Number(
                    permeability.value
                )
            );


            updateUI();

        }
    );


    temperature?.addEventListener(
        "input",
        () => {

            simulation.setTemperature?.(
                Number(
                    temperature.value
                )
            );


            updateUI();

        }
    );


    document
        .getElementById(
            "osmosis-start"
        )
        ?.addEventListener(
            "click",
            () => {

                simulation.start();


                if (status) {

                    status.textContent =
                        "RUNNING";

                }

            }
        );


    document
        .getElementById(
            "osmosis-pause"
        )
        ?.addEventListener(
            "click",
            () => {

                simulation.pause();


                if (status) {

                    status.textContent =
                        "PAUSED";

                }

            }
        );


    document
        .getElementById(
            "osmosis-reset"
        )
        ?.addEventListener(
            "click",
            () => {

                simulation.reset();


                if (outside) {
                    outside.value = "10";
                }


                if (inside) {
                    inside.value = "4";
                }


                if (permeability) {
                    permeability.value = "75";
                }


                if (temperature) {
                    temperature.value = "25";
                }


                osmosisGraphHistory =
                    [];


                if (status) {

                    status.textContent =
                        "READY";

                }


                updateUI();

                drawOsmosisGraph();

            }
        );


    document
        .getElementById(
            "osmosis-gallery-open"
        )
        ?.addEventListener(
            "click",
            () => {

                openGalleryPage(
                    "osmosis",
                    0
                );

            }
        );


    const graphTimer =
        window.setInterval(
            () => {

                if (
                    !simulator ||
                    simulator.getCurrentMode?.() !==
                    "osmosis"
                ) {

                    return;

                }


                const state =
                    simulation.getState?.();


                if (!state) {
                    return;
                }


                osmosisGraphHistory.push(
                    state.cellVolume
                );


                if (
                    osmosisGraphHistory.length >
                    100
                ) {

                    osmosisGraphHistory.shift();

                }


                drawOsmosisGraph();

            },
            180
        );


    updateUI();


    return () => {

        window.clearInterval(
            graphTimer
        );

    };

}


// ============================================================
// ENZYME CONTROLS
// ============================================================

function initEnzymeControls() {

    const simulation =
        simulator?.getCurrentSimulation?.();


    if (!simulation) {
        return null;
    }


    const temperature =
        document.getElementById(
            "enzyme-temperature"
        );


    const ph =
        document.getElementById(
            "enzyme-ph"
        );


    const substrate =
        document.getElementById(
            "enzyme-substrate"
        );


    const enzyme =
        document.getElementById(
            "enzyme-concentration"
        );


    const temperatureValue =
        document.getElementById(
            "enzyme-temperature-value"
        );


    const phValue =
        document.getElementById(
            "enzyme-ph-value"
        );


    const substrateValue =
        document.getElementById(
            "enzyme-substrate-value"
        );


    const enzymeValue =
        document.getElementById(
            "enzyme-concentration-value"
        );


    const activity =
        document.getElementById(
            "enzyme-activity"
        );


    const rate =
        document.getElementById(
            "enzyme-rate"
        );


    const product =
        document.getElementById(
            "enzyme-product"
        );


    const tempFactor =
        document.getElementById(
            "enzyme-temp-factor"
        );


    const phFactor =
        document.getElementById(
            "enzyme-ph-factor"
        );


    const state =
        document.getElementById(
            "enzyme-state"
        );


    const stateText =
        document.getElementById(
            "enzyme-state-text"
        );


    const status =
        document.getElementById(
            "enzyme-status"
        );


    const reactionState =
        document.getElementById(
            "enzyme-reaction-state"
        );


    const explanation =
        document.getElementById(
            "enzyme-explanation-text"
        );


    const updateUI =
        () => {

            const data =
                simulation.getState?.();


            if (!data) {
                return;
            }


            if (temperatureValue) {

                temperatureValue.textContent =
                    `${data.temperature}°C`;

            }


            if (phValue) {

                phValue.textContent =
                    Number(
                        data.pH
                    ).toFixed(1);

            }


            if (substrateValue) {

                substrateValue.textContent =
                    `${data.substrate}%`;

            }


            if (enzymeValue) {

                enzymeValue.textContent =
                    `${data.enzyme}%`;

            }


            if (activity) {

                activity.textContent =
                    `${data.activity.toFixed(1)}%`;

            }


            if (rate) {

                rate.textContent =
                    data.reactionRate.toFixed(1);

            }


            if (product) {

                product.textContent =
                    `${data.productFormation.toFixed(1)}%`;

            }


            if (tempFactor) {

                tempFactor.textContent =
                    `${(
                        data.temperatureFactor *
                        100
                    ).toFixed(1)}%`;

            }


            if (phFactor) {

                phFactor.textContent =
                    `${(
                        data.pHFactor *
                        100
                    ).toFixed(1)}%`;

            }


            if (state) {

                switch (
                    data.phase
                ) {

                    case "moving":

                        state.textContent =
                            "APPROACH";

                        break;


                    case "binding":

                        state.textContent =
                            "BINDING";

                        break;


                    case "catalysis":

                        state.textContent =
                            "CATALYSIS";

                        break;


                    case "release":

                        state.textContent =
                            "RELEASE";

                        break;


                    case "complete":

                        state.textContent =
                            "COMPLETE";

                        break;


                    default:

                        state.textContent =
                            "READY";

                }

            }


            if (stateText) {

                stateText.textContent =
                    data.phaseDescription ||
                    "Adjust the controls and start the experiment.";

            }


            if (reactionState) {

                reactionState.textContent =
                    data.phaseDescription ||
                    "Ready — press Start Reaction.";

            }


            if (explanation) {

                explanation.textContent =
                    "The substrate approaches the enzyme's active site, binds to it, undergoes catalysis, and forms products. The enzyme remains available after the products are released.";

            }

        };


    temperature?.addEventListener(
        "input",
        () => {

            simulation.setTemperature(
                Number(
                    temperature.value
                )
            );


            updateUI();

        }
    );


    ph?.addEventListener(
        "input",
        () => {

            simulation.setPH(
                Number(
                    ph.value
                )
            );


            updateUI();

        }
    );


    substrate?.addEventListener(
        "input",
        () => {

            simulation.setSubstrateConcentration(
                Number(
                    substrate.value
                )
            );


            updateUI();

        }
    );


    enzyme?.addEventListener(
        "input",
        () => {

            simulation.setEnzymeConcentration(
                Number(
                    enzyme.value
                )
            );


            updateUI();

        }
    );


    document
        .getElementById(
            "enzyme-start"
        )
        ?.addEventListener(
            "click",
            () => {

                simulation.start();


                if (status) {

                    status.textContent =
                        "RUNNING";

                }


                if (reactionState) {

                    reactionState.textContent =
                        "Substrate is approaching the active site...";

                }


                updateUI();

            }
        );


    document
        .getElementById(
            "enzyme-pause"
        )
        ?.addEventListener(
            "click",
            () => {

                simulation.pause();


                if (status) {

                    status.textContent =
                        "PAUSED";

                }


                if (reactionState) {

                    reactionState.textContent =
                        "Simulation paused.";

                }


                updateUI();

            }
        );


    document
        .getElementById(
            "enzyme-reset"
        )
        ?.addEventListener(
            "click",
            () => {

                simulation.reset();


                if (temperature) {
                    temperature.value = "37";
                }


                if (ph) {
                    ph.value = "7";
                }


                if (substrate) {
                    substrate.value = "60";
                }


                if (enzyme) {
                    enzyme.value = "50";
                }


                enzymeGraphHistory =
                    [];


                if (status) {

                    status.textContent =
                        "READY";

                }


                updateUI();

                drawEnzymeGraph();

            }
        );


    document
        .getElementById(
            "enzyme-gallery-open"
        )
        ?.addEventListener(
            "click",
            () => {

                openGalleryPage(
                    "enzyme",
                    0
                );

            }
        );


    const graphTimer =
        window.setInterval(
            () => {

                if (
                    !simulator ||
                    simulator.getCurrentMode?.() !==
                    "enzyme"
                ) {

                    return;

                }


                const data =
                    simulation.getState?.();


                if (!data) {
                    return;
                }


                enzymeGraphHistory.push(
                    data.reactionRate
                );


                if (
                    enzymeGraphHistory.length >
                    100
                ) {

                    enzymeGraphHistory.shift();

                }


                drawEnzymeGraph();

            },
            180
        );


    updateUI();


    return () => {

        window.clearInterval(
            graphTimer
        );

    };

}


// ============================================================
// INIT
// ============================================================

function init(
    mode
) {

    const container =
        mode === "osmosis"

            ? document.getElementById(
                "osmosis-canvas"
            )

            : document.getElementById(
                "biology-simulation-container"
            );


    if (!container) {

        console.error(
            "Biology: simulation container not found."
        );

        return;

    }


    cleanupBiologySimulation();


    try {

        simulator =
            new BiologySimulator(
                container
            );


        simulator.start();


        // ====================================================
        // LOAD SIMULATION
        // ====================================================

        switch (
            mode
        ) {

            case "cells":

                activeCellMode =
                    "plant-cell";


                activeGalleryMode =
                    "plant-cell";


                simulator.showPlantCell();

                break;


            case "circulation":

                activeGalleryMode =
                    "circulation";


                simulator.showCirculation();

                break;


            case "osmosis":

                activeGalleryMode =
                    "osmosis";


                simulator.showOsmosis();

                break;


            case "photosynthesis":

                activeGalleryMode =
                    "photosynthesis";


                simulator.showPhotosynthesis();

                break;


            case "enzyme":

                activeGalleryMode =
                    "enzyme";


                simulator.showEnzymeActivity();

                break;


            default:

                activeGalleryMode =
                    "plant-cell";


                simulator.showPlantCell();

                break;

        }


        // ====================================================
        // SPECIAL CLEANUPS
        // ====================================================

        let specialCleanup =
            null;


        if (
            mode === "osmosis"
        ) {

            requestAnimationFrame(
                () => {

                    specialCleanup =
                        initOsmosisControls();

                }
            );

        }


        if (
            mode === "enzyme"
        ) {

            requestAnimationFrame(
                () => {

                    specialCleanup =
                        initEnzymeControls();

                }
            );

        }


        if (
            mode === "photosynthesis"
        ) {

            requestAnimationFrame(
                () => {

                    specialCleanup =
                        initPhotosynthesisControls();

                }
            );

        }


        // ====================================================
        // RESIZE
        // ====================================================

        requestAnimationFrame(
            () => {

                simulator?.resize?.();

            }
        );


        // ====================================================
        // BACK BUTTON
        // ====================================================

        document
            .getElementById(
                "biology-sim-back"
            )
            ?.addEventListener(
                "click",
                () => {

                    window.location.hash =
                        "biology";

                }
            );


        // ====================================================
        // AUTO ROTATE
        // ====================================================

        const rotateButton =
            document.getElementById(
                "biology-sim-rotate"
            );


        let rotating =
            false;


        rotateButton?.addEventListener(
            "click",
            event => {

                rotating =
                    !rotating;


                simulator.setAutoRotate(
                    rotating
                );


                event.currentTarget.textContent =
                    rotating
                        ? "⏸ Stop Rotation"
                        : "▶ Auto Rotate";

            }
        );


        // ====================================================
        // RESET CAMERA
        // ====================================================

        document
            .getElementById(
                "biology-sim-reset"
            )
            ?.addEventListener(
                "click",
                () => {

                    simulator.resetCamera();

                }
            );


        // ====================================================
        // PLANT CELL
        // ====================================================

        document
            .getElementById(
                "biology-plant-btn"
            )
            ?.addEventListener(
                "click",
                () => {

                    activeCellMode =
                        "plant-cell";


                    activeGalleryMode =
                        "plant-cell";


                    closeGalleryPage();


                    simulator.showPlantCell();


                    document
                        .getElementById(
                            "biology-plant-btn"
                        )
                        ?.classList.add(
                            "is-active"
                        );


                    document
                        .getElementById(
                            "biology-animal-btn"
                        )
                        ?.classList.remove(
                            "is-active"
                        );

                }
            );


        // ====================================================
        // ANIMAL CELL
        // ====================================================

        document
            .getElementById(
                "biology-animal-btn"
            )
            ?.addEventListener(
                "click",
                () => {

                    activeCellMode =
                        "animal-cell";


                    activeGalleryMode =
                        "animal-cell";


                    closeGalleryPage();


                    simulator.showAnimalCell();


                    document
                        .getElementById(
                            "biology-animal-btn"
                        )
                        ?.classList.add(
                            "is-active"
                        );


                    document
                        .getElementById(
                            "biology-plant-btn"
                        )
                        ?.classList.remove(
                            "is-active"
                        );

                }
            );


        // ====================================================
        // STRUCTURE INFO
        // ====================================================

        const structureHandler =
            event => {

                const data =
                    event.detail ||
                    {};


                const name =
                    document.getElementById(
                        "biology-selected-name"
                    );


                const description =
                    document.getElementById(
                        "biology-selected-description"
                    );


                const teacher =
                    document.getElementById(
                        "biology-teacher-text"
                    );


                if (name) {

                    name.textContent =
                        data.name ||
                        "Unknown";

                }


                if (description) {

                    description.textContent =
                        data.description ||
                        "No information available.";

                }


                if (teacher) {

                    teacher.textContent =
                        data.teacher ||
                        data.description ||
                        "Select a structure to continue the lesson.";

                }

            };


        window.addEventListener(
            "biology-structure-selected",
            structureHandler
        );


        // ====================================================
        // MAIN GALLERY BUTTON
        // ====================================================

        document
            .getElementById(
                "biology-gallery-open"
            )
            ?.addEventListener(
                "click",
                () => {

                    openGalleryPage(
                        activeGalleryMode,
                        0
                    );

                }
            );


        // ====================================================
        // PHOTOSYNTHESIS GALLERY
        // ====================================================

        document
            .getElementById(
                "photosynthesis-gallery-open"
            )
            ?.addEventListener(
                "click",
                () => {

                    openGalleryPage(
                        "photosynthesis",
                        0
                    );

                }
            );


        // ====================================================
        // OSMOSIS GALLERY
        // ====================================================

        document
            .getElementById(
                "osmosis-gallery-open"
            )
            ?.addEventListener(
                "click",
                () => {

                    openGalleryPage(
                        "osmosis",
                        0
                    );

                }
            );


        // ====================================================
        // ENZYME GALLERY
        // ====================================================

        document
            .getElementById(
                "enzyme-gallery-open"
            )
            ?.addEventListener(
                "click",
                () => {

                    openGalleryPage(
                        "enzyme",
                        0
                    );

                }
            );


        // ====================================================
        // GALLERY BACK
        // ====================================================

        document
            .getElementById(
                "biology-gallery-back"
            )
            ?.addEventListener(
                "click",
                closeGalleryPage
            );


        // ====================================================
        // GALLERY PREVIOUS
        // ====================================================

        document
            .getElementById(
                "biology-gallery-prev"
            )
            ?.addEventListener(
                "click",
                () => {

                    showGalleryImage(
                        activeGalleryMode,
                        currentGalleryIndex -
                        1
                    );

                }
            );


        // ====================================================
        // GALLERY NEXT
        // ====================================================

        document
            .getElementById(
                "biology-gallery-next"
            )
            ?.addEventListener(
                "click",
                () => {

                    showGalleryImage(
                        activeGalleryMode,
                        currentGalleryIndex +
                        1
                    );

                }
            );


        // ====================================================
        // CLEANUP
        // ====================================================

        cleanup =
            () => {

                window.removeEventListener(
                    "biology-structure-selected",
                    structureHandler
                );


                specialCleanup?.();


                simulator?.dispose?.();


                simulator =
                    null;

            };

    }

    catch (error) {

        console.error(
            "Biology Simulation initialization failed:",
            error
        );

    }

}


// ============================================================
// CLEANUP
// ============================================================

export function cleanupBiologySimulation() {

    cleanup?.();


    cleanup =
        null;


    simulator =
        null;

}


// ============================================================
// GET SIMULATOR
// ============================================================

export function getBiologySimulator() {

    return simulator;

}