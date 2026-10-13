import type { Demo } from '../../../../packages/oniva-ui/src/internal/demo';
import { demoModules } from '../demos';
import { columnsFor, type LayoutSection } from './layout';
import type { SearchItem } from './search';

/** Demos per group. Demos already compare variants one prop at a time; more than this is omitted. */
export const MAX_VARIANTS = 4;

const CATEGORY_ORDER = [
  'Actions',
  'Forms',
  'Overlays',
  'Navigation',
  'Layout',
  'Data display',
  'Feedback',
  'Typography',
  'Charts',
  'AI & Agent',
  'Widgets',
  'Motion',
  'Blocks',
];

export interface CanvasEntry extends SearchItem {
  demos: Demo[];
  omitted: number;
  cols: number;
  estimate: number;
}

const ROW_ESTIMATE: Record<string, number> = {
  Blocks: 560,
  Charts: 340,
  'AI & Agent': 320,
  Widgets: 320,
  'Data display': 320,
  Motion: 260,
};

/** Group chrome: title zone (28) + frame padding (2 * 24) + slot caption (24) per row. */
function estimateHeight(category: string, n: number, cols: number): number {
  const rows = Math.ceil(n / cols);
  return 28 + 48 + rows * ((ROW_ESTIMATE[category] ?? 220) + 24) + (rows - 1) * 24;
}

/** Slot columns inside a group: equal-width slots that fill each row (1, 2, 3, then 2x2). */
export function slotColumns(n: number): number {
  return n <= 3 ? Math.max(1, n) : 2;
}

export function buildCatalog() {
  const entries: CanvasEntry[] = demoModules.map((m) => {
    const demos = m.demos.slice(0, MAX_VARIANTS);
    return {
      id: m.meta.slug,
      title: m.meta.title,
      slug: m.meta.slug,
      category: m.meta.category,
      demos,
      omitted: m.demos.length - demos.length,
      cols: slotColumns(demos.length),
      estimate: estimateHeight(m.meta.category, demos.length, slotColumns(demos.length)),
    };
  });
  const byCat = new Map<string, CanvasEntry[]>();
  for (const e of entries) byCat.set(e.category, [...(byCat.get(e.category) ?? []), e]);
  const cats = [...byCat.keys()].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a);
    const ib = CATEGORY_ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b);
  });
  const sections: LayoutSection[] = cats.map((c) => {
    const list = byCat.get(c)!.sort((a, b) => a.title.localeCompare(b.title));
    return { id: c, label: c, ids: list.map((e) => e.id), cols: columnsFor(list.length) };
  });
  const ordered = sections.flatMap((s) => s.ids.map((id) => entries.find((e) => e.id === id)!));
  const map = new Map(entries.map((e) => [e.id, e]));
  return { entries: ordered, sections, map };
}

export const catalog = buildCatalog();
