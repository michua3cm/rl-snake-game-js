import GameManager from './game_ui/GameManager.js';

export default function init(config) {
    const game = new GameManager({ ...config, manual: true });
    game.attachKeydownListener();

    return {
        game,
        destroy: () => {
            game.removeEvent?.(); // optional chaining in case destroy() doesn't exist
        }
    };
}