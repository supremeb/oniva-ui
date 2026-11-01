import { createIcon } from '../createIcon';
import { arc, body, circle, cut, ellipse, head, hole, LINED, mark, poly, rect, roundPoly, roundPolygon, seg, SOLID, stroke } from '../shapes';

// Data, development, devices, commerce and media.

const r3 = (v: number) => {
  const r = Math.round(v * 1000) / 1000;
  return String(Object.is(r, -0) ? 0 : r);
};

/**
 * Local frame for diagonal glyphs: `u` runs along the axis (toward `deg`, 0 = up, 90 = right) and `v`
 * runs across it. Returns a point formatter, so paths can be written once in the local frame.
 * A rotation keeps arc sweep flags, so arcs written in the local frame stay valid.
 */
function frame(cx: number, cy: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return (u: number, v: number) => `${r3(cx + u * c - v * s)} ${r3(cy + u * s + v * c)}`;
}

/** Parses a "x y" point string from `frame` into numbers. */
const xy = (s: string): [number, number] => {
  const [x, y] = s.split(' ').map(Number);
  return [x!, y!];
};

/** Crescent: circle 1 with circle 2 bitten out of it. */
function crescent(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const d = Math.hypot(dx, dy);
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(r1 * r1 - a * a);
  const px = x1 + (a * dx) / d;
  const py = y1 + (a * dy) / d;
  const ax = px - (h * dy) / d;
  const ay = py + (h * dx) / d;
  const bx = px + (h * dy) / d;
  const by = py - (h * dx) / d;
  const cosT = (d * d + r2 * r2 - r1 * r1) / (2 * d * r2);
  const large = cosT < 0 ? 1 : 0;
  return `M${r3(ax)} ${r3(ay)}A${r1} ${r1} 0 1 1 ${r3(bx)} ${r3(by)}A${r2} ${r2} 0 ${large} 0 ${r3(ax)} ${r3(ay)}Z`;
}

export const DatabaseIcon = /*#__PURE__*/ createIcon('Database', () => [
  body('M2.5 4.5V13.5A6.5 2.75 0 0 0 15.5 13.5V4.5Z', { tint: true }),
  body(ellipse(9, 4.5, 6.5, 2.75)),
  stroke('M2.5 9A6.5 2.75 0 0 0 15.5 9', { only: LINED }),
  cut('M2.5 4.5A6.5 2.75 0 0 0 15.5 4.5', { only: SOLID }),
  cut('M2.5 9A6.5 2.75 0 0 0 15.5 9', { only: SOLID }),
]);

export const BarChartIcon = /*#__PURE__*/ createIcon('BarChart', () => [
  stroke(seg(3.5, 15.5, 3.5, 10.5), { only: LINED }),
  stroke(seg(9, 15.5, 9, 6.5), { only: LINED }),
  stroke(seg(14.5, 15.5, 14.5, 2.5), { only: LINED }),
  mark(rect(1.75, 9.75, 3.5, 6.5, 1.25), { only: SOLID }),
  mark(rect(7.25, 5.75, 3.5, 10.5, 1.25), { only: SOLID }),
  mark(rect(12.75, 1.75, 3.5, 14.5, 1.25), { only: SOLID }),
]);

export const LineChartIcon = /*#__PURE__*/ createIcon('LineChart', () => [
  stroke(roundPoly(2.5, 2, 2, 2, 16, 16, 16)),
  stroke(poly(5.5, 12, 9, 8.5, 11.5, 11, 15.5, 7)),
]);

export const ServerIcon = /*#__PURE__*/ createIcon('Server', () => [
  body(rect(1.75, 1.75, 14.5, 5.75, 2.75), { tint: true }),
  body(rect(1.75, 10.5, 14.5, 5.75, 2.75), { tint: true }),
  hole(5.5, 4.625, 1.25),
  hole(5.5, 13.375, 1.25),
]);

export const CpuIcon = /*#__PURE__*/ createIcon('Cpu', () => [
  body(rect(4.25, 4.25, 9.5, 9.5, 2.25), { tint: true }),
  cut(rect(7.25, 7.25, 3.5, 3.5, 1)),
  stroke(seg(7.25, 1.75, 7.25, 4.25)),
  stroke(seg(10.75, 1.75, 10.75, 4.25)),
  stroke(seg(7.25, 13.75, 7.25, 16.25)),
  stroke(seg(10.75, 13.75, 10.75, 16.25)),
  stroke(seg(1.75, 7.25, 4.25, 7.25)),
  stroke(seg(1.75, 10.75, 4.25, 10.75)),
  stroke(seg(13.75, 7.25, 16.25, 7.25)),
  stroke(seg(13.75, 10.75, 16.25, 10.75)),
]);

export const TerminalIcon = /*#__PURE__*/ createIcon('Terminal', () => [
  body(rect(1.75, 3.5, 14.5, 11, 3), { tint: true }),
  cut(poly(5.75, 6.5, 8.25, 9, 5.75, 11.5)),
  cut(seg(10, 11.5, 12.75, 11.5)),
]);

export const WebhookIcon = /*#__PURE__*/ createIcon('Webhook', () => {
  const cx = 9;
  const cy = 10.25;
  const r = 5.75;
  const nodes = [0, 120, 240];
  return [
    ...nodes.map((a) => {
      const [x, y] = xy(frame(cx, cy, a)(r, 0));
      return body(circle(x, y, 2.25));
    }),
    ...nodes.map((a) => stroke(arc(cx, cy, r, a + 23, a + 97))),
  ];
});

export const WorkflowIcon = /*#__PURE__*/ createIcon('Workflow', () => [
  body(rect(1.75, 1.75, 6.5, 6.5, 2), { tint: true }),
  body(rect(9.75, 9.75, 6.5, 6.5, 2), { tint: true }),
  stroke(roundPoly(2.25, 5, 8.25, 5, 13, 9.75, 13)),
]);

export const BranchIcon = /*#__PURE__*/ createIcon('Branch', () => [
  body(circle(5, 4, 2.25)),
  body(circle(5, 14, 2.25)),
  body(circle(13, 4, 2.25)),
  stroke(seg(5, 6.25, 5, 11.75)),
  stroke('M13 6.25V7A3.5 3.5 0 0 1 9.5 10.5H5'),
]);

export const MergeIcon = /*#__PURE__*/ createIcon('Merge', () => [
  body(circle(5, 4, 2.25)),
  body(circle(13, 4, 2.25)),
  body(circle(9, 14, 2.25)),
  stroke('M5 6.25V6.5A3.5 3.5 0 0 0 8.5 10H9V11.75'),
  stroke('M13 6.25V6.5A3.5 3.5 0 0 1 9.5 10H9'),
]);

export const PullRequestIcon = /*#__PURE__*/ createIcon('PullRequest', () => [
  body(circle(5, 4, 2.25)),
  body(circle(5, 14, 2.25)),
  body(circle(13, 14, 2.25)),
  stroke(seg(5, 6.25, 5, 11.75)),
  stroke(seg(13, 11.75, 13, 3.5)),
  stroke(head(13, 3.5, 0, 3.5)),
]);

export const PlugIcon = /*#__PURE__*/ createIcon('Plug', () => [
  stroke(seg(6.5, 1.75, 6.5, 5.5)),
  stroke(seg(11.5, 1.75, 11.5, 5.5)),
  body('M3.5 7.5V7A1.5 1.5 0 0 1 5 5.5H13A1.5 1.5 0 0 1 14.5 7V7.5A5.5 5.5 0 0 1 3.5 7.5Z', { tint: true }),
  stroke(seg(9, 13, 9, 16.25)),
]);

export const WrenchIcon = /*#__PURE__*/ createIcon('Wrench', () => {
  const p = frame(11.5, 6.5, 45);
  return [
    body(
      `M${p(-10.5, -1.5)}L${p(-4.243, -1.5)}A4.5 4.5 0 0 1 ${p(4.243, -1.5)}L${p(1.75, -1.5)}` +
        `A1.5 1.5 0 0 0 ${p(1.75, 1.5)}L${p(4.243, 1.5)}A4.5 4.5 0 0 1 ${p(-4.243, 1.5)}L${p(-10.5, 1.5)}` +
        `A1.5 1.5 0 0 1 ${p(-10.5, -1.5)}Z`,
      { tint: true },
    ),
  ];
});

export const CreditCardIcon = /*#__PURE__*/ createIcon('CreditCard', () => [
  body(rect(1.75, 3.5, 14.5, 11, 3), { tint: true }),
  cut(seg(1.75, 7.5, 16.25, 7.5)),
  cut(seg(5.25, 11.25, 8.5, 11.25)),
]);

export const WalletIcon = /*#__PURE__*/ createIcon('Wallet', () => [
  body(rect(1.75, 3, 14.5, 12, 3), { tint: true }),
  cut('M16.25 6.75H12A2.75 2.75 0 0 0 12 12.25H16.25'),
]);

export const DollarIcon = /*#__PURE__*/ createIcon('Dollar', () => [
  stroke(
    'M13 6C12.25 4.75 10.75 4.25 9 4.25C6.75 4.25 5.25 5.25 5.25 6.75C5.25 8.5 7 9 9 9.25C11 9.5 12.75 10 12.75 11.75' +
      'C12.75 13.25 11.25 14.25 9 14.25C7.25 14.25 5.75 13.75 5 12.5',
  ),
  stroke(seg(9, 1.75, 9, 4.25)),
  stroke(seg(9, 14.25, 9, 16.25)),
]);

export const LandmarkIcon = /*#__PURE__*/ createIcon('Landmark', () => [
  body(roundPolygon(1.25, 9, 1.75, 16.25, 6.5, 1.75, 6.5), { tint: true }),
  stroke(seg(4.5, 9.75, 4.5, 13)),
  stroke(seg(9, 9.75, 9, 13)),
  stroke(seg(13.5, 9.75, 13.5, 13)),
  stroke(seg(2, 16, 16, 16)),
]);

export const BuildingIcon = /*#__PURE__*/ createIcon('Building', () => [
  body(rect(3.25, 1.75, 11.5, 14.5, 2.75), { tint: true }),
  hole(6.75, 5.5, 1.1),
  hole(11.25, 5.5, 1.1),
  hole(6.75, 9, 1.1),
  hole(11.25, 9, 1.1),
  cut('M7.5 16.25V14A1.5 1.5 0 0 1 10.5 14V16.25'),
]);

export const TruckIcon = /*#__PURE__*/ createIcon('Truck', () => [
  body(roundPolygon(1.25, 1.75, 3.25, 10.75, 3.25, 10.75, 6.5, 13, 6.5, 16.25, 9.75, 16.25, 12, 1.75, 12), { only: SOLID }),
  cut(circle(5.5, 13.75, 3), { only: SOLID }),
  cut(circle(12.5, 13.75, 3), { only: SOLID }),
  stroke(
    'M3.06 12H3A1.25 1.25 0 0 1 1.75 10.75V4.5A1.25 1.25 0 0 1 3 3.25H9.5A1.25 1.25 0 0 1 10.75 4.5V6.5H13L16.25 9.75' +
      'V10.75A1.25 1.25 0 0 1 15 12H14.94',
    { only: LINED },
  ),
  stroke(seg(7.94, 12, 10.06, 12), { only: LINED }),
  body(circle(5.5, 13.75, 1.5)),
  body(circle(12.5, 13.75, 1.5)),
]);

export const RocketIcon = /*#__PURE__*/ createIcon('Rocket', () => {
  const p = frame(8.5, 9.5, 45);
  return [
    body(
      `M${p(-4, -3.25)}L${p(1, -3.25)}Q${p(6, -3.25)} ${p(8.5, 0)}Q${p(6, 3.25)} ${p(1, 3.25)}L${p(-4, 3.25)}Z`,
      { tint: true },
    ),
    body(`M${p(0, -3.25)}L${p(-4, -5.5)}L${p(-4, -3.25)}Z`),
    body(`M${p(0, 3.25)}L${p(-4, 5.5)}L${p(-4, 3.25)}Z`),
    hole(...xy(p(2, 0)), 1.25),
    stroke(`M${p(-6.5, 0)}L${p(-8.5, 0)}`),
  ];
});

export const PillIcon = /*#__PURE__*/ createIcon('Pill', () => {
  const p = frame(9, 9, 45);
  return [
    body(`M${p(0, -3.25)}L${p(-3.5, -3.25)}A3.25 3.25 0 0 0 ${p(-3.5, 3.25)}L${p(0, 3.25)}Z`, { tint: true }),
    body(`M${p(0, -3.25)}L${p(3.5, -3.25)}A3.25 3.25 0 0 1 ${p(3.5, 3.25)}L${p(0, 3.25)}Z`),
    cut(`M${p(0, -3.25)}L${p(0, 3.25)}`, { only: SOLID }),
  ];
});

export const StethoscopeIcon = /*#__PURE__*/ createIcon('Stethoscope', () => [
  stroke('M3.5 1.75V7A3 3 0 0 0 9.5 7V1.75'),
  stroke('M6.5 10V11.5A3.875 3.875 0 0 0 14.25 11.5V10.75'),
  body(circle(14.25, 9, 1.75), { tint: true }),
]);

export const ThermometerIcon = /*#__PURE__*/ createIcon('Thermometer', () => [
  body('M7 9.88V3.75A2 2 0 0 1 11 3.75V9.88A3.5 3.5 0 1 1 7 9.88Z', { tint: true }),
  hole(9, 12.75, 1.5),
]);

export const IceCreamIcon = /*#__PURE__*/ createIcon('IceCream', () => [
  body('M3 8A6 6 0 0 1 15 8Z', { tint: true }),
  body(roundPolygon(1.25, 4.25, 8, 13.75, 8, 9, 16.75)),
  cut(seg(3, 8, 15, 8), { only: SOLID }),
]);

export const SunIcon = /*#__PURE__*/ createIcon('Sun', () => [
  body(circle(9, 9, 2.75), { tint: true }),
  ...[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
    const p = frame(9, 9, a);
    return stroke(`M${p(5.25, 0)}L${p(7.25, 0)}`);
  }),
]);

export const MoonIcon = /*#__PURE__*/ createIcon('Moon', () => [
  body(crescent(9, 9, 7.25, 13.75, 4.25, 5.75), { tint: true }),
]);

export const PlayIcon = /*#__PURE__*/ createIcon('Play', () => [
  body(roundPolygon(1.5, 5, 2.25, 16, 9, 5, 15.75), { tint: true }),
]);

export const PauseIcon = /*#__PURE__*/ createIcon('Pause', () => [
  body(rect(3.75, 2.25, 3.75, 13.5, 1.5), { tint: true }),
  body(rect(10.5, 2.25, 3.75, 13.5, 1.5), { tint: true }),
]);

export const SkipForwardIcon = /*#__PURE__*/ createIcon('SkipForward', () => [
  body(roundPolygon(1.5, 3, 2.5, 12.25, 9, 3, 15.5), { tint: true }),
  stroke(seg(15, 2.75, 15, 15.25)),
]);
