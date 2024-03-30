import { defineConfig } from 'vite';
import reactPlugin from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactPlugin(), cssInjectedByJsPlugin()],
  build: {
    rollupOptions: {
      output: {
        dir: 'build',
        entryFileNames: 'popup.js',
        sourcemap: true,
      },
    },
  },
});
