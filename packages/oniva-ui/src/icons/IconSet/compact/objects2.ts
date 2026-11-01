import type { Part } from '../shapes';
import { arc, body, circle, cut, ellipse, hole, poly, rect, roundPoly, roundPolygon, seg, SOLID, stroke } from '../shapes';

// Compact (12-unit grid) drawings. Keys are glyph names without the Icon suffix.

/** Paperclip drawn upright (x across, y along), then leaned 45 degrees about the centre of the grid. */
const clip = (x: number, y: number): string => {
  const c = Math.SQRT1_2;
  const r = (v: number) => Math.round(v * 100) / 100;
  return `${r(6.25 + (x - y) * c)} ${r(6 + (x + y) * c)}`;
};

const PAPERCLIP = `M${clip(0, -1.5)}L${clip(0, 2.5)}A1.125 1.125 0 0 0 ${clip(2.25, 2.5)}L${clip(2.25, -2.5)}A2.25 2.25 0 0 0 ${clip(-2.25, -2.5)}L${clip(-2.25, 1.5)}`;

export const objects2: Record<string, () => Part[]> = {
  Paperclip: () => [stroke(PAPERCLIP)],

  Image: () => [
    body(rect(1.25, 2.5, 9.5, 7, 1.5), { tint: true }),
    hole(4.25, 5, 0.8),
    cut(roundPoly(0.5, 4.5, 8, 7, 5.5, 9, 7.5)),
  ],

  Images: () => [
    stroke('M3.75 3A1.5 1.5 0 0 1 5.25 1.5H9A1.5 1.5 0 0 1 10.5 3V6'),
    body(rect(1.5, 4.75, 7, 5.5, 1.5), { tint: true }),
    cut(roundPoly(0.5, 3.25, 8.5, 5, 6.75, 6.75, 8.5)),
  ],

  Send: () => [
    body(roundPolygon(0.75, 10.25, 1.75, 1.75, 4.75, 5, 7, 7.25, 10.25), { tint: true }),
    cut(seg(5, 7, 7.5, 4.5)),
  ],

  Globe: () => [
    body(circle(6, 6, 4.75), { tint: true }),
    cut(seg(1.25, 6, 10.75, 6)),
    cut(ellipse(6, 6, 2.25, 4.75)),
  ],

  Map: () => [
    body(roundPolygon(0.75, 1.5, 3.25, 4.25, 2, 7.75, 3.25, 10.5, 2, 10.5, 8.75, 7.75, 10, 4.25, 8.75, 1.5, 10), {
      tint: true,
    }),
    cut(seg(4.25, 2.5, 4.25, 8.5)),
    cut(seg(7.75, 3.75, 7.75, 9.5)),
  ],

  MapPin: () => [
    body('M6.45 10.2L8.3 7.05A3.25 3.25 0 1 0 3.7 7.05L5.55 10.2Q6 10.9 6.45 10.2Z', { tint: true }),
    cut(circle(6, 4.75, 1.1), { only: ['outline', 'duo'] }),
    hole(6, 4.75, 1.5, { only: SOLID }),
  ],

  MessageSquare: () => [
    body(
      'M1.5 9.75V3.75A1.5 1.5 0 0 1 3 2.25H9A1.5 1.5 0 0 1 10.5 3.75V6.75A1.5 1.5 0 0 1 9 8.25H4.5L2.1 9.9Q1.5 10.3 1.5 9.75Z',
      { tint: true },
    ),
  ],

  MessageCircle: () => [body(`${arc(6.1, 5.75, 4.5, 236, 572)}L1.9 10.1Z`, { tint: true })],

  Messages: () => [
    stroke('M3.75 3A1.5 1.5 0 0 1 5.25 1.5H9A1.5 1.5 0 0 1 10.5 3V5'),
    body(
      'M1.5 10.25V6.75A1.5 1.5 0 0 1 3 5.25H6.5A1.5 1.5 0 0 1 8 6.75V7.5A1.5 1.5 0 0 1 6.5 9H3.75L2.1 10.3Q1.5 10.7 1.5 10.25Z',
      { tint: true },
    ),
  ],

  Phone: () => [
    body(
      roundPolygon(
        0.9, 10.75, 9.25, 9.25, 10.75, 5.75, 10.5, 2.25, 6.75, 1.75, 3.25, 3.25, 1.75, 5.25, 3.75, 3.9, 5.1, 7.5, 8.5,
        8.75, 7.25,
      ),
      { tint: true },
    ),
  ],

  Mic: () => [
    body(rect(4.25, 1.5, 3.5, 4.75, 1.75), { tint: true }),
    stroke('M2 5A4 4 0 0 0 10 5'),
    stroke(seg(6, 9, 6, 10.5)),
    stroke(seg(4.25, 10.5, 7.75, 10.5)),
  ],

  Video: () => [
    body(rect(1.25, 3, 6.75, 6, 1.5), { tint: true }),
    body('M8 5.25L9.9 4.2Q10.75 3.75 10.75 4.7V7.3Q10.75 8.25 9.9 7.8L8 6.75Z'),
  ],

  Film: () => [
    body(rect(1.25, 2.5, 9.5, 7, 1.5), { tint: true }),
    cut(seg(4, 2.5, 4, 9.5)),
    cut(seg(8, 2.5, 8, 9.5)),
    cut(seg(1.25, 4.75, 4, 4.75)),
    cut(seg(1.25, 7.25, 4, 7.25)),
    cut(seg(8, 4.75, 10.75, 4.75)),
    cut(seg(8, 7.25, 10.75, 7.25)),
  ],

  PhotoCamera: () => [
    body(
      'M3 3.75H4.2L4.8 2.5H7.2L7.8 3.75H9A1.5 1.5 0 0 1 10.5 5.25V8.5A1.5 1.5 0 0 1 9 10H3A1.5 1.5 0 0 1 1.5 8.5V5.25A1.5 1.5 0 0 1 3 3.75Z',
      { tint: true },
    ),
    cut(circle(6, 6.9, 1.75)),
  ],

  Inbox: () => [
    stroke('M1.5 6.75V4.25A1.5 1.5 0 0 1 3 2.75H9A1.5 1.5 0 0 1 10.5 4.25V6.75'),
    body('M1.5 6.75H3.5L4.75 8H7.25L8.5 6.75H10.5V8.25A1.5 1.5 0 0 1 9 9.75H3A1.5 1.5 0 0 1 1.5 8.25Z', {
      tint: true,
    }),
  ],

  Archive: () => [
    body(rect(1.25, 2.25, 9.5, 2.5, 1)),
    body('M2.25 4.75V8.5A1.5 1.5 0 0 0 3.75 10H8.25A1.5 1.5 0 0 0 9.75 8.5V4.75Z', { tint: true }),
    cut(seg(0.5, 4.75, 11.5, 4.75), { only: SOLID }),
    cut(seg(4.75, 7, 7.25, 7)),
  ],

  Package: () => {
    const v = [0, 60, 120, 180, 240, 300].flatMap((a) => {
      const t = ((a - 90) * Math.PI) / 180;
      return [6 + 4.75 * Math.cos(t), 6 + 4.75 * Math.sin(t)];
    });
    const r = (k: number) => Math.round(v[k]! * 100) / 100;
    return [
      body(roundPolygon(0.75, ...v), { tint: true }),
      cut(poly(r(10), r(11), 6, 6, r(2), r(3))),
      cut(seg(6, 6, r(6), r(7))),
    ];
  },

  Box: () => [
    body(rect(1.75, 2, 8.5, 8.5, 1.5), { tint: true }),
    cut(seg(1.75, 4.75, 10.25, 4.75)),
    cut(seg(6, 2, 6, 4.75)),
  ],

  Clipboard: () => [
    body(
      'M4 3H3.5A1.5 1.5 0 0 0 2 4.5V9A1.5 1.5 0 0 0 3.5 10.5H8.5A1.5 1.5 0 0 0 10 9V4.5A1.5 1.5 0 0 0 8.5 3H8V4H4Z',
      { tint: true },
    ),
    body(rect(4, 1.5, 4, 2.5, 0.75)),
    cut(seg(4, 4.25, 8, 4.25), { only: SOLID }),
  ],

  Notebook: () => [
    body(rect(3.5, 1.5, 6.75, 9, 1.5), { tint: true }),
    stroke(seg(1.5, 4, 3.5, 4)),
    stroke(seg(1.5, 8, 3.5, 8)),
    cut(seg(5.75, 4.5, 8.25, 4.5)),
  ],

  Book: () => [
    body(rect(2.25, 1.25, 7.5, 9.5, 1.5), { tint: true }),
    cut(seg(4.5, 1.25, 4.5, 10.75)),
    cut(seg(6.25, 4.5, 8, 4.5)),
  ],

  Key: () => [
    body(circle(3.75, 8.25, 2.5), { tint: true }),
    hole(3.75, 8.25, 0.75),
    stroke(poly(5.52, 6.48, 10.25, 1.75)),
    stroke(seg(9.25, 2.75, 10.5, 4)),
    stroke(seg(7.75, 4.25, 9, 5.5)),
  ],

  Shield: () => [
    body(
      'M6 10.5C3.6 9.9 2 8.25 2 5.9V3.4Q2 2.75 2.65 2.5L5.4 1.6Q6 1.4 6.6 1.6L9.35 2.5Q10 2.75 10 3.4V5.9C10 8.25 8.4 9.9 6 10.5Z',
      { tint: true },
    ),
  ],

  Gift: () => [
    body('M2.25 6V9A1.5 1.5 0 0 0 3.75 10.5H8.25A1.5 1.5 0 0 0 9.75 9V6', { tint: true }),
    body(rect(1.25, 3.5, 9.5, 2.5, 1)),
    cut(seg(6, 3.5, 6, 10.5)),
    stroke('M6 3.5C5 3.5 3.75 3 3.75 2.35C3.75 1.7 4.5 1.5 5.1 1.8C5.6 2.1 6 2.8 6 3.5'),
    stroke('M6 3.5C7 3.5 8.25 3 8.25 2.35C8.25 1.7 7.5 1.5 6.9 1.8C6.4 2.1 6 2.8 6 3.5'),
  ],

  Trophy: () => [
    body('M3.75 1.75H8.25V4.5A2.25 2.25 0 0 1 3.75 4.5Z', { tint: true }),
    stroke('M3.75 2.75H2.6A1.1 1.1 0 0 0 1.5 3.85C1.5 5 2.25 5.6 3.9 5.25'),
    stroke('M8.25 2.75H9.4A1.1 1.1 0 0 1 10.5 3.85C10.5 5 9.75 5.6 8.1 5.25'),
    stroke(seg(6, 6.75, 6, 10.5)),
    stroke(seg(4, 10.5, 8, 10.5)),
  ],

  Flag: () => [
    body(roundPolygon(0.75, 2.75, 2, 10, 4.75, 2.75, 7.5), { tint: true }),
    stroke(seg(2.75, 1.75, 2.75, 10.5)),
  ],

  Briefcase: () => [
    stroke('M4.5 3.5V3A1.25 1.25 0 0 1 5.75 1.75H6.25A1.25 1.25 0 0 1 7.5 3V3.5'),
    body(rect(1.25, 3.5, 9.5, 7, 1.5), { tint: true }),
    cut(seg(1.25, 6.5, 10.75, 6.5)),
    hole(6, 6.5, 0.9),
  ],

  Store: () => [
    body(roundPolygon(0.75, 3.5, 2.25, 8.5, 2.25, 10.5, 5.5, 1.5, 5.5), { tint: true }),
    cut(seg(5, 2.25, 4.5, 5.5)),
    cut(seg(7, 2.25, 7.5, 5.5)),
    stroke('M2.5 5.5V9A1.5 1.5 0 0 0 4 10.5H8A1.5 1.5 0 0 0 9.5 9V5.5'),
  ],

  Building: () => [
    body(rect(2.25, 1.25, 7.5, 9.5, 1.5), { tint: true }),
    hole(4.5, 3.5, 0.75),
    hole(7.5, 3.5, 0.75),
    hole(4.5, 5.75, 0.75),
    hole(7.5, 5.75, 0.75),
    cut('M5 10.75V9.25A1 1 0 0 1 7 9.25V10.75'),
  ],
};
