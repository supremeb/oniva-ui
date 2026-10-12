import { seriesTone, type ChartDatum, type ChartSeries } from '../../internal/charts-math';
import type { ChartTooltipRow } from '../ChartTooltip/ChartTooltip';

/** Tooltip rows for one category; numbers roll via AnimatedNumber when the format maps to Intl options. */
export function tipRows(
  series: ChartSeries[],
  d: ChartDatum,
  fmt: (n: number) => string,
  intl: Intl.NumberFormatOptions | null,
): ChartTooltipRow[] {
  return series.map((s, si) => {
    const v = Number(d[s.key]) || 0;
    return {
      label: s.label ?? s.key,
      value: fmt(v),
      tone: seriesTone(s, si),
      ...(intl ? { raw: v, numberFormat: intl } : {}),
    };
  });
}
