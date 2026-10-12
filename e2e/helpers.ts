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

/**
 * Finish finite animations (e.g. a streaming word mid blur-in) so axe sees the settled UI. Infinite loops keep
 * running. Streaming demos keep mounting new animated words, so repeat until two consecutive passes find nothing
 * left to finish (bounded), otherwise axe can catch a fresh word at partial opacity.
 */
export async function finishFiniteAnimations(page: Page): Promise<void> {
  let quiet = 0;
  for (let pass = 0; pass < 40 && quiet < 2; pass++) {
    const finished = await page.evaluate(() => {
      let n = 0;
      for (const a of document.getAnimations()) {
        const t = a.effect?.getComputedTiming();
        if (t && Number.isFinite(t.endTime as number) && a.playState !== 'finished') {
          a.finish();
          n++;
        }
      }
      return n;
    });
    quiet = finished === 0 ? quiet + 1 : 0;
    await page.waitForTimeout(60);
  }
}
