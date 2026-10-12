import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = join(dirname(fileURLToPath(import.meta.url)), '..', 'packages', 'oniva-ui', 'src');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/** Slugs of every `*.demo.tsx` (parsed from `meta.slug`), so e2e needs no registry. */
export function discoverSlugs(): string[] {
  return walk(src)
    .filter((f) => f.endsWith('.demo.tsx'))
    .map((f) => /slug:\s*'([^']+)'/.exec(readFileSync(f, 'utf8'))?.[1])
    .filter((s): s is string => !!s)
    .sort();
}
