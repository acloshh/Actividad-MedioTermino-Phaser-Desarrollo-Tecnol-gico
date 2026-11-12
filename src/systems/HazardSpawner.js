import { HAZARD } from '../config/balance.js';
import { FallingObject } from '../entities/FallingObject.js';

const GRACE_AFTER_SPAWN = 150;

/**
 * Genera objetos que caen y resuelve qué pasa cuando se estrellan.
 * Eventos que emite en la escena:
 *   'hazard-resolved'    { hurt, saved, dogHit, x, y }
 *   'pushed-into-danger' { person } cuando un empujón mete a alguien bajo una sombra
 */
export class HazardSpawner {
    constructor(scene, crowd, dog, settings, playArea) {
        this.scene = scene;
        this.crowd = crowd;
        this.dog = dog;
        this.settings = settings;
        this.playArea = playArea;
        this.activeObjects = [];

        scene.time.addEvent({
            delay: settings.spawnInterval,
            loop: true,
            callback: this.spawn,
            callbackScope: this
        });
    }

    spawn() {
        if (this.activeObjects.length >= this.settings.maxActive) {
            return;
        }
        const target = this.pickTarget();
        const fallingObject = new FallingObject(
            this.scene, target.x, target.y, this.settings, (landed) => this.resolveImpact(landed)
        );
        this.activeObjects.push(fallingObject);
    }

    pickTarget() {
        const people = this.crowd.getActivePeople();
        if (people.length > 0 && Math.random() < this.settings.targetPersonChance) {
            const person = Phaser.Utils.Array.GetRandom(people);
            const offset = HAZARD.targetOffset;
            return this.playArea.clamp(
                person.x + Phaser.Math.Between(-offset, offset),
                person.y + Phaser.Math.Between(-offset, offset)
            );
        }
        return this.playArea.randomPoint();
    }

    /**
     * Registra a las personas que pasan por debajo de una sombra activa
     * y detecta si alguien entró a una sombra por culpa de un empujón.
     */
    update() {
        const people = this.crowd.getActivePeople();
        const now = this.scene.time.now;

        this.activeObjects.forEach((fallingObject) => {
            people
                .filter((person) => fallingObject.contains(person) && !fallingObject.threatened.has(person))
                .forEach((person) => {
                    fallingObject.threatened.add(person);
                    const isNewShadow = now - fallingObject.startTime > GRACE_AFTER_SPAWN;
                    if (person.isBeingPushed() && isNewShadow) {
                        this.scene.events.emit('pushed-into-danger', { person });
                    }
                });
        });
    }

    isInDanger(target) {
        return this.activeObjects.some((fallingObject) => fallingObject.contains(target));
    }

    resolveImpact(fallingObject) {
        Phaser.Utils.Array.Remove(this.activeObjects, fallingObject);

        const hurt = this.crowd.getActivePeople().filter((person) => fallingObject.contains(person));
        const saved = [...fallingObject.threatened].filter((person) =>
            person.isActive()
            && !fallingObject.contains(person)
            && person.lastPushedAt >= fallingObject.startTime
        );
        const dogHit = fallingObject.contains(this.dog);

        hurt.forEach((person) => this.crowd.hurt(person));
        this.scene.events.emit('hazard-resolved', { hurt, saved, dogHit, x: fallingObject.x, y: fallingObject.y });
    }
}
