import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/**/*.test.ts', 'apps/api/src/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'apps/web', 'apps/mobile'],
  },
  resolve: {
    alias: {
      '@agrodata/types': path.resolve(__dirname, 'packages/types/src/index.ts'),
    },
  },
});
