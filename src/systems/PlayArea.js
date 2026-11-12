import { HAZARD } from '../config/balance.js';
import { PLAY_AREA } from '../config/gameSettings.js';

const MAX_TRIES = 50;

/**
 * Zona jugable del nivel. Sabe elegir puntos al azar que no caigan
 * sobre obstáculos ni demasiado cerca de algo que se quiera evitar.
 */
export class PlayArea {
    constructor(obstacles = null) {
        this.obstacles = obstacles;
    }

    clamp(x, y, margin = HAZARD.playAreaMargin) {
        return {
            x: Phaser.Math.Clamp(x, PLAY_AREA.x + margin, PLAY_AREA.x + PLAY_AREA.width - margin),
            y: Phaser.Math.Clamp(y, PLAY_AREA.y + margin, PLAY_AREA.y + PLAY_AREA.height - margin)
        };
    }

    randomPoint({ margin = HAZARD.playAreaMargin, awayFrom = null, minDistance = 0 } = {}) {
        let point = null;
        for (let i = 0; i < MAX_TRIES; i++) {
            point = new Phaser.Math.Vector2(
                Phaser.Math.Between(PLAY_AREA.x + margin, PLAY_AREA.x + PLAY_AREA.width - margin),
                Phaser.Math.Between(PLAY_AREA.y + margin, PLAY_AREA.y + PLAY_AREA.height - margin)
            );
            const blocked = this.obstacles !== null && this.obstacles.blocks(point.x, point.y, margin / 2);
            const tooClose = awayFrom !== null && point.distance(awayFrom) < minDistance;
            if (!blocked && !tooClose) {
                return point;
            }
        }
        return point;
    }
}
