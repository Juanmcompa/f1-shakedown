import * as THREE from 'three';
import { CONFIG } from './config.js';

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
        const trackGeo = new THREE.TubeGeometry(curve, 100, 7.5, 12, true);
        const trackMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
        const trackMesh = new THREE.Mesh(trackGeo, trackMat);
        trackMesh.scale.y = 0.05;
        this.scene.add(trackMesh);

        const curbGeo = new THREE.TubeGeometry(curve, 100, 8.2, 12, true);
        const curbMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
        const curbMesh = new THREE.Mesh(curbGeo, curbMat);
        curbMesh.scale.y = 0.04;
        this.scene.add(curbMesh);
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
