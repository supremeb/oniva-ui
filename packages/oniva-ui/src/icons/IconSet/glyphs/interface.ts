import { createIcon } from '../createIcon';
import {
  arc,
  body,
  circle,
  cut,
  dot,
  hole,
  polar,
  poly,
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
  return roundPolygon(0.5, ...c);
}

export const CheckIcon = /*#__PURE__*/ createIcon('Check', () => [
  stroke(poly(3.25, 9.25, 7, 13, 14.75, 5.25)),
]);
export const XIcon = /*#__PURE__*/ createIcon('X', () => [
  stroke(seg(4.5, 4.5, 13.5, 13.5)),
  stroke(seg(13.5, 4.5, 4.5, 13.5)),
]);
export const PlusIcon = /*#__PURE__*/ createIcon('Plus', () => [
  stroke(seg(9, 3.75, 9, 14.25)),
  stroke(seg(3.75, 9, 14.25, 9)),
]);
export const MinusIcon = /*#__PURE__*/ createIcon('Minus', () => [stroke(seg(3.75, 9, 14.25, 9))]);
export const MenuIcon = /*#__PURE__*/ createIcon('Menu', () => [
  stroke(seg(3, 4.75, 15, 4.75)),
  stroke(seg(3, 9, 15, 9)),
  stroke(seg(3, 13.25, 15, 13.25)),
]);
export const MoreIcon = /*#__PURE__*/ createIcon('More', () => [
  dot(3.75, 9, 1.25),
  dot(9, 9, 1.25),
  dot(14.25, 9, 1.25),
]);

export const SearchIcon = /*#__PURE__*/ createIcon('Search', () => [
  body(circle(8, 8, 5.25), { tint: true }),
  stroke(seg(11.85, 11.85, 15.25, 15.25)),
  cut(arc(8, 8, 2.75, 270, 360), { only: SOLID }),
]);

export const SettingsIcon = /*#__PURE__*/ createIcon('Settings', () => [
  body(gear(9, 9, 7.25, 5.5, 8), { tint: true }),
  cut(circle(9, 9, 2.25)),
]);

export const HomeIcon = /*#__PURE__*/ createIcon('Home', () => [
  body(roundPolygon(1.25, 9, 2.25, 15.5, 7.5, 15.5, 15.5, 2.5, 15.5, 2.5, 7.5), { tint: true }),
  cut(poly(7.25, 15.5, 7.25, 12, 10.75, 12, 10.75, 15.5)),
]);

export const EyeIcon = /*#__PURE__*/ createIcon('Eye', () => [
  body('M1.75 9Q9 0.75 16.25 9Q9 17.25 1.75 9Z', { tint: true }),
  cut(circle(9, 9, 2.25)),
]);

export const LockIcon = /*#__PURE__*/ createIcon('Lock', () => [
  stroke('M5.75 8V5.75a3.25 3.25 0 0 1 6.5 0V8'),
  body(rect(3.25, 8, 11.5, 7.75, 2.25), { tint: true }),
  cut(seg(9, 11.25, 9, 12.5)),
]);

export const LoaderIcon = /*#__PURE__*/ createIcon('Loader', () => [
  stroke(circle(9, 9, 6.75), { only: 'duo', soft: true }),
  stroke(arc(9, 9, 6.75, 0, 270)),
]);

export const SquareCheckIcon = /*#__PURE__*/ createIcon('SquareCheck', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  cut(poly(5.75, 9.25, 8, 11.5, 12.25, 6.75)),
]);

export const CircleIcon = /*#__PURE__*/ createIcon('Circle', () => [
  body(circle(9, 9, 7), { tint: true }),
]);

/** Kept for the README example of stroke-only parts that differ per style. */
export const ListIcon = /*#__PURE__*/ createIcon('List', () => [
  stroke(seg(7, 4.75, 15, 4.75)),
  stroke(seg(7, 9, 15, 9)),
  stroke(seg(7, 13.25, 15, 13.25)),
  dot(3.5, 4.75, 1, { only: LINED }),
  dot(3.5, 9, 1, { only: LINED }),
  dot(3.5, 13.25, 1, { only: LINED }),
  dot(3.5, 4.75, 1.25, { only: SOLID }),
  dot(3.5, 9, 1.25, { only: SOLID }),
  dot(3.5, 13.25, 1.25, { only: SOLID }),
]);

// ---- marks and controls -------------------------------------------------

/** Two checks, the second offset right; its short leg is only a stub, tucked behind the first. */
export const CheckDoubleIcon = /*#__PURE__*/ createIcon('CheckDouble', () => [
  stroke(poly(1.75, 9, 4.75, 12, 10.75, 6)),
  stroke(poly(9, 11.25, 9.75, 12, 15.75, 6)),
]);

export const GripIcon = /*#__PURE__*/ createIcon('Grip', () => [
  dot(6.5, 4, 1.25),
  dot(6.5, 9, 1.25),
  dot(6.5, 14, 1.25),
  dot(11.5, 4, 1.25),
  dot(11.5, 9, 1.25),
  dot(11.5, 14, 1.25),
]);

export const SearchXIcon = /*#__PURE__*/ createIcon('SearchX', () => [
  body(circle(8, 8, 5.25), { tint: true }),
  stroke(seg(11.85, 11.85, 15.25, 15.25)),
  cut(seg(6.5, 6.5, 9.5, 9.5)),
  cut(seg(9.5, 6.5, 6.5, 9.5)),
]);

export const FilterIcon = /*#__PURE__*/ createIcon('Filter', () => [
  body(roundPolygon(1, 2.5, 3, 15.5, 3, 10.5, 9, 10.5, 14, 7.5, 15.75, 7.5, 9), { tint: true }),
]);

export const ListFilterIcon = /*#__PURE__*/ createIcon('ListFilter', () => [
  stroke(seg(3, 4.75, 15, 4.75)),
  stroke(seg(5.25, 9, 12.75, 9)),
  stroke(seg(7.5, 13.25, 10.5, 13.25)),
]);

/** Three tracks, each broken around its knob (knob left, right, centre). */
export const SlidersIcon = /*#__PURE__*/ createIcon('Sliders', () => [
  stroke(seg(8, 4, 15.75, 4)),
  stroke(seg(2.25, 9, 10, 9)),
  stroke(seg(2.25, 14, 5.25, 14)),
  stroke(seg(12.75, 14, 15.75, 14)),
  body(circle(4.25, 4, 1.75), { tint: true }),
  body(circle(13.75, 9, 1.75), { tint: true }),
  body(circle(9, 14, 1.75), { tint: true }),
]);

// ---- layout -------------------------------------------------------------

const SQUARE = rect(2.5, 2.5, 13, 13, 2.5);

export const LayoutGridIcon = /*#__PURE__*/ createIcon('LayoutGrid', () => [
  body(rect(2.5, 2.5, 5, 5, 1.5), { tint: true }),
  body(rect(10.5, 2.5, 5, 5, 1.5)),
  body(rect(2.5, 10.5, 5, 5, 1.5)),
  body(rect(10.5, 10.5, 5, 5, 1.5)),
]);

export const LayoutIcon = /*#__PURE__*/ createIcon('Layout', () => [
  body(SQUARE, { tint: true }),
  cut(seg(2.5, 6.75, 15.5, 6.75)),
  cut(seg(7, 6.75, 7, 15.5)),
]);

/** Duo tints the sidebar only: a second, duo-only body traces the same edges. */
export const PanelLeftIcon = /*#__PURE__*/ createIcon('PanelLeft', () => [
  body(SQUARE),
  body(rect(2.5, 2.5, 4.5, 13, [2.5, 0, 0, 2.5]), { tint: true, only: 'duo' }),
  cut(seg(7, 2.5, 7, 15.5)),
]);

export const PanelRightIcon = /*#__PURE__*/ createIcon('PanelRight', () => [
  body(SQUARE),
  body(rect(11, 2.5, 4.5, 13, [0, 2.5, 2.5, 0]), { tint: true, only: 'duo' }),
  cut(seg(11, 2.5, 11, 15.5)),
]);

export const ColumnsIcon = /*#__PURE__*/ createIcon('Columns', () => [
  body(SQUARE, { tint: true }),
  cut(seg(6.75, 2.5, 6.75, 15.5)),
  cut(seg(11.25, 2.5, 11.25, 15.5)),
]);

export const RowsIcon = /*#__PURE__*/ createIcon('Rows', () => [
  body(SQUARE, { tint: true }),
  cut(seg(2.5, 6.75, 15.5, 6.75)),
  cut(seg(2.5, 11.25, 15.5, 11.25)),
]);

export const TableIcon = /*#__PURE__*/ createIcon('Table', () => [
  body(SQUARE, { tint: true }),
  cut(seg(2.5, 6.75, 15.5, 6.75)),
  cut(seg(2.5, 11.25, 15.5, 11.25)),
  cut(seg(7.25, 2.5, 7.25, 15.5)),
]);

/** Board with three cards hanging from the top, each a different length. */
export const KanbanIcon = /*#__PURE__*/ createIcon('Kanban', () => [
  body(SQUARE, { tint: true }),
  cut(seg(6, 6, 6, 12)),
  cut(seg(9, 6, 9, 9.5)),
  cut(seg(12, 6, 12, 10.75)),
]);

export const ListChecksIcon = /*#__PURE__*/ createIcon('ListChecks', () => [
  stroke(poly(2.25, 4.75, 3.5, 6, 6, 3.5)),
  stroke(poly(2.25, 9.75, 3.5, 11, 6, 8.5)),
  stroke(seg(9, 4.75, 15.5, 4.75)),
  stroke(seg(9, 9.75, 15.5, 9.75)),
  stroke(seg(2.5, 14.5, 15.5, 14.5)),
]);

export const ListMinusIcon = /*#__PURE__*/ createIcon('ListMinus', () => [
  stroke(seg(2.5, 3.75, 15.5, 3.75)),
  stroke(seg(2.5, 8, 15.5, 8)),
  stroke(seg(2.5, 12.25, 8.75, 12.25)),
  stroke(seg(11.75, 14.5, 15.75, 14.5)),
]);

// ---- symbols ------------------------------------------------------------

/** Command key: a square whose sides run on into four corner loops. */
export const CommandIcon = /*#__PURE__*/ createIcon('Command', () => [
  stroke(
    'M6.75 4.75A2 2 0 1 0 4.75 6.75H13.25A2 2 0 1 0 11.25 4.75V13.25A2 2 0 1 0 13.25 11.25H4.75A2 2 0 1 0 6.75 13.25Z',
  ),
]);

export const HashIcon = /*#__PURE__*/ createIcon('Hash', () => [
  stroke(seg(7.25, 2.75, 5.75, 15.25)),
  stroke(seg(12.25, 2.75, 10.75, 15.25)),
  stroke(seg(3, 6.5, 15, 6.5)),
  stroke(seg(3, 11.5, 15, 11.5)),
]);

export const AtIcon = /*#__PURE__*/ createIcon('At', () => {
  const [ex, ey] = polar(9, 9, 7, 150);
  return [
    stroke(circle(9, 9, 2.75)),
    stroke(`M11.75 6.25V10A2.125 2.125 0 0 0 16 10V9A7 7 0 1 0 ${ex} ${ey}`),
  ];
});

const r3 = (v: number) => Math.round(v * 1000) / 1000;

/** Point on a frame rotated 45 degrees: u runs bottom-left to top-right, v top-left to bottom-right. */
function diag(u: number, v: number): string {
  return `${r3(9 + (u + v) / Math.SQRT2)} ${r3(9 + (v - u) / Math.SQRT2)}`;
}

/** Two half links on the diagonal, joined by a bar through the middle. */
export const LinkIcon = /*#__PURE__*/ createIcon('Link', () => [
  stroke(`M${diag(1.5, 3)}L${diag(4.25, 3)}A3 3 0 0 0 ${diag(4.25, -3)}L${diag(1.5, -3)}`),
  stroke(`M${diag(-1.5, -3)}L${diag(-4.25, -3)}A3 3 0 0 0 ${diag(-4.25, 3)}L${diag(-1.5, 3)}`),
  stroke(`M${diag(-2.5, 0)}L${diag(2.5, 0)}`),
]);

/** Paperclip drawn upright (x across, y down from its middle), then leaned 45 degrees to the right. */
function clip(x: number, y: number): string {
  const c = Math.SQRT1_2;
  return `${r3(9 + (x - y) * c)} ${r3(9 + (x + y) * c)}`;
}

export const PaperclipIcon = /*#__PURE__*/ createIcon('Paperclip', () => [
  stroke(
    `M${clip(0, -2)}L${clip(0, 5)}A1.5 1.5 0 0 0 ${clip(3, 5)}L${clip(3, -3.5)}A3 3 0 0 0 ${clip(-3, -3.5)}L${clip(-3, 4)}`,
  ),
]);

// ---- objects ------------------------------------------------------------

/** Pushpin drawn upright (x across, y down from its middle), then leaned 45 degrees: head up-right, needle down-left. */
function tack(x: number, y: number): [number, number] {
  const c = Math.SQRT1_2;
  return [9 + (x - y - 2.25) * c, 9 + (x + y + 2.25) * c];
}

/** Head, tapering neck, flat collar. */
const TACK = [-3, -7, 3, -7, 1.75, -1.5, 4.5, 0.75, 4.5, 2.25, -4.5, 2.25, -4.5, 0.75, -1.75, -1.5];

export const PinIcon = /*#__PURE__*/ createIcon('Pin', () => [
  body(roundPolygon(1, ...TACK.flatMap((v, i) => (i % 2 ? [] : tack(v, TACK[i + 1]!)))), {
    tint: true,
  }),
  stroke(seg(...tack(0, 2.25), ...tack(0, 6.5))),
]);

/**
 * Pin split by the off slash (y = x) across its neck. The halves are open bodies whose ends sit 2.25 from the slash,
 * so the implied closing edge runs parallel to it in the tint and the solid.
 */
export const PinOffIcon = /*#__PURE__*/ createIcon('PinOff', () => [
  body(
    'M8.872 5.69L9.705 4.366Q10.237 3.52 10.945 4.227L13.773 7.055Q14.48 7.763 13.634 8.295L12.31 9.128',
    {
      tint: true,
    },
  ),
  body(
    'M9.943 13.125L9.961 13.308Q10.061 14.303 9.53 14.834Q9 15.364 8.293 14.657L3.343 9.707Q2.636 9 3.166 8.47Q3.697 7.939 4.692 8.039L4.875 8.057',
    {
      tint: true,
    },
  ),
  stroke(seg(...tack(0, 2.25), ...tack(0, 6.5))),
  stroke(seg(2.75, 2.75, 15.25, 15.25)),
]);

/** Eye split by the off slash; the pupil sits on the slash, so it drops out. */
export const EyeOffIcon = /*#__PURE__*/ createIcon('EyeOff', () => [
  body('M8.118 4.936Q12.184 4.373 16.25 9Q15.221 10.171 14.192 11.01', { tint: true }),
  body('M9.882 13.064Q5.816 13.627 1.75 9Q2.779 7.829 3.808 6.99', { tint: true }),
  stroke(seg(2.75, 2.75, 15.25, 15.25)),
]);

export const LockOpenIcon = /*#__PURE__*/ createIcon('LockOpen', () => [
  stroke('M12.25 8V5.25a3.25 3.25 0 0 0 -6.5 0'),
  body(rect(3.25, 8, 11.5, 7.75, 2.25), { tint: true }),
  cut(seg(9, 11.25, 9, 12.5)),
]);

export const KeyIcon = /*#__PURE__*/ createIcon('Key', () => [
  body(circle(5.75, 12.25, 3.25), { tint: true }),
  hole(5.75, 12.25, 1),
  stroke(poly(8.05, 9.95, 15.25, 2.75)),
  stroke(seg(14.25, 3.75, 15.75, 5.25)),
  stroke(seg(12, 6, 13.5, 7.5)),
]);

export const PointerIcon = /*#__PURE__*/ createIcon('Pointer', () => [
  body(roundPolygon(1, 3.25, 3.25, 14.5, 7.5, 9.5, 9.5, 7.5, 14.5), { tint: true }),
]);

// ---- shapes -------------------------------------------------------------

export const SquareIcon = /*#__PURE__*/ createIcon('Square', () => [body(SQUARE, { tint: true })]);

export const TriangleIcon = /*#__PURE__*/ createIcon('Triangle', () => [
  body(roundPolygon(1.5, 9, 2.25, 16.25, 15, 1.75, 15), { tint: true }),
]);

/** Radio on: outline shows a centre dot; fill knocks a ring out so the dot stands inside the disc. */
export const CircleDotIcon = /*#__PURE__*/ createIcon('CircleDot', () => [
  body(circle(9, 9, 7), { tint: true }),
  dot(9, 9, 2.75, { only: LINED }),
  cut(circle(9, 9, 4), { only: SOLID }),
]);

export const BanIcon = /*#__PURE__*/ createIcon('Ban', () => {
  const [ax, ay] = polar(9, 9, 7, 315);
  const [bx, by] = polar(9, 9, 7, 135);
  return [body(circle(9, 9, 7), { tint: true }), cut(seg(ax, ay, bx, by))];
});

export const CircleDashedIcon = /*#__PURE__*/ createIcon('CircleDashed', () =>
  Array.from({ length: 8 }, (_, i) => stroke(arc(9, 9, 7, i * 45 + 9, i * 45 + 36))),
);

export const DashboardIcon = /*#__PURE__*/ createIcon('Dashboard', () => [
  body(rect(2.5, 2.5, 4.75, 7, 1.5), { tint: true }),
  body(rect(2.5, 12.5, 4.75, 3, 1.5)),
  body(rect(10.75, 2.5, 4.75, 3, 1.5)),
  body(rect(10.75, 8.5, 4.75, 7, 1.5), { tint: true }),
]);
