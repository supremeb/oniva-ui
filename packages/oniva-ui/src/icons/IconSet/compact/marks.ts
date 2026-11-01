import type { Part } from '../shapes';
import { LINED, SOLID, arc, body, circle, cut, dot, hole, join, poly, polar, rect, roundPolygon, seg, stroke } from '../shapes';

// Compact (12-unit grid) drawings. Keys are glyph names without the Icon suffix.

const DISC = circle(6, 6, 4.75);
const SQUARE = rect(1.75, 1.75, 8.5, 8.5, 1.5);

/** Gear outline for the 12 grid: six teeth, rounded. */
function gear(cx: number, cy: number, outer: number, inner: number, teeth: number): string {
  const c: number[] = [];
  const step = 360 / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    for (const [r, da] of [
      [inner, -step * 0.28],
      [outer, -step * 0.15],
      [outer, step * 0.15],
      [inner, step * 0.28],
    ] as const) {
      const [x, y] = polar(cx, cy, r, a + da);
      c.push(x, y);
    }
  }
  return roundPolygon(0.4, ...c);
}

/** Question-mark hook that curls onto a short stem ending at `end`. */
const QUESTION = join(arc(6, 4.25, 1.4, -90, 135), 'L6 6.25');

const [banA, banB] = [polar(6, 6, 4.75, 315), polar(6, 6, 4.75, 135)];

export const marks: Record<string, () => Part[]> = {
  Check: () => [stroke(poly(2.25, 6.25, 4.75, 8.75, 9.75, 3.5))],
  CheckDouble: () => [stroke(poly(1.5, 6.25, 3.5, 8.25, 7.25, 4.5)), stroke(poly(6, 7.5, 6.5, 8, 10.5, 4))],
  X: () => [stroke(seg(3, 3, 9, 9)), stroke(seg(9, 3, 3, 9))],
  Plus: () => [stroke(seg(6, 2.5, 6, 9.5)), stroke(seg(2.5, 6, 9.5, 6))],
  Minus: () => [stroke(seg(2.5, 6, 9.5, 6))],
  More: () => [dot(2.5, 6, 1), dot(6, 6, 1), dot(9.5, 6, 1)],
  MoreVertical: () => [dot(6, 2.5, 1), dot(6, 6, 1), dot(6, 9.5, 1)],
  Menu: () => [stroke(seg(1.75, 3, 10.25, 3)), stroke(seg(1.75, 6, 10.25, 6)), stroke(seg(1.75, 9, 10.25, 9))],
  Grip: () => [
    dot(4.25, 2.75, 0.9),
    dot(4.25, 6, 0.9),
    dot(4.25, 9.25, 0.9),
    dot(7.75, 2.75, 0.9),
    dot(7.75, 6, 0.9),
    dot(7.75, 9.25, 0.9),
  ],
  GripHorizontal: () => [
    dot(2.5, 4.25, 0.9),
    dot(6, 4.25, 0.9),
    dot(9.5, 4.25, 0.9),
    dot(2.5, 7.75, 0.9),
    dot(6, 7.75, 0.9),
    dot(9.5, 7.75, 0.9),
  ],
  Search: () => [
    body(circle(5.25, 5.25, 3.5), { tint: true }),
    stroke(seg(7.9, 7.9, 10.25, 10.25)),
    cut(arc(5.25, 5.25, 1.75, 270, 360), { only: SOLID }),
  ],
  Filter: () => [body(roundPolygon(0.75, 1.75, 2.5, 10.25, 2.5, 7.5, 5.75, 7.5, 9.5, 4.5, 10.5, 4.5, 5.75), { tint: true })],
  ListFilter: () => [stroke(seg(1.75, 3, 10.25, 3)), stroke(seg(3.25, 6, 8.75, 6)), stroke(seg(4.75, 9, 7.25, 9))],
  Sliders: () => [
    stroke(seg(6.25, 2.75, 10.5, 2.75)),
    stroke(seg(1.5, 6, 5.75, 6)),
    stroke(seg(1.5, 9.25, 3, 9.25)),
    stroke(seg(9, 9.25, 10.5, 9.25)),
    body(circle(3.5, 2.75, 1.25), { tint: true }),
    body(circle(8.5, 6, 1.25), { tint: true }),
    body(circle(6, 9.25, 1.25), { tint: true }),
  ],
  Settings: () => [body(gear(6, 6, 4.9, 3.7, 6), { tint: true }), cut(circle(6, 6, 1.5))],
  Loader: () => [stroke(circle(6, 6, 4.75), { only: 'duo', soft: true }), stroke(arc(6, 6, 4.75, 0, 270))],
  CircleCheck: () => [body(DISC, { tint: true }), cut(poly(3.75, 6.25, 5.25, 7.75, 8.25, 4.5))],
  CircleX: () => [body(DISC, { tint: true }), cut(seg(4.25, 4.25, 7.75, 7.75)), cut(seg(7.75, 4.25, 4.25, 7.75))],
  CircleAlert: () => [body(DISC, { tint: true }), cut(seg(6, 3.5, 6, 6.25)), hole(6, 8.25, 0.75)],
  Info: () => [body(DISC, { tint: true }), cut(seg(6, 5.5, 6, 8.5)), hole(6, 3.75, 0.75)],
  CircleHelp: () => [body(DISC, { tint: true }), cut(QUESTION), hole(6, 8.5, 0.75)],
  TriangleAlert: () => [
    body(roundPolygon(1, 6, 1.75, 10.75, 10, 1.25, 10), { tint: true }),
    cut(seg(6, 4.75, 6, 6.75)),
    hole(6, 8.4, 0.7),
  ],
  CirclePlus: () => [body(DISC, { tint: true }), cut(seg(6, 3.75, 6, 8.25)), cut(seg(3.75, 6, 8.25, 6))],
  CircleMinus: () => [body(DISC, { tint: true }), cut(seg(3.75, 6, 8.25, 6))],
  SquareCheck: () => [body(SQUARE, { tint: true }), cut(poly(3.75, 6.25, 5.25, 7.75, 8.25, 4.5))],
  Square: () => [body(SQUARE, { tint: true })],
  Circle: () => [body(DISC, { tint: true })],
  CircleDot: () => [
    body(DISC, { tint: true }),
    dot(6, 6, 1.75, { only: LINED }),
    cut(circle(6, 6, 2.5), { only: SOLID }),
  ],
  Ban: () => [body(DISC, { tint: true }), cut(seg(banA[0], banA[1], banB[0], banB[1]))],
  OctagonAlert: () => [
    body(roundPolygon(1, 4.25, 1.5, 7.75, 1.5, 10.5, 4.25, 10.5, 7.75, 7.75, 10.5, 4.25, 10.5, 1.5, 7.75, 1.5, 4.25), {
      tint: true,
    }),
    cut(seg(6, 3.5, 6, 6.25)),
    hole(6, 8.25, 0.75),
  ],
};
