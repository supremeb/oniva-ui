import type { Part } from '../shapes';
import {
  arc,
  body,
  circle,
  cut,
  dot,
  ellipse,
  hole,
  join,
  LINED,
  mark,
  polar,
  poly,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  SOLID,
  sparkle,
  stroke,
} from '../shapes';

// Compact (12-unit grid) drawings. Keys are glyph names without the Icon suffix.

const f = (v: number) => String(Math.round(v * 1000) / 1000);

/** Local frame for diagonal glyphs: `u` runs toward `deg` (0 = up, 90 = right), `v` across it. */
function frame(cx: number, cy: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return (u: number, v: number): string => `${f(cx + u * c - v * s)} ${f(cy + u * s + v * c)}`;
}

type Lobe = readonly [cx: number, cy: number, r: number];

const bearing = (cx: number, cy: number, x: number, y: number) =>
  ((Math.atan2(x - cx, cy - y) * 180) / Math.PI + 360) % 360;

function meet([ax, ay, ar]: Lobe, [bx, by, br]: Lobe): [number, number] {
  const d = Math.hypot(bx - ax, by - ay);
  const a = (ar * ar - br * br + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, ar * ar - a * a));
  const mx = ax + ((bx - ax) * a) / d;
  const my = ay + ((by - ay) * a) / d;
  const p1: [number, number] = [mx + ((by - ay) * h) / d, my - ((bx - ax) * h) / d];
  const p2: [number, number] = [mx - ((by - ay) * h) / d, my + ((bx - ax) * h) / d];
  return p1[1] < p2[1] ? p1 : p2;
}

/** Closed cloud from three lobes with a flat base. */
function cloud(left: Lobe, top: Lobe, right: Lobe): string {
  const lobes = [left, top, right];
  const pts: [number, number][] = [
    [left[0], left[1] + left[2]],
    meet(left, top),
    meet(top, right),
    [right[0], right[1] + right[2]],
  ];
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  lobes.forEach(([cx, cy, r], i) => {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[i + 1]!;
    const sweep = (bearing(cx, cy, x1, y1) - bearing(cx, cy, x0, y0) + 360) % 360;
    d += `A${f(r)} ${f(r)} 0 ${sweep > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)}`;
  });
  return `${d}Z`;
}

/** Battery shell with its terminal nub built into the outline. */
const BATTERY =
  'M2.75 3H7.75A1.5 1.5 0 0 1 9.25 4.5V5H10A0.5 0.5 0 0 1 10.5 5.5V6.5A0.5 0.5 0 0 1 10 7H9.25V7.5A1.5 1.5 0 0 1 7.75 9H2.75A1.5 1.5 0 0 1 1.25 7.5V4.5A1.5 1.5 0 0 1 2.75 3Z';

const WIFI_X = 6;
const WIFI_Y = 9.5;

export const tech: Record<string, () => Part[]> = {
  Database: () => [
    body('M2 3.25V8.5C2 9.4 3.8 10.25 6 10.25S10 9.4 10 8.5V3.25Z', { tint: true }),
    body(ellipse(6, 3.25, 4, 1.5)),
    stroke('M2 6C2 6.9 3.8 7.5 6 7.5S10 6.9 10 6', { only: LINED }),
    cut('M2 3.25C2 4.15 3.8 4.75 6 4.75S10 4.15 10 3.25', { only: SOLID }),
    cut('M2 6.25C2 7.15 3.8 7.75 6 7.75S10 7.15 10 6.25', { only: SOLID }),
  ],

  Server: () => [
    body(rect(1.5, 1.5, 9, 3.25, 1.25), { tint: true }),
    body(rect(1.5, 7.25, 9, 3.25, 1.25), { tint: true }),
    hole(3.75, 3.125, 0.75),
    hole(3.75, 8.875, 0.75),
    cut(seg(6.5, 3.125, 8.25, 3.125)),
    cut(seg(6.5, 8.875, 8.25, 8.875)),
  ],

  Cloud: () => [
    body(
      cloud([3.5, 7.5, 1.75], [6, 5.5, 2.75], [8.5, 7.5, 1.75]),
      { tint: true },
    ),
  ],

  Code: () => [stroke(poly(4, 3.75, 1.5, 6, 4, 8.25)), stroke(poly(8, 3.75, 10.5, 6, 8, 8.25))],

  Terminal: () => [
    body(rect(1.25, 2.25, 9.5, 7.5, 1.5), { tint: true }),
    cut(poly(3.5, 4.5, 5.25, 6, 3.5, 7.5)),
    cut(seg(6.75, 7.5, 8.5, 7.5)),
  ],

  Cpu: () => [
    body(rect(3, 3, 6, 6, 1.25), { tint: true }),
    hole(6, 6, 0.9),
    stroke(seg(4.75, 1.5, 4.75, 3)),
    stroke(seg(7.25, 1.5, 7.25, 3)),
    stroke(seg(4.75, 9, 4.75, 10.5)),
    stroke(seg(7.25, 9, 7.25, 10.5)),
    stroke(seg(1.5, 4.75, 3, 4.75)),
    stroke(seg(1.5, 7.25, 3, 7.25)),
    stroke(seg(9, 4.75, 10.5, 4.75)),
    stroke(seg(9, 7.25, 10.5, 7.25)),
  ],

  Monitor: () => [
    body(rect(1.25, 1.75, 9.5, 6.5, 1.5), { tint: true }),
    stroke(join(seg(6, 8.25, 6, 10.25), seg(4, 10.25, 8, 10.25))),
  ],

  Laptop: () => [body(rect(2.25, 2, 7.5, 5.5, 1.25), { tint: true }), stroke(seg(1.5, 9.5, 10.5, 9.5))],

  Smartphone: () => [
    body(rect(3.25, 1.5, 5.5, 9, 1.5), { tint: true }),
    cut(seg(5.25, 3.5, 6.75, 3.5)),
    hole(6, 8.5, 0.75),
  ],

  Tablet: () => [body(rect(2, 1.5, 8, 9, 1.5), { tint: true }), hole(6, 8.5, 0.75)],

  Printer: () => [
    body(rect(1.5, 4.5, 9, 3.75, 1.25), { tint: true }),
    stroke(roundPoly(0.75, 3.5, 4.5, 3.5, 1.75, 8.5, 1.75, 8.5, 4.5)),
    stroke(roundPoly(0.75, 3.5, 8.25, 3.5, 10.25, 8.5, 10.25, 8.5, 8.25)),
    hole(8.5, 6.375, 0.65),
  ],

  Wifi: () => [
    stroke(arc(WIFI_X, WIFI_Y, 2.5, -45, 45)),
    stroke(arc(WIFI_X, WIFI_Y, 5, -42, 42)),
    dot(WIFI_X, WIFI_Y, 0.85),
  ],

  Battery: () => [
    body(BATTERY, { tint: true }),
    cut(seg(3.75, 4.75, 3.75, 7.25)),
    cut(seg(6.25, 4.75, 6.25, 7.25)),
  ],

  Plug: () => [
    stroke(seg(4.5, 1.5, 4.5, 3.5)),
    stroke(seg(7.5, 1.5, 7.5, 3.5)),
    body('M3 3.5H9V5.5A3 3 0 0 1 3 5.5Z', { tint: true }),
    stroke(seg(6, 8.5, 6, 10.5)),
  ],

  Router: () => [
    body(rect(1.25, 6, 9.5, 4, 1.5), { tint: true }),
    stroke(seg(3.5, 1.5, 3.5, 6)),
    stroke(seg(8.5, 1.5, 8.5, 6)),
    hole(3.5, 8, 0.6),
    hole(6, 8, 0.6),
    hole(8.5, 8, 0.6),
  ],

  Network: () => [
    body(rect(4.25, 1.5, 3.5, 3, 0.75), { tint: true }),
    body(rect(1.5, 7.5, 3.5, 3, 0.75)),
    body(rect(7, 7.5, 3.5, 3, 0.75)),
    stroke(seg(6, 4.5, 6, 6)),
    stroke(roundPoly(1, 3.25, 7.5, 3.25, 6, 8.75, 6, 8.75, 7.5)),
  ],

  Webhook: () => {
    const cx = 6;
    const cy = 6.75;
    const r = 3.75;
    const nodes = [0, 120, 240];
    return [
      ...nodes.map((a) => {
        const [x, y] = polar(cx, cy, r, a);
        return body(circle(x, y, 1.25));
      }),
      ...nodes.map((a) => stroke(arc(cx, cy, r, a + 37, a + 83))),
    ];
  },

  Branch: () => [
    body(circle(3.25, 2.75, 1.25)),
    body(circle(3.25, 9.25, 1.25)),
    body(circle(8.75, 2.75, 1.25)),
    stroke(seg(3.25, 4, 3.25, 8)),
    stroke('M8.75 4A2.75 2.75 0 0 1 6 6.75H3.25'),
  ],

  Container: () => [
    body(rect(1.25, 2.5, 9.5, 7, 1.5), { tint: true }),
    cut(seg(3.75, 4.5, 3.75, 7.5)),
    cut(seg(6, 4.5, 6, 7.5)),
    cut(seg(8.25, 4.5, 8.25, 7.5)),
  ],

  Bot: () => [
    body(rect(2.5, 4.5, 7, 5.5, 1.5), { tint: true }),
    stroke(seg(6, 4.5, 6, 3)),
    dot(6, 2.25, 0.85),
    stroke(seg(1.5, 7.25, 2.5, 7.25)),
    stroke(seg(9.5, 7.25, 10.5, 7.25)),
    cut(seg(4.75, 6.75, 4.75, 7.75)),
    cut(seg(7.25, 6.75, 7.25, 7.75)),
  ],

  Sparkles: () => [body(sparkle(4.75, 7.25, 3.25), { tint: true }), mark(sparkle(9, 3, 1.75, 0.2))],

  Zap: () => [
    body(roundPolygon(0.6, 7, 1.75, 2.75, 6.75, 5.75, 6.75, 4.75, 10.25, 9.25, 5.25, 6.25, 5.25), { tint: true }),
  ],

  Rocket: () => {
    const p = frame(6, 6, 45);
    return [
      body(`M${p(-2, -1.67)}L${p(0.67, -1.67)}Q${p(3.33, -1.67)} ${p(4.67, 0)}Q${p(3.33, 1.67)} ${p(0.67, 1.67)}L${p(-2, 1.67)}Z`, {
        tint: true,
      }),
      body(`M${p(0, -1.67)}L${p(-2, -3.5)}L${p(-2, -1.67)}Z`),
      body(`M${p(0, 1.67)}L${p(-2, 3.5)}L${p(-2, 1.67)}Z`),
      hole(...(p(1.2, 0).split(' ').map(Number) as [number, number]), 0.7),
      stroke(`M${p(-3.5, 0)}L${p(-4.6, 0)}`),
    ];
  },

  Wrench: () => {
    const p = frame(7.25, 4.75, 45);
    return [
      body(
        `M${p(-6.25, -1.25)}L${p(-2.727, -1.25)}A3 3 0 0 1 ${p(2.727, -1.25)}L${p(1.25, -1.25)}` +
          `A1.25 1.25 0 0 0 ${p(1.25, 1.25)}L${p(2.727, 1.25)}A3 3 0 0 1 ${p(-2.727, 1.25)}L${p(-6.25, 1.25)}` +
          `A1.25 1.25 0 0 1 ${p(-6.25, -1.25)}Z`,
        { tint: true },
      ),
    ];
  },

  Puzzle: () => [
    body(
      'M2.75 4H3.55A1.4 1.4 0 1 1 5.95 4H7A1 1 0 0 1 8 5V5.4A1.4 1.4 0 1 1 8 7.8V9.25A1 1 0 0 1 7 10.25H2.75' +
        'A1 1 0 0 1 1.75 9.25V7.9A1.4 1.4 0 1 0 1.75 5.5V5A1 1 0 0 1 2.75 4Z',
      { tint: true },
    ),
  ],

  Cube: () => [
    body(roundPolygon(0.75, 6, 1.5, 9.9, 3.75, 9.9, 8.25, 6, 10.5, 2.1, 8.25, 2.1, 3.75), { tint: true }),
    cut(poly(2.1, 3.75, 6, 6, 9.9, 3.75)),
    cut(seg(6, 6, 6, 10.5)),
  ],

  Keyboard: () => [
    body(rect(1.25, 2.75, 9.5, 6.5, 1.5), { tint: true }),
    hole(3.75, 4.75, 0.65),
    hole(6, 4.75, 0.65),
    hole(8.25, 4.75, 0.65),
    cut(seg(4, 7, 8, 7)),
  ],

  Speaker: () => [
    body(rect(2.75, 1.5, 6.5, 9, 1.5), { tint: true }),
    hole(6, 3.5, 0.65),
    cut(circle(6, 7, 1.4)),
  ],

  Headphones: () => [
    stroke('M2.75 7V5.75A3.25 3.25 0 0 1 9.25 5.75V7'),
    body(rect(1.5, 7, 2.5, 3.5, 1.25), { tint: true }),
    body(rect(8, 7, 2.5, 3.5, 1.25), { tint: true }),
  ],
};
