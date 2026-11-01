import type { Part } from '../shapes';
import { LINED, SOLID, arc, body, circle, cut, dot, head, hole, mark, poly, rect, roundPoly, roundPolygon, sector, seg, stroke } from '../shapes';

const SQ = rect(1.75, 1.75, 8.5, 8.5, 1.5);
const ghost = (d: string): Part => ({ k: 'hole', d });

// Compact (12-unit grid) drawings. Keys are glyph names without the Icon suffix.
export const layout: Record<string, () => Part[]> = {
  LayoutGrid: () => [
    body(rect(1.75, 1.75, 3.5, 3.5, 1), { tint: true }),
    body(rect(6.75, 1.75, 3.5, 3.5, 1)),
    body(rect(1.75, 6.75, 3.5, 3.5, 1)),
    body(rect(6.75, 6.75, 3.5, 3.5, 1)),
  ],
  Layout: () => [body(SQ, { tint: true }), cut(seg(1.75, 5, 10.25, 5)), cut(seg(5, 5, 5, 10.25))],
  PanelLeft: () => [
    body(SQ),
    body(rect(1.75, 1.75, 3.25, 8.5, [1.5, 0, 0, 1.5]), { tint: true, only: 'duo' }),
    cut(seg(5, 1.75, 5, 10.25)),
  ],
  PanelRight: () => [
    body(SQ),
    body(rect(7, 1.75, 3.25, 8.5, [0, 1.5, 1.5, 0]), { tint: true, only: 'duo' }),
    cut(seg(7, 1.75, 7, 10.25)),
  ],
  Columns: () => [body(SQ, { tint: true }), cut(seg(4.6, 1.75, 4.6, 10.25)), cut(seg(7.4, 1.75, 7.4, 10.25))],
  Rows: () => [body(SQ, { tint: true }), cut(seg(1.75, 4.6, 10.25, 4.6)), cut(seg(1.75, 7.4, 10.25, 7.4))],
  Table: () => [
    body(SQ, { tint: true }),
    cut(seg(1.75, 4.75, 10.25, 4.75)),
    cut(seg(1.75, 7.5, 10.25, 7.5)),
    cut(seg(5.5, 1.75, 5.5, 10.25)),
  ],
  Kanban: () => [
    body(SQ, { tint: true }),
    cut(seg(3.9, 4.5, 3.9, 8.25)),
    cut(seg(6, 4.5, 6, 6.5)),
    cut(seg(8.1, 4.5, 8.1, 7.5)),
  ],
  List: () => [
    stroke(seg(5.5, 3, 10.5, 3)),
    stroke(seg(5.5, 6, 10.5, 6)),
    stroke(seg(5.5, 9, 10.5, 9)),
    dot(2.5, 3, 0.85),
    dot(2.5, 6, 0.85),
    dot(2.5, 9, 0.85),
  ],
  ListChecks: () => [
    stroke(poly(1.5, 3, 2.5, 4, 4.25, 2)),
    stroke(poly(1.5, 6.75, 2.5, 7.75, 4.25, 5.75)),
    stroke(seg(6.5, 3, 10.5, 3)),
    stroke(seg(6.5, 6.75, 10.5, 6.75)),
    stroke(seg(1.75, 10.25, 10.5, 10.25)),
  ],
  Dashboard: () => [
    body(rect(1.75, 1.75, 3.25, 4, 1.25), { tint: true }),
    body(rect(1.75, 8, 3.25, 2.25, 1)),
    body(rect(7, 1.75, 3.25, 2.25, 1)),
    body(rect(7, 6.25, 3.25, 4, 1.25), { tint: true }),
  ],
  AppWindow: () => [
    body(rect(1.5, 2.5, 9, 7, 1.5)),
    body(rect(1.5, 2.5, 9, 2.5, [1.5, 1.5, 0, 0]), { tint: true, only: 'duo' }),
    cut(seg(1.5, 5, 10.5, 5)),
    hole(3.5, 3.75, 0.55),
    hole(5.5, 3.75, 0.55),
  ],
  LogOut: () => [
    stroke('M5 2H3.75A1.75 1.75 0 0 0 2 3.75V8.25A1.75 1.75 0 0 0 3.75 10H5'),
    stroke(seg(4.75, 6, 10.25, 6)),
    stroke(head(10.25, 6, 90, 3)),
  ],
  LogIn: () => [
    stroke('M7 2H8.25A1.75 1.75 0 0 1 10 3.75V8.25A1.75 1.75 0 0 1 8.25 10H7'),
    stroke(seg(1.75, 6, 7.25, 6)),
    stroke(head(7.25, 6, 90, 3)),
  ],
  Expand: () => [
    stroke(seg(6.25, 5.75, 9.75, 2.25)),
    stroke(head(9.75, 2.25, 45, 3)),
    stroke(seg(5.75, 6.25, 2.25, 9.75)),
    stroke(head(2.25, 9.75, 225, 3)),
  ],
  Collapse: () => [
    stroke(seg(9.75, 2.25, 7, 5)),
    stroke(head(7, 5, 225, 2.75)),
    stroke(seg(2.25, 9.75, 5, 7)),
    stroke(head(5, 7, 45, 2.75)),
  ],
  Maximize: () => [
    stroke(roundPoly(1, 1.75, 4.75, 1.75, 1.75, 4.75, 1.75)),
    stroke(roundPoly(1, 7.25, 1.75, 10.25, 1.75, 10.25, 4.75)),
    stroke(roundPoly(1, 10.25, 7.25, 10.25, 10.25, 7.25, 10.25)),
    stroke(roundPoly(1, 4.75, 10.25, 1.75, 10.25, 1.75, 7.25)),
  ],
  Minimize: () => [
    stroke(roundPoly(1, 1.75, 4.75, 4.75, 4.75, 4.75, 1.75)),
    stroke(roundPoly(1, 7.25, 1.75, 7.25, 4.75, 10.25, 4.75)),
    stroke(roundPoly(1, 10.25, 7.25, 7.25, 7.25, 7.25, 10.25)),
    stroke(roundPoly(1, 4.75, 10.25, 4.75, 7.25, 1.75, 7.25)),
  ],
  PieChart: () => [
    body(sector(5.5, 6.5, 3.75, 90, 360)),
    body(sector(7.75, 4.25, 2.5, 0, 90), { tint: true }),
  ],
  BarChart: () => [
    stroke(seg(2.75, 10, 2.75, 7), { only: LINED }),
    stroke(seg(6, 10, 6, 4.5), { only: LINED }),
    stroke(seg(9.25, 10, 9.25, 2), { only: LINED }),
    mark(rect(1.6, 6.5, 2.3, 4, 0.75), { only: SOLID }),
    mark(rect(4.85, 4, 2.3, 6.5, 0.75), { only: SOLID }),
    mark(rect(8.1, 1.5, 2.3, 9, 0.75), { only: SOLID }),
  ],
  LineChart: () => [
    stroke(roundPoly(1.5, 1.75, 1.75, 1.75, 10.25, 10.25, 10.25)),
    stroke(poly(4.5, 8, 6, 6, 7.5, 7.25, 10, 3.5)),
  ],
  Activity: () => [stroke(poly(1.5, 6, 3.5, 6, 5, 2.25, 7, 9.75, 8.5, 6, 10.5, 6))],
  TrendingUp: () => [
    stroke(poly(1.75, 8.75, 4.5, 6, 6.5, 8, 10.25, 4.25)),
    stroke(poly(7, 4.25, 10.25, 4.25, 10.25, 7.5)),
  ],
  TrendingDown: () => [
    stroke(poly(1.75, 3.25, 4.5, 6, 6.5, 4, 10.25, 7.75)),
    stroke(poly(10.25, 4.5, 10.25, 7.75, 7, 7.75)),
  ],
  Gauge: () => [
    stroke(arc(6, 6.75, 4.5, 225, 495)),
    stroke(seg(6, 6.75, 8, 4.75)),
    dot(6, 6.75, 0.9),
  ],
  Target: () => [body(circle(6, 6, 4.5), { tint: true }), cut(circle(6, 6, 2.25))],
  Hourglass: () => [
    stroke(seg(3, 1.75, 9, 1.75)),
    stroke(seg(3, 10.25, 9, 10.25)),
    body(roundPolygonHour(), { tint: true }),
  ],
  Timer: () => [
    body(circle(6, 6.75, 3.75), { tint: true }),
    stroke(seg(5, 1.75, 7, 1.75)),
    stroke(seg(6, 1.75, 6, 3)),
    ghost(sector(6, 6.75, 1.9, 0, 120)),
  ],
  AlarmClock: () => [
    body(circle(6, 6.75, 3.75), { tint: true }),
    cut(poly(6, 4.75, 6, 6.75, 7.5, 7.75)),
    stroke(seg(1.5, 3.25, 2.75, 2)),
    stroke(seg(9.25, 2, 10.5, 3.25)),
  ],
  IdCard: () => [
    body(rect(1.25, 2.5, 9.5, 7, 1.5), { tint: true }),
    hole(4.25, 6, 1),
    cut(seg(7, 4.75, 9, 4.75)),
    cut(seg(7, 7.25, 9, 7.25)),
  ],
};

function roundPolygonHour(): string {
  return roundPolygon(0.75, 3.75, 1.75, 8.25, 1.75, 6.75, 6, 8.25, 10.25, 3.75, 10.25, 5.25, 6);
}
