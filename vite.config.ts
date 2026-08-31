import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'node:url';
import pkg from './package.json' with { type: 'json' };

const peers = Object.keys(pkg.peerDependencies ?? {});

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      fileName: (format) => `map-viewer-component.${format}.js`,
      formats: ['es', 'cjs'],
      name: 'MapViewerComponent',
    },
    rollupOptions: {
      external: [
        ...peers,
        /^react(\/.*)?$/,
        /^react-dom(\/.*)?$/,
        /^mirador(\/.*)?$/,
      ],
      output: {
        exports: 'named',
        globals: { react: 'React', 'react-dom': 'ReactDOM', mirador: 'Mirador' },
      },
    },
    sourcemap: true,
  },
  plugins: [react(), dts({ include: ['src'], rollupTypes: true })],
  server: {
    open: '/demo/index.html',
    port: 4445,
  },
});
