import * as THREE from "three";

// ============================================================
// SciLab Molecule Builder
// Geometry.js
// Geometry + bond angle labels
// ============================================================


// ============================================================
// Geometry descriptions
// ============================================================

export const GEOMETRIES = {

    Linear: {
        name: "Linear",
        angle: 180,
        description:
            "Atoms are arranged in a straight line."
    },

    Bent: {
        name: "Bent",
        angle: 104.5,
        description:
            "The central atom has a bent molecular shape."
    },

    "Trigonal Planar": {
        name: "Trigonal Planar",
        angle: 120,
        description:
            "Three regions of electron density lie in one plane."
    },

    Tetrahedral: {
        name: "Tetrahedral",
        angle: 109.5,
        description:
            "Four electron regions point toward the corners of a tetrahedron."
    },

    "Trigonal Pyramidal": {
        name: "Trigonal Pyramidal",
        angle: 107,
        description:
            "Three bonds and one lone pair surround the central atom."
    }

};


// ============================================================
// Get geometry information
// ============================================================

export function getGeometryInfo(name) {

    return (
        GEOMETRIES[name] ||
        {
            name: name || "Unknown",
            angle: null,
            description: "Geometry information unavailable."
        }
    );

}


// ============================================================
// Create text sprite
// ============================================================

function createTextSprite(
    text,
    color = "#ffffff"
) {

    const canvas =
        document.createElement("canvas");

    const context =
        canvas.getContext("2d");


    canvas.width = 512;
    canvas.height = 256;


    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    context.font =
        "bold 64px Arial";

    context.textAlign =
        "center";

    context.textBaseline =
        "middle";


    context.lineWidth = 12;

    context.strokeStyle =
        "rgba(0,0,0,0.85)";

    context.fillStyle =
        color;


    context.strokeText(
        text,
        256,
        128
    );

    context.fillText(
        text,
        256,
        128
    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    texture.needsUpdate = true;


    const material =
        new THREE.SpriteMaterial({

            map: texture,

            transparent: true,

            depthTest: false

        });


    const sprite =
        new THREE.Sprite(
            material
        );


    sprite.scale.set(
        1.4,
        0.7,
        1
    );


    return sprite;
}


// ============================================================
// Create bond-angle label
// ============================================================

export function createBondAngleLabel(
    group,
    center,
    angle,
    direction = new THREE.Vector3(0, 1, 0)
) {

    if (
        angle === undefined ||
        angle === null
    ) {

        return null;

    }


    const label =
        createTextSprite(
            `${angle}°`,
            "#00ffff"
        );


    const position =
        center.clone()
            .add(
                direction
                    .clone()
                    .normalize()
                    .multiplyScalar(0.9)
            );


    label.position.copy(
        position
    );


    group.add(label);


    return label;
}


// ============================================================
// Create angle arc
// ============================================================

export function createAngleArc(
    group,
    center,
    directionA,
    directionB,
    radius = 0.45
) {

    const a =
        directionA.clone()
            .normalize();

    const b =
        directionB.clone()
            .normalize();


    const angle =
        a.angleTo(b);


    const segments = 32;


    const points = [];


    // Find rotation axis

    let axis =
        new THREE.Vector3()
            .crossVectors(a, b);


    if (axis.lengthSq() < 0.0001) {

        return null;

    }


    axis.normalize();


    const quaternion =
        new THREE.Quaternion();


    for (
        let i = 0;
        i <= segments;
        i++
    ) {

        const t =
            i / segments;


        const current =
            a.clone();


        quaternion.setFromAxisAngle(
            axis,
            angle * t
        );


        current.applyQuaternion(
            quaternion
        );


        current.multiplyScalar(
            radius
        );


        current.add(
            center
        );


        points.push(
            current
        );

    }


    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                points
            );


    const material =
        new THREE.LineBasicMaterial({

            color: 0x00ffff,

            transparent: true,

            opacity: 0.85

        });


    const line =
        new THREE.Line(
            geometry,
            material
        );


    group.add(line);


    return line;
}


// ============================================================
// Create geometry visualization
// ============================================================

export function createGeometryVisual(
    group,
    molecule
) {

    if (!molecule) {

        return null;

    }


    const geometryName =
        molecule.molecularGeometry;


    const info =
        getGeometryInfo(
            geometryName
        );


    const centerAtom =
        molecule.atoms[0];


    if (!centerAtom) {

        return null;

    }


    const center =
        new THREE.Vector3(

            centerAtom.x || 0,

            centerAtom.y || 0,

            centerAtom.z || 0

        );


    const geometryGroup =
        new THREE.Group();


    geometryGroup.name =
        "GeometryVisualization";


    group.add(
        geometryGroup
    );


    // --------------------------------------------------------
    // Geometry label
    // --------------------------------------------------------

    const geometryLabel =
        createTextSprite(
            info.name,
            "#ffd84d"
        );


    geometryLabel.position.set(

        center.x,

        center.y + 1.5,

        center.z

    );


    geometryGroup.add(
        geometryLabel
    );


    // --------------------------------------------------------
    // Bond angle
    // --------------------------------------------------------

    if (
        molecule.bondAngles &&
        molecule.bondAngles.length > 0
    ) {

        const angleData =
            molecule.bondAngles[0];


        const atoms =
            angleData.atoms;


        if (
            atoms &&
            atoms.length === 3
        ) {

            const atomA =
                molecule.atoms[
                    atoms[0]
                ];

            const atomB =
                molecule.atoms[
                    atoms[1]
                ];

            const atomC =
                molecule.atoms[
                    atoms[2]
                ];


            if (
                atomA &&
                atomB &&
                atomC
            ) {

                const centerPoint =
                    new THREE.Vector3(

                        atomB.x || 0,

                        atomB.y || 0,

                        atomB.z || 0

                    );


                const directionA =
                    new THREE.Vector3(

                        (atomA.x || 0) -
                        (atomB.x || 0),

                        (atomA.y || 0) -
                        (atomB.y || 0),

                        (atomA.z || 0) -
                        (atomB.z || 0)

                    );


                const directionB =
                    new THREE.Vector3(

                        (atomC.x || 0) -
                        (atomB.x || 0),

                        (atomC.y || 0) -
                        (atomB.y || 0),

                        (atomC.z || 0) -
                        (atomB.z || 0)

                    );


                createAngleArc(

                    geometryGroup,

                    centerPoint,

                    directionA,

                    directionB,

                    0.55

                );


                const labelDirection =
                    directionA
                        .clone()
                        .normalize()
                        .add(
                            directionB
                                .clone()
                                .normalize()
                        );


                if (
                    labelDirection.lengthSq() < 0.001
                ) {

                    labelDirection.set(
                        0,
                        1,
                        0
                    );

                }


                createBondAngleLabel(

                    geometryGroup,

                    centerPoint,

                    angleData.angle,

                    labelDirection

                );

            }

        }

    }


    return geometryGroup;
}


// ============================================================
// Remove geometry visualization
// ============================================================

export function clearGeometryVisual(
    group
) {

    const visual =
        group.getObjectByName(
            "GeometryVisualization"
        );


    if (!visual) {

        return;

    }


    group.remove(
        visual
    );


    visual.traverse(
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
                    object.material.map
                ) {

                    object.material.map.dispose();

                }

                object.material.dispose();

            }

        }
    );

}