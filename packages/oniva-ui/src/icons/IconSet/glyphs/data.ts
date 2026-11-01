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
  body('M3 4.25V13.75C3 15 5.75 16 9 16S15 15 15 13.75V4.25Z', { tint: true }),
  body(ellipse(9, 4.25, 6, 2.25)),
  stroke('M3 9C3 10.25 5.75 11.25 9 11.25S15 10.25 15 9', { only: LINED }),
  cut('M3 4.25C3 5.5 5.75 6.5 9 6.5S15 5.5 15 4.25', { only: SOLID }),
  cut('M3 9.25C3 10.5 5.75 11.5 9 11.5S15 10.5 15 9.25', { only: SOLID }),
]);

export const BarChartIcon = /*#__PURE__*/ createIcon('BarChart', () => [
  stroke(seg(4.5, 15, 4.5, 10.5), { only: LINED }),
  stroke(seg(9, 15, 9, 6.75), { only: LINED }),
  stroke(seg(13.5, 15, 13.5, 3), { only: LINED }),
  mark(rect(3, 9.75, 3, 6, 1), { only: SOLID }),
  mark(rect(7.5, 6, 3, 9.75, 1), { only: SOLID }),
  mark(rect(12, 2.25, 3, 13.5, 1), { only: SOLID }),
]);

export const LineChartIcon = /*#__PURE__*/ createIcon('LineChart', () => [
  stroke(roundPoly(2, 2.75, 2.75, 2.75, 15.25, 15.25, 15.25)),
  stroke(poly(6, 11.75, 9, 7.75, 11.5, 10.25, 15.25, 5)),
]);

export const ServerIcon = /*#__PURE__*/ createIcon('Server', () => [
  body(rect(2.5, 2.5, 13, 5, 2), { tint: true }),
  body(rect(2.5, 10.5, 13, 5, 2), { tint: true }),
  hole(5.75, 5),
  hole(5.75, 13),
  cut(seg(9.75, 5, 12.25, 5)),
  cut(seg(9.75, 13, 12.25, 13)),
]);

export const CpuIcon = /*#__PURE__*/ createIcon('Cpu', () => [
  body(rect(4.25, 4.25, 9.5, 9.5, 2), { tint: true }),
  cut(rect(7.25, 7.25, 3.5, 3.5, 1)),
  stroke(seg(7, 2, 7, 4.25)),
  stroke(seg(11, 2, 11, 4.25)),
  stroke(seg(7, 13.75, 7, 16)),
  stroke(seg(11, 13.75, 11, 16)),
  stroke(seg(2, 7, 4.25, 7)),
  stroke(seg(2, 11, 4.25, 11)),
  stroke(seg(13.75, 7, 16, 7)),
  stroke(seg(13.75, 11, 16, 11)),
]);

export const TerminalIcon = /*#__PURE__*/ createIcon('Terminal', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(poly(5.5, 6.75, 7.75, 9, 5.5, 11.25)),
  cut(seg(9.75, 11.25, 12.5, 11.25)),
]);

export const WebhookIcon = /*#__PURE__*/ createIcon('Webhook', () => {
  const cx = 9;
  const cy = 9.5;
  const r = 5.75;
  const nodes = [0, 120, 240];
  return [
    ...nodes.map((a) => {
      const p = frame(cx, cy, a)(r, 0);
      const [x, y] = p.split(' ').map(Number) as [number, number];
      return body(circle(x, y, 1.75));
    }),
    ...nodes.map((a) => stroke(arc(cx, cy, r, a + 18, a + 82))),
  ];
});

export const WorkflowIcon = /*#__PURE__*/ createIcon('Workflow', () => [
  body(rect(2.5, 2.5, 5.5, 5.5, 1.5), { tint: true }),
  body(rect(10, 10, 5.5, 5.5, 1.5), { tint: true }),
  stroke(roundPoly(2.25, 5.25, 8, 5.25, 12.75, 10, 12.75)),
]);

export const BranchIcon = /*#__PURE__*/ createIcon('Branch', () => [
  body(circle(5, 4, 1.75)),
  body(circle(5, 14, 1.75)),
  body(circle(13, 4, 1.75)),
  stroke(seg(5, 5.75, 5, 12.25)),
  stroke('M13 5.75V6.5A3.5 3.5 0 0 1 9.5 10H5'),
]);

export const MergeIcon = /*#__PURE__*/ createIcon('Merge', () => [
  body(circle(5, 4, 1.75)),
  body(circle(13, 4, 1.75)),
  body(circle(9, 14, 1.75)),
  stroke('M5 5.75V6.25C5 8.75 9 8.75 9 11.25V12.25'),
  stroke('M13 5.75V6.25C13 8.75 9 8.75 9 11.25'),
]);

export const PullRequestIcon = /*#__PURE__*/ createIcon('PullRequest', () => [
  body(circle(4.5, 4, 1.75)),
  body(circle(4.5, 14, 1.75)),
  body(circle(13.5, 14, 1.75)),
  stroke(seg(4.5, 5.75, 4.5, 12.25)),
  stroke('M13.5 12.25V6.5A2.5 2.5 0 0 0 11 4H8.75'),
  stroke(head(8.75, 4, 270, 2.5)),
]);

export const PlugIcon = /*#__PURE__*/ createIcon('Plug', () => [
  stroke(seg(6.75, 2, 6.75, 5.25)),
  stroke(seg(11.25, 2, 11.25, 5.25)),
  body('M4.25 5.25H13.75V8.25A4.75 4.75 0 0 1 4.25 8.25Z', { tint: true }),
  stroke(seg(9, 13, 9, 16)),
]);

export const WrenchIcon = /*#__PURE__*/ createIcon('Wrench', () => {
  const p = frame(11.5, 6.5, 45);
  return [
    body(
      `M${p(-9.25, -1.5)}L${p(-3.708, -1.5)}A4 4 0 0 1 ${p(3.708, -1.5)}L${p(1.5, -1.5)}` +
        `A1.5 1.5 0 0 0 ${p(1.5, 1.5)}L${p(3.708, 1.5)}A4 4 0 0 1 ${p(-3.708, 1.5)}L${p(-9.25, 1.5)}` +
        `A1.5 1.5 0 0 1 ${p(-9.25, -1.5)}Z`,
      { tint: true },
    ),
  ];
});

export const CreditCardIcon = /*#__PURE__*/ createIcon('CreditCard', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(seg(2, 7.5, 16, 7.5)),
  cut(seg(5.25, 11.25, 8.25, 11.25)),
]);

export const WalletIcon = /*#__PURE__*/ createIcon('Wallet', () => [
  body(rect(2, 3.75, 14, 11, 2.5), { tint: true }),
  cut('M16 6.75H11.5A1.5 1.5 0 0 0 10 8.25V10.25A1.5 1.5 0 0 0 11.5 11.75H16'),
  hole(13, 9.25),
]);

export const DollarIcon = /*#__PURE__*/ createIcon('Dollar', () => [
  stroke(
    'M12.75 5.75C12 4.5 10.75 4 9 4C7 4 5.5 5 5.5 6.5C5.5 8.25 7.25 8.75 9 9C10.75 9.25 12.5 9.75 12.5 11.5' +
      'C12.5 13 11 14 9 14C7.25 14 6 13.5 5.25 12.25',
  ),
  stroke(seg(9, 2, 9, 16)),
]);

export const LandmarkIcon = /*#__PURE__*/ createIcon('Landmark', () => [
  body(roundPolygon(1, 9, 2, 16, 6.25, 2, 6.25), { tint: true }),
  stroke(seg(4.75, 9.25, 4.75, 12.5)),
  stroke(seg(9, 9.25, 9, 12.5)),
  stroke(seg(13.25, 9.25, 13.25, 12.5)),
  stroke(seg(2.5, 15.5, 15.5, 15.5)),
]);

export const BuildingIcon = /*#__PURE__*/ createIcon('Building', () => [
  body(rect(3.25, 2, 11.5, 14, 2), { tint: true }),
  hole(6.75, 5.5),
  hole(11.25, 5.5),
  hole(6.75, 9),
  hole(11.25, 9),
  cut('M7.5 16V13.5A1.5 1.5 0 0 1 10.5 13.5V16'),
]);

export const TruckIcon = /*#__PURE__*/ createIcon('Truck', () => [
  body(roundPolygon(1, 2, 3.5, 10.75, 3.5, 10.75, 6.5, 13.5, 6.5, 16, 9.5, 16, 12, 2, 12), { only: SOLID }),
  cut(circle(5.5, 13.75, 3), { only: SOLID }),
  cut(circle(12.75, 13.75, 3), { only: SOLID }),
  stroke(
    'M3.06 12H3A1 1 0 0 1 2 11V4.5A1 1 0 0 1 3 3.5H9.75A1 1 0 0 1 10.75 4.5V6.5H13.2A1 1 0 0 1 14 6.9' +
      'L15.8 9.3A1 1 0 0 1 16 9.9V11A1 1 0 0 1 15.19 12',
    { only: LINED },
  ),
  stroke(seg(7.94, 12, 10.31, 12), { only: LINED }),
  stroke(seg(10.75, 6.5, 10.75, 12), { only: LINED }),
  body(circle(5.5, 13.75, 1.5)),
  body(circle(12.75, 13.75, 1.5)),
]);

export const RocketIcon = /*#__PURE__*/ createIcon('Rocket', () => {
  const p = frame(9.75, 8.25, 45);
  return [
    body(
      `M${p(-3, -2.5)}L${p(1, -2.5)}Q${p(5, -2.5)} ${p(7, 0)}Q${p(5, 2.5)} ${p(1, 2.5)}L${p(-3, 2.5)}Z`,
      { tint: true },
    ),
    body(`M${p(0, -2.5)}L${p(-3, -5.25)}L${p(-3, -2.5)}Z`),
    body(`M${p(0, 2.5)}L${p(-3, 5.25)}L${p(-3, 2.5)}Z`),
    hole(...(p(1.75, 0).split(' ').map(Number) as [number, number])),
    stroke(`M${p(-5.5, 0)}L${p(-7.25, 0)}`),
  ];
});

export const PillIcon = /*#__PURE__*/ createIcon('Pill', () => {
  const p = frame(9, 9, 45);
  return [
    body(`M${p(0, -3)}L${p(-3.5, -3)}A3 3 0 0 0 ${p(-3.5, 3)}L${p(0, 3)}Z`, { tint: true }),
    body(`M${p(0, -3)}L${p(3.5, -3)}A3 3 0 0 1 ${p(3.5, 3)}L${p(0, 3)}Z`),
    cut(`M${p(0, -3)}L${p(0, 3)}`, { only: SOLID }),
  ];
});

export const StethoscopeIcon = /*#__PURE__*/ createIcon('Stethoscope', () => [
  stroke('M3 2.5V6.25A3 3 0 0 0 9 6.25V2.5'),
  stroke('M6 9.25V11.75A3.75 3.75 0 0 0 13.5 11.75V10.25'),
  body(circle(13.5, 8.5, 1.75), { tint: true }),
]);

export const ThermometerIcon = /*#__PURE__*/ createIcon('Thermometer', () => [
  body('M7 10.764V4.5A2 2 0 0 1 11 4.5V10.764A3 3 0 1 1 7 10.764Z', { tint: true }),
  hole(9, 13, 1.25),
  cut(seg(9, 13, 9, 7.5)),
]);

export const IceCreamIcon = /*#__PURE__*/ createIcon('IceCream', () => [
  body('M4 7.75A5 5 0 0 1 14 7.75Z', { tint: true }),
  body(roundPolygon(1, 4.75, 7.75, 13.25, 7.75, 9, 16)),
  cut(seg(6.75, 7.75, 11.04, 12.04), { only: LINED }),
  cut(seg(3, 11, 15, 11), { only: SOLID }),
  cut(seg(11.25, 7.75, 6.96, 12.04), { only: LINED }),
  cut(seg(3, 7.75, 15, 7.75), { only: SOLID }),
]);

export const SunIcon = /*#__PURE__*/ createIcon('Sun', () => [
  body(circle(9, 9, 2.75), { tint: true }),
  ...[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
    const p = frame(9, 9, a);
    return stroke(`M${p(5.5, 0)}L${p(7.25, 0)}`);
  }),
]);

export const MoonIcon = /*#__PURE__*/ createIcon('Moon', () => [body(crescent(8.5, 9.5, 6.5, 13, 5.25, 5.25), { tint: true })]);

export const PlayIcon = /*#__PURE__*/ createIcon('Play', () => [
  body(roundPolygon(1.5, 5.25, 3.25, 15, 9, 5.25, 14.75), { tint: true }),
]);

export const PauseIcon = /*#__PURE__*/ createIcon('Pause', () => [
  body(rect(4.25, 3.25, 3, 11.5, 1.25), { tint: true }),
  body(rect(10.75, 3.25, 3, 11.5, 1.25), { tint: true }),
]);

export const SkipForwardIcon = /*#__PURE__*/ createIcon('SkipForward', () => [
  body(roundPolygon(1.25, 3.5, 3.75, 11.5, 9, 3.5, 14.25), { tint: true }),
  stroke(seg(14.5, 3.75, 14.5, 14.25)),
]);
