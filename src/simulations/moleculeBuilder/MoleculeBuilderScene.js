import * as THREE from "three";
import { molecules } from "./MoleculeData.js";

// ============================================================
// SciLab 3D Molecule Builder
// MoleculeBuilderScene.js
// ============================================================

let scene = null;
let moleculeGroup = null;

let isPlaying = true;
let animationTime = 0;
let currentMoleculeIndex = 0;

// ============================================================
// MATERIALS
// ============================================================

const atomMaterials = {

    H: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.35,
        metalness: 0.05
    }),

    C: new THREE.MeshStandardMaterial({
        color: 0x303030,
        roughness: 0.3,
        metalness: 0.1
    }),

    O: new THREE.MeshStandardMaterial({
        color: 0xff2222,
        roughness: 0.3,
        metalness: 0.05
    }),

    N: new THREE.MeshStandardMaterial({
        color: 0x2266ff,
        roughness: 0.3,
        metalness: 0.05
    }),

    F: new THREE.MeshStandardMaterial({
        color: 0x66ff66,
        roughness: 0.3,
        metalness: 0.05
    }),

    Cl: new THREE.MeshStandardMaterial({
        color: 0x22dd55,
        roughness: 0.3,
        metalness: 0.05
    }),

    S: new THREE.MeshStandardMaterial({
        color: 0xffcc22,
        roughness: 0.3,
        metalness: 0.05
    }),

    P: new THREE.MeshStandardMaterial({
        color: 0xff8800,
        roughness: 0.3,
        metalness: 0.05
    }),

    B: new THREE.MeshStandardMaterial({
        color: 0xffaa22,
        roughness: 0.3,
        metalness: 0.05
    }),

    Be: new THREE.MeshStandardMaterial({
        color: 0x88ddaa,
        roughness: 0.3,
        metalness: 0.05
    })
};

// ============================================================
// ATOM SIZES
// ============================================================

const atomSizes = {

    H: 0.28,
    C: 0.42,
    O: 0.40,
    N: 0.40,
    F: 0.38,
    Cl: 0.48,
    S: 0.46,
    P: 0.45,
    B: 0.40,
    Be: 0.38

};

// ============================================================
// LONE PAIR MATERIAL
// ============================================================

const lonePairMaterial =
    new THREE.MeshStandardMaterial({

        color: 0x00ffff,

        emissive: 0x00ffff,

        emissiveIntensity: 2,

        roughness: 0.2,

        metalness: 0.1

    });

// ============================================================
// BOND MATERIAL
// ============================================================

const bondMaterial =
    new THREE.MeshStandardMaterial({

        color: 0xb8c2cc,

        roughness: 0.4,

        metalness: 0.2

    });

// ============================================================
// CREATE SCENE
// ============================================================

export function createMoleculeBuilderScene(container) {

    scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(
            0x07111f
        );

    // ========================================================
    // CAMERA
    // ========================================================

    const width =
        Math.max(
            container.clientWidth,
            1
        );

    const height =
        Math.max(
            container.clientHeight,
            1
        );

    const camera =
        new THREE.PerspectiveCamera(
            45,
            width / height,
            0.1,
            100
        );

    camera.position.set(
        0,
        0,
        8
    );

    // ========================================================
    // RENDERER
    // ========================================================

    const renderer =
        new THREE.WebGLRenderer({

            antialias: true

        });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    renderer.setSize(
        width,
        height
    );

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;

    container.innerHTML = "";

    container.appendChild(
        renderer.domElement
    );

    // ========================================================
    // LIGHTS
    // ========================================================

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            2
        );

    scene.add(
        ambientLight
    );

    const keyLight =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );

    keyLight.position.set(
        4,
        6,
        8
    );

    scene.add(
        keyLight
    );

    const fillLight =
        new THREE.DirectionalLight(
            0x66ccff,
            1.5
        );

    fillLight.position.set(
        -5,
        2,
        4
    );

    scene.add(
        fillLight
    );

    // ========================================================
    // MOUSE ROTATION
    // ========================================================

    let dragging = false;

    let previousX = 0;

    let previousY = 0;

    renderer.domElement.addEventListener(
        "pointerdown",
        event => {

            dragging = true;

            previousX =
                event.clientX;

            previousY =
                event.clientY;

            renderer.domElement.setPointerCapture(
                event.pointerId
            );

        }
    );

    renderer.domElement.addEventListener(
        "pointermove",
        event => {

            if (
                !dragging ||
                !moleculeGroup
            ) {

                return;

            }

            const dx =
                event.clientX -
                previousX;

            const dy =
                event.clientY -
                previousY;

            moleculeGroup.rotation.y +=
                dx * 0.01;

            moleculeGroup.rotation.x +=
                dy * 0.01;

            previousX =
                event.clientX;

            previousY =
                event.clientY;

        }
    );

    renderer.domElement.addEventListener(
        "pointerup",
        event => {

            dragging = false;

            try {

                renderer.domElement.releasePointerCapture(
                    event.pointerId
                );

            } catch {

                // Ignore

            }

        }
    );

    renderer.domElement.addEventListener(
        "pointerleave",
        () => {

            dragging = false;

        }
    );

    // ========================================================
    // ZOOM
    // ========================================================

    renderer.domElement.addEventListener(
        "wheel",
        event => {

            event.preventDefault();

            camera.position.z +=
                event.deltaY * 0.005;

            camera.position.z =
                THREE.MathUtils.clamp(
                    camera.position.z,
                    3,
                    20
                );

        },
        {
            passive: false
        }
    );

    // ========================================================
    // RESIZE
    // ========================================================

    function resize() {

        const newWidth =
            Math.max(
                container.clientWidth,
                1
            );

        const newHeight =
            Math.max(
                container.clientHeight,
                1
            );

        camera.aspect =
            newWidth /
            newHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            newWidth,
            newHeight
        );

    }

    window.addEventListener(
        "resize",
        resize
    );

    // ========================================================
    // ANIMATION LOOP
    // ========================================================

    function renderLoop() {

        requestAnimationFrame(
            renderLoop
        );

        if (isPlaying) {

            animationTime +=
                0.01;

            updateMolecule();

        }

        renderer.render(
            scene,
            camera
        );

    }

    renderLoop();

    // ========================================================
    // CONTROLLER
    // ========================================================

    return {

        scene,

        camera,

        renderer,

        // ====================================================
        // BUILD MOLECULE
        // ====================================================

        buildMolecule(molecule) {

            const index =
                molecules.indexOf(
                    molecule
                );

            if (index >= 0) {

                currentMoleculeIndex =
                    index;

                createMolecule(
                    scene,
                    index
                );

            }

        },

        // ====================================================
        // BUILD BY INDEX
        // ====================================================

        buildMoleculeByIndex(index) {

            const numericIndex =
                Number(index);

            if (
                Number.isInteger(
                    numericIndex
                ) &&
                molecules[numericIndex]
            ) {

                currentMoleculeIndex =
                    numericIndex;

                createMolecule(
                    scene,
                    numericIndex
                );

            }

        },

        // ====================================================
        // PLAY
        // ====================================================

        play() {

            isPlaying = true;

        },

        playMolecule() {

            isPlaying = true;

        },

        // ====================================================
        // PAUSE
        // ====================================================

        pause() {

            isPlaying = false;

        },

        pauseMolecule() {

            isPlaying = false;

        },

        // ====================================================
        // RESET
        // ====================================================

        reset() {

            resetMolecule();

        },

        resetMolecule() {

            resetMolecule();

        },

        // ====================================================
        // CURRENT MOLECULE
        // ====================================================

        getCurrentMolecule() {

            return molecules[
                currentMoleculeIndex
            ];

        },

        // ====================================================
        // DESTROY
        // ====================================================

        destroy() {

            window.removeEventListener(
                "resize",
                resize
            );

            if (moleculeGroup) {

                scene.remove(
                    moleculeGroup
                );

                disposeGroup(
                    moleculeGroup
                );

                moleculeGroup =
                    null;

            }

            renderer.dispose();

        }

    };

}

// ============================================================
// CREATE MOLECULE
// ============================================================

export function createMolecule(
    targetScene,
    moleculeIndex
) {

    scene =
        targetScene;

    const molecule =
        molecules[
            moleculeIndex
        ];

    if (!molecule) {

        console.error(
            "Molecule not found:",
            moleculeIndex
        );

        return;

    }

    currentMoleculeIndex =
        moleculeIndex;

    // ========================================================
    // REMOVE OLD MOLECULE
    // ========================================================

    if (moleculeGroup) {

        scene.remove(
            moleculeGroup
        );

        disposeGroup(
            moleculeGroup
        );

    }

    // ========================================================
    // NEW GROUP
    // ========================================================

    moleculeGroup =
        new THREE.Group();

    moleculeGroup.name =
        `Molecule_${
            molecule.id ||
            moleculeIndex
        }`;

    scene.add(
        moleculeGroup
    );

    // ========================================================
    // CALCULATE CENTER
    // ========================================================

    const center =
        new THREE.Vector3();

    if (
        Array.isArray(
            molecule.atoms
        ) &&
        molecule.atoms.length > 0
    ) {

        molecule.atoms.forEach(
            atom => {

                center.x +=
                    Number(atom.x) || 0;

                center.y +=
                    Number(atom.y) || 0;

                center.z +=
                    Number(atom.z) || 0;

            }
        );

        center.divideScalar(
            molecule.atoms.length
        );

    }

    // ========================================================
    // CREATE ATOMS
    // ========================================================

    if (
        Array.isArray(
            molecule.atoms
        )
    ) {

        molecule.atoms.forEach(
            (
                atom,
                index
            ) => {

                createAtom(
                    moleculeGroup,
                    atom,
                    index,
                    center
                );

            }
        );

    }

    // ========================================================
    // CREATE BONDS
    // ========================================================

    if (
        Array.isArray(
            molecule.bonds
        )
    ) {

        molecule.bonds.forEach(
            bond => {

                createBond(
                    moleculeGroup,
                    molecule,
                    bond,
                    center
                );

            }
        );

    }

    // ========================================================
    // CREATE LONE PAIRS
    // ========================================================

    createAllLonePairs(
        moleculeGroup,
        molecule,
        center
    );

    // ========================================================
    // CENTER
    // ========================================================

    moleculeGroup.position.set(
        0,
        0,
        0
    );

    moleculeGroup.rotation.set(
        0,
        0,
        0
    );

    moleculeGroup.scale.set(
        1,
        1,
        1
    );

    // ========================================================
    // FIT TO SCREEN
    // ========================================================

    fitMoleculeToView(
        moleculeGroup
    );

    animationTime = 0;

}

// ============================================================
// FIT MOLECULE
// ============================================================

function fitMoleculeToView(
    group
) {

    const box =
        new THREE.Box3()
            .setFromObject(
                group
            );

    const size =
        new THREE.Vector3();

    const center =
        new THREE.Vector3();

    box.getSize(
        size
    );

    box.getCenter(
        center
    );

    group.position.sub(
        center
    );

    const maxSize =
        Math.max(
            size.x,
            size.y,
            size.z
        );

    if (
        maxSize > 4.5
    ) {

        const scale =
            4.2 /
            maxSize;

        group.scale.setScalar(
            scale
        );

    }

}

// ============================================================
// CREATE ATOM
// ============================================================

function createAtom(
    group,
    atom,
    index,
    center
) {

    const element =
        atom.element;

    const radius =
        atomSizes[element] ||
        0.4;

    const material =
        atomMaterials[element] ||
        new THREE.MeshStandardMaterial({
            color: 0xaaaaaa
        });

    const geometry =
        new THREE.SphereGeometry(
            radius,
            32,
            32
        );

    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );

    mesh.position.set(

        (Number(atom.x) || 0) -
            center.x,

        (Number(atom.y) || 0) -
            center.y,

        (Number(atom.z) || 0) -
            center.z

    );

    mesh.userData.element =
        element;

    mesh.userData.atomIndex =
        index;

    group.add(
        mesh
    );

    // ========================================================
    // ELEMENT LABEL
    // ========================================================

    const label =
        createTextSprite(
            element
        );

    label.position.set(
        0,
        radius + 0.12,
        0
    );

    mesh.add(
        label
    );

}

// ============================================================
// CREATE BOND
// ============================================================

function createBond(
    group,
    molecule,
    bond,
    center
) {

    const atomA =
        molecule.atoms[
            bond.from
        ];

    const atomB =
        molecule.atoms[
            bond.to
        ];

    if (
        !atomA ||
        !atomB
    ) {

        return;

    }

    const start =
        new THREE.Vector3(

            (Number(atomA.x) || 0) -
                center.x,

            (Number(atomA.y) || 0) -
                center.y,

            (Number(atomA.z) || 0) -
                center.z

        );

    const end =
        new THREE.Vector3(

            (Number(atomB.x) || 0) -
                center.x,

            (Number(atomB.y) || 0) -
                center.y,

            (Number(atomB.z) || 0) -
                center.z

        );

    const bondGroup =
        new THREE.Group();

    bondGroup.userData.bondFrom =
        bond.from;

    bondGroup.userData.bondTo =
        bond.to;

    bondGroup.userData.bondType =
        bond.type;

    // ========================================================
    // SINGLE
    // ========================================================

    if (
        Number(bond.type) === 1
    ) {

        addBondCylinder(
            bondGroup,
            start,
            end,
            0.09
        );

    }

    // ========================================================
    // DOUBLE
    // ========================================================

    else if (
        Number(bond.type) === 2
    ) {

        addParallelBond(
            bondGroup,
            start,
            end,
            0.08
        );

        addParallelBond(
            bondGroup,
            start,
            end,
            -0.08
        );

    }

    // ========================================================
    // TRIPLE
    // ========================================================

    else if (
        Number(bond.type) === 3
    ) {

        addParallelBond(
            bondGroup,
            start,
            end,
            0.12
        );

        addParallelBond(
            bondGroup,
            start,
            end,
            0
        );

        addParallelBond(
            bondGroup,
            start,
            end,
            -0.12
        );

    }

    group.add(
        bondGroup
    );

}

// ============================================================
// BOND CYLINDER
// ============================================================

function addBondCylinder(
    group,
    start,
    end,
    radius
) {

    const direction =
        new THREE.Vector3()
            .subVectors(
                end,
                start
            );

    const length =
        direction.length();

    if (
        length <= 0
    ) {

        return;

    }

    const geometry =
        new THREE.CylinderGeometry(
            radius,
            radius,
            length,
            16
        );

    const cylinder =
        new THREE.Mesh(
            geometry,
            bondMaterial
        );

    cylinder.position
        .copy(start)
        .add(end)
        .multiplyScalar(
            0.5
        );

    cylinder.quaternion
        .setFromUnitVectors(

            new THREE.Vector3(
                0,
                1,
                0
            ),

            direction.normalize()

        );

    group.add(
        cylinder
    );

}

// ============================================================
// PARALLEL BOND
// ============================================================

function addParallelBond(
    group,
    start,
    end,
    offset
) {

    const direction =
        new THREE.Vector3()
            .subVectors(
                end,
                start
            )
            .normalize();

    let helper =
        new THREE.Vector3(
            0,
            1,
            0
        );

    if (
        Math.abs(
            direction.dot(
                helper
            )
        ) > 0.9
    ) {

        helper.set(
            1,
            0,
            0
        );

    }

    const side =
        new THREE.Vector3()
            .crossVectors(
                direction,
                helper
            )
            .normalize();

    const shiftedStart =
        start.clone()
            .add(
                side.clone()
                    .multiplyScalar(
                        offset
                    )
            );

    const shiftedEnd =
        end.clone()
            .add(
                side.clone()
                    .multiplyScalar(
                        offset
                    )
            );

    addBondCylinder(
        group,
        shiftedStart,
        shiftedEnd,
        0.065
    );

}

// ============================================================
// CREATE ALL LONE PAIRS
// ============================================================

function createAllLonePairs(
    group,
    molecule,
    center
) {

    if (
        !Array.isArray(
            molecule.lonePairs
        )
    ) {

        return;

    }

    molecule.lonePairs.forEach(
        lonePairData => {

            const atomIndex =
                Number(
                    lonePairData.atom
                );

            const pairCount =
                Number(
                    lonePairData.pairs
                ) || 0;

            if (
                pairCount <= 0
            ) {

                return;

            }

            const atom =
                molecule.atoms[
                    atomIndex
                ];

            if (!atom) {

                return;

            }

            createLonePairsForAtom(
                group,
                atom,
                atomIndex,
                pairCount,
                molecule,
                center
            );

        }
    );

}

// ============================================================
// VSEPR LONE PAIRS
// ============================================================

function createLonePairsForAtom(
    group,
    atom,
    atomIndex,
    pairCount,
    molecule,
    center
) {

    const atomPosition =
        new THREE.Vector3(

            (Number(atom.x) || 0) -
                center.x,

            (Number(atom.y) || 0) -
                center.y,

            (Number(atom.z) || 0) -
                center.z

        );

    const loneGroup =
        new THREE.Group();

    loneGroup.name =
        `LonePairs_Atom_${atomIndex}`;

    loneGroup.userData.atomIndex =
        atomIndex;

    // ========================================================
    // FIND BONDED DIRECTIONS
    // ========================================================

    const bondedDirections = [];

    if (
        Array.isArray(
            molecule.bonds
        )
    ) {

        molecule.bonds.forEach(
            bond => {

                let other = null;

                if (
                    Number(bond.from) ===
                    atomIndex
                ) {

                    other =
                        molecule.atoms[
                            bond.to
                        ];

                }

                else if (
                    Number(bond.to) ===
                    atomIndex
                ) {

                    other =
                        molecule.atoms[
                            bond.from
                        ];

                }

                if (!other) {

                    return;

                }

                const direction =
                    new THREE.Vector3(

                        (Number(other.x) || 0) -
                            (Number(atom.x) || 0),

                        (Number(other.y) || 0) -
                            (Number(atom.y) || 0),

                        (Number(other.z) || 0) -
                            (Number(atom.z) || 0)

                    );

                if (
                    direction.lengthSq() >
                    0.0001
                ) {

                    bondedDirections.push(
                        direction.normalize()
                    );

                }

            }
        );

    }

    // ========================================================
    // AWAY VECTOR
    // ========================================================

    const away =
        new THREE.Vector3();

    if (
        bondedDirections.length === 0
    ) {

        away.set(
            0,
            0,
            1
        );

    }

    else {

        bondedDirections.forEach(
            direction => {

                away.sub(
                    direction
                );

            }
        );

        if (
            away.lengthSq() <
            0.0001
        ) {

            away.set(
                0,
                0,
                1
            );

        }

        else {

            away.normalize();

        }

    }

    // ========================================================
    // CREATE PERPENDICULAR AXES
    // ========================================================

    let sideA =
        new THREE.Vector3(
            1,
            0,
            0
        );

    if (
        Math.abs(
            away.dot(sideA)
        ) > 0.85
    ) {

        sideA.set(
            0,
            1,
            0
        );

    }

    sideA.sub(
        away.clone()
            .multiplyScalar(
                away.dot(sideA)
            )
    );

    sideA.normalize();

    const sideB =
        new THREE.Vector3()
            .crossVectors(
                away,
                sideA
            )
            .normalize();

    // ========================================================
    // VSEPR DIRECTIONS
    // ========================================================

    const directions = [];

    // --------------------------------------------------------
    // ONE LONE PAIR
    // --------------------------------------------------------

    if (
        pairCount === 1
    ) {

        directions.push(
            away.clone()
        );

    }

    // --------------------------------------------------------
    // TWO LONE PAIRS
    // --------------------------------------------------------

    else if (
        pairCount === 2
    ) {

        /*
         * Two separate lone-pair directions.
         *
         * This is especially useful for H2O:
         *
         *          LP
         *           \
         *            O
         *           /
         *          LP
         *
         * The two pairs are NOT placed in the
         * same location.
         */

        const angle =
            THREE.MathUtils.degToRad(
                55
            );

        const left =
            away.clone()
                .multiplyScalar(
                    Math.cos(angle)
                )
                .add(
                    sideA.clone()
                        .multiplyScalar(
                            Math.sin(angle)
                        )
                )
                .normalize();

        const right =
            away.clone()
                .multiplyScalar(
                    Math.cos(angle)
                )
                .add(
                    sideA.clone()
                        .multiplyScalar(
                            -Math.sin(angle)
                        )
                )
                .normalize();

        directions.push(
            left,
            right
        );

    }

    // --------------------------------------------------------
    // THREE LONE PAIRS
    // --------------------------------------------------------

    else if (
        pairCount === 3
    ) {

        for (
            let i = 0;
            i < 3;
            i++
        ) {

            const angle =
                (
                    i /
                    3
                ) *
                Math.PI *
                2;

            const direction =
                away.clone()
                    .multiplyScalar(
                        0.65
                    )
                    .add(
                        sideA.clone()
                            .multiplyScalar(
                                Math.cos(angle) *
                                0.75
                            )
                    )
                    .add(
                        sideB.clone()
                            .multiplyScalar(
                                Math.sin(angle) *
                                0.75
                            )
                    )
                    .normalize();

            directions.push(
                direction
            );

        }

    }

    // --------------------------------------------------------
    // FOUR OR MORE
    // --------------------------------------------------------

    else {

        for (
            let i = 0;
            i < pairCount;
            i++
        ) {

            const angle =
                (
                    i /
                    pairCount
                ) *
                Math.PI *
                2;

            const direction =
                away.clone()
                    .multiplyScalar(
                        0.6
                    )
                    .add(
                        sideA.clone()
                            .multiplyScalar(
                                Math.cos(angle) *
                                0.8
                            )
                    )
                    .add(
                        sideB.clone()
                            .multiplyScalar(
                                Math.sin(angle) *
                                0.8
                            )
                    )
                    .normalize();

            directions.push(
                direction
            );

        }

    }

    // ========================================================
    // CREATE ELECTRONS
    // ========================================================

    const distance =
        0.72;

    directions.forEach(
        (
            direction,
            pairIndex
        ) => {

            const pairCenter =
                atomPosition.clone()
                    .add(
                        direction.clone()
                            .multiplyScalar(
                                distance
                            )
                    );

            // =================================================
            // ELECTRON PAIR BASIS
            // =================================================

            let electronSide =
                new THREE.Vector3()
                    .crossVectors(
                        direction,
                        sideB
                    );

            if (
                electronSide.lengthSq() <
                0.0001
            ) {

                electronSide =
                    sideA.clone();

            }

            electronSide.normalize();

            // =================================================
            // TWO ELECTRONS
            // =================================================

            const electron1 =
                createElectron();

            const electron2 =
                createElectron();

            const separation =
                0.11;

            electron1.position.copy(
                pairCenter
            );

            electron2.position.copy(
                pairCenter
            );

            electron1.position.add(
                electronSide.clone()
                    .multiplyScalar(
                        separation
                    )
            );

            electron2.position.add(
                electronSide.clone()
                    .multiplyScalar(
                        -separation
                    )
            );

            // =================================================
            // ANIMATION DATA
            // =================================================

            electron1.userData.base =
                electron1.position.clone();

            electron2.userData.base =
                electron2.position.clone();

            electron1.userData.phase =
                pairIndex *
                1.5;

            electron2.userData.phase =
                pairIndex *
                1.5 +
                Math.PI;

            electron1.userData.lonePair =
                true;

            electron2.userData.lonePair =
                true;

            electron1.userData.atomIndex =
                atomIndex;

            electron2.userData.atomIndex =
                atomIndex;

            // =================================================
            // ADD
            // =================================================

            loneGroup.add(
                electron1
            );

            loneGroup.add(
                electron2
            );

        }
    );

    group.add(
        loneGroup
    );

}

// ============================================================
// ELECTRON
// ============================================================

function createElectron() {

    const geometry =
        new THREE.SphereGeometry(
            0.075,
            16,
            16
        );

    const electron =
        new THREE.Mesh(
            geometry,
            lonePairMaterial
        );

    return electron;

}

// ============================================================
// UPDATE MOLECULE
// ============================================================

export function updateMolecule() {

    if (
        !moleculeGroup ||
        !isPlaying
    ) {

        return;

    }

    // ========================================================
    // MOLECULE ROTATION
    // ========================================================

    moleculeGroup.rotation.y +=
        0.002;

    // ========================================================
    // FLOATING
    // ========================================================

    moleculeGroup.position.y =
        Math.sin(
            animationTime *
            0.7
        ) *
        0.03;

    // ========================================================
    // LONE PAIR ANIMATION
    // ========================================================

    moleculeGroup.traverse(
        object => {

            if (
                object.userData &&
                object.userData.base
            ) {

                const base =
                    object.userData.base;

                const phase =
                    object.userData.phase ||
                    0;

                const pulse =
                    Math.sin(
                        animationTime *
                        3 +
                        phase
                    ) *
                    0.018;

                object.position.copy(
                    base
                );

                const outward =
                    base.clone();

                if (
                    outward.lengthSq() >
                    0.0001
                ) {

                    outward.normalize();

                    object.position.add(
                        outward.multiplyScalar(
                            pulse
                        )
                    );

                }

            }

        }
    );

}

// ============================================================
// PLAY
// ============================================================

export function playMolecule() {

    isPlaying = true;

}

// ============================================================
// PAUSE
// ============================================================

export function pauseMolecule() {

    isPlaying = false;

}

// ============================================================
// RESET
// ============================================================

export function resetMolecule() {

    animationTime = 0;

    if (
        moleculeGroup
    ) {

        moleculeGroup.rotation.set(
            0,
            0,
            0
        );

        moleculeGroup.position.set(
            0,
            0,
            0
        );

    }

}

// ============================================================
// TEXT SPRITE
// ============================================================

function createTextSprite(
    text
) {

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width =
        256;

    canvas.height =
        128;

    const context =
        canvas.getContext(
            "2d"
        );

    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    context.font =
        "bold 70px Arial";

    context.textAlign =
        "center";

    context.textBaseline =
        "middle";

    context.fillStyle =
        "white";

    context.strokeStyle =
        "black";

    context.lineWidth =
        8;

    context.strokeText(
        text,
        canvas.width / 2,
        canvas.height / 2
    );

    context.fillText(
        text,
        canvas.width / 2,
        canvas.height / 2
    );

    const texture =
        new THREE.CanvasTexture(
            canvas
        );

    texture.needsUpdate =
        true;

    const material =
        new THREE.SpriteMaterial({

            map: texture,

            transparent: true,

            depthWrite: false

        });

    const sprite =
        new THREE.Sprite(
            material
        );

    sprite.scale.set(
        0.65,
        0.32,
        1
    );

    return sprite;

}

// ============================================================
// DISPOSE
// ============================================================

function disposeGroup(
    group
) {

    group.traverse(
        object => {

            if (
                object.geometry
            ) {

                object.geometry.dispose();

            }

            if (
                object.material
            ) {

                if (
                    Array.isArray(
                        object.material
                    )
                ) {

                    object.material.forEach(
                        material => {

                            material.dispose();

                        }
                    );

                }

                else {

                    object.material.dispose();

                }

            }

        }
    );

}