import * as THREE from "three";

export class ReactionAnimation {
    constructor(scene) {
        this.scene = scene;

        this.effects = [];
        this.clock = 0;
    }

    createReactionBurst(position) {
        if (!position) {
            return;
        }

        const geometry =
            new THREE.SphereGeometry(
                0.15,
                12,
                12
            );

        const material =
            new THREE.MeshBasicMaterial({
                color: 0xffcc66,
                transparent: true,
                opacity: 0.9
            });

        const burst =
            new THREE.Mesh(
                geometry,
                material
            );

        burst.position.copy(position);

        this.scene.add(burst);

        this.effects.push({
            object: burst,
            age: 0,
            duration: 0.6
        });
    }

    update(deltaTime) {
        if (
            !Number.isFinite(deltaTime) ||
            deltaTime <= 0
        ) {
            return;
        }

        for (
            let i = this.effects.length - 1;
            i >= 0;
            i--
        ) {
            const effect =
                this.effects[i];

            effect.age += deltaTime;

            const progress =
                effect.age /
                effect.duration;

            effect.object.scale.setScalar(
                1 + progress * 4
            );

            effect.object.material.opacity =
                Math.max(
                    0,
                    1 - progress
                );

            if (
                effect.age >=
                effect.duration
            ) {
                this.scene.remove(
                    effect.object
                );

                effect.object.geometry.dispose();
                effect.object.material.dispose();

                this.effects.splice(i, 1);
            }
        }
    }

    clear() {
        for (const effect of this.effects) {
            this.scene.remove(
                effect.object
            );

            effect.object.geometry.dispose();
            effect.object.material.dispose();
        }

        this.effects = [];
    }
}