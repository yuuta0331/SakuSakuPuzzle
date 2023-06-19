import {Container, input, Renderable, UITextButton} from "melonjs";

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


class KeyButton extends UITextButton {
    constructor(x, y, character, keyboard) {
        let settings = {
            font: "funwari-round_white",
            text: character,
            borderWidth: 80,
            borderHeight: 80,
            textAlign: "center",
            textBaseline: "middle",
            //backgroundColor: "#f5b1b1",
            //borderColor: "#000000",
        };
        super(x, y, settings);

        this.character = character;
        this.keyboard = keyboard;
        // BitmapTextの位置を調整
        this.bitmapText.centerY = 30.0;
        //this.backgroundColor="#00aa0080"
    }

    // onOver(/* event */) {
    //     //this.setOpacity(1.0);
    //     super.onOver()
    // }
    //
    // /**
    //  * function called when the pointer is leaving the object area
    //  */
    // onOut(/* event */) {
    //     //this.setOpacity(0.5);
    //     super.onOut()
    // }

    // onHold() {
    //     super.onHold();
    // }

    // onOver(event) {
    //     this.backgroundColor = "#ffffff";
    // }
    //
    // onOut(event) {
    //     this.backgroundColor = "#000000";
    // }

    onClick(event) {
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
        // 大文字と小文字の切り替え
        this.keyboard.toggleUppercase();
        return true;
    }
}

class QwertyButton extends UITextButton {
    constructor(x, y, keyboard) {
        let settings = {
            font: "funwari-round_white",
            text: "Qwerty",
            borderHeight: 80,
            // image: "toggle_button_image", // ここにはボタンの画像を指定します
            // spritewidth: 64,
            // spriteheight: 64
        };
        super(x, y, settings);
        // MelonJSのバグでBitMapTextが0,0にも描画されるので、位置を修正する
        //this.bitmapText = new BitmapText(x, y, settings);
        //this.bitmapText.pos.set(x, y);
        // BitmapTextの位置を調整
        this.bitmapText.centerY = 27.0;
        this.keyboard = keyboard;
    }

    onClick(event) {
        this.keyboard.isQwerty = !this.keyboard.isQwerty;
        this.keyboard.setupKeyboard();
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
        // ユーザ入力から最後の文字を削除
        this.keyboard.parent.removeLastCharacterFromInput();
        return true;
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
        // ユーザ入力を確定
        this.keyboard.parent.confirmUserInput();
        return true;
    }
}


export default class VirtualKeyboard extends Container {
    constructor(x, y, parent) {
        super(x, y);

        // parent(RankingInputScreen)の参照を保存
        this.parent = parent;

        // 大文字と小文字を切り替えるフラグ
        this.isUppercase = this.parent.isUppercase;
        this.isQwerty = false;


        this.alphabet = 'abcdefghijklmnopqrstuvwxyz';
        this.qwerty = 'qwertyuiopasdfghjklzxcvbnm';
        this.numbers = '0123456789';
    }

    // setupKeyboard = () => {
    //     // 全てのキーボタンを削除する
    //     game.world.children.filter(child => child instanceof KeyButton).forEach(child => game.world.removeChild(child));
    //
    //     // 新たなキーボタンを作成する
    //     const keys = this.isQwerty ? this.qwerty : this.alphabet;
    //
    //     for(let i = 0; i < this.numbers.length; i++) {
    //         this.addChild(new KeyButton(this.pos.x + (i * 100), this.pos.y + 0, this.numbers[i], this));
    //     }
    //     for(let i = 0; i < 13; i++) {
    //         this.addChild(new KeyButton(this.pos.x + (i * 100), this.pos.y + 100, keys[i], this));
    //     }
    //     for(let i = 13; i < keys.length; i++) {
    //         this.addChild(new KeyButton(this.pos.x + ((i - 13) * 100), this.pos.y + 200, keys[i], this));
    //     }
    // }

    onActivateEvent() {
        // キーボードを表示する
        this.setupKeyboard();
    }

    setupKeyboard() {
        //game.world.children.filter(child => child instanceof KeyButton).forEach(child => game.world.removeChild(child));
        //this.children.filter(child => child instanceof KeyButton).forEach(child => this.removeChildNow(child));
        this.children.filter(child => child instanceof UITextButton).forEach(child => this.removeChildNow(child));

        const keys = this.isQwerty ? this.qwerty : this.alphabet;

        let keyWidth = 100;
        let keyHeight = 100;

        // Create a separate array for each row of keys
        const rows = this.isQwerty ? [
            this.qwerty.slice(0, 10),  // Numbers
            this.qwerty.slice(10, 19), // Q to P
            this.qwerty.slice(19, 28), // A to L
            this.qwerty.slice(28)      // Z to M
        ] : [
            this.alphabet.slice(0, this.alphabet.length / 2),
            this.alphabet.slice(this.alphabet.length / 2),
        ];

        let totalWidth = Math.max(...rows.map(row => row.length)) * keyWidth;
        //let totalHeight = (rows.length + this.isQwerty ? 3 : 3) * keyHeight;
        //let totalHeight = (this.isQwerty ? 3 : 2) * keyHeight;
        let totalHeight = 3 * keyHeight;

        let startX = this.pos.x - totalWidth / 2;
        let startY = this.pos.y - totalHeight / 2;
// If Qwerty layout is active, move the startY up to accommodate the additional row
//         if (this.isQwerty) {
//             startY += keyHeight;
//         }

        // Add number keys
        for (let i = 0; i < this.numbers.length; i++) {
            this.addChild(new KeyButton(startX + ((totalWidth - this.numbers.length * keyWidth) / 2) + (i * keyWidth), startY, this.numbers[i], this));
        }

        // Add letter keys
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
            let row = rows[rowIndex];
            let rowStartX = startX + ((totalWidth - row.length * keyWidth) / 2);
            for (let i = 0; i < row.length; i++) {
                this.addChild(new KeyButton(rowStartX + (i * keyWidth), startY + ((rowIndex + 1) * keyHeight), row[i], this));
            }
        }

        // Add control buttons
        let buttonWidth = 200;
        let buttonHeight = 100;
        this.addChild(new ToggleButton(startX, startY + totalHeight + buttonHeight, this));
        this.addChild(new QwertyButton(startX + buttonWidth, startY + totalHeight + buttonHeight, this));
        this.addChild(new BackspaceButton(startX + totalWidth - buttonWidth, startY + totalHeight + buttonHeight, this));
        this.addChild(new ConfirmButton(startX + totalWidth - buttonWidth, startY + totalHeight + 2 * buttonHeight, this));
    }


    // 大文字と小文字を切り替える
    toggleUppercase() {
        this.parent.isUppercase = !this.parent.isUppercase;
        this.isUppercase = this.parent.isUppercase;
        this.children.filter(child => child instanceof KeyButton).forEach(KeyButton => KeyButton.updateCharacter());
    }
}