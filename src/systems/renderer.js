import * as THREE from 'three';

export function setupRenderer(canvas, width, height) {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(new THREE.Color('#0c0f0a'), 1);
    renderer.setSize(width, height);
    canvas.appendChild(renderer.domElement);
    return renderer;
}