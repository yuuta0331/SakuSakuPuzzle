import {
    audio,
    loader,
    state,
    device,
    video,
    utils,
    plugin,
    pool,
    TextureAtlas,
    plugins,
    game, input
    ,event
} from 'melonjs';

import 'index.css';

import g_game from './game.js';

import TitleScreen from 'js/stage/title.js';
import PlayScreen from 'js/stage/play.js';
import GameOverScreen from './js/stage/gameover.js';
import HelpScreen from './js/stage/help';
import RankingScreen from './js/stage/ranking';
import PlayerEntity from 'js/renderables/player.js';

import VirtualJoypad from './js/entities/controls.js';
import UIContainer from './js/entities/HUD.js';
import Cursor from './js/entities/cursor.js';
import DataManifest from 'manifest.js';
import {bindKeys} from "./js/util/constants";

import CustomLoadingScreen from './js/stage/custom_loading_screen.js';


device.onReady(() => {

    state.set(state.LOADING, new CustomLoadingScreen());

    // state.change(state.LOADING);

    // load everything & display a loading screen
    // initialize the display canvas once the device/browser is ready
    if (!video.init(1920, 1080,
        {
            parent: "screen", scale: "device.devicePixelRatio",
            renderer: video.AUTO,
            scaleMethod: 'fit',
            doubleBuffering: true,
            autoScale: true,
            antiAlias: true
        })) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // initialize the debug plugin in development mode.
    if (process.env.NODE_ENV === 'development') {
        import("@melonjs/debug-plugin").then((debugPlugin) => {
            // automatically register the debug panel
            utils.function.defer(plugin.register, this, debugPlugin.DebugPanelPlugin, "debugPanel");
        });
    }

    // Initialize the audio.
    audio.init("mp3,ogg");

    // allow cross-origin for image/texture loading
    loader.crossOrigin = "anonymous";

    let virtualJoypad; // Define virtualJoypad outside the callback 
    let hud;

    // set and load all resources.
    loader.preload(DataManifest, function () {

        g_game.texture = new TextureAtlas(
            loader.getJSON("texture"),
            loader.getImage("texture")
        );

        // set the fade transition effect
        state.transition("fade", "#000000", 500);

        // bind keys
        bindKeys();
        // ユーザー定義ゲームステージを設定する
        state.set(state.MENU, new TitleScreen());
        state.set(state.PLAY, new PlayScreen());
        state.set(state.GAMEOVER, new GameOverScreen());
        state.set(state.SETTINGS, new HelpScreen());
        state.set(state.USER, new RankingScreen());

        // エンティティプールにプレイヤーエンティティを追加する
        pool.register("mainPlayer", PlayerEntity);
        pool.register("Cursor", Cursor);


        // キーボードショートカットを追加する
         event.on( event.KEYDOWN, (action, keyCode /*, edge */) => {

            // change global volume setting
            if (keyCode ===  input.KEY.PLUS) {
                // increase volume
                 audio.setVolume( audio.getVolume()+0.1);
            } else if (keyCode ===  input.KEY.MINUS) {
                // decrease volume
                 audio.setVolume( audio.getVolume()-0.1);
            }

            // toggle fullscreen on/off
            if (keyCode ===  input.KEY.F) {
                if (! device.isFullscreen()) {
                     device.requestFullscreen();
                } else {
                     device.exitFullscreen();
                }
            }
        });

        // Start the game.
        state.change(state.MENU);
        //state.change(state.PLAY);

        // display if debugPanel is enabled or on mobile
        // モバイルデバイスでのみ疑似コントローラーを表示
        // ※一部タブレットでは表示されない。
        if (device.isMobile) {
            if (typeof virtualJoypad === "undefined") {
                virtualJoypad = new VirtualJoypad();
            }
            game.world.addChild(virtualJoypad);
        }

        if (typeof hud === "undefined") {
            hud = new UIContainer();
            game.world.addChild(hud);
        }
    });
});
