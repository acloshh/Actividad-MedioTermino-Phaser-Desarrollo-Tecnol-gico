/**
 * Texturas dibujadas por código: el corazón de las vidas en el HUD.
 */
function drawHeart(g) {
    g.fillStyle(0xffffff);
    g.fillCircle(5, 5, 4);
    g.fillCircle(11, 5, 4);
    g.fillTriangle(1, 7, 15, 7, 8, 15);
}

const DRAWN_TEXTURES = [
    { key: 'heart', width: 16, height: 16, draw: drawHeart }
];

export function createDrawnTextures(scene) {
    DRAWN_TEXTURES.forEach(({ key, width, height, draw }) => {
        if (scene.textures.exists(key)) {
            return;
        }
        const graphics = scene.make.graphics({ x: 0, y: 0 }, false);
        draw(graphics);
        graphics.generateTexture(key, width, height);
        graphics.destroy();
    });
}
