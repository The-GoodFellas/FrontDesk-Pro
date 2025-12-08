import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
  ],
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '$lib': path.resolve('./src/lib'),
    }
  }
});