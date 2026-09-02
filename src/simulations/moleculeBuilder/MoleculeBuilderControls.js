import { molecules } from "./MoleculeData.js";

// ============================================================
// SciLab Molecule Builder Controls
// ============================================================

// ------------------------------------------------------------
// Calculate bond angle automatically from atom coordinates
// ------------------------------------------------------------

function calculateBondAngle(molecule) {

    if (
        !molecule ||
        !Array.isArray(molecule.atoms) ||
        !Array.isArray(molecule.bonds)
    ) {
        return null;
    }

    // Find an atom connected to at least two other atoms.
    // This becomes the central atom for the bond angle.
    const connectionMap = new Map();

    molecule.atoms.forEach((_, index) => {
        connectionMap.set(index, []);
    });

    molecule.bonds.forEach(bond => {

        const from = Number(bond.from);
        const to = Number(bond.to);

        if (
            connectionMap.has(from) &&
            connectionMap.has(to)
        ) {
            connectionMap.get(from).push(to);
            connectionMap.get(to).push(from);
        }
    });

    let centralIndex = -1;

    for (const [index, connected] of connectionMap.entries()) {

        if (connected.length >= 2) {
            centralIndex = index;
            break;
        }
    }

    if (centralIndex < 0) {
        return null;
    }

    const connectedAtoms =
        connectionMap.get(centralIndex);

    if (
        !connectedAtoms ||
        connectedAtoms.length < 2
    ) {
        return null;
    }

    const center =
        molecule.atoms[centralIndex];

    const atomA =
        molecule.atoms[connectedAtoms[0]];

    const atomB =
        molecule.atoms[connectedAtoms[1]];

    if (!center || !atomA || !atomB) {
        return null;
    }

    // Vector center -> A
    const vectorA = {
        x: Number(atomA.x || 0) - Number(center.x || 0),
        y: Number(atomA.y || 0) - Number(center.y || 0),
        z: Number(atomA.z || 0) - Number(center.z || 0)
    };

    // Vector center -> B
    const vectorB = {
        x: Number(atomB.x || 0) - Number(center.x || 0),
        y: Number(atomB.y || 0) - Number(center.y || 0),
        z: Number(atomB.z || 0) - Number(center.z || 0)
    };

    const dot =
        vectorA.x * vectorB.x +
        vectorA.y * vectorB.y +
        vectorA.z * vectorB.z;

    const magnitudeA =
        Math.sqrt(
            vectorA.x ** 2 +
            vectorA.y ** 2 +
            vectorA.z ** 2
        );

    const magnitudeB =
        Math.sqrt(
            vectorB.x ** 2 +
            vectorB.y ** 2 +
            vectorB.z ** 2
        );

    if (
        magnitudeA === 0 ||
        magnitudeB === 0
    ) {
        return null;
    }

    let cosine =
        dot /
        (magnitudeA * magnitudeB);

    // Avoid floating-point errors
    cosine =
        Math.max(
            -1,
            Math.min(1, cosine)
        );

    const angle =
        Math.acos(cosine) *
        180 /
        Math.PI;

    return angle;
}


// ------------------------------------------------------------
// Get bond angle
// ------------------------------------------------------------

function getBondAngle(molecule) {

    // If MoleculeData already contains an angle,
    // use it first.
    if (
        molecule &&
        molecule.bondAngle !== undefined &&
        molecule.bondAngle !== null &&
        molecule.bondAngle !== ""
    ) {
        return Number(molecule.bondAngle);
    }

    // Otherwise calculate it automatically.
    return calculateBondAngle(molecule);
}


// ------------------------------------------------------------
// Format angle
// ------------------------------------------------------------

function formatAngle(molecule) {

    const angle =
        getBondAngle(molecule);

    if (
        angle === null ||
        Number.isNaN(angle)
    ) {
        return "Not specified";
    }

    return `${angle.toFixed(1)}°`;
}


// ============================================================
// CREATE CONTROLS
// ============================================================

export function createMoleculeBuilderControls({
    container,
    sceneController
}) {

    // --------------------------------------------------------
    // Elements
    // --------------------------------------------------------

    const selector =
        document.getElementById(
            "molecule-select"
        );

    const buildButton =
        document.getElementById(
            "build-molecule"
        );

    const resetButton =
        document.getElementById(
            "reset-molecule"
        );

    const playButton =
        document.getElementById(
            "play-molecule"
        );

    const pauseButton =
        document.getElementById(
            "pause-molecule"
        );

    const info =
        document.getElementById(
            "molecule-info"
        );

    const teacherInfo =
        document.getElementById(
            "teacher-info"
        );


    // ========================================================
    // CHECK
    // ========================================================

    if (!selector) {

        console.error(
            "❌ Molecule selector not found."
        );

        return;
    }

    if (!sceneController) {

        console.error(
            "❌ Molecule scene controller not found."
        );

        return;
    }


    // ========================================================
    // FILL SELECTOR
    // ========================================================

    selector.innerHTML =
        molecules
            .map(
                molecule => `
                    <option value="${molecule.id}">
                        ${molecule.name}
                        (${molecule.formula})
                    </option>
                `
            )
            .join("");


    // ========================================================
    // GET SELECTED MOLECULE
    // ========================================================

    function getSelectedMolecule() {

        return molecules.find(
            molecule =>
                String(molecule.id) ===
                String(selector.value)
        );
    }


    // ========================================================
    // UPDATE INFORMATION
    // ========================================================

    function updateInfo() {

        const molecule =
            getSelectedMolecule();

        if (!molecule) {
            return;
        }


        // ----------------------------------------------------
        // Bonds
        // ----------------------------------------------------

        const bonds =
            Array.isArray(molecule.bonds)
                ? molecule.bonds
                : [];


        const single =
            bonds.filter(
                bond =>
                    Number(bond.type) === 1
            ).length;


        const double =
            bonds.filter(
                bond =>
                    Number(bond.type) === 2
            ).length;


        const triple =
            bonds.filter(
                bond =>
                    Number(bond.type) === 3
            ).length;


        // ----------------------------------------------------
        // Lone pairs
        // ----------------------------------------------------

        let lonePairs = 0;

        if (
            Array.isArray(
                molecule.lonePairs
            )
        ) {

            lonePairs =
                molecule.lonePairs.reduce(
                    (
                        total,
                        item
                    ) => {

                        return total +
                            (
                                Number(
                                    item.pairs
                                ) || 0
                            );

                    },
                    0
                );
        }


        // ----------------------------------------------------
        // Geometry
        // ----------------------------------------------------

        const geometry =
            molecule.molecularGeometry ||
            molecule.geometry ||
            "Not specified";


        // ----------------------------------------------------
        // Bond angle
        // ----------------------------------------------------

        const angle =
            formatAngle(molecule);


        // ====================================================
        // INFORMATION PANEL
        // ====================================================

        if (info) {

            info.innerHTML = `

                <div class="molecule-title">

                    <h2>
                        ${molecule.name}
                    </h2>

                    <p>
                        Formula:
                        <strong>
                            ${molecule.formula}
                        </strong>
                    </p>

                </div>


                <p>
                    <strong>Atoms:</strong>
                    ${molecule.atoms.length}
                </p>

                <hr>


                <p>
                    <strong>Single bonds:</strong>
                    ${single}
                </p>

                <p>
                    <strong>Double bonds:</strong>
                    ${double}
                </p>

                <p>
                    <strong>Triple bonds:</strong>
                    ${triple}
                </p>

                <p>
                    <strong>Lone pairs:</strong>
                    ${lonePairs}
                </p>

                <hr>


                <p>
                    <strong>Molecular Shape:</strong>
                    ${geometry}
                </p>

                <p>
                    <strong>Bond Angle:</strong>
                    ${angle}
                </p>


                <p>
                    ${molecule.description || ""}
                </p>

            `;
        }


        // ====================================================
        // TEACHER PANEL
        // ====================================================

        if (teacherInfo) {

            teacherInfo.innerHTML = `

                <h3>
                    👨‍🏫 ${molecule.name}
                </h3>

                <p>
                    ${molecule.description || ""}
                </p>

                <p>
                    <strong>
                        Molecular Shape:
                    </strong>

                    ${geometry}
                </p>

                <p>
                    <strong>
                        Bond Angle:
                    </strong>

                    ${angle}
                </p>

                <p>
                    <strong>
                        VSEPR:
                    </strong>

                    The molecular shape is determined
                    by electron-domain repulsion around
                    the central atom.
                </p>

            `;
        }


        // ====================================================
        // SEND INFORMATION TO 3D SCENE
        // ====================================================

        if (
            typeof sceneController.setMoleculeInfo ===
            "function"
        ) {

            sceneController.setMoleculeInfo({

                name:
                    molecule.name,

                formula:
                    molecule.formula,

                shape:
                    geometry,

                angle:
                    angle

            });
        }
    }


    // ========================================================
    // BUILD SELECTED MOLECULE
    // ========================================================

    function buildSelectedMolecule() {

        const molecule =
            getSelectedMolecule();

        if (!molecule) {

            console.error(
                "❌ Selected molecule not found."
            );

            return;
        }


        if (
            typeof sceneController.buildMolecule !==
            "function"
        ) {

            console.error(
                "❌ buildMolecule() is missing."
            );

            return;
        }


        sceneController.buildMolecule(
            molecule
        );


        updateInfo();
    }


    // ========================================================
    // SELECT CHANGE
    // ========================================================

    selector.addEventListener(
        "change",
        () => {

            buildSelectedMolecule();

        }
    );


    // ========================================================
    // BUILD BUTTON
    // ========================================================

    if (buildButton) {

        buildButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                buildSelectedMolecule();

                console.log(
                    "🧪 Build button clicked"
                );
            }
        );
    }


    // ========================================================
    // RESET BUTTON
    // ========================================================

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                if (
                    typeof sceneController.reset ===
                    "function"
                ) {

                    sceneController.reset();

                }

                else if (
                    typeof sceneController.resetMolecule ===
                    "function"
                ) {

                    sceneController.resetMolecule();

                }

                updateInfo();

                console.log(
                    "🔄 Reset button clicked"
                );
            }
        );
    }


    // ========================================================
    // PLAY BUTTON
    // ========================================================

    if (playButton) {

        playButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                if (
                    typeof sceneController.play ===
                    "function"
                ) {

                    sceneController.play();

                }

                else if (
                    typeof sceneController.playMolecule ===
                    "function"
                ) {

                    sceneController.playMolecule();

                }

                console.log(
                    "▶ Play button clicked"
                );
            }
        );
    }


    // ========================================================
    // PAUSE BUTTON
    // ========================================================

    if (pauseButton) {

        pauseButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                if (
                    typeof sceneController.pause ===
                    "function"
                ) {

                    sceneController.pause();

                }

                else if (
                    typeof sceneController.pauseMolecule ===
                    "function"
                ) {

                    sceneController.pauseMolecule();

                }

                console.log(
                    "⏸ Pause button clicked"
                );
            }
        );
    }


    // ========================================================
    // FIRST MOLECULE
    // ========================================================

    if (molecules.length > 0) {

        selector.value =
            molecules[0].id;

        buildSelectedMolecule();
    }


    console.log(
        "✅ Molecule Builder Controls initialized"
    );
}