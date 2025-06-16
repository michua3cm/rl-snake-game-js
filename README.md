# Snake Game: Reinforcement Learning Agent

🔗 [Live demo](https://michua3cm.github.io/rl-snake-game-js/)

## Description

A reinforcement learning project where an agent learns to play Snake using Q-learning. This project explores environment design, reward shaping, and emergent behavior, with a focus on understanding how simple objectives can lead to structured optimal strategies.

### Abstract

Implemented Q-learning with manually constructed Q-table and epsilon-greedy policy to train an agent for the classic Snake game. Designed a custom epsilon decay schedule (multiplicative decay) to balance early-stage exploration and late-stage exploitation, and explored reward shaping techniques to encourage specific long-term behaviors.

### Motivation

The initial idea was simple and playful: I wanted to train an AI agent that could fill the entire game board with its own body — a perfectly self-playing snake. I was fascinated by the challenge of crafting a reward function that could guide such behavior from scratch. Could I shape incentives so that the agent would not just survive, but thrive — maximizing length, avoiding traps, and sweeping the board with precision?

But beneath that technical goal was a more personal one. My father, a retired civil engineer, has always been genuinely curious about artificial intelligence — not just *what* it does, but *how* it works. Though he has no formal background in programming or AI, he often asked me questions that cut straight to the heart of it: “What is AI really doing? How does it learn?” I wanted to give him an answer that didn’t rely on buzzwords or equations — something he could *see* and *feel* unfold. Watching a snake learn to grow, adapt, and eventually fill the board felt like the perfect metaphor: AI doesn’t follow preset rules — it learns through experience, through trial and error. This project became my way of turning abstract ideas into something alive and tangible, something we could share.

So this project became more than just a reinforcement learning experiment. It became a way to bridge two worlds — to show, not tell, what it means for a machine to learn.

## Project Structure

```text
snake-game-rl/
├── docs/
├── src/
│   ├── components/
│   │   ├── agents/
│   │   │   ├── dqn/
│   │   │   │   └── agent.js
│   │   │   └── q_learning/
│   │   │       └── agent.js
│   │   ├── snake_env/
│   │   │   ├── Game.js             ← Main game logic
│   │   │   ├── Snake.js
│   │   │   └── Food.js
│   │   ├── ui/
│   │   │   ├── GameManager.js      ← Bridge between logic and ui
│   │   │   ├── Board.js            ← Game grid rendering setup
│   │   │   ├── HUD.js
│   │   │   ├── Overlay.js
│   │   │   └── InputPanel.js
│   │   ├── GameManual.js           ← Snake game played manually
│   │   └── GameAI.js               ← Snake game played by AI
│   ├── styles/                     ← Game UI style
│   └── main.js                     ← Entry point
├── index.html
├── vite.config.js
├── README.md
└── LICENSE
```

## How To Use

This project uses [Node.js](https://nodejs.org/en) and Vite to serve and build the application.

### 1. Clone the repository

```bash
git clone https://github.com/michua3cm/rl-snake-game-js.git
cd rl-snake-game-js
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the local development server

```bash
npm run dev
```

### 4. Open your browser at

```bash
http://localhost:8888
```

## Technical Reflection

The initial goal was playful — to train a snake agent capable of filling the entire screen, maximizing length through self-play. However, after several iterations, I realized that the optimal policy under sparse rewards tends to converge not to a "greedy snake," but to a deterministic space-filling traversal.

This insight led me to explore concepts like Hamiltonian paths and how, in a fully known grid environment with deterministic transitions, the highest-reward policy often simplifies to a form of structured coverage. The project evolved from "learning to play Snake" to "learning how the environment structure dictates long-term optimality." This unexpected shift highlighted the limits of reward shaping and the importance of environment modeling.

The project was an invaluable experience in balancing exploration incentives, shaping rewards without leaking target behavior, and understanding how simple goals can lead to complex emergent strategies — or not.
