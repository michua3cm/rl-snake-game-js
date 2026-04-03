import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Board from '../../components/Board.jsx'

const defaultProps = {
    width: 3,
    height: 3,
    cellSize: 20,
    snake: [{ x: 1, y: 1 }],
    food: { x: 2, y: 0 },
}

describe('Board rendering', () => {
    it('renders width × height cells', () => {
        const { container } = render(<Board {...defaultProps} />)
        const cells = container.querySelectorAll('.cell')
        expect(cells).toHaveLength(9)
    })

    it('renders the board with correct grid CSS', () => {
        const { container } = render(<Board {...defaultProps} />)
        const board = container.querySelector('#board')
        expect(board).toBeTruthy()
        expect(board.style.gridTemplateColumns).toContain('3')
        expect(board.style.gridTemplateRows).toContain('3')
    })

    it('applies .head class to the first snake segment', () => {
        const { container } = render(<Board {...defaultProps} />)
        // Head is at (1,1) → index = y*width + x = 1*3+1 = 4
        const cells = container.querySelectorAll('.cell')
        expect(cells[4].className).toContain('head')
    })

    it('applies .food class to the food cell', () => {
        const { container } = render(<Board {...defaultProps} />)
        // Food at (2,0) → index = 0*3+2 = 2
        const cells = container.querySelectorAll('.cell')
        expect(cells[2].className).toContain('food')
    })

    it('applies .snake class to body segments (not head)', () => {
        const snake = [{ x: 1, y: 1 }, { x: 0, y: 1 }, { x: 0, y: 0 }]
        const { container } = render(
            <Board {...defaultProps} snake={snake} />
        )
        const cells = container.querySelectorAll('.cell')
        // Segment at (0,1) → index 3
        expect(cells[3].className).toContain('snake')
        // Segment at (0,0) → index 0
        expect(cells[0].className).toContain('snake')
        // Head at (1,1) → index 4 should be 'head', not 'snake'
        expect(cells[4].className).not.toContain('snake')
        expect(cells[4].className).toContain('head')
    })

    it('does not apply head/snake/food to a plain empty cell', () => {
        const { container } = render(<Board {...defaultProps} />)
        // Cell at (0,0) → index 0 is empty
        const cells = container.querySelectorAll('.cell')
        expect(cells[0].className.trim()).toBe('cell')
    })

    it('applies correct cell size via inline style', () => {
        const { container } = render(<Board {...defaultProps} cellSize={30} />)
        const cells = container.querySelectorAll('.cell')
        expect(cells[0].style.width).toBe('30px')
        expect(cells[0].style.height).toBe('30px')
    })

    it('handles empty snake array without crashing', () => {
        const { container } = render(
            <Board {...defaultProps} snake={[]} />
        )
        expect(container.querySelectorAll('.cell')).toHaveLength(9)
    })

    it('handles null food without crashing', () => {
        const { container } = render(
            <Board {...defaultProps} food={null} />
        )
        expect(container.querySelectorAll('.food')).toHaveLength(0)
    })
})
