/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const fjRoot = path.resolve(dirname, '../../packages/fj-ui');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@fj$/, replacement: path.join(fjRoot, 'index.ts') },
      { find: /^@fj\//, replacement: fjRoot + '/' },
    ],
    dedupe: ['react', 'react-dom'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    globals: false,
  },
});
