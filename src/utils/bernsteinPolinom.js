import * as THREE from 'three';
import CustomLine from './customline';
import { BezierCurve } from './bezier';

export class BernsteinPolinom{
    constructor(points, scene) {
        this.scene = scene;
        this.controlPoints = points;
        this.supportLines = [];
        this.supportLinePoints = [];
        this.step = 0.01;
        this.colors = [0xff00ff, 0xffff00, 0x00ffff, 0xff0000];

        this.curve = new Line();
        this.scene.add(this.curve.line);

        this.initSupportLines();
        this.update(0);
    }
    initSupportLines() {
        for (let i = 0; i < this.controlPoints.length - 1; i++) {
            const color = this.colors[i];
            const supportLine = new Line(color, 0.02);
            this.supportLines.push(supportLine);
            this.scene.add(supportLine.line);
        }
    }
    update(t) {
        let currPoint = [];
        currPoint.push(this.deCasteljau(this.controlPoints, t));
        this.supportLinePoints = [];
        for(let i = 0; i < this.controlPoints.length; i++){
            this.supportLinePoints.push(this.controlPoints[i]);
            this.supportLinePoints.push(currPoint[0]);
        }
        this.supportLinePoints.forEach((supportPoints, i) => {
            if (this.supportLines[i]) {
                this.supportLines[i].setPoints(supportPoints);
            }
        });
    }
    deCasteljau(points, t) {
        this.supportLinePoints.push(points); 

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
}