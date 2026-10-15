import * as THREE from '../vendor/three.module.js';
import { CONFIG } from './settings.js';

const lim = (v, a, b) => (v < a ? a : v > b ? b : v);

export class F1Vehicle {
    constructor(scene, terreno, config) {
        this.scene = scene;
        this.terreno = terreno;
        this.config = config;

        this.pos = new THREE.Vector3(0, 0, 0);
        this.vel = new THREE.Vector3(0, 0, 0);
        this.accel = new THREE.Vector3(0, 0, 0);
        this.rotation = 0;
        this.speed = 0;

        this.masa = config.masa || 798;
        this.downforceCoeff = CONFIG.DOWNFORCE_COEFF;
        this.baseGrip = CONFIG.BASE_GRIP;

        this.initMesh();
    }

    initMesh() {
        const group = new THREE.Group();
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 0.6, 4.5),
            new THREE.MeshStandardMaterial({ color: 0xe10600 })
        );
        group.add(body);
        this.mesh = group;
        this.scene.add(this.mesh);
    }

    paso(ent, dt) {
        const prevAccel = this.accel.clone();
        const forces = this.calculateForcesFixed(ent);

        this.accel.set(
            forces.x / this.masa,
            forces.y / this.masa,
            forces.z / this.masa
        );

        this.pos.x += this.vel.x * dt + 0.5 * this.accel.x * dt * dt;
        this.pos.y += this.vel.y * dt + 0.5 * this.accel.y * dt * dt;
        this.pos.z += this.vel.z * dt + 0.5 * this.accel.z * dt * dt;

        this.vel.x += 0.5 * (prevAccel.x + this.accel.x) * dt;
        this.vel.y += 0.5 * (prevAccel.y + this.accel.y) * dt;
        this.vel.z += 0.5 * (prevAccel.z + this.accel.z) * dt;

        this.updateRotation(ent, dt);

        this.mesh.position.copy(this.pos);
        this.mesh.rotation.y = this.rotation;
    }

    calculateForcesFixed(input) {
        const speed = this.vel.length();
        const downforce = this.downforceCoeff * speed * speed;
        let fx = 0, fy = -this.masa * CONFIG.GRAVITY + downforce, fz = 0;

        const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation);
        const driveForce = input.accel ? CONFIG.ACCELERATION * this.masa : 0;
        const brakeForce = input.brake ? CONFIG.BRAKING_FORCE * this.masa : 0;
        const totalLongitudinal = driveForce + brakeForce;

        fx += forward.x * totalLongitudinal;
        fz += forward.z * totalLongitudinal;

        const drag = -0.3 * speed * this.vel.x;
        fx += drag;
        fz += -0.3 * speed * this.vel.z;

        return { x: fx, y: fy, z: fz };
    }

    updateRotation(input, dt) {
        const speed = this.vel.length();
        if (speed < 1) return;

        const currentGrip = this.baseGrip + (this.downforceCoeff * speed * speed);
        const steerPower = 2.0 * (1.0 / (1.0 + speed * 0.05)) * currentGrip;
        this.rotation += input.steer * steerPower * dt;
    }

    getKmh() { return Math.round(this.vel.length() * 3.6); }
}

export function crearAuto(escena, terreno, config) {
    return new F1Vehicle(escena, terreno, config);
}
