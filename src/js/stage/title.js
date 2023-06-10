import { game, input, Stage, ColorLayer, BitmapText, Sprite, loader } from "melonjs";

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
    font = "funwari-round";
    highlightedFont = "funwari-round_highlighted";

    onResetEvent() {

        game.world.addChild(new ColorLayer('background', '#F8E860'));

        const backgroundImage = new Sprite(0, 0, {
            image: loader.getImage('title_background'),
        });

        game.world.addChild(new BitmapText(game.viewport.width / 2, game.viewport.height / 2 - game.viewport.height / 4, {
            font: "funwari-round_brown",
            size: 1.5,
            textBaseline: "middle",
            textAlign: "center",
            fillStyle: "white",
            text: "さくさくパズル",
            lineWidth: 1.
        }));

        // 以前のメニュー項目の削除
        this.menuItems.forEach(item => game.world.removeChild(item));

        // 文字列の最小Y座標
        const base_y = 260;

        // 文字列のY座標間隔
        const margin_y = 70;

        // メニュー項目の文字列
        const menuTexts = ["GameMain", "Help", "Ranking", "End"];

        // メニュー項目の作成
        this.menuItems = menuTexts.map((text, index) =>
            this.createMenuItem(text, game.viewport.width / 2, base_y + index * margin_y)
        );

        // メニュー項目の追加
        this.menuItems.forEach(item => game.world.addChild(item));

        // 初期の選択項目を設定
        this.selectMenuItem(0);

        // キーボードのイベントをアクションとしてバインド
        input.bindKey(input.KEY.UP, "up");
        input.bindKey(input.KEY.DOWN, "down");
        input.bindKey(input.KEY.ENTER, "enter");

        // ゲームパッドのボタンをキーボードのキーにマッピング
        input.bindGamepad(0, { type: "buttons", code: input.GAMEPAD.BUTTONS.UP }, input.KEY.UP);
        input.bindGamepad(0, { type: "buttons", code: input.GAMEPAD.BUTTONS.DOWN }, input.KEY.DOWN);
        input.bindGamepad(0, { type: "buttons", code: input.GAMEPAD.BUTTONS.FACE_1 }, input.KEY.ENTER);



    }

    onDestroyEvent() {
        // キーボードとゲームパッドのイベントの解除
        input.unbindKey(input.KEY.UP);
        input.unbindKey(input.KEY.DOWN);
        input.unbindKey(input.KEY.ENTER);
        input.unbindGamepad(0, input.GAMEPAD.BUTTONS.UP);
        input.unbindGamepad(0, input.GAMEPAD.BUTTONS.DOWN);
        input.unbindGamepad(0, input.GAMEPAD.BUTTONS.FACE_1);
    }

    // メニュー項目を作成するためのヘルパーメソッド
    createMenuItem(text, x, y) {
        const menuItem = new BitmapText(x, y, { text: text, font: "funwari-round", size: 0.8, textAlign: "center" });

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
        //this.menuItems[index].font = this.highlightedFont;

        selectedItem.scale(1.0)
        selectedItem.alpha = 1.0;
        selectedItem.isKinematic = false; // 再描画を指示
        selectedItem.isKinematic = true; // 再描画後に物理挙動を無効化

        // 選択したメニュー項目を記録
        this.selectedMenuItemIndex = index;
    }


    // キーボードとゲームパッドのイベントを購読するためのヘルパーメソッド
    subscribeToInputEvents() {
        if (this.inputMargin < this.maxInputMargin) {
            this.inputMargin++;
        } else {
            if (input.isKeyPressed("up")) {
                console.log("Up");
                this.selectMenuItem((this.selectedMenuItemIndex - 1 + this.menuItems.length) % this.menuItems.length);
                this.inputMargin = 0;
            };

            if (input.isKeyPressed("down")) {
                console.log("Down");
                this.selectMenuItem((this.selectedMenuItemIndex + 1) % this.menuItems.length);
                this.inputMargin = 0;
            };

            //エンターキーまたはゲームパッドのAボタンが押されたとき
            if (input.isKeyPressed("enter")) {
                console.log("Enter");
                // TODO: ここに、メニュー項目が選択されたときの動作を書く
            };
        }
    }

    update(dt) {
        this.subscribeToInputEvents();
        return super.update(dt);
    }
}
