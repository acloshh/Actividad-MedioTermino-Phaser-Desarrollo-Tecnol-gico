import { BONES } from '../config/balance.js';
import { SPRITES } from '../config/sprites.js';

/**
 * Hace aparecer recursos en el piso durante la tormenta:
 *   - Baterías pararrayos ('battery'): suman puntos al recolectarlas.
 *   - Paraguas metálicos abiertos ('metalUmbrella'): conducen la electricidad
 *     y restan puntos si el rescatista los agarra por descuido.
 */
export class BoneSpawner {
    constructor(scene, dog, playArea) {
        this.scene = scene;
        this.playArea = playArea;
        this.batteries = scene.physics.add.group();
        this.umbrellas = scene.physics.add.group();

        scene.time.addEvent({
            delay: BONES.spawnInterval,
            loop: true,
            callback: () => this.spawnItem(this.batteries, 'battery', BONES.maxOnScreen),
            callbackScope: this
        });

        scene.time.addEvent({
            delay: BONES.umbrellaInterval,
            loop: true,
            callback: () => this.spawnItem(this.umbrellas, 'metalUmbrella', BONES.maxUmbrellas),
            callbackScope: this
        });

        scene.physics.add.overlap(dog, this.batteries, (_dog, item) => {
            scene.events.emit('bone-collected', { x: item.x, y: item.y });
            item.destroy();
        });

        scene.physics.add.overlap(dog, this.umbrellas, (_dog, item) => {
            scene.events.emit('umbrella-collected', { x: item.x, y: item.y });
            item.destroy();
        });
    }

    spawnItem(group, textureKey, maxCount) {
        if (group.countActive() >= maxCount) {
            return;
        }
        const point = this.playArea.randomPoint();
        const item = group.create(point.x, point.y, textureKey).setDepth(4).setScale(0);

        this.scene.tweens.add({
            targets: item,
            scale: SPRITES[textureKey].scale,
            duration: 250,
            ease: 'Back.easeOut'
        });
    }
}
