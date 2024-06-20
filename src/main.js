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

let isAnimate = false;
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

// Sphere
const points = [new THREE.Vector3(1, 1, 1), new THREE.Vector3(2, 2, 1)];
const spheres = [];
points.forEach((point) => {
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(point.x, point.y, point.z);
    scene.add(sphere);
    spheres.push(sphere);
});

// Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// Mouse Inputs
function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

let isDragging = false;

window.addEventListener('pointermove', onPointerMove);

window.addEventListener('mousedown', (event) => {
    raycaster.setFromCamera(pointer, camera.current);
    const intersects = raycaster.intersectObjects(spheres);
    if (intersects.length > 0) {
        isDragging = true;
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

window.addEventListener('mousemove', (event) => {
    if (isDragging && camera.current == camera.ortho) {
        raycaster.setFromCamera(pointer, camera.current);
        const intersects = raycaster.intersectObjects(spheres);
        if (intersects.length > 0) {
            const intersect = intersects[0];
            console.log(intersect)
            // Calculate the new position in screen space
            const newPoint = new THREE.Vector3(pointer.x, pointer.y, intersect.point.z);
            newPoint.unproject(camera.current);
            intersect.object.position.x = newPoint.x;
            intersect.object.position.y = newPoint.y;
        }
    }
});

const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);

let t = slider.value;
let sphereLabel = document.getElementById('sphere-label');

function animate() {
    if (isAnimate) {
        t += 0.005;
        if (t > 1) t = 0;
        slider.value = t;
    }
    controls.update();
    renderer.render(scene, camera.current);
    requestAnimationFrame(animate);
}

animate();
