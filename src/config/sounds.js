/**
 * Sonidos del juego (efectos y música): clave → archivo y volumen.
 * Las claves con varias variantes (whistle1, whistle2...) se agrupan en VARIANTS
 * para elegir una al azar y que no suene siempre igual.
 */
const AUDIO_PATH = 'assets/audio/';

export const SOUNDS = {
    whistle1: { file: 'whistle1.wav', volume: 0.7 },
    whistle2: { file: 'whistle2.wav', volume: 0.7 },
    whistle3: { file: 'whistle3.wav', volume: 0.7 },
    growl: { file: 'growl.ogg', volume: 0.8 },
    whine: { file: 'whine.wav', volume: 0.75 },
    thunder: { file: 'thunder.wav', volume: 0.85 },
    crash: { file: 'crash.ogg', volume: 0.65 },
    hurt: { file: 'hurt.ogg', volume: 0.8 },
    rescue: { file: 'rescue.ogg', volume: 0.65 },
    bone: { file: 'bone.ogg', volume: 0.65 },
    penalty: { file: 'penalty.ogg', volume: 0.55 },
    zap: { file: 'zap.ogg', volume: 0.65 },
    click: { file: 'click.ogg', volume: 0.7 },
    music: { file: 'music.mp3', volume: 0.28 }
};

export const VARIANTS = {
    bark: ['whistle1', 'whistle2', 'whistle3']
};

export function loadSounds(scene) {
    Object.entries(SOUNDS).forEach(([key, { file }]) => {
        scene.load.audio(key, AUDIO_PATH + file);
    });
}

export function playSound(scene, name) {
    const options = VARIANTS[name];
    const key = options ? Phaser.Utils.Array.GetRandom(options) : name;
    if (scene.cache.audio.exists(key)) {
        scene.sound.play(key, { volume: SOUNDS[key].volume });
    }
}

/**
 * Música de fondo en loop. El administrador de sonido es global,
 * así que sigue sonando al cambiar de escena; solo se inicia una vez.
 */
export function startMusic(scene) {
    const music = scene.sound.get('music') ?? scene.sound.add('music', { loop: true, volume: SOUNDS.music.volume });
    if (!music.isPlaying) {
        music.play();
    }
}
