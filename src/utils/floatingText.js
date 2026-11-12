import { FONT_FAMILY } from '../config/gameSettings.js';

/**
 * Texto corto que sube y desaparece (por ejemplo "+100" o "¡GUAU!").
 */
export function showFloatingText(scene, x, y, message, color = '#ffffff') {
    const text = scene.add.text(x, y, message, {
        fontFamily: FONT_FAMILY,
        fontSize: '18px',
        fontStyle: 'bold',
        color,
        stroke: '#1b1b1b',
        strokeThickness: 4
    }).setOrigin(0.5).setDepth(60);

    scene.tweens.add({
        targets: text,
        y: y - 24,
        alpha: 0,
        duration: 650,
        onComplete: () => text.destroy()
    });
}
