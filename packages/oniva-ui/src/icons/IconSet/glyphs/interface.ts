import { createIcon } from '../createIcon';
import {
  arc,
  body,
  circle,
  clear,
  cut,
  dot,
  hole,
  polar,
  poly,
  polygon,
  rect,
  roundPolygon,
  seg,
  SOLID,
  stroke,
  LINED,
} from '../shapes';

// Core interface glyphs: marks, controls, layout, navigation.

/** Gear outline: `teeth` trapezoid teeth between radii `inner` and `outer`. */
function gear(cx: number, cy: number, outer: number, inner: number, teeth: number): string {
  const c: number[] = [];
  const step = 360 / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    for (const [r, da] of [
      [inner, -step * 0.27],
      [outer, -step * 0.15],
      [outer, step * 0.15],
      [inner, step * 0.27],
    ] as const) {
      const [x, y] = polar(cx, cy, r, a + da);
      c.push(x, y);
    }
  }
  return roundPolygon(0.6, ...c);
}

export const CheckIcon = /*#__PURE__*/ createIcon('Check', () => [stroke(poly(3.25, 9, 7.25, 13, 14.75, 5.5))]);
export const XIcon = /*#__PURE__*/ createIcon('X', () => [
  stroke(seg(4, 4, 14, 14)),
  stroke(seg(14, 4, 4, 14)),
]);
export const PlusIcon = /*#__PURE__*/ createIcon('Plus', () => [
  stroke(seg(9, 3.5, 9, 14.5)),
  stroke(seg(3.5, 9, 14.5, 9)),
]);
export const MinusIcon = /*#__PURE__*/ createIcon('Minus', () => [stroke(seg(3.5, 9, 14.5, 9))]);
export const MenuIcon = /*#__PURE__*/ createIcon('Menu', () => [
  stroke(seg(2.75, 4.5, 15.25, 4.5)),
  stroke(seg(2.75, 9, 15.25, 9)),
  stroke(seg(2.75, 13.5, 15.25, 13.5)),
]);
export const MoreIcon = /*#__PURE__*/ createIcon('More', () => [
  dot(3.5, 9, 1.5),
  dot(9, 9, 1.5),
  dot(14.5, 9, 1.5),
]);

export const SearchIcon = /*#__PURE__*/ createIcon('Search', () => [
  body(circle(7.75, 7.75, 5.75), { tint: true }),
  stroke(seg(11.9, 11.9, 15.5, 15.5)),
  cut(arc(7.75, 7.75, 3, 270, 360), { only: SOLID }),
]);

export const SettingsIcon = /*#__PURE__*/ createIcon('Settings', () => [
  body(gear(9, 9, 7.5, 5.75, 8), { tint: true }),
  cut(circle(9, 9, 2.5)),
]);

export const HomeIcon = /*#__PURE__*/ createIcon('Home', () => [
  body(roundPolygon(1.5, 9, 2, 16, 9, 16, 16, 2, 16, 2, 9), { tint: true }),
  cut(poly(7, 16, 7, 12, 11, 12, 11, 16)),
]);

const EYE =
  'M1.75 9C4 4.5 6.5 3.5 9 3.5C11.5 3.5 14 4.5 16.25 9C14 13.5 11.5 14.5 9 14.5C6.5 14.5 4 13.5 1.75 9Z';

export const EyeIcon = /*#__PURE__*/ createIcon('Eye', () => [
  body(EYE, { tint: true }),
  cut(circle(9, 9, 2.5)),
]);

export const LockIcon = /*#__PURE__*/ createIcon('Lock', () => [
  stroke('M5.5 8V5.5a3.5 3.5 0 0 1 7 0V8'),
  body(rect(2.75, 8, 12.5, 8, 3), { tint: true }),
  cut(seg(9, 10.75, 9, 13)),
]);

export const LoaderIcon = /*#__PURE__*/ createIcon('Loader', () => [
  stroke(circle(9, 9, 7.25), { only: 'duo', soft: true }),
  stroke(arc(9, 9, 7.25, 0, 270)),
]);

export const SquareCheckIcon = /*#__PURE__*/ createIcon('SquareCheck', () => [
  body(rect(2, 2, 14, 14, 3), { tint: true }),
  cut(poly(5.25, 9.25, 7.75, 11.75, 12.75, 6.75)),
]);

export const CircleIcon = /*#__PURE__*/ createIcon('Circle', () => [body(circle(9, 9, 7.25), { tint: true })]);

/** Kept for the README example of stroke-only parts that differ per style. */
export const ListIcon = /*#__PURE__*/ createIcon('List', () => [
  stroke(seg(7.5, 4.5, 16, 4.5)),
  stroke(seg(7.5, 9, 16, 9)),
  stroke(seg(7.5, 13.5, 16, 13.5)),
  dot(3, 4.5, 1.25),
  dot(3, 9, 1.25),
  dot(3, 13.5, 1.25),
]);

// ---- marks and controls -------------------------------------------------

/** Two checks, the second offset right; its short leg is only a stub, tucked behind the first. */
export const CheckDoubleIcon = /*#__PURE__*/ createIcon('CheckDouble', () => [
  stroke(poly(1.75, 9.25, 5.25, 12.75, 11, 7)),
  stroke(poly(9, 11.5, 10.25, 12.75, 16, 7)),
]);

export const GripIcon = /*#__PURE__*/ createIcon('Grip', () => [
  dot(6.5, 3.75, 1.5),
  dot(6.5, 9, 1.5),
  dot(6.5, 14.25, 1.5),
  dot(11.5, 3.75, 1.5),
  dot(11.5, 9, 1.5),
  dot(11.5, 14.25, 1.5),
]);

export const SearchXIcon = /*#__PURE__*/ createIcon('SearchX', () => [
  body(circle(7.75, 7.75, 5.75), { tint: true }),
  stroke(seg(11.9, 11.9, 15.5, 15.5)),
  cut(seg(6, 6, 9.5, 9.5)),
  cut(seg(9.5, 6, 6, 9.5)),
]);

export const FilterIcon = /*#__PURE__*/ createIcon('Filter', () => [
  body(roundPolygon(1.25, 2, 2.75, 16, 2.75, 10.75, 9.5, 10.75, 14, 7.25, 15.75, 7.25, 9.5), { tint: true }),
]);

export const ListFilterIcon = /*#__PURE__*/ createIcon('ListFilter', () => [
  stroke(seg(2, 4.5, 16, 4.5)),
  stroke(seg(5, 9, 13, 9)),
  stroke(seg(8, 13.5, 10, 13.5)),
]);

/** Three tracks, each broken around its knob. */
export const SlidersIcon = /*#__PURE__*/ createIcon('Sliders', () => [
  stroke(seg(2, 4, 9, 4)),
  stroke(seg(13, 4, 16, 4)),
  stroke(seg(2, 9, 4.25, 9)),
  stroke(seg(8.25, 9, 16, 9)),
  stroke(seg(2, 14, 10, 14)),
  stroke(seg(14, 14, 16, 14)),
  body(circle(11, 4, 2), { tint: true }),
  body(circle(6.25, 9, 2), { tint: true }),
  body(circle(12, 14, 2), { tint: true }),
]);

// ---- layout -------------------------------------------------------------

const SQUARE = rect(2, 2, 14, 14, 3);

export const LayoutGridIcon = /*#__PURE__*/ createIcon('LayoutGrid', () => [
  body(rect(2, 2, 6, 6, 2), { tint: true }),
  body(rect(10, 2, 6, 6, 2)),
  body(rect(2, 10, 6, 6, 2)),
  body(rect(10, 10, 6, 6, 2)),
]);

export const LayoutIcon = /*#__PURE__*/ createIcon('Layout', () => [
  body(SQUARE, { tint: true }),
  cut(seg(2, 6.5, 16, 6.5)),
  cut(seg(7, 6.5, 7, 16)),
]);

/** Duo tints the sidebar only: a second, duo-only body traces the same edges. */
export const PanelLeftIcon = /*#__PURE__*/ createIcon('PanelLeft', () => [
  body(SQUARE),
  body(rect(2, 2, 5.5, 14, [3, 0, 0, 3]), { tint: true, only: 'duo' }),
  cut(seg(7.5, 2, 7.5, 16)),
]);

export const PanelRightIcon = /*#__PURE__*/ createIcon('PanelRight', () => [
  body(SQUARE),
  body(rect(10.5, 2, 5.5, 14, [0, 3, 3, 0]), { tint: true, only: 'duo' }),
  cut(seg(10.5, 2, 10.5, 16)),
]);

export const ColumnsIcon = /*#__PURE__*/ createIcon('Columns', () => [
  body(SQUARE, { tint: true }),
  cut(seg(6.75, 2, 6.75, 16)),
  cut(seg(11.25, 2, 11.25, 16)),
]);

export const RowsIcon = /*#__PURE__*/ createIcon('Rows', () => [
  body(SQUARE, { tint: true }),
  cut(seg(2, 6.75, 16, 6.75)),
  cut(seg(2, 11.25, 16, 11.25)),
]);

export const TableIcon = /*#__PURE__*/ createIcon('Table', () => [
  body(SQUARE, { tint: true }),
  cut(seg(2, 7, 16, 7)),
  cut(seg(2, 11.5, 16, 11.5)),
  cut(seg(7.5, 2, 7.5, 16)),
]);

/** Board with three cards hanging from the top, each a different length. */
export const KanbanIcon = /*#__PURE__*/ createIcon('Kanban', () => [
  body(SQUARE, { tint: true }),
  cut(seg(5.75, 6, 5.75, 12)),
  cut(seg(9, 6, 9, 9)),
  cut(seg(12.25, 6, 12.25, 10.5)),
]);

export const ListChecksIcon = /*#__PURE__*/ createIcon('ListChecks', () => [
  stroke(poly(2, 5.25, 4, 7.25, 7.5, 3.75)),
  stroke(poly(2, 12.25, 4, 14.25, 7.5, 10.75)),
  stroke(seg(10.5, 5.5, 16, 5.5)),
  stroke(seg(10.5, 12.5, 16, 12.5)),
]);

export const ListMinusIcon = /*#__PURE__*/ createIcon('ListMinus', () => [
  stroke(seg(2, 4.5, 16, 4.5)),
  stroke(seg(2, 9, 16, 9)),
  stroke(seg(2, 13.5, 8, 13.5)),
  stroke(seg(11.5, 13.5, 16, 13.5)),
]);

// ---- symbols ------------------------------------------------------------

/** Command key: a square whose sides run on into four corner loops. */
export const CommandIcon = /*#__PURE__*/ createIcon('Command', () => [
  stroke(
    'M6.5 4.25A2.25 2.25 0 1 0 4.25 6.5H13.75A2.25 2.25 0 1 0 11.5 4.25V13.75A2.25 2.25 0 1 0 13.75 11.5H4.25A2.25 2.25 0 1 0 6.5 13.75Z',
  ),
]);

export const HashIcon = /*#__PURE__*/ createIcon('Hash', () => [
  stroke(seg(7.5, 2.5, 6, 15.5)),
  stroke(seg(12, 2.5, 10.5, 15.5)),
  stroke(seg(2.5, 6.5, 15.5, 6.5)),
  stroke(seg(2.5, 11.5, 15.5, 11.5)),
]);

export const AtIcon = /*#__PURE__*/ createIcon('At', () => {
  const [ex, ey] = polar(9, 9, 7.25, 150);
  return [
    stroke(circle(9, 9, 3)),
    stroke(`M12 6.5V10A2.125 2.125 0 0 0 16.25 10V9A7.25 7.25 0 1 0 ${ex} ${ey}`),
  ];
});

const r3 = (v: number) => Math.round(v * 1000) / 1000;

/** Point on a frame rotated 45 degrees: u runs bottom-left to top-right, v top-left to bottom-right. */
function diag(u: number, v: number): string {
  return `${r3(9 + (u + v) / Math.SQRT2)} ${r3(9 + (v - u) / Math.SQRT2)}`;
}

/** Two half links on the diagonal, joined by a bar through the middle. */
export const LinkIcon = /*#__PURE__*/ createIcon('Link', () => [
  stroke(`M${diag(2, 3)}L${diag(5.5, 3)}A3 3 0 0 0 ${diag(5.5, -3)}L${diag(2, -3)}`),
  stroke(`M${diag(-2, -3)}L${diag(-5.5, -3)}A3 3 0 0 0 ${diag(-5.5, 3)}L${diag(-2, 3)}`),
  stroke(`M${diag(-3, 0)}L${diag(3, 0)}`),
]);

/** Paperclip drawn upright (x across, y down from its middle), then leaned 45 degrees to the right. */
function clip(x: number, y: number): string {
  const c = Math.SQRT1_2;
  return `${r3(9 + (x - y) * c)} ${r3(9 + (x + y) * c)}`;
}

export const PaperclipIcon = /*#__PURE__*/ createIcon('Paperclip', () => [
  stroke(
    `M${clip(0, -2)}L${clip(0, 6)}A1.5 1.5 0 0 0 ${clip(3, 6)}L${clip(3, -4.5)}A3 3 0 0 0 ${clip(-3, -4.5)}L${clip(-3, 5.5)}`,
  ),
]);

// ---- objects ------------------------------------------------------------

/** Pushpin drawn upright (x across, y down from its middle), then leaned 45 degrees: head up-right, needle down-left. */
const TACK_K = 1.2;
function tack(x: number, y: number): [number, number] {
  const c = Math.SQRT1_2 * TACK_K;
  return [9 + (x - y - 1.625) * c, 9 + (x + y + 1.625) * c];
}

/** Head, tapering neck, flat collar. */
const TACK = [-3, -7, 3, -7, 1.75, -1.5, 4.5, 0.75, 4.5, 2.25, -4.5, 2.25, -4.5, 0.75, -1.75, -1.5];

const PIN_PARTS = () => [
  body(roundPolygon(1.25, ...TACK.flatMap((v, i) => (i % 2 ? [] : tack(v, TACK[i + 1]!)))), {
    tint: true,
  }),
  stroke(seg(...tack(0, 2.25), ...tack(0, 6.25))),
];

/** Band (half-width 2.25) around the off slash y = x; everything under it is erased. */
const SLASH_BAND = polygon(1.3, -1.3, 19.3, 16.7, 16.7, 19.3, -1.3, 1.3);
const SLASH = stroke(seg(2.75, 2.75, 15.25, 15.25));

export const PinIcon = /*#__PURE__*/ createIcon('Pin', PIN_PARTS);

export const PinOffIcon = /*#__PURE__*/ createIcon('PinOff', () => [...PIN_PARTS(), clear(SLASH_BAND), SLASH]);

/** Eye split by the off slash; the pupil sits on the slash, so it drops out. */
export const EyeOffIcon = /*#__PURE__*/ createIcon('EyeOff', () => [
  body(EYE, { tint: true }),
  cut(circle(9, 9, 2.5)),
  clear(SLASH_BAND),
  SLASH,
]);

export const LockOpenIcon = /*#__PURE__*/ createIcon('LockOpen', () => [
  stroke('M12.5 8V5.25a3.5 3.5 0 0 0 -7 0'),
  body(rect(2.75, 8, 12.5, 8, 3), { tint: true }),
  cut(seg(9, 10.75, 9, 13)),
]);

export const KeyIcon = /*#__PURE__*/ createIcon('Key', () => [
  body(circle(5.5, 12.5, 3.5), { tint: true }),
  hole(5.5, 12.5, 1.25),
  stroke(poly(8, 10, 15.5, 2.5)),
  stroke(seg(12.75, 5.25, 14.75, 7.25)),
]);

export const PointerIcon = /*#__PURE__*/ createIcon('Pointer', () => [
  body(roundPolygon(1.5, 2.5, 2.5, 15.5, 7.75, 10, 10, 7.75, 15.5), { tint: true }),
]);

// ---- shapes -------------------------------------------------------------

export const SquareIcon = /*#__PURE__*/ createIcon('Square', () => [body(SQUARE, { tint: true })]);

export const TriangleIcon = /*#__PURE__*/ createIcon('Triangle', () => [
  body(roundPolygon(1.5, 9, 1.75, 16.5, 15.25, 1.5, 15.25), { tint: true }),
]);

/** Radio on: outline shows a centre dot; fill knocks a ring out so the dot stands inside the disc. */
export const CircleDotIcon = /*#__PURE__*/ createIcon('CircleDot', () => [
  body(circle(9, 9, 7.25), { tint: true }),
  dot(9, 9, 3, { only: LINED }),
  cut(circle(9, 9, 4.5), { only: SOLID }),
]);

export const BanIcon = /*#__PURE__*/ createIcon('Ban', () => {
  const [ax, ay] = polar(9, 9, 7.25, 315);
  const [bx, by] = polar(9, 9, 7.25, 135);
  return [body(circle(9, 9, 7.25), { tint: true }), cut(seg(ax, ay, bx, by))];
});

export const CircleDashedIcon = /*#__PURE__*/ createIcon('CircleDashed', () =>
  Array.from({ length: 8 }, (_, i) => stroke(arc(9, 9, 7.25, i * 45 + 9, i * 45 + 36))),
);

export const DashboardIcon = /*#__PURE__*/ createIcon('Dashboard', () => [
  body(rect(2, 2, 5.5, 8, 1.5), { tint: true }),
  body(rect(2, 13, 5.5, 3, 1.5)),
  body(rect(10.5, 2, 5.5, 3, 1.5)),
  body(rect(10.5, 8, 5.5, 8, 1.5), { tint: true }),
]);
