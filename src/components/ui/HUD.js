/**
 * HUD (Heads-Up Display) component for displaying game information.
 */
export default class HUD {
    /**
     * Creates an instance of HUD.
     */
    constructor() {
        this.highScoreValue = document.getElementById('high-score-value');
        this.scoreValue = document.getElementById('score-value');
        this.episode = document.getElementById('episode');
        this.episodeValue = document.getElementById('episode-value');
    }

    /**
     * Updates the score display in the HUD.
     * 
     * @param {number} score - The current score to display.
     */
    updateScore(score) {
        this.scoreValue.textContent = score;
    }

    /**
     * Updates the highest score display in the HUD.
     * 
     * @param {number} score - The highest score to display.
     */
    updateHighestScore(score) {
        this.highScoreValue.textContent = score;
    }

    /**
     * Updates the episode display in the HUD.
     * 
     * @param {number} episode - The current episode number to display.
     */
    updateEpisode(episode) {
        this.episodeValue.textContent = episode;
    }

    /**
     * Shows the episode display.
     */
    showEpisode() {
        this.episode.style.display = '';
    }

    /**
     * Hides the episode display.
     */
    hideEpisode() {
        this.episode.style.display = 'none';
    }
}