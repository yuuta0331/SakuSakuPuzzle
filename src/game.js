/**
 * hold all game specific data
 */
var g_game = {

    /**
     * object where to store game global scole
     */
    data : {
        // ステージ
        stageInfo: {
            level: 1,
            blockCount: 4, // ブロックの数
            minParts: 2, // パーツの最小数
            maxParts: 2, // パーツの最大数
        },

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
