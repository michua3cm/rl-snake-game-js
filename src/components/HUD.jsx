export default function HUD({ score, highScore, episode, showEpisode }) {
    return (
        <div id="hud" className="flex flex-wrap gap-x-8 gap-y-2 bg-base-200 rounded-xl px-6 py-3 shadow-md text-sm font-semibold">
            <div id="high-score" className="flex items-center gap-2">
                High Score: <span id="high-score-value" className="text-success">{highScore}</span>
            </div>
            <div id="score" className="flex items-center gap-2">
                Score: <span id="score-value" className="text-warning">{score}</span>
            </div>
            {showEpisode && (
                <div id="episode" className="flex items-center gap-2">
                    Episode: <span id="episode-value" className="text-info">{episode}</span>
                </div>
            )}
        </div>
    )
}
