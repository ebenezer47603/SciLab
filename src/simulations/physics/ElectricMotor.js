// ============================================================
// SciLab - Physics Laboratory
// ElectricMotor.js
// Advanced DC Electric Motor Simulation
// ============================================================

import * as THREE from "three";

export class ElectricMotor {

    constructor(options = {}) {

        // ========================================================
        // ELECTRICAL PARAMETERS
        // ========================================================

        this.voltage = THREE.MathUtils.clamp(
            Number(options.voltage ?? 12),
            0,
            24
        );

        // User-controlled current limit / demand
        this.currentLimit = THREE.MathUtils.clamp(
            Number(options.current ?? 2),
            0,
            8
        );

        // Magnetic field strength in Tesla-like educational units
        this.fieldStrength = THREE.MathUtils.clamp(
            Number(options.field ?? 0.8),
            0,
            2
        );

        this.turns = Math.round(
            THREE.MathUtils.clamp(
                Number(options.turns ?? 150),
                20,
                300
            )
        );

        // ========================================================
        // MOTOR CONSTANTS
        // ========================================================

        this.coilArea = Number(options.coilArea ?? 0.012);

        this.resistance = Number(options.resistance ?? 2.0);

        this.inertia = Number(options.inertia ?? 0.018);

        this.viscousFriction = Number(
            options.friction ?? 0.018
        );

        this.loadTorque = Number(
            options.loadTorque ?? 0
        );

        this.ambientTemperature = 25;

        // ========================================================
        // DYNAMIC STATE
        // ========================================================

        this.angle = 0.22;

        this.angularVelocity = 0;

        this.angularAcceleration = 0;

        this.torque = 0;

        this.electromagneticTorque = 0;

        this.frictionTorque = 0;

        this.backEMF = 0;

        this.current = 0;

        this.inputPower = 0;

        this.electricalPower = 0;

        this.mechanicalPower = 0;

        this.copperLoss = 0;

        this.efficiency = 0;

        this.rpm = 0;

        this.temperature = this.ambientTemperature;

        this.time = 0;

        this.running = false;

        this.direction = 1;

        this.commutationSign = 1;

        this.commutationFactor = 0;

        // ========================================================
        // THREE.JS ROOT
        // ========================================================

        this.object = new THREE.Group();

        this.object.name = "ElectricMotor";

        // ========================================================
        // MAIN GROUPS
        // ========================================================

        this.base = new THREE.Group();

        this.stator = new THREE.Group();

        this.rotor = new THREE.Group();

        this.fieldGroup = new THREE.Group();

        this.circuit = new THREE.Group();

        this.powerSupply = new THREE.Group();

        this.particles = new THREE.Group();

        this.forceVectors = new THREE.Group();

        this.measurementVisuals = new THREE.Group();

        this.object.add(
            this.base,
            this.stator,
            this.rotor,
            this.fieldGroup,
            this.circuit,
            this.powerSupply,
            this.particles,
            this.forceVectors,
            this.measurementVisuals
        );

        // ========================================================
        // REFERENCES
        // ========================================================

        this.rotorCoil = null;

        this.rotorCore = null;

        this.shaft = null;

        this.commutator = null;

        this.commutatorSegments = [];

        this.brushPositive = null;

        this.brushNegative = null;

        this.fieldLines = [];

        this.fieldParticles = [];

        this.currentParticles = [];

        this.torqueArrow = null;

        this.forceArrows = [];

        this.coilPath = null;

        this.powerIndicator = null;

        // ========================================================
        // MATERIALS
        // ========================================================

        this.materials = {};

        this.createMaterials();

        // ========================================================
        // BUILD
        // ========================================================

        this.createBase();

        this.createStator();

        this.createRotor();

        this.createField();

        this.createCircuit();

        this.createPowerSupply();

        this.createParticles();

        this.createForceVectors();

        this.createTorqueIndicator();

        // ========================================================
        // INITIAL STATE
        // ========================================================

        this.calculatePhysics();

        this.updateVisuals();
    }

    // ============================================================
    // MATERIALS
    // ============================================================

    createMaterials() {

        this.materials.base = new THREE.MeshStandardMaterial({
            color: 0x252b35,
            metalness: 0.75,
            roughness: 0.28
        });

        this.materials.darkMetal = new THREE.MeshStandardMaterial({
            color: 0x3b414b,
            metalness: 0.9,
            roughness: 0.22
        });

        this.materials.steel = new THREE.MeshStandardMaterial({
            color: 0x747b86,
            metalness: 0.95,
            roughness: 0.2
        });

        this.materials.copper = new THREE.MeshStandardMaterial({
            color: 0xb87333,
            metalness: 0.85,
            roughness: 0.2,
            emissive: 0x331408,
            emissiveIntensity: 0.1
        });

        this.materials.coil = new THREE.MeshStandardMaterial({
            color: 0xff8a18,
            metalness: 0.8,
            roughness: 0.22,
            emissive: 0x7a2700,
            emissiveIntensity: 0.2
        });

        this.materials.red = new THREE.MeshStandardMaterial({
            color: 0xc62828,
            metalness: 0.45,
            roughness: 0.3
        });

        this.materials.blue = new THREE.MeshStandardMaterial({
            color: 0x1565c0,
            metalness: 0.45,
            roughness: 0.3
        });

        this.materials.brush = new THREE.MeshStandardMaterial({
            color: 0x777777,
            metalness: 0.8,
            roughness: 0.4
        });

        this.materials.yellow = new THREE.MeshStandardMaterial({
            color: 0xffd740,
            emissive: 0xffb300,
            emissiveIntensity: 1.5
        });

        this.materials.green = new THREE.MeshStandardMaterial({
            color: 0x42d67a,
            emissive: 0x168a48,
            emissiveIntensity: 0.8
        });

        this.materials.black = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.25,
            roughness: 0.6
        });
    }

    // ============================================================
    // BASE
    // ============================================================

    createBase() {

        const baseGeometry = new THREE.BoxGeometry(
            6.2,
            0.35,
            3.8
        );

        const baseMesh = new THREE.Mesh(
            baseGeometry,
            this.materials.base
        );

        baseMesh.position.y = -1.65;

        this.base.add(baseMesh);

        // Feet

        const footGeometry = new THREE.CylinderGeometry(
            0.25,
            0.25,
            0.35,
            20
        );

        const footPositions = [
            [-2.4, -1.95, -1.35],
            [ 2.4, -1.95, -1.35],
            [-2.4, -1.95,  1.35],
            [ 2.4, -1.95,  1.35]
        ];

        for (const [x, y, z] of footPositions) {

            const foot = new THREE.Mesh(
                footGeometry,
                this.materials.darkMetal
            );

            foot.position.set(x, y, z);

            this.base.add(foot);
        }

        // Motor mounting rails

        const railGeometry = new THREE.BoxGeometry(
            5.4,
            0.12,
            0.18
        );

        for (const z of [-1.25, 1.25]) {

            const rail = new THREE.Mesh(
                railGeometry,
                this.materials.steel
            );

            rail.position.set(
                0,
                -1.42,
                z
            );

            this.base.add(rail);
        }
    }

    // ============================================================
    // STATOR / N-S MAGNETS
    // ============================================================

    createStator() {

        const poleGeometry = new THREE.BoxGeometry(
            1.05,
            2.7,
            2.4
        );

        const north = new THREE.Mesh(
            poleGeometry,
            this.materials.red
        );

        north.position.set(
            -2.05,
            0,
            0
        );

        north.userData.pole = "N";

        this.stator.add(north);

        const south = new THREE.Mesh(
            poleGeometry,
            this.materials.blue
        );

        south.position.set(
            2.05,
            0,
            0
        );

        south.userData.pole = "S";

        this.stator.add(south);

        // Pole faces

        const faceGeometry = new THREE.BoxGeometry(
            0.25,
            2.25,
            2.8
        );

        const northFace = new THREE.Mesh(
            faceGeometry,
            this.materials.red
        );

        northFace.position.set(
            -1.48,
            0,
            0
        );

        this.stator.add(northFace);

        const southFace = new THREE.Mesh(
            faceGeometry,
            this.materials.blue
        );

        southFace.position.set(
            1.48,
            0,
            0
        );

        this.stator.add(southFace);

        // Pole cores

        const coreGeometry = new THREE.CylinderGeometry(
            0.95,
            0.95,
            1.05,
            32
        );

        const northCore = new THREE.Mesh(
            coreGeometry,
            this.materials.red
        );

        northCore.rotation.z = Math.PI / 2;

        northCore.position.x = -1.55;

        this.stator.add(northCore);

        const southCore = new THREE.Mesh(
            coreGeometry,
            this.materials.blue
        );

        southCore.rotation.z = Math.PI / 2;

        southCore.position.x = 1.55;

        this.stator.add(southCore);
    }

    // ============================================================
    // ROTOR
    // ============================================================

    createRotor() {

        // --------------------------------------------------------
        // Rotor core
        // --------------------------------------------------------

        const coreGeometry = new THREE.CylinderGeometry(
            0.72,
            0.72,
            2.25,
            48
        );

        this.rotorCore = new THREE.Mesh(
            coreGeometry,
            this.materials.darkMetal
        );

        this.rotorCore.rotation.z = Math.PI / 2;

        this.rotor.add(this.rotorCore);

        // --------------------------------------------------------
        // Shaft
        // --------------------------------------------------------

        const shaftGeometry = new THREE.CylinderGeometry(
            0.16,
            0.16,
            4.8,
            32
        );

        this.shaft = new THREE.Mesh(
            shaftGeometry,
            this.materials.steel
        );

        this.shaft.rotation.z = Math.PI / 2;

        this.shaft.position.x = 0;

        this.rotor.add(this.shaft);

        // --------------------------------------------------------
        // Bearings
        // --------------------------------------------------------

        const bearingGeometry = new THREE.CylinderGeometry(
            0.42,
            0.42,
            0.28,
            32
        );

        for (const x of [-1.35, 1.35]) {

            const bearing = new THREE.Mesh(
                bearingGeometry,
                this.materials.darkMetal
            );

            bearing.rotation.z = Math.PI / 2;

            bearing.position.x = x;

            this.rotor.add(bearing);
        }

        // --------------------------------------------------------
        // Coil
        // --------------------------------------------------------

        this.rebuildRotorCoil();

        // --------------------------------------------------------
        // Commutator
        // --------------------------------------------------------

        this.createCommutator();
    }

    // ============================================================
    // REALISTIC VISIBLE COIL
    // ============================================================

    rebuildRotorCoil() {

        if (this.rotorCoil) {

            this.rotor.remove(this.rotorCoil);

            this.rotorCoil.geometry.dispose();

            if (this.rotorCoil.material) {
                this.rotorCoil.material.dispose();
            }
        }

        /*
         * We don't create hundreds of separate meshes.
         * Instead, one TubeGeometry represents the winding.
         *
         * The visible winding density follows the real number
         * of electrical turns.
         */

        const visibleTurns = THREE.MathUtils.clamp(
            Math.round(this.turns / 5),
            5,
            60
        );

        const radiusY = 0.82;

        const radiusZ = 0.82;

        const coilLength = 1.75;

        const points = [];

        const samplesPerTurn = 10;

        const totalSamples =
            visibleTurns * samplesPerTurn;

        for (let i = 0; i <= totalSamples; i++) {

            const t =
                i / totalSamples;

            const theta =
                t * visibleTurns * Math.PI * 2;

            const x =
                -coilLength / 2 +
                t * coilLength;

            const y =
                radiusY * Math.cos(theta);

            const z =
                radiusZ * Math.sin(theta);

            points.push(
                new THREE.Vector3(
                    x,
                    y,
                    z
                )
            );
        }

        this.coilPath =
            new THREE.CatmullRomCurve3(
                points
            );

        const tubeGeometry =
            new THREE.TubeGeometry(
                this.coilPath,
                Math.max(100, totalSamples),
                0.035,
                6,
                false
            );

        this.rotorCoil = new THREE.Mesh(
            tubeGeometry,
            this.materials.coil
        );

        this.rotorCoil.userData.turns =
            this.turns;

        this.rotor.add(this.rotorCoil);
    }

    // ============================================================
    // COMMUTATOR
    // ============================================================

    createCommutator() {

        const commutatorBodyGeometry =
            new THREE.CylinderGeometry(
                0.28,
                0.28,
                0.38,
                32
            );

        this.commutator =
            new THREE.Group();

        this.commutator.position.x =
            1.55;

        this.rotor.add(
            this.commutator
        );

        const body = new THREE.Mesh(
            commutatorBodyGeometry,
            this.materials.copper
        );

        body.rotation.z =
            Math.PI / 2;

        this.commutator.add(body);

        // Four visible commutator segments

        const segmentGeometry =
            new THREE.BoxGeometry(
                0.42,
                0.035,
                0.20
            );

        this.commutatorSegments = [];

        for (let i = 0; i < 4; i++) {

            const segment =
                new THREE.Mesh(
                    segmentGeometry,
                    this.materials.copper
                );

            const a =
                i * Math.PI / 2;

            segment.position.y =
                Math.cos(a) * 0.22;

            segment.position.z =
                Math.sin(a) * 0.22;

            segment.rotation.x =
                -a;

            this.commutator.add(
                segment
            );

            this.commutatorSegments.push(
                segment
            );
        }
    }

    // ============================================================
    // MAGNETIC FIELD
    // ============================================================

    createField() {

        this.fieldGroup.clear();

        this.fieldLines = [];

        this.fieldParticles = [];

        const lineMaterial =
            new THREE.LineBasicMaterial({
                color: 0x4fc3f7,
                transparent: true,
                opacity: 0.55
            });

        /*
         * Field direction outside the magnet:
         *
         * N  --------->  S
         */

        const levels = 9;

        for (let i = 0; i < levels; i++) {

            const offset =
                -1.25 +
                (i / (levels - 1)) * 2.5;

            const points = [];

            const segments = 40;

            for (let j = 0; j <= segments; j++) {

                const t =
                    j / segments;

                const x =
                    -1.45 +
                    t * 2.9;

                const curve =
                    Math.sin(
                        t * Math.PI
                    ) * 0.42;

                const y =
                    offset;

                const z =
                    curve *
                    (1 -
                        Math.abs(offset) /
                        1.8
                    );

                points.push(
                    new THREE.Vector3(
                        x,
                        y,
                        z
                    )
                );
            }

            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints(points);

            const line =
                new THREE.Line(
                    geometry,
                    lineMaterial.clone()
                );

            line.userData.fieldLine =
                true;

            this.fieldGroup.add(line);

            this.fieldLines.push(
                line
            );
        }

        // Field direction arrows

        for (let i = 0; i < 5; i++) {

            const y =
                -1 +
                i * 0.5;

            const arrow =
                new THREE.ArrowHelper(
                    new THREE.Vector3(
                        1,
                        0,
                        0
                    ),
                    new THREE.Vector3(
                        -0.8,
                        y,
                        0
                    ),
                    0.45,
                    0x4fc3f7,
                    0.12,
                    0.08
                );

            this.fieldGroup.add(
                arrow
            );
        }
    }

    // ============================================================
    // ELECTRICAL CIRCUIT
    // ============================================================

    createCircuit() {

        // Positive brush

        const brushGeometry =
            new THREE.BoxGeometry(
                0.25,
                0.55,
                0.35
            );

        this.brushPositive =
            new THREE.Mesh(
                brushGeometry,
                this.materials.brush
            );

        this.brushPositive.position.set(
            1.55,
            0.48,
            0
        );

        this.circuit.add(
            this.brushPositive
        );

        // Negative brush

        this.brushNegative =
            new THREE.Mesh(
                brushGeometry.clone(),
                this.materials.brush
            );

        this.brushNegative.position.set(
            1.55,
            -0.48,
            0
        );

        this.circuit.add(
            this.brushNegative
        );

        // Brush holders

        const holderGeometry =
            new THREE.BoxGeometry(
                0.42,
                0.18,
                0.5
            );

        for (const y of [0.75, -0.75]) {

            const holder =
                new THREE.Mesh(
                    holderGeometry,
                    this.materials.darkMetal
                );

            holder.position.set(
                1.55,
                y,
                0
            );

            this.circuit.add(
                holder
            );
        }

        // Wires

        this.createWire(
            new THREE.Vector3(
                1.55,
                0.75,
                0
            ),
            new THREE.Vector3(
                2.7,
                0.75,
                0
            )
        );

        this.createWire(
            new THREE.Vector3(
                1.55,
                -0.75,
                0
            ),
            new THREE.Vector3(
                2.7,
                -0.75,
                0
            )
        );
    }

    // ============================================================
    // WIRE
    // ============================================================

    createWire(start, end) {

        const direction =
            new THREE.Vector3()
                .subVectors(end, start);

        const length =
            direction.length();

        const geometry =
            new THREE.CylinderGeometry(
                0.035,
                0.035,
                length,
                10
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x202020,
                metalness: 0.45,
                roughness: 0.35
            });

        const wire =
            new THREE.Mesh(
                geometry,
                material
            );

        wire.position
            .copy(start)
            .add(end)
            .multiplyScalar(0.5);

        wire.quaternion.setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction.normalize()
        );

        this.circuit.add(
            wire
        );
    }

    // ============================================================
    // POWER SUPPLY
    // ============================================================

    createPowerSupply() {

        const bodyGeometry =
            new THREE.BoxGeometry(
                1.25,
                1.05,
                1.35
            );

        const body =
            new THREE.Mesh(
                bodyGeometry,
                this.materials.darkMetal
            );

        body.position.set(
            3.25,
            0,
            0
        );

        this.powerSupply.add(
            body
        );

        // Positive terminal

        const terminalGeometry =
            new THREE.CylinderGeometry(
                0.09,
                0.09,
                0.22,
                16
            );

        const positive =
            new THREE.Mesh(
                terminalGeometry,
                this.materials.red
            );

        positive.position.set(
            3.25,
            0.62,
            -0.28
        );

        this.powerSupply.add(
            positive
        );

        // Negative terminal

        const negative =
            new THREE.Mesh(
                terminalGeometry,
                this.materials.blue
            );

        negative.position.set(
            3.25,
            0.62,
            0.28
        );

        this.powerSupply.add(
            negative
        );

        // Power indicator

        const indicatorGeometry =
            new THREE.SphereGeometry(
                0.08,
                16,
                16
            );

        this.powerIndicator =
            new THREE.Mesh(
                indicatorGeometry,
                this.materials.green
            );

        this.powerIndicator.position.set(
            3.25,
            0.18,
            -0.68
        );

        this.powerSupply.add(
            this.powerIndicator
        );
    }

    // ============================================================
    // CURRENT PARTICLES
    // ============================================================

    createParticles() {

        const particleGeometry =
            new THREE.SphereGeometry(
                0.045,
                10,
                10
            );

        for (let i = 0; i < 32; i++) {

            const particle =
                new THREE.Mesh(
                    particleGeometry,
                    this.materials.yellow
                );

            particle.userData.phase =
                i / 32;

            particle.userData.speed =
                0.25 +
                (i % 5) * 0.035;

            this.particles.add(
                particle
            );

            this.currentParticles.push(
                particle
            );
        }

        // Field particles

        const fieldParticleGeometry =
            new THREE.SphereGeometry(
                0.028,
                8,
                8
            );

        for (let i = 0; i < 18; i++) {

            const particle =
                new THREE.Mesh(
                    fieldParticleGeometry,
                    new THREE.MeshStandardMaterial({
                        color: 0x4fc3f7,
                        emissive: 0x0288d1,
                        emissiveIntensity: 1.3
                    })
                );

            particle.userData.lineIndex =
                i % this.fieldLines.length;

            particle.userData.phase =
                Math.random();

            this.fieldGroup.add(
                particle
            );

            this.fieldParticles.push(
                particle
            );
        }
    }

    // ============================================================
    // FORCE VECTORS
    // ============================================================

    createForceVectors() {

        /*
         * Force on the two active coil sides.
         *
         * B is approximately along X.
         * Current-carrying sides experience opposite forces,
         * creating torque around the shaft.
         */

        const upperArrow =
            new THREE.ArrowHelper(
                new THREE.Vector3(
                    0,
                    0,
                    1
                ),
                new THREE.Vector3(
                    0,
                    0.78,
                    0
                ),
                0.55,
                0xffd740,
                0.12,
                0.08
            );

        const lowerArrow =
            new THREE.ArrowHelper(
                new THREE.Vector3(
                    0,
                    0,
                    -1
                ),
                new THREE.Vector3(
                    0,
                    -0.78,
                    0
                ),
                0.55,
                0xffd740,
                0.12,
                0.08
            );

        this.forceVectors.add(
            upperArrow,
            lowerArrow
        );

        this.forceArrows = [
            upperArrow,
            lowerArrow
        ];
    }

    // ============================================================
    // TORQUE INDICATOR
    // ============================================================

    createTorqueIndicator() {

        this.torqueArrow =
            new THREE.ArrowHelper(
                new THREE.Vector3(
                    1,
                    0,
                    0
                ),
                new THREE.Vector3(
                    0,
                    0,
                    0
                ),
                1,
                0xff7043,
                0.2,
                0.12
            );

        this.forceVectors.add(
            this.torqueArrow
        );
    }

    // ============================================================
    // PHYSICS
    // ============================================================

    calculatePhysics() {

        // --------------------------------------------------------
        // Motor torque constant
        //
        // Kt = N B A
        // --------------------------------------------------------

        const torqueConstant =
            this.turns *
            this.fieldStrength *
            this.coilArea;

        // --------------------------------------------------------
        // Back EMF
        //
        // E = Ke * omega
        //
        // For this educational SI-like model we use:
        // Ke ≈ Kt
        // --------------------------------------------------------

        const Ke =
            torqueConstant;

        this.backEMF =
            Ke *
            this.angularVelocity;

        // --------------------------------------------------------
        // Available voltage after back EMF
        // --------------------------------------------------------

        const effectiveVoltage =
            Math.max(
                0,
                this.voltage -
                Math.abs(this.backEMF)
            );

        // --------------------------------------------------------
        // Ohm's law
        //
        // I = (V - E) / R
        // --------------------------------------------------------

        const ohmicCurrent =
            effectiveVoltage /
            Math.max(
                this.resistance,
                0.001
            );

        // Current demand is limited by UI current setting
        this.current =
            Math.min(
                this.currentLimit,
                ohmicCurrent
            );

        // --------------------------------------------------------
        // Commutator
        //
        // The commutator reverses coil current every half turn.
        // This keeps average torque in the same direction.
        // --------------------------------------------------------

        const sine =
            Math.sin(this.angle);

        this.commutationSign =
            sine >= 0
                ? 1
                : -1;

        this.commutationFactor =
            Math.abs(sine);

        // --------------------------------------------------------
        // Electromagnetic torque
        //
        // τ = N B I A sin(theta)
        //
        // Commutator changes current direction, therefore:
        //
        // τeffective ≈ N B I A |sin(theta)|
        // --------------------------------------------------------

        this.electromagneticTorque =
            torqueConstant *
            this.current *
            this.commutationFactor;

        // --------------------------------------------------------
        // Friction
        // --------------------------------------------------------

        this.frictionTorque =
            this.viscousFriction *
            this.angularVelocity;

        // --------------------------------------------------------
        // Net torque
        // --------------------------------------------------------

        let netTorque =
            this.electromagneticTorque;

        netTorque -=
            this.frictionTorque;

        netTorque -=
            this.loadTorque;

        // Prevent tiny numerical drift
        if (
            Math.abs(this.angularVelocity) < 0.0001 &&
            netTorque < 0
        ) {
            netTorque = 0;
        }

        this.torque =
            Math.max(
                0,
                netTorque
            );

        // --------------------------------------------------------
        // Angular acceleration
        //
        // α = τ / J
        // --------------------------------------------------------

        this.angularAcceleration =
            this.torque /
            Math.max(
                this.inertia,
                0.0001
            );

        // --------------------------------------------------------
        // RPM
        // --------------------------------------------------------

        this.rpm =
            Math.abs(
                this.angularVelocity
            ) *
            60 /
            (2 * Math.PI);

        // --------------------------------------------------------
        // Electrical power
        // --------------------------------------------------------

        this.inputPower =
            this.voltage *
            this.current;

        this.electricalPower =
            this.inputPower;

        // --------------------------------------------------------
        // Copper loss
        //
        // P = I²R
        // --------------------------------------------------------

        this.copperLoss =
            this.current *
            this.current *
            this.resistance;

        // --------------------------------------------------------
        // Mechanical power
        // --------------------------------------------------------

        this.mechanicalPower =
            Math.abs(
                this.electromagneticTorque *
                this.angularVelocity
            );

        // --------------------------------------------------------
        // Efficiency
        // --------------------------------------------------------

        if (this.inputPower > 0.00001) {

            this.efficiency =
                THREE.MathUtils.clamp(
                    (
                        this.mechanicalPower /
                        this.inputPower
                    ) * 100,
                    0,
                    100
                );

        } else {

            this.efficiency = 0;
        }
    }

    // ============================================================
    // UPDATE
    // ============================================================

    update(delta = 0.016) {

        delta =
            THREE.MathUtils.clamp(
                Number(delta) || 0.016,
                0,
                0.05
            );

        if (!this.running) {

            this.updateVisuals();

            return;
        }

        this.time += delta;

        // --------------------------------------------------------
        // Recalculate electrical system
        // --------------------------------------------------------

        this.calculatePhysics();

        // --------------------------------------------------------
        // Startup assist
        //
        // A simple single-loop armature can theoretically be at
        // zero torque position. A small starting disturbance
        // represents the real motor's mechanical imperfection
        // and commutator action.
        // --------------------------------------------------------

        let acceleration =
            this.angularAcceleration;

        if (
            Math.abs(this.angularVelocity) <
                0.05 &&
            this.current > 0 &&
            this.fieldStrength > 0
        ) {

            acceleration +=
                0.12;
        }

        // --------------------------------------------------------
        // Angular velocity
        // --------------------------------------------------------

        this.angularVelocity +=
            acceleration *
            delta;

        // Safety physical clamp
        this.angularVelocity =
            THREE.MathUtils.clamp(
                this.angularVelocity,
                -500,
                500
            );

        // --------------------------------------------------------
        // Angle
        // --------------------------------------------------------

        this.angle +=
            this.angularVelocity *
            delta;

        // Keep angle manageable
        if (
            Math.abs(this.angle) >
            Math.PI * 1000
        ) {

            this.angle =
                this.angle %
                (Math.PI * 2);
        }

        // --------------------------------------------------------
        // Rotor rotation
        // Shaft axis = X
        // --------------------------------------------------------

        this.rotor.rotation.x =
            this.angle;

        // --------------------------------------------------------
        // Thermal model
        // --------------------------------------------------------

        const heating =
            this.copperLoss *
            0.08;

        const cooling =
            (
                this.temperature -
                this.ambientTemperature
            ) *
            0.025;

        this.temperature +=
            (
                heating -
                cooling
            ) *
            delta;

        this.temperature =
            THREE.MathUtils.clamp(
                this.temperature,
                this.ambientTemperature,
                180
            );

        // --------------------------------------------------------
        // Visuals
        // --------------------------------------------------------

        this.updateVisuals();
    }

    // ============================================================
    // VISUAL UPDATE
    // ============================================================

    updateVisuals() {

        const currentIntensity =
            THREE.MathUtils.clamp(
                this.current / 8,
                0,
                1
            );

        const fieldIntensity =
            THREE.MathUtils.clamp(
                this.fieldStrength / 2,
                0,
                1
            );

        // --------------------------------------------------------
        // Field lines
        // --------------------------------------------------------

        for (const line of this.fieldLines) {

            if (!line.material) continue;

            line.material.opacity =
                0.18 +
                fieldIntensity *
                0.72;
        }

        // --------------------------------------------------------
        // Coil brightness
        // --------------------------------------------------------

        if (
            this.rotorCoil &&
            this.rotorCoil.material
        ) {

            this.rotorCoil.material.emissiveIntensity =
                0.15 +
                currentIntensity *
                1.8;
        }

        // --------------------------------------------------------
        // Commutator follows rotor
        // --------------------------------------------------------

        if (this.commutator) {

            this.commutator.rotation.x =
                this.angle;
        }

        // --------------------------------------------------------
        // Brushes glow when current flows
        // --------------------------------------------------------

        if (
            this.brushPositive &&
            this.brushNegative
        ) {

            const glow =
                0.1 +
                currentIntensity *
                1.2;

            this.brushPositive.material.emissiveIntensity =
                glow;

            this.brushNegative.material.emissiveIntensity =
                glow;
        }

        // --------------------------------------------------------
        // Current particles
        // --------------------------------------------------------

        this.updateCurrentParticles();

        // --------------------------------------------------------
        // Magnetic field particles
        // --------------------------------------------------------

        this.updateFieldParticles();

        // --------------------------------------------------------
        // Force arrows
        // --------------------------------------------------------

        const forceScale =
            THREE.MathUtils.clamp(
                this.electromagneticTorque * 3,
                0.05,
                1.5
            );

        for (
            const arrow of this.forceArrows
        ) {

            arrow.setLength(
                forceScale,
                0.14,
                0.09
            );

            arrow.visible =
                this.current > 0 &&
                this.fieldStrength > 0;
        }

        // --------------------------------------------------------
        // Torque indicator
        // --------------------------------------------------------

        if (this.torqueArrow) {

            const torqueScale =
                THREE.MathUtils.clamp(
                    this.electromagneticTorque * 4,
                    0.05,
                    2
                );

            this.torqueArrow.setLength(
                torqueScale,
                0.2,
                0.12
            );

            this.torqueArrow.visible =
                this.electromagneticTorque >
                0.0001;
        }

        // --------------------------------------------------------
        // Power indicator
        // --------------------------------------------------------

        if (this.powerIndicator) {

            const active =
                this.running &&
                this.current > 0 &&
                this.voltage > 0;

            this.powerIndicator.visible =
                true;

            this.powerIndicator.material
                .emissiveIntensity =
                active
                    ? 2.5
                    : 0.15;
        }
    }

    // ============================================================
    // CURRENT PARTICLES
    // ============================================================

    updateCurrentParticles() {

        if (
            !this.coilPath ||
            !this.currentParticles.length
        ) {
            return;
        }

        const speed =
            THREE.MathUtils.clamp(
                Math.abs(
                    this.angularVelocity
                ) * 0.04,
                0.02,
                1.5
            );

        const direction =
            this.commutationSign;

        for (
            const particle
            of this.currentParticles
        ) {

            particle.userData.phase +=
                speed *
                particle.userData.speed *
                0.016 *
                direction;

            particle.userData.phase =
                particle.userData.phase %
                1;

            if (
                particle.userData.phase < 0
            ) {
                particle.userData.phase += 1;
            }

            const point =
                this.coilPath.getPointAt(
                    particle.userData.phase
                );

            particle.position.copy(
                point
            );

            particle.visible =
                this.current > 0.01 &&
                this.running;

            particle.material.opacity =
                THREE.MathUtils.clamp(
                    this.current / 4,
                    0.15,
                    1
                );
        }
    }

    // ============================================================
    // FIELD PARTICLES
    // ============================================================

    updateFieldParticles() {

        if (
            !this.fieldLines.length
        ) {
            return;
        }

        for (
            const particle
            of this.fieldParticles
        ) {

            particle.userData.phase +=
                0.002 +
                this.fieldStrength *
                0.0008;

            if (
                particle.userData.phase >= 1
            ) {
                particle.userData.phase -= 1;
            }

            const index =
                particle.userData.lineIndex;

            const line =
                this.fieldLines[index];

            if (!line) continue;

            const positionAttribute =
                line.geometry
                    .attributes.position;

            const count =
                positionAttribute.count;

            const p =
                particle.userData.phase *
                (count - 1);

            const i =
                Math.floor(p);

            const next =
                Math.min(
                    i + 1,
                    count - 1
                );

            const alpha =
                p - i;

            const a =
                new THREE.Vector3(
                    positionAttribute
                        .getX(i),
                    positionAttribute
                        .getY(i),
                    positionAttribute
                        .getZ(i)
                );

            const b =
                new THREE.Vector3(
                    positionAttribute
                        .getX(next),
                    positionAttribute
                        .getY(next),
                    positionAttribute
                        .getZ(next)
                );

            particle.position
                .copy(a)
                .lerp(b, alpha);

            particle.visible =
                this.fieldStrength > 0;
        }
    }

    // ============================================================
    // START
    // ============================================================

    start() {

        this.running = true;

        this.calculatePhysics();

        this.updateVisuals();

        return this;
    }

    // ============================================================
    // PAUSE
    // ============================================================

    pause() {

        this.running = false;

        this.updateVisuals();

        return this;
    }

    // ============================================================
    // RESET
    // ============================================================

    reset() {

        this.angle = 0.22;

        this.angularVelocity = 0;

        this.angularAcceleration = 0;

        this.torque = 0;

        this.electromagneticTorque = 0;

        this.frictionTorque = 0;

        this.backEMF = 0;

        this.current = 0;

        this.inputPower = 0;

        this.electricalPower = 0;

        this.mechanicalPower = 0;

        this.copperLoss = 0;

        this.efficiency = 0;

        this.rpm = 0;

        this.temperature =
            this.ambientTemperature;

        this.time = 0;

        this.running = false;

        this.rotor.rotation.x =
            this.angle;

        this.calculatePhysics();

        this.updateVisuals();

        return this;
    }

    // ============================================================
    // SET VOLTAGE
    // ============================================================

    setVoltage(value) {

        this.voltage =
            THREE.MathUtils.clamp(
                Number(value) || 0,
                0,
                24
            );

        this.calculatePhysics();

        this.updateVisuals();

        return this.voltage;
    }

    // ============================================================
    // SET CURRENT
    // ============================================================

    setCurrent(value) {

        this.currentLimit =
            THREE.MathUtils.clamp(
                Number(value) || 0,
                0,
                8
            );

        this.calculatePhysics();

        this.updateVisuals();

        return this.currentLimit;
    }

    // ============================================================
    // SET MAGNETIC FIELD
    // ============================================================

    setField(value) {

        this.fieldStrength =
            THREE.MathUtils.clamp(
                Number(value) || 0,
                0,
                2
            );

        this.calculatePhysics();

        this.updateVisuals();

        return this.fieldStrength;
    }

    // ============================================================
    // SET TURNS
    // ============================================================

    setTurns(value) {

        this.turns =
            Math.round(
                THREE.MathUtils.clamp(
                    Number(value) || 20,
                    20,
                    300
                )
            );

        this.rebuildRotorCoil();

        this.calculatePhysics();

        this.updateVisuals();

        return this.turns;
    }

    // ============================================================
    // SET LOAD
    // ============================================================

    setLoadTorque(value) {

        this.loadTorque =
            Math.max(
                0,
                Number(value) || 0
            );

        this.calculatePhysics();

        return this.loadTorque;
    }

    // ============================================================
    // SET RESISTANCE
    // ============================================================

    setResistance(value) {

        this.resistance =
            Math.max(
                0.05,
                Number(value) || 0.05
            );

        this.calculatePhysics();

        return this.resistance;
    }

    // ============================================================
    // GET STATE
    // ============================================================

    getState() {

        return {

            running:
                this.running,

            voltage:
                this.voltage,

            current:
                this.current,

            currentLimit:
                this.currentLimit,

            field:
                this.fieldStrength,

            fieldStrength:
                this.fieldStrength,

            turns:
                this.turns,

            angle:
                this.angle,

            angularVelocity:
                this.angularVelocity,

            angularAcceleration:
                this.angularAcceleration,

            torque:
                this.torque,

            electromagneticTorque:
                this.electromagneticTorque,

            frictionTorque:
                this.frictionTorque,

            loadTorque:
                this.loadTorque,

            backEMF:
                this.backEMF,

            rpm:
                this.rpm,

            inputPower:
                this.inputPower,

            electricalPower:
                this.electricalPower,

            mechanicalPower:
                this.mechanicalPower,

            copperLoss:
                this.copperLoss,

            efficiency:
                this.efficiency,

            temperature:
                this.temperature,

            commutationSign:
                this.commutationSign,

            commutationFactor:
                this.commutationFactor,

            time:
                this.time
        };
    }

    // ============================================================
    // MEASUREMENTS
    // ============================================================

    getMeasurements() {

        return {

            voltage: Number(
                this.voltage.toFixed(3)
            ),

            current: Number(
                this.current.toFixed(3)
            ),

            magneticField: Number(
                this.fieldStrength.toFixed(3)
            ),

            turns:
                this.turns,

            torque: Number(
                this.electromagneticTorque
                    .toFixed(4)
            ),

            netTorque: Number(
                this.torque.toFixed(4)
            ),

            angularVelocity: Number(
                this.angularVelocity
                    .toFixed(3)
            ),

            angularAcceleration: Number(
                this.angularAcceleration
                    .toFixed(3)
            ),

            rpm: Number(
                this.rpm.toFixed(1)
            ),

            backEMF: Number(
                this.backEMF.toFixed(3)
            ),

            power: Number(
                this.inputPower.toFixed(3)
            ),

            inputPower: Number(
                this.inputPower.toFixed(3)
            ),

            mechanicalPower: Number(
                this.mechanicalPower
                    .toFixed(3)
            ),

            copperLoss: Number(
                this.copperLoss.toFixed(3)
            ),

            efficiency: Number(
                this.efficiency.toFixed(2)
            ),

            temperature: Number(
                this.temperature.toFixed(2)
            )
        };
    }

    // ============================================================
    // EDUCATIONAL DATA
    // ============================================================

    getEducationalData() {

        return {

            title:
                "DC Electric Motor",

            principle:
                "Electrical energy is converted into mechanical rotational energy.",

            sequence: [
                "Voltage drives current",
                "Current interacts with magnetic field",
                "Magnetic force acts on the coil",
                "Forces create electromagnetic torque",
                "Torque produces angular acceleration",
                "Angular velocity produces back EMF",
                "Back EMF reduces current as speed rises"
            ],

            formulas: {

                force:
                    "F = B I L",

                torque:
                    "τ = N B I A sin(θ)",

                effectiveTorque:
                    "τ ≈ N B I A |sin(θ)|",

                backEMF:
                    "E = Kₑω",

                current:
                    "I = (V − E) / R",

                angularAcceleration:
                    "α = τ / J",

                rpm:
                    "RPM = ω × 60 / 2π",

                electricalPower:
                    "Pₑ = V I",

                mechanicalPower:
                    "Pₘ = τω",

                copperLoss:
                    "P_loss = I²R",

                efficiency:
                    "η = Pₘ / Pₑ × 100%"
            },

            explanation:
                "The commutator reverses the coil current every half rotation so that the electromagnetic torque continues driving the rotor in the same direction."
        };
    }

    // ============================================================
    // FORMULAS
    // ============================================================

    getFormulas() {

        return {

            force:
                "F = BIL",

            torque:
                "τ = NBIA sin(θ)",

            commutatedTorque:
                "τ = NBIA |sin(θ)|",

            backEMF:
                "E = Kₑω",

            current:
                "I = (V − E)/R",

            angularAcceleration:
                "α = τ/J",

            speed:
                "ω = dθ/dt",

            rpm:
                "RPM = ω60/(2π)",

            inputPower:
                "P = VI",

            mechanicalPower:
                "P = τω",

            copperLoss:
                "P = I²R",

            efficiency:
                "η = Pmechanical/Pinput × 100%"
        };
    }

    // ============================================================
    // GET THREE.JS OBJECT
    // ============================================================

    getObject() {

        return this.object;
    }

    // ============================================================
    // DISPOSE
    // ============================================================

    dispose() {

        this.object.traverse(
            (child) => {

                if (child.geometry) {

                    child.geometry.dispose();
                }

                if (child.material) {

                    if (
                        Array.isArray(
                            child.material
                        )
                    ) {

                        for (
                            const material
                            of child.material
                        ) {

                            material.dispose();
                        }

                    } else {

                        child.material.dispose();
                    }
                }
            }
        );

        this.object.clear();

        this.fieldLines = [];

        this.fieldParticles = [];

        this.currentParticles = [];

        this.forceArrows = [];

        this.commutatorSegments = [];

        this.rotorCoil = null;

        this.commutator = null;

        this.running = false;
    }
}