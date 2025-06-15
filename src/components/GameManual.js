import GameManager from './ui/GameManager.js';

export default function init() {
    const game = new GameManager({ manual: true });
    game.attachKeydownListener();

    return {
        game,
        destroy: () => {
            game.removeEvent?.(); // optional chaining in case destroy() doesn't exist
        }
    };
}