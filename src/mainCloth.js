import * as THREE from 'three';
import ToggleCamera from './systems/camera';
import { setupRenderer } from './systems/renderer';
import { setupControls } from './systems/controls';
import { ClothGeometry } from './utilsCloth/clothGeometry';

const scene = new THREE.Scene();
const canvas = document.getElementById('canvas-container');
const fpsLabel = document.getElementById("fpsLabel");
const { width, height } = canvas.getBoundingClientRect();
const camera = new ToggleCamera(width, height);
const renderer = setupRenderer(width, height);
const controls = setupControls(camera.current, renderer.domElement);

const cloth = new ClothGeometry(scene);

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
