import { useState, useCallback } from 'react'
import useGame from './hooks/useGame.js'
import Board from './components/Board.jsx'
import HUD from './components/HUD.jsx'
import Overlay from './components/Overlay.jsx'
import Controls from './components/Controls.jsx'
import Settings from './components/Settings.jsx'

export default function App() {
    const [mode, setMode] = useState('ai')   // 'manual' | 'ai'
    const [config, setConfig] = useState({ width: 40, height: 20, cellSize: 20 })

    const {
        renderState,
        overlayState,
        trainingStatus,
        isFast,
        dismissOverlay,
        startAI,
        pauseAI,
        resumeAI,
        stopAI,
        toggleSpeed,
    } = useGame(config)

    const { snake, food, score, highScore, episode } = renderState

    const isAI = mode === 'ai'
    const isActive = trainingStatus === 'running' || trainingStatus === 'paused'
    const inputsDisabled = isAI ? isActive : overlayState === 'hidden'

    const handleModeChange = useCallback((newMode) => {
        setMode(newMode)
    }, [])

    const handleSizeChange = useCallback((field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }))
    }, [])

    const handleDismissOverlay = useCallback(() => {
        if (!isAI) dismissOverlay()
    }, [isAI, dismissOverlay])

    return (
        <div id="game-wrapper" className="min-h-screen bg-base-300 flex flex-col items-center justify-center py-8 px-4 gap-6">
            <div id="game-layout" className="flex flex-row items-start gap-4">
                <div id="game-container" className="flex flex-col gap-2">
                    <HUD
                        score={score}
                        highScore={highScore}
                        episode={episode}
                        showEpisode={isAI}
                    />
                    <div id="board-container" className="relative">
                        <Board
                            width={config.width}
                            height={config.height}
                            cellSize={config.cellSize}
                            snake={snake}
                            food={food}
                        />
                        <Overlay
                            state={isAI ? 'hidden' : overlayState}
                            score={score}
                            onDismiss={handleDismissOverlay}
                        />
                    </div>
                </div>

                <Controls
                    mode={mode}
                    trainingStatus={trainingStatus}
                    isFast={isFast}
                    onModeChange={handleModeChange}
                    onStart={startAI}
                    onPause={pauseAI}
                    onResume={resumeAI}
                    onStop={stopAI}
                    onSpeedToggle={toggleSpeed}
                />
            </div>

            <Settings
                config={config}
                disabled={inputsDisabled}
                onChange={handleSizeChange}
            />
        </div>
    )
}
