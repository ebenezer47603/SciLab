// ============================================================
// SciLab Reaction Lab - Molecule System
// MoleculeSystem.js
// ============================================================

import * as THREE from "three";
import { MoleculeRenderer } from "../scene/MoleculeRenderer.js";

// ============================================================
// ELEMENT INFORMATION
// ============================================================

const ELEMENT_NAMES = {

    H: "Hydrogen",
    He: "Helium",

    Li: "Lithium",
    Be: "Beryllium",
    B: "Boron",
    C: "Carbon",
    N: "Nitrogen",
    O: "Oxygen",
    F: "Fluorine",
    Ne: "Neon",

    Na: "Sodium",
    Mg: "Magnesium",
    Al: "Aluminium",
    Si: "Silicon",
    P: "Phosphorus",
    S: "Sulfur",
    Cl: "Chlorine",
    Ar: "Argon",

    K: "Potassium",
    Ca: "Calcium",

    Fe: "Iron",
    Cu: "Copper",
    Zn: "Zinc",

    Ag: "Silver",
    Au: "Gold",

    Br: "Bromine",
    I: "Iodine"
};

// ============================================================
// MOLECULE NAMES
// ============================================================

const MOLECULE_NAMES = {

    H2: "Hydrogen",
    O2: "Oxygen",
    N2: "Nitrogen",

    H2O: "Water",
    CO2: "Carbon Dioxide",
    NH3: "Ammonia",

    CH4: "Methane",
    CO: "Carbon Monoxide",

    HCl: "Hydrochloric Acid",
    NaOH: "Sodium Hydroxide",

    NaCl: "Sodium Chloride",

    H2O2: "Hydrogen Peroxide",

    SO2: "Sulfur Dioxide",
    SO3: "Sulfur Trioxide",

    NO: "Nitric Oxide",
    NO2: "Nitrogen Dioxide",

    HNO3: "Nitric Acid",
    H2SO4: "Sulfuric Acid",

    CH3OH: "Methanol",
    C2H5OH: "Ethanol",

    CaCO3: "Calcium Carbonate",
    CaO: "Calcium Oxide",

    MgO: "Magnesium Oxide",

    KOH: "Potassium Hydroxide",
    KCl: "Potassium Chloride"
};

// ============================================================
// ELEMENT COLORS
// ============================================================

const ELEMENT_COLORS = {

    H: "#ffffff",
    He: "#d9ffff",

    Li: "#cc80ff",
    Be: "#c2ff00",

    B: "#ffb5b5",
    C: "#ffffff",

    N: "#4da6ff",
    O: "#ff4d4d",

    F: "#90e050",
    Ne: "#b3e3f5",

    Na: "#ab5cf2",
    Mg: "#8aff00",

    Al: "#bfa6a6",
    Si: "#f0c8a0",

    P: "#ff8000",
    S: "#ffff30",

    Cl: "#1ff01f",
    Ar: "#80d1e3",

    K: "#8f40d4",
    Ca: "#3dff00",

    Fe: "#e06633",
    Cu: "#c88033",
    Zn: "#7d80b0",

    Ag: "#c0c0c0",
    Au: "#ffd123",

    Br: "#a62929",
    I: "#940094"
};

// ============================================================
// MOLECULE SYSTEM
// ============================================================

export class MoleculeSystem {

    constructor(
        scene,
        camera = null,
        domElement = null
    ) {

        this.scene = scene;

        this.camera = camera;

        this.domElement =
            domElement || null;

        this.molecules = [];

        this.renderer =
            new MoleculeRenderer(
                scene
            );

        this.bounds = {

            x: 4,
            y: 2.5,
            z: 2.5
        };

        this.speedMultiplier = 1;

        // ----------------------------------------------------
        // REACTION STATE
        // ----------------------------------------------------

        this.reactionComplete = false;

        // ----------------------------------------------------
        // DRAG STATE
        // ----------------------------------------------------

        this.dragEnabled = false;

        this.draggingMolecule = null;

        this.dragPlane =
            new THREE.Plane();

        this.dragPoint =
            new THREE.Vector3();

        this.dragOffset =
            new THREE.Vector3();

        this.raycaster =
            new THREE.Raycaster();

        this.pointer =
            new THREE.Vector2();

        this.dragStartPosition =
            new THREE.Vector3();

        this.dragListenersAttached = false;

        // ----------------------------------------------------
        // HOVER STATE
        // ----------------------------------------------------

        this.hoveredMolecule = null;

        // ----------------------------------------------------
        // POINTER STATE
        // ----------------------------------------------------

        this.activePointerId = null;

        this.isPointerDown = false;

        // ----------------------------------------------------
        // BIND EVENTS
        // ----------------------------------------------------

        this.onPointerDown =
            this.onPointerDown.bind(this);

        this.onPointerMove =
            this.onPointerMove.bind(this);

        this.onPointerUp =
            this.onPointerUp.bind(this);

        // ----------------------------------------------------
        // ATTACH DRAG SYSTEM
        // ----------------------------------------------------

        if (
            this.camera &&
            this.domElement
        ) {

            this.attachDragControls();
        }
    }

    // ========================================================
    // SET CAMERA
    // ========================================================

    setCamera(camera) {

        this.camera = camera;

        this.tryAttachDragControls();
    }

    // ========================================================
    // SET DOM ELEMENT
    // ========================================================

    setDomElement(domElement) {

        if (
            this.domElement &&
            this.domElement !== domElement
        ) {

            this.removeDragListeners();
        }

        this.domElement =
            domElement || null;

        this.tryAttachDragControls();
    }

    // ========================================================
    // SETUP INTERACTION
    // ========================================================

    setInteractionEnabled(enabled) {

        this.dragEnabled =
            Boolean(enabled);

        if (!this.dragEnabled) {

            this.stopDragging();
        }
    }

    // ========================================================
    // ENABLE INTERACTION
    // ========================================================

    enableInteraction(
        camera,
        domElement
    ) {

        if (camera) {

            this.camera =
                camera;
        }

        if (domElement) {

            if (
                this.domElement &&
                this.domElement !== domElement
            ) {

                this.removeDragListeners();
            }

            this.domElement =
                domElement;
        }

        this.dragEnabled = true;

        this.tryAttachDragControls();
    }

    // ========================================================
    // DISABLE INTERACTION
    // ========================================================

    disableInteraction() {

        this.dragEnabled = false;

        this.stopDragging();

        this.hoveredMolecule = null;

        if (this.domElement) {

            this.domElement.style.cursor = "";
        }
    }

    // ========================================================
    // TRY ATTACH DRAG CONTROLS
    // ========================================================

    tryAttachDragControls() {

        if (
            !this.camera ||
            !this.domElement
        ) {

            return false;
        }

        this.attachDragControls();

        return this.dragListenersAttached;
    }

    // ========================================================
    // SET REACTION COMPLETE
    // ========================================================

    setReactionComplete(
        value = true
    ) {

        this.reactionComplete =
            Boolean(value);

        if (
            this.reactionComplete
        ) {

            for (
                const molecule
                of this.molecules
            ) {

                if (
                    molecule.velocity
                ) {

                    molecule.velocity.set(
                        0,
                        0,
                        0
                    );
                }
            }
        }
    }

    // ========================================================
    // RESET REACTION STATE
    // ========================================================

    resetReactionState() {

        this.reactionComplete = false;

        this.stopDragging();

        for (
            const molecule
            of this.molecules
        ) {

            molecule.velocity =
                this.randomVelocity();
        }
    }

    // ========================================================
    // ENABLE DRAG
    // ========================================================

    enableDrag() {

        this.dragEnabled = true;

        this.tryAttachDragControls();
    }

    // ========================================================
    // DISABLE DRAG
    // ========================================================

    disableDrag() {

        this.dragEnabled = false;

        this.stopDragging();
    }

    // ========================================================
    // ADD MOLECULE
    // ========================================================

    add(
        formula,
        position
    ) {

        const molecule = {

            formula,

            name:
                this.getMoleculeName(
                    formula
                ),

            position:
                position
                    ? position.clone()
                    : this.randomPosition(),

            velocity:
                this.randomVelocity(),

            radius: 0.32,

            mesh: null,

            labels: []
        };

        molecule.mesh =
            this.renderer.create(
                formula,
                molecule.position
            );

        if (
            molecule.mesh
        ) {

            molecule.mesh.userData =
                molecule.mesh.userData || {};

            molecule.mesh.userData.molecule =
                molecule;

            molecule.mesh.userData.isMolecule =
                true;

            this.createMoleculeLabels(
                molecule
            );
        }

        this.molecules.push(
            molecule
        );

        return molecule;
    }

    // ========================================================
    // ADD MANY
    // ========================================================

    addMany(
        formula,
        count
    ) {

        const amount =
            Math.max(
                0,
                Math.floor(
                    Number(count) || 0
                )
            );

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            this.add(
                formula,
                this.findFreePosition()
            );
        }
    }

    // ========================================================
    // RANDOM POSITION
    // ========================================================

    randomPosition() {

        return new THREE.Vector3(

            THREE.MathUtils.randFloat(
                -3.7,
                3.7
            ),

            THREE.MathUtils.randFloat(
                -2.1,
                2.1
            ),

            THREE.MathUtils.randFloat(
                -2.0,
                2.0
            )
        );
    }

    // ========================================================
    // FREE POSITION
    // ========================================================

    findFreePosition() {

        for (
            let attempt = 0;
            attempt < 30;
            attempt++
        ) {

            const position =
                this.randomPosition();

            let valid = true;

            for (
                const molecule
                of this.molecules
            ) {

                if (
                    molecule.position
                        .distanceTo(
                            position
                        ) < 0.65
                ) {

                    valid = false;

                    break;
                }
            }

            if (
                valid
            ) {

                return position;
            }
        }

        return this.randomPosition();
    }

    // ========================================================
    // RANDOM VELOCITY
    // ========================================================

    randomVelocity() {

        const velocity =
            new THREE.Vector3(

                THREE.MathUtils.randFloat(
                    -1,
                    1
                ),

                THREE.MathUtils.randFloat(
                    -1,
                    1
                ),

                THREE.MathUtils.randFloat(
                    -1,
                    1
                )
            );

        if (
            velocity.lengthSq() < 0.01
        ) {

            velocity.set(
                1,
                0,
                0
            );
        }

        return velocity
            .normalize()
            .multiplyScalar(
                THREE.MathUtils.randFloat(
                    0.5,
                    1.2
                )
            );
    }

    // ========================================================
    // UPDATE
    // ========================================================

    update(
        deltaTime,
        temperature = 298
    ) {

        if (
            this.reactionComplete
        ) {

            for (
                const molecule
                of this.molecules
            ) {

                if (
                    molecule.mesh
                ) {

                    molecule.mesh.position.copy(
                        molecule.position
                    );
                }
            }

            return;
        }

        const safeTemperature =
            Math.max(
                1,
                Number(
                    temperature
                ) || 298
            );

        const temperatureFactor =
            Math.sqrt(
                safeTemperature /
                298
            );

        const speed =
            Math.max(
                0.15,
                temperatureFactor
            ) *
            this.speedMultiplier;

        for (
            const molecule
            of this.molecules
        ) {

            // ------------------------------------------------
            // Do not move molecule automatically while dragging
            // ------------------------------------------------

            if (
                molecule ===
                this.draggingMolecule
            ) {

                continue;
            }

            if (
                !molecule.velocity
            ) {

                molecule.velocity =
                    this.randomVelocity();
            }

            molecule.position.addScaledVector(
                molecule.velocity,
                deltaTime * speed
            );

            this.keepInsideChamber(
                molecule
            );

            if (
                molecule.mesh
            ) {

                molecule.mesh.position.copy(
                    molecule.position
                );
            }
        }

        this.resolveMoleculeCollisions();
    }

    // ========================================================
    // KEEP INSIDE CHAMBER
    // ========================================================

    keepInsideChamber(
        molecule
    ) {

        const p =
            molecule.position;

        const v =
            molecule.velocity;

        if (
            p.x <= -this.bounds.x ||
            p.x >= this.bounds.x
        ) {

            p.x =
                THREE.MathUtils.clamp(
                    p.x,
                    -this.bounds.x,
                    this.bounds.x
                );

            v.x *= -1;
        }

        if (
            p.y <= -this.bounds.y ||
            p.y >= this.bounds.y
        ) {

            p.y =
                THREE.MathUtils.clamp(
                    p.y,
                    -this.bounds.y,
                    this.bounds.y
                );

            v.y *= -1;
        }

        if (
            p.z <= -this.bounds.z ||
            p.z >= this.bounds.z
        ) {

            p.z =
                THREE.MathUtils.clamp(
                    p.z,
                    -this.bounds.z,
                    this.bounds.z
                );

            v.z *= -1;
        }
    }

    // ========================================================
    // MOLECULE COLLISIONS
    // ========================================================

    resolveMoleculeCollisions() {

        const minDistance =
            0.58;

        for (
            let i = 0;
            i < this.molecules.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < this.molecules.length;
                j++
            ) {

                const a =
                    this.molecules[i];

                const b =
                    this.molecules[j];

                if (
                    a === this.draggingMolecule ||
                    b === this.draggingMolecule
                ) {

                    continue;
                }

                const delta =
                    b.position
                        .clone()
                        .sub(
                            a.position
                        );

                const distance =
                    delta.length();

                if (
                    distance <= 0 ||
                    distance >= minDistance
                ) {

                    continue;
                }

                const normal =
                    delta.normalize();

                const overlap =
                    minDistance -
                    distance;

                a.position.addScaledVector(
                    normal,
                    -overlap * 0.5
                );

                b.position.addScaledVector(
                    normal,
                    overlap * 0.5
                );

                const aVelocity =
                    a.velocity.clone();

                const bVelocity =
                    b.velocity.clone();

                const aNormal =
                    aVelocity.dot(
                        normal
                    );

                const bNormal =
                    bVelocity.dot(
                        normal
                    );

                a.velocity.addScaledVector(
                    normal,
                    bNormal -
                    aNormal
                );

                b.velocity.addScaledVector(
                    normal,
                    aNormal -
                    bNormal
                );
            }
        }
    }

    // ========================================================
    // CREATE PRODUCT
    // ========================================================

    createProduct(
        formula,
        position
    ) {

        const product =
            this.add(
                formula,
                position
            );

        if (
            product
        ) {

            if (
                this.reactionComplete
            ) {

                product.velocity.set(
                    0,
                    0,
                    0
                );

            } else {

                product.velocity =
                    this.randomVelocity();
            }
        }

        return product;
    }

    // ========================================================
    // MOLECULE NAME
    // ========================================================

    getMoleculeName(
        formula
    ) {

        return (
            MOLECULE_NAMES[
                formula
            ] ||
            formula
        );
    }

    // ========================================================
    // CREATE MOLECULE LABELS
    // ========================================================

    createMoleculeLabels(
        molecule
    ) {

        if (
            !molecule ||
            !molecule.mesh
        ) {

            return;
        }

        this.disposeLabels(
            molecule
        );

        const atomMeshes =
            this.findAtomMeshes(
                molecule.mesh
            );

        if (
            atomMeshes.length === 0
        ) {

            return;
        }

        const formulaAtoms =
            this.parseFormula(
                molecule.formula
            );

        const usedSymbols = [];

        for (
            const atom
            of atomMeshes
        ) {

            const symbol =
                this.resolveAtomSymbol(
                    atom,
                    formulaAtoms,
                    usedSymbols
                );

            if (
                !symbol
            ) {

                continue;
            }

            usedSymbols.push(
                symbol
            );

            const label =
                this.createAtomLabel(
                    symbol
                );

            if (
                !label
            ) {

                continue;
            }

            this.placeLabelAboveAtom(
                atom,
                label
            );

            atom.add(
                label
            );

            atom.userData =
                atom.userData || {};

            atom.userData.atomLabel =
                label;

            atom.userData.element =
                symbol;

            molecule.labels.push(
                label
            );
        }
    }

    // ========================================================
    // FIND REAL ATOM MESHES
    // ========================================================

    findAtomMeshes(
        root
    ) {

        const atoms = [];

        root.traverse(
            object => {

                if (
                    !object.isMesh
                ) {

                    return;
                }

                if (
                    object === root
                ) {

                    return;
                }

                const data =
                    object.userData || {};

                const name =
                    String(
                        object.name || ""
                    ).toLowerCase();

                if (
                    data.isBond ||
                    data.bond ||
                    data.type === "bond" ||
                    name.includes("bond") ||
                    name.includes("stick") ||
                    name.includes("cylinder")
                ) {

                    return;
                }

                if (
                    data.atom ||
                    data.element ||
                    data.symbol ||
                    data.atomSymbol ||
                    data.isAtom
                ) {

                    atoms.push(
                        object
                    );

                    return;
                }

                if (
                    this.isLikelyAtomMesh(
                        object
                    )
                ) {

                    atoms.push(
                        object
                    );
                }
            }
        );

        return atoms;
    }

    // ========================================================
    // SPHERE / ATOM DETECTION
    // ========================================================

    isLikelyAtomMesh(
        mesh
    ) {

        if (
            !mesh ||
            !mesh.geometry
        ) {

            return false;
        }

        const geometry =
            mesh.geometry;

        if (
            geometry.type ===
            "SphereGeometry"
        ) {

            return true;
        }

        geometry.computeBoundingBox?.();

        const box =
            geometry.boundingBox;

        if (
            !box
        ) {

            return false;
        }

        const size =
            new THREE.Vector3();

        box.getSize(
            size
        );

        if (
            size.x <= 0 ||
            size.y <= 0 ||
            size.z <= 0
        ) {

            return false;
        }

        const max =
            Math.max(
                size.x,
                size.y,
                size.z
            );

        const min =
            Math.min(
                size.x,
                size.y,
                size.z
            );

        const ratio =
            min / max;

        return ratio > 0.65;
    }

    // ========================================================
    // RESOLVE ATOM SYMBOL
    // ========================================================

    resolveAtomSymbol(
        atom,
        formulaAtoms,
        usedSymbols
    ) {

        const direct =
            this.getAtomSymbol(
                atom
            );

        if (
            direct &&
            formulaAtoms.includes(
                direct
            )
        ) {

            const usedCount =
                usedSymbols.filter(
                    value =>
                        value === direct
                ).length;

            const totalCount =
                formulaAtoms.filter(
                    value =>
                        value === direct
                ).length;

            if (
                usedCount < totalCount
            ) {

                return direct;
            }
        }

        const colorSymbol =
            this.symbolFromMaterialColor(
                atom
            );

        if (
            colorSymbol &&
            formulaAtoms.includes(
                colorSymbol
            )
        ) {

            const usedCount =
                usedSymbols.filter(
                    value =>
                        value === colorSymbol
                ).length;

            const totalCount =
                formulaAtoms.filter(
                    value =>
                        value === colorSymbol
                ).length;

            if (
                usedCount < totalCount
            ) {

                return colorSymbol;
            }
        }

        for (
            const symbol
            of formulaAtoms
        ) {

            const used =
                usedSymbols.filter(
                    value =>
                        value === symbol
                ).length;

            const total =
                formulaAtoms.filter(
                    value =>
                        value === symbol
                ).length;

            if (
                used < total
            ) {

                return symbol;
            }
        }

        return "";
    }

    // ========================================================
    // GET ATOM SYMBOL
    // ========================================================

    getAtomSymbol(
        atom
    ) {

        if (
            !atom
        ) {

            return "";
        }

        const data =
            atom.userData || {};

        const candidates = [

            data.element,

            data.symbol,

            data.atomSymbol,

            typeof data.atom ===
            "string"
                ? data.atom
                : "",

            this.symbolFromObjectName(
                atom.name
            )
        ];

        for (
            const symbol
            of candidates
        ) {

            if (
                symbol &&
                ELEMENT_NAMES[
                    symbol
                ]
            ) {

                return symbol;
            }
        }

        return "";
    }

    // ========================================================
    // DETECT SYMBOL FROM MATERIAL COLOR
    // ========================================================

    symbolFromMaterialColor(
        atom
    ) {

        if (
            !atom ||
            !atom.material
        ) {

            return "";
        }

        const materials =
            Array.isArray(
                atom.material
            )
                ? atom.material
                : [atom.material];

        let bestSymbol = "";

        let bestDistance =
            Infinity;

        for (
            const material
            of materials
        ) {

            if (
                !material ||
                !material.color
            ) {

                continue;
            }

            const current =
                material.color;

            for (
                const symbol
                of Object.keys(
                    ELEMENT_COLORS
                )
            ) {

                const expected =
                    new THREE.Color(
                        ELEMENT_COLORS[
                            symbol
                        ]
                    );

                const distance =
                    Math.sqrt(

                        Math.pow(
                            current.r -
                            expected.r,
                            2
                        ) +

                        Math.pow(
                            current.g -
                            expected.g,
                            2
                        ) +

                        Math.pow(
                            current.b -
                            expected.b,
                            2
                        )
                    );

                if (
                    distance <
                    bestDistance
                ) {

                    bestDistance =
                        distance;

                    bestSymbol =
                        symbol;
                }
            }
        }

        if (
            bestDistance < 0.35
        ) {

            return bestSymbol;
        }

        return "";
    }

    // ========================================================
    // SYMBOL FROM OBJECT NAME
    // ========================================================

    symbolFromObjectName(
        name
    ) {

        const value =
            String(
                name || ""
            ).trim();

        if (
            !value
        ) {

            return "";
        }

        const match =
            value.match(
                /\b([A-Z][a-z]?)\b/
            );

        if (
            !match
        ) {

            return "";
        }

        const symbol =
            match[1];

        if (
            ELEMENT_NAMES[
                symbol
            ]
        ) {

            return symbol;
        }

        return "";
    }

    // ========================================================
    // PARSE FORMULA
    // ========================================================

    parseFormula(
        formula
    ) {

        const atoms = [];

        const text =
            String(
                formula || ""
            );

        const regex =
            /([A-Z][a-z]?)(\d*)/g;

        let match;

        while (
            (
                match =
                regex.exec(
                    text
                )
            ) !== null
        ) {

            const symbol =
                match[1];

            const count =
                Math.max(
                    1,
                    Number(
                        match[2]
                    ) || 1
                );

            for (
                let i = 0;
                i < count;
                i++
            ) {

                atoms.push(
                    symbol
                );
            }
        }

        return atoms;
    }

    // ========================================================
    // CREATE SMALL ATOM LABEL
    // ========================================================

    createAtomLabel(
        symbol
    ) {

        if (
            !symbol
        ) {

            return null;
        }

        const label =
            this.createTextSprite(
                symbol,
                {

                    fontSize: 42,

                    color:
                        "#ffffff",

                    background:
                        "rgba(0,0,0,0.0)",

                    border:
                        null
                }
            );

        label.scale.set(
            0.22,
            0.22,
            1
        );

        label.renderOrder =
            2000;

        return label;
    }

    // ========================================================
    // PLACE LABEL ABOVE ATOM
    // ========================================================

    placeLabelAboveAtom(
        atom,
        label
    ) {

        if (
            !atom ||
            !label
        ) {

            return;
        }

        const geometry =
            atom.geometry;

        if (
            geometry &&
            geometry.computeBoundingBox
        ) {

            geometry.computeBoundingBox();

            const box =
                geometry.boundingBox;

            if (
                box
            ) {

                const centerX =
                    (
                        box.min.x +
                        box.max.x
                    ) / 2;

                const topY =
                    box.max.y;

                const centerZ =
                    (
                        box.min.z +
                        box.max.z
                    ) / 2;

                label.position.set(

                    centerX,

                    topY + 0.16,

                    centerZ
                );

                return;
            }
        }

        label.position.set(
            0,
            0.42,
            0
        );
    }

    // ========================================================
    // TEXT SPRITE
    // ========================================================

    createTextSprite(
        text,
        options = {}
    ) {

        const canvas =
            document.createElement(
                "canvas"
            );

        const context =
            canvas.getContext(
                "2d"
            );

        const fontSize =
            options.fontSize || 48;

        const lines =
            String(text)
                .split("\n");

        const font =
            `700 ${fontSize}px Arial`;

        context.font =
            font;

        let maxWidth = 0;

        for (
            const line
            of lines
        ) {

            maxWidth =
                Math.max(
                    maxWidth,
                    context.measureText(
                        line
                    ).width
                );
        }

        const padding =
            options.border
                ? 10
                : 2;

        const lineHeight =
            fontSize * 1.2;

        canvas.width =
            Math.ceil(
                maxWidth +
                padding * 2
            );

        canvas.height =
            Math.ceil(
                lineHeight *
                lines.length +
                padding * 2
            );

        context.font =
            font;

        context.textAlign =
            "center";

        context.textBaseline =
            "middle";

        if (
            options.background &&
            options.background !==
            "rgba(0,0,0,0.0)"
        ) {

            context.fillStyle =
                options.background;

            this.roundRect(
                context,
                2,
                2,
                canvas.width - 4,
                canvas.height - 4,
                8
            );

            context.fill();
        }

        if (
            options.border
        ) {

            context.strokeStyle =
                options.border;

            context.lineWidth =
                2;

            this.roundRect(
                context,
                2,
                2,
                canvas.width - 4,
                canvas.height - 4,
                8
            );

            context.stroke();
        }

        context.fillStyle =
            options.color ||
            "#ffffff";

        context.font =
            font;

        const startY =
            canvas.height / 2 -
            (
                (lines.length - 1) *
                lineHeight
            ) / 2;

        lines.forEach(
            (
                line,
                index
            ) => {

                context.fillText(
                    line,
                    canvas.width / 2,
                    startY +
                    index *
                    lineHeight
                );
            }
        );

        const texture =
            new THREE.CanvasTexture(
                canvas
            );

        texture.needsUpdate =
            true;

        texture.colorSpace =
            THREE.SRGBColorSpace;

        const material =
            new THREE.SpriteMaterial({

                map: texture,

                transparent: true,

                depthTest: false,

                depthWrite: false
            });

        const sprite =
            new THREE.Sprite(
                material
            );

        sprite.userData =
            sprite.userData || {};

        sprite.userData.label =
            true;

        sprite.userData.atomLabel =
            true;

        sprite.userData.text =
            text;

        sprite.renderOrder =
            2000;

        return sprite;
    }

    // ========================================================
    // ROUND RECT
    // ========================================================

    roundRect(
        context,
        x,
        y,
        width,
        height,
        radius
    ) {

        const r =
            Math.min(
                radius,
                width / 2,
                height / 2
            );

        context.beginPath();

        context.moveTo(
            x + r,
            y
        );

        context.arcTo(
            x + width,
            y,
            x + width,
            y + height,
            r
        );

        context.arcTo(
            x + width,
            y + height,
            x,
            y + height,
            r
        );

        context.arcTo(
            x,
            y + height,
            x,
            y,
            r
        );

        context.arcTo(
            x,
            y,
            x + width,
            y,
            r
        );

        context.closePath();
    }

    // ========================================================
    // DRAG CONTROLS
    // ========================================================

    attachDragControls() {

        if (
            this.dragListenersAttached ||
            !this.domElement
        ) {

            return;
        }

        this.domElement.style.touchAction =
            "none";

        this.domElement.addEventListener(
            "pointerdown",
            this.onPointerDown,
            {
                passive: false
            }
        );

        this.domElement.addEventListener(
            "pointermove",
            this.onPointerMove,
            {
                passive: false
            }
        );

        this.domElement.addEventListener(
            "pointerup",
            this.onPointerUp,
            {
                passive: false
            }
        );

        this.domElement.addEventListener(
            "pointercancel",
            this.onPointerUp,
            {
                passive: false
            }
        );

        this.domElement.addEventListener(
            "lostpointercapture",
            this.onPointerUp,
            {
                passive: false
            }
        );

        this.dragListenersAttached =
            true;
    }

    // ========================================================
    // REMOVE DRAG LISTENERS
    // ========================================================

    removeDragListeners() {

        if (
            !this.domElement ||
            !this.dragListenersAttached
        ) {

            return;
        }

        this.domElement.removeEventListener(
            "pointerdown",
            this.onPointerDown
        );

        this.domElement.removeEventListener(
            "pointermove",
            this.onPointerMove
        );

        this.domElement.removeEventListener(
            "pointerup",
            this.onPointerUp
        );

        this.domElement.removeEventListener(
            "pointercancel",
            this.onPointerUp
        );

        this.domElement.removeEventListener(
            "lostpointercapture",
            this.onPointerUp
        );

        this.dragListenersAttached =
            false;
    }

    // ========================================================
    // POINTER -> NORMALIZED COORDINATES
    // ========================================================

    updatePointer(
        event
    ) {

        if (
            !this.domElement
        ) {

            return false;
        }

        const rect =
            this.domElement
                .getBoundingClientRect();

        if (
            rect.width === 0 ||
            rect.height === 0
        ) {

            return false;
        }

        this.pointer.x =
            (
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width
            ) * 2 - 1;

        this.pointer.y =
            -(
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height
            ) * 2 + 1;

        return true;
    }

    // ========================================================
    // FIND MOLECULE FROM OBJECT
    // ========================================================

    findMoleculeFromObject(
        object
    ) {

        let current =
            object;

        while (
            current
        ) {

            if (
                current.userData &&
                current.userData.molecule
            ) {

                return current.userData.molecule;
            }

            current =
                current.parent;
        }

        return null;
    }

    // ========================================================
    // GET INTERSECTED MOLECULE
    // ========================================================

    getIntersectedMolecule() {

        if (
            !this.camera ||
            !this.domElement
        ) {

            return null;
        }

        this.raycaster.setFromCamera(
            this.pointer,
            this.camera
        );

        const objects = [];

        for (
            const molecule
            of this.molecules
        ) {

            if (
                molecule.mesh
            ) {

                objects.push(
                    molecule.mesh
                );
            }
        }

        if (
            objects.length === 0
        ) {

            return null;
        }

        const intersections =
            this.raycaster.intersectObjects(
                objects,
                true
            );

        if (
            intersections.length === 0
        ) {

            return null;
        }

        return this.findMoleculeFromObject(
            intersections[0].object
        );
    }

    // ========================================================
    // POINTER DOWN
    // ========================================================

    onPointerDown(
        event
    ) {

        if (
            !this.dragEnabled ||
            !this.camera ||
            !this.domElement
        ) {

            return;
        }

        if (
            this.isPointerDown
        ) {

            return;
        }

        if (
            !this.updatePointer(
                event
            )
        ) {

            return;
        }

        const molecule =
            this.getIntersectedMolecule();

        if (
            !molecule ||
            !molecule.mesh
        ) {

            return;
        }

        this.isPointerDown =
            true;

        this.activePointerId =
            event.pointerId;

        this.draggingMolecule =
            molecule;

        this.dragStartPosition.copy(
            molecule.position
        );

        if (
            molecule.velocity
        ) {

            molecule.velocity.set(
                0,
                0,
                0
            );
        }

        // ----------------------------------------------------
        // Create plane facing camera
        // ----------------------------------------------------

        const normal =
            new THREE.Vector3();

        this.camera.getWorldDirection(
            normal
        );

        this.dragPlane.setFromNormalAndCoplanarPoint(
            normal,
            molecule.position
        );

        if (
            this.raycaster.ray.intersectPlane(
                this.dragPlane,
                this.dragPoint
            )
        ) {

            this.dragOffset.copy(
                molecule.position
            ).sub(
                this.dragPoint
            );

        } else {

            this.dragOffset.set(
                0,
                0,
                0
            );
        }

        // ----------------------------------------------------
        // Pointer capture
        // ----------------------------------------------------

        try {

            this.domElement.setPointerCapture?.(
                event.pointerId
            );

        } catch (
            error
        ) {

            // Ignore pointer capture errors.
        }

        this.domElement.style.cursor =
            "grabbing";

        // ----------------------------------------------------
        // IMPORTANT FOR TOUCHPAD / MOUSE
        // ----------------------------------------------------

        event.preventDefault();

        event.stopPropagation();
    }

    // ========================================================
    // POINTER MOVE
    // ========================================================

    onPointerMove(
        event
    ) {

        if (
            !this.camera ||
            !this.domElement
        ) {

            return;
        }

        if (
            this.isPointerDown &&
            this.activePointerId !== null &&
            event.pointerId !==
            this.activePointerId
        ) {

            return;
        }

        if (
            !this.updatePointer(
                event
            )
        ) {

            return;
        }

        // ----------------------------------------------------
        // DRAGGING
        // ----------------------------------------------------

        if (
            this.draggingMolecule
        ) {

            this.raycaster.setFromCamera(
                this.pointer,
                this.camera
            );

            const point =
                new THREE.Vector3();

            if (
                !this.raycaster.ray.intersectPlane(
                    this.dragPlane,
                    point
                )
            ) {

                return;
            }

            point.add(
                this.dragOffset
            );

            const molecule =
                this.draggingMolecule;

            molecule.position.x =
                THREE.MathUtils.clamp(
                    point.x,
                    -this.bounds.x,
                    this.bounds.x
                );

            molecule.position.y =
                THREE.MathUtils.clamp(
                    point.y,
                    -this.bounds.y,
                    this.bounds.y
                );

            molecule.position.z =
                THREE.MathUtils.clamp(
                    point.z,
                    -this.bounds.z,
                    this.bounds.z
                );

            if (
                molecule.mesh
            ) {

                molecule.mesh.position.copy(
                    molecule.position
                );
            }

            if (
                molecule.velocity
            ) {

                molecule.velocity.set(
                    0,
                    0,
                    0
                );
            }

            event.preventDefault();

            event.stopPropagation();

            return;
        }

        // ----------------------------------------------------
        // HOVER
        // ----------------------------------------------------

        if (
            this.dragEnabled
        ) {

            const molecule =
                this.getIntersectedMolecule();

            this.hoveredMolecule =
                molecule;

            if (
                molecule
            ) {

                this.domElement.style.cursor =
                    "grab";

            } else {

                this.domElement.style.cursor =
                    "";
            }
        }
    }

    // ========================================================
    // POINTER UP
    // ========================================================

    onPointerUp(
        event
    ) {

        if (
            this.activePointerId !== null &&
            event.pointerId !==
            this.activePointerId
        ) {

            return;
        }

        if (
            this.draggingMolecule
        ) {

            const molecule =
                this.draggingMolecule;

            if (
                molecule.velocity
            ) {

                molecule.velocity.set(
                    0,
                    0,
                    0
                );
            }
        }

        try {

            if (
                this.domElement &&
                event.pointerId !== undefined
            ) {

                this.domElement.releasePointerCapture?.(
                    event.pointerId
                );
            }

        } catch (
            error
        ) {

            // Ignore pointer capture errors.
        }

        this.draggingMolecule =
            null;

        this.activePointerId =
            null;

        this.isPointerDown =
            false;

        if (
            this.domElement
        ) {

            this.domElement.style.cursor =
                "";
        }

        try {

            event.preventDefault();

            event.stopPropagation();

        } catch (
            error
        ) {

            // Ignore event errors.
        }
    }

    // ========================================================
    // STOP DRAGGING
    // ========================================================

    stopDragging() {

        this.draggingMolecule =
            null;

        this.activePointerId =
            null;

        this.isPointerDown =
            false;

        if (
            this.domElement
        ) {

            this.domElement.style.cursor =
                "";
        }
    }

    // ========================================================
    // REMOVE
    // ========================================================

    remove(
        molecule
    ) {

        if (
            !molecule
        ) {

            return;
        }

        if (
            this.draggingMolecule ===
            molecule
        ) {

            this.stopDragging();
        }

        this.disposeLabels(
            molecule
        );

        if (
            molecule.mesh
        ) {

            this.renderer.disposeMolecule(
                molecule.mesh
            );
        }

        const index =
            this.molecules.indexOf(
                molecule
            );

        if (
            index !== -1
        ) {

            this.molecules.splice(
                index,
                1
            );
        }
    }

    // ========================================================
    // DISPOSE LABELS
    // ========================================================

    disposeLabels(
        molecule
    ) {

        if (
            !molecule ||
            !molecule.labels
        ) {

            return;
        }

        for (
            const label
            of molecule.labels
        ) {

            if (
                !label
            ) {

                continue;
            }

            if (
                label.material
            ) {

                const material =
                    label.material;

                if (
                    material.map
                ) {

                    material.map.dispose();
                }

                material.dispose();
            }

            if (
                label.parent
            ) {

                label.parent.remove(
                    label
                );
            }
        }

        molecule.labels.length =
            0;
    }

    // ========================================================
    // GET MOLECULES
    // ========================================================

    getMolecules() {

        return this.molecules;
    }

    // ========================================================
    // GET COUNTS
    // ========================================================

    getCounts() {

        const counts = {};

        for (
            const molecule
            of this.molecules
        ) {

            counts[
                molecule.formula
            ] =
                (
                    counts[
                        molecule.formula
                    ] || 0
                ) + 1;
        }

        return counts;
    }

    // ========================================================
    // CLEAR
    // ========================================================

    clear() {

        this.stopDragging();

        this.hoveredMolecule =
            null;

        for (
            const molecule
            of [
                ...this.molecules
            ]
        ) {

            this.disposeLabels(
                molecule
            );

            if (
                molecule.mesh
            ) {

                this.renderer.disposeMolecule(
                    molecule.mesh
                );
            }
        }

        this.molecules.length =
            0;
    }

    // ========================================================
    // DISPOSE
    // ========================================================

    dispose() {

        this.stopDragging();

        this.removeDragListeners();

        if (
            this.domElement
        ) {

            this.domElement.style.cursor =
                "";

            this.domElement.style.touchAction =
                "";
        }

        this.clear();

        if (
            this.renderer &&
            typeof this.renderer.dispose ===
            "function"
        ) {

            this.renderer.dispose();
        }

        this.camera =
            null;

        this.domElement =
            null;

        this.dragListenersAttached =
            false;
    }
}