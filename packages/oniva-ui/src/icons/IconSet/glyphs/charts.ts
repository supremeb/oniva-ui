import { createIcon } from '../createIcon';
import { arc, body, circle, cut, dot, hole, LINED, mark, polar, poly, rect, roundPoly, roundPolygon, sector, seg, SOLID, stroke } from '../shapes';

// Charts and data visualization.

const r3 = (v: number) => {
  const r = Math.round(v * 1000) / 1000;
  return String(Object.is(r, -0) ? 0 : r);
};

/** L-shaped axes shared by the plotted charts. */
const AXES = roundPoly(2, 2.75, 2.75, 2.75, 15.25, 15.25, 15.25);

/** Closed ring segment between radii `r1` (inner) and `r2` (outer) from `from` to `to` degrees (clockwise). */
function ringSeg(cx: number, cy: number, r1: number, r2: number, from: number, to: number): string {
  const [ax, ay] = polar(cx, cy, r2, from);
  const [bx, by] = polar(cx, cy, r2, to);
  const [cx2, cy2] = polar(cx, cy, r1, to);
  const [dx, dy] = polar(cx, cy, r1, from);
  const large = to - from > 180 ? 1 : 0;
  return (
    `M${r3(ax)} ${r3(ay)}A${r2} ${r2} 0 ${large} 1 ${r3(bx)} ${r3(by)}` +
    `L${r3(cx2)} ${r3(cy2)}A${r1} ${r1} 0 ${large} 0 ${r3(dx)} ${r3(dy)}Z`
  );
}

/** Radial divider across a ring, from the inner to the outer radius. */
function spoke(cx: number, cy: number, r1: number, r2: number, deg: number): string {
  const [x1, y1] = polar(cx, cy, r1, deg);
  const [x2, y2] = polar(cx, cy, r2, deg);
  return seg(x1, y1, x2, y2);
}

/** A thin column drawn as a line when outlined and as a 3 wide bar when solid. */
function column(x: number, top: number, bottom: number) {
  return [
    stroke(seg(x, bottom, x, top), { only: LINED }),
    mark(rect(x - 1.5, top - 0.75, 3, bottom - top + 1.5, 1), { only: SOLID }),
  ];
}

export const PieChartIcon = /*#__PURE__*/ createIcon('PieChart', () => [
  body(sector(7.75, 10.25, 5.75, 90, 360)),
  body(sector(10.5, 7.5, 5, 0, 90), { tint: true }),
]);

export const DonutChartIcon = /*#__PURE__*/ createIcon('DonutChart', () => [
  body(ringSeg(9, 9, 3.25, 7, 110, 360)),
  body(ringSeg(9, 9, 3.25, 7, 0, 110), { tint: true }),
  cut(spoke(9, 9, 3.25, 7, 0)),
  cut(spoke(9, 9, 3.25, 7, 110)),
]);

export const AreaChartIcon = /*#__PURE__*/ createIcon('AreaChart', () => [
  body(roundPolygon(1, 2.5, 15.5, 2.5, 10.5, 6, 6.5, 9.25, 10, 12.75, 4.5, 15.5, 7.5, 15.5, 15.5), { tint: true }),
]);

export const ScatterChartIcon = /*#__PURE__*/ createIcon('ScatterChart', () => [
  stroke(AXES),
  dot(6.75, 11, 1.25, { soft: true }),
  dot(9.25, 6.75, 1.25),
  dot(11.5, 11.5, 1.25, { soft: true }),
  dot(13.5, 6, 1.25),
]);

export const ColumnChartIcon = /*#__PURE__*/ createIcon('ColumnChart', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  cut(seg(6, 12, 6, 9.5)),
  cut(seg(9, 12, 9, 6.25)),
  cut(seg(12, 12, 12, 8)),
]);

export const BarChartHorizontalIcon = /*#__PURE__*/ createIcon('BarChartHorizontal', () => [
  stroke(seg(2.75, 2.75, 2.75, 15.25)),
  stroke(seg(6, 4.75, 12, 4.75)),
  stroke(seg(6, 9, 15.25, 9)),
  stroke(seg(6, 13.25, 9.5, 13.25)),
]);

export const StackedBarIcon = /*#__PURE__*/ createIcon('StackedBar', () => [
  body(rect(2.5, 7.5, 4.5, 8, 1.5)),
  body(rect(11, 2.5, 4.5, 13, 1.5), { tint: true }),
  cut(seg(2.5, 11.5, 7, 11.5)),
  cut(seg(11, 7, 15.5, 7)),
  cut(seg(11, 11.5, 15.5, 11.5)),
]);

export const HistogramIcon = /*#__PURE__*/ createIcon('Histogram', () => [
  body(roundPolygon(1, 2.5, 15.5, 2.5, 9.25, 6.75, 9.25, 6.75, 4.5, 11, 4.5, 11, 7.5, 15.25, 7.5, 15.25, 15.5), { tint: true }),
  cut(seg(6.75, 9.25, 6.75, 15.5)),
  cut(seg(11, 7.5, 11, 15.5)),
]);

export const CandlestickIcon = /*#__PURE__*/ createIcon('Candlestick', () => [
  stroke(seg(5.5, 2.5, 5.5, 6.25)),
  stroke(seg(5.5, 12.25, 5.5, 15.5)),
  body(rect(3.5, 6.25, 4, 6, 1)),
  stroke(seg(12.5, 2.5, 12.5, 4.75)),
  stroke(seg(12.5, 12.5, 12.5, 15.5)),
  body(rect(10.5, 4.75, 4, 7.75, 1), { tint: true }),
]);

export const FunnelChartIcon = /*#__PURE__*/ createIcon('FunnelChart', () => [
  body(roundPolygon(1.25, 2.5, 3, 15.5, 3, 12.25, 15, 5.75, 15), { tint: true }),
  cut(seg(3.83, 7, 14.17, 7)),
  cut(seg(5.17, 11, 12.83, 11)),
]);

export const RadarChartIcon = /*#__PURE__*/ createIcon('RadarChart', () => {
  const cx = 9;
  const cy = 9.25;
  const outer: number[] = [];
  const inner: number[] = [];
  [4, 3.25, 4, 2.5, 3.5].forEach((r, i) => {
    const [ox, oy] = polar(cx, cy, 7, i * 72);
    const [ix, iy] = polar(cx, cy, r, i * 72);
    outer.push(ox, oy);
    inner.push(ix, iy);
  });
  return [body(roundPolygon(1, ...outer), { tint: true }), cut(roundPolygon(0.75, ...inner))];
});

export const ChartUpIcon = /*#__PURE__*/ createIcon('ChartUp', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  cut(poly(5.5, 11.75, 8, 9, 10.25, 11, 12.5, 6.25)),
]);

export const ChartDownIcon = /*#__PURE__*/ createIcon('ChartDown', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  cut(poly(5.5, 6.25, 8, 9, 10.25, 7, 12.5, 11.75)),
]);

export const ChartSplineIcon = /*#__PURE__*/ createIcon('ChartSpline', () => [
  stroke(AXES),
  stroke('M6 11.75C8 11.75 8 6 10 6S12.25 11.75 15 8.25'),
]);

export const HeatmapIcon = /*#__PURE__*/ createIcon('Heatmap', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  cut(seg(6.83, 2.5, 6.83, 15.5)),
  cut(seg(11.17, 2.5, 11.17, 15.5)),
  cut(seg(2.5, 6.83, 15.5, 6.83)),
  cut(seg(2.5, 11.17, 15.5, 11.17)),
]);

export const TreemapIcon = /*#__PURE__*/ createIcon('Treemap', () => [
  body(rect(2.5, 2.5, 13, 13, 2.5), { tint: true }),
  cut(seg(9.5, 2.5, 9.5, 15.5)),
  cut(seg(9.5, 8.75, 15.5, 8.75)),
  cut(seg(2.5, 10.5, 9.5, 10.5)),
]);

export const WaterfallIcon = /*#__PURE__*/ createIcon('Waterfall', () => [
  ...column(4.5, 10.5, 15),
  ...column(9, 4, 10.5),
  ...column(13.5, 4, 15),
]);

export const GanttChartIcon = /*#__PURE__*/ createIcon('GanttChart', () => [
  stroke(seg(2.75, 4, 9.25, 4)),
  stroke(seg(6.25, 9, 13.25, 9)),
  stroke(seg(10.25, 14, 15.25, 14)),
]);

export const BoxPlotIcon = /*#__PURE__*/ createIcon('BoxPlot', () => [
  stroke(seg(9, 2.5, 9, 5.5)),
  stroke(seg(6.5, 2.5, 11.5, 2.5)),
  stroke(seg(9, 12.5, 9, 15.5)),
  stroke(seg(6.5, 15.5, 11.5, 15.5)),
  body(rect(3.5, 5.5, 11, 7, 1.5), { tint: true }),
  cut(seg(3.5, 9, 14.5, 9)),
]);

export const SparklineIcon = /*#__PURE__*/ createIcon('Sparkline', () => [
  stroke(seg(2.5, 15.25, 15.5, 15.25), { soft: true }),
  stroke(poly(2.5, 10.5, 5.5, 7, 8, 9.5, 11, 4.75)),
  dot(14.25, 7, 1.25),
]);

export const ProgressRingIcon = /*#__PURE__*/ createIcon('ProgressRing', () => [
  stroke(arc(9, 9, 7, 0, 250)),
  stroke(arc(9, 9, 7, 285, 345), { soft: true }),
]);

export const TargetIcon = /*#__PURE__*/ createIcon('Target', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(circle(9, 9, 3.75)),
  hole(9, 9, 1.25),
]);

export const PodiumIcon = /*#__PURE__*/ createIcon('Podium', () => [
  body(roundPolygon(1, 2.5, 15.5, 2.5, 9.5, 6.75, 9.5, 6.75, 5.5, 11.25, 5.5, 11.25, 12, 15.5, 12, 15.5, 15.5), { tint: true }),
  cut(seg(6.75, 9.5, 6.75, 15.5)),
  cut(seg(11.25, 12, 11.25, 15.5)),
]);

export const ChartColumnIncreasingIcon = /*#__PURE__*/ createIcon('ChartColumnIncreasing', () => [
  stroke(AXES),
  stroke(seg(7, 12.25, 7, 9.5)),
  stroke(seg(10.5, 12.25, 10.5, 7)),
  stroke(seg(14, 12.25, 14, 4)),
]);

export const ChartColumnDecreasingIcon = /*#__PURE__*/ createIcon('ChartColumnDecreasing', () => [
  stroke(AXES),
  stroke(seg(7, 12.25, 7, 4)),
  stroke(seg(10.5, 12.25, 10.5, 7)),
  stroke(seg(14, 12.25, 14, 9.5)),
]);

export const ChartMixedIcon = /*#__PURE__*/ createIcon('ChartMixed', () => [
  stroke(AXES),
  stroke(seg(6.5, 12.5, 6.5, 10.75)),
  stroke(seg(10, 12.5, 10, 9.5)),
  stroke(seg(13.5, 12.5, 13.5, 10.5)),
  stroke(poly(5.75, 7.25, 8.75, 4.5, 11, 6.25, 14.5, 3.5)),
]);

export const ChartNoAxesColumnIcon = /*#__PURE__*/ createIcon('ChartNoAxesColumn', () => [
  ...column(4, 9.5, 15),
  ...column(9, 3.5, 15),
  ...column(14, 6.5, 15),
]);

export const BubbleChartIcon = /*#__PURE__*/ createIcon('BubbleChart', () => [
  body(circle(5.75, 11.25, 3.75)),
  body(circle(13, 5, 2.75), { tint: true }),
  dot(13.75, 13, 1.25),
]);

export const ChartPresentationIcon = /*#__PURE__*/ createIcon('ChartPresentation', () => [
  body(rect(2, 2.5, 14, 9.5, 2.5), { tint: true }),
  cut(poly(5.5, 8.75, 8, 6.25, 10, 8, 12.5, 5.5)),
  stroke(poly(6, 15.5, 9, 12, 12, 15.5)),
]);

export const PercentCircleIcon = /*#__PURE__*/ createIcon('PercentCircle', () => [
  body(circle(9, 9, 7), { tint: true }),
  cut(seg(11.25, 6.75, 6.75, 11.25)),
  hole(6.75, 6.75),
  hole(11.25, 11.25),
]);
