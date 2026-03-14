import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		include: ['src/**/*.test.{ts,tsx}'],
		exclude: ['**/node_modules/**', '**/dist/**'],
		globals: true,
		watch: false,
		pool: 'threads',
		environment: 'node',
		coverage: {
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'dist/',
				'test/',
				'**/*.d.ts',
				'**/*.config.*',
				'**/mockups/**',
			],
		},
	},
});

