import { game, audio, input, Stage, ColorLayer, BitmapText, Sprite, loader, state } from "melonjs";

export default class HelpScreen extends Stage {
    /**
     *  action to perform on state change
     */

    // 現在選択されているメニュー項目のインデックス
    selectedMenuItemIndex = 0;

    // 入力間隔カウンタ
    inputMargin = 0;

    // 最大入力間隔 
    maxInputMargin = 15;


    onResetEvent() {
        // add a gray background to the default Stage
        game.world.addChild(new ColorLayer('background', '#F8E860'));

        // add a font text display object
        game.world.addChild(new BitmapText(game.viewport.width / 2, game.viewport.height / 2, {
            font: "PressStart2P",
            size: 4.0,
            textBaseline: "middle",
            textAlign: "center",
            text: "Help"
        }));

        // キーボードのイベントをアクションとしてバインド
        input.bindKey(input.KEY.LEFT, "left");
        input.bindKey(input.KEY.RIGHT, "right");
        input.bindKey(input.KEY.ENTER, "enter");
        input.bindKey(input.KEY.BACKSPACE, "enter");

        // ゲームパッドのボタンをキーボードのキーにマッピング
        input.bindGamepad(0, { type: "buttons", code: input.GAMEPAD.BUTTONS.LEFT }, input.KEY.LEFT);
        input.bindGamepad(0, { type: "buttons", code: input.GAMEPAD.BUTTONS.RIGHT }, input.KEY.RIGHT);
        input.bindGamepad(0, { type: "buttons", code: input.GAMEPAD.BUTTONS.FACE_1 }, input.KEY.ENTER);
        input.bindGamepad(0, { type: "buttons", code: input.GAMEPAD.BUTTONS.FACE_2 }, input.KEY.BACKSPACE);

        audio.stopTrack();
        audio.playTrack("title");
    }

    onDestroyEvent() {

        audio.stopTrack();

        // キーボードとゲームパッドのイベントの解除
        input.unbindKey(input.KEY.LEFT);
        input.unbindKey(input.KEY.RIGHT);
        input.unbindKey(input.KEY.ENTER);
        input.unbindGamepad(0, input.GAMEPAD.BUTTONS.LEFT);
        input.unbindGamepad(0, input.GAMEPAD.BUTTONS.RIGHT);
        input.unbindGamepad(0, input.GAMEPAD.BUTTONS.FACE_1);
        input.unbindGamepad(0, input.GAMEPAD.BUTTONS.FACE_2);
    }

        // キーボードとゲームパッドのイベントを購読するためのヘルパーメソッド
        subscribeToInputEvents() {
            if (this.inputMargin < this.maxInputMargin) {
                this.inputMargin++;
            } else {
                if (input.isKeyPressed("left")) {
                    console.log("Left");
                    this.selectMenuItem((this.selectedMenuItemIndex - 1 + this.menuItems.length) % this.menuItems.length);
                    this.inputMargin = 0;
                };
    
                if (input.isKeyPressed("right")) {
                    console.log("Right");
                    this.selectMenuItem((this.selectedMenuItemIndex + 1) % this.menuItems.length);
                    this.inputMargin = 0;
                };
    
                //エンターキーまたはゲームパッドのAボタンが押されたとき
                if (input.isKeyPressed("enter")) {
                    console.log("Enter");
                    switch (this.selectedMenuItemIndex) {
                        case 0:
                            game.changeScene(state.PLAY);
                            state.change(state.PLAY);
                            break;
                        case 1:
                            game.changeScene(HelpScene);
                            state.change(state.SETTINGS);
                            break;
                        case 2:
                            game.changeScene(RankingScene);
                            state.change(state.USER);
                            break;
                        case 3:
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
};
