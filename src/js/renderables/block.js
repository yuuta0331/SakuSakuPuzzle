import { Renderable } from 'melonjs';

export default class Block extends Renderable {
    constructor(x, y, width, height, color, shape) {
        super(x, y, width, height);
        this.color = color;
        this.shape = shape; // "square" or "triangle"
    }

    draw(renderer) {
        renderer.setColor(this.color);
        if (this.shape === "square") {
            renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        } else if (this.shape === "triangle") {
            // TODO 三角を描画する
            //renderer.fillTriangle(this.pos.x, this.pos.y, this.pos.x + this.width, this.pos.y, this.pos.x + this.width / 2, this.pos.y + this.height);
            renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        }
    }
}
