import { createIcon } from '../createIcon';
import { arc, body, cut, hole, poly, rect, roundPolygon, seg, stroke } from '../shapes';

// Objects and tools that do not belong to another group.

export const CodeIcon = /*#__PURE__*/ createIcon('Code', () => [
  stroke(poly(6, 4.75, 2, 9, 6, 13.25)),
  stroke(poly(12, 4.75, 16, 9, 12, 13.25)),
]);

export const FlaskIcon = /*#__PURE__*/ createIcon('Flask', () => [
  body('M7 2.5V6.75L3.25 13.25Q2.4 15.5 4.75 15.5H13.25Q15.6 15.5 14.75 13.25L11 6.75V2.5Z', { tint: true }),
  stroke(seg(5.75, 2.5, 12.25, 2.5)),
  cut(seg(4.75, 10.75, 13.25, 10.75)),
]);

export const HandIcon = /*#__PURE__*/ createIcon('Hand', () => [
  body(
    'M5.25 10.5V6.25A1.5 1.5 0 0 1 8.25 6.25V4.5A1.5 1.5 0 0 1 11.25 4.5V6A1.5 1.5 0 0 1 14.25 6V11C14.25 14 12.25 16 9.5 16C7.75 16 6.5 15.25 5.5 14L3 10.75A1.3 1.3 0 0 1 5 9.1L5.25 9.4Z',
    { tint: true },
  ),
  cut(seg(8.25, 6.25, 8.25, 10)),
  cut(seg(11.25, 6, 11.25, 10)),
]);

export const HardDriveIcon = /*#__PURE__*/ createIcon('HardDrive', () => [
  body(rect(2, 4.25, 14, 9.5, 2.5), { tint: true }),
  cut(seg(2, 9.25, 16, 9.25)),
  cut(seg(4.75, 11.5, 8, 11.5)),
  hole(12.75, 11.5),
]);

export const StickyNoteIcon = /*#__PURE__*/ createIcon('StickyNote', () => [
  body('M4.5 2.5H13.5A2 2 0 0 1 15.5 4.5V10.5L10.5 15.5H4.5A2 2 0 0 1 2.5 13.5V4.5A2 2 0 0 1 4.5 2.5Z', { tint: true }),
  cut('M10.5 15.25V12.5A2 2 0 0 1 12.5 10.5H15.25'),
]);

export const TicketIcon = /*#__PURE__*/ createIcon('Ticket', () => [
  body(
    'M4 3.75H14A2 2 0 0 1 16 5.75V7.25A1.75 1.75 0 0 0 16 10.75V12.25A2 2 0 0 1 14 14.25H4A2 2 0 0 1 2 12.25V10.75A1.75 1.75 0 0 0 2 7.25V5.75A2 2 0 0 1 4 3.75Z',
    { tint: true },
  ),
  cut(seg(11, 6.25, 11, 6.75)),
  cut(seg(11, 8.75, 11, 9.25)),
  cut(seg(11, 11.25, 11, 11.75)),
]);

export const VolumeIcon = /*#__PURE__*/ createIcon('Volume', () => [
  body(roundPolygon(0.75, 2.25, 6.5, 5, 6.5, 8.75, 3.25, 8.75, 14.75, 5, 11.5, 2.25, 11.5), { tint: true }),
  stroke(arc(9.5, 9, 3, 40, 140)),
  stroke(arc(9.5, 9, 6, 45, 135)),
]);
