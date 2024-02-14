import {Renderable} from 'melonjs';
import Block from "./block.js";
import g_game from "../../game";

export class BlockPart extends Block {
    constructor(x, y, width, height, color, shape, alpha, partIndex, totalParts) {
        super(x, y, width, height, color, shape, alpha);
        this.partIndex = partIndex;
        this.totalParts = totalParts;
        console.log("BlockPart");
    }


    // constructor(block, partIndex) {
    //     // let partWidth = block.width / totalParts;
    //     let partWidth = block.width;
    //
    //     let x = block.pos.x + partIndex * partWidth;
    //     super(x, block.pos.y, partWidth, block.height, block.color, block.shape);
    //     this.block = block;
    //     this.partIndex = partIndex;
    //     this.rotation = block.rotation; // ブロックの角度を引き継ぐ
    // }

    // ブロック部分を操作するためのメソッドをここに追加
}


export default class BlockGrid extends Renderable {
    constructor(x, y, blockSize, gridWidth, gridHeight, isInteractive = false) {
        super(x, y, blockSize * gridWidth, blockSize * gridHeight);
        this.x_position = x;
        this.y_position = y;
        this.blockSize = blockSize;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.blocks = [];
        this.isInteractive = isInteractive; // マウス操作を受け付けるかどうか
    }

    generateBlocks(blockCount, colors, shapes) {
        let positions = [];
        for (let i = 0; i < this.gridWidth; i++) {
            for (let j = 0; j < this.gridHeight; j++) {
                positions.push({x: i * this.blockSize, y: j * this.blockSize});
            }
        }

        // ランダムに位置を選び、その位置からブロックを削除する
        for (let i = 0; i < blockCount; i++) {
            let color = colors[Math.floor(Math.random() * colors.length)];
            let shape = shapes[Math.floor(Math.random() * shapes.length)];
            let posIndex = Math.floor(Math.random() * positions.length);
            let pos = positions[posIndex];
            positions.splice(posIndex, 1); // 選択した位置を削除
            // ブロックの生成
            let block = new Block(pos.x + this.x_position, pos.y + this.y_position, this.blockSize, this.blockSize, color, shape, 1.0, this.isInteractive);
            block.rotation = Math.floor(Math.random() * 4) * 90; // ランダムに0, 90, 180, 270などの角度を設定
            this.blocks.push(block);
        }
        return this.blocks;
    }

    /**
     * グリッドを含めたブロックの集合体を追加する
     * @param {*} blocks 追加するブロック配列
     * @param {*} alpha 透明度
     * @param {*} originalGridX グリッドのX座標
     * @param {*} originalGridY グリッドのY座標
     */
    addBlocks(blocks, alpha, originalGridX, originalGridY) {
        this.blocks = blocks.map(block => {
            // 新しい Block インスタンスを作成し、座標を更新する
            let newBlock = new Block(block.pos.x - originalGridX + this.x_position, block.pos.y - originalGridY + this.y_position, block.width, block.height, block.color, block.shape, alpha);
            newBlock.rotation = block.rotation;
            return newBlock;
        });
    }

    /**
     * 1つだけブロックを追加する
     * ブロックが当てはまらなく、戻す必要がある場合に使用する
     * @param {*} newBlock 新しく追加するブロック
     */
    addBlock(newBlock) {
        this.blocks.push(newBlock);
    }

    /**
     * ブロックを分割する
     * @param {*} minParts 最小パーツ数
     * @param {*} maxParts 最大パーツ数
     * @param {*} targetGrid 対象のグリッド
     */
    splitBlocks(minParts, maxParts, targetGrid) {
        let parts = Math.floor(Math.random() * (maxParts - minParts + 1)) + minParts; // ブロックの分割数をランダムに選択
        let blockSize = Math.ceil(this.blocks.length / parts); // ブロックの配列を分割するサイズを計算
        let gap = 100; // ブロック間の間隔
        let totalIndex = 0; // 全ブロックを通したインデックス
        let currentPartIndex = 0; // 現在のパーツのインデックス

        for (let i = 0; i < parts; i++) {
            let blocksPart = this.blocks.slice(i * blockSize, (i + 1) * blockSize); // ブロックの配列を分割
            blocksPart.forEach((block, index) => {
                // ブロックの間に間隔を設ける
                let x = targetGrid.x_position + totalIndex * this.blockSize + currentPartIndex * gap;
                let y = targetGrid.y_position;
                let part = new BlockPart(x, y, block.width, block.height, block.color, block.shape, block.alpha, index, blocksPart.length);
                part.rotation = block.rotation;
                // ステージレベルが2レベル以上かつ形が四角以外の場合は、90度回転角度をランダムにする。
                if (g_game.data.stageInfo.level >= 2 && part.shape !== "square") {
                    // part.rotation = (block.rotation + 90) % 360;
                    let rotations = [90, 180, 270, 360];
                    part.rotation = rotations[Math.floor(Math.random() * rotations.length)];
                }

                // ステージレベルが2レベル以上かつ形が四角以外の場合は、元の角度と異なるランダムな角度にする
                // if (g_game.data.stageInfo.level >= 2 && part.shape !== "square") {
                //     let newRotation;
                //     do {
                //         newRotation = Math.floor(Math.random() * 360);
                //     } while (newRotation === block.rotation);
                //
                //     part.rotation = newRotation;
                // }

                // ステージレベルが3レベル以上かつ形が四角以外の場合は、元の角度と異なる90度回転の角度にする
                if (g_game.data.stageInfo.level >= 3 && part.shape !== "square") {
                    let possibleRotations = [90, 180, 270, 360];

                    // 元の角度を可能な回転リストから除外
                    possibleRotations = possibleRotations.filter(rotation => rotation !== block.rotation);

                    // リストからランダムに選択
                    part.rotation = possibleRotations[Math.floor(Math.random() * possibleRotations.length)];
                }


                targetGrid.blocks.push(part);
                totalIndex++; // 全体のインデックスを増やす
            });
            currentPartIndex++; // 新しいパーツへ移行
        }
    }

    /**
     * BlockGrid内の全てのブロックが一致したかチェック
     * @returns boolean 一致すればtrue、そうでなければfalse
     */
    allBlocksMatched() {
        return this.blocks.every(block => block.matched);
    }


    /**
     * BlockGrid内のブロックのいずれかが指定されたブロックと色、形、角度が一致するかどうかを判断します。
     * 一致するブロックが見つかった場合、そのブロックの位置に合わせます。
     * @param block 比較するBlockオブジェクト
     * @param tolerance 許容される距離の範囲
     * @return boolean 色、形、角度が一致すればtrue、そうでなければfalse
     */
    isBlockMatchAndAlign(block, tolerance) {
        console.log("比較します" + this.blocks);
        const matchedBlock = this.blocks.find(blockInGrid =>
            blockInGrid && // nullでないブロックのみを対象にする
            this.isCloseTo(blockInGrid, block, tolerance) &&
            blockInGrid.color === block.color &&
            blockInGrid.shape === block.shape &&
            blockInGrid.rotation === block.rotation
        );

        if (matchedBlock) {
            // 一致したブロックの位置に合わせる
            console.log("一致しました。ブロックを合わせます");
            block.pos.x = matchedBlock.pos.x;
            block.pos.y = matchedBlock.pos.y;
            return true;
        }

        return false;
    }

    /**
     * BlockGrid内のブロックのいずれかが指定されたブロックに近いかどうかを判断します。
     * @param block 比較するBlockオブジェクト
     * @param tolerance 許容される距離の範囲
     * @return boolean 許容範囲内であればtrue、そうでなければfalse
     */
    isBlockCloseToAny(block, tolerance) {
        return this.blocks.some(blockInGrid => this.isCloseTo(blockInGrid, block, tolerance));
    }

    /**
     * 2つのブロックが指定された許容範囲内にあるかどうかを判断します。
     * @param blockA 比較する最初のブロック
     * @param blockB 比較する2番目のブロック
     * @param tolerance 許容される距離の範囲
     * @return boolean 許容範囲内であればtrue、そうでなければfalse
     */
    isCloseTo(blockA, blockB, tolerance) {

        if (!blockA || !blockB) {
            return false;
        }

        const dx = Math.abs(blockA.pos.x - blockB.pos.x);
        const dy = Math.abs(blockA.pos.y - blockB.pos.y);
        return dx <= tolerance && dy <= tolerance;
    }


    draw(renderer) {
        this.blocks.forEach(block => block.draw(renderer));
    }
}
