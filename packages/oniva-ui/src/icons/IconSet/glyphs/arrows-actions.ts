import { createIcon } from '../createIcon';
import { arc, body, circle, cut, head, LINED, polar, roundPoly, roundPolygon, seg, SOLID, stroke } from '../shapes';

// Arrows: transfer, import/export, window-size and navigation actions.

type Lobe = readonly [cx: number, cy: number, r: number];

/** Compass angle (0 = up, clockwise) of x,y seen from cx,cy. */
const bearing = (cx: number, cy: number, x: number, y: number) =>
  ((Math.atan2(x - cx, cy - y) * 180) / Math.PI + 360) % 360;

/** Upper crossing point of two lobes. */
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

/** Cloud outline from three lobes; `closed` adds the flat base. */
function cloud(left: Lobe, top: Lobe, right: Lobe, closed: boolean): string {
  const f = (v: number) => String(Math.round(v * 1000) / 1000);
  const lobes = [left, top, right];
  const pts: [number, number][] = [
    [left[0], left[1] + left[2]],
    meet(left, top),
    meet(top, right),
    [right[0], right[1] + right[2]],
  ];
  let d = `M${f(pts[0]![0])} ${f(pts[0]![1])}`;
  lobes.forEach(([cx, cy, r], i) => {
    const [x0, y0] = pts[i]!;
    const [x1, y1] = pts[i + 1]!;
    const sweep = (bearing(cx, cy, x1, y1) - bearing(cx, cy, x0, y0) + 360) % 360;
    d += `A${f(r)} ${f(r)} 0 ${sweep > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)}`;
  });
  return closed ? `${d}Z` : d;
}

/** Arrowhead at the end of a circular arc, tangent to it. */
function arcHead(cx: number, cy: number, r: number, deg: number, cw: boolean, len: number): string {
  const [x, y] = polar(cx, cy, r, deg);
  const turn = (Math.asin((len * Math.SQRT1_2) / (2 * r)) * 180) / Math.PI;
  return head(x, y, cw ? deg + 90 + turn : deg - 90 - turn, len);
}

const CLOUD: [Lobe, Lobe, Lobe] = [
  [5, 10, 2.75],
  [9.5, 7.75, 4.25],
  [13.25, 10.25, 2.5],
];

// Roomier cloud for glyphs that carry detail inside it.
const CLOUD_WIDE: [Lobe, Lobe, Lobe] = [
  [4.75, 11.25, 2.75],
  [9, 7.75, 5],
  [13.25, 11.25, 2.75],
];

export const LogInIcon = /*#__PURE__*/ createIcon('LogIn', () => [
  stroke('M10.75 2.75H13A2.25 2.25 0 0 1 15.25 5V13A2.25 2.25 0 0 1 13 15.25H10.75'),
  stroke(seg(2.75, 9, 11, 9)),
  stroke(head(11, 9, 90, 3.5)),
]);

export const ImportIcon = /*#__PURE__*/ createIcon('Import', () => [
  stroke('M7 2.75H13A2.25 2.25 0 0 1 15.25 5V13A2.25 2.25 0 0 1 13 15.25H7'),
  stroke(seg(2.5, 9, 11.5, 9)),
  stroke(head(11.5, 9, 90, 3.5)),
]);

export const ExportIcon = /*#__PURE__*/ createIcon('Export', () => [
  stroke('M11 2.75H5A2.25 2.25 0 0 0 2.75 5V13A2.25 2.25 0 0 0 5 15.25H11'),
  stroke(seg(6.5, 9, 15.5, 9)),
  stroke(head(15.5, 9, 90, 3.5)),
]);

export const CloudDownloadIcon = /*#__PURE__*/ createIcon('CloudDownload', () => [
  body(cloud(...CLOUD, false), { tint: true, only: LINED }),
  stroke(seg(9, 8, 9, 16), { only: LINED }),
  stroke(head(9, 16, 180, 3.5), { only: LINED }),
  body(cloud(...CLOUD, true), { only: SOLID }),
  cut(seg(9, 5.25, 9, 10.75), { only: SOLID }),
  cut(head(9, 10.75, 180, 3), { only: SOLID }),
]);

const TRAY = 'M2.25 10.25H5.75L7 12H11L12.25 10.25H15.75V13A2.25 2.25 0 0 1 13.5 15.25H4.5A2.25 2.25 0 0 1 2.25 13Z';

export const InboxInIcon = /*#__PURE__*/ createIcon('InboxIn', () => [
  body(TRAY, { tint: true }),
  stroke(seg(9, 2.5, 9, 9)),
  stroke(head(9, 9, 180, 3.5)),
]);

export const InboxOutIcon = /*#__PURE__*/ createIcon('InboxOut', () => [
  body(TRAY, { tint: true }),
  stroke(seg(9, 9, 9, 2.5)),
  stroke(head(9, 2.5, 0, 3.5)),
]);

export const MinimizeIcon = /*#__PURE__*/ createIcon('Minimize', () => [
  stroke(roundPoly(2, 2.75, 6.75, 6.75, 6.75, 6.75, 2.75)),
  stroke(roundPoly(2, 11.25, 2.75, 11.25, 6.75, 15.25, 6.75)),
  stroke(roundPoly(2, 15.25, 11.25, 11.25, 11.25, 11.25, 15.25)),
  stroke(roundPoly(2, 6.75, 15.25, 6.75, 11.25, 2.75, 11.25)),
]);

export const ShrinkIcon = /*#__PURE__*/ createIcon('Shrink', () => [
  stroke(seg(2.75, 2.75, 7, 7)),
  stroke(head(7, 7, 135, 3.5)),
  stroke(seg(15.25, 2.75, 11, 7)),
  stroke(head(11, 7, 225, 3.5)),
  stroke(seg(15.25, 15.25, 11, 11)),
  stroke(head(11, 11, 315, 3.5)),
  stroke(seg(2.75, 15.25, 7, 11)),
  stroke(head(7, 11, 45, 3.5)),
]);

export const FullscreenIcon = /*#__PURE__*/ createIcon('Fullscreen', () => [
  stroke(seg(7, 7, 2.75, 2.75)),
  stroke(head(2.75, 2.75, 315, 3.5)),
  stroke(seg(11, 7, 15.25, 2.75)),
  stroke(head(15.25, 2.75, 45, 3.5)),
  stroke(seg(11, 11, 15.25, 15.25)),
  stroke(head(15.25, 15.25, 135, 3.5)),
  stroke(seg(7, 11, 2.75, 15.25)),
  stroke(head(2.75, 15.25, 225, 3.5)),
]);

export const ArrowsMergeIcon = /*#__PURE__*/ createIcon('ArrowsMerge', () => [
  stroke(roundPoly(1.5, 3.25, 2.75, 9, 8.5, 9, 15.25)),
  stroke(seg(14.75, 2.75, 9, 8.5)),
  stroke(head(9, 15.25, 180, 4.5)),
]);

export const NavigationIcon = /*#__PURE__*/ createIcon('Navigation', () => [
  body(roundPolygon(1, 15, 3, 10, 14.5, 8, 10, 3.5, 8), { tint: true }),
]);

export const CompassIcon = /*#__PURE__*/ createIcon('Compass', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(roundPolygon(0.5, 11.83, 6.17, 10.24, 10.24, 6.17, 11.83, 7.76, 7.76)),
]);

export const SendHorizontalIcon = /*#__PURE__*/ createIcon('SendHorizontal', () => [
  body(roundPolygon(1, 15.5, 9, 2.75, 3, 5.25, 9, 2.75, 15), { tint: true }),
  cut(seg(5.25, 9, 11, 9)),
]);

export const TransferIcon = /*#__PURE__*/ createIcon('Transfer', () => [
  stroke(seg(2.75, 5.5, 15.25, 5.5)),
  stroke(head(15.25, 5.5, 90, 3.5)),
  stroke(seg(15.25, 12.5, 2.75, 12.5)),
  stroke(head(2.75, 12.5, 270, 3.5)),
]);

export const CloudSyncIcon = /*#__PURE__*/ createIcon('CloudSync', () => [
  body(cloud(...CLOUD_WIDE, true), { tint: true }),
  cut(arc(9, 9.25, 2.75, 285, 410)),
  cut(arcHead(9, 9.25, 2.75, 50, true, 2.5)),
  cut(arc(9, 9.25, 2.75, 105, 230)),
  cut(arcHead(9, 9.25, 2.75, 230, true, 2.5)),
]);
