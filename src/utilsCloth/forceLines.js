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
    }

} 