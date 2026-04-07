export default function DPad({ onDirection, onDismiss, paused }) {
    function btn(dirKey, icon) {
        return (
            <button
                className="btn btn-neutral btn-sm w-12 h-12 p-0"
                onPointerDown={e => {
                    e.preventDefault()      // prevent focus steal from game
                    if (onDismiss) onDismiss()  // start game if overlay is active
                    onDirection(dirKey)
                }}
            >
                <span className="material-icons">{icon}</span>
            </button>
        )
    }

    return (
        <div id="dpad" className="md:hidden flex flex-col items-center gap-1 mt-3">
            {paused && (
                <div className="text-xs text-base-content/50 mb-1">Paused — press Space to resume</div>
            )}
            <div className="grid grid-cols-3 gap-1">
                <div />
                {btn('ArrowUp', 'arrow_upward')}
                <div />
                {btn('ArrowLeft', 'arrow_back')}
                {btn('ArrowDown', 'arrow_downward')}
                {btn('ArrowRight', 'arrow_forward')}
            </div>
        </div>
    )
}
