/**
 * Valores ajustables del juego. Cambiar acá para balancear sin tocar la lógica.
 * Velocidades en píxeles por segundo, tiempos en milisegundos.
 */
export const GAME = {
    startingLives: 3,
    levelDurations: { level1: 45, level2: 60, level3: 75 },
    rescueTargets: { level1: 3, level2: 5, level3: 7 }
};

export const SCORE = {
    rescue: 100,
    battery: 15,
    umbrella: -25,
    unnecessaryPush: -20,
    pushedIntoDanger: -50
};

export const DOG = {
    speed: 210,
    bodyRadius: 17,
    invulnerableTime: 1500
};

export const BONES = {
    spawnInterval: 4500,
    maxOnScreen: 3,
    umbrellaInterval: 6500,
    maxUmbrellas: 2
};

export const DOG_CATCHER = {
    turnMinTime: 800,
    turnMaxTime: 2000
};

export const PERSON = {
    speed: 45,
    bodyRadius: 13,
    decisionMinTime: 1200,
    decisionMaxTime: 3500,
    pauseChance: 0.35,
    pushDrag: 500,
    hurtFadeDelay: 1200,
    respawnDelay: 1800,
    clickTolerance: 36
};

export const HAZARD = {
    fallDuration: 240,
    startScaleFactor: 2.3,
    debrisLinger: 750,
    playAreaMargin: 50,
    targetOffset: 14
};

export const BARK = {
    radius: 225,
    maxForce: 430,
    cooldown: 350,
    ringDuration: 300
};

export const DASH = {
    speed: 660,
    pushForce: 530,
    cooldown: 1400,
    maxDuration: 450,
    contactPadding: 6,
    recoilSpeed: 380,
    recoilDuration: 220
};

export const JOYSTICK = {
    baseRadius: 60,
    thumbRadius: 26,
    margin: 30,
    captureRadiusFactor: 1.6
};
