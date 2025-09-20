import { defineConfig } from 'vitest/config';

export default defineConfig({
    css: {
        postcss: {
            plugins: [],
        },
    },
    test: {
        globals: true,
        environment: 'node',
        setupFiles: ['./tests/setup.ts'],
        testTimeout: 30000,
        css: false,
    },
});
