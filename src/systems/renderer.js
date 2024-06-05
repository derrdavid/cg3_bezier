import * as THREE from 'three';

export function setupRenderer(width, height) {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(width, height);
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    return renderer;
}