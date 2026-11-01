import { createIcon } from '../createIcon';
import {
  body,
  circle,
  cut,
  dot,
  ellipse,
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
  type Part,
} from '../shapes';

// Development: code, version control, infrastructure.

const r3 = (v: number) => {
  const r = Math.round(v * 1000) / 1000;
  return String(Object.is(r, -0) ? 0 : r);
};

/** Local frame: `u` runs toward `deg` (0 = up, 90 = right), `v` runs across it (clockwise side). */
function frame(cx: number, cy: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const xy = (u: number, v: number): [number, number] => [cx + u * c - v * s, cy + u * s + v * c];
  return xy;
}

/** Segment between two node centres, trimmed to stop `r` short of each circle. */
function link(ax: number, ay: number, bx: number, by: number, r: number): string {
  const d = Math.hypot(bx - ax, by - ay);
  const ux = (bx - ax) / d;
  const uy = (by - ay) / d;
  return seg(ax + ux * r, ay + uy * r, bx - ux * r, by - uy * r);
}

const SQUARE = rect(2.5, 2.5, 13, 13, 2.5);

// ---- code ---------------------------------------------------------------------

export const CodeXmlIcon = /*#__PURE__*/ createIcon('CodeXml', () => [
  stroke(poly(5.5, 5.5, 2, 9, 5.5, 12.5)),
  stroke(poly(12.5, 5.5, 16, 9, 12.5, 12.5)),
  stroke(seg(10.25, 3.75, 7.75, 14.25)),
]);

export const BracesIcon = /*#__PURE__*/ createIcon('Braces', () => [
  stroke('M7.5 2.75H7A1.75 1.75 0 0 0 5.25 4.5V7.25Q5.25 9 3.5 9Q5.25 9 5.25 10.75V13.5A1.75 1.75 0 0 0 7 15.25H7.5'),
  stroke('M10.5 2.75H11A1.75 1.75 0 0 1 12.75 4.5V7.25Q12.75 9 14.5 9Q12.75 9 12.75 10.75V13.5A1.75 1.75 0 0 1 11 15.25H10.5'),
]);

export const BracketsIcon = /*#__PURE__*/ createIcon('Brackets', () => [
  stroke(roundPoly(1.25, 7.5, 2.75, 4.25, 2.75, 4.25, 15.25, 7.5, 15.25)),
  stroke(roundPoly(1.25, 10.5, 2.75, 13.75, 2.75, 13.75, 15.25, 10.5, 15.25)),
]);

export const VariableIcon = /*#__PURE__*/ createIcon('Variable', () => [
  stroke('M5 2.75C2.75 5 2.75 13 5 15.25'),
  stroke('M13 2.75C15.25 5 15.25 13 13 15.25'),
  stroke(seg(7, 6.75, 11, 11.25)),
  stroke(seg(11, 6.75, 7, 11.25)),
]);

export const FunctionIcon = /*#__PURE__*/ createIcon('Function', () => [
  stroke('M12.25 3.25C10.5 2.5 8.9 3.1 8.5 5.25L6.75 13C6.4 14.75 5 15.35 3.75 14.85'),
  stroke(seg(5.75, 8, 11.25, 8)),
]);

export const RegexIcon = /*#__PURE__*/ createIcon('Regex', () => [
  stroke(seg(11, 3.5, 11, 10.5)),
  stroke(seg(7.95, 5.25, 14.05, 8.75)),
  stroke(seg(7.95, 8.75, 14.05, 5.25)),
  dot(4.25, 13.25, 1.25),
]);

export const BinaryIcon = /*#__PURE__*/ createIcon('Binary', () => [
  stroke(poly(3.25, 5.75, 5.75, 3.5, 5.75, 14.5)),
  stroke(ellipse(12, 9, 3, 5.5)),
]);

export const WebIcon = /*#__PURE__*/ createIcon('Web', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(poly(7.25, 6.75, 5.25, 9, 7.25, 11.25)),
  cut(poly(10.75, 6.75, 12.75, 9, 10.75, 11.25)),
]);

// ---- version control ------------------------------------------------------------

export const CommitIcon = /*#__PURE__*/ createIcon('Commit', () => [
  body(circle(9, 9, 3), { tint: true }),
  stroke(seg(2, 9, 6, 9)),
  stroke(seg(12, 9, 16, 9)),
]);

export const GitForkIcon = /*#__PURE__*/ createIcon('GitFork', () => [
  body(circle(5, 4, 1.75)),
  body(circle(13, 4, 1.75)),
  body(circle(9, 14, 1.75), { tint: true }),
  stroke('M5 5.75V7.5A2 2 0 0 0 7 9.5H11A2 2 0 0 0 13 7.5V5.75'),
  stroke(seg(9, 9.5, 9, 12.25)),
]);

export const GitCompareIcon = /*#__PURE__*/ createIcon('GitCompare', () => [
  body(circle(4.5, 14, 1.75)),
  body(circle(13.5, 4, 1.75)),
  stroke('M4.5 12.25V8A3 3 0 0 1 7.5 5H9.5'),
  stroke(poly(7.5, 2.75, 9.75, 5, 7.5, 7.25)),
  stroke('M13.5 5.75V10A3 3 0 0 1 10.5 13H8.5'),
  stroke(poly(10.5, 10.75, 8.25, 13, 10.5, 15.25)),
]);

export const PullRequestClosedIcon = /*#__PURE__*/ createIcon('PullRequestClosed', () => [
  body(circle(4.5, 4, 1.75)),
  body(circle(4.5, 14, 1.75)),
  body(circle(13.5, 14, 1.75)),
  stroke(seg(4.5, 5.75, 4.5, 12.25)),
  stroke(seg(13.5, 12.25, 13.5, 9.5)),
  stroke(seg(11.75, 3.25, 15.25, 6.75)),
  stroke(seg(15.25, 3.25, 11.75, 6.75)),
]);

export const PullRequestDraftIcon = /*#__PURE__*/ createIcon('PullRequestDraft', () => [
  body(circle(4.5, 4, 1.75)),
  body(circle(4.5, 14, 1.75)),
  body(circle(13.5, 14, 1.75)),
  stroke(seg(4.5, 5.75, 4.5, 12.25)),
  dot(13.5, 9, 1),
  dot(13.5, 4.5, 1),
]);

// ---- packages, parts and infrastructure -----------------------------------------

export const CubeIcon = /*#__PURE__*/ createIcon('Cube', () => [
  body(roundPolygon(1.25, 9, 2, 15.06, 5.5, 15.06, 12.5, 9, 16, 2.94, 12.5, 2.94, 5.5), { tint: true }),
  cut(poly(2.94, 5.5, 9, 9, 15.06, 5.5)),
  cut(seg(9, 9, 9, 16)),
]);

/** Four diamonds in a loose lattice; the top one carries the tint. */
const diamond = (cx: number, cy: number, r = 2.25) => roundPolygon(0.6, cx, cy - r, cx + r, cy, cx, cy + r, cx - r, cy);

export const ComponentsIcon = /*#__PURE__*/ createIcon('Components', () => [
  body(diamond(9, 4.5), { tint: true }),
  body(diamond(4.5, 9)),
  body(diamond(13.5, 9)),
  body(diamond(9, 13.5)),
]);

export const PuzzleIcon = /*#__PURE__*/ createIcon('Puzzle', () => [
  body(
    'M4.5 5.5H6.125A1.75 1.75 0 1 1 8.875 5.5H10.5A2 2 0 0 1 12.5 7.5V8.125A1.75 1.75 0 1 1 12.5 10.875V13.5' +
      'A2 2 0 0 1 10.5 15.5H4.5A2 2 0 0 1 2.5 13.5V11.875A1.75 1.75 0 1 0 2.5 9.125V7.5A2 2 0 0 1 4.5 5.5Z',
    { tint: true },
  ),
]);

export const PluginIcon = /*#__PURE__*/ createIcon('Plugin', () => [
  stroke(seg(2, 6.75, 6.75, 6.75)),
  stroke(seg(2, 11.25, 6.75, 11.25)),
  body(rect(6.75, 3.5, 9.25, 11, 2.5), { tint: true }),
]);

export const ApiIcon = /*#__PURE__*/ createIcon('Api', () => [
  body(SQUARE, { tint: true }),
  cut(seg(5.75, 6.75, 12.25, 6.75)),
  cut(head(12.25, 6.75, 90, 2.5)),
  cut(seg(5.75, 11.25, 12.25, 11.25)),
  cut(head(5.75, 11.25, 270, 2.5)),
]);

/** Cloud helpers (same lobe construction as the cloud glyphs). */
type Lobe = readonly [cx: number, cy: number, r: number];

const bearing = (cx: number, cy: number, x: number, y: number) =>
  ((Math.atan2(x - cx, cy - y) * 180) / Math.PI + 360) % 360;

function meet([ax, ay, ar]: Lobe, [bx, by, br]: Lobe): [number, number] {
  const d = Math.hypot(bx - ax, by - ay);
  const a = (ar * ar - br * br + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, ar * ar - a * a));
  const mx = ax + ((bx - ax) * a) / d;
  const my = ay + ((by - ay) * a) / d;
  const p1: [number, number] = [mx + ((by - ay) * h) / d, my - ((bx - ax) * h) / d];
  const p2: [number, number] = [mx - ((by - ay) * h) / d, my + ((bx - ax) * h) / d];
  return p1[1] < p2[1] ? p1 : p2;
}

function cloud(left: Lobe, top: Lobe, right: Lobe): string {
  const lobes = [left, top, right];
  const pts: [number, number][] = [
    [left[0], left[1] + left[2]],
    meet(left, top),
    meet(top, right),
    [right[0], right[1] + right[2]],
  ];
  let d = `M${r3(pts[0]![0])} ${r3(pts[0]![1])}`;
  lobes.forEach(([cx, cy, r], i) => {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[i + 1]!;
    const sweep = (bearing(cx, cy, x1, y1) - bearing(cx, cy, x0, y0) + 360) % 360;
    d += `A${r3(r)} ${r3(r)} 0 ${sweep > 180 ? 1 : 0} 1 ${r3(x1)} ${r3(y1)}`;
  });
  return `${d}Z`;
}

const CLOUD_WIDE: [Lobe, Lobe, Lobe] = [
  [4.75, 11.25, 2.75],
  [9, 7.75, 5],
  [13.25, 11.25, 2.75],
];

export const CloudCodeIcon = /*#__PURE__*/ createIcon('CloudCode', () => [
  body(cloud(...CLOUD_WIDE), { tint: true }),
  cut(poly(7.5, 7.75, 5.75, 9.5, 7.5, 11.25)),
  cut(poly(10.5, 7.75, 12.25, 9.5, 10.5, 11.25)),
]);

/** Shipping container: ribbed box. */
export const ContainerIcon = /*#__PURE__*/ createIcon('Container', () => [
  body(rect(2, 4, 14, 10, 2.5), { tint: true }),
  cut(seg(5.75, 7, 5.75, 11)),
  cut(seg(9, 7, 9, 11)),
  cut(seg(12.25, 7, 12.25, 11)),
]);

export const ClusterIcon = /*#__PURE__*/ createIcon('Cluster', () => [
  body(circle(9, 4.25, 2), { tint: true }),
  body(circle(4, 13, 2)),
  body(circle(14, 13, 2)),
  stroke(link(9, 4.25, 4, 13, 2)),
  stroke(link(9, 4.25, 14, 13, 2)),
  stroke(link(4, 13, 14, 13, 2)),
]);

export const NetworkIcon = /*#__PURE__*/ createIcon('Network', () => [
  body(rect(6.25, 2, 5.5, 4.5, 1.25), { tint: true }),
  body(rect(2, 11.5, 5.5, 4.5, 1.25)),
  body(rect(10.5, 11.5, 5.5, 4.5, 1.25)),
  stroke(seg(9, 6.5, 9, 9)),
  stroke(roundPoly(1.5, 4.75, 11.5, 4.75, 9, 13.25, 9, 13.25, 11.5)),
]);

export const TableCellsIcon = /*#__PURE__*/ createIcon('TableCells', () => [
  body(SQUARE, { tint: true }),
  cut(seg(6.83, 2.5, 6.83, 15.5)),
  cut(seg(11.17, 2.5, 11.17, 15.5)),
  cut(seg(2.5, 6.83, 15.5, 6.83)),
  cut(seg(2.5, 11.17, 15.5, 11.17)),
]);

// ---- package with a search modifier -----------------------------------------------

const HEX_OPEN = roundPoly(1.25, 13.2, 8.53, 13.2, 5, 8, 2, 2.8, 5, 2.8, 11, 8, 14, 8.49, 13.72);

export const PackageSearchIcon = /*#__PURE__*/ createIcon('PackageSearch', () => [
  body(`${HEX_OPEN}A5.25 5.25 0 0 1 13.2 8.53Z`, { only: SOLID }),
  stroke(HEX_OPEN, { only: LINED }),
  cut(poly(2.8, 5, 8, 8, 13.2, 5)),
  cut(seg(8, 8, 8, 14)),
  stroke(circle(12.75, 12.75, 2.25)),
  stroke(seg(14.5, 14.5, 16, 16)),
]);

// ---- database with a modifier --------------------------------------------------------

/** Base stops on a circle of radius 5.25 around 13.75,13.75 (same construction as UserPlus). */
const dbBase = (): Part[] => [
  body(ellipse(8.5, 4.25, 6, 2.25), { tint: true }),
  body('M2.5 4.25V13.75C2.5 15 5 15.9 8.96 15.9A5.25 5.25 0 0 1 14.5 8.55V4.25Z', { only: SOLID }),
  stroke('M2.5 4.25V13.75C2.5 15 5 15.9 8.96 15.9', { only: LINED }),
  stroke('M14.5 4.25V8.55', { only: LINED }),
  stroke('M2.5 9.25C2.5 10.25 5.5 11.25 9.1 11.25', { only: LINED }),
  cut('M2.5 9.25C2.5 10.25 5.5 11.25 9.1 11.25', { only: SOLID }),
];

export const DatabasePlusIcon = /*#__PURE__*/ createIcon('DatabasePlus', () => [
  ...dbBase(),
  stroke(seg(13.75, 11.5, 13.75, 16)),
  stroke(seg(11.5, 13.75, 16, 13.75)),
]);

export const DatabaseZapIcon = /*#__PURE__*/ createIcon('DatabaseZap', () => [
  ...dbBase(),
  stroke(poly(14.75, 11.25, 11.75, 14.5, 15.5, 14.5, 12.5, 16.25)),
]);

export const DatabaseSearchIcon = /*#__PURE__*/ createIcon('DatabaseSearch', () => [
  ...dbBase(),
  stroke(circle(12.75, 12.75, 2.25)),
  stroke(seg(14.5, 14.5, 16, 16)),
]);

// ---- tools and runtime -----------------------------------------------------------------

export const DeployIcon = /*#__PURE__*/ createIcon('Deploy', () => [
  body('M9 2.25C11.6 4.5 12.25 7.5 11.75 12.25H6.25C5.75 7.5 6.4 4.5 9 2.25Z', { tint: true }),
  body(roundPolygon(0.5, 6.2, 8.75, 3.5, 12.5, 6.25, 12.25)),
  body(roundPolygon(0.5, 11.8, 8.75, 14.5, 12.5, 11.75, 12.25)),
  hole(9, 7.25, 1.25),
  stroke(seg(9, 14.25, 9, 16)),
]);

export const BuildIcon = /*#__PURE__*/ createIcon('Build', () => {
  const p = frame(9, 9, 45);
  const [h0, h1, h2, h3] = [p(2, -4.5), p(2, 4.5), p(5.25, 4.5), p(5.25, -4.5)];
  const [s0, s1] = [p(2, 0), p(-7, 0)];
  return [
    body(roundPolygon(1, ...h0, ...h1, ...h2, ...h3), { tint: true }),
    stroke(seg(s0[0], s0[1], s1[0], s1[1])),
  ];
});

export const DebugIcon = /*#__PURE__*/ createIcon('Debug', () => [
  body(rect(5.5, 6, 7, 9.5, 3.5), { tint: true }),
  cut(seg(9, 8.5, 9, 15.5)),
  stroke(seg(7.25, 6.25, 6, 3)),
  stroke(seg(10.75, 6.25, 12, 3)),
  stroke(seg(2.5, 8.5, 5.5, 8.5)),
  stroke(seg(2.5, 12.5, 5.5, 12.5)),
  stroke(seg(12.5, 8.5, 15.5, 8.5)),
  stroke(seg(12.5, 12.5, 15.5, 12.5)),
]);

export const LogsIcon = /*#__PURE__*/ createIcon('Logs', () => [
  dot(3.25, 4.5, 1, { soft: true }),
  dot(3.25, 9, 1, { soft: true }),
  dot(3.25, 13.5, 1, { soft: true }),
  stroke(seg(6.5, 4.5, 15.5, 4.5)),
  stroke(seg(6.5, 9, 13, 9)),
  stroke(seg(6.5, 13.5, 14.5, 13.5)),
]);

export const ScriptIcon = /*#__PURE__*/ createIcon('Script', () => [
  body(
    'M7.5 2.5H12.5A2 2 0 0 1 14.5 4.5V13.5A2 2 0 0 1 12.5 15.5H5.5A2 2 0 0 1 3.5 13.5A2 2 0 0 1 5.5 11.5V4.5A2 2 0 0 1 7.5 2.5Z',
    { tint: true },
  ),
  cut(seg(5.5, 11.5, 5.5, 15.5)),
  cut(seg(8.75, 6.25, 12, 6.25)),
  cut(seg(8.75, 9.75, 12, 9.75)),
]);

export const SandboxIcon = /*#__PURE__*/ createIcon('Sandbox', () => [
  stroke('M2.5 6V5A2.5 2.5 0 0 1 5 2.5H6'),
  stroke('M12 2.5H13A2.5 2.5 0 0 1 15.5 5V6'),
  stroke('M15.5 12V13A2.5 2.5 0 0 1 13 15.5H12'),
  stroke('M6 15.5H5A2.5 2.5 0 0 1 2.5 13V12'),
  body(circle(9, 9, 2.5), { tint: true }),
]);
