import {game, Renderable} from "melonjs";
import g_game from "../../game";

export default class CircularProgressBar extends Renderable {
    constructor(x, y, radius, lineWidth) {
        super(x, y, 2 * radius, 2 * radius);
        this.radius = radius;
        this.lineWidth = lineWidth || 10;
        this.progress = 0;
    }

    update(dt) {
        this.progress = g_game.data.elapsedTime / g_game.data.timeLimit;
        return true;
    }


    draw(renderer) {
        renderer.setColor("red");

        // 円弧のパスを作成
        renderer.strokeArc(this.width / 2, this.height / 2, this.radius, 0, Math.PI * 2 * this.progress, false);
    }

}
