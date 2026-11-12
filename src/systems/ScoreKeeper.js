import { SCORE } from '../config/balance.js';
import { GameState } from './GameState.js';
import { listen } from '../utils/sceneEvents.js';
import { showFloatingText } from '../utils/floatingText.js';

/**
 * Reglas de puntaje. Escucha los eventos del nivel y suma o resta puntos:
 *   + rescatar a alguien que estaba en la zona del rayo (+100)
 *   + recolectar una batería pararrayos (+15)
 *   - agarrar un paraguas metálico abierto (-25)
 *   - embestir a alguien que no estaba en peligro (-20)
 *   - empujar a alguien hacia la zona del rayo (-50)
 */
export class ScoreKeeper {
    constructor(scene, hazards) {
        this.scene = scene;
        this.hazards = hazards;

        listen(scene, 'person-pushed', this.onPersonPushed, this);
        listen(scene, 'pushed-into-danger', this.onPushedIntoDanger, this);
        listen(scene, 'hazard-resolved', this.onHazardResolved, this);
        listen(scene, 'bone-collected', this.onBoneCollected, this);
        listen(scene, 'umbrella-collected', this.onUmbrellaCollected, this);
    }

    onPersonPushed({ person, source }) {
        if (source === 'dash' && !this.hazards.isInDanger(person)) {
            this.award(person, SCORE.unnecessaryPush);
        }
    }

    onPushedIntoDanger({ person }) {
        this.award(person, SCORE.pushedIntoDanger);
    }

    onHazardResolved({ saved }) {
        saved.forEach((person) => this.award(person, SCORE.rescue));
        if (saved.length > 0) {
            GameState.addSaved(this.scene.registry, saved.length);
        }
    }

    onBoneCollected(position) {
        this.award(position, SCORE.battery);
    }

    onUmbrellaCollected(position) {
        this.award(position, SCORE.umbrella);
    }

    award(position, points) {
        if (this.scene.isFinished) {
            return;
        }
        GameState.addScore(this.scene.registry, points);
        this.scene.events.emit('points-awarded', { points });
        const label = points > 0 ? `+${points}` : `${points}`;
        const color = points > 0 ? '#7CFC00' : '#ff5555';
        showFloatingText(this.scene, position.x, position.y - 20, label, color);
    }
}
