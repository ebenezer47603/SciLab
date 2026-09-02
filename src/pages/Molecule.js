export function Molecule() {

    return `

    <section class="atom-page">

        <div class="atom-header">

            <h1>🧪 3D Molecule Builder</h1>

            <p>

                Build and explore molecules in 3D.

            </p>

        </div>

        <div class="atom-layout">

            <aside class="atom-sidebar">

                <h2>Molecule Selector</h2>

                <select id="molecule-select"></select>

                <button id="build-molecule">

                    🧪 Build Molecule

                </button>

                <button id="reset-molecule">

                    🔄 Reset

                </button>

                <button id="play-molecule">

                    ▶️ Play

                </button>

                <button id="pause-molecule">

                    ⏸ Pause

                </button>

                <div id="molecule-info">

                </div>

            </aside>

            <main class="atom-view">

                <div id="engine-container"></div>

            </main>

        </div>

        <section class="teacher-panel">

            <h2>Teacher Explanation</h2>

            <div id="teacher-info">

            </div>

        </section>

    </section>

    `;

}