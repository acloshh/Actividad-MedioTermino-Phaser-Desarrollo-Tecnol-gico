/**
 * Decide qué hace un clic o toque:
 *   - sobre una persona → embestida
 *   - en cualquier otro lugar → ladrido
 * Los toques que maneja el joystick se ignoran.
 */
export class PointerActions {
    constructor(scene, { movementInput, crowd, bark, dash }) {
        this.movementInput = movementInput;
        this.crowd = crowd;
        this.bark = bark;
        this.dash = dash;

        scene.input.on('pointerdown', this.handlePointerDown, this);
    }

    handlePointerDown(pointer) {
        if (this.movementInput.ownsPointer(pointer)) {
            return;
        }

        const person = this.crowd.findPersonAt(pointer.worldX, pointer.worldY);
        if (person) {
            this.dash.tryDash(person);
        } else {
            this.bark.tryBark();
        }
    }
}
