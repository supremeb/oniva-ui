import { createIcon } from '../createIcon';
import { body, cut, hole, poly, rect, seg, stroke, SOLID, LINED } from '../shapes';
import type { Part, PartOptions } from '../shapes';

// Layout: windows, panels, sidebars, grids and overlays.

const SQUARE = rect(2.5, 2.5, 13, 13, 2.5);
const WINDOW = rect(2, 3.75, 14, 10.5, 2.5);

/** Duo-only tinted pane that traces one side of the square, so the highlighted pane splits cleanly. */
const pane = (x: number, y: number, w: number, h: number, r: readonly [number, number, number, number]): Part =>
  body(rect(x, y, w, h, r), { tint: true, only: 'duo' });

/** A knocked-out solid shape (a path, not just a circle). */
const holePath = (d: string, o?: PartOptions): Part => ({ k: 'hole', d, ...o });

// ---- panels ---------------------------------------------------------------

export const PanelTopIcon = /*#__PURE__*/ createIcon('PanelTop', () => [
  body(SQUARE),
  pane(2.5, 2.5, 13, 4.25, [2.5, 2.5, 0, 0]),
  cut(seg(2.5, 6.75, 15.5, 6.75)),
]);

export const PanelBottomIcon = /*#__PURE__*/ createIcon('PanelBottom', () => [
  body(SQUARE),
  pane(2.5, 11.25, 13, 4.25, [0, 0, 2.5, 2.5]),
  cut(seg(2.5, 11.25, 15.5, 11.25)),
]);

export const PanelLeftCloseIcon = /*#__PURE__*/ createIcon('PanelLeftClose', () => [
  body(SQUARE),
  pane(2.5, 2.5, 4.5, 13, [2.5, 0, 0, 2.5]),
  cut(seg(7, 2.5, 7, 15.5)),
  cut(poly(12.25, 7, 10.25, 9, 12.25, 11)),
]);

export const PanelLeftOpenIcon = /*#__PURE__*/ createIcon('PanelLeftOpen', () => [
  body(SQUARE),
  pane(2.5, 2.5, 4.5, 13, [2.5, 0, 0, 2.5]),
  cut(seg(7, 2.5, 7, 15.5)),
  cut(poly(10.25, 7, 12.25, 9, 10.25, 11)),
]);

export const PanelRightCloseIcon = /*#__PURE__*/ createIcon('PanelRightClose', () => [
  body(SQUARE),
  pane(11, 2.5, 4.5, 13, [0, 2.5, 2.5, 0]),
  cut(seg(11, 2.5, 11, 15.5)),
  cut(poly(5.75, 7, 7.75, 9, 5.75, 11)),
]);

export const PanelRightOpenIcon = /*#__PURE__*/ createIcon('PanelRightOpen', () => [
  body(SQUARE),
  pane(11, 2.5, 4.5, 13, [0, 2.5, 2.5, 0]),
  cut(seg(11, 2.5, 11, 15.5)),
  cut(poly(7.75, 7, 5.75, 9, 7.75, 11)),
]);

// ---- windows --------------------------------------------------------------

/** Application window: title bar with two dots (solid in outline, knocked out of the solid in fill). */
export const AppWindowIcon = /*#__PURE__*/ createIcon('AppWindow', () => [
  body(WINDOW),
  pane(2, 3.75, 14, 4.5, [2.5, 2.5, 0, 0]),
  cut(seg(2, 8.25, 16, 8.25)),
  hole(5, 6, 0.9),
  hole(7.75, 6, 0.9),
]);

/** Browser window: three dots and a short address line in the title bar. */
export const BrowserWindowIcon = /*#__PURE__*/ createIcon('BrowserWindow', () => [
  body(WINDOW),
  pane(2, 3.75, 14, 4.5, [2.5, 2.5, 0, 0]),
  cut(seg(2, 8.25, 16, 8.25)),
  hole(4.5, 6, 0.85),
  hole(6.75, 6, 0.85),
  hole(9, 6, 0.85),
  cut(seg(11.5, 6, 13.5, 6)),
]);

// ---- splits ---------------------------------------------------------------

export const Columns2Icon = /*#__PURE__*/ createIcon('Columns2', () => [
  body(SQUARE, { tint: true }),
  cut(seg(9, 2.5, 9, 15.5)),
]);

export const Rows2Icon = /*#__PURE__*/ createIcon('Rows2', () => [
  body(SQUARE, { tint: true }),
  cut(seg(2.5, 9, 15.5, 9)),
]);

export const LayoutHeaderIcon = /*#__PURE__*/ createIcon('LayoutHeader', () => [
  body(SQUARE),
  pane(2.5, 2.5, 13, 4.25, [2.5, 2.5, 0, 0]),
  cut(seg(2.5, 6.75, 15.5, 6.75)),
  cut(seg(9, 6.75, 9, 15.5)),
]);

export const LayoutFooterIcon = /*#__PURE__*/ createIcon('LayoutFooter', () => [
  body(SQUARE),
  pane(2.5, 11.25, 13, 4.25, [0, 0, 2.5, 2.5]),
  cut(seg(2.5, 11.25, 15.5, 11.25)),
  cut(seg(9, 2.5, 9, 11.25)),
]);

/** Two list rows with no frame: a thumbnail tile and a line each. */
export const LayoutListIcon = /*#__PURE__*/ createIcon('LayoutList', () => [
  body(rect(2.5, 2.5, 5, 5, 1.5), { tint: true }),
  body(rect(2.5, 10.5, 5, 5, 1.5), { tint: true }),
  stroke(seg(10.5, 5, 15.5, 5)),
  stroke(seg(10.5, 13, 15.5, 13)),
]);

export const LayoutMasonryIcon = /*#__PURE__*/ createIcon('LayoutMasonry', () => [
  body(rect(2.5, 2.5, 5, 6.5, 1.5), { tint: true }),
  body(rect(2.5, 12, 5, 3.5, 1.5)),
  body(rect(10.5, 2.5, 5, 4, 1.5)),
  body(rect(10.5, 9.5, 5, 6, 1.5), { tint: true }),
]);

export const Grid3x3Icon = /*#__PURE__*/ createIcon('Grid3x3', () => [
  body(SQUARE, { tint: true }),
  cut(seg(6.75, 2.5, 6.75, 15.5)),
  cut(seg(11.25, 2.5, 11.25, 15.5)),
  cut(seg(2.5, 6.75, 15.5, 6.75)),
  cut(seg(2.5, 11.25, 15.5, 11.25)),
]);

// ---- overlays -------------------------------------------------------------

/** Inner player in the bottom-right corner; in fill it is a ringed island inside the solid window. */
export const PictureInPictureIcon = /*#__PURE__*/ createIcon('PictureInPicture', () => {
  const inner = rect(8.5, 7.5, 4.5, 3.75, 1);
  return [
    body(WINDOW),
    body(inner, { tint: true, only: LINED }),
    cut(inner, { only: SOLID }),
  ];
});

/** Three app tiles along the bottom edge. */
export const DockIcon = /*#__PURE__*/ createIcon('Dock', () => [
  body(WINDOW, { tint: true }),
  holePath(rect(4.25, 9.75, 2.5, 2.5, 0.75)),
  holePath(rect(7.75, 9.75, 2.5, 2.5, 0.75)),
  holePath(rect(11.25, 9.75, 2.5, 2.5, 0.75)),
]);

/** Window behind, centered dialog in front. In fill the dialog is a knocked-out card on the solid window. */
export const ModalIcon = /*#__PURE__*/ createIcon('Modal', () => {
  const dialog = rect(5.5, 6.75, 7, 4.5, 1.25);
  return [
    stroke(WINDOW, { soft: true, only: LINED }),
    body(WINDOW, { only: SOLID }),
    body(dialog, { tint: true, only: LINED }),
    holePath(dialog, { only: SOLID }),
  ];
});

export const DrawerIcon = /*#__PURE__*/ createIcon('Drawer', () => [
  body(SQUARE),
  pane(10, 2.5, 5.5, 13, [0, 2.5, 2.5, 0]),
  cut(seg(10, 2.5, 10, 15.5)),
  cut(seg(12.75, 7.75, 12.75, 10.25)),
]);

export const BottomSheetIcon = /*#__PURE__*/ createIcon('BottomSheet', () => [
  body(SQUARE),
  pane(2.5, 10, 13, 5.5, [0, 0, 2.5, 2.5]),
  cut(seg(2.5, 10, 15.5, 10)),
  cut(seg(7.5, 12.75, 10.5, 12.75)),
]);
