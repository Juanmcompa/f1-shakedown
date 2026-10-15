// Herramientas del estilo del juego: bloques con texturas de pocos pixeles.
// Las texturas se pintan con codigo (no hay archivos de imagen) y las formas se arman con cajas.
import * as THREE from '../vendor/three.module.js';
import { azar } from './noise.js';

// --- la paleta: todo color que se pinta pasa por aca, asi el mundo entero tiene el mismo aire ---
// Para F1, subimos levemente el contraste de los colores vivos (fuerza de autos) y el asfalto.
export const PALETA = { apagar: 0.28, polvo: [210, 205, 198], cuanto: 0.10, contraste: 0.94 };
const ajustados = new Map();
export function deLaPaleta(color, fuerza = 1) {
  if (!(fuerza > 0) || typeof color !== 'string' || color[0] !== '#' || color.length !== 7) return color;
  const clave = color + fuerza;
  let hecho = ajustados.get(clave);
  if (hecho) return hecho;
  const n = parseInt(color.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255], gris = 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2];
  hecho = '#' + c.map((v, i) => {
    v = gris + (v - gris) * (1 - PALETA.apagar * fuerza);                       // menos saturacion
    v = 128 + (v - 128) * (1 - (1 - PALETA.contraste) * fuerza);                // menos contraste
    v += (PALETA.polvo[i] - v) * PALETA.cuanto * fuerza;                        // el velo de polvo
    return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  }).join('');
  ajustados.set(clave, hecho);
  return hecho;
}

// --- pincel: pinta de a pixeles enteros sobre una zona de un lienzo ---
function pincel(x, w, h, semilla, fuerza = 1) {
  const r = azar(semilla || 1);
  const rect = (a, b, ancho, alto, color) => { x.fillStyle = deLaPaleta(color, fuerza); x.fillRect(Math.round(a), Math.round(b), Math.round(ancho), Math.round(alto)); };
  return {
    w, h, rect, azar: r,
    fondo: (color) => rect(0, 0, w, h, color),
    punto: (a, b, color) => rect(a, b, 1, 1, color),
    motas: (color, cuantas, ancho = 1, alto = 1) => { for (let i = 0; i < cuantas; i++) rect(Math.floor(r() * (w - ancho + 1)), Math.floor(r() * (h - alto + 1)), ancho, alto, color); },
    marco: (color) => { rect(0, 0, w, 1, color); rect(0, h - 1, w, 1, color); rect(0, 0, 1, h, color); rect(w - 1, 0, 1, h, color); },
  };
}

// Aclara (f > 0) u oscurece (f < 0) un color '#rrggbb'.
export function tono(color, f) {
  const n = parseInt(color.slice(1), 16), hacia = f > 0 ? 255 : 0, k = Math.abs(f);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v, i) => Math.round(v + (hacia - v) * k * (f < 0 ? [1.06, 1, 0.9][i] : [1, 0.96, 0.8][i])));
  return '#' + c.map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

function comoTextura(lienzo) {
  const t = new THREE.CanvasTexture(lienzo);
  t.magFilter = THREE.NearestFilter;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function lienzoPintado(w, h, pintar, semilla, fuerza = 1) {
  const lienzo = document.createElement('canvas');
  lienzo.width = w; lienzo.height = h;
  pintar(pincel(lienzo.getContext('2d'), w, h, semilla, fuerza));
  return lienzo;
}
export const textura = (w, h, pintar, semilla, fuerza) => comoTextura(lienzoPintado(w, h, pintar, semilla, fuerza));

// --- Neumáticos de F1 (slicks con marcas de compuesto e.g. rojo Pirelli) y asfalto de autódromo ---
// Añadimos patrones de pianos para el circuito, texturas de publicidad (red/white) y guardarraíles.
export const TEXTURAS_COMPETENCIA = {
  gomaF1Lateral: (p) => {
    p.fondo('#141416');
    // Neumático liso (slick) con la clásica banda circular roja de compuesto blando
    p.rect(1, 1, 6, 6, '#1a1a1c');
    p.rect(2, 2, 4, 4, '#dc1c2c'); // Línea roja (Pirelli Soft / F1 standard)
    p.rect(3, 3, 2, 2, '#141416');
    p.rect(3, 3, 2, 2, '#7e838c'); // Llanta metálica pequeña de perfil bajo
    p.punto(3, 3, '#101011'); p.punto(4, 4, '#101011');
  },
  gomaF1Banda: (p) => {
    p.fondo('#1a1a1c'); // Slick liso, sin dibujo, pero con marcas de desgaste por carrera
    for (let i = 0; i < 24; i += 6) {
      p.rect(i, 0, 1, 3, '#101011'); // Virutas de goma/desgaste
      p.rect(i + 3, 2, 1, 1, '#252528');
    }
  },
  pianoCurva: (p) => {
    p.fondo('#f2f3f5'); // Rojo y blanco alternado para los bordillos de pista (pianos)
    for (let i = 0; i < p.w; i += 8) {
      p.rect(i, 0, 4, p.h, '#e31b23');
    }
  },
  guardarrail: (p) => {
    p.fondo('#abb1b8'); // Texturas de contención metálicas en las curvas
    p.rect(0, 1, p.w, 1, '#dcdfe3');
    p.rect(0, 3, p.w, 1, '#7e858f');
    p.rect(0, p.h - 1, p.w, 1, '#535961');
  },
  publicidadF1: (p) => {
    p.fondo('#e31b23'); // Cartelería publicitaria de pista (Fórmula 1 clásica roja/blanca)
    for (let i = 0; i < p.w; i += 16) {
      p.rect(i + 1, 1, 6, 2, '#ffffff'); // Bloques que simulan letras pixeladas
      p.rect(i + 8, 2, 6, 1, '#ffffff');
    }
  }
};

export const glslPixel = (conParedes) => `
  vec3 dMx = dFdx(vMundo), dMy = dFdy(vMundo);
  ${conParedes ? `vec3 nMundo = abs(inverseTransformDirection(normalize(vNormal), viewMatrix));
  int plano = nMundo.y > 0.6 ? 0 : (nMundo.x > nMundo.z ? 1 : 2);` : 'const int plano = 0;'}
  vec2 enPlano = plano == 0 ? vMundo.xz : plano == 1 ? vMundo.zy : vMundo.xy;
  vec2 dxz = plano == 0 ? dMx.xz : plano == 1 ? dMx.zy : dMx.xy;
  vec2 dyz = plano == 0 ? dMy.xz : plano == 1 ? dMy.zy : dMy.xy;
  vec2 pix = floor(enPlano * 4.0);
  vec2 centroPlano = (pix + 0.5) * 0.25;
  float det = dxz.x * dyz.y - dxz.y * dyz.x;
  vec2 falta = centroPlano - enPlano;
  vec2 ab = abs(det) > 1e-10 ? clamp(vec2(falta.x * dyz.y - falta.y * dyz.x, dxz.x * falta.y - dxz.y * falta.x) / det, -80.0, 80.0) : vec2(0.0);
  #define EN_PIXEL(v) ((v) + ab.x * dFdx(v) + ab.y * dFdy(v))
  vec2 centro = plano == 0 ? centroPlano : EN_PIXEL(vMundo.xz);
`;
export const GLSL_AZAR = 'float azar12(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }';

export function crearAtlas(ancho, alto, fuerza = 1) {
  const lienzo = document.createElement('canvas');
  lienzo.width = ancho; lienzo.height = alto;
  const x = lienzo.getContext('2d'), lisas = {};
  let cx = 0, cy = 0, fila = 0, tex = null;
  function zona(w, h, pintar, semilla, fuerzaDeEsta = fuerza) {
    if (cx + w + 2 > ancho) { cx = 0; cy += fila; fila = 0; }
    if (cy + h + 2 > alto) throw new Error('No entra otra zona de ' + w + ' x ' + h + ' en el atlas');
    const z = { x: cx + 1, y: cy + 1, w, h };
    x.save(); x.beginPath(); x.rect(z.x, z.y, w, h); x.clip(); x.translate(z.x, z.y);
    pintar(pincel(x, w, h, semilla, fuerzaDeEsta));
    x.restore();
    x.drawImage(lienzo, z.x, z.y, w, 1, z.x, z.y - 1, w, 1); x.drawImage(lienzo, z.x, z.y + h - 1, w, 1, z.x, z.y + h, w, 1);
    x.drawImage(lienzo, z.x, z.y - 1, 1, h + 2, z.x - 1, z.y - 1, 1, h + 2); x.drawImage(lienzo, z.x + w - 1, z.y - 1, 1, h + 2, z.x + w, z.y - 1, 1, h + 2);
    cx += w + 2; fila = Math.max(fila, h + 2);
    return z;
  }
  return {
    lienzo, ancho, alto, zona,
    liso: (color) => lisas[color] || (lisas[color] = zona(1, 1, (p) => p.fondo(color))),
    textura: () => tex || (tex = comoTextura(lienzo)),
  };
}

export const CARAS = { px: [7, 3, 1, 5], nx: [2, 6, 4, 0], py: [2, 3, 7, 6], ny: [1, 0, 4, 5], pz: [6, 7, 5, 4], nz: [3, 2, 0, 1] };

export function crearLote() {
  const pos = [], nor = [], uv = [], idx = [];
  const E = [0, 1, 2, 3, 4, 5, 6, 7].map(() => new THREE.Vector3()), A = new THREE.Vector3(), B = new THREE.Vector3();
  function cara(p, t) {
    const base = pos.length / 3, mu = (t[0] + t[2] + t[4] + t[6]) / 4, mv = (t[1] + t[3] + t[5] + t[7]) / 4;
    A.subVectors(p[3], p[0]).cross(B.subVectors(p[2], p[0])).normalize();
    for (let i = 0; i < 4; i++) {
      pos.push(p[i].x, p[i].y, p[i].z); nor.push(A.x, A.y, A.z);
      uv.push(t[i * 2] + Math.sign(mu - t[i * 2]) * 0.02, t[i * 2 + 1] + Math.sign(mv - t[i * 2 + 1]) * 0.02);
    }
    idx.push(base, base + 3, base + 2, base, base + 2, base + 1);
  }
  function caja(m, d, lugar, cuña = 0, cuñaAtras = 0) {
    for (let k = 0; k < 8; k++) E[k].set(k & 1 ? d[3] : d[0], k & 2 ? d[4] : d[1], k & 4 ? d[5] : d[2]);
    E[2].z += cuña; E[3].z += cuña; E[6].z -= cuñaAtras; E[7].z -= cuñaAtras;
    const W = E.map((e) => e.clone().applyMatrix4(m));
    for (const nombre in CARAS) {
      const t = [];
      for (const k of CARAS[nombre]) { const l = lugar(nombre, E[k]); if (!l) { t.length = 0; break; } t.push(l[0], l[1]); }
      if (t.length) cara(CARAS[nombre].map((k) => W[k]), t);
    }
  }
  function bloque(m, d, zonas, rnd, cuña = 0, cuñaAtras = 0) {
    const corr = {};
    caja(m, d, (nombre, e) => {
      const z = nombre === 'py' ? zonas.arriba : nombre === 'ny' ? (zonas.abajo === undefined ? zonas.arriba : zonas.abajo) : nombre in zonas ? zonas[nombre] : zonas.lados;
      if (!z) return null;
      const lado = Math.min(z.w, nombre[1] === 'x' ? d[5] - d[2] : d[3] - d[0]), alto = Math.min(z.h, nombre[1] === 'y' ? d[5] - d[2] : d[4] - d[1]);
      if (!corr[nombre]) corr[nombre] = [Math.floor((rnd ? rnd() : 0) * (z.w - lado + 1)), Math.floor((rnd ? rnd() : 0) * (z.h - alto + 1))];
      const i = CARAS[nombre].findIndex((k) => E[k] === e);
      return [z.x + corr[nombre][0] + (i === 1 || i === 2 ? lado : 0), z.y + corr[nombre][1] + (i >= 2 ? alto : 0)];
    }, cuña, cuñaAtras);
  }
  function geometria(atlas) {
    const g = new THREE.BufferGeometry(), t = new Float32Array(uv.length);
    for (let i = 0; i < uv.length; i += 2) { t[i] = uv[i] / atlas.ancho; t[i + 1] = 1 - uv[i + 1] / atlas.alto; }
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(t, 2));
    g.setIndex(idx);
    return g;
  }
  return { cara, caja, bloque, geometria, vacio: () => idx.length === 0 };
}