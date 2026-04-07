export default function DPad({ onDirection, onDismiss, onPause, paused }) {
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
            <div className="grid grid-cols-3 gap-1">
                <div />
                {dirBtn('ArrowUp', 'arrow_upward')}
                <div />
                {dirBtn('ArrowLeft', 'arrow_back')}
                {dirBtn('ArrowDown', 'arrow_downward')}
                {dirBtn('ArrowRight', 'arrow_forward')}
            </div>

            {/* Pause/resume button — only when game is actively running */}
            {onPause && (
                <button
                    id="dpad-pause"
                    className={`btn btn-sm gap-1 w-full max-w-36 ${paused ? 'btn-success' : 'btn-warning'}`}
                    onPointerDown={e => { e.preventDefault(); onPause() }}
                >
                    <span className="material-icons text-base">{paused ? 'play_arrow' : 'pause'}</span>
                    {paused ? 'Resume' : 'Pause'}
                </button>
            )}
        </div>
    )
}
