import {audio, Container, input, Renderable, timer, UITextButton} from "melonjs";

function lerpColor(a, b, amount) {
    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}


class Keyboard extends Container {
    constructor(x, y) {
        super(x, y);

        let keyWidth = 30;
        let keyHeight = 30;
        let keys = "abcdefghijklmnopqrstuvwxyz";
        let keysPerRow = 10;

        for (let i = 0; i < keys.length; i++) {
            let char = keys.charAt(i);
            let keyX = (i % keysPerRow) * keyWidth;
            let keyY = Math.floor(i / keysPerRow) * keyHeight;

            this.addChild(new KeyboardKey(keyX, keyY, keyWidth, keyHeight, char));
        }
    }
}


class KeyboardKey extends Renderable {
    constructor(x, y, w, h, char) {
        super(x, y, w, h);

        this.char = char;

        // キーのテキストを設定
        this.text = new Text(0, 0, {
            font: "funwari_round",
            size: 20,
            text: char,
            fillStyle: '#000000'
        });

        // テキストをこのキーの中央に配置
        this.text.pos.set(this.width / 2, this.height / 2).sub(this.text.getBounds().width / 2, this.text.getBounds().height / 2);
    }

    update(dt) {
        // キーがクリックされたら、その文字を入力フィールドに追加
        if (this.getBounds().containsPoint(input.pointer.pos)) {
            if (input.pointer.isPressed()) {
                // TODO: Add this.char to input field
            }
        }

        return super.update(dt);
    }

    draw(renderer) {
        renderer.setColor("#FFFFFF");
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        // テキストを描画
        this.text.draw(renderer);
    }
}


export class KeyButton extends UITextButton {
    constructor(x, y, character, keyboard) {
        let settings = {
            font: "funwari-round_white",
            text: character,
            borderWidth: 80,
            borderHeight: 80,
            textAlign: "center",
            textBaseline: "middle",
            backgroundColor: "#f5b1b1",
            hoverColor: "#e88c8c",
            //borderColor: "#000000",
        };
        super(x, y, settings);

        this.character = character;
        this.keyboard = keyboard;
        // BitmapTextの位置を調整
        this.bitmapText.centerY = 30.0;
        //this.backgroundColor="#00aa0080"
    }

    // 線形補間を行う関数
    lerp(start, end, amt) {
        return start * (1 - amt) + end * amt;
    }

// カラーコードをRGB値に変換する関数
    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

// RGB値をカラーコードに変換する関数
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

// // 2つの色を指定された比率で補間する関数
//     lerpColor(color1, color2, amt) {
//         var rgb1 = this.hexToRgb(color1);
//         var rgb2 = this.hexToRgb(color2);
//
//         var r = Math.floor(this.lerp(rgb1.r, rgb2.r, amt));
//         var g = Math.floor(this.lerp(rgb1.g, rgb2.g, amt));
//         var b = Math.floor(this.lerp(rgb1.b, rgb2.b, amt));
//
//         return this.rgbToHex(r, g, b);
//     }

    update(dt) {
        // 描画が更新されない問題の対策
        //this.keyboard.toggleUppercase();

        // if (this.keyboard.charset === VirtualKeyboard.CHARSET.KATAKANA ||
        //     this.keyboard.charset === VirtualKeyboard.CHARSET.HIRAGANA) {
        //     this.pressTime = timer.getTime();
        // }
        // if (timer.getTime() - this.pressTime > 10) {
        //     this.keyboard.setOpacity(0.1);
        // }

        if (input.isKeyPressed(this.character)) {
            this.pressTime = timer.getTime();  // キーが押された時刻を記録
            this.backgroundColor = "#00aa0080"
            //this.isPressed = true;  // ボタンが押されているフラグを立てる
        }

        // キーが押されてから2秒経過したら、ボタンの色を元に戻す
        if (timer.getTime() - this.pressTime > 600) {
            this.backgroundColor = "#f5b1b1"
            //this.isPressed = false;  // ボタンが押されているフラグを落とす
        }

        // 現在時刻に対してsin関数を適用し、0から1の範囲で周期的に変化する値を作る
        // var amt = (Math.sin(timer.getTime() / 1000) + 1) / 2;  // 0から1の範囲で変化
        // this.backgroundColor = lerpColor("#fd21b1", "#ff6161", amt);

        return super.update(dt);
    }

    onOver(/* event */) {
        //this.setOpacity(1.0);
        super.onOver()
    }

    /**
     * function called when the pointer is leaving the object area
     */
    onOut(/* event */) {
        //this.setOpacity(0.5);
        super.onOut()
    }


    onClick(event) {
        audio.play("enter");
        // 大文字、小文字を切り替える
        let output = this.keyboard.isUppercase ? this.character.toUpperCase() : this.character;
        this.keyboard.parent.addCharacterToInput(output);
        return true;
    }

    updateCharacter() {
        let newCharacter = this.keyboard.isUppercase ? this.character.toUpperCase() : this.character;
        this.bitmapText.setText(newCharacter);
    }

}

class ToggleButton extends UITextButton {
    constructor(x, y, keyboard) {
        let settings = {
            font: "funwari-round_white",
            text: "Aa",
            backgroundColor: "#f5dab1",
            hoverColor: "#ffc061",
            // image: "toggle_button_image", // ここにはボタンの画像を指定します
            // spritewidth: 64,
            // spriteheight: 64
        };
        super(x, y, settings);
        // BitmapTextの位置を調整
        this.bitmapText.centerY = 27.0;
        this.keyboard = keyboard;
    }

    onClick(event) {
        audio.play("enter");
        // 大文字と小文字の切り替え
        this.keyboard.toggleUppercase();
        this.bitmapText.setText(this.keyboard.isUppercase ? "aA" : "Aa")
        return true;
    }

    update(dt) {

        if (input.isKeyPressed("shift")) {
            // キーが押された時刻を記録
            this.pressTime = timer.getTime();
            this.backgroundColor = "#00aa0080"
        }

        // キーが押されてから2秒経過したら、ボタンの色を元に戻す
        if (timer.getTime() - this.pressTime > 600) {
            this.backgroundColor = "#f5dab1"
        }

        return super.update(dt);
    }
}

class QwertyButton extends UITextButton {
    constructor(x, y, keyboard) {
        let settings = {
            font: "funwari-round_white",
            text: "Qwerty",
            borderHeight: 80,
            textAlign: "center",
            textBaseline: "middle",
            backgroundColor: "#f5dab1",
            hoverColor: "#ffc061",
        };
        super(x, y, settings);
        // MelonJSのバグでBitMapTextが0,0にも描画されるので、位置を修正する
        //this.bitmapText = new BitmapText(x, y, settings);
        //this.bitmapText.pos.set(x, y);
        // BitmapTextの位置を調整
        this.bitmapText.centerY = 27.0;
        this.keyboard = keyboard;

        if (this.keyboard.charset === VirtualKeyboard.CHARSET.ALPHABET) {
            this.bitmapText.setText("Qwerty");
        } else if (this.keyboard.charset === VirtualKeyboard.CHARSET.QWERTY) {
            this.border.width = 200;
            this.bitmapText.centerX = 100;
            this.bitmapText.setText('ABC');
        }
    }

    onClick(event) {
        audio.play("enter");
        //this.keyboard.isQwerty = !this.keyboard.isQwerty;
        this.keyboard.toggleQwerty();

        return true;
    }
}

class KanaButton extends UITextButton {
    constructor(x, y, keyboard) {
        let settings = {
            font: "funwari-round_white",
            text: "かな",
            borderHeight: 80,
            backgroundColor: "#f5dab1",
            hoverColor: "#ffc061",
        };
        super(x, y, settings);
        // MelonJSのバグでBitMapTextが0,0にも描画されるので、位置を修正する
        //this.bitmapText = new BitmapText(x, y, settings);
        //this.bitmapText.pos.set(x, y);
        // BitmapTextの位置を調整
        this.bitmapText.centerY = 30.0;
        this.keyboard = keyboard;

        if (this.keyboard.charset === VirtualKeyboard.CHARSET.HIRAGANA) {
            this.bitmapText.setText("カナ")
        } else if (this.keyboard.charset === VirtualKeyboard.CHARSET.KATAKANA) {
            this.bitmapText.setText("かな")
        }
    }

    onClick(event) {
        audio.play("enter");
        this.keyboard.toggleKana();

        return true;
    }
}

class BackspaceButton extends UITextButton {
    constructor(x, y, keyboard) {
        let settings = {
            font: "funwari-round_white",
            text: "Back",
        };
        super(x, y, settings);
        // BitmapTextの位置を調整
        this.bitmapText.centerY = 27.0;
        this.keyboard = keyboard;
    }

    onClick(event) {
        audio.play("return");
        // ユーザ入力から最後の文字を削除
        this.keyboard.parent.removeLastCharacterFromInput();
        return true;
    }

    update(dt) {

        if (input.isKeyPressed('back')) {
            // キーが押された時刻を記録
            this.pressTime = timer.getTime();
            this.backgroundColor = "#00ff00ff"
        }

        // キーが押されてから2秒経過したら、ボタンの色を元に戻す
        if (timer.getTime() - this.pressTime > 600) {
            this.backgroundColor = "#00aa0080"
        }

        return super.update(dt);
    }
}

class ConfirmButton extends UITextButton {
    constructor(x, y, keyboard) {
        let settings = {
            font: "funwari-round_white",
            text: "Enter",
        };
        super(x, y, settings);
        // BitmapTextの位置を調整
        this.bitmapText.centerY = 27.0;
        this.keyboard = keyboard;
    }

    onClick(event) {
        audio.play("enter");
        // ユーザ入力を確定
        this.keyboard.parent.confirmUserInput();
        return true;
    }

    update(dt) {

        if (input.isKeyPressed('enter')) {
            // キーが押された時刻を記録
            this.pressTime = timer.getTime();
            this.backgroundColor = "#fff200"
        }

        // キーが押されてから2秒経過したら、ボタンの色を元に戻す
        if (timer.getTime() - this.pressTime > 600) {
            this.backgroundColor = "rgba(255,242,0,0.5)"
        }

        return super.update(dt);
    }
}

export default class VirtualKeyboard extends Container {

    static CHARSET = {
        ALPHABET: 0,
        QWERTY: 1,
        HIRAGANA: 2,
        KATAKANA: 3
    };

    constructor(x, y, parent) {
        super(x, y);

        // parent(RankingInputScreen)の参照を保存
        this.parent = parent;

        // 大文字と小文字を切り替えるフラグ
        this.isUppercase = this.parent.isUppercase;
        this.isQwerty = false;

// 初期化のとき
        this.charset = VirtualKeyboard.CHARSET.ALPHABET;

        this.alphabet = 'abcdefghijklmnopqrstuvwxyz';
        this.qwerty = 'qwertyuiopasdfghjklzxcvbnm';
        this.numbers = '0123456789';
        this.hiragana = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
        this.katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

        // キーボードのレイアウトを作成
        this.hiraganaBig = 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん';
        this.hiraganaSmall = 'ぁぃぅぇぉっゃゅょゎ';
        this.katakanaBig = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.katakanaSmall = 'ァィゥェォッャュョヮ';

    }

    onActivateEvent() {
        // キーボードを表示する
        this.setupKeyboard();
    }

    setupKeyboard() {
        this.children.filter(child => child instanceof UITextButton).forEach(child => this.removeChildNow(child));

        // charsetの値に基づいて現在のcharsetを選択する
        let charset;
        switch (this.charset) {
            case 0:
                charset = this.alphabet;
                break;
            case 1:
                charset = this.qwerty;
                break;
            case 2:
                charset = this.hiragana;
                //charset = this.hiraganaBig + this.hiraganaSmall;
                break;
            case 3:
                charset = this.katakana;
                //charset = this.katakanaBig + this.katakanaSmall;
                break;
        }

        let keyWidth = 100;
        let keyHeight = 100;

        // レイアウトの選択
        let layout;
        if (this.charset == 0) {  // ABC配列
            layout = [
                charset.slice(0, charset.length / 2),
                charset.slice(charset.length / 2),
            ];
        } else if (this.charset == 1) {  // QWERTY配列
            layout = [
                charset.slice(0, 10),  // Numbers
                charset.slice(10, 19), // Q to P
                charset.slice(19, 28), // A to L
                charset.slice(28)      // Z to M
            ];
        } else {  // ひらがなとカタカナ
            layout = [
                charset.slice(0, 10),
                charset.slice(10, 20),
                charset.slice(20, 30),
                charset.slice(30),

                // 小文字も入れた場合
                // charset.slice(30, 40),
                // charset.slice(40),
            ];
        }

        let totalWidth = Math.max(...layout.map(row => row.length)) * keyWidth;
        let totalHeight = layout.length * keyHeight;

        let startX = this.pos.x - totalWidth / 2;
        let startY = this.pos.y - totalHeight / 2;

        // Add number keys
        for (let i = 0; i < this.numbers.length; i++) {
            this.addChild(new KeyButton(startX + ((totalWidth - this.numbers.length * keyWidth) / 2) + (i * keyWidth), startY, this.numbers[i], this));
        }

        // Add letter keys
        for (let rowIndex = 0; rowIndex < layout.length; rowIndex++) {
            let row = layout[rowIndex];
            let rowStartX = startX + ((totalWidth - row.length * keyWidth) / 2);
            for (let i = 0; i < row.length; i++) {
                this.addChild(new KeyButton(rowStartX + (i * keyWidth), startY + ((rowIndex + 1) * keyHeight), row[i], this));
            }
        }

        // Add control buttons
        let buttonWidth = 200;
        let buttonHeight = 100;
        let buttonStartY = startY + totalHeight + buttonHeight - (this.charset == 1 ? keyHeight : 0);
        this.addChild(new ToggleButton(startX, buttonStartY, this));
        this.addChild(new QwertyButton(startX + buttonWidth, buttonStartY, this));
        this.addChild(new KanaButton(startX + 3 * buttonWidth, buttonStartY, this));
        this.addChild(new BackspaceButton(startX + totalWidth - buttonWidth, buttonStartY, this));
        this.addChild(new ConfirmButton(startX + totalWidth - buttonWidth, buttonStartY + buttonHeight, this));
    }


    // 大文字と小文字を切り替える
    toggleUppercase() {
        this.parent.isUppercase = !this.parent.isUppercase;
        this.isUppercase = this.parent.isUppercase;
        this.children.filter(child => child instanceof KeyButton).forEach(KeyButton => KeyButton.updateCharacter());
    }


    // アルファベットとひらがなとカタカナを切り替えるメソッドを追加
    toggleCharset() {
        // if (this.currentCharset === this.alphabet) {
        //     this.currentCharset = this.hiragana;
        // } else if (this.currentCharset === this.hiragana) {
        //     this.currentCharset = this.katakana;
        // } else {
        //     this.currentCharset = this.alphabet;
        // }
        //
        // // キーボードを再セットアップする
        // this.setupKeyboard();

        this.charset = (this.charset + 1) % 4;  // charsetを次の値に変更する
        this.setupKeyboard();  // キーボードを再セットアップする
    }

    toggleQwerty() {
        if (this.charset === VirtualKeyboard.CHARSET.ALPHABET) {
            this.charset = VirtualKeyboard.CHARSET.QWERTY;
        } else if (this.charset === VirtualKeyboard.CHARSET.QWERTY) {
            this.charset = VirtualKeyboard.CHARSET.ALPHABET;
        } else {
            this.charset = VirtualKeyboard.CHARSET.ALPHABET;
        }

        // キーボードを再セットアップする
        this.setupKeyboard();
    }

    toggleKana() {
        if (this.charset === VirtualKeyboard.CHARSET.HIRAGANA) {
            this.charset = VirtualKeyboard.CHARSET.KATAKANA;
        } else if (this.charset === VirtualKeyboard.CHARSET.KATAKANA) {
            this.charset = VirtualKeyboard.CHARSET.HIRAGANA;
        } else {
            this.charset = VirtualKeyboard.CHARSET.HIRAGANA;
        }

        // キーボードを再セットアップする
        this.setupKeyboard();
    }


}