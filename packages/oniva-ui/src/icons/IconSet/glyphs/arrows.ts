import { createIcon } from '../createIcon';
import { arc, body, circle, cut, head, LINED, polar, poly, roundPoly, roundPolygon, seg, SOLID, stroke } from '../shapes';

// Arrows, chevrons and directional actions.
// Primary arrows: 13 long, arms 5. Arrows that share space with another shape use arms 4.5.

export const ArrowRightIcon = /*#__PURE__*/ createIcon('ArrowRight', () => [stroke(seg(2.5, 9, 15.5, 9)), stroke(head(15.5, 9, 90, 5))]);
export const ArrowLeftIcon = /*#__PURE__*/ createIcon('ArrowLeft', () => [stroke(seg(15.5, 9, 2.5, 9)), stroke(head(2.5, 9, 270, 5))]);
export const ArrowUpIcon = /*#__PURE__*/ createIcon('ArrowUp', () => [stroke(seg(9, 15.5, 9, 2.5)), stroke(head(9, 2.5, 0, 5))]);
export const ArrowDownIcon = /*#__PURE__*/ createIcon('ArrowDown', () => [stroke(seg(9, 2.5, 9, 15.5)), stroke(head(9, 15.5, 180, 5))]);
export const ArrowUpRightIcon = /*#__PURE__*/ createIcon('ArrowUpRight', () => [
  stroke(seg(3.75, 14.25, 14.25, 3.75)),
  stroke(poly(9.25, 3.75, 14.25, 3.75, 14.25, 8.75)),
]);

export const ChevronDownIcon = /*#__PURE__*/ createIcon('ChevronDown', () => [stroke(poly(4, 6.5, 9, 11.5, 14, 6.5))]);
export const ChevronUpIcon = /*#__PURE__*/ createIcon('ChevronUp', () => [stroke(poly(4, 11.5, 9, 6.5, 14, 11.5))]);
export const ChevronLeftIcon = /*#__PURE__*/ createIcon('ChevronLeft', () => [stroke(poly(11.5, 4, 6.5, 9, 11.5, 14))]);
export const ChevronRightIcon = /*#__PURE__*/ createIcon('ChevronRight', () => [stroke(poly(6.5, 4, 11.5, 9, 6.5, 14))]);
export const ChevronsUpDownIcon = /*#__PURE__*/ createIcon('ChevronsUpDown', () => [
  stroke(poly(5, 7, 9, 3, 13, 7)),
  stroke(poly(5, 11, 9, 15, 13, 11)),
]);

/** Compass angle (0 = up, clockwise) of x,y seen from cx,cy. */
const bearing = (cx: number, cy: number, x: number, y: number) =>
  ((Math.atan2(x - cx, cy - y) * 180) / Math.PI + 360) % 360;

/** Arrowhead at the end of a circular arc, tangent to it, turned in a little so the arms sit on the curve. */
function arcHead(cx: number, cy: number, r: number, deg: number, cw: boolean, len: number): string {
  const [x, y] = polar(cx, cy, r, deg);
  const turn = (Math.asin((len * Math.SQRT1_2) / (2 * r)) * 180) / Math.PI;
  return head(x, y, cw ? deg + 90 - turn : deg - 90 + turn, len);
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
  stroke(seg(3.75, 3.75, 14.25, 14.25)),
  stroke(poly(14.25, 9.25, 14.25, 14.25, 9.25, 14.25)),
]);

export const ArrowDownToLineIcon = /*#__PURE__*/ createIcon('ArrowDownToLine', () => [
  stroke(seg(9, 2.5, 9, 12)),
  stroke(head(9, 12, 180, 5)),
  stroke(seg(3.5, 15.5, 14.5, 15.5)),
]);

export const ArrowUpToLineIcon = /*#__PURE__*/ createIcon('ArrowUpToLine', () => [
  stroke(seg(9, 15.5, 9, 6)),
  stroke(head(9, 6, 0, 5)),
  stroke(seg(3.5, 2.5, 14.5, 2.5)),
]);

export const ArrowUpDownIcon = /*#__PURE__*/ createIcon('ArrowUpDown', () => [
  stroke(seg(5.5, 15.5, 5.5, 2.5)),
  stroke(head(5.5, 2.5, 0, 4.5)),
  stroke(seg(12.5, 2.5, 12.5, 15.5)),
  stroke(head(12.5, 15.5, 180, 4.5)),
]);

export const ArrowLeftRightIcon = /*#__PURE__*/ createIcon('ArrowLeftRight', () => [
  stroke(seg(2.5, 5.5, 15.5, 5.5)),
  stroke(head(15.5, 5.5, 90, 4.5)),
  stroke(seg(15.5, 12.5, 2.5, 12.5)),
  stroke(head(2.5, 12.5, 270, 4.5)),
]);

export const CornerDownLeftIcon = /*#__PURE__*/ createIcon('CornerDownLeft', () => [
  stroke(roundPoly(3, 15.5, 3.5, 15.5, 13, 3, 13)),
  stroke(head(3, 13, 270, 5)),
]);

export const DownloadIcon = /*#__PURE__*/ createIcon('Download', () => [
  stroke(seg(9, 2.5, 9, 11.5)),
  stroke(head(9, 11.5, 180, 5)),
  stroke(roundPoly(2.5, 2.5, 10.5, 2.5, 15.5, 15.5, 15.5, 15.5, 10.5)),
]);

export const UploadIcon = /*#__PURE__*/ createIcon('Upload', () => [
  stroke(seg(9, 11.5, 9, 2.5)),
  stroke(head(9, 2.5, 0, 5)),
  stroke(roundPoly(2.5, 2.5, 10.5, 2.5, 15.5, 15.5, 15.5, 15.5, 10.5)),
]);

const CLOUD: [Lobe, Lobe, Lobe] = [
  [4.5, 10.5, 3],
  [9, 7.75, 4.5],
  [13.5, 11, 2.5],
];

export const CloudUploadIcon = /*#__PURE__*/ createIcon('CloudUpload', () => [
  body(cloud(...CLOUD, false), { tint: true, only: LINED }),
  stroke(seg(9, 16, 9, 8.5), { only: LINED }),
  stroke(head(9, 8.5, 0, 4.5), { only: LINED }),
  body(cloud(...CLOUD, true), { only: SOLID }),
  cut(seg(9, 12.5, 9, 8.5), { only: SOLID }),
  cut(head(9, 8.5, 0, 4), { only: SOLID }),
]);

export const ExternalLinkIcon = /*#__PURE__*/ createIcon('ExternalLink', () => [
  stroke('M7.5 2.5H5.5A3 3 0 0 0 2.5 5.5V12.5A3 3 0 0 0 5.5 15.5H12.5A3 3 0 0 0 15.5 12.5V10.5'),
  stroke(seg(9, 9, 15.5, 2.5)),
  stroke(head(15.5, 2.5, 45, 4.5)),
]);

export const LogOutIcon = /*#__PURE__*/ createIcon('LogOut', () => [
  stroke('M7.5 2.5H5.5A3 3 0 0 0 2.5 5.5V12.5A3 3 0 0 0 5.5 15.5H7.5'),
  stroke(seg(7, 9, 15.5, 9)),
  stroke(head(15.5, 9, 90, 4.5)),
]);

export const UndoIcon = /*#__PURE__*/ createIcon('Undo', () => [
  stroke('M5.5 15H10.5A4.5 4.5 0 0 0 10.5 6H2.5'),
  stroke(head(2.5, 6, 270, 5)),
]);

export const RedoIcon = /*#__PURE__*/ createIcon('Redo', () => [
  stroke('M12.5 15H7.5A4.5 4.5 0 0 1 7.5 6H15.5'),
  stroke(head(15.5, 6, 90, 5)),
]);

export const RefreshIcon = /*#__PURE__*/ createIcon('Refresh', () => [
  stroke(arc(9, 9, 7, 285, 425)),
  stroke(arcHead(9, 9, 7, 65, true, 4.5)),
  stroke(arc(9, 9, 7, 105, 245)),
  stroke(arcHead(9, 9, 7, 245, true, 4.5)),
]);

export const RepeatIcon = /*#__PURE__*/ createIcon('Repeat', () => [
  stroke(roundPoly(3, 2.5, 9, 2.5, 4.5, 14.5, 4.5)),
  stroke(head(14.5, 4.5, 90, 4.5)),
  stroke(roundPoly(3, 15.5, 9, 15.5, 13.5, 3.5, 13.5)),
  stroke(head(3.5, 13.5, 270, 4.5)),
]);

export const RepostIcon = /*#__PURE__*/ createIcon('Repost', () => [
  stroke(roundPoly(2.5, 3, 11, 3, 4, 14, 4)),
  stroke(head(14, 4, 90, 4.5)),
  stroke(roundPoly(2.5, 15, 7, 15, 14, 4, 14)),
  stroke(head(4, 14, 270, 4.5)),
]);

export const RotateCcwIcon = /*#__PURE__*/ createIcon('RotateCcw', () => [
  stroke(arc(9, 9.5, 6.75, 340, 610)),
  stroke(arcHead(9, 9.5, 6.75, 340, false, 4.5)),
]);

export const RotateCwIcon = /*#__PURE__*/ createIcon('RotateCw', () => [
  stroke(arc(9, 9.5, 6.75, 20, -250)),
  stroke(arcHead(9, 9.5, 6.75, 20, true, 4.5)),
]);

export const ExpandIcon = /*#__PURE__*/ createIcon('Expand', () => [
  stroke(seg(10, 8, 15.5, 2.5)),
  stroke(head(15.5, 2.5, 45, 5)),
  stroke(seg(8, 10, 2.5, 15.5)),
  stroke(head(2.5, 15.5, 225, 5)),
]);

export const CollapseIcon = /*#__PURE__*/ createIcon('Collapse', () => [
  stroke(seg(15.5, 2.5, 10, 8)),
  stroke(head(10, 8, 225, 5)),
  stroke(seg(2.5, 15.5, 8, 10)),
  stroke(head(8, 10, 45, 5)),
]);

export const MaximizeIcon = /*#__PURE__*/ createIcon('Maximize', () => [
  stroke(roundPoly(3, 2.25, 7.25, 2.25, 2.25, 7.25, 2.25)),
  stroke(roundPoly(3, 10.75, 2.25, 15.75, 2.25, 15.75, 7.25)),
  stroke(roundPoly(3, 15.75, 10.75, 15.75, 15.75, 10.75, 15.75)),
  stroke(roundPoly(3, 7.25, 15.75, 2.25, 15.75, 2.25, 10.75)),
]);

export const SplitIcon = /*#__PURE__*/ createIcon('Split', () => [
  stroke(poly(3, 3, 9, 9, 9, 15.5)),
  stroke(seg(9, 9, 15, 3)),
  stroke(head(3, 3, 315, 4.5)),
  stroke(head(15, 3, 45, 4.5)),
]);

export const SendIcon = /*#__PURE__*/ createIcon('Send', () => [
  body(roundPolygon(1.5, 16, 2, 2, 7.25, 7.5, 10.5, 10.75, 16), { tint: true }),
  cut(seg(7.5, 10.5, 11.25, 6.75)),
]);

export const ShareIcon = /*#__PURE__*/ createIcon('Share', () => [
  stroke(
    'M6 7.25H5.5A3 3 0 0 0 2.5 10.25V12.75A3 3 0 0 0 5.5 15.75H12.5A3 3 0 0 0 15.5 12.75V10.25A3 3 0 0 0 12.5 7.25H12',
  ),
  stroke(seg(9, 11, 9, 2.5)),
  stroke(head(9, 2.5, 0, 4.5)),
]);

/** Link between two nodes, trimmed to their edges. */
function link(ax: number, ay: number, bx: number, by: number, r: number): string {
  const d = Math.hypot(bx - ax, by - ay);
  const ux = (bx - ax) / d;
  const uy = (by - ay) / d;
  return seg(ax + ux * r, ay + uy * r, bx - ux * r, by - uy * r);
}

export const ShareNodesIcon = /*#__PURE__*/ createIcon('ShareNodes', () => [
  body(circle(4.5, 9, 2.5), { tint: true }),
  body(circle(13.5, 4.5, 2.5), { tint: true }),
  body(circle(13.5, 13.5, 2.5), { tint: true }),
  stroke(link(4.5, 9, 13.5, 4.5, 2.5)),
  stroke(link(4.5, 9, 13.5, 13.5, 2.5)),
]);
