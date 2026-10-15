// F1 SHAKEDOWN - Configuración del juego.
// CONFIG: alias de compatibilidad para referencia.js (importa CONFIG.GRAVITY).
export const CONFIG = { GRAVITY: 9.81 };
// Misma base física que Shakedown (rally), con autos de Fórmula 1.

// Suelos. agarre: cuanto se prende la cubierta (1 = firme y seco).
// suelto: cuanto de costado tiene que ir el auto para que la cubierta agarre todo.
// freno: resistencia a rodar. pasta: frena más cuanto más rápido vas.
// rugoso: [alto de los pozos en metros, distancia entre pozos]. blando: cuanto marca huella.
// polvo: cuanto polvo levanta en seco (0 = nada).
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

// --- Autos de Fórmula 1 ---
// La física es la misma que en Shakedown (rally), adaptada para F1:
// - Alta carga aerodinámica (empuje fuerte, aire alto, cubiertas de alta prestación)
// - Tracción trasera (como un F1 real)
// - Suspensión rígida, poco recorrido
// - Frenos de carbono: más fuerza, más adelante
// - Mucho más rápido que un auto de rally: potencia alta, deriva baja (el asfalto agarra enseguida)
const COMUN_F1 = {
  // Frenos de carbono F1: fuerza máxima enorme, balance muy adelante
  frenos: 2.2, frenoAdelante: 0.78, reversa: 0.3, aceleraEn: 0.02, giroVel: 2, patinaje: 0.20,
  // Deriva baja: en asfalto un F1 casi no derrapa, agarra enseguida
  deriva: 0.07, firme: 0.7, colaFirme: 1.08, alinea: 0.45, giroFino: 0.18, estable: 0.55,
  chasis: [180000, 12000, 0.4],
  roce: 0.28,
};

export const AUTOS = {
  // Auto rápido: F1 actual, tracción trasera, mucho downforce, muy ágil
  vitarita: Object.assign({}, COMUN_F1, {
    nombre: 'F1 Moderno', detalle: 'tracción trasera, alto downforce', emoji: '🏎️', modelo: 'vitarita',
    masa: 1200,
    inercia: [700, 800, 200],
    ejes: 1.65, trocha: 0.75, radio: 0.33,
    anclaje: 0.02, centro: -0.1,          // centro de masa más atrás (motor trasero)
    resorteLargo: 0.3, recorrido: 0.12, resorte: 52000, amortigua: [2000, 2000],
    // Downforce: empuje alto + mucho aire = más agarre a velocidad (como un F1 real)
    empuje: 60, potencia: 600000, aire: 4,
    traccion: [0, 1],                      // tracción 100% trasera
    frenoMotor: 0.12,
    cubiertas: [3.5, 0.85],              // excelente en asfalto, pésimo en tierra
    giro: 0.22, lateral: 0.55, alturaLateral: 0.85,
    caja: [0.75, 2.2, -0.25, 0.55], choque: [0.72, 1.4],
  }),
  // Auto más manejable: F1 de los años 80, menos downforce, más fácil de llevar
  kacito: Object.assign({}, COMUN_F1, {
    nombre: 'F1 Clásico', detalle: 'de los 80s, menos downforce, más fácil', emoji: '🏁', modelo: 'kacito',
    masa: 540,
    inercia: [680, 700, 220],
    ejes: 1.55, trocha: 0.72, radio: 0.31,
    anclaje: 0.02, centro: -0.08,
    resorteLargo: 0.32, recorrido: 0.14, resorte: 38000, amortigua: [3500, 4800],
    empuje: 0.95, potencia: 380000, aire: 5.8,
    traccion: [0, 1],
    frenoMotor: 0.18,
    cubiertas: [1.12, 0.82],
    giro: 0.48, lateral: 0.48, alturaLateral: 0.78,
    caja: [0.72, 2.0, -0.22, 0.52], choque: [0.70, 1.35],
    // Menos estable que el moderno: más divertido pero más complicado
    colaFirme: 1.02, estable: 0.38,
  }),
};

// con que auto se calcula el tiempo de referencia de cada pista
export const REFERENCIA = 'vitarita';

// La ayuda de manejo: adaptada para F1 (frena con más fuerza, sigue la trazada más ajustado)
export const AYUDA = {
  auto: { firme: 0.85, estable: 1.2, alinea: 0.9 },
  ritmo: 0.72, frena: 5.5, suave: 3.2, suelta: 0.4,
  volante: 1, cede: 0.65, mano: 2.8, mira: 0.25,
};

// Servidor del juego
export const SERVIDOR = 'https://shakedown.juanmcomparini.workers.dev';

// En que anda el juego y quien lo hace.
export const FIRMA = { etapa: 'Early Access', aviso: 'App en desarrollo', autor: 'Juan M. Comparini' };

// La configuración que puede tocar cada uno
export const GUSTOS = { ayuda: false, trazada: false, sensible: 55, botones: false, lejos: 1, pedales: 1, efectos: true, sonido: true, voz: true };
export const gradosDeInclinacion = (sensible) => 24 * 2 ** ((55 - sensible) / 55);

// Cámaras
export const CAMARAS = [
  { id: 'aerea',  nombre: 'Aérea',        dist: [46, 74], alto: [60, 47], fov: 30, sigue: 0.8, mira: [3, 20], celu: { parado: [0.52, 0.43], acostado: [0.54, 0.46] } },
  { id: 'atras',  nombre: 'De atrás',     dist: [9, 14],  alto: [20, 16], fov: 58, sigue: 0.3, mira: [2, 6], celu: { parado: [1.2, 1.12], acostado: [1.05, 0.95] }, fovParado: 68 },
  { id: 'arriba', nombre: 'Desde arriba', dist: [74, 104], alto: [78, 76], fov: 30, sigue: 1.0, mira: [5, 21], celu: { parado: [0.62, 0.58], acostado: [0.62, 0.56] } },
];

export const JUEGO = {
  paso: 1 / 120,
  gravedad: 9.81,
  cuenta: 3,
  penalizacion: 8,
  afuera: 26,
  maximo: 480,
  golpes: { desde: 5, porMetro: 3.3 },
  sectores: { verde: 1.3, amarillo: 1.6 },
};
