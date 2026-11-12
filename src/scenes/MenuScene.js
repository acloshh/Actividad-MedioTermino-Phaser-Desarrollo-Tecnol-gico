import { GAME_WIDTH, GAME_HEIGHT, COLORS, FONT_FAMILY } from '../config/gameSettings.js';
import { createButton } from '../utils/createButton.js';
import { GameState } from '../systems/GameState.js';
import { startMusic } from '../config/sounds.js';

const HOW_TO_PLAY = [
    ['Moverse', 'WASD / flechas (o joystick táctil)'],
    ['Clic en el suelo', 'silbato: onda que aleja a los peatones'],
    ['Clic en una persona', 'embestirla para sacarla antes del rayo'],
    ['Recursos', 'baterías (+15 pts) · paraguas metálicos (−25 pts)'],
    ['Objetivo', 'cumplir el mínimo de salvados y sobrevivir la tormenta']
];
const LINE_HEIGHT = 28;

export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.cameras.main.setBackgroundColor(COLORS.background);
        startMusic(this);
        const centerX = GAME_WIDTH / 2;

        this.add.text(centerX, GAME_HEIGHT * 0.12, '⚡ EMPUJÓN ELÉCTRICO ⚡', {
            fontFamily: FONT_FAMILY,
            fontSize: '48px',
            fontStyle: 'bold',
            color: '#5ce1e6'
        }).setOrigin(0.5);

        this.add.text(centerX, GAME_HEIGHT * 0.12 + 52, 'Está mal... pero no tan mal', {
            fontFamily: FONT_FAMILY,
            fontSize: '30px',
            fontStyle: 'bold',
            color: '#f5c518'
        }).setOrigin(0.5);

        this.createInstructions(GAME_HEIGHT * 0.39);

        createButton(this, centerX, GAME_HEIGHT * 0.82, 'JUGAR', () => {
            GameState.reset(this.registry);
            this.scene.start('Level1Scene');
        });

        this.add.text(GAME_WIDTH - 16, GAME_HEIGHT - 12, 'Santiago Tornau', {
            fontFamily: FONT_FAMILY,
            fontSize: '16px',
            color: '#9ab0c7'
        }).setOrigin(1, 1);
    }

    /**
     * Explica los controles y el objetivo en dos columnas: acción y efecto.
     */
    createInstructions(top) {
        const style = { fontFamily: FONT_FAMILY, fontSize: '19px' };
        const columnGap = 12;

        HOW_TO_PLAY.forEach(([action, effect], index) => {
            const y = top + index * LINE_HEIGHT;
            this.add.text(GAME_WIDTH * 0.38 - columnGap, y, action, { ...style, fontStyle: 'bold', color: '#f5c518' })
                .setOrigin(1, 0.5);
            this.add.text(GAME_WIDTH * 0.38 + columnGap, y, effect, { ...style, color: COLORS.textLight })
                .setOrigin(0, 0.5);
        });
    }
}
