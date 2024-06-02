import * as THREE from 'three';
import { calculateCubicBezierPoint, deCasteljau } from './bezier';

const scene = new THREE.Scene();
const canvas = document.getElementById('canvas-container');
const rect = canvas.getBoundingClientRect();
const width = window.innerWidth;
const height = window.innerHeight;


const inputFields = ['p0', 'p1', 'p2', 'p3'].map(id => document.getElementById(id));
const updateButton = document.getElementById('update-curve');

// Koordinatenbereich für die Kamera
const cameraWidth = 20;
const cameraHeight = 20;

const camera = new THREE.OrthographicCamera(
    cameraWidth / - 2, 
    cameraWidth / 2, 
    cameraHeight / 2, 
    cameraHeight / - 2, 
    1, 
    1000
);

camera.position.z = 10;
camera.position.x = 5;
camera.position.y = 5;

// Setup Geometry
//
const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(2, 5, 1),
    new THREE.Vector3(6, 5, 1),
    new THREE.Vector3(8, 0, 1),
];

// Control Points
const controlPoints = points.map(point => {
    const geometry = new THREE.SphereGeometry(0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(point);
    return sphere;
});

// Bezier-Curve
const curvePoints = [];
for (let t = 0; t <= 1; t += 0.1) {
    curvePoints.push(deCasteljau(points, t));
}

const line_geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
const line_material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 5 });
const line_line = new THREE.Line(line_geometry, line_material);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor( 0x000000 );
renderer.setSize(width, height);
canvas.appendChild(renderer.domElement);


const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);
controlPoints.forEach(point => {
    scene.add(point);
});
scene.add(line_line);

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
