import { createIcon } from '../createIcon';
import { body, circle, dot, hole, LINED, mark, poly, rect, roundPoly, roundPolygon, seg, SOLID, stroke } from '../shapes';

// Layout: lists, trees, filters, loaders and app tiles.

/** Plus modifier in the bottom-right zone (same as the people set). */
const plusMod = () => [stroke(seg(13.75, 11.5, 13.75, 16)), stroke(seg(11.5, 13.75, 16, 13.75))];

export const ListOrderedIcon = /*#__PURE__*/ createIcon('ListOrdered', () => [
  stroke(seg(8.5, 5, 15.5, 5)),
  stroke(seg(8.5, 12.75, 15.5, 12.75)),
  // 1
  stroke(poly(2.75, 4.75, 4.25, 3.25, 4.25, 6.75)),
  // 2
  stroke('M2.75 11.5Q2.75 10.25 4.1 10.25Q5.5 10.25 5.5 11.5Q5.5 12.5 2.75 15H5.75'),
]);

export const ListTreeIcon = /*#__PURE__*/ createIcon('ListTree', () => [
  dot(3.75, 4.5, 1.25),
  stroke(seg(6.75, 4.5, 15.5, 4.5)),
  stroke(roundPoly(1.25, 3.75, 7.25, 3.75, 13.5, 6.5, 13.5)),
  stroke(seg(3.75, 9.25, 6.5, 9.25)),
  stroke(seg(9.25, 9.25, 15.5, 9.25)),
  stroke(seg(9.25, 13.5, 15.5, 13.5)),
]);

export const ListCollapseIcon = /*#__PURE__*/ createIcon('ListCollapse', () => [
  stroke(seg(9.5, 3.75, 15.5, 3.75)),
  stroke(seg(9.5, 9, 15.5, 9)),
  stroke(seg(9.5, 14.25, 15.5, 14.25)),
  stroke(poly(2.5, 3.5, 4.75, 5.75, 7, 3.5)),
  stroke(poly(2.5, 14.5, 4.75, 12.25, 7, 14.5)),
]);

export const ListPlusIcon = /*#__PURE__*/ createIcon('ListPlus', () => [
  stroke(seg(2.5, 3.75, 15.5, 3.75)),
  stroke(seg(2.5, 8, 15.5, 8)),
  stroke(seg(2.5, 12.25, 8.75, 12.25)),
  ...plusMod(),
]);

export const ListXIcon = /*#__PURE__*/ createIcon('ListX', () => [
  stroke(seg(2.5, 3.75, 15.5, 3.75)),
  stroke(seg(2.5, 8, 15.5, 8)),
  stroke(seg(2.5, 12.25, 8.75, 12.25)),
  stroke(seg(12.25, 12.25, 15.75, 15.75)),
  stroke(seg(15.75, 12.25, 12.25, 15.75)),
]);

export const SitemapIcon = /*#__PURE__*/ createIcon('Sitemap', () => [
  body(rect(6, 2.5, 6, 4, 1.5), { tint: true }),
  body(rect(2.25, 11.5, 5.5, 4, 1.5)),
  body(rect(10.25, 11.5, 5.5, 4, 1.5)),
  stroke(seg(9, 6.5, 9, 9)),
  stroke(roundPoly(1, 5, 11.5, 5, 9, 13, 9, 13, 11.5)),
]);

/** Filter funnel with its stem's right wall notched around the bottom-right modifier. */
const funnelNotched = () =>
  roundPolygon(1, 2.5, 3, 15.5, 3, 10.5, 9, 10.5, 10.5, 9.75, 11.25, 9.75, 14.44, 7.5, 15.75, 7.5, 9);

export const FilterXIcon = /*#__PURE__*/ createIcon('FilterX', () => [
  body(funnelNotched(), { tint: true }),
  stroke(seg(12.75, 12.75, 16, 16)),
  stroke(seg(16, 12.75, 12.75, 16)),
]);

export const FilterPlusIcon = /*#__PURE__*/ createIcon('FilterPlus', () => [
  body(funnelNotched(), { tint: true }),
  stroke(seg(14.375, 12.75, 14.375, 16)),
  stroke(seg(12.75, 14.375, 16, 14.375)),
]);

/** Sliders turned upright: knobs at the top, bottom and middle. */
export const SlidersVerticalIcon = /*#__PURE__*/ createIcon('SlidersVertical', () => [
  stroke(seg(4, 8, 4, 15.75)),
  stroke(seg(9, 2.25, 9, 10)),
  stroke(seg(14, 2.25, 14, 5.25)),
  stroke(seg(14, 12.75, 14, 15.75)),
  body(circle(4, 4.25, 1.75), { tint: true }),
  body(circle(9, 13.75, 1.75), { tint: true }),
  body(circle(14, 9, 1.75), { tint: true }),
]);

export const LoaderDotsIcon = /*#__PURE__*/ createIcon('LoaderDots', () => [
  dot(3.75, 9, 1.25, { soft: true }),
  dot(9, 9, 1.25, { soft: true }),
  dot(14.25, 9, 1.25),
]);

export const LoaderRaysIcon = /*#__PURE__*/ createIcon('LoaderRays', () =>
  Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const [s, c] = [Math.sin(a), Math.cos(a)];
    return stroke(seg(9 + 4.25 * s, 9 - 4.25 * c, 9 + 7 * s, 9 - 7 * c), { soft: i >= 3 });
  }),
);

export const HourglassIcon = /*#__PURE__*/ createIcon('Hourglass', () => [
  stroke(seg(3.5, 2.75, 14.5, 2.75)),
  stroke(seg(3.5, 15.25, 14.5, 15.25)),
  body(roundPolygon(1, 5, 2.75, 13, 2.75, 10.25, 9, 13, 15.25, 5, 15.25, 7.75, 9), { tint: true }),
  mark(roundPolygon(0.5, 7.4, 13.25, 10.6, 13.25, 9, 11.5), { only: LINED }),
  hole(9, 12.75, 1, { only: SOLID }),
]);

export const SkeletonIcon = /*#__PURE__*/ createIcon('Skeleton', () => [
  body(circle(5.25, 5.25, 2.5), { tint: true }),
  stroke(seg(9.75, 4.25, 15.5, 4.25), { soft: true }),
  stroke(seg(9.75, 7.25, 13.5, 7.25), { soft: true }),
  body(rect(2.5, 10.5, 13, 5, 2), { tint: true }),
]);

export const NotificationDotIcon = /*#__PURE__*/ createIcon('NotificationDot', () => [
  body('M9.76 2.5H5A2.5 2.5 0 0 0 2.5 5V13A2.5 2.5 0 0 0 5 15.5H13A2.5 2.5 0 0 0 15.5 13V8.24', {
    tint: true,
    only: LINED,
  }),
  body('M10.56 2.5H5A2.5 2.5 0 0 0 2.5 5V13A2.5 2.5 0 0 0 5 15.5H13A2.5 2.5 0 0 0 15.5 13V7.44A3.75 3.75 0 0 1 10.56 2.5Z', {
    only: SOLID,
  }),
  dot(14, 4, 2.25),
]);

/** Tag drawn upright (house shape) and leaned 45 degrees so the point faces up-left. */
const tag = (x: number, y: number): [number, number] => {
  const c = Math.SQRT1_2;
  return [7.6 + (x + y) * c, 7.6 + (y - x) * c];
};

export const TagIcon = /*#__PURE__*/ createIcon('Tag', () => {
  const [hx, hy] = tag(0, -2.5);
  return [
    body(
      roundPolygon(
        1.25,
        ...tag(0, -6.5),
        ...tag(4.25, -2.5),
        ...tag(4.25, 6.5),
        ...tag(-4.25, 6.5),
        ...tag(-4.25, -2.5),
      ),
      { tint: true },
    ),
    hole(hx, hy, 1),
  ];
});

export const AppsIcon = /*#__PURE__*/ createIcon('Apps', () =>
  [3.75, 9, 14.25].flatMap((y) => [3.75, 9, 14.25].map((x) => dot(x, y, 1.1))),
);

export const WidgetsIcon = /*#__PURE__*/ createIcon('Widgets', () => [
  body(rect(2.5, 2.5, 5, 5, 1.5), { tint: true }),
  body(rect(2.5, 10.5, 5, 5, 1.5)),
  body(rect(10.5, 10.5, 5, 5, 1.5)),
  body(roundPolygon(0.75, 13, 2, 16, 5, 13, 8, 10, 5), { tint: true }),
]);
