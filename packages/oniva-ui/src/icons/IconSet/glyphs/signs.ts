import { createIcon } from '../createIcon';
import {
  arc,
  body,
  circle,
  cut,
  dot,
  head,
  hole,
  LINED,
  polar,
  poly,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  stroke,
} from '../shapes';

// Accessibility, hands, gestures and signs.

const r3 = (v: number) => Math.round(v * 1000) / 1000;

/**
 * Re-place an absolute path (M L H V Q C A Z) by rotating `deg` degrees clockwise, scaling by `s`
 * about `cx,cy`, then moving by `dx,dy`. Lets one hand drawing serve several poses.
 */
function xf(d: string, s: number, dx = 0, dy = 0, deg = 0, cx = 9, cy = 9): string {
  const a = (deg * Math.PI) / 180;
  const co = Math.cos(a);
  const si = Math.sin(a);
  const p = (x: number, y: number) => {
    const u = (x - cx) * s;
    const v = (y - cy) * s;
    return `${r3(cx + dx + u * co - v * si)} ${r3(cy + dy + u * si + v * co)}`;
  };
  let px = 0;
  let py = 0;
  let out = '';
  for (const m of d.matchAll(/([MLHVQCAZ])([^MLHVQCAZ]*)/g)) {
    const c = m[1]!;
    const v = (m[2] ?? '').trim().split(/[\s,]+/).filter(Boolean).map(Number);
    if (c === 'Z') out += 'Z';
    else if (c === 'H') {
      px = v[0]!;
      out += `L${p(px, py)}`;
    } else if (c === 'V') {
      py = v[0]!;
      out += `L${p(px, py)}`;
    } else if (c === 'A') {
      px = v[5]!;
      py = v[6]!;
      out += `A${r3(v[0]! * s)} ${r3(v[1]! * s)} ${v[2]} ${v[3]} ${v[4]} ${p(px, py)}`;
    } else {
      let seq = '';
      for (let i = 0; i + 1 < v.length; i += 2) seq += `${i ? ' ' : ''}${p(v[i]!, v[i + 1]!)}`;
      px = v[v.length - 2]!;
      py = v[v.length - 1]!;
      out += c + seq;
    }
  }
  return out;
}

/** Question mark hook: a round top that curls onto a stem ending at `end`. */
function question(cx: number, cy: number, r: number, end: number, turn = 140): string {
  const [x, y] = polar(cx, cy, r, turn);
  const a = ((turn - 90) * Math.PI) / 180;
  const k = (x - cx) / Math.sin(a);
  return `${arc(cx, cy, r, -90, turn)}Q${r3(cx)} ${r3(y + k * Math.cos(a))} ${r3(cx)} ${r3(end)}`;
}

// ---- accessibility ---------------------------------------------------------

export const AccessibilityIcon = /*#__PURE__*/ createIcon('Accessibility', () => [
  body(circle(9, 9, 7), { tint: true }),
  hole(9, 5.5, 1.1),
  cut(poly(5.5, 7.75, 9, 8.5, 12.5, 7.75)),
  cut(poly(7.25, 12.75, 9, 8.5, 10.75, 12.75)),
]);

export const WheelchairIcon = /*#__PURE__*/ createIcon('Wheelchair', () => [
  dot(7, 3.25, 1.25),
  stroke(roundPoly(1.25, 7, 6, 7, 10.25, 11.25, 10.25, 13.5, 14.5)),
  stroke(seg(7, 8, 10.5, 8)),
  stroke(arc(7.75, 12, 3.75, 110, 400)),
]);

export const HearingIcon = /*#__PURE__*/ createIcon('Hearing', () => [
  body('M7.5 8A4 4 0 0 1 15.5 8C15.5 10.5 13.25 11 13.25 13A2.5 2.5 0 0 1 8.25 13V12', { tint: true }),
  stroke(arc(2.5, 8.5, 3, 40, 140)),
  stroke(arc(2.5, 8.5, 5.75, 55, 125)),
]);

export const BrailleIcon = /*#__PURE__*/ createIcon('Braille', () => [
  body(rect(3.25, 2, 11.5, 14, 2), { tint: true }),
  hole(6.75, 5.75),
  hole(11.25, 9),
  hole(6.75, 12.25),
  dot(11.25, 5.75, 0.6, { only: LINED, soft: true }),
  dot(6.75, 9, 0.6, { only: LINED, soft: true }),
  dot(11.25, 12.25, 0.6, { only: LINED, soft: true }),
]);

export const CaptionsIcon = /*#__PURE__*/ createIcon('Captions', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(arc(6.5, 9, 1.5, 55, -235)),
  cut(arc(11.5, 9, 1.5, 55, -235)),
]);

// ---- hands and gestures ----------------------------------------------------

const HAND_OPEN =
  'M5.25 10.5V6.25A1.5 1.5 0 0 1 8.25 6.25V4.5A1.5 1.5 0 0 1 11.25 4.5V6A1.5 1.5 0 0 1 14.25 6V11C14.25 14 12.25 16 9.5 16C7.75 16 6.5 15.25 5.5 14L3 10.75A1.3 1.3 0 0 1 5 9.1L5.25 9.4Z';

export const HandWaveIcon = /*#__PURE__*/ createIcon('HandWave', () => [
  body(xf(HAND_OPEN, 0.9, 0.25, 1.1, -14, 9, 15), { tint: true }),
  cut(xf('M8.25 6.75V11', 0.9, 0.25, 1.1, -14, 9, 15)),
  cut(xf('M11.25 6.5V11', 0.9, 0.25, 1.1, -14, 9, 15)),
  stroke(arc(9, 9, 8, 296, 330), { soft: true }),
  stroke(arc(9, 9, 8, 30, 64), { soft: true }),
]);

const HAND_POINT =
  'M6 10.25V4.25A1.5 1.5 0 0 1 9 4.25V7.5A1.4 1.4 0 0 1 11.75 7.5A1.4 1.4 0 0 1 14.5 8.25V11C14.5 14 12.5 16 9.75 16C8 16 6.75 15.25 5.75 14L3.5 11.25A1.3 1.3 0 0 1 5.5 9.6L6 10.1Z';

export const HandPointIcon = /*#__PURE__*/ createIcon('HandPoint', () => [
  body(HAND_POINT, { tint: true }),
  cut(seg(11.75, 8, 11.75, 10.5)),
  cut(seg(9, 7.5, 9, 10.5)),
]);

export const HandGrabIcon = /*#__PURE__*/ createIcon('HandGrab', () => [
  body(
    'M3.5 12.25V7.75A1.375 1.375 0 0 1 6.25 7.75A1.375 1.375 0 0 1 9 7.75A1.375 1.375 0 0 1 11.75 7.75A1.375 1.375 0 0 1 14.5 7.75V12.25Q14.5 15.5 11.5 15.5H6.5Q3.5 15.5 3.5 12.25Z',
    { tint: true },
  ),
  cut(seg(6.25, 8, 6.25, 10)),
  cut(seg(9, 8, 9, 10)),
  cut(seg(11.75, 8, 11.75, 10)),
  cut(seg(3.5, 12.75, 9.25, 12.75)),
]);

export const PinchIcon = /*#__PURE__*/ createIcon('Pinch', () => [
  stroke(seg(3, 3, 7.5, 7.5)),
  stroke(head(7.5, 7.5, 135, 3.5)),
  stroke(seg(15, 15, 10.5, 10.5)),
  stroke(head(10.5, 10.5, 315, 3.5)),
]);

export const SpreadIcon = /*#__PURE__*/ createIcon('Spread', () => [
  stroke(seg(7.5, 7.5, 3, 3)),
  stroke(head(3, 3, 315, 3.5)),
  stroke(seg(10.5, 10.5, 15, 15)),
  stroke(head(15, 15, 135, 3.5)),
]);

const HEART =
  'M9 15.25C5.5 13 2.25 10.5 2.25 6.75A3.4 3.4 0 0 1 9 5.25A3.4 3.4 0 0 1 15.75 6.75C15.75 10.5 12.5 13 9 15.25Z';

export const HandHeartIcon = /*#__PURE__*/ createIcon('HandHeart', () => [
  body(xf(HEART, 0.5, 2.25, -3.5), { tint: true }),
  stroke(seg(2.25, 10.5, 2.25, 15.5)),
  stroke('M2.25 12H5L7.25 10.75H11.25A1.5 1.5 0 0 1 11.25 13.75H8.25'),
  stroke('M5 14.5L8.25 15.75H11.5C12.3 15.75 13 15.4 13.6 14.9L16 12.75'),
]);

export const TapIcon = /*#__PURE__*/ createIcon('Tap', () => [
  body(circle(9, 9, 2.25), { tint: true }),
  stroke(arc(9, 9, 6, 20, 160), { soft: true }),
  stroke(arc(9, 9, 6, 200, 340), { soft: true }),
]);

export const DoubleTapIcon = /*#__PURE__*/ createIcon('DoubleTap', () => [
  body(circle(9, 9, 1.75), { tint: true }),
  stroke(arc(9, 9, 4.5, 30, 150), { soft: true }),
  stroke(arc(9, 9, 4.5, 210, 330), { soft: true }),
  stroke(arc(9, 9, 7.25, 35, 145), { soft: true }),
  stroke(arc(9, 9, 7.25, 215, 325), { soft: true }),
]);

export const LongPressIcon = /*#__PURE__*/ createIcon('LongPress', () => [
  body(circle(9, 9, 2.25), { tint: true }),
  stroke(arc(9, 9, 6.25, 0, 270)),
]);

export const SwipeIcon = /*#__PURE__*/ createIcon('Swipe', () => [
  body(circle(5, 9, 2.25), { tint: true }),
  stroke(seg(9.5, 9, 15.5, 9)),
  stroke(head(15.5, 9, 90, 4.5)),
]);

// ---- signs -----------------------------------------------------------------

const OCTAGON = [6.25, 2.25, 11.75, 2.25, 15.75, 6.25, 15.75, 11.75, 11.75, 15.75, 6.25, 15.75, 2.25, 11.75, 2.25, 6.25];
const DIAMOND = [9, 2, 16, 9, 9, 16, 2, 9];
const SQUARE = rect(2.5, 2.5, 13, 13, 2.5);

export const StopSignIcon = /*#__PURE__*/ createIcon('StopSign', () => [
  body(roundPolygon(1.5, ...OCTAGON), { tint: true }),
  cut(seg(5.75, 9, 12.25, 9)),
]);

export const YieldIcon = /*#__PURE__*/ createIcon('Yield', () => [
  body(roundPolygon(1.5, 1.75, 3.25, 16.25, 3.25, 9, 16), { tint: true }),
]);

export const NoEntryIcon = /*#__PURE__*/ createIcon('NoEntry', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(5.5, 9, 12.5, 9)),
]);

export const WarningDiamondIcon = /*#__PURE__*/ createIcon('WarningDiamond', () => [
  body(roundPolygon(2, ...DIAMOND), { tint: true }),
  cut(seg(9, 5.5, 9, 9)),
  hole(9, 11.5),
]);

export const InfoDiamondIcon = /*#__PURE__*/ createIcon('InfoDiamond', () => [
  body(roundPolygon(2, ...DIAMOND), { tint: true }),
  cut(seg(9, 8, 9, 11.5)),
  hole(9, 5.5),
]);

export const HelpDiamondIcon = /*#__PURE__*/ createIcon('HelpDiamond', () => [
  body(roundPolygon(2, ...DIAMOND), { tint: true }),
  cut(question(9, 7, 1.5, 9.25)),
  hole(9, 11.75),
]);

export const InfoSquareIcon = /*#__PURE__*/ createIcon('InfoSquare', () => [
  body(SQUARE, { tint: true }),
  cut(seg(9, 8.5, 9, 12.5)),
  hole(9, 5.75),
]);

export const HelpSquareIcon = /*#__PURE__*/ createIcon('HelpSquare', () => [
  body(SQUARE, { tint: true }),
  cut(question(9, 7, 2, 10.25)),
  hole(9, 12.75),
]);

export const AlertSquareIcon = /*#__PURE__*/ createIcon('AlertSquare', () => [
  body(SQUARE, { tint: true }),
  cut(seg(9, 5.5, 9, 9.5)),
  hole(9, 12.25),
]);

// ---- symbols ---------------------------------------------------------------

export const AsteriskIcon = /*#__PURE__*/ createIcon('Asterisk', () =>
  [0, 60, 120].map((deg) => {
    const [x1, y1] = polar(9, 9, 6.25, deg);
    const [x2, y2] = polar(9, 9, 6.25, deg + 180);
    return stroke(seg(x1, y1, x2, y2));
  }),
);

export const AmpersandIcon = /*#__PURE__*/ createIcon('Ampersand', () => [
  stroke(
    'M14.75 15.25L6.9 6.75C5.5 5.25 5.9 2.75 8.4 2.75C10.6 2.75 11.4 5 9.5 7L5.4 11.2C3.5 13.2 4.5 15.5 7.5 15.5C10 15.5 12.5 14.5 13.75 11.25',
  ),
]);

export const QuestionMarkIcon = /*#__PURE__*/ createIcon('QuestionMark', () => [
  stroke(question(9, 6.25, 3.5, 10.5)),
  dot(9, 14.75, 1.25),
]);

export const ExclamationIcon = /*#__PURE__*/ createIcon('Exclamation', () => [
  stroke(seg(9, 2.75, 9, 10.5)),
  dot(9, 14.75, 1.25),
]);

export const ExclamationDoubleIcon = /*#__PURE__*/ createIcon('ExclamationDouble', () => [
  stroke(seg(5.5, 2.75, 5.5, 10.5)),
  dot(5.5, 14.75, 1.25),
  stroke(seg(12.5, 2.75, 12.5, 10.5)),
  dot(12.5, 14.75, 1.25),
]);

export const PowerIcon = /*#__PURE__*/ createIcon('Power', () => [
  stroke(arc(9, 9.5, 6.5, 40, 320)),
  stroke(seg(9, 2.5, 9, 8.5)),
]);

/** Three arrows chasing each other around a circle. */
export const RecycleIcon = /*#__PURE__*/ createIcon('Recycle', () =>
  [0, 120, 240].flatMap((o) => {
    const [x, y] = polar(9, 9, 6.25, o + 88);
    return [stroke(arc(9, 9, 6.25, o + 8, o + 88)), stroke(head(x, y, o + 88 + 75, 3.25, 40))];
  }),
);

