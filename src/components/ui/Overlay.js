/**
 * UI overlay manager that handles start and game-over screens.
 */
export default class Overlay {
    /**
     * @param {Function} onStartCallback - Function to call when the user presses any key to start the game.
     */
    constructor(onSartCallback) {
        this.overlay = document.getElementById('overlay');
        this.overlayTitle = document.getElementById('overlay-title');
        this.overlayScore = document.getElementById('overlay-score');
        this.overlayInstruction = document.getElementById('overlay-instruction');

        this._onStart = onSartCallback;
        document.addEventListener('keydown', this._keydownControl);
    }

    /**
     * Handles keydown events to start the game when the overlay is visible.
     * 
     * @param {KeyboardEvent} event - The keydown event triggered by the user. 
     */
    _keydownControl = (event) => {
        const ignoreKeys = ['Tab', 'Escape', 'Alt', 'Control', 'Shift', 'Meta'];

        // Avoid triggering if the user is typing in an input field
        const isTyping = document.activeElement.tagName === 'INPUT';

        if (this.overlay.style.display !== 'none' &&
            this.overlayScore.style.display === 'none' &&
            !isTyping && !ignoreKeys.includes(event.key))
            this._onStart();
    }

    /**
     * Shows the overlay element.
     */
    show() {
        this.overlay.style.display = 'flex';
    }

    /**
     * Hides the overlay element.
     */
    hide() {
        this.overlay.style.display = 'none';
    }

    /**
     * Displays the start screen with initial instructions.
     */
    showStart() {
        this.overlayScore.style.display = 'none';
        this.overlayInstruction.style.display = 'none';
        this._setText('Press any key to start');
        this.overlayTitle.style.fontSize = '2.5rem';
        this.show();
    }

    /**
     * Displays the game over screen with the final score.
     * 
     * @param {number} score - The player's final score.
     */
    showGameOver(score) {
        this._setText('Game Over');
        this.overlayTitle.style.fontSize = '3rem';
        this.overlayScore.textContent = `Score: ${score}`;
        this.overlayInstruction.textContent = 'Press any key to reset';

        this.overlayScore.style.display = 'block';
        this.overlayInstruction.style.display = 'block';
        this.show();
    }

    /**
     * Sets the main overlay title text.
     * 
     * @param {string} text - Text to display in the title.
     * @private
     */
    _setText(text) {
        this.overlayTitle.textContent = text;
    }

    /**
     * Removes the event listener and hides the overlay.
     */
    removeEvent() {
        document.removeEventListener('keydown', this._keydownControl);
        this.overlay.style.display = 'none';
        this._onStart = null;
    }
}