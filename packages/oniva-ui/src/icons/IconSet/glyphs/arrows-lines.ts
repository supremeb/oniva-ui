import { createIcon } from '../createIcon';
import { body, head, poly, roundPoly, roundPolygon, seg, stroke } from '../shapes';

// Arrows: straight, diagonal, to/from a line, bold and sorting arrows.

export const ArrowUpLeftIcon = /*#__PURE__*/ createIcon('ArrowUpLeft', () => [
  stroke(seg(13.25, 13.25, 5, 5)),
  stroke(poly(11.5, 5, 5, 5, 5, 11.5)),
]);

export const ArrowDownLeftIcon = /*#__PURE__*/ createIcon('ArrowDownLeft', () => [
  stroke(seg(13.25, 4.75, 5, 13)),
  stroke(poly(5, 6.5, 5, 13, 11.5, 13)),
]);

export const ArrowLeftToLineIcon = /*#__PURE__*/ createIcon('ArrowLeftToLine', () => [
  stroke(seg(15.25, 9, 6.5, 9)),
  stroke(head(6.5, 9, 270, 4.5)),
  stroke(seg(2.75, 3.75, 2.75, 14.25)),
]);

export const ArrowRightToLineIcon = /*#__PURE__*/ createIcon('ArrowRightToLine', () => [
  stroke(seg(2.75, 9, 11.5, 9)),
  stroke(head(11.5, 9, 90, 4.5)),
  stroke(seg(15.25, 3.75, 15.25, 14.25)),
]);

export const ArrowUpFromLineIcon = /*#__PURE__*/ createIcon('ArrowUpFromLine', () => [
  stroke(seg(9, 11.5, 9, 2.75)),
  stroke(head(9, 2.75, 0, 4.5)),
  stroke(seg(3.75, 15.25, 14.25, 15.25)),
]);

export const ArrowDownFromLineIcon = /*#__PURE__*/ createIcon('ArrowDownFromLine', () => [
  stroke(seg(9, 6.5, 9, 15.25)),
  stroke(head(9, 15.25, 180, 4.5)),
  stroke(seg(3.75, 2.75, 14.25, 2.75)),
]);

export const ArrowLeftFromLineIcon = /*#__PURE__*/ createIcon('ArrowLeftFromLine', () => [
  stroke(seg(11.5, 9, 2.75, 9)),
  stroke(head(2.75, 9, 270, 4.5)),
  stroke(seg(15.25, 3.75, 15.25, 14.25)),
]);

export const ArrowRightFromLineIcon = /*#__PURE__*/ createIcon('ArrowRightFromLine', () => [
  stroke(seg(6.5, 9, 15.25, 9)),
  stroke(head(15.25, 9, 90, 4.5)),
  stroke(seg(2.75, 3.75, 2.75, 14.25)),
]);

/** Block arrow pointing up, turned by quarter turns (0 up, 1 right, 2 down, 3 left) about the canvas center. */
function bigArrow(quarter: 0 | 1 | 2 | 3): string {
  const up = [9, 2.5, 15, 8.5, 11.5, 8.5, 11.5, 15.5, 6.5, 15.5, 6.5, 8.5, 3, 8.5];
  const c: number[] = [];
  for (let i = 0; i < up.length; i += 2) {
    const x = up[i]!;
    const y = up[i + 1]!;
    if (quarter === 0) c.push(x, y);
    else if (quarter === 1) c.push(18 - y, x);
    else if (quarter === 2) c.push(18 - x, 18 - y);
    else c.push(y, 18 - x);
  }
  return roundPolygon(1, ...c);
}

export const ArrowBigUpIcon = /*#__PURE__*/ createIcon('ArrowBigUp', () => [body(bigArrow(0), { tint: true })]);
export const ArrowBigRightIcon = /*#__PURE__*/ createIcon('ArrowBigRight', () => [body(bigArrow(1), { tint: true })]);
export const ArrowBigDownIcon = /*#__PURE__*/ createIcon('ArrowBigDown', () => [body(bigArrow(2), { tint: true })]);
export const ArrowBigLeftIcon = /*#__PURE__*/ createIcon('ArrowBigLeft', () => [body(bigArrow(3), { tint: true })]);

export const SortAscendingIcon = /*#__PURE__*/ createIcon('SortAscending', () => [
  stroke(seg(4.5, 15, 4.5, 3)),
  stroke(head(4.5, 3, 0, 3.5)),
  stroke(seg(10, 4.5, 12, 4.5)),
  stroke(seg(10, 9, 14, 9)),
  stroke(seg(10, 13.5, 16, 13.5)),
]);

export const SortDescendingIcon = /*#__PURE__*/ createIcon('SortDescending', () => [
  stroke(seg(4.5, 3, 4.5, 15)),
  stroke(head(4.5, 15, 180, 3.5)),
  stroke(seg(10, 4.5, 16, 4.5)),
  stroke(seg(10, 9, 14, 9)),
  stroke(seg(10, 13.5, 12, 13.5)),
]);

export const TrendingDownIcon = /*#__PURE__*/ createIcon('TrendingDown', () => [
  stroke(roundPoly(1, 2.75, 6, 7.25, 10.5, 10.25, 7.5, 15.25, 12.5)),
  stroke(poly(15.25, 8, 15.25, 12.5, 10.75, 12.5)),
]);

export const ArrowsMoveIcon = /*#__PURE__*/ createIcon('ArrowsMove', () => [
  stroke(seg(9, 2.5, 9, 15.5)),
  stroke(seg(2.5, 9, 15.5, 9)),
  stroke(head(9, 2.5, 0, 3)),
  stroke(head(9, 15.5, 180, 3)),
  stroke(head(2.5, 9, 270, 3)),
  stroke(head(15.5, 9, 90, 3)),
]);

export const ArrowsCrossIcon = /*#__PURE__*/ createIcon('ArrowsCross', () => [
  stroke(seg(3.25, 14.75, 14.75, 3.25)),
  stroke(poly(10.75, 3.25, 14.75, 3.25, 14.75, 7.25)),
  stroke(seg(3.25, 3.25, 6.75, 6.75)),
  stroke(seg(11.25, 11.25, 14.75, 14.75)),
  stroke(poly(14.75, 10.75, 14.75, 14.75, 10.75, 14.75)),
]);

export const ArrowsOutHorizontalIcon = /*#__PURE__*/ createIcon('ArrowsOutHorizontal', () => [
  stroke(seg(9, 2.75, 9, 15.25)),
  stroke(seg(5.75, 9, 2.25, 9)),
  stroke(head(2.25, 9, 270, 3.5)),
  stroke(seg(12.25, 9, 15.75, 9)),
  stroke(head(15.75, 9, 90, 3.5)),
]);

export const ArrowsOutVerticalIcon = /*#__PURE__*/ createIcon('ArrowsOutVertical', () => [
  stroke(seg(2.75, 9, 15.25, 9)),
  stroke(seg(9, 5.75, 9, 2.25)),
  stroke(head(9, 2.25, 0, 3.5)),
  stroke(seg(9, 12.25, 9, 15.75)),
  stroke(head(9, 15.75, 180, 3.5)),
]);

export const ArrowsInHorizontalIcon = /*#__PURE__*/ createIcon('ArrowsInHorizontal', () => [
  stroke(seg(9, 2.75, 9, 15.25)),
  stroke(seg(2.25, 9, 5.75, 9)),
  stroke(head(5.75, 9, 90, 3.5)),
  stroke(seg(15.75, 9, 12.25, 9)),
  stroke(head(12.25, 9, 270, 3.5)),
]);

export const ArrowsInVerticalIcon = /*#__PURE__*/ createIcon('ArrowsInVertical', () => [
  stroke(seg(2.75, 9, 15.25, 9)),
  stroke(seg(9, 2.25, 9, 5.75)),
  stroke(head(9, 5.75, 180, 3.5)),
  stroke(seg(9, 15.75, 9, 12.25)),
  stroke(head(9, 12.25, 0, 3.5)),
]);
