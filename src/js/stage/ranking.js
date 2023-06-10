import { game, input, Stage, ColorLayer, BitmapText, Sprite, loader, state } from "melonjs";

class RankingScreen extends Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {
        // add a gray background to the default Stage
        game.world.addChild(new ColorLayer("background", "#202020"));

        // add a font text display object
        game.world.addChild(new BitmapText(game.viewport.width / 2, game.viewport.height / 2, {
            font: "PressStart2P",
            size: 4.0,
            textBaseline: "middle",
            textAlign: "center",
            text: "Ranking"
        }));

        // キーボードのイベントをアクションとしてバインド
        input.bindKey(input.KEY.ENTER, "enter");
        input.bindKey(input.KEY.BACKSPACE, "back");

        // ゲームパッドのボタンをキーボードのキーにマッピング
        input.bindGamepad(0, { type: "buttons", code: input.GAMEPAD.BUTTONS.FACE_1 }, input.KEY.ENTER);
        input.bindGamepad(0, { type: "buttons", code: input.GAMEPAD.BUTTONS.FACE_2 }, input.KEY.BACKSPACE);
    }

    onDestroyEvent() {
        // キーボードとゲームパッドのイベントの解除
        input.unbindKey(input.KEY.ENTER);
        input.unbindKey(input.KEY.BACKSPACE);
        input.unbindGamepad(0, input.GAMEPAD.BUTTONS.FACE_1);
        input.unbindGamepad(0, input.GAMEPAD.BUTTONS.FACE_2);
    }

    update(dt) {
        if (input.isKeyPressed("back")) {
            state.change(state.MENU);
        } else
            if (input.isKeyPressed("enter")) {
                state.change(state.PLAY);
            }
        return super.update(dt);
    }
};

export default RankingScreen;
