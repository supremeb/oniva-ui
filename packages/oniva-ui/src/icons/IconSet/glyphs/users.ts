import { createIcon } from '../createIcon';
import type { Part } from '../shapes';
import {
  arc,
  body,
  circle,
  cut,
  dot,
  head,
  hole,
  LINED,
  poly,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  SOLID,
  star,
  stroke,
} from '../shapes';

// Users, people and identity.

/**
 * A user (head and shoulders) whose shoulders break around the bottom-right modifier zone.
 * Same construction as UserPlus: the base stops on a circle of radius 5.25 around 13.75,13.75.
 */
const userBase = (): Part[] => [
  body(circle(7.25, 5.75, 3)),
  body('M9.15 11.23C8.57 11.08 7.94 11 7.25 11C4 11 2 12.75 2 15.5H8.8', {
    tint: true,
    only: LINED,
  }),
  body('M9.15 11.23C8.57 11.08 7.94 11 7.25 11C4 11 2 12.75 2 15.5H8.8A5.25 5.25 0 0 1 9.15 11.23Z', {
    only: SOLID,
  }),
];

const MX = 13.75;

export const UserCheckIcon = /*#__PURE__*/ createIcon('UserCheck', () => [
  ...userBase(),
  stroke(poly(11.5, 13.75, 13.1, 15.4, 16.25, 12)),
]);

export const UserXIcon = /*#__PURE__*/ createIcon('UserX', () => [
  ...userBase(),
  stroke(seg(11.9, 11.9, 15.6, 15.6)),
  stroke(seg(15.6, 11.9, 11.9, 15.6)),
]);

export const UserMinusIcon = /*#__PURE__*/ createIcon('UserMinus', () => [
  ...userBase(),
  stroke(seg(11.5, MX, 16, MX)),
]);

export const UserLockIcon = /*#__PURE__*/ createIcon('UserLock', () => [
  ...userBase(),
  body(rect(11.25, 13.5, 5, 2.75, 1)),
  stroke('M12.5 13.5V12.5A1.25 1.25 0 0 1 15 12.5V13.5'),
]);

export const UserCogIcon = /*#__PURE__*/ createIcon('UserCog', () => [
  ...userBase(),
  body(roundPolygon(0.45, 13.75, 10.7, 14.88, 11.8, 16.39, 12.22, 16.0, 13.75, 16.39, 15.28, 14.88, 15.7, 13.75, 16.8, 12.62, 15.7, 11.11, 15.28, 11.5, 13.75, 11.11, 12.22, 12.62, 11.8)),
  hole(MX, MX, 0.95),
]);

export const UserSearchIcon = /*#__PURE__*/ createIcon('UserSearch', () => [
  ...userBase(),
  body(circle(13.1, 13.1, 2)),
  stroke(seg(14.6, 14.6, 16.25, 16.25)),
]);

export const UserStarIcon = /*#__PURE__*/ createIcon('UserStar', () => [
  ...userBase(),
  body(star(MX, 13.9, 3, 1.55, 5, 0.4)),
]);

export const UserHeartIcon = /*#__PURE__*/ createIcon('UserHeart', () => [
  ...userBase(),
  body(
    'M13.75 16.25C12.25 15.15 11.4 14.3 11.4 13.15C11.4 12.3 12 11.7 12.8 11.7C13.2 11.7 13.55 11.9 13.75 12.3C13.95 11.9 14.3 11.7 14.7 11.7C15.5 11.7 16.1 12.3 16.1 13.15C16.1 14.3 15.25 15.15 13.75 16.25Z',
  ),
]);

export const UserClockIcon = /*#__PURE__*/ createIcon('UserClock', () => [
  ...userBase(),
  body(circle(MX, MX, 2.9)),
  cut(poly(MX, 12.6, MX, MX, 14.9, 14.5)),
]);

export const UserShieldIcon = /*#__PURE__*/ createIcon('UserShield', () => [
  ...userBase(),
  body(roundPolygon(0.9, MX, 11.4, 16.2, 12.3, 16.2, 14.2, MX, 16.5, 11.3, 14.2, 11.3, 12.3)),
]);

export const UserPenIcon = /*#__PURE__*/ createIcon('UserPen', () => [
  ...userBase(),
  body(roundPolygon(0.5, 14.5, 11.75, 16.25, 13.5, 13.5, 16.25, 11.5, 16.5, 11.75, 14.5)),
]);

export const UserQuestionIcon = /*#__PURE__*/ createIcon('UserQuestion', () => [
  ...userBase(),
  stroke('M12.1 12.9A1.7 1.7 0 1 1 13.8 14.5V14.6'),
  dot(13.8, 16.4, 0.9),
]);

export const UserUpIcon = /*#__PURE__*/ createIcon('UserUp', () => [
  ...userBase(),
  stroke(seg(MX, 16.25, MX, 11.6)),
  stroke(head(MX, 11.6, 0, 3.25)),
]);

export const UserDownIcon = /*#__PURE__*/ createIcon('UserDown', () => [
  ...userBase(),
  stroke(seg(MX, 11.25, MX, 15.9)),
  stroke(head(MX, 15.9, 180, 3.25)),
]);

export const UserBlockIcon = /*#__PURE__*/ createIcon('UserBlock', () => [
  ...userBase(),
  body(circle(MX, MX, 2.9)),
  cut(seg(11.8, 15.7, 15.7, 11.8)),
]);

export const UserMessageIcon = /*#__PURE__*/ createIcon('UserMessage', () => [
  ...userBase(),
  body('M12.9 11.5H14.85A1.4 1.4 0 0 1 16.25 12.9V13.6A1.4 1.4 0 0 1 14.85 15H14L12.6 16.4V15A1.4 1.4 0 0 1 11.5 13.6V12.9A1.4 1.4 0 0 1 12.9 11.5Z'),
]);

export const UserSwitchIcon = /*#__PURE__*/ createIcon('UserSwitch', () => [
  ...userBase(),
  stroke(seg(11.5, 12.25, 16, 12.25)),
  stroke(head(16, 12.25, 90, 2.25)),
  stroke(seg(16, 15.25, 11.5, 15.25)),
  stroke(head(11.5, 15.25, 270, 2.25)),
]);

export const UserVoiceIcon = /*#__PURE__*/ createIcon('UserVoice', () => [
  body(circle(6.5, 5.75, 3)),
  body('M2 15.5C2 12.75 4 11 6.5 11S11 12.75 11 15.5Z', { tint: true }),
  stroke(arc(6.5, 5.75, 6, 60, 120), { soft: true }),
  stroke(arc(6.5, 5.75, 8.75, 62, 118), { soft: true }),
]);

export const UserCircleIcon = /*#__PURE__*/ createIcon('UserCircle', () => [
  body(circle(9, 9, 7), { tint: true }),
  hole(9, 7.25, 2),
  { k: 'hole', d: 'M5.9 13.1A3.1 2.6 0 0 1 12.1 13.1Z' } satisfies Part,
]);

export const UserSquareIcon = /*#__PURE__*/ createIcon('UserSquare', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  hole(9, 7.25, 2),
  { k: 'hole', d: 'M5.75 12.75A3.25 2.5 0 0 1 12.25 12.75Z' } satisfies Part,
]);

export const AvatarIcon = /*#__PURE__*/ createIcon('Avatar', () => [
  body(rect(2.5, 2.5, 13, 13, 6), { tint: true }),
  hole(9, 7.25, 2),
  { k: 'hole', d: 'M6 12.5A3 2.25 0 0 1 12 12.5Z' } satisfies Part,
]);

export const UsersThreeIcon = /*#__PURE__*/ createIcon('UsersThree', () => [
  stroke(circle(3.75, 4.75, 1.5), { soft: true }),
  stroke('M2 12.75V11.5C2 9.75 2.6 8.5 3.75 8.1', { soft: true }),
  stroke(circle(14.25, 4.75, 1.5), { soft: true }),
  stroke('M16 12.75V11.5C16 9.75 15.4 8.5 14.25 8.1', { soft: true }),
  body(circle(9, 7.5, 2.25)),
  body('M4.75 15.75C4.75 13.25 6.5 11.75 9 11.75S13.25 13.25 13.25 15.75Z', { tint: true }),
]);

export const UsersRoundIcon = /*#__PURE__*/ createIcon('UsersRound', () => [
  stroke(circle(13, 5.25, 2.25), { soft: true }),
  stroke('M12.5 10.3C14.6 10.5 16.25 12.4 16.25 15.5', { soft: true }),
  body(circle(6.5, 6.5, 2.75)),
  body('M1.75 15.75A4.75 3.75 0 0 1 11.25 15.75Z', { tint: true }),
]);

export const IdBadgeIcon = /*#__PURE__*/ createIcon('IdBadge', () => [
  stroke(seg(9, 2, 9, 5.5)),
  body(rect(4.25, 5.5, 9.5, 10.5, 2), { tint: true }),
  hole(9, 9.25, 1.4),
  { k: 'hole', d: 'M6.6 13.5A2.4 2 0 0 1 11.4 13.5Z' } satisfies Part,
]);

export const IdCardIcon = /*#__PURE__*/ createIcon('IdCard', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(rect(4.75, 6.75, 3.75, 4.5, 1)),
  cut(seg(10.75, 7.5, 13.25, 7.5)),
  cut(seg(10.75, 10.5, 12.5, 10.5)),
]);

export const CrownIcon = /*#__PURE__*/ createIcon('Crown', () => [
  body(roundPolygon(1, 2.5, 5.5, 6, 8.75, 9, 4, 12, 8.75, 15.5, 5.5, 14.5, 14, 3.5, 14), { tint: true }),
  cut(seg(4, 11.5, 14, 11.5)),
]);

export const ContactBookIcon = /*#__PURE__*/ createIcon('ContactBook', () => [
  body(rect(4.25, 2, 10.5, 14, 2), { tint: true }),
  cut(seg(7.25, 2.5, 7.25, 15.5)),
  hole(11, 6.75, 1.5),
  { k: 'hole', d: 'M8.9 12.25A2.1 2.1 0 0 1 13.1 12.25Z' } satisfies Part,
  stroke(seg(2, 5, 4.25, 5)),
  stroke(seg(2, 9, 4.25, 9)),
  stroke(seg(2, 13, 4.25, 13)),
]);

export const PersonStandingIcon = /*#__PURE__*/ createIcon('PersonStanding', () => [
  body(circle(9, 3.75, 1.75)),
  stroke(roundPoly(1, 3.75, 7.5, 9, 8.75, 14.25, 7.5)),
  stroke(roundPoly(1, 6.5, 16, 9, 8.75, 11.5, 16)),
]);

export const PersonWalkingIcon = /*#__PURE__*/ createIcon('PersonWalking', () => [
  body(circle(10.5, 3.5, 1.75)),
  stroke(roundPoly(1, 5.5, 8.5, 8.75, 7.25, 12.75, 9.75)),
  stroke(roundPoly(1, 11.75, 16, 11.25, 12.5, 8.75, 8, 8.5, 6.25)),
  stroke(roundPoly(1, 8.75, 8, 6.75, 12.75, 5, 15.75)),
]);

export const OrgChartIcon = /*#__PURE__*/ createIcon('OrgChart', () => [
  body(circle(9, 3.75, 1.75)),
  stroke(seg(9, 5.5, 9, 8.75)),
  stroke(roundPoly(1, 4.25, 12.5, 4.25, 8.75, 13.75, 8.75, 13.75, 12.5)),
  body(circle(4.25, 14.25, 1.75), { tint: true }),
  body(circle(13.75, 14.25, 1.75), { tint: true }),
]);
