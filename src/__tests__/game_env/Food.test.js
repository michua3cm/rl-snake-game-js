import { describe, it, expect } from 'vitest'
import Food from '../../components/game_env/Food.js'

describe('Food initialisation', () => {
    it('returns a position object with x and y properties', () => {
        const food = new Food(10, 10, [])
        const pos = food.getPosition()
        expect(pos).toHaveProperty('x')
        expect(pos).toHaveProperty('y')
    })

    it('position is within board bounds', () => {
        for (let i = 0; i < 20; i++) {
            const food = new Food(10, 8, [])
            const { x, y } = food.getPosition()
            expect(x).toBeGreaterThanOrEqual(0)
            expect(x).toBeLessThan(10)
            expect(y).toBeGreaterThanOrEqual(0)
            expect(y).toBeLessThan(8)
        }
    })

    it('position does not overlap a single-segment snake', () => {
        const snake = [{ x: 5, y: 5 }]
        for (let i = 0; i < 50; i++) {
            const food = new Food(10, 10, snake)
            const { x, y } = food.getPosition()
            expect(x === 5 && y === 5).toBe(false)
        }
    })

    it('position does not overlap any snake segment', () => {
        const snake = [
            { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
            { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
        ]
        const occupied = new Set(snake.map(p => `${p.x},${p.y}`))

        for (let i = 0; i < 30; i++) {
            const food = new Food(10, 10, snake)
            const { x, y } = food.getPosition()
            expect(occupied.has(`${x},${y}`)).toBe(false)
        }
    })
})

describe('Food — full board edge case', () => {
    it('returns null when the board is completely filled by the snake', () => {
        // Build a 2×2 snake covering all 4 cells
        const snake = [
            { x: 0, y: 0 }, { x: 1, y: 0 },
            { x: 0, y: 1 }, { x: 1, y: 1 },
        ]
        const food = new Food(2, 2, snake)
        expect(food.getPosition()).toBeNull()
    })
})

describe('Food.getPosition', () => {
    it('returns the same value as food.position', () => {
        const food = new Food(10, 10, [])
        expect(food.getPosition()).toBe(food.position)
    })
})
