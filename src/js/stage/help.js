import {game, audio, input, Stage, ColorLayer, BitmapText, Sprite, loader, state, ImageLayer} from "melonjs";

export default class HelpScreen extends Stage {
    /**
     *  action to perform on state change
     */
        // 現在選択されている画像のインデックス
    selectedItemIndex = 0;

    // 入力間隔カウンタ
    inputMargin = 0;

    // 最大入力間隔 
    maxInputMargin = 15;

    backgroundImage = loader.getImage('help1_background');

    // ImageLayerオブジェクトを保存するためのフィールドを追加
    backgroundLayer = null;

    onResetEvent() {
        // add a gray background to the default Stage
        game.world.addChild(new ColorLayer('background', '#F8E860'));

        // const backgroundImage = new Sprite(0, 0, {
        //     image: loader.getImage('help1_background'),
        // });
        // // scale to fit with the viewport size
        // backgroundImage.scale(game.viewport.width / backgroundImage.width, game.viewport.height / backgroundImage.height);
        // game.world.addChild(backgroundImage, 1);

        this.backgroundLayer = new ImageLayer(0, 0, {
            image: this.backgroundImage,
            width: game.viewport.width,
            height: game.viewport.height,
            repeat: "no-repeat",
            z: 1 // z-index
        });
        game.world.addChild(this.backgroundLayer);

        // add a font text display object
        // game.world.addChild(new BitmapText(game.viewport.width / 2, game.viewport.height / 2, {
        //     font: "PressStart2P",
        //     size: 4.0,
        //     textBaseline: "middle",
        //     textAlign: "center",
        //     text: "Help"
        // }));

        // キーボードのイベントをアクションとしてバインド
        input.bindKey(input.KEY.LEFT, "left");
        input.bindKey(input.KEY.RIGHT, "right");
        input.bindKey(input.KEY.ENTER, "enter");
        input.bindKey(input.KEY.B, "return");
        input.bindKey(input.KEY.BACKSPACE, "return");

        // ゲームパッドのボタンをキーボードのキーにマッピング
        input.bindGamepad(0, {type: "buttons", code: input.GAMEPAD.BUTTONS.LEFT}, input.KEY.LEFT);
        input.bindGamepad(0, {type: "buttons", code: input.GAMEPAD.BUTTONS.RIGHT}, input.KEY.RIGHT);
        input.bindGamepad(0, {type: "buttons", code: input.GAMEPAD.BUTTONS.FACE_1}, input.KEY.ENTER);
        input.bindGamepad(0, {type: "buttons", code: input.GAMEPAD.BUTTONS.FACE_2}, input.KEY.BACKSPACE);

        audio.stopTrack();
        audio.playTrack("title");
    }

    onDestroyEvent() {

        audio.stopTrack();

        // キーボードとゲームパッドのイベントの解除
        // input.unbindKey(input.KEY.LEFT);
        // input.unbindKey(input.KEY.RIGHT);
        // input.unbindKey(input.KEY.ENTER);
        // input.unbindGamepad(0, input.GAMEPAD.BUTTONS.LEFT);
        // input.unbindGamepad(0, input.GAMEPAD.BUTTONS.RIGHT);
        // input.unbindGamepad(0, input.GAMEPAD.BUTTONS.FACE_1);
        //input.unbindGamepad(0, input.GAMEPAD.BUTTONS.FACE_2);
    }

    // キーボードとゲームパッドのイベントを購読するためのヘルパーメソッド
    subscribeToInputEvents() {
        if (this.inputMargin < this.maxInputMargin) {
            this.inputMargin++;
        } else {
            if (input.isKeyPressed("left")) {
                this.selectedItemIndex = (this.selectedItemIndex - 1 + 2) % 2;
                this.ChangeImage();
                this.inputMargin = 0;
            }
            ;

            if (input.isKeyPressed("right")) {
                this.selectedItemIndex = (this.selectedItemIndex + 1) % 2;
                this.ChangeImage();
                this.inputMargin = 0;
            }
            ;

            //エンターキーまたはゲームパッドのAボタンが押されたとき
            if (input.isKeyPressed("enter")) {
                state.change(state.PLAY);
                this.ChangeImage();
                this.inputMargin = 0;
            }
            ;
            //バックスペースキーまたはゲームパッドのBボタンが押されたとき
            if (input.isKeyPressed("return")) {
                state.change(state.MENU);
                this.inputMargin = 0;
            }
            ;
        }
    }

    ChangeImage() {
        console.log(this.selectedItemIndex)
        // 現在の背景レイヤーを削除
        if (this.backgroundLayer !== null) {
            game.world.removeChild(this.backgroundLayer);
        }
        switch (this.selectedItemIndex) {
            case 0:
                this.backgroundLayer = this.createImageLayer('help1_background');
                break;
            case 1:
                this.backgroundLayer = this.createImageLayer('help2_background');
                break;
        }
    }

    createImageLayer(imageName) {

        // 新しい背景レイヤーを作成します
        let newLayer = new ImageLayer(0, 0, {
            image: loader.getImage(imageName),
            width: game.viewport.width,
            height: game.viewport.height,
            repeat: "no-repeat",
            z: 1 // z-index
        });
        game.world.addChild(newLayer);
        return newLayer;
    }

    update(dt) {
        this.subscribeToInputEvents();
        return super.update(dt);
    }
};
