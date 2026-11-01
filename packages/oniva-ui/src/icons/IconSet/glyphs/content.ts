import { createIcon } from '../createIcon';
import {
  body,
  circle,
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

export const FileTextIcon = /*#__PURE__*/ createIcon('FileText', () => [
  body('M10.5 2H5.25A2 2 0 0 0 3.25 4V14A2 2 0 0 0 5.25 16H12.75A2 2 0 0 0 14.75 14V6.25Z', {
    tint: true,
  }),
  cut('M10.5 2.25V5.25A1 1 0 0 0 11.5 6.25H14.5'),
  cut(seg(6.25, 9.5, 11.75, 9.5)),
  cut(seg(6.25, 12.5, 9.75, 12.5)),
]);

export const FolderIcon = /*#__PURE__*/ createIcon('Folder', () => [
  body(
    'M2.25 5A2 2 0 0 1 4.25 3H7L8.75 5H13.75A2 2 0 0 1 15.75 7V13.25A2 2 0 0 1 13.75 15.25H4.25A2 2 0 0 1 2.25 13.25Z',
    {
      tint: true,
    },
  ),
]);

export const CopyIcon = /*#__PURE__*/ createIcon('Copy', () => [
  stroke('M4.5 11A2 2 0 0 1 2.5 9V4.5A2 2 0 0 1 4.5 2.5H9A2 2 0 0 1 11 4.5'),
  body(rect(7, 7, 8.5, 8.5, 2), { tint: true }),
]);

export const TrashIcon = /*#__PURE__*/ createIcon('Trash', () => [
  stroke(seg(2.75, 4.75, 15.25, 4.75)),
  stroke('M6.75 4.75V3.75A1.25 1.25 0 0 1 8 2.5H10A1.25 1.25 0 0 1 11.25 3.75V4.75'),
  body('M4.25 4.75L5 14.25A1.75 1.75 0 0 0 6.75 15.75H11.25A1.75 1.75 0 0 0 13 14.25L13.75 4.75Z', {
    tint: true,
  }),
  cut(seg(7.5, 8, 7.5, 12.5)),
  cut(seg(10.5, 8, 10.5, 12.5)),
]);

/** Page with a folded top-right corner (portrait keyline) and its fold. */
const PAGE = 'M10.5 2H5.25A2 2 0 0 0 3.25 4V14A2 2 0 0 0 5.25 16H12.75A2 2 0 0 0 14.75 14V6.25Z';
const FOLD = 'M10.5 2.25V5.25A1 1 0 0 0 11.5 6.25H14.5';

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

export const FileIcon = /*#__PURE__*/ createIcon('File', () => [
  body(PAGE, { tint: true }),
  cut(FOLD),
]);

export const FileCodeIcon = /*#__PURE__*/ createIcon('FileCode', () => [
  body(PAGE, { tint: true }),
  cut(FOLD),
  cut(poly(7.75, 9, 6.25, 10.5, 7.75, 12)),
  cut(poly(10.25, 9, 11.75, 10.5, 10.25, 12)),
]);

export const FolderOpenIcon = /*#__PURE__*/ createIcon('FolderOpen', () => [
  stroke('M2.25 13.5V5A2 2 0 0 1 4.25 3H7L8.75 5H12.25A2 2 0 0 1 14.25 7V8.25', { only: LINED }),
  body('M2.25 15.25V5A2 2 0 0 1 4.25 3H7L8.75 5H12.25A2 2 0 0 1 14.25 7V9H4Z', { only: SOLID }),
  cut(poly(1, 14.5, 4.1, 6.75, 15.5, 6.75), { only: SOLID }),
  body(roundPolygon(1, 2.25, 15.25, 5, 8.25, 16, 8.25, 13.5, 15.25), { tint: true }),
]);

export const ClipboardCheckIcon = /*#__PURE__*/ createIcon('ClipboardCheck', () => [
  body(
    'M6.25 3.5H5.25A2 2 0 0 0 3.25 5.5V14A2 2 0 0 0 5.25 16H12.75A2 2 0 0 0 14.75 14V5.5A2 2 0 0 0 12.75 3.5H11.75V5H6.25Z',
    {
      tint: true,
    },
  ),
  body(rect(6.25, 2, 5.5, 3, 1)),
  cut(poly(6.25, 10.75, 8.25, 12.75, 11.75, 9.25)),
]);

export const ArchiveIcon = /*#__PURE__*/ createIcon('Archive', () => [
  body(rect(2, 2.75, 14, 3.5, 1.25)),
  body('M3.25 6.25V13.5A2 2 0 0 0 5.25 15.5H12.75A2 2 0 0 0 14.75 13.5V6.25Z', { tint: true }),
  cut(seg(1, 6.25, 17, 6.25), { only: SOLID }),
  cut(seg(7.25, 9.5, 10.75, 9.5)),
]);

export const InboxIcon = /*#__PURE__*/ createIcon('Inbox', () => [
  stroke('M2 9.75V6.25A2.5 2.5 0 0 1 4.5 3.75H13.5A2.5 2.5 0 0 1 16 6.25V9.75'),
  body(
    'M2 9.75H5L6.5 11.25H11.5L13 9.75H16V11.75A2.5 2.5 0 0 1 13.5 14.25H4.5A2.5 2.5 0 0 1 2 11.75Z',
    { tint: true },
  ),
]);

export const SaveIcon = /*#__PURE__*/ createIcon('Save', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  cut('M6 2.5V5.25A1 1 0 0 0 7 6.25H10.5A1 1 0 0 0 11.5 5.25V2.5'),
  cut('M5.5 15.5V11.5A1 1 0 0 1 6.5 10.5H11.5A1 1 0 0 1 12.5 11.5V15.5'),
]);

export const PencilIcon = /*#__PURE__*/ createIcon('Pencil', () => [
  body(pencilBody(pencil(3, 15, 45, 15.25, 1.75, 3.5)), { tint: true }),
  cut(pencilBand(3, 15, 45, 12, 1.75)),
]);

export const SquarePenIcon = /*#__PURE__*/ createIcon('SquarePen', () => [
  stroke('M9 2.5H5A2.5 2.5 0 0 0 2.5 5V13A2.5 2.5 0 0 0 5 15.5H13A2.5 2.5 0 0 0 15.5 13V9', {
    only: LINED,
  }),
  body(rect(2.5, 2.5, 13, 13, 2.5), { only: SOLID }),
  cut(pencilBody(pencil(7.25, 10.75, 45, 10.75, 1.5, 3, 1.5)), { only: SOLID }),
  body(pencilBody(pencil(7.25, 10.75, 45, 10.75, 1.5, 3)), { tint: true }),
]);

export const ImageIcon = /*#__PURE__*/ createIcon('Image', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(circle(6.25, 7.5, 1.25)),
  cut(roundPoly(1, 4.25, 13.5, 9.5, 8.25, 15.25, 13.25)),
]);

export const TextIcon = /*#__PURE__*/ createIcon('Text', () => [
  stroke(seg(3, 4.75, 15, 4.75)),
  stroke(seg(3, 9, 15, 9)),
  stroke(seg(3, 13.25, 10, 13.25)),
]);

export const AlignLeftIcon = /*#__PURE__*/ createIcon('AlignLeft', () => [
  stroke(seg(3, 3.75, 15, 3.75)),
  stroke(seg(3, 7.25, 11, 7.25)),
  stroke(seg(3, 10.75, 15, 10.75)),
  stroke(seg(3, 14.25, 11, 14.25)),
]);

export const AlignCenterIcon = /*#__PURE__*/ createIcon('AlignCenter', () => [
  stroke(seg(3, 3.75, 15, 3.75)),
  stroke(seg(5, 7.25, 13, 7.25)),
  stroke(seg(3, 10.75, 15, 10.75)),
  stroke(seg(5, 14.25, 13, 14.25)),
]);

export const AlignRightIcon = /*#__PURE__*/ createIcon('AlignRight', () => [
  stroke(seg(3, 3.75, 15, 3.75)),
  stroke(seg(7, 7.25, 15, 7.25)),
  stroke(seg(3, 10.75, 15, 10.75)),
  stroke(seg(7, 14.25, 15, 14.25)),
]);

export const BoldIcon = /*#__PURE__*/ createIcon('Bold', () => [
  stroke('M5 8.75H9.75A2.875 2.875 0 0 0 9.75 3H5V15H10.5A3.125 3.125 0 0 0 10.5 8.75'),
]);

export const ItalicIcon = /*#__PURE__*/ createIcon('Italic', () => [
  stroke(seg(8.25, 3.5, 13.75, 3.5)),
  stroke(seg(11, 3.5, 7, 14.5)),
  stroke(seg(4.25, 14.5, 9.75, 14.5)),
]);

export const UnderlineIcon = /*#__PURE__*/ createIcon('Underline', () => [
  stroke('M5 2.75V8A4 4 0 0 0 13 8V2.75'),
  stroke(seg(4, 15.25, 14, 15.25)),
]);

export const SpellCheckIcon = /*#__PURE__*/ createIcon('SpellCheck', () => [
  stroke(poly(2.75, 10.25, 6, 2.5, 9.25, 10.25)),
  stroke(seg(3.9, 7.5, 8.1, 7.5)),
  stroke(poly(10, 13.25, 12, 15.25, 16, 11.25)),
]);

export const LanguagesIcon = /*#__PURE__*/ createIcon('Languages', () => [
  stroke(poly(2.25, 9.75, 5.25, 2.25, 8.25, 9.75)),
  stroke(seg(3.25, 7.25, 7.25, 7.25)),
  stroke(seg(10.5, 9.25, 15.75, 9.25)),
  stroke('M13 9.25V12.5Q13 15.25 10.5 15.5'),
  stroke(seg(14, 12.5, 15.75, 15)),
]);

export const BookOpenIcon = /*#__PURE__*/ createIcon('BookOpen', () => [
  body('M9 5Q6 3.25 2.25 3.5V13.75Q6 13.5 9 15.25Q12 13.5 15.75 13.75V3.5Q12 3.25 9 5Z', {
    tint: true,
  }),
  cut(seg(9, 5, 9, 15.25)),
]);

export const NotebookIcon = /*#__PURE__*/ createIcon('Notebook', () => [
  body(rect(4.5, 2, 11, 14, 2), { tint: true }),
  stroke(seg(2.25, 5.5, 4.5, 5.5)),
  stroke(seg(2.25, 9, 4.5, 9)),
  stroke(seg(2.25, 12.5, 4.5, 12.5)),
  cut(seg(8, 6, 12.75, 6)),
  cut(seg(8, 9, 12.75, 9)),
]);

export const PresentationIcon = /*#__PURE__*/ createIcon('Presentation', () => [
  stroke(seg(2, 3, 16, 3)),
  body(rect(3.25, 3, 11.5, 8.5, [0, 0, 2, 2]), { tint: true }),
  stroke(seg(9, 11.5, 9, 13.25)),
  stroke(poly(6.5, 15.75, 9, 13.25, 11.5, 15.75)),
]);

export const PaletteIcon = /*#__PURE__*/ createIcon('Palette', () => [
  body('M15.9 9.75A7 7 0 1 0 9.75 15.9Q9.25 13.25 11.25 11.75Q12.75 10.25 15.9 9.75Z', {
    tint: true,
  }),
  hole(5.5, 7.75),
  hole(8, 5.5),
  hole(11.5, 6.25),
  cut(circle(7.75, 11.5, 1.25), { only: LINED }),
  hole(7.75, 11.5, 2, { only: SOLID }),
]);

export const DropletIcon = /*#__PURE__*/ createIcon('Droplet', () => [
  body('M9 2.25Q3.75 7.5 3.75 10.75A5.25 5.25 0 0 0 14.25 10.75Q14.25 7.5 9 2.25Z', { tint: true }),
]);

export const LayersIcon = /*#__PURE__*/ createIcon('Layers', () => [
  body(roundPolygon(1, 9, 2.25, 16, 5.5, 9, 8.75, 2, 5.5), { tint: true }),
  stroke(roundPoly(1, 2, 9, 9, 12.25, 16, 9)),
  stroke(roundPoly(1, 2, 12.5, 9, 15.75, 16, 12.5)),
]);

export const PackageIcon = /*#__PURE__*/ createIcon('Package', () => {
  const v = [0, 60, 120, 180, 240, 300].flatMap((a) => polar(9, 9, 7, a));
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
    body(roundPolygon(1.25, ...v), { tint: true }),
    cut(poly(ul, ulY, 9, 9, ur, urY)),
    cut(seg(9, 9, bx, by)),
    cut(poly(5.97, 3.75, 12.03, 7.25, 12.03, 10.25)),
  ];
});

export const BoxesIcon = /*#__PURE__*/ createIcon('Boxes', () => [
  body(rect(6.25, 2, 5.5, 5.5, 1.25), { tint: true }),
  body(rect(2, 10.5, 5.5, 5.5, 1.25)),
  body(rect(10.5, 10.5, 5.5, 5.5, 1.25)),
]);

export const ReceiptIcon = /*#__PURE__*/ createIcon('Receipt', () => [
  body(
    'M3.75 4A2 2 0 0 1 5.75 2H12.25A2 2 0 0 1 14.25 4V16L12.5 14.75L10.75 16L9 14.75L7.25 16L5.5 14.75L3.75 16Z',
    {
      tint: true,
    },
  ),
  cut(seg(6.75, 5.5, 11.25, 5.5)),
  cut(seg(6.75, 8.5, 11.25, 8.5)),
  cut(seg(6.75, 11.5, 9.25, 11.5)),
]);

export const ClipboardListIcon = /*#__PURE__*/ createIcon('ClipboardList', () => [
  body(
    'M6.25 3.5H5.25A2 2 0 0 0 3.25 5.5V14A2 2 0 0 0 5.25 16H12.75A2 2 0 0 0 14.75 14V5.5A2 2 0 0 0 12.75 3.5H11.75V5H6.25Z',
    { tint: true },
  ),
  body(rect(6.25, 2, 5.5, 3, 1)),
  hole(6.5, 8.75, 0.85),
  hole(6.5, 12, 0.85),
  cut(seg(9, 8.75, 11.75, 8.75)),
  cut(seg(9, 12, 11.75, 12)),
]);

export const NotebookPenIcon = /*#__PURE__*/ createIcon('NotebookPen', () => [
  stroke('M10 2H6.5A2 2 0 0 0 4.5 4V14A2 2 0 0 0 6.5 16H13.5A2 2 0 0 0 15.5 14V10', { only: LINED }),
  body(rect(4.5, 2, 11, 14, 2), { only: SOLID }),
  stroke(seg(2.25, 5.5, 4.5, 5.5)),
  stroke(seg(2.25, 9, 4.5, 9)),
  stroke(seg(2.25, 12.5, 4.5, 12.5)),
  cut(pencilBody(pencil(9, 10.75, 45, 7.5, 1.5, 3, 1.5)), { only: SOLID }),
  body(pencilBody(pencil(9, 10.75, 45, 7.5, 1.5, 3)), { tint: true }),
]);
