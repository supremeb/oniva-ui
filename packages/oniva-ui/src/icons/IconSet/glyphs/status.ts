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
  body(circle(9, 9, 7.25), { tint: true }),
  cut(poly(5.5, 9.25, 8, 11.75, 12.5, 6.75)),
]);
export const CircleAlertIcon = /*#__PURE__*/ createIcon('CircleAlert', () => [
  body(circle(9, 9, 7.25), { tint: true }),
  cut(seg(9, 5.25, 9, 9.75)),
  hole(9, 12.5),
]);
export const CircleXIcon = /*#__PURE__*/ createIcon('CircleX', () => [
  body(circle(9, 9, 7.25), { tint: true }),
  cut(seg(6.5, 6.5, 11.5, 11.5)),
  cut(seg(11.5, 6.5, 6.5, 11.5)),
]);
export const InfoIcon = /*#__PURE__*/ createIcon('Info', () => [
  body(circle(9, 9, 7.25), { tint: true }),
  cut(seg(9, 8.5, 9, 12.75)),
  hole(9, 5.5),
]);
export const TriangleAlertIcon = /*#__PURE__*/ createIcon('TriangleAlert', () => [
  body(roundPolygon(1.5, 9, 2, 16.5, 15.5, 1.5, 15.5), { tint: true }),
  cut(seg(9, 7.25, 9, 10)),
  hole(9, 12.75),
]);

export const BellIcon = /*#__PURE__*/ createIcon('Bell', () => [
  body('M3.5 12.5H14.5L13.75 11.25Q13.25 10.25 13.25 9.25V6.75A4.25 4.25 0 0 0 4.75 6.75V9.25Q4.75 10.25 4.25 11.25Z', {
    tint: true,
  }),
  stroke('M7.5 15.25A1.5 1.5 0 0 0 10.5 15.25'),
]);

export const StarIcon = /*#__PURE__*/ createIcon('Star', () => [body(star(9, 9.55, 7.75, 3.8, 5, 1.1), { tint: true })]);

export const HeartIcon = /*#__PURE__*/ createIcon('Heart', () => [
  body(HEART, { tint: true }),
]);

export const SparklesIcon = /*#__PURE__*/ createIcon('Sparkles', () => [
  body(sparkle(7.5, 10.5, 6.25), { tint: true }),
  mark(sparkle(14.25, 4.25, 3, 0.2)),
]);

const HEART =
  'M9 15.75C5 13 2 10.5 2 6.5A3.6 3.6 0 0 1 9 5.1A3.6 3.6 0 0 1 16 6.5C16 10.5 13 13 9 15.75Z';

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
  'M9 16.25C5.25 14.9 2.5 12.25 2.5 8.75V5Q2.5 4 3.5 3.65L8.25 2Q9 1.75 9.75 2L14.5 3.65Q15.5 4 15.5 5V8.75C15.5 12.25 12.75 14.9 9 16.25Z';

/** Eight-lobed seal with a smooth, wavy edge. */
const SEAL = star(9, 9, 8, 6.4, 8, 2.2, 0);

export const CircleHelpIcon = /*#__PURE__*/ createIcon('CircleHelp', () => [
  body(circle(9, 9, 7.25), { tint: true }),
  cut(question(9, 7.25, 2.25, 10.5)),
  hole(9, 13),
]);

export const OctagonAlertIcon = /*#__PURE__*/ createIcon('OctagonAlert', () => [
  body(
    roundPolygon(1.5, 6.1, 2, 11.9, 2, 16, 6.1, 16, 11.9, 11.9, 16, 6.1, 16, 2, 11.9, 2, 6.1),
    { tint: true },
  ),
  cut(seg(9, 5.25, 9, 9.75)),
  hole(9, 12.5),
]);

export const ShieldIcon = /*#__PURE__*/ createIcon('Shield', () => [body(SHIELD, { tint: true })]);

export const ShieldAlertIcon = /*#__PURE__*/ createIcon('ShieldAlert', () => [
  body(SHIELD, { tint: true }),
  cut(seg(9, 5.75, 9, 9)),
  hole(9, 11.75),
]);

export const ShieldCheckIcon = /*#__PURE__*/ createIcon('ShieldCheck', () => [
  body(SHIELD, { tint: true }),
  cut(poly(5.75, 9, 8.25, 11.5, 12.25, 6.5)),
]);

export const ShieldQuestionIcon = /*#__PURE__*/ createIcon('ShieldQuestion', () => [
  body(SHIELD, { tint: true }),
  cut(question(9, 6.75, 2, 9.75)),
  hole(9, 12.25),
]);

export const BadgeCheckIcon = /*#__PURE__*/ createIcon('BadgeCheck', () => [
  body(SEAL, { tint: true }),
  cut(poly(5.5, 9.25, 8, 11.75, 12.5, 6.75)),
]);

export const BadgePercentIcon = /*#__PURE__*/ createIcon('BadgePercent', () => [
  body(SEAL, { tint: true }),
  cut(seg(11.5, 6.5, 6.5, 11.5)),
  hole(6.5, 6.5, 1.25),
  hole(11.5, 11.5, 1.25),
]);

// ---- sentiment and signals ----------------------------------------------

/**
 * Bell split by the off slash (y = x). Each half is an open body: the stroke stops 2.25 from the
 * slash, and the implied closing edge runs parallel to it, so the tint and the solid break cleanly too.
 */
export const BellOffIcon = /*#__PURE__*/ createIcon('BellOff', () => [
  body('M6.5 3.32A4.25 4.25 0 0 1 13.25 6.75V10.07', { tint: true }),
  body('M4.75 7.93V9.25Q4.75 10.25 4.25 11.25L3.5 12.5H9.32', { tint: true }),
  stroke('M7.5 15.25A1.5 1.5 0 0 0 10.5 15.25'),
  stroke(seg(2.75, 2.75, 15.25, 15.25)),
]);

export const HeartPulseIcon = /*#__PURE__*/ createIcon('HeartPulse', () => [
  body(HEART, { tint: true }),
  cut(poly(3, 9, 6.5, 9, 8, 6, 10, 12, 11.5, 9, 15, 9), { only: LINED }),
  cut(poly(1, 9, 6.5, 9, 8, 6, 10, 12, 11.5, 9, 17, 9), { only: SOLID }),
]);

/** Thumb hand with a wrist cuff. `flip` mirrors it top to bottom. */
function thumb(flip: boolean) {
  const Y = (y: number) => (flip ? 18 - y : y);
  const hand =
    `M8 ${Y(8)}L9.75 ${Y(3.25)}Q10 ${Y(2)} 11.25 ${Y(2.4)}Q12.25 ${Y(2.85)} 12 ${Y(4.25)}L11.5 ${Y(6.75)}` +
    `H14.5Q16.25 ${Y(6.75)} 16 ${Y(8.5)}L15.25 ${Y(13.75)}Q15 ${Y(15.75)} 13 ${Y(15.75)}H8Z`;
  return [body(hand, { tint: true }), body(rect(2, flip ? 18 - 15.75 : 8, 3, 7.75, 1.5))];
}

export const ThumbsUpIcon = /*#__PURE__*/ createIcon('ThumbsUp', () => thumb(false));
export const ThumbsDownIcon = /*#__PURE__*/ createIcon('ThumbsDown', () => thumb(true));

export const BookmarkIcon = /*#__PURE__*/ createIcon('Bookmark', () => [
  body('M3.75 5A3 3 0 0 1 6.75 2H11.25A3 3 0 0 1 14.25 5V16.25L9 12.5L3.75 16.25Z', { tint: true }),
]);

export const TrophyIcon = /*#__PURE__*/ createIcon('Trophy', () => [
  body('M4.5 2H13.5V7A4.5 4.5 0 0 1 4.5 7Z', { tint: true }),
  stroke('M4.5 4H3.25A1.5 1.5 0 0 0 1.75 5.5C1.75 7.25 3.25 8.5 5 8.75'),
  stroke('M13.5 4H14.75A1.5 1.5 0 0 1 16.25 5.5C16.25 7.25 14.75 8.5 13 8.75'),
  stroke(seg(9, 11.5, 9, 15.75)),
  stroke(seg(5.5, 15.75, 12.5, 15.75)),
]);

export const ZapIcon = /*#__PURE__*/ createIcon('Zap', () => [
  body(roundPolygon(1.25, 10.75, 1.75, 3.5, 10.5, 9, 10.5, 7.5, 16.25, 14.5, 7.5, 9, 7.5), { tint: true }),
]);

export const ActivityIcon = /*#__PURE__*/ createIcon('Activity', () => [
  stroke(poly(1.75, 9, 5, 9, 7.25, 2.75, 10.75, 15.25, 13, 9, 16.25, 9)),
]);

export const GaugeIcon = /*#__PURE__*/ createIcon('Gauge', () => [
  stroke(arc(9, 9.75, 7.25, 225, 495)),
  stroke(seg(9, 9.75, 12.25, 6.5)),
  dot(9, 9.75, 1.25),
]);

export const TrendingUpIcon = /*#__PURE__*/ createIcon('TrendingUp', () => [
  stroke(poly(2, 14, 6.75, 9.25, 9.75, 12.25, 16, 6)),
  stroke(poly(11, 6, 16, 6, 16, 11)),
]);

export const LightbulbIcon = /*#__PURE__*/ createIcon('Lightbulb', () => [
  body('M6.5 13.25C6.5 11.75 3.5 10.5 3.5 7.25A5.5 5.5 0 0 1 14.5 7.25C14.5 10.5 11.5 11.75 11.5 13.25Z', { tint: true }),
  stroke(seg(7.25, 16, 10.75, 16)),
]);

/** Ring between two circles; the inner one runs the other way so it stays open when filled. */
const RING = `${circle(9, 9, 7.25)}M5.75 9A3.25 3.25 0 1 1 12.25 9A3.25 3.25 0 1 1 5.75 9Z`;
const DIAGONALS = [45, 135, 225, 315];

/** One band of the buoy: the ring between r 3.25 and 7.25, `half` degrees either side of `deg`. */
function band(deg: number, half: number): string {
  const [ax, ay] = polar(9, 9, 3.25, deg - half);
  const [bx, by] = polar(9, 9, 7.25, deg - half);
  const [cx, cy] = polar(9, 9, 7.25, deg + half);
  const [dx, dy] = polar(9, 9, 3.25, deg + half);
  return `M${r3(ax)} ${r3(ay)}L${r3(bx)} ${r3(by)}A7.25 7.25 0 0 1 ${r3(cx)} ${r3(cy)}L${r3(dx)} ${r3(dy)}A3.25 3.25 0 0 0 ${r3(ax)} ${r3(ay)}Z`;
}

/** Outline and duo: a ring crossed by four bands. Fill: the bands turn solid against the open ring. */
export const LifeBuoyIcon = /*#__PURE__*/ createIcon('LifeBuoy', () => [
  body(RING, { tint: true, only: LINED }),
  ...DIAGONALS.map((deg) => {
    const [x1, y1] = polar(9, 9, 3.25, deg);
    const [x2, y2] = polar(9, 9, 7.25, deg);
    return stroke(seg(x1, y1, x2, y2), { only: LINED });
  }),
  stroke(RING, { only: SOLID }),
  ...DIAGONALS.map((deg) => mark(band(deg, 20), { only: SOLID })),
]);
