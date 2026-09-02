// ============================================================
// SciLab - Biology Laboratory
// CellOrganelles.js
// ============================================================

import * as THREE from "three";


// ============================================================
// MATERIAL HELPERS
// ============================================================

function standardMaterial(
    color,
    options = {}
) {

    return new THREE.MeshStandardMaterial({

        color,

        roughness:
            options.roughness ?? 0.42,

        metalness:
            options.metalness ?? 0.0,

        transparent:
            options.transparent ?? false,

        opacity:
            options.opacity ?? 1,

        side:
            options.side ?? THREE.FrontSide

    });

}


function physicalMaterial(
    color,
    options = {}
) {

    return new THREE.MeshPhysicalMaterial({

        color,

        roughness:
            options.roughness ?? 0.28,

        metalness:
            options.metalness ?? 0,

        transparent:
            options.transparent ?? false,

        opacity:
            options.opacity ?? 1,

        transmission:
            options.transmission ?? 0,

        thickness:
            options.thickness ?? 0.4,

        side:
            options.side ?? THREE.FrontSide,

        depthWrite:
            options.depthWrite ?? true

    });

}


// ============================================================
// METADATA HELPER
// ============================================================

function setOrganelleData(
    object,
    data
) {

    object.userData = {

        type:
            "organelle",

        name:
            data.name,

        nameRw:
            data.nameRw || data.name,

        description:
            data.description,

        descriptionRw:
            data.descriptionRw || data.description,

        teacher:
            data.teacher || data.description

    };

}


// ============================================================
// NUCLEUS
// ============================================================

export function createNucleus() {

    const group =
        new THREE.Group();

    group.name =
        "Nucleus";


    setOrganelleData(
        group,
        {

            name:
                "Nucleus",

            nameRw:
                "Nucleus",

            description:
                "The nucleus contains the cell's genetic material and controls many cellular activities.",

            descriptionRw:
                "Nucleus ibika amakuru y'irondakoko kandi igenzura ibikorwa byinshi by'akagari.",

            teacher:
                "The nucleus contains DNA and regulates gene expression and many activities of the cell."

        }
    );


    // --------------------------------------------------------
    // NUCLEAR ENVELOPE
    // --------------------------------------------------------

    const envelope =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                1.38,
                48,
                32
            ),

            physicalMaterial(
                0x7048c8,
                {
                    roughness: 0.22,
                    transparent: true,
                    opacity: 0.78,
                    transmission: 0.04
                }
            )

        );


    envelope.name =
        "Nuclear Envelope";


    group.add(
        envelope
    );


    // --------------------------------------------------------
    // INNER NUCLEUS
    // --------------------------------------------------------

    const inner =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                1.18,
                40,
                28
            ),

            standardMaterial(
                0x8c68e8,
                {
                    roughness: 0.35
                }
            )

        );


    inner.name =
        "Nucleus Interior";


    group.add(
        inner
    );


    // --------------------------------------------------------
    // NUCLEOLUS
    // --------------------------------------------------------

    const nucleolus =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.43,
                28,
                20
            ),

            standardMaterial(
                0xffc857,
                {
                    roughness: 0.28
                }
            )

        );


    nucleolus.position.set(
        0.32,
        0.24,
        1.08
    );


    nucleolus.name =
        "Nucleolus";


    setOrganelleData(
        nucleolus,
        {

            name:
                "Nucleolus",

            nameRw:
                "Nucleolus",

            description:
                "The nucleolus produces ribosomal RNA and helps assemble ribosome components.",

            descriptionRw:
                "Nucleolus ikora ribosomal RNA kandi igafasha guteranya ibice bya ribosomes."

        }
    );


    group.add(
        nucleolus
    );


    // --------------------------------------------------------
    // CHROMATIN
    // --------------------------------------------------------

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const strand =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    0.35 +
                    Math.random() *
                    0.35,

                    0.025,

                    6,

                    20
                ),

                standardMaterial(
                    0xc9a7ff,
                    {
                        roughness: 0.5
                    }
                )

            );


        strand.rotation.x =
            Math.random() *
            Math.PI;


        strand.rotation.y =
            Math.random() *
            Math.PI;


        strand.position.set(

            (
                Math.random() -
                0.5
            ) * 0.7,

            (
                Math.random() -
                0.5
            ) * 0.7,

            (
                Math.random() -
                0.5
            ) * 0.7

        );


        group.add(
            strand
        );

    }


    return group;

}


// ============================================================
// MITOCHONDRION
// ============================================================

export function createMitochondrion(
    x = 0,
    y = 0,
    z = 0,
    rotation = 0
) {

    const group =
        new THREE.Group();

    group.name =
        "Mitochondrion";


    setOrganelleData(
        group,
        {

            name:
                "Mitochondrion",

            nameRw:
                "Mitochondrion",

            description:
                "Mitochondria produce ATP through cellular respiration.",

            descriptionRw:
                "Mitochondria zikora ATP hifashishijwe cellular respiration.",

            teacher:
                "Mitochondria are major sites of aerobic cellular respiration and ATP production."

        }
    );


    // --------------------------------------------------------
    // OUTER MEMBRANE
    // --------------------------------------------------------

    const outer =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.62,
                32,
                20
            ),

            standardMaterial(
                0xff6845,
                {
                    roughness: 0.32
                }
            )

        );


    outer.scale.set(
        1.65,
        0.72,
        0.72
    );


    outer.name =
        "Outer Mitochondrial Membrane";


    group.add(
        outer
    );


    // --------------------------------------------------------
    // INNER MEMBRANE / CRISTAE
    // --------------------------------------------------------

    for (
        let i = -2;
        i <= 2;
        i++
    ) {

        const crista =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    0.30,
                    0.045,
                    8,
                    24
                ),

                standardMaterial(
                    0xffd166,
                    {
                        roughness: 0.30
                    }
                )

            );


        crista.rotation.y =
            Math.PI / 2;


        crista.position.x =
            i * 0.19;


        crista.scale.y =
            0.72;


        group.add(
            crista
        );

    }


    // --------------------------------------------------------
    // MATRIX
    // --------------------------------------------------------

    const matrix =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.23,
                16,
                12
            ),

            standardMaterial(
                0xffb347,
                {
                    roughness: 0.5
                }
            )

        );


    matrix.scale.set(
        1.3,
        0.65,
        0.65
    );


    group.add(
        matrix
    );


    group.position.set(
        x,
        y,
        z
    );


    group.rotation.z =
        rotation;


    return group;

}


// ============================================================
// CHLOROPLAST
// ============================================================

export function createChloroplast(
    x = 0,
    y = 0,
    z = 0
) {

    const group =
        new THREE.Group();

    group.name =
        "Chloroplast";


    setOrganelleData(
        group,
        {

            name:
                "Chloroplast",

            nameRw:
                "Chloroplast",

            description:
                "Chloroplasts contain chlorophyll and are the main site of photosynthesis.",

            descriptionRw:
                "Chloroplasts zirimo chlorophyll kandi ni ho photosynthesis ahanini ibera.",

            teacher:
                "Chloroplasts capture light energy using chlorophyll and convert it into chemical energy during photosynthesis."

        }
    );


    // --------------------------------------------------------
    // OUTER BODY
    // --------------------------------------------------------

    const body =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.68,
                32,
                20
            ),

            standardMaterial(
                0x2e9f50,
                {
                    roughness: 0.38
                }
            )

        );


    body.scale.set(
        1.55,
        0.68,
        0.68
    );


    group.add(
        body
    );


    // --------------------------------------------------------
    // GRANA
    // --------------------------------------------------------

    for (
        let i = -2;
        i <= 2;
        i++
    ) {

        const granum =
            new THREE.Group();


        for (
            let j = -1;
            j <= 1;
            j++
        ) {

            const disk =
                new THREE.Mesh(

                    new THREE.CylinderGeometry(
                        0.23,
                        0.23,
                        0.065,
                        20
                    ),

                    standardMaterial(
                        0x9be15d,
                        {
                            roughness: 0.35
                        }
                    )

                );


            disk.rotation.z =
                Math.PI / 2;


            disk.position.y =
                j * 0.11;


            granum.add(
                disk
            );

        }


        granum.position.set(
            i * 0.22,
            0,
            0
        );


        group.add(
            granum
        );

    }


    group.position.set(
        x,
        y,
        z
    );


    return group;

}


// ============================================================
// GOLGI APPARATUS
// ============================================================

export function createGolgi() {

    const group =
        new THREE.Group();

    group.name =
        "Golgi Apparatus";


    setOrganelleData(
        group,
        {

            name:
                "Golgi Apparatus",

            nameRw:
                "Golgi Apparatus",

            description:
                "The Golgi apparatus modifies, sorts and packages cellular materials.",

            descriptionRw:
                "Golgi apparatus ihindura, itondeka kandi ipakira ibikoresho bya cell.",

            teacher:
                "The Golgi apparatus processes proteins and lipids, sorts them, and packages them into vesicles."

        }
    );


    // --------------------------------------------------------
    // STACKED CISTERNAE
    // --------------------------------------------------------

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const curve =
            new THREE.CatmullRomCurve3([

                new THREE.Vector3(
                    -0.85,
                    0,
                    0
                ),

                new THREE.Vector3(
                    -0.30,
                    0.15,
                    0.10
                ),

                new THREE.Vector3(
                    0.35,
                    0.10,
                    0
                ),

                new THREE.Vector3(
                    0.85,
                    -0.05,
                    -0.05
                )

            ]);


        const geometry =
            new THREE.TubeGeometry(
                curve,
                24,
                0.075,
                8,
                false
            );


        const cisterna =
            new THREE.Mesh(

                geometry,

                standardMaterial(
                    0x42d6e8,
                    {
                        roughness: 0.32
                    }
                )

            );


        cisterna.position.y =
            (
                i -
                2.5
            ) *
            0.16;


        cisterna.scale.x =
            1 -
            Math.abs(
                i -
                2.5
            ) *
            0.045;


        group.add(
            cisterna
        );

    }


    // --------------------------------------------------------
    // GOLGI VESICLES
    // --------------------------------------------------------

    const vesiclePositions = [

        [-1.0, 0.55, 0],

        [1.0, -0.45, 0.05],

        [0.9, 0.55, -0.15],

        [-0.95, -0.55, 0.1]

    ];


    vesiclePositions.forEach(
        position => {

            const vesicle =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.10,
                        14,
                        10
                    ),

                    standardMaterial(
                        0xffd166,
                        {
                            roughness: 0.3
                        }
                    )

                );


            vesicle.position.set(
                ...position
            );


            group.add(
                vesicle
            );

        }
    );


    return group;

}


// ============================================================
// ENDOPLASMIC RETICULUM
// ============================================================

export function createEndoplasmicReticulum() {

    const group =
        new THREE.Group();

    group.name =
        "Endoplasmic Reticulum";


    setOrganelleData(
        group,
        {

            name:
                "Endoplasmic Reticulum",

            nameRw:
                "Endoplasmic Reticulum",

            description:
                "The endoplasmic reticulum supports protein and lipid production and intracellular transport.",

            descriptionRw:
                "Endoplasmic reticulum ifasha mu gukora proteins, lipids no gutwara ibikoresho muri cell.",

            teacher:
                "The endoplasmic reticulum forms a membrane network involved in protein synthesis, lipid synthesis and transport."

        }
    );


    // ========================================================
    // ROUGH ER
    // ========================================================

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const curve =
            new THREE.CatmullRomCurve3([

                new THREE.Vector3(
                    -1.15,
                    -0.70 +
                    i * 0.19,
                    0
                ),

                new THREE.Vector3(
                    -0.35,
                    0.15 +
                    i * 0.19,
                    0.35
                ),

                new THREE.Vector3(
                    0.35,
                    -0.30 +
                    i * 0.19,
                    -0.25
                ),

                new THREE.Vector3(
                    1.10,
                    0.05 +
                    i * 0.19,
                    0
                )

            ]);


        const geometry =
            new THREE.TubeGeometry(
                curve,
                28,
                0.045,
                8,
                false
            );


        const membrane =
            new THREE.Mesh(

                geometry,

                standardMaterial(
                    0xff7fa3,
                    {
                        roughness: 0.30
                    }
                )

            );


        group.add(
            membrane
        );


        // ----------------------------------------------------
        // RIBOSOMES ON ROUGH ER
        // ----------------------------------------------------

        for (
            let r = 0;
            r < 4;
            r++
        ) {

            const ribosome =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        0.055,
                        8,
                        6
                    ),

                    standardMaterial(
                        0xf4e285,
                        {
                            roughness: 0.5
                        }
                    )

                );


            ribosome.position.set(

                -0.90 +
                r * 0.55,

                -0.58 +
                i * 0.19,

                0.12

            );


            group.add(
                ribosome
            );

        }

    }


    // --------------------------------------------------------
    // ER POSITION
    // --------------------------------------------------------

    group.position.set(
        1.35,
        -0.85,
        -0.85
    );


    group.scale.set(
        0.95,
        0.95,
        0.95
    );


    return group;

}


// ============================================================
// RIBOSOME
// ============================================================

export function createRibosome(
    x = 0,
    y = 0,
    z = 0
) {

    const group =
        new THREE.Group();

    group.name =
        "Ribosome";


    setOrganelleData(
        group,
        {

            name:
                "Ribosome",

            nameRw:
                "Ribosome",

            description:
                "Ribosomes assemble proteins from amino acids.",

            descriptionRw:
                "Ribosomes zikoranya proteins zikoresheje amino acids.",

            teacher:
                "Ribosomes translate messenger RNA and join amino acids together to form proteins."

        }
    );


    // --------------------------------------------------------
    // LARGE SUBUNIT
    // --------------------------------------------------------

    const large =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.085,
                10,
                8
            ),

            standardMaterial(
                0xf4e285
            )

        );


    large.scale.set(
        1.15,
        0.75,
        0.75
    );


    large.position.y =
        0.035;


    group.add(
        large
    );


    // --------------------------------------------------------
    // SMALL SUBUNIT
    // --------------------------------------------------------

    const small =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.065,
                10,
                8
            ),

            standardMaterial(
                0xffdf7e
            )

        );


    small.scale.set(
        1.1,
        0.75,
        0.75
    );


    small.position.y =
        -0.045;


    group.add(
        small
    );


    group.position.set(
        x,
        y,
        z
    );


    return group;

}


// ============================================================
// LYSOSOME
// ============================================================

export function createLysosome(
    x = 0,
    y = 0,
    z = 0
) {

    const mesh =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.20,
                24,
                18
            ),

            physicalMaterial(
                0xc85aa8,
                {
                    roughness: 0.28,
                    transmission: 0.04
                }
            )

        );


    mesh.position.set(
        x,
        y,
        z
    );


    mesh.name =
        "Lysosome";


    setOrganelleData(
        mesh,
        {

            name:
                "Lysosome",

            nameRw:
                "Lysosome",

            description:
                "Lysosomes contain digestive enzymes that break down cellular waste and unwanted materials.",

            descriptionRw:
                "Lysosomes zirimo enzymes zifasha kumenagura imyanda n'ibikoresho cell itagikeneye.",

            teacher:
                "Lysosomes contain hydrolytic enzymes that digest damaged organelles, macromolecules and cellular waste."

        }
    );


    return mesh;

}


// ============================================================
// VACUOLE
// ============================================================

export function createVacuole() {

    const mesh =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                2.2,
                48,
                32
            ),

            physicalMaterial(
                0x69d2ff,
                {
                    roughness: 0.08,
                    transparent: true,
                    opacity: 0.25,
                    transmission: 0.15,
                    thickness: 0.8,
                    depthWrite: false
                }
            )

        );


    mesh.name =
        "Central Vacuole";


    mesh.scale.set(
        1.05,
        1.0,
        1.0
    );


    setOrganelleData(
        mesh,
        {

            name:
                "Central Vacuole",

            nameRw:
                "Central Vacuole",

            description:
                "The central vacuole stores water, ions and dissolved substances and helps maintain plant cell pressure.",

            descriptionRw:
                "Central vacuole ibika amazi, ions n'ibindi binyunguruye kandi igafasha plant cell kugira pressure ikwiye.",

            teacher:
                "The large central vacuole stores water and solutes and contributes to turgor pressure, which helps support the plant cell."

        }
    );


    return mesh;

}


// ============================================================
// CENTRIOLE
// ============================================================

export function createCentriole(
    x = 0,
    y = 0,
    z = 0
) {

    const group =
        new THREE.Group();

    group.name =
        "Centriole";


    setOrganelleData(
        group,
        {

            name:
                "Centriole",

            nameRw:
                "Centriole",

            description:
                "Centrioles help organize microtubules during cell division.",

            descriptionRw:
                "Centrioles zifasha gutunganya microtubules mu gihe cell igabanywamo.",

            teacher:
                "Centrioles form part of the centrosome and help organize microtubules, especially during cell division."

        }
    );


    // --------------------------------------------------------
    // CENTRAL CYLINDER
    // --------------------------------------------------------

    const body =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.10,
                0.10,
                0.72,
                18
            ),

            standardMaterial(
                0x6376cc,
                {
                    roughness: 0.32
                }
            )

        );


    group.add(
        body
    );


    // --------------------------------------------------------
    // MICROTUBULE RINGS
    // --------------------------------------------------------

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const ring =
            new THREE.Mesh(

                new THREE.TorusGeometry(
                    0.115,
                    0.018,
                    6,
                    12
                ),

                standardMaterial(
                    0x9da9ff,
                    {
                        roughness: 0.35
                    }
                )

            );


        ring.rotation.x =
            Math.PI / 2;


        ring.position.y =
            -0.22 +
            i * 0.22;


        group.add(
            ring
        );

    }


    group.position.set(
        x,
        y,
        z
    );


    return group;

}


// ============================================================
// VESICLE
// ============================================================

export function createVesicle(
    x = 0,
    y = 0,
    z = 0
) {

    const mesh =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.14,
                20,
                16
            ),

            physicalMaterial(
                0xe4c85a,
                {
                    roughness: 0.22,
                    transparent: true,
                    opacity: 0.88
                }
            )

        );


    mesh.position.set(
        x,
        y,
        z
    );


    mesh.name =
        "Vesicle";


    setOrganelleData(
        mesh,
        {

            name:
                "Vesicle",

            nameRw:
                "Vesicle",

            description:
                "Vesicles transport materials between cellular compartments or to the cell surface.",

            descriptionRw:
                "Vesicles zitwara ibikoresho hagati y'ibice bya cell cyangwa bikabijyana ku buso bwa cell.",

            teacher:
                "Vesicles are small membrane-bound sacs that transport proteins, lipids and other materials within or outside the cell."

        }
    );


    return mesh;

}