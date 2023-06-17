import {game, Renderable, BitmapText} from "melonjs";
import g_game from "../../game";

// テキストのスタイルを設定する定数
const TEXT_STYLE = {
    font: "bold 24px Arial",
    textAlign: "center",
    textBaseline: "middle",
    color: "white"
};

export default class CircularProgressBar extends Renderable {
    constructor(x, y, radius, lineWidth) {
        super(x, y, 2 * radius, 2 * radius);
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.lineWidth = lineWidth || 100;
        this.progress = 0;

        // ビットマップテキストの作成
        this.bitmapText = new BitmapText(0, 0, {
            font: "funwari-round_brown",
            size: 1.0,
            textBaseline: "middle",
            textAlign: "center",
            fillStyle: "white",
            text: "",
            lineWidth: 1.
        });
        game.world.addChild(this.bitmapText);
    }

    update(dt) {
        this.progress = g_game.data.elapsedTime / g_game.data.timeLimit;
        return true;
    }

    draw(renderer) {
        renderer.setColor("red");
        renderer.setLineWidth(1000);

        const endAngle = -Math.PI / 2 + 2 * Math.PI * this.progress;

        // 円弧のパスを作成
        // 3時からスタートして時計回りに進む
        // renderer.strokeArc(this.width / 2 + 270, this.height / 2 + 660, this.radius, 0, Math.PI * 2 * this.progress, false);

        // 12時からスタートして時計回りに進む
        renderer.strokeArc(this.width / 2 + 270, this.height / 2 + 660, this.radius, -Math.PI / 2, Math.PI * 2 * this.progress - Math.PI / 2, false);

        // 円弧の内側を塗りつぶす
        renderer.fillArc(this.width / 2 + 270, this.height / 2 + 660, this.radius, -Math.PI / 2, 2 * Math.PI * this.progress - Math.PI / 2, false);


        // 残り時間を描画
        const remainingTime = g_game.data.timeLimit - g_game.data.elapsedTime;
        //const text = `${remainingTime.toFixed(1.0)}s`; // 残り時間を秒単位で表示する
        const text = `${remainingTime.toFixed(0)}s`; // 残り時間を整数の秒単位で表示する

        // ビットマップテキストを更新して円の中心に描画
        this.bitmapText.setText(text);
        this.bitmapText.pos.set(this.width / 2 + 180, this.height / 2 + 540);
    }
}
