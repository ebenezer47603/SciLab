// ============================================================
// SciLab - Biology Laboratory
// BiologySimulator.js
// ============================================================

import * as THREE from "three";

import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls.js";

import {
    AnimalCell
} from "../cell/AnimalCell.js";

import {
    PlantCell
} from "../cell/PlantCell.js";

import {
    Osmosis
} from "../osmosis/Osmosis.js";

import {
    Photosynthesis
} from "../photosynthesis/Photosynthesis.js";

import {
    EnzymeActivity
} from "../enzyme/EnzymeActivity.js";

import {
    Circulation
} from "../systems/Circulation.js";


// ============================================================
// BIOLOGY SIMULATOR
// ============================================================

export class BiologySimulator {

    constructor(container) {

        if (!container) {

            throw new Error(
                "BiologySimulator: container is required."
            );

        }


        this.container =
            container;


        // ====================================================
        // SCENE
        // ====================================================

        this.scene =
            new THREE.Scene();

        this.scene.background =
            new THREE.Color(
                0x020914
            );


        // ====================================================
        // CAMERA
        // ====================================================

        this.camera =
            new THREE.PerspectiveCamera(
                42,
                1,
                0.05,
                2000
            );

        this.camera.position.set(
            8,
            4,
            8
        );


        // ====================================================
        // RENDERER
        // ====================================================

        this.renderer =
            new THREE.WebGLRenderer({

                antialias:
                    true,

                alpha:
                    false,

                powerPreference:
                    "high-performance"

            });


        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                2
            )
        );


        this.renderer.outputColorSpace =
            THREE.SRGBColorSpace;


        this.renderer.shadowMap.enabled =
            true;


        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;


        // ----------------------------------------------------
        // CLEAN CONTAINER
        // ----------------------------------------------------

        this.container.innerHTML =
            "";


        this.container.appendChild(
            this.renderer.domElement
        );


        // ----------------------------------------------------
        // CANVAS STYLE
        // ----------------------------------------------------

        this.renderer.domElement.style.display =
            "block";

        this.renderer.domElement.style.width =
            "100%";

        this.renderer.domElement.style.height =
            "100%";

        this.renderer.domElement.style.outline =
            "none";

        this.renderer.domElement.style.touchAction =
            "none";


        // ----------------------------------------------------
        // DISABLE BROWSER CONTEXT MENU
        // ----------------------------------------------------

        this.onContextMenu =
            event => {

                event.preventDefault();

            };


        this.renderer.domElement.addEventListener(
            "contextmenu",
            this.onContextMenu
        );


        // ====================================================
        // ORBIT CONTROLS
        // ====================================================

        this.controls =
            new OrbitControls(
                this.camera,
                this.renderer.domElement
            );


        this.controls.enableDamping =
            true;


        this.controls.dampingFactor =
            0.07;


        this.controls.enablePan =
            true;


        this.controls.screenSpacePanning =
            true;


        this.controls.minDistance =
            1.2;


        this.controls.maxDistance =
            100;


        this.controls.rotateSpeed =
            0.65;


        this.controls.zoomSpeed =
            0.9;


        this.controls.panSpeed =
            0.65;


        this.controls.autoRotate =
            false;


        this.controls.autoRotateSpeed =
            0.8;


        // ====================================================
        // LIGHTING
        // ====================================================

        this.createLights();


        // ====================================================
        // STATE
        // ====================================================

        this.current =
            null;


        this.currentMode =
            "none";


        this.running =
            false;


        this.clock =
            new THREE.Clock();


        this.animationFrame =
            null;


        // ====================================================
        // RAYCASTING / INTERACTION
        // ====================================================

        this.raycaster =
            new THREE.Raycaster();


        this.pointer =
            new THREE.Vector2();


        this.selectable =
            [];


        this.pointerDownX =
            0;


        this.pointerDownY =
            0;


        // ----------------------------------------------------
        // EVENT BINDINGS
        // ----------------------------------------------------

        this.onPointerDown =
            this.onPointerDown.bind(
                this
            );


        this.onPointerUp =
            this.onPointerUp.bind(
                this
            );


        this.onResize =
            this.onResize.bind(
                this
            );


        // ----------------------------------------------------
        // POINTER EVENTS
        // ----------------------------------------------------

        this.renderer.domElement.addEventListener(
            "pointerdown",
            this.onPointerDown
        );


        this.renderer.domElement.addEventListener(
            "pointerup",
            this.onPointerUp
        );


        // ----------------------------------------------------
        // RESIZE
        // ----------------------------------------------------

        window.addEventListener(
            "resize",
            this.onResize
        );


        this.onResize();

        this.resetCamera();

    }


    // ========================================================
    // LIGHTS
    // ========================================================

    createLights() {

        // ----------------------------------------------------
        // AMBIENT
        // ----------------------------------------------------

        const ambient =
            new THREE.AmbientLight(
                0xffffff,
                1.6
            );


        this.scene.add(
            ambient
        );


        // ----------------------------------------------------
        // KEY
        // ----------------------------------------------------

        const key =
            new THREE.DirectionalLight(
                0xffffff,
                2.4
            );


        key.position.set(
            8,
            12,
            10
        );


        key.castShadow =
            true;


        key.shadow.mapSize.width =
            2048;


        key.shadow.mapSize.height =
            2048;


        this.scene.add(
            key
        );


        // ----------------------------------------------------
        // FILL
        // ----------------------------------------------------

        const fill =
            new THREE.DirectionalLight(
                0x63c8ff,
                1.8
            );


        fill.position.set(
            -8,
            6,
            -6
        );


        this.scene.add(
            fill
        );


        // ----------------------------------------------------
        // RIM
        // ----------------------------------------------------

        const rim =
            new THREE.PointLight(
                0x806cff,
                1.5,
                80
            );


        rim.position.set(
            0,
            5,
            -10
        );


        this.scene.add(
            rim
        );

    }


    // ========================================================
    // ENSURE WEBGL CANVAS
    // ========================================================

    ensureWebGLCanvas() {

        const canvas =
            this.renderer.domElement;


        if (!canvas.parentElement) {

            this.container.appendChild(
                canvas
            );

        }


        canvas.style.display =
            "block";


        canvas.style.width =
            "100%";


        canvas.style.height =
            "100%";


        canvas.style.outline =
            "none";


        canvas.style.touchAction =
            "none";

    }


    // ========================================================
    // LOAD SIMULATION
    // ========================================================

    load(
        simulation,
        mode
    ) {

        this.clear();


        try {

            if (!simulation) {

                throw new Error(
                    `Simulation "${mode}" was not created.`
                );

            }


            if (
                typeof simulation.getObject !==
                "function"
            ) {

                throw new Error(
                    `Simulation "${mode}" has no getObject() method.`
                );

            }


            const object =
                simulation.getObject();


            if (!object) {

                throw new Error(
                    `Simulation "${mode}" returned no object.`
                );

            }


            this.current =
                simulation;


            this.currentMode =
                mode;


            this.selectable =
                typeof simulation.getSelectableObjects ===
                "function"

                    ? (
                        simulation.getSelectableObjects() ||
                        []
                    )

                    : [];


            // =================================================
            // 2D LAB
            // =================================================

            if (
                simulation.renderMode ===
                "2d"
            ) {

                this.renderer.domElement.style.display =
                    "none";


                if (
                    typeof simulation.mount ===
                    "function"
                ) {

                    simulation.mount(
                        this.container
                    );

                }

            }

            // =================================================
            // 3D LAB
            // =================================================

            else {

                this.ensureWebGLCanvas();


                this.scene.add(
                    object
                );


                this.prepareObject(
                    object
                );


                this.fitObject(
                    object
                );


                this.controls.update();

            }


            // =================================================
            // SIMULATION SELECTED EVENT
            // =================================================

            window.dispatchEvent(
                new CustomEvent(
                    "biology-simulation-selected",
                    {
                        detail: {

                            mode,

                            name:
                                this.getModeTitle(
                                    mode
                                )

                        }
                    }
                )
            );


            return true;

        } catch (error) {

            console.error(
                `Biology: failed to load "${mode}".`,
                error
            );


            this.current =
                null;


            this.currentMode =
                "none";


            this.selectable =
                [];


            return false;

        }

    }


    // ========================================================
    // PREPARE OBJECT
    // ========================================================

    prepareObject(
        object
    ) {

        if (!object) {
            return;
        }


        object.traverse(
            child => {

                if (!child.isMesh) {
                    return;
                }


                child.castShadow =
                    true;


                child.receiveShadow =
                    true;

            }
        );

    }


    // ========================================================
    // ANIMAL CELL
    // ========================================================

    showAnimalCell() {

        return this.load(
            new AnimalCell(),
            "animal-cell"
        );

    }


    // ========================================================
    // PLANT CELL
    // ========================================================

    showPlantCell() {

        return this.load(
            new PlantCell(),
            "plant-cell"
        );

    }


    // ========================================================
    // OSMOSIS
    // ========================================================

    showOsmosis() {

        return this.load(
            new Osmosis(),
            "osmosis"
        );

    }


    // ========================================================
    // PHOTOSYNTHESIS
    // ========================================================

    showPhotosynthesis() {

        return this.load(
            new Photosynthesis(),
            "photosynthesis"
        );

    }


    // ========================================================
    // ENZYME
    // ========================================================

    showEnzymeActivity() {

        return this.load(
            new EnzymeActivity(),
            "enzyme"
        );

    }


    // ========================================================
    // CIRCULATION
    // ========================================================

    showCirculation() {

        return this.load(
            new Circulation(),
            "circulation"
        );

    }


    // ========================================================
    // CLEAR CURRENT SIMULATION
    // ========================================================

    clear() {

        if (!this.current) {
            return;
        }


        const simulation =
            this.current;


        const object =
            simulation.getObject?.();


        // ----------------------------------------------------
        // 2D
        // ----------------------------------------------------

        if (
            simulation.renderMode ===
            "2d"
        ) {

            try {

                simulation.dispose?.();

            } catch (error) {

                console.warn(
                    "Biology 2D dispose error:",
                    error
                );

            }


            this.renderer.domElement.style.display =
                "block";

        }


        // ----------------------------------------------------
        // REMOVE 3D OBJECT
        // ----------------------------------------------------

        if (object) {

            this.scene.remove(
                object
            );

        }


        // ----------------------------------------------------
        // DISPOSE 3D SIMULATION
        // ----------------------------------------------------

        if (
            simulation.renderMode !==
            "2d"
        ) {

            try {

                simulation.dispose?.();

            } catch (error) {

                console.warn(
                    "Biology dispose error:",
                    error
                );

            }

        }


        this.current =
            null;


        this.currentMode =
            "none";


        this.selectable =
            [];

    }


    // ========================================================
    // FIT OBJECT TO CAMERA
    // ========================================================

    fitObject(
        object
    ) {

        if (!object) {
            return;
        }


        object.updateMatrixWorld(
            true
        );


        const box =
            new THREE.Box3().setFromObject(
                object
            );


        if (box.isEmpty()) {
            return;
        }


        const center =
            new THREE.Vector3();


        const size =
            new THREE.Vector3();


        box.getCenter(
            center
        );


        box.getSize(
            size
        );


        const maxDimension =
            Math.max(
                size.x,
                size.y,
                size.z,
                1
            );


        const distance =
            Math.max(
                maxDimension * 1.8,
                5
            );


        this.camera.position.set(

            center.x +
            distance *
            0.95,

            center.y +
            distance *
            0.38,

            center.z +
            distance *
            0.95

        );


        this.controls.target.copy(
            center
        );


        this.camera.lookAt(
            center
        );


        this.controls.update();

    }


    // ========================================================
    // RESET CAMERA
    // ========================================================

    resetCamera() {

        if (this.current) {

            const object =
                this.current.getObject?.();


            if (object) {

                this.fitObject(
                    object
                );


                return;

            }

        }


        this.camera.position.set(
            8,
            4,
            8
        );


        this.controls.target.set(
            0,
            0,
            0
        );


        this.camera.lookAt(
            0,
            0,
            0
        );


        this.controls.update();

    }


    // ========================================================
    // AUTO ROTATE
    // ========================================================

    setAutoRotate(
        enabled
    ) {

        this.controls.autoRotate =
            Boolean(
                enabled
            );


        this.controls.autoRotateSpeed =
            0.8;

    }


    // ========================================================
    // POINTER DOWN
    // ========================================================

    onPointerDown(
        event
    ) {

        this.pointerDownX =
            event.clientX;


        this.pointerDownY =
            event.clientY;

    }


    // ========================================================
    // POINTER UP
    // ========================================================

    onPointerUp(
        event
    ) {

        // ----------------------------------------------------
        // ONLY LEFT CLICK SELECTS
        // ----------------------------------------------------

        if (
            event.button !==
            0
        ) {

            return;

        }


        const distance =
            Math.hypot(

                event.clientX -
                this.pointerDownX,

                event.clientY -
                this.pointerDownY

            );


        // ----------------------------------------------------
        // MOVEMENT = CAMERA ACTION
        // ----------------------------------------------------

        if (
            distance >
            7
        ) {

            return;

        }


        this.selectAt(
            event
        );

    }


    // ========================================================
    // SELECT STRUCTURE
    // ========================================================

    selectAt(
        event
    ) {

        if (
            !this.selectable.length
        ) {

            return;

        }


        // ----------------------------------------------------
        // WEBGL RECT
        // ----------------------------------------------------

        const rect =
            this.renderer
                .domElement
                .getBoundingClientRect();


        if (
            rect.width <= 0 ||
            rect.height <= 0
        ) {

            return;

        }


        // ----------------------------------------------------
        // NORMALIZED POINTER
        // ----------------------------------------------------

        this.pointer.x =
            (
                (
                    event.clientX -
                    rect.left
                ) /
                rect.width
            ) *
            2 -
            1;


        this.pointer.y =
            -(
                (
                    event.clientY -
                    rect.top
                ) /
                rect.height
            ) *
            2 +
            1;


        // ----------------------------------------------------
        // RAYCAST
        // ----------------------------------------------------

        this.raycaster.setFromCamera(
            this.pointer,
            this.camera
        );


        const hits =
            this.raycaster.intersectObjects(
                this.selectable,
                true
            );


        if (!hits.length) {
            return;
        }


        // ====================================================
        // FIND BEST SELECTION
        // ====================================================

        let selected =
            null;


        // ----------------------------------------------------
        // FIRST PASS:
        // PREFER INNER ORGANELLES
        // ----------------------------------------------------

        for (
            const hit
            of hits
        ) {

            let object =
                hit.object;


            while (
                object &&
                object.parent &&
                !object.userData?.name
            ) {

                object =
                    object.parent;

            }


            if (!object) {
                continue;
            }


            const data =
                object.userData ||
                {};

                // ========================================================
// PHOTOSYNTHESIS FOCUS
// ========================================================

if (
    this.currentMode === "photosynthesis" &&
    this.current &&
    typeof this.current.focusLeaf === "function"
) {

    const type =
        String(
            data.type ||
            ""
        ).toLowerCase();


    if (
        type === "leaf" ||
        type === "focus-leaf" ||
        type === "chloroplast"
    ) {

        const focus =
            this.current.focusLeaf();


        if (
            focus &&
            focus.position
        ) {

            this.controls.target.copy(
                focus.position
            );


            const box =
                new THREE.Box3()
                    .setFromObject(
                        focus.target ||
                        selected
                    );


            const center =
                new THREE.Vector3();


            const size =
                new THREE.Vector3();


            box.getCenter(
                center
            );


            box.getSize(
                size
            );


            const maxDimension =
                Math.max(
                    size.x,
                    size.y,
                    size.z,
                    0.5
                );


            const distance =
                Math.max(
                    maxDimension * 4.5,
                    2.8
                );


            this.camera.position.set(

                center.x +
                distance * 0.9,

                center.y +
                distance * 0.35,

                center.z +
                distance * 0.9

            );


            this.controls.target.copy(
                center
            );


            this.camera.lookAt(
                center
            );


            this.controls.update();

        }

    }

}


            const name =
                String(
                    data.name ||
                    object.name ||
                    ""
                )
                    .trim()
                    .toLowerCase();


            // ------------------------------------------------
            // OUTER STRUCTURES
            // ------------------------------------------------

            const isOuterStructure =

                name ===
                "cell wall"

                ||

                name ===
                "cell membrane"

                ||

                name ===
                "cytoplasm";


            // ------------------------------------------------
            // PREFER ORGANELLES
            // ------------------------------------------------

            if (
                !isOuterStructure
            ) {

                selected =
                    object;

                break;

            }

        }


        // ====================================================
        // SECOND PASS
        // ====================================================

        // If no inner organelle was found,
        // allow cell wall / membrane / cytoplasm.

        if (!selected) {

            for (
                const hit
                of hits
            ) {

                let object =
                    hit.object;


                while (
                    object &&
                    object.parent &&
                    !object.userData?.name
                ) {

                    object =
                        object.parent;

                }


                if (!object) {
                    continue;
                }


                selected =
                    object;

                break;

            }

        }


        if (!selected) {
            return;
        }


        // ====================================================
        // SELECTED DATA
        // ====================================================

        const data =
            selected.userData ||
            {};


        // ====================================================
        // DISPATCH EVENT
        // ====================================================

        window.dispatchEvent(
            new CustomEvent(
                "biology-structure-selected",
                {

                    detail: {

                        name:
                            data.name ||
                            selected.name ||
                            "Unknown",

                        nameRw:
                            data.nameRw ||
                            data.name ||
                            selected.name ||
                            "Unknown",

                        description:
                            data.description ||
                            "",

                        descriptionRw:
                            data.descriptionRw ||
                            data.description ||
                            "",

                        teacher:
                            data.teacher ||
                            data.description ||
                            "",

                        type:
                            data.type ||
                            this.currentMode

                    }

                }
            )
        );

    }


    // ========================================================
    // UPDATE
    // ========================================================

    update(
        delta
    ) {

        if (
            this.current &&
            typeof this.current.update ===
            "function"
        ) {

            this.current.update(
                delta
            );

        }


        this.controls.update();

    }


    // ========================================================
    // START
    // ========================================================

    start() {

        if (
            this.running
        ) {

            return;

        }


        this.running =
            true;


        this.clock.start();


        this.animate();

    }


    // ========================================================
    // ANIMATE
    // ========================================================

    animate() {

        if (
            !this.running
        ) {

            return;

        }


        this.animationFrame =
            requestAnimationFrame(
                () =>
                    this.animate()
            );


        const delta =
            this.clock.getDelta();


        this.update(
            delta
        );


        this.renderer.render(
            this.scene,
            this.camera
        );

    }


    // ========================================================
    // RESIZE
    // ========================================================

    resize() {

        const width =
            Math.max(
                this.container.clientWidth ||
                1,
                1
            );


        const height =
            Math.max(
                this.container.clientHeight ||
                1,
                1
            );


        this.camera.aspect =
            width /
            height;


        this.camera.updateProjectionMatrix();


        this.renderer.setSize(
            width,
            height,
            false
        );


        if (
            this.current &&
            typeof this.current.resize ===
            "function"
        ) {

            this.current.resize();

        }

    }


    // ========================================================
    // WINDOW RESIZE
    // ========================================================

    onResize() {

        this.resize();

    }


    // ========================================================
    // STOP
    // ========================================================

    stop() {

        this.running =
            false;


        if (
            this.animationFrame
        ) {

            cancelAnimationFrame(
                this.animationFrame
            );


            this.animationFrame =
                null;

        }

    }


    // ========================================================
    // DISPOSE
    // ========================================================

    dispose() {

        this.stop();


        this.clear();


        // ----------------------------------------------------
        // POINTER EVENTS
        // ----------------------------------------------------

        this.renderer
            .domElement
            .removeEventListener(
                "pointerdown",
                this.onPointerDown
            );


        this.renderer
            .domElement
            .removeEventListener(
                "pointerup",
                this.onPointerUp
            );


        this.renderer
            .domElement
            .removeEventListener(
                "contextmenu",
                this.onContextMenu
            );


        // ----------------------------------------------------
        // WINDOW EVENTS
        // ----------------------------------------------------

        window.removeEventListener(
            "resize",
            this.onResize
        );


        // ----------------------------------------------------
        // CONTROLS
        // ----------------------------------------------------

        this.controls.dispose();


        // ----------------------------------------------------
        // RENDERER
        // ----------------------------------------------------

        this.renderer.dispose();


        // ----------------------------------------------------
        // SCENE
        // ----------------------------------------------------

        this.scene.clear();


        // ----------------------------------------------------
        // STATE
        // ----------------------------------------------------

        this.selectable =
            [];


        this.current =
            null;


        this.currentMode =
            "none";


        this.animationFrame =
            null;

    }


    // ========================================================
    // GET SCENE
    // ========================================================

    getScene() {

        return this.scene;

    }


    // ========================================================
    // GET CAMERA
    // ========================================================

    getCamera() {

        return this.camera;

    }


    // ========================================================
    // GET RENDERER
    // ========================================================

    getRenderer() {

        return this.renderer;

    }


    // ========================================================
    // GET CURRENT OBJECT
    // ========================================================

    getObject() {

        return (
            this.current?.getObject?.() ||
            null
        );

    }


    // ========================================================
    // GET CURRENT MODE
    // ========================================================

    getCurrentMode() {

        return this.currentMode;

    }


    // ========================================================
    // GET CURRENT SIMULATION
    // ========================================================

    getCurrentSimulation() {

        return this.current;

    }


    // ========================================================
    // GET MODE TITLE
    // ========================================================

    getModeTitle(
        mode
    ) {

        switch (
            mode
        ) {

            case "animal-cell":

                return "Animal Cell";


            case "plant-cell":

                return "Plant Cell";


            case "circulation":

                return "Heart & Blood Circulation";


            case "osmosis":

                return "Osmosis & Cell Membrane";


            case "photosynthesis":

                return "Photosynthesis Laboratory";


            case "enzyme":

                return "Enzyme Activity Laboratory";


            default:

                return "Biology Simulation";

        }

    }

}