import * as THREE from "three";

// ============================================================
// SciLab Molecule Builder
// LonePairs.js
// ============================================================

const ELECTRON_COLOR = 0x00ffff;


// ============================================================
// Create one electron
// ============================================================

function createElectron() {

    const geometry =
        new THREE.SphereGeometry(
            0.075,
            20,
            20
        );

    const material =
        new THREE.MeshStandardMaterial({

            color: ELECTRON_COLOR,

            emissive: ELECTRON_COLOR,

            emissiveIntensity: 1.8,

            metalness: 0.1,

            roughness: 0.2

        });

    const electron =
        new THREE.Mesh(
            geometry,
            material
        );

    electron.castShadow = true;

    return electron;
}


// ============================================================
// Create one lone pair
// ============================================================

function createLonePair(
    atomPosition,
    direction,
    distance = 0.58
) {

    const group =
        new THREE.Group();

    const dir =
        direction.clone()
            .normalize();


    // Position of the pair

    const center =
        atomPosition.clone()
            .add(
                dir.clone()
                    .multiplyScalar(distance)
            );


    // Make two electrons perpendicular
    // to the direction of the pair.

    let side =
        new THREE.Vector3(0, 1, 0);


    if (
        Math.abs(
            dir.dot(side)
        ) > 0.9
    ) {

        side.set(1, 0, 0);

    }


    side =
        new THREE.Vector3()
            .crossVectors(
                dir,
                side
            )
            .normalize()
            .multiplyScalar(0.09);


    const electron1 =
        createElectron();

    const electron2 =
        createElectron();


    electron1.position
        .copy(center)
        .add(side);


    electron2.position
        .copy(center)
        .sub(side);


    group.add(
        electron1
    );

    group.add(
        electron2
    );


    group.userData = {

        type: "lonePair",

        atomPosition:
            atomPosition.clone(),

        direction:
            dir.clone()

    };


    return group;
}


// ============================================================
// Generate directions around an atom
// ============================================================

function getDirections(count) {

    const directions = [];


    // Common VSEPR directions

    const presets = [

        new THREE.Vector3(0, 1, 0),

        new THREE.Vector3(0, -1, 0),

        new THREE.Vector3(1, 0, 0),

        new THREE.Vector3(-1, 0, 0),

        new THREE.Vector3(0, 0, 1),

        new THREE.Vector3(0, 0, -1)

    ];


    for (
        let i = 0;
        i < count;
        i++
    ) {

        directions.push(
            presets[
                i % presets.length
            ].clone()
        );

    }


    return directions;
}


// ============================================================
// Create lone pairs for molecule
// ============================================================

export function createLonePairs(
    group,
    molecule
) {

    if (
        !molecule ||
        !molecule.lonePairs
    ) {

        return null;

    }


    const lonePairGroup =
        new THREE.Group();

    lonePairGroup.name =
        "LonePairs";


    molecule.lonePairs.forEach(
        pairData => {

            const atom =
                molecule.atoms[
                    pairData.atom
                ];


            if (!atom) {

                return;

            }


            const atomPosition =
                new THREE.Vector3(

                    atom.x || 0,

                    atom.y || 0,

                    atom.z || 0

                );


            const pairCount =
                pairData.pairs || 0;


            if (
                pairCount <= 0
            ) {

                return;

            }


            const directions =
                getDirections(
                    pairCount
                );


            for (
                let i = 0;
                i < pairCount;
                i++
            ) {

                const pair =
                    createLonePair(

                        atomPosition,

                        directions[i],

                        0.58

                    );


                pair.userData.atomIndex =
                    pairData.atom;


                pair.userData.pairIndex =
                    i;


                lonePairGroup.add(
                    pair
                );

            }

        }
    );


    group.add(
        lonePairGroup
    );


    return lonePairGroup;
}


// ============================================================
// Remove lone pairs
// ============================================================

export function clearLonePairs(
    group
) {

    const lonePairs =
        group.getObjectByName(
            "LonePairs"
        );


    if (!lonePairs) {

        return;

    }


    lonePairs.traverse(
        object => {

            if (
                object.geometry
            ) {

                object.geometry.dispose();

            }


            if (
                object.material
            ) {

                object.material.dispose();

            }

        }
    );


    group.remove(
        lonePairs
    );

}