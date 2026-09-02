import * as THREE from "three";

export function createNucleus(group, element) {

    const protonGeometry = new THREE.SphereGeometry(0.18, 32, 32);

    const neutronGeometry = new THREE.SphereGeometry(0.18, 32, 32);

    const protonMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3333,
        emissive: 0x440000,
        metalness: 0.3,
        roughness: 0.4
    });

    const neutronMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x333333,
        metalness: 0.2,
        roughness: 0.5
    });

    const radius = 0.45;

    // Create Protons

    for (let i = 0; i < element.protons; i++) {

        const proton = new THREE.Mesh(
            protonGeometry,
            protonMaterial
        );

        const phi = Math.acos(-1 + (2 * i) / Math.max(element.protons, 1));

        const theta = Math.sqrt(element.protons * Math.PI) * phi;

        proton.position.set(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        );

        group.add(proton);

    }

    // Create Neutrons

    for (let i = 0; i < element.neutrons; i++) {

        const neutron = new THREE.Mesh(
            neutronGeometry,
            neutronMaterial
        );

        const phi = Math.acos(-1 + (2 * i) / Math.max(element.neutrons, 1));

        const theta = Math.sqrt(element.neutrons * Math.PI) * phi;

        neutron.position.set(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        );

        group.add(neutron);

    }

}