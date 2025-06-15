/**
 * @typedef {Object} Position
 * @property {number} x - Horizontal grid coordinate
 * @property {number} y - Vertical grid coordinate
 */

/**
 * Represents the food item on the game board.
 */
export default class Food {
    /**
     * Creates a single piece of food at a valid position.
     *
     * @param {number} width - Width of the game board.
     * @param {number} height - Height of the game board.
     * @param {Position[]} snake - Snake body positions to avoid.
     */
    constructor(width, height, snake) {
        this.width = width;
        this.height = height;
        this.position = this._generatePosition(snake);
    }

    /**
     * Generates a valid position that does not overlap the snake.
     *
     * @param {Position[]} snake - Snake body positions to avoid.
     * @returns {Position} Valid food position
     */
    _generatePosition(snake) {
        while (true) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            if (!snake.some(part => part.x === x && part.y === y)) {
                return { x, y };
            }
        }
    }

    /**
     * Get the current position of the food.
     * 
     * @returns {Position} The current position of the food.
     */
    getPosition() {
        return this.position;
    }
}

