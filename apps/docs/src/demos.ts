import type { DemoModule } from '../../../packages/oniva-ui/src/internal/demo';

// Auto-discovery: any `*.demo.tsx` under the library is picked up. No registry edits needed.
// Illustrations are disabled for now: excluded here and from the package index (scripts/gen-index.mjs).
const modules = import.meta.glob(['../../../packages/oniva-ui/src/**/*.demo.tsx', '!../../../packages/oniva-ui/src/illustrations/**'], {
  eager: true,
  import: 'default',
}) as Record<string, DemoModule>;

export const demoModules: DemoModule[] = Object.values(modules)
  .filter((m) => m && m.meta && m.demos)
  .sort((a, b) => a.meta.title.localeCompare(b.meta.title));

export function getDemo(slug: string | undefined): DemoModule | undefined {
  return demoModules.find((m) => m.meta.slug === slug);
}

export function groupByCategory(mods: DemoModule[]): [string, DemoModule[]][] {
  const map = new Map<string, DemoModule[]>();
  for (const m of mods) map.set(m.meta.category, [...(map.get(m.meta.category) ?? []), m]);
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}
