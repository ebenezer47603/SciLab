import * as THREE from "three";
import { MoleculeRenderer } from "../scene/MoleculeRenderer.js";

export class MoleculeSystem {
    constructor(scene) {
        this.scene = scene;

        this.molecules = [];

        this.renderer =
            new MoleculeRenderer(scene);

        this.bounds = {
            x: 4,
            y: 2.5,
            z: 2.5
        };
    }

    add(formula, position = null, velocity = null) {
        if (!formula) {
            return null;
        }

        const molecule = {
            id: this.createId(),

            formula,

            position: position
                ? position.clone()
                : this.randomPosition(),

            velocity: velocity
                ? velocity.clone()
                : this.randomVelocity(),

            mesh: null
        };

        molecule.mesh =
            this.renderer.create(
                formula,
                molecule.position
            );

        this.molecules.push(
            molecule
        );

        return molecule;
    }

    addMany(formula, count) {
        const created = [];

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
            const molecule =
                this.add(
                    formula,
                    this.randomPosition()
                );

            if (molecule) {
                created.push(
                    molecule
                );
            }
        }

        return created;
    }

    update(
        deltaTime,
        temperature = 298
    ) {
        if (
            !Number.isFinite(deltaTime) ||
            deltaTime <= 0
        ) {
            return;
        }

        const safeTemperature =
            Math.max(
                1,
                Number(temperature) || 298
            );

        /*
         * Higher temperature means
         * faster molecular movement.
         */
        const temperatureFactor =
            Math.sqrt(
                safeTemperature / 298
            );

        for (
            const molecule of this.molecules
        ) {
            if (
                !molecule ||
                !molecule.position ||
                !molecule.velocity
            ) {
                continue;
            }

            molecule.position.addScaledVector(
                molecule.velocity,
                deltaTime *
                    temperatureFactor
            );

            this.keepInsideChamber(
                molecule
            );

            if (molecule.mesh) {
                molecule.mesh.position.copy(
                    molecule.position
                );
            }
        }
    }

    keepInsideChamber(molecule) {
        const p =
            molecule.position;

        const v =
            molecule.velocity;

        if (
            p.x <= -this.bounds.x
        ) {
            p.x = -this.bounds.x;
            v.x = Math.abs(v.x);
        }

        if (
            p.x >= this.bounds.x
        ) {
            p.x = this.bounds.x;
            v.x = -Math.abs(v.x);
        }

        if (
            p.y <= -this.bounds.y
        ) {
            p.y = -this.bounds.y;
            v.y = Math.abs(v.y);
        }

        if (
            p.y >= this.bounds.y
        ) {
            p.y = this.bounds.y;
            v.y = -Math.abs(v.y);
        }

        if (
            p.z <= -this.bounds.z
        ) {
            p.z = -this.bounds.z;
            v.z = Math.abs(v.z);
        }

        if (
            p.z >= this.bounds.z
        ) {
            p.z = this.bounds.z;
            v.z = -Math.abs(v.z);
        }
    }

    remove(molecule) {
        if (!molecule) {
            return false;
        }

        const index =
            this.molecules.indexOf(
                molecule
            );

        if (index === -1) {
            return false;
        }

        this.disposeMolecule(
            molecule
        );

        this.molecules.splice(
            index,
            1
        );

        return true;
    }

    createProduct(
        formula,
        position = null
    ) {
        const safePosition =
            position
                ? position.clone()
                : this.randomPosition();

        const product =
            this.add(
                formula,
                safePosition
            );

        /*
         * Products should start
         * with a smaller random velocity.
         */
        if (product) {
            product.velocity.multiplyScalar(
                0.5
            );
        }

        return product;
    }

    getMolecules() {
        return this.molecules;
    }

    getCount() {
        return this.molecules.length;
    }

    getCountByFormula(formula) {
        return this.molecules.filter(
            molecule =>
                molecule.formula === formula
        ).length;
    }

    clear() {
        for (
            const molecule of this.molecules
        ) {
            this.disposeMolecule(
                molecule
            );
        }

        this.molecules = [];
    }

    randomPosition() {
        return new THREE.Vector3(
            THREE.MathUtils.randFloat(
                -this.bounds.x + 0.2,
                this.bounds.x - 0.2
            ),

            THREE.MathUtils.randFloat(
                -this.bounds.y + 0.2,
                this.bounds.y - 0.2
            ),

            THREE.MathUtils.randFloat(
                -this.bounds.z + 0.2,
                this.bounds.z - 0.2
            )
        );
    }

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

        /*
         * Avoid completely stationary
         * molecules.
         */
        if (
            velocity.lengthSq() < 0.01
        ) {
            velocity.set(
                0.5,
                0.3,
                -0.4
            );
        }

        return velocity;
    }

    createId() {
        return (
            "molecule-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2)
        );
    }

    disposeMolecule(molecule) {
    if (!molecule) {
        return;
    }

    if (
        molecule.mesh &&
        this.renderer &&
        typeof this.renderer.disposeMolecule ===
            "function"
    ) {
        this.renderer.disposeMolecule(
            molecule.mesh
        );

        molecule.mesh = null;
        return;
    }

    if (molecule.mesh) {
        molecule.mesh.removeFromParent();
        molecule.mesh = null;
    }
}
}