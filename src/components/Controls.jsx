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

    const startIcon = isRunning ? 'pause' : 'play_arrow'
    const speedIcon = isFast ? 'keyboard_arrow_right' : 'keyboard_double_arrow_right'

    const startClass = isRunning
        ? 'btn btn-warning btn-sm gap-1'
        : 'btn btn-success btn-sm gap-1'
    const stopClass = 'btn btn-error btn-sm gap-1'
    const speedClass = isFast
        ? 'btn btn-secondary btn-sm gap-1'
        : 'btn btn-info btn-sm gap-1'

    return (
        <div id="mode-toggle-wrapper" className="card bg-base-200 shadow-lg min-w-40">
            <div className="card-body flex flex-col gap-4 p-4">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-base-content/70">Manual</span>
                    <input
                        type="checkbox"
                        id="mode-toggle"
                        className="toggle toggle-primary"
                        checked={isAI}
                        onChange={e => onModeChange(e.target.checked ? 'ai' : 'manual')}
                    />
                    <span className="text-sm text-base-content/70">AI</span>
                </div>

                {isAI && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            id="stop-training"
                            className={stopClass}
                            disabled={!isActive}
                            onClick={onStop}
                            onKeyDown={e => { if ([' ', 'Enter'].includes(e.key)) { e.stopPropagation(); e.currentTarget.blur() } }}
                        >
                            <span className="material-icons text-base">stop</span>
                        </button>

                        <button
                            id="start-training"
                            className={startClass}
                            onClick={handleStartClick}
                            onKeyDown={e => { if ([' ', 'Enter'].includes(e.key)) { e.stopPropagation(); e.currentTarget.blur() } }}
                        >
                            <span className="material-icons text-base">{startIcon}</span>
                        </button>

                        <button
                            id="speed"
                            className={speedClass}
                            disabled={!isActive}
                            onClick={onSpeedToggle}
                            onKeyDown={e => { if ([' ', 'Enter'].includes(e.key)) { e.stopPropagation(); e.currentTarget.blur() } }}
                        >
                            <span className="material-icons text-base">{speedIcon}</span>
                        </button>

                        {!isActive && (
                            <span id="start-hint" className="text-xs text-base-content/40 w-full mt-1">← Click to begin training</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
