import type { Part } from '../shapes';
import { LINED, SOLID, body, circle, cut, head, hole, poly, rect, roundPoly, roundPolygon, seg, star, stroke } from '../shapes';

const C = Math.SQRT1_2;
const r3 = (v: number) => Math.round(v * 1000) / 1000;

/** Point on the diagonal frame used by Link: u runs bottom-left to top-right, v top-left to bottom-right. */
const diag = (u: number, v: number): string => `${r3(6 + (u + v) * C)} ${r3(6 + (v - u) * C)}`;

/** Tag drawn upright (house shape) and leaned 45 degrees so the point faces up-left. */
const tag = (x: number, y: number): [number, number] => [5.1 + (x + y) * C * 0.7, 5.1 + (y - x) * C * 0.7];

/** Pushpin drawn upright (x across, y down from its middle), then leaned 45 degrees: head up-right, needle down-left. */
const tack = (x: number, y: number): [number, number] => [6.35 + (x - y - 1.5) * C, 5.65 + (x + y + 1.5) * C];
const TACK = [-1.86, -4.34, 1.86, -4.34, 1.085, -0.93, 2.79, 0.465, 2.79, 1.395, -2.79, 1.395, -2.79, 0.465, -1.085, -0.93];

const PAGE = 'M7 1.75H4Q2.5 1.75 2.5 3.25V8.75Q2.5 10.25 4 10.25H8Q9.5 10.25 9.5 8.75V4.25Z';
const FOLD = 'M7 1.9V3.5A0.75 0.75 0 0 0 7.75 4.25H9.4';
const EYE_TOP = 'M1.5 6Q6 -1 10.5 6';
const EYE_BOTTOM = 'Q6 13 1.5 6Z';

export const objects: Record<string, () => Part[]> = {
  Bell: () => [
    body('M2.5 8.5H9.5L8.9 7.5Q8.5 6.8 8.5 5.9V4.75A2.5 2.5 0 0 0 3.5 4.75V5.9Q3.5 6.8 3.1 7.5Z', { tint: true }),
    stroke('M5 9.75A1 1 0 0 0 7 9.75'),
  ],
  Mail: () => [body(rect(1.75, 2.75, 8.5, 6.5, 1.5), { tint: true }), cut(poly(3.5, 4.75, 6, 6.75, 8.5, 4.75))],
  MailOpen: () => [
    body(
      'M1.75 5.25Q1.75 4.6 2.3 4.25L4.75 2.75Q6 1.75 7.25 2.75L9.7 4.25Q10.25 4.6 10.25 5.25V8.5A1.5 1.5 0 0 1 8.75 10H3.25A1.5 1.5 0 0 1 1.75 8.5Z',
      { tint: true },
    ),
    cut(poly(2, 5.25, 6, 7.5, 10, 5.25)),
  ],
  Calendar: () => [
    body(rect(1.75, 3.25, 8.5, 7, 1.5), { tint: true }),
    stroke(seg(4, 2, 4, 4)),
    stroke(seg(8, 2, 8, 4)),
    cut(seg(1.75, 5.75, 10.25, 5.75)),
  ],
  CalendarDays: () => [
    body(rect(1.75, 3.25, 8.5, 7, 1.5), { tint: true }),
    stroke(seg(4, 2, 4, 4)),
    stroke(seg(8, 2, 8, 4)),
    cut(seg(1.75, 5.75, 10.25, 5.75)),
    hole(4.25, 8.25, 0.7),
    hole(6, 8.25, 0.7),
    hole(7.75, 8.25, 0.7),
  ],
  Clock: () => [body(circle(6, 6, 4.75), { tint: true }), cut(poly(6, 3.5, 6, 6, 8, 7.25))],
  User: () => [
    body(circle(6, 3.25, 1.75)),
    body('M2.5 10.25C2.5 8.5 4 7.5 6 7.5S9.5 8.5 9.5 10.25Z', { tint: true }),
  ],
  UserRound: () => [
    body(circle(6, 3.5, 1.75), { tint: true }),
    stroke('M2 10.25A4 2.75 0 0 1 10 10.25', { only: LINED }),
    body('M2 10.25A4 2.75 0 0 1 10 10.25Z', { only: SOLID }),
  ],
  Users: () => [
    stroke(circle(8.5, 3.5, 1.25), { soft: true }),
    stroke('M8.5 6.5C9.6 6.7 10.5 7.7 10.5 9.5V10.25', { soft: true }),
    body(circle(4.25, 3.75, 1.5)),
    body('M1.5 10.25C1.5 8.5 2.75 7.5 4.25 7.5S7 8.5 7 10.25Z'),
  ],
  Home: () => [
    body(roundPolygon(0.75, 6, 1.75, 10.25, 5.75, 10.25, 10.25, 1.75, 10.25, 1.75, 5.75), { tint: true }),
    cut(poly(4.75, 10.25, 4.75, 7.5, 7.25, 7.5, 7.25, 10.25)),
  ],
  File: () => [body(PAGE, { tint: true }), cut(FOLD)],
  FileText: () => [
    body(PAGE, { tint: true }),
    cut(FOLD),
    cut(seg(4.5, 6.5, 7.5, 6.5)),
    cut(seg(4.5, 8.5, 6.5, 8.5)),
  ],
  Folder: () => [
    body(
      'M1.75 3.75Q1.75 2.75 2.75 2.75H4.75L6.25 4.25H9.25Q10.25 4.25 10.25 5.25V8.75Q10.25 9.75 9.25 9.75H2.75Q1.75 9.75 1.75 8.75Z',
      { tint: true },
    ),
  ],
  FolderOpen: () => [
    stroke('M1.75 8.5V3.5Q1.75 2.5 2.75 2.5H4.5L6 4H8.75Q9.75 4 9.75 5V5.5', { only: LINED }),
    body('M1.75 10V3.5Q1.75 2.5 2.75 2.5H4.5L6 4H8.75Q9.75 4 9.75 5V6.5H3Z', { only: SOLID }),
    cut(poly(1.2, 9.5, 3.1, 5.1, 10.75, 5.1), { only: SOLID }),
    body(roundPolygon(0.75, 1.75, 10.25, 3.5, 6.25, 10.75, 6.25, 9, 10.25), { tint: true }),
  ],
  Copy: () => [
    stroke('M3.25 7.5A1.5 1.5 0 0 1 1.75 6V3.25A1.5 1.5 0 0 1 3.25 1.75H6A1.5 1.5 0 0 1 7.5 3.25'),
    body(rect(5, 5, 5.25, 5.25, 1.5), { tint: true }),
  ],
  Trash: () => [
    stroke(seg(2.5, 3.25, 9.5, 3.25)),
    stroke('M4.75 3.25V2.5A0.75 0.75 0 0 1 5.5 1.75H6.5A0.75 0.75 0 0 1 7.25 2.5V3.25'),
    body('M2.9 3.25L3.3 9Q3.4 10.25 4.5 10.25H7.5Q8.6 10.25 8.7 9L9.1 3.25Z', { tint: true }),
    cut(seg(4.9, 5.5, 4.9, 8)),
    cut(seg(7.1, 5.5, 7.1, 8)),
  ],
  Pencil: () => [
    body(
      roundPolygon(0.5, 2.25, 9.75, 3.14, 7.1, 7.72, 2.52, 9.48, 4.28, 4.9, 8.86),
      { tint: true },
    ),
    cut(seg(6.32, 3.92, 8.08, 5.68)),
  ],
  Lock: () => [
    stroke('M4 5.5V3.5A2 2 0 0 1 8 3.5V5.5'),
    body(rect(2.25, 5.5, 7.5, 4.75, 1.5), { tint: true }),
    cut(seg(6, 7.25, 6, 8.25)),
  ],
  LockOpen: () => [
    stroke('M8 5.5V3.5A2 2 0 0 0 4 3.5'),
    body(rect(2.25, 5.5, 7.5, 4.75, 1.5), { tint: true }),
    cut(seg(6, 7.25, 6, 8.25)),
  ],
  Eye: () => [body(`${EYE_TOP}${EYE_BOTTOM}`, { tint: true }), cut(circle(6, 6, 1.25))],
  Link: () => [
    stroke(`M${diag(1, 2)}L${diag(3, 2)}A2 2 0 0 0 ${diag(3, -2)}L${diag(1, -2)}`),
    stroke(`M${diag(-1, -2)}L${diag(-3, -2)}A2 2 0 0 0 ${diag(-3, 2)}L${diag(-1, 2)}`),
    stroke(`M${diag(-1.5, 0)}L${diag(1.5, 0)}`),
  ],
  Download: () => [
    stroke(seg(6, 1.75, 6, 7.25)),
    stroke(head(6, 7.25, 180, 3)),
    stroke(roundPoly(1.5, 1.75, 7.5, 1.75, 10.25, 10.25, 10.25, 10.25, 7.5)),
  ],
  Upload: () => [
    stroke(seg(6, 7.25, 6, 1.75)),
    stroke(head(6, 1.75, 0, 3)),
    stroke(roundPoly(1.5, 1.75, 7.5, 1.75, 10.25, 10.25, 10.25, 10.25, 7.5)),
  ],
  Share: () => [
    stroke('M4 5.5H3.5A1.75 1.75 0 0 0 1.75 7.25V8.5A1.75 1.75 0 0 0 3.5 10.25H8.5A1.75 1.75 0 0 0 10.25 8.5V7.25A1.75 1.75 0 0 0 8.5 5.5H8'),
    stroke(seg(6, 7.5, 6, 1.75)),
    stroke(head(6, 1.75, 0, 2.5)),
  ],
  Star: () => [body(star(6, 6.4, 4.75, 2.3, 5, 0.7), { tint: true })],
  Heart: () => [
    body('M6 10C3.5 8.4 1.75 6.9 1.75 4.5A2.3 2.3 0 0 1 6 3.5A2.3 2.3 0 0 1 10.25 4.5C10.25 6.9 8.5 8.4 6 10Z', { tint: true }),
  ],
  Bookmark: () => [
    body('M2.75 3.25Q2.75 1.75 4.25 1.75H7.75Q9.25 1.75 9.25 3.25V10.25L6 8L2.75 10.25Z', { tint: true }),
  ],
  Tag: () => [
    body(
      roundPolygon(0.9, ...tag(0, -4.55), ...tag(2.98, -1.75), ...tag(2.98, 4.55), ...tag(-2.98, 4.55), ...tag(-2.98, -1.75)),
      { tint: true },
    ),
    hole(...tag(0, -1.75), 0.8),
  ],
  Pin: () => [
    body(roundPolygon(0.75, ...TACK.flatMap((v, i) => (i % 2 ? [] : tack(v, TACK[i + 1]!)))), { tint: true }),
    stroke(seg(...tack(0, 1.395), ...tack(0, 4.1))),
  ],
};
