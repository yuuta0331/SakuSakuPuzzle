import {
    game,
    audio,
    input,
    Stage,
    ColorLayer,
    BitmapText,
    state,
    Container,
    Renderable, Text
} from "melonjs";
import g_game from "../../game";
import VirtualKeyboard from "../entities/keyboard";

class DebugRect extends Renderable {
    constructor(x, y, w, h) {
        super(x, y, w, h);

        this.fillColor = "rgba(255, 0, 0, 0.5)";  // 赤色で半透明の背景
        this.strokeColor = "blue";  // 枠線の色は青
        this.lineWidth = 2;  // 枠線の太さは2
    }

    draw(renderer) {
        renderer.setColor(this.fillColor);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        renderer.setColor(this.strokeColor);
        renderer.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
    }
}


class RankingInputScreen extends Stage {

    onResetEvent() {

        this.ranking = [];

        // 画面遷移中かどうかを表すフラグ
        this.isTransitioning = false;

        // キー入力の最後の入力時間を記録するための変数
        this.lastInputTime = {};

        this.isUppercase = false;

        // add a gray background to the default Stage
        game.world.addChild(new ColorLayer("background", "#F8E860"), 1);

        // add a font text display object
        // game.world.addChild(new BitmapText(game.viewport.width / 2, game.viewport.height / 2, {
        //     font: "PressStart2P",
        //     size: 4.0,
        //     textBaseline: "middle",
        //     textAlign: "center",
        //     text: "Ranking"
        // }));

        let guidText = new Text(game.viewport.width / 2, game.viewport.height * 0.8, {
            font: "funwari_round",
            size: 60,
            textBaseline: "middle",
            textAlign: "center",
            text: "おめでとうございます！トップ10にはいりました。\nおなまえをにゅうりょくしてください。",
            fillStyle: '#FF1508'
        });
        game.world.addChild(guidText, 2);


        // キーボードのイベントをアクションとしてバインド
        input.bindKey(input.KEY.ENTER, "enter");
        input.bindKey(input.KEY.BACKSPACE, "back");
        input.bindKey(input.KEY.B, "back");
        input.bindKey(input.KEY.SHIFT, "shift");

        // ゲームパッドのボタンをキーボードのキーにマッピング
        input.bindGamepad(0, {type: "buttons", code: input.GAMEPAD.BUTTONS.FACE_1}, input.KEY.ENTER);
        input.bindGamepad(0, {type: "buttons", code: input.GAMEPAD.BUTTONS.FACE_2}, input.KEY.BACKSPACE);

        audio.stopTrack();
        audio.playTrack("result");
        // this.submitScore("test", 100);

        // ユーザの入力を保存するための変数
        this.userInput = "";

        // 入力フィールドを表示するためのテキストオブジェクト
        this.inputField = new Text(game.viewport.width / 2, game.viewport.height * 0.3, {
            font: "funwari_round",
            size: 60,
            text: 'input' + this.userInput,
            fillStyle: '#FFFFFF'
        });
        game.world.addChild(this.inputField, 3);

        // AからZまでのキーを入力としてバインド
        for (let i = 65; i <= 90; i++) {  // ASCII values for A-Z
            input.bindKey(i, String.fromCharCode(i).toLowerCase());
        }
        this.virtualKeyboard = new VirtualKeyboard(game.viewport.width / 2, game.viewport.height * 0.5, this);
        game.world.addChild(this.virtualKeyboard, 3);
    }

    // KeyButtonから呼ばれるメソッド
    addCharacterToInput(char) {
        this.userInput += char;
        this.inputField.setText(this.userInput);
    }

    removeLastCharacterFromInput() {
        this.userInput = this.userInput.slice(0, -1);
        this.inputField.setText(this.userInput);
    }

    confirmUserInput() {
        this.isTransitioning = true;
        this.submitScore(this.userInput, g_game.data.score);
        state.change(state.USER);
    }


    onDestroyEvent() {

        g_game.data.score = 0;
        audio.stopTrack();

        // キーボードとゲームパッドのイベントの解除
        // input.unbindKey(input.KEY.ENTER);
        // input.unbindKey(input.KEY.BACKSPACE);
        // input.unbindKey(input.KEY.B);
        // input.unbindGamepad(0, input.GAMEPAD.BUTTONS.FACE_1);
        // input.unbindGamepad(0, input.GAMEPAD.BUTTONS.FACE_2);
    }

    update(dt) {
        // if (!this.isTransitioning && input.isKeyPressed("back")) {
        //     this.isTransitioning = true;
        //     state.change(state.MENU);
        // }


        let delay = 200;  // キー入力の遅延時間（ミリ秒）

        // AからZまでのキーが押されたら、その文字を入力フィールドに追加
        for (let i = 65; i <= 90; i++) {
            let char = String.fromCharCode(i).toLowerCase();
            if (input.isKeyPressed(char)) {
                // 前回の入力から一定時間が経過していれば、入力を受け付ける
                if (!this.lastInputTime[char] || Date.now() - this.lastInputTime[char] > delay) {
                    let output = this.isUppercase ? char.toUpperCase() : char;
                    this.userInput += output;
                    this.inputField.setText(this.userInput);
                    this.lastInputTime[char] = Date.now();
                }
            }
        }

        // バックスペースキーが押されたら、最後の文字を削除する
        if (input.isKeyPressed('back')) {
            if (!this.lastInputTime['back'] || Date.now() - this.lastInputTime['back'] > delay) {
                this.userInput = this.userInput.slice(0, -1);
                this.inputField.setText(this.userInput);
                this.lastInputTime['back'] = Date.now();
            }
        }

        if (input.isKeyPressed('shift')) {
            if (!this.lastInputTime['shift'] || Date.now() - this.lastInputTime['shift'] > delay) {
                //this.virtualKeyboard.isUppercase = !this.virtualKeyboard.isUppercase;
                this.virtualKeyboard.toggleUppercase();
                this.lastInputTime['shift'] = Date.now();
            }
        }

        // Enterキーが押されたら、入力を確定する
        if (input.isKeyPressed('enter')) {
            if (!this.lastInputTime['enter'] || Date.now() - this.lastInputTime['enter'] > delay) {
                console.log('Input confirmed:', this.userInput);
                this.lastInputTime['enter'] = Date.now();
            }
        }
        // 入力をコンソールに表示
        //console.log(this.userInput);

        if (!this.isTransitioning && input.isKeyPressed("enter")) {
            this.isTransitioning = true;
            this.submitScore(this.userInput, g_game.data.score);
            state.change(state.USER);
        }
        return super.update(dt);
    }

    submitScore(name, score) {
        var scoresRef = firebase.database().ref('scores');
        var newScoreRef = scoresRef.push();
        newScoreRef.set({
            name: name,
            score: score
        });
    }

};

export default RankingInputScreen;
