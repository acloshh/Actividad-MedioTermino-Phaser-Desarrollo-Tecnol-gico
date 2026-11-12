import { PERSON } from '../config/balance.js';
import { Person } from '../entities/Person.js';

const MIN_SPAWN_DISTANCE_FROM_DOG = 120;

/**
 * Administra a las personas del nivel: las crea, las repone cuando
 * se lastiman y permite buscarlas por posición.
 */
export class Crowd {
    constructor(scene, settings, dog, playArea) {
        this.scene = scene;
        this.dog = dog;
        this.playArea = playArea;
        this.group = scene.physics.add.group({
            collideWorldBounds: true,
            bounceX: 1,
            bounceY: 1
        });

        for (let i = 0; i < settings.count; i++) {
            this.spawnAwayFromDog();
        }

        scene.physics.add.collider(this.group, this.group);
    }

    spawnAwayFromDog() {
        const point = this.playArea.randomPoint({ awayFrom: this.dog, minDistance: MIN_SPAWN_DISTANCE_FROM_DOG });
        const person = new Person(this.scene, point.x, point.y);
        this.group.add(person);
        return person;
    }

    getActivePeople() {
        return this.group.getChildren().filter((person) => person.isActive());
    }

    /**
     * Devuelve la persona más cercana al punto, si está dentro de la tolerancia.
     */
    findPersonAt(x, y) {
        const distanceTo = (person) => Phaser.Math.Distance.Between(x, y, person.x, person.y);
        const nearby = this.getActivePeople().filter((person) => distanceTo(person) <= PERSON.clickTolerance);
        return nearby.sort((a, b) => distanceTo(a) - distanceTo(b))[0];
    }

    hurt(person) {
        person.hurt();
        this.scene.time.delayedCall(PERSON.respawnDelay, () => this.spawnAwayFromDog());
    }
}
