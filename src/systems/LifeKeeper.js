import { GameState } from './GameState.js';
import { listen } from '../utils/sceneEvents.js';

/**
 * Reglas de vidas. Las vidas son compartidas: se pierde una cuando
 * se lastima el perrito o cuando se lastima una persona.
 * Emite 'dog-injured' cuando el perrito recibe un golpe
 * y 'out-of-lives' al llegar a cero.
 */
export class LifeKeeper {
    constructor(scene, dog) {
        this.scene = scene;
        this.dog = dog;

        listen(scene, 'hazard-resolved', this.onHazardResolved, this);
        listen(scene, 'dog-hurt', this.onDogHurt, this);
    }

    onHazardResolved({ hurt, dogHit }) {
        const dogLostLife = dogHit && this.hitDog('crate');
        this.lose(hurt.length + Number(dogLostLife));
    }

    onDogHurt({ cause }) {
        if (this.hitDog(cause)) {
            this.lose(1);
        }
    }

    hitDog(cause) {
        const wasHit = this.dog.takeHit();
        if (wasHit) {
            this.scene.events.emit('dog-injured', { cause });
        }
        return wasHit;
    }

    lose(amount) {
        if (amount <= 0 || this.scene.isFinished) {
            return;
        }
        const lives = GameState.loseLives(this.scene.registry, amount);
        this.scene.cameras.main.flash(200, 255, 60, 60);

        if (lives === 0) {
            this.scene.events.emit('out-of-lives');
        }
    }
}
