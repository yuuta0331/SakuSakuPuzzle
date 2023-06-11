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
        this.speed = 12;

        // register on the pointermove event
        // マウス・タッチ入力を有効にする
        input.registerPointerEvent('pointermove', this, this.pointerMove.bind(this));

        // ゲームパッド入力を有効にする
        bindGamepads();

        bindKeys();
    }

    pointerMove(event) {
        //if (this.released === false) {
        var x = event.gameScreenX + (event.width / 2);
        var y = event.gameScreenY + (event.height / 2);
        console.log('pointerMove:', x, y); // マウスポインタの位置をログ出力
        // pointerMove is a global on the viewport, so check for coordinates
        if (this.getBounds().contains(x, y)) {
            // if any direction is active, update it if necessary
            if (this.cursors.left === true || this.cursors.right === true) {
                this.checkDirection.call(this, x, y);
            }
        } else {
            // release keys/joypad if necessary
            this.onRelease.call(this, event);
        }
        //}
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
        if (input.pointer.hover) {
            const pointerPos = game.input.pointer.pos;
            console.log('Mouse input:', pointerPos); // マウスポインタの位置をログ出力

            const newX = Math.min(Math.max(pointerPos.x, 0), game.viewport.width - this.width);
            const newY = Math.min(Math.max(pointerPos.y, 0), game.viewport.height - this.height);

            if (newX !== this.pos.x || newY !== this.pos.y) {
                this.pos.x = newX;
                this.pos.y = newY;
                moved = true;
            }
        }

        // ゲームパッドのスティック入力によりカーソルを移動する
        if (input.isKeyPressed('left')) {
            const newX = this.pos.x - this.speed;
            if (newX >= 0) {
                this.pos.x = newX;
                moved = true;
            }
        }
        if (input.isKeyPressed('right')) {
            const newX = this.pos.x + this.speed;
            // if (newX <= game.viewport.width - this.width) {
            if (newX <= game.viewport.width) {
                this.pos.x = newX;
                moved = true;
            }
        }
        if (input.isKeyPressed('up')) {
            const newY = this.pos.y - this.speed;
            if (newY >= 0) {
                this.pos.y = newY;
                moved = true;
            }
        }
        if (input.isKeyPressed('down')) {
            const newY = this.pos.y + this.speed;
            // if (newY <= game.viewport.height - this.height) {
            if (newY <= game.viewport.height) {
                this.pos.y = newY;
                moved = true;
            }
        }

        return moved;
    }

    onDestroyEvent() {

        // release register event event
        me.input.releasePointerEvent("pointermove", this);

        unbindKeys();
        unbindGamepads();
    }
}
