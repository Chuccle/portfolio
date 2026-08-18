import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Every route is prerendered (see src/routes/+layout.ts) — plain
			// static output, deployed via vercel.json rather than
			// adapter-vercel, so there's no serverless function in the loop
			// for a site that has nothing dynamic to serve.
			adapter: adapter()
		})
	],
	build: {
		target: 'es2022',
		cssMinify: 'lightningcss'
	}
});
