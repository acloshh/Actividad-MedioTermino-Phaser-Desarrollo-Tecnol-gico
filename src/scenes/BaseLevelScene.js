import { GAME_WIDTH, GAME_HEIGHT, PLAY_AREA } from '../config/gameSettings.js';
import { createDrawnTextures } from '../utils/drawnTextures.js';
import { loadSprites } from '../config/sprites.js';
import { listen } from '../utils/sceneEvents.js';
import { Dog } from '../entities/Dog.js';
import { MovementInput } from '../systems/MovementInput.js';
import { PlayArea } from '../systems/PlayArea.js';
import { Crowd } from '../systems/Crowd.js';
import { HazardSpawner } from '../systems/HazardSpawner.js';
import { BoneSpawner } from '../systems/BoneSpawner.js';
import { Obstacles } from '../systems/Obstacles.js';
import { ElectricHazards } from '../systems/ElectricHazards.js';
import { DogCatcher } from '../entities/DogCatcher.js';
import { BarkSystem } from '../systems/BarkSystem.js';
import { DashSystem } from '../systems/DashSystem.js';
import { PointerActions } from '../systems/PointerActions.js';
import { GameState } from '../systems/GameState.js';
import { ScoreKeeper } from '../systems/ScoreKeeper.js';
import { LifeKeeper } from '../systems/LifeKeeper.js';
import { SoundEffects } from '../systems/SoundEffects.js';
import { RainEffect } from '../systems/RainEffect.js';
import { startMusic } from '../config/sounds.js';

const END_SCENES = ['GameOverScene', 'VictoryScene'];
const FADE_DURATION = 500;

/**
 * Lógica común a los tres niveles. Cada nivel la extiende
 * pasándole sus propios datos de configuración (ver config/levels.js).
 */
export class BaseLevelScene extends Phaser.Scene {
    constructor(levelConfig) {
        super(levelConfig.sceneKey);
        this.levelConfig = levelConfig;
    }

    preload() {
        loadSprites(this);
        createDrawnTextures(this);
    }

    create() {
        const config = this.levelConfig;
        this.isFinished = false;
        GameState.startLevel(this.registry, config);

        this.physics.world.setBounds(PLAY_AREA.x, PLAY_AREA.y, PLAY_AREA.width, PLAY_AREA.height);
        this.createFloor();

        this.obstacles = new Obstacles(this, config.obstacles ?? []);
        this.playArea = new PlayArea(this.obstacles);
        this.dog = new Dog(this, config.dogStart.x, config.dogStart.y).setDepth(10);
        this.movementInput = new MovementInput(this);
        this.crowd = new Crowd(this, config.people, this.dog, this.playArea);
        this.hazards = new HazardSpawner(this, this.crowd, this.dog, config.hazards, this.playArea);
        new BoneSpawner(this, this.dog, this.playArea);
        new ElectricHazards(this, config.cables ?? [], this.dog);
        this.createDogCatcher(config.dogCatcher);
        this.obstacles.addColliders([this.dog, this.crowd.group, this.dogCatcher].filter(Boolean));
        this.rain = new RainEffect(this, config.rainDrops ?? 50);

        this.createDogActions();
        this.createRules();
        this.startTimer();
        this.scene.launch('HudScene', { levelTitle: config.title });
        this.cameras.main.fadeIn(FADE_DURATION);
    }

    createFloor() {
        this.add.tileSprite(0, PLAY_AREA.y, GAME_WIDTH, GAME_HEIGHT - PLAY_AREA.y, 'floorTile')
            .setOrigin(0)
            .setTint(this.levelConfig.floorTint);
    }

    createDogCatcher(settings) {
        this.dogCatcher = null;
        if (!settings) {
            return;
        }
        this.dogCatcher = new DogCatcher(this, settings.x, settings.y, settings);
        this.physics.add.overlap(this.dog, this.dogCatcher, () => this.events.emit('dog-hurt', { cause: 'dogCatcher' }));
    }

    createDogActions() {
        this.bark = new BarkSystem(this, this.dog, this.crowd);
        this.dash = new DashSystem(this, this.dog);
        new PointerActions(this, {
            movementInput: this.movementInput,
            crowd: this.crowd,
            bark: this.bark,
            dash: this.dash
        });
    }

    createRules() {
        new ScoreKeeper(this, this.hazards);
        new LifeKeeper(this, this.dog);
        new SoundEffects(this);
        startMusic(this);
        listen(this, 'out-of-lives', () => {
            this.registry.set('lossReason', 'lives');
            this.endLevel('GameOverScene');
        });
    }

    startTimer() {
        const duration = this.levelConfig.duration;
        this.time.addEvent({
            delay: 1000,
            repeat: duration - 1,
            callback: () => {
                const timeLeft = this.registry.get('timeLeft') - 1;
                this.registry.set('timeLeft', timeLeft);
                if (timeLeft <= 0) {
                    this.resolveTimeUp();
                }
            }
        });
    }

    resolveTimeUp() {
        const levelSaved = this.registry.get('levelSaved') ?? 0;
        const target = this.levelConfig.targetRescues ?? 0;
        if (levelSaved >= target) {
            this.endLevel(this.levelConfig.nextScene);
        } else {
            this.registry.set('lossReason', 'quota');
            this.endLevel('GameOverScene');
        }
    }

    endLevel(nextScene) {
        if (this.isFinished) {
            return;
        }
        this.isFinished = true;
        this.physics.pause();
        this.time.removeAllEvents();

        if (END_SCENES.includes(nextScene)) {
            this.scene.stop('HudScene');
        }
        this.cameras.main.fadeOut(FADE_DURATION);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start(nextScene));
    }

    update(_time, delta) {
        if (this.isFinished) {
            return;
        }
        this.dog.move(this.movementInput.getDirection());
        this.dash.update();
        this.hazards.update();
        this.rain.update(delta);
    }
}
