import * as THREE from 'three';

export default class ToggleCamera {
    constructor(width, height) {
        this.perspective = this.createPerspective(width, height);
        this.ortho = this.createOrtho(width, height);
        this.current = this.perspective;
    }

    toggle() {
        if (this.current === this.perspective) {
            this.current = this.ortho;
        } else {
            this.current = this.perspective;
        }
    }

    createPerspective(width, height) {
        const perspectiveCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        perspectiveCamera.position.z = 10;
        perspectiveCamera.position.y = 2;
        perspectiveCamera.position.x = 10;
        perspectiveCamera.rotation.y = Math.PI / 4;
        return perspectiveCamera;
    }

    createOrtho(width, height) {
        const aspect = width / height;
        const frustumSize = 10;
        const orthoCamera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2, frustumSize * aspect / 2,
            frustumSize / 2, frustumSize / -2,
            0.1, 1000
        );
        orthoCamera.position.z = 5;
        orthoCamera.lookAt(new THREE.Vector3(0, 0, 0));
        return orthoCamera;
    }
}
