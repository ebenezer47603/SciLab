// ============================================================
// SciLab - pH Laboratory
// PHScene.js
// ============================================================

import * as THREE from "three";

export class PHScene {

    // ========================================================
    // CONSTRUCTOR
    // ========================================================

    constructor() {

        // ----------------------------------------------------
        // CORE
        // ----------------------------------------------------

        this.container = null;

        this.disposed = false;

        this.scene = new THREE.Scene();

        this.scene.background =
            new THREE.Color(0x08111f);


        // ----------------------------------------------------
        // CAMERA
        // ----------------------------------------------------

        this.camera =
            new THREE.PerspectiveCamera(
                45,
                1,
                0.1,
                100
            );

        this.camera.position.set(
            0,
            2.8,
            7
        );

        this.camera.lookAt(
            0,
            1.25,
            0
        );


        // ----------------------------------------------------
        // RENDERER
        // ----------------------------------------------------

        this.renderer =
            new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });

        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                2
            )
        );

        this.renderer.shadowMap.enabled = true;

        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;


        // ----------------------------------------------------
        // ANIMATION
        // ----------------------------------------------------

        this.elapsedTime = 0;

        this.animationFrame = null;


        // ----------------------------------------------------
        // LIQUID
        // ----------------------------------------------------

        this.liquid = null;

        this.liquidTarget = 0.78;

        this.liquidCurrent = 0.78;

        this.liquidBottom = -0.38;

        this.liquidMaxHeight = 3.05;

        this.liquidColor =
            new THREE.Color(0x8ed8ff);


        // ----------------------------------------------------
        // TEST TUBE
        // ----------------------------------------------------

        this.testTube = null;


        // ----------------------------------------------------
        // LITMUS
        // ----------------------------------------------------

        this.litmus = {

            blue: null,

            red: null

        };


        // ----------------------------------------------------
        // RESIZE
        // ----------------------------------------------------

        this.resizeObserver = null;

        this.resizeScheduled = false;


        // ----------------------------------------------------
        // BUILD
        // ----------------------------------------------------

        this.createLights();

        this.createLaboratory();

        this.createTestTube();

        this.createLitmusPapers();


        // ----------------------------------------------------
        // DEFAULT
        // ----------------------------------------------------

        this.updateLiquidColor(
            0x8ed8ff
        );

        this.setLiquidVisible(
            true
        );

        this.setLiquidLevel(
            0.78
        );
    }


    // ========================================================
    // LIGHTS
    // ========================================================

    createLights() {

        const ambient =
            new THREE.AmbientLight(
                0xffffff,
                1.6
            );

        this.scene.add(
            ambient
        );


        const key =
            new THREE.DirectionalLight(
                0xffffff,
                2.4
            );

        key.position.set(
            4,
            7,
            5
        );

        key.castShadow = true;

        this.scene.add(
            key
        );


        const fill =
            new THREE.PointLight(
                0x66aaff,
                12,
                18
            );

        fill.position.set(
            -4,
            3,
            3
        );

        this.scene.add(
            fill
        );
    }


    // ========================================================
    // LABORATORY
    // ========================================================

    createLaboratory() {

        // ----------------------------------------------------
        // FLOOR
        // ----------------------------------------------------

        const floorGeometry =
            new THREE.PlaneGeometry(
                14,
                10
            );

        const floorMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x111d2c,
                roughness: 0.75,
                metalness: 0.1
            });

        const floor =
            new THREE.Mesh(
                floorGeometry,
                floorMaterial
            );

        floor.rotation.x =
            -Math.PI / 2;

        floor.position.y =
            -0.45;

        floor.receiveShadow = true;

        this.scene.add(
            floor
        );


        // ----------------------------------------------------
        // TABLE
        // ----------------------------------------------------

        const tableGeometry =
            new THREE.BoxGeometry(
                8,
                0.35,
                5
            );

        const tableMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x243447,
                roughness: 0.35,
                metalness: 0.2
            });

        const table =
            new THREE.Mesh(
                tableGeometry,
                tableMaterial
            );

        table.position.y =
            -0.25;

        table.receiveShadow = true;

        table.castShadow = true;

        this.scene.add(
            table
        );
    }


    // ========================================================
    // TEST TUBE
    // ========================================================

    createTestTube() {

        const group =
            new THREE.Group();

        group.position.set(
            0,
            0,
            0
        );

        this.testTube =
            group;


        // ----------------------------------------------------
        // GLASS
        // ----------------------------------------------------

        const glassMaterial =
            new THREE.MeshPhysicalMaterial({

                color: 0xcdeeff,

                transparent: true,

                opacity: 0.20,

                roughness: 0.05,

                metalness: 0,

                transmission: 0.15,

                side: THREE.DoubleSide

            });


        // ----------------------------------------------------
        // GLASS BODY
        // ----------------------------------------------------

        const outerGeometry =
            new THREE.CylinderGeometry(
                1.25,
                1.25,
                3.8,
                64,
                1,
                true
            );

        const glass =
            new THREE.Mesh(
                outerGeometry,
                glassMaterial
            );

        glass.position.y =
            1.45;

        glass.castShadow = true;

        group.add(
            glass
        );


        // ----------------------------------------------------
        // BOTTOM
        // ----------------------------------------------------

        const bottomGeometry =
            new THREE.SphereGeometry(
                1.25,
                64,
                32,
                0,
                Math.PI * 2,
                0,
                Math.PI / 2
            );

        const bottom =
            new THREE.Mesh(
                bottomGeometry,
                glassMaterial
            );

        bottom.position.y =
            -0.45;

        bottom.scale.y =
            0.45;

        group.add(
            bottom
        );


        // ----------------------------------------------------
        // RIM
        // ----------------------------------------------------

        const rimGeometry =
            new THREE.TorusGeometry(
                1.25,
                0.07,
                16,
                64
            );

        const rim =
            new THREE.Mesh(
                rimGeometry,
                glassMaterial
            );

        rim.position.y =
            3.35;

        group.add(
            rim
        );


        // ----------------------------------------------------
        // LIQUID
        // ----------------------------------------------------

        this.createLiquid();


        this.scene.add(
            group
        );
    }


    // ========================================================
    // LIQUID
    // ========================================================

    createLiquid() {

        /*
         * Important:
         *
         * Cylinder geometry has height = 1.
         * We therefore use scale.y as the REAL height.
         *
         * This makes liquid level predictable.
         */

        const geometry =
            new THREE.CylinderGeometry(
                1.12,
                1.12,
                1,
                64
            );


        const material =
            new THREE.MeshPhysicalMaterial({

                color: 0x8ed8ff,

                transparent: true,

                opacity: 0.76,

                roughness: 0.08,

                metalness: 0,

                transmission: 0.03,

                side: THREE.DoubleSide

            });


        this.liquid =
            new THREE.Mesh(
                geometry,
                material
            );


        this.liquid.castShadow =
            true;


        this.liquid.receiveShadow =
            true;


        this.liquid.visible =
            true;


        /*
         * Start with small height.
         */

        this.liquid.scale.set(
            1,
            0.01,
            1
        );


        this.updateLiquidGeometry();


        this.testTube.add(
            this.liquid
        );
    }


    // ========================================================
    // UPDATE LIQUID GEOMETRY
    // ========================================================

    updateLiquidGeometry() {

        if (!this.liquid) {
            return;
        }


        const height =
            Math.max(
                0.01,
                this.liquidCurrent *
                this.liquidMaxHeight
            );


        /*
         * Cylinder has original height 1.
         */

        this.liquid.scale.y =
            height;


        /*
         * Bottom stays fixed.
         *
         * This is the important correction
         * missing in the old version.
         */

        this.liquid.position.y =
            this.liquidBottom +
            height / 2;
    }


    // ========================================================
    // LITMUS PAPERS
    // ========================================================

    createLitmusPapers() {

        this.litmus.blue =
            this.createLitmusPaper(
                0x2070ff,
                -3.0,
                "blue"
            );


        this.litmus.red =
            this.createLitmusPaper(
                0xff3030,
                3.0,
                "red"
            );


        this.scene.add(
            this.litmus.blue
        );

        this.scene.add(
            this.litmus.red
        );
    }


    // ========================================================
    // CREATE LITMUS PAPER
    // ========================================================

    createLitmusPaper(
        color,
        x,
        type
    ) {

        const group =
            new THREE.Group();


        group.userData.paperType =
            type;


        // ----------------------------------------------------
        // ORIGINAL POSITION
        // ----------------------------------------------------

        group.userData.originalPosition =
            new THREE.Vector3(
                x,
                1.05,
                0
            );


        group.position.copy(
            group.userData.originalPosition
        );


        // ----------------------------------------------------
        // PAPER
        // ----------------------------------------------------

        const geometry =
            new THREE.BoxGeometry(
                0.35,
                2.2,
                0.08
            );


        const material =
            new THREE.MeshStandardMaterial({

                color: color,

                roughness: 0.45,

                metalness: 0

            });


        const paper =
            new THREE.Mesh(
                geometry,
                material
            );


        paper.castShadow =
            true;


        paper.receiveShadow =
            true;


        group.add(
            paper
        );


        group.userData.paperMesh =
            paper;


        // ----------------------------------------------------
        // ANIMATION
        // ----------------------------------------------------

        group.userData.startPosition =
            group.position.clone();


        group.userData.targetPosition =
            group.position.clone();


        group.userData.animating =
            false;


        group.userData.animationProgress =
            0;


        group.userData.animationDuration =
            0.75;


        group.userData.inSolution =
            false;


        group.userData.animationDirection =
            "none";


        return group;
    }


    // ========================================================
    // MOUNT
    // ========================================================

    mount(container) {

        if (
            this.disposed ||
            !container
        ) {
            return;
        }


        this.container =
            container;


        container.innerHTML =
            "";


        container.appendChild(
            this.renderer.domElement
        );


        // ----------------------------------------------------
        // INITIAL RESIZE
        // ----------------------------------------------------

        requestAnimationFrame(
            () => {

                if (
                    !this.disposed
                ) {

                    this.resize();

                }

            }
        );


        // ----------------------------------------------------
        // RESIZE OBSERVER
        // ----------------------------------------------------

        if (
            typeof ResizeObserver !==
            "undefined"
        ) {

            this.resizeObserver =
                new ResizeObserver(
                    () => {

                        if (
                            this.resizeScheduled
                        ) {
                            return;
                        }


                        this.resizeScheduled =
                            true;


                        requestAnimationFrame(
                            () => {

                                this.resizeScheduled =
                                    false;


                                if (
                                    !this.disposed
                                ) {

                                    this.resize();

                                }

                            }
                        );

                    }
                );


            this.resizeObserver.observe(
                container
            );
        }
    }


    // ========================================================
    // RESIZE
    // ========================================================

    resize() {

        if (
            this.disposed ||
            !this.container
        ) {
            return;
        }


        const width =
            Math.max(
                1,
                this.container.clientWidth
            );


        const height =
            Math.max(
                1,
                this.container.clientHeight
            );


        this.camera.aspect =
            width / height;


        this.camera.updateProjectionMatrix();


        this.renderer.setSize(
            width,
            height,
            false
        );
    }


    // ========================================================
    // LIQUID LEVEL
    // ========================================================

    setLiquidLevel(level) {

        let value =
            Number(level);


        if (
            !Number.isFinite(value)
        ) {
            return;
        }


        /*
         * Accept either:
         *
         * 0.0 - 1.0
         *
         * OR
         *
         * 0 - 100
         */

        if (
            value > 1
        ) {

            value =
                value / 100;

        }


        value =
            Math.max(
                0.01,
                Math.min(
                    1,
                    value
                )
            );


        this.liquidTarget =
            value;
    }


    // ========================================================
    // LIQUID COLOR
    // ========================================================

    updateLiquidColor(color) {

        if (
            !this.liquid ||
            !this.liquid.material
        ) {
            return;
        }


        try {

            this.liquid.material.color.set(
                color
            );


            this.liquidColor.set(
                color
            );


            this.liquid.material.needsUpdate =
                true;

        } catch (error) {

            console.warn(
                "pH: Could not update liquid color:",
                error
            );

        }
    }


    // ========================================================
    // LIQUID VISIBILITY
    // ========================================================

    setLiquidVisible(visible) {

        if (!this.liquid) {
            return;
        }


        this.liquid.visible =
            Boolean(visible);
    }


    // ========================================================
    // LITMUS COLOR
    // ========================================================

    setLitmusColor(
        type,
        color
    ) {

        const paper =
            this.litmus[type];


        if (
            !paper ||
            !paper.userData.paperMesh
        ) {
            return;
        }


        const material =
            paper.userData.paperMesh.material;


        material.color.set(
            color
        );


        material.needsUpdate =
            true;
    }


    // ========================================================
    // RESET LITMUS
    // ========================================================

    resetLitmus(type) {

        const originalColor =
            type === "blue"
                ? 0x2070ff
                : 0xff3030;


        this.setLitmusColor(
            type,
            originalColor
        );


        this.returnLitmus(
            type
        );
    }


    // ========================================================
    // MOVE LITMUS TO SOLUTION
    // ========================================================

    moveLitmusToSolution(type) {

        const paper =
            this.litmus[type];


        if (!paper) {
            return;
        }


        const current =
            paper.position.clone();


        /*
         * Put the paper inside the liquid.
         *
         * Center of paper is lowered into
         * the test tube.
         */

        const target =
            new THREE.Vector3(
                0,
                0.45,
                0.30
            );


        paper.userData.startPosition =
            current;


        paper.userData.targetPosition =
            target;


        paper.userData.animationProgress =
            0;


        paper.userData.animating =
            true;


        paper.userData.inSolution =
            true;


        paper.userData.animationDirection =
            "in";


        paper.rotation.z =
            type === "blue"
                ? -0.10
                : 0.10;
    }


    // ========================================================
    // RETURN LITMUS
    // ========================================================

    returnLitmus(type) {

        const paper =
            this.litmus[type];


        if (!paper) {
            return;
        }


        const current =
            paper.position.clone();


        const target =
            paper.userData.originalPosition.clone();


        paper.userData.startPosition =
            current;


        paper.userData.targetPosition =
            target;


        paper.userData.animationProgress =
            0;


        paper.userData.animating =
            true;


        paper.userData.inSolution =
            false;


        paper.userData.animationDirection =
            "out";


        paper.rotation.z =
            0;
    }


    // ========================================================
    // IS LITMUS IN SOLUTION
    // ========================================================

    isLitmusInSolution(type) {

        const paper =
            this.litmus[type];


        if (!paper) {
            return false;
        }


        return Boolean(
            paper.userData.inSolution
        );
    }


    // ========================================================
    // UPDATE LITMUS ANIMATION
    // ========================================================

    updateLitmusAnimations(deltaTime) {

        const types = [
            "blue",
            "red"
        ];


        for (
            const type of types
        ) {

            const paper =
                this.litmus[type];


            if (
                !paper ||
                !paper.userData.animating
            ) {
                continue;
            }


            paper.userData.animationProgress +=
                deltaTime /
                paper.userData.animationDuration;


            const progress =
                Math.min(
                    1,
                    paper.userData.animationProgress
                );


            // ------------------------------------------------
            // Smoothstep
            // ------------------------------------------------

            const eased =
                progress *
                progress *
                (
                    3 -
                    2 * progress
                );


            paper.position.lerpVectors(
                paper.userData.startPosition,
                paper.userData.targetPosition,
                eased
            );


            // ------------------------------------------------
            // Finish
            // ------------------------------------------------

            if (
                progress >= 1
            ) {

                paper.userData.animating =
                    false;

            }
        }
    }


    // ========================================================
    // UPDATE
    // ========================================================

    update(deltaTime) {

        if (
            this.disposed
        ) {
            return;
        }


        const delta =
            Math.min(
                0.05,
                Math.max(
                    0,
                    Number(deltaTime) || 0
                )
            );


        this.elapsedTime +=
            delta;


        // ----------------------------------------------------
        // LIQUID LEVEL
        // ----------------------------------------------------

        if (this.liquid) {

            const difference =
                this.liquidTarget -
                this.liquidCurrent;


            this.liquidCurrent +=
                difference *
                Math.min(
                    1,
                    delta * 5
                );


            this.updateLiquidGeometry();


            // ------------------------------------------------
            // Very small liquid movement
            // ------------------------------------------------

            this.liquid.position.y +=
                Math.sin(
                    this.elapsedTime * 2
                ) *
                0.0004;
        }


        // ----------------------------------------------------
        // LITMUS
        // ----------------------------------------------------

        this.updateLitmusAnimations(
            delta
        );


        // ----------------------------------------------------
        // RENDER
        // ----------------------------------------------------

        this.renderer.render(
            this.scene,
            this.camera
        );
    }


    // ========================================================
    // RENDER
    // ========================================================

    render() {

        if (
            this.disposed
        ) {
            return;
        }


        this.renderer.render(
            this.scene,
            this.camera
        );
    }


    // ========================================================
    // GETTERS
    // ========================================================

    getScene() {

        return this.scene;
    }


    getCamera() {

        return this.camera;
    }


    getRenderer() {

        return this.renderer;
    }


    getLiquid() {

        return this.liquid;
    }


    getLitmus(type) {

        return this.litmus[type] || null;
    }


    // ========================================================
    // DISPOSE
    // ========================================================

    dispose() {

        if (
            this.disposed
        ) {
            return;
        }


        this.disposed =
            true;


        // ----------------------------------------------------
        // Animation
        // ----------------------------------------------------

        if (
            this.animationFrame
        ) {

            cancelAnimationFrame(
                this.animationFrame
            );

            this.animationFrame =
                null;
        }


        // ----------------------------------------------------
        // Resize Observer
        // ----------------------------------------------------

        if (
            this.resizeObserver
        ) {

            this.resizeObserver.disconnect();

            this.resizeObserver =
                null;
        }


        // ----------------------------------------------------
        // Dispose scene
        // ----------------------------------------------------

        this.scene.traverse(
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

                                if (
                                    material
                                ) {

                                    material.dispose();

                                }

                            }
                        );

                    } else {

                        object.material.dispose();

                    }
                }

            }
        );


        // ----------------------------------------------------
        // Renderer
        // ----------------------------------------------------

        this.renderer.dispose();


        // ----------------------------------------------------
        // Remove Canvas
        // ----------------------------------------------------

        if (
            this.renderer.domElement &&
            this.renderer.domElement.parentElement
        ) {

            this.renderer.domElement.parentElement.removeChild(
                this.renderer.domElement
            );
        }


        this.container =
            null;
    }
}