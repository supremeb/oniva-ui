// The StyleX unplugin emits all atomic CSS as dist/assets/stylex.css. Publish it as dist/oniva-ui.css.
import { existsSync, renameSync, rmSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const from = join(dist, 'assets', 'stylex.css');
if (!existsSync(from)) {
  console.error('finalize-css: dist/assets/stylex.css not found; StyleX produced no CSS');
  process.exit(1);
}
renameSync(from, join(dist, 'oniva-ui.css'));
rmSync(join(dist, 'assets'), { recursive: true, force: true });
const css = readFileSync(join(dist, 'oniva-ui.css'), 'utf8');
if (!css.includes(':root') || css.length < 5000) {
  console.error('finalize-css: oniva-ui.css looks empty');
  process.exit(1);
}
console.log(`finalize-css: dist/oniva-ui.css (${(css.length / 1024).toFixed(1)} kB)`);
