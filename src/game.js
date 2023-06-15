/**
 * hold all game specific data
 */
var g_game = {

    /**
     * object where to store game global scole
     */
    data : {
        // score
        score: 0,
        // 経過時間
        elapsedTime: 0,
        // 制限時間
        timeLimit: 30,
        timeUp: false,
    },

    // a reference to the texture atlas
    texture : null,
};

export default g_game;
