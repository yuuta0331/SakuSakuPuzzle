import { Renderable } from 'melonjs';
import Block from "./block.js";

export default class BlockGrid extends Renderable {
    constructor(x, y, blockSize, gridWidth, gridHeight) {
        super(x, y, blockSize * gridWidth, blockSize * gridHeight);
        this.blockSize = blockSize;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.blocks = [];
    }

    generateBlocks(blockCount, colors, shapes) {
        for (let i = 0; i < blockCount; i++) {
            let color = colors[Math.floor(Math.random() * colors.length)];
            let shape = shapes[Math.floor(Math.random() * shapes.length)];
            let x = Math.floor(Math.random() * this.gridWidth) * this.blockSize;
            let y = Math.floor(Math.random() * this.gridHeight) * this.blockSize;
            this.blocks.push(new Block(x, y, this.blockSize, this.blockSize, color, shape));
        }
    }

    draw(renderer) {
        this.blocks.forEach(block => block.draw(renderer));
    }
}
