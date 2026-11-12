import { HAZARD } from '../config/balance.js';

/**
 * Rayo de tormenta que cae desde el cielo. Primero muestra una zona de
 * estática ionizada que crece y un anillo eléctrico parpadeante de advertencia,
 * y después descarga el relámpago dejando el piso carbonizado.
 */
export class FallingObject {
    constructor(scene, x, y, settings, onImpact) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.radius = settings.radius;
        this.startTime = scene.time.now;
        this.hasLanded = false;
        this.threatened = new Set();

        this.shadow = scene.add.circle(x, y, this.radius, 0x38d6ff, 0.28).setScale(0.15).setDepth(1);
        this.ring = scene.add.circle(x, y, this.radius).setStrokeStyle(3, 0xff3b30, 0.95).setDepth(1);

        scene.tweens.add({
            targets: this.shadow,
            scale: 1,
            duration: settings.warningTime,
            ease: 'Sine.easeIn'
        });
        this.ringTween = scene.tweens.add({
            targets: this.ring,
            alpha: 0.25,
            duration: 160,
            yoyo: true,
            repeat: -1
        });

        scene.time.delayedCall(settings.warningTime - HAZARD.fallDuration, () => this.drop(onImpact));
    }

    contains(target) {
        return Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y) <= this.radius;
    }

    drop(onImpact) {
        const boltSize = this.scene.textures.getFrame('lightningBolt').width;
        const finalScale = (this.radius * 2 * 0.95) / boltSize;

        this.beam = this.scene.add.line(0, 0, this.x, -40, this.x, this.y, 0x99f2ff, 0.9)
            .setLineWidth(6)
            .setOrigin(0)
            .setDepth(49);

        this.sprite = this.scene.add.image(this.x, this.y, 'lightningBolt')
            .setScale(finalScale * HAZARD.startScaleFactor)
            .setAlpha(0.75)
            .setAngle(Phaser.Math.Between(0, 359))
            .setDepth(50);

        this.scene.tweens.add({
            targets: this.sprite,
            scale: finalScale,
            alpha: 1,
            duration: HAZARD.fallDuration,
            ease: 'Quad.easeIn',
            onComplete: () => this.land(onImpact)
        });
    }

    land(onImpact) {
        this.hasLanded = true;
        this.ringTween.stop();
        this.ring.destroy();
        this.shadow.destroy();
        if (this.beam) {
            this.beam.destroy();
        }

        this.sprite.setTexture('scorch').setDepth(2);
        this.scene.cameras.main.shake(130, 0.0045);

        onImpact(this);

        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            delay: HAZARD.debrisLinger,
            duration: 500,
            onComplete: () => this.sprite.destroy()
        });
    }
}
