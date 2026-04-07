export default function DPad({ onDirection, onDismiss, onPause, onRestart, paused }) {
    function dirBtn(dirKey, icon) {
        return (
            <button
                className="btn btn-neutral btn-sm w-12 h-12 p-0"
                onPointerDown={e => {
                    e.preventDefault()
                    if (onDismiss) onDismiss()
                    onDirection(dirKey)
                }}
            >
                <span className="material-icons">{icon}</span>
            </button>
        )
    }

    return (
        <div id="dpad" className="md:hidden flex flex-col items-center gap-2 mt-3">
            {/* Arrow cross */}
            <div className="grid grid-cols-3 gap-1">
                <div />
                {dirBtn('ArrowUp', 'arrow_upward')}
                <div />
                {dirBtn('ArrowLeft', 'arrow_back')}
                {dirBtn('ArrowDown', 'arrow_downward')}
                {dirBtn('ArrowRight', 'arrow_forward')}
            </div>

            {/* Game controls row — only while a game is running */}
            {onPause && (
                <div className="flex gap-2 w-full max-w-36 justify-center">
                    <button
                        id="dpad-restart"
                        className="btn btn-neutral btn-sm flex-1"
                        disabled={!paused}
                        onPointerDown={e => { e.preventDefault(); onRestart() }}
                    >
                        <span className="material-icons text-base">replay</span>
                    </button>
                    <button
                        id="dpad-pause"
                        className={`btn btn-sm flex-1 ${paused ? 'btn-success' : 'btn-warning'}`}
                        onPointerDown={e => { e.preventDefault(); onPause() }}
                    >
                        <span className="material-icons text-base">{paused ? 'play_arrow' : 'pause'}</span>
                    </button>
                </div>
            )}
        </div>
    )
}
