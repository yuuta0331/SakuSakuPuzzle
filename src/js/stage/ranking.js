import {game, audio, input, Stage, ColorLayer, BitmapText, Sprite, loader, state, Container} from "melonjs";

class RankingScreen extends Stage {

    onResetEvent() {

        this.ranking = [];

        // add a gray background to the default Stage
        game.world.addChild(new ColorLayer("background", "#202020"));

        // add a font text display object
        game.world.addChild(new BitmapText(game.viewport.width / 2, game.viewport.height / 2, {
            font: "PressStart2P",
            size: 4.0,
            textBaseline: "middle",
            textAlign: "center",
            text: "Ranking"
        }));

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
        } else if (input.isKeyPressed("enter")) {
            state.change(state.PLAY);
        }
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
            this.drawRanking();
        });
    }

    drawRanking() {
        // Clear the existing ranking
        // Check if rankingContainer exists and destroy it
        if (this.rankingContainer) {
            game.world.removeChildNow(this.rankingContainer);
            this.rankingContainer.destroy();
        }

        // Create a new container for the ranking
        this.rankingContainer = new Container(game.viewport.width / 3, 0, game.viewport.width, game.viewport.height);
        game.world.addChild(this.rankingContainer, 1);

        // Draw each ranking entry
        // const rankingTitle = new BitmapText(200, 20, {font: "funwari-round_white", text: "Ranking"});
        // this.rankingContainer.addChild(rankingTitle);

        //const rankingNum = this.ranking.length;
        const rankingNum = 4;

        for (let i = 0; i < rankingNum; i++) {
            let y = 50 + i * 100;
            let entry = this.ranking[i];

            // Draw the player's rank
            let rankText = new BitmapText(20, y, {font: "funwari-round_white", text: (i + 1).toString()});
            this.rankingContainer.addChild(rankText);

            // Draw the player's name
            let nameText = new BitmapText(200, y, {font: "funwari-round_white", text: entry.name});
            this.rankingContainer.addChild(nameText);

            // Draw the player's score
            let scoreText = new BitmapText(600, y, {font: "funwari-round_white", text: entry.score.toString()});
            this.rankingContainer.addChild(scoreText);
        }
    }


};

export default RankingScreen;
