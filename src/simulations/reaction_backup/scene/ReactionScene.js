import * as THREE from "three";
import { ReactionChamber } from "./ReactionChamber.js";

export class ReactionScene {
    constructor() {
        this.scene =
            new THREE.Scene();

        this.scene.background =
            new THREE.Color(
                0x08111f
            );

        this.camera =
            new THREE.PerspectiveCamera(
                45,
                window.innerWidth /
                    window.innerHeight,
                0.1,
                100
            );

        this.camera.position.set(
            0,
            1,
            13
        );

        this.camera.lookAt(
            0,
            0,
            0
        );

        this.createLights();

        this.chamber =
            new ReactionChamber(
                this.scene
            );

        this.createFloor();

        this.handleResize =
            this.handleResize.bind(
                this
            );

        window.addEventListener(
            "resize",
            this.handleResize
        );
    }

    createLights() {
        const ambient =
            new THREE.AmbientLight(
                0xffffff,
                1.5
            );

        this.scene.add(
            ambient
        );

        const light =
            new THREE.PointLight(
                0xffffff,
                40,
                30
            );

        light.position.set(
            0,
            5,
            8
        );

        this.scene.add(
            light
        );
    }

    createFloor() {
        const geometry =
            new THREE.PlaneGeometry(
                20,
                20
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x101a2b,
                roughness: 0.8
            });

        const floor =
            new THREE.Mesh(
                geometry,
                material
            );

        floor.rotation.x =
            -Math.PI / 2;

        floor.position.y =
            -2.75;

        this.scene.add(
            floor
        );

        this.floor = floor;
    }

    handleResize() {
        this.camera.aspect =
            window.innerWidth /
            window.innerHeight;

        this.camera.updateProjectionMatrix();
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    dispose() {
        window.removeEventListener(
            "resize",
            this.handleResize
        );

        this.chamber.dispose();

        if (this.floor) {
            this.floor.geometry.dispose();
            this.floor.material.dispose();

            this.scene.remove(
                this.floor
            );
        }
    }
}