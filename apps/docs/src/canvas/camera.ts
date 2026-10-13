/** Pure camera math for the component canvas. No DOM, no React. Screen = world * k + (x, y). */
export interface Camera {
  x: number;
  y: number;
  k: number;
}
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export interface Size {
  w: number;
  h: number;
}
export interface Insets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const MIN_ZOOM = 0.03;
export const MAX_ZOOM = 3;
/** Below this zoom the canvas renders lightweight labeled tiles instead of live previews. */
export const TILE_ZOOM = 0.35;
export const DEFAULT_CAMERA: Camera = { x: 56, y: 96, k: 0.6 };
/** Screen px of world that must stay visible when panning. */
export const KEEP_VISIBLE = 120;

export const CAMERA_STORAGE_KEY = 'oniva-ui-docs:canvas:camera:v1';
const MAX_STORED_LENGTH = 512;

export function clampZoom(k: number): number {
  if (!Number.isFinite(k)) return DEFAULT_CAMERA.k;
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, k));
}

export function isCamera(c: unknown): c is Camera {
  if (!c || typeof c !== 'object') return false;
  const { x, y, k } = c as Record<string, unknown>;
  return (
    typeof x === 'number' &&
    typeof y === 'number' &&
    typeof k === 'number' &&
    Number.isFinite(x) &&
    Number.isFinite(y) &&
    Number.isFinite(k) &&
    k >= MIN_ZOOM &&
    k <= MAX_ZOOM &&
    Math.abs(x) < 1e7 &&
    Math.abs(y) < 1e7
  );
}

/** Keeps at least KEEP_VISIBLE px of the world bounds on screen, and zoom within range. */
export function clampCamera(c: Camera, vp: Size, world: Rect): Camera {
  const k = clampZoom(c.k);
  const keepX = Math.min(KEEP_VISIBLE, vp.w / 2);
  const keepY = Math.min(KEEP_VISIBLE, vp.h / 2);
  const minX = keepX - (world.x + world.w) * k;
  const maxX = vp.w - keepX - world.x * k;
  const minY = keepY - (world.y + world.h) * k;
  const maxY = vp.h - keepY - world.y * k;
  const x = Number.isFinite(c.x) ? c.x : DEFAULT_CAMERA.x;
  const y = Number.isFinite(c.y) ? c.y : DEFAULT_CAMERA.y;
  return {
    k,
    x: minX > maxX ? (minX + maxX) / 2 : Math.min(maxX, Math.max(minX, x)),
    y: minY > maxY ? (minY + maxY) / 2 : Math.min(maxY, Math.max(minY, y)),
  };
}

export function panBy(c: Camera, dx: number, dy: number): Camera {
  return { ...c, x: c.x + dx, y: c.y + dy };
}

/** Zoom by `factor`, keeping the world point under screen (px, py) fixed. */
export function zoomAt(c: Camera, factor: number, px: number, py: number): Camera {
  const k = clampZoom(c.k * factor);
  const r = k / c.k;
  return { k, x: px - (px - c.x) * r, y: py - (py - c.y) * r };
}

export function screenToWorld(c: Camera, sx: number, sy: number): { x: number; y: number } {
  return { x: (sx - c.x) / c.k, y: (sy - c.y) / c.k };
}

/** Camera that frames `r` inside the viewport (minus insets), never zooming past maxZoom. */
export function fitRect(r: Rect, vp: Size, pad: Insets, maxZoom = 1): Camera {
  const aw = Math.max(1, vp.w - pad.left - pad.right);
  const ah = Math.max(1, vp.h - pad.top - pad.bottom);
  const k = clampZoom(Math.min(maxZoom, aw / Math.max(1, r.w), ah / Math.max(1, r.h)));
  return {
    k,
    x: pad.left + (aw - r.w * k) / 2 - r.x * k,
    y: pad.top + (ah - r.h * k) / 2 - r.y * k,
  };
}

/** World-space rect visible through the viewport, grown by `margin` viewports on each side. */
export function visibleWorldRect(c: Camera, vp: Size, margin = 0): Rect {
  const w = vp.w / c.k;
  const h = vp.h / c.k;
  return { x: -c.x / c.k - w * margin, y: -c.y / c.k - h * margin, w: w * (1 + 2 * margin), h: h * (1 + 2 * margin) };
}

export function rectsIntersect(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function easeOutCubic(t: number): number {
  const u = 1 - Math.min(1, Math.max(0, t));
  return 1 - u * u * u;
}

/** Interpolates the viewport centre linearly and the zoom geometrically, so pans+zooms feel uniform. */
export function lerpCamera(a: Camera, b: Camera, t: number, vp: Size): Camera {
  const ca = screenToWorld(a, vp.w / 2, vp.h / 2);
  const cb = screenToWorld(b, vp.w / 2, vp.h / 2);
  const k = a.k * Math.pow(b.k / a.k, t);
  const cx = ca.x + (cb.x - ca.x) * t;
  const cy = ca.y + (cb.y - ca.y) * t;
  return { k, x: vp.w / 2 - cx * k, y: vp.h / 2 - cy * k };
}

/**
 * The saved camera is also expressed relative to the group nearest the view centre. Group heights are measured at
 * runtime, so after a reload the layout starts from estimates; the anchor keeps the same component in view.
 */
export interface CameraAnchor {
  id: string;
  ox: number;
  oy: number;
}
export type StoredCamera = Camera & { anchor?: CameraAnchor };

export function anchorFor(c: Camera, vp: Size, groups: ReadonlyMap<string, Rect>): CameraAnchor | undefined {
  const mid = screenToWorld(c, vp.w / 2, vp.h / 2);
  let best: CameraAnchor | undefined;
  let bestD = Infinity;
  for (const [id, r] of groups) {
    const d = Math.hypot(Math.max(r.x - mid.x, 0, mid.x - r.x - r.w), Math.max(r.y - mid.y, 0, mid.y - r.y - r.h));
    if (d < bestD) {
      bestD = d;
      best = { id, ox: mid.x - r.x, oy: mid.y - r.y };
    }
  }
  return best;
}

export function cameraFromAnchor(stored: StoredCamera, vp: Size, groups: ReadonlyMap<string, Rect>): Camera {
  const r = stored.anchor && groups.get(stored.anchor.id);
  if (!stored.anchor || !r) return { x: stored.x, y: stored.y, k: stored.k };
  const cx = r.x + stored.anchor.ox;
  const cy = r.y + stored.anchor.oy;
  return { k: stored.k, x: vp.w / 2 - cx * stored.k, y: vp.h / 2 - cy * stored.k };
}

export function serializeCamera(c: Camera, anchor?: CameraAnchor): string {
  const round = (n: number, p: number) => Math.round(n * p) / p;
  return JSON.stringify({
    v: 1,
    x: round(c.x, 100),
    y: round(c.y, 100),
    k: round(c.k, 10000),
    ...(anchor ? { a: anchor.id, ox: round(anchor.ox, 100), oy: round(anchor.oy, 100) } : {}),
  });
}

/** Returns a valid camera or null for anything malformed, oversized or of an unknown version. */
export function parseStoredCamera(raw: string | null | undefined): StoredCamera | null {
  if (!raw || raw.length > MAX_STORED_LENGTH) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    const { v, x, y, k, a, ox, oy } = data as Record<string, unknown>;
    if (v !== 1) return null; // unknown/older formats: no migrations exist yet, discard
    const cam = { x, y, k };
    if (!isCamera(cam)) return null;
    if (typeof a === 'string' && a.length <= 80 && typeof ox === 'number' && typeof oy === 'number' && Number.isFinite(ox) && Number.isFinite(oy) && Math.abs(ox) < 1e6 && Math.abs(oy) < 1e6) {
      return { ...cam, anchor: { id: a, ox, oy } };
    }
    return cam;
  } catch {
    return null;
  }
}

export function loadCamera(): StoredCamera | null {
  try {
    return parseStoredCamera(window.localStorage.getItem(CAMERA_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function saveCamera(c: Camera, anchor?: CameraAnchor): void {
  try {
    window.localStorage.setItem(CAMERA_STORAGE_KEY, serializeCamera(c, anchor));
  } catch {
    /* storage unavailable or full: the camera just does not persist */
  }
}
