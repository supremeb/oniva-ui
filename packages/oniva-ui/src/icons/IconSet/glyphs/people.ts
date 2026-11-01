import { createIcon } from '../createIcon';
import type { Part } from '../shapes';
import {
  arc,
  body,
  circle,
  clear,
  cut,
  dot,
  ellipse,
  hole,
  LINED,
  polar,
  poly,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  SOLID,
  stroke,
} from '../shapes';

// People, communication, time and place.

export const UserIcon = /*#__PURE__*/ createIcon('User', () => [
  body(circle(9, 5.5, 3.25)),
  body('M2.75 16.25C2.75 13.25 5.5 11.5 9 11.5S15.25 13.25 15.25 16.25Z', { tint: true }),
]);

export const MailIcon = /*#__PURE__*/ createIcon('Mail', () => [
  body(rect(1.75, 3.5, 14.5, 11, 3), { tint: true }),
  cut(poly(4.75, 7, 9, 10.25, 13.25, 7)),
]);

export const CalendarIcon = /*#__PURE__*/ createIcon('Calendar', () => [
  body(rect(2, 3.5, 14, 12.75, 3), { tint: true }),
  stroke(seg(6, 1.75, 6, 4.75)),
  stroke(seg(12, 1.75, 12, 4.75)),
  cut(seg(2, 7.75, 16, 7.75)),
]);

export const ClockIcon = /*#__PURE__*/ createIcon('Clock', () => [
  body(circle(9, 9, 7.25), { tint: true }),
  cut(poly(9, 4.75, 9, 9, 12, 12)),
]);

export const MailOpenIcon = /*#__PURE__*/ createIcon('MailOpen', () => [
  body(
    'M1.75 8Q1.75 7 2.6 6.4L7.9 2.9Q9 2.2 10.1 2.9L15.4 6.4Q16.25 7 16.25 8V12.5A3 3 0 0 1 13.25 15.5H4.75A3 3 0 0 1 1.75 12.5Z',
    { tint: true },
  ),
  cut(poly(4.5, 8.5, 9, 11.75, 13.5, 8.5)),
]);

export const MessageCircleIcon = /*#__PURE__*/ createIcon('MessageCircle', () => [
  body(`${arc(9, 9, 7.25, 238, 572)}L2.25 15.75Z`, { tint: true }),
]);

export const MessageSquareIcon = /*#__PURE__*/ createIcon('MessageSquare', () => [
  body(
    'M4.75 2.5H13.25A3 3 0 0 1 16.25 5.5V10.5A3 3 0 0 1 13.25 13.5H8.25L4.75 16.25V13.5A3 3 0 0 1 1.75 10.5V5.5A3 3 0 0 1 4.75 2.5Z',
    { tint: true },
  ),
]);

export const MegaphoneIcon = /*#__PURE__*/ createIcon('Megaphone', () => [
  body(roundPolygon(1.5, 2, 6.25, 6.5, 6.25, 15.5, 2.5, 15.5, 14.5, 6.5, 11.75, 2, 11.75), {
    tint: true,
  }),
  stroke(roundPoly(1, 5, 11.75, 5.5, 15.5, 8.25, 15.5, 8.25, 12.5)),
]);

export const MicIcon = /*#__PURE__*/ createIcon('Mic', () => [
  body(rect(6.5, 1.75, 5, 8.5, 2.5), { tint: true }),
  stroke('M3.25 8A5.75 5.75 0 0 0 14.75 8'),
  stroke(seg(9, 13.75, 9, 16.25)),
  stroke(seg(6, 16.25, 12, 16.25)),
]);

/** Plus modifier in the bottom-right zone. The base glyph is erased on a disc of radius 5.25 around it. */
const plusMod = (): Part[] => [
  clear(circle(13.75, 13.75, 5.25)),
  stroke(seg(13.75, 11.25, 13.75, 16.25)),
  stroke(seg(11.25, 13.75, 16.25, 13.75)),
];

export const UserPlusIcon = /*#__PURE__*/ createIcon('UserPlus', () => [
  body(circle(6.75, 5.5, 3.25)),
  body('M2 16.25C2 13.25 4.25 11.5 6.75 11.5S11.5 13.25 11.5 16.25Z', { tint: true }),
  ...plusMod(),
]);

export const UserRoundIcon = /*#__PURE__*/ createIcon('UserRound', () => [
  body(circle(9, 9, 7.25), { tint: true }),
  cut(circle(9, 7, 2.25)),
  cut('M4.9 14.1C5.6 12.1 7.1 11.5 9 11.5S12.4 12.1 13.1 14.1'),
]);

export const UsersIcon = /*#__PURE__*/ createIcon('Users', () => [
  stroke(arc(13, 5.5, 2.5, -20, 180), { soft: true }),
  stroke('M13 11.25C15 11.25 16.25 13 16.25 16.25', { soft: true }),
  body(circle(6, 6.25, 2.75)),
  body('M1.75 16.25C1.75 13.25 3.75 11.75 6 11.75S10.25 13.25 10.25 16.25Z'),
]);

export const ContactIcon = /*#__PURE__*/ createIcon('Contact', () => [
  body(rect(1.75, 3.5, 14.5, 11, 3), { tint: true }),
  hole(6.5, 7.25, 1.5),
  { k: 'hole', d: 'M4 11.5A2.5 2.25 0 0 1 9 11.5Z' } satisfies Part,
  cut(seg(11, 7.25, 13.5, 7.25)),
  cut(seg(11, 10.5, 13.5, 10.5)),
]);

export const BotIcon = /*#__PURE__*/ createIcon('Bot', () => [
  body(rect(2, 6.25, 14, 9.75, 3), { tint: true }),
  stroke(seg(9, 6.25, 9, 3.75)),
  dot(9, 2.75, 1.25),
  cut(seg(6.25, 9.5, 6.25, 12.5)),
  cut(seg(11.75, 9.5, 11.75, 12.5)),
]);

/** Brain outline: the left half is listed top to bottom as cubic segments and mirrored for the right half. */
const brainPath = (): string => {
  const start: [number, number] = [9, 3.4];
  const segs: number[][] = [
    [8.1, 2.2, 6, 2, 5.1, 3.3],
    [3.2, 3.2, 2.2, 5, 2.8, 6.7],
    [1.5, 7.7, 1.5, 10.2, 3, 11.1],
    [2.8, 13.2, 4.4, 14.9, 6.4, 14.5],
    [7.3, 15.7, 8.6, 15.6, 9, 14.6],
  ];
  const mx = (v: number) => 18 - v;
  let d = `M${start[0]} ${start[1]}`;
  for (const s of segs) d += `C${s.join(' ')}`;
  for (let i = segs.length - 1; i >= 0; i--) {
    const s = segs[i]!;
    const prev = i === 0 ? start : [segs[i - 1]![4]!, segs[i - 1]![5]!];
    d += `C${mx(s[2]!)} ${s[3]} ${mx(s[0]!)} ${s[1]} ${mx(prev[0]!)} ${prev[1]}`;
  }
  return `${d}Z`;
};

export const BrainIcon = /*#__PURE__*/ createIcon('Brain', () => [
  body(brainPath(), { tint: true }),
  cut(seg(9, 3.4, 9, 14.6)),
  cut('M2.9 7C5.2 6.8 6.3 8 6.3 10.25'),
  cut('M15.1 7C12.8 6.8 11.7 8 11.7 10.25'),
]);

export const CalendarDaysIcon = /*#__PURE__*/ createIcon('CalendarDays', () => [
  body(rect(2, 3.5, 14, 12.75, 3), { tint: true }),
  stroke(seg(6, 1.75, 6, 4.75)),
  stroke(seg(12, 1.75, 12, 4.75)),
  cut(seg(2, 7.75, 16, 7.75)),
  hole(6.25, 10.75, 1.25),
  hole(11.75, 10.75, 1.25),
  hole(6.25, 13.5, 1.25),
  hole(11.75, 13.5, 1.25),
]);

export const CalendarPlusIcon = /*#__PURE__*/ createIcon('CalendarPlus', () => [
  body(rect(2, 3.5, 14, 12.75, 3), { tint: true }),
  stroke(seg(6, 1.75, 6, 4.75)),
  stroke(seg(12, 1.75, 12, 4.75)),
  cut(seg(2, 7.75, 16, 7.75)),
  ...plusMod(),
]);

export const GlobeIcon = /*#__PURE__*/ createIcon('Globe', () => [
  body(circle(9, 9, 7.25), { tint: true }),
  cut(seg(1.75, 9, 16.25, 9)),
  cut(ellipse(9, 9, 3.25, 7.25)),
]);

export const MapIcon = /*#__PURE__*/ createIcon('Map', () => [
  body(
    roundPolygon(
      1.25,
      1.75,
      4.5,
      6.25,
      2.75,
      11.75,
      4.5,
      16.25,
      2.75,
      16.25,
      13.5,
      11.75,
      15.25,
      6.25,
      13.5,
      1.75,
      15.25,
    ),
    { tint: true },
  ),
  cut(seg(6.25, 3.5, 6.25, 13)),
  cut(seg(11.75, 5.25, 11.75, 14.75)),
]);

export const MapPinIcon = /*#__PURE__*/ createIcon('MapPin', () => [
  body('M4.65 10.61A5.5 5.5 0 1 1 13.35 10.61L9.74 15.29Q9 16.25 8.26 15.29Z', { tint: true }),
  cut(circle(9, 7.25, 2.25), { only: LINED }),
  hole(9, 7.25, 3, { only: SOLID }),
]);

/** Telescope: a tube rising at 30 degrees from the eyepiece, on a two-leg tripod. */
const telescope = (): Part[] => {
  const rad = (30 * Math.PI) / 180;
  const u: [number, number] = [Math.cos(rad), -Math.sin(rad)];
  const nrm: [number, number] = [Math.sin(rad), Math.cos(rad)];
  const e: [number, number] = [3, 10.8];
  const len = 12.5;
  const at = (t: number, w: number): [number, number] => [
    e[0] + u[0] * len * t + nrm[0] * w,
    e[1] + u[1] * len * t + nrm[1] * w,
  ];
  const wAt = (t: number) => 1.75 + t * 1.25;
  const [a, b, c, f] = [at(0, -1.75), at(1, -3), at(1, 3), at(0, 1.75)];
  const [m1, m2] = [at(0.62, -wAt(0.62)), at(0.62, wAt(0.62))];
  return [
    body(roundPolygon(1.25, a[0], a[1], b[0], b[1], c[0], c[1], f[0], f[1]), { tint: true }),
    cut(seg(m1[0], m1[1], m2[0], m2[1])),
    stroke(poly(6.25, 16.25, 9.5, 9.8, 12.75, 16.25)),
  ];
};

export const TelescopeIcon = /*#__PURE__*/ createIcon('Telescope', telescope);

export const RadarIcon = /*#__PURE__*/ createIcon('Radar', () => [
  body(circle(9, 9, 7.25), { tint: true }),
  cut(circle(9, 9, 3.5)),
  cut(seg(9, 9, ...polar(9, 9, 7.25, 45))),
]);
