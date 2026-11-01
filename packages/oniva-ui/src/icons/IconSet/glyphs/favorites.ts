import { createIcon } from '../createIcon';
import {
  body,
  circle,
  cut,
  LINED,
  mark,
  poly,
  polar,
  roundPoly,
  roundPolygon,
  seg,
  SOLID,
  sparkle,
  star,
  stroke,
  type Part,
} from '../shapes';

// Favorites: bookmarks, stars, hearts and awards.

type Pt = [number, number];

const r3 = (v: number) => Math.round(v * 1000) / 1000;
const flat = (p: readonly Pt[]) => p.flatMap(([x, y]) => [x, y]);

// ---- modifiers (bottom-right zone, same marks as the people glyphs) -----------

const plusMod = () => [stroke(seg(13.75, 11.5, 13.75, 16)), stroke(seg(11.5, 13.75, 16, 13.75))];
const minusMod = () => [stroke(seg(11.5, 13.75, 16, 13.75))];
const checkMod = () => [stroke(poly(11.5, 14, 13.25, 15.75, 16.25, 12))];
const xMod = () => [stroke(seg(11.75, 11.75, 15.75, 15.75)), stroke(seg(15.75, 11.75, 11.75, 15.75))];

/** A closed shape that is a stroked ring in outline/duo and a knocked-out solid shape in fill. */
const inner = (d: string): Part[] => [cut(d, { only: LINED }), { k: 'hole', d, only: SOLID } satisfies Part];

// ---- geometry helpers for shapes that break around a modifier or the off slash ---------------

/** Point where f changes sign between a and b, found by bisection. */
function crossing(a: Pt, b: Pt, f: (p: Pt) => number): Pt {
  const neg = f(a) < 0;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 30; i++) {
    const m = (lo + hi) / 2;
    const p: Pt = [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m];
    if (f(p) < 0 === neg) lo = m;
    else hi = m;
  }
  const t = (lo + hi) / 2;
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

/** Runs of a closed outline where f >= 0, ends interpolated onto f = 0. */
function clipRuns(pts: readonly Pt[], f: (p: Pt) => number): Pt[][] {
  const n = pts.length;
  const s = pts.findIndex((p) => f(p) < 0);
  if (s < 0) return [];
  const runs: Pt[][] = [];
  let cur: Pt[] | null = null;
  for (let k = 1; k <= n; k++) {
    const a = pts[(s + k - 1) % n]!;
    const b = pts[(s + k) % n]!;
    const ina = f(a) >= 0;
    const inb = f(b) >= 0;
    if (!ina && inb) cur = [crossing(a, b, f), b];
    else if (ina && inb) cur?.push(b);
    else if (ina && !inb && cur) {
      cur.push(crossing(a, b, f));
      runs.push(cur);
      cur = null;
    }
  }
  return runs;
}

const trace = (run: readonly Pt[], round: number) => (round ? roundPoly(round, ...flat(run)) : poly(...flat(run)));

/** Base shape that stops on a circle of radius 5.25 around the modifier center (13.75, 13.75). */
function withModifier(pts: readonly Pt[], round: number): Part[] {
  const run = clipRuns(pts, (p) => Math.hypot(p[0] - 13.75, p[1] - 13.75) - 5.25)[0]!;
  const d = trace(run, round);
  const [x, y] = run[0]!;
  return [
    body(d, { tint: true, only: LINED }),
    body(`${d}A5.25 5.25 0 0 0 ${r3(x)} ${r3(y)}Z`, { only: SOLID }),
  ];
}

/** Base shape split by the off slash: two open bodies, each stopping 1.5 from the slash. */
function splitBySlash(pts: readonly Pt[], round: number): Part[] {
  const gap = 1.5 * Math.SQRT2;
  const lower = clipRuns(pts, (p) => p[1] - p[0] - gap);
  const upper = clipRuns(pts, (p) => p[0] - p[1] - gap);
  return [...lower, ...upper]
    .map((run) => body(trace(run, round), { tint: true }))
    .concat([stroke(seg(2.75, 2.75, 15.25, 15.25))]);
}

function pointInPoly(p: Pt, poly2: readonly Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly2.length - 1; i < poly2.length; j = i++) {
    const [xi, yi] = poly2[i]!;
    const [xj, yj] = poly2[j]!;
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// ---- hearts ----------------------------------------------------------------------------------

const HY = 8.9;

/** The heart of the status set, scaled by `s` around (cx, cy). */
function heart(cx: number, cy: number, s: number): string {
  const X = (x: number) => r3(cx + (x - 9) * s);
  const Y = (y: number) => r3(cy + (y - HY) * s);
  const rad = r3(3.4 * s);
  return (
    `M${X(9)} ${Y(15.25)}C${X(5.5)} ${Y(13)} ${X(2.25)} ${Y(10.5)} ${X(2.25)} ${Y(6.75)}` +
    `A${rad} ${rad} 0 0 1 ${X(9)} ${Y(5.25)}A${rad} ${rad} 0 0 1 ${X(15.75)} ${Y(6.75)}` +
    `C${X(15.75)} ${Y(10.5)} ${X(12.5)} ${Y(13)} ${X(9)} ${Y(15.25)}Z`
  );
}

/** The same heart as a clockwise point loop starting at the tip (for clipping). */
function heartPts(cx = 9, cy = HY, s = 1): Pt[] {
  const X = (x: number) => cx + (x - 9) * s;
  const Y = (y: number) => cy + (y - HY) * s;
  const N = 16;
  const out: Pt[] = [];
  const bez = (p0: Pt, p1: Pt, p2: Pt, p3: Pt) => {
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const u = 1 - t;
      const w = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
      out.push([
        X(w[0]! * p0[0] + w[1]! * p1[0] + w[2]! * p2[0] + w[3]! * p3[0]),
        Y(w[0]! * p0[1] + w[1]! * p1[1] + w[2]! * p2[1] + w[3]! * p3[1]),
      ]);
    }
  };
  const lobe = (ccx: number, from: number) => {
    for (let i = 0; i < N; i++) {
      const a = ((from + (180 * i) / N) * Math.PI) / 180;
      out.push([X(ccx + 3.4577 * Math.cos(a)), Y(6 + 3.4577 * Math.sin(a))]);
    }
  };
  bez([9, 15.25], [5.5, 13], [2.25, 10.5], [2.25, 6.75]);
  lobe(5.625, 167.47);
  lobe(12.375, 192.53);
  bez([15.75, 6.75], [15.75, 10.5], [12.5, 13], [9, 15.25]);
  return out;
}

export const HeartAddIcon = /*#__PURE__*/ createIcon('HeartAdd', () => [
  ...withModifier(heartPts(), 0),
  ...plusMod(),
]);

export const HeartMinusIcon = /*#__PURE__*/ createIcon('HeartMinus', () => [
  ...withModifier(heartPts(), 0),
  ...minusMod(),
]);

export const HeartOffIcon = /*#__PURE__*/ createIcon('HeartOff', () => splitBySlash(heartPts(), 0));

export const HeartCrackIcon = /*#__PURE__*/ createIcon('HeartCrack', () => [
  body(heart(9, HY, 1), { tint: true }),
  cut(poly(9, 5.25, 7.25, 8.5, 10.75, 10.25, 8.25, 12.75, 9, 15.25)),
]);

export const HeartCircleIcon = /*#__PURE__*/ createIcon('HeartCircle', () => [
  body(circle(9, 9, 7), { tint: true }),
  ...inner(heart(9, 9.35, 0.4)),
]);

export const HeartsIcon = /*#__PURE__*/ createIcon('Hearts', () => {
  const frontPts = heartPts(6.25, 11.5, 0.62);
  const back = heartPts(11.75, 6.5, 0.62);
  const peek = clipRuns(back, (p) => (pointInPoly(p, frontPts) ? -1 : 1))[0]!;
  return [body(heart(6.25, 11.5, 0.62), { tint: true }), stroke(poly(...flat(peek)))];
});

export const HeartHandIcon = /*#__PURE__*/ createIcon('HeartHand', () => [
  body(heart(10.25, 4.9, 0.42), { tint: true }),
  stroke(seg(2.25, 10.5, 2.25, 15.5)),
  stroke('M2.25 12H5L7.25 10.75H11.25A1.5 1.5 0 0 1 11.25 13.75H8.25'),
  stroke('M5 14.5L8.25 15.75H11.5C12.3 15.75 13 15.4 13.6 14.9L16 12.75'),
]);

export const SparkleHeartIcon = /*#__PURE__*/ createIcon('SparkleHeart', () => [
  body(heart(7.25, 10.75, 0.8), { tint: true }),
  mark(sparkle(14.25, 3.75, 2.5, 0.2)),
]);

// ---- bookmarks ---------------------------------------------------------------------------------

const BOOKMARK = 'M4.25 4.5A2 2 0 0 1 6.25 2.5H11.75A2 2 0 0 1 13.75 4.5V15.25L9 12L4.25 15.25Z';

/** Narrow bookmark that stops on the modifier clearance circle. */
const BOOKMARK_PTS: Pt[] = [
  [3, 2.5],
  [11, 2.5],
  [11, 15.5],
  [7, 12.25],
  [3, 15.5],
];

const bookmarkOpen = () => withModifier(BOOKMARK_PTS, 1.25);

export const BookmarkPlusIcon = /*#__PURE__*/ createIcon('BookmarkPlus', () => [...bookmarkOpen(), ...plusMod()]);
export const BookmarkMinusIcon = /*#__PURE__*/ createIcon('BookmarkMinus', () => [...bookmarkOpen(), ...minusMod()]);
export const BookmarkCheckIcon = /*#__PURE__*/ createIcon('BookmarkCheck', () => [...bookmarkOpen(), ...checkMod()]);
export const BookmarkXIcon = /*#__PURE__*/ createIcon('BookmarkX', () => [...bookmarkOpen(), ...xMod()]);

export const BookmarkOffIcon = /*#__PURE__*/ createIcon('BookmarkOff', () => [
  body('M5.03 2.91A2 2 0 0 1 6.25 2.5H11.75A2 2 0 0 1 13.75 4.5V11.63', { tint: true }),
  body('M4.25 6.37V15.25L9 12L11.78 13.9', { tint: true }),
  stroke(seg(2.75, 2.75, 15.25, 15.25)),
]);

export const BookmarkStarIcon = /*#__PURE__*/ createIcon('BookmarkStar', () => [
  body(BOOKMARK, { tint: true }),
  ...inner(star(9, 7.6, 2.75, 1.4, 5, 0.5)),
]);

export const BookmarksIcon = /*#__PURE__*/ createIcon('Bookmarks', () => [
  body('M3.25 7.5A2 2 0 0 1 5.25 5.5H9.75A2 2 0 0 1 11.75 7.5V15.5L7.5 12.5L3.25 15.5Z', { tint: true }),
  stroke('M6.25 5.5V4.5A2 2 0 0 1 8.25 2.5H12.75A2 2 0 0 1 14.75 4.5V12.5L11.75 10.38'),
]);

// ---- stars --------------------------------------------------------------------------------------

function starPts(cx: number, cy: number, outer: number, innerR: number, points = 5): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < points * 2; i++) out.push(polar(cx, cy, i % 2 ? innerR : outer, (i * 180) / points));
  return out;
}

const STAR = starPts(9, 9.6, 7.25, 3.6);

export const StarHalfIcon = /*#__PURE__*/ createIcon('StarHalf', () => {
  const half = roundPolygon(1, ...flat([STAR[0]!, STAR[9]!, STAR[8]!, STAR[7]!, STAR[6]!, STAR[5]!]));
  return [
    body(star(9, 9.6, 7.25, 3.6, 5, 1), { tint: true, only: LINED }),
    mark(half, { only: LINED }),
    stroke(star(9, 9.6, 7.25, 3.6, 5, 1), { only: SOLID }),
    body(half, { only: SOLID }),
  ];
});

export const StarOffIcon = /*#__PURE__*/ createIcon('StarOff', () => splitBySlash(STAR, 1));

export const StarPlusIcon = /*#__PURE__*/ createIcon('StarPlus', () => [...withModifier(STAR, 1), ...plusMod()]);
export const StarCheckIcon = /*#__PURE__*/ createIcon('StarCheck', () => [...withModifier(STAR, 1), ...checkMod()]);

export const StarCircleIcon = /*#__PURE__*/ createIcon('StarCircle', () => [
  body(circle(9, 9, 7), { tint: true }),
  ...inner(star(9, 9.4, 3.9, 1.95, 5, 0.6)),
]);

export const StarsTrioIcon = /*#__PURE__*/ createIcon('StarsTrio', () => [
  body(star(7, 10.5, 5.25, 2.6, 5, 0.8), { tint: true }),
  mark(star(13.75, 4.75, 2.6, 1.2, 5, 0.4)),
  mark(star(14.5, 12.5, 2.2, 1, 5, 0.35)),
]);

// ---- awards -------------------------------------------------------------------------------------

/** Two ribbon tails that hang from a badge. */
const tails = (x1: number, y1: number): Part[] => {
  const pts = [x1, y1, 5.5, 16, 9, 13.75, 12.5, 16, 18 - x1, y1];
  return [
    stroke(roundPoly(0.75, ...pts), { only: LINED }),
    body(roundPolygon(0.75, ...pts), { only: SOLID }),
  ];
};

export const AwardIcon = /*#__PURE__*/ createIcon('Award', () => [
  body(circle(9, 6.75, 4.75), { tint: true }),
  ...inner(star(9, 6.9, 2.3, 1.15, 5, 0.4)),
  ...tails(6.25, 10.6),
]);

export const RosetteIcon = /*#__PURE__*/ createIcon('Rosette', () => [
  body(star(9, 6.75, 5.5, 4.4, 8, 1.2), { tint: true }),
  cut(circle(9, 6.75, 1.5)),
  ...tails(6.5, 10.9),
]);

export const MedalIcon = /*#__PURE__*/ createIcon('Medal', () => [
  body(circle(9, 11.25, 4.5), { tint: true }),
  cut(poly(7.9, 10.4, 9.4, 9.2, 9.4, 13.6)),
  stroke(poly(7.75, 6.95, 5.75, 2.25, 12.25, 2.25, 10.25, 6.95)),
]);

export const RibbonIcon = /*#__PURE__*/ createIcon('Ribbon', () => [
  body('M9 10.25C7 8.75 5.5 7.5 5.5 5.5A3.5 3.5 0 0 1 12.5 5.5C12.5 7.5 11 8.75 9 10.25Z', { tint: true }),
  stroke(poly(9, 10.25, 5.75, 16)),
  stroke(poly(9, 10.25, 12.25, 16)),
]);

export const TiaraIcon = /*#__PURE__*/ createIcon('Tiara', () => [
  body(roundPolygon(1, 2.5, 14.5, 4.5, 9.5, 6.75, 11.75, 9, 7.5, 11.25, 11.75, 13.5, 9.5, 15.5, 14.5), { tint: true }),
  mark(circle(4.5, 6, 1.25)),
  mark(circle(9, 4, 1.25)),
  mark(circle(13.5, 6, 1.25)),
]);

export const GemIcon = /*#__PURE__*/ createIcon('Gem', () => [
  body(roundPolygon(1, 5.25, 3.5, 12.75, 3.5, 16, 7.5, 9, 15, 2, 7.5), { tint: true }),
  cut(seg(2.5, 7.5, 15.5, 7.5)),
  cut(poly(7.25, 3.75, 6.25, 7.5, 9, 14.5, 11.75, 7.5, 10.75, 3.75)),
]);

export const FlameIcon = /*#__PURE__*/ createIcon('Flame', () => [
  body(
    'M9 15.75C6 15.75 3.75 13.5 3.75 10.75C3.75 8.25 5 6.5 6.25 5.25C7 4.5 7.25 3.5 7.25 2.25C9.5 3.25 10.5 5 10.75 6.75C12 7.5 14.25 8.75 14.25 11C14.25 13.75 12 15.75 9 15.75Z',
    { tint: true },
  ),
  cut('M9 13.25C7.9 13.25 7.25 12.5 7.25 11.7C7.25 10.5 8.4 10.2 9 8.9C9.8 10 10.75 10.6 10.75 11.7C10.75 12.5 10.1 13.25 9 13.25Z'),
]);

export const PinStarIcon = /*#__PURE__*/ createIcon('PinStar', () => [
  body('M9.6 15.3L13.19 11.06A5.5 5.5 0 1 0 4.81 11.06L8.4 15.3Q9 16 9.6 15.3Z', { tint: true }),
  ...inner(star(9, 7.6, 2.7, 1.35, 5, 0.5)),
]);

export const TrophyStarIcon = /*#__PURE__*/ createIcon('TrophyStar', () => [
  body('M4.75 2.5H13.25V6.75A4.25 4.25 0 0 1 4.75 6.75Z', { tint: true }),
  ...inner(star(9, 6.4, 2.4, 1.2, 5, 0.4)),
  stroke('M4.75 4H3.5A1.25 1.25 0 0 0 2.25 5.25C2.25 7 3.5 8.25 5.25 8.5'),
  stroke('M13.25 4H14.5A1.25 1.25 0 0 1 15.75 5.25C15.75 7 14.5 8.25 12.75 8.5'),
  stroke(seg(9, 11, 9, 15.5)),
  stroke(seg(5.75, 15.5, 12.25, 15.5)),
]);

