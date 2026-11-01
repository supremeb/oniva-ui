import { createIcon } from '../createIcon';
import {
  arc,
  body,
  circle,
  cut,
  dot,
  hole,
  LINED,
  mark,
  polar,
  poly,
  rect,
  roundPolygon,
  seg,
  SOLID,
  sparkle,
  star,
  stroke,
} from '../shapes';

// Status, feedback and sentiment.

export const CircleCheckIcon = /*#__PURE__*/ createIcon('CircleCheck', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(poly(5.75, 9.25, 8, 11.5, 12.25, 6.75)),
]);
export const CircleAlertIcon = /*#__PURE__*/ createIcon('CircleAlert', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(9, 5.5, 9, 9.5)),
  hole(9, 12.25),
]);
export const CircleXIcon = /*#__PURE__*/ createIcon('CircleX', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(6.75, 6.75, 11.25, 11.25)),
  cut(seg(11.25, 6.75, 6.75, 11.25)),
]);
export const InfoIcon = /*#__PURE__*/ createIcon('Info', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(9, 8.5, 9, 12.5)),
  hole(9, 5.75),
]);
export const TriangleAlertIcon = /*#__PURE__*/ createIcon('TriangleAlert', () => [
  body(roundPolygon(1.5, 9, 2.25, 16.25, 15, 1.75, 15), { tint: true }),
  cut(seg(9, 6.75, 9, 9.75)),
  hole(9, 12.25),
]);

export const BellIcon = /*#__PURE__*/ createIcon('Bell', () => [
  body('M3.75 13H14.25L13.5 11.5Q13 10.5 13 9.25V7.25A4 4 0 0 0 5 7.25V9.25Q5 10.5 4.5 11.5Z', { tint: true }),
  stroke('M7.5 15.5A1.75 1.75 0 0 0 10.5 15.5'),
]);

export const StarIcon = /*#__PURE__*/ createIcon('Star', () => [body(star(9, 9.6, 7.25, 3.6, 5, 1), { tint: true })]);

export const HeartIcon = /*#__PURE__*/ createIcon('Heart', () => [
  body('M9 15.25C5.5 13 2.25 10.5 2.25 6.75A3.4 3.4 0 0 1 9 5.25A3.4 3.4 0 0 1 15.75 6.75C15.75 10.5 12.5 13 9 15.25Z', {
    tint: true,
  }),
]);

export const SparklesIcon = /*#__PURE__*/ createIcon('Sparkles', () => [
  body(sparkle(7.5, 10.25, 5.5), { tint: true }),
  mark(sparkle(14, 4, 2.5, 0.2)),
]);

// ---- marks, shields, seals --------------------------------------------

const r3 = (v: number) => Math.round(v * 1000) / 1000;

/**
 * Question mark hook (open path): a round top of radius `r` centered on cx,cy that runs clockwise
 * from 9 o'clock to `turn` degrees, then curls straight down onto a stem ending at `end`.
 */
function question(cx: number, cy: number, r: number, end: number, turn = 140): string {
  const [x, y] = polar(cx, cy, r, turn);
  const a = ((turn - 90) * Math.PI) / 180;
  // Follow the arc's tangent until it meets the stem's line, so the curl joins without a kink.
  const k = (x - cx) / Math.sin(a);
  return `${arc(cx, cy, r, -90, turn)}Q${r3(cx)} ${r3(y + k * Math.cos(a))} ${r3(cx)} ${r3(end)}`;
}

/** Shield outline: shoulders that rise gently to the middle of the top, sides that curve to a soft point. */
const SHIELD =
  'M9 16C5.5 14.75 3.25 12.25 3.25 8.75V5.25Q3.25 4.25 4.25 3.9L8.25 2.5Q9 2.25 9.75 2.5L13.75 3.9Q14.75 4.25 14.75 5.25V8.75C14.75 12.25 12.5 14.75 9 16Z';

/** Eight-lobed seal with a smooth, wavy edge. */
const SEAL = star(9, 9, 7.5, 5.5, 8, 2, 0);

export const CircleHelpIcon = /*#__PURE__*/ createIcon('CircleHelp', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(question(9, 7, 2, 10.25)),
  hole(9, 12.75),
]);

export const OctagonAlertIcon = /*#__PURE__*/ createIcon('OctagonAlert', () => [
  body(
    roundPolygon(1.5, 6.25, 2.25, 11.75, 2.25, 15.75, 6.25, 15.75, 11.75, 11.75, 15.75, 6.25, 15.75, 2.25, 11.75, 2.25, 6.25),
    { tint: true },
  ),
  cut(seg(9, 5.5, 9, 9.5)),
  hole(9, 12.25),
]);

export const ShieldIcon = /*#__PURE__*/ createIcon('Shield', () => [body(SHIELD, { tint: true })]);

export const ShieldAlertIcon = /*#__PURE__*/ createIcon('ShieldAlert', () => [
  body(SHIELD, { tint: true }),
  cut(seg(9, 5.5, 9, 8.75)),
  hole(9, 11.5),
]);

export const ShieldCheckIcon = /*#__PURE__*/ createIcon('ShieldCheck', () => [
  body(SHIELD, { tint: true }),
  cut(poly(6.25, 8.75, 8.25, 10.75, 11.75, 7.25)),
]);

export const ShieldQuestionIcon = /*#__PURE__*/ createIcon('ShieldQuestion', () => [
  body(SHIELD, { tint: true }),
  cut(question(9, 6.75, 1.75, 9.25)),
  hole(9, 11.75),
]);

export const BadgeCheckIcon = /*#__PURE__*/ createIcon('BadgeCheck', () => [
  body(SEAL, { tint: true }),
  cut(poly(6.25, 9.25, 8.25, 11.25, 11.75, 7.25)),
]);

export const BadgePercentIcon = /*#__PURE__*/ createIcon('BadgePercent', () => [
  body(SEAL, { tint: true }),
  cut(seg(11.5, 6.5, 6.5, 11.5)),
  hole(6.75, 6.75),
  hole(11.25, 11.25),
]);

// ---- sentiment and signals ----------------------------------------------

/**
 * Bell split by the off slash (y = x). Each half is an open body: the stroke stops 2.25 from the
 * slash, and the implied closing edge runs parallel to it, so the tint and the solid break cleanly too.
 */
export const BellOffIcon = /*#__PURE__*/ createIcon('BellOff', () => [
  body('M6.98 3.8A4 4 0 0 1 13 7.25V9.82', { tint: true }),
  body('M5 8.18V9.25Q5 10.5 4.5 11.5L3.75 13H9.82', { tint: true }),
  stroke('M7.5 15.5A1.75 1.75 0 0 0 10.5 15.5'),
  stroke(seg(2.75, 2.75, 15.25, 15.25)),
]);

const HEART =
  'M9 15.25C5.5 13 2.25 10.5 2.25 6.75A3.4 3.4 0 0 1 9 5.25A3.4 3.4 0 0 1 15.75 6.75C15.75 10.5 12.5 13 9 15.25Z';

export const HeartPulseIcon = /*#__PURE__*/ createIcon('HeartPulse', () => [
  body(HEART, { tint: true }),
  cut(poly(2.75, 9, 6, 9, 7.5, 6.75, 10, 11.5, 11.75, 9, 15.25, 9), { only: LINED }),
  cut(poly(1.25, 9, 6, 9, 7.5, 6.75, 10, 11.5, 11.75, 9, 16.75, 9), { only: SOLID }),
]);

/** Thumb hand with a wrist cuff. `flip` mirrors it top to bottom. */
function thumb(flip: boolean) {
  const Y = (y: number) => (flip ? 18 - y : y);
  const hand =
    `M7.5 ${Y(8)}L9.25 ${Y(3.5)}Q9.75 ${Y(2.25)} 10.75 ${Y(2.5)}Q11.75 ${Y(2.85)} 11.5 ${Y(4.25)}L11 ${Y(6.75)}` +
    `H14Q15.75 ${Y(6.75)} 15.5 ${Y(8.5)}L14.75 ${Y(13.75)}Q14.5 ${Y(15.5)} 12.75 ${Y(15.5)}H7.5Z`;
  return [body(hand, { tint: true }), body(rect(2.25, flip ? 18 - 15.5 : 8, 2.75, 7.5, 1))];
}

export const ThumbsUpIcon = /*#__PURE__*/ createIcon('ThumbsUp', () => thumb(false));
export const ThumbsDownIcon = /*#__PURE__*/ createIcon('ThumbsDown', () => thumb(true));

export const BookmarkIcon = /*#__PURE__*/ createIcon('Bookmark', () => [
  body('M4.25 4.5A2 2 0 0 1 6.25 2.5H11.75A2 2 0 0 1 13.75 4.5V15.25L9 12L4.25 15.25Z', { tint: true }),
]);

export const TrophyIcon = /*#__PURE__*/ createIcon('Trophy', () => [
  body('M4.75 2.5H13.25V6.75A4.25 4.25 0 0 1 4.75 6.75Z', { tint: true }),
  stroke('M4.75 4H3.5A1.25 1.25 0 0 0 2.25 5.25C2.25 7 3.5 8.25 5.25 8.5'),
  stroke('M13.25 4H14.5A1.25 1.25 0 0 1 15.75 5.25C15.75 7 14.5 8.25 12.75 8.5'),
  stroke(seg(9, 11, 9, 15.5)),
  stroke(seg(5.75, 15.5, 12.25, 15.5)),
]);

export const ZapIcon = /*#__PURE__*/ createIcon('Zap', () => [
  body(roundPolygon(1, 10.5, 2, 3.5, 10.25, 9, 10.25, 7.5, 16, 14.5, 7.75, 9, 7.75), { tint: true }),
]);

export const ActivityIcon = /*#__PURE__*/ createIcon('Activity', () => [
  stroke(poly(2, 9, 5.25, 9, 7.25, 3.25, 10.75, 14.75, 12.75, 9, 16, 9)),
]);

export const GaugeIcon = /*#__PURE__*/ createIcon('Gauge', () => [
  stroke(arc(9, 10, 7, 225, 495)),
  stroke(seg(9, 10, 11.75, 7.25)),
  dot(9, 10, 1.25),
]);

export const TrendingUpIcon = /*#__PURE__*/ createIcon('TrendingUp', () => [
  stroke(poly(2.25, 12.75, 6.75, 8.25, 9.75, 11.25, 15.5, 5.5)),
  stroke(poly(11, 5.5, 15.5, 5.5, 15.5, 10)),
]);

export const LightbulbIcon = /*#__PURE__*/ createIcon('Lightbulb', () => [
  body('M6.75 12.5C6.75 11 4 10 4 7A5 5 0 0 1 14 7C14 10 11.25 11 11.25 12.5Z', { tint: true }),
  stroke(seg(7.25, 15.5, 10.75, 15.5)),
]);

/** Ring between two circles; the inner one runs the other way so it stays open when filled. */
const RING = `${circle(9, 9, 7)}M6 9A3 3 0 1 1 12 9A3 3 0 1 1 6 9Z`;
const DIAGONALS = [45, 135, 225, 315];

/** One band of the buoy: the ring between r 3 and 7, `half` degrees either side of `deg`. */
function band(deg: number, half: number): string {
  const [ax, ay] = polar(9, 9, 3, deg - half);
  const [bx, by] = polar(9, 9, 7, deg - half);
  const [cx, cy] = polar(9, 9, 7, deg + half);
  const [dx, dy] = polar(9, 9, 3, deg + half);
  return `M${r3(ax)} ${r3(ay)}L${r3(bx)} ${r3(by)}A7 7 0 0 1 ${r3(cx)} ${r3(cy)}L${r3(dx)} ${r3(dy)}A3 3 0 0 0 ${r3(ax)} ${r3(ay)}Z`;
}

/** Outline and duo: a ring crossed by four bands. Fill: the bands turn solid against the open ring. */
export const LifeBuoyIcon = /*#__PURE__*/ createIcon('LifeBuoy', () => [
  body(RING, { tint: true, only: LINED }),
  ...DIAGONALS.map((deg) => {
    const [x1, y1] = polar(9, 9, 3, deg);
    const [x2, y2] = polar(9, 9, 7, deg);
    return stroke(seg(x1, y1, x2, y2), { only: LINED });
  }),
  stroke(RING, { only: SOLID }),
  ...DIAGONALS.map((deg) => mark(band(deg, 20), { only: SOLID })),
]);
