/**
 * @typedef {Object} Position
 * @property {number} x - Horizontal grid coordinate
 * @property {number} y - Vertical grid coordinate
 */

/**
 * Represents the snake entity in the game.
 */
export default class Snake {
    /**
     * Initializes a new Snake instance.
     *
     * @param {number} width - Board width (in cells).
     * @param {number} height - Board height (in cells).
     * @param {number} initialDirection - Initial orientation of the snake head
     */
    constructor(width, height, initialDirection) {
        this.width = width;
        this.height = height;
        this.direction = initialDirection;

        this.snake = [];

        this._init();
    }

    /**
     * Places the initial head of the snake at the center of the board.
     * @private
     */
    _init() {
        const x = Math.floor(this.width / 2);
        const y = Math.floor(this.height / 2);
        this.snake.push({ x, y });
    }

    /**
     * Moves the snake forward one step in its current direction.
     * Grows if food is eaten, otherwise trims the tail.
     *
     * @param {Position} dir - Direction to move.
     * @param {Position} food - Current food position.
     * @returns {boolean} Whether the snake has eaten the food.
     */
    move(dir, food) {
        const head = this.snake[0];
        const newHead = {
            x: head.x + dir.x,
            y: head.y + dir.y
        }

        this.snake.unshift(newHead);

        const ate = newHead.x === food.x && newHead.y === food.y;
        if (!ate) this.snake.pop();

        return ate;
    }

    /**
     * Returns the full snake body from head to tail.
     *
     * @returns {Position[]}
     */
    getSegments() {
        return this.snake;
    }

    /**
     * Returns the current position of the snake's head.
     *
     * @returns {Position}
     */
    getHead() {
        return this.snake[0];
    }
}

