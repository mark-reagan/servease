import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

function getInitialTheme() {
	if (typeof window === 'undefined') return 'light';
	const stored = window.localStorage.getItem('theme');
	if (stored === 'light' || stored === 'dark') return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? 'dark'
		: 'light';
}

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(getInitialTheme);

	useEffect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark');
		window.localStorage.setItem('theme', theme);
	}, [theme]);

	function toggleTheme() {
		setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
}
