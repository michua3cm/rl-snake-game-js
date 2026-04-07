import { useState, useRef, useEffect, useCallback } from 'react'
import Game from '../components/game_env/Game.js'
import QLearningAgent from '../components/agents/q_learning/agent.js'

const EPISODES = 5000
const SLOW_DELAY = 20
const FAST_BATCH = 50   // steps between macrotask yields in fast mode

// Directions: 0=LEFT, 1=UP, 2=RIGHT, 3=DOWN
const KEY_DIR_MAP = {
    ArrowLeft: 0,
    ArrowUp: 1,
    ArrowRight: 2,
    ArrowDown: 3
}

function makeSnapshot(game, highScore, episode) {
    const segments = game.snake.getSegments()
    const food = game.food.getPosition()
    return {
        snake: segments ? [...segments] : [],
        food: food ?? null,
        score: game.getScore(),
        highScore,
        episode
    }
}

export default function useGame(config) {
    const { width, height, cellSize } = config

    // Imperative game objects — never trigger re-renders themselves
    const gameRef = useRef(null)
    const agentRef = useRef(null)
    const actionRef = useRef(1)          // current queued action (manual mode)
    const highScoreRef = useRef(0)
    const episodeRef = useRef(1)

    // AI loop control flags — use refs so async loop reads current value without re-mounting
    const cancelledRef = useRef(false)
    const pausedRef = useRef(false)
    const speedRef = useRef(SLOW_DELAY)
    const resumeResolveRef = useRef(null)

    // Manual mode pause flag
    const manualPausedRef = useRef(false)

    // Reactive state for rendering
    const [renderState, setRenderState] = useState({ snake: [], food: null, score: 0, highScore: 0, episode: 1 })
    const [overlayState, setOverlayState] = useState('start')   // 'start' | 'gameover' | 'hidden'
    const [trainingStatus, setTrainingStatus] = useState('idle') // 'idle' | 'running' | 'paused'
    const [isFast, setIsFast] = useState(false)
    const [manualPaused, setManualPaused] = useState(false)

    // ── Helpers ────────────────────────────────────────────────────────────────

    const syncState = useCallback((ep) => {
        const game = gameRef.current
        if (!game) return
        setRenderState(makeSnapshot(game, highScoreRef.current, ep ?? episodeRef.current))
    }, [])

    const resetGame = useCallback(() => {
        gameRef.current = new Game(width, height)
        actionRef.current = 1
        syncState()
    }, [width, height, syncState])

    // ── Initialise / reinitialise when config changes ──────────────────────────

    useEffect(() => {
        cancelledRef.current = true          // stop any running AI loop
        highScoreRef.current = 0
        episodeRef.current = 1
        gameRef.current = new Game(width, height)
        agentRef.current = new QLearningAgent()
        actionRef.current = 1
        manualPausedRef.current = false
        setOverlayState('start')
        setTrainingStatus('idle')
        setIsFast(false)
        setManualPaused(false)
        speedRef.current = SLOW_DELAY
        syncState(1)
    }, [width, height, cellSize]) // eslint-disable-line react-hooks/exhaustive-deps

    // ── Direction handler (shared by keyboard and D-pad) ──────────────────────

    const handleDirection = useCallback((dirKey) => {
        const game = gameRef.current
        if (!game) return
        const currDir = game.getDirection()
        actionRef.current = Game.getRelativeAction(currDir, KEY_DIR_MAP[dirKey])
    }, [])

    // ── Manual pause toggle (shared by space bar and D-pad pause button) ──────

    const toggleManualPause = useCallback(() => {
        if (!manualIntervalRef.current) return
        manualPausedRef.current = !manualPausedRef.current
        setManualPaused(manualPausedRef.current)
    }, [])

    // ── Arrow-key + space listener (manual mode only) ─────────────────────────

    useEffect(() => {
        function handleKey(e) {
            const ignored = ['Tab', 'Alt', 'Meta', 'Control', 'Shift']
            if (ignored.includes(e.key)) return
            if (e.key.startsWith('Arrow')) e.preventDefault()
            if (e.key === ' ') e.preventDefault()

            if (e.key in KEY_DIR_MAP) {
                handleDirection(e.key)
                return
            }

            // Space bar — toggle manual pause when game is running
            if (e.key === ' ') toggleManualPause()
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [handleDirection, toggleManualPause])

    // ── Manual game loop ───────────────────────────────────────────────────────

    const startManual = useCallback(() => {
        setOverlayState('hidden')

        const id = setInterval(() => {
            if (manualPausedRef.current) return   // paused — skip tick

            const game = gameRef.current
            if (!game) return
            game.step(actionRef.current)
            actionRef.current = 1

            const score = game.getScore()
            if (score > highScoreRef.current) highScoreRef.current = score

            if (game.isDone()) {
                clearInterval(id)
                highScoreRef.current = Math.max(highScoreRef.current, score)
                syncState()
                setOverlayState('gameover')
                manualPausedRef.current = false
                setManualPaused(false)
                return
            }
            syncState()
        }, 100)

        return id
    }, [syncState])

    // ── Manual mode: start / restart ─────────────────────────────────────────

    const manualIntervalRef = useRef(null)

    const startManualGame = useCallback(() => {
        if (manualIntervalRef.current) clearInterval(manualIntervalRef.current)
        gameRef.current = new Game(width, height)
        actionRef.current = 1
        manualPausedRef.current = false
        setManualPaused(false)
        syncState()
        manualIntervalRef.current = startManual()
    }, [width, height, syncState, startManual])

    // Restart mid-game: reset board but start in paused state so the player
    // can see the fresh board before resuming.
    const restartManualPaused = useCallback(() => {
        if (manualIntervalRef.current) clearInterval(manualIntervalRef.current)
        gameRef.current = new Game(width, height)
        actionRef.current = 1
        manualPausedRef.current = true
        setManualPaused(true)
        syncState()
        manualIntervalRef.current = startManual()
    }, [width, height, syncState, startManual])

    // Stop a running manual game (clear interval, return to start overlay)
    const stopManual = useCallback(() => {
        if (manualIntervalRef.current) {
            clearInterval(manualIntervalRef.current)
            manualIntervalRef.current = null
        }
        gameRef.current = new Game(width, height)
        actionRef.current = 1
        manualPausedRef.current = false
        setManualPaused(false)
        syncState()
        setOverlayState('start')
    }, [width, height, syncState])

    // Called by Overlay when user presses any key on the start/gameover screen
    const dismissOverlay = useCallback(() => {
        startManualGame()
    }, [startManualGame])

    // ── AI training loop ──────────────────────────────────────────────────────

    const startAI = useCallback(() => {
        cancelledRef.current = false
        pausedRef.current = false
        episodeRef.current = 0
        highScoreRef.current = 0
        gameRef.current = new Game(width, height)
        agentRef.current = new QLearningAgent()
        setOverlayState('hidden')
        setTrainingStatus('running')

        async function train() {
            while (episodeRef.current < EPISODES && !cancelledRef.current) {
                let state = gameRef.current.getState()
                let stepCount = 0

                while (!gameRef.current.isDone() && !cancelledRef.current) {
                    // Pause gate
                    if (pausedRef.current) {
                        await new Promise(resolve => { resumeResolveRef.current = resolve })
                    }

                    const action = agentRef.current.chooseAction(state)
                    const { nextState, reward } = gameRef.current.step(action)
                    agentRef.current.updateQ(state, action, reward, nextState)
                    state = nextState
                    stepCount++

                    const score = gameRef.current.getScore()
                    if (score > highScoreRef.current) highScoreRef.current = score

                    if (speedRef.current === SLOW_DELAY || stepCount % 200 === 0) {
                        syncState(episodeRef.current + 1)
                    }

                    if (speedRef.current === SLOW_DELAY) {
                        await new Promise(r => setTimeout(r, SLOW_DELAY))
                    } else if (stepCount % FAST_BATCH === 0) {
                        await new Promise(r => setTimeout(r, 0))
                    }
                }

                if (!cancelledRef.current) {
                    const score = gameRef.current.getScore()
                    highScoreRef.current = Math.max(highScoreRef.current, score)
                    agentRef.current.decayEpsilon()
                    episodeRef.current++
                    gameRef.current.reset()
                    syncState(episodeRef.current)
                }
            }

            if (!cancelledRef.current) {
                setTrainingStatus('idle')
                console.log('Training complete!')
            }
        }

        train()
    }, [width, height, syncState])

    const pauseAI = useCallback(() => {
        pausedRef.current = true
        setTrainingStatus('paused')
    }, [])

    const resumeAI = useCallback(() => {
        pausedRef.current = false
        setTrainingStatus('running')
        if (resumeResolveRef.current) {
            resumeResolveRef.current()
            resumeResolveRef.current = null
        }
    }, [])

    const stopAI = useCallback(() => {
        cancelledRef.current = true
        pausedRef.current = false
        if (resumeResolveRef.current) {
            resumeResolveRef.current()
            resumeResolveRef.current = null
        }
        setTrainingStatus('idle')
        setOverlayState('start')
        gameRef.current = new Game(width, height)
        agentRef.current = new QLearningAgent()
        episodeRef.current = 1
        highScoreRef.current = 0
        syncState(1)
    }, [width, height, syncState])

    const toggleSpeed = useCallback(() => {
        const newFast = speedRef.current === SLOW_DELAY
        speedRef.current = newFast ? 0 : SLOW_DELAY
        setIsFast(newFast)
    }, [])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cancelledRef.current = true
            if (manualIntervalRef.current) clearInterval(manualIntervalRef.current)
            if (resumeResolveRef.current) resumeResolveRef.current()
        }
    }, [])

    return {
        renderState,
        overlayState,
        trainingStatus,
        isFast,
        manualPaused,
        // manual mode
        dismissOverlay,
        stopManual,
        restartManual: restartManualPaused,
        handleDirection,
        toggleManualPause,
        // AI mode
        startAI,
        pauseAI,
        resumeAI,
        stopAI,
        toggleSpeed,
    }
}
