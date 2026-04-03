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
        const occupied = new Set(snake.map(p => `${p.x},${p.y}`));
        const empty = [];
        for (let y = 0; y < this.height; y++)
            for (let x = 0; x < this.width; x++)
                if (!occupied.has(`${x},${y}`)) empty.push({ x, y });

        if (empty.length === 0) return null; // board is completely full
        return empty[Math.floor(Math.random() * empty.length)];
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

