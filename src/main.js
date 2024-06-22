import * as THREE from 'three';
import { BezierCurve } from './utils/bezier';
import ToggleCamera from './systems/camera';
import { setupRenderer } from './systems/renderer';
import { setupControls, ControlPointsManager } from './systems/controls';
import { BernsteinPolinom } from './utils/bernsteinPolinom';

const scene = new THREE.Scene();
const graphScene = new THREE.Scene();
const canvas = document.getElementById('canvas-container');
const graphCanvas = document.getElementById("graphCanvas");
graphCanvas.style.display = "none";
const { width, height } = canvas.getBoundingClientRect();

const camera = new ToggleCamera(width, height);
const graphCamera = new THREE.OrthographicCamera(-0.55, 0.55, 0.55, -0.55, 1, 1000);
graphCamera.position.set(0.5, 0.5, 10);
graphCamera.lookAt(0.5, 0.5, 0);

const renderer = setupRenderer(canvas, width, height);
const graphRenderer = setupRenderer(graphCanvas, 200, 200);
const controls = setupControls(camera.current, renderer.domElement);

// HTML-ELEMENTS
const inputFields = ['p0', 'p1', 'p2', 'p3'].map(id => document.getElementById(id));
const slider = document.getElementById('t-slider');
const updateButton = document.getElementById('update-curve');
const toggleButton = document.getElementById('switchButton');
const animateButton = document.getElementById('animate-button');
const bernsteinButton = document.getElementById('BernsteinButton');
const showaxis_checkbox = document.getElementById('show-axis');

const sphereManager = new ControlPointsManager(canvas, scene, camera, inputFields);
sphereManager.createSpheres();
const bezierCurve = new BezierCurve(sphereManager.controlPoints, scene);
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

const bernsteinPolinom = new BernsteinPolinom(graphScene);

let isAnimate = false;
let bernsteinModus = false;
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
    bernsteinPolinom.update(slider.value);
    renderer.render(scene, camera.current);
    if(bernsteinModus){
        graphCanvas.visible = false; 
        graphRenderer.render(graphScene, graphCamera);
    }
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
bernsteinButton.addEventListener('click', () => {
    bernsteinModus = !bernsteinModus;
    bernsteinButton.innerHTML = bernsteinModus ? 'de-Casteljau' : 'Bernstein-Polynome';
    graphCanvas.style.display = bernsteinModus ? "block" : "none";
    bezierCurve.switchLineMode(bernsteinModus);
});

inputFields.forEach((field, index) => {
    field.addEventListener('change', () => {
        sphereManager.updateControlPoints();
    });
});

showaxis_checkbox.addEventListener('change', () => {
    axesHelper.visible = showaxis_checkbox.checked;
});