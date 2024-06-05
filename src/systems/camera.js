// src/systems/toggleCamera.js
import * as THREE from 'three';
export function createPerspective(width, height) {
    const perspectiveCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    perspectiveCamera.position.z = 10;
    perspectiveCamera.position.y = 2;
    perspectiveCamera.position.x = 10;
    perspectiveCamera.rotateY(45);
    return perspectiveCamera;
}

export function createOrtho(width, height) {
    const aspect = width / height;
    const frustumSize = 20;
    const orthoCamera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2, frustumSize * aspect / 2,
        frustumSize / 2, frustumSize / -2,
        0.1, 1000
    );
    orthoCamera.position.z = 10;
    return orthoCamera;
}
