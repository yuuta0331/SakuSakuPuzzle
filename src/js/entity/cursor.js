import { game, input, Renderable, loader, Sprite } from "melonjs";
import { bindKeys, unbindKeys, bindGamepads, unbindGamepads } from "../util/constants";

export default class Cursor extends Sprite {
    constructor(x, y) {
        const settings = {
            image: loader.getImage('cursor'), // ここでカーソルの画像を読み込む
            framewidth: 140,
            frameheight: 100
        };
        super(x, y, settings);

        // カーソルの移動速度
        this.speed = 3;

        // ゲームパッド入力を有効にする
        bindGamepads();

        bindKeys();
    }

    update(dt) {
        const moving = this.handleInput();

        // 位置が変更された場合のみ、再描画を行う
        if (moving) {
            this.updateBounds();
        }

        //return super.update(dt);
        return moving;
    }

    handleInput() {
        
        let moved = false;

        // マウスポインタの位置にカーソルを移動する
        // if (input.pointer.hover) {
        //     const pointerPos = game.input.pointer.pos;
        //     console.log('Mouse input:', pointerPos); // マウスポインタの位置をログ出力
        //     this.pos.x = pointerPos.x;
        //     this.pos.y = pointerPos.y;
        //     moved = true;
        // }

        // ゲームパッドのスティック入力によりカーソルを移動する
        // const left = input.keyStatus('left');
        // const right = input.keyStatus.right;
        // const up = input.keyStatus.up;
        // const down = input.keyStatus.down;

        // if (left || right || up || down) {
        //     console.log('Gamepad input:', left, right, up, down); // ゲームパッドの入力をログ出力
        //     const dx = (right ? this.speed : 0) - (left ? this.speed : 0);
        //     const dy = (down ? this.speed : 0) - (up ? this.speed : 0);
        //     this.pos.x += dx;
        //     this.pos.y += dy;
        //     moved = true;
        // }

        // ゲームパッドのスティック入力によりカーソルを移動する
        if (input.isKeyPressed('left')) {
            this.pos.x -= this.speed;
            moved = true;
        }
        if (input.isKeyPressed('right')) {
            this.pos.x += this.speed;
            moved = true;
        }
        if (input.isKeyPressed('up')) {
            this.pos.y -= this.speed;
            moved = true;
        }
        if (input.isKeyPressed('down')) {
            this.pos.y += this.speed;
            moved = true;
        }

        return moved;
    }

    onDestroyEvent() {
        unbindKeys();
        unbindGamepads();
    }
}
