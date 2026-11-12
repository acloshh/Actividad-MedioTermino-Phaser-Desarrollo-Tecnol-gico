import { JOYSTICK } from '../config/balance.js';
import { GAME_HEIGHT } from '../config/gameSettings.js';

/**
 * Joystick virtual para pantallas táctiles, ubicado abajo a la izquierda.
 * Solo toma los toques que empiezan cerca de su base, así el resto
 * de la pantalla queda libre para ladrar y embestir.
 */
export class TouchJoystick {
    constructor(scene) {
        this.scene = scene;
        this.pointerId = null;
        this.vector = new Phaser.Math.Vector2(0, 0);

        const x = JOYSTICK.margin + JOYSTICK.baseRadius;
        const y = GAME_HEIGHT - JOYSTICK.margin - JOYSTICK.baseRadius;
        this.center = new Phaser.Math.Vector2(x, y);

        this.base = scene.add.circle(x, y, JOYSTICK.baseRadius, 0x000000, 0.25)
            .setStrokeStyle(3, 0xffffff, 0.5);
        this.thumb = scene.add.circle(x, y, JOYSTICK.thumbRadius, 0xf5c518, 0.7);
        [this.base, this.thumb].forEach((part) => part.setScrollFactor(0).setDepth(1000));

        scene.input.on('pointerdown', this.handleDown, this);
        scene.input.on('pointermove', this.handleMove, this);
        scene.input.on('pointerup', this.handleUp, this);
        scene.events.once('shutdown', this.destroy, this);
    }

    ownsPointer(pointer) {
        return pointer.id === this.pointerId;
    }

    isInCaptureZone(pointer) {
        const captureRadius = JOYSTICK.baseRadius * JOYSTICK.captureRadiusFactor;
        return Phaser.Math.Distance.Between(pointer.x, pointer.y, this.center.x, this.center.y) <= captureRadius;
    }

    handleDown(pointer) {
        if (this.pointerId === null && this.isInCaptureZone(pointer)) {
            this.pointerId = pointer.id;
            this.updateThumb(pointer);
        }
    }

    handleMove(pointer) {
        if (this.ownsPointer(pointer)) {
            this.updateThumb(pointer);
        }
    }

    handleUp(pointer) {
        if (this.ownsPointer(pointer)) {
            this.pointerId = null;
            this.vector.set(0, 0);
            this.thumb.setPosition(this.center.x, this.center.y);
        }
    }

    updateThumb(pointer) {
        const offset = new Phaser.Math.Vector2(pointer.x - this.center.x, pointer.y - this.center.y);
        offset.limit(JOYSTICK.baseRadius);
        this.thumb.setPosition(this.center.x + offset.x, this.center.y + offset.y);
        this.vector.copy(offset).scale(1 / JOYSTICK.baseRadius);
    }

    getVector() {
        return this.vector.clone();
    }

    destroy() {
        this.scene.input.off('pointerdown', this.handleDown, this);
        this.scene.input.off('pointermove', this.handleMove, this);
        this.scene.input.off('pointerup', this.handleUp, this);
    }
}
