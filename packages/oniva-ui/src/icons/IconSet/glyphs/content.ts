import { createIcon } from '../createIcon';
import {
  body,
  clear,
  cut,
  hole,
  LINED,
  poly,
  polar,
  rect,
  roundPoly,
  roundPolygon,
  seg,
  SOLID,
  stroke,
} from '../shapes';

// Files, documents, editing and text formatting.

/** Page with a folded top-right corner (portrait keyline) and its fold. */
const PAGE = 'M10 1.75H5.5A2.75 2.75 0 0 0 2.75 4.5V13.5A2.75 2.75 0 0 0 5.5 16.25H12.5A2.75 2.75 0 0 0 15.25 13.5V7Z';
const FOLD = 'M10 2V4.75A2.25 2.25 0 0 0 12.25 7H15';

/** Clipboard board (portrait keyline) with the clip notch cut out of its top edge. */
const BOARD =
  'M6.25 3.5H5.5A2.75 2.75 0 0 0 2.75 6.25V13.5A2.75 2.75 0 0 0 5.5 16.25H12.5A2.75 2.75 0 0 0 15.25 13.5V6.25A2.75 2.75 0 0 0 12.5 3.5H11.75V5H6.25Z';
const CLIP = rect(6.25, 1.75, 5.5, 3.25, 1.25);

export const FileTextIcon = /*#__PURE__*/ createIcon('FileText', () => [
  body(PAGE, { tint: true }),
  cut(FOLD),
  cut(seg(6, 10, 12, 10)),
  cut(seg(6, 13.25, 9.75, 13.25)),
]);

export const FolderIcon = /*#__PURE__*/ createIcon('Folder', () => [
  body(
    'M4.75 3.5H7L9 5.5H13.25A3 3 0 0 1 16.25 8.5V11.5A3 3 0 0 1 13.25 14.5H4.75A3 3 0 0 1 1.75 11.5V6.5A3 3 0 0 1 4.75 3.5Z',
    { tint: true },
  ),
]);

export const CopyIcon = /*#__PURE__*/ createIcon('Copy', () => [
  stroke('M7 11H4.75A3 3 0 0 1 1.75 8V4.75A3 3 0 0 1 4.75 1.75H8A3 3 0 0 1 11 4.75V7'),
  body(rect(7, 7, 9.25, 9.25, 3), { tint: true }),
]);

export const TrashIcon = /*#__PURE__*/ createIcon('Trash', () => [
  stroke(seg(2.75, 4.5, 15.25, 4.5)),
  stroke('M6.75 4.5V3A1.25 1.25 0 0 1 8 1.75H10A1.25 1.25 0 0 1 11.25 3V4.5'),
  body('M4 4.5V13.25A3 3 0 0 0 7 16.25H11A3 3 0 0 0 14 13.25V4.5Z', { tint: true }),
  cut(seg(9, 8, 9, 12.5)),
]);


/** Closed polygon from x, y, r triples: each corner rounded by its own radius (0 keeps it sharp). */
function corners(...c: number[]): string {
  const p: [number, number, number][] = [];
  for (let i = 0; i + 2 < c.length; i += 3) p.push([c[i]!, c[i + 1]!, c[i + 2]!]);
  const f = (v: number) => String(Math.round(v * 1000) / 1000);
  const toward = (a: [number, number, number], b: [number, number, number], dist: number) => {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const t = Math.min(dist, Math.hypot(dx, dy) / 2) / (Math.hypot(dx, dy) || 1);
    return `${f(a[0] + dx * t)} ${f(a[1] + dy * t)}`;
  };
  let d = '';
  p.forEach((v, i) => {
    const prev = p[(i - 1 + p.length) % p.length]!;
    const next = p[(i + 1) % p.length]!;
    d += v[2]
      ? `${i ? 'L' : 'M'}${toward(v, prev, v[2])}Q${f(v[0])} ${f(v[1])} ${toward(v, next, v[2])}`
      : `${i ? 'L' : 'M'}${f(v[0])} ${f(v[1])}`;
  });
  return `${d}Z`;
}

/**
 * Pencil from its tip `tx, ty` pointing back along `deg`: `len` long, `w` half-width, `cone` the sharpened length.
 * `grow` offsets the outline outward (for a knock-out gap around it in the solid style).
 */
function pencil(
  tx: number,
  ty: number,
  deg: number,
  len: number,
  w: number,
  cone: number,
  grow = 0,
): number[] {
  const [ux, uy] = polar(0, 0, 1, deg);
  const [vx, vy] = polar(0, 0, 1, deg + 90);
  const at = (u: number, v: number) => [tx + u * ux + v * vx, ty + u * uy + v * vy];
  const side = Math.hypot(cone, w);
  const tip = (-grow * side) / w;
  const base = ((w + grow) * cone - grow * side) / w;
  const W = w + grow;
  const L = len + grow;
  return [...at(tip, 0), ...at(base, W), ...at(L, W), ...at(L, -W), ...at(base, -W)];
}
const pencilBody = (p: number[], tipR = 0.25, baseR = 0.5, endR = 1) =>
  corners(
    p[0]!,
    p[1]!,
    tipR,
    p[2]!,
    p[3]!,
    baseR,
    p[4]!,
    p[5]!,
    endR,
    p[6]!,
    p[7]!,
    endR,
    p[8]!,
    p[9]!,
    baseR,
  );
/** Line across a pencil `at` units from its tip. */
function pencilBand(tx: number, ty: number, deg: number, at: number, w: number): string {
  const [cx, cy] = polar(tx, ty, at, deg);
  const [ax, ay] = polar(cx, cy, w, deg - 90);
  const [bx, by] = polar(cx, cy, w, deg + 90);
  return seg(ax, ay, bx, by);
}

export const FileIcon = /*#__PURE__*/ createIcon('File', () => [body(PAGE, { tint: true }), cut(FOLD)]);

export const FileCodeIcon = /*#__PURE__*/ createIcon('FileCode', () => [
  body(PAGE, { tint: true }),
  cut(FOLD),
  cut(poly(7.5, 9.25, 5.25, 11.5, 7.5, 13.75)),
  cut(poly(10.5, 9.25, 12.75, 11.5, 10.5, 13.75)),
]);

export const FolderOpenIcon = /*#__PURE__*/ createIcon('FolderOpen', () => {
  const back = 'M1.75 14.5V6.5A3 3 0 0 1 4.75 3.5H7L9 5.5H11A3 3 0 0 1 14 8.5V10';
  return [
    body(`${back}H16.25L11.75 14.5Z`, { only: SOLID }),
    clear(poly(5.63, 8.5, 19.87, 8.5, 12.37, 16, -1.87, 16)),
    body(roundPolygon(1.5, 6.25, 10, 16.25, 10, 11.75, 14.5, 1.75, 14.5), { tint: true }),
    stroke(back, { only: LINED }),
  ];
});

export const ClipboardCheckIcon = /*#__PURE__*/ createIcon('ClipboardCheck', () => [
  body(BOARD, { tint: true }),
  body(CLIP),
  cut(poly(5.5, 11.25, 8, 13.75, 12.5, 9.25)),
]);

export const ArchiveIcon = /*#__PURE__*/ createIcon('Archive', () => [
  body(rect(1.75, 2.5, 14.5, 4, 1.75)),
  body('M3.5 6.5V12.75A2.75 2.75 0 0 0 6.25 15.5H11.75A2.75 2.75 0 0 0 14.5 12.75V6.5Z', { tint: true }),
  cut(seg(1, 6.5, 17, 6.5), { only: SOLID }),
  cut(seg(7, 10.25, 11, 10.25)),
]);

export const InboxIcon = /*#__PURE__*/ createIcon('Inbox', () => [
  body(rect(1.75, 3.5, 14.5, 11, 3), { tint: true }),
  cut(roundPoly(1, 1.75, 9.5, 5.75, 9.5, 7.25, 11.75, 10.75, 11.75, 12.25, 9.5, 16.25, 9.5)),
]);

export const SaveIcon = /*#__PURE__*/ createIcon('Save', () => [
  body(rect(2, 2, 14, 14, 3), { tint: true }),
  cut('M5.5 2V5.25A1.25 1.25 0 0 0 6.75 6.5H11.25A1.25 1.25 0 0 0 12.5 5.25V2'),
  cut('M5.5 16V11.75A1.25 1.25 0 0 1 6.75 10.5H11.25A1.25 1.25 0 0 1 12.5 11.75V16'),
]);

export const PencilIcon = /*#__PURE__*/ createIcon('Pencil', () => [
  body(pencilBody(pencil(2, 16, 45, 17.75, 2, 4)), { tint: true }),
  cut(pencilBand(2, 16, 45, 14, 2)),
]);

export const SquarePenIcon = /*#__PURE__*/ createIcon('SquarePen', () => [
  stroke('M10 2H5A3 3 0 0 0 2 5V13A3 3 0 0 0 5 16H13A3 3 0 0 0 16 13V8', { only: LINED }),
  body(rect(2, 2, 14, 14, 3), { only: SOLID }),
  cut(pencilBody(pencil(7, 11, 45, 11, 1.75, 3.25, 1.5)), { only: SOLID }),
  body(pencilBody(pencil(7, 11, 45, 11, 1.75, 3.25)), { tint: true }),
]);

export const ImageIcon = /*#__PURE__*/ createIcon('Image', () => [
  body(rect(1.75, 3.5, 14.5, 11, 3), { tint: true }),
  cut(poly(1.75, 13.75, 7, 8.5, 13, 14.5)),
  hole(12.75, 7.25, 1.25),
]);

export const TextIcon = /*#__PURE__*/ createIcon('Text', () => [
  stroke(seg(2.5, 4.5, 15.5, 4.5)),
  stroke(seg(2.5, 9, 15.5, 9)),
  stroke(seg(2.5, 13.5, 10.5, 13.5)),
]);

export const AlignLeftIcon = /*#__PURE__*/ createIcon('AlignLeft', () => [
  stroke(seg(2.5, 3.5, 15.5, 3.5)),
  stroke(seg(2.5, 7.25, 10.5, 7.25)),
  stroke(seg(2.5, 11, 15.5, 11)),
  stroke(seg(2.5, 14.75, 10.5, 14.75)),
]);

export const AlignCenterIcon = /*#__PURE__*/ createIcon('AlignCenter', () => [
  stroke(seg(2.5, 3.5, 15.5, 3.5)),
  stroke(seg(5, 7.25, 13, 7.25)),
  stroke(seg(2.5, 11, 15.5, 11)),
  stroke(seg(5, 14.75, 13, 14.75)),
]);

export const AlignRightIcon = /*#__PURE__*/ createIcon('AlignRight', () => [
  stroke(seg(2.5, 3.5, 15.5, 3.5)),
  stroke(seg(7.5, 7.25, 15.5, 7.25)),
  stroke(seg(2.5, 11, 15.5, 11)),
  stroke(seg(7.5, 14.75, 15.5, 14.75)),
]);

export const BoldIcon = /*#__PURE__*/ createIcon('Bold', () => [
  stroke('M4.5 9H9.75A3.25 3.25 0 0 0 9.75 2.5H4.5V15.5H10.5A3.25 3.25 0 0 0 10.5 9'),
]);

export const ItalicIcon = /*#__PURE__*/ createIcon('Italic', () => [
  stroke(seg(7.5, 2.75, 14.5, 2.75)),
  stroke(seg(11, 2.75, 7, 15.25)),
  stroke(seg(3.5, 15.25, 10.5, 15.25)),
]);

export const UnderlineIcon = /*#__PURE__*/ createIcon('Underline', () => [
  stroke('M4.5 2.5V8A4.5 4.5 0 0 0 13.5 8V2.5'),
  stroke(seg(3.5, 15.5, 14.5, 15.5)),
]);

export const SpellCheckIcon = /*#__PURE__*/ createIcon('SpellCheck', () => [
  stroke(roundPoly(1, 1.75, 10.5, 5.125, 2.5, 8.5, 10.5)),
  stroke(seg(3, 7.5, 7.25, 7.5)),
  stroke(poly(8.5, 13.5, 11.25, 16.25, 16.25, 11.25)),
]);

export const LanguagesIcon = /*#__PURE__*/ createIcon('Languages', () => [
  stroke(roundPoly(1, 1.75, 11.25, 5, 2.5, 8.25, 11.25)),
  stroke(seg(2.9, 8.25, 7.1, 8.25)),
  stroke(seg(10, 8, 16.25, 8)),
  stroke(roundPoly(1, 10.75, 15.75, 13.25, 11.25, 15.75, 15.75)),
]);

export const BookOpenIcon = /*#__PURE__*/ createIcon('BookOpen', () => [
  body('M9 5Q5.75 2.25 1.75 3V13.25Q5.75 12.5 9 15.75Q12.25 12.5 16.25 13.25V3Q12.25 2.25 9 5Z', {
    tint: true,
  }),
  cut(seg(9, 5, 9, 15.75)),
]);

export const NotebookIcon = /*#__PURE__*/ createIcon('Notebook', () => [
  body(rect(4.5, 1.75, 10.75, 14.5, 2.75), { tint: true }),
  stroke(seg(1.75, 5.25, 4.5, 5.25)),
  stroke(seg(1.75, 9, 4.5, 9)),
  stroke(seg(1.75, 12.75, 4.5, 12.75)),
]);

export const PresentationIcon = /*#__PURE__*/ createIcon('Presentation', () => [
  body(rect(1.75, 2.5, 14.5, 9.5, 3), { tint: true }),
  stroke('M9 12V16.25M6 16.25H12'),
]);

export const PaletteIcon = /*#__PURE__*/ createIcon('Palette', () => [
  body(
    'M16.14 10.26A7.25 7.25 0 1 0 10.26 16.14Q9.6 13 12.2 11.9Q13.8 11.2 16.14 10.26Z',
    { tint: true },
  ),
  hole(5.5, 9, 1.25),
  hole(8, 5.75, 1.25),
  hole(12.25, 6.5, 1.25),
]);

export const DropletIcon = /*#__PURE__*/ createIcon('Droplet', () => [
  body('M9 1.75Q3.5 7 3.5 10.75A5.5 5.5 0 0 0 14.5 10.75Q14.5 7 9 1.75Z', { tint: true }),
]);

export const LayersIcon = /*#__PURE__*/ createIcon('Layers', () => [
  body(roundPolygon(1.25, 9, 1.75, 16.25, 5.25, 9, 8.75, 1.75, 5.25), { tint: true }),
  stroke(roundPoly(1.25, 1.75, 8.75, 9, 12.25, 16.25, 8.75)),
  stroke(roundPoly(1.25, 1.75, 12.25, 9, 15.75, 16.25, 12.25)),
]);

export const PackageIcon = /*#__PURE__*/ createIcon('Package', () => {
  const v = [0, 60, 120, 180, 240, 300].flatMap((a) => polar(9, 9, 7.25, a));
  const [, , ur, urY, , , bx, by, , , ul, ulY] = v as [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
  return [
    body(roundPolygon(1.5, ...v), { tint: true }),
    cut(poly(ul, ulY, 9, 9, ur, urY)),
    cut(seg(9, 9, bx, by)),
  ];
});

export const BoxesIcon = /*#__PURE__*/ createIcon('Boxes', () => [
  body(rect(6.125, 1.75, 5.75, 5.75, 1.5), { tint: true }),
  body(rect(1.75, 10.5, 5.75, 5.75, 1.5)),
  body(rect(10.5, 10.5, 5.75, 5.75, 1.5)),
]);

export const ReceiptIcon = /*#__PURE__*/ createIcon('Receipt', () => [
  body(
    'M5 1.75H13A2 2 0 0 1 15 3.75V16.25L13 14.25L11 16.25L9 14.25L7 16.25L5 14.25L3 16.25V3.75A2 2 0 0 1 5 1.75Z',
    { tint: true },
  ),
  cut(seg(6, 6, 12, 6)),
  cut(seg(6, 9.5, 9.5, 9.5)),
]);

export const ClipboardListIcon = /*#__PURE__*/ createIcon('ClipboardList', () => [
  body(BOARD, { tint: true }),
  body(CLIP),
  cut(seg(6.25, 9.25, 11.75, 9.25)),
  cut(seg(6.25, 12.75, 9.75, 12.75)),
]);

export const NotebookPenIcon = /*#__PURE__*/ createIcon('NotebookPen', () => [
  stroke('M10.5 1.75H7.25A2.75 2.75 0 0 0 4.5 4.5V13.5A2.75 2.75 0 0 0 7.25 16.25H12.5A2.75 2.75 0 0 0 15.25 13.5V9.5', {
    only: LINED,
  }),
  body(rect(4.5, 1.75, 10.75, 14.5, 2.75), { only: SOLID }),
  stroke(seg(1.75, 5.25, 4.5, 5.25)),
  stroke(seg(1.75, 9, 4.5, 9)),
  stroke(seg(1.75, 12.75, 4.5, 12.75)),
  cut(pencilBody(pencil(8.25, 12.25, 45, 9.5, 1.75, 3.5, 1.5)), { only: SOLID }),
  body(pencilBody(pencil(8.25, 12.25, 45, 9.5, 1.75, 3.5)), { tint: true }),
]);
