import * as stylex from '@stylexjs/stylex';
import { sankey, sankeyLinkHorizontal, type SankeyLink, type SankeyNode } from 'd3-sankey';
import { useMemo, type Ref } from 'react';
import { makeFormatter, type ValueFormat } from '../../internal/charts-math';
import { chartMotion, svgText, toneStyle } from '../../internal/charts-styles';
import { ChartFrame } from '../_shared/ChartFrame';

export interface SankeyNodeInput {
  id: string;
  label?: string;
  tone?: number;
}
export interface SankeyLinkInput {
  source: string;
  target: string;
  value: number;
}

export interface SankeyChartProps {
  nodes: SankeyNodeInput[];
  links: SankeyLinkInput[];
  valueFormat?: ValueFormat;
  height?: number;
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

type N = SankeyNode<SankeyNodeInput, SankeyLinkInput>;
type L = SankeyLink<SankeyNodeInput, SankeyLinkInput>;

const styles = stylex.create({
  link: {
    opacity: { default: 0.5, ':hover': 0.85, ':focus-visible': 0.85 },
    outline: 'none',
    transitionDuration: '150ms',
    transitionProperty: 'opacity',
  },
});

export function SankeyChart({
  nodes,
  links,
  valueFormat = 'number',
  height = 340,
  label,
  className,
  xstyle,
  ref,
}: SankeyChartProps) {
  const fmt = makeFormatter(valueFormat);
  const toneOf = useMemo(
    () => new Map(nodes.map((n, i) => [n.id, n.tone ?? (i % 10) + 1])),
    [nodes],
  );
  const name = (id: string) => nodes.find((n) => n.id === id)?.label ?? id;
  return (
    <ChartFrame
      label={label ?? `Flow diagram with ${nodes.length} nodes and ${links.length} flows`}
      height={height}
      className={className}
      xstyle={xstyle}
      ref={ref}
      dataTable={{
        columns: ['From', 'To', 'Value'],
        rows: links.map((l) => [name(l.source), name(l.target), fmt(l.value)]),
      }}
    >
      {({ width, height: h, bind, id }) => {
        const pad = 8;
        const labelW = 96;
        const layout = sankey<SankeyNodeInput, SankeyLinkInput>()
          .nodeId((d) => d.id)
          .nodeWidth(12)
          .nodePadding(16)
          .extent([
            [pad, pad],
            [width - pad - labelW, h - pad],
          ])({ nodes: nodes.map((n) => ({ ...n })), links: links.map((l) => ({ ...l })) });
        const path = sankeyLinkHorizontal<SankeyNodeInput, SankeyLinkInput>();
        const maxDepth = Math.max(...layout.nodes.map((n: N) => n.depth ?? 0));
        return (
          <>
            <defs>
              {layout.links.map((l: L, i) => {
                const s = l.source as N;
                const t = l.target as N;
                return (
                  <linearGradient
                    key={i}
                    id={`${id}-l${i}`}
                    gradientUnits="userSpaceOnUse"
                    x1={s.x1}
                    x2={t.x0}
                  >
                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      {...stylex.props(toneStyle(toneOf.get(s.id) ?? 1))}
                    />
                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      {...stylex.props(toneStyle(toneOf.get(t.id) ?? 1))}
                    />
                  </linearGradient>
                );
              })}
            </defs>
            {layout.links.map((l: L, i) => {
              const s = l.source as N;
              const t = l.target as N;
              return (
                <path
                  key={i}
                  d={path(l) ?? ''}
                  fill="none"
                  stroke={`url(#${id}-l${i})`}
                  strokeWidth={Math.max(1, l.width ?? 1)}
                  {...stylex.props(styles.link, chartMotion.fade, svgText.hit)}
                  {...bind(
                    {
                      title: `${name(s.id)} → ${name(t.id)}`,
                      rows: [{ label: 'Flow', value: fmt(l.value), tone: toneOf.get(s.id) }],
                    },
                    `${name(s.id)} to ${name(t.id)}: ${fmt(l.value)}`,
                  )}
                />
              );
            })}
            {layout.nodes.map((n: N) => {
              const last = (n.depth ?? 0) === maxDepth;
              return (
                <g key={n.id}>
                  <rect
                    x={n.x0}
                    y={n.y0}
                    width={(n.x1 ?? 0) - (n.x0 ?? 0)}
                    height={Math.max(2, (n.y1 ?? 0) - (n.y0 ?? 0))}
                    rx={4}
                    fill="currentColor"
                    {...stylex.props(toneStyle(toneOf.get(n.id) ?? 1), chartMotion.fade)}
                  />
                  <text
                    x={last ? (n.x0 ?? 0) - 8 : (n.x1 ?? 0) + 8}
                    y={((n.y0 ?? 0) + (n.y1 ?? 0)) / 2}
                    dy="-0.1em"
                    textAnchor={last ? 'end' : 'start'}
                    {...stylex.props(svgText.strong)}
                    fontSize={12}
                    fontWeight={500}
                  >
                    {n.label ?? n.id}
                  </text>
                  <text
                    x={last ? (n.x0 ?? 0) - 8 : (n.x1 ?? 0) + 8}
                    y={((n.y0 ?? 0) + (n.y1 ?? 0)) / 2}
                    dy="1.1em"
                    textAnchor={last ? 'end' : 'start'}
                    {...stylex.props(svgText.axis)}
                  >
                    {fmt(n.value ?? 0)}
                  </text>
                </g>
              );
            })}
          </>
        );
      }}
    </ChartFrame>
  );
}
