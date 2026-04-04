import { useState, useEffect } from 'react'

const STORAGE_KEY = 'theme-pref'
const DARK_THEME = 'night'
const LIGHT_THEME = 'light'

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? DARK_THEME
        : LIGHT_THEME
}

function applyTheme(pref) {
    const theme = pref === 'system' ? getSystemTheme() : pref === 'dark' ? DARK_THEME : LIGHT_THEME
    document.documentElement.setAttribute('data-theme', theme)
}

export default function useTheme() {
    const [pref, setPrefState] = useState(() => {
        return localStorage.getItem(STORAGE_KEY) ?? 'system'
    })

    useEffect(() => {
        applyTheme(pref)
    }, [pref])

    // Listen for OS-level changes when in system mode
    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)')
        function handleChange() {
            if (pref === 'system') applyTheme('system')
        }
        mq.addEventListener('change', handleChange)
        return () => mq.removeEventListener('change', handleChange)
    }, [pref])

    function setPref(newPref) {
        localStorage.setItem(STORAGE_KEY, newPref)
        setPrefState(newPref)
    }

    return [pref, setPref]
}
