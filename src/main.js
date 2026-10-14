import * as THREE from 'three';
import { CONFIG } from './config.js';
import { rea } from './rea/core.js';

// --- REA SYSTEMS ---

class PhysicsSystem {
    update(entities, state, dt) {
        if (state.gameState !== 'playing') return;

        const vehicle = Array.from(entities).find(e => e instanceof F1Vehicle);
        const circuit = state.circuit;
        const input = state.input;

        if (vehicle && circuit && input) {
            vehicle.applyPhysics(input, dt, circuit);
            rea.setState('vehicleSpeed', vehicle.getKmh());
        }
    }
}

class TimingSystem {
    update(entities, state, dt) {
        if (state.gameState !== 'playing') return;

        const vehicle = Array.from(entities).find(e => e instanceof F1Vehicle);
        const circuit = state.circuit;

        if (!vehicle || !circuit) return;

        const currentTime = Date.now();
        const startTime = state.lapStartTime || currentTime;
        const elapsed = (currentTime - startTime) / 1000;

        const trackInfo = circuit.getClosestPoint(vehicle.position);
        const distToStart = vehicle.position.distanceTo(circuit.startFinishLine);

        if (distToStart < 10 && elapsed > 5) {
            const finalLapTime = elapsed;
            const bestLap = rea.getState('bestLap') || Infinity;

            if (finalLapTime < bestLap) {
                rea.setState('bestLap', finalLapTime);
            }

            rea.setState('lapStartTime', currentTime);
            rea.setState('currentLapTime', 0);
            rea.setState('lapCompleted', true);
        }

        rea.setState('currentLapTime', elapsed);
    }
}

class CameraSystem {
    update(entities, state, dt) {
        if (state.gameState !== 'playing') return;

        const vehicle = Array.from(entities).find(e => e instanceof F1Vehicle);
        const camera = state.camera;

        if (vehicle && camera) {
            const offset = new THREE.Vector3(
                -Math.sin(vehicle.rotation) * 12,
                6,
                -Math.cos(vehicle.rotation) * 12
            );
            camera.position.copy(vehicle.position).add(offset);
            camera.lookAt(vehicle.position);
        }
    }
}

// Import vehicle and circuit inside the class or as modules
import { F1Vehicle } from './vehicle.js';
import { Circuit } from './circuit.js';

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

        rea.setState('gameState', 'menu');
        rea.setState('camera', this.camera);
        rea.setState('bestLap', Infinity);
        rea.setState('lapStartTime', Date.now());

        const circuit = new Circuit(this.scene);
        rea.setState('circuit', circuit);

        const vehicle = new F1Vehicle(this.scene);
        rea.addEntity(vehicle);

        rea.setState('input', { accel: false, brake: false, steer: 0 });

        rea.addSystem(new PhysicsSystem());
        rea.addSystem(new TimingSystem());
        rea.addSystem(new CameraSystem());

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
            const input = { ...rea.getState('input') };
            if (e.key === 'w' || e.key === 'ArrowUp') input.accel = true;
            if (e.key === 's' || e.key === 'ArrowDown') input.brake = true;
            if (e.key === 'a' || e.key === 'ArrowLeft') input.steer = -1;
            if (e.key === 'd' || e.key === 'ArrowRight') input.steer = 1;
            rea.setState('input', input);
        });

        window.addEventListener('keyup', (e) => {
            const input = { ...rea.getState('input') };
            if (e.key === 'w' || e.key === 'ArrowUp') input.accel = false;
            if (e.key === 's' || e.key === 'ArrowDown') input.brake = false;
            if (e.key === 'a' || e.key === 'ArrowLeft' || e.key === 'd' || e.key === 'ArrowRight') input.steer = 0;
            rea.setState('input', input);
        });

        document.getElementById('btn-start').addEventListener('click', () => {
            rea.setState('gameState', 'playing');
            rea.setState('lapStartTime', Date.now());
            document.getElementById('menu').style.display = 'none';
        });

        window.addEventListener('rea-state-change', (e) => {
            const { key, value } = e.detail;
            if (key === 'vehicleSpeed') {
                document.getElementById('speed').textContent = `${value} km/h`;
            }
            if (key === 'currentLapTime') {
                document.getElementById('lap-time').textContent = `${value.toFixed(3)} s`;
            }
        });
    }

    loop() {
        requestAnimationFrame(() => this.loop());
        rea.update(CONFIG.TIME_STEP);
        this.renderer.render(this.scene, this.camera);
    }
}

new Game();
