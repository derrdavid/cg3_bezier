import * as THREE from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';

export default class BezierCurve {
    constructor(points) {
        this.control_points = points;
        this.curve_points = [];
        this.line_material = new MeshLineMaterial({ color: 0xFFFFFF, lineWidth: 0.1 });
        this.meshline = new MeshLine();
        this.line = new THREE.Mesh(this.meshline, this.line_material);
        this.update(1);
    }

    update(t) {
        this.curve_points = [];
        for (let i = 0; i <= t; i += 0.01) {
            this.curve_points.push(deCasteljau(this.control_points, i));
        }
        const line_geometry = new THREE.BufferGeometry().setFromPoints(this.curve_points);
        this.meshline.setGeometry(line_geometry);
    }
}

function deCasteljau(points, t) {
    if (points.length === 1) {
        return points[0];
    }

    const newPoints = [];
    for (let i = 0; i < points.length - 1; i++) {
        const interpolatedPoint = new THREE.Vector3(
            (1 - t) * points[i].x + t * points[i + 1].x,
            (1 - t) * points[i].y + t * points[i + 1].y,
            (1 - t) * points[i].z + t * points[i + 1].z,
        );
        newPoints.push(interpolatedPoint);
    }

    return deCasteljau(newPoints, t);
}
