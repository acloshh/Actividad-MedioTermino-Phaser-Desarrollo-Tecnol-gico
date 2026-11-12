import { loadSounds } from '../config/sounds.js';
import { DEBUG_START_SCENE } from '../utils/debugParams.js';

/**
 * Primera escena: precarga los recursos compartidos por todo el juego
 * (sonidos) y después pasa al menú, o a la escena pedida por URL al depurar.
 */
export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        loadSounds(this);
    }

    create() {
        if (DEBUG_START_SCENE) {
            window.__game = this.game;
        }
        this.scene.start(DEBUG_START_SCENE || 'MenuScene');
    }
}
