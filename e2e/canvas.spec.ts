import { expect, test, type Page } from '@playwright/test';
import { benign, collectErrors } from './helpers';

const camera = (page: Page) =>
  page.getByTestId('canvas-viewport').evaluate((el) => (el as HTMLElement).dataset.camera ?? '');

test('canvas mounts, searches, pans, fits and resets without console errors', async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto('./#/canvas');
  await expect(page.getByTestId('canvas-viewport')).toBeVisible();
  await expect(page.getByText(/\d+ components/)).toBeVisible();
  await expect(page.locator('[data-canvas-group]').first()).toBeVisible();

  // Only a bounded number of previews is ever live.
  expect(await page.locator('[data-canvas-group][data-mode="live"]').count()).toBeLessThanOrEqual(14);

  const start = await camera(page);
  await page.mouse.move(700, 40);
  await page.mouse.wheel(0, 200);
  await expect.poll(() => camera(page)).not.toBe(start);

  await page.getByRole('searchbox', { name: 'Search components' }).or(page.getByRole('textbox', { name: 'Search components' })).fill('data table');
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-canvas-group="data-table"]')).toBeVisible();

  await page.getByRole('button', { name: 'Fit all components' }).click();
  await expect.poll(() => camera(page)).toMatch(/,0\.0\d+$/);
  await page.getByRole('button', { name: 'Reset view' }).click();
  await expect.poll(() => camera(page)).toMatch(/,0\.600$/);

  expect(errors.filter((e) => !benign(e))).toEqual([]);
});
