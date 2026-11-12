import { DOG } from '../config/balance.js';
import { SPRITES } from '../config/sprites.js';
import { setCircleBody } from '../utils/physicsBody.js';

/**
 * El rescatista con piloto impermeable amarillo: el personaje que controla el jugador.
 */
export class Dog extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'rescuer');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(SPRITES.rescuer.scale);
        this.setCollideWorldBounds(true);
        setCircleBody(this, DOG.bodyRadius);
        this.isDashing = false;
        this.invulnerableUntil = 0;
    }

    /**
     * Intenta lastimar al rescatista. Devuelve false si todavía está
     * en su período de invulnerabilidad después del último golpe.
     */
    takeHit() {
        const now = this.scene.time.now;
        if (now < this.invulnerableUntil) {
            return false;
        }
        this.invulnerableUntil = now + DOG.invulnerableTime;
        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: Math.floor(DOG.invulnerableTime / 200) - 1,
            onComplete: () => this.setAlpha(1)
        });
        return true;
    }

    startDash() {
        this.isDashing = true;
    }

    endDash() {
        this.isDashing = false;
        this.setVelocity(0, 0);
    }

    /**
     * Mueve al rescatista según un vector de dirección con largo entre 0 y 1.
     * Durante la embestida el movimiento lo controla DashSystem.
     */
    move(direction) {
        if (this.isDashing) {
            return;
        }
        this.setVelocity(direction.x * DOG.speed, direction.y * DOG.speed);

        if (direction.lengthSq() > 0) {
            this.setRotation(direction.angle());
        }
    }
}
