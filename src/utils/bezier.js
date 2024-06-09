import * as THREE from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';

export default class BezierCurve {
    constructor(points, scene) {
        this.control_points = points;
        this.scene = scene;

        this.curve_points = [];
        this.support_lines = [];

        this.line_material = new MeshLineMaterial({ color: 0xFFFFFF, lineWidth: 0.1 });
        this.meshline = new MeshLine();
        this.line = new THREE.Mesh(this.meshline, this.line_material);

        this.support_line_material = new MeshLineMaterial({ color: 0x00FFF0, lineWidth: 0.02 });
        this.support_line_meshes = [];

        this.update(0);
        this.scene.add(this.line);
    }

    update(t) {
        this.curve_points = [];
        
        for (let i = 0; i <= t; i += 0.01) {
            this.support_lines = [];
            this.curve_points.push(this.deCasteljau(this.control_points, i));
        }
                
        const line_geometry = new THREE.BufferGeometry().setFromPoints(this.curve_points);
        this.meshline.setGeometry(line_geometry);
        this.updateSupportLines();
    }

    deCasteljau(points, t) {
        this.support_lines.push(points);

        if (points.length === 1) {
            return points[0];
        }

        const newPoints = [];
        for (let i = 0; i < points.length - 1; i++) {
            const interpolatedPoint = new THREE.Vector3(
                (1 - t) * points[i].x + t * points[i + 1].x,
                (1 - t) * points[i].y + t * points[i + 1].y,
                (1 - t) * points[i].z + t * points[i + 1].z
            );
            newPoints.push(interpolatedPoint);
        }

        return this.deCasteljau(newPoints, t);
    }

    updateSupportLines() {
        this.clearSupportLines();

        this.support_lines.forEach((support_points) => {
            const supportLineGeometry = new THREE.BufferGeometry().setFromPoints(support_points);
            const supportLine = new MeshLine();
            supportLine.setGeometry(supportLineGeometry);
            const supportLineMesh = new THREE.Mesh(supportLine, this.support_line_material);
            this.support_line_meshes.push(supportLineMesh);
            this.scene.add(supportLineMesh);
        });
    }

    clearSupportLines() {
        this.support_line_meshes.forEach(line => {
            this.scene.remove(line);
            line.geometry.dispose();
            line.material.dispose();
        });
        this.support_line_meshes = [];
    }
}
