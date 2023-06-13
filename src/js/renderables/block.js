import {Polygon, Renderable} from 'melonjs';

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
    constructor(x, y, width, height, color, shape, alpha = 1.0) {
        super(x, y, width, height);
        this.color = color;
        this.shape = shape; // "square" or "triangle"
        this.rotation = 0; // 角度
        this.alpha = alpha; // 透明度（0.0から1.0まで）
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



}
