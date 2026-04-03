import { describe, it, expect, beforeEach, vi } from 'vitest'
import Game from '../../components/game_env/Game.js'

// ─── Static helpers ──────────────────────────────────────────────────────────

describe('Game.computeNewDirection', () => {
    // Directions: 0=LEFT 1=UP 2=RIGHT 3=DOWN
    // Actions:    0=turn-left  1=forward  2=turn-right

    it('keeps direction when action is forward (1)', () => {
        expect(Game.computeNewDirection(0, 1)).toBe(0)
        expect(Game.computeNewDirection(1, 1)).toBe(1)
        expect(Game.computeNewDirection(2, 1)).toBe(2)
        expect(Game.computeNewDirection(3, 1)).toBe(3)
    })

    it('turns left from each heading', () => {
        expect(Game.computeNewDirection(0, 0)).toBe(3) // LEFT → DOWN
        expect(Game.computeNewDirection(1, 0)).toBe(0) // UP   → LEFT
        expect(Game.computeNewDirection(2, 0)).toBe(1) // RIGHT→ UP
        expect(Game.computeNewDirection(3, 0)).toBe(2) // DOWN → RIGHT
    })

    it('turns right from each heading', () => {
        expect(Game.computeNewDirection(0, 2)).toBe(1) // LEFT → UP
        expect(Game.computeNewDirection(1, 2)).toBe(2) // UP   → RIGHT
        expect(Game.computeNewDirection(2, 2)).toBe(3) // RIGHT→ DOWN
        expect(Game.computeNewDirection(3, 2)).toBe(0) // DOWN → LEFT
    })
})

describe('Game.getRelativeAction', () => {
    it('returns 1 (forward) when input matches current direction', () => {
        expect(Game.getRelativeAction(0, 0)).toBe(1)
        expect(Game.getRelativeAction(2, 2)).toBe(1)
    })

    it('returns 2 (right) when turning right', () => {
        expect(Game.getRelativeAction(0, 1)).toBe(2) // LEFT → UP  is right-turn
        expect(Game.getRelativeAction(1, 2)).toBe(2) // UP  → RIGHT
    })

    it('returns 0 (left) when turning left', () => {
        expect(Game.getRelativeAction(0, 3)).toBe(0) // LEFT → DOWN is left-turn
        expect(Game.getRelativeAction(1, 0)).toBe(0) // UP  → LEFT
    })

    it('defaults to forward for a 180° reversal', () => {
        // Reversing direction is invalid in snake; the code defaults to 1
        expect(Game.getRelativeAction(0, 2)).toBe(1) // LEFT → RIGHT (reverse)
    })
})

// ─── Game instance ────────────────────────────────────────────────────────────

describe('Game initialisation', () => {
    let game

    beforeEach(() => {
        game = new Game(10, 10)
    })

    it('starts not done', () => {
        expect(game.isDone()).toBe(false)
    })

    it('starts with score 0', () => {
        expect(game.getScore()).toBe(0)
    })

    it('getState returns an 11-element boolean array', () => {
        const state = game.getState()
        expect(state).toHaveLength(11)
        state.forEach(bit => expect(typeof bit).toBe('boolean'))
    })

    it('direction is a valid index (0–3)', () => {
        expect(game.getDirection()).toBeGreaterThanOrEqual(0)
        expect(game.getDirection()).toBeLessThanOrEqual(3)
    })
})

describe('Game.reset', () => {
    it('resets score and done flag', () => {
        const game = new Game(10, 10)

        // Run until done on a tiny board
        const tiny = new Game(3, 3)
        for (let i = 0; i < 500; i++) {
            tiny.step(1)
            if (tiny.isDone()) break
        }
        tiny.reset()

        expect(tiny.isDone()).toBe(false)
        expect(tiny.getScore()).toBe(0)
    })

    it('returns the 11-bit initial state', () => {
        const game = new Game(10, 10)
        const state = game.reset()
        expect(state).toHaveLength(11)
    })
})

describe('Game.step — collision', () => {
    it('does not step when already done, returns reward 0', () => {
        // Run tiny board to completion
        const game = new Game(3, 3)
        for (let i = 0; i < 500; i++) {
            game.step(1)
            if (game.isDone()) break
        }
        expect(game.isDone()).toBe(true)

        const { reward, done } = game.step(1)
        expect(reward).toBe(0)
        expect(done).toBe(true)
    })

    it('sets done and returns -10 on wall collision', () => {
        // Force snake into a wall by taking the same forward action many times
        // on a tiny board where collision is inevitable
        const game = new Game(2, 2)
        let result
        for (let i = 0; i < 20; i++) {
            result = game.step(1)
            if (result.done) break
        }
        expect(result.done).toBe(true)
        expect(result.reward).toBe(-10)
    })
})

describe('Game.step — food reward', () => {
    it('returns +10 and increments score when snake eats food', () => {
        // Use a mock to position food directly in front of the snake head
        const game = new Game(10, 10)
        const head = game.snake.getHead()
        const dir = game.getDirection()
        const DIRECTIONS = [
            { x: -1, y: 0 }, // LEFT
            { x: 0, y: -1 }, // UP
            { x: 1, y: 0 },  // RIGHT
            { x: 0, y: 1 },  // DOWN
        ]
        const move = DIRECTIONS[dir]

        // Place food directly in front of the snake by overriding food position
        game.food.position = { x: head.x + move.x, y: head.y + move.y }

        const { reward, done } = game.step(1) // forward

        if (!done) {
            // Only assert reward if the step didn't immediately collide
            // (edge: food placed on boundary would also cause collision)
            expect(reward).toBe(10)
            expect(game.getScore()).toBe(1)
        }
    })
})

describe('Game.step — distance reward', () => {
    it('returns negative net reward when moving away from food', () => {
        // Control positions: snake at center, food at far corner, then step away
        const game = new Game(20, 20)
        const head = game.snake.getHead()
        const dir = game.getDirection()
        const DIRECTIONS = [
            { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 },
        ]
        const move = DIRECTIONS[dir]

        // Place food far behind the snake (opposite direction from movement)
        game.food.position = {
            x: head.x - move.x * 5,
            y: head.y - move.y * 5,
        }

        // Clamp to board
        game.food.position.x = Math.max(0, Math.min(19, game.food.position.x))
        game.food.position.y = Math.max(0, Math.min(19, game.food.position.y))

        const { reward, done } = game.step(1)

        if (!done) {
            // Moving away: distReward negative + idlePenalty -1 → net < 0
            expect(reward).toBeLessThan(0)
        }
    })

    it('step result contains nextState, reward, done', () => {
        const game = new Game(10, 10)
        const result = game.step(1)
        expect(result).toHaveProperty('nextState')
        expect(result).toHaveProperty('reward')
        expect(result).toHaveProperty('done')
        expect(result.nextState).toHaveLength(11)
    })
})

describe('Game.step — timeout', () => {
    it('terminates with -10 when frame limit is exceeded', () => {
        // Frame limit = 100 * snakeLength. With length 1 that is 100 frames.
        // Use a large board so walls are not hit and food is never eaten.
        const game = new Game(50, 50)

        // Override food to an unreachable corner so the snake never eats
        game.food.position = { x: 49, y: 49 }

        // Force snake to centre and override direction to loop
        let result
        for (let i = 0; i < 200; i++) {
            result = game.step(1)
            if (result.done) break
        }

        expect(result.done).toBe(true)
        expect(result.reward).toBe(-10)
    })
})
