import { GAME_WIDTH, GAME_HEIGHT, FONT_FAMILY } from '../config/gameSettings.js';
import { GameState } from '../systems/GameState.js';
import { createButton } from './createButton.js';

/**
 * Arma una pantalla de resultado (derrota o victoria) con título,
 * mensaje, estadísticas y botones para reintentar o volver al menú.
 */
export function createResultScreen(scene, { title, titleColor, message, backgroundColor, stats }) {
    const centerX = GAME_WIDTH / 2;
    scene.cameras.main.setBackgroundColor(backgroundColor);
    scene.cameras.main.fadeIn(400);

    scene.add.text(centerX, GAME_HEIGHT * 0.18, title, {
        fontFamily: FONT_FAMILY,
        fontSize: '64px',
        fontStyle: 'bold',
        color: titleColor
    }).setOrigin(0.5);

    scene.add.text(centerX, GAME_HEIGHT * 0.32, message, {
        fontFamily: FONT_FAMILY,
        fontSize: '22px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: GAME_WIDTH * 0.8 }
    }).setOrigin(0.5);

    stats.forEach((line, index) => {
        scene.add.text(centerX, GAME_HEIGHT * 0.46 + index * 36, line, {
            fontFamily: FONT_FAMILY,
            fontSize: '26px',
            fontStyle: 'bold',
            color: '#f5c518'
        }).setOrigin(0.5);
    });

    createButton(scene, centerX - 130, GAME_HEIGHT * 0.85, 'REINTENTAR', () => {
        GameState.reset(scene.registry);
        scene.scene.start('Level1Scene');
    });
    createButton(scene, centerX + 130, GAME_HEIGHT * 0.85, 'MENÚ', () => {
        scene.scene.start('MenuScene');
    });
}
