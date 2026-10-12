import { scaleLinear } from 'd3-scale';
import { stack, stackOffsetExpand, stackOffsetNone } from 'd3-shape';
import { niceTicks, type ChartDatum, type ChartSeries } from '../../internal/charts-math';

export interface CartesianOptions {
  data: ChartDatum[];
  index: string;
  series: ChartSeries[];
  width: number;
  height: number;
  stacked?: boolean | 'percent';
  showXAxis?: boolean;
  showYAxis?: boolean;
  /** Extra headroom multiplier for the max value. */
  headroom?: number;
  /** Explicit [min,max] for the y domain. */
  domain?: [number, number];
}

export interface Layer {
  key: string;
  /** [y0, y1] value pairs per category. */
  points: [number, number][];
}

/** Layout for point-based charts (Area/Line/Combo): categories spread edge to edge. */
export function layoutCartesian(o: CartesianOptions) {
  const { data, index, series, width, height, stacked = false } = o;
  const left = o.showYAxis === false ? 8 : 48;
  const right = 12;
  const top = 10;
  const bottom = o.showXAxis === false ? 8 : 28;
  const innerW = Math.max(10, width - left - right);
  const innerH = Math.max(10, height - top - bottom);
  const n = data.length;
  const categories = data.map((d) => String(d[index]));
  const keys = series.map((s) => s.key);
  const val = (d: ChartDatum, k: string) => Number(d[k]) || 0;

  let layers: Layer[];
  if (stacked) {
    const st = stack<ChartDatum>()
      .keys(keys)
      .value(val)
      .offset(stacked === 'percent' ? stackOffsetExpand : stackOffsetNone)(data);
    layers = st.map((s) => ({
      key: s.key,
      points: s.map((p) => [p[0], p[1]] as [number, number]),
    }));
  } else {
    layers = keys.map((k) => ({
      key: k,
      points: data.map((d) => [0, val(d, k)] as [number, number]),
    }));
  }
  const rawMax = Math.max(0, ...layers.flatMap((l) => l.points.map((p) => p[1])));
  const nice =
    stacked === 'percent'
      ? { ticks: [0, 0.25, 0.5, 0.75, 1], domain: [0, 1] as [number, number] }
      : o.domain
        ? { ticks: scaleLinear().domain(o.domain).ticks(4), domain: o.domain }
        : niceTicks(rawMax * (o.headroom ?? 1), 4);
  const y = scaleLinear()
    .domain(nice.domain)
    .range([top + innerH, top]);
  const x = (i: number) => (n > 1 ? left + (i * innerW) / (n - 1) : left + innerW / 2);
  const step = n > 1 ? innerW / (n - 1) : innerW;
  return {
    left,
    right,
    top,
    bottom,
    innerW,
    innerH,
    n,
    categories,
    keys,
    layers,
    ticks: nice.ticks,
    domain: nice.domain,
    y,
    x,
    step,
    baseY: top + innerH,
  };
}
