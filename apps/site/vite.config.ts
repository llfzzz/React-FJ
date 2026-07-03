/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const fjRoot = path.resolve(dirname, '../../packages/fj-ui');
const fjEffectsRoot = path.resolve(dirname, '../../packages/fj-effects');

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Order matters: match the longer @fj-effects prefixes before @fj.
      { find: /^@fj-effects$/, replacement: path.join(fjEffectsRoot, 'index.ts') },
      { find: /^@fj-effects\//, replacement: fjEffectsRoot + '/' },
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
