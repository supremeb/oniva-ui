import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

const here = path.dirname(fileURLToPath(import.meta.url));
const lib = path.resolve(here, '../../packages/oniva-ui/src');

// The docs consume the library FROM SOURCE so StyleX compiles lib + docs together.
export default defineConfig({
  // GitHub Pages serves under /oniva-ui/. The router is hash-based, so only assets care about base.
  base: process.env.BASE_PATH ?? '/',
  plugins: [
    stylex.vite({
      runtimeInjection: false,
      unstable_moduleResolution: { type: 'commonJS', rootDir: path.resolve(here, '../..') },
      // lets docs import tokens as '@oniva-tokens/colors.stylex' (compile-time resolvable)
      aliases: { '@oniva-tokens/*': [path.join(lib, 'tokens/*')] },
    }),
    react(),
  ],
  resolve: {
    alias: [
      { find: /^@oniva-tokens\/(.*)$/, replacement: path.join(lib, 'tokens/$1') },
      { find: /^oniva-ui$/, replacement: path.join(lib, 'index.ts') },
    ],
  },
  server: { port: 5173, fs: { allow: [path.resolve(here, '../..')] } },
  preview: { port: 4173, strictPort: true },
});
