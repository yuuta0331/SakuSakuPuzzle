import { collision, state, input } from "melonjs";

export const my_state = {
	/**
	 * Choose a game to replay menu
	 */
	REPLAY_GAME_CHOOSER: state.USER + 0,

	/**
	 * replay the game you've chosen
	 */
	REPLAY_GAME: state.USER + 1,

	/**
	 * Choose a level
	 */
	CHOOSE_LEVEL: state.USER + 2,

	SINGLE_PLAYER_MENU: state.USER + 3,
	/**
	 * Menu with Start MP game, Join MP game
	 */
	MULTIPLAYER_MENU: state.USER + 10,

	/**
	 * Choose level and start the game
	 */
	MULTIPLAYER_START_GAME: state.USER + 11,

	/**
	 * Choose a game with open seats
	 */
	MULTIPLAYER_JOIN_GAME: state.USER + 12,

	/**
	 * The lobby screen where the host waits for joiners
	 */
	MULTIPLAYER_LOBBY: state.USER + 13,

	/**
	 * The actual gaming screen
	 */
	MULTIPLAYER_PLAY: state.USER + 14,

	/**
	 * Multiplyer game over
	 */
	MULTIPLAYER_GAME_OVER: state.USER + 15,

	/** 
	 * A text screen with infos on how to play this game
	 */
	HOW_TO_PLAY: state.USER + 16,
};

export const my_collision_types = {

	/**
	 * This is a remote player in Multiplayer games
	 */
	REMOTE_PLAYER: collision.types.USER << 0,

	/**
	 * A remote bomb in multiplayer games
	 */
	REMOTE_PROJECTILE: collision.types.USER << 1,
};

/**
 * 
 */
export const PLAYER_COLORS = [
	"#ffffff",	
	"#ffff32",
	"#32ffff",
	"#ff3232"
];

export const BARRIER_TILE = {
	light: 182,
	mid: 183,
	dark: 184,
};

// special bonus type numbers
// NOTE: those here are 1 based as Tiled counts tileIds from 1
export const BONUS_TILE = {
	bomb: 961,
	star: 962,
	cactus: 963,
	meat: 966,
	cheese: 967,
	closedChest: 970,
	openedChest: 971,
	maxEnergyAdder20: 972,
	maxEnergyAdder50: 973,
	magicBolt: 974,
	magicFirespin: 975,
	magicProtectionCircle: 976,
	magicNebula: 977,
	bomb0: 979,

	enemyEmitter: 115,
};

export const ENEMY_TILE = {
	cat: 994,
	spider: 995,
	golem: 996,
};

export function bindKeys() {
	// input.bindKey(input.KEY.ALT, "magic");
	// input.bindKey(input.KEY.Q, "damage", true);
	// input.bindKey(input.KEY.E, "magic-barrier", true);
	// input.bindKey(input.KEY.R, "magic-nebula", true);
	// input.bindKey(input.KEY.SHIFT, "barrier");
	input.bindKey(input.KEY.LEFT, "left");
	input.bindKey(input.KEY.A, "left");
	input.bindKey(input.KEY.RIGHT, "right");
	input.bindKey(input.KEY.D, "right");
	input.bindKey(input.KEY.UP, "up");
	input.bindKey(input.KEY.W, "up");
	input.bindKey(input.KEY.DOWN, "down");
	input.bindKey(input.KEY.S, "down");
	input.bindKey(input.KEY.P, "pause", true);
	// input.bindKey(input.KEY.SPACE, "bomb", true);
	input.bindKey(input.KEY.SPACE, "enter", true);
	input.bindKey(input.KEY.ENTER, "enter");
	input.bindKey(input.KEY.ESC, "exit", true);
	input.bindKey(input.KEY.F, "fullscreen", true);
	input.bindKey(input.KEY.E, "rotation", true);

	// マウスの左クリックをスペースキーを押した時と同様に
	//input.bindPointer(0, 32);
	//input.bindPointer(2, input.KEY.BACKSPACE);
}

export function unbindKeys() {
	// input.unbindKey(input.KEY.ALT);
	// input.unbindKey(input.KEY.Q);
	// input.unbindKey(input.KEY.E);
	// input.unbindKey(input.KEY.R);
	// input.unbindKey(input.KEY.SHIFT);
	input.unbindKey(input.KEY.LEFT);
	input.unbindKey(input.KEY.A);
	input.unbindKey(input.KEY.RIGHT);
	input.unbindKey(input.KEY.D);
	input.unbindKey(input.KEY.UP);
	input.unbindKey(input.KEY.W);
	input.unbindKey(input.KEY.DOWN);
	input.unbindKey(input.KEY.S);
	input.unbindKey(input.KEY.P);
	input.unbindKey(input.KEY.SPACE);
	input.unbindKey(input.KEY.ENTER);
	input.unbindKey(input.KEY.ESC);
	input.unbindKey(input.KEY.F);
	input.unbindKey(input.KEY.E);

}

export function bindGamepads() {
	//! bintkeyで必ずアクションの定義が必要

	// ゲームパッドのボタンをキーボードのキーにマッピング
	input.bindGamepad(0, {type: "buttons", code: input.GAMEPAD.BUTTONS.UP}, input.KEY.UP);
	input.bindGamepad(0, {type: "buttons", code: input.GAMEPAD.BUTTONS.RIGHT}, input.KEY.RIGHT);
	input.bindGamepad(0, {type: "buttons", code: input.GAMEPAD.BUTTONS.DOWN}, input.KEY.DOWN);
	input.bindGamepad(0, {type: "buttons", code: input.GAMEPAD.BUTTONS.LEFT}, input.KEY.LEFT);
	input.bindGamepad(0, {type: "buttons", code: input.GAMEPAD.BUTTONS.FACE_1}, input.KEY.ENTER);
	input.bindGamepad(0, {type: "buttons", code: input.GAMEPAD.BUTTONS.FACE_3}, input.KEY.E);
	input.bindGamepad(0, {type: "axes", code: input.GAMEPAD.AXES.LY, threshold: -0.1}, input.KEY.UP);
	input.bindGamepad(0, {type: "axes", code: input.GAMEPAD.AXES.LX, threshold: 0.1}, input.KEY.RIGHT);
	input.bindGamepad(0, {type: "axes", code: input.GAMEPAD.AXES.LY, threshold: 0.1}, input.KEY.DOWN);
        input.bindGamepad(0, {type:"axes", code: input.GAMEPAD.AXES.LX, threshold: -0.1}, input.KEY.LEFT);
}

export function unbindGamepads() {
	// キーボードとゲームパッドのイベントの解除
	input.unbindGamepad(0, input.GAMEPAD.BUTTONS.UP);
	input.unbindGamepad(0, input.GAMEPAD.BUTTONS.RIGHT);
	input.unbindGamepad(0, input.GAMEPAD.BUTTONS.DOWN);
	input.unbindGamepad(0, input.GAMEPAD.BUTTONS.LEFT);
	input.unbindGamepad(0, input.GAMEPAD.BUTTONS.FACE_1);
	input.unbindGamepad(0, input.GAMEPAD.BUTTONS.FACE_3);
	input.unbindGamepad(0, input.GAMEPAD.AXES.LX);
	input.unbindGamepad(0, input.GAMEPAD.AXES.LY);
}
