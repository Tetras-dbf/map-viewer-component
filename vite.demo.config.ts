import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
  base: process.env.GITHUB_PAGES ? `/${pkg.name.split('/').pop()}/` : '/',
  build: {
    emptyOutDir: true,
    outDir: fileURLToPath(new URL('./dist-demo', import.meta.url)),
    sourcemap: true,
  },
  plugins: [react()],
  root: fileURLToPath(new URL('./demo', import.meta.url)),
});
