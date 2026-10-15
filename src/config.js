// F1 SHAKEDOWN - Configuration
// Fusion of simulation parameters and surface physics.

// 1. Simulation & Vehicle Constants
export const CONFIG = {
    GRAVITY: 9.81,
    TIME_STEP: 1/60,
    MAX_SPEED: 340, // km/h
    ACCELERATION: 18.0, // m/s^2,
    BRAKING_FORCE: -30.0,
    BASE_GRIP: 1.1,
    DOWNFORCE_COEFF: 0.006,
    LATERAL_GRIP_LIMIT: 2.8,
    TRACK_WIDTH: 15,
    CURB_WIDTH: 2.0,
    SEGMENTS_COUNT: 30,
    NUM_SECTORS: 3,
    SENSITIVITY: 1.0,
};

// 2. Surface Physics (Suelos)
export const SUELOS = {
    asfalto: { id: 0, nombre: 'Asfalto', agarre: 0.95, suelto: 1.0, freno: 0.015, pasta: 0,  rugoso: [0.0, 3],    blando: 0,   polvo: 0.05, color: 0x55565c },
    ripio:   { id: 1, nombre: 'Ripio',   agarre: 0.72, suelto: 2.9, freno: 0.035, pasta: 0,  rugoso: [0.04, 3],   blando: 0.3, polvo: 1,    color: 0xc2ab84 },
    tierra:  { id: 2, nombre: 'Tierra',  agarre: 0.76, suelto: 2.7, freno: 0.045, pasta: 0,  rugoso: [0.05, 4],   blando: 0.5, polvo: 0.9,  color: 0xa4572f },
    roca:    { id: 3, nombre: 'Roca',    agarre: 0.86, suelto: 1.5, freno: 0.03,  pasta: 0,  rugoso: [0.09, 2.7], blando: 0,   polvo: 0.25, color: 0x8f8b85 },
    pasto:   { id: 4, nombre: 'Pasto',   agarre: 0.52, suelto: 3.2, freno: 0.09,  pasta: 12, rugoso: [0.12, 3.5], blando: 0.6, polvo: 0.12, color: 0x5f8f3c },
    barro:   { id: 5, nombre: 'Barro',   agarre: 0.46, suelto: 3.3, freno: 0.06,  pasta: 9,  rugoso: [0.06, 5],   blando: 1,   polvo: 0,    color: 0x7d3a20 },
    pantano: { id: 6, nombre: 'Pantano', agarre: 0.36, suelto: 3.4, freno: 0.1,   pasta: 60, rugoso: [0.05, 4],   blando: 1,   polvo: 0,    color: 0x4a2414 },
    lecho:   { id: 7, nombre: 'Agua',    agarre: 0.62, suelto: 2.8, freno: 0.06,  pasta: 25, rugoso: [0.08, 2.6], blando: 0.2, polvo: 0,    color: 0x8d8a76 },
    charco:  { id: 8, nombre: 'Charco',  agarre: 0.5,  suelto: 3.0, freno: 0.06,  pasta: 45, rugoso: [0.03, 4],   blando: 0.9, polvo: 0,    color: 0x7c8f94 },
    vereda:  { id: 9,  nombre: 'Vereda',  agarre: 0.9,  suelto: 1.0, freno: 0.02,  pasta: 0,  rugoso: [0.0, 3],     blando: 0,   polvo: 0.03, color: 0xb9b4a8 },
    adoquin: { id: 10, nombre: 'Adoquín', agarre: 0.84, suelto: 1.2, freno: 0.03,  pasta: 0,  rugoso: [0.022, 1.3], blando: 0,   polvo: 0.04, color: 0x77726a },
    madera:  { id: 11, nombre: 'Madera',  agarre: 0.8,  suelto: 1.2, freno: 0.03,  pasta: 0,  rugoso: [0.012, 1.1], blando: 0,   polvo: 0.02, color: 0x8a6f52 },
};

export const SUELO = Object.values(SUELOS);

// --- Compatibilidad y Valores Globales ---
export const AYUDA = { auto: { firme: 0.8, estable: 1.1, alinea: 0.85 }, ritmo: 0.7, frena: 3.6, suave: 2.5, suelta: 0.5, volante: 1, cede: 0.6, mano: 2.6, mira: 0.3 };
export const GUSTOS = { ayuda: false, trazada: false, sensible: 55, botones: false, lejos: 1, pedales: 1, efectos: true, sonido: true, voz: true };
export const SERVIDOR = 'https://shakedown.juanmcomparini.workers.dev';
export const FIRMA = { etapa: 'Early Access', aviso: 'App en desarrollo', autor: 'Juan M. Comparini' };

export const JUEGO = {
    paso: CONFIG.TIME_STEP,
    gravedad: CONFIG.GRAVITY,
    cuenta: 3,
    penalizacion: 8,
    afuera: 26,
    maximo: 480,
    golpes: { desde: 5, porMetro: 3.3 },
    sectores: { verde: 1.3, amarillo: 1.6 },
};

export const gradosDeInclinacion = (sensible) => 24 * 2 ** ((55 - sensible) / 55);

export const CAMARAS = [
  { id: 'aerea',  nombre: 'Aérea',        dist: [46, 74], alto: [60, 47], fov: 30, sigue: 0.8, mira: [3, 20], celu: { parado: [0.52, 0.43], acostado: [0.54, 0.46] } },
  { id: 'atras',  nombre: 'De atrás',     dist: [9, 14],  alto: [20, 16], fov: 58, sigue: 0.3, mira: [2, 6], celu: { parado: [1.2, 1.12], acostado: [1.05, 0.95] }, fovParado: 68 },
  { id: 'arriba', nombre: 'Desde arriba', dist: [74, 104], alto: [78, 76], fov: 30, sigue: 1.0, mira: [5, 21], celu: { parado: [0.62, 0.58], acostado: [0.62, 0.56] } },
];

// --- Autos (Rescatados de encajados para evitar errores de export) ---
const COMUN = {
  frenos: 0.95, frenoAdelante: 0.7, reversa: 0.5, aceleraEn: 0.3, giroVel: 3.2, patinaje: 0.7,
  deriva: 0.11, firme: 0.5, colaFirme: 1.03, alinea: 0.6, giroFino: 0.26, estable: 0.3,
  chasis: [150000, 9000, 0.5], roce: 0.35,
};

export const AUTOS = {
  vitarita: Object.assign({}, COMUN, {
    nombre: 'La Vitarita', detalle: '4x4 del 92, corta y levantada', emoji: '🚙', modelo: 'vitarita',
    masa: 1080, inercia: [1420, 1420, 490], ejes: 1.1, trocha: 0.72, radio: 0.37, anclaje: 0.05, centro: 0.05,
    resorteLargo: 0.5, recorrido: 0.3, resorte: 21000, amortigua: [2400, 3500],
    empuje: 0.6, potencia: 66000, aire: 3.4, traccion: [0.5, 0.5], frenoMotor: 0.12, cubiertas: [0.97, 1.06],
    giro: 0.58, lateral: 0.3, alturaLateral: 0.42,
    caja: [0.8, 1.8, -0.4, 1.0], choque: [0.85, 1.05],
  }),
  kacito: Object.assign({}, COMUN, {
    nombre: 'El Kacito', detalle: 'chiquito, tracción delantera y chapón', emoji: '🚗', modelo: 'kacito',
    masa: 900, inercia: [1200, 1230, 390], ejes: 1.22, trocha: 0.7, radio: 0.29, anclaje: 0.05, centro: 0.2,
    resorteLargo: 0.4, recorrido: 0.22, resorte: 20500, amortigua: [2150, 3150],
    empuje: 0.64, potencia: 64000, aire: 2.1, traccion: [1, 0], frenoMotor: 0.1, cubiertas: [1.08, 1],
    giro: 0.6, lateral: 0.34, alturaLateral: 0.68,
    caja: [0.8, 1.8, -0.3, 0.85], choque: [0.85, 1.05],
  }),
};

export const REFERENCIA = 'vitarita';
