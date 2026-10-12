import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

export default defineConfig({
  plugins: [
    stylex.vite({
      runtimeInjection: false,
      // wrap atomic CSS in cascade layers so app CSS can override predictably
      useCSSLayers: true,
      lightningcssOptions: { minify: true },
    }),
    react(),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'oniva-ui',
    },
    cssCodeSplit: false,
    sourcemap: true,
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react-aria',
        'react-aria-components',
        'lucide-react',
        /^@stylexjs\/stylex/,
        /^d3-/,
        /^@tanstack\//,
      ],
    },
  },
});
