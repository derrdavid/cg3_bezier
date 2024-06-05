import * as THREE from 'three';
import { deCasteljau } from './utils/bezier';
import { createPerspective, createOrtho } from './systems/camera';
import { setupRenderer } from './systems/renderer';
import { setupControls } from './systems/controls';

// Initialisiere die Variablen
const scene = new THREE.Scene();
const canvas = document.getElementById('canvas-container');
const rect = canvas.getBoundingClientRect();
const width = rect.width;
const height = rect.height;

const perspectiveCamera = createPerspective(width, height);
const orthoCamera = createOrtho(width, height);
let currentCamera = perspectiveCamera;

const renderer = setupRenderer(width, height);
const controls = setupControls(currentCamera, renderer.domElement);

const inputFields = ['p0', 'p1', 'p2', 'p3'].map(id => document.getElementById(id));
let points = [];
const getPoints = () => {
    points = [];
    inputFields.forEach((field) => {
        const values = field.value.split(',').map(Number);
        if (values.length === 3) {
            const point = new THREE.Vector3(values[0], values[1], values[2]);
            points.push(point);
        } else {
            console.error('Each input field must have exactly three values separated by commas.');
        }
    });
}
getPoints();
const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);

let bezier_points = [];
let t = 0;
let line = null;

function drawBezier() {
    if (t <= 1) {
        t += 0.001;
        bezier_points.push(deCasteljau(points, t));

        if (line) {
            scene.remove(line);
        }

        const line_geometry = new THREE.BufferGeometry().setFromPoints(bezier_points);
        const line_material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 5 });
        line = new THREE.Line(line_geometry, line_material);
        scene.add(line);
    } else {
        // Reset
        t = 0;
        bezier_points = [];
        if (line) {
            scene.remove(line);
            line = null;
        }
    }

    controls.update();

    renderer.render(scene, currentCamera);
    requestAnimationFrame(drawBezier);
}

const controlPoints = [];

// Funktion zum Aktualisieren der Kontrollpunkte
function updateControlPoints() {
    // Entferne bestehende Kontrollpunkte aus der Szene
    controlPoints.forEach((sphere) => {
        scene.remove(sphere);
    });

    // Leere das Kontrollpunkte-Array
    controlPoints.length = 0;

    // Erstelle und füge neue Kontrollpunkte hinzu
    points.forEach((point) => {
        const geometry = new THREE.SphereGeometry(0.1);
        const material = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(point);
        controlPoints.push(sphere);
        scene.add(sphere);
    });

    // Renderer-Szene aktualisieren
    renderer.render(scene, currentCamera);
}

// Starte die Animation
drawBezier();
updateControlPoints();

const updateCurve = document.getElementById('update-curve');
updateCurve.addEventListener('click', () => {
    // Reset
    t = 0;
    bezier_points = [];
    if (line) {
        scene.remove(line);
        line = null;
    }

    getPoints();
    updateControlPoints();
});

// Umschalt-Button
document.getElementById('switchButton').addEventListener('click', () => {
    if (currentCamera === perspectiveCamera) {
        currentCamera = orthoCamera;
        document.getElementById('switchButton').innerText = 'Switch to 3D';
    } else {
        currentCamera = perspectiveCamera;
        document.getElementById('switchButton').innerText = 'Switch to 2D';
    }
    // Renderer-Szene mit neuer Kamera aktualisieren
    renderer.render(scene, currentCamera);
});
