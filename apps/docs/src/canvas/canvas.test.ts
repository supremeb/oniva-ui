import { describe, expect, it } from 'vitest';
import {
  CAMERA_STORAGE_KEY,
  DEFAULT_CAMERA,
  MAX_ZOOM,
  MIN_ZOOM,
  anchorFor,
  cameraFromAnchor,
  clampCamera,
  fitRect,
  lerpCamera,
  parseStoredCamera,
  screenToWorld,
  serializeCamera,
  visibleWorldRect,
  zoomAt,
} from './camera';
import { searchItems, scoreMatch, type SearchItem } from './search';
import { computeLayout } from './layout';

const vp = { w: 1000, h: 800 };

describe('camera math', () => {
  it('zooms around the cursor, keeping the world point fixed', () => {
    const c = { x: 40, y: 20, k: 0.5 };
    const before = screenToWorld(c, 300, 200);
    const z = zoomAt(c, 2, 300, 200);
    const after = screenToWorld(z, 300, 200);
    expect(z.k).toBeCloseTo(1);
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
  });
  it('clamps zoom and keeps the world partly visible', () => {
    const world = { x: 0, y: 0, w: 5000, h: 5000 };
    expect(zoomAt({ x: 0, y: 0, k: 1 }, 1e6, 0, 0).k).toBe(MAX_ZOOM);
    expect(zoomAt({ x: 0, y: 0, k: 1 }, 1e-9, 0, 0).k).toBe(MIN_ZOOM);
    const c = clampCamera({ x: 1e6, y: -1e6, k: 1 }, vp, world);
    expect(c.x).toBeLessThanOrEqual(vp.w);
    expect(c.y).toBeLessThan(0);
    expect(clampCamera({ x: NaN, y: Infinity, k: NaN }, vp, world).k).toBe(DEFAULT_CAMERA.k);
  });
  it('fits a rect inside padding and respects max zoom', () => {
    const pad = { top: 10, right: 10, bottom: 100, left: 10 };
    const c = fitRect({ x: 100, y: 100, w: 2000, h: 1000 }, vp, pad, 1);
    expect(c.k).toBeCloseTo(980 / 2000);
    const small = fitRect({ x: 0, y: 0, w: 100, h: 100 }, vp, pad, 1);
    expect(small.k).toBe(1);
  });
  it('lerp endpoints match and visible rect inverts the transform', () => {
    const a = { x: 0, y: 0, k: 0.5 };
    const b = { x: -900, y: -300, k: 1.5 };
    expect(lerpCamera(a, b, 0, vp).k).toBeCloseTo(0.5);
    const end = lerpCamera(a, b, 1, vp);
    expect(end.x).toBeCloseTo(b.x);
    expect(end.y).toBeCloseTo(b.y);
    const r = visibleWorldRect({ x: -200, y: -100, k: 2 }, vp);
    expect(r).toEqual({ x: 100, y: 50, w: 500, h: 400 });
  });
});

describe('camera persistence', () => {
  it('restores the same component in view when sizes change after reload', () => {
    const before = new Map([['a', { x: 0, y: 0, w: 900, h: 300 }], ['b', { x: 0, y: 400, w: 900, h: 300 }]]);
    const cam = { x: -50, y: -300, k: 1 };
    const anchor = anchorFor(cam, vp, before)!;
    const stored = parseStoredCamera(serializeCamera(cam, anchor))!;
    expect(stored.anchor?.id).toBe('b');
    const after = new Map([['a', { x: 0, y: 0, w: 900, h: 900 }], ['b', { x: 0, y: 1000, w: 900, h: 300 }]]);
    const restored = cameraFromAnchor(stored, vp, after);
    expect(restored.y).toBeCloseTo(cam.y - 600);
    expect(cameraFromAnchor(stored, vp, new Map())).toEqual({ x: -50, y: -300, k: 1 });
  });
  it('round-trips and has a versioned key', () => {
    expect(CAMERA_STORAGE_KEY).toMatch(/v1$/);
    expect(parseStoredCamera(serializeCamera({ x: 12.5, y: -3, k: 0.75 }))).toEqual({ x: 12.5, y: -3, k: 0.75 });
  });
  it('rejects malformed, oversized, unknown-version and out-of-range data', () => {
    expect(parseStoredCamera(null)).toBeNull();
    expect(parseStoredCamera('{oops')).toBeNull();
    expect(parseStoredCamera('"x"')).toBeNull();
    expect(parseStoredCamera('{"v":2,"x":0,"y":0,"k":1}')).toBeNull();
    expect(parseStoredCamera('{"v":1,"x":0,"y":0,"k":99}')).toBeNull();
    expect(parseStoredCamera('{"v":1,"x":"0","y":0,"k":1}')).toBeNull();
    expect(parseStoredCamera(`{"v":1,"x":0,"y":0,"k":1,"pad":"${'a'.repeat(900)}"}`)).toBeNull();
  });
});

const items: SearchItem[] = [
  { id: 'data-table', title: 'Data table', slug: 'data-table', category: 'Data display' },
  { id: 'voice-orb', title: 'Voice orb', slug: 'voice-orb', category: 'AI & Agent' },
  { id: 'pricing', title: 'Pricing', slug: 'pricing', category: 'Blocks' },
  { id: 'select', title: 'Select', slug: 'select', category: 'Forms' },
  { id: 'dialog', title: 'Dialog', slug: 'dialog', category: 'Overlays' },
];

describe('search matching', () => {
  it('ranks name prefix first and matches slug, category and fuzzy', () => {
    expect(searchItems(items, 'data')[0]?.id).toBe('data-table');
    expect(searchItems(items, 'overlays').map((i) => i.id)).toEqual(['dialog']);
    expect(searchItems(items, 'vcorb').map((i) => i.id)).toContain('voice-orb');
    expect(searchItems(items, 'pric')[0]?.id).toBe('pricing');
  });
  it('requires every token, and returns nothing for gibberish', () => {
    expect(searchItems(items, 'data forms')).toEqual([]);
    expect(searchItems(items, 'zzzq')).toEqual([]);
    expect(scoreMatch('', items[0]!)).toBeGreaterThan(0);
    expect(searchItems(items, '', 2)).toHaveLength(2);
  });
});

describe('layout', () => {
  it('never overlaps groups, even when a height changes', () => {
    const sections = [
      { id: 'a', label: 'A', ids: ['a1', 'a2', 'a3', 'a4', 'a5'], cols: 2 },
      { id: 'b', label: 'B', ids: ['b1', 'b2'], cols: 1 },
    ];
    const heights: Record<string, number> = { a1: 300, a2: 500, a3: 200, a4: 900, a5: 100, b1: 400, b2: 400 };
    for (const grow of [0, 700]) {
      heights.a1 = 300 + grow;
      const l = computeLayout(sections, (id) => heights[id]!);
      const rects = [...l.groups.values()];
      for (let i = 0; i < rects.length; i++)
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i]!;
          const b = rects[j]!;
          const overlap = a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
          expect(overlap).toBe(false);
        }
    }
  });
});
