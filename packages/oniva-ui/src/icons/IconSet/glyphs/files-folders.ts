import { createIcon } from '../createIcon';
import type { Part } from '../shapes';
import { body, circle, cut, head, hole, join, poly, rect, seg, SOLID, star, stroke } from '../shapes';

// Files: folders, clipboards and storage.

// ---- marks drawn inside a base shape -----------------------------------------

/** Plus, centred on cx,cy with arms of length h. */
const plusAt = (cx: number, cy: number, h = 2.25) => join(seg(cx, cy - h, cx, cy + h), seg(cx - h, cy, cx + h, cy));
/** Cross, centred on cx,cy with arms of length h. */
const crossAt = (cx: number, cy: number, h = 2.25) =>
  join(seg(cx - h, cy - h, cx + h, cy + h), seg(cx + h, cy - h, cx - h, cy + h));
/** Check mark sitting on cx,cy. */
const checkAt = (cx: number, cy: number) => poly(cx - 2.5, cy + 0.25, cx - 0.75, cy + 2, cx + 2.5, cy - 1.75);

// ---- folder -------------------------------------------------------------------

/** The folder silhouette (same as FolderIcon): tab on the left, body below. */
const FOLDER =
  'M2.25 5A2 2 0 0 1 4.25 3H7L8.75 5H13.75A2 2 0 0 1 15.75 7V13.25A2 2 0 0 1 13.75 15.25H4.25A2 2 0 0 1 2.25 13.25Z';
/** Vertical centre of the room inside the folder body. */
const FY = 10.25;

/** A folder carrying one detail drawn as cuts. */
const folderWith = (...details: Part[]): Part[] => [body(FOLDER, { tint: true }), ...details];

export const FolderPlusIcon = /*#__PURE__*/ createIcon('FolderPlus', () => folderWith(cut(plusAt(9, FY))));

export const FolderMinusIcon = /*#__PURE__*/ createIcon('FolderMinus', () => folderWith(cut(seg(6.5, FY, 11.5, FY))));

export const FolderXIcon = /*#__PURE__*/ createIcon('FolderX', () => folderWith(cut(crossAt(9, FY))));

export const FolderCheckIcon = /*#__PURE__*/ createIcon('FolderCheck', () => folderWith(cut(checkAt(9, FY))));

export const FolderLockIcon = /*#__PURE__*/ createIcon('FolderLock', () =>
  folderWith(
    cut('M7.75 9.75V8.75A1.25 1.25 0 0 1 10.25 8.75V9.75'),
    { k: 'hole', d: rect(6.5, 9.75, 5, 3.25, 0.75) } satisfies Part,
  ),
);

export const FolderSearchIcon = /*#__PURE__*/ createIcon('FolderSearch', () =>
  folderWith(cut(circle(8, 9.5, 2.25)), cut(seg(9.75, 11.25, 12, 13.5))),
);

export const FolderUpIcon = /*#__PURE__*/ createIcon('FolderUp', () =>
  folderWith(cut(seg(9, 12.5, 9, 8.25)), cut(head(9, 8.25, 0, 3))),
);

export const FolderDownIcon = /*#__PURE__*/ createIcon('FolderDown', () =>
  folderWith(cut(seg(9, 8, 9, 12.25)), cut(head(9, 12.25, 180, 3))),
);

export const FolderSymlinkIcon = /*#__PURE__*/ createIcon('FolderSymlink', () =>
  folderWith(cut(seg(5.75, FY, 12.25, FY)), cut(head(12.25, FY, 90, 3))),
);

export const FolderInfoIcon = /*#__PURE__*/ createIcon('FolderInfo', () =>
  folderWith(cut(seg(9, 10.25, 9, 12.5)), hole(9, 8.25, 1)),
);

export const FolderTreeIcon = /*#__PURE__*/ createIcon('FolderTree', () =>
  folderWith(cut(poly(11.5, 8, 8.25, 8, 8.25, 12.5, 11.5, 12.5)), cut(seg(8.25, FY, 5.75, FY))),
);

export const FolderHeartIcon = /*#__PURE__*/ createIcon('FolderHeart', () =>
  folderWith({
    k: 'hole',
    d: 'M9 12.75C7.25 11.6 5.5 10.4 5.5 8.9A1.85 1.85 0 0 1 9 8.2A1.85 1.85 0 0 1 12.5 8.9C12.5 10.4 10.75 11.6 9 12.75Z',
  } satisfies Part),
);

export const FolderStarIcon = /*#__PURE__*/ createIcon('FolderStar', () =>
  folderWith({ k: 'hole', d: star(9, 10.4, 3.2, 1.5, 5, 0.4) } satisfies Part),
);

/** Two folders: the front one tinted, the back one peeking out above and to the right. */
export const FoldersIcon = /*#__PURE__*/ createIcon('Folders', () => [
  stroke('M6.5 6V5.25A2 2 0 0 1 8.5 3.25H10.5L12 5H13.75A2 2 0 0 1 15.75 7V12.5'),
  body(
    'M2.25 9.25A2 2 0 0 1 4.25 7.25H5.75L7 8.75H10.75A2 2 0 0 1 12.75 10.75V13.25A2 2 0 0 1 10.75 15.25H4.25A2 2 0 0 1 2.25 13.25Z',
    { tint: true },
  ),
]);

// ---- archive ------------------------------------------------------------------

/** Archive lid and box, with the solid styles split between them. */
const archive = (...details: Part[]): Part[] => [
  body(rect(2, 2.75, 14, 3.5, 1.25)),
  body('M3.25 6.25V13.5A2 2 0 0 0 5.25 15.5H12.75A2 2 0 0 0 14.75 13.5V6.25Z', { tint: true }),
  cut(seg(1, 6.25, 17, 6.25), { only: SOLID }),
  ...details,
];

export const ArchiveRestoreIcon = /*#__PURE__*/ createIcon('ArchiveRestore', () =>
  archive(cut(seg(9, 13.25, 9, 9.25)), cut(head(9, 9.25, 0, 3))),
);

export const ArchiveXIcon = /*#__PURE__*/ createIcon('ArchiveX', () => archive(cut(crossAt(9, 11, 2))));

// ---- clipboard ----------------------------------------------------------------

/** Board with the clip across its top edge. */
const clipboard = (...details: Part[]): Part[] => [
  body(
    'M6.25 3.5H5.25A2 2 0 0 0 3.25 5.5V14A2 2 0 0 0 5.25 16H12.75A2 2 0 0 0 14.75 14V5.5A2 2 0 0 0 12.75 3.5H11.75V5H6.25Z',
    { tint: true },
  ),
  body(rect(6.25, 2, 5.5, 3, 1)),
  cut(seg(6.25, 5.25, 11.75, 5.25), { only: SOLID }),
  ...details,
];

export const ClipboardIcon = /*#__PURE__*/ createIcon('Clipboard', () => clipboard());

export const ClipboardPlusIcon = /*#__PURE__*/ createIcon('ClipboardPlus', () => clipboard(cut(plusAt(9, 10.75))));

export const ClipboardMinusIcon = /*#__PURE__*/ createIcon('ClipboardMinus', () => clipboard(cut(seg(6.5, 10.75, 11.5, 10.75))));

export const ClipboardXIcon = /*#__PURE__*/ createIcon('ClipboardX', () => clipboard(cut(crossAt(9, 10.75))));

export const ClipboardPasteIcon = /*#__PURE__*/ createIcon('ClipboardPaste', () =>
  clipboard(cut(seg(9, 8.5, 9, 13)), cut(head(9, 13, 180, 3))),
);

// ---- cabinet ------------------------------------------------------------------

export const CabinetIcon = /*#__PURE__*/ createIcon('Cabinet', () => [
  body(rect(3.25, 2, 11.5, 14, 2.5), { tint: true }),
  cut(seg(3.25, 9, 14.75, 9)),
  cut(seg(7.25, 5.5, 10.75, 5.5)),
  cut(seg(7.25, 12.5, 10.75, 12.5)),
]);

// ---- cloud --------------------------------------------------------------------

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

/** Closed cloud outline from three lobes with a flat base. */
function cloud(left: Lobe, top: Lobe, right: Lobe): string {
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
  return `${d}Z`;
}

/** Plain cloud, centred on the canvas. */
const CLOUD: [Lobe, Lobe, Lobe] = [
  [5, 11.25, 2.75],
  [9.5, 9, 4.25],
  [13.25, 11.5, 2.5],
];

/** Roomier cloud for glyphs that carry a mark inside it. */
const CLOUD_WIDE: [Lobe, Lobe, Lobe] = [
  [4.75, 11.25, 2.75],
  [9, 7.75, 5],
  [13.25, 11.25, 2.75],
];

const cloudWith = (...details: Part[]): Part[] => [body(cloud(...CLOUD_WIDE), { tint: true }), ...details];

export const CloudIcon = /*#__PURE__*/ createIcon('Cloud', () => [body(cloud(...CLOUD), { tint: true })]);

export const CloudCheckIcon = /*#__PURE__*/ createIcon('CloudCheck', () => cloudWith(cut(checkAt(9, 9.5))));

export const CloudXIcon = /*#__PURE__*/ createIcon('CloudX', () => cloudWith(cut(crossAt(9, 9.75, 2))));

export const CloudPlusIcon = /*#__PURE__*/ createIcon('CloudPlus', () => cloudWith(cut(plusAt(9, 9.75, 2))));

export const CloudAlertIcon = /*#__PURE__*/ createIcon('CloudAlert', () =>
  cloudWith(cut(seg(9, 7.75, 9, 10.25)), hole(9, 12, 0.9)),
);

/** The cloud split by the off slash: lower-left piece, upper-right piece, and the slash between. */
export const CloudOffIcon = /*#__PURE__*/ createIcon('CloudOff', () => [
  body('M11.88 14H5A2.75 2.75 0 0 1 5.278 8.514A4.25 4.25 0 0 1 5.485 7.606', { tint: true }),
  body('M7.417 5.296A4.25 4.25 0 0 1 13.75 9.05A2.5 2.5 0 0 1 15.194 13.072', { tint: true }),
  stroke(seg(2.75, 2.75, 15.25, 15.25)),
]);
