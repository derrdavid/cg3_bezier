import * as THREE from 'three';
import ToggleCamera from './systems/camera';
import { setupRenderer } from './systems/renderer';
import { ControlPointsManager, setupControls } from './systems/controls';
import { ClothGeometry } from './utilsCloth/clothGeometry';

const scene = new THREE.Scene();
const canvas = document.getElementById('canvas-container');
const fpsLabel = document.getElementById("fpsLabel");
const { width, height } = canvas.getBoundingClientRect();
const camera = new ToggleCamera(width, height);
const renderer = setupRenderer(canvas, width, height);
const controls = setupControls(camera.current, renderer.domElement);

const cloth = new ClothGeometry(scene);
const pins = cloth.meshPoints.filter((point) => point.isPin === true).map((point) => point.position);
const controlPointsManager = new ControlPointsManager(canvas, scene, camera, null, cloth.meshPoints);
controlPointsManager.controlPoints = pins;
controlPointsManager.createSpheres();

camera.toggle();
renderer.render( scene, camera.current );

function animate() {
    let time = Date.now();

    controls.update();
    cloth.update();
    renderer.render(scene, camera.current);

    time = Date.now() - time;
    fpsLabel.innerHTML = "fps: " + Math.round(1000 / time);
    
    requestAnimationFrame(animate);
}
animate();
