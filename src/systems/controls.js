import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';

export function setupControls(camera, domElement) {
    const controls = new OrbitControls(camera, domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    return controls;
}

export class ControlPointsManager {
    constructor(scene, camera, inputFields) {
        this.scene = scene;
        this.camera = camera;
        this.inputFields = inputFields;
        
        this.controlPoints = [];
        this.spheres = [];
        this.boundingSpheres = [];
        this.isDragging = false;
        this.draggedSphereIndex = -1;

        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2();

        this.updateControlPoints();
        this.createSpheres();
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('pointermove', this.onPointerMove.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    };

    updateControlPoints() {
        this.inputFields.forEach((field, index) => {
            const values = field.value.split(',').map(Number);
            if (values.length === 3) {
                const point = new THREE.Vector3(values[0], values[1], values[2]);
                this.controlPoints[index] = point;
                if (this.spheres[index]) {
                    this.spheres[index].position.set(point.x, point.y, point.z);
                    this.boundingSpheres[index].center.set(point.x, point.y, point.z);
                }
            } else {
                console.error('Each input field must have exactly three values separated by commas.');
            }
        });
    }

    createSpheres() {
        this.controlPoints.forEach((point) => {
            const geometry = new THREE.SphereGeometry(0.05, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            const sphere = new THREE.Mesh(geometry, material);

            sphere.position.set(point.x, point.y, point.z);
            this.scene.add(sphere);
            this.spheres.push(sphere);

            const boundingSphere = new THREE.Sphere(point.clone(), 1);
            this.boundingSpheres.push(boundingSphere);
        });
    }

    onPointerMove(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }

    onMouseDown(event) {
        this.raycaster.setFromCamera(this.pointer, this.camera.current);
        const intersects = this.boundingSpheres.filter((sphere) => {
            return this.raycaster.ray.intersectsSphere(sphere);
        });

        if (intersects.length > 0 && this.camera.current == this.camera.ortho) {
            this.isDragging = true;
            this.draggedSphereIndex = this.boundingSpheres.indexOf(intersects[0]);
        }
    }

    onMouseUp() {
        this.isDragging = false;
        this.draggedSphereIndex = -1;
    }

    onMouseMove() {
        if (this.isDragging && this.draggedSphereIndex !== -1) {
            this.raycaster.setFromCamera(this.pointer, this.camera.current);
            const intersects = this.boundingSpheres.filter((sphere) => {
                return this.raycaster.ray.intersectsSphere(sphere);
            });

            if (intersects.length > 0) {
                const sphere = this.spheres[this.draggedSphereIndex];
                const newPoint = new THREE.Vector3(this.pointer.x, this.pointer.y, sphere.position.z);
                newPoint.unproject(this.camera.current);
                newPoint.z = sphere.position.z;
                
                sphere.position.set(newPoint.x, newPoint.y, newPoint.z);
                const { x, y, z } = sphere.position;
                this.controlPoints[this.draggedSphereIndex].set(x, y, z);
                this.inputFields[this.draggedSphereIndex].value = `${x.toFixed(1)},${y.toFixed(1)},${z.toFixed(1)}`;

                this.boundingSpheres[this.draggedSphereIndex].center.set(x, y, z);
            }
        }
    }
}
