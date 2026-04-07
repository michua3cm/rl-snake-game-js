import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Controls from '../../components/Controls.jsx'

const defaultProps = {
    mode: 'manual',
    trainingStatus: 'idle',
    isFast: false,
    manualPaused: false,
    modeLocked: false,
    onModeChange: vi.fn(),
    onStart: vi.fn(),
    onPause: vi.fn(),
    onResume: vi.fn(),
    onStop: vi.fn(),
    onSpeedToggle: vi.fn(),
}

function renderControls(overrides = {}) {
    const props = { ...defaultProps, ...overrides }
    Object.values(props).forEach(v => typeof v === 'function' && v.mockReset?.())
    return render(<Controls {...props} />)
}

describe('Controls — mode segmented control', () => {
    it('renders Manual and AI buttons', () => {
        renderControls()
        expect(screen.getByText('Manual')).toBeTruthy()
        expect(screen.getByText('AI')).toBeTruthy()
    })

    it('Manual button has primary style in manual mode', () => {
        renderControls({ mode: 'manual' })
        expect(document.getElementById('mode-btn-manual').className).toContain('btn-primary')
        expect(document.getElementById('mode-btn-ai').className).toContain('btn-ghost')
    })

    it('AI button has primary style in ai mode', () => {
        renderControls({ mode: 'ai' })
        expect(document.getElementById('mode-btn-ai').className).toContain('btn-primary')
        expect(document.getElementById('mode-btn-manual').className).toContain('btn-ghost')
    })

    it('calls onModeChange("ai") when AI button clicked', () => {
        const onModeChange = vi.fn()
        renderControls({ mode: 'manual', onModeChange })
        fireEvent.click(document.getElementById('mode-btn-ai'))
        expect(onModeChange).toHaveBeenCalledWith('ai')
    })

    it('calls onModeChange("manual") when Manual button clicked', () => {
        const onModeChange = vi.fn()
        renderControls({ mode: 'ai', onModeChange })
        fireEvent.click(document.getElementById('mode-btn-manual'))
        expect(onModeChange).toHaveBeenCalledWith('manual')
    })

    it('mode buttons are disabled when modeLocked is true', () => {
        renderControls({ modeLocked: true })
        expect(document.getElementById('mode-btn-manual').disabled).toBe(true)
        expect(document.getElementById('mode-btn-ai').disabled).toBe(true)
    })

    it('mode buttons are enabled when modeLocked is false', () => {
        renderControls({ modeLocked: false })
        expect(document.getElementById('mode-btn-manual').disabled).toBe(false)
        expect(document.getElementById('mode-btn-ai').disabled).toBe(false)
    })

    it('mode buttons are disabled during AI training', () => {
        renderControls({ mode: 'ai', modeLocked: true })
        expect(document.getElementById('mode-btn-manual').disabled).toBe(true)
    })

    it('mode buttons are disabled during manual play', () => {
        renderControls({ mode: 'manual', modeLocked: true })
        expect(document.getElementById('mode-btn-ai').disabled).toBe(true)
    })
})

describe('Controls — manual mode hides AI buttons', () => {
    it('does not render AI control buttons', () => {
        renderControls({ mode: 'manual' })
        expect(document.getElementById('start-training')).toBeNull()
        expect(document.getElementById('stop-training')).toBeNull()
        expect(document.getElementById('speed')).toBeNull()
    })
})

describe('Controls — AI mode idle', () => {
    it('renders start, stop, speed buttons', () => {
        renderControls({ mode: 'ai', trainingStatus: 'idle' })
        expect(document.getElementById('start-training')).toBeTruthy()
        expect(document.getElementById('stop-training')).toBeTruthy()
        expect(document.getElementById('speed')).toBeTruthy()
    })

    it('stop and speed buttons are disabled when idle', () => {
        renderControls({ mode: 'ai', trainingStatus: 'idle' })
        expect(document.getElementById('stop-training').disabled).toBe(true)
        expect(document.getElementById('speed').disabled).toBe(true)
    })

    it('calls onStart when start button clicked and idle', () => {
        const onStart = vi.fn()
        renderControls({ mode: 'ai', trainingStatus: 'idle', onStart })
        fireEvent.click(document.getElementById('start-training'))
        expect(onStart).toHaveBeenCalledTimes(1)
    })
})

describe('Controls — AI mode running', () => {
    it('hides hint text when active', () => {
        renderControls({ mode: 'ai', trainingStatus: 'running' })
        expect(document.getElementById('start-hint')).toBeNull()
    })

    it('stop and speed buttons are enabled when running', () => {
        renderControls({ mode: 'ai', trainingStatus: 'running' })
        expect(document.getElementById('stop-training').disabled).toBe(false)
        expect(document.getElementById('speed').disabled).toBe(false)
    })

    it('calls onPause when start button clicked while running', () => {
        const onPause = vi.fn()
        renderControls({ mode: 'ai', trainingStatus: 'running', onPause })
        fireEvent.click(document.getElementById('start-training'))
        expect(onPause).toHaveBeenCalledTimes(1)
    })

    it('calls onStop when stop button clicked', () => {
        const onStop = vi.fn()
        renderControls({ mode: 'ai', trainingStatus: 'running', onStop })
        fireEvent.click(document.getElementById('stop-training'))
        expect(onStop).toHaveBeenCalledTimes(1)
    })

    it('calls onSpeedToggle when speed button clicked', () => {
        const onSpeedToggle = vi.fn()
        renderControls({ mode: 'ai', trainingStatus: 'running', onSpeedToggle })
        fireEvent.click(document.getElementById('speed'))
        expect(onSpeedToggle).toHaveBeenCalledTimes(1)
    })
})

describe('Controls — AI mode paused', () => {
    it('calls onResume when start button clicked while paused', () => {
        const onResume = vi.fn()
        renderControls({ mode: 'ai', trainingStatus: 'paused', onResume })
        fireEvent.click(document.getElementById('start-training'))
        expect(onResume).toHaveBeenCalledTimes(1)
    })
})

describe('Controls — speed icon', () => {
    it('shows slow icon when isFast is false', () => {
        renderControls({ mode: 'ai', trainingStatus: 'running', isFast: false })
        const speedBtn = document.getElementById('speed')
        expect(speedBtn.textContent).toContain('keyboard_double_arrow_right')
    })

    it('shows fast icon when isFast is true', () => {
        renderControls({ mode: 'ai', trainingStatus: 'running', isFast: true })
        const speedBtn = document.getElementById('speed')
        expect(speedBtn.textContent).toContain('keyboard_arrow_right')
    })
})
