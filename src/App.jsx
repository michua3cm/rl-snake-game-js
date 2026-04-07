import { useState, useCallback } from 'react'
import useGame from './hooks/useGame.js'
import useTheme from './hooks/useTheme.js'
import Board from './components/Board.jsx'
import HUD from './components/HUD.jsx'
import Overlay from './components/Overlay.jsx'
import Controls from './components/Controls.jsx'
import Settings from './components/Settings.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import DPad from './components/DPad.jsx'

export default function App() {
    const [mode, setMode] = useState('ai')   // 'manual' | 'ai'
    const [config, setConfig] = useState(() => {
        const vw = window.innerWidth
        const cellSize = vw < 768 ? Math.max(5, Math.floor((vw - 32) / 40)) : 20
        return { width: 40, height: 20, cellSize }
    })
    const [themePref, setThemePref] = useTheme()

    const {
        renderState,
        overlayState,
        trainingStatus,
        isFast,
        manualPaused,
        dismissOverlay,
        stopManual,
        handleDirection,
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
        if (newMode === 'manual') {
            stopAI()
        } else {
            stopManual()
        }
        setMode(newMode)
    }, [stopAI, stopManual])

    const handleSizeChange = useCallback((field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }))
    }, [])

    const handleDismissOverlay = useCallback(() => {
        if (!isAI) dismissOverlay()
    }, [isAI, dismissOverlay])

    // D-pad visible whenever in manual mode; passes onDismiss only while
    // overlay is active so tapping an arrow also starts/restarts the game.
    const dpadDismiss = (!isAI && overlayState !== 'hidden') ? handleDismissOverlay : null

    return (
        <div id="game-wrapper" className="min-h-screen bg-base-300 flex flex-col items-center justify-center py-6 px-4 gap-5">
            {/* Theme toggle — top-right */}
            <div className="w-full flex justify-end">
                <ThemeToggle pref={themePref} onChange={setThemePref} />
            </div>

            <div id="game-layout" className="flex flex-col md:flex-row items-start gap-4 w-full max-w-max mx-auto">
                <div id="game-container" className="flex flex-col gap-2 w-full md:w-auto">
                    <HUD
                        score={score}
                        highScore={highScore}
                        episode={episode}
                        showEpisode={isAI}
                    />
                    <div id="board-wrapper" className="overflow-x-auto w-full">
                        <div id="board-container" className="relative inline-block">
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

                    {/* Mobile D-pad — always visible in manual mode */}
                    {!isAI && (
                        <DPad
                            onDirection={handleDirection}
                            onDismiss={dpadDismiss}
                            paused={manualPaused}
                        />
                    )}
                </div>

                <Controls
                    mode={mode}
                    trainingStatus={trainingStatus}
                    isFast={isFast}
                    manualPaused={manualPaused}
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
