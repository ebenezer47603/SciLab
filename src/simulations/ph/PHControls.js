// ============================================================
// SciLab - pH Laboratory Controls
// PHControls.js
// ============================================================

export class PHControls {

    constructor(simulator) {

        this.simulator = simulator;
        this.container = null;

        this.elements = {};
    }


    // ========================================================
    // MOUNT
    // ========================================================

    mount(container) {

        if (!container) {
            console.warn(
                "PHControls: container not found."
            );
            return;
        }

        this.container = container;

        this.render();

        this.bindEvents();

        this.updateUI();
    }


    // ========================================================
    // RENDER CONTROLS
    // ========================================================

    render() {

        this.container.innerHTML = `

            <div class="ph-controls-inner">

                <!-- ====================================== -->
                <!-- SOLUTION -->
                <!-- ====================================== -->

                <div class="ph-control-section">

                    <h3>
                        Choose a Solution
                    </h3>

                    <select
                        id="ph-solution-select"
                        class="ph-solution-select"
                    >

                        <option value="water">
                            Distilled Water — pH 7.0
                        </option>

                        <option value="lemon">
                            Lemon Juice — pH 2.0
                        </option>

                        <option value="vinegar">
                            Vinegar — pH 3.0
                        </option>

                        <option value="coffee">
                            Coffee — pH 5.0
                        </option>

                        <option value="milk">
                            Milk — pH 6.5
                        </option>

                        <option value="baking">
                            Baking Soda Solution — pH 8.3
                        </option>

                        <option value="soap">
                            Soap Solution — pH 10.0
                        </option>

                        <option value="ammonia">
                            Ammonia Solution — pH 11.0
                        </option>

                        <option value="bleach">
                            Bleach — pH 12.5
                        </option>

                    </select>

                </div>


                <!-- ====================================== -->
                <!-- LITMUS -->
                <!-- ====================================== -->

                <div class="ph-control-section">

                    <h3>
                        Litmus Paper
                    </h3>

                    <p class="ph-control-help">
                        Choose a litmus paper and dip it
                        into the solution.
                    </p>


                    <div class="ph-button-row">

                        <button
                            type="button"
                            id="ph-blue-litmus"
                            class="ph-litmus-button blue"
                        >
                            Blue Litmus
                        </button>


                        <button
                            type="button"
                            id="ph-red-litmus"
                            class="ph-litmus-button red"
                        >
                            Red Litmus
                        </button>

                    </div>


                    <div class="ph-button-column">

                        <button
                            type="button"
                            id="ph-dip-blue"
                            class="ph-action-button"
                        >
                            ↓ Dip Blue Litmus
                        </button>


                        <button
                            type="button"
                            id="ph-dip-red"
                            class="ph-action-button"
                        >
                            ↓ Dip Red Litmus
                        </button>


                        <button
                            type="button"
                            id="ph-remove-litmus"
                            class="ph-action-button secondary"
                        >
                            ↑ Remove Litmus
                        </button>

                    </div>

                </div>


                <!-- ====================================== -->
                <!-- CURRENT SOLUTION -->
                <!-- ====================================== -->

                <div
                    id="ph-control-info"
                    class="ph-control-info"
                >

                    <div class="ph-info-title">
                        Current Solution
                    </div>

                    <div>
                        <span>Solution</span>
                        <strong id="ph-control-solution">
                            Distilled Water
                        </strong>
                    </div>

                    <div>
                        <span>pH</span>
                        <strong id="ph-control-value">
                            7.0
                        </strong>
                    </div>

                    <div>
                        <span>Type</span>
                        <strong id="ph-control-type">
                            Neutral
                        </strong>
                    </div>

                </div>


                <!-- ====================================== -->
                <!-- RESET -->
                <!-- ====================================== -->

                <button
                    type="button"
                    id="ph-reset"
                    class="ph-reset-button"
                >
                    ↻ Reset Experiment
                </button>

            </div>
        `;
    }


    // ========================================================
    // EVENTS
    // ========================================================

    bindEvents() {

        const select =
            this.container.querySelector(
                "#ph-solution-select"
            );

        const blueButton =
            this.container.querySelector(
                "#ph-blue-litmus"
            );

        const redButton =
            this.container.querySelector(
                "#ph-red-litmus"
            );

        const dipBlue =
            this.container.querySelector(
                "#ph-dip-blue"
            );

        const dipRed =
            this.container.querySelector(
                "#ph-dip-red"
            );

        const remove =
            this.container.querySelector(
                "#ph-remove-litmus"
            );

        const reset =
            this.container.querySelector(
                "#ph-reset"
            );


        // -----------------------------------------------
        // Solution
        // -----------------------------------------------

        if (select) {

            select.addEventListener(
                "change",
                () => {

                    const solution =
                        select.value;

                    if (
                        this.simulator &&
                        typeof this.simulator.setSolution ===
                        "function"
                    ) {

                        this.simulator.setSolution(
                            solution
                        );
                    }

                    this.updateUI();
                }
            );
        }


        // -----------------------------------------------
        // Blue
        // -----------------------------------------------

        if (blueButton) {

            blueButton.addEventListener(
                "click",
                () => {

                    if (
                        this.simulator &&
                        typeof this.simulator.moveLitmus ===
                        "function"
                    ) {

                        this.simulator.moveLitmus(
                            "blue"
                        );
                    }
                }
            );
        }


        // -----------------------------------------------
        // Red
        // -----------------------------------------------

        if (redButton) {

            redButton.addEventListener(
                "click",
                () => {

                    if (
                        this.simulator &&
                        typeof this.simulator.moveLitmus ===
                        "function"
                    ) {

                        this.simulator.moveLitmus(
                            "red"
                        );
                    }
                }
            );
        }


        // -----------------------------------------------
        // Dip blue
        // -----------------------------------------------

        if (dipBlue) {

            dipBlue.addEventListener(
                "click",
                () => {

                    if (
                        this.simulator &&
                        typeof this.simulator.dipLitmus ===
                        "function"
                    ) {

                        this.simulator.dipLitmus(
                            "blue"
                        );
                    }
                }
            );
        }


        // -----------------------------------------------
        // Dip red
        // -----------------------------------------------

        if (dipRed) {

            dipRed.addEventListener(
                "click",
                () => {

                    if (
                        this.simulator &&
                        typeof this.simulator.dipLitmus ===
                        "function"
                    ) {

                        this.simulator.dipLitmus(
                            "red"
                        );
                    }
                }
            );
        }


        // -----------------------------------------------
        // Remove
        // -----------------------------------------------

        if (remove) {

            remove.addEventListener(
                "click",
                () => {

                    if (
                        this.simulator &&
                        typeof this.simulator.removeLitmus ===
                        "function"
                    ) {

                        this.simulator.removeLitmus();
                    }
                }
            );
        }


        // -----------------------------------------------
        // Reset
        // -----------------------------------------------

        if (reset) {

            reset.addEventListener(
                "click",
                () => {

                    if (
                        this.simulator &&
                        typeof this.simulator.reset ===
                        "function"
                    ) {

                        this.simulator.reset();
                    }

                    this.updateUI();
                }
            );
        }
    }


    // ========================================================
    // UPDATE UI
    // ========================================================

    updateUI() {

        if (
            !this.simulator ||
            typeof this.simulator.getSolution !==
            "function"
        ) {
            return;
        }

        const solution =
            this.simulator.getSolution();

        if (!solution) {
            return;
        }


        const select =
            this.container.querySelector(
                "#ph-solution-select"
            );

        const name =
            this.container.querySelector(
                "#ph-control-solution"
            );

        const value =
            this.container.querySelector(
                "#ph-control-value"
            );

        const type =
            this.container.querySelector(
                "#ph-control-type"
            );


        if (select) {

            select.value =
                solution.id;
        }

        if (name) {

            name.textContent =
                solution.name;
        }

        if (value) {

            value.textContent =
                Number(solution.pH).toFixed(1);
        }

        if (type) {

            type.textContent =
                solution.type;
        }
    }


    // ========================================================
    // DESTROY
    // ========================================================

    destroy() {

        if (!this.container) {
            return;
        }

        this.container.innerHTML = "";

        this.container = null;

        this.elements = {};
    }
}


// ============================================================
// DEFAULT FACTORY
// ============================================================

export function createPHControls(
    simulator
) {

    return new PHControls(
        simulator
    );
}