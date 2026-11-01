import { createIcon } from '../createIcon';
import type { Part } from '../shapes';
import { body, circle, cut, dot, hole, polar, poly, rect, roundPoly, seg, star, stroke } from '../shapes';

// Security: shields, locks, keys and access.

/** Same shield outline as Shield in status.ts. */
const SHIELD =
  'M9 16C5.5 14.75 3.25 12.25 3.25 8.75V5.25Q3.25 4.25 4.25 3.9L8.25 2.5Q9 2.25 9.75 2.5L13.75 3.9Q14.75 4.25 14.75 5.25V8.75C14.75 12.25 12.5 14.75 9 16Z';

/** A solid shape that is knocked out of the solid styles (like `hole`, for non-circles). */
const holeShape = (d: string): Part => ({ k: 'hole', d });

// ---- shields -------------------------------------------------------------

export const ShieldXIcon = /*#__PURE__*/ createIcon('ShieldX', () => [
  body(SHIELD, { tint: true }),
  cut(seg(7, 7.25, 11, 11.25)),
  cut(seg(11, 7.25, 7, 11.25)),
]);

export const ShieldPlusIcon = /*#__PURE__*/ createIcon('ShieldPlus', () => [
  body(SHIELD, { tint: true }),
  cut(seg(9, 6.75, 9, 11.75)),
  cut(seg(6.5, 9.25, 11.5, 9.25)),
]);

export const ShieldMinusIcon = /*#__PURE__*/ createIcon('ShieldMinus', () => [
  body(SHIELD, { tint: true }),
  cut(seg(6.5, 9.25, 11.5, 9.25)),
]);

export const ShieldLockIcon = /*#__PURE__*/ createIcon('ShieldLock', () => [
  body(SHIELD, { tint: true }),
  cut('M7.5 8.75V7.5a1.5 1.5 0 0 1 3 0V8.75'),
  cut(rect(6.5, 8.75, 5, 3.5, 1)),
]);

/** Shield split by the off slash: two open bodies, each stopping 2.25 from the slash. */
export const ShieldOffIcon = /*#__PURE__*/ createIcon('ShieldOff', () => [
  body('M6.35 3.17L8.25 2.5Q9 2.25 9.75 2.5L13.75 3.9Q14.75 4.25 14.75 5.25V8.75C14.75 9.62 14.61 10.43 14.35 11.17', {
    tint: true,
  }),
  body('M3.25 6.43V8.75C3.25 12.25 5.5 14.75 9 16C9.94 15.66 10.8 15.23 11.54 14.72', { tint: true }),
  stroke(seg(2.75, 2.75, 15.25, 15.25)),
]);

/** Left half is the solid side; the right half stays an outline. */
export const ShieldHalfIcon = /*#__PURE__*/ createIcon('ShieldHalf', () => [
  body('M9 16C5.5 14.75 3.25 12.25 3.25 8.75V5.25Q3.25 4.25 4.25 3.9L8.25 2.5Q8.625 2.375 9 2.375Z', { tint: true }),
  stroke('M9 2.375Q9.375 2.375 9.75 2.5L13.75 3.9Q14.75 4.25 14.75 5.25V8.75C14.75 12.25 12.5 14.75 9 16'),
]);

export const ShieldUserIcon = /*#__PURE__*/ createIcon('ShieldUser', () => [
  body(SHIELD, { tint: true }),
  hole(9, 6.75, 1.5),
  cut('M6.75 11.75Q6.75 9.75 9 9.75Q11.25 9.75 11.25 11.75Z'),
]);

export const ShieldKeyIcon = /*#__PURE__*/ createIcon('ShieldKey', () => [
  body(SHIELD, { tint: true }),
  hole(6.75, 9.25, 1.5),
  cut(seg(8.25, 9.25, 11.5, 9.25)),
  cut(seg(10.25, 9.25, 10.25, 11)),
]);

export const ShieldStarIcon = /*#__PURE__*/ createIcon('ShieldStar', () => [
  body(SHIELD, { tint: true }),
  holeShape(star(9, 9.25, 3.4, 1.6, 5, 0.4)),
]);

// ---- locks ---------------------------------------------------------------

/** Closed padlock: Lock's shackle and body, with the detail drawn by the caller. */
const lock = (...inside: Part[]): Part[] => [
  stroke('M5.75 8V5.75a3.25 3.25 0 0 1 6.5 0V8'),
  body(rect(3.25, 8, 11.5, 7.75, 2.25), { tint: true }),
  ...inside,
];

export const LockKeyholeIcon = /*#__PURE__*/ createIcon('LockKeyhole', () =>
  lock(hole(9, 11, 1.25), cut(seg(9, 11.75, 9, 13.25))),
);

export const LockCheckIcon = /*#__PURE__*/ createIcon('LockCheck', () =>
  lock(cut(poly(6.75, 11.75, 8.25, 13.25, 11.25, 10.25))),
);

export const LockPlusIcon = /*#__PURE__*/ createIcon('LockPlus', () =>
  lock(cut(seg(9, 10.25, 9, 13.75)), cut(seg(7.25, 12, 10.75, 12))),
);

export const LockXIcon = /*#__PURE__*/ createIcon('LockX', () =>
  lock(cut(seg(7.5, 10.5, 10.5, 13.5)), cut(seg(10.5, 10.5, 7.5, 13.5))),
);

// ---- keys ----------------------------------------------------------------

export const KeySquareIcon = /*#__PURE__*/ createIcon('KeySquare', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  hole(6.5, 9, 1.5),
  cut(seg(8, 9, 11.75, 9)),
  cut(seg(10.5, 9, 10.5, 11)),
]);

export const KeyRoundIcon = /*#__PURE__*/ createIcon('KeyRound', () => [
  body(circle(9, 5.75, 3.5), { tint: true }),
  hole(9, 5.75, 1),
  stroke(seg(9, 9.25, 9, 15.5)),
  stroke(seg(9, 12, 11.5, 12)),
  stroke(seg(9, 15.5, 11.5, 15.5)),
]);

/** Two keys side by side: the one behind is soft. */
export const KeysIcon = /*#__PURE__*/ createIcon('Keys', () => [
  body(circle(5.25, 5.75, 2), { tint: true }),
  stroke(seg(5.25, 7.75, 5.25, 15.5)),
  stroke(seg(5.25, 12.25, 7.5, 12.25)),
  stroke(circle(12.75, 5.75, 2), { soft: true }),
  stroke(seg(12.75, 7.75, 12.75, 15.5), { soft: true }),
  stroke(seg(12.75, 12.25, 15, 12.25), { soft: true }),
]);

/** Person (head and shoulders) with a key beneath. */
export const PasskeyIcon = /*#__PURE__*/ createIcon('Passkey', () => [
  body(circle(9, 5, 3)),
  body(circle(5, 12.75, 2.25), { tint: true }),
  hole(5, 12.75, 0.9),
  stroke(seg(7.25, 12.75, 15.75, 12.75)),
  stroke(seg(12.5, 12.75, 12.5, 15)),
]);

export const KeyholeIcon = /*#__PURE__*/ createIcon('Keyhole', () => [
  body(circle(9, 9, 7), { tint: true }),
  holeShape('M9 5.75A2 2 0 0 1 10.35 9.2L11.25 12.5H6.75L7.65 9.2A2 2 0 0 1 9 5.75Z'),
]);

// ---- biometrics ------------------------------------------------------------

export const FingerprintIcon = /*#__PURE__*/ createIcon('Fingerprint', () => [
  stroke('M2.75 11.5V9A6.25 6.25 0 0 1 15.25 9V10.5'),
  stroke('M5.75 14.75V9A3.25 3.25 0 0 1 12.25 9V13.5'),
  stroke('M9 9V13.25Q9 15 8 16'),
]);

const FACE_FRAME = [
  roundPoly(2, 2.75, 6.75, 2.75, 2.75, 6.75, 2.75),
  roundPoly(2, 11.25, 2.75, 15.25, 2.75, 15.25, 6.75),
  roundPoly(2, 15.25, 11.25, 15.25, 15.25, 11.25, 15.25),
  roundPoly(2, 6.75, 15.25, 2.75, 15.25, 2.75, 11.25),
];

export const ScanFaceIcon = /*#__PURE__*/ createIcon('ScanFace', () => [
  ...FACE_FRAME.map((d) => stroke(d)),
  dot(7, 7.75, 1),
  dot(11, 7.75, 1),
  stroke('M6.75 10.75Q9 13 11.25 10.75'),
]);

export const ScanEyeIcon = /*#__PURE__*/ createIcon('ScanEye', () => [
  ...FACE_FRAME.map((d) => stroke(d)),
  body('M5.25 9Q9 5.5 12.75 9Q9 12.5 5.25 9Z', { tint: true }),
  hole(9, 9, 1),
]);

// ---- devices and places ------------------------------------------------------

export const SirenIcon = /*#__PURE__*/ createIcon('Siren', () => {
  const ray = (deg: number): Part => {
    const [x1, y1] = polar(9, 10, 5.75, deg);
    const [x2, y2] = polar(9, 10, 7.5, deg);
    return stroke(seg(x1, y1, x2, y2));
  };
  return [
    body('M5.5 12.5V10A3.5 3.5 0 0 1 12.5 10V12.5Z', { tint: true }),
    body(rect(3.25, 12.5, 11.5, 3, 1.25)),
    ray(0),
    ray(-50),
    ray(50),
  ];
});

export const BugIcon = /*#__PURE__*/ createIcon('Bug', () => [
  stroke(poly(7.75, 6.5, 6.75, 3.75)),
  stroke(poly(10.25, 6.5, 11.25, 3.75)),
  body('M5.5 11C5.5 8 6.5 6.5 9 6.5S12.5 8 12.5 11C12.5 13.75 11.25 15.5 9 15.5S5.5 13.75 5.5 11Z', { tint: true }),
  cut(seg(9, 8, 9, 14)),
  stroke(seg(5.6, 9, 2.75, 7.5)),
  stroke(seg(5.5, 11.25, 2.5, 11.25)),
  stroke(seg(5.8, 13.5, 3, 15.25)),
  stroke(seg(12.4, 9, 15.25, 7.5)),
  stroke(seg(12.5, 11.25, 15.5, 11.25)),
  stroke(seg(12.2, 13.5, 15, 15.25)),
]);

export const VaultIcon = /*#__PURE__*/ createIcon('Vault', () => [
  body(rect(2, 2.5, 14, 11.5, 2.5), { tint: true }),
  cut(circle(7, 8.25, 2.5)),
  cut(seg(11.75, 8.25, 13.5, 8.25)),
  stroke(seg(5.5, 14, 5.5, 15.75)),
  stroke(seg(12.5, 14, 12.5, 15.75)),
]);

export const PasswordIcon = /*#__PURE__*/ createIcon('Password', () => [
  body(rect(2, 4.5, 14, 9, 2.5), { tint: true }),
  hole(5.5, 9, 1),
  hole(9, 9, 1),
  hole(12.5, 9, 1),
]);

export const TwoFactorIcon = /*#__PURE__*/ createIcon('TwoFactor', () => [
  body(rect(4.75, 2, 8.5, 14, 2), { tint: true }),
  cut(poly(6.75, 8.25, 8.25, 9.75, 11.25, 6.75)),
  hole(9, 13, 0.9),
]);

export const FirewallIcon = /*#__PURE__*/ createIcon('Firewall', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(seg(2, 7.25, 16, 7.25)),
  cut(seg(2, 10.75, 16, 10.75)),
  cut(seg(9, 3.75, 9, 7.25)),
  cut(seg(5.5, 7.25, 5.5, 10.75)),
  cut(seg(12.5, 7.25, 12.5, 10.75)),
  cut(seg(9, 10.75, 9, 14.25)),
]);

export const DoorLockIcon = /*#__PURE__*/ createIcon('DoorLock', () => [
  body(rect(3.5, 2, 11, 14, 2), { tint: true }),
  hole(11.25, 7, 1),
  hole(11.25, 10.75, 1),
]);

export const BadgeAlertIcon = /*#__PURE__*/ createIcon('BadgeAlert', () => [
  body(star(9, 9, 7.5, 5.5, 8, 2, 0), { tint: true }),
  cut(seg(9, 5.75, 9, 9.5)),
  hole(9, 12),
]);

export const CctvIcon = /*#__PURE__*/ createIcon('Cctv', () => [
  body(rect(2, 3, 14, 6.5, 2.25), { tint: true }),
  hole(11.75, 6.25, 1.5),
  stroke(seg(6, 9.5, 6, 15.25)),
  stroke(seg(3, 15.25, 9, 15.25)),
]);
