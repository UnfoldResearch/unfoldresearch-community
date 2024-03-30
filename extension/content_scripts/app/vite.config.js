import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactPlugin(), cssInjectedByJsPlugin()],
  base: './',
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      output: {
        dir: 'build',
        entryFileNames: 'content-react.js',
        inlineDynamicImports: true,
      },
    },
  },
});
