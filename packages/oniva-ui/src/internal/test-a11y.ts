import axe from 'axe-core';
import { expect } from 'vitest';

/**
 * Runs axe-core (wcag2a/2aa + best-practice) on `container` and fails on any violation.
 * color-contrast is disabled: jsdom has no layout/computed colors (covered by e2e instead).
 * For overlays pass `document.body` (portals render outside the render container).
 */
export async function expectNoA11yViolations(container: Element = document.body): Promise<void> {
  const results = await axe.run(container, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'best-practice'] },
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  });
  const summary = results.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`,
  );
  expect(summary, `a11y violations:\n${summary.join('\n')}`).toEqual([]);
}
