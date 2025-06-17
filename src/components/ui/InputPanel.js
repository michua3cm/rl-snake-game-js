/**
 * Callback function for size changes.
 *
 * @callback SizeChangeCallback
 * @param {'width' | 'height' | 'cellSize'} type - Which input changed.
 * @param {number} value - New value of the input.
 */

/**
 * UI handler for game configuration inputs (width, height, cell size).
 */
export default class InputPanel {
    /**
     * Creates an InputPanel instance to manage user input for game size configuration.
     * 
     * @param {Object} config
     * @param {number} config.width - Initial game board width.
     * @param {number} config.height - Initial game board height.
     * @param {number} config.cellSize - Initial size of each cell.
     * @param {SizeChangeCallback} config.onSizeChange - Called when a size input changes.
     * @param {number} [config.minValue=5] - Minimum value allowed for inputs.
     * @param {number} [config.maxValue=100] - Maximum value allowed for inputs.
     */
    constructor({ width, height, cellSize, onSizeChange, minValue = 5, maxValue = 100 }) {
        this.onSizeChange = onSizeChange;

        this.minValue = minValue;
        this.maxValue = maxValue;

        this.inputs = {
            width: document.getElementById('input-width'),
            height: document.getElementById('input-height'),
            cellSize: document.getElementById('input-cell')
        };

        this.inputs.width.value = width;
        this.inputs.height.value = height;
        this.inputs.cellSize.value = cellSize;

        this._initListeners();
    }

    /**
     * Attaches event listeners to handle user input.
     * @private
     */
    _initListeners() {
        for (const [type, input] of Object.entries(this.inputs)) {
            input.addEventListener('input', (e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value >= this.minValue && value <= this.maxValue)
                    this.onSizeChange(type, value);
            });

            // Prevent global key handling when user finishes or cancels input:
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                    e.stopPropagation();
                    input.blur();
                }
            });
        }
    }

    /**
     * Removes all event listeners and resets the input fields.
     */
    removeEvent() {
        for (const input of Object.values(this.inputs))
            input.replaceWith(input.cloneNode(true));

        this.inputs = null;
        this.onSizeChange = null;
    }
}