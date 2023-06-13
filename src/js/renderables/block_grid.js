import { Renderable } from 'melonjs';
import Block from "./block.js";

export default class BlockGrid extends Renderable {
    constructor(x, y, blockSize, gridWidth, gridHeight) {
        super(x, y, blockSize * gridWidth, blockSize * gridHeight);
        this.x_position = x;
        this.y_position = y;
        this.blockSize = blockSize;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.blocks = [];
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
            let block = new Block(pos.x + this.x_position, pos.y + this.y_position, this.blockSize, this.blockSize, color, shape);
            block.rotation = Math.floor(Math.random() * 4) * 90; // ランダムに0, 90, 180, 270などの角度を設定
            this.blocks.push(block);
        }
        return this.blocks;
    }


    addBlocks(blocks, alpha, originalGridX, originalGridY) {
        this.blocks = blocks.map(block => {
            // 新しい Block インスタンスを作成し、座標を更新する
            let newBlock = new Block(block.pos.x - originalGridX + this.x_position, block.pos.y - originalGridY + this.y_position, block.width, block.height, block.color, block.shape, alpha);
            newBlock.rotation = block.rotation;
            return newBlock;
        });
    }





    draw(renderer) {
        this.blocks.forEach(block => block.draw(renderer));
    }
}
