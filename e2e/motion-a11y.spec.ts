import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { benign, collectErrors, discover, finishFiniteAnimations, type Entry } from './helpers';

// Covers the "Not verified" list of docs/reviews/loop5-live-motion-review.md: 390px width, dark theme,
// reduced motion, and hover/overlay interaction smoke. Per-page loops are sharded into separate tests so
// Playwright runs them in parallel workers.
const SHARDS = 4;
const shardOf = (all: Entry[], i: number) => all.filter((_, idx) => idx % SHARDS === i);
const shards = Array.from({ length: SHARDS }, (_, i) => i);
const TEMPLATES = ['dashboard', 'ai-chat', 'project-board', 'medical-report', 'settings'];

/**
 * Reduced-motion allowlist: animated properties tolerated under prefers-reduced-motion, as `<slug>:<property>`.
 * Empty on purpose. Add an entry only with a written justification (e.g. an essential, non-vestibular
 * indicator). Opacity/colour/etc. are always fine; only these vestibular-ish properties are checked.
 */
const REDUCED_MOTION_ALLOW: string[] = [];
const MOTION_PROPS = ['transform', 'translate', 'scale', 'rotate', 'filter'];

test.describe('mobile 390x844', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  async function overflow(page: Page): Promise<string | null> {
    return page.evaluate(() => {
      const root = document.documentElement;
      if (root.scrollWidth <= window.innerWidth + 1) return null;
      // scrollWidth already ignores content clipped by overflow-x:auto/hidden ancestors; list likely culprits.
      const clipped = (el: Element) => {
        for (let p = el.parentElement; p; p = p.parentElement) {
          const o = getComputedStyle(p).overflowX;
          if (o === 'auto' || o === 'hidden' || o === 'scroll' || o === 'clip') return true;
        }
        return false;
      };
      const bad = [...document.body.querySelectorAll('*')]
        .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1 && !clipped(el))
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.getAttribute('class') ?? '').slice(0, 40)}`);
      return `scrollWidth ${root.scrollWidth} > ${window.innerWidth}: ${bad.join(', ')}`;
    });
  }

  async function check(page: Page, route: string, failures: string[], errors: string[]) {
    errors.length = 0;
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
    await page.waitForTimeout(150);
    const o = await overflow(page);
    if (o) failures.push(`${route}: ${o}`);
    const bad = errors.filter((e) => !benign(e));
    if (bad.length) failures.push(`${route}: errors ${bad.join(' | ')}`);
  }

  test('home, templates and charts have no horizontal overflow', async ({ page }) => {
    const failures: string[] = [];
    const errors = collectErrors(page);
    for (const r of ['./#/', './#/charts', ...TEMPLATES.map((t) => `./#/templates/${t}`)]) {
      await check(page, r, failures, errors).catch((e: unknown) => failures.push(`${r}: ${String(e)}`));
    }
    expect(failures).toEqual([]);
  });

  for (const i of shards) {
    test(`component pages have no horizontal overflow (shard ${i + 1}/${SHARDS})`, async ({ page }) => {
      test.setTimeout(5 * 60_000);
      const failures: string[] = [];
      const errors = collectErrors(page);
      for (const { slug } of shardOf(await discover(page), i)) {
        await check(page, `./#/components/${slug}`, failures, errors).catch((e: unknown) =>
          failures.push(`${slug}: ${String(e)}`),
        );
      }
      expect(failures).toEqual([]);
    });
  }
});

test.describe('dark mode axe', () => {
  for (const i of shards) {
    test(`component pages: no serious/critical axe in dark (shard ${i + 1}/${SHARDS})`, async ({ page }) => {
      test.setTimeout(5 * 60_000);
      const entries = shardOf(await discover(page), i);
      // Docs theme mechanism: header toggle (light -> dark). Hash navigation keeps the SPA state.
      await page.getByTestId('theme-toggle').click();
      const root = page.locator('[data-oniva-theme]').first();
      await expect(root).toHaveAttribute('data-oniva-theme', 'dark');
      const failures: string[] = [];
      for (const { slug } of entries) {
        await page.goto(`./#/components/${slug}`);
        try {
          await expect(page.getByTestId('demo').first()).toBeVisible();
          await expect(root).toHaveAttribute('data-oniva-theme', 'dark');
        } catch {
          failures.push(`${slug}: did not render in dark`);
          continue;
        }
        await finishFiniteAnimations(page);
        const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
        for (const v of results.violations.filter((x) => x.impact === 'serious' || x.impact === 'critical')) {
          failures.push(`${slug}: axe ${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
        }
      }
      expect(failures).toEqual([]);
    });
  }
});

test.describe('reduced motion', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('motion duration tokens collapse to ~0.01ms', async ({ page }) => {
    await page.goto('./#/');
    const vals = await page.evaluate(() => {
      const els = [document.documentElement, document.querySelector('[data-oniva-theme]')].filter(
        (e): e is Element => !!e,
      );
      return els
        .map((e) => getComputedStyle(e).getPropertyValue('--oniva-motion-dur-base').trim())
        .filter(Boolean);
    });
    expect(vals.length).toBeGreaterThan(0);
    for (const v of vals) {
      const ms = v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000;
      expect(ms).toBeLessThanOrEqual(0.05);
    }
  });

  for (const i of shards) {
    test(`no transform/filter animations on component pages (shard ${i + 1}/${SHARDS})`, async ({ page }) => {
      test.setTimeout(5 * 60_000);
      const failures: string[] = [];
      for (const { slug } of shardOf(await discover(page), i)) {
        await page.goto(`./#/components/${slug}`);
        try {
          await expect(page.getByTestId('demo').first()).toBeVisible();
        } catch {
          failures.push(`${slug}: did not render`);
          continue;
        }
        await page.waitForTimeout(600);
        const found = await page.evaluate((props) => {
          const out: string[] = [];
          for (const a of document.getAnimations()) {
            if (a.playState !== 'running') continue;
            const eff = a.effect as KeyframeEffect | null;
            if (!eff || typeof eff.getKeyframes !== 'function') continue;
            const used = new Set<string>();
            for (const kf of eff.getKeyframes()) for (const k of Object.keys(kf)) if (props.includes(k)) used.add(k);
            if (!used.size) continue;
            const t = eff.target as Element | null;
            const name = (a as CSSAnimation).animationName ?? (a as CSSTransition).transitionProperty ?? 'waapi';
            out.push(`${[...used].join('+')} on ${t?.tagName.toLowerCase()} (${name})`);
          }
          return out;
        }, MOTION_PROPS);
        for (const f of found) {
          const prop = f.split(' ')[0] ?? '';
          if (prop.split('+').every((p) => REDUCED_MOTION_ALLOW.includes(`${slug}:${p}`))) continue;
          failures.push(`${slug}: ${f}`);
        }
      }
      expect(failures).toEqual([]);
    });
  }
});

test.describe('interaction motion smoke', () => {
  const firstDemo = (page: Page) => page.getByTestId('demo').first();

  test('Toast stacks, front is unscaled, hover expands without overlap', async ({ page }) => {
    await page.goto('./#/components/toast');
    // 'Add toast' lives in the "Stack playground" demo, not the first (Variants) demo.
    const add = page.getByRole('button', { name: 'Add toast' }).first();
    for (let n = 0; n < 3; n++) await add.click();
    const region = page.getByRole('region', { name: /notification/i });
    const slots = region.locator('[data-state="open"]');
    await expect(slots).toHaveCount(3);
    await page.waitForTimeout(600);
    const scaleOf = (loc: ReturnType<Page['locator']>) =>
      loc.evaluate((el) => {
        const t = getComputedStyle(el).transform;
        return t === 'none' ? 1 : new DOMMatrix(t).a;
      });
    expect(Math.abs((await scaleOf(region.locator('[data-front]').first())) - 1)).toBeLessThan(0.001);
    await region.locator('[data-front]').first().hover();
    await expect
      .poll(async () => {
        const boxes = (await slots.evaluateAll((els) => els.map((e) => e.getBoundingClientRect())))
          .map((r) => ({ top: r.top, bottom: r.bottom }))
          .sort((a, b) => a.top - b.top);
        return boxes.every((b, k) => k === 0 || boxes[k - 1]!.bottom <= b.top + 1);
      }, { timeout: 3000 })
      .toBe(true);
  });

  test('Tooltip opens after delay, adjacent to trigger', async ({ page }) => {
    await page.goto('./#/components/tooltip');
    const trigger = firstDemo(page).getByRole('button').first();
    const tip = page.getByRole('tooltip');
    // Re-enter the trigger on retry: React Aria arms its hover delay on pointerenter, which a single hover can
    // miss if it lands before the page's pointer handlers are attached (seen on CI; not reproducible locally).
    await expect(async () => {
      await page.mouse.move(1, 1);
      await trigger.hover();
      await expect(tip).toBeVisible({ timeout: 1500 });
    }).toPass({ timeout: 8000 });
    await page.waitForTimeout(300);
    const a = (await trigger.boundingBox())!;
    const b = (await tip.boundingBox())!;
    const gx = Math.max(0, a.x - (b.x + b.width), b.x - (a.x + a.width));
    const gy = Math.max(0, a.y - (b.y + b.height), b.y - (a.y + a.height));
    expect(gx > 0 || gy > 0, 'tooltip must not overlap trigger').toBe(true);
    expect(Math.hypot(gx, gy)).toBeLessThanOrEqual(16);
  });

  test('Drawer opens and closes with Escape', async ({ page }) => {
    await page.goto('./#/components/drawer');
    const trigger = firstDemo(page).getByRole('button').first();
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });

  test('Tabs indicator matches selected tab after click and resize', async ({ page }) => {
    await page.goto('./#/components/tabs');
    const list = firstDemo(page).getByRole('tablist').first();
    const indicator = list.locator('xpath=..').locator(':scope > span[aria-hidden="true"]').first();
    const matches = async () => {
      const t = (await list.getByRole('tab', { selected: true }).boundingBox())!;
      const i = (await indicator.boundingBox())!;
      return Math.max(Math.abs(t.x - i.x), Math.abs(t.width - i.width));
    };
    await list.getByRole('tab').nth(1).click();
    await expect(list.getByRole('tab').nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect.poll(matches, { timeout: 3000 }).toBeLessThanOrEqual(2);
    await page.setViewportSize({ width: 700, height: 800 });
    await expect.poll(matches, { timeout: 3000 }).toBeLessThanOrEqual(2);
    await list.getByRole('tab').nth(2).click();
    await expect.poll(matches, { timeout: 3000 }).toBeLessThanOrEqual(2);
  });
});
