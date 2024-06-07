import * as THREE from 'three';
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';


export default class BezierCurve {
    constructor(points) {
        this.points = points;
        this.line = this.create(points);
    }

    create(points) {
        let bezier_points = [];
        for (let t = 0; t <= 1; t += 0.01) {
            bezier_points.push(deCasteljau(points, t));
        }
        const line_geometry = new THREE.BufferGeometry().setFromPoints(bezier_points);
        const line_material = new MeshLineMaterial({ color: 0xFFFFFF, lineWidth: 0.1 });
        const line = new MeshLine();
        line.setPoints(bezier_points);
        line.setGeometry(line_geometry);
        const lineMesh = new THREE.Mesh(line, line_material)
        return lineMesh;
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



