import {game, audio, input, loader, Sprite, Vector2d} from "melonjs";
import {bindKeys, bindGamepads, unbindGamepads} from "../util/constants";
import {BlockPart} from "../renderables/block_grid";
import {MyRectangle} from "../stage/MyRectangle";

export default class Cursor extends Sprite {
    constructor(x, y, splitGrid, centerGrid) {
        const settings = {
            image: loader.getImage('cursor'), // ここでカーソルの画像を読み込む
            framewidth: 140,
            frameheight: 100
        };
        super(x, y, settings);

        // this.anchorPoint.set(1.0, 0.0); // アンカーポイントを中心に設定
        this.anchorPoint.set(0.5, 1.0); // アンカーポイントを中心に設定

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

        // this.body.setStatic();

        // status flags
        this.selected = false;
        this.hover = false;

        // enable physic and input event for this renderable
        this.isKinematic = false;

        // to memorize where we grab the sprite
        this.grabOffset = new Vector2d(0, 0);

        this.grabBlockCount = 0;

        // スケールを0.5倍にする
        this.scale(0.5);
        // 左右反転させる
        this.flipX(true);
        // this.getAbsolutePosition()
        // half transparent when not selected
        // this.setOpacity(0.5);

        // register on the pointermove event
        // マウス・タッチ入力を有効にする
        // これでも大丈夫だが、メソッドを呼び出すたびにイベントが登録されてしまうので、
        // input.registerPointerEvent('pointermove', game.viewport, this.pointerMove.bind(this));

        // onActivateEvent() {
        //     // マウス/タッチ入力のイベントを登録
        //     input.registerPointerEvent("pointerdown", this, this.onSelect.bind(this));
        //     input.registerPointerEvent("pointerup", this, this.onRelease.bind(this));
        //     input.registerPointerEvent("pointercancel", this, this.onRelease.bind(this));
        //     input.registerPointerEvent("pointermove", this, this.pointerMove.bind(this));
        //     input.registerPointerEvent("wheel", this, this.onScroll.bind(this));
        // }


        // モバイルデバイスの場合はカーソルをタッチで動かせないようにする
        // if (!device.isMobile) {
            const self = this; // ここでthis（Cursorインスタンス）をselfに保存します
            input.registerPointerEvent('pointermove', game.viewport, function (event) {
                self.pointerMove(event); // selfを使用してpointerMoveを呼び出します
            });
        input.registerPointerEvent('pointerdown', game.viewport, function (event) {
            self.onSelect(event); // selfを使用してpointerMoveを呼び出します
        });
            // TODO 負荷が高いので、マウスポインタの位置を取得する処理は、改善が必要
        // }


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

        // 掴んだオブジェクトをカーソルの中心に移動させる。
        // this.event.pos.set(this.apos.gameX, this.pos.gameY, this.pos.z);

        // 描画を強制的に更新する
        // game.repaint();
    }

    onSelect(event) {
        // if (this.selected === false) {
        //     // manually calculate the relative coordinates for the body shapes
        //     // since only the bounding box is used by the input event manager
        //     var x = event.gameX - this.getBounds().x + this.body.getBounds().x;
        //     var y = event.gameY - this.getBounds().y + this.body.getBounds().y;
        //
        //     // the pointer event system will use the object bounding rect, check then with with all defined shapes
        //     if (this.body.contains(x, y)) {
        //         this.selected = true;
        //     }
        //     if (this.selected) {
        //         // 掴んだオブジェクトをカーソルの中心に移動させる。
        //         this.event.pos.set(this.pos.gameX, this.pos.gameY, this.pos.z);
        //
        //
        //         this.grabOffset.set(event.gameX, event.gameY);
        //         this.grabOffset.sub(this.pos);
        //         this.setOpacity(1.0);
        //     }
        //     this.isDirty = true;
        // }
        // // don't propagate the event furthermore if selected
        // return !this.selected;

        if (this.grabbedBlock !== null) {
            this.releaseBlock();
        }

        if (this.grabbedBlock === null) {
            this.grabBlock();
        }
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
        // let debugPoint = new Point(this.pos.x, this.pos.y);
        // let debugPoint = new Rect(this.pos.x, this.pos.y);
        // game.world.addChild(debugPoint);

        // ブロックが掴まれている場合、その位置をカーソルに追従させる
        if (this.grabbedBlock && this.centerGrid) {
            this.grabbedBlock.pos.x = this.pos.x;
            this.grabbedBlock.pos.y = this.pos.y;
            // game.world.addChild(this.grabbedBlock);
            // this.centerGrid.blocks.push(this.grabbedBlock);
            // 描画を強制的に更新する
            // this.updateBounds();
            // game.repaint();
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
                // this.grabbedBlock = this.splitGrid.blocks[blockIndex];
                this.grabbingState = true;  // ステートを掴む状態に変更します。
                game.world.addChild(this.grabbedBlock, ++this.grabBlockCount + 99);
                // SE再生
                audio.play("grabBlock");
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

            // 許容できる誤差の閾値
            const tolerance = 100;

            // centerGrid.blocks内の各Blockオブジェクトとthis.grabbedBlockの座標の距離を計算
            this.centerGrid.blocks.forEach(block => {
                const distance = Math.sqrt(Math.pow(((block.pos.x - block.width * 1.5) - this.grabbedBlock.pos.x), 2) + Math.pow(((block.pos.y - block.height * 1.5) - this.grabbedBlock.pos.y), 2));
                // 一定距離内にある場合
                if (distance <= tolerance) {
                    // 色、形、角度が一致する場合
                    if (block.color === this.grabbedBlock.color && block.shape === this.grabbedBlock.shape && block.rotation === this.grabbedBlock.rotation) {
                        // block.matchedが既にtrueの場合は、除外
                        if (block.matched) {
                            return;
                        }
                        // 許容できる誤差内にある場合、this.grabbedBlockの座標を近い座標に調整
                        this.grabbedBlock.pos.x = (block.pos.x - block.width * 1.5);
                        this.grabbedBlock.pos.y = (block.pos.y - block.height * 1.5);
                        // デバック表示
                        // console.log("match");
                        // SE再生
                        audio.play("releaseBlock");
                        // 一致したフラグを立てる
                        block.matched = true;
                    } else {  // 一致しない場合

                    }
                }
            });

            this.grabbedBlock = null;
            this.grabbingState = false;  // ステートを離す状態に変更します。
        }
    }


    getBlockIndex(grid) {
        // grid のブロックの中でカーソルがその領域内にあるものを探す
        //! デバック表示
        // let myRect = new MyRectangle(this.pos.x, this.pos.y, 10, 10, '#ffbdbd');
        // game.world.addChild(myRect, 999);

        for (let i = 0; i < grid.blocks.length; i++) {
            let block = grid.blocks[i];
            //! デバック表示
            // let myRect = new MyRectangle((block.pos.x - block.width * 1.5), (block.pos.y - block.height * 1.5), 10, 10, '#ffbdbd');
            // game.world.addChild(myRect, 999);
            if (this.pos.x >= (block.pos.x - block.width * 1.5) && this.pos.x <= block.pos.x &&
                this.pos.y >= (block.pos.y - block.height * 1.5) && this.pos.y <= block.pos.y) {
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

        //     // 再描画
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
        input.releasePointerEvent("pointerdown", this);

        //! unbindKeys();を実行するとエラーが発生するのでコメント
        // unbindKeys();
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
