import {
    Stage,
    audio,
    game,
    ColorLayer,
    ImageLayer,
    BitmapText,
    Sprite,
    loader,
    device,
    state
} from 'melonjs';
import Cursor from '../entities/cursor.js';
import VirtualJoypad from '../entities/controls.js';
import Block from '../renderables/block.js';
import BlockGrid from '../renderables/block_grid.js';
import CircularProgressBar from '../renderables/circular_progress_bar.js';
import g_game from "../../game";
import {MyRectangle} from './MyRectangle.js';

class TransparentBlock extends Block {
    draw(renderer) {
        renderer.globalAlpha = 0.5;
        super.draw(renderer);
        renderer.globalAlpha = 1.0;
    }
}


class PlayScreen extends Stage {

    // センターグリッドオブジェクト
    centerGrid = null;
    // カーソルオブジェクト
    cursor = null;

    LevelManager(level) {
        // 1以上はgridの縦と横を1ずつ増やし、ブロック数を1増やしていく

        let gridWidth = 2; // グリッドの横幅
        let gridHeight = 2;// グリッドの縦幅
        let blockCount = 4; // ブロックの数


        // 3の倍数ごとにレベルを上げる
        if (level % 3 === 0) {
            gridWidth += 1;
            gridHeight += 1;
            blockCount += 1;
        }

        // if (level >= 1) {
        //
        // }

        //まとめてreturn
        return {
            glidWidth: gridWidth,
            glidHeight: gridHeight,
            blockCount: blockCount
        };
    }

    // ゲームの初期化
    onResetEvent() {

        //this.timeLimit = 100;  // ゲームの制限時間 (秒)
        //this.elapsedTime = 0;  // 経過時間
        //g_game.data.score = 1000;
        // g_game.data.timeLimit = 30;
        // g_game.data.elapsedTime = 0;
        // g_game.data.timeUp = false;

        // 背景を追加
        game.world.addChild(new ColorLayer("background", "#202020"), 0);

        let backgroundImage = loader.getImage('gamemain_background');
        let backgroundLayer = new ImageLayer(0, 0, {
            image: backgroundImage,
            width: game.viewport.width,
            height: game.viewport.height,
            repeat: "no-repeat",
            z: 1 // z-index
        });
        game.world.addChild(backgroundLayer, 1);

        let myRect = new MyRectangle(0, 0, 1050, 2000, '#00FFFF');
        let myRect2 = new MyRectangle(0, 1000, 4000, 400, '#00FFFF');
        game.world.addChild(myRect, 2);
        game.world.addChild(myRect2, 2);


        game.world.addChild(new BitmapText(260, 80, {
            font: "funwari-round",
            size: 2.0,
            textBaseline: "middle",
            textAlign: "center",
            text: "おだい"
        }), 3);

        const timerImage = new Sprite(265, 655, {
            image: loader.getImage('timer_background'),
        });
        game.world.addChild(timerImage, 3);

        game.world.addChild(new BitmapText(1660, 80, {
            font: "funwari-round_white",
            size: 1.0,
            textBaseline: "middle",
            textAlign: "center",
            text: "すこあ：" + g_game.data.score
        }), 3);

        // BitMapTextを描画
        // game.world.addChild(new BitmapText(game.viewport.width / 2, game.viewport.height / 2, {
        //     font: "funwari-round_white",
        //     size: 2.0,
        //     textBaseline: "middle",
        //     textAlign: "center",
        //     text: "Hello World !"
        // }));

        audio.stopTrack();
        audio.playTrack("gamemain");

        // 制限時間を表示するプログレスバーを描画
        let progressBar = new CircularProgressBar(game.viewport.width / 2, game.viewport.height / 2, 105);
        game.world.addChild(progressBar, 4);

        let stageInfo = this.LevelManager(g_game.data.stageInfo.level)

        // お手本となるブロックを描画
        this.sampleGrid = new BlockGrid(250, 300, 90, stageInfo.glidWidth, stageInfo.glidHeight);
        let blocks = this.sampleGrid.generateBlocks(stageInfo.blockCount, ["red", "blue", "green", "yellow"], ["square", "triangle"]);

        if (blocks) {
            game.world.addChild(this.sampleGrid);

            this.centerGrid = new BlockGrid(game.viewport.width / 2 + 400, game.viewport.height / 2 - 100, 90, 4, 4);
            this.centerGrid.addBlocks(blocks, 0.5, this.sampleGrid.x_position, this.sampleGrid.y_position);
            game.world.addChild(this.centerGrid);
        }

        // プレイヤーのブロックを描画
        let splitGrid = new BlockGrid(game.viewport.width / 2, game.viewport.height - 100, 90, 4, 4, true);
        this.sampleGrid.splitBlocks(g_game.data.stageInfo.minParts, g_game.data.stageInfo.maxParts, splitGrid); // ブロックを2部分に分割し、それらをsplitGridに追加
        game.world.addChild(splitGrid);
        //console.log(splitGrid);

        // カーソルを描画
        this.cursor = new Cursor(game.viewport.width / 2, game.viewport.height / 2, splitGrid, this.centerGrid);
        game.world.addChild(this.cursor, 999);

        // display if debugPanel is enabled or on mobile
        // モバイルデバイスでのみ疑似コントローラーを表示
        // ※一部タブレットでは表示されない。
        if (device.isMobile) {
            this.virtualJoypad = new VirtualJoypad();
            game.world.addChild(this.virtualJoypad);
        }
    }

    onDestroyEvent() {

        // スコアをリセット
        //g_game.data.score = 0;
        if (this.cursor && game.world.hasChild(this.cursor)) {
            game.world.removeChild(this.cursor);
        }

        if (this.sampleGrid && game.world.hasChild(this.sampleGrid)) {
            game.world.removeChild(this.sampleGrid);
        }

        if (this.centerGrid && game.world.hasChild(this.centerGrid)) {
            game.world.removeChild(this.centerGrid);
        }

        // unbindKeys();
        // unbindGamepads();

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

        // 全てのブロックが一致したかチェック
        if (this.centerGrid && this.centerGrid.allBlocksMatched()) {
            // 次のステージへの処理
            // console.log("全てのブロックが一致したので、次のステージへ");
            // スコアを加算
            g_game.data.score += 100 * g_game.data.stageInfo.level;
            // 5秒制限時間を加算
            g_game.data.timeLimit += 5;
            // レベルを加算
            g_game.data.stageInfo.level += 1;
            // g_game.data.stageInfo.blockCount += 1;
            // g_game.data.stageInfo.minParts += 1;
            // g_game.data.stageInfo.maxParts += 1;
            // state.change(state.PLAY);
            // SE再生
            audio.play("NextLevel");
            // ステージをリセット
            this.reset();

            // g_game.data.timeUp = true; // タイムアップフラグをセット
            // state.change(state.SCORE);
        }

        if (g_game.data.elapsedTime >= g_game.data.timeLimit - 2) {
            // 制限時間を超えたときの処理

            if (!g_game.data.timeUp) {
                // console.log("Time Up!");
                g_game.data.timeUp = true; // タイムアップフラグをセット
                g_game.data.timeLimit = 30; // 制限時間をリセット
                g_game.data.elapsedTime = 0;// 経過時間をリセット
                // ランキングに入るスコアかどうかを判定
                this.getLowestScore().then(lowestScore => {
                    // 現在のスコアがランキングの最低スコアより高い場合
                    // console.log("Current Score: " + g_game.data.score);
                    // console.log("Lowest Score: " + lowestScore);
                    if (g_game.data.score > lowestScore) {
                        // console.log("New Record!");
                        // ランキング入力画面へ遷移
                        state.change(state.SCORE);
                    } else {
                        // ランキング画面へ遷移
                        state.change(state.GAMEOVER);
                    }
                });
            }
        }
        return true;
    }


    async getLowestScore() {
        var lowestScore = Number.MAX_VALUE;

        await firebase.database().ref('scores').orderByChild('score').limitToFirst(1).once('value', snapshot => {
            snapshot.forEach(childSnapshot => {
                lowestScore = childSnapshot.val().score;
            });
        });

        return lowestScore;
    }


}

export default PlayScreen;
