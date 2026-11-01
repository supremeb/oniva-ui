import { createIcon } from '../createIcon';
import {
  body,
  circle,
  cut,
  dot,
  ellipse,
  hole,
  LINED,
  mark,
  poly,
  polar,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  SOLID,
  stroke,
} from '../shapes';

// Editing: design and drawing tools.

/** Frame leaned along `deg` from its origin: u runs along the axis, v across it (clockwise side). */
function axis(ox: number, oy: number, deg: number) {
  const [ux, uy] = polar(0, 0, 1, deg);
  const [vx, vy] = polar(0, 0, 1, deg + 90);
  return (u: number, v: number): [number, number] => [ox + u * ux + v * vx, oy + u * uy + v * vy];
}

/** Polygon through [u, v] pairs of a leaned frame, flattened for roundPolygon. */
const through = (at: ReturnType<typeof axis>, ...c: number[]) => {
  const out: number[] = [];
  for (let i = 0; i + 1 < c.length; i += 2) out.push(...at(c[i]!, c[i + 1]!));
  return out;
};

// ---- paint and pen tools ---------------------------------------------------

const brushAt = axis(2.75, 15.25, 45);
const BRISTLES = (() => {
  const t = brushAt(0, 0);
  const [a, b] = [brushAt(3.25, -3.25), brushAt(7.25, -2.25)];
  const [c, d] = [brushAt(7.25, 2.25), brushAt(3.25, 3.25)];
  return `M${t.join(' ')}Q${a.join(' ')} ${b.join(' ')}L${c.join(' ')}Q${d.join(' ')} ${t.join(' ')}Z`;
})();

export const BrushIcon = /*#__PURE__*/ createIcon('Brush', () => [
  stroke(poly(...brushAt(10.25, 0), ...brushAt(15.25, 0))),
  body(roundPolygon(0.5, ...through(brushAt, 7.25, -2.25, 10.25, -2.25, 10.25, 2.25, 7.25, 2.25))),
  body(BRISTLES, { tint: true }),
]);

export const PenToolIcon = /*#__PURE__*/ createIcon('PenTool', () => [
  body(roundPolygon(1, 6.5, 2.5, 11.5, 2.5, 13.5, 9, 9, 15.75, 4.5, 9), { tint: true }),
  hole(9, 7.5, 1.25),
  cut(seg(9, 8.75, 9, 12.5)),
]);

export const BezierIcon = /*#__PURE__*/ createIcon('Bezier', () => [
  stroke('M4.5 11.5C4.5 6 13.5 12 13.5 6.5'),
  body(rect(2.5, 11.5, 4, 4, 1), { tint: true }),
  body(rect(11.5, 2.5, 4, 4, 1), { tint: true }),
]);

export const CropIcon = /*#__PURE__*/ createIcon('Crop', () => [
  stroke(roundPoly(1, 5.5, 2, 5.5, 12.5, 16, 12.5)),
  stroke(roundPoly(1, 2, 5.5, 12.5, 5.5, 12.5, 16)),
]);

export const ScissorsIcon = /*#__PURE__*/ createIcon('Scissors', () => [
  stroke(seg(6.15, 11.75, 13.5, 2.5)),
  stroke(seg(11.85, 11.75, 4.5, 2.5)),
  body(circle(4.75, 13.5, 2.25), { tint: true }),
  body(circle(13.25, 13.5, 2.25), { tint: true }),
]);

const dropper = axis(2.75, 15.25, 45);
export const EyedropperIcon = /*#__PURE__*/ createIcon('Eyedropper', () => [
  stroke(poly(...dropper(0, 0), ...dropper(3.75, 0))),
  body(
    roundPolygon(
      1.25,
      ...through(dropper, 3.75, -1.5, 9.5, -1.5, 9.5, -3, 13.5, -3, 13.5, 3, 9.5, 3, 9.5, 1.5, 3.75, 1.5),
    ),
    { tint: true },
  ),
]);

const pail = axis(9, 9, 40);
export const PaintBucketIcon = /*#__PURE__*/ createIcon('PaintBucket', () => [
  body(roundPolygon(1.25, ...through(pail, 4.2, -4.5, 4.2, 4.5, -4.5, 3.2, -4.5, -3.2)), { tint: true }),
  cut(seg(...pail(0.5, -3.7), ...pail(0.5, 3.7))),
  mark('M14.25 11Q12.75 12.75 12.75 13.75A1.5 1.5 0 0 0 15.75 13.75Q15.75 12.75 14.25 11Z'),
]);

const wand = axis(2.75, 15.25, 45);
export const MagicWandIcon = /*#__PURE__*/ createIcon('MagicWand', () => [
  body(roundPolygon(0.75, ...through(wand, 0.5, -1.5, 9, -1.5, 9, 1.5, 0.5, 1.5)), { tint: true }),
  stroke(
    'M12.75 2.5Q12.75 5.25 15.5 5.25Q12.75 5.25 12.75 8Q12.75 5.25 10 5.25Q12.75 5.25 12.75 2.5Z',
  ),
  dot(4.5, 4.5, 1),
]);

export const LassoIcon = /*#__PURE__*/ createIcon('Lasso', () => [
  body(ellipse(9, 7, 6.75, 4.5), { tint: true }),
  stroke('M5.75 10.5Q4.5 13 6.5 14.5'),
  dot(9.25, 14.75, 1),
]);

export const ShapesIcon = /*#__PURE__*/ createIcon('Shapes', () => [
  body(roundPolygon(0.75, 9, 2.25, 12.25, 7.5, 5.75, 7.5)),
  body(circle(5, 12.75, 2.5), { tint: true }),
  body(rect(10.5, 10.5, 5, 5, 1.25)),
]);

// ---- grouping and transforms ----------------------------------------------

const FRAME_CORNERS = [
  roundPoly(1.5, 2, 6.5, 2, 4, 4, 2, 6.5, 2),
  roundPoly(1.5, 11.5, 2, 14, 2, 16, 4, 16, 6.5),
  roundPoly(1.5, 16, 11.5, 16, 14, 14, 16, 11.5, 16),
  roundPoly(1.5, 6.5, 16, 4, 16, 2, 14, 2, 11.5),
];

export const GroupIcon = /*#__PURE__*/ createIcon('Group', () => [
  ...FRAME_CORNERS.map((d) => stroke(d)),
  stroke('M8 10H6A1 1 0 0 1 5 9V6A1 1 0 0 1 6 5H9A1 1 0 0 1 10 6V8'),
  body(rect(8, 8, 5, 5, 1), { tint: true }),
]);

export const UngroupIcon = /*#__PURE__*/ createIcon('Ungroup', () => [
  body(rect(2.5, 2.5, 5.5, 5.5, 1.25)),
  body(rect(10, 10, 5.5, 5.5, 1.25), { tint: true }),
]);

export const FlipHorizontalIcon = /*#__PURE__*/ createIcon('FlipHorizontal', () => [
  stroke(seg(9, 2, 9, 4)),
  stroke(seg(9, 7.25, 9, 10.75)),
  stroke(seg(9, 14, 9, 16)),
  body(roundPolygon(1, 5.5, 3.5, 5.5, 14.5, 2, 14.5), { tint: true }),
  body(roundPolygon(1, 12.5, 3.5, 12.5, 14.5, 16, 14.5)),
]);

export const FlipVerticalIcon = /*#__PURE__*/ createIcon('FlipVertical', () => [
  stroke(seg(2, 9, 4, 9)),
  stroke(seg(7.25, 9, 10.75, 9)),
  stroke(seg(14, 9, 16, 9)),
  body(roundPolygon(1, 3.5, 5.5, 14.5, 5.5, 14.5, 2), { tint: true }),
  body(roundPolygon(1, 3.5, 12.5, 14.5, 12.5, 14.5, 16)),
]);

export const TransformIcon = /*#__PURE__*/ createIcon('Transform', () => [
  body(rect(4, 4, 10, 10, 0), { tint: true, only: ['outline', 'duo', 'fill-duo'] }),
  stroke(rect(4, 4, 10, 10, 0), { only: 'fill' }),
  dot(4, 4, 1.75),
  dot(14, 4, 1.75),
  dot(14, 14, 1.75),
  dot(4, 14, 1.75),
]);

export const FrameIcon = /*#__PURE__*/ createIcon('Frame', () => [
  body(rect(6.5, 6.5, 5, 5, 0), { tint: true }),
  stroke(seg(6.5, 2, 6.5, 6.5)),
  stroke(seg(11.5, 2, 11.5, 6.5)),
  stroke(seg(6.5, 11.5, 6.5, 16)),
  stroke(seg(11.5, 11.5, 11.5, 16)),
  stroke(seg(2, 6.5, 6.5, 6.5)),
  stroke(seg(2, 11.5, 6.5, 11.5)),
  stroke(seg(11.5, 6.5, 16, 6.5)),
  stroke(seg(11.5, 11.5, 16, 11.5)),
]);

export const ComponentIcon = /*#__PURE__*/ createIcon('Component', () => [
  body(roundPolygon(0.5, 9, 2, 11.5, 4.5, 9, 7, 6.5, 4.5), { tint: true }),
  body(roundPolygon(0.5, 4.5, 6.5, 7, 9, 4.5, 11.5, 2, 9)),
  body(roundPolygon(0.5, 13.5, 6.5, 16, 9, 13.5, 11.5, 11, 9)),
  body(roundPolygon(0.5, 9, 11, 11.5, 13.5, 9, 16, 6.5, 13.5)),
]);

export const ArtboardIcon = /*#__PURE__*/ createIcon('Artboard', () => [
  stroke(seg(3.5, 2.5, 7.5, 2.5)),
  body(rect(3.25, 5.5, 11.5, 10, 2), { tint: true }),
]);

// ---- tools and effects -----------------------------------------------------

export const MagnetIcon = /*#__PURE__*/ createIcon('Magnet', () => [
  body('M2.5 15V9A6.5 6.5 0 0 1 15.5 9V15H11.5V9A2.5 2.5 0 0 0 6.5 9V15Z', { tint: true }),
  cut(seg(2.5, 12, 6.5, 12)),
  cut(seg(11.5, 12, 15.5, 12)),
]);

export const StampIcon = /*#__PURE__*/ createIcon('Stamp', () => [
  stroke('M7 9V4.25A2 2 0 0 1 11 4.25V9'),
  body(rect(2.5, 9, 13, 3.5, 1.25), { tint: true }),
  stroke(seg(2.5, 15.5, 15.5, 15.5)),
]);

export const VectorNodeIcon = /*#__PURE__*/ createIcon('VectorNode', () => [
  stroke(seg(3.5, 14.5, 7.25, 10.75)),
  stroke(seg(14.5, 3.5, 10.75, 7.25)),
  body(rect(7, 7, 4, 4, 0.75), { tint: true }),
  dot(3.5, 14.5, 1.25),
  dot(14.5, 3.5, 1.25),
]);

export const MaskIcon = /*#__PURE__*/ createIcon('Mask', () => [
  stroke('M12 6.7V4.5A2 2 0 0 0 10 2.5H4.5A2 2 0 0 0 2.5 4.5V10A2 2 0 0 0 4.5 12H6.7', { only: LINED }),
  body(rect(2.5, 2.5, 9.5, 9.5, 2), { only: SOLID, tint: true }),
  cut(circle(10.75, 10.75, 5.75), { only: SOLID }),
  body(circle(10.75, 10.75, 4.25), { tint: true }),
]);

export const ContrastIcon = /*#__PURE__*/ createIcon('Contrast', () => [
  stroke(circle(9, 9, 7)),
  mark('M9 2A7 7 0 0 1 9 16Z'),
]);

export const GradientIcon = /*#__PURE__*/ createIcon('Gradient', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  mark(rect(5, 5.5, 2, 7, 0.75)),
  cut(seg(9, 5.75, 9, 12.25)),
  hole(12, 7.5, 0.75),
  hole(12, 10.5, 0.75),
]);

export const SwatchesIcon = /*#__PURE__*/ createIcon('Swatches', () => [
  body(rect(2.5, 2.5, 5, 13, 1.75), { tint: true }),
  hole(5, 12.5, 1),
  body(rect(10.5, 2.5, 5, 5, 1.5)),
  body(rect(10.5, 10.5, 5, 5, 1.5)),
]);

export const CompassDrawIcon = /*#__PURE__*/ createIcon('CompassDraw', () => [
  stroke(seg(8.5, 5.75, 4, 15.5)),
  stroke(seg(9.5, 5.75, 14, 15.5)),
  stroke(seg(6.25, 11, 11.75, 11)),
  body(circle(9, 4.25, 1.75), { tint: true }),
]);

export const SprayIcon = /*#__PURE__*/ createIcon('Spray', () => [
  body(rect(3.25, 7.25, 6.5, 8.75, 2), { tint: true }),
  body(rect(5, 3.25, 3, 4, 0.75)),
  cut(seg(5.5, 12, 7.5, 12)),
  dot(12, 5, 1),
  dot(14.75, 3.25, 1),
  dot(14.75, 6.75, 1),
]);

const pencilAt = axis(9.75, 15.25, 45);
export const PencilRulerIcon = /*#__PURE__*/ createIcon('PencilRuler', () => [
  body(rect(2.5, 2.5, 5.5, 13, 1.5), { tint: true }),
  cut(seg(5.5, 5.5, 8, 5.5)),
  cut(seg(5.5, 8.5, 8, 8.5)),
  cut(seg(5.5, 11.5, 8, 11.5)),
  body(roundPolygon(0.75, ...through(pencilAt, 0, 0, 3, -1.5, 7.5, -1.5, 7.5, 1.5, 3, 1.5))),
  cut(seg(...pencilAt(5.5, -1.5), ...pencilAt(5.5, 1.5))),
]);

export const BlurIcon = /*#__PURE__*/ createIcon('Blur', () => {
  const cols: [number, number, boolean][] = [
    [3.5, 1.6, false],
    [7.5, 1.25, false],
    [11.5, 0.9, true],
    [15, 0.6, true],
  ];
  return cols.flatMap(([x, r, soft]) => [4, 9, 14].map((y) => dot(x, y, r, soft ? { soft: true } : undefined)));
});

export const SharpenIcon = /*#__PURE__*/ createIcon('Sharpen', () => [
  stroke(roundPolygon(1.25, 9, 2.5, 15.5, 14.5, 2.5, 14.5)),
  mark('M9 3.5L14.5 14.25H9Z'),
]);
