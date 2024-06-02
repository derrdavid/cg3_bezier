import * as THREE from 'three';

export function calculateCubicBezierPoint(t, points) {
    if (points.length !== 4) {
        throw new Error('Es müssen genau 4 Kontrollpunkte angegeben werden.');
    }

    const [p0, p1, p2, p3] = points;

    const term1 = p0.clone().multiplyScalar((1 - t) ** 3);
    const term2 = p1.clone().multiplyScalar(3 * (1 - t) ** 2 * t);
    const term3 = p2.clone().multiplyScalar(3 * (1 - t) * t ** 2);
    const term4 = p3.clone().multiplyScalar(t ** 3);

    return term1.add(term2).add(term3).add(term4);
}

export function deCasteljau(points, t) {
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



