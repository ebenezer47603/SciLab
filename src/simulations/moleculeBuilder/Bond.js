import * as THREE from "three";

// ============================================================
// SciLab Molecule Builder
// Bond.js
// ============================================================

const bondMaterial = new THREE.MeshStandardMaterial({

    color: 0xb8b8b8,

    metalness: 0.35,

    roughness: 0.3

});


// ============================================================
// Create one cylinder between two points
// ============================================================

function createCylinder(
    start,
    end,
    radius = 0.055
) {

    const direction =
        new THREE.Vector3()
            .subVectors(
                end,
                start
            );

    const length =
        direction.length();


    if (length === 0) {

        return null;

    }


    const geometry =
        new THREE.CylinderGeometry(

            radius,
            radius,

            length,

            24

        );


    const cylinder =
        new THREE.Mesh(
            geometry,
            bondMaterial
        );


    const midpoint =
        new THREE.Vector3()
            .addVectors(
                start,
                end
            )
            .multiplyScalar(0.5);


    cylinder.position.copy(
        midpoint
    );


    cylinder.quaternion.setFromUnitVectors(

        new THREE.Vector3(
            0,
            1,
            0
        ),

        direction.normalize()

    );


    cylinder.castShadow = true;

    cylinder.receiveShadow = true;


    return cylinder;

}


// ============================================================
// Calculate perpendicular offset
// This makes double/triple bonds follow the actual bond
// direction instead of always using X-axis.
// ============================================================

function getOffset(
    start,
    end,
    distance
) {

    const direction =
        new THREE.Vector3()
            .subVectors(
                end,
                start
            )
            .normalize();


    let reference =
        new THREE.Vector3(
            0,
            1,
            0
        );


    // Avoid parallel vectors

    if (
        Math.abs(
            direction.dot(reference)
        ) > 0.9
    ) {

        reference.set(
            1,
            0,
            0
        );

    }


    const offset =
        new THREE.Vector3()
            .crossVectors(
                direction,
                reference
            )
            .normalize()
            .multiplyScalar(
                distance
            );


    return offset;

}


// ============================================================
// SINGLE BOND
// ============================================================

export function createSingleBond(
    group,
    start,
    end
) {

    const cylinder =
        createCylinder(
            start,
            end,
            0.055
        );


    if (cylinder) {

        group.add(
            cylinder
        );

    }

}


// ============================================================
// DOUBLE BOND
// ============================================================

export function createDoubleBond(
    group,
    start,
    end
) {

    const offset =
        getOffset(
            start,
            end,
            0.10
        );


    const bond1 =
        createCylinder(

            start.clone().add(offset),

            end.clone().add(offset),

            0.042

        );


    const bond2 =
        createCylinder(

            start.clone().sub(offset),

            end.clone().sub(offset),

            0.042

        );


    if (bond1) {

        group.add(
            bond1
        );

    }


    if (bond2) {

        group.add(
            bond2
        );

    }

}


// ============================================================
// TRIPLE BOND
// ============================================================

export function createTripleBond(
    group,
    start,
    end
) {

    const offset =
        getOffset(
            start,
            end,
            0.12
        );


    // Center bond

    const center =
        createCylinder(

            start,

            end,

            0.035

        );


    // First outer bond

    const bond1 =
        createCylinder(

            start.clone().add(offset),

            end.clone().add(offset),

            0.035

        );


    // Second outer bond

    const bond2 =
        createCylinder(

            start.clone().sub(offset),

            end.clone().sub(offset),

            0.035

        );


    if (center) {

        group.add(
            center
        );

    }


    if (bond1) {

        group.add(
            bond1
        );

    }


    if (bond2) {

        group.add(
            bond2
        );

    }

}


// ============================================================
// GENERAL BOND FUNCTION
// ============================================================

export function createBond(
    group,
    start,
    end,
    type = 1
) {

    if (
        type === 1
    ) {

        createSingleBond(
            group,
            start,
            end
        );

    }

    else if (
        type === 2
    ) {

        createDoubleBond(
            group,
            start,
            end
        );

    }

    else if (
        type === 3
    ) {

        createTripleBond(
            group,
            start,
            end
        );

    }

}