/**
 * Handles rendering of the game grid, including the snake and food.
 */
export default class Board {
    /**
     * Builds and manages the Snake game board.
     *
     * @param {number} width - Number of cells horizontally.
     * @param {number} height - Number of cells vertically.
     * @param {number} cellSize - Pixel size of each cell.
     * @param {object} [options={}] - Additional configuration options.
     * @param {string} [options.containerId='board'] - ID of the board's container element in the DOM.
     * @param {number} [options.gap=1] - Gap (in pixels) between cells.
     */
    constructor(width, height, cellSize, { containerId = 'board', gap = 0 } = {}) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.container = document.getElementById(containerId);
        this.gap = gap;

        this.cells = [];    // flat array: index = x + y * width

        this._init();
    }

    /**
     * Initializes the visual layout of the game board.
     * @private
     */
    _init() {
        this.container.innerHTML = '';
        this.container.style.display = 'grid';
        this.container.style.gridTemplateColumns = `repeat(${this.width}, ${this.cellSize}px)`;
        this.container.style.gridTemplateRows = `repeat(${this.height}, ${this.cellSize}px)`;
        this.container.style.gap = `${this.gap}px`;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.style.width = `${this.cellSize}px`;
                cell.style.height = `${this.cellSize}px`;
                this.container.appendChild(cell);
                this.cells.push(cell);
            }
        }
    }

    /**
     * Returns the cell at the specified (x, y) coordinates.
     *
     * @param {number} x - X coordinate (column).
     * @param {number} y - Y coordinate (row).
     * @returns {HTMLDivElement | null} The DOM element of the cell, or null if out of bounds.
     */
    getCell(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
        return this.cells[x + y * this.width];
    }

    /**
     * Clears all content on the game board, resetting all cells to default state.
     */
    clear() {
        for (const cell of this.cells)
            cell.className = 'cell';
    }

    /**
     * @typedef {Object} Position
     * @property {number} x - Horizontal grid coordinate
     * @property {number} y - Vertical grid coordinate
     */

    /**
     * Renders the snake and food onto the board.
     *
     * @param {Position[]} snake - Array of snake segments from head to tail.
     * @param {Position} food - Coordinates of the food item.
     */
    render(snake, food) {
        this.clear();

        for (let i = 0; i < snake.length; i++) {
            const { x, y } = snake[i];
            const cell = this.getCell(x, y);
            if (cell) {
                if (i === 0) cell.classList.add('head');
                else cell.classList.add('snake');
            }
        }

        const foodCell = this.getCell(food.x, food.y);
        if (foodCell) foodCell.classList.add('food');
    }
}



