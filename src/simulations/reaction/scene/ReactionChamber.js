import * as THREE from "three";

export class ReactionChamber {
    constructor(scene) {
        this.scene = scene;

        this.width = 9;
        this.height = 5.5;
        this.depth = 5.5;

        this.box = null;
        this.edges = null;

        this.create();
    }

    create() {
        const geometry =
            new THREE.BoxGeometry(
                this.width,
                this.height,
                this.depth
            );

        const material =
            new THREE.MeshPhysicalMaterial({
                color: 0x88aaff,
                transparent: true,
                opacity: 0.08,
                roughness: 0.1,
                metalness: 0,
                side: THREE.DoubleSide
            });

        this.box =
            new THREE.Mesh(
                geometry,
                material
            );

        this.scene.add(this.box);

        const edges =
            new THREE.EdgesGeometry(
                geometry
            );

        const lineMaterial =
            new THREE.LineBasicMaterial({
                color: 0x6688aa,
                transparent: true,
                opacity: 0.7
            });

        this.edges =
            new THREE.LineSegments(
                edges,
                lineMaterial
            );

        this.scene.add(
            this.edges
        );
    }

    getBounds() {
        return {
            width: this.width,
            height: this.height,
            depth: this.depth
        };
    }

    dispose() {
        this.box?.geometry.dispose();
        this.box?.material.dispose();

        this.edges?.geometry.dispose();
        this.edges?.material.dispose();

        this.scene.remove(
            this.box
        );

        this.scene.remove(
            this.edges
        );
    }
}