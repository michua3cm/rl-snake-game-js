import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import HUD from '../../components/HUD.jsx'

describe('HUD rendering', () => {
    it('displays the current score', () => {
        render(<HUD score={42} highScore={100} episode={5} showEpisode={false} />)
        expect(screen.getByText('42')).toBeTruthy()
    })

    it('displays the high score', () => {
        render(<HUD score={0} highScore={99} episode={1} showEpisode={false} />)
        expect(screen.getByText('99')).toBeTruthy()
    })

    it('hides episode row when showEpisode is false', () => {
        const { container } = render(
            <HUD score={0} highScore={0} episode={7} showEpisode={false} />
        )
        expect(container.querySelector('#episode')).toBeNull()
    })

    it('shows episode row when showEpisode is true', () => {
        render(<HUD score={0} highScore={0} episode={7} showEpisode={true} />)
        expect(screen.getByText('7')).toBeTruthy()
        // Ensure the episode element itself is present
        const episodeEl = document.getElementById('episode')
        expect(episodeEl).toBeTruthy()
    })

    it('renders the #hud container', () => {
        const { container } = render(
            <HUD score={0} highScore={0} episode={0} showEpisode={false} />
        )
        expect(container.querySelector('#hud')).toBeTruthy()
    })

    it('score of 0 renders as "0"', () => {
        render(<HUD score={0} highScore={0} episode={0} showEpisode={false} />)
        const scoreVal = document.getElementById('score-value')
        expect(scoreVal.textContent).toBe('0')
    })
})
