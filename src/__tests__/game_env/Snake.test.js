import { describe, it, expect, beforeEach } from 'vitest'
import Snake from '../../components/game_env/Snake.js'

// Directions: 0=LEFT 1=UP 2=RIGHT 3=DOWN (same as Game.js)
const DIRS = [
    { x: -1, y: 0 }, // LEFT
    { x: 0, y: -1 }, // UP
    { x: 1, y: 0 },  // RIGHT
    { x: 0, y: 1 },  // DOWN
]

describe('Snake initialisation', () => {
    it('spawns at the board centre when no spawn coords given', () => {
        const snake = new Snake(10, 10, 2)
        const segs = snake.getSegments()
        expect(segs).toHaveLength(1)
        expect(segs[0]).toEqual({ x: 5, y: 5 })
    })

    it('centres correctly on odd-dimension boards when no spawn coords given', () => {
        const snake = new Snake(9, 7, 2)
        const head = snake.getHead()
        expect(head).toEqual({ x: 4, y: 3 })
    })

    it('spawns at an explicit position when coords are provided', () => {
        const snake = new Snake(10, 10, 2, 3, 7)
        expect(snake.getHead()).toEqual({ x: 3, y: 7 })
    })

    it('getHead returns the same object as segments[0]', () => {
        const snake = new Snake(10, 10, 2)
        expect(snake.getHead()).toBe(snake.getSegments()[0])
    })
})

describe('Snake.move — no food eaten', () => {
    let snake

    beforeEach(() => {
        snake = new Snake(10, 10, 2) // head at (5,5)
    })

    it('moves right and does not grow', () => {
        const food = { x: 99, y: 99 } // unreachable
        const ate = snake.move(DIRS[2], food)

        expect(ate).toBe(false)
        expect(snake.getSegments()).toHaveLength(1)
        expect(snake.getHead()).toEqual({ x: 6, y: 5 })
    })

    it('moves up and does not grow', () => {
        const ate = snake.move(DIRS[1], { x: 99, y: 99 })

        expect(ate).toBe(false)
        expect(snake.getHead()).toEqual({ x: 5, y: 4 })
    })

    it('moves left and does not grow', () => {
        snake.move(DIRS[0], { x: 99, y: 99 })
        expect(snake.getHead()).toEqual({ x: 4, y: 5 })
    })

    it('moves down and does not grow', () => {
        snake.move(DIRS[3], { x: 99, y: 99 })
        expect(snake.getHead()).toEqual({ x: 5, y: 6 })
    })

    it('length stays 1 after multiple non-eating moves', () => {
        for (let i = 0; i < 5; i++) snake.move(DIRS[2], { x: 99, y: 99 })
        expect(snake.getSegments()).toHaveLength(1)
    })
})

describe('Snake.move — food eaten', () => {
    let snake

    beforeEach(() => {
        snake = new Snake(10, 10, 2) // head at (5,5)
    })

    it('grows by 1 when moving onto food', () => {
        const food = { x: 6, y: 5 } // directly right of head
        const ate = snake.move(DIRS[2], food)

        expect(ate).toBe(true)
        expect(snake.getSegments()).toHaveLength(2)
        expect(snake.getHead()).toEqual({ x: 6, y: 5 })
    })

    it('does not trim tail when food is eaten', () => {
        snake.move(DIRS[2], { x: 6, y: 5 }) // eat — length 2, head=(6,5), tail=(5,5)
        const segs = snake.getSegments()
        expect(segs[0]).toEqual({ x: 6, y: 5 })
        expect(segs[1]).toEqual({ x: 5, y: 5 })
    })

    it('grows correctly over multiple consecutive eats', () => {
        // Eat three times moving right
        snake.move(DIRS[2], { x: 6, y: 5 }) // length 2
        snake.move(DIRS[2], { x: 7, y: 5 }) // length 3
        snake.move(DIRS[2], { x: 8, y: 5 }) // length 4

        expect(snake.getSegments()).toHaveLength(4)
        expect(snake.getHead()).toEqual({ x: 8, y: 5 })
    })
})

describe('Snake.getSegments immutability contract', () => {
    it('returns the live array reference (mutations visible)', () => {
        const snake = new Snake(10, 10, 2)
        const segs = snake.getSegments()
        snake.move(DIRS[2], { x: 99, y: 99 })
        // The reference stays the same and reflects new position
        expect(segs[0]).toEqual({ x: 6, y: 5 })
    })
})
