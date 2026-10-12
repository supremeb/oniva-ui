import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { accent } from './accent.stylex';
import { colors } from './colors.stylex';
import { font } from './font.stylex';
import { motion } from './motion.stylex';
import { radius } from './radius.stylex';
import { shadow } from './shadow.stylex';
import { space } from './space.stylex';

const groups = { accent, colors, font, motion, radius, shadow, space };
const cssPath = resolve(__dirname, '../../dist/oniva-ui.css');

describe('stable public CSS variables', () => {
  it('every token key is a --oniva-* name and resolves to var(<same name>)', () => {
    for (const [group, vars] of Object.entries(groups)) {
      for (const [key, value] of Object.entries(vars as unknown as Record<string, string>)) {
        if (key.startsWith('__')) continue;
        expect(key, group).toMatch(/^--oniva-[a-z0-9-]+$/);
        expect(value).toBe(`var(${key})`);
      }
    }
  });

  // Needs `npm run build` first (CI order: build precedes nothing here, so skip when dist is absent).
  it.skipIf(!existsSync(cssPath))(
    'dist/oniva-ui.css defines every documented name verbatim',
    () => {
      const css = readFileSync(cssPath, 'utf8');
      for (const vars of Object.values(groups)) {
        for (const key of Object.keys(vars)) {
          if (key.startsWith('__')) continue;
          expect(css, key).toContain(`${key}:`);
        }
      }
      expect(css).toMatch(/--oniva-color-bg:#121212/); // dark theme overrides the same public name
      expect(css).toMatch(/--oniva-accent-500:#8e51ff/); // accent themes too
    },
  );
});
