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
        <div id="overlay">
            <div id="overlay-title">
                {state === 'start' ? 'Press any key to start' : 'Game Over'}
            </div>
            {state === 'gameover' && (
                <>
                    <div id="overlay-score">Score: {score}</div>
                    <div id="overlay-instruction">Press any key to reset</div>
                </>
            )}
        </div>
    )
}
