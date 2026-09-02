// ============================================================
// SciLab Reaction Lab
// Reaction Controls - Premium UI
// ============================================================

import {
    reactions,
    defaultReaction
} from "../data/reactions.js";


export class ReactionControls {

    constructor(simulator, container) {

        this.simulator = simulator;
        this.container = container;

        this.elements = {};
        this.destroyed = false;

        this.injectStyles();
        this.render();
    }


    // ========================================================
    // PREMIUM STYLES
    // ========================================================

    injectStyles() {

        if (document.getElementById("scilab-reaction-ui")) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "scilab-reaction-ui";

        style.textContent = `

        /* =====================================================
           MAIN REACTION LAYOUT
           ===================================================== */

        .reaction-controls-container {
            width: 100%;
            box-sizing: border-box;
            padding: 24px;
            position: relative;
            z-index: 20;
        }


        .reaction-lab-layout {
            width: 100%;
            max-width: 1280px;
            margin: 0 auto;

            display: grid;
            grid-template-columns: 320px minmax(0, 1fr);

            gap: 20px;
            align-items: stretch;
        }


        /* =====================================================
           SIDEBAR
           ===================================================== */

        .reaction-controls {
            width: 100%;
            box-sizing: border-box;

            padding: 22px;

            border-radius: 18px;

            background:
                linear-gradient(
                    145deg,
                    rgba(15, 29, 49, 0.98),
                    rgba(8, 19, 34, 0.98)
                );

            border: 1px solid
                rgba(255,255,255,0.09);

            box-shadow:
                0 20px 50px
                rgba(0,0,0,0.30),

                inset 0 1px 0
                rgba(255,255,255,0.05);

            color: #eaf6ff;

            font-family:
                Inter,
                system-ui,
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                sans-serif;
        }


        /* =====================================================
           HEADER
           ===================================================== */

        .reaction-panel-header {
            margin-bottom: 22px;
        }


        .reaction-panel-title {
            margin: 0;

            font-size: 21px;
            font-weight: 800;

            letter-spacing: -0.3px;

            color: #ffffff;
        }


        .reaction-panel-subtitle {
            margin-top: 6px;

            font-size: 12px;

            line-height: 1.5;

            color:
                #8fa8bf;
        }


        /* =====================================================
           GROUPS
           ===================================================== */

        .reaction-control-group {
            margin-bottom: 18px;
        }


        .reaction-control-label {
            display: block;

            margin-bottom: 8px;

            font-size: 12px;

            font-weight: 700;

            color:
                #a9bfd3;

            text-transform:
                uppercase;

            letter-spacing:
                0.7px;
        }


        /* =====================================================
           SELECT
           ===================================================== */

        .reaction-select {
            width: 100%;

            min-height: 46px;

            padding:
                0 13px;

            border-radius: 12px;

            border: 1px solid
                rgba(255,255,255,0.10);

            background:
                #101f32;

            color:
                #ffffff;

            outline: none;

            font-size: 13px;

            cursor: pointer;

            transition:
                0.2s ease;
        }


        .reaction-select:hover {
            border-color:
                rgba(22,169,234,0.55);
        }


        .reaction-select:focus {
            border-color:
                #12aeea;

            box-shadow:
                0 0 0 3px
                rgba(18,174,234,0.12);
        }


        /* =====================================================
           TEMPERATURE
           ===================================================== */

        .reaction-temperature-card {
            padding: 14px;

            border-radius: 14px;

            background:
                rgba(255,255,255,0.035);

            border:
                1px solid
                rgba(255,255,255,0.06);
        }


        .reaction-temperature-top {
            display: flex;

            align-items: center;

            justify-content:
                space-between;

            margin-bottom: 12px;
        }


        .reaction-temperature-number {
            font-size: 17px;

            font-weight: 800;

            color:
                #ffffff;
        }


        .reaction-temperature-unit {
            color:
                #7ed8ff;

            font-size: 12px;

            margin-left: 3px;
        }


        .reaction-temperature-range {
            width: 100%;

            height: 6px;

            appearance: none;

            -webkit-appearance: none;

            border-radius: 999px;

            background:
                linear-gradient(
                    90deg,
                    #16a9ea,
                    #3b82f6,
                    #ef4444
                );

            outline: none;

            cursor: pointer;
        }


        .reaction-temperature-range::-webkit-slider-thumb {
            appearance: none;

            width: 17px;
            height: 17px;

            border-radius: 50%;

            background:
                #ffffff;

            border:
                3px solid
                #159fdf;

            box-shadow:
                0 2px 10px
                rgba(0,0,0,0.4);

            cursor: pointer;
        }


        .reaction-temperature-range::-moz-range-thumb {
            width: 17px;
            height: 17px;

            border-radius: 50%;

            background:
                #ffffff;

            border:
                3px solid
                #159fdf;

            cursor: pointer;
        }


        /* =====================================================
           BUTTONS
           ===================================================== */

        .reaction-buttons {
            display: grid;

            grid-template-columns:
                1fr 1fr;

            gap: 9px;

            margin-top: 18px;
        }


        .reaction-btn {
            min-height: 43px;

            border: none;

            border-radius: 11px;

            color:
                #ffffff;

            font-size: 13px;

            font-weight: 750;

            cursor: pointer;

            transition:
                transform 0.15s ease,
                filter 0.15s ease,
                box-shadow 0.15s ease;
        }


        .reaction-btn:hover {
            transform:
                translateY(-2px);

            filter:
                brightness(1.08);
        }


        .reaction-btn:active {
            transform:
                translateY(0);
        }


        .reaction-btn-start {
            background:
                linear-gradient(
                    135deg,
                    #10b981,
                    #22c55e
                );

            box-shadow:
                0 8px 20px
                rgba(16,185,129,0.20);
        }


        .reaction-btn-pause {
            background:
                linear-gradient(
                    135deg,
                    #f97316,
                    #ef4444
                );

            box-shadow:
                0 8px 20px
                rgba(239,68,68,0.18);
        }


        .reaction-btn-resume {
            background:
                linear-gradient(
                    135deg,
                    #0ea5e9,
                    #2563eb
                );

            box-shadow:
                0 8px 20px
                rgba(37,99,235,0.20);
        }


        .reaction-btn-reset {
            background:
                #24384d;

            border:
                1px solid
                rgba(255,255,255,0.08);
        }


        /* =====================================================
           EQUATION
           ===================================================== */

        .reaction-equation-card {
            margin-top: 18px;

            padding: 16px;

            border-radius: 14px;

            background:
                linear-gradient(
                    135deg,
                    rgba(14,165,233,0.12),
                    rgba(37,99,235,0.08)
                );

            border:
                1px solid
                rgba(14,165,233,0.20);

            text-align:
                center;
        }


        .reaction-equation-label {
            font-size: 10px;

            color:
                #76b9d9;

            text-transform:
                uppercase;

            letter-spacing:
                1px;

            margin-bottom:
                7px;
        }


        .reaction-equation {
            font-size: 16px;

            font-weight: 800;

            color:
                #ffffff;

            line-height:
                1.5;
        }


        /* =====================================================
           STATUS
           ===================================================== */

        .reaction-status-row {
            display: flex;

            justify-content:
                space-between;

            align-items:
                center;

            margin-top: 18px;
        }


        .reaction-status-label {
            font-size: 12px;

            color:
                #8fa8bf;
        }


        .reaction-status {
            display: inline-flex;

            align-items: center;

            padding:
                6px 10px;

            border-radius:
                999px;

            font-size:
                10px;

            font-weight:
                800;

            letter-spacing:
                0.7px;

            background:
                rgba(34,197,94,0.12);

            color:
                #4ade80;

            border:
                1px solid
                rgba(34,197,94,0.20);
        }


        /* =====================================================
           PROGRESS
           ===================================================== */

        .reaction-progress {
            margin-top: 18px;

            padding:
                14px;

            border-radius:
                14px;

            background:
                rgba(255,255,255,0.035);

            border:
                1px solid
                rgba(255,255,255,0.06);
        }


        .reaction-progress-top {
            display: flex;

            justify-content:
                space-between;

            align-items:
                center;

            margin-bottom:
                9px;
        }


        .reaction-progress-title {
            font-size:
                12px;

            font-weight:
                700;

            color:
                #c4d4e2;
        }


        .reaction-progress-value {
            font-size:
                12px;

            font-weight:
                800;

            color:
                #5ed0ff;
        }


        .reaction-progress-track {
            width: 100%;

            height: 8px;

            overflow:
                hidden;

            border-radius:
                999px;

            background:
                #17283b;
        }


        .reaction-progress-fill {
            width: 0%;

            height: 100%;

            border-radius:
                inherit;

            background:
                linear-gradient(
                    90deg,
                    #0ea5e9,
                    #2563eb
                );

            transition:
                width 0.25s ease;
        }


        /* =====================================================
           STATS
           ===================================================== */

        .reaction-stats {
            display:
                grid;

            grid-template-columns:
                1fr 1fr;

            gap:
                10px;

            margin-top:
                12px;
        }


        .reaction-stat {
            padding:
                13px;

            border-radius:
                13px;

            background:
                #101f32;

            border:
                1px solid
                rgba(255,255,255,0.06);
        }


        .reaction-stat-label {
            display:
                block;

            font-size:
                10px;

            color:
                #8199ad;

            margin-bottom:
                5px;

            text-transform:
                uppercase;

            letter-spacing:
                0.6px;
        }


        .reaction-stat-value {
            font-size:
                17px;

            font-weight:
                800;

            color:
                #ffffff;
        }


        /* =====================================================
           MOLECULES
           ===================================================== */

        .reaction-molecules-card {
            margin-top:
                14px;

            padding:
                14px;

            border-radius:
                14px;

            background:
                rgba(255,255,255,0.035);

            border:
                1px solid
                rgba(255,255,255,0.06);
        }


        .reaction-molecules-title {
            font-size:
                12px;

            font-weight:
                800;

            color:
                #c4d4e2;

            margin-bottom:
                10px;
        }


        .reaction-molecule-row {
            display:
                flex;

            justify-content:
                space-between;

            align-items:
                center;

            padding:
                7px 0;

            border-bottom:
                1px solid
                rgba(255,255,255,0.045);

            font-size:
                12px;

            color:
                #a9bfd3;
        }


        .reaction-molecule-row:last-child {
            border-bottom:
                none;
        }


        .reaction-molecule-count {
            min-width:
                30px;

            text-align:
                center;

            padding:
                3px 7px;

            border-radius:
                999px;

            background:
                rgba(14,165,233,0.12);

            color:
                #66d5ff;

            font-weight:
                800;
        }


        /* =====================================================
           DIVIDER
           ===================================================== */

        .reaction-divider {
            height:
                1px;

            margin:
                18px 0;

            background:
                rgba(255,255,255,0.07);
        }


        /* =====================================================
           MOBILE
           ===================================================== */

        @media (max-width: 900px) {

            .reaction-lab-layout {
                grid-template-columns:
                    1fr;
            }

            .reaction-controls {
                max-width:
                    none;
            }
        }


        @media (max-width: 520px) {

            .reaction-controls-container {
                padding:
                    12px;
            }

            .reaction-controls {
                padding:
                    16px;
            }

            .reaction-buttons {
                grid-template-columns:
                    1fr;
            }

            .reaction-stats {
                grid-template-columns:
                    1fr 1fr;
            }
        }

        `;

        document.head.appendChild(style);
    }


    // ========================================================
    // RENDER
    // ========================================================

    render() {

        if (
            !this.container ||
            this.destroyed
        ) {
            return;
        }


        this.container.innerHTML = "";


        const layout =
            document.createElement("div");

        layout.className =
            "reaction-lab-layout";


        const wrapper =
            document.createElement("div");

        wrapper.className =
            "reaction-controls";


        // ====================================================
        // HEADER
        // ====================================================

        const header =
            document.createElement("div");

        header.className =
            "reaction-panel-header";


        const title =
            document.createElement("h2");

        title.className =
            "reaction-panel-title";

        title.textContent =
            "🧪 Reaction Lab";


        const subtitle =
            document.createElement("div");

        subtitle.className =
            "reaction-panel-subtitle";

        subtitle.textContent =
            "Control the reaction and observe molecular collisions in real time.";


        header.appendChild(title);
        header.appendChild(subtitle);

        wrapper.appendChild(header);


        // ====================================================
        // REACTION SELECT
        // ====================================================

        const reactionGroup =
            document.createElement("div");

        reactionGroup.className =
            "reaction-control-group";


        const reactionLabel =
            document.createElement("label");

        reactionLabel.className =
            "reaction-control-label";

        reactionLabel.textContent =
            "Reaction";


        const reactionSelect =
            document.createElement("select");

        reactionSelect.className =
            "reaction-select";


        for (
            const reaction of reactions
        ) {

            const option =
                document.createElement("option");

            option.value =
                reaction.id;

            option.textContent =
                `${reaction.name} — ${reaction.equation}`;


            if (
                reaction.id ===
                defaultReaction.id
            ) {
                option.selected = true;
            }


            reactionSelect.appendChild(
                option
            );
        }


        reactionGroup.appendChild(
            reactionLabel
        );

        reactionGroup.appendChild(
            reactionSelect
        );

        wrapper.appendChild(
            reactionGroup
        );


        // ====================================================
        // TEMPERATURE
        // ====================================================

        const temperatureGroup =
            document.createElement("div");

        temperatureGroup.className =
            "reaction-control-group";


        const temperatureLabel =
            document.createElement("label");

        temperatureLabel.className =
            "reaction-control-label";

        temperatureLabel.textContent =
            "🌡 Temperature";


        const temperatureCard =
            document.createElement("div");

        temperatureCard.className =
            "reaction-temperature-card";


        const temperatureTop =
            document.createElement("div");

        temperatureTop.className =
            "reaction-temperature-top";


        const temperatureNumber =
            document.createElement("div");

        temperatureNumber.className =
            "reaction-temperature-number";


        const temperatureValue =
            document.createElement("span");

        temperatureValue.textContent =
            "298";


        const temperatureUnit =
            document.createElement("span");

        temperatureUnit.className =
            "reaction-temperature-unit";

        temperatureUnit.textContent =
            "K";


        temperatureNumber.appendChild(
            temperatureValue
        );

        temperatureNumber.appendChild(
            temperatureUnit
        );


        temperatureTop.appendChild(
            temperatureNumber
        );


        const temperature =
            document.createElement("input");

        temperature.type =
            "range";

        temperature.className =
            "reaction-temperature-range";

        temperature.min =
            "0";

        temperature.max =
            "1200";

        temperature.step =
            "10";

        temperature.value =
            "298";


        temperatureCard.appendChild(
            temperatureTop
        );

        temperatureCard.appendChild(
            temperature
        );


        temperatureGroup.appendChild(
            temperatureLabel
        );

        temperatureGroup.appendChild(
            temperatureCard
        );

        wrapper.appendChild(
            temperatureGroup
        );


        // ====================================================
        // BUTTONS
        // ====================================================

        const buttonGroup =
            document.createElement("div");

        buttonGroup.className =
            "reaction-buttons";


        const startButton =
            this.createButton(
                "▶ Start",
                "start"
            );


        const pauseButton =
            this.createButton(
                "⏸ Pause",
                "pause"
            );


        const resumeButton =
            this.createButton(
                "▶ Resume",
                "resume"
            );


        const resetButton =
            this.createButton(
                "↻ Reset",
                "reset"
            );


        buttonGroup.appendChild(
            startButton
        );

        buttonGroup.appendChild(
            pauseButton
        );

        buttonGroup.appendChild(
            resumeButton
        );

        buttonGroup.appendChild(
            resetButton
        );


        wrapper.appendChild(
            buttonGroup
        );


        // ====================================================
        // EQUATION
        // ====================================================

        const equationCard =
            document.createElement("div");

        equationCard.className =
            "reaction-equation-card";


        const equationLabel =
            document.createElement("div");

        equationLabel.className =
            "reaction-equation-label";

        equationLabel.textContent =
            "Chemical Equation";


        const equation =
            document.createElement("div");

        equation.className =
            "reaction-equation";

        equation.textContent =
            defaultReaction.equation;


        equationCard.appendChild(
            equationLabel
        );

        equationCard.appendChild(
            equation
        );


        wrapper.appendChild(
            equationCard
        );


        // ====================================================
        // STATUS
        // ====================================================

        const statusRow =
            document.createElement("div");

        statusRow.className =
            "reaction-status-row";


        const statusLabel =
            document.createElement("span");

        statusLabel.className =
            "reaction-status-label";

        statusLabel.textContent =
            "Simulation";


        const status =
            document.createElement("span");

        status.className =
            "reaction-status";

        status.textContent =
            "READY";


        statusRow.appendChild(
            statusLabel
        );

        statusRow.appendChild(
            status
        );


        wrapper.appendChild(
            statusRow
        );


        // ====================================================
        // PROGRESS
        // ====================================================

        const progressGroup =
            document.createElement("div");

        progressGroup.className =
            "reaction-progress";


        const progressTop =
            document.createElement("div");

        progressTop.className =
            "reaction-progress-top";


        const progressLabel =
            document.createElement("span");

        progressLabel.className =
            "reaction-progress-title";

        progressLabel.textContent =
            "Reaction Progress";


        const progressValue =
            document.createElement("span");

        progressValue.className =
            "reaction-progress-value";

        progressValue.textContent =
            "0%";


        progressTop.appendChild(
            progressLabel
        );

        progressTop.appendChild(
            progressValue
        );


        const progressTrack =
            document.createElement("div");

        progressTrack.className =
            "reaction-progress-track";


        const progressFill =
            document.createElement("div");

        progressFill.className =
            "reaction-progress-fill";


        progressTrack.appendChild(
            progressFill
        );


        progressGroup.appendChild(
            progressTop
        );

        progressGroup.appendChild(
            progressTrack
        );


        wrapper.appendChild(
            progressGroup
        );


        // ====================================================
        // STATS
        // ====================================================

        const stats =
            document.createElement("div");

        stats.className =
            "reaction-stats";


        const rateCard =
            this.createStat(
                "⚡ Reaction Rate",
                "0%"
            );


        const collisionCard =
            this.createStat(
                "💥 Collisions",
                "0"
            );


        stats.appendChild(
            rateCard.card
        );

        stats.appendChild(
            collisionCard.card
        );


        wrapper.appendChild(
            stats
        );


        // ====================================================
        // MOLECULES
        // ====================================================

        const molecules =
            document.createElement("div");

        molecules.className =
            "reaction-molecules-card";


        const moleculeTitle =
            document.createElement("div");

        moleculeTitle.className =
            "reaction-molecules-title";

        moleculeTitle.textContent =
            "🔬 Molecules";


        molecules.appendChild(
            moleculeTitle
        );


        wrapper.appendChild(
            molecules
        );


        // ====================================================
        // SAVE REFERENCES
        // ====================================================

        this.elements = {

            wrapper,

            reactionSelect,

            temperature,

            temperatureValue,

            startButton,

            pauseButton,

            resumeButton,

            resetButton,

            equation,

            status,

            progressFill,

            progressValue,

            rate:
                rateCard.value,

            collisions:
                collisionCard.value,

            molecules
        };


        layout.appendChild(
            wrapper
        );


        this.container.appendChild(
            layout
        );


        // ====================================================
        // EVENTS
        // ====================================================

        reactionSelect.addEventListener(
            "change",
            () => {

                const selected =
                    reactions.find(
                        reaction =>
                            reaction.id ===
                            reactionSelect.value
                    );


                if (
                    selected &&
                    this.simulator
                ) {

                    this.simulator.setReaction(
                        selected
                    );
                }


                this.update();
            }
        );


        temperature.addEventListener(
            "input",
            () => {

                const value =
                    Number(
                        temperature.value
                    );


                temperatureValue.textContent =
                    value;


                if (
                    this.simulator &&
                    typeof this.simulator.setTemperature ===
                    "function"
                ) {

                    this.simulator.setTemperature(
                        value
                    );
                }


                this.update();
            }
        );


        startButton.addEventListener(
            "click",
            () => {

                this.simulator.start();

                this.update();
            }
        );


        pauseButton.addEventListener(
            "click",
            () => {

                this.simulator.pause();

                this.update();
            }
        );


        resumeButton.addEventListener(
            "click",
            () => {

                this.simulator.resume();

                this.update();
            }
        );


        resetButton.addEventListener(
            "click",
            () => {

                this.simulator.reset();

                this.update();
            }
        );


        this.update();
    }


    // ========================================================
    // CREATE BUTTON
    // ========================================================

    createButton(text, action) {

        const button =
            document.createElement("button");

        button.type =
            "button";

        button.textContent =
            text;

        button.className =
            `reaction-btn reaction-btn-${action}`;

        return button;
    }


    // ========================================================
    // CREATE STAT
    // ========================================================

    createStat(label, value) {

        const card =
            document.createElement("div");

        card.className =
            "reaction-stat";


        const labelElement =
            document.createElement("span");

        labelElement.className =
            "reaction-stat-label";

        labelElement.textContent =
            label;


        const valueElement =
            document.createElement("span");

        valueElement.className =
            "reaction-stat-value";

        valueElement.textContent =
            value;


        card.appendChild(
            labelElement
        );

        card.appendChild(
            valueElement
        );


        return {
            card,
            value: valueElement
        };
    }


    // ========================================================
    // UPDATE
    // ========================================================

    update() {

        if (
            this.destroyed ||
            !this.simulator
        ) {
            return;
        }


        const reaction =
            this.simulator.getReaction();


        const progress =
            this.simulator.getProgress();


        const rate =
            this.simulator.getReactionRate();


        const temperature =
            this.simulator.getTemperature();


        const collisions =
            this.simulator
                .getCollisionCount();


        const counts =
            this.simulator
                .getMoleculeCounts();


        // ====================================================
        // EQUATION
        // ====================================================

        if (
            this.elements.equation
        ) {

            this.elements.equation.textContent =
                reaction?.equation ||
                "";
        }


        // ====================================================
        // TEMPERATURE
        // ====================================================

        if (
            this.elements.temperature &&
            document.activeElement !==
            this.elements.temperature
        ) {

            this.elements.temperature.value =
                temperature;
        }


        if (
            this.elements.temperatureValue
        ) {

            this.elements.temperatureValue.textContent =
                temperature;
        }


        // ====================================================
        // PROGRESS
        // ====================================================

        if (
            this.elements.progressFill
        ) {

            this.elements.progressFill.style.width =
                `${progress}%`;
        }


        if (
            this.elements.progressValue
        ) {

            this.elements.progressValue.textContent =
                `${progress}%`;
        }


        // ====================================================
        // RATE
        // ====================================================

        if (
            this.elements.rate
        ) {

            this.elements.rate.textContent =
                `${rate}%`;
        }


        // ====================================================
        // COLLISIONS
        // ====================================================

        if (
            this.elements.collisions
        ) {

            this.elements.collisions.textContent =
                collisions;
        }


        // ====================================================
        // MOLECULE COUNTS
        // ====================================================

        if (
            this.elements.molecules
        ) {

            const title =
                this.elements.molecules
                    .querySelector(
                        ".reaction-molecules-title"
                    );


            this.elements.molecules.innerHTML =
                "";


            if (title) {

                this.elements.molecules
                    .appendChild(
                        title
                    );
            }


            for (
                const [formula, count]
                of Object.entries(
                    counts || {}
                )
            ) {

                const row =
                    document.createElement(
                        "div"
                    );

                row.className =
                    "reaction-molecule-row";


                const name =
                    document.createElement(
                        "span"
                    );

                name.textContent =
                    formula;


                const countBadge =
                    document.createElement(
                        "span"
                    );

                countBadge.className =
                    "reaction-molecule-count";

                countBadge.textContent =
                    count;


                row.appendChild(
                    name
                );

                row.appendChild(
                    countBadge
                );


                this.elements.molecules
                    .appendChild(
                        row
                    );
            }
        }


        // ====================================================
        // STATUS
        // ====================================================

        let currentStatus =
            "READY";


        if (
            this.simulator.isComplete()
        ) {

            currentStatus =
                "COMPLETE";

        } else if (
            this.simulator.isPaused()
        ) {

            currentStatus =
                "PAUSED";

        } else if (
            this.simulator.isRunning()
        ) {

            currentStatus =
                "RUNNING";
        }


        if (
            this.elements.status
        ) {

            this.elements.status.textContent =
                currentStatus;


            if (
                currentStatus ===
                "RUNNING"
            ) {

                this.elements.status.style.color =
                    "#4ade80";

                this.elements.status.style.background =
                    "rgba(34,197,94,0.12)";

            } else if (
                currentStatus ===
                "PAUSED"
            ) {

                this.elements.status.style.color =
                    "#fbbf24";

                this.elements.status.style.background =
                    "rgba(245,158,11,0.12)";

            } else if (
                currentStatus ===
                "COMPLETE"
            ) {

                this.elements.status.style.color =
                    "#67e8f9";

                this.elements.status.style.background =
                    "rgba(6,182,212,0.12)";

            } else {

                this.elements.status.style.color =
                    "#4ade80";

                this.elements.status.style.background =
                    "rgba(34,197,94,0.12)";
            }
        }
    }


    // ========================================================
    // DESTROY
    // ========================================================

    destroy() {

        if (
            this.destroyed
        ) {
            return;
        }


        this.destroyed =
            true;


        if (
            this.container
        ) {

            this.container.innerHTML =
                "";
        }


        this.elements = {};
    }
}