import { TouchJoystick } from './TouchJoystick.js';
import { DEBUG_FORCE_TOUCH } from '../utils/debugParams.js';

/**
 * Junta el teclado (WASD y flechas) y el joystick táctil
 * en un único vector de dirección con largo entre 0 y 1.
 */
export class MovementInput {
    constructor(scene) {
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = scene.input.keyboard.addKeys('W,A,S,D');
        const hasTouch = scene.sys.game.device.input.touch || DEBUG_FORCE_TOUCH;
        this.joystick = hasTouch ? new TouchJoystick(scene) : null;
    }

    ownsPointer(pointer) {
        return this.joystick !== null && this.joystick.ownsPointer(pointer);
    }

    readKeyboard() {
        const left = this.cursors.left.isDown || this.wasd.A.isDown;
        const right = this.cursors.right.isDown || this.wasd.D.isDown;
        const up = this.cursors.up.isDown || this.wasd.W.isDown;
        const down = this.cursors.down.isDown || this.wasd.S.isDown;

        return new Phaser.Math.Vector2(Number(right) - Number(left), Number(down) - Number(up)).normalize();
    }

    getDirection() {
        const keyboardDirection = this.readKeyboard();
        if (keyboardDirection.lengthSq() > 0 || this.joystick === null) {
            return keyboardDirection;
        }
        return this.joystick.getVector();
    }
}
