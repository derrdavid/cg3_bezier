import * as THREE from 'three';
        import { deCasteljau } from './bezier';
        import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

        const scene = new THREE.Scene();
        const canvas = document.getElementById('canvas-container');
        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Perspektivische Kamera für 3D-Ansicht
        const perspectiveCamera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        perspectiveCamera.position.z = 10;
        perspectiveCamera.position.y = 2;
        perspectiveCamera.position.x = 10;
        perspectiveCamera.rotateY(45);

        // Orthographische Kamera für 2D-Ansicht
        const aspect = width / height;
        const frustumSize = 20;
        const orthoCamera = new THREE.OrthographicCamera(
            frustumSize * aspect / -2, frustumSize * aspect / 2,
            frustumSize / 2, frustumSize / -2,
            0.1, 1000
        );
        orthoCamera.position.z = 10;

        // Standardkamera auf die perspektivische setzen
        let currentCamera = perspectiveCamera;

        const inputFields = ['p0', 'p1', 'p2', 'p3'].map(id => document.getElementById(id));
        let points = [];
        const getPoints = () => {
            points = [];
            inputFields.forEach((field) => {
                const values = field.value.split(',').map(Number);
                if (values.length === 3) {
                    const point = new THREE.Vector3(values[0], values[1], values[2]);
                    points.push(point);
                } else {
                    console.error('Each input field must have exactly three values separated by commas.');
                }
            });
        }
        getPoints();

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(width, height);
        canvas.appendChild(renderer.domElement);

        // OrbitControls hinzufügen (nur für Perspektivkamera)
        const controls = new OrbitControls(perspectiveCamera, renderer.domElement);
        controls.enableDamping = true; // Damping (Verzögerung) aktivieren
        controls.dampingFactor = 0.25; // Damping-Faktor einstellen
        controls.screenSpacePanning = false; // Nur horizontales und vertikales Schwenken erlauben
        controls.maxPolarAngle = Math.PI / 2; // Beschränke die maximale vertikale Drehung

        const axesHelper = new THREE.AxesHelper(500);
        scene.add(axesHelper);

        let bezier_points = [];
        let t = 0;
        let line = null;

        function drawBezier() {
            if (t <= 1) {
                t += 0.001;
                bezier_points.push(deCasteljau(points, t));

                if (line) {
                    scene.remove(line);
                }

                const line_geometry = new THREE.BufferGeometry().setFromPoints(bezier_points);
                const line_material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 5 });
                line = new THREE.Line(line_geometry, line_material);
                scene.add(line);
            } else {
                // Reset
                t = 0;
                bezier_points = [];
                if (line) {
                    scene.remove(line);
                    line = null;
                }
            }

            controls.update();

            renderer.render(scene, currentCamera);
            requestAnimationFrame(drawBezier);
        }

        const controlPoints = [];

        // Funktion zum Aktualisieren der Kontrollpunkte
        function updateControlPoints() {
            // Entferne bestehende Kontrollpunkte aus der Szene
            controlPoints.forEach((sphere) => {
                scene.remove(sphere);
            });
            
            // Leere das Kontrollpunkte-Array
            controlPoints.length = 0;

            // Erstelle und füge neue Kontrollpunkte hinzu
            points.forEach((point) => {
                const geometry = new THREE.SphereGeometry(0.1);
                const material = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.copy(point);
                controlPoints.push(sphere);
                scene.add(sphere);
            });

            // Renderer-Szene aktualisieren
            renderer.render(scene, currentCamera);
        }

        // Starte die Animation
        drawBezier();
        updateControlPoints();

        const updateCurve = document.getElementById('update-curve');
        updateCurve.addEventListener('click', () => {
              // Reset
              t = 0;
              bezier_points = [];
              if (line) {
                  scene.remove(line);
                  line = null;
              }
              
            getPoints();
            updateControlPoints();
        });

        // Umschalt-Button
        document.getElementById('switchButton').addEventListener('click', () => {
            if (currentCamera === perspectiveCamera) {
                currentCamera = orthoCamera;
                document.getElementById('switchButton').innerText = 'Switch to 3D';
            } else {
                currentCamera = perspectiveCamera;
                document.getElementById('switchButton').innerText = 'Switch to 2D';
            }
            // Renderer-Szene mit neuer Kamera aktualisieren
            renderer.render(scene, currentCamera);
        });
