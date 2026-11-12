const ZIGZAG_STEP = 12;
const ZIGZAG_AMPLITUDE = 6;

/**
 * Charcos electrificados en el piso. Si el rescatista los pisa, se electrocuta
 * y pierde una vida (emite 'dog-hurt').
 * Cada charco se define en levels.js como { x, y, width, height }.
 */
export class ElectricHazards {
    constructor(scene, definitions, dog) {
        this.scene = scene;

        definitions.forEach((definition) => {
            const zone = this.createPuddle(definition);
            scene.physics.add.overlap(dog, zone, () => scene.events.emit('dog-hurt', { cause: 'electric' }));
        });
    }

    createPuddle({ x, y, width, height }) {
        const left = x - width / 2;
        const top = y - height / 2;
        const graphics = this.scene.add.graphics().setDepth(3);

        graphics.fillStyle(0x0c3454, 0.65);
        graphics.fillRoundedRect(left, top, width, height, 10);
        graphics.lineStyle(2, 0x38d6ff, 0.9);
        graphics.strokeRoundedRect(left, top, width, height, 10);
        this.drawSpark(graphics, left, top, width, height);

        this.scene.tweens.add({
            targets: graphics,
            alpha: 0.5,
            duration: Phaser.Math.Between(90, 160),
            yoyo: true,
            repeat: -1
        });

        const zone = this.scene.add.zone(x, y, width, height);
        this.scene.physics.add.existing(zone, true);
        return zone;
    }

    drawSpark(graphics, left, top, width, height) {
        const isHorizontal = width >= height;
        const length = isHorizontal ? width : height;
        const points = [];

        for (let step = 0; step <= length; step += ZIGZAG_STEP) {
            const offset = (step / ZIGZAG_STEP) % 2 === 0 ? -ZIGZAG_AMPLITUDE : ZIGZAG_AMPLITUDE;
            points.push(isHorizontal
                ? new Phaser.Math.Vector2(left + step, top + height / 2 + offset)
                : new Phaser.Math.Vector2(left + width / 2 + offset, top + step));
        }

        graphics.lineStyle(2.5, 0x99f2ff, 1);
        graphics.strokePoints(points);
    }
}
