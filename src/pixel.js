// pixel.js - Ported from Encajados
// Tools for creating pixel-art textures and atlases for 3D models.
import * as THREE from 'three';

export const tono = (hex, delta) => {
    const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
    const f = (c) => lim(Math.round(c + delta * 255), 0, 255);
    const res = [f(r), f(g), f(b)].map(x => x.toString(16).padStart(2, '0')).join('');
    return '#' + res;
};

const lim = (v, a, b) => (v < a ? a : v > b ? b : v);

export function textura(w, h, dibujar) {
    const lienzo = document.createElement('canvas');
    lienzo.width = w; lienzo.height = h;
    const x = lienzo.getContext('2d');
    dibujar(x);
    return new THREE.CanvasTexture(lienzo);
}

export class Atlas {
    constructor(w, h, semilla = 3) {
        this.ancho = w; this.alto = h; this.semilla = semilla;
        this.lienzo = document.createElement('canvas');
        this.lienzo.width = w; this.lienzo.height = h;
        this.x = this.lienzo.getContext('2d');
    }

    azar() {
        this.semilla = (this.semilla * 1664525 + 1013904223) >>> 0;
        return this.semilla / 4294967296;
    }

    rect(x, z, w, l, col) {
        this.x.fillStyle = col;
        this.x.fillRect(x, z, w, l);
    }

    zona(w, h, dibujar, s) {
        const x = Math.floor(this.azar() * (this.ancho - w));
        const z = Math.floor(this.azar() * (this.alto - h));
        dibujar({
            rect: (rx, rz, rw, rl, col) => this.rect(x + rx, z + rz, rw, rl, col),
            azar: () => this.azar()
        });
        return { x, z, w, h };
    }

    textura() {
        return new THREE.CanvasTexture(this.lienzo);
    }
}

export function crearAtlas(w, h, s) { return new Atlas(w, h, s); }

export class Lote {
    constructor() {
        this.cajas = [];
    }

    // Simplified box implementation for F1
    // In the original, this creates the 3D geometry based on the views
    caja(matriz, b, callback, cuña, cuñaAtras) {
        this.cajas.push({ matriz, b, callback, cuña, cuñaAtras });
    }

    geometria(atlas) {
        // For the prototype, we return a combined box geometry
        // In the full port, this would generate a custom BufferGeometry
        return new THREE.BoxGeometry(1, 1, 1);
    }
}

export function crearLote() { return new Lote(); }
