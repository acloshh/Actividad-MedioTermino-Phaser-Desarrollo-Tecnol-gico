/**
 * Parámetros de prueba por URL, útiles durante el desarrollo:
 *   ?scene=Level2Scene  → arranca directo en esa escena
 *   ?touch=1            → muestra el joystick aunque no haya pantalla táctil
 */
const params = new URLSearchParams(window.location.search);

export const DEBUG_START_SCENE = params.get('scene');
export const DEBUG_FORCE_TOUCH = params.get('touch') === '1';
