export default function init(onModeChange) {
    const toggle = document.getElementById('mode-toggle');
    const startButton = document.getElementById('start-training');
    const stopButton = document.getElementById('stop-training');
    const speedButton = document.getElementById('speed');
    const hint = document.getElementById('start-hint');
    const startIcon = startButton.querySelector('.material-icons');
    const speedIcon = speedButton.querySelector('.material-icons');

    let isRunning = false;
    let isFast = false;
    let hasStarted = false;

    const buttons = [startButton, stopButton, speedButton];
    const controlledElements = [...buttons, hint];

    // Signal listeners
    const startListeners = [];
    const pauseListeners = [];
    const resumeListeners = [];
    const stopListeners = [];
    const speedUpListeners = [];
    const slowDownListeners = [];

    function emit(listeners) {
        for (const fn of listeners) fn();
    }

    function toggleVisibility(elements, show) {
        for (const element of elements)
            element.classList.toggle('hidden', !show);
    }

    function updateStartButton(running) {
        startButton.classList.toggle('start', !running);
        startButton.classList.toggle('pause', running);
        startIcon.textContent = running ? 'pause' : 'play_arrow';
    }

    function updateStopButton(running) {
        stopButton.disabled = !running;
        stopButton.classList.toggle('enabled', running);
        stopButton.classList.toggle('disabled', !running);
    }

    function updateSpeedButton(running, isFast) {
        speedButton.disabled = !running;
        speedButton.classList.toggle('enabled', running);
        speedButton.classList.toggle('disabled', !running);

        speedButton.classList.toggle('fast', isFast);
        speedButton.classList.toggle('slow', !isFast);
        speedIcon.textContent = isFast ? 'keyboard_arrow_right' : 'keyboard_double_arrow_right';
    }

    toggleVisibility(controlledElements, toggle.checked);
    onModeChange(toggle.checked);

    toggle.addEventListener('change', () => {
        isRunning = false;
        hasStarted = false;
        isFast = false;
        updateStartButton(isRunning);
        updateStopButton(isRunning);
        updateSpeedButton(isRunning, isFast);
        toggleVisibility(controlledElements, toggle.checked);
        onModeChange(toggle.checked);
    });

    startButton.addEventListener('click', () => {
        isRunning = !isRunning;
        updateStartButton(isRunning);
        updateStopButton(true);
        updateSpeedButton(true, false);

        if (toggle.checked) {
            if (!hasStarted) {  // stopButton.classList.contains('enabled')
                hasStarted = true;
                emit(startListeners);
            } else if (isRunning) emit(resumeListeners);
            else emit(pauseListeners);
        }
        startButton.blur();
    });

    stopButton.addEventListener('click', () => {
        isRunning = false;
        hasStarted = false;
        isFast = false;
        updateStartButton(isRunning);
        updateStopButton(isRunning);
        updateSpeedButton(isRunning, isFast);
        emit(stopListeners);
        stopButton.blur();
    });

    speedButton.addEventListener('click', () => {
        isFast = !isFast;
        updateSpeedButton(isRunning, isFast);
        if (isFast) emit(speedUpListeners);
        else emit(slowDownListeners);
        speedButton.blur();
    });

    for (const button of buttons) {
        button.addEventListener('keydown', (event) => {
            if ([' ', 'Enter'].includes(event.key)) {
                event.stopPropagation();
                button.blur();
            }
        });
    }

    window.addEventListener('keydown', (event) => {
        const tag = document.activeElement.tagName.toLowerCase();
        const isInteractive = ['input', 'textarea', 'button'].includes(tag);

        if (([' ', 'Enter'].includes(event.key) && !isInteractive))
            event.preventDefault();
    });

    // Return registration API
    return {
        onStart: fn => startListeners.push(fn),
        onPause: fn => pauseListeners.push(fn),
        onResume: fn => resumeListeners.push(fn),
        onStop: fn => stopListeners.push(fn),
        onSpeedUp: fn => speedUpListeners.push(fn),
        onSlowDown: fn => slowDownListeners.push(fn)
    };
}
