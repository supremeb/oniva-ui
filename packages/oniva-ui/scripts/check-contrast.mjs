#!/usr/bin/env node
// Contrast regression check. Reads the token SOURCE values (tokens/colors.stylex.ts,
// themes/themes.ts) for light/dark x 8 accents and asserts the key pairs.
//   node scripts/check-contrast.mjs        -> prints failures, exit 1 if any
//   import { runContrastChecks }            -> used by src/tokens/contrast.test.ts
// WCAG 2.x relative luminance. Translucent tokens are composited over the surface they sit on.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = (p) => readFileSync(join(here, '..', 'src', p), 'utf8');

// ---------- parsing ----------
function block(text, startRe) {
  const m = startRe.exec(text);
  if (!m) throw new Error(`block not found: ${startRe}`);
  let i = text.indexOf('{', m.index + m[0].length - 1);
  const start = i;
  let depth = 0;
  for (; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}' && --depth === 0) return text.slice(start + 1, i);
  }
  throw new Error('unbalanced');
}
function entries(body) {
  const out = {};
  for (const m of body.matchAll(/'(--oniva-[a-z0-9-]+)':\s*(?:'([^']*)'|(accent\['(--oniva-accent-[a-z0-9-]+)'\])|(`[^`]*`))/g)) {
    out[m[1]] = m[2] !== undefined ? { lit: m[2] } : m[4] ? { ref: m[4] } : { tpl: m[5] };
  }
  return out;
}
const colorsSrc = src('tokens/colors.stylex.ts');
const themesSrc = src('themes/themes.ts');
const accentSrc = src('tokens/accent.stylex.ts');
const lightRaw = entries(block(colorsSrc, /stylex\.defineVars\(\{/));
const darkRaw = entries(block(themesSrc, /export const darkTheme = stylex\.createTheme\(colors, \{/));
const accentDefaults = entries(block(accentSrc, /stylex\.defineVars\(\{/));
export const ACCENTS = ['Blue', 'Violet', 'Pink', 'Red', 'Amber', 'Emerald', 'Cyan', 'Indigo'];
const accentRaw = Object.fromEntries(
  ACCENTS.map((n) => [
    n.toLowerCase(),
    entries(block(themesSrc, new RegExp(`export const accent${n} = stylex\\.createTheme\\(accent, \\{`))),
  ]),
);

// ---------- color math ----------
export const hexToRgba = (h) => {
  let s = h.replace('#', '');
  if (s.length === 3) s = [...s].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)).concat(s.length === 8 ? parseInt(s.slice(6, 8), 16) / 255 : 1);
};
const parse = (v) => {
  if (v.startsWith('#')) return hexToRgba(v);
  const m = /rgba?\(([^)]+)\)/.exec(v);
  if (!m) throw new Error(`unparseable color: ${v}`);
  const p = m[1].split(',').map((x) => parseFloat(x));
  return [p[0], p[1], p[2], p[3] ?? 1];
};
const over = (fg, bg) => [0, 1, 2].map((i) => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1);
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const x = lum(a);
  const y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const MATRIX = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};
const oklab = (l, m_, s_) => {
  const [r, g, b] = [l, m_, s_];
  const L = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const M = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const S = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * L + 0.793617785 * M - 0.0040720468 * S, 1.9779984951 * L - 2.428592205 * M + 0.4505937099 * S, 0.0259040371 * L + 0.7827717662 * M - 0.808675766 * S];
};
const simulate = (rgb, type) => {
  const c = rgb.slice(0, 3).map(lin);
  const m = type ? MATRIX[type] : null;
  const o = m ? m.map((r) => Math.min(1, Math.max(0, r[0] * c[0] + r[1] * c[1] + r[2] * c[2]))) : c;
  return oklab(...o);
};
export const deltaE = (a, b, type) => {
  const x = simulate(a, type);
  const y = simulate(b, type);
  return 100 * Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
};

// ---------- token resolution ----------
function resolver(mode, accentName) {
  const ramp = { ...accentDefaults, ...accentRaw[accentName] };
  const accentVal = (k) => parse(ramp[k].lit);
  const cache = {};
  const raw = (k) => (mode === 'dark' && darkRaw[k] ? darkRaw[k] : lightRaw[k]);
  const get = (k, over_bg) => {
    const t = raw(k);
    if (!t) throw new Error(`unknown token ${k}`);
    let v;
    if (t.lit !== undefined) v = parse(t.lit);
    else if (t.ref) v = accentVal(t.ref);
    else throw new Error(`token ${k} is a template; add it to a check explicitly`);
    return v[3] < 1 && over_bg ? over(v, over_bg) : v;
  };
  const tok = (k, bg) => (cache[k + (bg ? bg.join() : '')] ??= get(k, bg));
  tok.accent = (k) => accentVal(k);
  return tok;
}

// ---------- the checks ----------
export function runContrastChecks() {
  const results = [];
  const add = (name, theme, accent, value, min) => results.push({ name, theme, accent, value, min, ok: value + 1e-9 >= min });
  for (const mode of ['light', 'dark']) {
    for (const accent of ACCENTS.map((a) => a.toLowerCase())) {
      const T = resolver(mode, accent);
      const th = mode;
      const bg = T('--oniva-color-bg');
      const surface = T('--oniva-color-surface');
      const inset = T('--oniva-color-surface-inset');
      const tertiary = T('--oniva-color-surface-tertiary');
      const hoverRow = T('--oniva-color-surface-hover', surface);
      const text = (name, fg, bgc, min = 4.5) => add(name, th, accent, ratio(fg, bgc), min);
      const ui = (name, fg, bgc, min = 3) => add(name, th, accent, ratio(fg, bgc), min);

      // body / helper text on every surface
      for (const [sn, s] of [['bg', bg], ['surface', surface], ['inset', inset]]) {
        for (const t of ['text', 'text-muted', 'text-subtle', 'text-placeholder', 'text-error']) text(`${t} on ${sn}`, T(`--oniva-color-${t}`), s);
      }
      text('text-muted on tertiary', T('--oniva-color-text-muted'), tertiary);
      text('text-subtle on tertiary', T('--oniva-color-text-subtle'), tertiary);
      text('text-subtle on surface-hover', T('--oniva-color-text-subtle'), hoverRow);
      text('text-muted on surface-hover', T('--oniva-color-text-muted'), hoverRow);
      text('text-on-tertiary on tertiary', T('--oniva-color-text-on-tertiary'), tertiary);
      const errBg = T('--oniva-color-error-bg', surface);
      text('text-error on error-bg', T('--oniva-color-text-error'), errBg);
      text('kbd-fg on kbd-bg', T('--oniva-color-kbd-fg'), T('--oniva-color-kbd-bg'));

      // accent solid fills: label readable at rest / hover / press
      const onSolid = T('--oniva-color-accent-fg');
      for (const k of ['solid', 'solid-end', 'solid-hover', 'solid-hover-end', 'solid-active', 'solid-active-end']) {
        text(`accent-fg on accent-${k}`, onSolid, T.accent(`--oniva-accent-${k}`));
      }
      // accent text + soft fills
      for (const [sn, s] of [['bg', bg], ['surface', surface], ['inset', inset]]) text(`accent-text on ${sn}`, T('--oniva-color-accent-text'), s);
      const softFg = T('--oniva-color-accent-soft-fg');
      for (const k of ['accent-soft', 'accent-soft-hover', 'accent-soft-active']) text(`accent-soft-fg on ${k}`, softFg, T(`--oniva-color-${k}`));

      // danger gradient + status solids
      for (const k of ['from', 'to', 'hover-from', 'hover-to', 'active-from', 'active-to']) {
        text(`on-solid on danger-${k}`, T('--oniva-color-on-solid'), T(`--oniva-color-danger-${k}`));
      }
      for (const s of ['success', 'warning', 'danger', 'info']) {
        text(`${s}-on-solid on ${s}-solid`, T(`--oniva-color-${s}-on-solid`), T(`--oniva-color-${s}-solid`));
        for (const [sn, sc] of [['bg', bg], ['surface', surface]]) ui(`${s}-solid (status dot) on ${sn}`, T(`--oniva-color-${s}-solid`), sc);
      }
      // status chips
      for (const s of ['success', 'warning', 'danger', 'info', 'cyan', 'orange', 'purple']) {
        const chip = T(`--oniva-color-${s}-bg`, surface);
        text(`${s}-fg on ${s}-bg`, T(`--oniva-color-${s}-fg`), chip);
      }

      // non-text: focus ring, control edges, icons
      for (const [sn, s] of [['bg', bg], ['surface', surface], ['inset', inset]]) {
        ui(`focus-ring on ${sn}`, T('--oniva-color-focus-ring'), s);
        ui(`border-control on ${sn}`, T('--oniva-color-border-control'), s);
        ui(`icon-subtle on ${sn}`, T('--oniva-color-icon-subtle'), s);
        ui(`icon-muted on ${sn}`, T('--oniva-color-icon-muted'), s);
        ui(`border-active on ${sn}`, T('--oniva-color-border-active'), s);
      }
      // disabled stays legible-ish (exempt from WCAG, but never invisible)
      ui('text-disabled on surface', T('--oniva-color-text-disabled'), surface, mode === 'dark' ? 3 : 2.5);
      ui('chart-track visible on surface', T('--oniva-color-chart-track'), surface, 1.3);
      ui('chart-cursor visible on surface', T('--oniva-color-chart-cursor'), surface, 1.3);
      for (const k of ['surface-active', 'surface-tertiary']) ui(`${k} differs from surface`, T(`--oniva-color-${k}`), surface, mode === 'dark' ? 1.05 : 1.0);
      if (mode === 'dark') {
        // hover -> active edge order must not invert
        add('dark border-active lighter than border-hover', th, accent, lum(T('--oniva-color-border-active')) - lum(T('--oniva-color-border-hover')) + 1, 1.0001);
      }

      // chart marks: 3:1 on bg + surface; labels; CVD separation
      const marks = [];
      for (let i = 1; i <= 10; i++) {
        const c = T(`--oniva-color-chart-${i}`);
        marks.push(c);
        ui(`chart-${i} on bg`, c, bg);
        ui(`chart-${i} on surface`, c, surface);
      }
      for (const i of [1, 3, 5, 6, 8, 9]) text(`on-chart on chart-${i}`, T('--oniva-color-on-chart'), marks[i - 1]);
      if (accent === 'blue') {
        // chart palettes are accent-independent: check light and dark CVD separation once
        for (const type of [null, 'protan', 'deutan', 'tritan']) {
          let worst = Infinity;
          for (let i = 0; i < 10; i++) for (let j = i + 1; j < 10; j++) worst = Math.min(worst, deltaE(marks[i], marks[j], type));
          add(`chart palette min deltaE (${type ?? 'normal'}, x100)`, th, accent, worst, 3.3);
        }
      }
    }
  }
  return results;
}

const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) {
  const res = runContrastChecks();
  const bad = res.filter((r) => !r.ok);
  for (const r of bad) console.error(`FAIL ${r.theme}/${r.accent} ${r.name}: ${r.value.toFixed(2)} < ${r.min}`);
  console.log(`${res.length - bad.length}/${res.length} contrast checks pass`);
  process.exit(bad.length ? 1 : 0);
}
