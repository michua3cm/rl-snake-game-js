export default function Controls({ mode, trainingStatus, isFast, manualPaused, onModeChange, onStart, onPause, onResume, onStop, onSpeedToggle }) {
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
                {/* Mode toggle — locked while AI is active */}
                <div className="join w-full">
                    <button
                        id="mode-btn-manual"
                        className={`join-item btn btn-sm flex-1 ${!isAI ? 'btn-primary' : 'btn-ghost opacity-50'}`}
                        disabled={isActive}
                        onClick={() => onModeChange('manual')}
                    >
                        Manual
                    </button>
                    <button
                        id="mode-btn-ai"
                        className={`join-item btn btn-sm flex-1 ${isAI ? 'btn-primary' : 'btn-ghost opacity-50'}`}
                        disabled={isActive}
                        onClick={() => onModeChange('ai')}
                    >
                        AI
                    </button>
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
                    </div>
                )}

                {/* Keyboard hints — desktop only, manual mode only */}
                {!isAI && (
                    <div className="flex flex-col gap-1 text-xs text-base-content/50 border-t border-base-300 pt-3 mt-1">
                        <div className="font-semibold text-base-content/70 mb-1">Controls</div>
                        <div className="flex items-center gap-2">
                            <span className="kbd kbd-xs">↑</span>
                            <span className="kbd kbd-xs">↓</span>
                            <span className="kbd kbd-xs">←</span>
                            <span className="kbd kbd-xs">→</span>
                            <span>Move</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="kbd kbd-xs">Space</span>
                            <span>{manualPaused ? 'Resume' : 'Pause'}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
