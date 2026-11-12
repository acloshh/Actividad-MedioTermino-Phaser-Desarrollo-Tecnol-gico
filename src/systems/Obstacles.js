import { SPRITES } from '../config/sprites.js';

/**
 * Obstáculos fijos (vallas, bloques de cemento) que bloquean el paso
 * del perrito, de las personas y del perrero.
 * Cada obstáculo se define en levels.js como { x, y, type },
 * donde type es la clave de la textura ('barrier' o 'cementBlock').
 */
export class Obstacles {
    constructor(scene, definitions) {
        this.scene = scene;
        this.group = scene.physics.add.staticGroup();

        definitions.forEach(({ x, y, type }) => {
            this.group.create(x, y, type).setScale(SPRITES[type].scale).setDepth(5).refreshBody();
        });
    }

    addColliders(targets) {
        targets.forEach((target) => this.scene.physics.add.collider(target, this.group));
    }

    blocks(x, y, padding) {
        return this.group.getChildren().some((obstacle) => {
            const bounds = obstacle.getBounds();
            Phaser.Geom.Rectangle.Inflate(bounds, padding, padding);
            return bounds.contains(x, y);
        });
    }
}
