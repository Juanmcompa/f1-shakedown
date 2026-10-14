export const CONFIG = {
    // Physics
    GRAVITY: 9.81,
    TIME_STEP: 1/60,

    // F1 Vehicle Specs
    MAX_SPEED: 340, // km/h
    ACCELERATION: 18.0, // m/s^2
    BRAKING_FORCE: -30.0,

    // Aero & Grip
    BASE_GRIP: 1.1,
    DOWNFORCE_COEFF: 0.006,
    LATERAL_GRIP_LIMIT: 2.8,

    // Circuit
    TRACK_WIDTH: 15,
    CURB_WIDTH: 2.0,
    SEGMENTS_COUNT: 30, // How many waypoints the daily circuit has

    // Controls
    SENSITIVITY: 1.0,
};
