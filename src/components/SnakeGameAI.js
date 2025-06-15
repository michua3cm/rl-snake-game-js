import { SnakeGame } from "./snake_env/Snake.js";
import { QLearningAgent } from "./agents/q_learning/agent.js";

const board = document.getElementById("board");

const ctx = canvas.getContext("2d");

const cell = 20;    // Cell size
const width = Math.floor(canvas.width / cell);
const height = Math.floor(canvas.height / cell);

const FAST = 0;
const SLOW = 50;
let renderEnabled = true;
let speed = renderEnabled ? SLOW : FAST;

// Listen for key presses
document.addEventListener("keydown", switchSpeed);

function switchSpeed(event) {
    const key = event.keyCode;
    if (key === 32) {
        renderEnabled = !renderEnabled;
        speed = renderEnabled ? SLOW : FAST;
    }
}

const env = new SnakeGame(width, height);
const agent = new QLearningAgent();
const episodes = 5000;
let episode = 0;
let total = 0;

export default async function QLearning() {
    if (episode >= episodes) {
        console.log("Training complete!");
        return;
    }

    let state = env.reset();
    let totalReward = 0;
    let totalScore = 0;
    let reachTail = false;

    while (!env.done) {
        if (renderEnabled)
            draw(env.snake, env.food, env.score);

        const action = agent.chooseAction(state);
        const { nextState, reward, score, canReachTail } = env.step(action);
        agent.updateQ(state, action, reward, nextState);
        state = nextState;
        totalReward += reward;
        totalScore = score;
        reachTail = canReachTail;

        if (speed === SLOW || episode % 100 === 0)
            await new Promise((resolve) => setTimeout(resolve, speed));
        else
            await Promise.resolve();
    }

    console.log(`Episode ${episode + 1}: Total Reward: ${totalReward}, Epsilon: ${agent.epsilon.toFixed(4)}, Score: ${totalScore}, ReachTail: ${reachTail}`);

    agent.decayEpsilon();
    episode++;
    if (renderEnabled)
        gameOver();

    // Continue training next episode
    Promise.resolve().then(QLearning);
}


// Draw everything on canvas
function draw(snake, food, score) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width * cell, height * cell);

    // Draw snake
    ctx.fillStyle = "green";
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * cell, snake[i].y * cell, cell, cell);
    }

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * cell, food.y * cell, cell, cell);

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function gameOver() {
    ctx.clearRect(0, 0, width * cell, height * cell); // Wipe canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width * cell, height * cell); // Redraw background
}



