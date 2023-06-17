import {
    Stage,
    audio,
    game,
    ColorLayer,
    ImageLayer,
    BitmapText,
    Sprite,
    loader,
    Rect,
    Renderable,
    device,
    timer, state
} from 'melonjs';
import Cursor from '../entities/cursor.js';
import VirtualJoypad from '../entities/controls.js';
import Block from '../renderables/block.js';
import BlockGrid from '../renderables/block_grid.js';
import CircularProgressBar from '../renderables/circular_progress_bar.js';
import g_game from "../../game";
import {unbindGamepads, unbindKeys} from "../util/constants";

class MyRectangle extends Renderable {
    constructor(x, y, width, height, color) {
        super(x, y, width, height);
        this.color = color;
        this.floating = true; // ビューポートに対する相対座標を使用
    }

    draw(renderer) {
        renderer.setColor(this.color);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
}

class TransparentBlock extends Block {
    draw(renderer) {
        renderer.globalAlpha = 0.5;
        super.draw(renderer);
        renderer.globalAlpha = 1.0;
    }
}


class PlayScreen extends Stage {

    onResetEvent() {

        //this.timeLimit = 100;  // ゲームの制限時間 (秒)
        //this.elapsedTime = 0;  // 経過時間
        g_game.data.timeLimit = 30;
        g_game.data.elapsedTime = 0;
        g_game.data.timeUp = false;

        // 背景を追加
        game.world.addChild(new ColorLayer("background", "#202020"));

        let backgroundImage = loader.getImage('gamemain_background');
        let backgroundLayer = new ImageLayer(0, 0, {
            image: backgroundImage,
            width: game.viewport.width,
            height: game.viewport.height,
            repeat: "no-repeat",
            z: 1 // z-index
        });
        game.world.addChild(backgroundLayer);

        let myRect = new MyRectangle(0, 0, 1050, 2000, '#00FFFF');
        let myRect2 = new MyRectangle(0, 1000, 4000, 400, '#00FFFF');
        game.world.addChild(myRect);
        game.world.addChild(myRect2);


        game.world.addChild(new BitmapText(260, 80, {
            font: "funwari-round",
            size: 2.0,
            textBaseline: "middle",
            textAlign: "center",
            text: "おだい"
        }));

        const timerImage = new Sprite(265, 655, {
            image: loader.getImage('timer_background'),
        });
        game.world.addChild(timerImage);


        // BitMapTextを描画
        game.world.addChild(new BitmapText(game.viewport.width / 2, game.viewport.height / 2, {
            font: "funwari-round_white",
            size: 2.0,
            textBaseline: "middle",
            textAlign: "center",
            text: "Hello World !"
        }));

        audio.stopTrack();
        audio.playTrack("gamemain");

        // 制限時間を表示するプログレスバーを描画
        let progressBar = new CircularProgressBar(game.viewport.width / 2, game.viewport.height / 2, 105);
        game.world.addChild(progressBar);


        // お手本となるブロックを描画
        this.sampleGrid = new BlockGrid(250, 300, 90, 2, 2);
        let blocks = this.sampleGrid.generateBlocks(4, ["red", "blue", "green", "yellow"], ["square", "triangle"]);

        let centerGrid;
        if (blocks) {
            game.world.addChild(this.sampleGrid);

            centerGrid = new BlockGrid(game.viewport.width / 2 + 400, game.viewport.height / 2 - 100, 90, 4, 4);
            centerGrid.addBlocks(blocks, 0.5, this.sampleGrid.x_position, this.sampleGrid.y_position);
            game.world.addChild(centerGrid);
        }

        // プレイヤーのブロックを描画
        let splitGrid = new BlockGrid(game.viewport.width / 2, game.viewport.height - 100, 90, 4, 4);
        this.sampleGrid.splitBlocks(2, 2, splitGrid); // ブロックを2部分に分割し、それらをsplitGridに追加
        game.world.addChild(splitGrid);


        // カーソルを描画
        this.cursor = new Cursor(game.viewport.width / 2, game.viewport.height / 2, splitGrid, centerGrid);
        game.world.addChild(this.cursor);

        // display if debugPanel is enabled or on mobile
        // モバイルデバイスでのみ疑似コントローラーを表示
        // ※一部タブレットでは表示されない。
        if (device.isMobile) {
            this.virtualJoypad = new VirtualJoypad();
            game.world.addChild(this.virtualJoypad);
        }
    }

    onDestroyEvent() {

        if (this.cursor && game.world.hasChild(this.cursor)) {
            game.world.removeChild(this.cursor);
        }

        unbindKeys();
        unbindGamepads();

        if (this.virtualJoypad && game.world.hasChild(this.virtualJoypad)) {
            game.world.removeChild(this.virtualJoypad);
        }

        audio.stopTrack();
    }

    // update(dt) {
    //     if (this.cursor) {
    //         this.cursor.update(dt);
    //     }
    //     return super.update(dt);
    // }

    update(dt) {
        g_game.data.elapsedTime += dt / 1000; // 経過時間を秒単位で更新
        if (g_game.data.elapsedTime > g_game.data.timeLimit) {
            // 制限時間を超えたときの処理
            // ゲームオーバー画面に遷移
            if (!g_game.data.timeUp) {
                state.change(state.GAMEOVER);
                console.log("Time Up!");
                g_game.data.timeUp = true; // タイムアップフラグをセット
            }
        }
        return true;
    }

};

export default PlayScreen;
