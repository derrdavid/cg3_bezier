import * as THREE from 'three';
import CustomLine from './customline';

export class BernsteinPolinom{
    constructor(scene) {
        this.scene = scene;
        this.points =[];
        this.graphs = [];
        this.numPoints = 100;
        this.colors = [0x0000ff, 0xffff00, 0x00ffff, 0xff0000];
        this.indicatorSpheres = [];
        this.width = 0.06;

        this.initPolinome();
        this.initSpheres();
    }
    initPolinome(){
        this.bernsteinAlgorythmus(0);
        this.bernsteinAlgorythmus(1);
        this.bernsteinAlgorythmus(2);
        this.bernsteinAlgorythmus(3);
    }
    initSpheres(){
        let point = this.determinepos(0, 0.55);
        this.addsphere(point)
        point = this.determinepos(1, 0.55);
        this.addsphere(point)
        point = this.determinepos(2, 0.55);
        this.addsphere(point)
        point = this.determinepos(3, 0.55);
        this.addsphere(point)
    }
    updateSperes(value){
        for(let i = 0; i < this.indicatorSpheres.length; i++){
            const pos = this.determinepos(i, value);
            this.updateSperePosition(i, pos.x, pos.y, pos.z);
        }
    }
    updateSperePosition(index , x, y, z){
        this.indicatorSpheres[index].position.set(x, y, z);
    }
    updatelineThickness(value){
        let influence = 0;
        for(let i = 0; i < this.graphs.length; i++){
            influence = this.determinepos(i, value);
            this.width = influence.y;
            if(this.width < 0.1){
                this.width = 0.1;
            }
            const newWidth = this.width;
            this.graphs[i].setPointsWithWidth(this.points[i], p => this.width);
        }
    }
    update(value){
        this.updateSperes(value);
        this.updatelineThickness(value);
    }
    determinepos(k, x_value){
        const x = x_value;
        const y = this.binomial(3, k) * Math.pow(x, k) * Math.pow((1-x),(3-k));
        const z = 0;
        return new THREE.Vector3(x,y,z);
    }
    bernsteinAlgorythmus(k){
        this.points.push([]);
        for (let i = 0; i < this.numPoints; i++) {
            const x = i / this.numPoints;
            const y = this.binomial(3, k) * Math.pow(x, k) * Math.pow((1-x),(3-k));
            const z = 0;
    
            this.points[k].push(new THREE.Vector3(x, y, z));
        }
        const line = new CustomLine(this.colors[k], this.width);
        line.setPoints(this.points[k]);
        this.graphs.push(line);
        this.scene.add(line.line);
    }
    binomial(n, k) {
        if ((typeof n !== 'number') || (typeof k !== 'number')) 
            return false; 
        var coeff = 1;
        for (var x = n - k + 1; x <= n; x++) coeff *= x;
        for (x = 1; x <= k; x++) coeff /= x;
        return coeff;
    }
    addsphere(point) {
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const geometry = new THREE.SphereGeometry(0.02, 8, 5);
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(point.x, point.y, point.z);
        this.indicatorSpheres.push(sphere);
        this.scene.add(sphere);
    }

}