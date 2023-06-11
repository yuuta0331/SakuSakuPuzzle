// a melonJS data manifest
// note : this is note a webpack manifest
const DataManifest = [

    /* BGM */
    { name: "title",  type: "audio", src: "./data/bgm/" },
    { name: "gamemain",  type: "audio", src: "./data/bgm/" },
    { name: "result",  type: "audio", src: "./data/bgm/" },
    { name: "end",  type: "audio", src: "./data/bgm/" },

    /* SE */
    { name: "cursor_move",  type: "audio", src: "./data/sfx/" },
    { name: "enter",  type: "audio", src: "./data/sfx/" },

    /* Bitmap Text */
    {
        name: "PressStart2P",
        type: "image",
        src:  "./data/fnt/PressStart2P.png"
    },
    {
        name: "PressStart2P",
        type: "binary",
        src: "./data/fnt/PressStart2P.fnt"
    },
    {
        name: "title_background",
        type: "image",
        src: "./data/img/title_background.png"
    },
    {
        name: "gamemain_background",
        type: "image",
        src: "./data/img/game_main_background.png"
    },
    {
        name: "timer_background",
        type: "image",
        src: "./data/img/Timer.png"
    },
    {
        name: "cursor",
        type: "image",
        src: "./data/img/cursor.png"
    },
    // Font Face
    {
        name: "funwari-round",
        type: "image",
        src: "./data/fnt/funwariround.png"
    },
    {
        name: "funwari-round",
        type: "binary",
        src: "./data/fnt/funwariround.fnt"
    },
    {
        name: "funwari-round_brown",
        type: "image",
        src: "./data/fnt/funwariround-brown.png"
    },
    {
        name: "funwari-round_brown",
        type: "binary",
        src: "./data/fnt/funwariround-brown.fnt"
    },
    {
        name: "funwari-round_white",
        type: "image",
        src: "./data/fnt/funwariround-white.png"
    },
    {
        name: "funwari-round_white",
        type: "binary",
        src: "./data/fnt/funwariround-white.fnt"
    },

        // texturePacker
        { name: "texture",         type: "json",   src: "./data/img/texture.json" },
        { name: "texture",         type: "image",  src: "./data/img/texture.png" }
];

export default DataManifest;
