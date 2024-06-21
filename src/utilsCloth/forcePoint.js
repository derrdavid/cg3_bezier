import * as THREE from 'three';
export class ForcePoint {
    constructor(point) {
        this.position = point;

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
            this.calculateForce();
        }
    }
    updateStep2(){
        if(!this.isPin){
            this.determineNewPosition();
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

    determineNewPosition(){
        this.position.add(this.eulerValue(this.stepLenght));
    }

    //--math--
    calculateForce(){
        const resultingForce = new THREE.Vector3(0,0,0);

        //strech
        for(let i = 0; i < this.neigbours.length; i++){
            let direction = new THREE.Vector3(
                this.neigbours[i].position.x - this.position.x, 
                this.neigbours[i].position.y - this.position.y, 
                this.neigbours[i].position.z - this.position.z,).normalize();

            direction = direction.multiplyScalar(this.calculateSpringForce(this.position, this.neigbours[i].position, this.restingLengthConstant, this.springConstant));
            resultingForce.add(direction);
        }
        //shear
        for(let i = 0; i < this.shearPoints.length; i++){
            let direction = new THREE.Vector3(
                this.shearPoints[i].position.x - this.position.x, 
                this.shearPoints[i].position.y - this.position.y, 
                this.shearPoints[i].position.z - this.position.z,).normalize();

            direction = direction.multiplyScalar(this.calculateSpringForce(this.position, this.shearPoints[i].position, this.restingLengthConstant, this.shearConstant));
            resultingForce.add(direction);
        }
        //bend
        for(let i = 0; i < this.bendPoints.length; i++){
            let direction = new THREE.Vector3(
                this.bendPoints[i].position.x - this.position.x, 
                this.bendPoints[i].position.y - this.position.y, 
                this.bendPoints[i].position.z - this.position.z,).normalize();

            direction = direction.multiplyScalar(this.calculateSpringForce(this.position, this.bendPoints[i].position, this.restingLengthConstant*2, this.bendConstant));
            resultingForce.add(direction);
        }
        //gravity
        let gravity = new THREE.Vector3(0, -1, 0);
        gravity = gravity.multiplyScalar(this.calculateGravityForce());
        resultingForce.add(gravity);
        //end
        this.forceVector = resultingForce;
        //console.log("resulting force: " + resultingForce.x + ", " + resultingForce.y + ", " + resultingForce.z);
    }
    calculateSpringForce(point1, point2, restingLength, springKonstant){
        const distance = point1.distanceTo(point2);
        const distanceToRestingLength = restingLength-distance;
        const SpringForce = -springKonstant*distanceToRestingLength*(distance / restingLength);
        return SpringForce;
    }
    eulerValue(stepLenght){
        const returnVector = this.forceVector.multiplyScalar(stepLenght);
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
}