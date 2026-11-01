import { createIcon } from '../createIcon';
import {
  body,
  circle,
  cut,
  dot,
  ellipse,
  head,
  mark,
  poly,
  polar,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  sparkle,
  stroke,
  type Part,
} from '../shapes';

// Spatial (AR/VR, 3D), sorting and AI.

const r3 = (v: number) => Math.round(v * 1000) / 1000;

/** A solid mark that knocks out of the solid styles (any path, not only a circle). */
const holeOf = (d: string): Part => ({ k: 'hole', d });

/** Corner list of a regular hexagon with a point at the top. */
function hexPoints(cx: number, cy: number, r: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < 6; i++) out.push(...polar(cx, cy, r, i * 60));
  return out;
}

// ---- AR / VR and 3D ----------------------------------------------------

export const VrHeadsetIcon = /*#__PURE__*/ createIcon('VrHeadset', () => [
  body(rect(2, 5, 14, 8.5, 3.5), { tint: true }),
  cut('M6 13.5Q9 9.75 12 13.5'),
]);

export const ArViewIcon = /*#__PURE__*/ createIcon('ArView', () => {
  const hex = hexPoints(9, 9, 3.75);
  return [
    stroke(roundPoly(2, 2, 6.25, 2, 2, 6.25, 2)),
    stroke(roundPoly(2, 11.75, 2, 16, 2, 16, 6.25)),
    stroke(roundPoly(2, 16, 11.75, 16, 16, 11.75, 16)),
    stroke(roundPoly(2, 6.25, 16, 2, 16, 2, 11.75)),
    body(roundPolygon(1, ...hex), { tint: true }),
    cut(poly(hex[10]!, hex[11]!, 9, 9, hex[2]!, hex[3]!)),
    cut(seg(9, 9, 9, 9 + 3.75)),
  ];
});

export const Cube3dRotateIcon = /*#__PURE__*/ createIcon('Cube3dRotate', () => {
  const hex = hexPoints(9, 7, 4.5);
  return [
    body(roundPolygon(1, ...hex), { tint: true }),
    cut(poly(hex[10]!, hex[11]!, 9, 7, hex[2]!, hex[3]!)),
    cut(seg(9, 7, 9, 11.5)),
    stroke('M3 12.25Q9 17.75 15 12.25'),
    stroke(head(15, 12.25, 47.5, 3.5)),
  ];
});

export const AxisIcon = /*#__PURE__*/ createIcon('Axis', () => [
  stroke(seg(7, 11, 7, 2.5)),
  stroke(head(7, 2.5, 0, 3.5)),
  stroke(seg(7, 11, 15.5, 11)),
  stroke(head(15.5, 11, 90, 3.5)),
  stroke(seg(7, 11, 2.75, 15.25)),
  stroke(head(2.75, 15.25, 225, 3.5)),
]);

export const Rotate3dIcon = /*#__PURE__*/ createIcon('Rotate3d', () => [
  body(circle(9, 6, 3.5), { tint: true }),
  stroke('M2.75 10.5A6.25 5 0 0 0 15.25 10.5'),
  stroke(head(15.25, 10.5, 0, 3.5)),
]);

export const SphereIcon = /*#__PURE__*/ createIcon('Sphere', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut('M2 9A7 3 0 0 0 16 9'),
]);

export const CylinderIcon = /*#__PURE__*/ createIcon('Cylinder', () => [
  body('M3 4.5V13.5A6 2.5 0 0 0 15 13.5V4.5A6 2.5 0 0 0 3 4.5Z', { tint: true }),
  cut('M3 4.5A6 2.5 0 0 0 15 4.5'),
]);

export const ConeIcon = /*#__PURE__*/ createIcon('Cone', () => [
  body('M9 2.75L3 12.75A6 2.75 0 0 0 15 12.75Z', { tint: true }),
]);

export const PyramidIcon = /*#__PURE__*/ createIcon('Pyramid', () => [
  body(roundPolygon(1, 9, 2.5, 15.5, 11.5, 9, 15.5, 2.5, 11.5), { tint: true }),
  cut(seg(9, 3, 9, 15)),
]);

export const BoxSelectIcon = /*#__PURE__*/ createIcon('BoxSelect', () => [
  stroke('M2.5 6.25V5A2.5 2.5 0 0 1 5 2.5H6.25'),
  stroke('M11.75 2.5H13A2.5 2.5 0 0 1 15.5 5V6.25'),
  stroke('M15.5 11.75V13A2.5 2.5 0 0 1 13 15.5H11.75'),
  stroke('M6.25 15.5H5A2.5 2.5 0 0 1 2.5 13V11.75'),
  dot(9, 9, 1.25),
]);

/** A ring seen at an angle. */
export const TorusIcon = /*#__PURE__*/ createIcon('Torus', () => [
  body(ellipse(9, 9, 7, 6), { tint: true }),
  cut(ellipse(9, 9, 3.5, 2)),
]);

// ---- sorting ---------------------------------------------------------------

const sortArrow = (up: boolean): Part[] =>
  up
    ? [stroke(seg(4.5, 15, 4.5, 3)), stroke(head(4.5, 3, 0, 3.5))]
    : [stroke(seg(4.5, 3, 4.5, 15)), stroke(head(4.5, 15, 180, 3.5))];

/** Capital A with its apex at cx, spanning y..y+4.5. */
const letterA = (cx: number, y: number): Part[] => [
  stroke(poly(cx - 2.5, y + 4.5, cx, y, cx + 2.5, y + 4.5)),
  stroke(seg(cx - 1.1, y + 3, cx + 1.1, y + 3)),
];
const letterZ = (cx: number, y: number): Part[] => [stroke(poly(cx - 2.25, y, cx + 2.25, y, cx - 2.25, y + 4.5, cx + 2.25, y + 4.5))];
const digitOne = (cx: number, y: number): Part[] => [stroke(poly(cx - 1.75, y + 1.5, cx, y, cx, y + 4.5))];
const digitNine = (cx: number, y: number): Part[] => [
  stroke(circle(cx, y + 2, 2)),
  stroke(`M${r3(cx + 2)} ${r3(y + 2)}Q${r3(cx + 2)} ${r3(y + 4.5)} ${r3(cx - 0.5)} ${r3(y + 4.75)}`),
];

export const SortAlphaAscIcon = /*#__PURE__*/ createIcon('SortAlphaAsc', () => [
  ...sortArrow(true),
  ...letterZ(12, 2.5),
  ...letterA(12, 10.75),
]);
export const SortAlphaDescIcon = /*#__PURE__*/ createIcon('SortAlphaDesc', () => [
  ...sortArrow(false),
  ...letterZ(12, 2.5),
  ...letterA(12, 10.75),
]);
export const SortNumericAscIcon = /*#__PURE__*/ createIcon('SortNumericAsc', () => [
  ...sortArrow(true),
  ...digitNine(11.75, 2.5),
  ...digitOne(12, 10.75),
]);
export const SortNumericDescIcon = /*#__PURE__*/ createIcon('SortNumericDesc', () => [
  ...sortArrow(false),
  ...digitNine(11.75, 2.5),
  ...digitOne(12, 10.75),
]);

export const SortClockIcon = /*#__PURE__*/ createIcon('SortClock', () => [
  stroke(seg(3.25, 3, 3.25, 15)),
  stroke(head(3.25, 15, 180, 3.5)),
  body(circle(11.25, 9, 4.75), { tint: true }),
  cut(poly(11.25, 6.5, 11.25, 9, 12.75, 10.25)),
]);

export const GroupByIcon = /*#__PURE__*/ createIcon('GroupBy', () => [
  stroke(roundPoly(1.25, 5.5, 3, 3, 3, 3, 7.5, 5.5, 7.5)),
  stroke(roundPoly(1.25, 5.5, 10.5, 3, 10.5, 3, 15, 5.5, 15)),
  stroke(seg(9, 3, 16, 3)),
  stroke(seg(9, 7.5, 14, 7.5)),
  stroke(seg(9, 10.5, 15, 10.5)),
  stroke(seg(9, 15, 16, 15)),
]);

// ---- AI and assistant ----------------------------------------------------

export const AiChipIcon = /*#__PURE__*/ createIcon('AiChip', () => [
  stroke(seg(6.75, 2, 6.75, 3.5)),
  stroke(seg(11.25, 2, 11.25, 3.5)),
  stroke(seg(6.75, 14.5, 6.75, 16)),
  stroke(seg(11.25, 14.5, 11.25, 16)),
  stroke(seg(2, 6.75, 3.5, 6.75)),
  stroke(seg(2, 11.25, 3.5, 11.25)),
  stroke(seg(14.5, 6.75, 16, 6.75)),
  stroke(seg(14.5, 11.25, 16, 11.25)),
  body(rect(3.5, 3.5, 11, 11, 2.5), { tint: true }),
  holeOf(sparkle(9, 9, 2.75, 0.2)),
]);

export const AiAgentIcon = /*#__PURE__*/ createIcon('AiAgent', () => [
  body(rect(2.5, 8, 10.5, 7.75, 2.5), { tint: true }),
  stroke(seg(7.75, 8, 7.75, 5.5)),
  dot(7.75, 4.5, 1.25),
  cut(seg(5.5, 11, 5.5, 12.5)),
  cut(seg(10, 11, 10, 12.5)),
  mark(sparkle(13.5, 4.75, 2.75, 0.2)),
]);

export const PromptIcon = /*#__PURE__*/ createIcon('Prompt', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(poly(5.5, 6.75, 8, 9, 5.5, 11.25)),
  cut(seg(10, 11.25, 12.5, 11.25)),
]);

export const WandSparklesIcon = /*#__PURE__*/ createIcon('WandSparkles', () => [
  stroke(seg(3, 15, 10, 8)),
  mark(sparkle(12.5, 5.5, 3.5, 0.2)),
  mark(sparkle(4.5, 4.75, 1.75, 0.2)),
  mark(sparkle(14.25, 13, 1.5, 0.2)),
]);

export const MagicEditIcon = /*#__PURE__*/ createIcon('MagicEdit', () => [
  body(roundPolygon(0.75, 3, 15, 4.23, 11.29, 8.83, 6.69, 11.31, 9.17, 6.71, 13.77), { tint: true }),
  cut(seg(4.23, 11.29, 6.71, 13.77)),
  mark(sparkle(13.5, 4.5, 2.75, 0.2)),
]);

export const SummarizeIcon = /*#__PURE__*/ createIcon('Summarize', () => [
  stroke(seg(2.5, 3.25, 15.5, 3.25)),
  stroke(seg(2.5, 7.25, 11, 7.25)),
  stroke(seg(2.5, 11.25, 7.5, 11.25)),
  mark(sparkle(13, 12.5, 3, 0.2)),
]);

export const VoiceAssistantIcon = /*#__PURE__*/ createIcon('VoiceAssistant', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(6, 7.5, 6, 10.5)),
  cut(seg(9, 5.5, 9, 12.5)),
  cut(seg(12, 7.5, 12, 10.5)),
]);

export const NeuralNetworkIcon = /*#__PURE__*/ createIcon('NeuralNetwork', () => [
  stroke(seg(3, 5.5, 9, 3.5)),
  stroke(seg(3, 5.5, 9, 9)),
  stroke(seg(3, 12.5, 9, 9)),
  stroke(seg(3, 12.5, 9, 14.5)),
  stroke(seg(9, 3.5, 15, 9)),
  stroke(seg(9, 9, 15, 9)),
  stroke(seg(9, 14.5, 15, 9)),
  dot(3, 5.5, 1.5),
  dot(3, 12.5, 1.5),
  dot(9, 3.5, 1.5),
  dot(9, 9, 1.5),
  dot(9, 14.5, 1.5),
  dot(15, 9, 1.5),
]);

export const ContextIcon = /*#__PURE__*/ createIcon('Context', () => [
  stroke(seg(6, 2.5, 12, 2.5)),
  stroke(seg(4, 5.5, 14, 5.5)),
  body(rect(2.5, 8.5, 13, 7, 2.5), { tint: true }),
  cut(seg(6, 12, 12, 12)),
]);

export const TokenIcon = /*#__PURE__*/ createIcon('Token', () => [
  body(roundPolygon(1.25, ...hexPoints(9, 9, 7)), { tint: true }),
  cut(circle(9, 9, 2.5)),
]);

export const EmbeddingIcon = /*#__PURE__*/ createIcon('Embedding', () => [
  stroke(roundPoly(1.5, 3, 3, 3, 15, 15, 15)),
  dot(7, 11, 1.25),
  dot(11, 7.5, 1.25),
  dot(12, 11.5, 1.25),
  dot(6.75, 6.25, 1.25),
]);

export const ToolCallIcon = /*#__PURE__*/ createIcon('ToolCall', () => {
  const a = (45 - 90) * (Math.PI / 180);
  const c = Math.cos(a);
  const s = Math.sin(a);
  const p = (u: number, v: number) => `${r3(9 + u * c - v * s)} ${r3(9 + u * s + v * c)}`;
  return [
    stroke(roundPoly(1.25, 4.5, 2.75, 2.5, 2.75, 2.5, 15.25, 4.5, 15.25)),
    stroke(roundPoly(1.25, 13.5, 2.75, 15.5, 2.75, 15.5, 15.25, 13.5, 15.25)),
    body(
      `M${p(-5.5, -1.1)}L${p(-2.5, -1.1)}A3 3 0 0 1 ${p(2.5, -1.1)}L${p(1.1, -1.1)}` +
        `A1.1 1.1 0 0 0 ${p(1.1, 1.1)}L${p(2.5, 1.1)}A3 3 0 0 1 ${p(-2.5, 1.1)}L${p(-5.5, 1.1)}` +
        `A1.1 1.1 0 0 1 ${p(-5.5, -1.1)}Z`,
      { tint: true },
    ),
  ];
});

export const AiChatIcon = /*#__PURE__*/ createIcon('AiChat', () => [
  body(
    'M5 2.75H13A3 3 0 0 1 16 5.75V9.75A3 3 0 0 1 13 12.75H8.5L5 15.75V12.75A3 3 0 0 1 2 9.75V5.75A3 3 0 0 1 5 2.75Z',
    { tint: true },
  ),
  holeOf(sparkle(9, 7.75, 2.75, 0.2)),
]);
