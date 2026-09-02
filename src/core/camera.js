import * as THREE from "three";

export function createCamera(container) {

    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    camera.position.set(0, 2, 6);

    return camera;
}