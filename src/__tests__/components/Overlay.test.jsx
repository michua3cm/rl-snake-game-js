import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Overlay from '../../components/Overlay.jsx'

describe('Overlay — hidden state', () => {
    it('renders nothing when state is "hidden"', () => {
        const { container } = render(
            <Overlay state="hidden" score={0} onDismiss={vi.fn()} />
        )
        expect(container.firstChild).toBeNull()
    })
})

describe('Overlay — start state', () => {
    it('shows start prompt', () => {
        render(<Overlay state="start" score={0} onDismiss={vi.fn()} />)
        expect(screen.getByText('Tap or press any key to start')).toBeTruthy()
    })

    it('does not show score or reset instruction', () => {
        const { container } = render(
            <Overlay state="start" score={5} onDismiss={vi.fn()} />
        )
        expect(container.querySelector('#overlay-score')).toBeNull()
        expect(container.querySelector('#overlay-instruction')).toBeNull()
    })

    it('calls onDismiss when a regular key is pressed (after tick)', async () => {
        vi.useFakeTimers()
        const onDismiss = vi.fn()
        render(<Overlay state="start" score={0} onDismiss={onDismiss} />)

        // Flush the setTimeout(0) that registers the keydown listener
        await act(async () => { vi.runAllTimers() })

        await act(async () => {
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
        })

        expect(onDismiss).toHaveBeenCalledTimes(1)
        vi.useRealTimers()
    })

    it('does not call onDismiss for ignored keys', async () => {
        vi.useFakeTimers()
        const onDismiss = vi.fn()
        render(<Overlay state="start" score={0} onDismiss={onDismiss} />)

        await act(async () => { vi.runAllTimers() })

        for (const key of ['Tab', 'Escape', 'Alt', 'Control', 'Shift', 'Meta']) {
            document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
        }

        expect(onDismiss).not.toHaveBeenCalled()
        vi.useRealTimers()
    })
})

describe('Overlay — gameover state', () => {
    it('shows "Game Over" title', () => {
        render(<Overlay state="gameover" score={7} onDismiss={vi.fn()} />)
        expect(screen.getByText('Game Over')).toBeTruthy()
    })

    it('shows final score', () => {
        render(<Overlay state="gameover" score={7} onDismiss={vi.fn()} />)
        expect(screen.getByText('Score: 7')).toBeTruthy()
    })

    it('shows reset instruction', () => {
        render(<Overlay state="gameover" score={0} onDismiss={vi.fn()} />)
        expect(screen.getByText('Tap or press any key to reset')).toBeTruthy()
    })

    it('does not call onDismiss on keypress (gameover uses parent handler)', async () => {
        vi.useFakeTimers()
        const onDismiss = vi.fn()
        render(<Overlay state="gameover" score={0} onDismiss={onDismiss} />)

        await act(async () => { vi.runAllTimers() })

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
        expect(onDismiss).not.toHaveBeenCalled()
        vi.useRealTimers()
    })
})

describe('Overlay — cleanup on unmount', () => {
    it('removes keydown listener when unmounted from start state', async () => {
        vi.useFakeTimers()
        const onDismiss = vi.fn()
        const { unmount } = render(
            <Overlay state="start" score={0} onDismiss={onDismiss} />
        )

        await act(async () => { vi.runAllTimers() })
        unmount()

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }))
        expect(onDismiss).not.toHaveBeenCalled()
        vi.useRealTimers()
    })
})
