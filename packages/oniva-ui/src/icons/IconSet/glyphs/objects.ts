import { createIcon } from '../createIcon';
import { arc, body, cut, hole, poly, rect, roundPolygon, seg, stroke } from '../shapes';

// Objects and tools that do not belong to another group.

export const CodeIcon = /*#__PURE__*/ createIcon('Code', () => [
  stroke(poly(6.5, 4.5, 2, 9, 6.5, 13.5)),
  stroke(poly(11.5, 4.5, 16, 9, 11.5, 13.5)),
]);

export const FlaskIcon = /*#__PURE__*/ createIcon('Flask', () => [
  body('M6.75 2V7L2.9 13.6Q1.9 16 4.4 16H13.6Q16.1 16 15.1 13.6L11.25 7V2Z', { tint: true }),
  stroke(seg(5.25, 2, 12.75, 2)),
  cut(seg(4, 11, 14, 11)),
]);

export const HandIcon = /*#__PURE__*/ createIcon('Hand', () => [
  body(
    'M6.15 10.5V6.5A1.5 1.5 0 0 1 9.15 6.5V3.75A1.5 1.5 0 0 1 12.15 3.75V6A1.5 1.5 0 0 1 15.15 6V11C15.15 14.2 13.1 16.25 10.4 16.25C8.4 16.25 7.1 15.4 6 14L3.5 10.9A1.4 1.4 0 0 1 5.7 9.2L6.15 9.7Z',
    { tint: true },
  ),
  cut(seg(9.15, 6.5, 9.15, 10.5)),
  cut(seg(12.15, 6, 12.15, 10.5)),
]);

export const HardDriveIcon = /*#__PURE__*/ createIcon('HardDrive', () => [
  body(rect(1.75, 3.5, 14.5, 11, 3), { tint: true }),
  cut(seg(1.75, 9, 16.25, 9)),
  hole(12.5, 11.75),
]);

export const StickyNoteIcon = /*#__PURE__*/ createIcon('StickyNote', () => [
  body('M5 2H13A3 3 0 0 1 16 5V10.5L10.5 16H5A3 3 0 0 1 2 13V5A3 3 0 0 1 5 2Z', { tint: true }),
  cut('M10.5 16V12.75A2.25 2.25 0 0 1 12.75 10.5H16'),
]);

export const TicketIcon = /*#__PURE__*/ createIcon('Ticket', () => [
  body(
    'M4.75 3.5H13.25A3 3 0 0 1 16.25 6.5V7.25A1.75 1.75 0 0 0 16.25 10.75V11.5A3 3 0 0 1 13.25 14.5H4.75A3 3 0 0 1 1.75 11.5V10.75A1.75 1.75 0 0 0 1.75 7.25V6.5A3 3 0 0 1 4.75 3.5Z',
    { tint: true },
  ),
  cut(seg(11.25, 6.5, 11.25, 11.5)),
]);

export const VolumeIcon = /*#__PURE__*/ createIcon('Volume', () => [
  body(roundPolygon(1, 1.75, 6.5, 5, 6.5, 8.75, 2.75, 8.75, 15.25, 5, 11.5, 1.75, 11.5), { tint: true }),
  stroke(arc(8.75, 9, 3.75, 50, 130)),
  stroke(arc(8.75, 9, 7.25, 45, 135)),
]);
