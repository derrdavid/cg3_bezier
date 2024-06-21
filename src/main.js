import * as THREE from 'three';
import { BezierCurve } from './utils/bezier';
import ToggleCamera from './systems/camera';
import { setupRenderer } from './systems/renderer';
import { setupControls, ControlPointsManager } from './systems/controls';

const scene = new THREE.Scene();
const canvas = document.getElementById('canvas-container');
const { width, height } = canvas.getBoundingClientRect();

const camera = new ToggleCamera(width, height);
const renderer = setupRenderer(canvas, width, height);
const controls = setupControls(camera.current, renderer.domElement);

// HTML-ELEMENTS
const inputFields = ['p0', 'p1', 'p2', 'p3'].map(id => document.getElementById(id));
const slider = document.getElementById('t-slider');
const updateButton = document.getElementById('update-curve');
const toggleButton = document.getElementById('switchButton');
const animateButton = document.getElementById('animate-button');

const sphereManager = new ControlPointsManager(scene, camera, inputFields);
const bezierCurve = new BezierCurve(sphereManager.controlPoints, scene);
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

let isAnimate = false;
let t = slider.value;
const step = 0.005;

function animate() {
    if (isAnimate) {
        t += step;
        if (t > 1) t = 0;
        slider.value = t;
    }
    controls.update();
    bezierCurve.update(slider.value);
    renderer.render(scene, camera.current);
    requestAnimationFrame(animate);
}

animate();



// EVENT LISTENERS
updateButton.addEventListener('click', () => {
    sphereManager.updateControlPoints();
});

toggleButton.addEventListener('click', () => {
    camera.toggle();
    toggleButton.innerHTML = camera.current === camera.perspective ? 'Switch to 2D' : 'Switch to 3D';
    renderer.render(scene, camera.current);
});

animateButton.addEventListener('click', () => {
    animateButton.innerHTML = isAnimate ? 'Start Animation' : 'Stop Animation';
    isAnimate = !isAnimate;
});

inputFields.forEach((field, index) => {
    field.addEventListener('change', () => {
        sphereManager.updateControlPoints();
    });
});
