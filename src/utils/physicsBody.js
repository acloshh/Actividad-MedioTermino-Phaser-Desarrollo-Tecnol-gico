/**
 * Le da a un sprite un cuerpo de física circular centrado, con el radio
 * expresado en píxeles de pantalla (sin importar la escala ni el tamaño
 * de la imagen). Arcade escala el cuerpo junto con el sprite, así que
 * el radio se convierte a unidades de la imagen.
 */
export function setCircleBody(sprite, worldRadius) {
    const radius = worldRadius / sprite.scaleX;
    sprite.body.setCircle(radius, sprite.width / 2 - radius, sprite.height / 2 - radius);
}
