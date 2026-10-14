// F1 SHAKEDOWN - Configuration
// Fusion of simulation parameters and surface physics.

// 1. Simulation & Vehicle Constants
export const CONFIG = {
    GRAVITY: 9.81,
    TIME_STEP: 1/60,
    MAX_SPEED: 340, // km/h
    ACCELERATION: 18.0, // m/s^2
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
