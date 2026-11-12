import { createResultScreen } from '../utils/createResultScreen.js';
import { GameState } from '../systems/GameState.js';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create() {
        const { score, saved, levelSaved, targetRescues, lossReason } = GameState.getSummary(this.registry);
        const message = lossReason === 'quota'
            ? `Terminó la tormenta pero solo rescataste ${levelSaved}/${targetRescues} personas en este nivel.`
            : 'Demasiadas descargas en la tormenta. Un empujón a tiempo evita que un rayo los carbonice.';

        createResultScreen(this, {
            title: 'TORMENTA FATAL',
            titleColor: '#ff5252',
            message,
            backgroundColor: 0x241218,
            stats: [`Puntos finales: ${score}`, `Total de personas salvadas: ${saved}`]
        });
    }
}
