import Game from '../snake_env/Game.js';
import Board from './Board.js';
import HUD from './HUD.js';
import Overlay from './Overlay.js';
import InputPanel from './InputPanel.js';

/**
 * Manages the overall game flow, UI rendering, and user/agent interaction.
 */
export default class GameManager {
    // ========== Constructor & Initialization ========== //
    /**
     * Creates an instance of GameManager.
     * 
     * @param {object} options - Game configuration options.
     * @param {number} [options.width=40] - Board width in cells.
     * @param {number} [options.height=20] - Board height in cells.
     * @param {number} [options.cellSize=20] - Size of each cell in pixels.
     * @param {boolean} [options.manual=false] - Whether the game is controlled manually.
     */
    constructor({ width = 40, height = 20, cellSize = 20, manual = false } = {}) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.manual = manual;
        this.highestScore = 0;

        this.board = new Board(this.width, this.height, this.cellSize);
        this.game = new Game(this.width, this.height);

        this.hud = new HUD();
        this.overlay = this.manual ? new Overlay(this.start.bind(this)) : null;
        this.inputPanel = new InputPanel({
            width: this.width,
            height: this.height,
            cellSize: this.cellSize,
            onSizeChange: this._handleSizeChange.bind(this)
        });

        this.intervalId = null;
        this.action = 1; // Default action is to move forward

        this._handleKeydown = this._handleKeydown.bind(this);
        this.setControlMode(this.manual);
    }

    /**
     * Sets up initial UI state and renders the board.
     * Called during start/reset.
     * @private
     */
    _init() {
        this.overlay?.showStart();
        this.render();
    }

    /**
     * Sets the control mode for the game.
     * 
     * @param {boolean} isManual - Whether the game is controlled manually.
     */
    setControlMode(isManual) {
        this.manual = isManual;
        this.manual ? this.hud.hideEpisode() : this.hud.showEpisode();
        this._init();
    }

    // ========== Game Start & Loop ========== //
    /**
     * Starts the game loop.
     */
    start() {
        if (this.intervalId) clearInterval(this.intervalId);

        this.overlay?.hide();

        this.intervalId = setInterval(() => {
            this.game.step(this.action);

            if (this.game.isDone()) {
                clearInterval(this.intervalId);
                this.intervalId = null;
                this._handleGameOver();
                return;
            }

            this.render();
            this.action = 1; // Reset action to forward after each step
        }, 100);
    }

    /**
     * Executes one step for agent-controlled play.
     * 
     * @param {number} action - Direction: 0 (Left), 1 (Forward), 2 (Right)
     * @returns {Object} step result, including `done` flag
     */
    step(action) {
        const result = this.game.step(action);
        this.render();
        return result;
    }

    // ========== Rendering & Game State ========== //
    /**
     * Renders the current game state and updates the score.
     */
    render() {
        const snake = this.game.snake;
        const food = this.game.food;
        this.board.render(snake.getSegments(), food.getPosition());
        this.hud.updateScore(this.game.getScore());
    }

    /**
     * Returns current state for AI agent.
     * 
     * @returns {any} Game state representation.
     */
    getState() {
        return this.game.getState();
    }

    /**
     * Updates the episode number in the HUD.
     * 
     * @param {number} episode - Current episode number.
     */
    updateEpisode(episode) {
        this.hud.updateEpisode(episode);
    }

    // ========== Game Reset & Config ========== //
    /**
     * Restarts the current round, preserving the highest score.
     */
    restartRound() {
        this.highestScore = Math.max(this.highestScore, this.game.getScore());
        this.hud.updateHighestScore(this.highestScore);
        this.game.reset();    // keep existing game object
        this._init();
    }

    /**
     * Rebuilds the game with new dimensions or cell size.
     */
    _rebuildGame() {
        this.board = new Board(this.width, this.height, this.cellSize);
        this.game = new Game(this.width, this.height);
        this._init();
    }

    /**
     * Handles change of game dimensions or cell size.
     * 
     * @param {'width'|'height'|'cellSize'} type 
     * @param {number} value 
     * @private
     */
    _handleSizeChange(type, value) {
        if (type === 'width') this.width = value;
        else if (type === 'height') this.height = value;
        else if (type === 'cellSize') this.cellSize = value;

        this._rebuildGame();
    }

    // ========== Input Handling ========== //
    /**
     * Attaches the keydown listener for manual play.
     */
    attachKeydownListener() {
        document.addEventListener('keydown', this._handleKeydown);
    }

    /**
     * Handles user key presses for direction or game control.
     * 
     * @param {KeyboardEvent} event 
     * @private
     */
    _handleKeydown(event) {
        function isBlockedKey(key) {
            const blockedKeys = ['Tab', 'Alt', 'Meta', 'Control', 'Shift'];
            return blockedKeys.includes(key) || key.startsWith('Arrow');
        }

        // Prevent browser default behavior
        if (this.intervalId && isBlockedKey(event.key))
            event.preventDefault();

        const directionMap = {
            'ArrowLeft': 0,
            'ArrowUp': 1,
            'ArrowRight': 2,
            'ArrowDown': 3
        };

        if (event.key in directionMap) {
            const currDir = this.game.getDirection();
            this.action = Game.getRelativeAction(currDir, directionMap[event.key]);
        }
    }

    // ========== Game Over Logic ========== //
    /**
     * Handles game over state and sets up restart listener.
     * @private
     */
    _handleGameOver() {
        this.overlay?.showGameOver(this.game.getScore());

        const resetHandler = (e) => {
            const blockedKeys = ['Tab', 'Alt', 'Meta', 'Control', 'Shift'];
            if (blockedKeys.includes(e.key)) return;

            e.stopPropagation();
            e.preventDefault();

            document.removeEventListener('keydown', resetHandler);
            this.restartRound();
        };

        // Add temporary key listener to restart game
        document.addEventListener('keydown', resetHandler);
    }

    /**
     * Removes all event listeners and stops the game loop.
     */
    removeEvent() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        // Remove event listeners from components
        this.overlay?.removeEvent();
        this.inputPanel?.removeEvent();
    }
}
