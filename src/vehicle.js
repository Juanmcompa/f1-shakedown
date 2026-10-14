import * as THREE from 'three';
import { CONFIG } from './config.js';

export class F1Vehicle {
    constructor(scene) {
        this.scene = scene;

        this.position = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.rotation = 0;
        this.speed = 0;
        this.lapStartTime = 0;
        this.bestLap = Infinity;

        // Model
        const group = new THREE.Group();

        // Chassis
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.6, 4),
            new THREE.MeshStandardMaterial({ color: 0xe10600 })
        );
        group.add(body);

        // Front Wing
        const wing = new THREE.Mesh(
            new THREE.BoxGeometry(2.2, 0.2, 0.8),
            new THREE.MeshStandardMaterial({ color: 0x222222 })
        );
        wing.position.z = 2;
        group.add(wing);

        this.mesh = group;
        this.scene.add(this.mesh);
    }

    update(input, dt, circuit) {
        // 1. Driving Force
        let force = 0;
        if (input.accel) force += CONFIG.ACCELERATION;
        if (input.brake) force += CONFIG.BRAKING_FORCE;

        this.speed += force * dt;
        const maxSpeedMS = CONFIG.MAX_SPEED / 3.6;
        this.speed = Math.max(0, Math.min(this.speed, maxSpeedMS));

        // 2. Aero Downforce (F1 Logic)
        const currentGrip = CONFIG.BASE_GRIP + (CONFIG.DOWNFORCE_COEFF * this.speed * this.speed);

        // 3. Steering with Grip Limit
        if (this.speed > 1) {
            const steeringPower = 2.2 * (1.0 / (1.0 + this.speed * 0.03));
            const turnAngle = input.steer * steeringPower * dt;

            // Simulate understeer if grip limit is exceeded
            const lateralG = (this.speed * this.speed * turnAngle) / 1;
            const gripFactor = lateralG > CONFIG.LATERAL_GRIP_LIMIT ? 0.5 : 1.0;

            this.rotation += turnAngle * gripFactor;
        }

        // 4. Movement
        const vx = Math.sin(this.rotation) * this.speed;
        const vz = Math.cos(this.rotation) * this.speed;

        this.position.x += vx * dt;
        this.position.z += vz * dt;

        // 5. Track Bounds (Simplified)
        const trackInfo = circuit.getClosestPoint(this.position);
        if (trackInfo.distance > 15) { // Off track
            this.speed *= 0.98; // Slow down on grass
        }

        this.mesh.position.copy(this.position);
        this.mesh.rotation.y = this.rotation;
    }

    getKmh() { return Math.round(this.speed * 3.6); }
}
