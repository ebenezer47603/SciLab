// ============================================================
// SciLab - Physics Laboratory
// Physics.js
// Physics Hub
// ============================================================

const labs = [

    {
        id: "lens",

        route: "physics-lens",

        number: "01",

        title:
            "Lens & Ray Optics Lab",

        subtitle:
            "Optics",

        icon:
            "🔍",

        category:
            "Optics",

        description:
            "Investigate focal length, object distance, ray paths, image distance and magnification through an interactive optics laboratory.",

        tags: [
            "Interactive",
            "3D",
            "Teacher Ready"
        ]
    },


    {
        id: "magnetic",

        route: "physics-magnetic",

        number: "02",

        title:
            "Magnetic Induction Simulator",

        subtitle:
            "Electromagnetism",

        icon:
            "🧲",

        category:
            "Electromagnetism",

        description:
            "Move a magnet through a coil and observe induced EMF, current, magnetic flux and electrical power.",

        tags: [
            "Interactive",
            "3D",
            "Live Data"
        ]
    },


    {
        id: "motor",

        route: "physics-motor",

        number:
            "03",

        title:
            "Electric Motor Simulator",

        subtitle:
            "Electromagnetism",

        icon:
            "⚙️",

        category:
            "Electromagnetism",

        description:
            "Explore how current in a magnetic field produces torque, angular motion and mechanical power.",

        tags: [
            "Interactive",
            "3D",
            "Live Data"
        ]
    },


    {
        id: "solar",

        route:
            "physics-solar-system",

        number:
            "04",

        title:
            "3D Solar System Simulator",

        subtitle:
            "Astronomy",

        icon:
            "☀️",

        category:
            "Astronomy",

        description:
            "Explore planetary orbits, orbital periods, relative distances and planetary motion in an interactive 3D Solar System.",

        tags: [
            "Interactive",
            "3D",
            "Planet Focus"
        ]
    },


    {
        id: "virtual",

        route:
            "physics-virtual-lab",

        number:
            "05",

        title:
            "Virtual Physics Lab",

        subtitle:
            "Experimental Physics",

        icon:
            "🔬",

        category:
            "Virtual Lab",

        description:
            "Run classroom-style experiments with live measurements, visual models, graphs and teacher guidance.",

        tags: [
            "Interactive",
            "3D",
            "Classroom Ready"
        ]
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
    "Optics",
    "Electromagnetism",
    "Astronomy",
    "Virtual Lab"
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
// FILTER LABS
// ============================================================

function getFilteredLabs() {

    const query =
        searchTerm
            .trim()
            .toLowerCase();


    return labs.filter(
        lab => {

            const matchesFilter =
                activeFilter === "All" ||
                lab.category === activeFilter;


            if (!matchesFilter) {

                return false;

            }


            if (!query) {

                return true;

            }


            const searchable = [

                lab.title,

                lab.subtitle,

                lab.category,

                lab.description,

                ...lab.tags

            ]
                .join(" ")
                .toLowerCase();


            return searchable.includes(
                query
            );

        }
    );

}


// ============================================================
// OPEN LAB
// ============================================================

function openLab(
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

        return;

    }


    const target =
        `#${cleanRoute}`;


    // Let main.js handle the hash navigation.
    if (
        window.location.hash ===
        target
    ) {

        return;

    }


    window.location.hash =
        cleanRoute;

}


// ============================================================
// FEATURE TAGS
// ============================================================

function renderTags(
    tags
) {

    return tags
        .map(
            tag => `

                <span
                    class="physics-feature-chip"
                >
                    ✓
                    ${escapeHtml(tag)}
                </span>

            `
        )
        .join("");

}


// ============================================================
// CARD
// ============================================================

function renderCard(
    lab,
    index
) {

    return `

        <article
            class="
                physics-hub-card
                physics-card-${escapeHtml(
                    lab.id
                )}
            "

            data-lab-id="${escapeHtml(
                lab.id
            )}"

            style="
                --physics-delay:
                ${index * 70}ms;
            "
        >

            <!-- ===============================================
                 VISUAL
            =============================================== -->

            <div
                class="
                    physics-hub-visual
                "
            >

                <div
                    class="
                        physics-hub-glow
                    "
                ></div>


                <div
                    class="
                        physics-hub-orbit
                    "
                ></div>


                <div
                    class="
                        physics-hub-orbit
                        orbit-two
                    "
                ></div>


                <div
                    class="
                        physics-hub-orbit
                        orbit-three
                    "
                ></div>


                <div
                    class="
                        physics-hub-icon
                    "
                    aria-hidden="true"
                >
                    ${lab.icon}
                </div>


                <span
                    class="
                        physics-hub-number
                    "
                >
                    ${escapeHtml(
                        lab.number
                    )}
                </span>


                <div
                    class="
                        physics-hub-ready
                    "
                >

                    <span
                        class="
                            physics-ready-dot
                        "
                    ></span>

                    READY

                </div>

            </div>


            <!-- ===============================================
                 BODY
            =============================================== -->

            <div
                class="
                    physics-hub-body
                "
            >

                <div
                    class="
                        physics-hub-meta
                    "
                >

                    <span>
                        ${escapeHtml(
                            lab.category
                        )}
                    </span>


                    <span>
                        ${escapeHtml(
                            lab.subtitle
                        )}
                    </span>

                </div>


                <h2>
                    ${escapeHtml(
                        lab.title
                    )}
                </h2>


                <p>
                    ${escapeHtml(
                        lab.description
                    )}
                </p>


                <div
                    class="
                        physics-hub-tags
                    "
                >

                    ${renderTags(
                        lab.tags
                    )}

                </div>


                <button
                    type="button"
                    class="
                        physics-hub-open
                    "
                    data-physics-route="${escapeHtml(
                        lab.route
                    )}"
                    aria-label="
                        Open ${escapeHtml(
                            lab.title
                        )}
                    "
                >

                    <span>
                        Open Laboratory
                    </span>


                    <strong>
                        →
                    </strong>

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
            "physics-grid"
        );


    if (!grid) {

        return;

    }


    const items =
        getFilteredLabs();


    if (!items.length) {

        grid.innerHTML = `

            <div
                class="
                    physics-empty-state
                "
            >

                <div
                    class="
                        physics-empty-icon
                    "
                >
                    🔎
                </div>


                <h3>
                    No laboratories found
                </h3>


                <p>
                    Try another search term
                    or choose another category.
                </p>


                <button
                    type="button"
                    id="physics-empty-reset"
                    class="
                        physics-reset-btn
                    "
                >
                    Clear Filters
                </button>

            </div>

        `;


        document
            .getElementById(
                "physics-empty-reset"
            )
            ?.addEventListener(
                "click",
                resetFilters
            );


        updateCount();

        return;

    }


    grid.innerHTML =
        items
            .map(
                (
                    lab,
                    index
                ) =>
                    renderCard(
                        lab,
                        index
                    )
            )
            .join("");


    requestAnimationFrame(
        () => {

            grid
                .querySelectorAll(
                    ".physics-hub-card"
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

    updateCount();

}


// ============================================================
// CARD EVENTS
// ============================================================

function attachCardEvents() {

    const page =
        document.getElementById(
            "physics-page"
        );


    if (!page) {

        return;

    }


    page
        .querySelectorAll(
            "[data-physics-route]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();
                        event.stopPropagation();


                        openLab(
                            button.dataset
                                .physicsRoute
                        );

                    }
                );


                button.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key ===
                                "Enter" ||
                            event.key ===
                                " "
                        ) {

                            event.preventDefault();


                            openLab(
                                button.dataset
                                    .physicsRoute
                            );

                        }

                    }
                );

            }
        );


    page
        .querySelectorAll(
            ".physics-hub-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "mouseenter",
                    () => {

                        card.classList.add(
                            "is-hovered"
                        );

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.classList.remove(
                            "is-hovered"
                        );

                    }
                );

            }
        );

}


// ============================================================
// FILTER BUTTONS
// ============================================================

function renderFilters() {

    const container =
        document.getElementById(
            "physics-filters"
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
                            physics-filter
                            ${
                                filter ===
                                activeFilter
                                    ? "is-active"
                                    : ""
                            }
                        "
                        data-physics-filter="${escapeHtml(
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
            "[data-physics-filter]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        activeFilter =
                            button.dataset
                                .physicsFilter;


                        renderFilters();

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
            "physics-search"
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
// RESET
// ============================================================

function resetFilters() {

    activeFilter =
        "All";

    searchTerm =
        "";


    const input =
        document.getElementById(
            "physics-search"
        );


    if (input) {

        input.value =
            "";

    }


    renderFilters();

    renderCards();

}


// ============================================================
// RESET BUTTON
// ============================================================

function initializeReset() {

    document
        .getElementById(
            "physics-reset"
        )
        ?.addEventListener(
            "click",
            resetFilters
        );

}


// ============================================================
// RESULT COUNT
// ============================================================

function updateCount() {

    const countElement =
        document.getElementById(
            "physics-count"
        );


    if (!countElement) {

        return;

    }


    const count =
        getFilteredLabs()
            .length;


    countElement.textContent =
        `${count} ${
            count === 1
                ? "laboratory"
                : "laboratories"
        } available`;

}


// ============================================================
// INITIALIZE HUB
// ============================================================

function initializePhysicsHub() {

    renderFilters();

    initializeSearch();

    initializeReset();

    renderCards();

}


// ============================================================
// PHYSICS PAGE
// ============================================================

export function Physics() {

    setTimeout(
        initializePhysicsHub,
        0
    );


    return `

        <section
            id="physics-page"
            class="
                physics-page
            "
        >

            <!-- ===============================================
                 HERO
            =============================================== -->

            <header
                class="
                    physics-hub-header
                "
            >

                <div
                    class="
                        physics-hub-header-content
                    "
                >

                    <span
                        class="
                            physics-hub-kicker
                        "
                    >
                        SCILAB • PHYSICS LABORATORY
                    </span>


                    <h1>
                        Physics
                        <em>
                            Interactive Labs
                        </em>
                    </h1>


                    <p>
                        Explore optics,
                        electromagnetism,
                        astronomy and experimental
                        physics through interactive
                        laboratories designed for
                        teaching and learning.
                    </p>


                    <div
                        class="
                            physics-hub-badges
                        "
                    >

                        <span>
                            ● 05 LABS
                        </span>


                        <span>
                            3D EXPERIENCES
                        </span>


                        <span>
                            LIVE DATA
                        </span>

                    </div>

                </div>


                <!-- =========================================
                     ORB
                ========================================== -->

                <div
                    class="
                        physics-hub-orb
                    "
                    aria-hidden="true"
                >

                    <div
                        class="
                            physics-hub-orb-ring
                        "
                    ></div>


                    <div
                        class="
                            physics-hub-orb-ring
                            ring-two
                        "
                    ></div>


                    <div
                        class="
                            physics-hub-orb-core
                        "
                    >
                        ⚛️
                    </div>


                    <span>
                        PHYSICS
                    </span>

                </div>

            </header>


            <!-- ===============================================
                 TOOLBAR
            =============================================== -->

            <section
                class="
                    physics-hub-toolbar
                "
            >

                <div
                    class="
                        physics-hub-toolbar-top
                    "
                >

                    <div>

                        <span>
                            PHYSICS LABS
                        </span>


                        <h2>
                            Choose a laboratory
                        </h2>

                    </div>


                    <span
                        id="physics-count"
                        class="
                            physics-count
                        "
                    >
                        5 laboratories available
                    </span>

                </div>


                <div
                    class="
                        physics-search-row
                    "
                >

                    <div
                        class="
                            physics-search-box
                        "
                    >

                        <span
                            aria-hidden="true"
                        >
                            🔎
                        </span>


                        <input
                            id="physics-search"
                            type="search"
                            placeholder="
                                Search physics laboratories...
                            "
                            autocomplete="off"
                        />

                    </div>


                    <button
                        id="physics-reset"
                        type="button"
                        class="
                            physics-reset-btn
                        "
                    >
                        Reset
                    </button>

                </div>


                <div
                    id="physics-filters"
                    class="
                        physics-filters
                    "
                    aria-label="
                        Physics laboratory filters
                    "
                ></div>

            </section>


            <!-- ===============================================
                 LAB GRID
            =============================================== -->

            <main
                id="physics-grid"
                class="
                    physics-hub-grid
                "
            ></main>


            <!-- ===============================================
                 TEACHER BANNER
            =============================================== -->

            <section
                class="
                    physics-teacher-banner
                "
            >

                <div
                    class="
                        physics-teacher-icon
                    "
                    aria-hidden="true"
                >
                    👨‍🏫
                </div>


                <div
                    class="
                        physics-teacher-content
                    "
                >

                    <span>
                        TEACHER READY
                    </span>


                    <h2>
                        Physics through interaction
                    </h2>


                    <p>
                        Use the laboratories to
                        demonstrate physical laws,
                        change parameters, observe
                        measurements and guide students
                        through scientific reasoning.
                    </p>

                </div>


                <div
                    class="
                        physics-teacher-stats
                    "
                >

                    <div>
                        <strong>
                            05
                        </strong>

                        <span>
                            Labs
                        </span>
                    </div>


                    <div>
                        <strong>
                            LIVE
                        </strong>

                        <span>
                            Data
                        </span>
                    </div>


                    <div>
                        <strong>
                            3D
                        </strong>

                        <span>
                            Visuals
                        </span>
                    </div>

                </div>

            </section>

        </section>

    `;

}


// ============================================================
// PUBLIC API
// ============================================================

export function getPhysicsSimulations() {

    return labs.map(
        lab => ({
            ...lab,

            tags: [
                ...lab.tags
            ]

        })
    );

}


export function getPhysicsSimulation(
    id
) {

    return (
        labs.find(
            lab =>
                lab.id === id
        ) ||
        null
    );

}


export default Physics;