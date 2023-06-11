import { game, event, input, Renderable, loader, Sprite } from "melonjs";
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
        // これでも大丈夫だが、メソッドを呼び出すたびにイベントが登録されてしまうので、
        //input.registerPointerEvent('pointermove', game.viewport, this.pointerMove.bind(this));


        const self = this; // ここでthis（Cursorインスタンス）をselfに保存します
        input.registerPointerEvent('pointermove', game.viewport, function(event) {
            self.pointerMove(event); // selfを使用してpointerMoveを呼び出します
        });
        // TODO 負荷が高いので、マウスポインタの位置を取得する処理は、改善が必要


        // ゲームパッド入力を有効にする
        bindGamepads();

        bindKeys();
    }

    pointerMove(event) {
        // マウスポインタの位置を取得
        var x = event.gameScreenX;
        var y = event.gameScreenY;
        //console.log('pointerMove:', x, y); // マウスポインタの位置をログ出力
    
        // カーソルの位置をマウスポインタの位置に設定
        this.pos.x = x;
        this.pos.y = y;

        // 描画を強制的に更新する
        game.repaint();
    }


    update(dt) {
        // input.registerPointerEvent('pointermove', game.viewport, (event) => {
        //             // マウスポインタの位置を取得
        // var x = event.gameScreenX;
        // var y = event.gameScreenY;
        // console.log('pointerMove:', x, y); // マウスポインタの位置をログ出力

        // // カーソルの位置をマウスポインタの位置に設定
        // this.pos.x = x;
        // this.pos.y = y;
        // });

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
        // マウスポインタの位置を取得
        // var x = input.pointer.pos.x;
        // var y = input.pointer.pos.y;
        // console.log('update:', x, y); // マウスポインタの位置をログ出力

        // // カーソルの位置がマウスポインタの位置と異なる場合のみ更新
        // if (this.pos.x !== x || this.pos.y !== y) {
        //     // カーソルの位置をマウスポインタの位置に設定
        //     this.pos.set(x, y);

        //     // 再描画を行います
        //     return true;
        // }

        // if (input.pointer.hover) {
        //     const pointerPos = game.input.pointer.pos;
        //     console.log('Mouse input:', pointerPos); // マウスポインタの位置をログ出力

        //     const newX = Math.min(Math.max(pointerPos.x, 0), game.viewport.width - this.width);
        //     const newY = Math.min(Math.max(pointerPos.y, 0), game.viewport.height - this.height);

        //     if (newX !== this.pos.x || newY !== this.pos.y) {
        //         this.pos.x = newX;
        //         this.pos.y = newY;
        //         moved = true;
        //     }
        // }

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
