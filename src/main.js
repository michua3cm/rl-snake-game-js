import './styles/main.css';
import initManual from './components/GameManual.js';
import initAI from './components/GameAI.js';
import initTrainingControl from './components/ui/GameControlPanel.js';

let currentGame = null;

function switchGameMode(isAI) {
    currentGame?.destroy?.();
    currentGame = isAI ? initAI() : initManual();
}

initTrainingControl(switchGameMode, () => currentGame?.start?.());
