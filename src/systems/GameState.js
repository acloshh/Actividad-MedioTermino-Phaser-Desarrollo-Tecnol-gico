import { GAME } from '../config/balance.js';

/**
 * Estado de la partida guardado en el registry de Phaser,
 * que es compartido por todas las escenas. Así el puntaje, las vidas
 * y el total de rescatados pasan de un nivel al siguiente.
 */
export const GameState = {
    reset(registry) {
        registry.set({
            score: 0,
            lives: GAME.startingLives,
            saved: 0,
            levelSaved: 0,
            targetRescues: GAME.rescueTargets.level1,
            timeLeft: GAME.levelDurations.level1,
            lossReason: 'lives'
        });
    },

    ensureInitialized(registry) {
        if (registry.get('lives') === undefined) {
            this.reset(registry);
        }
    },

    startLevel(registry, levelConfig) {
        this.ensureInitialized(registry);
        registry.set('levelSaved', 0);
        registry.set('targetRescues', levelConfig.targetRescues);
        registry.set('timeLeft', levelConfig.duration);
    },

    addScore(registry, points) {
        registry.set('score', Math.max(0, registry.get('score') + points));
    },

    addSaved(registry, amount) {
        registry.set('saved', registry.get('saved') + amount);
        registry.set('levelSaved', (registry.get('levelSaved') ?? 0) + amount);
    },

    loseLives(registry, amount) {
        const lives = Math.max(0, registry.get('lives') - amount);
        registry.set('lives', lives);
        return lives;
    },

    getSummary(registry) {
        return {
            score: registry.get('score') ?? 0,
            lives: registry.get('lives') ?? 0,
            saved: registry.get('saved') ?? 0,
            levelSaved: registry.get('levelSaved') ?? 0,
            targetRescues: registry.get('targetRescues') ?? 0,
            lossReason: registry.get('lossReason') ?? 'lives'
        };
    }
};
