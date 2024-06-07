import * as THREE from 'three';
import BezierCurve from './utils/bezier';
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
let control_points = [];
const getPoints = () => {
    control_points = [];
    inputFields.forEach((field) => {
        const values = field.value.split(',').map(Number);
        if (values.length === 3) {
            const point = new THREE.Vector3(values[0], values[1], values[2]);
            control_points.push(point);
        } else {
            console.error('Each input field must have exactly three values separated by commas.');
        }
    });
}
getPoints();
const slider = document.getElementById('t-slider');

const bezierCurve = new BezierCurve(control_points);
scene.add(bezierCurve.line);

const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

let t = slider.value;
let isAnimate = false;
document.getElementById('animate-button').addEventListener('click', () => {
    isAnimate = !isAnimate;
});
function animate() {
    if (isAnimate) {
        t += 0.01;
        if (t > 1) t = 0;
        slider.value = t;
    }
    bezierCurve.update(slider.value);
    controls.update();
    renderer.render(scene, camera.current);
    requestAnimationFrame(animate);
}
animate();


document.getElementById('update-curve').addEventListener('click', () => {
    //update logic
});

document.getElementById('switchButton').addEventListener('click', () => {
    camera.toggle();
    renderer.render(scene, camera.current);
});
