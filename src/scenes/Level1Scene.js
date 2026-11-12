import { BaseLevelScene } from './BaseLevelScene.js';
import { LEVELS } from '../config/levels.js';

export class Level1Scene extends BaseLevelScene {
    constructor() {
        super(LEVELS.level1);
    }
}
