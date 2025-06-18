import './styles/main.css';
import initManual from './components/GameManual.js';
import initAI from './components/GameAI.js';
import initTrainingControl from './components/ui/GameControlPanel.js';

document.body.style.visibility = 'hidden';
window.addEventListener('load', () => {
    document.body.style.visibility = 'visible';
});

let currentGame = initManual();

function switchGameMode(isAI) {
    currentGame?.destroy?.();
    currentGame = isAI ? initAI() : initManual();
}

const ui = initTrainingControl(switchGameMode);

// Bind signal listeners
ui.onStart(() => currentGame?.start?.());
ui.onPause(() => currentGame?.pause?.());
ui.onResume(() => currentGame?.resume?.()); // optional if you separate resume from pause
ui.onStop(() => currentGame?.stop?.());
