/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,jsx}'],
	theme: {
		extend: {
			colors: {
				paper: '#F6F4EF',
				panel: '#FFFDF9',
				ink: '#1E2433',
				'ink-muted': '#5B6472',
				'ink-faint': '#8A93A3',
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
				line: '#DAD5C8',
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
