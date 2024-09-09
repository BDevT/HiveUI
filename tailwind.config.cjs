const colors = require('tailwindcss/colors');
const svelte_ux = require('svelte-ux/plugins/tailwind.cjs');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,svelte}', './node_modules/svelte-ux/**/*.{svelte,js}'],
	theme: {
		extend: {
			colors: {
				primary: 'hsl(0 0% 20%)',
				'primary-dark': 'hsl(0 0% 15%)', // Slightly darker for hover states
				secondary: 'hsl(0 0% 40%)',
				'secondary-content': colors.white,
				accent: 'hsl(12.5153 79.5122% 59.8039%)', // Kept the accent color
				neutral: 'hsl(0 0% 13%)',
				'neutral-content': colors.gray[100],
				'surface-100': 'hsl(0 0% 10%)',
				'surface-200': 'hsl(0 0% 15%)',
				'surface-300': 'hsl(0 0% 20%)',
				'surface-content': colors.gray[100],
				info: 'hsl(200 100% 40%)',
				success: 'hsl(120 50% 50%)',
				warning: 'hsl(40 100% 50%)',
				danger: 'hsl(0 100% 40%)',
				'custom-blue': 'hsl(206 100% 16.9%)',	
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: [svelte_ux]
};

module.exports = config;