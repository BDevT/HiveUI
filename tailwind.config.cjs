const colors = require('tailwindcss/colors');
const svelte_ux = require('svelte-ux/plugins/tailwind.cjs');

/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,svelte}', './node_modules/svelte-ux/**/*.{svelte,js}'],
	theme: {
		extend: {
			colors: {
				primary: colors.blue[500], // primary color for dark mode
				'primary-dark': colors.blue[600], // darker primary color for hover states
				secondary: colors.gray[700], // secondary color
				'secondary-content': colors.white, // secondary content color
				accent: colors.yellow[500], // accent color
				neutral: colors.black, // change neutral background to black
				'neutral-content': colors.gray[100], // neutral content
				'surface-100': colors.gray[900], // darker surface background
				'surface-200': colors.gray[800], // secondary surface background
				'surface-300': colors.gray[700], // tertiary surface background
				'surface-content': colors.gray[100] // surface content color
			}
		}
	},
	variants: {
		extend: {}
	},
	plugins: [svelte_ux]
};

module.exports = config;
