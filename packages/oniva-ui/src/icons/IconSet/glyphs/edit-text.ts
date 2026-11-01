import { createIcon } from '../createIcon';
import {
  body,
  circle,
  cut,
  dot,
  head,
  LINED,
  poly,
  polar,
  rect,
  seg,
  SOLID,
  stroke,
} from '../shapes';

// Editing: text formatting.

// ---- shared pieces ----------------------------------------------------------

/** Small digit 2 with its top-left at x, y (4 wide, 6 tall). */
const digit2 = (x: number, y: number) =>
  `M${x} ${y + 1.875}A1.875 1.875 0 0 1 ${x + 3.75} ${y + 1.875}Q${x + 3.75} ${y + 3.25} ${x + 1.875} ${y + 4.5}L${x} ${y + 6}H${x + 3.75}`;

/** Small digit 3 with its top-left at x, y (4 wide, 6 tall). */
const digit3 = (x: number, y: number) =>
  `M${x} ${y + 0.5}Q${x + 0.5} ${y} ${x + 1.875} ${y}A1.5 1.5 0 0 1 ${x + 1.875} ${y + 3}A1.75 1.75 0 0 1 ${x + 1.875} ${y + 6}Q${x + 0.5} ${y + 6} ${x} ${y + 5.5}`;

/** Small digit 1 with its top-left at x, y. */
const digit1 = (x: number, y: number) => poly(x, y + 1.75, x + 2, y, x + 2, y + 6);

/** The letter H used by the heading glyphs: stems at x and x + w, 11 tall. */
const hStems = (x: number, w: number) => [
  stroke(seg(x, 3.5, x, 14.5)),
  stroke(seg(x + w, 3.5, x + w, 14.5)),
  stroke(seg(x, 9, x + w, 9)),
];

export const HeadingIcon = /*#__PURE__*/ createIcon('Heading', () => [
  stroke(seg(4.5, 3, 4.5, 15)),
  stroke(seg(13.5, 3, 13.5, 15)),
  stroke(seg(4.5, 9, 13.5, 9)),
]);

export const Heading1Icon = /*#__PURE__*/ createIcon('Heading1', () => [
  ...hStems(3, 6.5),
  stroke(digit1(12.25, 8.5)),
]);

export const Heading2Icon = /*#__PURE__*/ createIcon('Heading2', () => [
  ...hStems(3, 6),
  stroke(digit2(11.75, 8.5)),
]);

export const Heading3Icon = /*#__PURE__*/ createIcon('Heading3', () => [
  ...hStems(3, 6),
  stroke(digit3(11.75, 8.5)),
]);

export const StrikethroughIcon = /*#__PURE__*/ createIcon('Strikethrough', () => [
  stroke(seg(2.5, 9, 15.5, 9)),
  stroke('M12.5 5.5C12.25 4 11 3.25 9 3.25C6.75 3.25 5.5 4.25 5.5 5.75C5.5 7 6.25 7.75 7.5 8.25'),
  stroke('M5.5 12.5C5.75 14 7 14.75 9 14.75C11.25 14.75 12.5 13.75 12.5 12.25C12.5 11 11.75 10.25 10.5 9.75'),
]);

/** A curled quote mark: a round head with a tail sweeping down to the left. */
const quoteMark = (x: number) =>
  `M${x} 7A2.5 2.5 0 1 1 ${x + 5} 7Q${x + 4.75} 11 ${x + 0.5} 13.5Q${x + 2.25} 11.25 ${x + 1.75} 9.25Q${x} 9 ${x} 7Z`;

export const QuoteIcon = /*#__PURE__*/ createIcon('Quote', () => [
  body(quoteMark(2.5), { tint: true }),
  body(quoteMark(10.5), { tint: true }),
]);

export const CodeBlockIcon = /*#__PURE__*/ createIcon('CodeBlock', () => [
  body(rect(2, 3.75, 14, 10.5, 2.5), { tint: true }),
  cut(poly(7.5, 7, 5.5, 9, 7.5, 11)),
  cut(poly(10.5, 7, 12.5, 9, 10.5, 11)),
]);

export const IndentIncreaseIcon = /*#__PURE__*/ createIcon('IndentIncrease', () => [
  stroke(seg(3, 3.75, 15, 3.75)),
  stroke(seg(9.5, 7.25, 15, 7.25)),
  stroke(seg(9.5, 10.75, 15, 10.75)),
  stroke(seg(3, 14.25, 15, 14.25)),
  stroke(seg(3, 9, 6.25, 9)),
  stroke(head(6.25, 9, 90, 3)),
]);

export const IndentDecreaseIcon = /*#__PURE__*/ createIcon('IndentDecrease', () => [
  stroke(seg(3, 3.75, 15, 3.75)),
  stroke(seg(9.5, 7.25, 15, 7.25)),
  stroke(seg(9.5, 10.75, 15, 10.75)),
  stroke(seg(3, 14.25, 15, 14.25)),
  stroke(seg(3, 9, 6.25, 9)),
  stroke(head(3, 9, 270, 3)),
]);

const r3 = (v: number) => Math.round(v * 1000) / 1000;

/** Point on a frame rotated 45 degrees: u runs bottom-left to top-right, v top-left to bottom-right. */
function diag(u: number, v: number): string {
  return `${r3(9 + (u + v) / Math.SQRT2)} ${r3(9 + (v - u) / Math.SQRT2)}`;
}

export const UnlinkIcon = /*#__PURE__*/ createIcon('Unlink', () => [
  stroke(`M${diag(2.75, 3)}L${diag(5, 3)}A3 3 0 0 0 ${diag(5, -3)}L${diag(2.75, -3)}`),
  stroke(`M${diag(-2.75, -3)}L${diag(-5, -3)}A3 3 0 0 0 ${diag(-5, 3)}L${diag(-2.75, 3)}`),
  stroke(`M${diag(0, 4.25)}L${diag(0, 6.5)}`),
  stroke(`M${diag(0, -4.25)}L${diag(0, -6.5)}`),
]);

/** Cross mark (the "x" of an x squared) between two corners. */
const letterX = (x1: number, y1: number, x2: number, y2: number) => [
  stroke(seg(x1, y1, x2, y2)),
  stroke(seg(x2, y1, x1, y2)),
];

export const SubscriptIcon = /*#__PURE__*/ createIcon('Subscript', () => [
  ...letterX(2.75, 3, 9.75, 12),
  stroke(digit2(11.5, 9.5)),
]);

export const SuperscriptIcon = /*#__PURE__*/ createIcon('Superscript', () => [
  ...letterX(2.75, 6, 9.75, 15),
  stroke(digit2(11.5, 2.5)),
]);

export const TextSizeIcon = /*#__PURE__*/ createIcon('TextSize', () => [
  stroke(seg(2.5, 3.75, 9.5, 3.75)),
  stroke(seg(6, 3.75, 6, 15)),
  stroke(seg(11.5, 8.75, 15.5, 8.75)),
  stroke(seg(13.5, 8.75, 13.5, 15)),
]);

// ---- rotated tools ----------------------------------------------------------

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

/** A frame leaning 45 degrees to the right from origin tx, ty: u runs along the tool, v across it. */
function lean(tx: number, ty: number) {
  const [ux, uy] = polar(0, 0, 1, 45);
  const [vx, vy] = polar(0, 0, 1, 135);
  return (u: number, v: number): [number, number] => [tx + u * ux + v * vx, ty + u * uy + v * vy];
}

/** Closed shape through (u, v, radius) triples in a leaned frame. */
function leanShape(at: (u: number, v: number) => [number, number], ...c: number[]): string {
  const out: number[] = [];
  for (let i = 0; i + 2 < c.length; i += 3) {
    const [x, y] = at(c[i]!, c[i + 1]!);
    out.push(x, y, c[i + 2]!);
  }
  return corners(...out);
}

const leanLine = (at: (u: number, v: number) => [number, number], u: number, v1: number, v2: number) => {
  const [x1, y1] = at(u, v1);
  const [x2, y2] = at(u, v2);
  return seg(x1, y1, x2, y2);
};

export const HighlighterIcon = /*#__PURE__*/ createIcon('Highlighter', () => {
  const at = lean(5.25, 11.5);
  return [
    body(leanShape(at, 0, -1.25, 0.4, 2.75, -2.25, 0.5, 9.5, -2.25, 1, 9.5, 2.25, 1, 2.75, 2.25, 0.5, 0, 1.25, 0.4), {
      tint: true,
    }),
    cut(leanLine(at, 2.75, -2.25, 2.25)),
    stroke(seg(2.5, 15.5, 8.5, 15.5)),
  ];
});

export const EraserIcon = /*#__PURE__*/ createIcon('Eraser', () => {
  const at = lean(5.1, 12.9);
  return [
    body(leanShape(at, 0, -2.75, 1.25, 4.25, -2.75, 0, 4.25, 2.75, 0, 0, 2.75, 1.25), { tint: true }),
    body(leanShape(at, 4.25, -2.75, 0, 11, -2.75, 1.25, 11, 2.75, 1.25, 4.25, 2.75, 0)),
    cut(leanLine(at, 4.25, -2.75, 2.75)),
  ];
});

/** Pencil from its tip tx, ty pointing back along `deg`: `len` long, `w` half-width, `cone` the sharpened length. */
function pencil(tx: number, ty: number, len: number, w: number, cone: number): string {
  const at = lean(tx, ty);
  return leanShape(at, 0, 0, 0.25, cone, w, 0.5, len, w, 1, len, -w, 1, cone, -w, 0.5);
}

export const PenLineIcon = /*#__PURE__*/ createIcon('PenLine', () => {
  const at = lean(5.5, 11.75);
  return [
    body(pencil(5.5, 11.75, 10.5, 1.75, 3.5), { tint: true }),
    cut(leanLine(at, 8, -1.75, 1.75)),
    stroke(seg(2.5, 15.5, 15.5, 15.5)),
  ];
});

export const SignatureIcon = /*#__PURE__*/ createIcon('Signature', () => [
  stroke(
    'M2.5 11.5C3.5 6.5 4.75 3 6 3C7 3 6.5 7.5 5.5 10.5C5 12 6.25 12.25 7.5 10.25C8.5 8.75 9.25 8.5 9.5 9.5C9.75 10.5 9.25 11.75 10.5 11.5C12 11.25 12.5 9.25 13.75 9.25C14.5 9.25 14.75 9.75 15.5 10',
  ),
  stroke(seg(2.5, 15.25, 15.5, 15.25)),
]);

// ---- letters ----------------------------------------------------------------

export const PilcrowIcon = /*#__PURE__*/ createIcon('Pilcrow', () => [
  body('M9.5 3H7.75A3.25 3.25 0 0 0 7.75 9.5H9.5Z', { tint: true }),
  stroke(seg(9.5, 3, 13, 3)),
  stroke(seg(9.5, 3, 9.5, 15)),
  stroke(seg(13, 3, 13, 15)),
]);

export const CaseSensitiveIcon = /*#__PURE__*/ createIcon('CaseSensitive', () => [
  stroke(poly(2.25, 14.25, 4.75, 4, 7.25, 14.25)),
  stroke(seg(3.3, 10.75, 6.2, 10.75)),
  stroke(circle(12.5, 12, 2.25)),
  stroke(seg(14.75, 9.75, 14.75, 14.25)),
]);

export const TypeIcon = /*#__PURE__*/ createIcon('Type', () => [
  stroke(poly(3.5, 6.5, 3.5, 3.75, 14.5, 3.75, 14.5, 6.5)),
  stroke(seg(9, 3.75, 9, 15)),
  stroke(seg(6.75, 15, 11.25, 15)),
]);

export const BaselineIcon = /*#__PURE__*/ createIcon('Baseline', () => [
  stroke(poly(4.25, 12, 9, 3, 13.75, 12)),
  stroke(seg(5.9, 8.75, 12.1, 8.75)),
  stroke(seg(3, 15.25, 15, 15.25)),
]);

export const WrapTextIcon = /*#__PURE__*/ createIcon('WrapText', () => [
  stroke(seg(3, 3.5, 15, 3.5)),
  stroke('M3 8.25H12.5A2.375 2.375 0 0 1 12.5 13H9'),
  stroke(head(9, 13, 270, 3.5)),
  stroke(seg(3, 13, 5.5, 13)),
]);

export const LineHeightIcon = /*#__PURE__*/ createIcon('LineHeight', () => [
  stroke(seg(4, 3, 4, 15)),
  stroke(head(4, 3, 0, 3.5)),
  stroke(head(4, 15, 180, 3.5)),
  stroke(seg(10, 4.5, 15.5, 4.5)),
  stroke(seg(10, 9, 15.5, 9)),
  stroke(seg(10, 13.5, 15.5, 13.5)),
]);

export const LetterSpacingIcon = /*#__PURE__*/ createIcon('LetterSpacing', () => [
  stroke(poly(5.75, 9.5, 9, 2.75, 12.25, 9.5)),
  stroke(seg(7, 7, 11, 7)),
  stroke(seg(2.75, 14, 15.25, 14)),
  stroke(head(2.75, 14, 270, 2.75)),
  stroke(head(15.25, 14, 90, 2.75)),
]);

export const ClearFormattingIcon = /*#__PURE__*/ createIcon('ClearFormatting', () => [
  stroke(seg(2.5, 4, 12.5, 4)),
  stroke(seg(7.5, 4, 7.5, 15)),
  stroke(seg(11.75, 11.75, 15.5, 15.5)),
  stroke(seg(15.5, 11.75, 11.75, 15.5)),
]);

export const TextQuoteIcon = /*#__PURE__*/ createIcon('TextQuote', () => [
  stroke(seg(3.5, 4, 3.5, 14)),
  stroke(seg(7.5, 4.25, 15, 4.25)),
  stroke(seg(7.5, 9, 15, 9)),
  stroke(seg(7.5, 13.75, 12, 13.75)),
]);

export const AlignJustifyIcon = /*#__PURE__*/ createIcon('AlignJustify', () => [
  stroke(seg(3, 3.75, 15, 3.75)),
  stroke(seg(3, 7.25, 15, 7.25)),
  stroke(seg(3, 10.75, 15, 10.75)),
  stroke(seg(3, 14.25, 15, 14.25)),
]);

export const TextSelectIcon = /*#__PURE__*/ createIcon('TextSelect', () => [
  stroke('M2.5 6.5V5A2.5 2.5 0 0 1 5 2.5H6.5'),
  stroke('M11.5 2.5H13A2.5 2.5 0 0 1 15.5 5V6.5'),
  stroke('M15.5 11.5V13A2.5 2.5 0 0 1 13 15.5H11.5'),
  stroke('M6.5 15.5H5A2.5 2.5 0 0 1 2.5 13V11.5'),
  stroke(seg(9, 6.5, 9, 11.5)),
  stroke(seg(7.25, 6.5, 10.75, 6.5)),
  stroke(seg(7.25, 11.5, 10.75, 11.5)),
]);

export const ListIndentIcon = /*#__PURE__*/ createIcon('ListIndent', () => [
  stroke(seg(7, 4.5, 15, 4.5)),
  stroke(seg(10.5, 9, 15, 9)),
  stroke(seg(7, 13.5, 15, 13.5)),
  dot(3.25, 4.5, 1, { only: LINED }),
  dot(3.25, 4.5, 1.25, { only: SOLID }),
  dot(6.75, 9, 1, { only: LINED }),
  dot(6.75, 9, 1.25, { only: SOLID }),
  dot(3.25, 13.5, 1, { only: LINED }),
  dot(3.25, 13.5, 1.25, { only: SOLID }),
]);

export const HashtagHeadingIcon = /*#__PURE__*/ createIcon('HashtagHeading', () => [
  stroke(seg(4.5, 2.75, 4.5, 9)),
  stroke(seg(8, 2.75, 8, 9)),
  stroke(seg(2.75, 4.25, 9.75, 4.25)),
  stroke(seg(2.75, 7.5, 9.75, 7.5)),
  stroke(seg(12.75, 6, 15.25, 6)),
  stroke(seg(2.75, 12.25, 15.25, 12.25)),
  stroke(seg(2.75, 15.5, 10, 15.5)),
]);
