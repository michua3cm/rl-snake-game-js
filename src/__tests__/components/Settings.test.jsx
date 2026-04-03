import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import Settings from '../../components/Settings.jsx'

const defaultConfig = { width: 10, height: 10, cellSize: 20 }

function renderSettings(overrides = {}) {
    const onChange = vi.fn()
    const { container } = render(
        <Settings
            config={defaultConfig}
            disabled={false}
            onChange={onChange}
            {...overrides}
        />
    )
    return { container, onChange }
}

describe('Settings rendering', () => {
    it('renders width, height and cell-size inputs', () => {
        const { container } = renderSettings()
        expect(container.querySelector('#input-width')).toBeTruthy()
        expect(container.querySelector('#input-height')).toBeTruthy()
        expect(container.querySelector('#input-cell')).toBeTruthy()
    })

    it('inputs show config values as defaultValue', () => {
        const { container } = renderSettings()
        expect(container.querySelector('#input-width').value).toBe('10')
        expect(container.querySelector('#input-height').value).toBe('10')
        expect(container.querySelector('#input-cell').value).toBe('20')
    })

    it('all inputs are disabled when disabled=true', () => {
        const { container } = renderSettings({ disabled: true })
        expect(container.querySelector('#input-width').disabled).toBe(true)
        expect(container.querySelector('#input-height').disabled).toBe(true)
        expect(container.querySelector('#input-cell').disabled).toBe(true)
    })

    it('all inputs are enabled when disabled=false', () => {
        const { container } = renderSettings({ disabled: false })
        expect(container.querySelector('#input-width').disabled).toBe(false)
        expect(container.querySelector('#input-height').disabled).toBe(false)
        expect(container.querySelector('#input-cell').disabled).toBe(false)
    })
})

describe('Settings.handleChange — valid input', () => {
    it('calls onChange with correct field and value for width', () => {
        const { container, onChange } = renderSettings()
        const input = container.querySelector('#input-width')
        fireEvent.change(input, { target: { value: '15' } })
        expect(onChange).toHaveBeenCalledWith('width', 15)
    })

    it('calls onChange with correct field and value for height', () => {
        const { container, onChange } = renderSettings()
        fireEvent.change(container.querySelector('#input-height'), { target: { value: '20' } })
        expect(onChange).toHaveBeenCalledWith('height', 20)
    })

    it('calls onChange for cellSize', () => {
        const { container, onChange } = renderSettings()
        fireEvent.change(container.querySelector('#input-cell'), { target: { value: '30' } })
        expect(onChange).toHaveBeenCalledWith('cellSize', 30)
    })
})

describe('Settings.handleChange — invalid input', () => {
    it('does not call onChange when value is NaN', () => {
        const { container, onChange } = renderSettings()
        const input = container.querySelector('#input-width')
        fireEvent.change(input, { target: { value: 'abc' } })
        expect(onChange).not.toHaveBeenCalled()
    })

    it('does not call onChange when value is below minimum', () => {
        const { container, onChange } = renderSettings()
        fireEvent.change(container.querySelector('#input-width'), { target: { value: '2' } })
        expect(onChange).not.toHaveBeenCalled()
    })

    it('does not call onChange when value exceeds maximum', () => {
        const { container, onChange } = renderSettings()
        fireEvent.change(container.querySelector('#input-width'), { target: { value: '200' } })
        expect(onChange).not.toHaveBeenCalled()
    })

    it('reverts input to last valid value when invalid', () => {
        const { container } = renderSettings()
        const input = container.querySelector('#input-width')
        // First a valid commit
        fireEvent.change(input, { target: { value: '20' } })
        // Then an invalid one
        fireEvent.change(input, { target: { value: 'xyz' } })
        expect(input.value).toBe('20')
    })
})

describe('Settings.handleKeyDown', () => {
    it('blurs input when Enter is pressed', () => {
        const { container } = renderSettings()
        const input = container.querySelector('#input-width')
        const blurSpy = vi.spyOn(input, 'blur')
        fireEvent.keyDown(input, { key: 'Enter' })
        expect(blurSpy).toHaveBeenCalled()
    })

    it('blurs input when Escape is pressed', () => {
        const { container } = renderSettings()
        const input = container.querySelector('#input-width')
        const blurSpy = vi.spyOn(input, 'blur')
        fireEvent.keyDown(input, { key: 'Escape' })
        expect(blurSpy).toHaveBeenCalled()
    })
})
