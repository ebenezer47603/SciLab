// ============================================================
// SciLab - Biology Laboratory
// Circulation.js
// Realistic 2D Human Heart & Lung Circulation
// ============================================================

import * as THREE from "three";


// ============================================================
// CLASS
// ============================================================

export class Circulation {

    constructor() {

        // ====================================================
        // MODE
        // ====================================================

        this.renderMode = "2d";


        // ====================================================
        // THREE PLACEHOLDER
        // ====================================================
        // BiologySimulator expects getObject().
        // We return an empty THREE Group because the actual
        // visualization is rendered on a 2D canvas.

        this.group =
            new THREE.Group();

        this.group.name =
            "Realistic Circulation 2D";


        // ====================================================
        // STATE
        // ====================================================

        this.running = true;

        this.time = 0;

        this.animationSpeed = 1;

        this.heartRate = 72;


        // ====================================================
        // DOM
        // ====================================================

        this.container = null;

        this.canvas = null;

        this.ctx = null;

        this.wrapper = null;


        // ====================================================
        // CANVAS SIZE
        // ====================================================

        this.width = 1200;

        this.height = 720;

        this.dpr = 1;


        // ====================================================
        // INTERACTION
        // ====================================================

        this.mouseX = 0;

        this.mouseY = 0;

        this.hovered = null;


        // ====================================================
        // SELECTABLE OBJECTS
        // ====================================================

        this.selectable = [];


        // ====================================================
        // ANATOMICAL AREAS
        // ====================================================

        this.regions = [];


        // ====================================================
        // BLOOD PARTICLES
        // ====================================================

        this.bloodParticles = [];

        this.oxygenParticles = [];

        this.co2Particles = [];


        // ====================================================
        // BLOOD FLOW PATHS
        // ====================================================

        this.flowPaths = [];


        // ====================================================
        // HEART
        // ====================================================

        this.heart = {

            x: 0,

            y: 0,

            scale: 1,

            pulse: 1,

            phase: 0

        };


        // ====================================================
        // LUNGS
        // ====================================================

        this.lungs = {

            left: null,

            right: null

        };


        // ====================================================
        // EVENT BINDINGS
        // ====================================================

        this.onPointerMove =
            this.onPointerMove.bind(
                this
            );


        this.onPointerDown =
            this.onPointerDown.bind(
                this
            );


        this.onWheel =
            this.onWheel.bind(
                this
            );


        // ====================================================
        // CREATE BLOOD PARTICLES
        // ====================================================

        this.createParticles();

    }


    // ========================================================
    // GET OBJECT
    // ========================================================

    getObject() {

        return this.group;

    }


    // ========================================================
    // GET SELECTABLE OBJECTS
    // ========================================================

    getSelectableObjects() {

        return this.selectable;

    }


    // ========================================================
    // MOUNT
    // ========================================================

    mount(
        container
    ) {

        if (!container) {

            throw new Error(
                "Circulation: container is required."
            );

        }


        this.container =
            container;


        // ====================================================
        // WRAPPER
        // ====================================================

        this.wrapper =
            document.createElement(
                "div"
            );


        this.wrapper.className =
            "scilab-circulation";


        Object.assign(
            this.wrapper.style,
            {

                position:
                    "relative",

                width:
                    "100%",

                height:
                    "100%",

                minHeight:
                    "620px",

                overflow:
                    "hidden",

                borderRadius:
                    "18px",

                background:
                    "radial-gradient(circle at 50% 40%, #102033 0%, #07111e 42%, #020914 100%)",

                fontFamily:
                    "Inter, Arial, sans-serif",

                userSelect:
                    "none"

            }
        );


        // ====================================================
        // CANVAS
        // ====================================================

        this.canvas =
            document.createElement(
                "canvas"
            );


        this.canvas.className =
            "circulation-canvas";


        Object.assign(
            this.canvas.style,
            {

                position:
                    "absolute",

                inset:
                    "0",

                width:
                    "100%",

                height:
                    "100%",

                display:
                    "block",

                cursor:
                    "default"

            }
        );


        this.wrapper.appendChild(
            this.canvas
        );


        this.ctx =
            this.canvas.getContext(
                "2d"
            );


        // ====================================================
        // TOP TITLE
        // ====================================================

        const title =
            document.createElement(
                "div"
            );


        Object.assign(
            title.style,
            {

                position:
                    "absolute",

                left:
                    "24px",

                top:
                    "18px",

                color:
                    "#f8fafc",

                fontSize:
                    "22px",

                fontWeight:
                    "700",

                letterSpacing:
                    "0.2px",

                pointerEvents:
                    "none",

                textShadow:
                    "0 2px 12px rgba(0,0,0,.7)"

            }
        );


        title.innerHTML =
            "❤️ Human Circulatory System";


        this.wrapper.appendChild(
            title
        );


        // ====================================================
        // SUBTITLE
        // ====================================================

        const subtitle =
            document.createElement(
                "div"
            );


        Object.assign(
            subtitle.style,
            {

                position:
                    "absolute",

                left:
                    "25px",

                top:
                    "49px",

                color:
                    "rgba(226,232,240,.72)",

                fontSize:
                    "12px",

                pointerEvents:
                    "none"

            }
        );


        subtitle.textContent =
            "Heart • Lungs • Blood Flow • Gas Exchange";


        this.wrapper.appendChild(
            subtitle
        );


        // ====================================================
        // INFO PANEL
        // ====================================================

        this.infoPanel =
            document.createElement(
                "div"
            );


        Object.assign(
            this.infoPanel.style,
            {

                position:
                    "absolute",

                right:
                    "18px",

                top:
                    "18px",

                width:
                    "205px",

                padding:
                    "14px",

                borderRadius:
                    "14px",

                background:
                    "rgba(3,10,20,.72)",

                border:
                    "1px solid rgba(148,163,184,.15)",

                backdropFilter:
                    "blur(12px)",

                color:
                    "#e2e8f0",

                fontSize:
                    "12px",

                lineHeight:
                    "1.55",

                boxShadow:
                    "0 12px 35px rgba(0,0,0,.25)",

                pointerEvents:
                    "none"

            }
        );


        this.wrapper.appendChild(
            this.infoPanel
        );


        // ====================================================
        // CONTROLS
        // ====================================================

        this.createControls();


        // ====================================================
        // LEGEND
        // ====================================================

        this.createLegend();


        // ====================================================
        // ADD TO CONTAINER
        // ====================================================

        this.container.appendChild(
            this.wrapper
        );


        // ====================================================
        // EVENTS
        // ====================================================

        this.canvas.addEventListener(
            "pointermove",
            this.onPointerMove
        );


        this.canvas.addEventListener(
            "pointerdown",
            this.onPointerDown
        );


        this.canvas.addEventListener(
            "wheel",
            this.onWheel,
            {
                passive:
                    false
            }
        );


        // ====================================================
        // RESIZE
        // ====================================================

        this.resize();


        // ====================================================
        // FIRST DRAW
        // ====================================================

        this.draw();

    }


    // ========================================================
    // CONTROLS
    // ========================================================

    createControls() {

        const controls =
            document.createElement(
                "div"
            );


        Object.assign(
            controls.style,
            {

                position:
                    "absolute",

                left:
                    "22px",

                bottom:
                    "18px",

                display:
                    "flex",

                gap:
                    "8px",

                padding:
                    "8px",

                borderRadius:
                    "12px",

                background:
                    "rgba(3,10,20,.78)",

                border:
                    "1px solid rgba(148,163,184,.15)",

                backdropFilter:
                    "blur(10px)"

            }
        );


        // ====================================================
        // PAUSE
        // ====================================================

        const pause =
            this.createButton(
                "⏸ Pause"
            );


        pause.onclick =
            () => {

                if (
                    this.running
                ) {

                    this.pause();

                    pause.textContent =
                        "▶ Resume";

                } else {

                    this.start();

                    pause.textContent =
                        "⏸ Pause";

                }

            };


        controls.appendChild(
            pause
        );


        // ====================================================
        // RESET
        // ====================================================

        const reset =
            this.createButton(
                "↻ Reset"
            );


        reset.onclick =
            () => {

                this.reset();

            };


        controls.appendChild(
            reset
        );


        // ====================================================
        // SPEED DOWN
        // ====================================================

        const slower =
            this.createButton(
                "−"
            );


        slower.onclick =
            () => {

                this.setAnimationSpeed(
                    this.animationSpeed -
                    0.25
                );

            };


        controls.appendChild(
            slower
        );


        // ====================================================
        // SPEED DISPLAY
        // ====================================================

        this.speedLabel =
            document.createElement(
                "span"
            );


        Object.assign(
            this.speedLabel.style,
            {

                minWidth:
                    "45px",

                display:
                    "flex",

                alignItems:
                    "center",

                justifyContent:
                    "center",

                color:
                    "#cbd5e1",

                fontSize:
                    "11px"

            }
        );


        this.speedLabel.textContent =
            "1.00×";


        controls.appendChild(
            this.speedLabel
        );


        // ====================================================
        // SPEED UP
        // ====================================================

        const faster =
            this.createButton(
                "+"
            );


        faster.onclick =
            () => {

                this.setAnimationSpeed(
                    this.animationSpeed +
                    0.25
                );

            };


        controls.appendChild(
            faster
        );


        this.wrapper.appendChild(
            controls
        );

    }


    // ========================================================
    // BUTTON
    // ========================================================

    createButton(
        text
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.textContent =
            text;


        Object.assign(
            button.style,
            {

                border:
                    "1px solid rgba(148,163,184,.18)",

                background:
                    "rgba(15,23,42,.9)",

                color:
                    "#e2e8f0",

                borderRadius:
                    "8px",

                padding:
                    "7px 11px",

                cursor:
                    "pointer",

                fontSize:
                    "11px",

                fontWeight:
                    "600",

                transition:
                    "all .18s ease"

            }
        );


        button.onmouseenter =
            () => {

                button.style.background =
                    "rgba(51,65,85,.95)";

            };


        button.onmouseleave =
            () => {

                button.style.background =
                    "rgba(15,23,42,.9)";

            };


        return button;

    }


    // ========================================================
    // LEGEND
    // ========================================================

    createLegend() {

        const legend =
            document.createElement(
                "div"
            );


        Object.assign(
            legend.style,
            {

                position:
                    "absolute",

                right:
                    "18px",

                bottom:
                    "18px",

                display:
                    "flex",

                gap:
                    "13px",

                alignItems:
                    "center",

                padding:
                    "8px 11px",

                borderRadius:
                    "10px",

                background:
                    "rgba(3,10,20,.72)",

                border:
                    "1px solid rgba(148,163,184,.15)",

                color:
                    "#cbd5e1",

                fontSize:
                    "10px",

                pointerEvents:
                    "none"

            }
        );


        legend.innerHTML =

            `<span>
                <b style="
                    display:inline-block;
                    width:9px;
                    height:9px;
                    border-radius:50%;
                    background:#ef4444;
                    margin-right:5px;
                "></b>
                Oxygenated
            </span>

            <span>
                <b style="
                    display:inline-block;
                    width:9px;
                    height:9px;
                    border-radius:50%;
                    background:#3b82f6;
                    margin-right:5px;
                "></b>
                Deoxygenated
            </span>

            <span>
                <b style="
                    display:inline-block;
                    width:9px;
                    height:9px;
                    border-radius:50%;
                    background:#67e8f9;
                    margin-right:5px;
                "></b>
                O₂
            </span>`;


        this.wrapper.appendChild(
            legend
        );

    }


    // ========================================================
    // RESIZE
    // ========================================================

    resize() {

        if (
            !this.canvas ||
            !this.container
        ) {

            return;

        }


        const rect =
            this.container.getBoundingClientRect();


        this.width =
            Math.max(
                rect.width ||
                900,
                700
            );


        this.height =
            Math.max(
                rect.height ||
                620,
                560
            );


        this.dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        this.canvas.width =
            Math.floor(
                this.width *
                this.dpr
            );


        this.canvas.height =
            Math.floor(
                this.height *
                this.dpr
            );


        this.ctx.setTransform(
            this.dpr,
            0,
            0,
            this.dpr,
            0,
            0
        );


        this.calculateLayout();


        this.draw();

    }


    // ========================================================
    // LAYOUT
    // ========================================================

    calculateLayout() {

        const centerX =
            this.width *
            0.50;


        const centerY =
            this.height *
            0.53;


        this.heart.x =
            centerX;


        this.heart.y =
            centerY +
            5;


        this.lungs.left = {

            x:
                centerX -
                116,

            y:
                centerY -
                25,

            width:
                145,

            height:
                270

        };


        this.lungs.right = {

            x:
                centerX +
                116,

            y:
                centerY -
                25,

            width:
                145,

            height:
                270

        };


        this.buildFlowPaths();

    }


    // ========================================================
    // FLOW PATHS
    // ========================================================

    buildFlowPaths() {

        const cx =
            this.heart.x;


        const cy =
            this.heart.y;


        this.flowPaths = [

            // ------------------------------------------------
            // VENA CAVA
            // ------------------------------------------------

            {

                name:
                    "Vena Cava",

                color:
                    "#3b82f6",

                points: [

                    {
                        x:
                            cx -
                            42,

                        y:
                            cy +
                            15

                    },

                    {
                        x:
                            cx -
                            45,

                        y:
                            cy -
                            125

                    },

                    {
                        x:
                            cx -
                            55,

                        y:
                            cy -
                            240

                    }

                ]

            },


            // ------------------------------------------------
            // PULMONARY ARTERY LEFT
            // ------------------------------------------------

            {

                name:
                    "Pulmonary Artery",

                color:
                    "#3b82f6",

                points: [

                    {
                        x:
                            cx -
                            30,

                        y:
                            cy -
                            12

                    },

                    {
                        x:
                            cx -
                            75,

                        y:
                            cy -
                            70

                    },

                    {
                        x:
                            cx -
                            118,

                        y:
                            cy -
                            105

                    }

                ]

            },


            // ------------------------------------------------
            // PULMONARY ARTERY RIGHT
            // ------------------------------------------------

            {

                name:
                    "Pulmonary Artery",

                color:
                    "#3b82f6",

                points: [

                    {
                        x:
                            cx -
                            28,

                        y:
                            cy -
                            10

                    },

                    {
                        x:
                            cx +
                            70,

                        y:
                            cy -
                            70

                    },

                    {
                        x:
                            cx +
                            118,

                        y:
                            cy -
                            105

                    }

                ]

            },


            // ------------------------------------------------
            // PULMONARY VEIN LEFT
            // ------------------------------------------------

            {

                name:
                    "Pulmonary Vein",

                color:
                    "#ef4444",

                points: [

                    {
                        x:
                            cx -
                            118,

                        y:
                            cy +
                            35

                    },

                    {
                        x:
                            cx -
                            78,

                        y:
                            cy +

                            5

                    },

                    {
                        x:
                            cx +
                            28,

                        y:
                            cy +
                            12

                    }

                ]

            },


            // ------------------------------------------------
            // PULMONARY VEIN RIGHT
            // ------------------------------------------------

            {

                name:
                    "Pulmonary Vein",

                color:
                    "#ef4444",

                points: [

                    {
                        x:
                            cx +
                            118,

                        y:
                            cy +
                            35

                    },

                    {
                        x:
                            cx +
                            78,

                        y:
                            cy +

                            5

                    },

                    {
                        x:
                            cx +
                            28,

                        y:
                            cy +
                            12

                    }

                ]

            },


            // ------------------------------------------------
            // AORTA
            // ------------------------------------------------

            {

                name:
                    "Aorta",

                color:
                    "#ef4444",

                points: [

                    {
                        x:
                            cx +
                            36,

                        y:
                            cy -

                            15

                    },

                    {
                        x:
                            cx +
                            58,

                        y:
                            cy -
                            115

                    },

                    {
                        x:
                            cx +
                            72,

                        y:
                            cy -
                            235

                    },

                    {
                        x:
                            cx +
                            15,

                        y:
                            cy -
                            305

                    }

                ]

            },


            // ------------------------------------------------
            // BODY ARTERIES
            // ------------------------------------------------

            {

                name:
                    "Systemic Arteries",

                color:
                    "#ef4444",

                points: [

                    {
                        x:
                            cx +
                            15,

                        y:
                            cy -
                            305

                    },

                    {
                        x:
                            cx -
                            130,

                        y:
                            cy -
                            250

                    },

                    {
                        x:
                            cx -
                            245,

                        y:
                            cy -
                            150

                    }

                ]

            },


            {

                name:
                    "Systemic Arteries",

                color:
                    "#ef4444",

                points: [

                    {
                        x:
                            cx +
                            15,

                        y:
                            cy -
                            305

                    },

                    {
                        x:
                            cx +
                            150,

                        y:
                            cy -
                            250

                    },

                    {
                        x:
                            cx +
                            245,

                        y:
                            cy -
                            150

                    }

                ]

            },


            // ------------------------------------------------
            // SYSTEMIC VEINS
            // ------------------------------------------------

            {

                name:
                    "Systemic Veins",

                color:
                    "#3b82f6",

                points: [

                    {
                        x:
                            cx -
                            245,

                        y:
                            cy -
                            150

                    },

                    {
                        x:
                            cx -
                            170,

                        y:
                            cy +
                            110

                    },

                    {
                        x:
                            cx -
                            42,

                        y:
                            cy +
                            15

                    }

                ]

            },


            {

                name:
                    "Systemic Veins",

                color:
                    "#3b82f6",

                points: [

                    {
                        x:
                            cx +
                            245,

                        y:
                            cy -
                            150

                    },

                    {
                        x:
                            cx +
                            170,

                        y:
                            cy +
                            110

                    },

                    {
                        x:
                            cx -
                            42,

                        y:
                            cy +
                            15

                    }

                ]

            }

        ];

    }


    // ========================================================
    // PARTICLES
    // ========================================================

    createParticles() {

        this.bloodParticles = [];


        for (
            let i = 0;
            i < 80;
            i++
        ) {

            this.bloodParticles.push({

                path:
                    i %
                    2 ===
                    0
                        ? i %
                            this.flowPaths.length
                        : (
                            i +
                            3
                        ) %
                            this.flowPaths.length,

                progress:
                    Math.random(),

                size:
                    2.4 +
                    Math.random() *
                    2.5,

                phase:
                    Math.random() *
                    Math.PI *
                    2

            });

        }


        this.oxygenParticles = [];


        for (
            let i = 0;
            i < 20;
            i++
        ) {

            this.oxygenParticles.push({

                x:
                    Math.random(),

                y:
                    Math.random(),

                phase:
                    Math.random() *
                    Math.PI *
                    2

            });

        }


        this.co2Particles = [];


        for (
            let i = 0;
            i < 16;
            i++
        ) {

            this.co2Particles.push({

                x:
                    Math.random(),

                y:
                    Math.random(),

                phase:
                    Math.random() *
                    Math.PI *
                    2

            });

        }

    }


    // ========================================================
    // UPDATE
    // ========================================================

    update(
        delta
    ) {

        if (
            !this.running
        ) {

            this.draw();

            return;

        }


        const dt =
            Math.min(
                delta ||
                0.016,
                0.05
            );


        this.time +=
            dt *
            this.animationSpeed;


        // ====================================================
        // HEARTBEAT
        // ====================================================

        const bpm =
            this.heartRate;


        const beatDuration =
            60 /
            bpm;


        this.heart.phase =
            (
                this.time %
                beatDuration
            ) /
            beatDuration;


        const beat =
            Math.exp(
                -Math.pow(
                    (
                        this.heart.phase -
                        0.13
                    ) /
                    0.045,
                    2
                )
            );


        const secondBeat =
            Math.exp(
                -Math.pow(
                    (
                        this.heart.phase -
                        0.30
                    ) /
                    0.035,
                    2
                )
            );


        this.heart.pulse =
            1 +
            beat *
            0.075 +
            secondBeat *
            0.035;


        // ====================================================
        // BLOOD
        // ====================================================

        for (
            const particle
            of this.bloodParticles
        ) {

            particle.progress +=
                dt *
                0.20 *
                this.animationSpeed;


            if (
                particle.progress >
                1
            ) {

                particle.progress -=
                    1;

            }

        }


        // ====================================================
        // DRAW
        // ====================================================

        this.draw();

    }


    // ========================================================
    // DRAW
    // ========================================================

    draw() {

        if (
            !this.ctx
        ) {

            return;

        }


        const ctx =
            this.ctx;


        const w =
            this.width;


        const h =
            this.height;


        // ====================================================
        // BACKGROUND
        // ====================================================

        const bg =
            ctx.createRadialGradient(

                w *
                0.5,

                h *
                0.45,

                40,

                w *
                0.5,

                h *
                0.45,

                Math.max(
                    w,
                    h
                ) *
                0.7

            );


        bg.addColorStop(
            0,
            "#102338"
        );


        bg.addColorStop(
            0.5,
            "#071421"
        );


        bg.addColorStop(
            1,
            "#020914"
        );


        ctx.fillStyle =
            bg;


        ctx.fillRect(
            0,
            0,
            w,
            h
        );


        // ====================================================
        // AMBIENT GLOW
        // ====================================================

        this.drawAmbientGlow();


        // ====================================================
        // TITLE BACKGROUND
        // ====================================================

        this.drawAnatomicalBackground();


        // ====================================================
        // VESSELS
        // ====================================================

        this.drawVessels();


        // ====================================================
        // LUNGS
        // ====================================================

        this.drawLungs();


        // ====================================================
        // HEART
        // ====================================================

        this.drawHeart();


        // ====================================================
        // BLOOD PARTICLES
        // ====================================================

        this.drawBloodParticles();


        // ====================================================
        // OXYGEN / CO2
        // ====================================================

        this.drawGasExchange();


        // ====================================================
        // LABELS
        // ====================================================

        this.drawLabels();


        // ====================================================
        // INFO
        // ====================================================

        this.updateInfoPanel();

    }


    // ========================================================
    // AMBIENT GLOW
    // ========================================================

    drawAmbientGlow() {

        const ctx =
            this.ctx;


        const x =
            this.heart.x;


        const y =
            this.heart.y;


        const gradient =
            ctx.createRadialGradient(

                x,
                y,

                20,

                x,
                y,

                330

            );


        gradient.addColorStop(
            0,
            "rgba(239,68,68,.10)"
        );


        gradient.addColorStop(
            0.45,
            "rgba(99,102,241,.04)"
        );


        gradient.addColorStop(
            1,
            "rgba(0,0,0,0)"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );

    }


    // ========================================================
    // ANATOMICAL BACKGROUND
    // ========================================================

    drawAnatomicalBackground() {

        const ctx =
            this.ctx;


        const cx =
            this.width *
            0.5;


        const headY =
            this.height *
            0.17;


        // ----------------------------------------------------
        // HEAD SILHOUETTE
        // ----------------------------------------------------

        ctx.save();


        ctx.globalAlpha =
            0.08;


        ctx.fillStyle =
            "#d9a078";


        ctx.beginPath();


        ctx.ellipse(

            cx,

            headY,

            47,

            59,

            0,

            0,

            Math.PI *
            2

        );


        ctx.fill();


        // ----------------------------------------------------
        // NECK
        // ----------------------------------------------------

        ctx.fillRect(

            cx -
            25,

            headY +
            48,

            50,

            65

        );


        // ----------------------------------------------------
        // TORSO
        // ----------------------------------------------------

        ctx.beginPath();


        ctx.moveTo(
            cx -
            90,

            headY +
            90
        );


        ctx.quadraticCurveTo(

            cx -
            175,

            headY +
            170,

            cx -
            190,

            headY +
            340

        );


        ctx.lineTo(

            cx -
            120,

            headY +
            365

        );


        ctx.lineTo(

            cx +
            120,

            headY +
            365

        );


        ctx.lineTo(

            cx +
            190,

            headY +
            340

        );


        ctx.quadraticCurveTo(

            cx +
            175,

            headY +
            170,

            cx +
            90,

            headY +
            90

        );


        ctx.closePath();


        ctx.fill();


        ctx.restore();

    }


    // ========================================================
    // VESSELS
    // ========================================================

    drawVessels() {

        const ctx =
            this.ctx;


        for (
            const path
            of this.flowPaths
        ) {

            if (
                path.points.length <
                2
            ) {

                continue;

            }


            const isRed =
                path.color ===
                "#ef4444";


            // =================================================
            // GLOW
            // =================================================

            ctx.save();


            ctx.beginPath();


            ctx.moveTo(
                path.points[0].x,
                path.points[0].y
            );


            for (
                let i = 1;
                i < path.points.length;
                i++
            ) {

                ctx.lineTo(
                    path.points[i].x,
                    path.points[i].y
                );

            }


            ctx.strokeStyle =
                isRed
                    ? "rgba(239,68,68,.12)"
                    : "rgba(59,130,246,.12)";


            ctx.lineWidth =
                15;


            ctx.lineCap =
                "round";


            ctx.lineJoin =
                "round";


            ctx.stroke();


            // =================================================
            // MAIN VESSEL
            // =================================================

            ctx.beginPath();


            ctx.moveTo(
                path.points[0].x,
                path.points[0].y
            );


            for (
                let i = 1;
                i < path.points.length;
                i++
            ) {

                ctx.lineTo(
                    path.points[i].x,
                    path.points[i].y
                );

            }


            const gradient =
                ctx.createLinearGradient(

                    path.points[0].x,
                    path.points[0].y,

                    path.points[
                        path.points.length - 1
                    ].x,

                    path.points[
                        path.points.length - 1
                    ].y

                );


            if (isRed) {

                gradient.addColorStop(
                    0,
                    "#8b1e2d"
                );


                gradient.addColorStop(
                    0.45,
                    "#ef4444"
                );


                gradient.addColorStop(
                    0.75,
                    "#ff6b78"
                );


                gradient.addColorStop(
                    1,
                    "#991b1b"
                );

            } else {

                gradient.addColorStop(
                    0,
                    "#172f82"
                );


                gradient.addColorStop(
                    0.45,
                    "#3b82f6"
                );


                gradient.addColorStop(
                    0.75,
                    "#60a5fa"
                );


                gradient.addColorStop(
                    1,
                    "#1e3a8a"
                );

            }


            ctx.strokeStyle =
                gradient;


            ctx.lineWidth =
                8;


            ctx.stroke();


            // =================================================
            // HIGHLIGHT
            // =================================================

            ctx.beginPath();


            ctx.moveTo(
                path.points[0].x -
                1.5,

                path.points[0].y -
                1.5
            );


            for (
                let i = 1;
                i < path.points.length;
                i++
            ) {

                ctx.lineTo(

                    path.points[i].x -
                    1.5,

                    path.points[i].y -
                    1.5

                );

            }


            ctx.strokeStyle =
                "rgba(255,255,255,.18)";


            ctx.lineWidth =
                1.7;


            ctx.stroke();


            ctx.restore();

        }

    }


    // ========================================================
    // LUNGS
    // ========================================================

    drawLungs() {

        this.drawLung(
            this.lungs.left,
            "Left Lung"
        );


        this.drawLung(
            this.lungs.right,
            "Right Lung"
        );


        this.drawTrachea();

    }


    // ========================================================
    // SINGLE LUNG
    // ========================================================

    drawLung(
        lung,
        name
    ) {

        if (!lung) {
            return;
        }


        const ctx =
            this.ctx;


        const isLeft =
            name ===
            "Left Lung";


        const x =
            lung.x;


        const y =
            lung.y;


        const w =
            lung.width;


        const h =
            lung.height;


        ctx.save();


        // ====================================================
        // OUTER GLOW
        // ====================================================

        const glow =
            ctx.createRadialGradient(

                x,
                y,

                20,

                x,
                y,

                180

            );


        glow.addColorStop(
            0,
            "rgba(244,143,177,.18)"
        );


        glow.addColorStop(
            1,
            "rgba(244,143,177,0)"
        );


        ctx.fillStyle =
            glow;


        ctx.beginPath();


        ctx.ellipse(
            x,
            y,
            w *
            0.70,

            h *
            0.62,

            0,

            0,

            Math.PI *
            2
        );


        ctx.fill();


        // ====================================================
        // LUNG SHAPE
        // ====================================================

        ctx.beginPath();


        if (isLeft) {

            ctx.moveTo(
                x +
                14,

                y -
                h *
                0.52
            );


            ctx.bezierCurveTo(

                x -
                w *
                0.38,

                y -
                h *
                0.52,

                x -
                w *
                0.55,

                y -
                h *
                0.18,

                x -
                w *
                0.48,

                y +
                h *
                0.32

            );


            ctx.bezierCurveTo(

                x -
                w *
                0.42,

                y +
                h *
                0.52,

                x -
                w *
                0.08,

                y +
                h *
                0.56,

                x +

                2,

                y +
                h *
                0.45

            );


            ctx.bezierCurveTo(

                x +
                8,

                y +
                h *
                0.28,

                x +
                15,

                y +
                h *
                0.08,

                x +
                14,

                y

            );

        } else {

            ctx.moveTo(
                x -
                14,

                y -
                h *
                0.52
            );


            ctx.bezierCurveTo(

                x +
                w *
                0.38,

                y -
                h *
                0.52,

                x +
                w *
                0.55,

                y -
                h *
                0.18,

                x +
                w *
                0.48,

                y +
                h *
                0.32

            );


            ctx.bezierCurveTo(

                x +
                w *
                0.42,

                y +
                h *
                0.52,

                x +
                w *
                0.08,

                y +
                h *
                0.56,

                x -
                2,

                y +
                h *
                0.45

            );


            ctx.bezierCurveTo(

                x -
                8,

                y +
                h *
                0.28,

                x -
                15,

                y +
                h *
                0.08,

                x -
                14,

                y

            );

        }


        ctx.closePath();


        const gradient =
            ctx.createRadialGradient(

                x -
                (isLeft ? 25 : -25),

                y -
                70,

                10,

                x,

                y,

                190

            );


        gradient.addColorStop(
            0,
            "#ffb7c9"
        );


        gradient.addColorStop(
            0.28,
            "#f58ba8"
        );


        gradient.addColorStop(
            0.65,
            "#d95c7c"
        );


        gradient.addColorStop(
            1,
            "#7f304b"
        );


        ctx.fillStyle =
            gradient;


        ctx.shadowColor =
            "rgba(244,114,150,.28)";


        ctx.shadowBlur =
            22;


        ctx.fill();


        ctx.shadowBlur =
            0;


        // ====================================================
        // LUNG HIGHLIGHT
        // ====================================================

        ctx.globalAlpha =
            0.32;


        ctx.fillStyle =
            "#ffd8e3";


        ctx.beginPath();


        ctx.ellipse(

            x -
            (isLeft ? 24 : -24),

            y -
            85,

            26,

            48,

            isLeft
                ? -0.18
                : 0.18,

            0,

            Math.PI *
            2

        );


        ctx.fill();


        ctx.globalAlpha =
            1;


        // ====================================================
        // LUNG LOBES
        // ====================================================

        ctx.strokeStyle =
            "rgba(115,30,59,.42)";


        ctx.lineWidth =
            2;


        for (
            let i = 1;
            i <= 2;
            i++
        ) {

            ctx.beginPath();


            ctx.moveTo(

                x -
                (isLeft
                    ? w *
                      0.40
                    : -w *
                      0.40),

                y +
                10 +
                i *
                34

            );


            ctx.quadraticCurveTo(

                x,

                y +
                30 +
                i *
                20,

                x +
                (isLeft
                    ? w *
                      0.38
                    : -w *
                      0.38),

                y +
                i *
                36

            );


            ctx.stroke();

        }


        // ====================================================
        // BRONCHI
        // ====================================================

        this.drawBronchi(
            x,
            y,
            isLeft
        );


        ctx.restore();

    }


    // ========================================================
    // TRACHEA
    // ========================================================

    drawTrachea() {

        const ctx =
            this.ctx;


        const x =
            this.heart.x;


        const top =
            this.heart.y -
            270;


        const bottom =
            this.heart.y -
            145;


        ctx.save();


        // ====================================================
        // TRACHEA GLOW
        // ====================================================

        ctx.strokeStyle =
            "rgba(255,210,220,.15)";


        ctx.lineWidth =
            18;


        ctx.beginPath();


        ctx.moveTo(
            x,
            top
        );


        ctx.lineTo(
            x,
            bottom
        );


        ctx.stroke();


        // ====================================================
        // TRACHEA
        // ====================================================

        const gradient =
            ctx.createLinearGradient(

                x -
                10,

                0,

                x +
                10,

                0

            );


        gradient.addColorStop(
            0,
            "#b96880"
        );


        gradient.addColorStop(
            0.5,
            "#ffd0db"
        );


        gradient.addColorStop(
            1,
            "#a64e68"
        );


        ctx.strokeStyle =
            gradient;


        ctx.lineWidth =
            12;


        ctx.lineCap =
            "round";


        ctx.beginPath();


        ctx.moveTo(
            x,
            top
        );


        ctx.lineTo(
            x,
            bottom
        );


        ctx.stroke();


        // ====================================================
        // RINGS
        // ====================================================

        ctx.strokeStyle =
            "rgba(112,37,58,.55)";


        ctx.lineWidth =
            2;


        for (
            let y = top + 12;
            y < bottom;
            y += 13
        ) {

            ctx.beginPath();


            ctx.moveTo(
                x -
                6,

                y
            );


            ctx.lineTo(
                x +
                6,

                y
            );


            ctx.stroke();

        }


        ctx.restore();

    }


    // ========================================================
    // BRONCHI
    // ========================================================

    drawBronchi(
        x,
        y,
        isLeft
    ) {

        const ctx =
            this.ctx;


        ctx.save();


        ctx.strokeStyle =
            "rgba(255,213,224,.65)";


        ctx.lineCap =
            "round";


        ctx.lineJoin =
            "round";


        ctx.lineWidth =
            5;


        const dir =
            isLeft
                ? -1
                : 1;


        // ----------------------------------------------------
        // MAIN BRONCHUS
        // ----------------------------------------------------

        ctx.beginPath();


        ctx.moveTo(
            x,
            y -
            8
        );


        ctx.bezierCurveTo(

            x +
            dir *
            25,

            y +
            20,

            x +
            dir *
            42,

            y +
            48,

            x +
            dir *
            56,

            y +
            75

        );


        ctx.stroke();


        // ----------------------------------------------------
        // BRANCHES
        // ----------------------------------------------------

        for (
            let i = 0;
            i < 6;
            i++
        ) {

            const by =
                y -
                5 +
                i *
                28;


            const bx =
                x +
                dir *
                (
                    15 +
                    i *
                    7
                );


            ctx.lineWidth =
                2.4;


            ctx.beginPath();


            ctx.moveTo(
                bx,
                by
            );


            ctx.lineTo(

                bx +
                dir *
                45,

                by -
                22

            );


            ctx.stroke();


            ctx.lineWidth =
                1.2;


            ctx.beginPath();


            ctx.moveTo(

                bx +
                dir *
                25,

                by -
                12

            );


            ctx.lineTo(

                bx +
                dir *
                62,

                by -
                32

            );


            ctx.stroke();

        }


        ctx.restore();

    }


    // ========================================================
    // HEART
    // ========================================================

    drawHeart() {

        const ctx =
            this.ctx;


        const x =
            this.heart.x;


        const y =
            this.heart.y;


        const pulse =
            this.heart.pulse;


        ctx.save();


        ctx.translate(
            x,
            y
        );


        ctx.scale(
            pulse,
            pulse
        );


        // ====================================================
        // HEART GLOW
        // ====================================================

        const glow =
            ctx.createRadialGradient(

                0,
                15,

                15,

                0,
                15,

                120

            );


        glow.addColorStop(
            0,
            "rgba(239,68,68,.32)"
        );


        glow.addColorStop(
            0.5,
            "rgba(239,68,68,.12)"
        );


        glow.addColorStop(
            1,
            "rgba(239,68,68,0)"
        );


        ctx.fillStyle =
            glow;


        ctx.beginPath();


        ctx.arc(
            0,
            15,
            125,
            0,
            Math.PI *
            2
        );


        ctx.fill();


        // ====================================================
        // HEART SHAPE
        // ====================================================

        ctx.beginPath();


        ctx.moveTo(
            0,
            82
        );


        ctx.bezierCurveTo(

            -22,
            58,

            -83,
            30,

            -88,
            -22

        );


        ctx.bezierCurveTo(

            -92,
            -63,

            -55,
            -84,

            -25,
            -67

        );


        ctx.bezierCurveTo(

            -9,
            -58,

            0,
            -43,

            0,
            -31

        );


        ctx.bezierCurveTo(

            0,
            -43,

            9,
            -58,

            25,
            -67

        );


        ctx.bezierCurveTo(

            55,
            -84,

            92,
            -63,

            88,
            -22

        );


        ctx.bezierCurveTo(

            83,
            30,

            22,
            58,

            0,
            82

        );


        ctx.closePath();


        const gradient =
            ctx.createLinearGradient(

                -75,
                -70,

                75,
                85

            );


        gradient.addColorStop(
            0,
            "#ff7b89"
        );


        gradient.addColorStop(
            0.25,
            "#ed3f52"
        );


        gradient.addColorStop(
            0.55,
            "#c51f38"
        );


        gradient.addColorStop(
            0.78,
            "#8d162a"
        );


        gradient.addColorStop(
            1,
            "#571020"
        );


        ctx.fillStyle =
            gradient;


        ctx.shadowColor =
            "rgba(239,68,68,.45)";


        ctx.shadowBlur =
            25;


        ctx.fill();


        ctx.shadowBlur =
            0;


        // ====================================================
        // HEART HIGHLIGHT
        // ====================================================

        ctx.globalAlpha =
            0.27;


        const highlight =
            ctx.createRadialGradient(

                -30,
                -40,

                2,

                -30,
                -40,

                55

            );


        highlight.addColorStop(
            0,
            "#ffffff"
        );


        highlight.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );


        ctx.fillStyle =
            highlight;


        ctx.beginPath();


        ctx.ellipse(

            -35,

            -35,

            38,

            52,

            -0.35,

            0,

            Math.PI *
            2

        );


        ctx.fill();


        ctx.globalAlpha =
            1;


        // ====================================================
        // SEPTUM
        // ====================================================

        ctx.strokeStyle =
            "rgba(92,10,25,.62)";


        ctx.lineWidth =
            5;


        ctx.beginPath();


        ctx.moveTo(
            0,
            -45
        );


        ctx.bezierCurveTo(

            -4,
            -5,

            5,
            30,

            0,
            70

        );


        ctx.stroke();


        // ====================================================
        // CHAMBERS
        // ====================================================

        this.drawHeartChamber(
            -43,
            -28,
            30,
            32,
            "#2f67d8",
            "RA"
        );


        this.drawHeartChamber(
            43,
            -28,
            30,
            32,
            "#e73e50",
            "LA"
        );


        this.drawHeartChamber(
            -39,
            28,
            33,
            47,
            "#2458c5",
            "RV"
        );


        this.drawHeartChamber(
            39,
            28,
            34,
            50,
            "#c9273d",
            "LV"
        );


        // ====================================================
        // CORONARY VESSELS
        // ====================================================

        ctx.strokeStyle =
            "rgba(255,145,155,.58)";


        ctx.lineWidth =
            2;


        ctx.beginPath();


        ctx.moveTo(
            -57,
            -5
        );


        ctx.bezierCurveTo(

            -38,
            8,

            -24,
            0,

            -18,
            17

        );


        ctx.stroke();


        ctx.beginPath();


        ctx.moveTo(
            57,
            -5
        );


        ctx.bezierCurveTo(

            38,
            8,

            24,
            0,

            18,
            17

        );


        ctx.stroke();


        // ====================================================
        // APEX
        // ====================================================

        ctx.fillStyle =
            "rgba(255,113,126,.45)";


        ctx.beginPath();


        ctx.ellipse(

            0,

            70,

            12,

            18,

            0,

            0,

            Math.PI *
            2

        );


        ctx.fill();


        ctx.restore();

    }


    // ========================================================
    // HEART CHAMBER
    // ========================================================

    drawHeartChamber(
        x,
        y,
        rx,
        ry,
        color,
        label
    ) {

        const ctx =
            this.ctx;


        ctx.save();


        const gradient =
            ctx.createRadialGradient(

                x -
                8,

                y -
                8,

                2,

                x,

                y,

                rx

            );


        gradient.addColorStop(
            0,
            this.lightenColor(
                color,
                25
            )
        );


        gradient.addColorStop(
            0.6,
            color
        );


        gradient.addColorStop(
            1,
            this.darkenColor(
                color,
                30
            )
        );


        ctx.fillStyle =
            gradient;


        ctx.beginPath();


        ctx.ellipse(

            x,
            y,

            rx,
            ry,

            0,

            0,

            Math.PI *
            2

        );


        ctx.fill();


        ctx.strokeStyle =
            "rgba(255,255,255,.14)";


        ctx.lineWidth =
            1;


        ctx.stroke();


        // ----------------------------------------------------
        // LABEL
        // ----------------------------------------------------

        ctx.fillStyle =
            "rgba(255,255,255,.72)";


        ctx.font =
            "bold 8px Arial";


        ctx.textAlign =
            "center";


        ctx.textBaseline =
            "middle";


        ctx.fillText(
            label,
            x,
            y
        );


        ctx.restore();

    }


    // ========================================================
    // BLOOD PARTICLES
    // ========================================================

    drawBloodParticles() {

        const ctx =
            this.ctx;


        for (
            const particle
            of this.bloodParticles
        ) {

            const path =
                this.flowPaths[
                    particle.path %
                    this.flowPaths.length
                ];


            if (
                !path ||
                path.points.length <
                2
            ) {

                continue;

            }


            const p =
                this.getPointOnPath(
                    path.points,
                    particle.progress
                );


            if (!p) {
                continue;
            }


            const isRed =
                path.color ===
                "#ef4444";


            ctx.save();


            ctx.shadowColor =
                isRed
                    ? "#ff4657"
                    : "#4d8dff";


            ctx.shadowBlur =
                8;


            const gradient =
                ctx.createRadialGradient(

                    p.x -
                    1,

                    p.y -
                    1,

                    0,

                    p.x,

                    p.y,

                    particle.size *
                    2

                );


            gradient.addColorStop(
                0,
                "#ffffff"
            );


            gradient.addColorStop(
                0.18,
                isRed
                    ? "#ff9aa5"
                    : "#b7d1ff"
            );


            gradient.addColorStop(
                0.55,
                isRed
                    ? "#ef3349"
                    : "#3b82f6"
            );


            gradient.addColorStop(
                1,
                isRed
                    ? "#991b1b"
                    : "#1d4ed8"
            );


            ctx.fillStyle =
                gradient;


            ctx.beginPath();


            ctx.arc(

                p.x,

                p.y,

                particle.size,

                0,

                Math.PI *
                2

            );


            ctx.fill();


            ctx.restore();

        }

    }


    // ========================================================
    // POINT ON PATH
    // ========================================================

    getPointOnPath(
        points,
        progress
    ) {

        if (
            points.length <
            2
        ) {

            return null;

        }


        const segments =
            points.length -
            1;


        const scaled =
            Math.max(
                0,
                Math.min(
                    progress,
                    0.999999
                )
            ) *
            segments;


        const index =
            Math.floor(
                scaled
            );


        const local =
            scaled -
            index;


        const a =
            points[index];


        const b =
            points[
                Math.min(
                    index +
                    1,
                    points.length -
                    1
                )
            ];


        return {

            x:
                a.x +
                (
                    b.x -
                    a.x
                ) *
                local,

            y:
                a.y +
                (
                    b.y -
                    a.y
                ) *
                local

        };

    }


    // ========================================================
    // GAS EXCHANGE
    // ========================================================

    drawGasExchange() {

        const ctx =
            this.ctx;


        const t =
            this.time;


        // ====================================================
        // OXYGEN
        // ====================================================

        for (
            let i = 0;
            i < this.oxygenParticles.length;
            i++
        ) {

            const p =
                this.oxygenParticles[i];


            const side =
                i %
                2 ===
                0
                    ? -1
                    : 1;


            const lung =
                side ===
                -1
                    ? this.lungs.left
                    : this.lungs.right;


            const x =
                lung.x +
                Math.sin(
                    t *
                    1.2 +
                    p.phase
                ) *
                45;


            const y =
                lung.y +
                20 +
                (
                    (
                        i *
                        31
                    ) %
                    180
                );


            ctx.save();


            ctx.shadowColor =
                "#67e8f9";


            ctx.shadowBlur =
                12;


            ctx.fillStyle =
                "#67e8f9";


            ctx.beginPath();


            ctx.arc(
                x,
                y,
                3.2,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            ctx.restore();

        }


        // ====================================================
        // CO2
        // ====================================================

        for (
            let i = 0;
            i < this.co2Particles.length;
            i++
        ) {

            const p =
                this.co2Particles[i];


            const side =
                i %
                2 ===
                0
                    ? -1
                    : 1;


            const lung =
                side ===
                -1
                    ? this.lungs.left
                    : this.lungs.right;


            const x =
                lung.x +
                Math.cos(
                    t *
                    1.1 +
                    p.phase
                ) *
                55;


            const y =
                lung.y +
                35 +
                (
                    (
                        i *
                        43
                    ) %
                    160
                );


            ctx.save();


            ctx.shadowColor =
                "#a78bfa";


            ctx.shadowBlur =
                9;


            ctx.fillStyle =
                "#a78bfa";


            ctx.beginPath();


            ctx.arc(
                x,
                y,
                2.8,
                0,
                Math.PI *
                2
            );


            ctx.fill();


            ctx.restore();

        }

    }


    // ========================================================
    // LABELS
    // ========================================================

    drawLabels() {

        const ctx =
            this.ctx;


        const cx =
            this.heart.x;


        const cy =
            this.heart.y;


        ctx.save();


        ctx.font =
            "600 11px Inter, Arial";


        ctx.textBaseline =
            "middle";


        // ====================================================
        // HEART LABEL
        // ====================================================

        this.drawLabel(
            "HEART",
            cx,
            cy +
            120,
            "#ff7180"
        );


        // ====================================================
        // LUNG LABELS
        // ====================================================

        this.drawLabel(
            "LEFT LUNG",
            this.lungs.left.x,
            this.lungs.left.y +
            175,
            "#ff9bb6"
        );


        this.drawLabel(
            "RIGHT LUNG",
            this.lungs.right.x,
            this.lungs.right.y +
            175,
            "#ff9bb6"
        );


        // ====================================================
        // AORTA
        // ====================================================

        this.drawLabel(
            "AORTA",
            cx +
            98,
            cy -
            250,
            "#ff6b78"
        );


        // ====================================================
        // VENA CAVA
        // ====================================================

        this.drawLabel(
            "VENA CAVA",
            cx -
            90,
            cy -
            185,
            "#72a7ff"
        );


        ctx.restore();

    }


    // ========================================================
    // LABEL
    // ========================================================

    drawLabel(
        text,
        x,
        y,
        color
    ) {

        const ctx =
            this.ctx;


        const metrics =
            ctx.measureText(
                text
            );


        const padding =
            7;


        ctx.fillStyle =
            "rgba(2,9,20,.72)";


        ctx.beginPath();


        this.roundRect(

            ctx,

            x -
            metrics.width /
            2 -
            padding,

            y -
            9,

            metrics.width +
            padding *
            2,

            18,

            8

        );


        ctx.fill();


        ctx.strokeStyle =
            color;


        ctx.globalAlpha =
            0.35;


        ctx.stroke();


        ctx.globalAlpha =
            1;


        ctx.fillStyle =
            color;


        ctx.textAlign =
            "center";


        ctx.fillText(
            text,
            x,
            y
        );

    }


    // ========================================================
    // ROUND RECT
    // ========================================================

    roundRect(
        ctx,
        x,
        y,
        width,
        height,
        radius
    ) {

        ctx.beginPath();


        ctx.moveTo(
            x +
            radius,
            y
        );


        ctx.lineTo(
            x +
            width -
            radius,
            y
        );


        ctx.quadraticCurveTo(

            x +
            width,

            y,

            x +
            width,

            y +
            radius

        );


        ctx.lineTo(

            x +
            width,

            y +
            height -
            radius

        );


        ctx.quadraticCurveTo(

            x +
            width,

            y +
            height,

            x +
            width -
            radius,

            y +
            height

        );


        ctx.lineTo(

            x +
            radius,

            y +
            height

        );


        ctx.quadraticCurveTo(

            x,

            y +
            height,

            x,

            y +
            height -
            radius

        );


        ctx.lineTo(
            x,
            y +
            radius
        );


        ctx.quadraticCurveTo(

            x,

            y,

            x +
            radius,

            y

        );


        ctx.closePath();

    }


    // ========================================================
    // INFO PANEL
    // ========================================================

    updateInfoPanel() {

        if (
            !this.infoPanel
        ) {

            return;

        }


        const state =
            this.running
                ? "ACTIVE"
                : "PAUSED";


        const stateColor =
            this.running
                ? "#4ade80"
                : "#facc15";


        this.infoPanel.innerHTML =

            `<div style="
                font-size:13px;
                font-weight:700;
                margin-bottom:7px;
                color:#f8fafc;
            ">
                Circulation Status
            </div>

            <div style="margin-bottom:4px;">
                Heart Rate:
                <b style="color:#fb7185;">
                    ${this.heartRate} BPM
                </b>
            </div>

            <div style="margin-bottom:4px;">
                Blood Flow:
                <b style="color:${stateColor};">
                    ${state}
                </b>
            </div>

            <div style="margin-bottom:4px;">
                Oxygen Exchange:
                <b style="color:#67e8f9;">
                    ACTIVE
                </b>
            </div>

            <div style="
                margin-top:9px;
                padding-top:8px;
                border-top:1px solid rgba(148,163,184,.12);
                color:#94a3b8;
            ">
                ❤️ Right side → lungs<br>
                ❤️ Left side → body
            </div>`;

    }


    // ========================================================
    // POINTER MOVE
    // ========================================================

    onPointerMove(
        event
    ) {

        if (
            !this.canvas
        ) {

            return;

        }


        const rect =
            this.canvas.getBoundingClientRect();


        this.mouseX =
            event.clientX -
            rect.left;


        this.mouseY =
            event.clientY -
            rect.top;


        const region =
            this.getRegionAt(
                this.mouseX,
                this.mouseY
            );


        this.hovered =
            region;


        this.canvas.style.cursor =
            region
                ? "pointer"
                : "default";

    }


    // ========================================================
    // POINTER DOWN
    // ========================================================

    onPointerDown(
        event
    ) {

        const rect =
            this.canvas.getBoundingClientRect();


        const x =
            event.clientX -
            rect.left;


        const y =
            event.clientY -
            rect.top;


        const region =
            this.getRegionAt(
                x,
                y
            );


        if (
            !region
        ) {

            return;

        }


        this.dispatchSelection(
            region
        );

    }


    // ========================================================
    // WHEEL
    // ========================================================

    onWheel(
        event
    ) {

        // Canvas version does not zoom.
        // Prevent the page from scrolling while pointer
        // is over the simulation.

        event.preventDefault();

    }


    // ========================================================
    // REGION DETECTION
    // ========================================================

    getRegionAt(
        x,
        y
    ) {

        const cx =
            this.heart.x;


        const cy =
            this.heart.y;


        // ====================================================
        // HEART
        // ====================================================

        const heartDistance =
            Math.sqrt(

                Math.pow(
                    x -
                    cx,
                    2
                ) +

                Math.pow(
                    y -
                    cy,
                    2
                )

            );


        if (
            heartDistance <
            95
        ) {

            return {

                name:
                    "Heart",

                nameRw:
                    "Umutima",

                type:
                    "organ",

                description:
                    "The heart is a four-chambered muscular organ that pumps blood through pulmonary and systemic circulation.",

                descriptionRw:
                    "Umutima ni urugingo rugizwe n'ibyumba bine rutera amaraso mu mubiri no mu bihaha.",

                teacher:
                    "The right side sends deoxygenated blood to the lungs. The left side sends oxygenated blood to the body."

            };

        }


        // ====================================================
        // LEFT LUNG
        // ====================================================

        if (
            this.pointInEllipse(

                x,

                y,

                this.lungs.left.x,

                this.lungs.left.y,

                85,

                160

            )
        ) {

            return {

                name:
                    "Left Lung",

                nameRw:
                    "Igihaha cy'ibumoso",

                type:
                    "organ",

                description:
                    "The left lung is responsible for gas exchange between air and blood.",

                descriptionRw:
                    "Igihaha cy'ibumoso gifasha guhana umwuka wa oxygen na carbon dioxide hagati y'umwuka n'amaraso.",

                teacher:
                    "Oxygen enters the blood in the lungs while carbon dioxide leaves the blood."

            };

        }


        // ====================================================
        // RIGHT LUNG
        // ====================================================

        if (
            this.pointInEllipse(

                x,

                y,

                this.lungs.right.x,

                this.lungs.right.y,

                85,

                160

            )
        ) {

            return {

                name:
                    "Right Lung",

                nameRw:
                    "Igihaha cy'iburyo",

                type:
                    "organ",

                description:
                    "The right lung is responsible for gas exchange between air and blood.",

                descriptionRw:
                    "Igihaha cy'iburyo gifasha guhana oxygen na carbon dioxide hagati y'umwuka n'amaraso.",

                teacher:
                    "The lungs add oxygen to the blood and remove carbon dioxide."

            };

        }


        // ====================================================
        // AORTA
        // ====================================================

        if (
            Math.abs(
                x -
                (
                    cx +
                    70
                )
            ) <
            20 &&

            y <
            cy -
            100
        ) {

            return {

                name:
                    "Aorta",

                nameRw:
                    "Aorta",

                type:
                    "blood-vessel",

                description:
                    "The aorta is the largest artery and carries oxygenated blood from the left ventricle to the body.",

                descriptionRw:
                    "Aorta ni umutsi munini utwara amaraso afite oxygen ava mu mutima ajya mu mubiri.",

                teacher:
                    "The left ventricle pumps oxygenated blood into the aorta."

            };

        }


        // ====================================================
        // VENA CAVA
        // ====================================================

        if (
            Math.abs(
                x -
                (
                    cx -
                    45
                )
            ) <
            20 &&

            y <
            cy -
            80
        ) {

            return {

                name:
                    "Vena Cava",

                nameRw:
                    "Vena Cava",

                type:
                    "blood-vessel",

                description:
                    "The vena cava returns deoxygenated blood from the body to the right atrium.",

                descriptionRw:
                    "Vena Cava igarura amaraso adafite oxygen ava mu mubiri asubira ku mutima.",

                teacher:
                    "The superior and inferior vena cava return deoxygenated blood to the right atrium."

            };

        }


        return null;

    }


    // ========================================================
    // ELLIPSE TEST
    // ========================================================

    pointInEllipse(
        x,
        y,
        cx,
        cy,
        rx,
        ry
    ) {

        return (

            Math.pow(
                (
                    x -
                    cx
                ) /
                rx,
                2
            ) +

            Math.pow(
                (
                    y -
                    cy
                ) /
                ry,
                2
            )

        ) <= 1;

    }


    // ========================================================
    // DISPATCH SELECTION
    // ========================================================

    dispatchSelection(
        data
    ) {

        if (!data) {
            return;
        }


        window.dispatchEvent(
            new CustomEvent(
                "biology-structure-selected",
                {

                    detail: {

                        name:
                            data.name,

                        nameRw:
                            data.nameRw,

                        description:
                            data.description,

                        descriptionRw:
                            data.descriptionRw,

                        teacher:
                            data.teacher,

                        type:
                            data.type

                    }

                }
            )
        );

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
            false;

    }


    // ========================================================
    // RESET
    // ========================================================

    reset() {

        this.time =
            0;


        this.running =
            true;


        this.heartRate =
            72;


        for (
            const particle
            of this.bloodParticles
        ) {

            particle.progress =
                Math.random();

        }


        if (
            this.speedLabel
        ) {

            this.speedLabel.textContent =
                `${this.animationSpeed.toFixed(2)}×`;

        }


        this.draw();

    }


    // ========================================================
    // SET ANIMATION SPEED
    // ========================================================

    setAnimationSpeed(
        speed
    ) {

        const value =
            Number(
                speed
            );


        if (
            !Number.isFinite(
                value
            )
        ) {

            return;

        }


        this.animationSpeed =
            Math.max(
                0.1,
                Math.min(
                    value,
                    5
                )
            );


        if (
            this.speedLabel
        ) {

            this.speedLabel.textContent =
                `${this.animationSpeed.toFixed(2)}×`;

        }

    }


    // ========================================================
    // GET STATE
    // ========================================================

    getState() {

        return {

            running:
                this.running,

            animationSpeed:
                this.animationSpeed,

            heartRate:
                this.heartRate,

            oxygenExchange:
                "ACTIVE",

            bloodFlow:
                "ACTIVE"

        };

    }


    // ========================================================
    // FOCUS
    // ========================================================

    focusOn(
        targetName
    ) {

        const name =
            String(
                targetName ||
                ""
            )
                .trim()
                .toLowerCase();


        if (
            name.includes(
                "heart"
            ) ||
            name.includes(
                "umutima"
            )
        ) {

            return {

                target:
                    "Heart",

                center: {

                    x:
                        this.heart.x,

                    y:
                        this.heart.y

                }

            };

        }


        if (
            name.includes(
                "lung"
            ) ||
            name.includes(
                "igihaha"
            )
        ) {

            return {

                target:
                    "Lungs",

                center: {

                    x:
                        this.width *
                        0.5,

                    y:
                        this.height *
                        0.45

                }

            };

        }


        return null;

    }


    // ========================================================
    // GET FOCUS TARGET
    // ========================================================

    getFocusTarget(
        name
    ) {

        return this.focusOn(
            name
        );

    }


    // ========================================================
    // COLOR HELPERS
    // ========================================================

    lightenColor(
        hex,
        amount
    ) {

        const value =
            hex.replace(
                "#",
                ""
            );


        const num =
            parseInt(
                value,
                16
            );


        let r =
            (
                num >>
                16
            ) +
            amount;


        let g =
            (
                num >>
                8 &
                0x00FF
            ) +
            amount;


        let b =
            (
                num &
                0x0000FF
            ) +
            amount;


        r =
            Math.min(
                255,
                r
            );


        g =
            Math.min(
                255,
                g
            );


        b =
            Math.min(
                255,
                b
            );


        return (

            "#" +

            (
                (
                    1 <<
                    24
                ) +

                (
                    r <<
                    16
                ) +

                (
                    g <<
                    8
                ) +

                b

            )
                .toString(16)
                .slice(1)

        );

    }


    // ========================================================
    // DARKEN COLOR
    // ========================================================

    darkenColor(
        hex,
        amount
    ) {

        return this.lightenColor(
            hex,
            -amount
        );

    }


    // ========================================================
    // DISPOSE
    // ========================================================

    dispose() {

        if (
            this.canvas
        ) {

            this.canvas.removeEventListener(
                "pointermove",
                this.onPointerMove
            );


            this.canvas.removeEventListener(
                "pointerdown",
                this.onPointerDown
            );


            this.canvas.removeEventListener(
                "wheel",
                this.onWheel
            );

        }


        if (
            this.wrapper &&
            this.wrapper.parentNode
        ) {

            this.wrapper.parentNode.removeChild(
                this.wrapper
            );

        }


        this.canvas =
            null;


        this.ctx =
            null;


        this.wrapper =
            null;


        this.container =
            null;


        this.selectable =
            [];


        this.bloodParticles =
            [];


        this.oxygenParticles =
            [];


        this.co2Particles =
            [];


        this.flowPaths =
            [];


        this.group.clear();

    }

}