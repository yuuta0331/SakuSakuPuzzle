import {game, event, input, Renderable, loader, Sprite, pool, device} from "melonjs";
import {bindKeys, unbindKeys, bindGamepads, unbindGamepads} from "../util/constants";
import {BlockPart} from "../renderables/block_grid";

export default class Cursor extends Sprite {
    constructor(x, y, splitGrid, centerGrid) {
        const settings = {
            image: loader.getImage('cursor'), // ここでカーソルの画像を読み込む
            framewidth: 140,
            frameheight: 100
        };
        super(x, y, settings);

        this.anchorPoint.set(1.0, 0.0); // アンカーポイントを中心に設定

        // 押した瞬間・離した瞬間のキー入力フラグ
        this.wasKeyPressed = false;

        // 掴む・離すのキー入力フラグ
        this.isGrabbing = false;

        // ブロックを掴んでいるかどうかのフラグ
        this.grabbingState = false;

        this.grabbedBlock = null; // 掴んでいるブロック
        this.centerGrid = centerGrid; // お手本ブロック

        this.splitGrid = splitGrid;

        // メンバ変数posを初期化する
        this.pos = {
            x: game.viewport.width / 2,
            y: game.viewport.height / 2,
        };


        // カーソルの移動速度
        this.speed = 12;

        // register on the pointermove event
        // マウス・タッチ入力を有効にする
        // これでも大丈夫だが、メソッドを呼び出すたびにイベントが登録されてしまうので、
        //input.registerPointerEvent('pointermove', game.viewport, this.pointerMove.bind(this));


        // モバイルデバイスの場合はカーソルをタッチで動かせないようにする
        if (!device.isMobile) {
            const self = this; // ここでthis（Cursorインスタンス）をselfに保存します
            input.registerPointerEvent('pointermove', game.viewport, function (event) {
                self.pointerMove(event); // selfを使用してpointerMoveを呼び出します
            });
            // TODO 負荷が高いので、マウスポインタの位置を取得する処理は、改善が必要
        }


        // ゲームパッド入力を有効にする
        bindGamepads();

        bindKeys();

        // Cursorのオブジェクトプールを作成します。
        // pool.register("cursor", Cursor);
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

        // ブロックが掴まれている場合、その位置をカーソルに追従させる
        if (this.grabbedBlock && this.centerGrid) {
            this.grabbedBlock.pos.x = this.pos.x;
            this.grabbedBlock.pos.y = this.pos.y;
            this.centerGrid.blocks.push(this.grabbedBlock);
            this.updateBounds();
        }

        let isKeyPressed = input.isKeyPressed('enter');

        // Aボタンが押された瞬間に動作を切り替える
        if (isKeyPressed && !this.wasKeyPressed) {
            if (this.isGrabbing) {
                // Aボタンが押されたときにブロックをドロップする
                if (this.grabbedBlock !== null) {
                    this.releaseBlock();
                }
            } else {
                // Aボタンが押されたときにブロックをつかむ
                if (this.grabbedBlock === null) {
                    this.grabBlock();
                }
            }
            this.isGrabbing = !this.isGrabbing;
        }


        this.wasKeyPressed = isKeyPressed;

        const moving = this.handleInput();

        // 位置が変更された場合のみ、再描画を行う
        if (moving) {
            this.updateBounds();
        }

        //return super.update(dt);
        return moving;
    }

    grabBlock() {
        // splitGrid からブロックをつかむ
        if (!this.grabbingState && !this.grabbedBlock) {
            let blockIndex = this.getBlockIndex(this.splitGrid);
            if (blockIndex !== -1) {
                this.grabbedBlock = this.splitGrid.blocks.splice(blockIndex, 1)[0];
                this.grabbingState = true;  // ステートを掴む状態に変更します。
            }
        }
        // } else if (this.grabbingState && this.grabbedBlock) {
        //     // 既にブロックを持っている状態でAボタンが押された場合は、ブロックを離します。
        //     this.releaseBlock();
        // }
    }

    releaseBlock() {
        // centerGrid にブロックを置く
        if (this.grabbedBlock && this.centerGrid) {
            this.grabbedBlock.pos.x = this.pos.x;
            this.grabbedBlock.pos.y = this.pos.y;
            this.centerGrid.blocks.push(this.grabbedBlock);
            this.grabbedBlock = null;
            this.grabbingState = false;  // ステートを離す状態に変更します。
        }
    }


    getBlockIndex(grid) {
        // grid のブロックの中でカーソルがその領域内にあるものを探す
        for (let i = 0; i < grid.blocks.length; i++) {
            let block = grid.blocks[i];
            if (this.pos.x >= block.pos.x && this.pos.x <= block.pos.x + block.width &&
                this.pos.y >= block.pos.y && this.pos.y <= block.pos.y + block.height) {
                return i;
            }
        }
        return -1;
    }


    dropBlock() {
        if (this.grabbedBlock) {
            this.centerBlock.addBlock(this.grabbedBlock);
            this.grabbedBlock = null;
            if (this.centerBlock.matches(this.sampleGrid)) {
                // centerGridがsampleGridと一致しているときの処理を書く
            }
        }
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

    destroy() {

        input.releasePointerEvent("pointermove", this);

        unbindKeys();
        unbindGamepads();

        // 親クラスのdestroyメソッドを呼び出します。
        //super.destroy();
    }


    // onDestroyEvent() {
    //
    //     // release register event event
    //     input.releasePointerEvent("pointermove", this);
    //
    //     unbindKeys();
    //     unbindGamepads();
    // }

}

//pool.register("Cursor", Cursor);
