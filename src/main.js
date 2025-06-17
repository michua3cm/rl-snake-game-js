// import './styles/main.css';
// import initManual from './components/GameManual.js';
// import initAI from './components/GameAI.js';

// // initManual();
// initAI();

import './styles/main.css';
import initManual from './components/GameManual.js';
import initAI from './components/GameAI.js';

let currentGame = null;

function destroyCurrentGame() {
    if (currentGame?.destroy)
        currentGame.destroy();

    currentGame = null;
}

function startGame(isAI) {
    destroyCurrentGame();

    currentGame = isAI ? initAI() : initManual();
}

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('mode-toggle');
    const startButton = document.getElementById('start-training');
    const hint = document.getElementById('start-hint');

    if (toggle.checked) {
        startButton.classList.remove('hidden');
        hint.classList.remove('hidden');
    } else {
        startButton.classList.add('hidden');
        hint.classList.add('hidden');
    }

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            startButton.classList.remove('hidden');
            hint.classList.remove('hidden');
        } else {
            startButton.classList.add('hidden');
            hint.classList.add('hidden');
        }
        startGame(toggle.checked);
    });

    startButton.addEventListener('click', () => {
        if (toggle.checked && currentGame?.start) {
            currentGame.start();
            startButton.blur();
        }
    });

    startButton.addEventListener('keydown', (event) => {
        if ([' ', 'Enter'].includes(event.key))
            event.stopPropagation();
    });

    startGame(toggle.checked); // Start based on initial toggle state
});

window.addEventListener('keydown', (event) => {
    const tag = document.activeElement.tagName;
    const isInteractiveElement =
        tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON';

    if (([' ', 'Enter'].includes(event.key)) && !isInteractiveElement)
        event.preventDefault();
});