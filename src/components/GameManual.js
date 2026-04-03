import GameManager from './game_ui/GameManager.js';

export default function init(config, { onPlay, onIdle } = {}) {
    const game = new GameManager({ ...config, manual: true, onPlay, onIdle });
    game.attachKeydownListener();

    return {
        game,
        destroy: () => {
            game.removeEvent?.(); // optional chaining in case destroy() doesn't exist
        }
    };
}
