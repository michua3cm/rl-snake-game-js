export default function HUD({ score, highScore, episode, showEpisode }) {
    return (
        <div id="hud">
            <div id="high-score">High Score: <span id="high-score-value">{highScore}</span></div>
            <div id="score">Score: <span id="score-value">{score}</span></div>
            {showEpisode && (
                <div id="episode">Episode: <span id="episode-value">{episode}</span></div>
            )}
        </div>
    )
}
