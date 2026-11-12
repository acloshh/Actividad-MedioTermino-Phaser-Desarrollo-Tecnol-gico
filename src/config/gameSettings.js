export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;
export const HUD_HEIGHT = 44;

/** Zona jugable: toda la pantalla menos la barra superior del HUD. */
export const PLAY_AREA = {
    x: 0,
    y: HUD_HEIGHT,
    width: GAME_WIDTH,
    height: GAME_HEIGHT - HUD_HEIGHT
};

export const COLORS = {
    background: 0x121924,
    helmetYellow: 0xf5c518,
    stormCyan: 0x5ce1e6,
    textLight: '#ffffff',
    textDark: '#121924',
    buttonIdle: 0xf5c518,
    buttonHover: 0xffe066
};

export const FONT_FAMILY = '"Trebuchet MS", Arial, sans-serif';
