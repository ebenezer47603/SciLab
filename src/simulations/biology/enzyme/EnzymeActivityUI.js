// ============================================================
// SciLab - Biology
// Enzyme Activity Laboratory UI
// EnzymeActivityUI.js
// ============================================================

import "./enzyme.css";

export class EnzymeActivityUI {

    constructor({ root, simulator = null } = {}) {

        this.root = root;

        this.simulator = simulator;

        this.simulation = null;

        this.timer = null;

        this.graphHistory = [];

        this.maxGraphPoints = 120;

        this.mounted = false;

        this.onResize =
            this.onResize.bind(this);

        this.onSimulationSelected =
            this.onSimulationSelected.bind(this);
    }


    // ========================================================
    // MOUNT
    // ========================================================

    mount() {

        if (!this.root || this.mounted) {
            return this;
        }

        this.render();

        this.cacheElements();

        this.bindEvents();

        window.addEventListener(
            "resize",
            this.onResize
        );

        window.addEventListener(
            "biology-simulation-selected",
            this.onSimulationSelected
        );

        this.mounted = true;

        this.startUIUpdater();

        this.update();

        return this;
    }


    // ========================================================
    // RENDER
    // ========================================================

    render() {

        this.root.innerHTML = `

            <section
                class="enzyme-lab"
                id="enzyme-lab"
            >

                <header class="enzyme-lab-header">

                    <div class="enzyme-brand">

                        <span class="enzyme-kicker">
                            SCILAB • BIOLOGY • VIRTUAL LAB
                        </span>

                        <h2>
                            Enzyme Activity Laboratory
                        </h2>

                        <p>
                            Investigate how temperature,
                            pH, substrate concentration
                            and enzyme concentration
                            affect enzyme activity.
                        </p>

                    </div>


                    <div
                        id="enzyme-status"
                        class="enzyme-status ready"
                    >
                        READY
                    </div>

                </header>


                <div class="enzyme-lab-grid">


                    <!-- =================================================
                         CONTROLS
                    ================================================== -->

                    <aside
                        class="enzyme-controls enzyme-panel"
                    >

                        <div class="enzyme-panel-title">

                            <span>
                                EXPERIMENT
                            </span>

                            <small>
                                CONTROL VARIABLES
                            </small>

                        </div>


                        <!-- TEMPERATURE -->

                        <div class="enzyme-control-group">

                            <label for="enzyme-temperature">

                                <span>
                                    Temperature
                                </span>

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


                            <div class="enzyme-scale">

                                <span>
                                    0°C
                                </span>

                                <span>
                                    80°C
                                </span>

                            </div>

                        </div>


                        <!-- PH -->

                        <div class="enzyme-control-group">

                            <label for="enzyme-ph">

                                <span>
                                    pH
                                </span>

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


                            <div class="enzyme-scale">

                                <span>
                                    0
                                </span>

                                <span>
                                    7 neutral
                                </span>

                                <span>
                                    14
                                </span>

                            </div>

                        </div>


                        <!-- SUBSTRATE -->

                        <div class="enzyme-control-group">

                            <label for="enzyme-substrate">

                                <span>
                                    Substrate Concentration
                                </span>

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


                            <div class="enzyme-scale">

                                <span>
                                    0%
                                </span>

                                <span>
                                    100%
                                </span>

                            </div>

                        </div>


                        <!-- ENZYME -->

                        <div class="enzyme-control-group">

                            <label for="enzyme-concentration">

                                <span>
                                    Enzyme Concentration
                                </span>

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


                            <div class="enzyme-scale">

                                <span>
                                    0%
                                </span>

                                <span>
                                    100%
                                </span>

                            </div>

                        </div>


                        <!-- ACTIONS -->

                        <div class="enzyme-control-actions">

                            <button
                                id="enzyme-start"
                                type="button"
                                class="primary"
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


                        <!-- LEGEND -->

                        <div class="enzyme-legend">

                            <div>

                                <span
                                    class="enzyme-dot enzyme"
                                ></span>

                                Enzyme

                            </div>


                            <div>

                                <span
                                    class="enzyme-dot substrate"
                                ></span>

                                Substrate

                            </div>


                            <div>

                                <span
                                    class="enzyme-dot product"
                                ></span>

                                Product

                            </div>

                        </div>

                    </aside>



                    <!-- =================================================
                         SIMULATION
                    ================================================== -->

                    <section
                        class="enzyme-simulation-panel enzyme-panel"
                    >

                        <div
                            class="enzyme-simulation-header"
                        >

                            <div>

                                <span
                                    class="enzyme-live-dot"
                                ></span>

                                <span>
                                    LIVE SIMULATION
                                </span>

                            </div>


                            <span
                                id="enzyme-reaction-state"
                            >
                                Ready — press Start Reaction.
                            </span>

                        </div>


                        <!-- IMPORTANT:
                             EnzymeActivity.js creates its own canvas
                             inside this container.
                        -->

                        <div
                            id="enzyme-canvas"
                            class="enzyme-canvas"
                        ></div>


                        <div
                            class="enzyme-simulation-caption"
                        >

                            <span>
                                Approach
                            </span>

                            <span>
                                →
                            </span>

                            <span>
                                Binding
                            </span>

                            <span>
                                →
                            </span>

                            <span>
                                Catalysis
                            </span>

                            <span>
                                →
                            </span>

                            <span>
                                Release
                            </span>

                        </div>

                    </section>



                    <!-- =================================================
                         RESULTS
                    ================================================== -->

                    <aside
                        class="enzyme-results enzyme-panel"
                    >

                        <div
                            class="enzyme-panel-title"
                        >

                            <span>
                                LIVE RESULTS
                            </span>

                            <small>
                                CALCULATED FROM MODEL
                            </small>

                        </div>


                        <div class="enzyme-result">

                            <span>
                                Enzyme Activity
                            </span>

                            <strong
                                id="enzyme-activity"
                            >
                                0.0%
                            </strong>

                        </div>


                        <div
                            class="enzyme-result-bar"
                        >
                            <div
                                id="enzyme-activity-bar"
                            ></div>
                        </div>


                        <div class="enzyme-result">

                            <span>
                                Reaction Rate
                            </span>

                            <strong
                                id="enzyme-rate"
                            >
                                0.0
                            </strong>

                        </div>


                        <div
                            class="enzyme-result-bar"
                        >
                            <div
                                id="enzyme-rate-bar"
                            ></div>
                        </div>


                        <div class="enzyme-result">

                            <span>
                                Product Formation
                            </span>

                            <strong
                                id="enzyme-product"
                            >
                                0.0%
                            </strong>

                        </div>


                        <div class="enzyme-result">

                            <span>
                                Temperature Factor
                            </span>

                            <strong
                                id="enzyme-temp-factor"
                            >
                                100.0%
                            </strong>

                        </div>


                        <div class="enzyme-result">

                            <span>
                                pH Factor
                            </span>

                            <strong
                                id="enzyme-ph-factor"
                            >
                                100.0%
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
                                press Start Reaction.
                            </small>

                        </div>

                    </aside>

                </div>



                <!-- =================================================
                     GRAPH
                ================================================== -->

                <section
                    class="enzyme-graph-panel enzyme-panel"
                >

                    <div
                        class="enzyme-graph-heading"
                    >

                        <div>

                            <span>
                                LIVE GRAPH
                            </span>

                            <h3>
                                Reaction Rate Over Time
                            </h3>

                        </div>


                        <strong
                            id="enzyme-graph-value"
                        >
                            0.0
                        </strong>

                    </div>


                    <div
                        class="enzyme-graph-wrap"
                    >

                        <canvas
                            id="enzyme-graph"
                            width="1200"
                            height="300"
                        ></canvas>

                    </div>

                </section>



                <!-- =================================================
                     EXPLANATION
                ================================================== -->

                <section
                    class="enzyme-explanation enzyme-panel"
                >

                    <div
                        class="enzyme-explanation-icon"
                    >
                        🧬
                    </div>


                    <div>

                        <span>
                            WHAT IS HAPPENING?
                        </span>

                        <h3>
                            Enzyme–Substrate Interaction
                        </h3>

                        <p
                            id="enzyme-explanation-text"
                        >
                            The substrate approaches the
                            active site, binds to the enzyme,
                            undergoes catalysis, and products
                            are released while the enzyme
                            remains available for another reaction.
                        </p>

                    </div>

                </section>

            </section>
        `;
    }


    // ========================================================
    // CACHE ELEMENTS
    // ========================================================

    cacheElements() {

        const q =
            selector =>
                this.root.querySelector(selector);

        this.elements = {

            status:
                q("#enzyme-status"),

            temperature:
                q("#enzyme-temperature"),

            temperatureValue:
                q("#enzyme-temperature-value"),

            ph:
                q("#enzyme-ph"),

            phValue:
                q("#enzyme-ph-value"),

            substrate:
                q("#enzyme-substrate"),

            substrateValue:
                q("#enzyme-substrate-value"),

            enzyme:
                q("#enzyme-concentration"),

            enzymeValue:
                q("#enzyme-concentration-value"),

            start:
                q("#enzyme-start"),

            pause:
                q("#enzyme-pause"),

            reset:
                q("#enzyme-reset"),

            reactionState:
                q("#enzyme-reaction-state"),

            activity:
                q("#enzyme-activity"),

            activityBar:
                q("#enzyme-activity-bar"),

            rate:
                q("#enzyme-rate"),

            rateBar:
                q("#enzyme-rate-bar"),

            product:
                q("#enzyme-product"),

            tempFactor:
                q("#enzyme-temp-factor"),

            phFactor:
                q("#enzyme-ph-factor"),

            state:
                q("#enzyme-state"),

            stateText:
                q("#enzyme-state-text"),

            graph:
                q("#enzyme-graph"),

            graphValue:
                q("#enzyme-graph-value"),

            explanation:
                q("#enzyme-explanation-text")
        };


        this.graphContext =
            this.elements.graph?.getContext("2d") ||
            null;
    }


    // ========================================================
    // CONNECT TO BIOLOGY SIMULATOR
    // ========================================================

    setSimulator(simulator) {

        this.simulator =
            simulator || null;

        this.simulation =
            this.simulator
                ?.getCurrentSimulation?.() ||
            null;

        this.graphHistory = [];

        if (this.simulation) {

            this.syncControlsFromSimulation();

            this.update();

        }

        return this;
    }


    connectToSimulation() {

        this.simulation =
            this.simulator
                ?.getCurrentSimulation?.() ||
            null;

        if (this.simulation) {

            this.syncControlsFromSimulation();

        }
    }


    onSimulationSelected(event) {

        const detail =
            event?.detail;

        if (detail?.simulator) {

            this.setSimulator(
                detail.simulator
            );

        } else if (this.simulator) {

            this.connectToSimulation();

        }
    }


    // ========================================================
    // EVENTS
    // ========================================================

    bindEvents() {

        const e =
            this.elements;

        if (!e) {
            return;
        }


        e.temperature?.addEventListener(
            "input",
            () => {

                this.simulation
                    ?.setTemperature?.(
                        Number(
                            e.temperature.value
                        )
                    );

                this.update();
            }
        );


        e.ph?.addEventListener(
            "input",
            () => {

                this.simulation
                    ?.setPH?.(
                        Number(
                            e.ph.value
                        )
                    );

                this.update();
            }
        );


        e.substrate?.addEventListener(
            "input",
            () => {

                this.simulation
                    ?.setSubstrateConcentration?.(
                        Number(
                            e.substrate.value
                        )
                    );

                this.update();
            }
        );


        e.enzyme?.addEventListener(
            "input",
            () => {

                this.simulation
                    ?.setEnzymeConcentration?.(
                        Number(
                            e.enzyme.value
                        )
                    );

                this.update();
            }
        );


        e.start?.addEventListener(
            "click",
            () => {

                this.simulation?.start?.();

                this.update();

            }
        );


        e.pause?.addEventListener(
            "click",
            () => {

                this.simulation?.pause?.();

                this.update();

            }
        );


        e.reset?.addEventListener(
            "click",
            () => {

                this.simulation?.reset?.();

                this.graphHistory = [];

                this.update();

                this.drawGraph();

            }
        );
    }


    // ========================================================
    // UPDATE LOOP
    // ========================================================

    startUIUpdater() {

        this.stopUIUpdater();

        this.timer =
            window.setInterval(
                () => {

                    this.update();

                },
                100
            );
    }


    stopUIUpdater() {

        if (this.timer !== null) {

            window.clearInterval(
                this.timer
            );

            this.timer =
                null;
        }
    }


    update() {

        const simulation =
            this.simulation ||
            this.simulator
                ?.getCurrentSimulation?.();

        if (
            !simulation ||
            !this.elements
        ) {
            return;
        }

        this.simulation =
            simulation;


        const data =
            simulation.getState?.();

        if (!data) {
            return;
        }


        const temperature =
            Number(
                data.temperature
            ) || 0;


        const pH =
            Number(
                data.pH
            ) || 0;


        const substrate =
            Number(
                data.substrate ??
                data.substrateConcentration
            ) || 0;


        const enzyme =
            Number(
                data.enzyme ??
                data.enzymeConcentration
            ) || 0;


        const activity =
            Number(
                data.activity
            ) || 0;


        const rate =
            Number(
                data.reactionRate
            ) || 0;


        const product =
            Number(
                data.productFormation
            ) || 0;


        const tempFactor =
            Number(
                data.temperatureFactor
            ) || 0;


        const phFactor =
            Number(
                data.pHFactor
            ) || 0;


        this.setValue(
            this.elements.temperature,
            temperature
        );


        this.setValue(
            this.elements.ph,
            pH
        );


        this.setValue(
            this.elements.substrate,
            substrate
        );


        this.setValue(
            this.elements.enzyme,
            enzyme
        );


        this.text(
            this.elements.temperatureValue,
            `${temperature.toFixed(0)}°C`
        );


        this.text(
            this.elements.phValue,
            pH.toFixed(1)
        );


        this.text(
            this.elements.substrateValue,
            `${substrate.toFixed(0)}%`
        );


        this.text(
            this.elements.enzymeValue,
            `${enzyme.toFixed(0)}%`
        );


        this.text(
            this.elements.activity,
            `${activity.toFixed(1)}%`
        );


        this.text(
            this.elements.rate,
            rate.toFixed(1)
        );


        this.text(
            this.elements.product,
            `${product.toFixed(1)}%`
        );


        this.text(
            this.elements.tempFactor,
            `${(tempFactor * 100).toFixed(1)}%`
        );


        this.text(
            this.elements.phFactor,
            `${(phFactor * 100).toFixed(1)}%`
        );


        this.setBar(
            this.elements.activityBar,
            activity
        );


        this.setBar(
            this.elements.rateBar,
            rate
        );


        const phase =
            String(
                data.phase ||
                "ready"
            ).toLowerCase();


        const phaseText =
            data.phaseDescription ||
            this.getPhaseText(phase);


        this.text(
            this.elements.reactionState,
            phaseText
        );


        this.text(
            this.elements.state,
            phase.toUpperCase()
        );


        this.text(
            this.elements.stateText,
            this.getStateExplanation(
                phase,
                activity
            )
        );


        this.updateStatus(
            data
        );


        this.updateExplanation(
            phase
        );


        this.pushGraphPoint(
            rate,
            data.running
        );
    }


    // ========================================================
    // SYNC
    // ========================================================

    syncControlsFromSimulation() {

        if (
            !this.simulation ||
            !this.elements
        ) {
            return;
        }


        const data =
            this.simulation.getState?.();

        if (!data) {
            return;
        }


        const substrate =
            data.substrate ??
            data.substrateConcentration;


        const enzyme =
            data.enzyme ??
            data.enzymeConcentration;


        this.setValue(
            this.elements.temperature,
            data.temperature
        );


        this.setValue(
            this.elements.ph,
            data.pH
        );


        this.setValue(
            this.elements.substrate,
            substrate
        );


        this.setValue(
            this.elements.enzyme,
            enzyme
        );
    }


    // ========================================================
    // STATUS
    // ========================================================

    updateStatus(data) {

        const e =
            this.elements;

        if (!e.status) {
            return;
        }


        let text =
            "READY";

        let stateClass =
            "ready";


        if (data.running) {

            text =
                "RUNNING";

            stateClass =
                "running";

        } else if (data.paused) {

            text =
                "PAUSED";

            stateClass =
                "paused";

        } else if (
            String(data.phase) ===
            "complete"
        ) {

            text =
                "COMPLETE";

            stateClass =
                "complete";
        }


        e.status.textContent =
            text;

        e.status.className =
            `enzyme-status ${stateClass}`;
    }


    // ========================================================
    // GRAPH
    // ========================================================

    pushGraphPoint(
        rate,
        running
    ) {

        if (
            !running &&
            this.graphHistory.length === 0
        ) {

            this.drawGraph();

            return;
        }


        if (running) {

            const last =
                this.graphHistory[
                    this.graphHistory.length - 1
                ];


            const elapsed =
                this.simulation
                    ?.getState?.()
                    ?.elapsed;


            if (
                !last ||
                elapsed === undefined ||
                elapsed - last.time >= 0.12
            ) {

                this.graphHistory.push({

                    time:
                        Number(elapsed) ||
                        this.graphHistory.length * 0.1,

                    value:
                        Math.max(
                            0,
                            Math.min(
                                100,
                                rate
                            )
                        )

                });


                if (
                    this.graphHistory.length >
                    this.maxGraphPoints
                ) {

                    this.graphHistory.shift();

                }
            }
        }


        this.drawGraph();
    }


    drawGraph() {

        const canvas =
            this.elements?.graph;

        const ctx =
            this.graphContext;

        if (!canvas || !ctx) {
            return;
        }


        const width =
            canvas.width;

        const height =
            canvas.height;


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        ctx.save();


        ctx.fillStyle =
            "rgba(8, 13, 26, 0.96)";

        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        const left =
            58;

        const right =
            28;

        const top =
            26;

        const bottom =
            42;


        const chartWidth =
            width -
            left -
            right;


        const chartHeight =
            height -
            top -
            bottom;


        ctx.strokeStyle =
            "rgba(255,255,255,.08)";

        ctx.lineWidth =
            1;


        for (
            let i = 0;
            i <= 5;
            i += 1
        ) {

            const y =
                top +
                chartHeight *
                (i / 5);


            ctx.beginPath();

            ctx.moveTo(
                left,
                y
            );

            ctx.lineTo(
                width - right,
                y
            );

            ctx.stroke();
        }


        for (
            let i = 0;
            i <= 6;
            i += 1
        ) {

            const x =
                left +
                chartWidth *
                (i / 6);


            ctx.beginPath();

            ctx.moveTo(
                x,
                top
            );

            ctx.lineTo(
                x,
                height - bottom
            );

            ctx.stroke();
        }


        ctx.fillStyle =
            "#9eacc5";

        ctx.font =
            "12px Arial, sans-serif";

        ctx.textAlign =
            "right";


        for (
            let i = 0;
            i <= 5;
            i += 1
        ) {

            const value =
                100 -
                i * 20;


            const y =
                top +
                chartHeight *
                (i / 5) +
                4;


            ctx.fillText(
                String(value),
                left - 10,
                y
            );
        }


        ctx.textAlign =
            "left";

        ctx.fillText(
            "Reaction rate",
            12,
            18
        );


        ctx.textAlign =
            "right";

        ctx.fillText(
            "Time",
            width - right,
            height - 12
        );


        if (
            this.graphHistory.length >= 2
        ) {

            const maxTime =
                Math.max(
                    this.graphHistory[
                        this.graphHistory.length - 1
                    ].time,
                    1
                );


            ctx.beginPath();


            this.graphHistory.forEach(
                (point, index) => {

                    const x =
                        left +
                        (
                            Math.max(
                                0,
                                point.time
                            ) /
                            maxTime
                        ) *
                        chartWidth;


                    const safeValue =
                        Math.max(
                            0,
                            Math.min(
                                100,
                                Number(point.value) || 0
                            )
                        );


                    const y =
                        top +
                        (
                            1 -
                            safeValue / 100
                        ) *
                        chartHeight;


                    if (index === 0) {

                        ctx.moveTo(
                            x,
                            y
                        );

                    } else {

                        ctx.lineTo(
                            x,
                            y
                        );
                    }
                }
            );


            ctx.strokeStyle =
                "#9b5de5";

            ctx.lineWidth =
                4;

            ctx.lineJoin =
                "round";

            ctx.lineCap =
                "round";

            ctx.shadowColor =
                "rgba(155,93,229,.45)";

            ctx.shadowBlur =
                12;

            ctx.stroke();

            ctx.shadowBlur =
                0;


            const last =
                this.graphHistory[
                    this.graphHistory.length - 1
                ];


            const x =
                left +
                (
                    Math.max(
                        0,
                        last.time
                    ) /
                    maxTime
                ) *
                chartWidth;


            const y =
                top +
                (
                    1 -
                    Math.max(
                        0,
                        Math.min(
                            100,
                            last.value
                        )
                    ) /
                    100
                ) *
                chartHeight;


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                6,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "#ffffff";

            ctx.fill();
        }


        ctx.restore();


        const latest =
            this.graphHistory.length > 0
                ? this.graphHistory[
                    this.graphHistory.length - 1
                  ].value
                : 0;


        this.text(
            this.elements.graphValue,
            Number(latest).toFixed(1)
        );
    }


    // ========================================================
    // EXPLANATION
    // ========================================================

    updateExplanation(phase) {

        const text = {

            ready:
                "The system is ready. Change the experimental variables and press Start Reaction to observe enzyme–substrate interaction.",

            moving:
                "The substrate is approaching the enzyme's active site. Higher substrate concentration changes the probability of productive encounters.",

            binding:
                "The substrate is positioned at the active site. The model represents formation of an enzyme–substrate complex.",

            catalysis:
                "Catalysis is occurring. Temperature and pH factors determine how strongly the model supports catalytic activity.",

            release:
                "Products are being released from the active site, leaving the enzyme available for another reaction.",

            complete:
                "This reaction cycle is complete. Press Start Reaction to begin another cycle."
        };


        this.text(
            this.elements?.explanation,
            text[phase] ||
            text.ready
        );
    }


    getPhaseText(phase) {

        const labels = {

            ready:
                "Ready — press Start Reaction.",

            moving:
                "SUBSTRATE APPROACHING",

            binding:
                "ACTIVE SITE BINDING",

            catalysis:
                "CATALYSIS",

            release:
                "PRODUCT RELEASE",

            complete:
                "REACTION COMPLETE"
        };


        return (
            labels[phase] ||
            "READY"
        );
    }


    getStateExplanation(
        phase,
        activity
    ) {

        if (
            phase === "ready"
        ) {

            return (
                "Adjust the controls and press Start Reaction."
            );
        }


        if (
            phase === "complete"
        ) {

            return (
                "Reaction cycle complete — start again to repeat the experiment."
            );
        }


        if (
            activity < 20
        ) {

            return (
                "Low predicted activity under the current conditions."
            );
        }


        if (
            activity < 60
        ) {

            return (
                "Moderate predicted activity under the current conditions."
            );
        }


        return (
            "High predicted activity under the current conditions."
        );
    }


    // ========================================================
    // HELPERS
    // ========================================================

    setValue(
        element,
        value
    ) {

        if (
            !element ||
            value === undefined ||
            value === null
        ) {
            return;
        }

        element.value =
            String(value);
    }


    setBar(
        element,
        value
    ) {

        if (!element) {
            return;
        }


        const safe =
            Math.max(
                0,
                Math.min(
                    100,
                    Number(value) || 0
                )
            );


        element.style.width =
            `${safe}%`;
    }


    text(
        element,
        value
    ) {

        if (!element) {
            return;
        }

        element.textContent =
            value;
    }


    onResize() {

        this.drawGraph();

        this.simulation
            ?.resize?.();
    }


    // ========================================================
    // DESTROY
    // ========================================================

    destroy() {

        this.stopUIUpdater();


        window.removeEventListener(
            "resize",
            this.onResize
        );


        window.removeEventListener(
            "biology-simulation-selected",
            this.onSimulationSelected
        );


        this.simulation =
            null;

        this.simulator =
            null;

        this.graphHistory =
            [];


        if (this.root) {

            this.root.innerHTML =
                "";
        }


        this.elements =
            null;

        this.graphContext =
            null;

        this.mounted =
            false;
    }
}


// ============================================================
// FACTORY
// ============================================================

export function createEnzymeActivityUI(
    root,
    simulator = null
) {

    const ui =
        new EnzymeActivityUI({
            root,
            simulator
        });


    ui.mount();


    return ui;
}