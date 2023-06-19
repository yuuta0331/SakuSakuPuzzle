import {BitmapText, Color, Container, game, input, Renderable, UITextButton} from "melonjs";

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
            hidden: true
        };
        super(x, y, settings);

        this.character = character;
        this.keyboard = keyboard;
        //this.backgroundColor="#00aa0080"
    }

    // onOver(/* event */) {
    //     this.setOpacity(1.0);
    // }
    //
    // /**
    //  * function called when the pointer is leaving the object area
    //  */
    // onOut(/* event */) {
    //     this.setOpacity(0.5);
    // }

    onClick(event) {
        // 大文字、小文字を切り替える
        let output = this.keyboard.isUppercase ? this.character.toUpperCase() : this.character;
        this.keyboard.parent.addCharacterToInput(output);
        // ここにキーが押されたときの処理を書く
        console.log('Key pressed: ' + output);
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
        this.keyboard = keyboard;
    }

    onClick(event) {
        // 大文字と小文字の切り替え
        this.keyboard.isUppercase = !this.keyboard.isUppercase;
        //this.children.filter(child => child instanceof UITextButton).forEach(child => this.removeChildNow(child));
        this.keyboard.children.filter(child => child instanceof KeyButton).forEach(KeyButton => KeyButton.updateCharacter());

        console.log('Uppercase: ' + this.keyboard.isUppercase);
        return true;
    }
}

class QwertyButton extends UITextButton {
    constructor(x, y, keyboard) {
        let settings = {
            font: "funwari-round_white",
            text: "Qwerty",
            // image: "toggle_button_image", // ここにはボタンの画像を指定します
            // spritewidth: 64,
            // spriteheight: 64
        };
        super(x, y, settings);
        // MelonJSのバグでBitMapTextが0,0にも描画されるので、位置を修正する
        //this.bitmapText = new BitmapText(x, y, settings);
        //this.bitmapText.pos.set(x, y);
        this.keyboard = keyboard;
    }

    onClick(event) {
        this.keyboard.isQwerty = !this.keyboard.isQwerty;
        this.keyboard.setupKeyboard();
        console.log('Qwerty: ' + this.keyboard.isQwerty);
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
        this.isUppercase = false;
        this.isQwerty = false;


        this.alphabet = 'abcdefghijklmnopqrstuvwxyz';
        this.qwerty = 'qwertyuiopasdfghjklzxcvbnm';
        this.numbers = '0123456789';
        // アルファベットのキーボタンを作成
        // let alphabet = 'abcdefghijklmnopqrstuvwxyz';
        // const qwerty = 'qwertyuiopasdfghjklzxcvbnm';
        // const numbers = '0123456789';
        // for(let i = 0; i < alphabet.length; i++) {
        //     let character = alphabet[i];
        //     game.world.addChild(new KeyButton(100 + (i * 70), 100, character));
        // }


        // // キーボードを作成
        // this.keyboard = new KeyButton(0, 0);
        // this.addChild(this.keyboard);
        //
        // // 大文字と小文字を切り替えるトグルボタンを作成
        // this.toggleButton = new ToggleButton(0, 0);
        // this.addChild(this.toggleButton);
        //
        // // キーボードの下にトグルボタンを配置
        // this.toggleButton.pos.set(this.keyboard.width / 2 - this.toggleButton.width / 2, this.keyboard.height + 10);
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

        // 切り替えボタンを作成
        // game.world.addChild(new ToggleButton(this.pos.x + 100, this.pos.y + 400, this));
        // game.world.addChild(new QwertyButton(this.pos.x + 300, this.pos.y + 400, this));

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
            this.addChild(new KeyButton(startX + ((totalWidth - this.numbers.length * keyWidth) / 2) + (i * keyWidth), startY + 0, this.numbers[i], this));
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

}