// ============================================================
// SciLab Reaction Lab
// Reaction Module Entry Point
// ============================================================

import {
    ReactionSimulator as CoreReactionSimulator
} from "./core/ReactionSimulator.js";

import {
    ReactionControls
} from "./ui/ReactionControls.js";


export class ReactionSimulator
    extends CoreReactionSimulator {

    constructor(...args) {

        // ====================================================
        // CREATE CORE SIMULATOR
        // ====================================================

        super(...args);


        // ====================================================
        // FIND REACTION PAGE
        // ====================================================

        this.reactionPage =
            document.querySelector("#reaction");


        if (!this.reactionPage) {
            return;
        }


        // ====================================================
        // CREATE MAIN LAB LAYOUT
        // ====================================================

        this.labLayout =
            document.createElement("div");

        this.labLayout.className =
            "reaction-lab";


        // ====================================================
        // LEFT CONTROL PANEL
        // ====================================================

        this.controlsContainer =
            document.createElement("aside");

        this.controlsContainer.className =
            "reaction-controls-area";


        // ====================================================
        // RIGHT 3D VIEWPORT
        // ====================================================

        this.viewport =
            document.createElement("section");

        this.viewport.className =
            "reaction-3d-viewport";


        // ====================================================
        // PUT BOTH INTO MAIN LAYOUT
        // ====================================================

        this.labLayout.appendChild(
            this.controlsContainer
        );

        this.labLayout.appendChild(
            this.viewport
        );


        // ====================================================
        // ADD LAYOUT TO PAGE
        // ====================================================

        this.reactionPage.appendChild(
            this.labLayout
        );


        // ====================================================
        // MOUNT THREE.JS DIRECTLY
        // ====================================================

        const sceneController =
            this.getSceneController();


        if (
            sceneController &&
            typeof sceneController.mount ===
            "function"
        ) {

            sceneController.mount(
                this.viewport
            );
        }


        // ====================================================
        // CREATE REACTION CONTROLS
        // ====================================================

        this.controls =
            new ReactionControls(
                this,
                this.controlsContainer
            );


        // ====================================================
        // STYLES
        // ====================================================

        this.injectStyles();


        // ====================================================
        // UI UPDATE LOOP
        // ====================================================

        this.controlsAnimationFrame =
            null;

        this.startControlsUpdater();
    }


    // ========================================================
    // PREMIUM LAYOUT
    // ========================================================

    injectStyles() {

        if (
            document.getElementById(
                "scilab-reaction-layout"
            )
        ) {
            return;
        }


        const style =
            document.createElement("style");


        style.id =
            "scilab-reaction-layout";


        style.textContent = `

        /* ====================================================
           REACTION PAGE
           ==================================================== */

        #reaction {

            width: 100%;

            box-sizing: border-box;

            position: relative;
        }


        /* ====================================================
           MAIN LAB
           ==================================================== */

        .reaction-lab {

            width: 100%;

            max-width: 1400px;

            margin: 0 auto;

            padding:
                24px;

            box-sizing: border-box;

            display: grid;

            grid-template-columns:
                330px minmax(0, 1fr);

            gap:
                20px;

            align-items: stretch;
        }


        /* ====================================================
           LEFT CONTROLS
           ==================================================== */

        .reaction-controls-area {

            width: 100%;

            min-width: 0;

            box-sizing: border-box;
        }


        .reaction-controls-area
        .reaction-controls-container {

            width: 100% !important;

            max-width: none !important;

            margin: 0 !important;

            padding: 0 !important;

            box-sizing: border-box;
        }


        /* ====================================================
           RIGHT 3D VIEW
           ==================================================== */

        .reaction-3d-viewport {

            width: 100%;

            min-width: 0;

            height: 650px;

            min-height: 500px;

            position: relative;

            overflow: hidden;

            box-sizing: border-box;

            border-radius: 20px;

            background:
                radial-gradient(
                    circle at center,
                    #102b42 0%,
                    #071522 52%,
                    #040c16 100%
                );

            border:
                1px solid
                rgba(67,134,189,0.45);

            box-shadow:
                0 25px 70px
                rgba(0,0,0,0.35),

                inset 0 1px 0
                rgba(255,255,255,0.06);
        }


        /* ====================================================
           THREE.JS CANVAS
           ==================================================== */

        .reaction-3d-viewport
        .reaction-canvas {

            display: block;

            width: 100% !important;

            height: 100% !important;

            position: absolute;

            inset: 0;
        }


        /* ====================================================
           MOBILE
           ==================================================== */

        @media (max-width: 850px) {

            .reaction-lab {

                grid-template-columns:
                    1fr;

                padding:
                    16px;
            }


            .reaction-3d-viewport {

                order: 1;

                height: 520px;
            }


            .reaction-controls-area {

                order: 2;
            }
        }


        @media (max-width: 500px) {

            .reaction-lab {

                padding:
                    10px;
            }


            .reaction-3d-viewport {

                height:
                    400px;

                min-height:
                    400px;

                border-radius:
                    14px;
            }
        }

        `;


        document.head.appendChild(
            style
        );
    }


    // ========================================================
    // UPDATE LOOP
    // ========================================================

    startControlsUpdater() {

        if (
            this.controlsAnimationFrame !== null
        ) {
            return;
        }


        const update =
            () => {

                if (
                    this.destroyed
                ) {
                    return;
                }


                if (
                    this.controls &&
                    typeof this.controls.update ===
                    "function"
                ) {

                    this.controls.update();
                }


                this.controlsAnimationFrame =
                    requestAnimationFrame(
                        update
                    );
            };


        this.controlsAnimationFrame =
            requestAnimationFrame(
                update
            );
    }


    // ========================================================
    // DISPOSE
    // ========================================================

    dispose() {

        if (
            this.controlsAnimationFrame !== null
        ) {

            cancelAnimationFrame(
                this.controlsAnimationFrame
            );

            this.controlsAnimationFrame =
                null;
        }


        if (
            this.controls &&
            typeof this.controls.destroy ===
            "function"
        ) {

            this.controls.destroy();
        }


        super.dispose();
    }


    // ========================================================
    // DESTROY
    // ========================================================

    destroy() {

        this.dispose();
    }
}


// ============================================================
// EXPORT
// ============================================================

export {
    ReactionControls
};


export default ReactionSimulator;