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
  stroke,
} from '../shapes';

// Communication: messages, calls and mail.

// ---- shared constructions -------------------------------------------------

/** The speech bubble shared with MessageSquare: tail at the bottom-left, interior centered on 9,7.9. */
const BUBBLE =
  'M2 15V5.25A2.5 2.5 0 0 1 4.5 2.75H13.5A2.5 2.5 0 0 1 16 5.25V10.5A2.5 2.5 0 0 1 13.5 13H6.75L2.85 15.55Q2 16.1 2 15Z';

/** Plus modifier in the bottom-right zone. The base glyph stops on a circle of radius 5.25 around 13.75,13.75. */
const plusMod = () => [stroke(seg(13.75, 11.5, 13.75, 16)), stroke(seg(11.5, 13.75, 16, 13.75))];
const checkMod = () => [stroke(poly(11.5, 14, 13, 15.5, 16, 12.25))];
const xMod = () => [stroke(seg(11.75, 11.75, 15.75, 15.75)), stroke(seg(15.75, 11.75, 11.75, 15.75))];
const alertMod = () => [stroke(seg(13.75, 11.25, 13.75, 13.25)), dot(13.75, 15.75)];
const lockMod = () => [
  stroke('M12.75 13.25V12.25A1.25 1.25 0 0 1 15.25 12.25V13.25'),
  body(rect(11.25, 13.25, 5, 3.5, 1)),
];

/** Envelope with its bottom-right corner opened around a modifier; the flap line is shared. */
const mailBroken = (): Part[] => [
  body('M16 7.5V9V6.25A2.5 2.5 0 0 0 13.5 3.75H4.5A2.5 2.5 0 0 0 2 6.25V11.75A2.5 2.5 0 0 0 4.5 14.25H8.5H7', {
    tint: true,
    only: LINED,
  }),
  body('M16 9V6.25A2.5 2.5 0 0 0 13.5 3.75H4.5A2.5 2.5 0 0 0 2 6.25V11.75A2.5 2.5 0 0 0 4.5 14.25H8.5A5.25 5.25 0 0 1 16 9Z', {
    only: SOLID,
  }),
  cut(poly(4.75, 6.75, 9, 9.75, 13.25, 6.75)),
];

// ---- messages -------------------------------------------------------------

export const MessagePlusIcon = /*#__PURE__*/ createIcon('MessagePlus', () => [
  body(BUBBLE, { tint: true }),
  cut(seg(9, 5.75, 9, 10)),
  cut(seg(6.875, 7.875, 11.125, 7.875)),
]);

export const MessageXIcon = /*#__PURE__*/ createIcon('MessageX', () => [
  body(BUBBLE, { tint: true }),
  cut(seg(7.25, 6.15, 10.75, 9.65)),
  cut(seg(10.75, 6.15, 7.25, 9.65)),
]);

export const MessageCheckIcon = /*#__PURE__*/ createIcon('MessageCheck', () => [
  body(BUBBLE, { tint: true }),
  cut(poly(6.25, 8, 8.25, 10, 11.75, 6)),
]);

export const MessageDotsIcon = /*#__PURE__*/ createIcon('MessageDots', () => [
  body(BUBBLE, { tint: true }),
  hole(5.75, 7.875),
  hole(9, 7.875),
  hole(12.25, 7.875),
]);

export const MessageWarningIcon = /*#__PURE__*/ createIcon('MessageWarning', () => [
  body(BUBBLE, { tint: true }),
  cut(seg(9, 5.5, 9, 8.25)),
  hole(9, 10.5),
]);

export const MessageHeartIcon = /*#__PURE__*/ createIcon('MessageHeart', () => [
  body(BUBBLE, { tint: true }),
  cut('M9 10.4L6.75 8.15A1.6 1.6 0 0 1 9 5.9A1.6 1.6 0 0 1 11.25 8.15Z'),
]);

export const MessageReplyIcon = /*#__PURE__*/ createIcon('MessageReply', () => [
  body(BUBBLE, { tint: true }),
  cut(roundPoly(1, 11.5, 10, 11.5, 7, 6.25, 7)),
  cut(head(6.25, 7, 270, 2.75)),
]);

export const ChatLinesIcon = /*#__PURE__*/ createIcon('ChatLines', () => [
  body(BUBBLE, { tint: true }),
  cut(seg(5.75, 6, 12.25, 6)),
  cut(seg(5.75, 9.5, 9.5, 9.5)),
]);

/** Two bubbles: the front one carries the tint, the back one peeks out behind it. */
export const MessagesIcon = /*#__PURE__*/ createIcon('Messages', () => [
  stroke('M5.5 4.5A2.5 2.5 0 0 1 8 2H13.5A2.5 2.5 0 0 1 16 4.5V7A2.5 2.5 0 0 1 13.5 9.5'),
  body(
    'M2 15V10A2.5 2.5 0 0 1 4.5 7.5H8A2.5 2.5 0 0 1 10.5 10V11A2.5 2.5 0 0 1 8 13.5H5.5L2.85 15.55Q2 16.1 2 15Z',
    { tint: true },
  ),
]);

/** Bubble split by the off slash (y = x); both halves keep a 2.3 band clear of it. */
export const MessageOffIcon = /*#__PURE__*/ createIcon('MessageOff', () => [
  body('M5.93 2.75H13.5A2.5 2.5 0 0 1 16 5.25V10.5A2.5 2.5 0 0 1 15.36 12.18', { tint: true }),
  body('M2 5.25V15Q2 16.1 2.85 15.55L6.75 13H9.82', { tint: true }),
  stroke(seg(2.75, 2.75, 15.25, 15.25)),
]);

// ---- calls ----------------------------------------------------------------

/** Handset corners on the full-size grid (earpiece top-left, mouthpiece bottom-right, opening to the top-right). */
const HANDSET: readonly (readonly [number, number])[] = [
  [15.75, 13.5],
  [13.5, 15.75],
  [8.25, 15.25],
  [2.75, 9.75],
  [2.25, 4.5],
  [4.5, 2.25],
  [7.5, 5.25],
  [5.5, 7.25],
  [10.75, 12.5],
  [12.75, 10.5],
];

/** The handset scaled by `k` with its top-left at ox,oy, corners snapped to quarter units. */
function handset(k: number, ox: number, oy: number): string {
  const q = (v: number) => Math.round(v * 4) / 4;
  return roundPolygon(1.25, ...HANDSET.flatMap(([x, y]) => [q(ox + (x - 2.25) * k), q(oy + (y - 2.25) * k)]));
}

export const PhoneIcon = /*#__PURE__*/ createIcon('Phone', () => [body(handset(1, 2.25, 2.25), { tint: true })]);

export const PhoneCallIcon = /*#__PURE__*/ createIcon('PhoneCall', () => [
  body(handset(0.75, 2, 5.5), { tint: true }),
  stroke(arc(9.5, 8.5, 3.25, 0, 90)),
  stroke(arc(9.5, 8.5, 6.25, 0, 90)),
]);

export const PhoneIncomingIcon = /*#__PURE__*/ createIcon('PhoneIncoming', () => [
  body(handset(0.75, 2, 5.5), { tint: true }),
  stroke(seg(15.25, 2.75, 10.75, 7.25)),
  stroke(head(10.75, 7.25, 225, 3.5)),
]);

export const PhoneOutgoingIcon = /*#__PURE__*/ createIcon('PhoneOutgoing', () => [
  body(handset(0.75, 2, 5.5), { tint: true }),
  stroke(seg(10.75, 7.25, 15.25, 2.75)),
  stroke(head(15.25, 2.75, 45, 3.5)),
]);

export const PhoneMissedIcon = /*#__PURE__*/ createIcon('PhoneMissed', () => [
  body(handset(0.75, 2, 5.5), { tint: true }),
  stroke(seg(11.25, 2.75, 15.25, 6.75)),
  stroke(seg(15.25, 2.75, 11.25, 6.75)),
]);

/** Handset laid flat with both ends down: hanging up. */
export const PhoneOffIcon = /*#__PURE__*/ createIcon('PhoneOff', () => [
  body(
    roundPolygon(1.25, 2, 12, 2, 9.25, 5.5, 6.25, 12.5, 6.25, 16, 9.25, 16, 12, 12.25, 12, 12.25, 9.5, 5.75, 9.5, 5.75, 12),
    { tint: true },
  ),
]);

export const VoicemailIcon = /*#__PURE__*/ createIcon('Voicemail', () => [
  body(circle(4.75, 9, 2.75), { tint: true }),
  body(circle(13.25, 9, 2.75), { tint: true }),
  stroke(seg(4.75, 11.75, 13.25, 11.75)),
]);

// ---- video ----------------------------------------------------------------

export const VideoIcon = /*#__PURE__*/ createIcon('Video', () => [
  body(rect(2, 4.25, 9.5, 9.5, 2.5), { tint: true }),
  body('M11.5 8L14.5 6.25Q16 5.4 16 7V11Q16 12.6 14.5 11.75L11.5 10Z'),
]);

/** Camera split by the off slash; the lens wedge keeps only its upper edge. */
export const VideoOffIcon = /*#__PURE__*/ createIcon('VideoOff', () => [
  body('M7.43 4.25H9A2.5 2.5 0 0 1 11.5 6.75V8L14.5 6.25Q16 5.4 16 7V10.9L15.3 12', { tint: true }),
  body('M2.33 5.51A2.5 2.5 0 0 0 2 6.75V11.25A2.5 2.5 0 0 0 4.5 13.75H10.57', { tint: true }),
  stroke(seg(2.75, 2.75, 15.25, 15.25)),
]);

// ---- mail -----------------------------------------------------------------

export const MailPlusIcon = /*#__PURE__*/ createIcon('MailPlus', () => [...mailBroken(), ...plusMod()]);
export const MailCheckIcon = /*#__PURE__*/ createIcon('MailCheck', () => [...mailBroken(), ...checkMod()]);
export const MailXIcon = /*#__PURE__*/ createIcon('MailX', () => [...mailBroken(), ...xMod()]);
export const MailWarningIcon = /*#__PURE__*/ createIcon('MailWarning', () => [...mailBroken(), ...alertMod()]);
export const MailLockIcon = /*#__PURE__*/ createIcon('MailLock', () => [...mailBroken(), ...lockMod()]);

/** A stack: the front envelope is tinted, the one behind shows its top edge. */
export const MailsIcon = /*#__PURE__*/ createIcon('Mails', () => [
  stroke('M5.25 3.75H13.5A2.5 2.5 0 0 1 16 6.25V11.5'),
  body(rect(2, 6.75, 10.75, 9, 2.5), { tint: true }),
  cut(poly(4.75, 9.75, 7.375, 11.75, 10, 9.75)),
]);

// ---- signal ---------------------------------------------------------------

export const BroadcastIcon = /*#__PURE__*/ createIcon('Broadcast', () => [
  dot(9, 9, 1.25),
  stroke(arc(9, 9, 3.75, 225, 315)),
  stroke(arc(9, 9, 3.75, 45, 135)),
  stroke(arc(9, 9, 6.75, 220, 320)),
  stroke(arc(9, 9, 6.75, 40, 140)),
]);

export const RssIcon = /*#__PURE__*/ createIcon('Rss', () => [
  dot(5, 13, 1.25),
  stroke(arc(5, 13, 4.75, 0, 90)),
  stroke(arc(5, 13, 9.25, 0, 90)),
]);

export const AntennaIcon = /*#__PURE__*/ createIcon('Antenna', () => [
  dot(9, 6.5, 1.25),
  stroke(arc(9, 6.5, 3, 225, 315)),
  stroke(arc(9, 6.5, 3, 45, 135)),
  stroke(arc(9, 6.5, 5.5, 225, 315)),
  stroke(arc(9, 6.5, 5.5, 45, 135)),
  stroke(poly(5.25, 15.75, 9, 7.5, 12.75, 15.75)),
  stroke(seg(6.75, 12.75, 11.25, 12.75)),
]);

export const PodcastIcon = /*#__PURE__*/ createIcon('Podcast', () => [
  stroke(arc(9, 9, 6.75, 230, 490)),
  stroke(arc(9, 9, 3.75, 230, 490)),
  dot(9, 9, 1.5),
  stroke(seg(9, 12.25, 9, 15.75)),
]);

export const MicOffIcon = /*#__PURE__*/ createIcon('MicOff', () => [
  body('M6.7 3.52A2.5 2.5 0 0 1 11.5 4.5V8', { tint: true }),
  stroke('M3.5 7.5A5.5 5.5 0 0 0 9.76 12.95'),
  stroke('M13.63 10.46A5.5 5.5 0 0 0 14.5 7.5'),
  stroke(seg(9, 13, 9, 15.75)),
  stroke(seg(6.25, 15.75, 11.75, 15.75)),
  stroke(seg(2.75, 2.75, 15.25, 15.25)),
]);
