import { playSound } from '../config/sounds.js';
import { listen } from '../utils/sceneEvents.js';

/**
 * Traduce los eventos del nivel a efectos de sonido.
 * No conoce la lógica del juego: solo escucha lo que otros sistemas avisan.
 */
export class SoundEffects {
    constructor(scene) {
        this.scene = scene;

        const reactions = {
            'dog-bark': () => this.play('bark'),
            'dog-growl': () => this.play('growl'),
            'bone-collected': () => this.play('bone'),
            'points-awarded': ({ points }) => points < 0 && this.play('penalty'),
            'dog-injured': ({ cause }) => this.onDogInjured(cause),
            'hazard-resolved': (result) => this.onHazardResolved(result)
        };

        Object.entries(reactions).forEach(([event, reaction]) => listen(scene, event, reaction));
    }

    onDogInjured(cause) {
        this.play('whine');
        if (cause === 'electric' || cause === 'dogCatcher') {
            this.play('zap');
        }
    }

    onHazardResolved({ hurt, saved }) {
        this.play('thunder');
        if (hurt.length > 0) {
            this.play('hurt');
        }
        if (saved.length > 0) {
            this.play('rescue');
        }
    }

    play(name) {
        playSound(this.scene, name);
    }
}
