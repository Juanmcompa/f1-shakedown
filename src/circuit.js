import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { CONFIG } from './settings.js';

export class Circuit {
    constructor(scene) {
        this.scene = scene;
        this.points = [];
        this.sectorPoints = [];
        this.generateDailyCircuit();
    }

    seededRandom(seed) {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    generateDailyCircuit() {
        const now = new Date();
        const seedStr = now.getFullYear().toString() +
                        (now.getMonth() + 1).toString().padStart(2, '0') +
                        now.getDate().toString().padStart(2, '0');
        let seed = parseInt(seedStr);

        const points = [];
        const numPoints = 12;
        const radius = 120;

        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const noise = (this.seededRandom(seed + i) - 0.5) * 60;
            const x = Math.cos(angle) * (radius + noise);
            const z = Math.sin(angle) * (radius + noise);
            points.push(new THREE.Vector3(x, 0, z));
        }
        this.points = points;

        this.sectorPoints = [];
        const sectorStep = Math.floor(numPoints / CONFIG.NUM_SECTORS);
        for (let i = 1; i < CONFIG.NUM_SECTORS; i++) {
            this.sectorPoints.push(this.points[i * sectorStep]);
        }
        this.startFinishLine = this.points[0];

        this.buildTrackMesh();
    }

    buildTrackMesh() {
        const curve = new THREE.CatmullRomCurve3(this.points, true);
        const trackGeo = new THREE.TubeGeometry(curve, 128, CONFIG.TRACK_WIDTH / 2, 12, true);
        const trackMat = new THREE.MeshStandardMaterial({
            color: 0x222222,
            roughness: 0.8,
            metalness: 0.2
        });
        const trackMesh = new THREE.Mesh(trackGeo, trackMat);
        trackMesh.scale.y = 0.02;
        this.scene.add(trackMesh);

        const curbGeo = new THREE.BoxGeometry(1, 0.1, 0.5);
        const curbMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const instancedCurbs = new THREE.InstancedMesh(curbGeo, curbMat, 1000);

        const dummy = new THREE.Object3D();
        let count = 0;

        for (let i = 0; i < 1; i += 0.01) {
            const pos = curve.getPointAt(i);
            const tangent = curve.getTangentAt(i);
            const perp = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

            dummy.position.copy(pos).addScaledVector(perp, CONFIG.TRACK_WIDTH / 2);
            dummy.lookAt(pos.x + tangent.x, 0, pos.z + tangent.z);
            dummy.updateMatrix();
            instancedCurbs.setMatrixAt(count++, dummy.matrix);

            dummy.position.copy(pos).addScaledVector(perp, -CONFIG.TRACK_WIDTH / 2);
            dummy.lookAt(pos.x + tangent.x, 0, pos.z + tangent.z);
            dummy.updateMatrix();
            instancedCurbs.setMatrixAt(count++, dummy.matrix);
        }

        instancedCurbs.count = count;
        this.scene.add(instancedCurbs);
    }

    getClosestPoint(pos) {
        let minDistance = Infinity;
        let closest = this.points[0];
        this.points.forEach(p => {
            const dist = pos.distanceTo(p);
            if (dist < minDistance) {
                minDistance = dist;
                closest = p;
            }
        });
        return { point: closest, distance: minDistance };
    }
}
