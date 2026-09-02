// ============================================================
// SciLab - Biology Laboratory
// Biology.js
// Biology Hub
// ============================================================


// ============================================================
// SIMULATION DEFINITIONS
// ============================================================

const simulations = [

    // ========================================================
    // 01 - CELLS
    // ========================================================

    {
        id: "cells",

        route: "biology-cells",

        number: "01",

        title:
            "Animal Cell & Plant Cell",

        subtitle:
            "Cell Biology",

        icon:
            "🧫",

        description:
            "Explore animal and plant cells, organelles, membranes, cytoplasm, nucleus and internal cellular structures through an interactive 3D laboratory.",

        accent:
            "#38bdf8",

        category:
            "Cells",

        categoryKey:
            "cells",

        mode:
            "3D",

        features: [
            "Plant Cell",
            "Animal Cell",
            "Organelles",
            "Clickable Structures"
        ],

        status:
            "READY",

        level:
            "Interactive 3D"
    },


    // ========================================================
    // 02 - CIRCULATION
    // ========================================================

    {
        id:
            "circulation",

        route:
            "biology-circulation",

        number:
            "02",

        title:
            "Heart & Blood Circulation",

        subtitle:
            "Human Biology",

        icon:
            "❤️",

        description:
            "Explore the human heart, blood vessels, circulation pathways and the movement of blood through the body.",

        accent:
            "#ef4444",

        category:
            "Human Biology",

        categoryKey:
            "human",

        mode:
            "3D",

        features: [
            "Heart",
            "Blood Vessels",
            "Blood Flow",
            "Interactive Anatomy"
        ],

        status:
            "READY",

        level:
            "Interactive 3D"
    },


    // ========================================================
    // 03 - OSMOSIS
    // ========================================================

    {
        id:
            "osmosis",

        route:
            "biology-osmosis",

        number:
            "03",

        title:
            "Osmosis & Cell Membrane",

        subtitle:
            "Cell Transport",

        icon:
            "💧",

        description:
            "Investigate how water moves across a selectively permeable membrane and observe how concentration changes affect cell volume.",

        accent:
            "#22d3ee",

        category:
            "Cell Transport",

        categoryKey:
            "transport",

        mode:
            "LAB",

        features: [
            "Water Movement",
            "Solute Controls",
            "Membrane",
            "Live Graph"
        ],

        status:
            "READY",

        level:
            "Interactive Lab"
    },


    // ========================================================
    // 04 - PHOTOSYNTHESIS
    // ========================================================

    {
        id:
            "photosynthesis",

        route:
            "biology-photosynthesis",

        number:
            "04",

        title:
            "Photosynthesis",

        subtitle:
            "Plant Biology",

        icon:
            "🌿",

        description:
            "Explore how light energy, carbon dioxide and water are used by plants to produce glucose and oxygen.",

        accent:
            "#4ade80",

        category:
            "Plant Biology",

        categoryKey:
            "plant",

        mode:
            "LAB",

        features: [
            "Light",
            "CO₂",
            "Water",
            "Oxygen & Glucose"
        ],

        status:
            "READY",

        level:
            "Interactive Lab"
    },


    // ========================================================
    // 05 - ENZYME
    // ========================================================

    {
        id:
            "enzyme",

        route:
            "biology-enzyme",

        number:
            "05",

        title:
            "Enzyme Activity",

        subtitle:
            "Biochemistry",

        icon:
            "🧬",

        description:
            "Investigate how temperature, pH, substrate concentration and enzyme concentration affect enzyme activity.",

        accent:
            "#a78bfa",

        category:
            "Biochemistry",

        categoryKey:
            "biochemistry",

        mode:
            "LAB",

        features: [
            "Temperature",
            "pH",
            "Substrate",
            "Reaction Rate"
        ],

        status:
            "READY",

        level:
            "Interactive Lab"
    }

];


// ============================================================
// STATE
// ============================================================

let activeFilter =
    "All";

let searchTerm =
    "";


// ============================================================
// FILTERS
// ============================================================

const filters = [

    "All",

    "Cells",

    "Human Biology",

    "Cell Transport",

    "Plant Biology",

    "Biochemistry"

];


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// ============================================================
// GET FILTERED SIMULATIONS
// ============================================================

function getFilteredSimulations() {

    const normalizedSearch =
        searchTerm
            .trim()
            .toLowerCase();


    return simulations.filter(
        simulation => {

            const matchesFilter =
                activeFilter === "All" ||
                simulation.category ===
                    activeFilter;


            if (!matchesFilter) {

                return false;

            }


            if (!normalizedSearch) {

                return true;

            }


            const searchable =
                [

                    simulation.title,

                    simulation.subtitle,

                    simulation.description,

                    simulation.category,

                    simulation.mode,

                    simulation.level,

                    ...simulation.features

                ]
                    .join(" ")
                    .toLowerCase();


            return searchable.includes(
                normalizedSearch
            );

        }
    );

}


// ============================================================
// NAVIGATION
// ============================================================

function openSimulation(
    route
) {

    const cleanRoute =
        String(
            route || ""
        )

            .trim()

            .replace(
                /^#/,
                ""
            );


    if (!cleanRoute) {

        console.error(
            "Biology: simulation route is empty."
        );

        return;

    }


    const targetHash =
        `#${cleanRoute}`;


    if (
        window.location.hash ===
        targetHash
    ) {

        return;

    }


    history.pushState(
        {
            page:
                cleanRoute
        },
        "",
        targetHash
    );


    window.dispatchEvent(
        new PopStateEvent(
            "popstate",
            {
                state: {
                    page:
                        cleanRoute
                }
            }
        )
    );

}


// ============================================================
// RENDER FEATURES
// ============================================================

function renderFeatures(
    features
) {

    return features
        .map(
            feature => `

                <span>
                    ${escapeHtml(
                        feature
                    )}
                </span>

            `
        )
        .join("");

}


// ============================================================
// RENDER CARD
// ============================================================

function renderCard(
    simulation,
    index
) {

    const accent =
        escapeHtml(
            simulation.accent
        );


    return `

        <article
            class="
                biology-simulation-card
                biology-card-${escapeHtml(
                    simulation.id
                )}
            "

            data-simulation-id="${escapeHtml(
                simulation.id
            )}"

            data-category="${escapeHtml(
                simulation.categoryKey
            )}"

            style="
                --biology-accent:
                    ${accent};

                --biology-card-delay:
                    ${index * 70}ms;
            "
        >

            <!-- =================================================
                 3D ICON AREA
            ================================================= -->

            <div
                class="
                    biology-3d-icon
                "
            >

                <div
                    class="
                        biology-icon-glow
                    "
                ></div>


                <div
                    class="
                        biology-icon-orbit
                    "
                ></div>


                <div
                    class="
                        biology-icon-orbit
                    "
                    style="
                        transform:
                            rotateX(62deg)
                            rotateZ(35deg);
                        opacity: .35;
                    "
                ></div>


                <div
                    class="
                        biology-icon-object
                    "
                    aria-hidden="true"
                >
                    ${simulation.icon}
                </div>


                <div
                    class="
                        biology-icon-3d-label
                    "
                >
                    ${escapeHtml(
                        simulation.mode
                    )}
                </div>

            </div>


            <!-- =================================================
                 CARD BODY
            ================================================= -->

            <div
                class="
                    biology-card-body
                "
            >

                <!-- =================================================
                     TOP INFORMATION
                ================================================= -->

                <div
                    class="
                        biology-card-top
                    "
                >

                    <span
                        class="
                            biology-card-number
                        "
                    >
                        ${escapeHtml(
                            simulation.number
                        )}
                    </span>


                    <span
                        class="
                            biology-card-status
                        "
                    >
                        ${escapeHtml(
                            simulation.status
                        )}
                    </span>

                </div>


                <!-- =================================================
                     CATEGORY
                ================================================= -->

                <span
                    class="
                        biology-card-subtitle
                    "
                >
                    ${escapeHtml(
                        simulation.category
                    )}
                </span>


                <!-- =================================================
                     TITLE
                ================================================= -->

                <h2>
                    ${escapeHtml(
                        simulation.title
                    )}
                </h2>


                <!-- =================================================
                     DESCRIPTION
                ================================================= -->

                <p>
                    ${escapeHtml(
                        simulation.description
                    )}
                </p>


                <!-- =================================================
                     FEATURE TAGS
                ================================================= -->

                <div
                    class="
                        biology-card-tags
                    "
                >

                    ${renderFeatures(
                        simulation.features
                    )}

                </div>


                <!-- =================================================
                     OPEN BUTTON
                ================================================= -->

                <button
                    type="button"
                    class="
                        biology-open-btn
                    "
                    data-simulation-route="${escapeHtml(
                        simulation.route
                    )}"

                    aria-label="
                        Open ${escapeHtml(
                            simulation.title
                        )}
                    "
                >

                    <span>
                        Open Laboratory
                    </span>


                    <span
                        aria-hidden="true"
                    >
                        →
                    </span>

                </button>

            </div>

        </article>

    `;

}


// ============================================================
// RENDER CARDS
// ============================================================

function renderCards() {

    const grid =
        document.getElementById(
            "biology-grid"
        );


    if (!grid) {

        return;

    }


    const items =
        getFilteredSimulations();


    // ========================================================
    // EMPTY STATE
    // ========================================================

    if (!items.length) {

        grid.innerHTML = `

            <div
                class="
                    biology-empty
                "
            >

                <strong>
                    No laboratories found
                </strong>


                <div>
                    Try another search term
                    or choose a different category.
                </div>


                <button
                    type="button"
                    id="biology-clear-filters"
                    class="
                        biology-reset
                    "
                    style="
                        margin-top:18px;
                    "
                >
                    Clear Filters
                </button>

            </div>

        `;


        document
            .getElementById(
                "biology-clear-filters"
            )
            ?.addEventListener(
                "click",
                () => {

                    activeFilter =
                        "All";

                    searchTerm =
                        "";

                    syncControls();

                    renderCards();

                }
            );


        updateResultCount();

        return;

    }


    // ========================================================
    // RENDER
    // ========================================================

    grid.innerHTML =
        items
            .map(
                (
                    simulation,
                    index
                ) =>
                    renderCard(
                        simulation,
                        index
                    )
            )
            .join("");


    requestAnimationFrame(
        () => {

            grid
                .querySelectorAll(
                    ".biology-simulation-card"
                )
                .forEach(
                    card => {

                        card.classList.add(
                            "is-visible"
                        );

                    }
                );

        }
    );


    attachCardEvents();

    updateResultCount();

}


// ============================================================
// CARD EVENTS
// ============================================================

function attachCardEvents() {

    const page =
        document.getElementById(
            "biology-page"
        );


    if (!page) {

        return;

    }


    page
        .querySelectorAll(
            ".biology-open-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();


                        const route =
                            String(
                                button.dataset
                                    .simulationRoute ||
                                ""
                            )
                                .trim();


                        if (!route) {

                            console.error(
                                "Biology: simulation route is missing."
                            );

                            return;

                        }


                        openSimulation(
                            route
                        );

                    }
                );

            }
        );

}


// ============================================================
// FILTER CONTROLS
// ============================================================

function renderFilters() {

    const container =
        document.getElementById(
            "biology-filters"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        filters
            .map(
                filter => `

                    <button
                        type="button"

                        class="
                            biology-filter
                            ${
                                filter ===
                                activeFilter
                                    ? "active"
                                    : ""
                            }
                        "

                        data-filter="${escapeHtml(
                            filter
                        )}"
                    >

                        ${escapeHtml(
                            filter
                        )}

                    </button>

                `
            )
            .join("");


    container
        .querySelectorAll(
            "[data-filter]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        activeFilter =
                            String(
                                button.dataset
                                    .filter ||
                                "All"
                            );


                        syncControls();

                        renderCards();

                    }
                );

            }
        );

}


// ============================================================
// SEARCH
// ============================================================

function initializeSearch() {

    const input =
        document.getElementById(
            "biology-search"
        );


    if (!input) {

        return;

    }


    input.addEventListener(
        "input",
        () => {

            searchTerm =
                input.value;


            renderCards();

        }
    );

}


// ============================================================
// RESULT COUNT
// ============================================================

function updateResultCount() {

    const result =
        document.getElementById(
            "biology-result-count"
        );


    if (!result) {

        return;

    }


    const count =
        getFilteredSimulations()
            .length;


    result.textContent =
        `${count} ${
            count === 1
                ? "laboratory"
                : "laboratories"
        } available`;

}


// ============================================================
// SYNC CONTROLS
// ============================================================

function syncControls() {

    const input =
        document.getElementById(
            "biology-search"
        );


    if (input) {

        input.value =
            searchTerm;

    }


    document
        .querySelectorAll(
            "#biology-filters [data-filter]"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset
                        .filter ===
                    activeFilter
                );

            }
        );


    updateResultCount();

}


// ============================================================
// RESET
// ============================================================

function initializeReset() {

    const button =
        document.getElementById(
            "biology-reset-filters"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        () => {

            activeFilter =
                "All";


            searchTerm =
                "";


            syncControls();

            renderCards();

        }
    );

}


// ============================================================
// PAGE-LOCAL TOOLBAR STYLES
// ============================================================

function ensureBiologyHubStyles() {

    if (
        document.getElementById(
            "scilab-biology-hub-inline-style"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "scilab-biology-hub-inline-style";


    style.textContent = `

        .biology-header {
            position: relative;
        }

        .biology-header-copy {
            max-width: 820px;
        }

        .biology-header-actions {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 9px;
            margin-top: 20px;
        }

        .biology-live-badge,
        .biology-count-badge {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            min-height: 34px;
            padding: 0 11px;
            border-radius: 999px;
            border: 1px solid rgba(148,163,184,.14);
            background: rgba(15,23,42,.72);
            color: #cbd5e1;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .08em;
        }

        .biology-live-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #4ade80;
            box-shadow:
                0 0 0 4px rgba(74,222,128,.08),
                0 0 12px rgba(74,222,128,.7);
        }

        .biology-count-badge {
            color: #67e8f9;
        }

        .biology-lab-toolbar {
            max-width: 1250px;
            margin: 0 auto 24px;
        }

        .biology-toolbar-top {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 14px;
        }

        .biology-toolbar-kicker {
            display: block;
            margin-bottom: 5px;
            color: #67e8f9;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: 1.7px;
        }

        .biology-toolbar-top h2 {
            margin: 0;
            color: #f8fafc;
            font-size: 24px;
        }

        .biology-result-count {
            color: #64748b;
            font-size: 10px;
            font-weight: 800;
        }

        .biology-search-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
        }

        .biology-search-box {
            position: relative;
            flex: 1;
        }

        .biology-search-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            font-size: 13px;
        }

        .biology-search-box input {
            width: 100%;
            height: 44px;
            padding: 0 14px 0 40px;
            border: 1px solid rgba(148,163,184,.14);
            border-radius: 12px;
            outline: none;
            background: rgba(15,23,42,.84);
            color: #e2e8f0;
            font-size: 12px;
            box-shadow:
                inset 0 1px 0 rgba(255,255,255,.02);
        }

        .biology-search-box input:focus {
            border-color: rgba(56,189,248,.5);
            box-shadow:
                0 0 0 4px rgba(56,189,248,.07);
        }

        .biology-filter-row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .biology-empty-state {
            grid-column: 1 / -1;
            padding: 60px 24px;
            text-align: center;
            border: 1px dashed rgba(148,163,184,.16);
            border-radius: 20px;
            background: rgba(15,23,42,.3);
        }

        @media (max-width: 720px) {

            .biology-toolbar-top {
                align-items: flex-start;
                flex-direction: column;
            }

            .biology-search-row {
                flex-direction: column;
            }

            .biology-search-box {
                width: 100%;
            }

            .biology-reset-btn {
                width: 100%;
            }

        }

    `;


    document.head.appendChild(
        style
    );

}


// ============================================================
// BUILD BIOLOGY PAGE
// ============================================================

export function Biology() {

    ensureBiologyHubStyles();


    const initialCards =
        simulations
            .map(
                (
                    simulation,
                    index
                ) =>
                    renderCard(
                        simulation,
                        index
                    )
            )
            .join("");


    setTimeout(
        () => {

            renderFilters();

            initializeSearch();

            initializeReset();

            renderCards();

            syncControls();

        },
        0
    );


    return `

        <section
            id="biology-page"
            class="biology-page"
        >

            <!-- =================================================
                 HEADER
            ================================================= -->

            <header
                class="biology-header"
            >

                <div
                    class="biology-header-inner"
                >

                    <span
                        class="biology-eyebrow"
                    >
                        SCILAB • BIOLOGY LABORATORY
                    </span>


                    <h1>
                        Biology
                        <span>
                            Interactive Labs
                        </span>
                    </h1>


                    <p>
                        Explore living systems through
                        visual models, virtual experiments
                        and interactive simulations designed
                        for teaching and learning.
                    </p>


                    <div
                        class="biology-header-actions"
                    >

                        <div
                            class="biology-live-badge"
                        >

                            <span
                                class="biology-live-dot"
                            ></span>

                            LABORATORY READY

                        </div>


                        <div
                            class="biology-count-badge"
                        >
                            05 LABS
                        </div>

                    </div>

                </div>

            </header>


            <!-- =================================================
                 LAB TOOLBAR
            ================================================= -->

            <section
                class="biology-lab-toolbar"
            >

                <div
                    class="biology-toolbar-top"
                >

                    <div>

                        <span
                            class="biology-toolbar-kicker"
                        >
                            BIOLOGY LABS
                        </span>


                        <h2>
                            Choose a laboratory
                        </h2>

                    </div>


                    <span
                        id="biology-result-count"
                        class="biology-result-count"
                    >
                        5 laboratories available
                    </span>

                </div>


                <div
                    class="biology-search-row"
                >

                    <div
                        class="biology-search-box"
                    >

                        <span
                            class="biology-search-icon"
                            aria-hidden="true"
                        >
                            🔎
                        </span>


                        <input
                            id="biology-search"
                            type="search"
                            placeholder="
                                Search biology laboratories...
                            "
                            autocomplete="off"
                            aria-label="
                                Search biology laboratories
                            "
                        />

                    </div>


                    <button
                        type="button"
                        id="biology-reset-filters"
                        class="biology-reset"
                    >
                        Reset
                    </button>

                </div>


                <div
                    id="biology-filters"
                    class="biology-filters"
                    aria-label="
                        Biology laboratory filters
                    "
                ></div>

            </section>


            <!-- =================================================
                 SIMULATION GRID
            ================================================= -->

            <main
                id="biology-grid"
                class="biology-grid"
                aria-label="
                    Biology laboratories
                "
            >

                ${initialCards}

            </main>

        </section>

    `;

}


// ============================================================
// PUBLIC API
// ============================================================

export function getBiologySimulations() {

    return simulations.map(
        simulation => ({
            ...simulation
        })
    );

}


export function getBiologySimulation(
    id
) {

    return (
        simulations.find(
            simulation =>
                simulation.id === id
        ) ||
        null
    );

}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default Biology;