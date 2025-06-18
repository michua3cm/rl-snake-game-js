export default function init(onModeChange, onStartGame) {
    const toggle = document.getElementById('mode-toggle');
    const startButton = document.getElementById('start-training');
    const stopButton = document.getElementById('stop-training');
    const hint = document.getElementById('start-hint');
    const startIcon = startButton.querySelector('.material-icons');

    let isRunning = false;

    const buttons = [startButton, stopButton];
    const controlledElements = [startButton, stopButton, hint];

    function toggleVisibility(elements, show) {
        for (const element of elements)
            element.classList.toggle('hidden', !show);
    }

    function updateStartButton(button, running, icon) {
        button.classList.toggle('start', !running);
        button.classList.toggle('pause', running);
        icon.textContent = running ? 'pause' : 'play_arrow';
    }

    function updateStopButton(button, running) {
        button.disabled = !running;
        button.classList.toggle('enabled', running);
        button.classList.toggle('disabled', !running);
    }

    toggleVisibility(controlledElements, toggle.checked);
    onModeChange(toggle.checked);

    toggle.addEventListener('change', () => {
        isRunning = false;
        updateStartButton(startButton, isRunning, startIcon);
        updateStopButton(stopButton, isRunning);
        toggleVisibility(controlledElements, toggle.checked);
        onModeChange(toggle.checked);
    });

    startButton.addEventListener('click', () => {
        isRunning = !isRunning;
        if (isRunning) {
            updateStartButton(startButton, isRunning, startIcon);
            updateStopButton(stopButton, isRunning);
        } else {
            updateStartButton(startButton, isRunning, startIcon);
        }

        if (toggle.checked && onStartGame?.()) {
            onStartGame();
            startButton.blur();
        }
    });

    stopButton.addEventListener('click', () => {
        isRunning = false;
        updateStartButton(startButton, isRunning, startIcon);
        updateStopButton(stopButton, isRunning);
    });

    for (const button of buttons) {
        button.addEventListener('keydown', (event) => {
            if ([' ', 'Enter'].includes(event.key))
                event.stopPropagation();
        });
    }

    window.addEventListener('keydown', (event) => {
        const tag = document.activeElement.tagName.toLowerCase();
        const isInteractive = ['input', 'textarea', 'button'].includes(tag);

        if (([' ', 'Enter'].includes(event.key) && !isInteractive))
            event.preventDefault();
    });
}
