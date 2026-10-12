// One-off codemod: rename StyleX token keys to stable public CSS variable names (`--oniva-*`).
// Already applied in loop 4; kept for reference. Run from repo root.
import fs from 'node:fs';
import path from 'node:path';

const kebab = (s) => s.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/([a-zA-Z])(\d)/g, '$1-$2').toLowerCase();
const rules = {
  colors: (k) => `--oniva-color-${kebab(k)}`,
  accent: (k) => `--oniva-accent-${k.replace('accent', '')}`,
  radius: (k) => `--oniva-radius-${kebab(k)}`,
  shadow: (k) => `--oniva-shadow-${kebab(k)}`,
  space: (k) => `--oniva-space-${k.slice(1)}`,
  font: (k) => `--oniva-font-${kebab(k)}`,
  motion: (k) => `--oniva-motion-${kebab(k)}`,
};
const tokenKeys = {};
const tdir = 'packages/oniva-ui/src/tokens';
for (const g of Object.keys(rules)) {
  const src = fs.readFileSync(`${tdir}/${g}.stylex.ts`, 'utf8');
  const body = src.slice(src.indexOf('defineVars({'));
  tokenKeys[g] = [...body.matchAll(/^\s{2}([A-Za-z][A-Za-z0-9]*):/gm)].map((m) => m[1]);
}
const renameKeysIn = (text, g) => text.replace(/^(\s{2})([A-Za-z][A-Za-z0-9]*):/gm, (m, sp, k) => tokenKeys[g].includes(k) ? `${sp}'${rules[g](k)}':` : m);

function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.git'].includes(e.name)) continue;
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out); else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}
let changed = 0;
for (const f of [...walk('packages'), ...walk('apps')]) {
  let s = fs.readFileSync(f, 'utf8');
  const o = s;
  if (f.startsWith(tdir) && f.endsWith('.stylex.ts')) {
    const g = path.basename(f).split('.')[0];
    const i = s.indexOf('defineVars({');
    s = s.slice(0, i) + renameKeysIn(s.slice(i), g);
  } else if (f.endsWith('themes/themes.ts')) {
    // split on createTheme calls
    s = s.replace(/createTheme\((\w+), \{[\s\S]*?\n\}\);/g, (blk, g) => renameKeysIn(blk, g));
  }
  for (const g of Object.keys(rules)) {
    const imp = new RegExp(`import \\{[^}]*\\b${g}\\b[^}]*\\} from '[^']*${g}\\.stylex'`);
    if (!imp.test(s)) continue;
    s = s.replace(new RegExp(`\\b${g}\\.([A-Za-z][A-Za-z0-9]*)\\b`, 'g'), (m, k) => tokenKeys[g].includes(k) ? `${g}['${rules[g](k)}']` : m);
  }
  if (s !== o) { fs.writeFileSync(f, s); changed++; }
}
console.log('changed', changed);
fs.writeFileSync('scripts/.var-map.json', JSON.stringify(Object.fromEntries(Object.entries(tokenKeys).map(([g, ks]) => [g, ks.map(rules[g])])), null, 1));
