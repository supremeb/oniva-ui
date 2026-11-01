import { createIcon } from '../createIcon';
import { body, circle, cut, dot, hole, polar, rect, roundPoly, roundPolygon, seg, SOLID, stroke } from '../shapes';

// Nature, animals and food.

const r3 = (v: number) => Math.round(v * 1000) / 1000;

/** Local frame: `u` runs along the axis (toward `deg`, 0 = up, 90 = right), `v` is perpendicular. */
function frame(cx: number, cy: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return (u: number, v: number) => `${r3(cx + u * c - v * s)} ${r3(cy + u * s + v * c)}`;
}

/** Same frame, returning numbers (for the polygon helpers). */
function rot(cx: number, cy: number, deg: number, ...uv: [number, number][]): number[] {
  const a = ((deg - 90) * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return uv.flatMap(([u, v]) => [r3(cx + u * c - v * s), r3(cy + u * s + v * c)]);
}

/** Pointed oval (leaf): `half` along the axis, `wid` half-width at the middle. */
function lens(cx: number, cy: number, deg: number, half: number, wid: number): string {
  const p = frame(cx, cy, deg);
  return `M${p(-half, 0)}Q${p(0, -wid * 2)} ${p(half, 0)}Q${p(0, wid * 2)} ${p(-half, 0)}Z`;
}

/** Circle with a smaller circle bitten out of its edge. */
function bitten(cx: number, cy: number, r: number, bx: number, by: number, br: number): string {
  const dx = bx - cx;
  const dy = by - cy;
  const d = Math.hypot(dx, dy);
  const a = (r * r - br * br + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(r * r - a * a, 0));
  const mx = cx + (a * dx) / d;
  const my = cy + (a * dy) / d;
  const p1 = [mx + (h * dy) / d, my - (h * dx) / d];
  const p2 = [mx - (h * dy) / d, my + (h * dx) / d];
  return `M${r3(p1[0]!)} ${r3(p1[1]!)}A${r} ${r} 0 1 0 ${r3(p2[0]!)} ${r3(p2[1]!)}A${br} ${br} 0 0 1 ${r3(p1[0]!)} ${r3(p1[1]!)}Z`;
}

/** Outline of overlapping circles (left to right) drawn as one cloud-like silhouette closed along the bottom. */
function lobes(...cs: [number, number, number][]): string {
  const pts: [number, number][] = [];
  for (let i = 0; i + 1 < cs.length; i++) {
    const [x1, y1, r1] = cs[i]!;
    const [x2, y2, r2] = cs[i + 1]!;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.hypot(dx, dy);
    const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(r1 * r1 - a * a, 0));
    const mx = x1 + (a * dx) / d;
    const my = y1 + (a * dy) / d;
    // upper intersection (smaller y)
    const c1: [number, number] = [mx + (h * dy) / d, my - (h * dx) / d];
    const c2: [number, number] = [mx - (h * dy) / d, my + (h * dx) / d];
    pts.push(c1[1] < c2[1] ? c1 : c2);
  }
  const first = cs[0]!;
  const last = cs[cs.length - 1]!;
  const ang = (c: [number, number, number], p: [number, number]) => (Math.atan2(p[1] - c[1], p[0] - c[0]) * 180) / Math.PI;
  const sweepCw = (from: number, to: number) => (((to - from) % 360) + 360) % 360;
  let d = `M${r3(first[0])} ${r3(first[1] + first[2])}`;
  let from = 90;
  cs.forEach((c, i) => {
    const target = i < pts.length ? pts[i]! : ([last[0], last[1] + last[2]] as [number, number]);
    const to = i < pts.length ? ang(c, target) : 90;
    const sw = sweepCw(from, to);
    d += `A${c[2]} ${c[2]} 0 ${sw > 180 ? 1 : 0} 1 ${r3(target[0])} ${r3(target[1])}`;
    if (i < pts.length) from = ang(cs[i + 1]!, pts[i]!);
  });
  return `${d}Z`;
}

// ---- plants ---------------------------------------------------------------

export const LeafIcon = /*#__PURE__*/ createIcon('Leaf', () => {
  const p = frame(9, 9, 45);
  return [
    body(lens(9.25, 8.75, 45, 6, 3.5), { tint: true }),
    cut(`M${p(-3.25, 0)}L${p(3, 0)}`),
    stroke(`M${p(-6.5, 0)}L${p(-8.25, 0)}`),
  ];
});

export const LeavesIcon = /*#__PURE__*/ createIcon('Leaves', () => [
  body(lens(5.9, 10.9, 315, 3.9, 2.1), { tint: true }),
  body(lens(12.1, 6.4, 45, 4.2, 2.3), { tint: true }),
  stroke('M9 16V3.5'),
]);

export const SproutIcon = /*#__PURE__*/ createIcon('Sprout', () => [
  body(lens(5.9, 6.9, 315, 3.9, 2.1), { tint: true }),
  body(lens(12.1, 6.4, 45, 4.2, 2.3), { tint: true }),
  stroke('M9 15.75V9.5'),
  stroke(seg(5.25, 15.75, 12.75, 15.75)),
]);

const petalAngles = [0, 72, 144, 216, 288];
export const FlowerIcon = /*#__PURE__*/ createIcon('Flower', () => {
  const valley = petalAngles.map((a) => polar(9, 9, 3.6, a + 36));
  let d = `M${r3(valley[4]![0])} ${r3(valley[4]![1])}`;
  for (const v of valley) d += `A2.5 2.5 0 1 1 ${r3(v[0])} ${r3(v[1])}`;
  return [body(`${d}Z`, { tint: true }), hole(9, 9, 1.25)];
});

export const CactusIcon = /*#__PURE__*/ createIcon('Cactus', () => [
  body(rect(7, 2.5, 4, 13.5, 2), { tint: true }),
  stroke(roundPoly(1.5, 7, 12.25, 3.75, 12.25, 3.75, 7.5)),
  stroke(roundPoly(1.5, 11, 9.5, 14.25, 9.5, 14.25, 5)),
]);

export const MushroomIcon = /*#__PURE__*/ createIcon('Mushroom', () => [
  body('M2.5 10A6.5 6.5 0 0 1 15.5 10Z', { tint: true }),
  body('M6.75 10V13.75Q6.75 15.75 8.5 15.75H9.5Q11.25 15.75 11.25 13.75V10Z'),
  cut(seg(3, 10, 15, 10), { only: SOLID }),
  hole(6.25, 7.25, 0.9),
  hole(11.25, 6.5, 0.9),
]);

export const ShellIcon = /*#__PURE__*/ createIcon('Shell', () => {
  const v = [-45, -15, 15, 45].map((a) => polar(9, 15.5, 8, a));
  let d = `M7.75 15.5L${r3(v[0]![0])} ${r3(v[0]![1])}`;
  for (const q of v.slice(1)) d += `A2.4 2.4 0 0 1 ${r3(q[0])} ${r3(q[1])}`;
  const rib = (a: number) => {
    const a1 = polar(9, 15.5, 3.5, a);
    const b1 = polar(9, 15.5, 7, a);
    return cut(seg(a1[0], a1[1], b1[0], b1[1]));
  };
  return [body(`${d}L10.25 15.5Z`, { tint: true }), rib(-30), rib(0), rib(30)];
});

// ---- animals --------------------------------------------------------------

export const PawIcon = /*#__PURE__*/ createIcon('Paw', () => [
  body(
    'M9 9.5C7 9.5 4.75 11.75 4.75 13.5C4.75 15.25 6.25 15.5 7.5 15.1C8.5 14.8 9.5 14.8 10.5 15.1C11.75 15.5 13.25 15.25 13.25 13.5C13.25 11.75 11 9.5 9 9.5Z',
    { tint: true },
  ),
  body(circle(3.75, 8.5, 1.5)),
  body(circle(6.75, 4.5, 1.5)),
  body(circle(11.25, 4.5, 1.5)),
  body(circle(14.25, 8.5, 1.5)),
]);

export const BirdIcon = /*#__PURE__*/ createIcon('Bird', () => [
  body(
    'M14 5.1L16 6.25L14.25 7.4C14.4 10.6 13 14 9.5 14.5L6.5 14.5L2.75 16L3.5 12.75L5.5 10.25C7 8.5 8.25 8 8.75 6.5C8.5 3.5 13 2 14 5.1Z',
    { tint: true },
  ),
  hole(11.5, 5.25, 0.85),
  cut('M7.25 12Q10 12.5 11.75 9.5'),
]);

export const FishIcon = /*#__PURE__*/ createIcon('Fish', () => [
  body('M2.5 9C4.5 5.25 9 4.75 12 9L15.5 5.5V12.5L12 9C9 13.25 4.5 12.75 2.5 9Z', { tint: true }),
  hole(5.75, 8.25, 0.85),
  cut('M8.5 6.9Q9.75 9 8.5 11.1'),
]);

export const CatIcon = /*#__PURE__*/ createIcon('Cat', () => [
  body('M3.75 3L7.25 5.25Q9 4.75 10.75 5.25L14.25 3L14.75 9.5Q14.75 15.5 9 15.5Q3.25 15.5 3.25 9.5Z', { tint: true }),
  hole(6.5, 10, 0.9),
  hole(11.5, 10, 0.9),
  hole(9, 12.5, 0.8),
]);

export const DogIcon = /*#__PURE__*/ createIcon('Dog', () => [
  body(rect(5.5, 3.5, 7, 11.75, 3.25), { tint: true }),
  body('M5.5 5C2.25 4.5 2 10.5 2.5 12.5C3.25 14.25 5.5 13 5.5 11.5Z'),
  body('M12.5 5C15.75 4.5 16 10.5 15.5 12.5C14.75 14.25 12.5 13 12.5 11.5Z'),
  hole(7.5, 7.75, 0.9),
  hole(10.5, 7.75, 0.9),
  hole(9, 11, 1.25),
]);

export const ButterflyIcon = /*#__PURE__*/ createIcon('Butterfly', () => [
  body('M9 6.5C8 2.5 2.5 2.5 2.75 6.5C2.75 8.5 5.25 9.5 6.75 9.75C4.5 10.75 4.5 14 6.5 14.5C8 14.9 9 13 9 11.5Z', { tint: true }),
  body('M9 6.5C10 2.5 15.5 2.5 15.25 6.5C15.25 8.5 12.75 9.5 11.25 9.75C13.5 10.75 13.5 14 11.5 14.5C10 14.9 9 13 9 11.5Z', {
    tint: true,
  }),
  cut(seg(9, 6.5, 9, 11.5), { only: SOLID }),
]);

export const FeatherIcon = /*#__PURE__*/ createIcon('Feather', () => {
  const p = frame(9, 9, 45);
  return [
    body(`M${p(-2, 0)}Q${p(1, -6.5)} ${p(8, 0)}Q${p(3, 1.5)} ${p(-2, 0)}Z`, { tint: true }),
    cut(`M${p(-2, 0)}L${p(3.75, 0)}`),
    stroke(`M${p(-2, 0)}L${p(-7.5, 0)}`),
  ];
});

export const EggIcon = /*#__PURE__*/ createIcon('Egg', () => [
  body('M9 2.5C12.5 2.5 14.5 8 14.5 10.5C14.5 13.5 12 15.75 9 15.75C6 15.75 3.5 13.5 3.5 10.5C3.5 8 5.5 2.5 9 2.5Z', { tint: true }),
  cut('M6.5 11.5Q6.5 9.25 7.75 8'),
]);

// ---- food and drink ---------------------------------------------------------

export const CoffeeIcon = /*#__PURE__*/ createIcon('Coffee', () => [
  body('M3.25 8.5H12.25V11Q12.25 15.5 8 15.5H7.5Q3.25 15.5 3.25 11Z', { tint: true }),
  stroke('M12.25 9.5H13Q15.5 9.5 15.5 11.5Q15.5 13.5 13 13.5H12'),
  stroke('M6 2.5Q7.25 4 6 5.5', { soft: true }),
  stroke('M9.5 2.5Q10.75 4 9.5 5.5', { soft: true }),
]);

export const MugIcon = /*#__PURE__*/ createIcon('Mug', () => [
  body(rect(3.25, 3.5, 8.75, 12, 2), { tint: true }),
  stroke('M12 6.5H13.25Q15.5 6.5 15.5 9Q15.5 11.5 13.25 11.5H12'),
  cut(seg(3.25, 7, 12, 7)),
]);

export const WineIcon = /*#__PURE__*/ createIcon('Wine', () => [
  body('M5.25 2.5H12.75V7.5A3.75 3.75 0 0 1 5.25 7.5Z', { tint: true }),
  cut(seg(5.25, 6, 12.75, 6)),
  stroke(seg(9, 11.25, 9, 15.5)),
  stroke(seg(5.75, 15.5, 12.25, 15.5)),
]);

export const CupSodaIcon = /*#__PURE__*/ createIcon('CupSoda', () => [
  body(roundPolygon(1, 4.75, 7.5, 13.25, 7.5, 12.25, 15.75, 5.75, 15.75), { tint: true }),
  body(rect(3.5, 5, 11, 2.5, 1.25)),
  stroke(roundPoly(1, 10.5, 5, 11.75, 2.5, 14, 2.5)),
  hole(8, 10.75, 0.8),
  hole(10.25, 13, 0.8),
]);

export const CherryIcon = /*#__PURE__*/ createIcon('Cherry', () => [
  body(circle(4.75, 12.75, 3), { tint: true }),
  body(circle(13.25, 12.25, 3), { tint: true }),
  stroke('M4.75 9.75Q5 4.5 11 3'),
  stroke('M13.25 9.25Q13 5 11 3'),
  stroke('M11 3Q13 1.75 15 3'),
]);

export const CarrotIcon = /*#__PURE__*/ createIcon('Carrot', () => {
  const p = frame(9.5, 8.5, 45);
  return [
    body(roundPolygon(1.5, ...rot(9.5, 8.5, 45, [2.5, -3.2], [2.5, 3.2], [-8, 0])), { tint: true }),
    stroke(`M${p(2.5, 0)}L${p(7.25, 0)}`),
    stroke(`M${p(2.5, -1)}Q${p(4.25, -1.25)} ${p(5.25, -3.5)}`),
    stroke(`M${p(2.5, 1)}Q${p(4.25, 1.25)} ${p(5.25, 3.5)}`),
    cut(`M${p(-1, -1.25)}L${p(-1, 0.5)}`),
    cut(`M${p(-4, 0.25)}L${p(-4, 1.25)}`),
  ];
});

export const PizzaIcon = /*#__PURE__*/ createIcon('Pizza', () => [
  body(roundPolygon(1.25, 3.5, 6.5, 14.5, 6.5, 9, 15.75), { tint: true }),
  body(rect(2.5, 2.75, 13, 3.75, 1.875)),
  cut(seg(3, 6.5, 15, 6.5), { only: SOLID }),
  hole(9, 10, 1.1),
]);

export const BurgerIcon = /*#__PURE__*/ createIcon('Burger', () => [
  body('M2.75 7C2.75 4 5.5 2.5 9 2.5C12.5 2.5 15.25 4 15.25 7Z', { tint: true }),
  stroke('M2.75 10Q4.25 11.75 5.75 10T8.75 10T11.75 10T14.75 10'),
  body(rect(2.75, 13, 12.5, 2.75, 1.5), { tint: true }),
]);

export const CroissantIcon = /*#__PURE__*/ createIcon('Croissant', () => [
  body('M3 13.5A6.95 6.95 0 1 1 15 13.5A6 6 0 0 0 3 13.5Z', { tint: true }),
  cut(seg(4.69, 4.48, 7.25, 7.76)),
  cut(seg(13.31, 4.48, 10.75, 7.76)),
]);

export const CakeIcon = /*#__PURE__*/ createIcon('Cake', () => [
  body(rect(2.75, 8.5, 12.5, 7.25, 2), { tint: true }),
  cut('M2.75 11.5Q4.6 13.5 6.5 11.5T10.25 11.5T14 11.5L15.25 11.5'),
  stroke(seg(9, 6.25, 9, 8.5)),
  dot(9, 3.5, 1),
]);

export const CookieIcon = /*#__PURE__*/ createIcon('Cookie', () => [
  body(bitten(9, 9, 7, 14, 4, 2.75), { tint: true }),
  hole(6.25, 6.75, 1),
  hole(10, 9.25, 1),
  hole(6.5, 11.75, 1),
  hole(11.75, 12.5, 0.9),
]);

export const UtensilsIcon = /*#__PURE__*/ createIcon('Utensils', () => [
  stroke('M3 2.5V6.25Q3 9 5.25 9Q7.5 9 7.5 6.25V2.5'),
  stroke(seg(5.25, 9, 5.25, 15.5)),
  body('M12 2.5Q15 3.25 15 9.25H12Z', { tint: true }),
  stroke(seg(12, 9.25, 12, 15.5)),
]);

export const ChefHatIcon = /*#__PURE__*/ createIcon('ChefHat', () => [
  body(lobes([5.25, 8, 3], [9, 6, 3.25], [12.75, 8, 3]), { tint: true }),
  body('M5.25 11V14Q5.25 15.5 6.75 15.5H11.25Q12.75 15.5 12.75 14V11Z'),
  cut(seg(5.25, 11, 12.75, 11), { only: SOLID }),
]);

export const SaladIcon = /*#__PURE__*/ createIcon('Salad', () => [
  body('M2.5 9.5H15.5C15.5 13.5 12.75 15.75 9 15.75C5.25 15.75 2.5 13.5 2.5 9.5Z', { tint: true }),
  body(lens(6.25, 5, 325, 3.5, 1.9)),
  body(circle(12, 5.5, 2.25)),
]);

export const SoupIcon = /*#__PURE__*/ createIcon('Soup', () => [
  body('M2.75 8.5H15.25C15.25 12.5 12.5 15 9 15C5.5 15 2.75 12.5 2.75 8.5Z', { tint: true }),
  stroke('M6.5 2.5Q8 4 6.5 5.5', { soft: true }),
  stroke('M11.5 2.5Q13 4 11.5 5.5', { soft: true }),
]);

export const BottleIcon = /*#__PURE__*/ createIcon('Bottle', () => [
  body('M7.75 2.5H10.25V5.5C10.25 7 13 7.75 13 10.5V14.5Q13 16 11.5 16H6.5Q5 16 5 14.5V10.5C5 7.75 7.75 7 7.75 5.5Z', {
    tint: true,
  }),
  cut(seg(5, 11.25, 13, 11.25)),
]);
