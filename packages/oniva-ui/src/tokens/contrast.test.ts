import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs script (shared with `node scripts/check-contrast.mjs`)
import { runContrastChecks } from '../../scripts/check-contrast.mjs';

interface Result {
  name: string;
  theme: string;
  accent: string;
  value: number;
  min: number;
  ok: boolean;
}

describe('token contrast (light/dark x 8 accents)', () => {
  const results = runContrastChecks() as Result[];

  it('evaluates the full matrix', () => {
    expect(results.length).toBeGreaterThan(1000);
  });

  it('every key pair meets its required ratio', () => {
    const failures = results
      .filter((r) => !r.ok)
      .map((r) => `${r.theme}/${r.accent} ${r.name}: ${r.value.toFixed(2)} < ${r.min}`);
    expect(failures).toEqual([]);
  });
});
