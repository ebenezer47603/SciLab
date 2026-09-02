import {
    createMoleculeBuilderScene
} from "./MoleculeBuilderScene.js";

import {
    createMoleculeBuilderControls
} from "./MoleculeBuilderControls.js";

import {
    molecules
} from "./MoleculeData.js";

import "./moleculeBuilder.css";


// ============================================================
// SciLab 3D Molecule Builder
// Main Molecule Builder Page
// ============================================================

export function MoleculeBuilder() {

    return `

        <section class="molecule-builder-page">

            <!-- ================================================= -->
            <!-- HEADER -->
            <!-- ================================================= -->

            <header class="molecule-builder-header">

                <div>

                    <span class="molecule-builder-badge">
                        🧪 SciLab 3D Chemistry
                    </span>

                    <h1>
                        3D Molecule Builder
                    </h1>

                    <p>
                        Build, explore and understand molecules
                        in an interactive 3D laboratory.
                    </p>

                </div>

            </header>


            <!-- ================================================= -->
            <!-- MAIN LAYOUT -->
            <!-- ================================================= -->

            <div class="molecule-builder-layout">


                <!-- ================================================= -->
                <!-- SIDEBAR -->
                <!-- ================================================= -->

                <aside class="molecule-builder-sidebar">


                    <!-- MOLECULE SELECTOR -->

                    <div class="control-section">

                        <h2>
                            🧪 Molecule
                        </h2>

                        <label
                            for="molecule-select"
                        >
                            Select molecule
                        </label>

                        <select
                            id="molecule-select"
                        >

                            ${molecules.map(
                                molecule => `
                                    <option
                                        value="${molecule.id}"
                                    >
                                        ${molecule.name}
                                        (${molecule.formula})
                                    </option>
                                `
                            ).join("")}

                        </select>

                    </div>


                    <!-- ================================================= -->
                    <!-- CONTROLS -->
                    <!-- ================================================= -->

                    <div class="control-section">

                        <h2>
                            ⚙️ Controls
                        </h2>


                        <button
                            type="button"
                            id="build-molecule"
                            class="molecule-btn primary"
                        >
                            🧪 Build Molecule
                        </button>


                        <button
                            type="button"
                            id="reset-molecule"
                            class="molecule-btn"
                        >
                            🔄 Reset
                        </button>


                        <button
                            type="button"
                            id="play-molecule"
                            class="molecule-btn play-btn"
                        >
                            ▶️ Play
                        </button>


                        <button
                            type="button"
                            id="pause-molecule"
                            class="molecule-btn pause-btn"
                        >
                            ⏸ Pause
                        </button>

                    </div>


                    <!-- ================================================= -->
                    <!-- INFORMATION -->
                    <!-- ================================================= -->

                    <div
                        id="molecule-info"
                        class="molecule-info"
                    >

                        <h2>
                            Information
                        </h2>

                        <p>
                            Select a molecule to begin.
                        </p>

                    </div>


                </aside>


                <!-- ================================================= -->
                <!-- 3D AREA -->
                <!-- ================================================= -->

                <main class="molecule-builder-main">

                    <div
                        id="molecule-engine-container"
                        class="molecule-engine-container"
                    >

                        <div class="engine-loading">

                            <span>
                                🧪
                            </span>

                            <p>
                                Loading 3D Molecule Builder...
                            </p>

                        </div>

                    </div>

                </main>

            </div>


            <!-- ================================================= -->
            <!-- TEACHER PANEL -->
            <!-- ================================================= -->

            <section class="molecule-teacher-panel">

                <div class="teacher-title">

                    <span>
                        👨‍🏫
                    </span>

                    <div>

                        <h2>
                            Teacher Explanation
                        </h2>

                        <p>
                            Explore molecular geometry,
                            bonds, lone pairs and bond angles.
                        </p>

                    </div>

                </div>


                <div
                    id="teacher-info"
                    class="teacher-info"
                >

                    <p>
                        Select a molecule to see its
                        scientific explanation.
                    </p>

                </div>

            </section>


        </section>

    `;
}


// ============================================================
// INITIALIZE MOLECULE BUILDER
// ============================================================

export function initMoleculeBuilder() {

    const container =
        document.getElementById(
            "molecule-engine-container"
        );


    if (!container) {

        console.error(
            "❌ Molecule Builder: engine container not found."
        );

        return;

    }


    // --------------------------------------------------------
    // Create 3D scene
    // --------------------------------------------------------

    const sceneController =
        createMoleculeBuilderScene(
            container
        );


    if (!sceneController) {

        console.error(
            "❌ Molecule Builder scene failed."
        );

        return;

    }


    // --------------------------------------------------------
    // Create controls
    // --------------------------------------------------------

    createMoleculeBuilderControls({

        container,

        sceneController

    });


    console.log(
        "✅ Molecule Builder initialized."
    );

}