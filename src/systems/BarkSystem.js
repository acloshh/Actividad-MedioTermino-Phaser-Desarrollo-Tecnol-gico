import { BARK } from '../config/balance.js';
import { showFloatingText } from '../utils/floatingText.js';

/**
 * Silbato / Megáfono: lanza una onda expansiva que aleja a todos los peatones
 * cercanos desde la posición del rescatista. Cuanto más lejos está alguien,
 * menor es la fuerza del desplazamiento.
 */
export class BarkSystem {
    constructor(scene, dog, crowd) {
        this.scene = scene;
        this.dog = dog;
        this.crowd = crowd;
        this.readyAt = 0;
    }

    tryBark() {
        const now = this.scene.time.now;
        if (now < this.readyAt) {
            return false;
        }
        this.readyAt = now + BARK.cooldown;

        this.crowd.getActivePeople().forEach((person) => this.pushAway(person));
        this.showBarkEffect();
        this.scene.events.emit('dog-bark');
        return true;
    }

    pushAway(person) {
        const offset = new Phaser.Math.Vector2(person.x - this.dog.x, person.y - this.dog.y);
        const distance = offset.length();
        if (distance > BARK.radius) {
            return;
        }

        const direction = distance > 0 ? offset.normalize() : new Phaser.Math.Vector2(1, 0);
        const strength = BARK.maxForce * (1 - distance / BARK.radius);
        person.push(direction.scale(strength));
        this.scene.events.emit('person-pushed', { person, source: 'bark' });
    }

    showBarkEffect() {
        const ring = this.scene.add.circle(this.dog.x, this.dog.y, BARK.radius)
            .setStrokeStyle(4, 0x5ce1e6, 1)
            .setScale(0.1)
            .setDepth(9);

        this.scene.tweens.add({
            targets: ring,
            scale: 1,
            alpha: 0,
            duration: BARK.ringDuration,
            ease: 'Quad.easeOut',
            onComplete: () => ring.destroy()
        });

        showFloatingText(this.scene, this.dog.x, this.dog.y - 30, '¡PIII!', '#5ce1e6');
    }
}
