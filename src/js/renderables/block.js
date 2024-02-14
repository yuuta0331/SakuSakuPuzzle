import {audio, Polygon, Body, Renderable, input, Rect} from 'melonjs';

class Triangle extends Renderable {
    constructor(x, y, width, height, color) {
        super(x, y, width, height);
        this.color = color;
        this.floating = true;
    }

    draw(renderer) {
        renderer.setColor(this.color);
        let path = new Polygon(0, 0, [
            {x: this.pos.x, y: this.pos.y},
            {x: this.pos.x + this.width, y: this.pos.y},
            {x: this.pos.x + this.width / 2, y: this.pos.y + this.height}
        ]);
        renderer.stroke(path);
        renderer.fill(path);
    }
}   


export default class Block extends Renderable {
    constructor(x, y, width, height, color, shape, alpha = 1.0, isInteractive = false) {
        super(x, y, width, height);
        this.color = color;
        this.shape = shape; // "square" or "triangle"
        this.rotation = 0; // 角度
        this.alpha = alpha; // 透明度（0.0から1.0まで）
        this.isInteractive = isInteractive; // マウス操作を受け付けるかどうか
        this.matched = false; // ブロックがマッチしたかどうか
        this.anchorPoint.set(0.5, 0.5); // ブロックの中心を原点とする
        // add a physic body
        this.body = new Body(this);
        this.body.gravityScale = 0;


        // if (typeof settings.shape !== "undefined") {
        //     // this.body.addShape(settings.shape);
        //     this.body.addShape(new Rect(0, 0, this.width, this.height));
        // }

        this.body.addShape(new Rect(0, 0, this.width, this.height));
        if (this.isInteractive) {

            this.body.addShape(new Rect(x, y, this.width, this.height));

            this.body.setStatic();

            // status flags
            this.selected = false;
            this.hover = false;

            // enable physic and input event for this renderable
            this.isKinematic = false;

            // to memorize where we grab the sprite
            // this.grabOffset = new  Vector2d(0,0);

            // half transparent when not selected
            this.setOpacity(0.1);

            this.onActivateEvent();
            // this.onActivateEvent = this.onActivateEvent.bind(this);
        }
    }

    draw(renderer) {

        renderer.save(); // 現在の描画状態を保存

        renderer.setColor(this.color);
        renderer.setGlobalAlpha(this.alpha); // 透明度を設定
        if (this.shape === "square") {
            renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        } else if (this.shape === "triangle") {
            // ブロックの中心を原点として回転
            renderer.translate(this.pos.x + this.width / 2, this.pos.y + this.height / 2);
            renderer.rotate(this.rotation * Math.PI / 180);
            renderer.translate(-this.width / 2, -this.height / 2);

            // 直角二等辺三角形を描画
            let path = new Polygon(0, 0, [
                {x: 0, y: 0},
                {x: this.width, y: this.height},
                {x: this.width, y: 0}
            ]);
            renderer.fill(path);
        }

        renderer.restore(); // 描画状態を復元
    }

    onActivateEvent() {
        //register on mouse/touch event
        // console.log("イベント登録しました。");
        input.registerPointerEvent("pointerdown", this, this.onSelect.bind(this));
        input.registerPointerEvent("pointerup", this, this.onRelease.bind(this));
        input.registerPointerEvent("pointercancel", this, this.onRelease.bind(this));
        input.registerPointerEvent("pointermove", this, this.pointerMove.bind(this));
        input.registerPointerEvent("wheel", this, this.onScroll.bind(this));
    }


    /**
     * pointermove function
     */
    pointerMove(event) {
        // console.log("選択："+this.selected);
        if (this.selected) {
            // follow the pointer
            // this.pos.set(event.gameX, event.gameY, this.pos.z);
            // this.pos.sub(this.grabOffset);
            this.isDirty = true;
            // don't propagate the event furthermore
            return false;
        }
    }

    /**
     * pointermove function
     */
    onScroll(event) {
        // console.log("回転角度：{this.rotation}");
        // if (this.selected) {
        // default anchor point for renderable is 0.5, 0.5
        // this.rotate(event.deltaY);

        // 90度ずつ回転させる
        this.rotation = (this.rotation + 90) % 360;

        // SE再生
        audio.play("rotation");
        // by default body rotate around the body center
        // this.body.rotate(event.deltaY);
        // this.rotation += event.deltaY;
        // renderer.rotate(this.rotation * Math.PI / 180);
        // console.log("回転角度：" + this.rotation);
        this.isDirty = true;

        // don't propagate the event furthermore
        return false;
        // }
    }

    // mouse down function
    onSelect(event) {
        if (this.selected === false) {
            // manually calculate the relative coordinates for the body shapes
            // since only the bounding box is used by the input event manager
            var x = event.gameX - this.getBounds().x + this.body.getBounds().x;
            var y = event.gameY - this.getBounds().y + this.body.getBounds().y;

            // the pointer event system will use the object bounding rect, check then with with all defined shapes
            if (this.body.contains(x, y)) {
                this.selected = true;
            }
            if (this.selected) {
                // 掴んだオブジェクトをカーソルの中心に移動させる。
                // this.event.pos.set(this.pos.gameX, this.pos.gameY, this.pos.z);


                // this.grabOffset.set(event.gameX, event.gameY);
                // this.grabOffset.sub(this.pos);
                // this.setOpacity(1.0);
            }
            this.isDirty = true;
        }
        // don't propagate the event furthermore if selected
        return !this.selected;
    }

    // mouse up function
    onRelease(/*event*/) {
        this.selected = false;
        // this.setOpacity(0.5);
        this.isDirty = true;
        // don't propagate the event furthermore
        return false;
    }

    update(dt) {
        let isKeyPressed = input.isKeyPressed('rotation');
        if (isKeyPressed) {
            // 90度ずつ回転させる
            this.rotation = (this.rotation + 90) % 360;
        }

    }

}
