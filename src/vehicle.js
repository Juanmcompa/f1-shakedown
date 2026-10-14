import * as THREE from 'three';
import { CONFIG } from './config.js';

const lim = (v, a, b) => (v < a ? a : v > b ? b : v);

export class F1Vehicle {
    constructor(scene, terreno) {
        this.scene = scene;
        this.terreno = terreno;

        // Core State
        this.pos = [0, 0, 0];
        this.vel = [0, 0, 0];
        this.w = [0, 0, 0];
        this.q = [0, 0, 0, 1];

        this.adelante = [0, 0, -1];
        this.arriba = [0, 1, 0];
        this.derecha = [1, 0, 0];

        this.volante = 0;
        this.gas = 0;
        this.freno = 1;
        this.sentido = 1;
        this.velocidad = 0;
        this.impacto = 0;

        this.masa = 798;
        this.inercia = [1500, 3000, 1500];
        this.trocha = 2.0;
        this.ejes = 1.5;
        this.centro = 0.2;
        this.resorteLargo = 0.3;
        this.resorte = 50000;
        this.amortigua = [4000, 6000];
        this.radio = 0.3;
        this.aire = 0.25;
        this.giro = 0.4;
        this.giroVel = 4.0;

        this.ruedas = [];
        for (let i = 0; i < 4; i++) {
            this.ruedas.push({
                x: (i % 2 ? 1 : -1) * this.trocha,
                z: (i < 2 ? -1 : 1) * this.ejes + this.centro,
                delantera: i < 2,
                empuja: i < 2 ? 0 : 1,
                largo: this.resorteLargo,
                toca: false,
                patina: 0,
                carga: 0,
                tope: 0,
                vl: 0,
                p: [0, 0, 0]
            });
        }

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
        const p = this.pos, v = this.vel, w = this.w, q = this.q, m = this.masa, g = CONFIG.GRAVITY;
        const qx = q[0], qy = q[1], qz = q[2], qw = q[3];

        const rx = 1 - 2 * (qy * qy + qz * qz), ry = 2 * (qx * qy + qw * qz), rz = 2 * (qx * qz - qw * qy);
        const ux = 2 * (qx * qy - qw * qz), uy = 1 - 2 * (qx * qx + qz * qz), uz = 2 * (qy * qz + qw * qx);
        const bx = 2 * (qx * qz + qw * qy), by = 2 * (qy * qz - qw * qx), bz = 1 - 2 * (qx * qx + qy * qy);
        const fx = -bx, fy = -by, fz = -bz;
        const vf = v[0] * fx + v[1] * fy + v[2] * fz;

        let quiereGas = 0;
        if (ent.y > 0) { quiereGas = ent.y; this.sentido = 1; }
        else if (ent.y < 0) { quiereGas = -ent.y; this.sentido = -1; }

        this.gas += lim(quiereGas - this.gas, -dt * 6, dt / 1.0);
        this.volante += lim(ent.x - this.volante, -this.giroVel * dt, this.giroVel * dt);

        const giroRuedas = lim(this.volante * this.giro, -this.giro, this.giro);
        let empuje = this.gas * this.sentido * Math.min(CONFIG.ACCELERATION * m, 15000 / Math.max(Math.abs(vf), 1));

        const va = Math.hypot(v[0], v[1], v[2]);
        let Fx = -this.aire * va * v[0], Fy = -m * g - this.aire * va * v[1], Fz = -this.aire * va * v[2];
        let Tx = 0, Ty = 0, Tz = 0;

        const total = this.resorteLargo + this.radio;
        let enPiso = 0;

        for (const r of this.ruedas) {
            const ax = p[0] + rx * r.x + ux * 0 + bx * r.z;
            const ay = p[1] + ry * r.x + uy * 0 + by * r.z;
            const az = p[2] + rz * r.x + uz * 0 + bz * r.z;

            const h = this.terreno.altura(ax, az);
            const t = (ay - h) / uy;
            r.toca = t < total;
            r.largo = lim(t - this.radio, 0, this.resorteLargo);

            if (!r.toca) continue;
            enPiso++;

            const comp = lim(total - t, 0, 0.3);
            let Fs = this.resorte * comp + this.amortigua[0] * 0;

            const Nf = Fs / 1.0;
            r.carga = Nf;

            const aeroGrip = 1.0 + (CONFIG.DOWNFORCE_COEFF * vf * vf);
            const tope = Nf * aeroGrip;

            const ang = r.delantera ? giroRuedas : 0;
            const co = Math.cos(ang), si = Math.sin(ang);
            const lx = fx * co + rx * si, lz = fz * co + rz * si;

            let Fl = (r.empuja) ? empuje / 4 : 0;
            if (ent.brake) Fl -= 5000 * (r.delantera ? 0.7 : 0.3);

            const Ax = lx * Fl, Az = lz * Fl;
            Fx += Ax; Fz += Az;
        }

        const im = dt / m;
        v[0] += Fx * im; v[1] += Fy * im; v[2] += Fz * im;

        const rotVel = this.volante * (vf / 20);
        this.rotation += rotVel * dt;

        p[0] += v[0] * dt; p[1] += v[1] * dt; p[2] += v[2] * dt;

        this.mesh.position.set(p[0], p[1], p[2]);
        this.mesh.rotation.y = this.rotation;
    }

    getKmh() { return Math.round(this.velocidad * 3.6); }
}
