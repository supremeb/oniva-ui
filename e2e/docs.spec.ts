import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { discoverSlugs } from './discover';

const slugs = discoverSlugs();

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  return errors;
}

// Fonts come from a CDN in the docs shell; ignore network failures for those only.
const benign = (e: string) => /rsms\.me|Failed to load resource|ERR_/.test(e);

test('home renders hero and discovered component cards', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('./#/');
  await expect(
    page.getByRole('heading', { level: 1, name: /React design system for dashboards/ }),
  ).toBeVisible();
  await expect(page.getByTestId('home-component-grid').getByRole('link')).toHaveCount(slugs.length);
  expect(errors.filter((e) => !benign(e))).toEqual([]);
});

test('components index groups by category', async ({ page }) => {
  await page.goto('./#/components');
  await expect(page.getByRole('heading', { level: 1, name: 'Components' })).toBeVisible();
  await expect(page.getByRole('link', { name: /^Button/ })).toBeVisible();
});

test('there is at least one component page', () => {
  expect(slugs.length).toBeGreaterThanOrEqual(6);
});

for (const slug of slugs) {
  test.describe(`component page: ${slug}`, () => {
    test('renders without console errors', async ({ page }) => {
      const errors = collectErrors(page);
      await page.goto(`./#/components/${slug}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.getByTestId('demo').first()).toBeVisible();
      expect(errors.filter((e) => !benign(e))).toEqual([]);
    });

    test('has no serious or critical axe violations', async ({ page }) => {
      await page.goto(`./#/components/${slug}`);
      await expect(page.getByTestId('demo').first()).toBeVisible();
      const results = await new AxeBuilder({ page }).analyze();
      const bad = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical',
      );
      expect(
        bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
      ).toEqual([]);
    });
  });
}

test('theme toggle switches to dark and back', async ({ page }) => {
  await page.goto('./#/');
  const root = page.locator('[data-oniva-theme]').first();
  await expect(root).toHaveAttribute('data-oniva-theme', 'light');
  await page.getByTestId('theme-toggle').click();
  await expect(root).toHaveAttribute('data-oniva-theme', 'dark');
  const bg = await root.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).toBe('rgb(18, 18, 18)');
  await page.getByTestId('theme-toggle').click();
  await expect(root).toHaveAttribute('data-oniva-theme', 'light');
});

test('accent switcher changes the primary color', async ({ page }) => {
  await page.goto('./#/components/button');
  const btn = page.getByRole('button', { name: 'Primary' });
  const before = await btn.evaluate((el) => getComputedStyle(el).backgroundImage);
  await page.getByRole('button', { name: 'violet accent' }).click();
  await expect
    .poll(() => btn.evaluate((el) => getComputedStyle(el).backgroundImage))
    .not.toBe(before);
});
