import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import stylex from '@stylexjs/unplugin';

// StyleX must be compiled in tests too: stylex.create/defineVars throw if left uncompiled.
// The unplugin runs as a normal Vite plugin under Vitest, so tests use the real compiled output.
export default defineConfig({
  plugins: [stylex.vite({ runtimeInjection: true }), react()],
  test: {
    environment: 'jsdom',
    globals: false,
    setupFiles: ['packages/oniva-ui/src/test/setup.ts'],
    include: ['packages/**/*.test.{ts,tsx}', 'apps/**/*.test.{ts,tsx}'],
    css: false,
  },
});
