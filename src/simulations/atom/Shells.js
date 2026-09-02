import * as THREE from "three";

export const SHELL_RADII = [
    1.2, // K
    2.0, // L
    2.8, // M
    3.6  // N
];

export function createShells(group, element) {

    const shellMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.45
    });

    element.shells.forEach((electronCount, index) => {

        if (electronCount <= 0) return;

        const shell = new THREE.Mesh(

            new THREE.TorusGeometry(
                SHELL_RADII[index],
                0.015,
                16,
                120
            ),

            shellMaterial

        );

        // Orbit ring
        shell.rotation.x = Math.PI / 2;

        group.add(shell);

    });

}