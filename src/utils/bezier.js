import * as THREE from 'three';
import CustomLine from './customline';

export class BezierCurve {
    constructor(points, scene) {
        this.scene = scene;
        this.controlPoints = points;

        this.supportLines = [];
        this.supportLinePoints = [];
        this.step = 0.01;
        this.colors = [0xff00ff, 0xffff00, 0x00ffff];
        this.bernsteinColors = [0x0000ff, 0xffff00, 0x00ffff, 0xff0000];
        this.curve = new CustomLine();
        this.scene.add(this.curve.line);

        this.bernsteinLines = [];
        this.bernsteinMode = false;

        this.initSupportLines();
        this.switchLineMode();
        console.log(this.bernsteinMode);
        this.update(0);
    }

    initSupportLines() {
        for (let i = 0; i < this.controlPoints.length - 1; i++) {
            const color = this.colors[i];
            const supportLine = new CustomLine(color, 0.02);
            this.supportLines.push(supportLine);
            this.scene.add(supportLine.line);
        }
        //bernsteinlinien
        for (let i = 0; i < this.controlPoints.length; i++) {
            const bernsteinline = new CustomLine(this.bernsteinColors[i], 0.02);
            this.bernsteinLines.push(bernsteinline);
            this.scene.add(this.bernsteinLines[i].line);
            bernsteinline.line.visible = false;
        }
    }

    switchLineMode(value){
        this.bernsteinMode = value;
        if(this.bernsteinMode){
            for(let i = 0; i < this.supportLines.length; i++){
                this.supportLines[i].line.visible = false;
            }
            for(let i = 0; i < this.bernsteinLines.length; i++){
                this.bernsteinLines[i].line.visible = true;
            }
        }else{
            for(let i = 0; i < this.supportLines.length; i++){
                this.supportLines[i].line.visible = true;
            }
            for(let i = 0; i < this.bernsteinLines.length; i++){
                this.bernsteinLines[i].line.visible = false;
            }
        }
    }

    update(t) {
        const points = [];

        for (let i = 0; i <= t; i += this.step) {
            this.supportLinePoints = [];
            points.push(this.deCasteljau(this.controlPoints, i));
        }

        this.curve.setPoints(points);  

        this.supportLinePoints.forEach((supportPoints, i) => {
            if (this.supportLines[i]) {
                this.supportLines[i].setPoints(supportPoints);
            }
        });
        //bernsteinPolinome
        let influence = 0;
        for(let i = 0; i < this.controlPoints.length; i++){
            influence = this.determinepos(i, t);
            let width = influence.y * 20;
            if(width < 1){
                width = 1;
            }
            console.log(width);
            this.bernsteinLines[i].setPointsWithWidth([this.controlPoints[i], points[points.length-1]],  p => width);
        }

    }
    determinepos(k, x_value){
        const x = x_value;
        const y = this.binomial(3, k) * Math.pow(x, k) * Math.pow((1-x),(3-k));
        const z = 0;
        return new THREE.Vector3(x,y,z);
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
    binomial(n, k) {
        if ((typeof n !== 'number') || (typeof k !== 'number')) 
            return false; 
        var coeff = 1;
        for (var x = n - k + 1; x <= n; x++) coeff *= x;
        for (x = 1; x <= k; x++) coeff /= x;
        return coeff;
    }
}
