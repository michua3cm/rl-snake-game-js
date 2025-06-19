import GameManager from './game_ui/GameManager.js';
import QLearningAgent from "./agents/q_learning/agent.js";

export default function init(config) {
    const FAST = 0;
    const SLOW = 20;
    let speed = SLOW;

    const env = new GameManager(config);
    const agent = new QLearningAgent();
    const episodes = 5000;
    let episode = 0;
    let cancelled = false;
    let paused = false;

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
        let stepCounter = 0;

        while (!env.game.isDone() && !cancelled) {
            if (paused) {
                await new Promise((resolve) => {
                    const wait = () => {
                        if (!paused) {
                            document.removeEventListener('resume-training', wait);
                            resolve();
                        }
                    };
                    document.addEventListener('resume-training', wait);
                })
            }

            const action = agent.chooseAction(state);
            const { nextState, reward } = env.step(action);
            agent.updateQ(state, action, reward, nextState);
            state = nextState;

            if (speed === SLOW)
                await new Promise((resolve) => setTimeout(resolve, speed));
            else {
                if (++stepCounter % 200 === 0)
                    await new Promise((resolve) => setTimeout(resolve, speed));
                else
                    await Promise.resolve();
            }
        }

        if (!cancelled) {
            // console.log(`Episode ${episode + 1}: Epsilon: ${agent.epsilon.toFixed(4)}, Score: ${env.game.getScore()}`);

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
            paused = false;
            QLearning();
        },
        pause: () => {
            paused = true;
        },
        resume: () => {
            if (paused) {
                paused = false;
                // Wake up the paused loop
                document.dispatchEvent(new Event('resume-training'));
            }
        },
        stop: () => {
            speed = SLOW;
            cancelled = true;
            paused = false;
            env.updateEpisode(episode);
            console.log('Training stopped.');
        },
        speedUp: () => {
            speed = FAST;
        },
        slowDown: () => {
            speed = SLOW;
        },
        destroy: () => {
            cancelled = true;
            document.removeEventListener("keydown", switchSpeed);
            env.removeEvent?.(); // clean up GameManager
        }
    };
}