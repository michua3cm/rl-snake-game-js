export default function ThemeToggle({ pref, onChange }) {
    const options = [
        { value: 'light', icon: 'light_mode', label: 'Light' },
        { value: 'system', icon: 'brightness_auto', label: 'Auto' },
        { value: 'dark', icon: 'dark_mode', label: 'Dark' },
    ]

    return (
        <div id="theme-toggle" className="join shadow-md">
            {options.map(({ value, icon, label }) => (
                <button
                    key={value}
                    id={`theme-btn-${value}`}
                    title={label}
                    className={`join-item btn btn-sm gap-1 ${pref === value ? 'btn-primary' : 'btn-ghost opacity-50'}`}
                    onClick={() => onChange(value)}
                >
                    <span className="material-icons text-base">{icon}</span>
                    <span className="hidden sm:inline text-xs">{label}</span>
                </button>
            ))}
        </div>
    )
}
