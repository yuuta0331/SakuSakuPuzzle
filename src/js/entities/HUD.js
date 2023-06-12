import {
    game,
    audio,
    device,
    event,
    BitmapText,
    GUI_Object,
    Container,
    Vector2d
} from "melonjs";
import g_game from './../../game.js';

/**
 * a basic control to toggle fullscreen on/off
 */
class FSControl extends GUI_Object {
    /**
     * constructor
     */
    constructor(x, y) {
        super(x, y, {
            image: g_game.texture,
            region : "shadedDark30.png"
        });
        this.setOpacity(0.5);
    }

    /**
     * function called when the pointer is over the object
     */
    onOver(/* event */) {
        this.setOpacity(1.0);
    }

    /**
     * function called when the pointer is leaving the object area
     */
    onOut(/* event */) {
        this.setOpacity(0.5);
    }

    /**
     * function called when the object is clicked on
     */
    onClick(/* event */) {
        if (!device.isFullscreen()) {
            device.requestFullscreen();
        } else {
            device.exitFullscreen();
        }
        return false;
    }
};

/**
 * a basic control to toggle fullscreen on/off
 */
class AudioControl extends GUI_Object {
    /**
     * constructor
     */
    constructor(x, y) {
        super(x, y, {
            image: g_game.texture,
            region : "shadedDark13.png" // ON by default
        });
        this.setOpacity(0.5);
        this.isMute = false;
    }

    /**
     * function called when the pointer is over the object
     */
    onOver(/* event */) {
        this.setOpacity(1.0);
    }

    /**
     * function called when the pointer is leaving the object area
     */
    onOut(/* event */) {
        this.setOpacity(0.5);
    }

    /**
     * function called when the object is clicked on
     */
    onClick(/* event */) {
        if (this.isMute) {
            audio.unmuteAll();
            this.setRegion(g_game.texture.getRegion("shadedDark13.png"));
            this.isMute = false;
        } else {
            audio.muteAll();
            this.setRegion(g_game.texture.getRegion("shadedDark15.png"));
            this.isMute = true;
        }
        return false;
    }
};

/**
 * a basic HUD item to display score
 */
class ScoreItem extends BitmapText {
    /**
     * constructor
     */
    constructor(x, y) {
        // call the super constructor
        super(
            game.viewport.width  + x,
            game.viewport.height + y,
            {
                font : "PressStart2P",
                textAlign : "right",
                textBaseline : "bottom",
                text : "0"
            }
        );

        this.relative = new Vector2d(x, y);

        // local copy of the global score
        this.score = -1;

        // recalculate the object position if the canvas is resize
        event.on(event.CANVAS_ONRESIZE, (function(w, h){
            this.pos.set(w, h, 0).add(this.relative);
        }).bind(this));
    }

    /**
     * update function
     */
    update( dt ) {
        if (this.score !== g_game.data.score) {
            this.score = g_game.data.score;
            this.setText(this.score);
            this.isDirty = true;
        }
        return super.update(dt);
    }
};

/**
 * a HUD container and child items
 */
class UIContainer extends Container {

    constructor() {
        // call the constructor
        super();

        // persistent across level change
        this.isPersistent = true;

        // Use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at position
        this.addChild(new ScoreItem(-10, -10));

        // add our audio control object
        this.addChild(new AudioControl(36, 56));

        if (!device.isMobile) {
            // add our fullscreen control object
            this.addChild(new FSControl(36 + 10 + 48, 56));
        }
    }
};

export default UIContainer;
