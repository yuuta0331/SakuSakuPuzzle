import {
    game,
    audio,
    input,
    Stage,
    ColorLayer,
    BitmapText,
    state,
    Container,
    Renderable, Text
} from "melonjs";

class DebugRect extends Renderable {
    constructor(x, y, w, h) {
        super(x, y, w, h);

        this.fillColor = "rgba(255, 0, 0, 0.5)";  // 赤色で半透明の背景
        this.strokeColor = "blue";  // 枠線の色は青
        this.lineWidth = 2;  // 枠線の太さは2
    }

    draw(renderer) {
        renderer.setColor(this.fillColor);
        renderer.fillRect(this.pos.x, this.pos.y, this.width, this.height);

        renderer.setColor(this.strokeColor);
        renderer.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
    }
}


class RankingScreen extends Stage {

    onResetEvent() {

        this.ranking = [];


        // add a gray background to the default Stage
        game.world.addChild(new ColorLayer("background", "#F8E860"), 1);

        // add a font text display object
        // game.world.addChild(new BitmapText(game.viewport.width / 2, game.viewport.height / 2, {
        //     font: "PressStart2P",
        //     size: 4.0,
        //     textBaseline: "middle",
        //     textAlign: "center",
        //     text: "Ranking"
        // }));

        let guidText = new Text(100, game.viewport.height * 0.8, {
            font: "funwari_round",
            size: 60,
            text: "B でタイトル",
            fillStyle: '#FF1508'
        });
        game.world.addChild(guidText, 2);

        // キーボードのイベントをアクションとしてバインド
        input.bindKey(input.KEY.ENTER, "enter");
        input.bindKey(input.KEY.BACKSPACE, "back");

        // ゲームパッドのボタンをキーボードのキーにマッピング
        input.bindGamepad(0, {type: "buttons", code: input.GAMEPAD.BUTTONS.FACE_1}, input.KEY.ENTER);
        input.bindGamepad(0, {type: "buttons", code: input.GAMEPAD.BUTTONS.FACE_2}, input.KEY.BACKSPACE);

        audio.stopTrack();
        audio.playTrack("result");
        // this.submitScore("test", 100);
        this.displayRanking();
    }

    onDestroyEvent() {

        audio.stopTrack();

        // キーボードとゲームパッドのイベントの解除
        input.unbindKey(input.KEY.ENTER);
        input.unbindKey(input.KEY.BACKSPACE);
        input.unbindGamepad(0, input.GAMEPAD.BUTTONS.FACE_1);
        input.unbindGamepad(0, input.GAMEPAD.BUTTONS.FACE_2);
    }

    update(dt) {
        if (input.isKeyPressed("back")) {
            state.change(state.MENU);
        }
        // else if (input.isKeyPressed("enter")) {
        //     state.change(state.PLAY);
        // }
        return super.update(dt);
    }

    submitScore(name, score) {
        var scoresRef = firebase.database().ref('scores');
        var newScoreRef = scoresRef.push();
        newScoreRef.set({
            name: name,
            score: score
        });
    }

    displayRanking() {
        var scoresRef = firebase.database().ref('scores');
        scoresRef.orderByChild('score').limitToLast(10).on('value', snapshot => {
            this.ranking = [];
            snapshot.forEach(childSnapshot => {
                this.ranking.unshift({
                    name: childSnapshot.val().name,
                    score: childSnapshot.val().score
                });
            });
            // 取得したランキングをデバック出力
            //console.log("ranking: ", this.ranking);  // Log the retrieved ranking
            this.drawRanking();
        });
    }

    drawRanking() {

        const rankingStyles = [
            {crown: 'gold-crown.png', color: '#FFCC33'},
            {crown: 'silver-crown.png', color: '#BEBEC0'},
            {crown: 'bronze-crown.png', color: '#AF7E77'},
        ];

        // 既存のrankingContainerを削除
        if (this.rankingContainer) {
            this.rankingContainer.children.forEach(child => {
                this.rankingContainer.removeChildNow(child);
            });

            game.world.removeChildNow(this.rankingContainer);
        }

        // ランキング用のコンテナを作成
        this.rankingContainer = new Container(game.viewport.width / 3, 0, game.viewport.width, game.viewport.height);
        game.world.addChild(this.rankingContainer, 5);

        // ランキングタイトルを描画
        // const rankingTitle = new BitmapText(200, 20, {font: "funwari-round_white", text: "Ranking"});
        // this.rankingContainer.addChild(rankingTitle);

        const rankingNum = this.ranking.length;
        //const rankingNum = 4;

        // 枠線や背景色を持つShapeを作成
        var debugShape = new DebugRect(game.viewport.width / 3, 0, this.rankingContainer.width, this.rankingContainer.height);

        // debugShapeをrankingContainerに追加
        //this.rankingContainer.addChild(debugShape, 1);


        for (let i = 0; i < rankingNum; i++) {
            let y = 50 + i * 100;
            let entry = this.ranking[i];

            // ランキングエントリーをデバック出力
            //console.log("Drawing ranking entry: ", entry);

            // Draw the player's rank

            let rankText;
            let nameText;
            let scoreText;

            if (i < rankingStyles.length) {
                rankText = new Text(20, y, {
                    font: "funwari_round",
                    size: 48,
                    text: (i + 1).toString(),
                    fillStyle: rankingStyles[i].color
                });
                nameText = new Text(200, y, {
                    font: "funwari_round",
                    size: 48,
                    text: entry.name,
                    fillStyle: rankingStyles[i].color
                });
                scoreText = new Text(600, y, {
                    font: "funwari_round",
                    size: 48,
                    text: entry.score.toString(),
                    fillStyle: rankingStyles[i].color
                });
            } else {
                rankText = new BitmapText(20, y, {font: "funwari-round", size: 0.5, text: (i + 1).toString()});
                nameText = new BitmapText(200, y, {font: "funwari-round", size: 0.5, text: entry.name});
                scoreText = new BitmapText(600, y, {font: "funwari-round", size: 0.5, text: entry.score.toString()});
            }

            this.rankingContainer.addChild(rankText, 2);

            // Draw the player's name

            this.rankingContainer.addChild(nameText, 2);

            // Draw the player's score

            this.rankingContainer.addChild(scoreText, 2);
        }
    }


};

export default RankingScreen;
