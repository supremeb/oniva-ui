import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { benign, collectErrors, discover, finishFiniteAnimations } from './helpers';

test('home renders hero and a card per discovered component', async ({ page }) => {
  const errors = collectErrors(page);
  const entries = await discover(page);
  expect(entries.length).toBeGreaterThanOrEqual(6);
  await page.goto('./#/');
  await expect(
    page.getByRole('heading', { level: 1, name: /React design system for dashboards/ }),
  ).toBeVisible();
  await expect(page.getByTestId('home-component-grid').getByRole('link')).toHaveCount(entries.length);
  expect(errors.filter((e) => !benign(e))).toEqual([]);
});

test('every component page: no errors, no serious/critical axe; screenshot per category', async ({
  page,
}, testInfo) => {
  test.setTimeout(10 * 60_000);
  const entries = await discover(page);
  const shot = new Set<string>();
  const failures: string[] = [];
  const errors = collectErrors(page);
  for (const { slug, category } of entries) {
    errors.length = 0;
    await page.goto(`./#/components/${slug}`);
    try {
      // .first(): block demos (e.g. hero) render their own h1 next to the page title
      await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
      await expect(page.getByTestId('demo').first()).toBeVisible();
    } catch {
      failures.push(`${slug}: page did not render`);
      continue;
    }
    const bad = errors.filter((e) => !benign(e));
    if (bad.length) failures.push(`${slug}: console/page errors: ${bad.join(' | ')}`);
    // Motion geometry guard: anything spinning via a rotate() keyframe must pivot on its true centre
    // (square box, origin at 50% 50%). Catches the "spinner orbits / drifts out of place" class of bug.
    const offCentre = await page.evaluate(() => {
      const out: string[] = [];
      for (const a of document.getAnimations()) {
        const el = (a.effect as KeyframeEffect | null)?.target;
        if (!(el instanceof Element)) continue;
        const kf = (a.effect as KeyframeEffect).getKeyframes();
        if (!kf.some((k) => /rotate\(/.test(String(k.transform ?? '')))) continue;
        if (kf.some((k) => /translate/.test(String(k.transform ?? '')))) continue; // positioned orbit rings
        const cs = getComputedStyle(el);
        const w = parseFloat(cs.width);
        const h = parseFloat(cs.height);
        const [ox = NaN, oy = NaN] = cs.transformOrigin.split(' ').map(parseFloat);
        if (!w || !h) continue;
        if (Math.abs(w - h) > 1 || Math.abs(ox - w / 2) > 1 || Math.abs(oy - h / 2) > 1) {
          out.push(`${el.tagName.toLowerCase()} ${w}x${h} origin ${cs.transformOrigin}`);
        }
      }
      return out;
    });
    if (offCentre.length) failures.push(`${slug}: off-centre rotation: ${offCentre.join(' | ')}`);
    // Audit settled UI: finish finite enter animations (e.g. a streaming word mid blur-in at partial opacity)
    // so axe doesn't flag transient contrast. Infinite loops (spinners, shimmer) are left running.
    await finishFiniteAnimations(page);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    for (const v of results.violations.filter((x) => x.impact === 'serious' || x.impact === 'critical')) {
      failures.push(`${slug}: axe ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
    }
    if (!shot.has(category)) {
      shot.add(category);
      const path = testInfo.outputPath(`category-${category.toLowerCase().replace(/\W+/g, '-')}-${slug}.png`);
      await page.screenshot({ path, fullPage: true });
      await testInfo.attach(`category-${category}`, { path, contentType: 'image/png' });
    }
  }
  expect(failures).toEqual([]);
});

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

test.describe('keyboard smoke', () => {
  const firstDemoButton = (page: Page, name?: RegExp) =>
    page.getByTestId('demo').first().getByRole('button', name ? { name } : undefined).first();

  test('Dialog opens with Enter, labelled, Escape closes and restores focus', async ({ page }) => {
    await page.goto('./#/components/dialog');
    const trigger = firstDemoButton(page, /Invite teammate/);
    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName(/.+/);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('DropdownMenu opens, arrows move, Escape closes', async ({ page }) => {
    await page.goto('./#/components/dropdown-menu');
    const trigger = firstDemoButton(page);
    await trigger.focus();
    await page.keyboard.press('Enter');
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await expect(menu.getByRole('menuitem').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('Select opens, ArrowDown + Enter changes value', async ({ page }) => {
    await page.goto('./#/components/select');
    const trigger = firstDemoButton(page);
    const before = await trigger.textContent();
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('listbox')).toBeVisible();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('listbox')).toBeHidden();
    await expect(trigger).not.toHaveText(before ?? '');
  });

  test('Tabs: arrow keys move selection', async ({ page }) => {
    await page.goto('./#/components/tabs');
    const tabs = page.getByTestId('demo').first().getByRole('tab');
    await tabs.first().focus();
    await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel').first()).toBeVisible();
  });

  test('CommandPalette: ⌘K / Ctrl+K opens, Escape closes', async ({ page }) => {
    await page.goto('./#/components/command-palette');
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    await page.keyboard.press('ControlOrMeta+k');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('combobox').or(dialog.getByRole('searchbox'))).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('Toast: triggering shows a toast in the notifications region', async ({ page }) => {
    await page.goto('./#/components/toast');
    const trigger = firstDemoButton(page);
    await trigger.focus();
    await page.keyboard.press('Enter');
    // The region itself is a zero-height fixed container (toasts are absolutely positioned inside it), so
    // Playwright reports it hidden; assert on the rendered toast within it instead.
    const region = page.getByRole('region', { name: /notification/i });
    await expect(region).toBeAttached();
    await expect(region.locator('[data-state="open"]').first()).toBeVisible();
  });
});
