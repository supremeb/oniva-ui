import type { Rect } from './camera';

export const GROUP_W = 900;
export const GAP_X = 120;
export const GAP_Y = 96;
export const SECTION_GAP = 220;
export const SECTION_LABEL_H = 56;

export interface LayoutSection {
  id: string;
  label: string;
  ids: string[];
  cols: number;
}
export interface LayoutResult {
  groups: Map<string, Rect>;
  sections: Map<string, Rect>;
  bounds: Rect;
}

export function columnsFor(count: number): number {
  return Math.min(4, Math.max(1, Math.ceil(count / 5)));
}

/**
 * Sections stack vertically. Inside a section, group i goes to column i % cols and columns stack by real
 * (measured or estimated) heights. A group's height therefore only moves the groups below it in its column
 * and the sections below its section, so a layout pass can never create overlap and never reshuffles columns.
 */
export function computeLayout(sections: LayoutSection[], heightOf: (id: string) => number): LayoutResult {
  const groups = new Map<string, Rect>();
  const sectionRects = new Map<string, Rect>();
  let y = 0;
  let maxW = 0;
  for (const s of sections) {
    const cols = Math.max(1, Math.min(s.cols, s.ids.length || 1));
    const colY = new Array<number>(cols).fill(y + SECTION_LABEL_H);
    s.ids.forEach((id, i) => {
      const c = i % cols;
      const h = Math.max(1, heightOf(id));
      groups.set(id, { x: c * (GROUP_W + GAP_X), y: colY[c]!, w: GROUP_W, h });
      colY[c] = colY[c]! + h + GAP_Y;
    });
    const bottom = Math.max(y + SECTION_LABEL_H, ...colY.map((v) => v - GAP_Y));
    const w = cols * GROUP_W + (cols - 1) * GAP_X;
    sectionRects.set(s.id, { x: 0, y, w, h: bottom - y });
    maxW = Math.max(maxW, w);
    y = bottom + SECTION_GAP;
  }
  return { groups, sections: sectionRects, bounds: { x: 0, y: 0, w: maxW, h: Math.max(0, y - SECTION_GAP) } };
}
