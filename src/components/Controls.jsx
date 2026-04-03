export default function Controls({ mode, trainingStatus, isFast, onModeChange, onStart, onPause, onResume, onStop, onSpeedToggle }) {
    const isAI = mode === 'ai'
    const isRunning = trainingStatus === 'running'
    const isPaused = trainingStatus === 'paused'
    const isActive = isRunning || isPaused

    function handleStartClick() {
        if (!isActive) onStart()
        else if (isRunning) onPause()
        else onResume()
    }

    const startClass = `${isRunning ? 'pause' : 'start'}`
    const startIcon = isRunning ? 'pause' : 'play_arrow'
    const stopClass = `${isActive ? 'enabled' : 'disabled'}`
    const speedClass = `${isActive ? 'enabled' : 'disabled'} ${isFast ? 'fast' : 'slow'}`
    const speedIcon = isFast ? 'keyboard_arrow_right' : 'keyboard_double_arrow_right'

    return (
        <div id="mode-toggle-wrapper">
            <span>Manual</span>
            <label className="switch">
                <input
                    type="checkbox"
                    id="mode-toggle"
                    checked={isAI}
                    onChange={e => onModeChange(e.target.checked ? 'ai' : 'manual')}
                />
                <span className="slider"></span>
            </label>
            <span>AI</span>

            {isAI && (
                <>
                    <button
                        id="stop-training"
                        className={stopClass}
                        disabled={!isActive}
                        onClick={onStop}
                        onKeyDown={e => { if ([' ', 'Enter'].includes(e.key)) { e.stopPropagation(); e.currentTarget.blur() } }}
                    >
                        <span className="material-icons">stop</span>
                    </button>

                    <button
                        id="start-training"
                        className={startClass}
                        onClick={handleStartClick}
                        onKeyDown={e => { if ([' ', 'Enter'].includes(e.key)) { e.stopPropagation(); e.currentTarget.blur() } }}
                    >
                        <span className="material-icons">{startIcon}</span>
                    </button>

                    {!isActive && (
                        <span id="start-hint" className="hint">← Click to begin training</span>
                    )}

                    <button
                        id="speed"
                        className={speedClass}
                        disabled={!isActive}
                        onClick={onSpeedToggle}
                        onKeyDown={e => { if ([' ', 'Enter'].includes(e.key)) { e.stopPropagation(); e.currentTarget.blur() } }}
                    >
                        <span className="material-icons">{speedIcon}</span>
                    </button>
                </>
            )}
        </div>
    )
}
