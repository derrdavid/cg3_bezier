import * as THREE from 'three';
import { BezierCurve } from './utils/bezier';
import ToggleCamera from './systems/camera';
import { setupRenderer } from './systems/renderer';
import { setupControls } from './systems/controls';

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

let control_points = [];
const updateControlPoints = () => {
    inputFields.forEach((field, index) => {
        const values = field.value.split(',').map(Number);
        if (values.length === 3) {
            const point = new THREE.Vector3(values[0], values[1], values[2]);
            control_points[index] = point;
        } else {
            console.error('Each input field must have exactly three values separated by commas.');
        }
    });
};

updateButton.addEventListener('click', () => {
    updateControlPoints();
    bezierCurve.controlPoints = control_points;
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

updateControlPoints();
const bezierCurve = new BezierCurve(control_points, scene);
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

let t = slider.value;
let isAnimate = false;
function animate() {
    if (isAnimate) {
        t += 0.005;
        if (t > 1) t = 0;
        slider.value = t;
    }
    bezierCurve.update(slider.value);
    controls.update();
    renderer.render(scene, camera.current);
    requestAnimationFrame(animate);
}
animate();



