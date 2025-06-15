import Snake from './Snake.js';
import Food from './Food.js';

/**
 * @typedef {Object} Position
 * @property {number} x - Horizontal grid coordinate
 * @property {number} y - Vertical grid coordinate
 */

/**
 * Core game logic for Snake.
 * Manages game state, rules, snake and food interactions, and scoring.
 */
export default class Game {
    /**
     * Direction vectors for movement: LEFT, UP, RIGHT, DOWN.
     * @type {Position[]}
     */
    static DIRECTIONS = [
        { x: -1, y: 0 }, // LEFT
        { x: 0, y: -1 }, // UP
        { x: 1, y: 0 },  // RIGHT
        { x: 0, y: 1 },  // DOWN
    ];

    /**
     * Convert relative action to an absolute direction index
     *
     * @param {number} current - Current direction index (0-3)
     * @param {number} action - Action command (0 = left, 1 = forward, 2 = right)
     * @returns {number} New direction index
     */
    static computeNewDirection(current, action) {
        const len = Game.DIRECTIONS.length;
        return ((current + action - 1) % len + len) % len;
    }

    /**
     * Calculates the relative action based on current direction and input direction.
     * 
     * @param {number} currentDir - Current direction index (0-3)
     * @param {number} inputDir - Input direction index (0-3)
     * @returns {number|null} Relative action:
     * 0 = Left, 1 = Forward, 2 = Right, 1 = Invalid action default to Forward
     */
    static getRelativeAction(currentDir, inputDir) {
        const len = Game.DIRECTIONS.length;
        const diff = (inputDir - currentDir + len) % len;
        if (diff === 1) return 2;      // Right
        else if (diff === len - 1) return 0;// Left
        else return 1;  // Forward or invalid action defaults to Forward
    }

    /**
     * Creates a new game environment.
     *
     * @param {number} width - Width of the board (columns)
     * @param {number} height - Height of the board (rows)
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.reset();
    }

    /**
     * Resets the game to a new state.
     *
     * @returns {boolean[]} Initial state representation
     */
    reset() {
        const direction = Math.floor(Math.random() * Game.DIRECTIONS.length);
        this.snake = new Snake(this.width, this.height, direction);
        this.food = new Food(this.width, this.height, this.snake.getSegments());

        this.frame = 0;
        this.score = 0;
        this.done = false;

        return this.getState();
    }

    /**
     * Advances the game state by one step.
     *
     * @param {number} action - Action command (0, 1, or 2)
     * @returns {{nextState: boolean[], reward: number, done: boolean}}
     */
    step(action) {
        if (this.done) {
            return {
                nextState: this.getState(),
                reward: 0,
                done: true
            };
        }

        // Get snake head information before moving
        const prevHead = this.snake.getHead();

        // Update snake direction according to "action"
        this.snake.direction = Game.computeNewDirection(this.snake.direction, action);
        const direction = Game.DIRECTIONS[this.snake.direction];

        // Snake moves
        const ate = this.snake.move(direction, this.food.getPosition());
        if (ate) {
            this.score++;
            this.food = new Food(this.width, this.height, this.snake.getSegments());
        }

        // Get snake head information after moving
        const currHead = this.snake.getHead();

        // Increase the time calculator
        this.frame++;

        const timeout = this.frame > 100 * this.snake.getSegments().length;
        const collision = this._isCollision();
        if (timeout || collision) this.done = true;

        // Get reward after applying action
        const reward = this._getReward({
            prevHead,
            currHead,
            ate,
            collision,
            timeout
        });

        return {
            nextState: this.getState(),
            reward,
            done: this.done
        }
    }

    /**
     * Returns the full 11-dimensional state used by the RL agent.
     *
     * @returns {boolean[]} State features: [4x direction, 4x food, 3x danger]
     */
    getState() {
        return [
            ...this._getDirectionState(),
            ...this._getFoodRelativeDirection(),
            ...this._getSurroundingDanger()
        ];
    }

    /**
     * Returns the current direction state of the snake.
     * @description [LEFT, UP, RIGHT, DOWN]
     * 
     * @returns {boolean[]} Direction state of the snake.
     * @private
     */
    _getDirectionState() {
        return [
            this.snake.direction === 0,
            this.snake.direction === 1,
            this.snake.direction === 2,
            this.snake.direction === 3
        ];
    }

    /**
     * Computes food's direction relative to the snake's head.
     * @description [Left, Forward, Right, Backward]
     *
     * @returns {boolean[]} Relative direction of the food.
     * @private
     */
    _getFoodRelativeDirection() {
        const relativeDirection = Array(4).fill(false);
        const head = this.snake.getHead();
        const deltaX = this.food.getPosition().x - head.x;
        const deltaY = this.food.getPosition().y - head.y;

        let [left, forward] = [0, 0];
        if (this.snake.direction === 0)
            [left, forward] = [-deltaY, -deltaX];
        else if (this.snake.direction === 1)
            [left, forward] = [deltaX, -deltaY];
        else if (this.snake.direction === 2)
            [left, forward] = [deltaY, deltaX];
        else if (this.snake.direction === 3)
            [left, forward] = [-deltaX, deltaY];

        relativeDirection[0] = left < 0;
        relativeDirection[1] = forward > 0;
        relativeDirection[2] = left > 0;
        relativeDirection[3] = forward < 0;

        return relativeDirection;
    }

    /**
     * Checks if the next cells are dangerous.
     * @description [Left, Forward, Right]
     * 
     * @returns {boolean[]} Danger state of the surrounding cells.
     * @private
     */
    _getSurroundingDanger() {
        return [0, 1, 2].map((action) => {
            const nextDir = Game.computeNewDirection(this.snake.direction, action);
            const direction = Game.DIRECTIONS[nextDir];
            const { x, y } = this.snake.getHead();
            const nextHead = { x: x + direction.x, y: y + direction.y };
            return this._isCollision({ nextHead });
        })
    }

    /**
     * Calculates the reward based on the current action result.
     *
     * @param {object} options - Step outcome details.
     * @param {Position} options.prevHead - Head position before move.
     * @param {Position} options.currHead - Head position after move.
     * @param {boolean} options.ate - Whether the snake ate the food.
     * @param {boolean} options.collision - Whether a collision occurred.
     * @param {boolean} options.timeout - Whether the snake timed out.
     *
     * @returns {number} Reward signal
     * @private
     */
    _getReward({ prevHead, currHead, ate, collision, timeout }) {
        // Time expired
        if (timeout) return -10;

        // Collide with wall or body
        if (collision) return -10;

        // Ate food
        if (ate) return 10;

        const prevDist = Math.abs(this.food.getPosition().x - prevHead.x) +
            Math.abs(this.food.getPosition().y - prevHead.y);
        const currDist = Math.abs(this.food.getPosition().x - currHead.x) +
            Math.abs(this.food.getPosition().y - currHead.y);
        const distReward = 1 * (prevDist - currDist);
        const idlePenalty = -1;

        return distReward + idlePenalty;
    }

    /**
     * Checks if a collision would occur at a given position.
     *
     * @param {object} [options={}] - Additional options.
     * @param {Position} [options.nextHead=null] - Next head position to test
     *
     * @returns {boolean} Whether a collision would occur
     * @private
     */
    _isCollision({ nextHead = null } = {}) {
        const head = nextHead ?? this.snake.getHead();
        const { x, y } = head;

        const hitWall = x < 0 || x >= this.width || y < 0 || y >= this.height;
        const hitSelf = this.snake.getSegments().slice(1).some((part) => part.x === x && part.y === y);

        return hitWall || hitSelf;
    }

    /**
     * Returns whether the game is currently over.
     * @returns {boolean}
     */
    isDone() {
        return this.done;
    }

    /**
     * Returns the current game score (number of food eaten).
     * @returns {number}
     */
    getScore() {
        return this.score;
    }

    /**
     * Returns the number of frames elapsed since game start.
     * @returns {number}
     */
    getElapsedTime() {
        return this.frame;
    }

    /**
     * Returns the current direction of the snake.
     * 
     * @returns {number} Current direction of the snake (0-3)
     */
    getDirection() {
        return this.snake.direction;
    }
}
