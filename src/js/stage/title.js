import { game, audio, input, Stage, ColorLayer, BitmapText, Sprite, loader, state } from "melonjs";
import { bindKeys, unbindKeys, bindGamepads, unbindGamepads } from "../util/constants";
import g_game from "../../game";

export default class TitleScreen extends Stage {
    // メニュー項目
    menuItems = [];

    // 現在選択されているメニュー項目のインデックス
    selectedMenuItemIndex = 0;

    // 入力間隔カウンタ
    inputMargin = 0;

    // 最大入力間隔
    maxInputMargin = 15;

    // Font for menu items
    highlightedFont = "funwari-round";
    font = "funwari-round_white";

    onResetEvent() {

        // 画面推移中かどうか
        this.isTransitioning = false;

        game.world.addChild(new ColorLayer('background', '#F8E860'));

        game.world.addChild(new BitmapText(game.viewport.width / 2, game.viewport.height / 2 - game.viewport.height / 4 - 100, {
            font: "funwari-round_brown",
            size: 3.2,
            textBaseline: "middle",
            textAlign: "center",
            fillStyle: "white",
            text: "さくさくパズル",
            lineWidth: 1.
        }));


        // 文字列の最小Y座標
        const base_y = 480;

        // 文字列のY座標間隔
        const margin_y = 140;

        // メニュー項目の文字列
        const menuTexts = ["ぷれい", "へるぷ", "らんきんぐ", "しゅうりょう"];

        // メニュー項目の作成
        this.menuItems = menuTexts.map((text, index) =>
            this.createMenuItem(text, game.viewport.width / 2, base_y + index * margin_y)
        );

        // メニュー項目の追加
        this.menuItems.forEach(item => game.world.addChild(item));

        // 初期の選択項目を設定
        this.selectMenuItem(0);

        // キーボードのイベントをアクションとしてバインド
        bindKeys();

        // ゲームパッドのボタンをキーボードのキーにマッピング
        bindGamepads();

        //input.bindPointer(input.pointer.LEFT, input.KEY.ENTER);

        audio.stopTrack();
        audio.playTrack("title");

        // reset the score
        g_game.data.score = 0;
    }

    onDestroyEvent() {
        // キーボードとゲームパッドのイベントの解除
        //unbindKeys();
        unbindGamepads();
        audio.stopTrack();

        // メニュー項目の削除
        this.menuItems.forEach(item => game.world.removeChild(item));
        this.menuItems = [];
    }

    // メニュー項目を作成するためのヘルパーメソッド
    createMenuItem(text, x, y) {
        const menuItem = new BitmapText(x, y, { text: text, font: "funwari-round", size: 1.5, textAlign: "center" });

        // マウスクリックイベントのリスナーを追加
        // menuItem.pointerEvent.subscribe("pointerdown", () => {
        //     // TODO: ここに、各メニュー項目が選択されたときの動作を書く
        // });

        return menuItem;
    }

    // メニュー項目を選択するためのヘルパーメソッド
    selectMenuItem(index) {
        // すべてのメニュー項目のスケールをリセット
        this.menuItems.forEach(item => {
            //item.scale(1.0);
            //item.isKinematic = true; // スケーリングが即時に適用されるようにする
            item.font = this.font;
            item.scale(1.0)
            item.alpha = 0.7;
            item.isKinematic = false; // 再描画を指示
            item.isKinematic = true; // 再描画後に物理挙動を無効化
        });

        // 選択したメニュー項目のスケールを大きくする
        const selectedItem = this.menuItems[index];
        //selectedItem.scale(1.2);
        //selectedItem.isKinematic = true; // スケーリングが即時に適用されるようにする

        // 選択したメニュー項目のフォントをハイライトに変更
        this.menuItems[index].font = this.highlightedFont;

        selectedItem.scale(1.0)
        selectedItem.alpha = 1.0;
        selectedItem.isKinematic = false; // 再描画を指示
        selectedItem.isKinematic = true; // 再描画後に物理挙動を無効化

        // 選択したメニュー項目を記録
        this.selectedMenuItemIndex = index;
    }


    // キーボードとゲームパッドのイベントを購読するためのヘルパーメソッド
    subscribeToInputEvents() {
        // シーン切り替え中であればキー入力を無視
        if (this.isTransitioning) return;

        if (this.inputMargin < this.maxInputMargin) {
            this.inputMargin++;
        } else {
            if (input.isKeyPressed("up")) {

                audio.play("cursor_move");
                this.selectMenuItem((this.selectedMenuItemIndex - 1 + this.menuItems.length) % this.menuItems.length);
                this.inputMargin = 0;
            }
            ;

            if (input.isKeyPressed("down")) {
                
                audio.play("cursor_move");
                this.selectMenuItem((this.selectedMenuItemIndex + 1) % this.menuItems.length);
                this.inputMargin = 0;
            };

            //エンターキーまたはゲームパッドのAボタンが押されたとき
            if (input.isKeyPressed("enter")) {
                this.isTransitioning = true;
                audio.play("enter");
                switch (this.selectedMenuItemIndex) {
                    case 0:
                        //game.changeScene(state.PLAY);
                        state.change(state.PLAY);
                        break;
                    case 1:
                        //game.changeScene(HelpScene);
                        state.change(state.SETTINGS);
                        break;
                    case 2:
                        //game.changeScene(RankingScene);
                        state.change(state.USER);
                        break;
                    case 3:
                        alert('ゲームを終了するには、このタブを閉じてください。');
                        //game.changeScene(EndScene);
                        break;
                }
                this.inputMargin = 0;
            };
        }
    }

    update(dt) {
        this.subscribeToInputEvents();
        return super.update(dt);
    }
}
