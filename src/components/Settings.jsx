import { useRef } from 'react'

export default function Settings({ config, disabled, onChange }) {
    const lastValid = useRef({ ...config })

    function handleChange(field, min, max, e) {
        // fire only on commit (blur / Enter) via the 'change' event
        const value = parseInt(e.target.value, 10)
        if (!isNaN(value) && value >= min && value <= max) {
            lastValid.current[field] = value
            onChange(field, value)
        } else {
            e.target.value = lastValid.current[field]
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' || e.key === 'Escape') {
            e.stopPropagation()
            e.currentTarget.blur()
        }
    }

    return (
        <div id="settings-form">
            <label>
                Width:
                <input
                    type="number"
                    id="input-width"
                    defaultValue={config.width}
                    min={5} max={100}
                    disabled={disabled}
                    onChange={e => handleChange('width', 5, 100, e)}
                    onKeyDown={handleKeyDown}
                />
            </label>
            <label>
                Height:
                <input
                    type="number"
                    id="input-height"
                    defaultValue={config.height}
                    min={5} max={100}
                    disabled={disabled}
                    onChange={e => handleChange('height', 5, 100, e)}
                    onKeyDown={handleKeyDown}
                />
            </label>
            <label>
                Cell Size:
                <input
                    type="number"
                    id="input-cell"
                    defaultValue={config.cellSize}
                    min={5} max={50}
                    disabled={disabled}
                    onChange={e => handleChange('cellSize', 5, 50, e)}
                    onKeyDown={handleKeyDown}
                />
            </label>
        </div>
    )
}
