export default function Board({ width, height, cellSize, snake, food }) {
    const cells = Array.from({ length: height * width }, (_, i) => {
        const x = i % width
        const y = Math.floor(i / width)

        const isHead = snake.length > 0 && snake[0].x === x && snake[0].y === y
        const isBody = !isHead && snake.some(s => s.x === x && s.y === y)
        const isFood = food && food.x === x && food.y === y

        let cls = 'cell'
        if (isHead) cls += ' head'
        else if (isBody) cls += ' snake'
        else if (isFood) cls += ' food'

        return <div key={i} className={cls} style={{ width: cellSize, height: cellSize }} />
    })

    return (
        <div
            id="board"
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
                gap: 0,
            }}
        >
            {cells}
        </div>
    )
}
