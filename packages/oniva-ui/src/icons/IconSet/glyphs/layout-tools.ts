import { createIcon } from '../createIcon';
import { body, circle, cut, dot, hole, rect, roundPoly, roundPolygon, seg, stroke } from '../shapes';

// Layout: pointers, input devices, focus frames, zoom and alignment.

export const MoreVerticalIcon = /*#__PURE__*/ createIcon('MoreVertical', () => [
  dot(9, 3.75, 1.25),
  dot(9, 9, 1.25),
  dot(9, 14.25, 1.25),
]);

export const GripHorizontalIcon = /*#__PURE__*/ createIcon('GripHorizontal', () => [
  dot(4, 6.5, 1.25),
  dot(9, 6.5, 1.25),
  dot(14, 6.5, 1.25),
  dot(4, 11.5, 1.25),
  dot(9, 11.5, 1.25),
  dot(14, 11.5, 1.25),
]);

export const KeyboardIcon = /*#__PURE__*/ createIcon('Keyboard', () => [
  body(rect(2, 3, 14, 12, 2.5), { tint: true }),
  hole(5.75, 6.5, 1),
  hole(9, 6.5, 1),
  hole(12.25, 6.5, 1),
  hole(5.75, 9.25, 1),
  hole(9, 9.25, 1),
  hole(12.25, 9.25, 1),
  cut(seg(6, 12, 12, 12)),
]);

export const MouseIcon = /*#__PURE__*/ createIcon('Mouse', () => [
  body(rect(4.75, 2, 8.5, 14, 4.25), { tint: true }),
  cut(seg(9, 5.25, 9, 7.75)),
]);

export const PointerClickIcon = /*#__PURE__*/ createIcon('PointerClick', () => [
  body(roundPolygon(1, 7, 7, 15.5, 10.25, 11.75, 11.75, 10.25, 15.5), { tint: true }),
  stroke(seg(7, 2.5, 7, 4)),
  stroke(seg(2.5, 7, 4, 7)),
  stroke(seg(3.9, 3.9, 5, 5)),
]);

export const CrosshairIcon = /*#__PURE__*/ createIcon('Crosshair', () => [
  body(circle(9, 9, 5.5), { tint: true }),
  stroke(seg(9, 2, 9, 3.75)),
  stroke(seg(9, 14.25, 9, 16)),
  stroke(seg(2, 9, 3.75, 9)),
  stroke(seg(14.25, 9, 16, 9)),
  cut(seg(9, 3.75, 9, 6.25)),
  cut(seg(9, 11.75, 9, 14.25)),
  cut(seg(3.75, 9, 6.25, 9)),
  cut(seg(11.75, 9, 14.25, 9)),
]);

const CORNERS = [
  roundPoly(2, 2.75, 6.75, 2.75, 2.75, 6.75, 2.75),
  roundPoly(2, 11.25, 2.75, 15.25, 2.75, 15.25, 6.75),
  roundPoly(2, 15.25, 11.25, 15.25, 15.25, 11.25, 15.25),
  roundPoly(2, 6.75, 15.25, 2.75, 15.25, 2.75, 11.25),
];

export const FocusIcon = /*#__PURE__*/ createIcon('Focus', () => [
  ...CORNERS.map((d) => stroke(d)),
  body(circle(9, 9, 2.75), { tint: true }),
]);

export const ScanIcon = /*#__PURE__*/ createIcon('Scan', () => [
  ...CORNERS.map((d) => stroke(d)),
  stroke(seg(5.5, 9, 12.5, 9)),
]);

export const ZoomInIcon = /*#__PURE__*/ createIcon('ZoomIn', () => [
  body(circle(8, 8, 5.25), { tint: true }),
  stroke(seg(11.85, 11.85, 15.25, 15.25)),
  cut(seg(8, 5.75, 8, 10.25)),
  cut(seg(5.75, 8, 10.25, 8)),
]);

export const ZoomOutIcon = /*#__PURE__*/ createIcon('ZoomOut', () => [
  body(circle(8, 8, 5.25), { tint: true }),
  stroke(seg(11.85, 11.85, 15.25, 15.25)),
  cut(seg(5.75, 8, 10.25, 8)),
]);

// ---- align items ----------------------------------------------------------

export const AlignItemsTopIcon = /*#__PURE__*/ createIcon('AlignItemsTop', () => [
  stroke(seg(2.5, 2.75, 15.5, 2.75)),
  body(rect(4.5, 5.75, 3, 9.5, 1), { tint: true }),
  body(rect(10.5, 5.75, 3, 6, 1)),
]);

export const AlignItemsMiddleIcon = /*#__PURE__*/ createIcon('AlignItemsMiddle', () => [
  stroke(seg(2.5, 9, 4.5, 9)),
  stroke(seg(7.5, 9, 10.5, 9)),
  stroke(seg(13.5, 9, 15.5, 9)),
  body(rect(4.5, 3, 3, 12, 1), { tint: true }),
  body(rect(10.5, 5.5, 3, 7, 1)),
]);

export const AlignItemsBottomIcon = /*#__PURE__*/ createIcon('AlignItemsBottom', () => [
  stroke(seg(2.5, 15.25, 15.5, 15.25)),
  body(rect(4.5, 2.75, 3, 9.5, 1), { tint: true }),
  body(rect(10.5, 6.25, 3, 6, 1)),
]);

export const AlignItemsLeftIcon = /*#__PURE__*/ createIcon('AlignItemsLeft', () => [
  stroke(seg(2.75, 2.5, 2.75, 15.5)),
  body(rect(5.75, 4.5, 9.5, 3, 1), { tint: true }),
  body(rect(5.75, 10.5, 6, 3, 1)),
]);

export const AlignItemsCenterIcon = /*#__PURE__*/ createIcon('AlignItemsCenter', () => [
  stroke(seg(9, 2.5, 9, 4.5)),
  stroke(seg(9, 7.5, 9, 10.5)),
  stroke(seg(9, 13.5, 9, 15.5)),
  body(rect(3, 4.5, 12, 3, 1), { tint: true }),
  body(rect(5.5, 10.5, 7, 3, 1)),
]);

export const AlignItemsRightIcon = /*#__PURE__*/ createIcon('AlignItemsRight', () => [
  stroke(seg(15.25, 2.5, 15.25, 15.5)),
  body(rect(2.75, 4.5, 9.5, 3, 1), { tint: true }),
  body(rect(6.25, 10.5, 6, 3, 1)),
]);

export const DistributeHorizontalIcon = /*#__PURE__*/ createIcon('DistributeHorizontal', () => [
  stroke(seg(2.75, 2.5, 2.75, 15.5)),
  stroke(seg(15.25, 2.5, 15.25, 15.5)),
  body(rect(7.25, 4, 3.5, 10, 1), { tint: true }),
]);

export const DistributeVerticalIcon = /*#__PURE__*/ createIcon('DistributeVertical', () => [
  stroke(seg(2.5, 2.75, 15.5, 2.75)),
  stroke(seg(2.5, 15.25, 15.5, 15.25)),
  body(rect(4, 7.25, 10, 3.5, 1), { tint: true }),
]);

export const DividerIcon = /*#__PURE__*/ createIcon('Divider', () => [
  stroke(seg(2.5, 9, 15.5, 9)),
  stroke(seg(5.5, 4.25, 12.5, 4.25)),
  stroke(seg(5.5, 13.75, 12.5, 13.75)),
]);

// ---- ruler ----------------------------------------------------------------

/** Ruler frame leaned 45 degrees: u runs bottom-left to top-right, v top-left to bottom-right. */
function ruler(u: number, v: number): [number, number] {
  return [9 + (u + v) / Math.SQRT2, 9 + (v - u) / Math.SQRT2];
}

export const RulerIcon = /*#__PURE__*/ createIcon('Ruler', () => [
  body(roundPolygon(1.25, ...[-7.25, -2.75, 7.25, -2.75, 7.25, 2.75, -7.25, 2.75].flatMap((_, i, a) => (i % 2 ? [] : ruler(a[i]!, a[i + 1]!)))), {
    tint: true,
  }),
  ...[-4.5, -1.5, 1.5, 4.5].map((u) => cut(seg(...ruler(u, 2.75), ...ruler(u, 1)))),
]);
