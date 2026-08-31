import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // `mirador` resolves via `file:../mirador` to the sibling submodule, whose
    // package.json main/exports point only at dist/mirador.*.js — which
    // doesn't exist until that submodule is built. Redirect to its `./src`
    // export subpath so `npm test` works on a fresh clone without requiring
    // the sibling to be built first.
    alias: {
      mirador: 'mirador/src',
    },
  },
  test: {
    environment: 'jsdom',
    include: ['__tests__/**/*.test.tsx'],
  },
});
