import { createIcon } from '../createIcon';
import { body, circle, cut, head, poly, rect, roundPolygon, seg, stroke } from '../shapes';

// Arrows: double chevrons, carets, and arrows inside circles and squares.

// ---- double chevrons (6.5 wide, 3.25 tall) -----------------------------------

export const ChevronsDownIcon = /*#__PURE__*/ createIcon('ChevronsDown', () => [
  stroke(poly(5.75, 5, 9, 8.25, 12.25, 5)),
  stroke(poly(5.75, 9.5, 9, 12.75, 12.25, 9.5)),
]);

export const ChevronsUpIcon = /*#__PURE__*/ createIcon('ChevronsUp', () => [
  stroke(poly(5.75, 8.5, 9, 5.25, 12.25, 8.5)),
  stroke(poly(5.75, 13, 9, 9.75, 12.25, 13)),
]);

export const ChevronsLeftIcon = /*#__PURE__*/ createIcon('ChevronsLeft', () => [
  stroke(poly(8.5, 5.75, 5.25, 9, 8.5, 12.25)),
  stroke(poly(13, 5.75, 9.75, 9, 13, 12.25)),
]);

export const ChevronsRightIcon = /*#__PURE__*/ createIcon('ChevronsRight', () => [
  stroke(poly(5, 5.75, 8.25, 9, 5, 12.25)),
  stroke(poly(9.5, 5.75, 12.75, 9, 9.5, 12.25)),
]);

export const ChevronsLeftRightIcon = /*#__PURE__*/ createIcon('ChevronsLeftRight', () => [
  stroke(poly(6, 5.75, 2.75, 9, 6, 12.25)),
  stroke(poly(12, 5.75, 15.25, 9, 12, 12.25)),
]);

export const ChevronsDownUpIcon = /*#__PURE__*/ createIcon('ChevronsDownUp', () => [
  stroke(poly(5.75, 3.25, 9, 6.5, 12.25, 3.25)),
  stroke(poly(5.75, 14.75, 9, 11.5, 12.25, 14.75)),
]);

// ---- first / last -----------------------------------------------------------

export const ChevronFirstIcon = /*#__PURE__*/ createIcon('ChevronFirst', () => [
  stroke(seg(4.25, 4.5, 4.25, 13.5)),
  stroke(poly(13.5, 4.5, 9, 9, 13.5, 13.5)),
]);

export const ChevronLastIcon = /*#__PURE__*/ createIcon('ChevronLast', () => [
  stroke(seg(13.75, 4.5, 13.75, 13.5)),
  stroke(poly(4.5, 4.5, 9, 9, 4.5, 13.5)),
]);

// ---- carets (small rounded triangles) ---------------------------------------

export const CaretDownIcon = /*#__PURE__*/ createIcon('CaretDown', () => [
  body(roundPolygon(1, 5.25, 7.25, 12.75, 7.25, 9, 11.5), { tint: true }),
]);

export const CaretUpIcon = /*#__PURE__*/ createIcon('CaretUp', () => [
  body(roundPolygon(1, 5.25, 10.75, 12.75, 10.75, 9, 6.5), { tint: true }),
]);

export const CaretLeftIcon = /*#__PURE__*/ createIcon('CaretLeft', () => [
  body(roundPolygon(1, 11, 5.25, 11, 12.75, 6.75, 9), { tint: true }),
]);

export const CaretRightIcon = /*#__PURE__*/ createIcon('CaretRight', () => [
  body(roundPolygon(1, 7, 5.25, 7, 12.75, 11.25, 9), { tint: true }),
]);

export const CaretUpDownIcon = /*#__PURE__*/ createIcon('CaretUpDown', () => [
  body(roundPolygon(0.75, 6, 7.25, 12, 7.25, 9, 3.75), { tint: true }),
  body(roundPolygon(0.75, 6, 10.75, 12, 10.75, 9, 14.25), { tint: true }),
]);

// ---- circle containers ------------------------------------------------------

export const CircleChevronDownIcon = /*#__PURE__*/ createIcon('CircleChevronDown', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(poly(6.25, 7.5, 9, 10.25, 11.75, 7.5)),
]);

export const CircleChevronUpIcon = /*#__PURE__*/ createIcon('CircleChevronUp', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(poly(6.25, 10.5, 9, 7.75, 11.75, 10.5)),
]);

export const CircleChevronLeftIcon = /*#__PURE__*/ createIcon('CircleChevronLeft', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(poly(10.25, 6.25, 7.5, 9, 10.25, 11.75)),
]);

export const CircleChevronRightIcon = /*#__PURE__*/ createIcon('CircleChevronRight', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(poly(7.75, 6.25, 10.5, 9, 7.75, 11.75)),
]);

export const CircleArrowUpIcon = /*#__PURE__*/ createIcon('CircleArrowUp', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(9, 12.25, 9, 5.75)),
  cut(head(9, 5.75, 0, 3.5)),
]);

export const CircleArrowDownIcon = /*#__PURE__*/ createIcon('CircleArrowDown', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(9, 5.75, 9, 12.25)),
  cut(head(9, 12.25, 180, 3.5)),
]);

export const CircleArrowLeftIcon = /*#__PURE__*/ createIcon('CircleArrowLeft', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(12.25, 9, 5.75, 9)),
  cut(head(5.75, 9, 270, 3.5)),
]);

export const CircleArrowRightIcon = /*#__PURE__*/ createIcon('CircleArrowRight', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(5.75, 9, 12.25, 9)),
  cut(head(12.25, 9, 90, 3.5)),
]);

// ---- square containers ------------------------------------------------------

export const SquareArrowUpRightIcon = /*#__PURE__*/ createIcon('SquareArrowUpRight', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  cut(seg(6.75, 11.25, 11.25, 6.75)),
  cut(poly(7.75, 6.75, 11.25, 6.75, 11.25, 10.25)),
]);

export const SquareChevronDownIcon = /*#__PURE__*/ createIcon('SquareChevronDown', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  cut(poly(6.25, 7.5, 9, 10.25, 11.75, 7.5)),
]);

export const SquareChevronRightIcon = /*#__PURE__*/ createIcon('SquareChevronRight', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  cut(poly(7.75, 6.25, 10.5, 9, 7.75, 11.75)),
]);
