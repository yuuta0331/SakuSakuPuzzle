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
    game
} from 'melonjs';

import 'index.css';

import g_game from './game.js';

import TitleScreen from 'js/stage/title.js';
import PlayScreen from 'js/stage/play.js';
import HelpScreen from './js/stage/help';
import RankingScreen from './js/stage/ranking';
import PlayerEntity from 'js/renderables/player.js';

import VirtualJoypad from './js/entities/controls.js';

import DataManifest from 'manifest.js';
import { bindKeys, unbindKeys } from "./js/util/constants";
// TODO オリジナルのロード画面を作成する
//import CustomLoadingScreen from './js/stage/custom_loading_screen.js';


device.onReady(() => {

    // state.set(me.state.LOADING, new game.MyLoadingScreen());

    // state.change(me.state.LOADING);


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
        // set the user defined game stages
        state.set(state.MENU, new TitleScreen());
        state.set(state.PLAY, new PlayScreen());
        state.set(state.HELP, new HelpScreen());
        state.set(state.RANKING, new RankingScreen());

        // add our player entity in the entity pool
        pool.register("mainPlayer", PlayerEntity);

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
    });
});
