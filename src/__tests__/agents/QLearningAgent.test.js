import { describe, it, expect, beforeEach, vi } from 'vitest'
import QLearningAgent, { MOVES } from '../../components/agents/q_learning/agent.js'

// Helper: a fixed dummy state (11-bit boolean array)
const STATE_A = Array(11).fill(false)
const STATE_B = Array(11).fill(true)

describe('QLearningAgent initialisation', () => {
    it('constructs with default hyperparameters', () => {
        const agent = new QLearningAgent()
        expect(agent.alpha).toBe(0.1)
        expect(agent.gamma).toBe(0.9)
        expect(agent.epsilon).toBe(1.0)
        expect(agent.minEpsilon).toBe(0.0)
        expect(agent.epsilonDecay).toBe(0.995)
    })

    it('constructs with custom hyperparameters', () => {
        const agent = new QLearningAgent(0.5, 0.8, 0.3, 0.05, 0.99)
        expect(agent.alpha).toBe(0.5)
        expect(agent.gamma).toBe(0.8)
        expect(agent.epsilon).toBe(0.3)
        expect(agent.minEpsilon).toBe(0.05)
        expect(agent.epsilonDecay).toBe(0.99)
    })

    it('starts with an empty Q-table', () => {
        const agent = new QLearningAgent()
        expect(agent.qTable.size).toBe(0)
    })

    it('MOVES exports [0, 1, 2]', () => {
        expect(MOVES).toEqual([0, 1, 2])
    })
})

describe('QLearningAgent.getQ', () => {
    it('returns 0 for unseen (state, action) pairs', () => {
        const agent = new QLearningAgent()
        expect(agent.getQ(STATE_A, 0)).toBe(0)
        expect(agent.getQ(STATE_A, 1)).toBe(0)
        expect(agent.getQ(STATE_A, 2)).toBe(0)
    })
})

describe('QLearningAgent.updateQ', () => {
    it('stores a Q-value after the first update', () => {
        const agent = new QLearningAgent()
        agent.updateQ(STATE_A, 1, 10, STATE_B)
        // Q-table should now contain exactly one entry
        expect(agent.qTable.size).toBe(1)
    })

    it('Bellman update is numerically correct', () => {
        // With α=1 the formula collapses to: reward + γ * maxQ(nextState)
        const agent = new QLearningAgent(1.0, 0.9, 0, 0, 1) // alpha=1, epsilon=0

        // Seed next-state Q-values
        agent.updateQ(STATE_B, 0, 5, STATE_A)  // Q(B,0)=5 (nextState Q all 0)
        agent.updateQ(STATE_B, 1, 3, STATE_A)  // Q(B,1)=3
        agent.updateQ(STATE_B, 2, 7, STATE_A)  // Q(B,2)=7  ← max

        // Now update Q(A,1) with reward=10, nextState=B
        // Expected: 10 + 0.9 * 7 = 16.3
        agent.updateQ(STATE_A, 1, 10, STATE_B)
        expect(agent.getQ(STATE_A, 1)).toBeCloseTo(16.3)
    })

    it('blends old Q-value with new estimate when alpha < 1', () => {
        const agent = new QLearningAgent(0.5, 0.9, 0, 0, 1) // alpha=0.5, epsilon=0

        // Manually set Q(A,0)=4 via an update with reward=4, all-zero next state
        agent.updateQ(STATE_A, 0, 4, STATE_B) // Q becomes 0.5*0 + 0.5*(4+0)=2
        agent.updateQ(STATE_A, 0, 4, STATE_B) // 0.5*2 + 0.5*(4+0)=3
        expect(agent.getQ(STATE_A, 0)).toBeCloseTo(3)
    })
})

describe('QLearningAgent.chooseAction', () => {
    it('always explores when epsilon=1', () => {
        const agent = new QLearningAgent(0.1, 0.9, 1.0)
        // With epsilon=1, Math.random() < 1 is always true → random action
        const actions = new Set()
        for (let i = 0; i < 100; i++) actions.add(agent.chooseAction(STATE_A))
        // All three actions should appear across 100 trials
        expect(actions.size).toBeGreaterThan(1)
    })

    it('always exploits when epsilon=0 and Q-values are distinct', () => {
        const agent = new QLearningAgent(1.0, 0.9, 0, 0, 1) // epsilon=0

        // Make action 2 clearly the best
        agent.updateQ(STATE_A, 0, 1, STATE_B)
        agent.updateQ(STATE_A, 1, 2, STATE_B)
        agent.updateQ(STATE_A, 2, 10, STATE_B)

        for (let i = 0; i < 20; i++) {
            expect(agent.chooseAction(STATE_A)).toBe(2)
        }
    })

    it('randomly breaks ties among best actions when epsilon=0', () => {
        const agent = new QLearningAgent(1.0, 0.9, 0, 0, 1) // epsilon=0

        // All Q-values remain 0 → three-way tie
        const actions = new Set()
        for (let i = 0; i < 300; i++) actions.add(agent.chooseAction(STATE_A))
        // All three valid moves should appear in the sample
        expect(actions).toContain(0)
        expect(actions).toContain(1)
        expect(actions).toContain(2)
    })

    it('returns a value from MOVES', () => {
        const agent = new QLearningAgent()
        for (let i = 0; i < 20; i++) {
            expect(MOVES).toContain(agent.chooseAction(STATE_A))
        }
    })
})

describe('QLearningAgent.decayEpsilon', () => {
    it('reduces epsilon by the decay factor', () => {
        const agent = new QLearningAgent(0.1, 0.9, 1.0, 0.0, 0.995)
        agent.decayEpsilon()
        expect(agent.epsilon).toBeCloseTo(0.995)
    })

    it('never goes below minEpsilon', () => {
        const agent = new QLearningAgent(0.1, 0.9, 0.001, 0.01, 0.995)
        agent.decayEpsilon()
        expect(agent.epsilon).toBe(0.01)
    })

    it('epsilon reaches minEpsilon and stays there', () => {
        const agent = new QLearningAgent(0.1, 0.9, 1.0, 0.05, 0.5)
        for (let i = 0; i < 100; i++) agent.decayEpsilon()
        expect(agent.epsilon).toBe(0.05)
    })
})
