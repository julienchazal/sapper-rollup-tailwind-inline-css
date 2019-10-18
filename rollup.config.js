import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import svgicons from 'rollup-plugin-svg-icons'

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const legacy = !!process.env.SAPPER_LEGACY_BUILD;
const tailwind = require("./tailwind.js");
const purgecss = require('@fullhuman/postcss-purgecss')({

	// Specify the paths to all of the template files in your project
	content: [
		'./src/**/*.html',
		'./src/**/*.svelte'
	],

	// Include any special characters you're using in this regular expression
	defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

const preprocessDev = sveltePreprocess({
	postcss: {
		plugins: [
			require("tailwindcss")(tailwind),
			require('postcss-preset-env')({
				/* use stage 3 features + css nesting rules */
				stage: 3,
				features: {
					'nesting-rules': true
				}
			}),
		]
	}
});
const preprocessProd = sveltePreprocess({
	postcss: {
		plugins: [
			require("tailwindcss")(tailwind),
			require('postcss-preset-env'),
			purgecss
		]
	}
});

let preprocess = dev ? preprocessDev : preprocessProd;

const onwarn = (warning, onwarn) => (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning);
const dedupe = importee => importee === 'svelte' || importee.startsWith('svelte/');

export default {
	client: {
		input: config.client.input(),
		output: config.client.output(),
		plugins: [
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			// svgicons({
			// 	inputFolder: 'src/icons',
			// 	output: 'src/components/SpriteSvg.svelte',
			// 	// by default svgo is disabled, to turn it on - pass config object (or just empty object)
			// 	svgo: {
			// 		removeDoctype: true
			// 	}
			// }),
			svelte({
                preprocess,
                emitCss: false,
				dev,
				hydratable: true
			}),
			resolve({
				browser: true,
				dedupe
			}),
			commonjs(),
			legacy && babel({
				extensions: ['.js', '.mjs', '.html', '.svelte'],
				runtimeHelpers: true,
				exclude: ['node_modules/@babel/**'],
				presets: [
					['@babel/preset-env', {
						targets: '> 0.25%, not dead'
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					['@babel/plugin-transform-runtime', {
						useESModules: true
					}]
				]
			}),
			!dev && terser({
				module: true
			})
		],

		onwarn,
	},

	server: {
		input: config.server.input(),
		output: config.server.output(),
		plugins: [
			replace({
				'process.browser': false,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			svelte({
				preprocess,
				generate: 'ssr',
				emitCss: false,
				dev
			}),
			resolve({
				dedupe
			}),
			commonjs()
		],
		external: Object.keys(pkg.dependencies).concat(
			require('module').builtinModules || Object.keys(process.binding('natives'))
		),

		onwarn,
	},

	serviceworker: {
		input: config.serviceworker.input(),
		output: config.serviceworker.output(),
		plugins: [
			resolve(),
			replace({
				'process.browser': true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			commonjs(),
			!dev && terser()
		],

		onwarn,
	}
};
