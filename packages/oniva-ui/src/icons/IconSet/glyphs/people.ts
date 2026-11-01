import { createIcon } from '../createIcon';
import type { Part } from '../shapes';
import {
  arc,
  body,
  circle,
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
  body(circle(9, 5.75, 3)),
  body('M3.5 15.5C3.5 12.75 5.75 11 9 11S14.5 12.75 14.5 15.5Z', { tint: true }),
]);

export const MailIcon = /*#__PURE__*/ createIcon('Mail', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(poly(4.75, 6.75, 9, 9.75, 13.25, 6.75)),
]);

export const CalendarIcon = /*#__PURE__*/ createIcon('Calendar', () => [
  body(rect(2.25, 3.5, 13.5, 12.25, 2.5), { tint: true }),
  stroke(seg(6, 2, 6, 4.75)),
  stroke(seg(12, 2, 12, 4.75)),
  cut(seg(2.25, 7.25, 15.75, 7.25)),
]);

export const ClockIcon = /*#__PURE__*/ createIcon('Clock', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(poly(9, 5.25, 9, 9, 11.75, 10.5)),
]);

export const MailOpenIcon = /*#__PURE__*/ createIcon('MailOpen', () => [
  body(
    'M2 8.25Q2 7 3 6.4L7.75 3.1Q9 2.25 10.25 3.1L15 6.4Q16 7 16 8.25V13.25A2.25 2.25 0 0 1 13.75 15.5H4.25A2.25 2.25 0 0 1 2 13.25Z',
    {
      tint: true,
    },
  ),
  cut(poly(2.5, 7.25, 9, 11.5, 15.5, 7.25)),
]);

export const MessageCircleIcon = /*#__PURE__*/ createIcon('MessageCircle', () => [
  body(`${arc(9.25, 8.75, 6.75, 236, 572)}L2.75 15.25Z`, { tint: true }),
]);

export const MessageSquareIcon = /*#__PURE__*/ createIcon('MessageSquare', () => [
  body(
    'M2 15V5.25A2.5 2.5 0 0 1 4.5 2.75H13.5A2.5 2.5 0 0 1 16 5.25V10.5A2.5 2.5 0 0 1 13.5 13H6.75L2.85 15.55Q2 16.1 2 15Z',
    {
      tint: true,
    },
  ),
]);

export const MegaphoneIcon = /*#__PURE__*/ createIcon('Megaphone', () => [
  body(roundPolygon(1, 6.5, 6.25, 15.25, 2.75, 15.25, 15, 6.5, 11.5), { tint: true }),
  body(rect(2.25, 6.25, 4.25, 5.25, [1.5, 0, 0, 1.5])),
  stroke(roundPoly(0.75, 3.75, 11.5, 4.5, 15, 6.75, 15, 6.75, 12.25)),
]);

export const MicIcon = /*#__PURE__*/ createIcon('Mic', () => [
  body(rect(6.5, 2, 5, 8.25, 2.5), { tint: true }),
  stroke('M3.5 7.5A5.5 5.5 0 0 0 14.5 7.5'),
  stroke(seg(9, 13, 9, 15.75)),
  stroke(seg(6.25, 15.75, 11.75, 15.75)),
]);

/** Plus modifier in the bottom-right zone. The base glyph stops on a circle of radius 5.25 around its center. */
const plusMod = () => [stroke(seg(13.75, 11.5, 13.75, 16)), stroke(seg(11.5, 13.75, 16, 13.75))];

export const UserPlusIcon = /*#__PURE__*/ createIcon('UserPlus', () => [
  body(circle(7.25, 5.75, 3)),
  body('M9.15 11.23C8.57 11.08 7.94 11 7.25 11C4 11 2 12.75 2 15.5H8.8', {
    tint: true,
    only: LINED,
  }),
  body(
    'M9.15 11.23C8.57 11.08 7.94 11 7.25 11C4 11 2 12.75 2 15.5H8.8A5.25 5.25 0 0 1 9.15 11.23Z',
    { only: SOLID },
  ),
  ...plusMod(),
]);

export const UserRoundIcon = /*#__PURE__*/ createIcon('UserRound', () => [
  body(circle(9, 5.75, 3.25), { tint: true }),
  stroke('M3 15.75A6 3.75 0 0 1 15 15.75', { only: LINED }),
  body('M3 15.75A6 3.75 0 0 1 15 15.75Z', { only: SOLID }),
]);

export const UsersIcon = /*#__PURE__*/ createIcon('Users', () => [
  stroke(circle(13, 4.5, 2), { soft: true }),
  stroke('M12.5 9.75C14.6 9.9 16 11.75 16 14.25V15.5', { soft: true }),
  body(circle(6.25, 6.75, 2.75)),
  body('M2 15.5C2 13.25 3.75 11.75 6.25 11.75S10.5 13.25 10.5 15.5Z'),
]);

export const ContactIcon = /*#__PURE__*/ createIcon('Contact', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  hole(6.5, 7, 1.5),
  { k: 'hole', d: 'M4.25 12.25A2.25 2 0 0 1 8.75 12.25Z' } satisfies Part,
  cut(seg(10.75, 7.75, 13, 7.75)),
  cut(seg(10.75, 10.75, 12.25, 10.75)),
]);

export const BotIcon = /*#__PURE__*/ createIcon('Bot', () => [
  body(rect(3.75, 6.25, 10.5, 9.25, 2.5), { tint: true }),
  stroke(seg(9, 6.25, 9, 3.75)),
  dot(9, 3, 1.25),
  stroke(seg(2, 10.75, 3.75, 10.75)),
  stroke(seg(14.25, 10.75, 16, 10.75)),
  cut(seg(6.75, 9.75, 6.75, 11.25)),
  cut(seg(11.25, 9.75, 11.25, 11.25)),
]);

export const BrainIcon = /*#__PURE__*/ createIcon('Brain', () => [
  body(
    'M9 3.25C8.25 2.25 6 2.25 5.25 3.75C3.5 3.75 2.5 5.5 3 7.25C1.75 8.25 1.75 10.5 3.25 11.25C3 13.25 4.5 15 6.5 14.75C7.25 15.75 8.75 15.75 9 14.75' +
      'C9.25 15.75 10.75 15.75 11.5 14.75C13.5 15 15 13.25 14.75 11.25C16.25 10.5 16.25 8.25 15 7.25C15.5 5.5 14.5 3.75 12.75 3.75C12 2.25 9.75 2.25 9 3.25Z',
    { tint: true },
  ),
  cut(seg(9, 3.5, 9, 14.5)),
  cut('M3.5 7.5Q5.75 7.25 6 9.25'),
  cut('M15 10.75Q12.5 10.75 12 8.75'),
]);

export const CalendarDaysIcon = /*#__PURE__*/ createIcon('CalendarDays', () => [
  body(rect(2.25, 3.5, 13.5, 12.25, 2.5), { tint: true }),
  stroke(seg(6, 2, 6, 4.75)),
  stroke(seg(12, 2, 12, 4.75)),
  cut(seg(2.25, 7.25, 15.75, 7.25)),
  hole(5.75, 10.25),
  hole(9, 10.25),
  hole(12.25, 10.25),
  hole(5.75, 13.25),
  hole(9, 13.25),
  hole(12.25, 13.25),
]);

export const CalendarPlusIcon = /*#__PURE__*/ createIcon('CalendarPlus', () => [
  // The open ends double back along themselves so the duo tint closes on a chord clear of the plus.
  body(
    'M15.75 7.25V8.9V6A2.5 2.5 0 0 0 13.25 3.5H4.75A2.5 2.5 0 0 0 2.25 6V13.25A2.5 2.5 0 0 0 4.75 15.75H8.9H7.25',
    {
      tint: true,
      only: LINED,
    },
  ),
  body(
    'M15.75 8.9V6A2.5 2.5 0 0 0 13.25 3.5H4.75A2.5 2.5 0 0 0 2.25 6V13.25A2.5 2.5 0 0 0 4.75 15.75H8.9A5.25 5.25 0 0 1 15.75 8.9Z',
    {
      only: SOLID,
    },
  ),
  stroke(seg(6, 2, 6, 4.75)),
  stroke(seg(12, 2, 12, 4.75)),
  cut(seg(2.25, 7.25, 15.75, 7.25)),
  ...plusMod(),
]);

export const GlobeIcon = /*#__PURE__*/ createIcon('Globe', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(2, 9, 16, 9)),
  cut(ellipse(9, 9, 3, 7)),
]);

export const MapIcon = /*#__PURE__*/ createIcon('Map', () => [
  body(
    roundPolygon(
      1,
      2,
      4.5,
      6.5,
      2.75,
      11.5,
      4.5,
      16,
      2.75,
      16,
      13.5,
      11.5,
      15.25,
      6.5,
      13.5,
      2,
      15.25,
    ),
    { tint: true },
  ),
  cut(seg(6.5, 3.25, 6.5, 13.5)),
  cut(seg(11.5, 4.5, 11.5, 14.75)),
]);

export const MapPinIcon = /*#__PURE__*/ createIcon('MapPin', () => [
  body('M9.6 15.3L13.19 11.06A5.5 5.5 0 1 0 4.81 11.06L8.4 15.3Q9 16 9.6 15.3Z', { tint: true }),
  cut(circle(9, 7.5, 2), { only: LINED }),
  hole(9, 7.5, 2.75, { only: SOLID }),
]);

export const TelescopeIcon = /*#__PURE__*/ createIcon('Telescope', () => [
  body(roundPolygon(1, 2.62, 9.45, 13.38, 2.08, 15.88, 6.41, 4.12, 12.05), { tint: true }),
  cut(seg(10.6, 3.95, 12.85, 7.85)),
  stroke(poly(6.5, 15.75, 9.6, 9.75, 12.75, 15.75)),
]);

export const RadarIcon = /*#__PURE__*/ createIcon('Radar', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(arc(9, 9, 3.5, 180, 405)),
  cut(seg(9, 9, ...polar(9, 9, 5.25, 45))),
  hole(...polar(9, 9, 3.75, 125)),
]);
