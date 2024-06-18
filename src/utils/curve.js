import * as THREE from 'three';
import { MeshLine, MeshLineMaterial } from 'three.meshline';

export default class Line {
    constructor(color = 0xFFFFFF, lineWidth = 0.1) {
        this.lineMaterial = new MeshLineMaterial({ color, lineWidth });
        this.meshline = new MeshLine();
        this.line = new THREE.Mesh(this.meshline, this.lineMaterial);
    }

    setPoints(newPoints) {
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(newPoints);
        this.meshline.setGeometry(lineGeometry);
        this.line.geometry = this.meshline.geometry;
    }
}
