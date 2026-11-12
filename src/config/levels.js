import { GAME } from './balance.js';

/**
 * Datos de cada nivel. Las escenas de nivel comparten la lógica de BaseLevelScene
 * y solo se diferencian por estos valores. La dificultad sube de nivel en nivel:
 * más peatones, rayos más seguidos, menor tiempo de advertencia, más charcos
 * electrificados, obstáculos y el Dron de Tormenta en el nivel final.
 */
export const LEVELS = {
    level1: {
        sceneKey: 'Level1Scene',
        nextScene: 'Level2Scene',
        title: 'Nivel 1 · Plaza Lluviosa',
        duration: GAME.levelDurations.level1,
        targetRescues: GAME.rescueTargets.level1,
        floorTint: 0x9bb0c9,
        rainDrops: 45,
        dogStart: { x: 480, y: 300 },
        people: { count: 5 },
        hazards: {
            spawnInterval: 2500,
            warningTime: 1800,
            maxActive: 2,
            radius: 36,
            targetPersonChance: 0.75
        },
        cables: [
            { x: 150, y: 450, width: 90, height: 34 }
        ]
    },

    level2: {
        sceneKey: 'Level2Scene',
        nextScene: 'Level3Scene',
        title: 'Nivel 2 · Avenida Inundada',
        duration: GAME.levelDurations.level2,
        targetRescues: GAME.rescueTargets.level2,
        floorTint: 0x829ab8,
        rainDrops: 70,
        dogStart: { x: 480, y: 300 },
        people: { count: 7 },
        hazards: {
            spawnInterval: 1950,
            warningTime: 1500,
            maxActive: 3,
            radius: 37,
            targetPersonChance: 0.8
        },
        obstacles: [
            { x: 280, y: 180, type: 'barrier' },
            { x: 700, y: 400, type: 'cementBlock' }
        ],
        cables: [
            { x: 820, y: 170, width: 100, height: 32 },
            { x: 180, y: 430, width: 95, height: 32 }
        ]
    },

    level3: {
        sceneKey: 'Level3Scene',
        nextScene: 'VictoryScene',
        title: 'Nivel 3 · Epicentro Eléctrico',
        duration: GAME.levelDurations.level3,
        targetRescues: GAME.rescueTargets.level3,
        floorTint: 0x6b82a6,
        rainDrops: 95,
        dogStart: { x: 480, y: 260 },
        people: { count: 8 },
        hazards: {
            spawnInterval: 1550,
            warningTime: 1250,
            maxActive: 4,
            radius: 38,
            targetPersonChance: 0.85
        },
        obstacles: [
            { x: 250, y: 160, type: 'barrier' },
            { x: 710, y: 160, type: 'barrier' },
            { x: 300, y: 430, type: 'cementBlock' },
            { x: 660, y: 430, type: 'cementBlock' },
            { x: 480, y: 380, type: 'barrier' }
        ],
        cables: [
            { x: 110, y: 300, width: 38, height: 155 },
            { x: 850, y: 300, width: 38, height: 155 }
        ],
        dogCatcher: { x: 860, y: 480, speed: 95 }
    }
};
