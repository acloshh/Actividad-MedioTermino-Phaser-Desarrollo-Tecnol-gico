import { DOG_CATCHER } from '../config/balance.js';
import { SPRITES } from '../config/sprites.js';
import { setCircleBody } from '../utils/physicsBody.js';

const BODY_RADIUS = 17;

/**
 * Dron de Tormenta / Esfera Eléctrica: NPC enemigo no controlado por el jugador
 * en el Nivel 3. Patrulla al azar cambiando de dirección cada tanto.
 * Si toca al rescatista, lo electrocuta y le quita una vida.
 */
export class DogCatcher extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, settings) {
        super(scene, x, y, 'stormDrone');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = settings.speed;
        this.nextTurnAt = 0;

        this.setScale(SPRITES.stormDrone.scale).setDepth(10);
        this.setCollideWorldBounds(true);
        this.setBounce(1);
        setCircleBody(this, BODY_RADIUS);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (time >= this.nextTurnAt) {
            const direction = new Phaser.Math.Vector2(1, 0).rotate(Math.random() * Math.PI * 2);
            this.setVelocity(direction.x * this.speed, direction.y * this.speed);
            this.nextTurnAt = time + Phaser.Math.Between(DOG_CATCHER.turnMinTime, DOG_CATCHER.turnMaxTime);
        }

        this.angle += delta * 0.22;
    }
}
