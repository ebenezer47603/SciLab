// ============================================================
// SciLab - pH Simulator
// PHSimulator.js
// ============================================================

import {
    PHScene
} from "./PHScene.js";

import {
    PHControls
} from "./PHControls.js";


// ============================================================
// SOLUTIONS
// ============================================================

const SOLUTIONS = {

    water: {

        id: "water",

        name: "Distilled Water",

        formula: "H₂O",

        pH: 7.0,

        type: "Neutral",

        color: 0x8ed8ff,

        description:
            "Pure water is approximately neutral at pH 7."
    },


    lemon: {

        id: "lemon",

        name: "Lemon Juice",

        formula: "Citric acid",

        pH: 2.0,

        type: "Acidic",

        color: 0xffe58a,

        description:
            "Lemon juice is strongly acidic."
    },


    vinegar: {

        id: "vinegar",

        name: "Vinegar",

        formula: "CH₃COOH",

        pH: 3.0,

        type: "Acidic",

        color: 0xf5e7b2,

        description:
            "Vinegar contains acetic acid and is acidic."
    },


    coffee: {

        id: "coffee",

        name: "Coffee",

        formula: "Coffee acids",

        pH: 5.0,

        type: "Acidic",

        color: 0x6b3e26,

        description:
            "Coffee is mildly acidic."
    },


    milk: {

        id: "milk",

        name: "Milk",

        formula: "Milk solution",

        pH: 6.5,

        type: "Slightly Acidic",

        color: 0xf5f0dc,

        description:
            "Milk is slightly acidic."
    },


    baking: {

        id: "baking",

        name: "Baking Soda Solution",

        formula: "NaHCO₃",

        pH: 8.3,

        type: "Basic",

        color: 0xb9e8ff,

        description:
            "Baking soda produces a mildly basic solution."
    },


    soap: {

        id: "soap",

        name: "Soap Solution",

        formula: "Soap salts",

        pH: 10.0,

        type: "Basic",

        color: 0xbcecff,

        description:
            "Soap solutions are generally alkaline."
    },


    ammonia: {

        id: "ammonia",

        name: "Ammonia Solution",

        formula: "NH₃",

        pH: 11.0,

        type: "Basic",

        color: 0xd7f5ff,

        description:
            "Ammonia in water forms a basic solution."
    },


    bleach: {

        id: "bleach",

        name: "Bleach",

        formula: "NaClO",

        pH: 12.5,

        type: "Strongly Basic",

        color: 0xf4fbff,

        description:
            "Household bleach is strongly alkaline."
    }
};


// ============================================================
// pH COLOR
// ============================================================

function getPHColor(pH) {

    if (pH <= 2) {

        return 0xff2638;
    }

    if (pH <= 3) {

        return 0xff514f;
    }

    if (pH <= 4) {

        return 0xff875c;
    }

    if (pH <= 5) {

        return 0xffb36b;
    }

    if (pH <= 6) {

        return 0xffd978;
    }

    if (pH < 7) {

        return 0xf0dc70;
    }

    if (pH === 7) {

        return 0x8ed8ff;
    }

    if (pH <= 8) {

        return 0x68d8a0;
    }

    if (pH <= 9) {

        return 0x38c878;
    }

    if (pH <= 10) {

        return 0x32a85b;
    }

    if (pH <= 11) {

        return 0x3489d8;
    }

    if (pH <= 12) {

        return 0x3455d8;
    }

    return 0x5b32d6;
}


// ============================================================
// LITMUS CHEMISTRY
// ============================================================

function getLitmusResult(
    paperType,
    pH
) {

    // -----------------------------------------------
    // BLUE LITMUS
    // -----------------------------------------------

    if (paperType === "blue") {

        if (pH < 7) {

            return {
                color: 0xff3030,
                name: "Red",
                changed: true
            };
        }

        return {
            color: 0x2070ff,
            name: "Blue",
            changed: false
        };
    }


    // -----------------------------------------------
    // RED LITMUS
    // -----------------------------------------------

    if (paperType === "red") {

        if (pH > 7) {

            return {
                color: 0x2070ff,
                name: "Blue",
                changed: true
            };
        }

        return {
            color: 0xff3030,
            name: "Red",
            changed: false
        };
    }


    return null;
}


// ============================================================
// CLASS
// ============================================================

export class PHSimulator {

    constructor() {

        this.sceneController =
            new PHScene();

        this.controls =
            new PHControls(
                this
            );

        this.currentSolution =
            SOLUTIONS.water;

        this.running =
            false;

        this.animationFrame =
            null;

        this.lastTime =
            0;

        this.sceneContainer =
            null;

        this.controlsContainer =
            null;
    }


    // ========================================================
    // MOUNT
    // ========================================================

    mount(
        sceneContainer,
        controlsContainer
    ) {

        if (!sceneContainer) {

            console.error(
                "PHSimulator: scene container missing."
            );

            return;
        }

        this.sceneContainer =
            sceneContainer;

        this.controlsContainer =
            controlsContainer;


        // -----------------------------------------------
        // Scene
        // -----------------------------------------------

        this.sceneController.mount(
            sceneContainer
        );


        // -----------------------------------------------
        // Controls
        // -----------------------------------------------

        if (controlsContainer) {

            this.controls.mount(
                controlsContainer
            );
        }


        // -----------------------------------------------
        // Default solution
        // -----------------------------------------------

        this.applySolution(
            this.currentSolution
        );


        // -----------------------------------------------
        // Initial render
        // -----------------------------------------------

        this.sceneController.render();


        console.log(
            "pH Simulator initialized."
        );
    }


    // ========================================================
    // START
    // ========================================================

    start() {

        if (this.running) {
            return;
        }

        this.running =
            true;

        this.lastTime =
            performance.now();


        const loop =
            time => {

                if (!this.running) {
                    return;
                }


                const delta =
                    Math.min(
                        0.05,
                        Math.max(
                            0,
                            (time - this.lastTime) /
                            1000
                        )
                    );


                this.lastTime =
                    time;


                this.sceneController.update(
                    delta
                );


                this.animationFrame =
                    requestAnimationFrame(
                        loop
                    );
            };


        this.animationFrame =
            requestAnimationFrame(
                loop
            );
    }


    // ========================================================
    // STOP
    // ========================================================

    stop() {

        this.running =
            false;


        if (
            this.animationFrame !== null
        ) {

            cancelAnimationFrame(
                this.animationFrame
            );

            this.animationFrame =
                null;
        }
    }


    // ========================================================
    // SET SOLUTION
    // ========================================================

    setSolution(
        solutionId
    ) {

        const solution =
            SOLUTIONS[
                solutionId
            ];


        if (!solution) {

            console.warn(
                "Unknown pH solution:",
                solutionId
            );

            return;
        }


        this.applySolution(
            solution
        );
    }


    // ========================================================
    // APPLY SOLUTION
    // ========================================================

    applySolution(
        solution
    ) {

        this.currentSolution =
            solution;


        // -----------------------------------------------
        // Liquid
        // -----------------------------------------------

        if (
            this.sceneController &&
            typeof this.sceneController.updateLiquidColor ===
            "function"
        ) {

            this.sceneController.updateLiquidColor(
                solution.color
            );
        }


        if (
            this.sceneController &&
            typeof this.sceneController.setLiquidVisible ===
            "function"
        ) {

            this.sceneController.setLiquidVisible(
                true
            );
        }


        if (
            this.sceneController &&
            typeof this.sceneController.setLiquidLevel ===
            "function"
        ) {

            this.sceneController.setLiquidLevel(
                0.85
            );
        }


        // -----------------------------------------------
        // Update information
        // -----------------------------------------------

        this.updateInformation();


        // -----------------------------------------------
        // Update controls
        // -----------------------------------------------

        if (this.controls) {

            this.controls.updateUI();
        }


        // -----------------------------------------------
        // Render
        // -----------------------------------------------

        if (
            this.sceneController &&
            typeof this.sceneController.render ===
            "function"
        ) {

            this.sceneController.render();
        }


        console.log(
            "pH solution:",
            solution.name,
            "pH:",
            solution.pH
        );
    }


    // ========================================================
    // GET SOLUTION
    // ========================================================

    getSolution() {

        return this.currentSolution;
    }


    // ========================================================
    // MOVE LITMUS
    // ========================================================

    moveLitmus(
        type
    ) {

        if (
            type !== "blue" &&
            type !== "red"
        ) {

            return;
        }


        if (
            this.sceneController &&
            typeof this.sceneController.moveLitmusToSolution ===
            "function"
        ) {

            this.sceneController.moveLitmusToSolution(
                type
            );
        }
    }


    // ========================================================
    // DIP LITMUS
    // ========================================================

    dipLitmus(
        type
    ) {

        if (
            type !== "blue" &&
            type !== "red"
        ) {

            return;
        }


        // -----------------------------------------------
        // Move paper into solution
        // -----------------------------------------------

        if (
            this.sceneController &&
            typeof this.sceneController.moveLitmusToSolution ===
            "function"
        ) {

            this.sceneController.moveLitmusToSolution(
                type
            );
        }


        // -----------------------------------------------
        // Chemistry result
        // -----------------------------------------------

        const result =
            getLitmusResult(
                type,
                this.currentSolution.pH
            );


        if (
            result &&
            this.sceneController &&
            typeof this.sceneController.setLitmusColor ===
            "function"
        ) {

            // Wait until paper is visually inside
            // the solution before changing color.

            window.setTimeout(
                () => {

                    if (
                        !this.sceneController ||
                        this.sceneController.disposed
                    ) {
                        return;
                    }


                    this.sceneController.setLitmusColor(
                        type,
                        result.color
                    );


                    this.updateObservation(
                        type,
                        result
                    );

                    this.sceneController.render();

                },
                700
            );
        }
    }


    // ========================================================
    // REMOVE LITMUS
    // ========================================================

    removeLitmus() {

        if (
            this.sceneController &&
            typeof this.sceneController.returnLitmus ===
            "function"
        ) {

            this.sceneController.returnLitmus(
                "blue"
            );

            this.sceneController.returnLitmus(
                "red"
            );
        }
    }


    // ========================================================
    // RESET
    // ========================================================

    reset() {

        this.currentSolution =
            SOLUTIONS.water;


        // -----------------------------------------------
        // Reset liquid
        // -----------------------------------------------

        this.applySolution(
            this.currentSolution
        );


        // -----------------------------------------------
        // Reset papers
        // -----------------------------------------------

        if (
            this.sceneController
        ) {

            if (
                typeof this.sceneController.resetLitmus ===
                "function"
            ) {

                this.sceneController.resetLitmus(
                    "blue"
                );

                this.sceneController.resetLitmus(
                    "red"
                );
            }
        }


        // -----------------------------------------------
        // Reset select
        // -----------------------------------------------

        if (this.controls) {

            this.controls.updateUI();
        }


        // -----------------------------------------------
        // Observation
        // -----------------------------------------------

        this.updateObservationText(
            "Choose a solution to begin."
        );


        this.sceneController.render();
    }


    // ========================================================
    // UPDATE INFORMATION
    // ========================================================

    updateInformation() {

        const solution =
            this.currentSolution;


        const name =
            document.getElementById(
                "ph-solution-name"
            );

        const formula =
            document.getElementById(
                "ph-solution-formula"
            );

        const value =
            document.getElementById(
                "ph-value"
            );

        const type =
            document.getElementById(
                "ph-type"
            );


        if (name) {

            name.textContent =
                solution.name;
        }


        if (formula) {

            formula.textContent =
                solution.formula;
        }


        if (value) {

            value.textContent =
                Number(
                    solution.pH
                ).toFixed(1);
        }


        if (type) {

            type.textContent =
                solution.type;
        }


        // -----------------------------------------------
        // pH scale
        // -----------------------------------------------

        this.updatePHScale(
            solution.pH
        );


        // -----------------------------------------------
        // Observation
        // -----------------------------------------------

        this.updateObservationText(
            solution.description
        );
    }


    // ========================================================
    // pH SCALE
    // ========================================================

    updatePHScale(
        pH
    ) {

        const marker =
            document.getElementById(
                "ph-scale-marker"
            );


        if (!marker) {
            return;
        }


        const percent =
            Math.max(
                0,
                Math.min(
                    100,
                    (pH / 14) * 100
                )
            );


        marker.style.left =
            `${percent}%`;


        const label =
            marker.querySelector(
                "span"
            );


        if (label) {

            label.textContent =
                Number(pH).toFixed(1);
        }
    }


    // ========================================================
    // OBSERVATION
    // ========================================================

    updateObservationText(
        text
    ) {

        const observation =
            document.getElementById(
                "ph-observation"
            );


        if (observation) {

            observation.textContent =
                text;
        }
    }


    // ========================================================
    // LITMUS OBSERVATION
    // ========================================================

    updateObservation(
        type,
        result
    ) {

        const paperName =
            type === "blue"
                ? "Blue litmus"
                : "Red litmus";


        if (result.changed) {

            this.updateObservationText(
                `${paperName} changed to ${result.name} because the solution has pH ${this.currentSolution.pH.toFixed(1)}.`
            );

        } else {

            this.updateObservationText(
                `${paperName} remained ${result.name} because the solution is ${this.currentSolution.type.toLowerCase()} at pH ${this.currentSolution.pH.toFixed(1)}.`
            );
        }
    }


    // ========================================================
    // GETTERS
    // ========================================================

    getScene() {

        return this.sceneController.getScene();
    }


    getCamera() {

        return this.sceneController.getCamera();
    }


    getSceneController() {

        return this.sceneController;
    }


    // ========================================================
    // DISPOSE
    // ========================================================

    dispose() {

        this.stop();


        if (this.controls) {

            this.controls.destroy();
        }


        if (this.sceneController) {

            this.sceneController.dispose();
        }


        this.sceneContainer =
            null;

        this.controlsContainer =
            null;
    }
}