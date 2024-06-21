import * as THREE from 'three';
import { temp } from 'three/examples/jsm/nodes/Nodes.js';

const CALC_METHOD = {
    EULER: 'Euler',
    MIDPOINT: 'Midpoint',
    RUNGE: 'Runge'
};

export class ForcePoint {
    constructor(point) {
        this.position = point;

        this.calcMethod = CALC_METHOD.RUNGE;

        this.neigbours = [];
        this.shearPoints = [];
        this.bendPoints = [];

        this.springConstant = 50;
        this.shearConstant = 50;
        this.bendConstant = 50;

        this.restingLengthConstant = 0.4;

        this.stepLenght = 0.003;

        this.mass = 0.01;

        this.isPin = false;
        this.vertex = null;
        this.forceVector = new THREE.Vector3(0,0,0);
    }
    updateStep1(){
        if(!this.isPin){
            let tmpPos;
            switch(this.calcMethod){
                case CALC_METHOD.EULER:
                    this.calculateForce(this.position);
                    this.position = this.determineNewPosition(this.position, this.stepLenght, this.forceVector);
                    break;

                case CALC_METHOD.MIDPOINT:
                    this.calculateForce(this.position);
                    tmpPos = this.determineNewPosition(this.position, this.stepLenght / 2, this.forceVector);
                    this.calculateForce(tmpPos);
                    this.position = this.determineNewPosition(tmpPos, this.stepLenght / 2, this.forceVector);
                    break;

                case CALC_METHOD.RUNGE:
                    let k1 = this.calculateForce(this.position); 
                    
                    tmpPos = this.determineNewPosition(this.position, this.stepLenght / 2, k1);
                    let k2 = this.calculateForce(tmpPos);

                    tmpPos = this.determineNewPosition(this.position, this.stepLenght / 2, k2);
                    let k3 = this.calculateForce(tmpPos);

                    tmpPos = this.determineNewPosition(this.position, this.stepLenght, k3);
                    let k4 = this.calculateForce(tmpPos);

                    k2.multiplyScalar(2);
                    k3.multiplyScalar(2);
                    const newForceVector = new THREE.Vector3(0,0,0).add(k1).add(k2).add(k3).add(k4);

                    this.position = this.determineNewPosition(this.position, this.stepLenght / 6, newForceVector);
                    break;
            }
        }
    }
    updateStep2(){
        if(!this.isPin){
            this.updateVertexPos(this.position);
        }
    }
    addNeigbour(point){
        this.neigbours.push(point)
    }
    addShearPoint(point){
        this.shearPoints.push(point)
    }
    addBendPoint(point){
        this.bendPoints.push(point)
    }
    setVertex(sphere){
        this.vertex = sphere;
    }

    determineNewPosition(curPos, stepLenght, force){
        let pos = new THREE.Vector3(curPos.x, curPos.y, curPos.z);
        pos.add(this.eulerValue(stepLenght, force));
        return pos;
    }

    //--math--
    calculateForce(curPos){
        const resultingForce = new THREE.Vector3(0,0,0);

        //strech
        for(let i = 0; i < this.neigbours.length; i++){
            let direction = new THREE.Vector3(
                this.neigbours[i].position.x - curPos.x, 
                this.neigbours[i].position.y - curPos.y, 
                this.neigbours[i].position.z - curPos.z,).normalize();

            direction = direction.multiplyScalar(this.calculateSpringForce(curPos, this.neigbours[i].position, this.restingLengthConstant, this.springConstant));
            resultingForce.add(direction);
        }
        //shear
        for(let i = 0; i < this.shearPoints.length; i++){
            let direction = new THREE.Vector3(
                this.shearPoints[i].position.x - curPos.x, 
                this.shearPoints[i].position.y - curPos.y, 
                this.shearPoints[i].position.z - curPos.z,).normalize();

            direction = direction.multiplyScalar(this.calculateSpringForce(curPos, this.shearPoints[i].position, this.restingLengthConstant, this.shearConstant));
            resultingForce.add(direction);
        }
        //bend
        for(let i = 0; i < this.bendPoints.length; i++){
            let direction = new THREE.Vector3(
                this.bendPoints[i].position.x - curPos.x, 
                this.bendPoints[i].position.y - curPos.y, 
                this.bendPoints[i].position.z - curPos.z,).normalize();

            direction = direction.multiplyScalar(this.calculateSpringForce(curPos, this.bendPoints[i].position, this.restingLengthConstant*2, this.bendConstant));
            resultingForce.add(direction);
        }
        //gravity
        let gravity = new THREE.Vector3(0, -1, 0);
        gravity = gravity.multiplyScalar(this.calculateGravityForce());
        resultingForce.add(gravity);
        //end
        this.forceVector = resultingForce;
        //console.log("resulting force: " + resultingForce.x + ", " + resultingForce.y + ", " + resultingForce.z);
        return resultingForce;
    }
    calculateSpringForce(point1, point2, restingLength, springKonstant){
        const distance = point1.distanceTo(point2);
        const distanceToRestingLength = restingLength-distance;
        const SpringForce = -springKonstant*distanceToRestingLength*(distance / restingLength);
        return SpringForce;
    }
    eulerValue(stepLenght, force){
        const returnVector = force.multiplyScalar(stepLenght);
        return returnVector;
    }

    calculateGravityForce(){
        const force = this.mass *9.81;
        return force;
    }
    //--updates--
    updateVertexPos(pos){
        this.vertex.position.set(pos.x, pos.y, pos.z);
    }
    updateVertexColor(col){
        this.vertex.material.color.setHex( col );
    }
    updateSpringConstant(value){
        this.springConstant = value;
    }
    updateShearConstant(value){
        this.shearConstant = value;
    }
    updateBendConstant(value){
        this.bendConstant = value;
    }
    updateRestingLenght(value){
        this.restingLengthConstant = value;
    }
    updateStepLength(value){
        this.stepLenght = value;
    }
    updateMass(value){
        this.mass = value;
    }
    updateClacMode(value){
        this.calcMethod = value;
    }
}