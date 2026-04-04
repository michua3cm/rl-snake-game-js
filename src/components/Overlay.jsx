import { useEffect, useRef } from 'react'

export default function Overlay({ state, score, onDismiss }) {
    const addedRef = useRef(false)

    useEffect(() => {
        if (state !== 'start') return

        // Use nextTick equivalent so we don't consume the same keypress that
        // triggered a game-over restart transition to 'start'.
        const t = setTimeout(() => {
            addedRef.current = true
            document.addEventListener('keydown', handleKey)
        }, 0)

        return () => {
            clearTimeout(t)
            if (addedRef.current) {
                document.removeEventListener('keydown', handleKey)
                addedRef.current = false
            }
        }

        function handleKey(e) {
            const ignored = ['Tab', 'Escape', 'Alt', 'Control', 'Shift', 'Meta']
            if (ignored.includes(e.key)) return
            if (document.activeElement?.tagName === 'INPUT') return
            document.removeEventListener('keydown', handleKey)
            addedRef.current = false
            onDismiss()
        }
    }, [state, onDismiss])

    if (state === 'hidden') return null

    return (
        <div id="overlay" className="absolute inset-0 flex flex-col items-center justify-center bg-base-300/80 backdrop-blur-sm z-10 pointer-events-none">
            <div id="overlay-title" className="text-4xl font-bold mb-3 text-base-content">
                {state === 'start' ? 'Press any key to start' : 'Game Over'}
            </div>
            {state === 'gameover' && (
                <>
                    <div id="overlay-score" className="text-xl text-base-content/70 mb-1">Score: {score}</div>
                    <div id="overlay-instruction" className="text-sm text-base-content/50">Press any key to reset</div>
                </>
            )}
        </div>
    )
}
