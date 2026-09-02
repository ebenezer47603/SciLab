// ============================================================
// SciLab Physics - Magnetic Induction
// Faraday's Law + Lenz's Law + Ohm's Law
// Full 3D simulation
// Compatible with PhysicsSimulation.js
// ============================================================

import * as THREE from "three";

export class MagneticInduction {

    constructor(options = {}) {

        // =====================================================
        // CONTROLS
        // =====================================================

        this.strength =
            Number(options.strength ?? 1.0);

        this.speed =
            Number(options.speed ?? 1.2);

        this.turns =
            Math.round(Number(options.turns ?? 120));

        this.resistance =
            Number(options.resistance ?? 10);

        this.coilRadius =
            Number(options.coilRadius ?? 1.15);

        this.motionRange = 4;

        this.running = true;
        this.time = 0;

        // =====================================================
        // PHYSICS STATE
        // =====================================================

        this.B = 0;
        this.flux = 0;
        this.previousFlux = 0;
        this.dPhiDt = 0;

        this.emf = 0;
        this.current = 0;
        this.power = 0;

        this.currentDirection = 0;

        this.lampBrightness = 0;
        this.galvanometerAngle = 0;

        this.magnetPosition =
            this.motionRange;

        this.previousPosition =
            this.magnetPosition;

        this.magnetVelocity = 0;

        // =====================================================
        // THREE ROOT
        // =====================================================

        this.object =
            new THREE.Group();

        this.object.name =
            "MagneticInduction";

        this.object.userData = {
            type: "magnetic-induction",
            title: "Magnetic Induction Laboratory"
        };

        // =====================================================
        // GROUPS
        // =====================================================

        this.base =
            new THREE.Group();

        this.coil =
            new THREE.Group();

        this.magnet =
            new THREE.Group();

        this.field =
            new THREE.Group();

        this.circuit =
            new THREE.Group();

        this.instruments =
            new THREE.Group();

        this.currentParticles =
            new THREE.Group();

        this.object.add(
            this.base,
            this.coil,
            this.magnet,
            this.field,
            this.circuit,
            this.instruments,
            this.currentParticles
        );

        // =====================================================
        // REFERENCES
        // =====================================================

        this.lamp = null;
        this.lampLight = null;
        this.lampGlow = null;
        this.lampFilament = null;

        this.lampRays = [];

        this.galvanometerNeedle = null;
        this.galvanometerPivot = null;

        this.coilMeshes = [];
        this.fieldLines = [];
        this.particles = [];

        // =====================================================
        // BUILD
        // =====================================================

        this.createBase();
        this.createCoil();
        this.createMagnet();
        this.createField();
        this.createCircuit();
        this.createLamp();
        this.createGalvanometer();
        this.createParticles();

        this.previousFlux = this.calculateFlux();

        this.calculatePhysics();

        this.updateVisuals();
    }

    // ==========================================================
    // MATERIAL HELPERS
    // ==========================================================

    material(color, options = {}) {

        return new THREE.MeshStandardMaterial({

            color,

            roughness:
                options.roughness ?? 0.42,

            metalness:
                options.metalness ?? 0.25,

            transparent:
                options.transparent ?? false,

            opacity:
                options.opacity ?? 1,

            emissive:
                options.emissive ?? 0x000000,

            emissiveIntensity:
                options.emissiveIntensity ?? 0
        });
    }

    basicMaterial(color, options = {}) {

        return new THREE.MeshBasicMaterial({

            color,

            transparent:
                options.transparent ?? false,

            opacity:
                options.opacity ?? 1,

            depthWrite:
                options.depthWrite ?? true,

            blending:
                options.blending ??
                THREE.NormalBlending
        });
    }

    disposeObject(object) {

        object.traverse(child => {

            if (child.geometry) {

                child.geometry.dispose();
            }

            if (child.material) {

                if (Array.isArray(child.material)) {

                    child.material.forEach(
                        material =>
                            material?.dispose?.()
                    );

                } else {

                    child.material.dispose?.();
                }
            }
        });
    }

    clearGroup(group) {

        while (group.children.length) {

            const child =
                group.children.pop();

            this.disposeObject(child);
        }
    }

    // ==========================================================
    // BASE
    // ==========================================================

    createBase() {

        const platform =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    12,
                    0.3,
                    5.5
                ),

                this.material(
                    0x182235,
                    {
                        roughness: 0.78,
                        metalness: 0.12
                    }
                )
            );

        platform.position.y = -2;

        platform.userData = {
            type: "base",
            name: "Laboratory Base"
        };

        this.base.add(platform);

        const rail =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    9.5,
                    0.08,
                    0.18
                ),

                this.material(
                    0x64748b,
                    {
                        roughness: 0.25,
                        metalness: 0.75
                    }
                )
            );

        rail.position.set(
            0,
            -1.35,
            0
        );

        this.base.add(rail);
    }

    // ==========================================================
    // COIL
    // ==========================================================

    createCoil() {

        this.clearGroup(
            this.coil
        );

        this.coilMeshes = [];

        const visibleTurns =
            THREE.MathUtils.clamp(
                Math.round(
                    12 +
                    this.turns * 0.08
                ),
                14,
                60
            );

        const length = 2.25;

        const spacing =
            length /
            Math.max(
                1,
                visibleTurns - 1
            );

        const copper =
            this.material(
                0xd97706,
                {
                    metalness: 0.78,
                    roughness: 0.22
                }
            );

        for (
            let i = 0;
            i < visibleTurns;
            i++
        ) {

            const ring =
                new THREE.Mesh(

                    new THREE.TorusGeometry(
                        this.coilRadius,
                        0.035,
                        10,
                        48
                    ),

                    copper.clone()
                );

            ring.rotation.y =
                Math.PI / 2;

            ring.position.x =
                -length / 2 +
                i * spacing;

            ring.userData = {

                type: "coil",

                name: "Coil Turn",

                turns: this.turns
            };

            this.coil.add(ring);

            this.coilMeshes.push(
                ring
            );
        }

        // Transparent core
        const core =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    this.coilRadius * 0.78,
                    this.coilRadius * 0.78,
                    length + 0.2,
                    32
                ),

                this.material(
                    0x94a3b8,
                    {
                        transparent: true,
                        opacity: 0.07,
                        metalness: 0.1
                    }
                )
            );

        core.rotation.z =
            Math.PI / 2;

        core.userData = {
            type: "core",
            name: "Coil Core"
        };

        this.coil.add(core);

        this.coil.userData = {
            type: "coil",
            name: "Induction Coil",
            turns: this.turns,
            formula: "ε = -N dΦ/dt"
        };
    }

    // ==========================================================
    // MAGNET
    // ==========================================================

    createMagnet() {

        this.clearGroup(
            this.magnet
        );

        const north =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.1,
                    0.75,
                    0.75
                ),

                this.material(
                    0xef4444,
                    {
                        roughness: 0.3,
                        metalness: 0.2
                    }
                )
            );

        north.position.x =
            0.55;

        north.userData = {
            type: "north",
            name: "North Pole",
            pole: "N"
        };

        const south =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.1,
                    0.75,
                    0.75
                ),

                this.material(
                    0x2563eb,
                    {
                        roughness: 0.3,
                        metalness: 0.2
                    }
                )
            );

        south.position.x =
            -0.55;

        south.userData = {
            type: "south",
            name: "South Pole",
            pole: "S"
        };

        const center =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.12,
                    0.78,
                    0.78
                ),

                this.material(
                    0xf8fafc,
                    {
                        roughness: 0.25,
                        metalness: 0.55
                    }
                )
            );

        this.magnet.add(
            south,
            center,
            north
        );

        this.magnet.position.x =
            this.magnetPosition;

        this.magnet.userData = {

            type: "magnet",

            name: "Bar Magnet",

            description:
                "Moving the magnet changes magnetic flux through the coil."
        };
    }

    // ==========================================================
    // MAGNETIC FIELD
    // ==========================================================

    createField() {

        this.clearGroup(
            this.field
        );

        this.fieldLines = [];

        const radii = [
            0.65,
            0.95,
            1.25,
            1.55,
            1.85
        ];

        for (
            let r = 0;
            r < radii.length;
            r++
        ) {

            const radius =
                radii[r];

            const points = [];

            for (
                let i = 0;
                i <= 100;
                i++
            ) {

                const t =
                    i / 100;

                const x =
                    -2.5 +
                    t * 5;

                const y =
                    radius *
                    Math.sin(
                        Math.PI * t
                    );

                points.push(
                    new THREE.Vector3(
                        x,
                        y,
                        0
                    )
                );
            }

            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints(
                        points
                    );

            const line =
                new THREE.Line(

                    geometry,

                    this.basicMaterial(
                        0x38bdf8,
                        {
                            transparent: true,
                            opacity:
                                0.12 +
                                (1 - r / 6) *
                                0.28
                        }
                    )
                );

            line.userData = {
                type: "field-line",
                radius
            };

            this.field.add(line);

            this.fieldLines.push(
                line
            );
        }

        this.field.position.x =
            this.magnetPosition;

        this.field.userData = {
            type: "magnetic-field"
        };
    }

    // ==========================================================
    // WIRE
    // ==========================================================

    wire(start, end) {

        const curve =
            new THREE.LineCurve3(
                start,
                end
            );

        const geometry =
            new THREE.TubeGeometry(
                curve,
                16,
                0.025,
                8,
                false
            );

        const mesh =
            new THREE.Mesh(

                geometry,

                this.material(
                    0xb45309,
                    {
                        metalness: 0.72,
                        roughness: 0.25
                    }
                )
            );

        this.circuit.add(mesh);

        return mesh;
    }

    // ==========================================================
    // CIRCUIT
    // ==========================================================

    createCircuit() {

        // Left side
        this.wire(
            new THREE.Vector3(
                -1,
                0,
                1.25
            ),
            new THREE.Vector3(
                -1,
                -1.4,
                1.25
            )
        );

        this.wire(
            new THREE.Vector3(
                -1,
                -1.4,
                1.25
            ),
            new THREE.Vector3(
                -3.3,
                -1.4,
                1.25
            )
        );

        // Right side
        this.wire(
            new THREE.Vector3(
                1,
                0,
                1.25
            ),
            new THREE.Vector3(
                1,
                -1.4,
                1.25
            )
        );

        this.wire(
            new THREE.Vector3(
                1,
                -1.4,
                1.25
            ),
            new THREE.Vector3(
                3.3,
                -1.4,
                1.25
            )
        );

        this.circuit.userData = {
            type: "closed-circuit",
            name: "Induction Circuit"
        };
    }

    // ==========================================================
    // LAMP
    // ==========================================================

    createLamp() {

        const group =
            new THREE.Group();

        group.position.set(
            -3.3,
            -1.15,
            1.25
        );

        group.name =
            "Induction Lamp";

        // ------------------------------------------------------
        // SOCKET
        // ------------------------------------------------------

        const socket =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.30,
                    0.36,
                    0.42,
                    24
                ),

                this.material(
                    0x475569,
                    {
                        metalness: 0.78,
                        roughness: 0.24
                    }
                )
            );

        // ------------------------------------------------------
        // BULB
        // ------------------------------------------------------

        const bulbMaterial =
            this.material(
                0xfff5b2,
                {
                    roughness: 0.1,
                    transparent: true,
                    opacity: 0.86,
                    emissive: 0xffc928,
                    emissiveIntensity: 0.08
                }
            );

        const bulb =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.40,
                    32,
                    24
                ),

                bulbMaterial
            );

        bulb.position.y =
            0.48;

        bulb.scale.set(
            0.86,
            1.12,
            0.86
        );

        // ------------------------------------------------------
        // FILAMENT
        // ------------------------------------------------------

        const filament =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    0.12,
                    0.018,
                    8,
                    24
                ),

                this.basicMaterial(
                    0xff8c00
                )
            );

        filament.position.y =
            0.48;

        filament.rotation.x =
            Math.PI / 2;

        // ------------------------------------------------------
        // INNER GLOW
        // ------------------------------------------------------

        const glow =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.72,
                    24,
                    18
                ),

                this.basicMaterial(
                    0xffd84d,
                    {
                        transparent: true,
                        opacity: 0.02,
                        depthWrite: false,
                        blending:
                            THREE.AdditiveBlending
                    }
                )
            );

        glow.position.y =
            0.48;

        // ------------------------------------------------------
        // POINT LIGHT
        // ------------------------------------------------------

        const light =
            new THREE.PointLight(
                0xffd45a,
                0,
                6,
                2
            );

        light.position.y =
            0.48;

        // ------------------------------------------------------
        // RAYS
        // ------------------------------------------------------

        this.lampRays = [];

        const rayCount = 20;

        for (
            let i = 0;
            i < rayCount;
            i++
        ) {

            const angle =
                (i / rayCount) *
                Math.PI *
                2;

            const length =
                0.55 +
                (i % 4) * 0.15;

            const ray =
                new THREE.Mesh(

                    new THREE.CylinderGeometry(
                        0.009,
                        0.026,
                        length,
                        8
                    ),

                    this.basicMaterial(
                        0xffdf70,
                        {
                            transparent: true,
                            opacity: 0,
                            depthWrite: false,
                            blending:
                                THREE.AdditiveBlending
                        }
                    )
                );

            ray.position.set(

                Math.cos(angle) *
                    (0.48 + length / 2),

                0.48 +
                    Math.sin(angle) *
                    (0.48 + length / 2),

                0
            );

            ray.rotation.z =
                -angle +
                Math.PI / 2;

            ray.userData.angle =
                angle;

            ray.userData.baseLength =
                length;

            group.add(ray);

            this.lampRays.push(
                ray
            );
        }

        group.add(
            socket,
            bulb,
            filament,
            glow,
            light
        );

        this.instruments.add(
            group
        );

        this.lamp =
            bulb;

        this.lampGlow =
            glow;

        this.lampLight =
            light;

        this.lampFilament =
            filament;
    }

    // ==========================================================
    // GALVANOMETER
    // ==========================================================

    createGalvanometer() {

        const group =
            new THREE.Group();

        group.position.set(
            3.3,
            -1.15,
            1.25
        );

        group.name =
            "Galvanometer";

        // Body
        const body =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    1.7,
                    1,
                    0.30
                ),

                this.material(
                    0xf1f5f9,
                    {
                        roughness: 0.5,
                        metalness: 0.1
                    }
                )
            );

        // Face
        const face =
            new THREE.Mesh(

                new THREE.CircleGeometry(
                    0.38,
                    40
                ),

                this.basicMaterial(
                    0xe2e8f0
                )
            );

        face.position.z =
            0.17;

        // Center
        const center =
            new THREE.Mesh(

                new THREE.CircleGeometry(
                    0.045,
                    16
                ),

                this.basicMaterial(
                    0x111827
                )
            );

        center.position.z =
            0.21;

        // Needle
        const needleGeometry =
            new THREE.BufferGeometry()
                .setFromPoints([

                    new THREE.Vector3(
                        0,
                        -0.27,
                        0
                    ),

                    new THREE.Vector3(
                        0,
                        0.30,
                        0
                    )
                ]);

        const needle =
            new THREE.Line(

                needleGeometry,

                this.basicMaterial(
                    0xdc2626
                )
            );

        needle.position.z =
            0.22;

        group.add(
            body,
            face,
            center,
            needle
        );

        this.instruments.add(
            group
        );

        this.galvanometerNeedle =
            needle;

        this.galvanometerPivot =
            center;
    }

    // ==========================================================
    // CURRENT PARTICLES
    // ==========================================================

    createParticles() {

        this.currentParticles.clear();

        this.particles = [];

        const material =
            this.basicMaterial(
                0xfacc15,
                {
                    transparent: true,
                    opacity: 0.9,
                    depthWrite: false,
                    blending:
                        THREE.AdditiveBlending
                }
            );

        for (
            let i = 0;
            i < 18;
            i++
        ) {

            const particle =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.045,
                        10,
                        10
                    ),

                    material.clone()
                );

            particle.userData.phase =
                i / 18;

            particle.visible = false;

            this.currentParticles.add(
                particle
            );

            this.particles.push(
                particle
            );
        }
    }

    // ==========================================================
    // MAGNETIC FIELD PHYSICS
    // ==========================================================

    calculateField() {

        const x =
            this.magnetPosition;

        const distanceFactor =
            1 /
            Math.pow(
                1 +
                Math.pow(
                    x / 1.35,
                    2
                ),
                1.5
            );

        return (
            0.65 *
            this.strength *
            distanceFactor
        );
    }

    // ==========================================================
    // FLUX
    // ==========================================================

    calculateFlux() {

        const B =
            this.calculateField();

        const radius =
            0.08 *
            (
                this.coilRadius /
                1.15
            );

        const area =
            Math.PI *
            radius *
            radius;

        return B * area;
    }

    // ==========================================================
    // PHYSICS CALCULATION
    // ==========================================================

    calculatePhysics(delta = 1 / 60) {

        this.B =
            this.calculateField();

        this.flux =
            this.calculateFlux();

        delta =
            Math.max(
                delta,
                1 / 240
            );

        this.dPhiDt =
            (
                this.flux -
                this.previousFlux
            ) / delta;

        // Faraday's Law
        this.emf =
            -this.turns *
            this.dPhiDt;

        // Ohm's Law
        this.current =
            this.emf /
            Math.max(
                this.resistance,
                0.1
            );

        // Electrical power
        this.power =
            this.current *
            this.current *
            this.resistance;

        // Direction
        if (
            Math.abs(
                this.current
            ) < 0.0001
        ) {

            this.currentDirection =
                0;

        } else if (
            this.current > 0
        ) {

            this.currentDirection =
                1;

        } else {

            this.currentDirection =
                -1;
        }

        // Lamp brightness
        this.lampBrightness =
            THREE.MathUtils.clamp(

                Math.sqrt(
                    Math.abs(
                        this.power
                    ) / 1.5
                ),

                0,
                1
            );

        // Galvanometer
        this.galvanometerAngle =
            THREE.MathUtils.clamp(
                this.current / 1.5,
                -1,
                1
            ) *
            THREE.MathUtils.degToRad(
                60
            );
    }

    // ==========================================================
    // UPDATE
    // ==========================================================

    update(delta = 1 / 60) {

        delta =
            THREE.MathUtils.clamp(
                delta,
                0,
                0.05
            );

        if (!this.running) {

            return;
        }

        this.time += delta;

        this.previousPosition =
            this.magnetPosition;

        // Smooth oscillating motion
        this.magnetPosition =
            this.motionRange *
            Math.cos(
                this.time *
                this.speed
            );

        this.magnetVelocity =
            (
                this.magnetPosition -
                this.previousPosition
            ) / delta;

        this.magnet.position.x =
            this.magnetPosition;

        this.field.position.x =
            this.magnetPosition;

        this.calculatePhysics(
            delta
        );

        this.updateVisuals();

        this.updateParticles(
            delta
        );

        this.previousFlux =
            this.flux;
    }

    // ==========================================================
    // VISUAL UPDATE
    // ==========================================================

    updateVisuals() {

        const brightness =
            THREE.MathUtils.clamp(
                this.lampBrightness,
                0,
                1
            );

        const visual =
            Math.pow(
                brightness,
                0.48
            );

        // ------------------------------------------------------
        // FIELD LINES
        // ------------------------------------------------------

        const fieldStrength =
            THREE.MathUtils.clamp(
                this.strength / 2,
                0.05,
                1
            );

        this.fieldLines.forEach(
            (line, index) => {

                line.material.opacity =
                    0.08 +
                    fieldStrength *
                    (
                        0.25 -
                        index * 0.025
                    );
            }
        );

        // ------------------------------------------------------
        // BULB
        // ------------------------------------------------------

        if (this.lamp) {

            this.lamp.material
                .emissiveIntensity =
                0.08 +
                visual * 6;

            this.lamp.material.opacity =
                0.72 +
                visual * 0.28;

            const scale =
                1 +
                visual * 0.12;

            this.lamp.scale.set(
                0.86 * scale,
                1.12 * scale,
                0.86 * scale
            );
        }

        // ------------------------------------------------------
        // FILAMENT
        // ------------------------------------------------------

        if (this.lampFilament) {

            this.lampFilament.material
                .color.setHSL(
                    0.10,
                    1,
                    0.45 +
                    visual * 0.45
                );
        }

        // ------------------------------------------------------
        // GLOW
        // ------------------------------------------------------

        if (this.lampGlow) {

            this.lampGlow.material.opacity =
                0.01 +
                visual * 0.32;

            const glowScale =
                0.75 +
                visual * 1.25;

            this.lampGlow.scale.setScalar(
                glowScale
            );
        }

        // ------------------------------------------------------
        // POINT LIGHT
        // ------------------------------------------------------

        if (this.lampLight) {

            this.lampLight.intensity =
                visual * 6;

            this.lampLight.distance =
                2.5 +
                visual * 4;
        }

        // ------------------------------------------------------
        // LIGHT RAYS
        // ------------------------------------------------------

        const rayCount =
            this.lampRays.length;

        const visibleCount =
            Math.round(
                visual * rayCount
            );

        this.lampRays.forEach(
            (ray, index) => {

                if (
                    index <
                    visibleCount
                ) {

                    ray.visible = true;

                    ray.material.opacity =
                        0.10 +
                        visual * 0.75;

                    const length =
                        ray.userData
                            .baseLength;

                    ray.scale.y =
                        0.55 +
                        visual * 1.15;

                    // Small pulsation
                    ray.scale.x =
                        0.8 +
                        visual * 0.5;

                    ray.scale.z =
                        0.8 +
                        visual * 0.5;

                } else {

                    ray.visible = false;

                    ray.material.opacity =
                        0;
                }
            }
        );

        // ------------------------------------------------------
        // GALVANOMETER
        // ------------------------------------------------------

        if (
            this.galvanometerNeedle
        ) {

            this.galvanometerNeedle.rotation.z =
                -this.galvanometerAngle;
        }
    }

    // ==========================================================
    // CURRENT PARTICLES UPDATE
    // ==========================================================

    updateParticles(delta) {

        const magnitude =
            THREE.MathUtils.clamp(
                Math.abs(
                    this.current
                ) / 2,
                0,
                1
            );

        const active =
            magnitude > 0.01;

        this.particles.forEach(
            (particle, index) => {

                particle.visible =
                    active;

                if (!active) {

                    return;
                }

                let phase =
                    particle.userData.phase;

                phase +=
                    delta *
                    (
                        0.25 +
                        magnitude * 1.8
                    ) *
                    (
                        this.currentDirection ||
                        1
                    );

                phase =
                    (
                        phase + 10
                    ) % 1;

                particle.userData.phase =
                    phase;

                // Approximate closed circuit path
                const perimeter =
                    2 * (
                        2.2 + 3.0
                    );

                const distance =
                    phase *
                    perimeter;

                let x = 0;
                let y = -1.4;
                let z = 1.25;

                if (
                    distance < 2.2
                ) {

                    x =
                        -1 +
                        distance;

                } else if (
                    distance < 5.2
                ) {

                    x = 1.2;

                    y =
                        -1.4 +
                        (
                            distance - 2.2
                        );

                } else {

                    x =
                        1.2 -
                        (
                            distance - 5.2
                        );

                }

                particle.position.set(
                    x,
                    y,
                    z
                );

                particle.material.opacity =
                    0.25 +
                    magnitude * 0.75;
            }
        );
    }

    // ==========================================================
    // START
    // ==========================================================

    start() {

        this.running = true;
    }

    // ==========================================================
    // PAUSE
    // ==========================================================

    pause() {

        this.running = false;

        this.emf = 0;
        this.current = 0;
        this.power = 0;

        this.lampBrightness = 0;

        this.galvanometerAngle =
            0;

        this.updateVisuals();
    }

    // ==========================================================
    // RESET
    // ==========================================================

    reset() {

        this.time = 0;

        this.running = true;

        this.strength = 1;
        this.speed = 1.2;
        this.turns = 120;
        this.resistance = 10;

        this.magnetPosition =
            this.motionRange;

        this.previousPosition =
            this.magnetPosition;

        this.magnet.position.x =
            this.magnetPosition;

        this.field.position.x =
            this.magnetPosition;

        this.previousFlux =
            this.calculateFlux();

        this.emf = 0;
        this.current = 0;
        this.power = 0;

        this.lampBrightness = 0;

        this.galvanometerAngle =
            0;

        this.updateVisuals();
    }

    // ==========================================================
    // RESET PHYSICS
    // ==========================================================

    resetPhysics() {

        this.reset();
    }

    // ==========================================================
    // SET SPEED
    // ==========================================================

    setSpeed(value) {

        this.speed =
            THREE.MathUtils.clamp(
                Number(value) || 0,
                0,
                5
            );
    }

    // ==========================================================
    // MAGNET STRENGTH
    // ==========================================================

    setMagnetStrength(value) {

        this.strength =
            THREE.MathUtils.clamp(
                Number(value) || 0,
                0,
                2
            );

        this.calculatePhysics();

        this.updateVisuals();
    }

    // ==========================================================
    // COIL TURNS
    // ==========================================================

    setTurns(value) {

        this.turns =
            THREE.MathUtils.clamp(
                Math.round(
                    Number(value) || 120
                ),
                20,
                500
            );

        this.createCoil();

        this.calculatePhysics();

        this.updateVisuals();
    }

    // Alias used by PhysicsSimulation
    setCoilTurns(value) {

        this.setTurns(value);
    }

    // ==========================================================
    // RESISTANCE
    // ==========================================================

    setResistance(value) {

        this.resistance =
            THREE.MathUtils.clamp(
                Number(value) || 1,
                1,
                100
            );

        this.calculatePhysics();

        this.updateVisuals();
    }

    // ==========================================================
    // COIL RADIUS
    // ==========================================================

    setCoilRadius(value) {

        this.coilRadius =
            THREE.MathUtils.clamp(
                Number(value) || 1.15,
                0.5,
                2
            );

        this.createCoil();

        this.calculatePhysics();

        this.updateVisuals();
    }

    // ==========================================================
    // MAGNET POSITION
    // ==========================================================

    setMagnetPosition(value) {

        this.magnetPosition =
            THREE.MathUtils.clamp(
                Number(value) || 0,
                -this.motionRange,
                this.motionRange
            );

        this.magnet.position.x =
            this.magnetPosition;

        this.field.position.x =
            this.magnetPosition;

        this.calculatePhysics();

        this.updateVisuals();
    }

    // ==========================================================
    // MOVE MAGNET
    // ==========================================================

    moveMagnet(value) {

        this.setMagnetPosition(
            this.magnetPosition +
            Number(value || 0)
        );
    }

    // ==========================================================
    // FIELD VISIBILITY
    // ==========================================================

    setShowField(value) {

        this.field.visible =
            Boolean(value);
    }

    toggleField() {

        this.field.visible =
            !this.field.visible;
    }

    // ==========================================================
    // OUTPUT MODE
    // ==========================================================

    setOutput(value) {

        if (
            value !== "lamp" &&
            value !== "galvanometer" &&
            value !== "both"
        ) {

            return;
        }

        const lampGroup =
            this.lamp?.parent;

        const meterGroup =
            this.galvanometerNeedle?.parent;

        if (lampGroup) {

            lampGroup.visible =
                value !== "galvanometer";
        }

        if (meterGroup) {

            meterGroup.visible =
                value !== "lamp";
        }
    }

    // ==========================================================
    // STATE
    // ==========================================================

    getState() {

        return {

            strength:
                this.strength,

            speed:
                this.speed,

            turns:
                this.turns,

            resistance:
                this.resistance,

            magnetPosition:
                this.magnetPosition,

            magnetVelocity:
                this.magnetVelocity,

            magneticField:
                this.B,

            flux:
                this.flux,

            dPhiDt:
                this.dPhiDt,

            emf:
                this.emf,

            current:
                this.current,

            power:
                this.power,

            direction:
                this.currentDirection,

            lampBrightness:
                this.lampBrightness,

            galvanometerAngle:
                this.galvanometerAngle,

            running:
                this.running
        };
    }

    // ==========================================================
    // MEASUREMENTS
    // ==========================================================

    getMeasurements() {

        return {

            magneticField:
                this.B,

            flux:
                this.flux,

            fluxChangeRate:
                this.dPhiDt,

            inducedEMF:
                this.emf,

            current:
                this.current,

            power:
                this.power,

            direction:
                this.currentDirection,

            lampBrightness:
                this.lampBrightness
        };
    }

    // ==========================================================
    // EDUCATIONAL DATA
    // ==========================================================

    getEducationalData(name) {

        const data = {

            "Bar Magnet": {

                title:
                    "Bar Magnet",

                description:
                    "Moving the magnet changes the magnetic field through the coil.",

                law:
                    "Changing magnetic flux produces induced EMF."
            },

            "North Pole": {

                title:
                    "North Pole",

                description:
                    "The north pole produces a magnetic field that passes through the coil."
            },

            "South Pole": {

                title:
                    "South Pole",

                description:
                    "The south pole completes the magnetic field of the magnet."
            },

            "Coil": {

                title:
                    "Induction Coil",

                description:
                    "More turns produce greater induced EMF for the same rate of flux change.",

                formula:
                    "ε = -N dΦ/dt"
            },

            "Lamp": {

                title:
                    "Lamp",

                description:
                    "Brightness represents electrical power generated by electromagnetic induction.",

                formula:
                    "P = I²R"
            },

            "Galvanometer": {

                title:
                    "Galvanometer",

                description:
                    "The needle shows the magnitude and direction of induced current.",

                law:
                    "Lenz's Law"
            }
        };

        return (
            data[name] ??
            null
        );
    }

    // ==========================================================
    // FORMULAS
    // ==========================================================

    getFormulas() {

        return {

            faraday:
                "ε = -N dΦ/dt",

            flux:
                "Φ = B × A",

            ohm:
                "I = ε/R",

            power:
                "P = I²R",

            lenz:
                "The induced current opposes the change in magnetic flux."
        };
    }

    // ==========================================================
    // OBJECT
    // ==========================================================

    getObject() {

        return this.object;
    }

    // ==========================================================
    // CLEANUP
    // ==========================================================

    dispose() {

        this.running = false;

        this.disposeObject(
            this.object
        );

        this.object.clear();

        this.coilMeshes = [];
        this.fieldLines = [];
        this.lampRays = [];
        this.particles = [];

        this.lamp = null;
        this.lampLight = null;
        this.lampGlow = null;
        this.lampFilament = null;

        this.galvanometerNeedle =
            null;

        this.galvanometerPivot =
            null;
    }
}

export default MagneticInduction;