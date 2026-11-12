import { PERSON } from '../config/balance.js';
import { SPRITES, PERSON_SKINS } from '../config/sprites.js';
import { setCircleBody } from '../utils/physicsBody.js';

const CONDITION = {
    WALKING: 'walking',
    PUSHED: 'pushed',
    HURT: 'hurt'
};

/**
 * Peatón distraído que camina bajo la lluvia sin notar la estática del rayo.
 * Puede ser empujado por el rescatista o alcanzado por un relámpago.
 */
export class Person extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        const skin = Phaser.Utils.Array.GetRandom(PERSON_SKINS);
        super(scene, x, y, skin);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(SPRITES[skin].scale);
        setCircleBody(this, PERSON.bodyRadius);

        this.condition = CONDITION.WALKING;
        this.nextDecisionAt = 0;
        this.lastPushedAt = -Infinity;
    }

    isActive() {
        return this.condition !== CONDITION.HURT;
    }

    isBeingPushed() {
        return this.condition === CONDITION.PUSHED;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.condition === CONDITION.PUSHED && this.body.speed < PERSON.speed) {
            this.condition = CONDITION.WALKING;
            this.body.setDrag(0, 0);
            this.nextDecisionAt = 0;
        }

        if (this.condition === CONDITION.WALKING && time >= this.nextDecisionAt) {
            this.decideNextMove(time);
        }

        if (this.isActive() && this.body.speed > 1) {
            this.setRotation(this.body.velocity.angle());
        }
    }

    decideNextMove(time) {
        if (Math.random() < PERSON.pauseChance) {
            this.setVelocity(0, 0);
        } else {
            const direction = new Phaser.Math.Vector2(1, 0).rotate(Math.random() * Math.PI * 2);
            this.setVelocity(direction.x * PERSON.speed, direction.y * PERSON.speed);
        }
        this.nextDecisionAt = time + Phaser.Math.Between(PERSON.decisionMinTime, PERSON.decisionMaxTime);
    }

    /**
     * Aplica un empujón: una velocidad que se va frenando sola.
     */
    push(velocity) {
        if (!this.isActive()) {
            return;
        }
        this.condition = CONDITION.PUSHED;
        this.lastPushedAt = this.scene.time.now;
        this.body.setDrag(PERSON.pushDrag, PERSON.pushDrag);
        this.setVelocity(velocity.x, velocity.y);
    }

    hurt() {
        this.condition = CONDITION.HURT;
        this.setVelocity(0, 0);
        this.body.enable = false;
        this.setTint(0x282828);
        this.setAngle(this.angle + 90);

        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            delay: PERSON.hurtFadeDelay,
            duration: 400,
            onComplete: () => this.destroy()
        });
    }
}
