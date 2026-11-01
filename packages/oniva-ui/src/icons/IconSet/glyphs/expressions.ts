import { createIcon } from '../createIcon';
import type { Part } from '../shapes';
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
  rect,
  roundPoly,
  roundPolygon,
  seg,
  SOLID,
  stroke,
} from '../shapes';

// Expressions, celebrations and wearables.

// ---- faces ---------------------------------------------------------------------

const face = (): Part => body(circle(9, 9, 7), { tint: true });
const eyes = (y = 7.25): Part[] => [hole(6.5, y, 1), hole(11.5, y, 1)];
const SMILE = 'M6 10.75Q9 13.75 12 10.75';

export const SmileIcon = /*#__PURE__*/ createIcon('Smile', () => [face(), ...eyes(), cut(SMILE)]);

export const LaughIcon = /*#__PURE__*/ createIcon('Laugh', () => [
  face(),
  cut('M4.75 8.25Q6.25 6 7.75 8.25'),
  cut('M10.25 8.25Q11.75 6 13.25 8.25'),
  { k: 'hole', d: 'M5.75 10.5H12.25A3.25 3.25 0 0 1 5.75 10.5Z' } satisfies Part,
]);

export const FrownIcon = /*#__PURE__*/ createIcon('Frown', () => [
  face(),
  ...eyes(),
  cut('M6.25 13Q9 10.5 11.75 13'),
]);

export const MehIcon = /*#__PURE__*/ createIcon('Meh', () => [
  face(),
  ...eyes(),
  cut(seg(6.5, 11.75, 11.5, 11.75)),
]);

export const WinkIcon = /*#__PURE__*/ createIcon('Wink', () => [
  face(),
  hole(6.5, 7.25, 1),
  cut('M10.25 7.75Q11.5 5.75 12.75 7.75'),
  cut(SMILE),
]);

export const AngryIcon = /*#__PURE__*/ createIcon('Angry', () => [
  face(),
  cut(seg(4.75, 5.25, 7.5, 6.5)),
  cut(seg(13.25, 5.25, 10.5, 6.5)),
  hole(6.75, 9.25, 1),
  hole(11.25, 9.25, 1),
  cut('M6.5 13.5Q9 11.5 11.5 13.5'),
]);

export const SurprisedIcon = /*#__PURE__*/ createIcon('Surprised', () => [
  face(),
  ...eyes(6.75),
  hole(9, 11.75, 1.5),
]);

export const SleepyIcon = /*#__PURE__*/ createIcon('Sleepy', () => [
  face(),
  cut('M4.75 7Q6.25 9 7.75 7'),
  cut('M10.25 7Q11.75 9 13.25 7'),
  hole(9, 12, 1),
]);

export const DizzyIcon = /*#__PURE__*/ createIcon('Dizzy', () => [
  face(),
  cut(seg(5.25, 6, 7.75, 8.5)),
  cut(seg(7.75, 6, 5.25, 8.5)),
  cut(seg(10.25, 6, 12.75, 8.5)),
  cut(seg(12.75, 6, 10.25, 8.5)),
  hole(9, 12, 1.25),
]);

export const CoolFaceIcon = /*#__PURE__*/ createIcon('CoolFace', () => [
  face(),
  { k: 'hole', d: rect(4.5, 6.25, 9, 3.5, 1.25) } satisfies Part,
  cut('M6.5 12.25Q9 14.5 11.5 12.25'),
]);

/** Add reaction: a smile whose ring breaks around a plus in the bottom-right zone. */
export const SmilePlusIcon = /*#__PURE__*/ createIcon('SmilePlus', () => [
  body(arc(9, 9, 7, 180, 450), { tint: true, only: LINED }),
  body('M9 16A7 7 0 1 1 16 9A5.25 5.25 0 0 0 9 16Z', { tint: true, only: SOLID }),
  hole(6.25, 7, 1),
  hole(11, 7, 1),
  cut('M5.75 10.5Q7.25 12.5 9.25 12'),
  stroke(seg(13.75, 11.5, 13.75, 16)),
  stroke(seg(11.5, 13.75, 16, 13.75)),
]);

// ---- celebrations ------------------------------------------------------------------

export const PartyIcon = /*#__PURE__*/ createIcon('Party', () => [
  body(roundPolygon(1, 2.5, 15.5, 5.75, 6.25, 11.75, 12.25), { tint: true }),
  stroke(seg(10.75, 7.5, 13.5, 4.75)),
  dot(8.75, 3.5),
  dot(15, 9.25),
  dot(14.75, 3.25),
]);

export const ConfettiIcon = /*#__PURE__*/ createIcon('Confetti', () => [
  body(circle(5.25, 5.25, 2.25), { tint: true }),
  stroke(seg(11.5, 3.5, 14.5, 6.5)),
  body(rect(10.5, 10.5, 4, 4, 1), { tint: true }),
  body(roundPolygon(0.6, 3, 15, 4.75, 10.75, 8, 14), { tint: true }),
  dot(10, 8, 1),
]);

export const BalloonIcon = /*#__PURE__*/ createIcon('Balloon', () => [
  body(
    'M9 2.5C12.5 2.5 14.25 5 14.25 7.5C14.25 10.25 11.5 12.5 9 12.5C6.5 12.5 3.75 10.25 3.75 7.5C3.75 5 5.5 2.5 9 2.5Z',
    { tint: true },
  ),
  cut('M6.5 7C6.5 5.75 7.25 4.75 8.25 4.5'),
  stroke('M9 12.5C9 14 10.25 14.5 9.5 16'),
]);

export const FireworksIcon = /*#__PURE__*/ createIcon('Fireworks', () => {
  const parts: Part[] = [];
  for (let i = 0; i < 8; i++) {
    const long = i % 2 === 0;
    const a = polar(9, 9, long ? 3.5 : 4.5, i * 45);
    const b = polar(9, 9, long ? 7 : 6, i * 45);
    parts.push(stroke(seg(a[0], a[1], b[0], b[1])));
  }
  parts.push(dot(9, 9, 1.25));
  return parts;
});

export const CandleIcon = /*#__PURE__*/ createIcon('Candle', () => [
  body('M9 2.25C10.1 3.6 10.75 4.5 10.75 5.25A1.75 1.75 0 0 1 7.25 5.25C7.25 4.5 7.9 3.6 9 2.25Z'),
  body(rect(6.25, 9.5, 5.5, 6.5, 1.25), { tint: true }),
]);

export const BirthdayCakeIcon = /*#__PURE__*/ createIcon('BirthdayCake', () => [
  body(rect(2.5, 9.5, 13, 6.5, 2), { tint: true }),
  cut(seg(2.5, 12.75, 15.5, 12.75)),
  stroke(seg(9, 6.25, 9, 9.5)),
  mark('M9 2C9.9 3 10.25 3.6 10.25 4.1A1.25 1.25 0 0 1 7.75 4.1C7.75 3.6 8.1 3 9 2Z'),
]);

export const RibbonBowIcon = /*#__PURE__*/ createIcon('RibbonBow', () => [
  body('M9 8C7.5 4.75 5 3.25 3.5 4.25C2 5.25 2.5 7.5 4 8.5C5.5 9.5 7.5 9 9 8Z', { tint: true }),
  body('M9 8C10.5 4.75 13 3.25 14.5 4.25C16 5.25 15.5 7.5 14 8.5C12.5 9.5 10.5 9 9 8Z', {
    tint: true,
  }),
  stroke(roundPoly(1, 8.25, 9.75, 6.5, 15.5)),
  stroke(roundPoly(1, 9.75, 9.75, 11.5, 15.5)),
]);

// ---- wearables -----------------------------------------------------------------------

export const ShirtIcon = /*#__PURE__*/ createIcon('Shirt', () => [
  body(
    roundPolygon(
      1,
      6.5,
      2.5,
      2,
      5.25,
      3.75,
      8.5,
      5.5,
      7.75,
      5.5,
      15.5,
      12.5,
      15.5,
      12.5,
      7.75,
      14.25,
      8.5,
      16,
      5.25,
      11.5,
      2.5,
      9,
      4.5,
    ),
    { tint: true },
  ),
]);

export const HangerIcon = /*#__PURE__*/ createIcon('Hanger', () => [
  stroke('M9 8.5V7.25A2 2 0 1 1 11 5.25'),
  body(roundPolygon(1.25, 9, 8.5, 16, 13.75, 2, 13.75), { tint: true }),
]);

export const GlassesIcon = /*#__PURE__*/ createIcon('Glasses', () => [
  body(rect(2, 6.75, 6, 5.75, 2.5), { tint: true }),
  body(rect(10, 6.75, 6, 5.75, 2.5), { tint: true }),
  stroke(seg(8, 8.75, 10, 8.75)),
]);

export const SunglassesIcon = /*#__PURE__*/ createIcon('Sunglasses', () => [
  stroke(seg(2, 6.25, 16, 6.25)),
  mark(rect(3, 6.25, 5.5, 6, [0, 0, 3, 3])),
  mark(rect(9.5, 6.25, 5.5, 6, [0, 0, 3, 3])),
]);

export const HatIcon = /*#__PURE__*/ createIcon('Hat', () => [
  body(rect(5, 2.5, 8, 8.5, [2, 2, 0, 0]), { tint: true }),
  cut(seg(5, 8, 13, 8)),
  body(rect(2, 11, 14, 3.5, 1.75)),
  cut(seg(5, 11, 13, 11)),
]);

export const CapIcon = /*#__PURE__*/ createIcon('Cap', () => [
  body('M2.5 12C2.5 7 5.5 4.25 9 4.25C12.5 4.25 14.5 7 14.5 12Z', { tint: true }),
  cut('M9 4.5Q6.75 8 7 12'),
  body(roundPolygon(0.9, 10, 12, 16.25, 12.25, 14.75, 15.25)),
]);

export const ShoeIcon = /*#__PURE__*/ createIcon('Shoe', () => [
  body(
    roundPolygon(1.25, 2.5, 5.25, 7, 5.25, 8.75, 8, 13, 9, 15.75, 11.25, 15.75, 14.5, 2.5, 14.5),
    { tint: true },
  ),
  cut(seg(2.5, 11.75, 15.75, 11.75)),
]);

export const HandbagIcon = /*#__PURE__*/ createIcon('Handbag', () => [
  stroke('M6 7.25V5.5A3 3 0 0 1 12 5.5V7.25'),
  body(rect(2.5, 7.25, 13, 8.75, 2.5), { tint: true }),
  cut(seg(2.5, 10.25, 15.5, 10.25)),
  hole(9, 13, 1),
]);

export const DiamondRingIcon = /*#__PURE__*/ createIcon('DiamondRing', () => [
  stroke(arc(9, 12, 4, 40, 320)),
  body(roundPolygon(0.6, 6.5, 2.5, 11.5, 2.5, 13.5, 5, 9, 8.5, 4.5, 5), { tint: true }),
  cut(seg(4.5, 5, 13.5, 5)),
]);

export const NecklaceIcon = /*#__PURE__*/ createIcon('Necklace', () => [
  stroke('M3 3C3.5 9.5 6 12 9 12C12 12 14.5 9.5 15 3'),
  body(roundPolygon(0.75, 9, 11.75, 11.5, 14, 9, 16.25, 6.5, 14), { tint: true }),
]);

export const LipstickIcon = /*#__PURE__*/ createIcon('Lipstick', () => [
  body(roundPolygon(0.75, 7.5, 7.5, 7.5, 4.5, 10.5, 2.5, 10.5, 7.5), { tint: true }),
  body(rect(6.25, 7.5, 5.5, 3, 0.75)),
  body(rect(5.5, 10.5, 7, 5.5, 1.5)),
  cut(seg(7.5, 7.5, 10.5, 7.5)),
  cut(seg(5.5, 10.5, 12.5, 10.5)),
]);

export const PerfumeIcon = /*#__PURE__*/ createIcon('Perfume', () => [
  body(rect(3.25, 7.25, 9.5, 8.75, 2.5), { tint: true }),
  body(rect(6.25, 5, 3.5, 2.25, 0.5)),
  body(rect(5.5, 2.5, 5, 2.5, 1)),
  cut(seg(6.25, 7.25, 9.75, 7.25)),
  dot(14.75, 4.5),
  dot(15, 8, 1),
]);

export const BowTieIcon = /*#__PURE__*/ createIcon('BowTie', () => [
  body(roundPolygon(1.25, 2.25, 5, 2.25, 13, 7.25, 9), { tint: true }),
  body(roundPolygon(1.25, 15.75, 5, 15.75, 13, 10.75, 9), { tint: true }),
  body(rect(7.25, 7, 3.5, 4, 1.25)),
  cut(seg(7.25, 8, 7.25, 10)),
  cut(seg(10.75, 8, 10.75, 10)),
]);

export const MaskPartyIcon = /*#__PURE__*/ createIcon('MaskParty', () => [
  body(
    'M2 8.5C2 6 4 5.5 6 6.5C7.5 7.25 10.5 7.25 12 6.5C14 5.5 16 6 16 8.5C16 11.25 14 12.75 12.25 12.5C10.5 12.25 10 10.75 9 10.75C8 10.75 7.5 12.25 5.75 12.5C4 12.75 2 11.25 2 8.5Z',
    { tint: true },
  ),
  hole(5.5, 9, 1.25),
  hole(12.5, 9, 1.25),
]);
