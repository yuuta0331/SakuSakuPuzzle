import { Stage, audio, game, ColorLayer, ImageLayer, BitmapText, Sprite, loader, Rect, Renderable, plugins, device } from 'melonjs';
import Cursor from '../entities/cursor.js';

class MyRectangle extends Renderable {
    constructor(x, y, width, height, color) {
        super(x, y, width, height);
        this.color = color;
        this.floating = true; // ビューポートに対する相対座標を使用
    }

    draw(renderer) {
        renderer.setColor(this.color);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    }
}

class PlayScreen extends Stage {
    /**
     *  action to perform on state change
     */
    onResetEvent() {

        // add a gray background to the default Stage
        game.world.addChild(new ColorLayer("background", "#202020"));

        let backgroundImage = loader.getImage('gamemain_background');
        let backgroundLayer = new ImageLayer(0, 0, {
            image: backgroundImage,
            width: game.viewport.width,
            height: game.viewport.height,
            repeat: "no-repeat",
            z: 1 // The z-index. Adjust as needed.
        });
        game.world.addChild(backgroundLayer);

        // let rect1 = new Rect(0,0,game.viewport.width, game.viewport.height);
        // game.world.addChild(rect1);
        let myRect = new MyRectangle(0, 0, 1050, 2000, '#00FFFF');
        let myRect2 = new MyRectangle(0, 1000, 4000, 400, '#00FFFF');
        game.world.addChild(myRect);
        game.world.addChild(myRect2);

        game.world.addChild(new BitmapText(260, 80, {
            font: "funwari-round",
            size: 2.0,
            textBaseline: "middle",
            textAlign: "center",
            text: "おだい"
        }));

        const timerImage = new Sprite(265, 655, {
            image: loader.getImage('timer_background'),
        });
        game.world.addChild(timerImage);


        // add a font text display object
        game.world.addChild(new BitmapText(game.viewport.width / 2, game.viewport.height / 2, {
            font: "funwari-round",
            size: 2.0,
            textBaseline: "middle",
            textAlign: "center",
            text: "Hello World !"
        }));

        this.cursor = new Cursor(game.viewport.width / 2, game.viewport.height / 2);
        game.world.addChild(this.cursor);

        audio.playTrack("gamemain");
    }

    onDestroyEvent() {
        game.world.removeChild(this.cursor);
        this.cursor = null;
        audio.stopTrack();
    }

    // update(dt) {
    //     if (this.cursor) {
    //         this.cursor.update(dt);
    //     }
    //     return super.update(dt);
    // }
};

export default PlayScreen;
