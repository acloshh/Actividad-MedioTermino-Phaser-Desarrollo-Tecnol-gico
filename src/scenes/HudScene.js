import { GAME_WIDTH, HUD_HEIGHT, FONT_FAMILY } from '../config/gameSettings.js';
import { GAME } from '../config/balance.js';
import { createDrawnTextures } from '../utils/drawnTextures.js';

const CENTER_Y = HUD_HEIGHT / 2;
const LOW_TIME_WARNING = 10;

const LABEL_STYLE = {
    fontFamily: FONT_FAMILY,
    fontSize: '19px',
    fontStyle: 'bold',
    color: '#ffffff'
};

/**
 * Barra superior con vidas, nivel, tiempo, meta de rescatados y puntaje.
 * Corre en paralelo a la escena del nivel y se actualiza sola
 * cuando cambian los datos del registry.
 */
export class HudScene extends Phaser.Scene {
    constructor() {
        super('HudScene');
    }

    preload() {
        createDrawnTextures(this);
    }

    create(data) {
        this.add.rectangle(0, 0, GAME_WIDTH, HUD_HEIGHT, 0x0e1520, 0.95).setOrigin(0);
        this.add.rectangle(0, HUD_HEIGHT - 3, GAME_WIDTH, 3, 0x5ce1e6).setOrigin(0);

        this.hearts = [];
        for (let i = 0; i < GAME.startingLives; i++) {
            this.hearts.push(this.add.image(26 + i * 32, CENTER_Y, 'heart').setScale(1.6));
        }

        this.add.text(124, CENTER_Y, data.levelTitle ?? '', { ...LABEL_STYLE, fontSize: '15px', color: '#f5c518' })
            .setOrigin(0, 0.5);
        this.timerText = this.add.text(GAME_WIDTH / 2 - 20, CENTER_Y, '', { ...LABEL_STYLE, fontSize: '28px' })
            .setOrigin(0.5);
        this.savedText = this.add.text(GAME_WIDTH - 190, CENTER_Y, '', LABEL_STYLE).setOrigin(1, 0.5);
        this.scoreText = this.add.text(GAME_WIDTH - 16, CENTER_Y, '', LABEL_STYLE).setOrigin(1, 0.5);

        this.refresh();
        this.registry.events.on('changedata', this.refresh, this);
        this.events.once('shutdown', () => this.registry.events.off('changedata', this.refresh, this));
    }

    refresh() {
        const lives = this.registry.get('lives');
        this.hearts.forEach((heart, index) => {
            const isFull = index < lives;
            heart.setTint(isFull ? 0xe53935 : 0x555555).setAlpha(isFull ? 1 : 0.5);
        });

        const timeLeft = this.registry.get('timeLeft');
        this.timerText.setText(`⚡ ${timeLeft}s`);
        this.timerText.setColor(timeLeft <= LOW_TIME_WARNING ? '#ff5252' : '#ffffff');

        const levelSaved = this.registry.get('levelSaved') ?? 0;
        const target = this.registry.get('targetRescues') ?? 3;
        this.savedText.setText(`Salvados ${levelSaved}/${target}`);
        this.savedText.setColor(levelSaved >= target ? '#7CFC00' : '#5ce1e6');
        this.scoreText.setText(`Puntos ${this.registry.get('score')}`);
    }
}
