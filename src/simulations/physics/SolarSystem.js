// ============================================================
// SciLab - Physics Laboratory
// SolarSystem.js
// Advanced 3D Solar System Teaching Simulator
// ============================================================

import * as THREE from "three";


// ============================================================
// PLANETS
// ============================================================

const PLANETS = [

    {
        name: "Mercury",
        type: "planet",

        radius: 0.58,
        orbit: 5.0,
        period: 88,
        phase: 0.3,

        color: 0x9ca3af,

        moons: 0,

        distanceAU: 0.39,
        diameterKm: 4879,
        gravity: 3.70,

        temperature:
            "About 167°C average daytime surface temperature.",

        description:
            "Mercury is the closest planet to the Sun and the smallest major planet.",

        facts: [
            "Mercury has the shortest year of the eight major planets.",
            "It has almost no substantial atmosphere.",
            "Its surface contains many impact craters."
        ],

        student:
            "Mercury is very close to the Sun, so it completes one orbit very quickly.",

        teacher:
            "Use Mercury to explain orbital distance and orbital period."
    },


    {
        name: "Venus",
        type: "planet",

        radius: 0.78,
        orbit: 7.4,
        period: 225,
        phase: 2.1,

        color: 0xd6a35f,

        moons: 0,

        distanceAU: 0.72,
        diameterKm: 12104,
        gravity: 8.87,

        temperature:
            "About 465°C average surface temperature.",

        description:
            "Venus is a rocky planet with a very thick atmosphere and extremely high surface temperatures.",

        facts: [
            "Venus has a dense carbon-dioxide atmosphere.",
            "Its atmosphere creates a strong greenhouse effect.",
            "Venus is similar in size to Earth."
        ],

        student:
            "Venus is similar in size to Earth, but its surface is much hotter.",

        teacher:
            "Use Venus to introduce atmosphere and the greenhouse effect."
    },


    {
        name: "Earth",
        type: "planet",

        radius: 0.92,
        orbit: 9.8,
        period: 365,
        phase: 4.2,

        color: 0x3182ce,

        moons: 1,

        distanceAU: 1.00,
        diameterKm: 12742,
        gravity: 9.81,

        temperature:
            "About 15°C average global surface temperature.",

        description:
            "Earth is the third planet from the Sun and the only planet currently known to support life.",

        facts: [
            "About 71% of Earth's surface is covered by water.",
            "Earth has one natural satellite, the Moon.",
            "Its atmosphere is mainly nitrogen and oxygen."
        ],

        student:
            "Earth is our home planet. It has liquid water and an atmosphere suitable for life.",

        teacher:
            "Use Earth as a reference when comparing planet size, gravity and distance."
    },


    {
        name: "Mars",
        type: "planet",

        radius: 0.74,
        orbit: 12.0,
        period: 687,
        phase: 0.7,

        color: 0xef4444,

        moons: 2,

        distanceAU: 1.52,
        diameterKm: 6779,
        gravity: 3.71,

        temperature:
            "About -63°C average surface temperature.",

        description:
            "Mars is a cold rocky desert world often called the Red Planet.",

        facts: [
            "Its reddish appearance comes from iron-rich minerals.",
            "Mars has two small moons.",
            "Mars has large volcanoes and deep valleys."
        ],

        student:
            "Mars is smaller and colder than Earth and appears red because of iron-rich material.",

        teacher:
            "Use Mars to compare terrestrial planets."
    },


    {
        name: "Jupiter",
        type: "planet",

        radius: 1.70,
        orbit: 15.8,
        period: 4333,
        phase: 2.6,

        color: 0xd7b28b,

        moons: 4,

        distanceAU: 5.20,
        diameterKm: 139820,
        gravity: 24.79,

        temperature:
            "About -110°C cloud-top temperature.",

        description:
            "Jupiter is the largest planet in the Solar System and a gas giant.",

        facts: [
            "Jupiter is much larger than Earth.",
            "Its atmosphere contains powerful storms.",
            "The Great Red Spot is a giant atmospheric storm."
        ],

        student:
            "Jupiter is the largest planet and is a gas giant.",

        teacher:
            "Use Jupiter to demonstrate planetary size and gravitational strength."
    },


    {
        name: "Saturn",
        type: "planet",

        radius: 1.52,
        orbit: 19.8,
        period: 10759,
        phase: 5.2,

        color: 0xe5cf98,

        moons: 5,

        distanceAU: 9.58,
        diameterKm: 116460,
        gravity: 10.44,

        temperature:
            "About -140°C cloud-top temperature.",

        description:
            "Saturn is a gas giant famous for its spectacular ring system.",

        facts: [
            "Saturn has a large ring system.",
            "Its rings contain ice and rocky particles.",
            "The ring system has many separate bands."
        ],

        student:
            "Saturn's rings are made of many particles orbiting the planet.",

        teacher:
            "Use Saturn to explain orbital motion and ring systems."
    },


    {
        name: "Uranus",
        type: "planet",

        radius: 1.13,
        orbit: 23.2,
        period: 30687,
        phase: 1.4,

        color: 0x67dbe5,

        moons: 2,

        distanceAU: 19.2,
        diameterKm: 50724,
        gravity: 8.69,

        temperature:
            "About -195°C cloud-top temperature.",

        description:
            "Uranus is an ice giant with a strongly tilted rotational axis.",

        facts: [
            "Uranus has a strongly tilted rotation axis.",
            "It has a faint ring system.",
            "It is classified as an ice giant."
        ],

        student:
            "Uranus has a very large axial tilt.",

        teacher:
            "Use Uranus to demonstrate axial tilt and seasons."
    },


    {
        name: "Neptune",
        type: "planet",

        radius: 1.10,
        orbit: 26.4,
        period: 60190,
        phase: 3.6,

        color: 0x426ee8,

        moons: 1,

        distanceAU: 30.05,
        diameterKm: 49244,
        gravity: 11.15,

        temperature:
            "About -200°C cloud-top temperature.",

        description:
            "Neptune is the farthest major planet from the Sun and an ice giant.",

        facts: [
            "Neptune has very strong winds.",
            "It is extremely far from the Sun.",
            "Neptune is similar in size to Uranus."
        ],

        student:
            "Neptune is the farthest major planet from the Sun.",

        teacher:
            "Use Neptune to connect orbital distance with orbital period."
    }

];


// ============================================================
// DWARF PLANETS
// ============================================================

const DWARF_OBJECTS = [

    {
        name: "Pluto",

        orbit: 31.5,

        radius: 0.46,

        phase: 5.2,

        color: 0xb8aaa0,

        description:
            "Pluto is a dwarf planet in the outer Solar System.",

        student:
            "Pluto is smaller than the eight major planets and is classified as a dwarf planet.",

        teacher:
            "Use Pluto to discuss planets versus dwarf planets."
    },


    {
        name: "Eris",

        orbit: 34.0,

        radius: 0.34,

        phase: 2.4,

        color: 0xd6d9df,

        description:
            "Eris is a distant dwarf planet in the outer Solar System.",

        student:
            "Eris is one of the large known dwarf planets.",

        teacher:
            "Use Eris when explaining dwarf planets."
    },


    {
        name: "Haumea",

        orbit: 36.2,

        radius: 0.31,

        phase: 4.8,

        color: 0xd7dde6,

        description:
            "Haumea is an unusual dwarf planet known for its fast rotation.",

        student:
            "Haumea is an unusual object in the outer Solar System.",

        teacher:
            "Use Haumea to discuss rotational motion and unusual shapes."
    },


    {
        name: "Makemake",

        orbit: 38.0,

        radius: 0.33,

        phase: 1.1,

        color: 0xb9a489,

        description:
            "Makemake is a dwarf planet beyond Neptune.",

        student:
            "Makemake is a distant dwarf planet associated with the Kuiper Belt.",

        teacher:
            "Use Makemake to introduce the Kuiper Belt."
    }

];


// ============================================================
// CLASS
// ============================================================

export class SolarSystem {

    constructor() {

        this.group =
            new THREE.Group();

        this.group.name =
            "Advanced 3D Solar System";

        this.selectable =
            [];

        this.hoverable =
            [];

        this.componentObjects =
            [];

        this.planets =
            [];

        this.dwarfs =
            [];

        this.running =
            true;

        this.speed =
            1;

        this.time =
            0;

        this.selected =
            "Earth";

        this.hovered =
            null;

        this.showOrbits =
            true;

        this.showLabels =
            true;

        this.showAsteroids =
            true;

        this.showKuiperBelt =
            true;

        this.educationMode =
            "teacher";

        this.createScene();

    }


    // ========================================================
    // SCENE
    // ========================================================

    createScene() {

        this.createSpace();

        this.createSun();

        this.createOrbitSystem();

        this.createAsteroidBelt();

        this.createPlanets();

        this.createDwarfPlanets();

        this.createKuiperBelt();

        this.createReferenceGrid();

        this.createEducationalMarkers();

    }


    // ========================================================
    // STARS
    // ========================================================

    createSpace() {

        const geometry =
            new THREE.BufferGeometry();

        const positions =
            [];

        const colors =
            [];

        for (
            let i = 0;
            i < 2400;
            i++
        ) {

            const radius =
                65 +
                Math.random() *
                90;

            const theta =
                Math.random() *
                Math.PI *
                2;

            const phi =
                Math.acos(
                    2 *
                    Math.random() -
                    1
                );

            positions.push(

                radius *
                Math.sin(phi) *
                Math.cos(theta),

                radius *
                Math.cos(phi),

                radius *
                Math.sin(phi) *
                Math.sin(theta)

            );

            const brightness =
                0.55 +
                Math.random() *
                0.45;

            colors.push(
                brightness,
                brightness,
                brightness
            );

        }


        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(
                positions,
                3
            )
        );


        geometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(
                colors,
                3
            )
        );


        const material =
            new THREE.PointsMaterial({

                size:
                    0.17,

                vertexColors:
                    true,

                transparent:
                    true,

                opacity:
                    0.9,

                sizeAttenuation:
                    true

            });


        const stars =
            new THREE.Points(
                geometry,
                material
            );


        stars.name =
            "Deep Space Stars";


        this.group.add(
            stars
        );

    }


    // ========================================================
    // SUN
    // ========================================================

    createSun() {

        const sun =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    2.45,
                    64,
                    40
                ),

                new THREE.MeshBasicMaterial({
                    color:
                        0xffc857
                })

            );


        sun.name =
            "Sun";


        sun.userData =
            this.createComponentData({

                name:
                    "Sun",

                category:
                    "Star",

                type:
                    "star",

                description:
                    "The Sun is the star at the center of the Solar System and supplies energy to the planets.",

                facts: [
                    "The Sun is a star.",
                    "Its gravity controls the orbital system.",
                    "It is located at the center of the Solar System."
                ],

                student:
                    "The Sun is the central star and its gravity influences the planets.",

                teacher:
                    "Use the Sun to introduce stars, gravity and planetary systems.",

                stats: {

                    Type:
                        "Star",

                    Role:
                        "Central Star",

                    Position:
                        "Center"

                }

            });


        this.group.add(
            sun
        );


        this.sun =
            sun;


        this.selectable.push(
            sun
        );


        this.hoverable.push(
            sun
        );


        this.componentObjects.push(
            sun
        );


        // ----------------------------------------------------
        // GLOW
        // ----------------------------------------------------

        const glow =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    3.05,
                    48,
                    32
                ),

                new THREE.MeshBasicMaterial({

                    color:
                        0xffb52e,

                    transparent:
                        true,

                    opacity:
                        0.15,

                    side:
                        THREE.BackSide

                })

            );


        glow.name =
            "Sun Glow";


        this.group.add(
            glow
        );


        // ----------------------------------------------------
        // LIGHT
        // ----------------------------------------------------

        const light =
            new THREE.PointLight(
                0xffe3a5,
                1300,
                200
            );


        light.name =
            "Solar Light";


        this.group.add(
            light
        );


        // ----------------------------------------------------
        // LABEL
        // ----------------------------------------------------

        const label =
            this.createLabel(
                "SUN",
                "#ffd86b",
                1.05
            );


        label.position.set(
            0,
            3.2,
            0
        );


        sun.add(
            label
        );


        this.sunLabel =
            label;

    }


    // ========================================================
    // ORBIT SYSTEM
    // ========================================================

    createOrbitSystem() {

        this.orbitGroup =
            new THREE.Group();

        this.orbitGroup.name =
            "Planetary Orbits";

        this.group.add(
            this.orbitGroup
        );

    }


    createOrbit(
        radius,
        color = 0x64748b,
        opacity = 0.28
    ) {

        const points =
            [];

        const segments =
            256;


        for (
            let i = 0;
            i <= segments;
            i++
        ) {

            const angle =
                (
                    i /
                    segments
                ) *
                Math.PI *
                2;


            points.push(

                new THREE.Vector3(

                    Math.cos(
                        angle
                    ) *
                    radius,

                    0,

                    Math.sin(
                        angle
                    ) *
                    radius

                )

            );

        }


        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints(
                    points
                );


        const material =
            new THREE.LineBasicMaterial({

                color,

                transparent:
                    true,

                opacity

            });


        return new THREE.Line(
            geometry,
            material
        );

    }


    // ========================================================
    // PLANETS
    // ========================================================

    createPlanets() {

        PLANETS.forEach(
            data => {

                this.createPlanet(
                    data
                );

            }
        );

    }


    createPlanet(
        data
    ) {

        const orbit =
            this.createOrbit(
                data.orbit,
                0x64748b,
                0.30
            );


        orbit.name =
            `${data.name} Orbit`;


        orbit.userData =
            this.createComponentData({

                name:
                    `${data.name} Orbit`,

                category:
                    "Orbit",

                type:
                    "orbit",

                description:
                    `The orbital path followed by ${data.name} around the Sun.`,

                facts: [
                    `One complete orbit takes approximately ${data.period} Earth days.`
                ],

                student:
                    `${data.name} travels along this orbital path.`,

                teacher:
                    "Compare planetary orbital distance and period."

            });


        this.orbitGroup.add(
            orbit
        );


        const pivot =
            new THREE.Group();


        pivot.name =
            `${data.name} Orbit Pivot`;


        this.group.add(
            pivot
        );


        const planet =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    data.radius * 0.82,
                    48,
                    32
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        data.color,

                    roughness:
                        0.74,

                    metalness:
                        0.03

                })

            );


        planet.position.x =
            data.orbit;


        planet.name =
            data.name;


        planet.userData =
            this.createComponentData({

                name:
                    data.name,

                category:
                    "Planet",

                type:
                    "planet",

                description:
                    data.description,

                facts:
                    data.facts,

                student:
                    data.student,

                teacher:
                    data.teacher,

                stats: {

                    "Distance from Sun":
                        `${data.distanceAU} AU`,

                    "Diameter":
                        `${data.diameterKm.toLocaleString()} km`,

                    "Gravity":
                        `${data.gravity} m/s²`,

                    "Orbital Period":
                        `${data.period} days`,

                    "Moons":
                        String(
                            data.moons
                        ),

                    "Temperature":
                        data.temperature

                }

            });


        pivot.add(
            planet
        );


        this.selectable.push(
            planet
        );


        this.hoverable.push(
            planet
        );


        this.componentObjects.push(
            planet
        );


        const label =
            this.createLabel(
                data.name,
                this.getLabelColor(
                    data.name
                ),
                0.72
            );


        label.position.set(
            0,
            data.radius * 0.82 +
                0.62,
            0
        );


        planet.add(
            label
        );


        if (
            data.name ===
            "Earth"
        ) {

            this.createEarth(
                planet
            );

        }


        if (
            data.name ===
            "Jupiter"
        ) {

            this.createJupiter(
                planet
            );

        }


        if (
            data.name ===
            "Saturn"
        ) {

            this.createSaturn(
                planet
            );

        }


        if (
            data.name ===
            "Uranus"
        ) {

            this.createUranus(
                planet
            );

        }


        if (
            data.moons > 0
        ) {

            this.createMoons(
                data,
                planet
            );

        }


        this.planets.push({

            name:
                data.name,

            orbit:
                data.orbit,

            period:
                data.period,

            phase:
                data.phase,

            planet,

            pivot,

            label,

            data

        });

    }


    // ========================================================
    // EARTH
    // ========================================================

    createEarth(
        planet
    ) {

        const atmosphere =
            new THREE.Mesh(

                new THREE.SphereGeometry(
                    0.84,
                    40,
                    28
                ),

                new THREE.MeshBasicMaterial({

                    color:
                        0x8fdcff,

                    transparent:
                        true,

                    opacity:
                        0.12,

                    side:
                        THREE.BackSide

                })

            );


        atmosphere.name =
            "Earth Atmosphere";


        planet.add(
            atmosphere
        );

    }


    // ========================================================
    // JUPITER
    // ========================================================

    createJupiter(
        planet
    ) {

        const colors = [

            0xc5a37a,
            0x8d6e54,
            0xe4c49b,
            0x9b765e,
            0xd9ad82

        ];


        colors.forEach(
            (
                color,
                index
            ) => {

                const band =
                    new THREE.Mesh(

                        new THREE.TorusGeometry(
                            1.35 -
                                index *
                                0.12,
                            0.035,
                            8,
                            64
                        ),

                        new THREE.MeshBasicMaterial({
                            color
                        })

                    );


                band.rotation.x =
                    Math.PI / 2;


                band.position.y =
                    (
                        index -
                        2
                    ) *
                    0.17;


                planet.add(
                    band
                );

            }
        );

    }


    // ========================================================
    // SATURN
    // ========================================================

    createSaturn(
        planet
    ) {

        const rings =
            new THREE.Group();


        rings.name =
            "Saturn Ring System";


        const colors = [

            0xf5e6b8,
            0xd9c99a,
            0xb8a77e,
            0xe9dbb1,
            0xc0ae89

        ];


        colors.forEach(
            (
                color,
                index
            ) => {

                const inner =
                    1.45 +
                    index *
                    0.16;


                const outer =
                    inner +
                    0.10;


                const ring =
                    new THREE.Mesh(

                        new THREE.RingGeometry(
                            inner,
                            outer,
                            96
                        ),

                        new THREE.MeshStandardMaterial({

                            color,

                            side:
                                THREE.DoubleSide,

                            transparent:
                                true,

                            opacity:
                                0.74,

                            roughness:
                                0.88

                        })

                    );


                ring.rotation.x =
                    Math.PI / 2.12;


                rings.add(
                    ring
                );

            }
        );


        rings.userData =
            this.createComponentData({

                name:
                    "Saturn Rings",

                category:
                    "Planetary Component",

                type:
                    "rings",

                description:
                    "Saturn's rings are made of many ice and rocky particles orbiting the planet.",

                facts: [
                    "The ring system has many separate bands.",
                    "The rings orbit Saturn.",
                    "The rings are not a single solid disk."
                ],

                student:
                    "Saturn's rings contain many separate particles orbiting the planet.",

                teacher:
                    "Use Saturn's rings to demonstrate orbital motion."

            });


        planet.add(
            rings
        );

    }


    // ========================================================
    // URANUS
    // ========================================================

    createUranus(
        planet
    ) {

        const ring =
            new THREE.Mesh(

                new THREE.RingGeometry(
                    1.10,
                    1.28,
                    96
                ),

                new THREE.MeshStandardMaterial({

                    color:
                        0xa8e4e8,

                    transparent:
                        true,

                    opacity:
                        0.30,

                    side:
                        THREE.DoubleSide

                })

            );


        ring.rotation.x =
            Math.PI / 2.35;


        ring.name =
            "Uranus Rings";


        planet.add(
            ring
        );

    }


    // ========================================================
    // MOONS
    // ========================================================

    createMoons(
        data,
        planet
    ) {

        const count =
            Math.min(
                data.moons,
                5
            );


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const pivot =
                new THREE.Group();


            pivot.rotation.y =
                (
                    i /
                    count
                ) *
                Math.PI *
                2;


            const moon =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        Math.max(
                            0.09,
                            data.radius *
                            0.12
                        ),
                        20,
                        16
                    ),

                    new THREE.MeshStandardMaterial({

                        color:
                            0xd1d5db,

                        roughness:
                            0.95

                    })

                );


            moon.position.x =
                data.radius *
                0.82 +
                0.72 +
                i *
                0.28;


            moon.name =
                `${data.name} Moon ${i + 1}`;


            moon.userData =
                this.createComponentData({

                    name:
                        moon.name,

                    category:
                        "Moon",

                    type:
                        "satellite",

                    description:
                        `A simplified natural satellite associated with ${data.name}.`,

                    facts: [
                        "A natural satellite orbits a larger body.",
                        "Moons can have different sizes and orbital distances."
                    ],

                    student:
                        "A moon is a natural object that orbits a planet.",

                    teacher:
                        "Use moons to explain natural satellites and orbital motion.",

                    stats: {

                        Parent:
                            data.name,

                        Type:
                            "Natural Satellite"

                    }

                });


            pivot.add(
                moon
            );


            planet.add(
                pivot
            );


            this.hoverable.push(
                moon
            );


            this.componentObjects.push(
                moon
            );

        }

    }


    // ========================================================
    // DWARF PLANETS
    // ========================================================

    createDwarfPlanets() {

        const group =
            new THREE.Group();


        group.name =
            "Dwarf Planets";


        this.group.add(
            group
        );


        DWARF_OBJECTS.forEach(
            data => {

                const orbit =
                    this.createOrbit(
                        data.orbit,
                        0x475569,
                        0.16
                    );


                this.orbitGroup.add(
                    orbit
                );


                const pivot =
                    new THREE.Group();


                group.add(
                    pivot
                );


                const planet =
                    new THREE.Mesh(

                        new THREE.SphereGeometry(
                            data.radius,
                            36,
                            24
                        ),

                        new THREE.MeshStandardMaterial({

                            color:
                                data.color,

                            roughness:
                                0.90

                        })

                    );


                planet.position.x =
                    data.orbit;


                planet.name =
                    data.name;


                planet.userData =
                    this.createComponentData({

                        name:
                            data.name,

                        category:
                            "Dwarf Planet",

                        type:
                            "dwarf-planet",

                        description:
                            data.description,

                        facts: [
                            data.description
                        ],

                        student:
                            data.student,

                        teacher:
                            data.teacher,

                        stats: {

                            "Object Type":
                                "Dwarf Planet"

                        }

                    });


                pivot.add(
                    planet
                );


                this.selectable.push(
                    planet
                );


                this.hoverable.push(
                    planet
                );


                this.componentObjects.push(
                    planet
                );


                const label =
                    this.createLabel(
                        data.name,
                        "#ffffff",
                        0.50
                    );


                label.position.set(
                    0,
                    data.radius +
                        0.32,
                    0
                );


                planet.add(
                    label
                );


                this.dwarfs.push({

                    name:
                        data.name,

                    orbit:
                        data.orbit,

                    phase:
                        data.phase,

                    pivot,

                    planet,

                    label,

                    data

                });

            }
        );

    }


    // ========================================================
    // ASTEROID BELT
    // ========================================================

    createAsteroidBelt() {

        const group =
            new THREE.Group();


        group.name =
            "Asteroid Belt";


        group.userData =
            this.createComponentData({

                name:
                    "Asteroid Belt",

                category:
                    "Small Bodies",

                type:
                    "asteroid-belt",

                description:
                    "A region containing many rocky objects mainly between Mars and Jupiter.",

                facts: [
                    "The asteroid belt lies mainly between Mars and Jupiter.",
                    "Most asteroids are much smaller than planets.",
                    "The objects orbit the Sun."
                ],

                student:
                    "The asteroid belt contains many small rocky objects orbiting the Sun.",

                teacher:
                    "Use the asteroid belt to introduce small Solar System bodies."

            });


        this.group.add(
            group
        );


        for (
            let i = 0;
            i < 520;
            i++
        ) {

            const radius =
                13.55 +
                Math.random() *
                1.35;


            const angle =
                Math.random() *
                Math.PI *
                2;


            const y =
                (
                    Math.random() -
                    0.5
                ) *
                0.40;


            const size =
                0.018 +
                Math.random() *
                0.05;


            const asteroid =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        size,
                        7,
                        6
                    ),

                    new THREE.MeshStandardMaterial({

                        color:
                            0x8e847a,

                        roughness:
                            1

                    })

                );


            asteroid.position.set(

                Math.cos(angle) *
                radius,

                y,

                Math.sin(angle) *
                radius

            );


            group.add(
                asteroid
            );

        }


        this.hoverable.push(
            group
        );


        this.componentObjects.push(
            group
        );

    }


    // ========================================================
    // KUIPER BELT
    // ========================================================

    createKuiperBelt() {

        const group =
            new THREE.Group();


        group.name =
            "Kuiper Belt";


        group.userData =
            this.createComponentData({

                name:
                    "Kuiper Belt",

                category:
                    "Outer Solar System",

                type:
                    "belt",

                description:
                    "A distant region beyond Neptune containing many icy bodies and dwarf planets.",

                facts: [
                    "The Kuiper Belt is beyond Neptune.",
                    "It contains many icy objects.",
                    "Several dwarf planets are associated with this region."
                ],

                student:
                    "The Kuiper Belt is a distant region containing many icy objects.",

                teacher:
                    "Use the Kuiper Belt to introduce the outer Solar System."

            });


        this.group.add(
            group
        );


        for (
            let i = 0;
            i < 260;
            i++
        ) {

            const radius =
                29.8 +
                Math.random() *
                4.8;


            const angle =
                Math.random() *
                Math.PI *
                2;


            const object =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.02 +
                        Math.random() *
                        0.045,
                        7,
                        6
                    ),

                    new THREE.MeshBasicMaterial({

                        color:
                            0x60a5fa,

                        transparent:
                            true,

                        opacity:
                            0.72

                    })

                );


            object.position.set(

                Math.cos(angle) *
                radius,

                (
                    Math.random() -
                    0.5
                ) *
                0.45,

                Math.sin(angle) *
                radius

            );


            group.add(
                object
            );

        }


        this.kuiperBelt =
            group;


        this.hoverable.push(
            group
        );


        this.componentObjects.push(
            group
        );

    }


    // ========================================================
    // GRID
    // ========================================================

    createReferenceGrid() {

        const grid =
            new THREE.GridHelper(
                90,
                45,
                0x1e293b,
                0x0f172a
            );


        grid.position.y =
            -0.08;


        grid.material.transparent =
            true;


        grid.material.opacity =
            0.06;


        grid.name =
            "Reference Grid";


        this.group.add(
            grid
        );

    }


    // ========================================================
    // EDUCATIONAL LABELS
    // ========================================================

    createEducationalMarkers() {

        const asteroidLabel =
            this.createLabel(
                "ASTEROID BELT",
                "#d6d3d1",
                0.48
            );


        asteroidLabel.position.set(
            13.4,
            0.5,
            0
        );


        this.group.add(
            asteroidLabel
        );


        const kuiperLabel =
            this.createLabel(
                "KUIPER BELT",
                "#93c5fd",
                0.46
            );


        kuiperLabel.position.set(
            30.7,
            0.5,
            0
        );


        this.group.add(
            kuiperLabel
        );

    }


    // ========================================================
    // DATA BUILDER
    // ========================================================

    createComponentData(
        data
    ) {

        return {

            name:
                data.name ||
                "Unknown",

            category:
                data.category ||
                "Solar System",

            type:
                data.type ||
                "component",

            description:
                data.description ||
                "",

            facts:
                Array.isArray(
                    data.facts
                )
                    ? data.facts
                    : [],

            student:
                data.student ||
                data.description ||
                "",

            teacher:
                data.teacher ||
                data.description ||
                "",

            stats:
                data.stats ||
                {}

        };

    }


    // ========================================================
    // LABEL
    // ========================================================

    createLabel(
        text,
        color = "#ffffff",
        scale = 0.7
    ) {

        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            640;

        canvas.height =
            160;


        const context =
            canvas.getContext(
                "2d"
            );


        if (!context) {

            return new THREE.Sprite();

        }


        context.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        context.font =
            "900 46px Arial";


        context.textAlign =
            "center";


        context.textBaseline =
            "middle";


        context.shadowColor =
            "rgba(0,0,0,.95)";


        context.shadowBlur =
            11;


        context.fillStyle =
            color;


        context.fillText(
            text,
            canvas.width / 2,
            canvas.height / 2
        );


        const texture =
            new THREE.CanvasTexture(
                canvas
            );


        texture.colorSpace =
            THREE.SRGBColorSpace;


        texture.needsUpdate =
            true;


        const material =
            new THREE.SpriteMaterial({

                map:
                    texture,

                transparent:
                    true,

                depthTest:
                    false,

                depthWrite:
                    false

            });


        const sprite =
            new THREE.Sprite(
                material
            );


        sprite.scale.set(
            2.45 * scale,
            0.61 * scale,
            1
        );


        sprite.name =
            `${text} Label`;


        return sprite;

    }


    // ========================================================
    // LABEL COLORS
    // ========================================================

    getLabelColor(
        name
    ) {

        const colors = {

            Mercury:
                "#e5e7eb",

            Venus:
                "#fde68a",

            Earth:
                "#93c5fd",

            Mars:
                "#fca5a5",

            Jupiter:
                "#fde68a",

            Saturn:
                "#fef3c7",

            Uranus:
                "#a5f3fc",

            Neptune:
                "#93c5fd"

        };


        return (
            colors[name] ||
            "#ffffff"
        );

    }


    // ========================================================
    // SPEED
    // ========================================================

    setSpeed(
        value
    ) {

        this.speed =
            Math.max(
                0.05,
                Number(value) ||
                1
            );

    }


    // ========================================================
    // FOCUS
    // ========================================================

    setFocus(
        value
    ) {

        if (value) {

            this.selected =
                value;

        }

    }


    // ========================================================
    // START
    // ========================================================

    start() {

        this.running =
            true;

    }


    // ========================================================
    // PAUSE
    // ========================================================

    pause() {

        this.running =
            !this.running;

    }


    // ========================================================
    // RUN STATE
    // ========================================================

    setRunning(
        value
    ) {

        this.running =
            Boolean(value);

    }


    // ========================================================
    // RESET
    // ========================================================

    reset() {

        this.time =
            0;

        this.speed =
            1;

        this.running =
            true;

        this.selected =
            "Earth";

        this.hovered =
            null;

    }


    // ========================================================
    // ORBITS
    // ========================================================

    setShowOrbits(
        value
    ) {

        this.showOrbits =
            Boolean(value);


        if (
            this.orbitGroup
        ) {

            this.orbitGroup.visible =
                this.showOrbits;

        }

    }


    // ========================================================
    // LABELS
    // ========================================================

    setShowLabels(
        value
    ) {

        this.showLabels =
            Boolean(value);


        this.group.traverse(
            object => {

                if (
                    object.isSprite
                ) {

                    object.visible =
                        this.showLabels;

                }

            }
        );

    }


    // ========================================================
    // ASTEROIDS
    // ========================================================

    setShowAsteroids(
        value
    ) {

        this.showAsteroids =
            Boolean(value);


        const belt =
            this.group.getObjectByName(
                "Asteroid Belt"
            );


        if (
            belt
        ) {

            belt.visible =
                this.showAsteroids;

        }

    }


    // ========================================================
    // KUIPER
    // ========================================================

    setShowKuiperBelt(
        value
    ) {

        this.showKuiperBelt =
            Boolean(value);


        if (
            this.kuiperBelt
        ) {

            this.kuiperBelt.visible =
                this.showKuiperBelt;

        }

    }


    // ========================================================
    // EDUCATION MODE
    // ========================================================

    setEducationMode(
        mode
    ) {

        this.educationMode =
            mode === "student"
                ? "student"
                : "teacher";

    }


    // ========================================================
    // EDUCATIONAL DATA
    // ========================================================

    getEducationalData(
        name = this.selected
    ) {

        const component =
            this.componentObjects.find(
                object =>
                    object.userData?.name ===
                    name
            );


        if (
            component?.userData
        ) {

            return {
                ...component.userData
            };

        }


        const planet =
            this.planets.find(
                item =>
                    item.name ===
                    name
            );


        if (
            planet?.planet?.userData
        ) {

            return {
                ...planet.planet.userData
            };

        }


        const dwarf =
            this.dwarfs.find(
                item =>
                    item.name ===
                    name
            );


        if (
            dwarf?.planet?.userData
        ) {

            return {
                ...dwarf.planet.userData
            };

        }


        return {

            name:
                name,

            category:
                "Solar System",

            type:
                "component",

            description:
                "Select a Solar System component to learn more.",

            facts: [],

            student:
                "Move the pointer over a component or select it to see more information.",

            teacher:
                "Select a component to begin the lesson.",

            stats: {}

        };

    }


    // ========================================================
    // SELECT COMPONENT
    // ========================================================

    selectComponent(
        object
    ) {

        if (!object) {
            return null;
        }


        let current =
            object;


        while (
            current &&
            !current.userData?.name
        ) {

            current =
                current.parent;

        }


        if (!current) {
            return null;
        }


        this.selected =
            current.userData.name ||
            current.name ||
            this.selected;


        const data =
            this.getEducationalData(
                this.selected
            );


        window.dispatchEvent(

            new CustomEvent(
                "physics-component-selected",
                {
                    detail:
                        data
                }
            )

        );


        return data;

    }


    // ========================================================
    // HOVER
    // ========================================================

    onHover(
        object
    ) {

        if (!object) {

            this.hovered =
                null;

            return null;

        }


        let current =
            object;


        while (
            current &&
            !current.userData?.name
        ) {

            current =
                current.parent;

        }


        if (!current) {

            this.hovered =
                null;

            return null;

        }


        this.hovered =
            current;


        return {
            ...current.userData
        };

    }


    // ========================================================
    // STATE
    // ========================================================

    getState() {

        const planet =
            this.planets.find(
                item =>
                    item.name ===
                    this.selected
            );


        const dwarf =
            this.dwarfs.find(
                item =>
                    item.name ===
                    this.selected
            );


        const target =
            planet ||
            dwarf;


        if (!target) {

            return {

                selected:
                    this.selected,

                speed:
                    this.speed,

                running:
                    this.running

            };

        }


        const data =
            target.data ||
            {};


        return {

            selected:
                target.name,

            speed:
                this.speed,

            running:
                this.running,

            category:
                data.type ||
                "planet",

            distanceAU:
                data.distanceAU ??
                null,

            diameterKm:
                data.diameterKm ??
                null,

            gravity:
                data.gravity ??
                null,

            periodDays:
                data.period ??
                null,

            moons:
                data.moons ??
                null,

            temperature:
                data.temperature ??
                null

        };

    }


    // ========================================================
    // COMPONENTS
    // ========================================================

    getComponents() {

        return [

            {
                name:
                    "Sun",

                category:
                    "Star"
            },

            ...this.planets.map(
                item => ({

                    name:
                        item.name,

                    category:
                        "Planet"

                })
            ),

            ...this.dwarfs.map(
                item => ({

                    name:
                        item.name,

                    category:
                        "Dwarf Planet"

                })
            ),

            {
                name:
                    "Asteroid Belt",

                category:
                    "Small Bodies"
            },

            {
                name:
                    "Kuiper Belt",

                category:
                    "Outer Solar System"
            }

        ];

    }


    // ========================================================
    // UPDATE
    // ========================================================

    update(
        delta
    ) {

        if (!this.running) {
            return;
        }


        this.time +=
            delta *
            this.speed;


        this.planets.forEach(
            item => {

                const orbitalSpeed =
                    0.62 /
                    Math.sqrt(
                        Math.max(
                            item.period,
                            1
                        ) /
                        365
                    );


                item.pivot.rotation.y =
                    (
                        this.time *
                        orbitalSpeed
                    ) +
                    item.phase;


                item.planet.rotation.y +=
                    delta *
                    0.28;

            }
        );


        this.dwarfs.forEach(
            item => {

                const orbitalSpeed =
                    0.16 /
                    Math.sqrt(
                        Math.max(
                            item.orbit,
                            1
                        )
                    );


                item.pivot.rotation.y =
                    (
                        this.time *
                        orbitalSpeed
                    ) +
                    item.phase;


                item.planet.rotation.y +=
                    delta *
                    0.14;

            }
        );


        const asteroidBelt =
            this.group.getObjectByName(
                "Asteroid Belt"
            );


        if (
            asteroidBelt
        ) {

            asteroidBelt.rotation.y +=
                delta *
                0.025 *
                this.speed;

        }


        if (
            this.kuiperBelt
        ) {

            this.kuiperBelt.rotation.y +=
                delta *
                0.008 *
                this.speed;

        }


        if (
            this.sun
        ) {

            this.sun.rotation.y +=
                delta *
                0.035;

        }

    }


    // ========================================================
    // OBJECT
    // ========================================================

    getObject() {

        return this.group;

    }


    // ========================================================
    // SELECTABLE
    // ========================================================

    getSelectableObjects() {

        return this.selectable;

    }


    // ========================================================
    // HOVERABLE
    // ========================================================

    getHoverableObjects() {

        return this.hoverable;

    }


    // ========================================================
    // DISPOSE
    // ========================================================

    dispose() {

        this.group.traverse(
            object => {

                if (
                    object.geometry
                ) {

                    object.geometry.dispose();

                }


                if (
                    object.material
                ) {

                    const materials =
                        Array.isArray(
                            object.material
                        )
                            ? object.material
                            : [
                                object.material
                            ];


                    materials.forEach(
                        material => {

                            if (
                                material.map
                            ) {

                                material.map.dispose();

                            }


                            material.dispose();

                        }
                    );

                }

            }
        );


        this.selectable =
            [];

        this.hoverable =
            [];

        this.componentObjects =
            [];

        this.planets =
            [];

        this.dwarfs =
            [];

        this.sun =
            null;

        this.sunLabel =
            null;

        this.kuiperBelt =
            null;

    }

}