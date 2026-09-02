import * as THREE from "three";

export function addLights(scene) {

    const ambient = new THREE.AmbientLight(0xffffff, 1);

    scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 2);

    directional.position.set(5, 10, 5);

    scene.add(directional);

}