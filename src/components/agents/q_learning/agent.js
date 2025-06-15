export const MOVES = [0, 1, 2]; // Left, Forward, Right

export default class QLearningAgent {
    constructor(alpha = 0.1, gamma = 0.9, epsilon = 1.0, minEpsilon = 0.00, epsilonDecay = 0.995) {
        this.alpha = alpha;
        this.gamma = gamma;
        this.epsilon = epsilon;
        this.minEpsilon = minEpsilon;
        this.epsilonDecay = epsilonDecay;
        this.qTable = new Map();
    }

    getQ(state, action) {
        const key = JSON.stringify([...state, action]);
        const qValue = this.qTable.get(key);
        return !qValue ? 0 : qValue;
    }

    updateQ(state, action, reward, nextState) {
        const key = JSON.stringify([...state, action]);
        const currentQ = this.getQ(state, action);
        const maxQNext = Math.max(...MOVES.map((action) => this.getQ(nextState, action)));
        const newQ = (1 - this.alpha) * currentQ + this.alpha * (reward + this.gamma * maxQNext);
        this.qTable.set(key, newQ);
    }

    chooseAction(state) {
        if (Math.random() < this.epsilon) {
            return MOVES[Math.floor(Math.random() * MOVES.length)];
        } else {
            const actionsValues = MOVES.map((action) => this.getQ(state, action));
            const maxQ = Math.max(...actionsValues);
            const bestActions = MOVES.filter((action) => actionsValues[action] === maxQ);
            // If there are multiple best actions, randomly choose between best actions
            return bestActions[Math.floor(Math.random() * bestActions.length)];
        }
    }

    decayEpsilon() {
        this.epsilon = Math.max(this.minEpsilon, this.epsilon * this.epsilonDecay);
    }
}

