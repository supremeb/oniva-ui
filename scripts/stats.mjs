// Prints library stats and rewrites the <!-- stats --> block in README.md. Run on every release: `npm run stats`.
// Counts come from the source folders (same groups as packages/oniva-ui/scripts/gen-index.mjs; illustrations disabled).
import { readdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'packages/oniva-ui/src');
const groups = ['components', 'charts', 'ai', 'widgets', 'motion', 'blocks', 'screens'];
const dirs = (g) =>
  existsSync(join(src, g))
    ? readdirSync(join(src, g), { withFileTypes: true })
        .filter((d) => d.isDirectory() && existsSync(join(src, g, d.name, 'index.ts')))
        .map((d) => d.name)
    : [];
const by = Object.fromEntries(groups.map((g) => [g, dirs(g).length]));
const charts = dirs('charts').filter((d) => !['ChartCard', 'ChartLegend', 'ChartTooltip'].includes(d)).length;
const total = Object.values(by).reduce((a, b) => a + b, 0);
const { version } = JSON.parse(readFileSync(join(root, 'packages/oniva-ui/package.json'), 'utf8'));

const line =
  `**v${version}** · ${total} components: ${by.components} core, ${charts} charts, ${by.ai} AI and agent, ` +
  `${by.widgets} widgets, ${by.motion} motion, ${by.blocks} blocks, ${by.screens} app screens · ` +
  `[Changelog](CHANGELOG.md)`;
const readme = join(root, 'README.md');
const md = readFileSync(readme, 'utf8');
const block = `<!-- stats -->\n${line}\n<!-- /stats -->`;
const next = md.includes('<!-- stats -->')
  ? md.replace(/<!-- stats -->[\s\S]*?<!-- \/stats -->/, block)
  : md;
if (next !== md) writeFileSync(readme, next);
console.log(JSON.stringify({ version, total, ...by, chartsExcludingHelpers: charts }));
