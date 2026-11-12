/**
 * Escucha un evento de la escena y se desuscribe sola cuando la escena se apaga.
 * Evita que los listeners se acumulen al reiniciar un nivel.
 */
export function listen(scene, eventName, callback, context) {
    scene.events.on(eventName, callback, context);
    scene.events.once('shutdown', () => scene.events.off(eventName, callback, context));
}
