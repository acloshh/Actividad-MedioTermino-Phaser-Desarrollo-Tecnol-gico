import { DASH } from '../config/balance.js';

const COOLDOWN_RING_RADIUS = 28;

/**
 * Embestida: el perrito corre hacia una persona y la empuja en la dirección
 * que va desde donde estaba el perrito hasta la persona.
 * Al chocar rebota hacia atrás, así ni él ni la persona quedan bajo la caja.
 * Después queda en espera: durante ese tiempo solo puede moverse y ladrar.
 */
export class DashSystem {
    constructor(scene, dog) {
        this.scene = scene;
        this.dog = dog;
        this.target = null;
        this.recoilEndsAt = 0;
        this.isRecoiling = false;
        this.readyAt = 0;
        this.cooldownRing = scene.add.graphics().setDepth(11);
    }

    isReady() {
        return this.target === null && !this.isRecoiling && this.scene.time.now >= this.readyAt;
    }

    tryDash(person) {
        if (!this.isReady()) {
            return false;
        }
        this.pushDirection = new Phaser.Math.Vector2(person.x - this.dog.x, person.y - this.dog.y).normalize();
        if (this.pushDirection.lengthSq() === 0) {
            this.pushDirection.set(1, 0);
        }
        this.target = person;
        this.dashEndsAt = this.scene.time.now + DASH.maxDuration;
        this.dog.startDash();
        this.scene.events.emit('dog-growl');
        return true;
    }

    update() {
        if (this.target !== null) {
            this.chaseTarget();
        } else if (this.isRecoiling && this.scene.time.now >= this.recoilEndsAt) {
            this.finish();
        }
        this.drawCooldownRing();
    }

    chaseTarget() {
        const timedOut = this.scene.time.now >= this.dashEndsAt;
        if (!this.target.isActive() || timedOut) {
            this.finish();
            return;
        }

        const toTarget = new Phaser.Math.Vector2(this.target.x - this.dog.x, this.target.y - this.dog.y);
        const contactDistance = this.dog.body.halfWidth + this.target.body.halfWidth + DASH.contactPadding;

        if (toTarget.length() <= contactDistance) {
            this.target.push(this.pushDirection.clone().scale(DASH.pushForce));
            this.scene.events.emit('person-pushed', { person: this.target, source: 'dash' });
            this.recoil();
            return;
        }

        toTarget.normalize();
        this.dog.setVelocity(toTarget.x * DASH.speed, toTarget.y * DASH.speed);
        this.dog.setRotation(toTarget.angle());
    }

    recoil() {
        this.target = null;
        this.isRecoiling = true;
        this.recoilEndsAt = this.scene.time.now + DASH.recoilDuration;
        const bounce = this.pushDirection.clone().negate().scale(DASH.recoilSpeed);
        this.dog.setVelocity(bounce.x, bounce.y);
    }

    finish() {
        this.target = null;
        this.isRecoiling = false;
        this.dog.endDash();
        this.readyAt = this.scene.time.now + DASH.cooldown;
    }

    drawCooldownRing() {
        this.cooldownRing.clear();
        const remaining = this.readyAt - this.scene.time.now;
        if (remaining <= 0) {
            return;
        }

        const progress = 1 - remaining / DASH.cooldown;
        const startAngle = -Math.PI / 2;
        this.cooldownRing.lineStyle(3, 0xffffff, 0.8);
        this.cooldownRing.beginPath();
        this.cooldownRing.arc(this.dog.x, this.dog.y, COOLDOWN_RING_RADIUS, startAngle, startAngle + progress * Math.PI * 2);
        this.cooldownRing.strokePath();
    }
}
