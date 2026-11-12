import { PLAY_AREA } from '../config/gameSettings.js';

/**
 * Efecto de lluvia constante sobre el escenario. Las gotas caen en diagonal
 * y se reciclan al llegar al borde inferior.
 */
export class RainEffect {
    constructor(scene, dropCount = 50) {
        this.scene = scene;
        this.graphics = scene.add.graphics().setDepth(35);
        this.drops = [];

        for (let i = 0; i < dropCount; i++) {
            this.drops.push({
                x: Phaser.Math.Between(PLAY_AREA.x, PLAY_AREA.x + PLAY_AREA.width),
                y: Phaser.Math.Between(PLAY_AREA.y, PLAY_AREA.y + PLAY_AREA.height),
                speed: Phaser.Math.Between(290, 440),
                length: Phaser.Math.Between(9, 16)
            });
        }
    }

    update(delta = 16.6) {
        const dt = delta / 1000;
        this.graphics.clear();
        this.graphics.lineStyle(1.5, 0xa8dcff, 0.42);

        this.drops.forEach((drop) => {
            drop.x -= drop.speed * 0.22 * dt;
            drop.y += drop.speed * dt;

            if (drop.y > PLAY_AREA.y + PLAY_AREA.height) {
                drop.y = PLAY_AREA.y - 10;
                drop.x = Phaser.Math.Between(PLAY_AREA.x, PLAY_AREA.x + PLAY_AREA.width + 60);
            }
            if (drop.x < PLAY_AREA.x) {
                drop.x = PLAY_AREA.x + PLAY_AREA.width;
            }

            this.graphics.lineBetween(drop.x, drop.y, drop.x - 3, drop.y + drop.length);
        });
    }
}
