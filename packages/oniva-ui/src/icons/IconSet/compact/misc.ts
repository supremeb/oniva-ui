import type { Part } from '../shapes';
import {
  LINED,
  SOLID,
  arc,
  body,
  circle,
  cut,
  dot,
  head,
  hole,
  poly,
  polar,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  stroke,
} from '../shapes';

/** Local frame for a 45 degree axis on the 12 grid: u runs bottom-left to top-right, v top-left to bottom-right. */
const diag = (cx: number, cy: number) => (u: number, v: number) => {
  const k = Math.SQRT1_2;
  return [cx + (u + v) * k, cy + (v - u) * k] as const;
};

/** Pointed oval (leaf) along the 45 degree axis. */
const leafShape = (cx: number, cy: number, half: number, wid: number): string => {
  const p = diag(cx, cy);
  const pt = (u: number, v: number) => p(u, v).map((n) => Math.round(n * 1000) / 1000).join(' ');
  return `M${pt(-half, 0)}Q${pt(0, -wid * 2)} ${pt(half, 0)}Q${pt(0, wid * 2)} ${pt(-half, 0)}Z`;
};

/** Two ribbon tails under a badge. */
const tails = (x1: number, y1: number): Part[] => {
  const pts = [x1, y1, 3.75, 10.5, 6, 9, 8.25, 10.5, 12 - x1, y1];
  return [stroke(roundPoly(0.5, ...pts), { only: LINED }), body(roundPolygon(0.5, ...pts), { only: SOLID })];
};

const sirenRay = (deg: number, r0: number, r1: number): Part => {
  const [x1, y1] = polar(6, 7.5, r0, deg);
  const [x2, y2] = polar(6, 7.5, r1, deg);
  return stroke(seg(x1, y1, x2, y2));
};

export const misc: Record<string, () => Part[]> = {
  Hash: () => [
    stroke(seg(5, 2.5, 4, 9.5)),
    stroke(seg(8, 2.5, 7, 9.5)),
    stroke(seg(2, 4.5, 10, 4.5)),
    stroke(seg(2, 7.5, 10, 7.5)),
  ],

  At: () => {
    const [ex, ey] = polar(6, 6, 4.5, 150);
    return [
      stroke(circle(6, 6, 1.75)),
      stroke(`M7.75 4.5V6.5A1.375 1.375 0 0 0 10.5 6.5V6A4.5 4.5 0 1 0 ${ex} ${ey}`),
    ];
  },

  Command: () => [
    stroke(
      'M4.75 3.25A1.5 1.5 0 1 0 3.25 4.75H8.75A1.5 1.5 0 1 0 7.25 3.25V8.75A1.5 1.5 0 1 0 8.75 7.25H3.25A1.5 1.5 0 1 0 4.75 8.75Z',
    ),
  ],

  SortAscending: () => [
    stroke(seg(3.25, 10, 3.25, 2)),
    stroke(head(3.25, 2, 0, 2.5)),
    stroke(seg(7, 3, 8.5, 3)),
    stroke(seg(7, 6, 9.5, 6)),
    stroke(seg(7, 9, 10.5, 9)),
  ],

  SortDescending: () => [
    stroke(seg(3.25, 2, 3.25, 10)),
    stroke(head(3.25, 10, 180, 2.5)),
    stroke(seg(7, 3, 10.5, 3)),
    stroke(seg(7, 6, 9.5, 6)),
    stroke(seg(7, 9, 8.5, 9)),
  ],

  Workflow: () => [
    body(rect(1.5, 1.5, 4, 4, 1), { tint: true }),
    body(rect(6.5, 6.5, 4, 4, 1), { tint: true }),
    stroke(roundPoly(1, 3.5, 5.5, 3.5, 8.5, 6.5, 8.5)),
  ],

  Fingerprint: () => [
    stroke('M1.5 8V6A4.5 4.5 0 0 1 10.5 6V7'),
    stroke('M3.75 10V6A2.25 2.25 0 0 1 8.25 6V8.75'),
    stroke('M6 6V8.5Q6 9.75 5.25 10.5'),
  ],

  Vault: () => [
    body(rect(1.5, 1.5, 9, 7.5, 1.5), { tint: true }),
    cut(circle(4.75, 5.25, 1.25)),
    cut(seg(8, 5.25, 8.75, 5.25)),
    stroke(seg(3.5, 9, 3.5, 10.5)),
    stroke(seg(8.5, 9, 8.5, 10.5)),
  ],

  Cast: () => [
    stroke('M9 9.5A1.5 1.5 0 0 0 10.5 8V3.5A1.5 1.5 0 0 0 9 2H3A1.5 1.5 0 0 0 1.5 3.5'),
    stroke(arc(2.25, 9.25, 3, 20, 90)),
    stroke(arc(2.25, 9.25, 5.25, 25, 80)),
    dot(2.25, 9.25, 0.9),
  ],

  Disc: () => [body(circle(6, 6, 4.75), { tint: true }), cut(circle(6, 6, 1.4))],

  Tv: () => [
    body(rect(1.5, 3.75, 9, 6.25, 1.5), { tint: true }),
    stroke(poly(4.25, 1.5, 6, 3.75, 7.75, 1.5)),
  ],

  Watch: () => [
    body(circle(6, 6, 3.25), { tint: true }),
    stroke('M4.75 3L5.1 1.5H6.9L7.25 3'),
    stroke('M4.75 9L5.1 10.5H6.9L7.25 9'),
    cut(poly(6, 4.75, 6, 6, 7, 6.75)),
  ],

  Siren: () => [
    body('M3.75 8.25V7.25A2.25 2.25 0 0 1 8.25 7.25V8.25Z', { tint: true }),
    body(rect(2, 8.25, 8, 2.25, 1)),
    sirenRay(0, 4.4, 6),
    sirenRay(-52, 4.25, 5.5),
    sirenRay(52, 4.25, 5.5),
  ],

  Bug: () => [
    stroke(poly(5, 4.25, 4.25, 2)),
    stroke(poly(7, 4.25, 7.75, 2)),
    body('M3.5 7C3.5 5.25 4.5 4.25 6 4.25S8.5 5.25 8.5 7C8.5 9 7.5 10.25 6 10.25S3.5 9 3.5 7Z', { tint: true }),
    cut(seg(6, 5.5, 6, 9)),
    stroke(seg(3.6, 6, 1.5, 4.75)),
    stroke(seg(3.6, 8.5, 1.5, 9.75)),
    stroke(seg(8.4, 6, 10.5, 4.75)),
    stroke(seg(8.4, 8.5, 10.5, 9.75)),
  ],

  Flask: () => [
    body('M4.75 1.75V5L2.25 9.25Q1.6 10.5 3 10.5H9Q10.4 10.5 9.75 9.25L7.25 5V1.75Z', { tint: true }),
    stroke(seg(3.75, 1.75, 8.25, 1.75)),
    cut(seg(3.25, 7.5, 8.75, 7.5)),
  ],

  GraduationCap: () => [
    stroke('M3.5 5.75V8Q6 10 8.5 8V5.75'),
    body(roundPolygon(0.75, 6, 2, 10.75, 4.5, 6, 7, 1.25, 4.5), { tint: true }),
    stroke(seg(10.75, 4.5, 10.75, 7.75)),
  ],

  Leaf: () => {
    const [vx0, vy0] = diag(6.2, 5.8)(-2, 0);
    const [vx1, vy1] = diag(6.2, 5.8)(2, 0);
    const [sx0, sy0] = diag(6.2, 5.8)(-4, 0);
    const [sx1, sy1] = diag(6.2, 5.8)(-5.5, 0);
    return [body(leafShape(6.2, 5.8, 4, 2.4), { tint: true }), cut(seg(vx0, vy0, vx1, vy1)), stroke(seg(sx0, sy0, sx1, sy1))];
  },

  Tree: () => [
    body(roundPolygon(0.5, 6, 1.75, 8.5, 5, 7.5, 5, 9.5, 8, 2.5, 8, 4.5, 5, 3.5, 5), { tint: true }),
    stroke(seg(6, 8, 6, 10.5)),
  ],

  Coffee: () => [
    body('M2 5.5H8V7Q8 10 5.5 10H4.5Q2 10 2 7Z', { tint: true }),
    stroke('M8 6.25H8.5Q10.25 6.25 10.25 7.5Q10.25 8.75 8.5 8.75H8'),
    stroke('M3.75 1.5Q4.5 2.5 3.75 3.5', { soft: true }),
    stroke('M6.25 1.5Q7 2.5 6.25 3.5', { soft: true }),
  ],

  Utensils: () => [
    stroke('M2.5 1.75V4.25Q2.5 6 4 6Q5.5 6 5.5 4.25V1.75'),
    stroke(seg(4, 6, 4, 10.25)),
    body('M8 1.75Q10 2.25 10 6H8Z', { tint: true }),
    stroke(seg(8, 6, 8, 10.25)),
  ],

  Umbrella: () => [
    body('M1.5 6A4.5 4.5 0 0 1 10.5 6A1.5 1.5 0 0 0 7.5 6A1.5 1.5 0 0 0 4.5 6A1.5 1.5 0 0 0 1.5 6Z', { tint: true }),
    cut('M6 1.5Q4.25 3.25 4.5 6'),
    cut('M6 1.5Q7.75 3.25 7.5 6'),
    stroke('M6 7.5V9.25A1.25 1.25 0 0 1 3.5 9.25'),
  ],

  Anchor: () => [
    body(circle(6, 2.75, 1.25), { tint: true }),
    stroke(seg(6, 4, 6, 10.5)),
    stroke(seg(4.25, 6.25, 7.75, 6.25)),
    stroke('M2 7.5A4 3 0 0 0 10 7.5'),
  ],

  Compass: () => [
    body(circle(6, 6, 4.75), { tint: true }),
    cut(roundPolygon(0.4, 8, 4, 6.9, 6.9, 4, 8, 5.1, 5.1)),
  ],

  Mountain: () => [
    body(roundPolygon(0.75, 1.5, 9.75, 4.5, 3.5, 6.75, 7.5, 7.75, 5.75, 10.5, 9.75), { tint: true }),
    dot(9, 2.75, 1),
  ],

  Crown: () => [
    body(roundPolygon(0.75, 1.5, 4, 4, 6.25, 6, 2.75, 8, 6.25, 10.5, 4, 9.75, 9.75, 2.25, 9.75), { tint: true }),
    cut(seg(3, 7.5, 9, 7.5)),
  ],

  Gem: () => [
    body(roundPolygon(0.75, 3.5, 2.75, 8.5, 2.75, 10.75, 5.25, 6, 10.25, 1.25, 5.25), { tint: true }),
    cut(seg(1.75, 5.25, 10.25, 5.25)),
  ],

  Medal: () => [
    body(circle(6, 7.5, 3), { tint: true }),
    cut(poly(5.25, 7, 6.25, 6.25, 6.25, 8.75)),
    stroke(poly(5, 4.6, 3.75, 1.75, 8.25, 1.75, 7, 4.6)),
  ],

  Award: () => [
    body(circle(6, 4.75, 3.25), { tint: true }),
    hole(6, 4.75, 0.75),
    ...tails(4.25, 7.5),
  ],
};
