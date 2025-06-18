import './styles/main.css';
import initManual from './components/GameManual.js';
import initAI from './components/GameAI.js';

let currentGame = null;
let isRunning = false;

function destroyCurrentGame() {
    currentGame?.destroy?.();
    currentGame = null;
}

function switchGameMode(isAI) {
    destroyCurrentGame();
    currentGame = isAI ? initAI() : initManual();
}

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('mode-toggle');
    const startButton = document.getElementById('start-training');
    const stopButton = document.getElementById('stop-training');
    const hint = document.getElementById('start-hint');
    const startIcon = startButton.querySelector('.material-icons');

    if (toggle.checked) {
        startButton.classList.remove('hidden');
        stopButton.classList.remove('hidden');
        hint.classList.remove('hidden');
    } else {
        startButton.classList.add('hidden');
        stopButton.classList.add('hidden');
        hint.classList.add('hidden');
    }

    toggle.addEventListener('change', () => {
        if (toggle.checked) {
            startButton.classList.remove('hidden');
            stopButton.classList.remove('hidden');
            hint.classList.remove('hidden');
        } else {
            startButton.classList.add('hidden');
            stopButton.classList.add('hidden');
            hint.classList.add('hidden');
        }
        switchGameMode(toggle.checked);
    });

    startButton.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            startButton.classList.remove('start');
            startButton.classList.add('pause');
            startIcon.textContent = 'pause';

            stopButton.disabled = false;
            stopButton.classList.remove('disabled');
            stopButton.classList.add('enabled');
        } else {
            isRunning = false;
            startButton.classList.remove('pause');
            startButton.classList.add('start');
            startIcon.textContent = 'play_arrow';
        }

        if (toggle.checked && currentGame?.start) {
            currentGame.start();
            startButton.blur();
        }
    });

    stopButton.addEventListener('click', () => {
        isRunning = false;
        startButton.classList.remove('pause');
        startButton.classList.add('start');
        startIcon.textContent = 'play_arrow';

        stopButton.disabled = true;
        stopButton.classList.remove('enabled');
        stopButton.classList.add('disabled');
    });

    for (const button of [startButton, stopButton]) {
        button.addEventListener('keydown', (event) => {
            if ([' ', 'Enter'].includes(event.key))
                event.stopPropagation();
        });
    }

    switchGameMode(toggle.checked); // Start based on initial toggle state
});

window.addEventListener('keydown', (event) => {
    const tag = document.activeElement.tagName;
    const isInteractive = ['INPUT', 'TEXTAREA', 'BUTTON'].includes(tag);

    if (([' ', 'Enter'].includes(event.key)) && !isInteractive)
        event.preventDefault();
});