import * as THREE from 'three';
import { ForcePoint } from './forcePoint';
export class ForceLine {
    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
        const geometry = new THREE.BufferGeometry().setFromPoints([this.point1.position, this.point2.position]);
        const material = new THREE.LineBasicMaterial( {color: 0x00ff00} );
        this.linetodraw = new THREE.Line(geometry, material);
    }
    update(){
        let points = [];
        points.push(this.point1.position);
        points.push(this.point2.position);
        this.linetodraw.geometry.setFromPoints(points);
        this.linetodraw.material.color = this.calcLineColor();    
    }
    calcLineColor(){
        const currLength = this.point1.position.distanceTo(this.point2.position);
        let stressValue = 0;
        if(currLength > this.point1.restingLengthConstant){
            stressValue = currLength / this.point1.restingLengthConstant;
        } else if(currLength < this.point1.restingLengthConstant){
            stressValue = ((this.point1.restingLengthConstant - currLength) + this.point1.restingLengthConstant) / this.point1.restingLengthConstant
        }else{
            stressValue = 1;
        }
        if(stressValue > 2){
            stressValue = 2;
        }
        stressValue = stressValue -1;
        stressValue = 1 - stressValue;
        return new THREE.Color("hsl("+stressValue * 100+", 100%, 50%)");
        
    }
} 