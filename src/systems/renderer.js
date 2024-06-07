import * as THREE from 'three';

export function setupRenderer(width, height) {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(new THREE.Color('#0c0f0a'), 1); // Alpha-Wert zwischen 0 und 1
    renderer.setSize(width, height);
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    return renderer;
}