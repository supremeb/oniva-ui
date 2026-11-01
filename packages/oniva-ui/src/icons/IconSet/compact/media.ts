import type { Part } from '../shapes';
import { arc, body, circle, cut, hole, LINED, poly, polar, rect, roundPoly, roundPolygon, seg, SOLID, stroke } from '../shapes';

// Compact (12-unit grid) drawings. Keys are glyph names without the Icon suffix.

const SPEAKER: number[] = [1.5, 4.25, 3.25, 4.25, 5.75, 2.25, 5.75, 9.75, 3.25, 7.75, 1.5, 7.75];
const speaker = (): Part => body(roundPolygon(0.5, ...SPEAKER), { tint: true });

/** Leaned frame: u runs along `deg` from the origin, v across it. */
const axis = (ox: number, oy: number, deg: number) => {
  const [ux, uy] = polar(0, 0, 1, deg);
  const [vx, vy] = polar(0, 0, 1, deg + 90);
  return (u: number, v: number): [number, number] => [ox + u * ux + v * vx, oy + u * uy + v * vy];
};

const through = (at: ReturnType<typeof axis>, ...c: number[]): number[] => {
  const out: number[] = [];
  for (let i = 0; i + 1 < c.length; i += 2) out.push(...at(c[i]!, c[i + 1]!));
  return out;
};

const wheel = (cx: number, cy: number, r = 1.25): Part => body(circle(cx, cy, r));

export const media: Record<string, () => Part[]> = {
  Play: () => [body(roundPolygon(0.75, 3.75, 2.25, 10, 6, 3.75, 9.75), { tint: true })],
  Pause: () => [
    body(rect(2.75, 2.5, 2.25, 7, 0.75), { tint: true }),
    body(rect(7, 2.5, 2.25, 7, 0.75), { tint: true }),
  ],
  Stop: () => [body(rect(2.75, 2.75, 6.5, 6.5, 1.25), { tint: true })],
  SkipForward: () => [
    body(roundPolygon(0.75, 2.25, 2.5, 7.5, 6, 2.25, 9.5), { tint: true }),
    stroke(seg(9.75, 2.5, 9.75, 9.5)),
  ],
  SkipBack: () => [
    body(roundPolygon(0.75, 9.75, 2.5, 4.5, 6, 9.75, 9.5), { tint: true }),
    stroke(seg(2.25, 2.5, 2.25, 9.5)),
  ],
  Volume: () => [speaker(), stroke(arc(6.25, 6, 2.25, 40, 140)), stroke(arc(6.25, 6, 4.5, 45, 135))],
  VolumeMute: () => [speaker(), stroke(seg(7.75, 4.5, 10.5, 7.5)), stroke(seg(10.5, 4.5, 7.75, 7.5))],
  MusicNote: () => [body(circle(4.5, 8.75, 1.5), { tint: true }), stroke('M6 8.75V2.5Q8.75 2.75 9.5 5.5')],
  ShoppingCart: () => [
    body(roundPolygon(0.75, 3, 3.75, 10.5, 3.75, 9.25, 7.75, 4, 7.75), { tint: true }),
    stroke(poly(1.5, 2.25, 2.5, 2.25, 4, 7.75)),
    { k: 'dot', d: circle(5, 9.75, 0.75) },
    { k: 'dot', d: circle(8.25, 9.75, 0.75) },
  ],
  ShoppingBag: () => [
    body(rect(2, 4.25, 8, 6.25, 1.5), { tint: true }),
    stroke('M4.5 4.25V3.5A1.5 1.5 0 0 1 7.5 3.5V4.25'),
    hole(4.5, 7, 0.75),
    hole(7.5, 7, 0.75),
  ],
  CreditCard: () => [
    body(rect(1.25, 2.25, 9.5, 7.5, 1.5), { tint: true }),
    cut(seg(1.25, 4.75, 10.75, 4.75)),
    cut(seg(3.5, 7.5, 5.5, 7.5)),
  ],
  Wallet: () => [
    body(rect(1.25, 2.5, 9.5, 7.5, 1.5), { tint: true }),
    cut('M10.75 4.5H8A1 1 0 0 0 7 5.5V7A1 1 0 0 0 8 8H10.75'),
    hole(8.9, 6.25, 0.75),
  ],
  Receipt: () => [
    body('M2.5 3A1.5 1.5 0 0 1 4 1.5H8A1.5 1.5 0 0 1 9.5 3V10.5L7.75 9.5L6 10.5L4.25 9.5L2.5 10.5Z', { tint: true }),
    cut(seg(4.5, 4, 7.5, 4)),
    cut(seg(4.5, 6.5, 6.5, 6.5)),
  ],
  Ticket: () => [
    body(
      'M2.75 2.5H9.25A1.5 1.5 0 0 1 10.75 4V4.75A1.25 1.25 0 0 0 10.75 7.25V8A1.5 1.5 0 0 1 9.25 9.5H2.75A1.5 1.5 0 0 1 1.25 8V7.25A1.25 1.25 0 0 0 1.25 4.75V4A1.5 1.5 0 0 1 2.75 2.5Z',
      { tint: true },
    ),
    cut(seg(7.25, 4.25, 7.25, 7.75)),
  ],
  Coins: () => [stroke(arc(7.25, 4.75, 3, -60, 150)), body(circle(4.5, 7.5, 3), { tint: true })],
  Truck: () => [
    body(roundPolygon(0.75, 1.5, 2.5, 7.25, 2.5, 7.25, 4.25, 9.25, 4.25, 10.5, 6.25, 10.5, 8, 1.5, 8), { only: SOLID }),
    cut(circle(3.75, 8.75, 2.5), { only: SOLID }),
    cut(circle(8.5, 8.75, 2.5), { only: SOLID }),
    stroke(
      'M2.5 8A1 1 0 0 1 1.5 7V3.5A1 1 0 0 1 2.5 2.5H6.25A1 1 0 0 1 7.25 3.5V4.25H8.6A1 1 0 0 1 9.4 4.65L10.3 5.9A1 1 0 0 1 10.5 6.5V7A1 1 0 0 1 9.5 8',
      { only: LINED },
    ),
    stroke(seg(7.25, 4.25, 7.25, 8), { only: LINED }),
    wheel(3.75, 8.75),
    wheel(8.5, 8.75),
  ],
  Plane: () => {
    const at = axis(6, 6, 45);
    const right: [number, number][] = [
      [5.25, 0],
      [3.75, 0.9],
      [1.25, 0.9],
      [-1.5, 4],
      [-2.5, 4],
      [-2, 0.9],
      [-3.75, 0.9],
      [-4.25, 2],
      [-5, 2],
      [-5, 0],
    ];
    const left = right
      .slice(1, -1)
      .map(([u, v]): [number, number] => [u, -v])
      .reverse();
    return [body(roundPolygon(0.5, ...through(at, ...[...right, ...left].flat())), { tint: true })];
  },
  Sun: () => [
    body(circle(6, 6, 1.75), { tint: true }),
    ...[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
      const [x0, y0] = polar(6, 6, 3.5, a);
      const [x1, y1] = polar(6, 6, 4.5, a);
      return stroke(seg(x0, y0, x1, y1));
    }),
  ],
  Moon: () => [body('M5.45 2A4.25 4.25 0 1 0 9.73 6.67A3.4 3.4 0 0 1 5.45 2Z', { tint: true })],
  Lightbulb: () => [
    body('M4.75 8.25C4.75 7.25 2.75 6.75 2.75 4.75A3.25 3.25 0 0 1 9.25 4.75C9.25 6.75 7.25 7.25 7.25 8.25Z', {
      tint: true,
    }),
    stroke(seg(4.75, 10.25, 7.25, 10.25)),
  ],
  Flame: () => [
    body(
      'M6 10.5C4 10.5 2.5 9 2.5 7.25C2.5 5.5 3.5 4.5 4.25 3.5C4.75 2.9 4.9 2.2 4.9 1.5C6.5 2.1 7.2 3.4 7.4 4.6C8.3 5.2 9.5 6 9.5 7.5C9.5 9.2 8 10.5 6 10.5Z',
      { tint: true },
    ),
  ],
  Droplet: () => [body('M6 1.75Q2.75 5 2.75 7.25A3.25 3.25 0 0 0 9.25 7.25Q9.25 5 6 1.75Z', { tint: true })],
  Palette: () => [
    body('M10.7 6.5A4.75 4.75 0 1 0 6.5 10.7Q6.2 8.9 7.5 7.9Q8.5 6.9 10.7 6.5Z', { tint: true }),
    hole(3.75, 5.5, 0.75),
    hole(5.5, 3.75, 0.75),
    hole(7.75, 4.25, 0.75),
  ],
  Brush: () => {
    const at = axis(2, 10, 45);
    const bristles = (() => {
      const t = at(0, 0);
      const [a, b] = [at(2.5, -1.75), at(4.5, -1.5)];
      const [c, d] = [at(4.5, 1.5), at(2.5, 1.75)];
      return `M${t.join(' ')}Q${a.join(' ')} ${b.join(' ')}L${c.join(' ')}Q${d.join(' ')} ${t.join(' ')}Z`;
    })();
    return [
      stroke(poly(...at(6.75, 0), ...at(9.5, 0))),
      body(roundPolygon(0.5, ...through(at, 4.5, -1.5, 6.75, -1.5, 6.75, 1.5, 4.5, 1.5))),
      body(bristles, { tint: true }),
    ];
  },
  Shapes: () => [
    body(roundPolygon(0.5, 6, 1.5, 8.75, 5, 3.25, 5)),
    body(circle(3.25, 8.75, 1.5), { tint: true }),
    body(rect(6.75, 7, 3.5, 3.5, 0.75)),
  ],
  Frame: () => [
    body(rect(4.25, 4.25, 3.5, 3.5, 0), { tint: true }),
    stroke(seg(4.25, 1.5, 4.25, 4.25)),
    stroke(seg(7.75, 1.5, 7.75, 4.25)),
    stroke(seg(4.25, 7.75, 4.25, 10.5)),
    stroke(seg(7.75, 7.75, 7.75, 10.5)),
    stroke(seg(1.5, 4.25, 4.25, 4.25)),
    stroke(seg(1.5, 7.75, 4.25, 7.75)),
    stroke(seg(7.75, 4.25, 10.5, 4.25)),
    stroke(seg(7.75, 7.75, 10.5, 7.75)),
  ],
  Layers: () => [
    body(roundPolygon(0.75, 6, 1.5, 10.5, 3.75, 6, 6, 1.5, 3.75), { tint: true }),
    stroke(roundPoly(0.75, 1.5, 6, 6, 8.25, 10.5, 6)),
    stroke(roundPoly(0.75, 1.5, 8.25, 6, 10.5, 10.5, 8.25)),
  ],
  Presentation: () => [
    stroke(seg(1.5, 2, 10.5, 2)),
    body(rect(2.5, 2, 7, 5.25, [0, 0, 1.5, 1.5]), { tint: true }),
    stroke(seg(6, 7.25, 6, 8.5)),
    stroke(poly(4.5, 10.5, 6, 8.5, 7.5, 10.5)),
  ],
  Contact: () => [
    body(rect(1.25, 2.5, 9.5, 7, 1.5), { tint: true }),
    hole(4.25, 4.75, 1),
    { k: 'hole', d: 'M2.75 8A1.5 1.25 0 0 1 5.75 8Z' },
    cut(seg(7, 4.75, 8.75, 4.75)),
    cut(seg(7, 7, 8.25, 7)),
  ],
};
