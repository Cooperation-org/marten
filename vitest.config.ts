import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'node',
		globals: true,
		testTimeout: 10000
	},
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, './src/lib')
		}
	}
});
