import GameManager from './ui/GameManager.js';
import QLearningAgent from "./agents/q_learning/agent.js";

export default function init() {
    const FAST = 0;
    const SLOW = 1;
    let speed = SLOW;

    const env = new GameManager();
    const agent = new QLearningAgent();
    const episodes = 5000;
    let episode = 0;
    let cancelled = false;

    function switchSpeed(event) {
        const key = event.keyCode;
        if (key === 32) {
            speed = speed === FAST ? SLOW : FAST;
        }
    }

    async function QLearning() {
        if (episode >= episodes || cancelled) {
            console.log("Training complete!");
            return;
        }

        let state = env.getState();

        while (!env.game.isDone() && !cancelled) {
            const action = agent.chooseAction(state);
            const { nextState, reward } = env.step(action);
            agent.updateQ(state, action, reward, nextState);
            state = nextState;

            if (speed === SLOW || episode % 100 === 0)
                await new Promise((resolve) => setTimeout(resolve, speed));
            else
                await Promise.resolve();
        }

        if (!cancelled) {
            console.log(`Episode ${episode + 1}: Epsilon: ${agent.epsilon.toFixed(4)}, Score: ${env.game.getScore()}`);

            agent.decayEpsilon();
            env.restartRound();
            env.updateEpisode(++episode);
            QLearning();
        }
    }

    // Listen for key presses
    document.addEventListener("keydown", switchSpeed);

    return {
        game: env,
        start: () => {
            episode = 0;
            cancelled = false;
            QLearning();
        },
        destroy: () => {
            cancelled = true;
            document.removeEventListener("keydown", switchSpeed);
            env.removeEvent?.(); // clean up GameManager
        }
    };
}