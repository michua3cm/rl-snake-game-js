import InputPanel from './InputPanel.js';
import initTrainingControl from './ControlPanel.js';
import initManual from '../GameManual.js';
import initAI from '../GameAI.js';

export default function init() {
    const config = {
        width: 40,
        height: 20,
        cellSize: 20
    };
    let currentGame = null;
    let isAI_Mode = false;

    new InputPanel({
        ...config,
        onSizeChange: changeSize
    });

    function changeSize(type, value) {
        if (type === 'width') config.width = value;
        else if (type === 'height') config.height = value;
        else if (type === 'cellSize') config.cellSize = value;

        recreateGame(isAI_Mode);
    }

    function recreateGame(isAI) {
        isAI_Mode = isAI;
        currentGame?.destroy?.();
        currentGame = isAI ? initAI(config) : initManual(config);
    }

    const ui = initTrainingControl(recreateGame);

    // Bind signal listeners
    ui.onStart(() => currentGame?.start?.());
    ui.onPause(() => currentGame?.pause?.());
    ui.onResume(() => currentGame?.resume?.()); // optional if you separate resume from pause
    ui.onStop(() => currentGame?.stop?.());
}
