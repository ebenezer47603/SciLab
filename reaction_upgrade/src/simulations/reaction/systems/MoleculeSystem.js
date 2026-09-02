// ============================================================
// SciLab Reaction Lab - Molecule System
// ============================================================

import * as THREE from "three";
import { MoleculeRenderer } from "../scene/MoleculeRenderer.js";

export class MoleculeSystem {
    constructor(scene) {
        this.molecules = [];
        this.renderer =
            new MoleculeRenderer(scene);
    }

    add(formula, position) {
        const molecule = {
            formula,

            position:
                position
                    ? position.clone()
                    : this.randomPosition(),

            velocity:
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
                )
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
        for (
            let i = 0;
            i < count;
            i++
        ) {
            this.add(
                formula,
                this.randomPosition()
            );
        }
    }

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

    update(
        deltaTime,
        temperature = 298
    ) {
        const speed =
            Math.sqrt(
                Math.max(
                    temperature,
                    1
                ) / 298
            );

        for (
            const molecule
            of this.molecules
        ) {
            molecule.position.addScaledVector(
                molecule.velocity,
                deltaTime * speed
            );

            this.keepInsideChamber(
                molecule
            );

            molecule.mesh.position.copy(
                molecule.position
            );
        }
    }

    keepInsideChamber(molecule) {
        const p =
            molecule.position;

        const v =
            molecule.velocity;

        if (
            p.x < -4 ||
            p.x > 4
        ) {
            v.x *= -1;
        }

        if (
            p.y < -2.5 ||
            p.y > 2.5
        ) {
            v.y *= -1;
        }

        if (
            p.z < -2.5 ||
            p.z > 2.5
        ) {
            v.z *= -1;
        }

        p.x =
            THREE.MathUtils.clamp(
                p.x,
                -4,
                4
            );

        p.y =
            THREE.MathUtils.clamp(
                p.y,
                -2.5,
                2.5
            );

        p.z =
            THREE.MathUtils.clamp(
                p.z,
                -2.5,
                2.5
            );
    }

    remove(molecule) {
        if (!molecule) {
            return;
        }

        this.renderer.disposeMolecule(
            molecule.mesh
        );

        const index =
            this.molecules.indexOf(
                molecule
            );

        if (index !== -1) {
            this.molecules.splice(
                index,
                1
            );
        }
    }

    createProduct(
        formula,
        position
    ) {
        return this.add(
            formula,
            position
        );
    }

    getMolecules() {
        return this.molecules;
    }

    getCounts() {
        const counts = {};

        for (
            const molecule
            of this.molecules
        ) {
            counts[molecule.formula] =
                (counts[molecule.formula] || 0) +
                1;
        }

        return counts;
    }

    clear() {
        for (
            const molecule
            of [...this.molecules]
        ) {
            this.renderer.disposeMolecule(
                molecule.mesh
            );
        }

        this.molecules = [];
    }
}
