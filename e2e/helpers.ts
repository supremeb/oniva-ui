import { expect, type Page } from '@playwright/test';

export interface Entry {
  slug: string;
  category: string;
}

export function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

// Fonts come from a CDN in the docs shell; ignore network failures for those only.
export const benign = (e: string) => /rsms\.me|Failed to load resource|ERR_/.test(e);

/** Reads slugs + categories from the /components index (section h2 + card links), no hard-coded list. */
export async function discover(page: Page): Promise<Entry[]> {
  await page.goto('./#/components');
  await expect(page.getByRole('heading', { level: 1, name: 'Components' })).toBeVisible();
  const entries = await page.locator('main section[aria-labelledby^="cat-"], section[aria-labelledby^="cat-"]').evaluateAll((sections) =>
    sections.flatMap((s) => {
      const category = s.querySelector('h2')?.textContent?.trim() ?? 'unknown';
      return [...s.querySelectorAll('a[href*="/components/"]')].map((a) => ({
        category,
        slug: (a.getAttribute('href') ?? '').split('/components/')[1] ?? '',
      }));
    }),
  );
  return entries.filter((e) => e.slug);
}

/** Finish finite animations (e.g. a streaming word mid blur-in) so axe sees the settled UI. Infinite loops keep running. */
export async function finishFiniteAnimations(page: Page): Promise<void> {
  await page.evaluate(() => {
    for (const a of document.getAnimations()) {
      const t = a.effect?.getComputedTiming();
      if (t && Number.isFinite(t.endTime as number)) a.finish();
    }
  });
}
