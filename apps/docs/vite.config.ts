import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

const here = path.dirname(fileURLToPath(import.meta.url));
const lib = path.resolve(here, '../../packages/oniva-ui/src');

// Real counts for index.html meta tags, from the library source (never hard-code them).
// Groups match scripts/gen-index.mjs; illustrations are disabled. Chart helpers are not counted as charts.
function libCounts() {
  const groups = ['components', 'charts', 'ai', 'widgets', 'motion', 'blocks', 'screens'];
  const dirs = (g: string) =>
    fs.existsSync(path.join(lib, g))
      ? fs.readdirSync(path.join(lib, g), { withFileTypes: true })
          .filter((d) => d.isDirectory() && fs.existsSync(path.join(lib, g, d.name, 'index.ts')))
          .map((d) => d.name)
      : [];
  const helpers = ['ChartCard', 'ChartLegend', 'ChartTooltip'];
  return {
    TOTAL: groups.reduce((n, g) => n + dirs(g).length, 0),
    CHARTS: dirs('charts').filter((d) => !helpers.includes(d)).length,
    AI: dirs('ai').length,
    SCREENS: dirs('screens').length,
  };
}

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
    {
      name: 'oniva-meta-counts',
      transformIndexHtml(html: string) {
        const c = libCounts();
        return html.replace(/%ONIVA_(TOTAL|CHARTS|AI|SCREENS)%/g, (_m, k: keyof typeof c) => String(c[k]));
      },
    },
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
