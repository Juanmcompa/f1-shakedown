import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { CONFIG } from './config.js';

// Pre-allocated vectors to avoid GC pressure in the hot path (Preventing micro-stutters)
const V_TEMP = new THREE.Vector3();
const V_ACCEL = new THREE.Vector3();
const V_FORWARD = new THREE.Vector3();

export class F1Vehicle {
    constructor(scene, terreno) {
        this.scene = scene;
        this.terreno = terreno;

        // State - Using Vector3 for position/velocity for high-precision calculations
        this.pos = new THREE.Vector3(0, 0, 0);
        this.vel = new THREE.Vector3(0, 0, 0);
        this.accel = new THREE.Vector3(0, 0, 0);
        this.rotation = 0;
        this.speed = 0;

        // F1 Parameters
        this.masa = 798; // kg
        this.downforceCoeff = CONFIG.DOWNFORCE_COEFF;
        this.baseGrip = CONFIG.BASE_GRIP;

        this.initMesh();
    }

    initMesh() {
        const group = new THREE.Group();
        // Chassis: Low and wide
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.8, 0.6, 4.5),
            new THREE.MeshStandardMaterial({ color: 0xe10600 })
        );
        group.add(body);
        this.mesh = group;
        this.scene.add(this.mesh);
    }

    /**
     * VELOCITY VERLET INTEGRATOR
     * Replaces Euler integration to eliminate "jitter" and instability at high speeds.
     * Formula:
     * p(t+dt) = p(t) + v(t)dt + 0.5*a(t)dt^2
     * v(t+dt) = v(t) + 0.5*(a(t) + a(t+dt))dt
     */
    paso(input, dt, circuit) {
        // Store previous acceleration for the Velocity Verlet formula
        const prevAccel = this.accel.clone();

        // 1. Calculate Forces for current state
        const forces = this.calculateForces(input, circuit);

        // Newton's Second Law: a = F / m
        this.accel.set(
            forces.x / this.masa,
            forces.y / this.masa,
            forces.z / this.masa
        );

        // 2. Update Position (Verlet Step 1)
        this.pos.x += this.vel.x * dt + 0.5 * this.accel.x * dt * dt;
        this.pos.y += this.vel.y * dt + 0.5 * this.accel.y * dt * dt;
        this.pos.z += this.vel.z * dt + 0.5 * this.accel.z * dt * dt;

        // 3. Update Velocity (Verlet Step 2)
        this.vel.x += 0.5 * (prevAccel.x + this.accel.x) * dt;
        this.vel.y += 0.5 * (prevAccel.y + this.accel.y) * dt;
        this.vel.z += 0.5 * (prevAccel.z + this.accel.z) * dt;

        // 4. Handle Rotation and Steering
        this.updateRotation(input, dt);

        // 5. Sync Visual Mesh
        this.mesh.position.copy(this.pos);
        this.mesh.rotation.y = this.rotation;
    }

    calculateForces(input, circuit) {
        const speed = this.vel.length();

        // --- AERODYNAMIC MODEL ---
        // Downforce increases with the square of the velocity: Fd = 0.5 * rho * v^2 * Cl * A
        const downforce = this.downforceCoeff * speed * speed;

        // Base forces: Gravity + Downforce (Y axis)
        let fx = 0, fy = -this.masa * CONFIG.GRAVITY + downforce, fz = 0;

        // Calculate Forward Vector based on current rotation
        V_FORWARD.set(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation);

        // Longitudinal Forces: Acceleration and Braking
        const driveForce = input.accel ? CONFIG.ACCELERATION * this.masa : 0;
        const brakeForce = input.brake ? CONFIG.BRAKING_FORCE * this.masa : 0;
        const totalLongitudinal = driveForce + brakeForce;

        fx += V_FORWARD.x * totalLongitudinal;
        fz += V_FORWARD.z * totalLongitudinal;

        // Air Resistance (Drag)
        const drag = -0.3 * speed * this.vel.x;
        fx += drag;
        fz += -0.3 * speed * this.vel.z;

        return { x: fx, y: fy, z: fz };
    }

    updateRotation(input, dt) {
        const speed = this.vel.length();
        if (speed < 1) return;

        // AERODYNAMIC GRIP: Lateral grip increases as speed increases due to downforce
        const currentGrip = this.baseGrip + (this.downforceCoeff * speed * speed);

        // Steering sensitivity: less steering at high speed to prevent spinning out
        const steerPower = 2.0 * (1.0 / (1.0 + speed * 0.05)) * currentGrip;

        this.rotation += input.steer * steerPower * dt;
    }

    getKmh() {
        return Math.round(this.vel.length() * 3.6);
    }
}
