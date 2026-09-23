/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./index.html', './src/**/*.{js,jsx}'],
	theme: {
		extend: {
			colors: {
				paper: 'rgb(var(--color-paper) / <alpha-value>)',
				panel: 'rgb(var(--color-panel) / <alpha-value>)',
				ink: 'rgb(var(--color-ink) / <alpha-value>)',
				'ink-muted': 'rgb(var(--color-ink-muted) / <alpha-value>)',
				'ink-faint': 'rgb(var(--color-ink-faint) / <alpha-value>)',
				amber: {
					DEFAULT: '#E2A63B',
					dark: '#B9822A',
					light: '#F3D9A4',
				},
				blue: {
					DEFAULT: '#2E5579',
					dark: '#1E3F5B',
				},
				rust: {
					DEFAULT: '#B5563C',
					dark: '#8F412D',
				},
				line: 'rgb(var(--color-line) / <alpha-value>)',
			},
			fontFamily: {
				display: ['"Playfair Display"', 'Georgia', 'serif'],
				sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
			},
			borderRadius: {
				sm: '2px',
				DEFAULT: '3px',
			},
		},
	},
	plugins: [],
};
