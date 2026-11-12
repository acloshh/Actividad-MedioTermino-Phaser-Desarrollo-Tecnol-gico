import { createResultScreen } from '../utils/createResultScreen.js';
import { GameState } from '../systems/GameState.js';

export class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
    }

    create() {
        const { score, saved, lives } = GameState.getSummary(this.registry);

        createResultScreen(this, {
            title: '¡TORMENTA SUPERADA!',
            titleColor: '#7CFC00',
            message: 'Empujaste a unos cuantos bajo la lluvia... pero ningún rayo los carbonizó. Estuvo mal, pero no tan mal.',
            backgroundColor: 0x102428,
            stats: [
                `Puntos finales: ${score}`,
                `Personas salvadas: ${saved}`,
                `Vidas restantes: ${lives}`
            ]
        });
    }
}
