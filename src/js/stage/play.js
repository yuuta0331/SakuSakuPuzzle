import { Stage, audio, game, ColorLayer, ImageLayer, BitmapText, Sprite, loader, Rect, Renderable, plugins, device } from 'melonjs';
import Cursor from '../entities/cursor.js';
import VirtualJoypad from '../entities/controls.js';
import Block from '../renderables/block.js';
import BlockGrid from '../renderables/block_grid.js';

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

class TransparentBlock extends Block {
    draw(renderer) {
        renderer.globalAlpha = 0.5;
        super.draw(renderer);
        renderer.globalAlpha = 1.0;
    }
}

class BlockPiece extends Block {
    constructor(x, y, width, height, color, shape, split) {
        super(x, y, width / split, height / split, color, shape);
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
            font: "funwari-round_white",
            size: 2.0,
            textBaseline: "middle",
            textAlign: "center",
            text: "Hello World !"
        }));

        audio.stopTrack();
        audio.playTrack("gamemain");

        // ブロックを生成
        // let blockGrid = new BlockGrid(0, 0, 50, 16, 16);
        // blockGrid.generateBlocks(4, ["red", "blue", "green", "yellow"], ["square", "triangle"]);
        // game.world.addChild(blockGrid);


        // お手本となるブロックを描画
        let sampleGrid = new BlockGrid(500, 800, 90, 4, 4);
        sampleGrid.generateBlocks(4, ["red", "blue", "green", "yellow"], ["square", "triangle"]);
        game.world.addChild(sampleGrid);

        let centerGrid = new BlockGrid(game.viewport.width / 2　, game.viewport.height / 2 , 90, 4, 4);
        centerGrid.generateBlocks(4, ["red", "blue", "green", "yellow"], ["square", "triangle"], TransparentBlock);
        game.world.addChild(centerGrid);

        // カーソルを描画
        this.cursor = new Cursor(game.viewport.width / 2, game.viewport.height / 2);
        game.world.addChild(this.cursor);

        // display if debugPanel is enabled or on mobile
        // モバイルデバイスでのみ疑似コントローラーを表示
        // ※一部タブレットでは表示されない。
        if (device.isMobile) {
            if (typeof this.virtualJoypad === "undefined") {
                this.virtualJoypad = new VirtualJoypad();
            }
            game.world.addChild(this.virtualJoypad);
        }
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
