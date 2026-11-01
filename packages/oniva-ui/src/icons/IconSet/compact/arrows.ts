import type { Part } from '../shapes';
import { arc, body, head, poly, polar, roundPoly, roundPolygon, seg, stroke } from '../shapes';

// Compact (12-unit grid) drawings. Keys are glyph names without the Icon suffix.

export const arrows: Record<string, () => Part[]> = {
  ArrowRight: () => [stroke(seg(1.75, 6, 10.25, 6)), stroke(head(10.25, 6, 90, 3))],
  ArrowLeft: () => [stroke(seg(10.25, 6, 1.75, 6)), stroke(head(1.75, 6, 270, 3))],
  ArrowUp: () => [stroke(seg(6, 10.25, 6, 1.75)), stroke(head(6, 1.75, 0, 3))],
  ArrowDown: () => [stroke(seg(6, 1.75, 6, 10.25)), stroke(head(6, 10.25, 180, 3))],
  ArrowUpRight: () => [stroke(seg(2.5, 9.5, 9.5, 2.5)), stroke(poly(4.5, 2.5, 9.5, 2.5, 9.5, 7.5))],
  ArrowDownRight: () => [stroke(seg(2.5, 2.5, 9.5, 9.5)), stroke(poly(9.5, 4.5, 9.5, 9.5, 4.5, 9.5))],
  ArrowUpLeft: () => [stroke(seg(9.5, 9.5, 2.5, 2.5)), stroke(poly(7.5, 2.5, 2.5, 2.5, 2.5, 7.5))],
  ArrowDownLeft: () => [stroke(seg(9.5, 2.5, 2.5, 9.5)), stroke(poly(2.5, 4.5, 2.5, 9.5, 7.5, 9.5))],

  ChevronDown: () => [stroke(poly(3, 4.5, 6, 7.5, 9, 4.5))],
  ChevronUp: () => [stroke(poly(3, 7.5, 6, 4.5, 9, 7.5))],
  ChevronLeft: () => [stroke(poly(7.5, 3, 4.5, 6, 7.5, 9))],
  ChevronRight: () => [stroke(poly(4.5, 3, 7.5, 6, 4.5, 9))],
  ChevronsUpDown: () => [
    stroke(poly(3.25, 4.75, 6, 2, 8.75, 4.75)),
    stroke(poly(3.25, 7.25, 6, 10, 8.75, 7.25)),
  ],
  ChevronsDown: () => [
    stroke(poly(3, 2.75, 6, 5.75, 9, 2.75)),
    stroke(poly(3, 6.25, 6, 9.25, 9, 6.25)),
  ],
  ChevronsUp: () => [
    stroke(poly(3, 5.75, 6, 2.75, 9, 5.75)),
    stroke(poly(3, 9.25, 6, 6.25, 9, 9.25)),
  ],
  ChevronsLeft: () => [
    stroke(poly(5.75, 3, 2.75, 6, 5.75, 9)),
    stroke(poly(9.25, 3, 6.25, 6, 9.25, 9)),
  ],
  ChevronsRight: () => [
    stroke(poly(2.75, 3, 5.75, 6, 2.75, 9)),
    stroke(poly(6.25, 3, 9.25, 6, 6.25, 9)),
  ],

  CaretDown: () => [body(roundPolygon(0.75, 2.5, 4.5, 9.5, 4.5, 6, 8.5), { tint: true })],
  CaretUp: () => [body(roundPolygon(0.75, 2.5, 7.5, 9.5, 7.5, 6, 3.5), { tint: true })],
  CaretLeft: () => [body(roundPolygon(0.75, 7.5, 2.5, 7.5, 9.5, 3.5, 6), { tint: true })],
  CaretRight: () => [body(roundPolygon(0.75, 4.5, 2.5, 4.5, 9.5, 8.5, 6), { tint: true })],

  ArrowUpDown: () => [
    stroke(seg(3.5, 10.25, 3.5, 1.75)),
    stroke(head(3.5, 1.75, 0, 2.5)),
    stroke(seg(8.5, 1.75, 8.5, 10.25)),
    stroke(head(8.5, 10.25, 180, 2.5)),
  ],
  ArrowLeftRight: () => [
    stroke(seg(1.75, 3.5, 10.25, 3.5)),
    stroke(head(10.25, 3.5, 90, 2.5)),
    stroke(seg(10.25, 8.5, 1.75, 8.5)),
    stroke(head(1.75, 8.5, 270, 2.5)),
  ],
  CornerDownLeft: () => [
    stroke(roundPoly(1.5, 10, 2.5, 10, 7.5, 2, 7.5)),
    stroke(head(2, 7.5, 270, 3)),
  ],
  Undo: () => [
    stroke('M4.5 10H7A2.75 2.75 0 0 0 7 4.5H2.25'),
    stroke(head(2.25, 4.5, 270, 2.75)),
  ],
  Redo: () => [
    stroke('M7.5 10H5A2.75 2.75 0 0 1 5 4.5H9.75'),
    stroke(head(9.75, 4.5, 90, 2.75)),
  ],
  Refresh: () => [
    stroke(arc(6, 6, 4.25, 285, 415)),
    stroke(head(...polar(6, 6, 4.25, 55), 145, 2.5)),
    stroke(arc(6, 6, 4.25, 105, 235)),
    stroke(head(...polar(6, 6, 4.25, 235), 325, 2.5)),
  ],
  RotateCcw: () => [
    stroke(arc(6, 6.75, 3.75, 0, 270)),
    stroke(head(6, 3, 270, 2.25)),
  ],
  RotateCw: () => [
    stroke(arc(6, 6.75, 3.75, 0, -270)),
    stroke(head(6, 3, 90, 2.25)),
  ],
  ExternalLink: () => [
    stroke('M5 2.25H3.75A1.5 1.5 0 0 0 2.25 3.75V8.25A1.5 1.5 0 0 0 3.75 9.75H8.25A1.5 1.5 0 0 0 9.75 8.25V7'),
    stroke(seg(5.5, 6.5, 9.75, 2.25)),
    stroke(head(9.75, 2.25, 45, 3)),
  ],
};
