import { createIcon } from '../createIcon';
import { arc, body, circle, cut, head, join, LINED, mark, polar, poly, roundPoly, SOLID, stroke } from '../shapes';

// Arrows: corner turns, replies, cycles and curved paths.

/** Arrowhead at the end of a circular arc, tangent to it, turned in a little so the arms sit on the curve. */
function arcHead(cx: number, cy: number, r: number, deg: number, cw: boolean, len: number): string {
  const [x, y] = polar(cx, cy, r, deg);
  const turn = (Math.asin((len * Math.SQRT1_2) / (2 * r)) * 180) / Math.PI;
  return head(x, y, cw ? deg + 90 + turn : deg - 90 - turn, len);
}

type Pt = readonly [number, number];

const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const f = (v: number) => String(Math.round(v * 1000) / 1000);

/** The part of a cubic Bezier between parameters t0 and t1, as an open path. */
function cubicSlice(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t0: number, t1: number): string {
  const split = (a: Pt, b: Pt, c: Pt, d: Pt, t: number): [Pt, Pt, Pt, Pt, Pt, Pt, Pt] => {
    const ab = lerp(a, b, t);
    const bc = lerp(b, c, t);
    const cd = lerp(c, d, t);
    const abc = lerp(ab, bc, t);
    const bcd = lerp(bc, cd, t);
    const m = lerp(abc, bcd, t);
    return [a, ab, abc, m, bcd, cd, d];
  };
  // Keep the right part from t0, then cut that part at the rescaled t1.
  const right = split(p0, p1, p2, p3, t0);
  const [, , , s0, r1, r2, r3] = right;
  const local = (t1 - t0) / (1 - t0);
  const [, a1, a2, a3] = split(s0, r1, r2, r3, local);
  return `M${f(s0[0])} ${f(s0[1])}C${f(a1[0])} ${f(a1[1])} ${f(a2[0])} ${f(a2[1])} ${f(a3[0])} ${f(a3[1])}`;
}

export const CornerDownRightIcon = /*#__PURE__*/ createIcon('CornerDownRight', () => [
  stroke(roundPoly(2.5, 3.5, 3.25, 3.5, 11.25, 14.75, 11.25)),
  stroke(head(14.75, 11.25, 90, 4.5)),
]);

export const CornerUpLeftIcon = /*#__PURE__*/ createIcon('CornerUpLeft', () => [
  stroke(roundPoly(2.5, 14.5, 14.75, 14.5, 6.75, 3.25, 6.75)),
  stroke(head(3.25, 6.75, 270, 4.5)),
]);

export const CornerUpRightIcon = /*#__PURE__*/ createIcon('CornerUpRight', () => [
  stroke(roundPoly(2.5, 3.5, 14.75, 3.5, 6.75, 14.75, 6.75)),
  stroke(head(14.75, 6.75, 90, 4.5)),
]);

export const CornerLeftDownIcon = /*#__PURE__*/ createIcon('CornerLeftDown', () => [
  stroke(roundPoly(2.5, 3.25, 3.5, 11.25, 3.5, 11.25, 14.75)),
  stroke(head(11.25, 14.75, 180, 4.5)),
]);

export const CornerRightDownIcon = /*#__PURE__*/ createIcon('CornerRightDown', () => [
  stroke(roundPoly(2.5, 14.75, 3.5, 6.75, 3.5, 6.75, 14.75)),
  stroke(head(6.75, 14.75, 180, 4.5)),
]);

export const CornerLeftUpIcon = /*#__PURE__*/ createIcon('CornerLeftUp', () => [
  stroke(roundPoly(2.5, 3.25, 14.5, 11.25, 14.5, 11.25, 3.25)),
  stroke(head(11.25, 3.25, 0, 4.5)),
]);

export const CornerRightUpIcon = /*#__PURE__*/ createIcon('CornerRightUp', () => [
  stroke(roundPoly(2.5, 14.75, 14.5, 6.75, 14.5, 6.75, 3.25)),
  stroke(head(6.75, 3.25, 0, 4.5)),
]);

export const ReplyIcon = /*#__PURE__*/ createIcon('Reply', () => [
  stroke('M3 7.5H10.5A4.5 4.5 0 0 1 15 12V14.25'),
  stroke(head(3, 7.5, 270, 4.5)),
]);

export const ReplyAllIcon = /*#__PURE__*/ createIcon('ReplyAll', () => [
  stroke('M8.5 7.5H11A4 4 0 0 1 15 11.5V14.25'),
  stroke(head(8.5, 7.5, 270, 3.5)),
  stroke(head(3, 7.5, 270, 3.5)),
]);

export const ForwardIcon = /*#__PURE__*/ createIcon('Forward', () => [
  stroke('M15 7.5H7.5A4.5 4.5 0 0 0 3 12V14.25'),
  stroke(head(15, 7.5, 90, 4.5)),
]);

export const RefreshCcwIcon = /*#__PURE__*/ createIcon('RefreshCcw', () => [
  stroke(arc(9, 9, 6.5, -285, -425)),
  stroke(arcHead(9, 9, 6.5, -65, false, 3.5)),
  stroke(arc(9, 9, 6.5, -105, -245)),
  stroke(arcHead(9, 9, 6.5, -245, false, 3.5)),
]);

export const HistoryIcon = /*#__PURE__*/ createIcon('History', () => [
  mark(circle(10, 9, 6), { tint: true, only: 'duo' }),
  stroke(arc(10, 9, 6, 270, 570), { only: LINED }),
  body(circle(10, 9, 6), { tint: true, only: SOLID }),
  stroke(arcHead(10, 9, 6, 270, false, 3.25)),
  cut(poly(10, 6, 10, 9, 12.25, 10.25)),
]);

export const IterationCwIcon = /*#__PURE__*/ createIcon('IterationCw', () => [
  stroke(join(arc(6.75, 9.5, 4.5, 110, 360), 'H14.75')),
  stroke(head(14.75, 5, 90, 4.5)),
]);

export const IterationCcwIcon = /*#__PURE__*/ createIcon('IterationCcw', () => [
  stroke(join(arc(11.25, 9.5, 4.5, -110, -360), 'H3.25')),
  stroke(head(3.25, 5, 270, 4.5)),
]);

const SHUF_A: [Pt, Pt, Pt, Pt] = [
  [5.5, 5.25],
  [9.5, 5.25],
  [8.5, 12.75],
  [12.5, 12.75],
];
const SHUF_B: [Pt, Pt, Pt, Pt] = [
  [5.5, 12.75],
  [9.5, 12.75],
  [8.5, 5.25],
  [12.5, 5.25],
];

export const ShuffleIcon = /*#__PURE__*/ createIcon('Shuffle', () => [
  stroke(`M2.5 5.25H5.5${cubicSlice(...SHUF_A, 0, 1).replace('M', 'L')}H14.75`),
  stroke(head(14.75, 12.75, 90, 3.5)),
  stroke(`M2.5 12.75H5.5${cubicSlice(...SHUF_B, 0, 0.3).replace('M', 'L')}`),
  stroke(`${cubicSlice(...SHUF_B, 0.7, 1)}H14.75`),
  stroke(head(14.75, 5.25, 90, 3.5)),
]);

export const RepeatOnceIcon = /*#__PURE__*/ createIcon('RepeatOnce', () => [
  stroke(roundPoly(2.5, 2.75, 9.5, 2.75, 5, 14.75, 5)),
  stroke(head(14.75, 5, 90, 3.5)),
  stroke(roundPoly(2.5, 15.25, 8.5, 15.25, 13, 3.25, 13)),
  stroke(head(3.25, 13, 270, 3.5)),
  stroke(poly(7.75, 8.25, 9.25, 6.75, 9.25, 11.25)),
]);

export const InfinityIcon = /*#__PURE__*/ createIcon('Infinity', () => [
  stroke('M9 9C11 5.25 15.25 4 15.25 9S11 12.75 9 9C7 5.25 2.75 4 2.75 9S7 12.75 9 9Z'),
]);

export const UturnUpIcon = /*#__PURE__*/ createIcon('UturnUp', () => [
  stroke('M5.25 14.75V7.25A3.75 3.75 0 0 1 12.75 7.25V14.5'),
  stroke(head(12.75, 14.5, 180, 4.5)),
]);

export const UturnLeftIcon = /*#__PURE__*/ createIcon('UturnLeft', () => [
  stroke('M3.75 5.25H11A3.75 3.75 0 0 1 11 12.75H4'),
  stroke(head(4, 12.75, 270, 4.5)),
]);

export const ArrowCurveRightIcon = /*#__PURE__*/ createIcon('ArrowCurveRight', () => [
  stroke('M3.25 14.5C3.25 8.5 7 5.25 14.25 5.25'),
  stroke(head(14.75, 5.25, 90, 4.5)),
]);

export const ArrowCurveLeftIcon = /*#__PURE__*/ createIcon('ArrowCurveLeft', () => [
  stroke('M14.75 14.5C14.75 8.5 11 5.25 3.75 5.25'),
  stroke(head(3.25, 5.25, 270, 4.5)),
]);

