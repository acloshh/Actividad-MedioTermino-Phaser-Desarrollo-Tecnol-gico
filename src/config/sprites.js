/**
 * Imágenes del juego: clave de textura → archivo y escala con la que se dibuja.
 * Sprites propios generados para la temática de tormenta eléctrica.
 */
const IMAGE_PATH = 'assets/images/';

export const SPRITES = {
    floorTile: { file: 'floor.png', scale: 1 },
    rescuer: { file: 'rescuer.png', scale: 1.05 },
    lightningBolt: { file: 'lightning-bolt.png', scale: 1 },
    scorch: { file: 'scorch.png', scale: 1 },
    battery: { file: 'battery.png', scale: 1 },
    metalUmbrella: { file: 'metal-umbrella.png', scale: 1 },
    barrier: { file: 'barrier.png', scale: 1.2 },
    cementBlock: { file: 'cement-block.png', scale: 1.15 },
    stormDrone: { file: 'storm-drone.png', scale: 1.15 },
    personBlue: { file: 'person-blue.png', scale: 0.95 },
    personBrown: { file: 'person-brown.png', scale: 0.95 },
    personOld: { file: 'person-old.png', scale: 0.95 },
    personGreen: { file: 'person-green.png', scale: 0.95 },
    personSurvivor: { file: 'person-survivor.png', scale: 0.95 }
};

/** Variantes de peatones bajo la lluvia: cada uno elige una al azar. */
export const PERSON_SKINS = ['personBlue', 'personBrown', 'personOld', 'personGreen', 'personSurvivor'];

export function loadSprites(scene) {
    Object.entries(SPRITES).forEach(([key, { file }]) => {
        scene.load.image(key, IMAGE_PATH + file);
    });
}
