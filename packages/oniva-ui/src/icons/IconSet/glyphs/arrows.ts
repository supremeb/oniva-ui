import { createIcon } from '../createIcon';
import { arc, body, circle, cut, head, LINED, polar, poly, roundPoly, roundPolygon, seg, SOLID, stroke } from '../shapes';

// Arrows, chevrons and directional actions.

export const ArrowRightIcon = /*#__PURE__*/ createIcon('ArrowRight', () => [stroke(seg(3, 9, 15, 9)), stroke(head(15, 9, 90, 4.5))]);
export const ArrowLeftIcon = /*#__PURE__*/ createIcon('ArrowLeft', () => [stroke(seg(15, 9, 3, 9)), stroke(head(3, 9, 270, 4.5))]);
export const ArrowUpIcon = /*#__PURE__*/ createIcon('ArrowUp', () => [stroke(seg(9, 15, 9, 3)), stroke(head(9, 3, 0, 4.5))]);
export const ArrowDownIcon = /*#__PURE__*/ createIcon('ArrowDown', () => [stroke(seg(9, 3, 9, 15)), stroke(head(9, 15, 180, 4.5))]);
export const ArrowUpRightIcon = /*#__PURE__*/ createIcon('ArrowUpRight', () => [
  stroke(seg(4.75, 13.25, 13, 5)),
  stroke(poly(6.5, 5, 13, 5, 13, 11.5)),
]);

export const ChevronDownIcon = /*#__PURE__*/ createIcon('ChevronDown', () => [stroke(poly(4.5, 6.75, 9, 11.25, 13.5, 6.75))]);
export const ChevronUpIcon = /*#__PURE__*/ createIcon('ChevronUp', () => [stroke(poly(4.5, 11.25, 9, 6.75, 13.5, 11.25))]);
export const ChevronLeftIcon = /*#__PURE__*/ createIcon('ChevronLeft', () => [stroke(poly(11.25, 4.5, 6.75, 9, 11.25, 13.5))]);
export const ChevronRightIcon = /*#__PURE__*/ createIcon('ChevronRight', () => [stroke(poly(6.75, 4.5, 11.25, 9, 6.75, 13.5))]);
export const ChevronsUpDownIcon = /*#__PURE__*/ createIcon('ChevronsUpDown', () => [
  stroke(poly(5.75, 6.5, 9, 3.25, 12.25, 6.5)),
  stroke(poly(5.75, 11.5, 9, 14.75, 12.25, 11.5)),
]);

/** Compass angle (0 = up, clockwise) of x,y seen from cx,cy. */
const bearing = (cx: number, cy: number, x: number, y: number) =>
  ((Math.atan2(x - cx, cy - y) * 180) / Math.PI + 360) % 360;

/** Arrowhead at the end of a circular arc, tangent to it, turned in a little so the arms sit on the curve. */
function arcHead(cx: number, cy: number, r: number, deg: number, cw: boolean, len: number): string {
  const [x, y] = polar(cx, cy, r, deg);
  const turn = (Math.asin((len * Math.SQRT1_2) / (2 * r)) * 180) / Math.PI;
  return head(x, y, cw ? deg + 90 + turn : deg - 90 - turn, len);
}

type Lobe = readonly [cx: number, cy: number, r: number];

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

/**
 * Cloud: left, top and right lobes, from the bottom of the left lobe clockwise over the top to the bottom of the
 * right lobe. `closed` adds the flat base.
 */
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

export const ArrowDownRightIcon = /*#__PURE__*/ createIcon('ArrowDownRight', () => [
  stroke(seg(4.75, 4.75, 13, 13)),
  stroke(poly(13, 6.5, 13, 13, 6.5, 13)),
]);

export const ArrowDownToLineIcon = /*#__PURE__*/ createIcon('ArrowDownToLine', () => [
  stroke(seg(9, 2.75, 9, 11.5)),
  stroke(head(9, 11.5, 180, 4.5)),
  stroke(seg(3.75, 15.25, 14.25, 15.25)),
]);

export const ArrowUpToLineIcon = /*#__PURE__*/ createIcon('ArrowUpToLine', () => [
  stroke(seg(9, 15.25, 9, 6.5)),
  stroke(head(9, 6.5, 0, 4.5)),
  stroke(seg(3.75, 2.75, 14.25, 2.75)),
]);

export const ArrowUpDownIcon = /*#__PURE__*/ createIcon('ArrowUpDown', () => [
  stroke(seg(5.75, 15, 5.75, 3)),
  stroke(head(5.75, 3, 0, 3.5)),
  stroke(seg(12.25, 3, 12.25, 15)),
  stroke(head(12.25, 15, 180, 3.5)),
]);

export const ArrowLeftRightIcon = /*#__PURE__*/ createIcon('ArrowLeftRight', () => [
  stroke(seg(3, 5.75, 15, 5.75)),
  stroke(head(15, 5.75, 90, 3.5)),
  stroke(seg(15, 12.25, 3, 12.25)),
  stroke(head(3, 12.25, 270, 3.5)),
]);

export const CornerDownLeftIcon = /*#__PURE__*/ createIcon('CornerDownLeft', () => [
  stroke(roundPoly(2.5, 14.5, 3.25, 14.5, 11.25, 3.25, 11.25)),
  stroke(head(3.25, 11.25, 270, 4.5)),
]);

export const DownloadIcon = /*#__PURE__*/ createIcon('Download', () => [
  stroke(seg(9, 2.5, 9, 11)),
  stroke(head(9, 11, 180, 4.5)),
  stroke(roundPoly(2.25, 2.75, 11.25, 2.75, 15.25, 15.25, 15.25, 15.25, 11.25)),
]);

export const UploadIcon = /*#__PURE__*/ createIcon('Upload', () => [
  stroke(seg(9, 11, 9, 2.5)),
  stroke(head(9, 2.5, 0, 4.5)),
  stroke(roundPoly(2.25, 2.75, 11.25, 2.75, 15.25, 15.25, 15.25, 15.25, 11.25)),
]);

const CLOUD: [Lobe, Lobe, Lobe] = [
  [5, 10, 2.75],
  [9.5, 7.75, 4.25],
  [13.25, 10.25, 2.5],
];

export const CloudUploadIcon = /*#__PURE__*/ createIcon('CloudUpload', () => [
  body(cloud(...CLOUD, false), { tint: true, only: LINED }),
  stroke(seg(9, 16, 9, 8)),
  stroke(head(9, 8, 0, 3.5), { only: LINED }),
  body(cloud(...CLOUD, true), { only: SOLID }),
  cut(seg(9, 12.75, 9, 7.75), { only: SOLID }),
  cut(head(9, 7.75, 0, 3), { only: SOLID }),
]);

export const ExternalLinkIcon = /*#__PURE__*/ createIcon('ExternalLink', () => [
  stroke('M7.75 2.75H5A2.25 2.25 0 0 0 2.75 5V13A2.25 2.25 0 0 0 5 15.25H13A2.25 2.25 0 0 0 15.25 13V10.25'),
  stroke(seg(8.25, 9.75, 15.25, 2.75)),
  stroke(head(15.25, 2.75, 45, 4.5)),
]);

export const LogOutIcon = /*#__PURE__*/ createIcon('LogOut', () => [
  stroke('M7.25 2.75H5A2.25 2.25 0 0 0 2.75 5V13A2.25 2.25 0 0 0 5 15.25H7.25'),
  stroke(seg(7, 9, 15.25, 9)),
  stroke(head(15.25, 9, 90, 3.5)),
]);

export const UndoIcon = /*#__PURE__*/ createIcon('Undo', () => [
  stroke('M6.25 14.5H11.25A4 4 0 0 0 11.25 6.5H3.25'),
  stroke(head(3.25, 6.5, 270, 3.5)),
]);

export const RedoIcon = /*#__PURE__*/ createIcon('Redo', () => [
  stroke('M11.75 14.5H6.75A4 4 0 0 1 6.75 6.5H14.75'),
  stroke(head(14.75, 6.5, 90, 3.5)),
]);

export const RefreshIcon = /*#__PURE__*/ createIcon('Refresh', () => [
  stroke(arc(9, 9, 6.5, 285, 425)),
  stroke(arcHead(9, 9, 6.5, 65, true, 3.5)),
  stroke(arc(9, 9, 6.5, 105, 245)),
  stroke(arcHead(9, 9, 6.5, 245, true, 3.5)),
]);

export const RepeatIcon = /*#__PURE__*/ createIcon('Repeat', () => [
  stroke(roundPoly(2.5, 2.75, 9.5, 2.75, 5, 14.75, 5)),
  stroke(head(14.75, 5, 90, 3.5)),
  stroke(roundPoly(2.5, 15.25, 8.5, 15.25, 13, 3.25, 13)),
  stroke(head(3.25, 13, 270, 3.5)),
]);

export const RepostIcon = /*#__PURE__*/ createIcon('Repost', () => [
  stroke(roundPoly(2, 3, 11.5, 3, 4.5, 12.5, 4.5)),
  stroke(head(12.5, 4.5, 90, 3.5)),
  stroke(roundPoly(2, 15, 6.5, 15, 13.5, 5.5, 13.5)),
  stroke(head(5.5, 13.5, 270, 3.5)),
]);

export const RotateCcwIcon = /*#__PURE__*/ createIcon('RotateCcw', () => [
  stroke(arc(9.5, 9.75, 6, 315, 615)),
  stroke(head(...polar(9.5, 9.75, 6, 315), 225, 3.75)),
]);

export const RotateCwIcon = /*#__PURE__*/ createIcon('RotateCw', () => [
  stroke(arc(8.5, 9.75, 6, 45, -255)),
  stroke(head(...polar(8.5, 9.75, 6, 45), 135, 3.75)),
]);

export const ExpandIcon = /*#__PURE__*/ createIcon('Expand', () => [
  stroke(seg(10.5, 7.5, 15.25, 2.75)),
  stroke(head(15.25, 2.75, 45, 4.5)),
  stroke(seg(7.5, 10.5, 2.75, 15.25)),
  stroke(head(2.75, 15.25, 225, 4.5)),
]);

export const CollapseIcon = /*#__PURE__*/ createIcon('Collapse', () => [
  stroke(seg(15.25, 2.75, 10.5, 7.5)),
  stroke(head(10.5, 7.5, 225, 4.25)),
  stroke(seg(2.75, 15.25, 7.5, 10.5)),
  stroke(head(7.5, 10.5, 45, 4.25)),
]);

export const MaximizeIcon = /*#__PURE__*/ createIcon('Maximize', () => [
  stroke(roundPoly(2, 2.75, 6.75, 2.75, 2.75, 6.75, 2.75)),
  stroke(roundPoly(2, 11.25, 2.75, 15.25, 2.75, 15.25, 6.75)),
  stroke(roundPoly(2, 15.25, 11.25, 15.25, 15.25, 11.25, 15.25)),
  stroke(roundPoly(2, 6.75, 15.25, 2.75, 15.25, 2.75, 11.25)),
]);

export const SplitIcon = /*#__PURE__*/ createIcon('Split', () => [
  stroke(poly(3.25, 3.25, 9, 9, 9, 15.75)),
  stroke(seg(9, 9, 14.75, 3.25)),
  stroke(head(3.25, 3.25, 315, 4.25)),
  stroke(head(14.75, 3.25, 45, 4.25)),
]);

export const SendIcon = /*#__PURE__*/ createIcon('Send', () => [
  body(roundPolygon(1, 15.5, 2.5, 2.5, 7.25, 7.5, 10.5, 10.75, 15.5), { tint: true }),
  cut(seg(7.5, 10.5, 11, 7)),
]);

export const ShareIcon = /*#__PURE__*/ createIcon('Share', () => [
  stroke('M5.75 8H5A2.25 2.25 0 0 0 2.75 10.25V13A2.25 2.25 0 0 0 5 15.25H13A2.25 2.25 0 0 0 15.25 13V10.25A2.25 2.25 0 0 0 13 8H12.25'),
  stroke(seg(9, 11.25, 9, 2.5)),
  stroke(head(9, 2.5, 0, 3.5)),
]);

/** Link between two nodes, trimmed to their edges. */
function link(ax: number, ay: number, bx: number, by: number, r: number): string {
  const d = Math.hypot(bx - ax, by - ay);
  const ux = (bx - ax) / d;
  const uy = (by - ay) / d;
  return seg(ax + ux * r, ay + uy * r, bx - ux * r, by - uy * r);
}

export const ShareNodesIcon = /*#__PURE__*/ createIcon('ShareNodes', () => [
  body(circle(4.75, 9, 2.25), { tint: true }),
  body(circle(13.25, 4.5, 2.25), { tint: true }),
  body(circle(13.25, 13.5, 2.25), { tint: true }),
  stroke(link(4.75, 9, 13.25, 4.5, 2.25)),
  stroke(link(4.75, 9, 13.25, 13.5, 2.25)),
]);
