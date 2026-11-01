// Renders glyphs from src/icons/IconSet to a review sheet: each glyph large on the 18-unit grid with
// keylines, in outline, duo, fill and fill-duo, plus outline at 16 and 24px.
//
//   node --experimental-strip-types packages/oniva-ui/scripts/icon-sheet.mjs [--file arrows] [--only Check,X] [--out sheet.html] [--png sheet.png]
//
// --compact renders the 12-grid compact drawings (glyphs that have one) on the 12-unit grid.
// --file renders one glyph file (glyphs/<file>.ts) instead of all of them. --png needs Playwright's Chromium.
import { register } from 'node:module';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

register('./ts-resolve-hook.mjs', import.meta.url);

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};
const file = opt('file');
const only = opt('only')?.split(',').map((s) => s.trim());
const out = resolve(opt('out') ?? 'icon-sheet.html');
const png = opt('png');
const compact = args.includes('--compact');

const { createElement } = await import('react');
const { renderToStaticMarkup } = await import('react-dom/server');
const mod = await import(new URL(`../src/icons/IconSet/glyphs/${file ?? 'index'}.ts`, import.meta.url).href);

const glyphs = Object.entries(mod)
  .filter(([name, g]) => typeof g === 'function' && typeof g.parts === 'function' && name.endsWith('Icon'))
  .filter(([name]) => !only || only.includes(name.replace(/Icon$/, '')))
  .filter(([, g]) => !compact || typeof g.compactParts === 'function')
  .sort(([a], [b]) => a.localeCompare(b));

const G = compact ? 12 : 18;
const grid = (() => {
  const lines = [];
  for (let i = 0; i <= G; i++) {
    const w = i % (G / 2) === 0 ? 0.06 : 0.03;
    lines.push(`<path d="M${i} 0V${G}M0 ${i}H${G}" stroke="#9aa" stroke-width="${w}"/>`);
  }
  // keylines: live area, circle r7, square, landscape and portrait rects
  lines.push(
    compact
      ? '<rect x="1.5" y="1.5" width="9" height="9" fill="none" stroke="#e66" stroke-width="0.05"/><circle cx="6" cy="6" r="4.75" fill="none" stroke="#69c" stroke-width="0.05"/><rect x="1.75" y="1.75" width="8.5" height="8.5" rx="1.5" fill="none" stroke="#6b6" stroke-width="0.05"/>'
      : '<rect x="2" y="2" width="14" height="14" fill="none" stroke="#e66" stroke-width="0.05"/><circle cx="9" cy="9" r="7" fill="none" stroke="#69c" stroke-width="0.05"/><rect x="2.5" y="2.5" width="13" height="13" rx="2.5" fill="none" stroke="#6b6" stroke-width="0.05"/>',
  );
  return `<svg class="grid" viewBox="0 0 ${G} ${G}">${lines.join('')}</svg>`;
})();

const svg = (Glyph, variant, size) =>
  renderToStaticMarkup(createElement(Glyph, { variant, size, optical: compact ? 'compact' : 'regular' }));
const cells = glyphs
  .map(
    ([name, Gl]) => `<figure>
  <div class="row">${['outline', 'duo', 'fill', 'fill-duo']
    .map((v) => `<div class="big">${grid}${svg(Gl, v, 90)}</div>`)
    .join('')}</div>
  <div class="row small">${compact ? `${svg(Gl, 'outline', 12)}${svg(Gl, 'outline', 14)}${svg(Gl, 'fill', 12)}${svg(Gl, 'fill-duo', 12)}` : `${svg(Gl, 'outline', 16)}${svg(Gl, 'outline', 24)}${svg(Gl, 'duo', 24)}${svg(Gl, 'fill', 24)}${svg(Gl, 'fill-duo', 24)}`}</div>
  <figcaption>${name}</figcaption>
</figure>`,
  )
  .join('\n');

writeFileSync(
  out,
  `<!doctype html><meta charset="utf-8"><title>Icon sheet</title><style>
body{font:12px system-ui;margin:16px;background:#fff;color:#111}
main{display:grid;grid-template-columns:repeat(3,max-content);gap:18px 28px}
figure{margin:0}.row{display:flex;gap:6px;align-items:center}.small{gap:10px;margin-top:6px}
.big{position:relative;width:90px;height:90px;background:#f6f7f8}.big .grid{position:absolute;inset:0;width:90px;height:90px}
.big svg:not(.grid){position:relative}figcaption{margin-top:4px;font-weight:600}
</style><main>${cells}</main>`,
);
console.log(`icon-sheet: ${glyphs.length} glyphs -> ${out}`);

if (png) {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 800 }, deviceScaleFactor: 1 });
  await page.goto(`file://${out}`);
  await page.screenshot({ path: resolve(png), fullPage: true });
  await browser.close();
  console.log(`icon-sheet: png -> ${resolve(png)}`);
}
