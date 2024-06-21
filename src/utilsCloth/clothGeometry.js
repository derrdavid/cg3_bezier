import * as THREE from 'three';
import { ForcePoint } from './forcePoint';
import { ForceLine } from './forceLines';

export class ClothGeometry {
    constructor(scene) {
        this.scene = scene;
        this.Lines = [];
        this.CanvasSize = 5;
        this.meshPoints = [];
        this.meshEdges = [];
        this.meshSize = 12;

        this.initMesh();
        this.initForcePoints();
        this.initLines();
    }
    initMesh() {
        this.meshPoints = [];

        const sizeFactor = this.meshSize / this.CanvasSize;

        for (let i = 0; i < this.meshSize; i++) {
            for (let j = 0; j < this.meshSize; j++) {
                const pointToAdd = new ForcePoint(
                    new THREE.Vector3(
                        i / sizeFactor - (this.CanvasSize / 2),
                        j / sizeFactor - (this.CanvasSize / 2),
                        0)
                );
                this.meshPoints.push(pointToAdd);
            }
        }
        this.meshPoints[0].isPin = true;
        this.meshPoints[this.meshSize - 1].isPin = true;
        this.meshPoints[this.meshSize * this.meshSize - 1].isPin = true;
        this.meshPoints[this.meshSize * this.meshSize - this.meshSize].isPin = true;
        
        this.meshPoints.forEach((point) => this.addsphere(point));
    }
    initForcePoints() {
        this.strechSetup();
        this.shearSetup();
        this.bendSetup();
    }
    strechSetup() {
        for (let i = 0; i < this.meshPoints.length; i += this.meshSize) {

            if (this.meshPoints[i + 1])
                this.meshPoints[i].addNeigbour(this.meshPoints[i + 1]);

            if (this.meshPoints[i - this.meshSize])
                this.meshPoints[i].addNeigbour(this.meshPoints[i - this.meshSize]);

            if (this.meshPoints[i + this.meshSize])
                this.meshPoints[i].addNeigbour(this.meshPoints[i + this.meshSize]);

            for (let j = 1; j < this.meshSize - 1; j++) {
                if (this.meshPoints[i + j - 1])
                    this.meshPoints[i + j].addNeigbour(this.meshPoints[i + j - 1])

                if (this.meshPoints[i + j + 1])
                    this.meshPoints[i + j].addNeigbour(this.meshPoints[i + j + 1])

                if (this.meshPoints[i + j - this.meshSize])
                    this.meshPoints[i + j].addNeigbour(this.meshPoints[i + j - this.meshSize])

                if (this.meshPoints[i + j + this.meshSize])
                    this.meshPoints[i + j].addNeigbour(this.meshPoints[i + j + this.meshSize])
            }

            if (this.meshPoints[i + this.meshSize - 2])
                this.meshPoints[i + this.meshSize - 1].addNeigbour(this.meshPoints[i + this.meshSize - 2])

            if (this.meshPoints[i - 1])
                this.meshPoints[i + this.meshSize - 1].addNeigbour(this.meshPoints[i - 1])

            if (this.meshPoints[i + this.meshSize - 1 + this.meshSize])
                this.meshPoints[i + this.meshSize - 1].addNeigbour(this.meshPoints[i + this.meshSize - 1 + this.meshSize])

        }
    }
    shearSetup() {
        for (let i = 0; i < this.meshPoints.length; i += this.meshSize) {

            if (this.meshPoints[i + this.meshSize + 1])
                this.meshPoints[i].addShearPoint(this.meshPoints[i + this.meshSize + 1])
            if (this.meshPoints[i - this.meshSize + 1])
                this.meshPoints[i].addShearPoint(this.meshPoints[i - this.meshSize + 1])

            for (let j = 1; j < this.meshSize - 1; j++) {
                if (this.meshPoints[i + j - this.meshSize + 1])
                    this.meshPoints[i + j].addShearPoint(this.meshPoints[i + j - this.meshSize + 1])
                if (this.meshPoints[i + j - this.meshSize - 1])
                    this.meshPoints[i + j].addShearPoint(this.meshPoints[i + j - this.meshSize - 1])

                if (this.meshPoints[i + j + this.meshSize + 1])
                    this.meshPoints[i + j].addShearPoint(this.meshPoints[i + j + this.meshSize + 1])
                if (this.meshPoints[i + j + this.meshSize - 1])
                    this.meshPoints[i + j].addShearPoint(this.meshPoints[i + j + this.meshSize - 1])
            }

            if (this.meshPoints[i + this.meshSize - 1 + this.meshSize - 1])
                this.meshPoints[i + this.meshSize - 1].addShearPoint(this.meshPoints[i + this.meshSize - 1 + this.meshSize - 1])
            if (this.meshPoints[i + this.meshSize - 1 - this.meshSize - 1])
                this.meshPoints[i + this.meshSize - 1].addShearPoint(this.meshPoints[i + this.meshSize - 1 - this.meshSize - 1])

        }
    }
    bendSetup() {
        for (let i = 0; i < this.meshPoints.length; i += this.meshSize) {

            if (this.meshPoints[i + 2])
                this.meshPoints[i].addBendPoint(this.meshPoints[i + 2]);
            if (this.meshPoints[i - this.meshSize * 2])
                this.meshPoints[i].addBendPoint(this.meshPoints[i - this.meshSize * 2]);
            if (this.meshPoints[i + this.meshSize * 2])
                this.meshPoints[i].addBendPoint(this.meshPoints[i + this.meshSize * 2]);

            if (this.meshPoints[i + 3])
                this.meshPoints[i + 1].addBendPoint(this.meshPoints[i + 3]);
            if (this.meshPoints[i - this.meshSize * 2 + 1])
                this.meshPoints[i + 1].addBendPoint(this.meshPoints[i - this.meshSize * 2 + 1]);
            if (this.meshPoints[i + this.meshSize * 2 + 1])
                this.meshPoints[i + 1].addBendPoint(this.meshPoints[i + this.meshSize * 2 + 1]);
            for (let j = 2; j < this.meshSize - 2; j++) {
                if (this.meshPoints[i + j - 2])
                    this.meshPoints[i + j].addBendPoint(this.meshPoints[i + j - 2])
                if (this.meshPoints[i + j + 2])
                    this.meshPoints[i + j].addBendPoint(this.meshPoints[i + j + 2])

                if (this.meshPoints[i + j - this.meshSize * 2])
                    this.meshPoints[i + j].addBendPoint(this.meshPoints[i + j - this.meshSize * 2])
                if (this.meshPoints[i + j + this.meshSize * 2])
                    this.meshPoints[i + j].addBendPoint(this.meshPoints[i + j + this.meshSize * 2])
            }
            if (this.meshPoints[i + this.meshSize - 1 - 2 - 1])
                this.meshPoints[i + this.meshSize - 1 - 1].addBendPoint(this.meshPoints[i + this.meshSize - 1 - 2 - 1])
            if (this.meshPoints[i + this.meshSize - this.meshSize * 2 - 1 - 1])
                this.meshPoints[i + this.meshSize - 1 - 1].addBendPoint(this.meshPoints[i + this.meshSize - this.meshSize * 2 - 1 - 1])
            if (this.meshPoints[i + this.meshSize - 1 + this.meshSize * 2 - 1])
                this.meshPoints[i + this.meshSize - 1 - 1].addBendPoint(this.meshPoints[i + this.meshSize - 1 + this.meshSize * 2 - 1])

            if (this.meshPoints[i + this.meshSize - 1 - 2])
                this.meshPoints[i + this.meshSize - 1].addBendPoint(this.meshPoints[i + this.meshSize - 1 - 2])
            if (this.meshPoints[i + this.meshSize - this.meshSize * 2 - 1])
                this.meshPoints[i + this.meshSize - 1].addBendPoint(this.meshPoints[i + this.meshSize - this.meshSize * 2 - 1])
            if (this.meshPoints[i + this.meshSize - 1 + this.meshSize * 2])
                this.meshPoints[i + this.meshSize - 1].addBendPoint(this.meshPoints[i + this.meshSize - 1 + this.meshSize * 2])

        }
    }
    initLines() {
        for (let i = 0; i < this.meshPoints.length; i += this.meshSize) {
            for (let j = 1; j < this.meshSize; j++) {
                let edge = new ForceLine(this.meshPoints[i + j - 1], this.meshPoints[i + j]);
                edge.update();
                this.scene.add(edge.linetodraw);
                this.meshEdges.push(edge);
            }
        }
        for (let j = 0; j < this.meshSize; j++) {
            for (let i = this.meshSize; i < this.meshPoints.length; i += this.meshSize) {
                let edge = new ForceLine(this.meshPoints[j + i - this.meshSize], this.meshPoints[j + i]);
                edge.update();
                this.scene.add(edge.linetodraw);
                this.meshEdges.push(edge);
            }
        }
        /*
        //um die nachbaren einzelner punkte zu prüfen
        for(let i = 0;i < this.meshPoints[18].neigbours.length; i++){
            //console.log(":)");
            let edge = new ForceLine(this.meshPoints[18], this.meshPoints[18].neigbours[i]);
                edge.update();
                this.scene.add(edge.linetodraw);
                this.meshEdges.push(edge);
        }*/ 
    }

    update() {
        let time = Date.now();
        for (let i = 0; i < this.meshPoints.length; i++) {
            this.meshPoints[i].updateStep1();
            this.meshPoints[i].updateStep2();
        }
        for (let i = 0; i < this.meshEdges.length; i++) {
            this.meshEdges[i].update();
        }
        //console.log(this.meshPoints[0].position);
    }
    setNewStrech(value){
        for(let i = 0; i < this.meshPoints.length; i ++){
            this.meshPoints[i].updateSpringConstant(value);
        }
    }
    setNewShear(value){
        for(let i = 0; i < this.meshPoints.length; i ++){
            this.meshPoints[i].updateShearConstant(value);
        }
    }
    setNewBend(value){
        for(let i = 0; i < this.meshPoints.length; i ++){
            this.meshPoints[i].updateBendConstant(value);
        }
    }
    setNewRestingLength(value){
        for(let i = 0; i < this.meshPoints.length; i ++){
            this.meshPoints[i].updateRestingLenght(value);
        }
    }
    setNewStepLenght(value){
        for(let i = 0; i < this.meshPoints.length; i ++){
            this.meshPoints[i].updateStepLength(value);
        }
    }
    setNewMass(value){
        for(let i = 0; i < this.meshPoints.length; i ++){
            this.meshPoints[i].updateMass(value);
        }
    }
    setNewCalcMode(value){
        for(let i = 0; i < this.meshPoints.length; i ++){
            this.meshPoints[i].updateClacMode(value);
        }
    }

    addsphere(point) {
        //console.log(point.isPin)
        if (!point.isPin) {
            const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            const geometry = new THREE.SphereGeometry(0.05, 8, 5);
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(point.position.x, point.position.y, point.position.z);
            point.setVertex(sphere);
            this.scene.add(sphere);
        }
    }

}