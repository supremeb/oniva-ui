import { createIcon } from '../createIcon';
import { body, circle, cut, dot, hole, poly, rect, roundPolygon, seg, stroke } from '../shapes';

// Layout: form controls and navigation patterns.

const SQUARE = rect(2.5, 2.5, 13, 13, 2.5);
const LANDSCAPE = rect(2, 3.75, 14, 10.5, 2.5);

// ---- toggles ------------------------------------------------------------

/** Pill track with the knob parked on the left; the knob is a hole, so fill knocks it out. */
export const ToggleOffIcon = /*#__PURE__*/ createIcon('ToggleOff', () => [
  body(rect(2, 4.5, 14, 9, 4.5)),
  hole(6.5, 9, 2),
]);

/** The same track switched on: knob on the right, track tinted. */
export const ToggleOnIcon = /*#__PURE__*/ createIcon('ToggleOn', () => [
  body(rect(2, 4.5, 14, 9, 4.5), { tint: true }),
  hole(11.5, 9, 2),
]);

// ---- square and circle marks --------------------------------------------

export const SquarePlusIcon = /*#__PURE__*/ createIcon('SquarePlus', () => [
  body(SQUARE, { tint: true }),
  cut(seg(9, 5.75, 9, 12.25)),
  cut(seg(5.75, 9, 12.25, 9)),
]);

export const SquareMinusIcon = /*#__PURE__*/ createIcon('SquareMinus', () => [
  body(SQUARE, { tint: true }),
  cut(seg(5.75, 9, 12.25, 9)),
]);

export const SquareXIcon = /*#__PURE__*/ createIcon('SquareX', () => [
  body(SQUARE, { tint: true }),
  cut(seg(6.75, 6.75, 11.25, 11.25)),
  cut(seg(11.25, 6.75, 6.75, 11.25)),
]);

export const CirclePlusIcon = /*#__PURE__*/ createIcon('CirclePlus', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(9, 5.75, 9, 12.25)),
  cut(seg(5.75, 9, 12.25, 9)),
]);

export const CircleMinusIcon = /*#__PURE__*/ createIcon('CircleMinus', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(5.75, 9, 12.25, 9)),
]);

export const CirclePauseIcon = /*#__PURE__*/ createIcon('CirclePause', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(7.25, 6.75, 7.25, 11.25)),
  cut(seg(10.75, 6.75, 10.75, 11.25)),
]);

export const CirclePlayIcon = /*#__PURE__*/ createIcon('CirclePlay', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(roundPolygon(0.75, 7.5, 6.5, 11.75, 9, 7.5, 11.5)),
]);

export const CircleStopIcon = /*#__PURE__*/ createIcon('CircleStop', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(rect(6.75, 6.75, 4.5, 4.5, 1)),
]);

// ---- form controls ------------------------------------------------------

/** One track broken around its knob; the part left of the knob is the filled portion. */
export const SliderIcon = /*#__PURE__*/ createIcon('Slider', () => [
  stroke(seg(2.25, 9, 8, 9)),
  stroke(seg(14.5, 9, 15.75, 9), { soft: true }),
  body(circle(11.25, 9, 2.25), { tint: true }),
]);

export const TextCursorIcon = /*#__PURE__*/ createIcon('TextCursor', () => [
  stroke('M6 3.5Q9 3.5 9 5.5V12.5Q9 14.5 6 14.5'),
  stroke('M12 3.5Q9 3.5 9 5.5'),
  stroke('M12 14.5Q9 14.5 9 12.5'),
]);

export const TextInputIcon = /*#__PURE__*/ createIcon('TextInput', () => [
  body(LANDSCAPE, { tint: true }),
  cut(seg(5, 9, 7.75, 9)),
  cut(seg(11, 6.5, 11, 11.5)),
]);

export const DropdownIcon = /*#__PURE__*/ createIcon('Dropdown', () => [
  body(LANDSCAPE, { tint: true }),
  cut(seg(5, 9, 7.75, 9)),
  cut(poly(10.25, 7.75, 11.75, 9.25, 13.25, 7.75)),
]);

export const StepperIcon = /*#__PURE__*/ createIcon('Stepper', () => [
  body(rect(2, 4.75, 14, 8.5, 2.5), { tint: true }),
  cut(seg(4.75, 9, 7.25, 9)),
  cut(seg(10.75, 9, 13.25, 9)),
  cut(seg(12, 7.75, 12, 10.25)),
]);

export const TabsIcon = /*#__PURE__*/ createIcon('Tabs', () => [
  body(
    'M2.5 13.5V4.5A2 2 0 0 1 4.5 2.5H7.5A2 2 0 0 1 9.5 4.5V6H13.5A2 2 0 0 1 15.5 8V13.5A2 2 0 0 1 13.5 15.5H4.5A2 2 0 0 1 2.5 13.5Z',
    { tint: true },
  ),
  stroke('M11.25 6V4.5A2 2 0 0 1 13.25 2.5H13.5A2 2 0 0 1 15.5 4.5V6'),
]);

export const AccordionIcon = /*#__PURE__*/ createIcon('Accordion', () => [
  body(rect(2.5, 2.5, 13, 6, 2), { tint: true }),
  cut(seg(5, 5.5, 8.5, 5.5)),
  cut(poly(11.5, 6.25, 13, 4.75, 14.5, 6.25)),
  stroke(seg(3, 11.5, 8.5, 11.5)),
  stroke(poly(11.5, 10.75, 13, 12.25, 14.5, 10.75)),
  stroke(seg(3, 15.25, 8.5, 15.25)),
  stroke(poly(11.5, 14.5, 13, 16, 14.5, 14.5)),
]);

/** Previous and next chevrons around three dots; the middle one is the current page. */
export const PaginationIcon = /*#__PURE__*/ createIcon('Pagination', () => [
  dot(4, 9, 1.25, { soft: true }),
  dot(9, 9, 1.75),
  dot(14, 9, 1.25, { soft: true }),
]);

export const BreadcrumbIcon = /*#__PURE__*/ createIcon('Breadcrumb', () => [
  stroke(seg(2.25, 9, 3.5, 9)),
  stroke(poly(5.5, 7.5, 6.75, 9, 5.5, 10.5)),
  stroke(seg(8.5, 9, 9.5, 9)),
  stroke(poly(11.25, 7.5, 12.5, 9, 11.25, 10.5)),
  stroke(seg(14.5, 9, 15.75, 9)),
]);

export const TooltipIcon = /*#__PURE__*/ createIcon('Tooltip', () => [
  body(
    'M5 2.75H13Q15.5 2.75 15.5 5.25V9Q15.5 11.5 13 11.5H10.75L9 13.5L7.25 11.5H5Q2.5 11.5 2.5 9V5.25Q2.5 2.75 5 2.75Z',
    { tint: true },
  ),
  cut(seg(5.5, 7.25, 12.5, 7.25)),
]);
