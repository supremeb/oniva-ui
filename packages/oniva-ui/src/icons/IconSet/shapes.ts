/**
 * Geometry and part helpers for the 18-unit icon grid (see README.md for the spec).
 * Geometry helpers return SVG path `d` strings; part helpers tag a path with the role it plays
 * in each style (outline, duo, fill). Angles are degrees clockwise from 12 o'clock.
 */

/** `outline`, `duo` (outline + soft tint), `fill` (solid), `fill-duo` (solid + 40% secondary layer). */
export type IconVariant = 'outline' | 'duo' | 'fill' | 'fill-duo';

/** How a path renders per style. */
export type PartKind =
  /** Closed shape: stroked in outline, tinted in duo (if `tint`), solid in fill. */
  | 'body'
  /** Open or closed stroke that stays a stroke in every style. */
  | 'stroke'
  /** Detail inside a body: stroked in outline/duo, knocked out of the solid in fill. */
  | 'cut'
  /** Small solid mark in every style. */
  | 'dot'
  /** Solid mark in outline/duo that becomes a knocked-out hole in fill. */
  | 'hole'
  /** Region erased from every part listed before it, in every style (the gap around a modifier). */
  | 'clear';

export interface PartOptions {
  /** Duo: this body gets the soft secondary fill. */
  tint?: boolean;
  /** Duo: this stroke or dot belongs to the secondary layer and drops to the soft opacity. */
  soft?: boolean;
  /** Render only in these styles. Use it when fill needs different geometry from outline. */
  only?: IconVariant | readonly IconVariant[];
}

export interface Part extends PartOptions {
  k: PartKind;
  d: string;
}

/** Shorthand for parts that should render in the stroked styles only. */
export const LINED: readonly IconVariant[] = ['outline', 'duo'];
/** Shorthand for parts that should render in the solid styles only. */
export const SOLID: readonly IconVariant[] = ['fill', 'fill-duo'];

const n = (v: number) => {
  const r = Math.round(v * 1000) / 1000;
  return String(Object.is(r, -0) ? 0 : r);
};
const pt = (x: number, y: number) => `${n(x)} ${n(y)}`;

function pairs(c: readonly number[]): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i + 1 < c.length; i += 2) out.push([c[i]!, c[i + 1]!]);
  return out;
}

/** Point on a circle. 0deg is 12 o'clock, angles grow clockwise. */
export function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

/** Straight segment. */
export function seg(x1: number, y1: number, x2: number, y2: number): string {
  return `M${pt(x1, y1)}L${pt(x2, y2)}`;
}

/** Open polyline through x,y pairs. */
export function poly(...c: number[]): string {
  return pairs(c)
    .map(([x, y], i) => `${i ? 'L' : 'M'}${pt(x, y)}`)
    .join('');
}

/** Closed polygon through x,y pairs. */
export function polygon(...c: number[]): string {
  return `${poly(...c)}Z`;
}

/** Closed polygon with every corner rounded by `r` (clamped to half of each edge). */
export function roundPolygon(r: number, ...c: number[]): string {
  const p = pairs(c);
  const k = p.length;
  const toward = (a: [number, number], b: [number, number], dist: number): [number, number] => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const t = Math.min(dist, len / 2) / len;
    return [a[0] + dx * t, a[1] + dy * t];
  };
  let d = '';
  for (let i = 0; i < k; i++) {
    const v = p[i]!;
    const a = toward(v, p[(i - 1 + k) % k]!, r);
    const b = toward(v, p[(i + 1) % k]!, r);
    d += `${i ? 'L' : 'M'}${pt(a[0], a[1])}Q${pt(v[0], v[1])} ${pt(b[0], b[1])}`;
  }
  return `${d}Z`;
}

/** Open polyline with rounded inner corners (ends stay sharp; caps round them). */
export function roundPoly(r: number, ...c: number[]): string {
  const p = pairs(c);
  if (p.length < 3) return poly(...c);
  const toward = (a: [number, number], b: [number, number], dist: number): [number, number] => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const t = Math.min(dist, len / 2) / len;
    return [a[0] + dx * t, a[1] + dy * t];
  };
  let d = `M${pt(p[0]![0], p[0]![1])}`;
  for (let i = 1; i < p.length - 1; i++) {
    const v = p[i]!;
    const a = toward(v, p[i - 1]!, r);
    const b = toward(v, p[i + 1]!, r);
    d += `L${pt(a[0], a[1])}Q${pt(v[0], v[1])} ${pt(b[0], b[1])}`;
  }
  const last = p[p.length - 1]!;
  return `${d}L${pt(last[0], last[1])}`;
}

/** Full circle. */
export function circle(cx: number, cy: number, r: number): string {
  return `M${pt(cx - r, cy)}A${n(r)} ${n(r)} 0 1 0 ${pt(cx + r, cy)}A${n(r)} ${n(r)} 0 1 0 ${pt(cx - r, cy)}Z`;
}

/** Full ellipse. */
export function ellipse(cx: number, cy: number, rx: number, ry: number): string {
  return `M${pt(cx - rx, cy)}A${n(rx)} ${n(ry)} 0 1 0 ${pt(cx + rx, cy)}A${n(rx)} ${n(ry)} 0 1 0 ${pt(cx - rx, cy)}Z`;
}

/**
 * Circular arc from `from` to `to` degrees. Clockwise when `to > from`, counter-clockwise otherwise.
 * A sweep of 360 or more returns a full circle.
 */
export function arc(cx: number, cy: number, r: number, from: number, to: number): string {
  const sweep = to - from;
  if (Math.abs(sweep) >= 360) return circle(cx, cy, r);
  const [x0, y0] = polar(cx, cy, r, from);
  const [x1, y1] = polar(cx, cy, r, to);
  const large = Math.abs(sweep) > 180 ? 1 : 0;
  const cw = sweep > 0 ? 1 : 0;
  return `M${pt(x0, y0)}A${n(r)} ${n(r)} 0 ${large} ${cw} ${pt(x1, y1)}`;
}

/** Closed pie slice (center, out along `from`, arc to `to`, back to center). */
export function sector(cx: number, cy: number, r: number, from: number, to: number): string {
  const [x0, y0] = polar(cx, cy, r, from);
  const [x1, y1] = polar(cx, cy, r, to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const cw = to > from ? 1 : 0;
  return `M${pt(cx, cy)}L${pt(x0, y0)}A${n(r)} ${n(r)} 0 ${large} ${cw} ${pt(x1, y1)}Z`;
}

/** Rounded rectangle. `r` is one radius or [top-left, top-right, bottom-right, bottom-left]. */
export function rect(
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | readonly [number, number, number, number] = 0,
): string {
  const max = Math.min(w, h) / 2;
  const [tl, tr, br, bl] = (typeof r === 'number' ? [r, r, r, r] : r).map((v) => Math.min(v, max)) as [
    number,
    number,
    number,
    number,
  ];
  const corner = (rad: number, x2: number, y2: number) => (rad ? `A${n(rad)} ${n(rad)} 0 0 1 ${pt(x2, y2)}` : '');
  return (
    `M${pt(x + tl, y)}H${n(x + w - tr)}${corner(tr, x + w, y + tr)}` +
    `V${n(y + h - br)}${corner(br, x + w - br, y + h)}` +
    `H${n(x + bl)}${corner(bl, x, y + h - bl)}` +
    `V${n(y + tl)}${corner(tl, x + tl, y)}Z`
  );
}

/**
 * Open arrowhead (two arms) with its tip at x,y pointing toward `deg` (0 = up, 90 = right).
 * `len` is the arm length; arms open at 45deg either side.
 */
export function head(x: number, y: number, deg: number, len = 3.5, spread = 45): string {
  const a = polar(x, y, len, deg + 180 - spread);
  const b = polar(x, y, len, deg + 180 + spread);
  return `M${pt(a[0], a[1])}L${pt(x, y)}L${pt(b[0], b[1])}`;
}

/** Star with `points` tips, rounded corners. */
export function star(cx: number, cy: number, outer: number, inner: number, points = 5, corner = 0.6, rot = 0): string {
  const c: number[] = [];
  for (let i = 0; i < points * 2; i++) {
    const [x, y] = polar(cx, cy, i % 2 ? inner : outer, rot + (i * 180) / points);
    c.push(x, y);
  }
  return roundPolygon(corner, ...c);
}

/** Four-point sparkle: concave sides drawn with quadratic curves pulled toward the center. */
export function sparkle(cx: number, cy: number, r: number, pinch = 0.18): string {
  const k = r * pinch;
  return (
    `M${pt(cx, cy - r)}Q${pt(cx + k, cy - k)} ${pt(cx + r, cy)}` +
    `Q${pt(cx + k, cy + k)} ${pt(cx, cy + r)}` +
    `Q${pt(cx - k, cy + k)} ${pt(cx - r, cy)}` +
    `Q${pt(cx - k, cy - k)} ${pt(cx, cy - r)}Z`
  );
}

/** Concatenate path strings. */
export const join = (...d: string[]) => d.join('');

// ---- parts -------------------------------------------------------------

export const body = (d: string, o?: PartOptions): Part => ({ k: 'body', d, ...o });
export const stroke = (d: string, o?: PartOptions): Part => ({ k: 'stroke', d, ...o });
export const cut = (d: string, o?: PartOptions): Part => ({ k: 'cut', d, ...o });
export const dot = (cx: number, cy: number, r = 1, o?: PartOptions): Part => ({ k: 'dot', d: circle(cx, cy, r), ...o });
export const hole = (cx: number, cy: number, r = 1, o?: PartOptions): Part => ({
  k: 'hole',
  d: circle(cx, cy, r),
  ...o,
});
/** Erase this region from everything drawn before it (in every style). Parts after it draw on top. */
export const clear = (d: string): Part => ({ k: 'clear', d });
/** A solid shape from any path (for marks that are not circles). */
export const mark = (d: string, o?: PartOptions): Part => ({ k: 'dot', d, ...o });

/**
 * Scales a path by `k` around the origin, then moves it by dx, dy. Handles absolute and relative M L H V C S Q T A Z
 * (arc radii scale; flags and rotation do not). Used to derive compact (12-grid) modifier marks from 18-grid ones.
 */
export function transformPath(d: string, k: number, dx = 0, dy = 0): string {
  const tokens = d.match(/[MLHVCSQTAZmlhvcsqtaz]|-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g) ?? [];
  const counts: Record<string, number> = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
  let out = '';
  let i = 0;
  let cmd = '';
  while (i < tokens.length) {
    const t = tokens[i]!;
    if (/[A-Za-z]/.test(t)) {
      cmd = t;
      out += t;
      i++;
      if (cmd.toUpperCase() === 'Z') continue;
    }
    const up = cmd.toUpperCase();
    const rel = cmd !== up;
    const nums = tokens.slice(i, i + counts[up]!).map(Number);
    i += counts[up]!;
    const X = (v: number) => n(v * k + (rel ? 0 : dx));
    const Y = (v: number) => n(v * k + (rel ? 0 : dy));
    const piece =
      up === 'H'
        ? X(nums[0]!)
        : up === 'V'
          ? Y(nums[0]!)
          : up === 'A'
            ? [n(nums[0]! * k), n(nums[1]! * k), nums[2], nums[3], nums[4], X(nums[5]!), Y(nums[6]!)].join(' ')
            : nums.map((v, j) => (j % 2 ? Y(v) : X(v))).join(' ');
    out += (/[A-Za-z]$/.test(out) ? '' : ' ') + piece;
  }
  return out;
}

/** Applies `transformPath` to every part. */
export const transformParts = (parts: readonly Part[], k: number, dx = 0, dy = 0): Part[] =>
  parts.map((p) => ({ ...p, d: transformPath(p.d, k, dx, dy) }));
