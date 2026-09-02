// ============================================================
// SciLab - Physics Laboratory
// LensOptics.js
// Lens & Ray Optics Teaching Laboratory
// ============================================================

import * as THREE from "three";


export class LensOptics {

    constructor() {

        // ====================================================
        // ROOT
        // ====================================================

        this.group =
            new THREE.Group();

        this.group.name =
            "Lens & Ray Optics Laboratory";

            
this.group.scale.setScalar(
    3.55
);


        this.group.userData = {

            name:
                "Lens & Ray Optics Laboratory",

            category:
                "Optics Laboratory",

            type:
                "laboratory",

            description:
                "Interactive thin-lens laboratory for studying object position, principal rays and image formation.",

            facts: [

                "Uses the thin-lens equation.",
                "Shows the principal ray construction.",
                "Supports convex and concave lenses.",
                "Shows real and virtual image formation."

            ],

            teacher:
                "Use the controls to place the object at F, 2F, between F and 2F, beyond 2F, inside F, or at infinity."

        };


        // ====================================================
        // PARAMETERS
        // ====================================================

        this.lensType =
            "convex";

        this.focalLength =
            4;

        this.objectDistance =
            8;

        this.objectHeight =
            2.5;


        // ====================================================
        // VISIBILITY
        // ====================================================

        this.showRays =
            true;

        this.showLabels =
            true;

        this.showConstructionRays =
            true;


        // ====================================================
        // STATE
        // ====================================================

        this.running =
            false;

        this.scenario =
            "beyond-2f";

        this.state =
            null;


        // ====================================================
        // OPTICAL PLANE
        // ====================================================

        this.opticalPlaneX =
            0;


        // ====================================================
        // BASE LENS HEIGHT
        // ====================================================

        this.baseLensHeight =
            6;


        // ====================================================
        // GROUPS
        // ====================================================

        this.axisGroup =
            new THREE.Group();

        this.axisGroup.name =
            "Principal Axis";


        this.axisGroup.userData = {

            name:
                "Principal Axis",

            category:
                "Reference",

            type:
                "axis",

            description:
                "The horizontal reference axis passing through the optical center O.",

            facts: [

                "Object and image heights are measured from this axis.",
                "Focal points lie on this axis.",
                "The optical center O lies on this axis."

            ],

            teacher:
                "Use the principal axis to compare the heights and positions of the object and image."

        };


        this.lensGroup =
            new THREE.Group();

        this.lensGroup.name =
            "Lens";


        this.referenceGroup =
            new THREE.Group();

        this.referenceGroup.name =
            "Focal Points";


        this.rays =
            new THREE.Group();

        this.rays.name =
            "Principal Rays";


        this.guides =
            new THREE.Group();

        this.guides.name =
            "Construction Rays";


        this.object =
            new THREE.Group();

        this.object.name =
            "Object";


        this.object.userData = {

            name:
                "Object",

            category:
                "Object",

            type:
                "object",

            description:
                "The object is the source from which the principal light rays originate.",

            facts: [

                "The object is placed in front of the lens.",
                "Object distance changes image formation.",
                "Object height changes image height."

            ],

            teacher:
                "Move the object through F, 2F, between F and 2F, beyond 2F and inside F to compare the resulting images."

        };


        this.image =
            new THREE.Group();

        this.image.name =
            "Formed Image";


        this.labelsGroup =
            new THREE.Group();

        this.labelsGroup.name =
            "Optical Labels";


        this.group.add(

            this.axisGroup,

            this.lensGroup,

            this.referenceGroup,

            this.rays,

            this.guides,

            this.object,

            this.image,

            this.labelsGroup

        );


        // ====================================================
        // INITIALIZE
        // ====================================================

        this.createScene();

        this.updateOptics();

    }


    // ========================================================
    // SCENE
    // ========================================================

    createScene() {

        this.createPrincipalAxis();

        this.createLens();

        this.createObject();

        this.createReferenceSystem();

        this.createGrid();

    }


    // ========================================================
    // PRINCIPAL AXIS
    // ========================================================

    createPrincipalAxis() {

        const geometry =
            new THREE.BoxGeometry(
                30,
                0.025,
                0.025
            );


        const material =
            new THREE.MeshBasicMaterial({

                color:
                    0x64748b,

                transparent:
                    true,

                opacity:
                    0.90

            });


        const axis =
            new THREE.Mesh(
                geometry,
                material
            );


        axis.position.set(
            0,
            0,
            -0.20
        );


        axis.name =
            "Principal Axis";


        axis.userData = {

            ...this.axisGroup.userData

        };


        this.axisGroup.add(
            axis
        );

    }


    // ========================================================
    // GRID
    // ========================================================

    createGrid() {

        const grid =
            new THREE.GridHelper(
                30,
                30,
                0x26364b,
                0x142033
            );


        grid.rotation.x =
            Math.PI / 2;


        grid.position.y =
            -0.035;


        grid.position.z =
            -0.25;


        if (
            grid.material
        ) {

            grid.material.transparent =
                true;

            grid.material.opacity =
                0.14;

        }


        grid.name =
            "Optics Grid";


        grid.userData = {

            name:
                "Optics Grid",

            category:
                "Reference",

            type:
                "grid",

            description:
                "Reference grid used to estimate positions and heights in the optics scene."

        };


        this.group.add(
            grid
        );

    }


    // ========================================================
    // LENS
    // ========================================================

    createLens() {

        this.rebuildLens();

    }


    // ========================================================
    // CALCULATE REQUIRED LENS HEIGHT
    // ========================================================

    getRequiredLensHeight() {

        const d =
            this.objectDistance;

        const f =
            this.focalLength;

        const h =
            this.objectHeight;


        let required =
            this.baseLensHeight;


        if (
            !Number.isFinite(d)
        ) {

            return required;

        }


        if (
            Math.abs(
                d - f
            ) <
            0.0001
        ) {

            return required;

        }


        if (
            this.lensType ===
            "convex"
        ) {

            const denominator =
                d - f;


            if (
                Math.abs(
                    denominator
                ) >
                0.0001
            ) {

                const y =
                    -(
                        h *
                        f
                    ) /
                    denominator;


                if (
                    Number.isFinite(y)
                ) {

                    required =
                        Math.max(
                            required,
                            Math.abs(y) * 2 + 1
                        );

                }

            }

        } else {

            const denominator =
                d + f;


            if (
                Math.abs(
                    denominator
                ) >
                0.0001
            ) {

                const y =
                    h *
                    f /
                    denominator;


                if (
                    Number.isFinite(y)
                ) {

                    required =
                        Math.max(
                            required,
                            Math.abs(y) * 2 + 1
                        );

                }

            }

        }


        return Math.min(
            14,
            required
        );

    }


    // ========================================================
    // REBUILD LENS
    // ========================================================

    rebuildLens() {

        this.disposeGroupChildren(
            this.lensGroup
        );


        const isConvex =
            this.lensType ===
            "convex";


        const lensHeight =
            this.getRequiredLensHeight();


        const halfHeight =
            lensHeight /
            2;


        const shape =
            new THREE.Shape();


        const edgeThickness =
            isConvex
                ? 0.10
                : 0.70;


        const centerThickness =
            isConvex
                ? 0.78
                : 0.20;


        const samples =
            96;


        const leftPoints = [];

        const rightPoints = [];


        for (
            let i = 0;
            i <= samples;
            i++
        ) {

            const y =
                -halfHeight +
                (
                    lensHeight *
                    i /
                    samples
                );


            const normalized =
                y /
                halfHeight;


            const curve =
                Math.sqrt(
                    Math.max(
                        0,
                        1 -
                        normalized *
                        normalized
                    )
                );


            const halfWidth =
                edgeThickness +
                (
                    centerThickness -
                    edgeThickness
                ) *
                curve;


            leftPoints.push(
                new THREE.Vector2(
                    -halfWidth,
                    y
                )
            );


            rightPoints.push(
                new THREE.Vector2(
                    halfWidth,
                    y
                )
            );

        }


        shape.moveTo(
            leftPoints[0].x,
            leftPoints[0].y
        );


        for (
            const point of leftPoints
        ) {

            shape.lineTo(
                point.x,
                point.y
            );

        }


        for (
            let i =
                rightPoints.length -
                1;

            i >= 0;

            i--
        ) {

            shape.lineTo(
                rightPoints[i].x,
                rightPoints[i].y
            );

        }


        shape.closePath();


        const geometry =
            new THREE.ExtrudeGeometry(
                shape,
                {

                    depth:
                        0.42,

                    bevelEnabled:
                        true,

                    bevelSegments:
                        5,

                    bevelThickness:
                        0.035,

                    bevelSize:
                        0.035,

                    curveSegments:
                        32

                }
            );


        geometry.translate(
            0,
            0,
            -0.21
        );


        const material =
            new THREE.MeshPhysicalMaterial({

                color:
                    isConvex
                        ? 0x60a5fa
                        : 0xa78bfa,

                transparent:
                    true,

                opacity:
                    0.40,

                roughness:
                    0.06,

                metalness:
                    0.01,

                transmission:
                    0.24,

                thickness:
                    0.50,

                side:
                    THREE.DoubleSide,

                depthWrite:
                    false

            });


        this.lens =
            new THREE.Mesh(
                geometry,
                material
            );


        this.lens.name =
            isConvex
                ? "Convex Lens"
                : "Concave Lens";


        this.lens.userData = {

            name:
                this.lens.name,

            category:
                "Lens",

            type:
                "lens",

            lensType:
                this.lensType,

            description:
                isConvex
                    ? "A convex lens is thicker at the center and converges light rays."
                    : "A concave lens is thinner at the center and diverges light rays.",

            facts:
                isConvex
                    ? [

                        "Thicker in the middle.",
                        "Converging lens.",
                        "Can form real or virtual images.",
                        "Uses focal points F₁ and F₂."

                    ]
                    : [

                        "Thinner in the middle.",
                        "Diverging lens.",
                        "Forms a virtual, upright and diminished image.",
                        "Uses virtual focal point F₁."

                    ],

            stats: {

                "Lens type":
                    isConvex
                        ? "Convex"
                        : "Concave",

                "Focal length":
                    `${this.focalLength} units`

            },

            teacher:
                isConvex
                    ? "A convex lens can produce real or virtual images depending on object position."
                    : "A concave lens produces a virtual, upright and diminished image for a real object."

        };


        this.lensGroup.add(
            this.lens
        );


        // ====================================================
        // OPTICAL CENTER LINE
        // ====================================================

        const centerGeometry =
            new THREE.BufferGeometry()
                .setFromPoints([

                    new THREE.Vector3(
                        0,
                        -0.38,
                        0.50
                    ),

                    new THREE.Vector3(
                        0,
                        0.38,
                        0.50
                    )

                ]);


        const centerLine =
            new THREE.Line(

                centerGeometry,

                new THREE.LineBasicMaterial({

                    color:
                        0xffffff,

                    transparent:
                        true,

                    opacity:
                        0.75

                })

            );


        centerLine.name =
            "Optical Center O";


        centerLine.userData = {

            name:
                "Optical Center O",

            category:
                "Optical Center",

            type:
                "optical-center",

            description:
                "The optical center O is the point through which a principal optical-center ray passes approximately undeviated.",

            facts: [

                "Located at the center of the thin lens.",
                "A ray through O is approximately undeviated.",
                "It lies on the principal axis."

            ],

            teacher:
                "Use the optical-center ray as the second principal ray when locating the image."

        };


        this.lensGroup.add(
            centerLine
        );


        // ====================================================
        // OPTICAL PLANE
        // ====================================================

        const planeGeometry =
            new THREE.BufferGeometry()
                .setFromPoints([

                    new THREE.Vector3(
                        0,
                        -halfHeight,
                        0.45
                    ),

                    new THREE.Vector3(
                        0,
                        halfHeight,
                        0.45
                    )

                ]);


        const planeLine =
            new THREE.Line(

                planeGeometry,

                new THREE.LineBasicMaterial({

                    color:
                        isConvex
                            ? 0x93c5fd
                            : 0xc4b5fd,

                    transparent:
                        true,

                    opacity:
                        0.55

                })

            );


        planeLine.name =
            "Optical Plane";


        planeLine.userData = {

            name:
                "Optical Plane",

            category:
                "Lens Reference",

            type:
                "optical-plane",

            description:
                "The optical plane is the idealized plane through which the thin-lens refraction is represented."

        };


        this.lensGroup.add(
            planeLine
        );

    }


    // ========================================================
    // OBJECT
    // ========================================================

    createObject() {

        this.rebuildObject();

    }


    // ========================================================
    // REBUILD OBJECT
    // ========================================================

    rebuildObject() {

        this.disposeGroupChildren(
            this.object
        );


        const material =
            new THREE.MeshStandardMaterial({

                color:
                    0x4ade80,

                roughness:
                    0.32

            });


        const stem =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.065,
                    0.065,
                    this.objectHeight,
                    18
                ),

                material

            );


        stem.position.y =
            this.objectHeight /
            2;


        stem.name =
            "Object Arrow";


        const head =
            new THREE.Mesh(

                new THREE.ConeGeometry(
                    0.18,
                    0.42,
                    20
                ),

                material.clone()

            );


        head.position.y =
            this.objectHeight +
            0.21;


        head.name =
            "Object Arrow Head";


        this.object.add(
            stem,
            head
        );


        this.object.position.z =
            0.50;

    }


    // ========================================================
    // REFERENCE SYSTEM
    // ========================================================

    createReferenceSystem() {

        this.updateReferenceSystem();

    }


    // ========================================================
    // REFERENCE POINTS
    // ========================================================

    updateReferenceSystem() {

        this.disposeGroupChildren(
            this.referenceGroup
        );


        this.disposeGroupChildren(
            this.labelsGroup
        );


        const f =
            this.focalLength;


        const points = [

            {

                x:
                    -2 * f,

                label:
                    "2F₁",

                type:
                    "2F"

            },

            {

                x:
                    -f,

                label:
                    "F₁",

                type:
                    "F"

            },

            {

                x:
                    0,

                label:
                    "O",

                type:
                    "O"

            },

            {

                x:
                    f,

                label:
                    "F₂",

                type:
                    "F"

            },

            {

                x:
                    2 * f,

                label:
                    "2F₂",

                type:
                    "2F"

            }

        ];


        for (
            const point of points
        ) {

            const color =
                point.type === "O"
                    ? 0xffffff
                    : point.type === "2F"
                        ? 0xffb300
                        : 0xffd54a;


            // =================================================
            // MARKER
            // =================================================

            const marker =
                new THREE.Mesh(

                    new THREE.SphereGeometry(

                        point.type === "O"
                            ? 0.14
                            : 0.12,

                        24,
                        24

                    ),

                    new THREE.MeshStandardMaterial({

                        color,

                        emissive:
                            color,

                        emissiveIntensity:
                            0.25

                    })

                );


            marker.position.set(
                point.x,
                0,
                0.46
            );


            const fullName =
                point.label === "O"
                    ? "Optical Center O"
                    : point.label;


            const category =
                point.type === "F"
                    ? "Principal Focus"
                    : point.type === "2F"
                        ? "Twice Focal Length"
                        : "Optical Center";


            let description;


            if (
                point.type === "F"
            ) {

                description =
                    "A principal focus of the lens.";

            } else if (
                point.type === "2F"
            ) {

                description =
                    "A reference point located at twice the focal length.";

            } else {

                description =
                    "The optical center of the thin lens.";

            }


            marker.name =
                fullName;


            marker.userData = {

                name:
                    fullName,

                category,

                type:
                    point.type === "F"
                        ? "focus"
                        : point.type === "2F"
                            ? "2f"
                            : "optical-center",

                position:
                    point.label,

                x:
                    point.x,

                description,

                facts:
                    point.type === "F"
                        ? [

                            "F = focal point.",
                            "Distance from O to F = focal length.",
                            "There is one principal focus on each side."

                        ]
                        : point.type === "2F"
                            ? [

                                "2F is twice the focal length.",
                                "An object at 2F forms an image at 2F for a convex lens.",
                                "At 2F the image has the same size as the object."

                            ]
                            : [

                                "O is the optical center.",
                                "The optical-center ray is approximately undeviated."

                            ],

                stats: {

                    Position:
                        `${point.x.toFixed(2)} units`,

                    "Focal length":
                        `${this.focalLength.toFixed(2)} units`

                },

                teacher:
                    point.type === "F"
                        ? "Use F to explain the transition between real and virtual image formation."
                        : point.type === "2F"
                            ? "Use 2F to demonstrate the same-size image condition."
                            : "Use O to demonstrate the undeviated optical-center ray."

            };


            this.referenceGroup.add(
                marker
            );


            // =================================================
            // SMALL VERTICAL MARK
            // =================================================

            if (
                point.type !== "O"
            ) {

                const markerGeometry =
                    new THREE.BufferGeometry()
                        .setFromPoints([

                            new THREE.Vector3(
                                point.x,
                                -0.18,
                                0.42
                            ),

                            new THREE.Vector3(
                                point.x,
                                0.18,
                                0.42
                            )

                        ]);


                const line =
                    new THREE.Line(

                        markerGeometry,

                        new THREE.LineBasicMaterial({

                            color,

                            transparent:
                                true,

                            opacity:
                                0.65

                        })

                    );


                line.name =
                    `${fullName} Reference`;


                line.userData = {

                    name:
                        `${fullName} Reference`,

                    category,

                    type:
                        "reference-marker",

                    description

                };


                this.referenceGroup.add(
                    line
                );

            }


            // =================================================
            // LARGE LABEL
            // =================================================

            if (
                this.showLabels
            ) {

                const label =
                    this.createTextSprite(
                        point.label,
                        color
                    );


                label.position.set(
                    point.x,
                    -0.68,
                    0.70
                );


                label.scale.set(
                    1.55,
                    0.58,
                    1
                );


                label.name =
                    `${fullName} Label`;


                label.userData = {

                    name:
                        `${fullName} Label`,

                    category,

                    type:
                        "label",

                    description

                };


                this.labelsGroup.add(
                    label
                );

            }

        }

    }


    // ========================================================
    // TEXT SPRITE
    // ========================================================

    createTextSprite(
        text,
        color
    ) {

        if (
            typeof document ===
            "undefined"
        ) {

            return new THREE.Object3D();

        }


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            384;

        canvas.height =
            128;


        const context =
            canvas.getContext(
                "2d"
            );


        context.clearRect(
            0,
            0,
            384,
            128
        );


        context.font =
            "900 64px Arial";


        context.textAlign =
            "center";


        context.textBaseline =
            "middle";


        context.fillStyle =
            "#" +
            new THREE.Color(
                color
            ).getHexString();


        context.shadowColor =
            "rgba(0,0,0,0.90)";


        context.shadowBlur =
            10;


        context.fillText(
            text,
            192,
            64
        );


        const texture =
            new THREE.CanvasTexture(
                canvas
            );


        texture.needsUpdate =
            true;


        const material =
            new THREE.SpriteMaterial({

                map:
                    texture,

                transparent:
                    true,

                depthWrite:
                    false,

                depthTest:
                    false

            });


        return new THREE.Sprite(
            material
        );

    }


    // ========================================================
    // SET LENS TYPE
    // ========================================================

    setLensType(
        value
    ) {

        const selected =
            String(
                value ?? ""
            )
                .trim()
                .toLowerCase();


        this.lensType =
            selected ===
            "concave"
                ? "concave"
                : "convex";


        this.rebuildLens();

        this.updateOptics();


        // Explicit metadata synchronization
        if (
            this.lens
        ) {

            const isConcave =
                this.lensType ===
                "concave";


            this.lens.name =
                isConcave
                    ? "Concave Lens"
                    : "Convex Lens";


            this.lens.userData.lensType =
                this.lensType;

            this.lens.userData.name =
                this.lens.name;

        }

    }


    // ========================================================
    // FOCAL LENGTH
    // ========================================================

    setFocalLength(
        value
    ) {

        const f =
            Number(value);


        if (
            Number.isFinite(f)
        ) {

            this.focalLength =
                Math.max(
                    1,
                    Math.min(
                        8,
                        f
                    )
                );

        }


        this.syncScenario();

        this.rebuildLens();

        this.updateOptics();

    }


    // ========================================================
    // OBJECT DISTANCE
    // ========================================================

    setObjectDistance(
        value
    ) {

        const d =
            Number(value);


        if (
            Number.isFinite(d)
        ) {

            this.objectDistance =
                Math.max(
                    0.25,
                    Math.min(
                        14,
                        d
                    )
                );

        }


        this.scenario =
            this.detectScenario();


        this.rebuildLens();

        this.updateOptics();

    }


    // ========================================================
    // OBJECT HEIGHT
    // ========================================================

    setObjectHeight(
        value
    ) {

        const h =
            Number(value);


        if (
            Number.isFinite(h)
        ) {

            this.objectHeight =
                Math.max(
                    0.5,
                    Math.min(
                        5,
                        h
                    )
                );

        }


        this.rebuildLens();

        this.updateOptics();

    }


    // ========================================================
    // SHOW RAYS
    // ========================================================

    setShowRays(
        value
    ) {

        this.showRays =
            Boolean(value);


        this.updateOptics();

    }


    // ========================================================
    // SHOW LABELS
    // ========================================================

    setShowLabels(
        value
    ) {

        this.showLabels =
            Boolean(value);


        this.updateReferenceSystem();

    }


    // ========================================================
    // CONSTRUCTION RAYS
    // ========================================================

    setShowConstructionRays(
        value
    ) {

        this.showConstructionRays =
            Boolean(value);


        this.updateOptics();

    }


    // ========================================================
    // SCENARIO
    // ========================================================

    setScenario(
        scenario
    ) {

        const value =
            String(
                scenario ?? ""
            )
                .trim()
                .toLowerCase();


        const f =
            this.focalLength;


        switch (
            value
        ) {

            case "infinity":

            case "inf":

            case "∞":

                this.scenario =
                    "infinity";

                this.objectDistance =
                    Infinity;

                break;


            case "beyond-2f":

            case "beyond2f":

            case ">2f":

                this.scenario =
                    "beyond-2f";

                this.objectDistance =
                    2.7 * f;

                break;


            case "2f":

            case "at-2f":

                this.scenario =
                    "2f";

                this.objectDistance =
                    2 * f;

                break;


            case "between-f-2f":

            case "f-2f":

            case "between":

                this.scenario =
                    "between-f-2f";

                this.objectDistance =
                    1.5 * f;

                break;


            case "f":

            case "at-f":

                this.scenario =
                    "f";

                this.objectDistance =
                    f;

                break;


            case "inside-f":

            case "o-f":

            case "between-o-f":

                this.scenario =
                    "inside-f";

                this.objectDistance =
                    0.65 * f;

                break;


            default:

                this.scenario =
                    this.detectScenario();

        }


        this.rebuildLens();

        this.updateOptics();

    }


    // ========================================================
    // PRESET ALIASES
    // ========================================================

    setObjectAtF() {

        this.setScenario(
            "f"
        );

    }


    setObjectAt2F() {

        this.setScenario(
            "2f"
        );

    }


    setObjectBetweenF2F() {

        this.setScenario(
            "between-f-2f"
        );

    }


    setObjectBeyond2F() {

        this.setScenario(
            "beyond-2f"
        );

    }


    setObjectBetweenLensF() {

        this.setScenario(
            "inside-f"
        );

    }


    setObjectInfinity() {

        this.setScenario(
            "infinity"
        );

    }


    // ========================================================
    // SYNC SCENARIO
    // ========================================================

    syncScenario() {

        const f =
            this.focalLength;


        switch (
            this.scenario
        ) {

            case "f":

                this.objectDistance =
                    f;

                break;


            case "2f":

                this.objectDistance =
                    2 * f;

                break;


            case "between-f-2f":

                this.objectDistance =
                    1.5 * f;

                break;


            case "beyond-2f":

                this.objectDistance =
                    2.7 * f;

                break;


            case "inside-f":

                this.objectDistance =
                    0.65 * f;

                break;


            case "infinity":

                this.objectDistance =
                    Infinity;

                break;

        }

    }


    // ========================================================
    // DETECT SCENARIO
    // ========================================================

    detectScenario() {

        const d =
            this.objectDistance;


        const f =
            this.focalLength;


        if (
            !Number.isFinite(d)
        ) {

            return "infinity";

        }


        if (
            Math.abs(
                d - f
            ) <
            0.05
        ) {

            return "f";

        }


        if (
            Math.abs(
                d -
                2 * f
            ) <
            0.05
        ) {

            return "2f";

        }


        if (
            d >
            2 * f
        ) {

            return "beyond-2f";

        }


        if (
            d >
            f
        ) {

            return "between-f-2f";

        }


        return "inside-f";

    }


    // ========================================================
    // OPTICAL CALCULATION
    // ========================================================

    calculateOptics() {

        const f =
            this.focalLength;

        const d =
            this.objectDistance;

        const h =
            this.objectHeight;


        // ====================================================
        // INFINITY
        // ====================================================

        if (
            !Number.isFinite(d)
        ) {

            if (
                this.lensType ===
                "convex"
            ) {

                return {

                    imageDistance:
                        f,

                    magnification:
                        0,

                    imageHeight:
                        0,

                    imageType:
                        "Real",

                    nature:
                        "Real image at F₂",

                    orientation:
                        "Inverted",

                    size:
                        "Highly diminished"

                };

            }


            return {

                imageDistance:
                    -f,

                magnification:
                    0,

                imageHeight:
                    0,

                imageType:
                    "Virtual",

                nature:
                    "Virtual image at F₁",

                orientation:
                    "Upright",

                size:
                    "Highly diminished"

            };

        }


        // ====================================================
        // CONCAVE
        // ====================================================

        if (
            this.lensType ===
            "concave"
        ) {

            const denominator =
                f + d;


            const imageDistance =
                -(
                    f * d
                ) /
                denominator;


            const magnification =
                -imageDistance /
                d;


            const imageHeight =
                magnification *
                h;


            return {

                imageDistance,

                magnification,

                imageHeight,

                imageType:
                    "Virtual",

                nature:
                    "Virtual, upright and diminished",

                orientation:
                    "Upright",

                size:
                    "Diminished"

            };

        }


        // ====================================================
        // CONVEX AT F
        // ====================================================

        const denominator =
            d - f;


        if (
            Math.abs(
                denominator
            ) <
            0.0001
        ) {

            return {

                imageDistance:
                    Infinity,

                magnification:
                    Infinity,

                imageHeight:
                    Infinity,

                imageType:
                    "At Infinity",

                nature:
                    "Image at infinity",

                orientation:
                    "Inverted",

                size:
                    "Highly magnified"

            };

        }


        // ====================================================
        // CONVEX FINITE
        // ====================================================

        const imageDistance =
            (
                f * d
            ) /
            denominator;


        const magnification =
            -imageDistance /
            d;


        const imageHeight =
            magnification *
            h;


        const imageType =
            imageDistance >
            0
                ? "Real"
                : "Virtual";


        const orientation =
            imageHeight <
            0
                ? "Inverted"
                : "Upright";


        const magnitude =
            Math.abs(
                magnification
            );


        let size;


        if (
            magnitude >
            1.05
        ) {

            size =
                "Magnified";

        } else if (
            magnitude <
            0.95
        ) {

            size =
                "Diminished";

        } else {

            size =
                "Same size";

        }


        let nature;


        if (
            imageDistance >
            0
        ) {

            if (
                d >
                2 * f
            ) {

                nature =
                    "Real, inverted and diminished";

            } else if (
                Math.abs(
                    d -
                    2 * f
                ) <
                0.05
            ) {

                nature =
                    "Real, inverted and same size";

            } else {

                nature =
                    "Real, inverted and magnified";

            }

        } else {

            nature =
                "Virtual, upright and magnified";

        }


        return {

            imageDistance,

            magnification,

            imageHeight,

            imageType,

            nature,

            orientation,

            size

        };

    }


    // ========================================================
    // UPDATE OPTICS
    // ========================================================

    updateOptics() {

        const result =
            this.calculateOptics();


        // ----------------------------------------------------
        // OBJECT
        // ----------------------------------------------------

        this.rebuildObject();


        this.object.position.x =
            Number.isFinite(
                this.objectDistance
            )
                ? -this.objectDistance
                : -12;


        // ----------------------------------------------------
        // REFERENCES
        // ----------------------------------------------------

        this.updateReferenceSystem();


        // ----------------------------------------------------
        // IMAGE
        // ----------------------------------------------------

        this.rebuildImage(
            result
        );


        // ----------------------------------------------------
        // RAYS
        // ----------------------------------------------------

        this.disposeGroupChildren(
            this.rays
        );


        this.disposeGroupChildren(
            this.guides
        );


        if (
            this.showRays
        ) {

            this.createPrincipalRays(
                result
            );

        }


        // ----------------------------------------------------
        // STATE
        // ----------------------------------------------------

        this.state = {

            lensType:
                this.lensType,

            scenario:
                this.detectScenario(),

            objectPosition:
                this.getObjectPositionName(),

            focalLength:
                this.focalLength,

            objectDistance:
                Number.isFinite(
                    this.objectDistance
                )
                    ? this.objectDistance
                    : Infinity,

            objectHeight:
                this.objectHeight,

            imageDistance:
                Number.isFinite(
                    result.imageDistance
                )
                    ? result.imageDistance
                    : Infinity,

            magnification:
                Number.isFinite(
                    result.magnification
                )
                    ? result.magnification
                    : Infinity,

            imageHeight:
                Number.isFinite(
                    result.imageHeight
                )
                    ? result.imageHeight
                    : Infinity,

            imageType:
                result.imageType,

            nature:
                result.nature,

            orientation:
                result.orientation,

            size:
                result.size,

            principalRays:
                3

        };

    }


    // ========================================================
    // OBJECT POSITION NAME
    // ========================================================

    getObjectPositionName() {

        const d =
            this.objectDistance;


        const f =
            this.focalLength;


        if (
            !Number.isFinite(d)
        ) {

            return "At Infinity";

        }


        if (
            this.lensType ===
            "concave"
        ) {

            return "In front of lens";

        }


        if (
            Math.abs(
                d - f
            ) <
            0.05
        ) {

            return "At F";

        }


        if (
            Math.abs(
                d -
                2 * f
            ) <
            0.05
        ) {

            return "At 2F";

        }


        if (
            d >
            2 * f
        ) {

            return "Beyond 2F";

        }


        if (
            d >
            f
        ) {

            return "Between F and 2F";

        }


        return "Between O and F";

    }


    // ========================================================
    // IMAGE
    // ========================================================

    rebuildImage(
        result
    ) {

        this.disposeGroupChildren(
            this.image
        );


        this.image.userData = {

            name:
                "Formed Image",

            category:
                "Image",

            type:
                "image",

            description:
                result.nature,

            facts: [

                `Image nature: ${result.nature}.`,

                `Orientation: ${result.orientation}.`,

                `Size: ${result.size}.`

            ],

            stats: {

                "Image distance":
                    Number.isFinite(
                        result.imageDistance
                    )
                        ? `${result.imageDistance.toFixed(2)} units`
                        : "Infinity",

                "Magnification":
                    Number.isFinite(
                        result.magnification
                    )
                        ? result.magnification.toFixed(2)
                        : "Infinity"

            },

            teacher:
                result.nature

        };


        if (
            !Number.isFinite(
                result.imageDistance
            )
        ) {

            return;

        }


        if (
            Math.abs(
                result.imageDistance
            ) >
            18
        ) {

            return;

        }


        const imageHeight =
            result.imageHeight;


        const absoluteHeight =
            Math.max(
                0.12,
                Math.min(
                    Math.abs(
                        imageHeight
                    ),
                    8
                )
            );


        const isVirtual =
            result.imageDistance <
            0;


        const material =
            new THREE.MeshStandardMaterial({

                color:
                    0xf97316,

                transparent:
                    isVirtual,

                opacity:
                    isVirtual
                        ? 0.52
                        : 0.95

            });


        const stem =
            new THREE.Mesh(

                new THREE.CylinderGeometry(
                    0.065,
                    0.065,
                    absoluteHeight,
                    18
                ),

                material

            );


        stem.name =
            "Image Arrow";


        stem.userData = {
            ...this.image.userData
        };


        stem.position.y =
            imageHeight >=
            0
                ? absoluteHeight / 2
                : -absoluteHeight / 2;


        const head =
            new THREE.Mesh(

                new THREE.ConeGeometry(
                    0.18,
                    0.42,
                    20
                ),

                material.clone()

            );


        head.name =
            "Image Arrow Head";


        head.userData = {
            ...this.image.userData
        };


        if (
            imageHeight >=
            0
        ) {

            head.position.y =
                absoluteHeight +
                0.21;

        } else {

            head.position.y =
                -absoluteHeight -
                0.21;

            head.rotation.z =
                Math.PI;

        }


        this.image.add(
            stem,
            head
        );


        this.image.position.set(
            result.imageDistance,
            0,
            0.50
        );

    }


    // ========================================================
    // PRINCIPAL RAYS
    // ========================================================

    createPrincipalRays(
        result
    ) {

        if (
            !Number.isFinite(
                this.objectDistance
            )
        ) {

            this.createInfinityRays(
                result
            );

            return;

        }


        if (
            this.lensType ===
            "convex"
        ) {

            this.createConvexRays(
                result
            );

        } else {

            this.createConcaveRays(
                result
            );

        }

    }


    // ========================================================
    // CONVEX RAYS
    // ========================================================

    createConvexRays(
        result
    ) {

        const d =
            this.objectDistance;

        const h =
            this.objectHeight;

        const f =
            this.focalLength;

        const v =
            result.imageDistance;

        const imageHeight =
            result.imageHeight;


        const objectTop =
            new THREE.Vector3(
                -d,
                h,
                0.55
            );


        // ====================================================
        // OBJECT AT F
        // ====================================================

        if (
            Math.abs(
                d - f
            ) <
            0.0001
        ) {

            this.createConvexAtFocusRays(
                h,
                f
            );

            return;

        }


        // ====================================================
        // R1: PARALLEL
        // ====================================================

        const parallelLens =
            new THREE.Vector3(
                0,
                h,
                0.55
            );


        this.createRaySegment(
            objectTop,
            parallelLens,
            0xfbbf24,
            "Ray 1 • Parallel incident ray"
        );


        if (
            Number.isFinite(v)
        ) {

            const r1 =
                this.createRaySegment(
                    parallelLens,
                    new THREE.Vector3(
                        v,
                        imageHeight,
                        0.55
                    ),
                    0xfbbf24,
                    "Ray 1 • Refracted ray"
                );


            this.addRayEducationalData(
                r1,
                "Parallel Ray",
                "Principal Ray",
                "A ray parallel to the principal axis.",
                [

                    "Incident ray is parallel to the principal axis.",

                    "For a convex lens it refracts toward F₂."

                ],

                "For a convex lens, a ray parallel to the axis passes through F₂ after refraction."

            );

        }


        // ====================================================
        // R2: OPTICAL CENTER
        // ====================================================

        const O =
            new THREE.Vector3(
                0,
                0,
                0.60
            );


        const r2a =
            this.createRaySegment(
                objectTop,
                O,
                0x22d3ee,
                "Ray 2 • Toward optical center O"
            );


        this.addRayEducationalData(
            r2a,
            "Optical Center Ray",
            "Principal Ray",
            "The ray passes through the optical center O.",
            [

                "Passes through O.",

                "Approximately undeviated."

            ],

            "A ray through the optical center of a thin lens travels approximately straight."

        );


        if (
            Number.isFinite(v)
        ) {

            const r2b =
                this.createRaySegment(
                    O,
                    new THREE.Vector3(
                        v,
                        imageHeight,
                        0.60
                    ),
                    0x22d3ee,
                    "Ray 2 • Undeviated through O"
                );


            this.addRayEducationalData(
                r2b,
                "Optical Center Ray",
                "Principal Ray",
                "The outgoing part of the ray remains on the same straight optical path.",
                [

                    "Passes through O.",

                    "Locates the image together with another principal ray."

                ],

                "Use this ray as one of the easiest rays to construct in a classroom ray diagram."

            );

        }


        // ====================================================
        // R3: F1 -> PARALLEL
        // ====================================================

        const denominator =
            d - f;


        if (
            Math.abs(
                denominator
            ) >
            0.0001
        ) {

            const F1 =
                new THREE.Vector3(
                    -f,
                    0,
                    0.65
                );


            const slope =
                (
                    0 -
                    h
                ) /
                denominator;


            const focalLensY =
                h +
                slope *
                d;


            const lensHalfHeight =
                this.getLensHalfHeight();


            if (
                Number.isFinite(
                    focalLensY
                ) &&
                Math.abs(
                    focalLensY
                ) <=
                lensHalfHeight
            ) {

                const focalLens =
                    new THREE.Vector3(
                        0,
                        focalLensY,
                        0.65
                    );


                const r3a =
                    this.createRaySegment(
                        objectTop,
                        F1,
                        0x4ade80,
                        "Ray 3 • Through F₁"
                    );


                this.addRayEducationalData(
                    r3a,
                    "Focal Ray",
                    "Principal Ray",
                    "The incident ray passes through F₁ before reaching the convex lens.",
                    [

                        "Passes through F₁.",

                        "Reaches the lens at the calculated intersection."

                    ],

                    "A ray directed through F₁ emerges parallel to the principal axis."

                );


                const r3b =
                    this.createRaySegment(
                        F1,
                        focalLens,
                        0x4ade80,
                        "Ray 3 • F₁ to lens"
                    );


                this.addRayEducationalData(
                    r3b,
                    "Focal Ray",
                    "Principal Ray",
                    "Segment from F₁ to the lens.",
                    [

                        "Passes through the principal focus F₁."

                    ],

                    "This is the focal incident portion of the third principal ray."

                );


                const r3c =
                    this.createRaySegment(
                        focalLens,
                        new THREE.Vector3(
                            12,
                            focalLensY,
                            0.65
                        ),
                        0x4ade80,
                        "Ray 3 • Emerges parallel"
                    );


                this.addRayEducationalData(
                    r3c,
                    "Focal Ray",
                    "Principal Ray",
                    "After passing through the convex lens, the ray emerges parallel to the principal axis.",
                    [

                        "Incident ray passed through F₁.",

                        "Emergent ray is parallel to the principal axis."

                    ],

                    "This is the standard focal-ray rule for a convex lens."

                );


                if (
                    this.showConstructionRays
                ) {

                    this.createConstructionRay(
                        objectTop,
                        F1,
                        0x94a3b8,
                        "F₁ Construction"
                    );

                }

            }

        }

    }


    // ========================================================
    // CONVEX AT F
    // ========================================================

    createConvexAtFocusRays(
        h,
        f
    ) {

        const outgoingSlope =
            -h / f;


        const heights = [

            h,
            h * 0.62,
            h * 0.30

        ];


        const colors = [

            0xfbbf24,
            0x22d3ee,
            0x4ade80

        ];


        // ----------------------------------------------------
        // R1
        // ----------------------------------------------------

        const r1Lens =
            new THREE.Vector3(
                0,
                heights[0],
                0.55
            );


        const r1a =
            this.createRaySegment(
                new THREE.Vector3(
                    -f,
                    h,
                    0.55
                ),
                r1Lens,
                colors[0],
                "Ray 1 • Parallel incident"
            );


        this.addRayEducationalData(
            r1a,
            "Parallel Ray",
            "Principal Ray",
            "Incident ray parallel to the principal axis.",
            [

                "Starts at the object top.",

                "Travels parallel to the axis before the lens."

            ],

            "After the convex lens it contributes to the parallel output when the object is at F."

        );


        const r1b =
            this.createRaySegment(
                r1Lens,
                new THREE.Vector3(
                    12,
                    heights[0] +
                    outgoingSlope *
                    12,
                    0.55
                ),
                colors[0],
                "Ray 1 • Emerges toward infinity"
            );


        this.addRayEducationalData(
            r1b,
            "Focal Ray Output",
            "Principal Ray",
            "The emerging ray continues in the direction associated with an image at infinity.",
            [

                "Object is at F.",

                "Image is formed at infinity."

            ],

            "When an object is placed at F, the emergent principal rays become effectively parallel and the image is at infinity."

        );


        // ----------------------------------------------------
        // R2
        // ----------------------------------------------------

        const O =
            new THREE.Vector3(
                0,
                0,
                0.60
            );


        const r2a =
            this.createRaySegment(
                new THREE.Vector3(
                    -f,
                    h,
                    0.60
                ),
                O,
                colors[1],
                "Ray 2 • Through O"
            );


        this.addRayEducationalData(
            r2a,
            "Optical Center Ray",
            "Principal Ray",
            "Ray through the optical center O.",
            [

                "Passes through O.",

                "Travels approximately undeviated."

            ],

            "The optical-center ray remains straight through the thin lens."

        );


        const r2b =
            this.createRaySegment(
                O,
                new THREE.Vector3(
                    12,
                    outgoingSlope *
                    12,
                    0.60
                ),
                colors[1],
                "Ray 2 • Output direction"
            );


        this.addRayEducationalData(
            r2b,
            "Optical Center Ray",
            "Principal Ray",
            "The optical-center ray continues along its optical direction.",
            [

                "Object is at F.",

                "Output rays are effectively parallel."

            ],

            "At the focal position, the image is at infinity."

        );


        // ----------------------------------------------------
        // R3 AUXILIARY
        // ----------------------------------------------------

        const thirdY =
            h * 0.45;


        const r3Lens =
            new THREE.Vector3(
                0,
                thirdY,
                0.65
            );


        const r3a =
            this.createRaySegment(
                new THREE.Vector3(
                    -f,
                    h,
                    0.65
                ),
                r3Lens,
                colors[2],
                "Ray 3 • Auxiliary incident"
            );


        this.addRayEducationalData(
            r3a,
            "Auxiliary Ray",
            "Principal-Ray Demonstration",
            "Additional construction ray used to show the focal-position behavior.",
            [

                "Used only for visual teaching.",

                "Avoids the degenerate F₁ construction at d = f."

            ],

            "At F, the standard focal construction degenerates; an auxiliary parallel output is used to keep the teaching diagram clear."

        );


        this.createRaySegment(
            r3Lens,
            new THREE.Vector3(
                12,
                thirdY +
                outgoingSlope *
                12,
                0.65
            ),
            colors[2],
            "Ray 3 • Output toward infinity"
        );

    }


    // ========================================================
    // CONCAVE RAYS
    // ========================================================

    createConcaveRays(
        result
    ) {

        const d =
            this.objectDistance;

        const h =
            this.objectHeight;

        const f =
            this.focalLength;

        const v =
            result.imageDistance;

        const imageHeight =
            result.imageHeight;


        const objectTop =
            new THREE.Vector3(
                -d,
                h,
                0.55
            );


        // ====================================================
        // R1 PARALLEL
        // ====================================================

        const lensPoint =
            new THREE.Vector3(
                0,
                h,
                0.55
            );


        const r1a =
            this.createRaySegment(
                objectTop,
                lensPoint,
                0xfbbf24,
                "Ray 1 • Parallel incident"
            );


        this.addRayEducationalData(
            r1a,
            "Parallel Ray",
            "Principal Ray",
            "A ray incident parallel to the principal axis.",
            [

                "Parallel before the concave lens.",

                "Diverges after refraction."

            ],

            "A parallel ray through a concave lens diverges as if it came from F₁."

        );


        if (
            Number.isFinite(v)
        ) {

            const outgoingY =
                this.projectY(
                    lensPoint,
                    v,
                    imageHeight,
                    12
                );


            const r1b =
                this.createRaySegment(
                    lensPoint,
                    new THREE.Vector3(
                        12,
                        outgoingY,
                        0.55
                    ),
                    0xfbbf24,
                    "Ray 1 • Diverging after lens"
                );


            this.addRayEducationalData(
                r1b,
                "Diverging Ray",
                "Principal Ray",
                "The ray diverges after passing through the concave lens.",
                [

                    "Its backward extension points toward F₁.",

                    "It contributes to the virtual image."

                ],

                "Extend this ray backward to locate the virtual image."

            );


            if (
                this.showConstructionRays
            ) {

                this.createConstructionRay(
                    lensPoint,
                    new THREE.Vector3(
                        v,
                        imageHeight,
                        0.56
                    ),
                    0xa78bfa,
                    "Virtual Image Extension"
                );


                this.createConstructionRay(
                    lensPoint,
                    new THREE.Vector3(
                        -f,
                        0,
                        0.57
                    ),
                    0x94a3b8,
                    "F₁ Construction"
                );

            }

        }


        // ====================================================
        // R2 OPTICAL CENTER
        // ====================================================

        const O =
            new THREE.Vector3(
                0,
                0,
                0.60
            );


        const r2a =
            this.createRaySegment(
                objectTop,
                O,
                0x22d3ee,
                "Ray 2 • Through O"
            );


        this.addRayEducationalData(
            r2a,
            "Optical Center Ray",
            "Principal Ray",
            "The ray passes directly through optical center O.",
            [

                "Passes through O.",

                "Approximately undeviated."

            ],

            "The optical-center ray remains approximately straight through a thin concave lens."

        );


        if (
            Number.isFinite(v)
        ) {

            this.createRaySegment(
                O,
                new THREE.Vector3(
                    v,
                    imageHeight,
                    0.60
                ),
                0x22d3ee,
                "Ray 2 • Undeviated output"
            );

        }


        // ====================================================
        // R3 TOWARD F2
        // ====================================================

        const F2 =
            new THREE.Vector3(
                f,
                0,
                0.65
            );


        const denominator =
            d +
            f;


        if (
            Math.abs(
                denominator
            ) >
            0.0001
        ) {

            const slope =
                (
                    0 -
                    h
                ) /
                denominator;


            const rayLensY =
                h +
                slope *
                d;


            const lensHalfHeight =
                this.getLensHalfHeight();


            if (
                Number.isFinite(
                    rayLensY
                ) &&
                Math.abs(
                    rayLensY
                ) <=
                lensHalfHeight
            ) {

                const rayLens =
                    new THREE.Vector3(
                        0,
                        rayLensY,
                        0.65
                    );


                const r3a =
                    this.createRaySegment(
                        objectTop,
                        rayLens,
                        0x4ade80,
                        "Ray 3 • Toward F₂"
                    );


                this.addRayEducationalData(
                    r3a,
                    "Focal Ray",
                    "Principal Ray",
                    "An incident ray directed toward the far-side focus F₂.",
                    [

                        "Aims toward F₂.",

                        "After the concave lens it emerges parallel."

                    ],

                    "For the concave-lens focal construction, a ray directed toward F₂ emerges parallel to the principal axis."

                );


                if (
                    this.showConstructionRays
                ) {

                    this.createConstructionRay(
                        rayLens,
                        F2,
                        0x94a3b8,
                        "F₂ Construction"
                    );

                }


                const r3b =
                    this.createRaySegment(
                        rayLens,
                        new THREE.Vector3(
                            12,
                            rayLensY,
                            0.65
                        ),
                        0x4ade80,
                        "Ray 3 • Emerges parallel"
                    );


                this.addRayEducationalData(
                    r3b,
                    "Parallel Emergent Ray",
                    "Principal Ray",
                    "The ray emerges parallel to the principal axis.",
                    [

                        "Incident ray aimed toward F₂.",

                        "Emergent ray is parallel."

                    ],

                    "This is the third standard principal-ray rule for a concave lens."

                );

            }

        }

    }


    // ========================================================
    // INFINITY RAYS
    // ========================================================

    createInfinityRays() {

        const f =
            this.focalLength;


        const h =
            this.objectHeight;


        const colors = [

            0xfbbf24,
            0x22d3ee,
            0x4ade80

        ];


        const heights = [

            h,
            h * 0.62,
            h * 0.30

        ];


        // ====================================================
        // CONVEX
        // ====================================================

        if (
            this.lensType ===
            "convex"
        ) {

            for (
                let i = 0;
                i < heights.length;
                i++
            ) {

                const y =
                    heights[i];


                const z =
                    0.55 +
                    i * 0.05;


                const lensPoint =
                    new THREE.Vector3(
                        0,
                        y,
                        z
                    );


                const a =
                    this.createRaySegment(
                        new THREE.Vector3(
                            -12,
                            y,
                            z
                        ),
                        lensPoint,
                        colors[i],
                        `Infinity Ray ${i + 1} • Incident`
                    );


                this.addRayEducationalData(
                    a,
                    "Parallel Ray",
                    "Principal Ray",
                    "Parallel ray arriving from a distant object.",
                    [

                        "Object is treated as infinitely far away.",

                        "Incoming rays are approximately parallel."

                    ],

                    "Rays from a very distant object arrive at the lens approximately parallel."

                );


                this.createRaySegment(
                    lensPoint,
                    new THREE.Vector3(
                        f,
                        0,
                        z
                    ),
                    colors[i],
                    `Infinity Ray ${i + 1} • Toward F₂`
                );

            }


            return;

        }


        // ====================================================
        // CONCAVE
        // ====================================================

        const F1 =
            new THREE.Vector3(
                -f,
                0,
                0.55
            );


        for (
            let i = 0;
            i < heights.length;
            i++
        ) {

            const y =
                heights[i];


            const z =
                0.55 +
                i * 0.05;


            const lensPoint =
                new THREE.Vector3(
                    0,
                    y,
                    z
                );


            this.createRaySegment(
                new THREE.Vector3(
                    -12,
                    y,
                    z
                ),
                lensPoint,
                colors[i],
                `Infinity Ray ${i + 1} • Incident`
            );


            const outgoingY =
                this.projectY(
                    F1,
                    lensPoint.x,
                    lensPoint.y,
                    12
                );


            const output =
                this.createRaySegment(
                    lensPoint,
                    new THREE.Vector3(
                        12,
                        outgoingY,
                        z
                    ),
                    colors[i],
                    `Infinity Ray ${i + 1} • Diverging`
                );


            this.addRayEducationalData(
                output,
                "Diverging Ray",
                "Principal Ray",
                "The ray diverges as though it came from F₁.",
                [

                    "Incoming rays are parallel.",

                    "Outgoing rays diverge."

                ],

                "A concave lens makes parallel rays diverge as though they originated at F₁."

            );


            if (
                this.showConstructionRays
            ) {

                this.createConstructionRay(
                    lensPoint,
                    F1,
                    0xa78bfa,
                    `Infinity Ray ${i + 1} • F₁ Extension`
                );

            }

        }

    }


    // ========================================================
    // GET LENS HALF HEIGHT
    // ========================================================

    getLensHalfHeight() {

        const required =
            this.getRequiredLensHeight();


        return required /
            2;

    }


    // ========================================================
    // PROJECT LINE
    // ========================================================

    projectY(
        start,
        throughX,
        throughY,
        targetX
    ) {

        const dx =
            throughX -
            start.x;


        if (
            Math.abs(
                dx
            ) <
            0.000001
        ) {

            return start.y;

        }


        const slope =
            (
                throughY -
                start.y
            ) /
            dx;


        const y =
            start.y +
            slope *
            (
                targetX -
                start.x
            );


        return Number.isFinite(y)
            ? y
            : start.y;

    }


    // ========================================================
    // STRAIGHT RAY SEGMENT
    // ========================================================

    createRaySegment(
        start,
        end,
        color,
        name
    ) {

        if (
            !start ||
            !end
        ) {

            return null;

        }


        const values = [

            start.x,
            start.y,
            start.z,
            end.x,
            end.y,
            end.z

        ];


        if (
            values.some(
                value =>
                    !Number.isFinite(
                        value
                    )
            )
        ) {

            console.warn(
                "LensOptics: invalid ray rejected:",
                name
            );


            return null;

        }


        const direction =
            new THREE.Vector3()
                .subVectors(
                    end,
                    start
                );


        const length =
            direction.length();


        if (
            !Number.isFinite(
                length
            ) ||
            length <
            0.0001
        ) {

            return null;

        }


        const geometry =
            new THREE.CylinderGeometry(
                0.028,
                0.028,
                length,
                8
            );


        const material =
            new THREE.MeshBasicMaterial({

                color,

                transparent:
                    true,

                opacity:
                    0.96

            });


        const ray =
            new THREE.Mesh(
                geometry,
                material
            );


        ray.position.copy(
            start
                .clone()
                .add(end)
                .multiplyScalar(
                    0.5
                )
        );


        ray.quaternion.setFromUnitVectors(

            new THREE.Vector3(
                0,
                1,
                0
            ),

            direction.normalize()

        );


        ray.name =
            name;


        ray.userData = {

            name,

            category:
                "Principal Ray",

            type:
                "principal-ray",

            description:
                name

        };


        this.rays.add(
            ray
        );


        return ray;

    }


    // ========================================================
    // ADD RAY EDUCATIONAL DATA
    // ========================================================

    addRayEducationalData(
        ray,
        name,
        category,
        description,
        facts,
        teacher
    ) {

        if (
            !ray
        ) {

            return;

        }


        ray.userData = {

            name,

            category,

            type:
                "principal-ray",

            description,

            facts,

            teacher

        };

    }


    // ========================================================
    // CONSTRUCTION RAY
    // ========================================================

    createConstructionRay(
        start,
        end,
        color,
        name
    ) {

        if (
            !start ||
            !end
        ) {

            return null;

        }


        const values = [

            start.x,
            start.y,
            start.z,
            end.x,
            end.y,
            end.z

        ];


        if (
            values.some(
                value =>
                    !Number.isFinite(
                        value
                    )
            )
        ) {

            return null;

        }


        const geometry =
            new THREE.BufferGeometry()
                .setFromPoints([

                    start,
                    end

                ]);


        const material =
            new THREE.LineDashedMaterial({

                color,

                dashSize:
                    0.18,

                gapSize:
                    0.12,

                transparent:
                    true,

                opacity:
                    0.55

            });


        const line =
            new THREE.Line(
                geometry,
                material
            );


        line.computeLineDistances();


        line.name =
            name;


        line.userData = {

            name,

            category:
                "Construction Ray",

            type:
                "construction-ray",

            description:
                "Dashed construction or virtual extension of a ray.",

            facts: [

                "Used to locate virtual images.",

                "Shows the direction from which a diverging ray appears to originate."

            ],

            teacher:
                "Dashed rays are construction lines; they are not physical light paths travelling backward."

        };


        this.guides.add(
            line
        );


        return line;

    }


    // ========================================================
    // GET STATE
    // ========================================================

    getState() {

        return {
            ...(this.state || {})
        };

    }


    // ========================================================
    // GET ROOT OBJECT
    // ========================================================

    getObject() {

        return this.group;

    }


    // ========================================================
    // GET CLICKABLE / SELECTABLE OBJECTS
    // ========================================================

    getSelectableObjects() {

        const objects = [];


        const collect =
            root => {

                if (
                    !root
                ) {

                    return;

                }


                root.traverse(
                    object => {

                        if (
                            object.userData?.name &&
                            (
                                object.isMesh ||
                                object.isLine ||
                                object.isSprite
                            )
                        ) {

                            objects.push(
                                object
                            );

                        }

                    }
                );

            };


        collect(
            this.lensGroup
        );

        collect(
            this.object
        );

        collect(
            this.image
        );

        collect(
            this.referenceGroup
        );

        collect(
            this.axisGroup
        );

        collect(
            this.rays
        );

        collect(
            this.guides
        );


        // Remove duplicates
        return [
            ...new Set(
                objects
            )
        ];

    }


    // ========================================================
    // HOVERABLE
    // ========================================================

    getHoverableObjects() {

        return this.getSelectableObjects();

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
    // UPDATE
    // ========================================================

    update() {

        // ----------------------------------------------------
        // Intentionally empty.
        //
        // The Lens laboratory is parameter-driven.
        // Nothing moves automatically.
        // ----------------------------------------------------

        return;

    }


    // ========================================================
    // RESET
    // ========================================================

    reset() {

        this.running =
            false;

        this.lensType =
            "convex";

        this.focalLength =
            4;

        this.objectDistance =
            8;

        this.objectHeight =
            2.5;

        this.showRays =
            true;

        this.showLabels =
            true;

        this.showConstructionRays =
            true;

        this.scenario =
            "beyond-2f";


        this.rebuildLens();

        this.updateOptics();

    }


    // ========================================================
    // DISPOSE CHILDREN
    // ========================================================

    disposeGroupChildren(
        group
    ) {

        if (
            !group
        ) {

            return;

        }


        while (
            group.children.length
        ) {

            const child =
                group.children.pop();


            child.traverse(
                object => {

                    if (
                        object.geometry
                    ) {

                        object.geometry.dispose();

                    }


                    if (
                        object.material
                    ) {

                        if (
                            Array.isArray(
                                object.material
                            )
                        ) {

                            object.material.forEach(
                                material => {

                                    material.map?.dispose();

                                    material.dispose();

                                }
                            );

                        } else {

                            object.material.map?.dispose();

                            object.material.dispose();

                        }

                    }

                }
            );

        }

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

                    if (
                        Array.isArray(
                            object.material
                        )
                    ) {

                        object.material.forEach(
                            material => {

                                material.map?.dispose();

                                material.dispose();

                            }
                        );

                    } else {

                        object.material.map?.dispose();

                        object.material.dispose();

                    }

                }

            }
        );


        this.selectable =
            [];

        this.state =
            null;

    }

}


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default LensOptics;