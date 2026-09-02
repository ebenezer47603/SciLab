// ============================================================
// SciLab - Physics
// VirtualPhysicsLab.js
// COLLISION LABORATORY
//
// Rwanda REB Physics S4-S6 aligned:
// - Conservation of Linear Momentum
// - Impulse
// - Elastic Collision
// - Inelastic Collision
// - Perfectly Inelastic Collision
// - 1D Head-on Collision
// - 2D / Glancing Collision
// ============================================================

import * as THREE from "three";

export class VirtualPhysicsLab {

    constructor() {

        // ----------------------------------------------------
        // ROOT
        // ----------------------------------------------------

        this.group = new THREE.Group();
        this.group.name = "SciLab Collision Laboratory";

        this.rig = new THREE.Group();
        this.rig.name = "Collision Experiment Rig";

        this.group.add(this.rig);

        // ----------------------------------------------------
        // SIMULATION
        // ----------------------------------------------------

        this.running = false;
        this.time = 0;

        this.collisionType = "Elastic 1D";

        // ----------------------------------------------------
        // PHYSICAL CONSTANTS
        // ----------------------------------------------------

        this.gravity = 9.81;

        // ----------------------------------------------------
        // OBJECT A
        // ----------------------------------------------------

        this.massA = 1.0;

        this.velocityA = 5.0;

        this.velocityAX = 5.0;
        this.velocityAY = 0.0;

        // ----------------------------------------------------
        // OBJECT B
        // ----------------------------------------------------

        this.massB = 1.0;

        this.velocityB = -3.0;

        this.velocityBX = -3.0;
        this.velocityBY = 0.0;

        // ----------------------------------------------------
        // COLLISION PARAMETERS
        // ----------------------------------------------------

        // coefficient of restitution
        //
        // e = 1  -> perfectly elastic
        // 0 < e < 1 -> inelastic
        // e = 0 -> perfectly inelastic
        //
        this.restitution = 1.0;

        this.collisionOccurred = false;

        this.collisionCount = 0;

        this.collisionImpulseA = 0;
        this.collisionImpulseB = 0;

        this.collisionForce = 0;

        this.collisionDuration = 0.05;

        // ----------------------------------------------------
        // INITIAL POSITIONS
        // ----------------------------------------------------

        this.startXA = -4.0;
        this.startXB = 4.0;

        this.startYA = 0;
        this.startYB = 0;

        this.positionA = new THREE.Vector3(
            this.startXA,
            0,
            0
        );

        this.positionB = new THREE.Vector3(
            this.startXB,
            0,
            0
        );

        // ----------------------------------------------------
        // 2D ANGLES
        // ----------------------------------------------------

        this.angleA = 0;
        this.angleB = 180;

        // ----------------------------------------------------
        // OBJECT RADII
        // ----------------------------------------------------

        this.radiusA = 0.42;
        this.radiusB = 0.42;

        // ----------------------------------------------------
        // VISUAL OBJECTS
        // ----------------------------------------------------

        this.objectA = null;
        this.objectB = null;

        this.velocityArrowA = null;
        this.velocityArrowB = null;

        this.momentumArrowA = null;
        this.momentumArrowB = null;

        this.collisionPoint = null;

        this.track = null;

        this.wallLeft = null;
        this.wallRight = null;

        this.infoObjects = [];

        // ----------------------------------------------------
        // TRAIL
        // ----------------------------------------------------

        this.trailA = [];
        this.trailB = [];

        this.trailLineA = null;
        this.trailLineB = null;

        // ----------------------------------------------------
        // 2D MODE
        // ----------------------------------------------------

        this.twoD = false;

        // ----------------------------------------------------
        // PERFECTLY INELASTIC
        // ----------------------------------------------------

        this.stuckTogether = false;

        this.combinedVelocityX = 0;
        this.combinedVelocityY = 0;

        // ----------------------------------------------------
        // LAST MEASUREMENTS
        // ----------------------------------------------------

        this.initialMomentumX = 0;
        this.initialMomentumY = 0;

        this.finalMomentumX = 0;
        this.finalMomentumY = 0;

        this.initialKineticEnergy = 0;
        this.finalKineticEnergy = 0;

        // ----------------------------------------------------
        // SELECTABLE
        // ----------------------------------------------------

        this.selectable = [];

        // ----------------------------------------------------
        // BUILD
        // ----------------------------------------------------

        this.createScene();
        this.rebuild();
    }

    // ========================================================
    // EXPERIMENT TYPES
    // ========================================================

    getCollisionTypes() {

        return [

            "Elastic 1D",

            "Inelastic 1D",

            "Perfectly Inelastic 1D",

            "Elastic 2D",

            "Inelastic 2D",

            "Head-on Collision",

            "Stationary Target",

            "Opposite Direction",

            "Same Direction"

        ];
    }

    // ========================================================
    // SET COLLISION TYPE
    // ========================================================

    setExperiment(value) {

        this.setCollisionType(value);

    }

    setCollisionType(value) {

        const aliases = {

            "Elastic": "Elastic 1D",

            "Elastic Collision": "Elastic 1D",

            "Elastic 1D Collision": "Elastic 1D",

            "Inelastic": "Inelastic 1D",

            "Inelastic Collision": "Inelastic 1D",

            "Inelastic 1D Collision": "Inelastic 1D",

            "Perfectly Inelastic": "Perfectly Inelastic 1D",

            "Perfectly Inelastic Collision":
                "Perfectly Inelastic 1D",

            "Elastic 2D Collision":
                "Elastic 2D",

            "Glancing Elastic Collision":
                "Elastic 2D",

            "Glancing Collision":
                "Elastic 2D",

            "Inelastic 2D Collision":
                "Inelastic 2D",

            "Head-on":
                "Head-on Collision",

            "Stationary":
                "Stationary Target"
        };

        const normalized =
            aliases[value] || value;

        const valid =
            this.getCollisionTypes().includes(normalized);

        this.collisionType =
            valid ? normalized : "Elastic 1D";

        this.time = 0;

        this.collisionOccurred = false;

        this.collisionCount = 0;

        this.stuckTogether = false;

        this.rebuild();
    }

    // ========================================================
    // CREATE COMMON SCENE
    // ========================================================

    createScene() {

        const floorGeometry =
            new THREE.BoxGeometry(
                15,
                0.08,
                8
            );

        const floorMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x1e293b,
                roughness: 0.65,
                metalness: 0.15
            });

        this.floor =
            new THREE.Mesh(
                floorGeometry,
                floorMaterial
            );

        this.floor.position.y = -0.75;

        this.floor.name =
            "Collision Laboratory Floor";

        this.rig.add(this.floor);

        // grid

        this.grid =
            new THREE.GridHelper(
                14,
                28,
                0x64748b,
                0x334155
            );

        this.grid.position.y = -0.70;

        this.rig.add(this.grid);

        // collision axis

        const axisGeometry =
            new THREE.BufferGeometry().setFromPoints([

                new THREE.Vector3(-6, -0.65, 0),

                new THREE.Vector3(6, -0.65, 0)

            ]);

        const axisMaterial =
            new THREE.LineBasicMaterial({
                color: 0x94a3b8
            });

        this.axis =
            new THREE.Line(
                axisGeometry,
                axisMaterial
            );

        this.rig.add(this.axis);
    }

    // ========================================================
    // CLEAR
    // ========================================================

    clearRig() {

        while (this.rig.children.length > 0) {

            const object =
                this.rig.children[0];

            if (
                object === this.floor ||
                object === this.grid ||
                object === this.axis
            ) {

                this.rig.remove(object);

                continue;
            }

            this.disposeObject(object);

            this.rig.remove(object);
        }
    }

    // ========================================================
    // RESET REFERENCES
    // ========================================================

    resetReferences() {

        this.objectA = null;
        this.objectB = null;

        this.velocityArrowA = null;
        this.velocityArrowB = null;

        this.momentumArrowA = null;
        this.momentumArrowB = null;

        this.collisionPoint = null;

        this.trailLineA = null;
        this.trailLineB = null;

        this.trailA = [];
        this.trailB = [];

        this.selectable = [];

    }

    // ========================================================
    // REBUILD
    // ========================================================

    rebuild() {

        this.clearRig();

        this.resetReferences();

        this.setInitialConditions();

        switch (this.collisionType) {

            case "Elastic 2D":
                this.build2DCollision(true);
                break;

            case "Inelastic 2D":
                this.build2DCollision(false);
                break;

            case "Perfectly Inelastic 1D":
                this.restitution = 0;
                this.build1DCollision();
                break;

            case "Inelastic 1D":
                this.restitution =
                    THREE.MathUtils.clamp(
                        this.restitution,
                        0,
                        0.99
                    );

                this.build1DCollision();
                break;

            case "Head-on Collision":
                this.buildHeadOnCollision();
                break;

            case "Stationary Target":
                this.buildStationaryTarget();
                break;

            case "Opposite Direction":
                this.buildOppositeDirection();
                break;

            case "Same Direction":
                this.buildSameDirection();
                break;

            case "Elastic 1D":
            default:

                this.restitution = 1;

                this.build1DCollision();

                break;
        }

        this.updateMeasurements();
    }

    // ========================================================
    // INITIAL CONDITIONS
    // ========================================================

    setInitialConditions() {

        this.positionA.set(
            this.startXA,
            0,
            0
        );

        this.positionB.set(
            this.startXB,
            0,
            0
        );

        this.velocityAX =
            this.velocityA;

        this.velocityAY = 0;

        this.velocityBX =
            this.velocityB;

        this.velocityBY = 0;

        this.stuckTogether = false;

        this.combinedVelocityX = 0;
        this.combinedVelocityY = 0;
    }

    // ========================================================
    // BUILD 1D COLLISION
    // ========================================================

    build1DCollision() {

        this.twoD = false;

        this.buildTrack();

        this.createObjectA();

        this.createObjectB();

        this.createVelocityArrows();

        this.createMomentumArrows();

        this.updateVisuals();

    }

    // ========================================================
    // BUILD HEAD ON
    // ========================================================

    buildHeadOnCollision() {

        this.twoD = false;

        this.velocityA =
            Math.abs(this.velocityA);

        this.velocityB =
            -Math.abs(this.velocityB);

        this.velocityAX =
            this.velocityA;

        this.velocityBX =
            this.velocityB;

        this.restitution = 1;

        this.buildTrack();

        this.createObjectA();

        this.createObjectB();

        this.createVelocityArrows();

        this.createMomentumArrows();

        this.updateVisuals();
    }

    // ========================================================
    // STATIONARY TARGET
    // ========================================================

    buildStationaryTarget() {

        this.twoD = false;

        this.velocityA =
            Math.abs(this.velocityA);

        this.velocityB = 0;

        this.velocityAX =
            this.velocityA;

        this.velocityBX = 0;

        this.restitution = 1;

        this.buildTrack();

        this.createObjectA();

        this.createObjectB();

        this.createVelocityArrows();

        this.createMomentumArrows();

        this.updateVisuals();
    }

    // ========================================================
    // OPPOSITE DIRECTION
    // ========================================================

    buildOppositeDirection() {

        this.twoD = false;

        this.velocityA =
            Math.abs(this.velocityA);

        this.velocityB =
            -Math.abs(this.velocityB);

        this.velocityAX =
            this.velocityA;

        this.velocityBX =
            this.velocityB;

        this.restitution = 1;

        this.buildTrack();

        this.createObjectA();

        this.createObjectB();

        this.createVelocityArrows();

        this.createMomentumArrows();

        this.updateVisuals();
    }

    // ========================================================
    // SAME DIRECTION
    // ========================================================

    buildSameDirection() {

        this.twoD = false;

        this.velocityA =
            Math.abs(this.velocityA);

        this.velocityB =
            Math.abs(this.velocityB);

        this.velocityAX =
            this.velocityA;

        this.velocityBX =
            this.velocityB;

        this.restitution = 1;

        // A behind B

        this.positionA.x = -4;

        this.positionB.x = 1;

        this.buildTrack();

        this.createObjectA();

        this.createObjectB();

        this.createVelocityArrows();

        this.createMomentumArrows();

        this.updateVisuals();
    }

    // ========================================================
    // 2D COLLISION
    // ========================================================

    build2DCollision(elastic = true) {

        this.twoD = true;

        this.positionA.set(
            -3.5,
            0,
            -1.8
        );

        this.positionB.set(
            2.5,
            0,
            1.0
        );

        this.velocityAX =
            Math.cos(
                THREE.MathUtils.degToRad(
                    this.angleA
                )
            ) *
            Math.abs(this.velocityA);

        this.velocityAY =
            Math.sin(
                THREE.MathUtils.degToRad(
                    this.angleA
                )
            ) *
            Math.abs(this.velocityA);

        this.velocityBX =
            Math.cos(
                THREE.MathUtils.degToRad(
                    this.angleB
                )
            ) *
            Math.abs(this.velocityB);

        this.velocityBY =
            Math.sin(
                THREE.MathUtils.degToRad(
                    this.angleB
                )
            ) *
            Math.abs(this.velocityB);

        this.restitution =
            elastic ? 1 : 0.5;

        this.build2DTrack();

        this.createObjectA();

        this.createObjectB();

        this.createVelocityArrows();

        this.createMomentumArrows();

        this.updateVisuals();

    }

    // ========================================================
    // TRACK
    // ========================================================

    buildTrack() {

        const geometry =
            new THREE.BoxGeometry(
                13,
                0.12,
                2.2
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x475569,
                roughness: 0.55
            });

        this.track =
            new THREE.Mesh(
                geometry,
                material
            );

        this.track.position.y = -0.58;

        this.track.name =
            "Collision Track";

        this.rig.add(this.track);

    }

    // ========================================================
    // 2D TRACK
    // ========================================================

    build2DTrack() {

        const geometry =
            new THREE.BoxGeometry(
                13,
                0.12,
                7
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x475569,
                roughness: 0.55
            });

        this.track =
            new THREE.Mesh(
                geometry,
                material
            );

        this.track.position.y = -0.58;

        this.track.name =
            "2D Collision Surface";

        this.rig.add(this.track);

    }

    // ========================================================
    // OBJECT A
    // ========================================================

    createObjectA() {

        const geometry =
            new THREE.SphereGeometry(
                this.radiusA,
                32,
                24
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x38bdf8,
                roughness: 0.25,
                metalness: 0.15
            });

        this.objectA =
            new THREE.Mesh(
                geometry,
                material
            );

        this.objectA.position.copy(
            this.positionA
        );

        this.objectA.position.y = 0;

        this.objectA.name =
            "Collision Object A";

        this.objectA.userData = {

            name: "Object A",

            type: "collision-object",

            mass: this.massA,

            description:
                "Object A participating in a collision.",

            physics:
                "Linear momentum p = mv."

        };

        this.rig.add(
            this.objectA
        );

        this.selectable.push(
            this.objectA
        );

    }

    // ========================================================
    // OBJECT B
    // ========================================================

    createObjectB() {

        const geometry =
            new THREE.SphereGeometry(
                this.radiusB,
                32,
                24
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0xf97316,
                roughness: 0.25,
                metalness: 0.15
            });

        this.objectB =
            new THREE.Mesh(
                geometry,
                material
            );

        this.objectB.position.copy(
            this.positionB
        );

        this.objectB.position.y = 0;

        this.objectB.name =
            "Collision Object B";

        this.objectB.userData = {

            name: "Object B",

            type: "collision-object",

            mass: this.massB,

            description:
                "Object B participating in a collision.",

            physics:
                "Linear momentum p = mv."

        };

        this.rig.add(
            this.objectB
        );

        this.selectable.push(
            this.objectB
        );

    }

    // ========================================================
    // VELOCITY ARROWS
    // ========================================================

    createVelocityArrows() {

        this.velocityArrowA =
            new THREE.ArrowHelper(
                new THREE.Vector3(
                    1,
                    0,
                    0
                ),
                this.objectA.position.clone(),
                1,
                0x38bdf8,
                0.18,
                0.10
            );

        this.velocityArrowB =
            new THREE.ArrowHelper(
                new THREE.Vector3(
                    -1,
                    0,
                    0
                ),
                this.objectB.position.clone(),
                1,
                0xf97316,
                0.18,
                0.10
            );

        this.rig.add(
            this.velocityArrowA
        );

        this.rig.add(
            this.velocityArrowB
        );

    }

    // ========================================================
    // MOMENTUM ARROWS
    // ========================================================

    createMomentumArrows() {

        this.momentumArrowA =
            new THREE.ArrowHelper(
                new THREE.Vector3(
                    1,
                    0,
                    0
                ),
                this.objectA.position.clone(),
                1,
                0xa78bfa,
                0.14,
                0.08
            );

        this.momentumArrowB =
            new THREE.ArrowHelper(
                new THREE.Vector3(
                    -1,
                    0,
                    0
                ),
                this.objectB.position.clone(),
                1,
                0xfacc15,
                0.14,
                0.08
            );

        this.rig.add(
            this.momentumArrowA
        );

        this.rig.add(
            this.momentumArrowB
        );
    }

    // ========================================================
    // UPDATE VELOCITY ARROW
    // ========================================================

    updateArrow(
        arrow,
        position,
        vx,
        vz,
        scale = 0.18
    ) {

        if (!arrow) return;

        const vector =
            new THREE.Vector3(
                vx,
                0,
                vz
            );

        const magnitude =
            vector.length();

        arrow.position.copy(
            position
        );

        if (magnitude < 0.0001) {

            arrow.visible = false;

            return;
        }

        arrow.visible = true;

        vector.normalize();

        arrow.setDirection(
            vector
        );

        arrow.setLength(
            THREE.MathUtils.clamp(
                magnitude * scale,
                0.2,
                2.5
            ),
            0.18,
            0.10
        );
    }

    // ========================================================
    // START
    // ========================================================

    start() {

        this.running = true;

    }

    // ========================================================
    // PAUSE
    // ========================================================

    pause() {

        this.running =
            !this.running;

    }

    // ========================================================
    // RESET
    // ========================================================

    reset() {

        this.running = false;

        this.time = 0;

        this.collisionOccurred = false;

        this.collisionCount = 0;

        this.collisionImpulseA = 0;

        this.collisionImpulseB = 0;

        this.collisionForce = 0;

        this.stuckTogether = false;

        this.rebuild();

    }

    // ========================================================
    // UPDATE
    // ========================================================

    update(delta) {

        if (!this.running)
            return;

        if (!Number.isFinite(delta))
            return;

        // prevent huge physics jumps

        delta =
            THREE.MathUtils.clamp(
                delta,
                0,
                0.04
            );

        this.time += delta;

        if (this.twoD) {

            this.update2D(delta);

        } else {

            this.update1D(delta);

        }

        this.updateTrails();

        this.updateVisuals();

        this.updateMeasurements();
    }

    // ========================================================
    // UPDATE 1D
    // ========================================================

    update1D(delta) {

        if (this.stuckTogether) {

            const combinedVelocity =
                this.combinedVelocityX;

            const displacement =
                combinedVelocity * delta;

            this.positionA.x += displacement;

            this.positionB.x += displacement;

            return;
        }

        this.positionA.x +=
            this.velocityAX *
            delta;

        this.positionB.x +=
            this.velocityBX *
            delta;

        const distance =
            Math.abs(
                this.positionB.x -
                this.positionA.x
            );

        const collisionDistance =
            this.radiusA +
            this.radiusB;

        if (
            !this.collisionOccurred &&
            distance <= collisionDistance
        ) {

            // Make sure they are approaching

            const relativeVelocity =
                this.velocityAX -
                this.velocityBX;

            if (relativeVelocity > 0) {

                this.resolve1DCollision();

            }
        }

        // Reset if they leave the laboratory

        if (
            Math.abs(this.positionA.x) > 7 ||
            Math.abs(this.positionB.x) > 7
        ) {

            this.running = false;

        }
    }

    // ========================================================
    // 1D COLLISION SOLVER
    // ========================================================

    resolve1DCollision() {

        this.collisionOccurred = true;

        this.collisionCount++;

        const m1 =
            Math.max(
                0.000001,
                this.massA
            );

        const m2 =
            Math.max(
                0.000001,
                this.massB
            );

        const u1 =
            this.velocityAX;

        const u2 =
            this.velocityBX;

        const e =
            THREE.MathUtils.clamp(
                this.restitution,
                0,
                1
            );

        // --------------------------------------------
        // initial momentum
        // --------------------------------------------

        const pBefore =
            m1 * u1 +
            m2 * u2;

        // --------------------------------------------
        // perfectly inelastic
        // --------------------------------------------

        if (
            this.collisionType ===
            "Perfectly Inelastic 1D" ||
            e === 0
        ) {

            const v =
                pBefore /
                (m1 + m2);

            this.velocityAX = v;

            this.velocityBX = v;

            this.combinedVelocityX = v;

            this.stuckTogether = true;

        }

        // --------------------------------------------
        // general elastic/inelastic collision
        // --------------------------------------------

        else {

            const v1 =
                (
                    m1 * u1 +
                    m2 * u2 -
                    m2 *
                    e *
                    (u1 - u2)
                ) /
                (m1 + m2);

            const v2 =
                (
                    m1 * u1 +
                    m2 * u2 +
                    m1 *
                    e *
                    (u1 - u2)
                ) /
                (m1 + m2);

            this.velocityAX = v1;

            this.velocityBX = v2;

        }

        // --------------------------------------------
        // Separate overlapping objects
        // --------------------------------------------

        const mid =
            (
                this.positionA.x +
                this.positionB.x
            ) / 2;

        const separation =
            this.radiusA +
            this.radiusB +
            0.015;

        if (
            this.positionA.x <
            this.positionB.x
        ) {

            this.positionA.x =
                mid - separation / 2;

            this.positionB.x =
                mid + separation / 2;

        } else {

            this.positionA.x =
                mid + separation / 2;

            this.positionB.x =
                mid - separation / 2;

        }

        // --------------------------------------------
        // impulse
        // --------------------------------------------

        const impulseA =
            m1 *
            (
                this.velocityAX -
                u1
            );

        const impulseB =
            m2 *
            (
                this.velocityBX -
                u2
            );

        this.collisionImpulseA =
            impulseA;

        this.collisionImpulseB =
            impulseB;

        // Average force approximation

        this.collisionForce =
            Math.abs(
                impulseA
            ) /
            Math.max(
                this.collisionDuration,
                0.0001
            );
    }

    // ========================================================
    // UPDATE 2D
    // ========================================================

    update2D(delta) {

        if (this.stuckTogether) {

            this.positionA.x +=
                this.combinedVelocityX *
                delta;

            this.positionA.z +=
                this.combinedVelocityY *
                delta;

            this.positionB.copy(
                this.positionA
            );

            return;
        }

        this.positionA.x +=
            this.velocityAX *
            delta;

        this.positionA.z +=
            this.velocityAY *
            delta;

        this.positionB.x +=
            this.velocityBX *
            delta;

        this.positionB.z +=
            this.velocityBY *
            delta;

        const dx =
            this.positionB.x -
            this.positionA.x;

        const dz =
            this.positionB.z -
            this.positionA.z;

        const distance =
            Math.sqrt(
                dx * dx +
                dz * dz
            );

        const collisionDistance =
            this.radiusA +
            this.radiusB;

        if (
            !this.collisionOccurred &&
            distance <= collisionDistance &&
            distance > 0.000001
        ) {

            const relativeX =
                this.velocityAX -
                this.velocityBX;

            const relativeZ =
                this.velocityAY -
                this.velocityBY;

            const normalVelocity =
                relativeX *
                (dx / distance) +
                relativeZ *
                (dz / distance);

            if (
                normalVelocity > 0
            ) {

                this.resolve2DCollision(
                    dx / distance,
                    dz / distance
                );
            }
        }

        if (
            Math.abs(this.positionA.x) > 7 ||
            Math.abs(this.positionA.z) > 4.5 ||
            Math.abs(this.positionB.x) > 7 ||
            Math.abs(this.positionB.z) > 4.5
        ) {

            this.running = false;

        }
    }

    // ========================================================
    // 2D COLLISION SOLVER
    // ========================================================

    resolve2DCollision(nx, nz) {

        this.collisionOccurred = true;

        this.collisionCount++;

        const m1 =
            Math.max(
                this.massA,
                0.000001
            );

        const m2 =
            Math.max(
                this.massB,
                0.000001
            );

        const e =
            THREE.MathUtils.clamp(
                this.restitution,
                0,
                1
            );

        const relativeX =
            this.velocityAX -
            this.velocityBX;

        const relativeZ =
            this.velocityAY -
            this.velocityBY;

        const normalRelativeVelocity =
            relativeX * nx +
            relativeZ * nz;

        // impulse scalar

        const j =
            -(
                1 + e
            ) *
            normalRelativeVelocity /
            (
                1 / m1 +
                1 / m2
            );

        // impulse vector

        const impulseX =
            j * nx;

        const impulseZ =
            j * nz;

        // update A

        this.velocityAX +=
            impulseX / m1;

        this.velocityAY +=
            impulseZ / m1;

        // update B

        this.velocityBX -=
            impulseX / m2;

        this.velocityBY -=
            impulseZ / m2;

        // impulse measurements

        this.collisionImpulseA =
            Math.sqrt(
                impulseX * impulseX +
                impulseZ * impulseZ
            );

        this.collisionImpulseB =
            this.collisionImpulseA;

        this.collisionForce =
            this.collisionImpulseA /
            Math.max(
                this.collisionDuration,
                0.0001
            );

        // Separate objects

        const penetration =
            this.radiusA +
            this.radiusB -
            Math.sqrt(
                (
                    this.positionB.x -
                    this.positionA.x
                ) ** 2 +
                (
                    this.positionB.z -
                    this.positionA.z
                ) ** 2
            );

        if (penetration > 0) {

            const correction =
                penetration / 2 + 0.01;

            this.positionA.x -=
                nx * correction;

            this.positionA.z -=
                nz * correction;

            this.positionB.x +=
                nx * correction;

            this.positionB.z +=
                nz * correction;
        }

    }

    // ========================================================
    // TRAILS
    // ========================================================

    updateTrails() {

        if (!this.objectA ||
            !this.objectB)
            return;

        if (
            this.trailA.length === 0 ||
            this.trailA[
                this.trailA.length - 1
            ].distanceTo(
                this.objectA.position
            ) > 0.08
        ) {

            this.trailA.push(
                this.objectA.position.clone()
            );

        }

        if (
            this.trailB.length === 0 ||
            this.trailB[
                this.trailB.length - 1
            ].distanceTo(
                this.objectB.position
            ) > 0.08
        ) {

            this.trailB.push(
                this.objectB.position.clone()
            );

        }

        if (this.trailA.length > 150)
            this.trailA.shift();

        if (this.trailB.length > 150)
            this.trailB.shift();

        this.updateTrailLine(
            "A"
        );

        this.updateTrailLine(
            "B"
        );
    }

    // ========================================================
    // TRAIL LINE
    // ========================================================

    updateTrailLine(which) {

        const points =
            which === "A"
                ? this.trailA
                : this.trailB;

        if (points.length < 2)
            return;

        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(points);

        const material =
            new THREE.LineBasicMaterial({
                color:
                    which === "A"
                        ? 0x38bdf8
                        : 0xf97316,
                transparent: true,
                opacity: 0.35
            });

        const line =
            new THREE.Line(
                geometry,
                material
            );

        this.rig.add(line);

        if (which === "A") {

            if (this.trailLineA) {

                this.disposeObject(
                    this.trailLineA
                );

                this.rig.remove(
                    this.trailLineA
                );
            }

            this.trailLineA = line;

        } else {

            if (this.trailLineB) {

                this.disposeObject(
                    this.trailLineB
                );

                this.rig.remove(
                    this.trailLineB
                );
            }

            this.trailLineB = line;

        }

    }

    // ========================================================
    // UPDATE VISUALS
    // ========================================================

    updateVisuals() {

        if (!this.objectA ||
            !this.objectB)
            return;

        this.objectA.position.copy(
            this.positionA
        );

        this.objectB.position.copy(
            this.positionB
        );

        this.objectA.position.y = 0;

        this.objectB.position.y = 0;

        if (this.twoD) {

            this.objectA.position.y = 0;

            this.objectB.position.y = 0;

        }

        this.updateArrow(
            this.velocityArrowA,
            this.objectA.position,
            this.velocityAX,
            this.velocityAY
        );

        this.updateArrow(
            this.velocityArrowB,
            this.objectB.position,
            this.velocityBX,
            this.velocityBY
        );

        const momentumAX =
            this.massA *
            this.velocityAX;

        const momentumAY =
            this.massA *
            this.velocityAY;

        const momentumBX =
            this.massB *
            this.velocityBX;

        const momentumBY =
            this.massB *
            this.velocityBY;

        this.updateArrow(
            this.momentumArrowA,
            this.objectA.position,
            momentumAX,
            momentumAY,
            0.10
        );

        this.updateArrow(
            this.momentumArrowB,
            this.objectB.position,
            momentumBX,
            momentumBY,
            0.10
        );

        // Collision glow

        if (
            this.collisionOccurred
        ) {

            this.objectA.material.emissive
                .setHex(0x123c5a);

            this.objectB.material.emissive
                .setHex(0x5a2410);

        } else {

            this.objectA.material.emissive
                .setHex(0x000000);

            this.objectB.material.emissive
                .setHex(0x000000);

        }

    }

    // ========================================================
    // MEASUREMENTS
    // ========================================================

    updateMeasurements() {

        // --------------------------------------------
        // momentum
        // --------------------------------------------

        this.initialMomentumX =
            this.massA *
                this.velocityAX +
            this.massB *
                this.velocityBX;

        this.initialMomentumY =
            this.massA *
                this.velocityAY +
            this.massB *
                this.velocityBY;

        // Current momentum

        this.finalMomentumX =
            this.massA *
                this.velocityAX +
            this.massB *
                this.velocityBX;

        this.finalMomentumY =
            this.massA *
                this.velocityAY +
            this.massB *
                this.velocityBY;

        // --------------------------------------------
        // kinetic energy
        // --------------------------------------------

        this.initialKineticEnergy =
            0.5 *
            this.massA *
            (
                this.velocityAX ** 2 +
                this.velocityAY ** 2
            ) +
            0.5 *
            this.massB *
            (
                this.velocityBX ** 2 +
                this.velocityBY ** 2
            );

        this.finalKineticEnergy =
            this.initialKineticEnergy;

    }

    // ========================================================
    // STATE
    // ========================================================

    getState() {

        const speedA =
            Math.sqrt(
                this.velocityAX ** 2 +
                this.velocityAY ** 2
            );

        const speedB =
            Math.sqrt(
                this.velocityBX ** 2 +
                this.velocityBY ** 2
            );

        const momentumA =
            this.massA *
            speedA;

        const momentumB =
            this.massB *
            speedB;

        const kineticA =
            0.5 *
            this.massA *
            speedA ** 2;

        const kineticB =
            0.5 *
            this.massB *
            speedB ** 2;

        const totalMomentumX =
            this.massA *
                this.velocityAX +
            this.massB *
                this.velocityBX;

        const totalMomentumY =
            this.massA *
                this.velocityAY +
            this.massB *
                this.velocityBY;

        const totalMomentum =
            Math.sqrt(
                totalMomentumX ** 2 +
                totalMomentumY ** 2
            );

        const totalKineticEnergy =
            kineticA +
            kineticB;

        return {

            // simulation

            experiment:
                "Collision",

            collisionType:
                this.collisionType,

            running:
                this.running,

            time:
                this.time,

            collisionOccurred:
                this.collisionOccurred,

            collisionCount:
                this.collisionCount,

            // object A

            massA:
                this.massA,

            velocityA:
                speedA,

            velocityAX:
                this.velocityAX,

            velocityAY:
                this.velocityAY,

            positionAX:
                this.positionA.x,

            positionAY:
                this.positionA.z,

            momentumA:
                momentumA,

            kineticEnergyA:
                kineticA,

            // object B

            massB:
                this.massB,

            velocityB:
                speedB,

            velocityBX:
                this.velocityBX,

            velocityBY:
                this.velocityBY,

            positionBX:
                this.positionB.x,

            positionBY:
                this.positionB.z,

            momentumB:
                momentumB,

            kineticEnergyB:
                kineticB,

            // total

            totalMomentum:
                totalMomentum,

            totalMomentumX:
                totalMomentumX,

            totalMomentumY:
                totalMomentumY,

            totalKineticEnergy:
                totalKineticEnergy,

            // collision

            restitution:
                this.restitution,

            impulseA:
                this.collisionImpulseA,

            impulseB:
                this.collisionImpulseB,

            averageCollisionForce:
                this.collisionForce,

            // conservation

            momentumConserved:
                true,

            kineticEnergyConserved:
                Math.abs(
                    this.restitution - 1
                ) < 0.00001,

            stuckTogether:
                this.stuckTogether
        };
    }

    // ========================================================
    // MEASUREMENTS ALIAS
    // ========================================================

    getMeasurements() {

        return this.getState();

    }

    // ========================================================
    // SELECTABLE OBJECTS
    // ========================================================

    getSelectableObjects() {

        return this.selectable;

    }

    // ========================================================
    // ROOT OBJECT
    // ========================================================

    getObject() {

        return this.group;

    }

    // ========================================================
    // SET MASS A
    // ========================================================

    setMassA(value) {

        this.massA =
            Math.max(
                0.01,
                Number(value) || 1
            );

        this.rebuild();
    }

    // ========================================================
    // SET MASS B
    // ========================================================

    setMassB(value) {

        this.massB =
            Math.max(
                0.01,
                Number(value) || 1
            );

        this.rebuild();
    }

    // ========================================================
    // SET VELOCITY A
    // ========================================================

    setVelocityA(value) {

        this.velocityA =
            Number(value) || 0;

        this.velocityAX =
            this.velocityA;

        this.rebuild();
    }

    // ========================================================
    // SET VELOCITY B
    // ========================================================

    setVelocityB(value) {

        this.velocityB =
            Number(value) || 0;

        this.velocityBX =
            this.velocityB;

        this.rebuild();
    }

    // ========================================================
    // SET X VELOCITY A
    // ========================================================

    setVelocityAX(value) {

        this.velocityAX =
            Number(value) || 0;

        this.velocityA =
            this.velocityAX;

        this.rebuild();
    }

    // ========================================================
    // SET Y VELOCITY A
    // ========================================================

    setVelocityAY(value) {

        this.velocityAY =
            Number(value) || 0;

        this.rebuild();
    }

    // ========================================================
    // SET X VELOCITY B
    // ========================================================

    setVelocityBX(value) {

        this.velocityBX =
            Number(value) || 0;

        this.velocityB =
            this.velocityBX;

        this.rebuild();
    }

    // ========================================================
    // SET Y VELOCITY B
    // ========================================================

    setVelocityBY(value) {

        this.velocityBY =
            Number(value) || 0;

        this.rebuild();
    }

    // ========================================================
    // SET ANGLE A
    // ========================================================

    setAngleA(value) {

        this.angleA =
            Number(value) || 0;

        this.rebuild();
    }

    // ========================================================
    // SET ANGLE B
    // ========================================================

    setAngleB(value) {

        this.angleB =
            Number(value) || 0;

        this.rebuild();
    }

    // ========================================================
    // SET RESTITUTION
    // ========================================================

    setRestitution(value) {

        this.restitution =
            THREE.MathUtils.clamp(
                Number(value) || 0,
                0,
                1
            );

        if (
            this.collisionType ===
            "Perfectly Inelastic 1D"
        ) {

            this.restitution = 0;

        }

        this.rebuild();
    }

    // ========================================================
    // SET COEFFICIENT OF RESTITUTION
    // ========================================================

    setCoefficientOfRestitution(value) {

        this.setRestitution(value);

    }

    // ========================================================
    // SET COLLISION DURATION
    // ========================================================

    setCollisionDuration(value) {

        this.collisionDuration =
            Math.max(
                0.001,
                Number(value) || 0.05
            );

    }

    // ========================================================
    // GENERIC PARAMETER
    // ========================================================

    setParameter(
        name,
        value
    ) {

        switch (name) {

            case "massA":
                this.setMassA(value);
                break;

            case "massB":
                this.setMassB(value);
                break;

            case "velocityA":
                this.setVelocityA(value);
                break;

            case "velocityB":
                this.setVelocityB(value);
                break;

            case "velocityAX":
                this.setVelocityAX(value);
                break;

            case "velocityAY":
                this.setVelocityAY(value);
                break;

            case "velocityBX":
                this.setVelocityBX(value);
                break;

            case "velocityBY":
                this.setVelocityBY(value);
                break;

            case "angleA":
                this.setAngleA(value);
                break;

            case "angleB":
                this.setAngleB(value);
                break;

            case "restitution":
            case "coefficientOfRestitution":
                this.setRestitution(value);
                break;

            default:
                break;
        }

    }

    // ========================================================
    // COLLISION FORMULAS
    // ========================================================

    getPhysicsInfo() {

        return {

            momentum:
                "p = mv",

            conservationOfMomentum:
                "m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂",

            impulse:
                "J = Δp",

            elasticCollision:
                "Total momentum and total kinetic energy are conserved.",

            inelasticCollision:
                "Momentum is conserved but kinetic energy is not necessarily conserved.",

            perfectlyInelastic:
                "Objects move together after collision.",

            restitution:
                "e = relative speed of separation / relative speed of approach",

            kineticEnergy:
                "KE = 1/2 mv²"
        };
    }

    // ========================================================
    // EXPERIMENT INFORMATION
    // ========================================================

    getExperimentInfo() {

        const data = {

            "Elastic 1D": {

                title:
                    "Elastic Collision — 1D",

                description:
                    "Two bodies collide along one straight line.",

                physics:
                    "Momentum and kinetic energy are conserved.",

                restitution:
                    1
            },

            "Inelastic 1D": {

                title:
                    "Inelastic Collision — 1D",

                description:
                    "Two bodies collide and some kinetic energy is transformed.",

                physics:
                    "Momentum is conserved while kinetic energy decreases.",

                restitution:
                    this.restitution
            },

            "Perfectly Inelastic 1D": {

                title:
                    "Perfectly Inelastic Collision",

                description:
                    "The two objects stick together after collision.",

                physics:
                    "Momentum is conserved; the objects share one final velocity.",

                restitution:
                    0
            },

            "Elastic 2D": {

                title:
                    "Elastic Glancing Collision — 2D",

                description:
                    "Objects collide at an angle on a plane.",

                physics:
                    "Vector momentum and kinetic energy are conserved.",

                restitution:
                    1
            },

            "Inelastic 2D": {

                title:
                    "Inelastic Glancing Collision — 2D",

                description:
                    "Objects collide obliquely with partial kinetic-energy loss.",

                physics:
                    "Vector momentum is conserved.",

                restitution:
                    this.restitution
            },

            "Head-on Collision": {

                title:
                    "Head-on Collision",

                description:
                    "Objects approach one another along the same line.",

                physics:
                    "Conservation of linear momentum."
            },

            "Stationary Target": {

                title:
                    "Moving Object + Stationary Target",

                description:
                    "Object A strikes an initially stationary object B.",

                physics:
                    "Useful for studying momentum transfer."
            },

            "Opposite Direction": {

                title:
                    "Opposite Direction",

                description:
                    "Both objects initially move toward each other.",

                physics:
                    "Momentum signs must be treated carefully."
            },

            "Same Direction": {

                title:
                    "Same Direction",

                description:
                    "A faster object catches a slower object.",

                physics:
                    "Collision occurs when the separation becomes small enough."
            }

        };

        return (
            data[this.collisionType] ||
            data["Elastic 1D"]
        );
    }

    // ========================================================
    // DISPOSE OBJECT
    // ========================================================

    disposeObject(object) {

        if (!object)
            return;

        object.traverse(
            child => {

                if (child.geometry) {

                    child.geometry.dispose();

                }

                if (child.material) {

                    if (
                        Array.isArray(
                            child.material
                        )
                    ) {

                        child.material.forEach(
                            material => {

                                material.dispose();

                            }
                        );

                    } else {

                        child.material.dispose();

                    }
                }

            }
        );
    }

    // ========================================================
    // DISPOSE
    // ========================================================

    dispose() {

        this.running = false;

        this.clearRig();

        this.disposeObject(
            this.group
        );

        this.selectable = [];

    }
}