import * as THREE from "three";
import { SHELL_RADII } from "./Shells.js";

const electronGeometry = new THREE.SphereGeometry(0.08, 32, 32);

const electronMaterial = new THREE.MeshStandardMaterial({
    color: 0x00bfff,
    emissive: 0x0066ff,
    emissiveIntensity: 1.2,
    metalness: 0.4,
    roughness: 0.2
});

export function createElectrons(group, element) {

    const electrons = [];

    element.shells.forEach((electronCount, shellIndex) => {

        const radius = SHELL_RADII[shellIndex];

        for (let i = 0; i < electronCount; i++) {

            const electron = new THREE.Mesh(
                electronGeometry,
                electronMaterial
            );

            // Angle around the shell
            const angle =
                (i / electronCount) * Math.PI * 2;

            // Give each shell a slightly different tilt
            const tilt =
                shellIndex * 0.35;

            electron.position.set(
                Math.cos(angle) * radius,
                Math.sin(tilt) * radius * 0.15,
                Math.sin(angle) * radius
            );

            group.add(electron);

            electrons.push({

                mesh: electron,

                radius: radius,

                angle: angle,

                tilt: tilt,

                speed:
                    0.01 +
                    shellIndex * 0.003

            });

        }

    });

    group.userData.electrons = electrons;

}

export function animateElectrons(group) {

    if (!group) return;

    const electrons =
        group.userData.electrons;

    if (!electrons) return;

    electrons.forEach(electron => {

        electron.angle += electron.speed;

        electron.mesh.position.x =
            Math.cos(electron.angle) *
            electron.radius;

        electron.mesh.position.z =
            Math.sin(electron.angle) *
            electron.radius;

        electron.mesh.position.y =
            Math.sin(
                electron.angle +
                electron.tilt
            ) * 0.12;

    });

}