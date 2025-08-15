import { defineConfig } from 'vite';
import { resolve } from 'path';

// need this to import shader files
import vitePluginString from 'vite-plugin-string';

export default defineConfig({
	server: { port: 3333 },
	// base: "./",
	plugins: [vitePluginString()],
	build: {
		chunkSizeWarningLimit: 600,
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				staging: resolve(__dirname, 'staging/default.html'),
			},
			output: {
				manualChunks: {
					three: ['three'],
				},
			},
		}
	}
});