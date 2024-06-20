import * as THREE from 'three';
import { BezierCurve } from './utils/bezier';
import ToggleCamera from './systems/camera';
import { setupRenderer } from './systems/renderer';
import { setupControls, SphereManager } from './systems/controls';

const scene = new THREE.Scene();
const canvas = document.getElementById('canvas-container');
const { width, height } = canvas.getBoundingClientRect();
const camera = new ToggleCamera(width, height);
const renderer = setupRenderer(width, height);
const controls = setupControls(camera.current, renderer.domElement);

const inputFields = ['p0', 'p1', 'p2', 'p3'].map(id => document.getElementById(id));
const slider = document.getElementById('t-slider');
const updateButton = document.getElementById('update-curve');
const toggleButton = document.getElementById('switchButton');
const animateButton = document.getElementById('animate-button');

let isAnimate = false;

const sphereManager = new SphereManager(scene, camera, inputFields);

updateButton.addEventListener('click', () => {
    sphereManager.updateControlPoints();
    console.log(sphereManager.controlPoints);
    //bezierCurve.controlPoints = control_points;
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

const bezierCurve = new BezierCurve(sphereManager.controlPoints, scene);
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

let t = slider.value;

function animate() {
    if (isAnimate) {
        t += 0.005 / 2;
        if (t > 1) t = 0;
        slider.value = t;
    }
    controls.update();
    renderer.render(scene, camera.current);
    console.log(slider.value)
    bezierCurve.update(slider.value);
    requestAnimationFrame(animate);
}

animate();
