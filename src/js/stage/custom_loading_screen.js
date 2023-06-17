//import { game } from "../index.js";
import {game, event, Stage, ColorLayer, Text, Renderable, loader, Sprite} from "melonjs";
//import logo_url from "../../favicon/logo.png";


// a basic progress bar object
class ProgressBar extends Renderable {
    /**
     * @ignore
     */
    constructor(x, y, w, h) {
        super(x, y, w, h);

        this.barHeight = h;
        this.anchorPoint.set(0, 0);

        event.on(event.LOADER_PROGRESS, this.onProgressUpdate, this);
        event.on(event.VIEWPORT_ONRESIZE, this.resize, this);

        this.anchorPoint.set(0, 0);

        // store current progress
        this.progress = 0;
    }

    /**
     * make sure the screen is refreshed every frame
     * @ignore
     */
    onProgressUpdate(progress) {
        this.progress = ~~(progress * this.width);
        this.isDirty = true;
    }

    /**
     * draw function
     * @ignore
     */
    draw(renderer, viewport) {
        // draw the progress bar
        renderer.setColor("black");
        renderer.fillRect(this.pos.x, viewport.centerY, renderer.getWidth(), this.barHeight / 2);

        renderer.setColor("#55aa00");
        renderer.fillRect(this.pos.x, viewport.centerY, this.progress, this.barHeight / 2);
    }

    /**
     * Called by engine before deleting the object
     * @ignore
     */
    onDestroyEvent() {
        // cancel the callback
        event.off(event.LOADER_PROGRESS, this.onProgressUpdate);
        event.off(event.VIEWPORT_ONRESIZE, this.resize);
    }

}

/**
 * a default loading screen
 * @ignore
 */
class CustomLoadingScreen extends Stage {
    /**
     * call when the loader is resetted
     * @ignore
     */
    onResetEvent() {
        const barHeight = 8;

        //this.backgroundImg = loader.getImage("title_background");

        // const backgroundImage = new Sprite(0, 0, {
        //     image: loader.getImage('logo'),
        // });
        // backgroundImage.scale(game.viewport.width / backgroundImage.width, game.viewport.height / backgroundImage.height);
        // game.world.addChild(backgroundImage, 0);

        game.world.addChild(new ColorLayer('background', '#F8E860'));
        // loader.load({ name: "funwari-round", type: "image", src: "./data/fnt/funwariround-brown.png" });
        // loader.load({ name: "funwari-round", type: "binary", src: "./data/fnt/funwariround-brown.fnt" });
        //
        // game.world.addChild(new BitmapText(game.viewport.width / 2, game.viewport.height / 2 - game.viewport.height / 4 - 100, {
        //     font: "funwari-round",
        //     size: 3.2,
        //     textBaseline: "middle",
        //     textAlign: "center",
        //     fillStyle: "white",
        //     text: "さくさくパズル",
        //     lineWidth: 1.
        // }));

        game.world.addChild(new Text(game.viewport.width / 2, game.viewport.height / 2 - 200, {
            font: "funwari_round",
            size: 200,
            fillStyle: "#FFFFFF",
            strokeStyle: "#000000",
            text: "Loading...",
            textAlign: "center",
            textBaseline: "top"
        }));

        // set a background color
        // game.world.backgroundColor.parseCSS("#202020");

        // progress bar
        // game.world.addChild(new ProgressBar(
        //     0,
        //     renderer.getHeight() / 2,
        //     renderer.getWidth(),
        //     barHeight
        // ), 1);


        // load the melonJS logo
        // loader.load({name: "logo.png", type: "image", src: logo_url}, () => {
        //     // melonJS logo
        //     game.world.addChild(new Sprite(
        //         renderer.getWidth() / 2,
        //         renderer.getHeight() / 2, {
        //             image : "logo",
        //             framewidth : 256,
        //             frameheight : 256
        //         }), 2
        //     );
        // });
    }

    /**
     * Called by engine before deleting the object
     * @ignore
     */
    onDestroyEvent() {
        // cancel the callback
        // loader.unload({name: "melonjs_logo", type:"image"});
    }
}

export default CustomLoadingScreen;
