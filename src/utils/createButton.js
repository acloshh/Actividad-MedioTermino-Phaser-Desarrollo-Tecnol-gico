import { COLORS, FONT_FAMILY } from '../config/gameSettings.js';
import { playSound } from '../config/sounds.js';

const BUTTON_WIDTH = 220;
const BUTTON_HEIGHT = 60;

/**
 * Crea un botón rectangular con texto, reutilizable en todas las pantallas.
 */
export function createButton(scene, x, y, label, onClick) {
    const background = scene.add.rectangle(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT, COLORS.buttonIdle)
        .setStrokeStyle(4, 0x1b1b1b);

    const text = scene.add.text(0, 0, label, {
        fontFamily: FONT_FAMILY,
        fontSize: '28px',
        fontStyle: 'bold',
        color: COLORS.textDark
    }).setOrigin(0.5);

    const button = scene.add.container(x, y, [background, text])
        .setSize(BUTTON_WIDTH, BUTTON_HEIGHT)
        .setInteractive({ useHandCursor: true });

    button.on('pointerover', () => background.setFillStyle(COLORS.buttonHover));
    button.on('pointerout', () => background.setFillStyle(COLORS.buttonIdle));
    button.on('pointerup', () => {
        playSound(scene, 'click');
        onClick();
    });

    return button;
}
