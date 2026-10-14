import * as THREE from 'three';
import { F1Vehicle } from './vehicle.js';
import { Circuit } from './circuit.js';
import { CONFIG } from './config.js';

class Game {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('game-canvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.setupLighting();
        this.circuit = new Circuit(this.scene);
        this.vehicle = new F1Vehicle(this.scene);

        this.input = { accel: false, brake: false, steer: 0 };
        this.state = 'menu';
        this.startTime = 0;

        this.initListeners();
        this.loop();
    }

    setupLighting() {
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
        const sun = new THREE.DirectionalLight(0xffffff, 1);
        sun.position.set(50, 100, 50);
        this.scene.add(sun);
    }

    initListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'w' || e.key === 'ArrowUp') this.input.accel = true;
            if (e.key === 's' || e.key === 'ArrowDown') this.input.brake = true;
            if (e.key === 'a' || e.key === 'ArrowLeft') this.input.steer = -1;
            if (e.key === 'd' || e.key === 'ArrowRight') this.input.steer = 1;
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'w' || e.key === 'ArrowUp') this.input.accel = false;
            if (e.key === 's' || e.key === 'ArrowDown') this.input.brake = false;
            if (e.key === 'a' || e.key === 'ArrowLeft' || e.key === 'd' || e.key === 'ArrowRight') this.input.steer = 0;
        });

        document.getElementById('btn-start').addEventListener('click', () => {
            this.state = 'playing';
            this.startTime = Date.now();
            document.getElementById('menu').style.display = 'none';
        });
    }

    updateHUD() {
        const elapsed = (Date.now() - this.startTime) / 1000;
        document.getElementById('speed').textContent = `${this.vehicle.getKmh()} km/h`;
        document.getElementById('lap-time').textContent = `${elapsed.toFixed(3)} s`;
    }

    loop() {
        requestAnimationFrame(() => this.loop());

        if (this.state === 'playing') {
            this.vehicle.update(this.input, CONFIG.TIME_STEP, this.circuit);
            this.updateHUD();

            const offset = new THREE.Vector3(
                -Math.sin(this.vehicle.rotation) * 12,
                6,
                -Math.cos(this.vehicle.rotation) * 12
            );
            this.camera.position.copy(this.vehicle.position).add(offset);
            this.camera.lookAt(this.vehicle.position);
        }

        this.renderer.render(this.scene, this.camera);
    }
}

new Game();
