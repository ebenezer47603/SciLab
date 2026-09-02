// ============================================================
// SciLab Reaction Lab - Reaction Scene
// Molecular Builder style 3D stage
// ============================================================

import * as THREE from "three";

export class ReactionScene {

    constructor() {

        this.scene =
            new THREE.Scene();

        this.scene.background =
            new THREE.Color(
                0x07111f
            );


        // =====================================================
        // CAMERA
        // =====================================================

        this.camera =
            new THREE.PerspectiveCamera(
                42,
                1,
                0.1,
                100
            );

        this.camera.position.set(
            0,
            0.3,
            11
        );

        this.camera.lookAt(
            0,
            0,
            0
        );


        // =====================================================
        // RENDERER
        // =====================================================

        this.renderer =
            new THREE.WebGLRenderer({
                antialias: true,
                alpha: false
            });

        this.renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio || 1,
                2
            )
        );

        this.renderer.setClearColor(
            0x07111f,
            1
        );

        this.renderer.shadowMap.enabled =
            true;

        this.renderer.shadowMap.type =
            THREE.PCFSoftShadowMap;


        this.renderer.domElement.className =
            "reaction-canvas";


        // =====================================================
        // LIGHTING
        // =====================================================

        this.createLights();


        // =====================================================
        // CHAMBER
        // =====================================================

        this.createChamber();


        // =====================================================
        // FLOOR
        // =====================================================

        this.createFloor();


        // =====================================================
        // RESIZE
        // =====================================================

        this.resizeObserver =
            null;

        this.container =
            null;

        this.disposed =
            false;
    }


    // =========================================================
    // LIGHTS
    // =========================================================

    createLights() {

        const ambient =
            new THREE.AmbientLight(
                0xffffff,
                1.8
            );

        this.scene.add(
            ambient
        );


        const key =
            new THREE.DirectionalLight(
                0xffffff,
                3.0
            );

        key.position.set(
            4,
            7,
            8
        );

        key.castShadow =
            true;

        this.scene.add(
            key
        );


        const fill =
            new THREE.PointLight(
                0x66aaff,
                20,
                25
            );

        fill.position.set(
            -4,
            2,
            6
        );

        this.scene.add(
            fill
        );
    }


    // =========================================================
    // CHAMBER
    // =========================================================

    createChamber() {

        const width = 8;
        const height = 5;
        const depth = 5;


        const glassGeometry =
            new THREE.BoxGeometry(
                width,
                height,
                depth
            );

        const glassMaterial =
            new THREE.MeshPhysicalMaterial({
                color: 0x18324d,
                transparent: true,
                opacity: 0.16,
                roughness: 0.15,
                metalness: 0.05,
                transmission: 0.15,
                side: THREE.DoubleSide
            });

        this.chamberMesh =
            new THREE.Mesh(
                glassGeometry,
                glassMaterial
            );

        this.chamberMesh.position.y =
            0;

        this.scene.add(
            this.chamberMesh
        );


        // -----------------------------------------------------
        // Glass edges
        // -----------------------------------------------------

        const edgeGeometry =
            new THREE.EdgesGeometry(
                glassGeometry
            );

        const edgeMaterial =
            new THREE.LineBasicMaterial({
                color: 0x4386bd,
                transparent: true,
                opacity: 0.8
            });

        this.chamberEdges =
            new THREE.LineSegments(
                edgeGeometry,
                edgeMaterial
            );

        this.scene.add(
            this.chamberEdges
        );


        // -----------------------------------------------------
        // Center glow
        // -----------------------------------------------------

        const glowGeometry =
            new THREE.PlaneGeometry(
                7.6,
                4.6
            );

        const glowMaterial =
            new THREE.MeshBasicMaterial({
                color: 0x0d2138,
                transparent: true,
                opacity: 0.18,
                side: THREE.DoubleSide
            });

        this.chamberGlow =
            new THREE.Mesh(
                glowGeometry,
                glowMaterial
            );

        this.chamberGlow.position.z =
            -2.48;

        this.scene.add(
            this.chamberGlow
        );
    }


    // =========================================================
    // FLOOR
    // =========================================================

    createFloor() {

        const geometry =
            new THREE.PlaneGeometry(
                20,
                20
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x0c1727,
                roughness: 0.9,
                metalness: 0.05
            });

        this.floor =
            new THREE.Mesh(
                geometry,
                material
            );

        this.floor.rotation.x =
            -Math.PI / 2;

        this.floor.position.y =
            -2.55;

        this.floor.receiveShadow =
            true;

        this.scene.add(
            this.floor
        );


        // -----------------------------------------------------
        // Grid
        // -----------------------------------------------------

        this.grid =
            new THREE.GridHelper(
                20,
                40,
                0x2a5575,
                0x172d43
            );

        this.grid.position.y =
            -2.54;

        this.grid.material.transparent =
            true;

        this.grid.material.opacity =
            0.38;

        this.scene.add(
            this.grid
        );
    }


    // =========================================================
    // MOUNT
    // =========================================================

    mount(container) {

        if (!container) {
            return;
        }

        this.container =
            container;

        if (
            this.renderer.domElement.parentElement !==
            container
        ) {

            container.innerHTML = "";

            container.appendChild(
                this.renderer.domElement
            );
        }


        this.resize();


        if (this.resizeObserver) {

            this.resizeObserver.disconnect();
        }


        this.resizeObserver =
            new ResizeObserver(
                () => {
                    this.resize();
                }
            );

        this.resizeObserver.observe(
            container
        );
    }


    // =========================================================
    // RESIZE
    // =========================================================

    resize() {

        if (!this.container) {
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


    // =========================================================
    // RENDER
    // =========================================================

    render() {

        if (this.disposed) {
            return;
        }

        this.renderer.render(
            this.scene,
            this.camera
        );
    }


    // =========================================================
    // GETTERS
    // =========================================================

    getScene() {
        return this.scene;
    }


    getCamera() {
        return this.camera;
    }


    getRenderer() {
        return this.renderer;
    }


    // =========================================================
    // DISPOSE
    // =========================================================

    dispose() {

        if (this.disposed) {
            return;
        }

        this.disposed =
            true;


        if (this.resizeObserver) {

            this.resizeObserver.disconnect();

            this.resizeObserver =
                null;
        }


        this.scene.traverse(
            object => {

                if (object.geometry) {

                    object.geometry.dispose?.();
                }


                if (object.material) {

                    if (
                        Array.isArray(
                            object.material
                        )
                    ) {

                        object.material.forEach(
                            material => {
                                material?.dispose?.();
                            }
                        );

                    } else {

                        object.material.dispose?.();
                    }
                }
            }
        );


        this.renderer.dispose();


        if (
            this.renderer.domElement.parentElement
        ) {

            this.renderer.domElement.parentElement
                .removeChild(
                    this.renderer.domElement
                );
        }
    }
}