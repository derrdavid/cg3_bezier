import * as THREE from 'three';
import ToggleCamera from './systems/camera';
import { setupRenderer } from './systems/renderer';
import { setupControls } from './systems/controls';
import { ClothGeometry } from './utilsCloth/clothGeometry';

const scene = new THREE.Scene();
const canvas = document.getElementById('canvas-container');

const fpsLabel = document.getElementById("fpsLabel");

const strechhSlider = document.getElementById("strech-slider");
const shearSlider = document.getElementById("shear-slider");
const bendSlider = document.getElementById("bend-slider");

const restingLengthSlider = document.getElementById("restinLengt-slider");
const stepLengthSlider = document.getElementById("stepLength-slider");
const massSlider = document.getElementById("mass-slider");

const { width, height } = canvas.getBoundingClientRect();
const camera = new ToggleCamera(width, height);
const renderer = setupRenderer(canvas, width, height);
const controls = setupControls(camera.current, renderer.domElement);

const cloth = new ClothGeometry(scene);

let strech = 50;
let shear = 50;
let bend = 50;

let restingLength = 0.4;
let stepLength = 0.003;
let mass = 0.01;

camera.toggle();
renderer.render( scene, camera.current );


function animate() {
    let time = Date.now();

    //--contolls--
    if(strech != strechhSlider.value){
        //cloth.setNewStrech(strechhSlider.value);
        strech = strechhSlider.value;
    }
    if(strech != strechhSlider.value){
        //cloth.setNewStrech(strechhSlider.value);
        strech = strechhSlider.value;
    }
    if(strech != strechhSlider.value){
        //cloth.setNewStrech(strechhSlider.value);
        strech = strechhSlider.value;
    }

    if(restingLength != restingLengthSlider.value){
        cloth.setNewRestingLength(restingLengthSlider.value);
        restingLength = restingLengthSlider.value;
    }
    if(stepLength != stepLengthSlider.value){
        cloth.setNewStepLenght(stepLengthSlider.value);
        stepLength = stepLengthSlider.value;
    }
    if(mass != massSlider.value){
        cloth.setNewMass(massSlider.value);
        mass = massSlider.value;
    }
    //--controlls--
    controls.update();
    cloth.update();

    renderer.render(scene, camera.current);

    time = Date.now() - time;
    fpsLabel.innerHTML = "fps: " + Math.round(1000 / time);
    
    requestAnimationFrame(animate);
}
animate();
