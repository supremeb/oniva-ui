import * as stylex from '@stylexjs/stylex';
import { useMemo, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { Select, SelectItem } from '../../components/Select';
import { ToggleButton } from '../../components/ToggleButton';
import { niceTicks } from '../../internal/charts-math';
import { staggerDelay } from '../../internal/charts-motion';
import { chartMotion, svgText, toneStyle } from '../../internal/charts-styles';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { ChartFrame } from '../_shared/ChartFrame';

const styles = stylex.create({
  tray: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    containerType: 'inline-size',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 16,
    overflow: 'hidden',
    paddingBlock: 20,
    paddingInline: 0,
    width: '100%',
  },
  head: { alignItems: 'baseline', display: 'flex', gap: 8, justifyContent: 'space-between', paddingInline: 20 },
  title: { fontSize: font['--oniva-font-size-16'], fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  total: { fontSize: font['--oniva-font-size-16'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-semibold'] },
  unit: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-regular'] },
  pickers: { display: 'grid', gap: 12, gridTemplateColumns: { default: 'repeat(3, minmax(0, 1fr))', '@container (max-width: 480px)': '1fr' }, paddingInline: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 },
  fieldLabel: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  picker: { minWidth: 0, width: '100%' },
  tile: { paddingInline: 20 },
  bar: {
    transform: 'translate(var(--oniva-x), var(--oniva-y)) scale(var(--oniva-w), var(--oniva-h))',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
    fill: 'currentColor',
    opacity: { default: 1, '[data-dim]': 0.35 },
    stroke: colors['--oniva-color-surface-inner'],
    strokeWidth: 1.5,
    vectorEffect: 'non-scaling-stroke',
    transformBox: 'view-box',
    transformOrigin: '0 0',
  },
  legend: { display: 'flex', flexWrap: 'wrap', gap: 6, margin: 0, paddingBlock: 0, paddingInline: 20, listStyle: 'none' },
  chip: { gap: 6 },
  swatch: { backgroundColor: 'currentColor', borderRadius: 3, display: 'inline-block', height: 8, width: 8 },
  scroll: { overflowX: 'auto', borderTopColor: colors['--oniva-color-border'], borderTopStyle: 'solid', borderTopWidth: 1 },
  table: {
    borderCollapse: 'collapse',
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    width: '100%',
  },
  th: {
    color: colors['--oniva-color-text-muted'],
    fontWeight: font['--oniva-font-weight-medium'],
    fontSize: font['--oniva-font-size-11'],
    letterSpacing: '0.06em',
    paddingBlock: 12,
    paddingInline: 12,
    textAlign: 'end',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  thFirst: { textAlign: 'start' },
  td: { paddingBlock: 9, paddingInline: 12, textAlign: 'end', whiteSpace: 'nowrap' },
  tdFirst: { fontWeight: font['--oniva-font-weight-regular'], textAlign: 'start' },
  tr: {
    backgroundColor: {
      default: 'transparent',
      '[data-active]': colors['--oniva-color-accent-tint'],
    },
    borderTopColor: colors['--oniva-color-separator'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    transitionDuration: motion['--oniva-motion-dur-instant'],
    transitionProperty: 'background-color',
  },
  totalCol: { fontWeight: font['--oniva-font-weight-semibold'] },
  empty: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], margin: 0, padding: 24, textAlign: 'center' },
  dot: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  sr: { borderWidth: 0, clip: 'rect(0 0 0 0)', height: 1, margin: -1, overflow: 'hidden', padding: 0, position: 'absolute', whiteSpace: 'nowrap', width: 1 },
});

export type BreakdownRecord = Record<string, unknown>;

export interface BreakdownDimension {
  /** Field on each record holding this dimension's value. */
  key: string;
  label: string;
  /** Values in display order. Records with other values are ignored. */
  values: string[];
  /** Optional 1-based palette index per value (1..10); defaults to the value's position. */
  tones?: Record<string, number>;
}

export interface BreakdownMeasure {
  key: string;
  label: string;
  /** Plural unit shown next to numbers, e.g. `tasks`. */
  unit?: string;
  /** Record field to sum. Without it each record counts as 1. */
  field?: string;
}

export interface BreakdownChartProps {
  records: BreakdownRecord[];
  dimensions: BreakdownDimension[];
  measures: BreakdownMeasure[];
  /** Heading in the tray. Default `Workload`. */
  title?: string;
  defaultMeasure?: string;
  /** Dimension along the bars. */
  defaultSlice?: string;
  /** Dimension that stacks the bars, or `none`. */
  defaultSegment?: string;
  /** Chart height in px. Default 220. */
  height?: number;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

const NONE = 'none';

/**
 * Stacked bar chart with measure, slice and segment pickers, a hover breakdown and a linked table that repeats
 * every number (so nothing depends on colour or hover). Legend entries are toggle buttons; hovering or focusing
 * a bar dims the others and highlights its table row. Bars re-stack with transform transitions (off under reduced motion).
 */
export function BreakdownChart({
  records,
  dimensions,
  measures,
  title = 'Workload',
  defaultMeasure,
  defaultSlice,
  defaultSegment,
  height = 220,
  className,
  xstyle,
  ref,
}: BreakdownChartProps) {
  const fmt = useFormatters();
  const [measureKey, setMeasureKey] = useState(defaultMeasure ?? measures[0]?.key ?? '');
  const [sliceKey, setSliceKey] = useState(defaultSlice ?? dimensions[0]?.key ?? '');
  const [segKey, setSegKey] = useState(defaultSegment ?? dimensions.find((d) => d.key !== (defaultSlice ?? dimensions[0]?.key))?.key ?? NONE);
  const [hidden, setHidden] = useState<Set<string>>(() => new Set());
  const [active, setActive] = useState<string | null>(null);

  const measure = measures.find((m) => m.key === measureKey) ?? measures[0];
  const slice = dimensions.find((d) => d.key === sliceKey) ?? dimensions[0];
  const seg = segKey === NONE || segKey === slice?.key ? undefined : dimensions.find((d) => d.key === segKey);

  const model = useMemo(() => {
    if (!slice || !measure) return null;
    const segValues = seg ? seg.values : ['All'];
    const cells = new Map<string, number>();
    for (const r of records) {
      const s = String(r[slice.key]);
      const g = seg ? String(r[seg.key]) : 'All';
      if (!slice.values.includes(s) || !segValues.includes(g)) continue;
      const v = measure.field ? Number(r[measure.field]) || 0 : 1;
      cells.set(`${s}\u0000${g}`, (cells.get(`${s}\u0000${g}`) ?? 0) + v);
    }
    return { segValues, cells };
  }, [records, slice, seg, measure]);

  if (!slice || !measure || !model) return null;
  const segValues = model.segValues;
  const toneOf = (g: string) => (seg ? (seg.tones?.[g] ?? segValues.indexOf(g) + 1) : 1);
  const cell = (s: string, g: string) => (hidden.has(g) ? 0 : (model.cells.get(`${s}\u0000${g}`) ?? 0));
  const total = (s: string) => segValues.reduce((n, g) => n + cell(s, g), 0);
  const unitText = (n: number) => (measure.unit ? `${fmt.number(n)} ${measure.unit}` : fmt.number(n));
  const grand = slice.values.reduce((n, s) => n + total(s), 0);

  const chartLabel = `Stacked bar chart of ${measure.label.toLowerCase()} by ${slice.label.toLowerCase()}${seg ? `, split by ${seg.label.toLowerCase()}` : ''}`;
  const sx = stylex.props(styles.tray, xstyle);
  const field = (label: string, node: ReactNode) => (
    <div {...stylex.props(styles.field)}>
      <span aria-hidden="true" {...stylex.props(styles.fieldLabel)}>
        {label}
      </span>
      {node}
    </div>
  );

  return (
    <section aria-label={title} {...mergeSx(sx, className)} ref={ref as Ref<HTMLElement>}>
      <header {...stylex.props(styles.head)}>
        <h3 {...stylex.props(styles.title)}>{title}</h3>
        <span {...stylex.props(styles.total)}>
          {fmt.number(grand)}
          {measure.unit ? <span {...stylex.props(styles.unit)}> {measure.unit}</span> : null}
        </span>
      </header>
        <div {...stylex.props(styles.pickers)}>
          {field('Measure', <Select size="sm" aria-label="Measure" selectedKey={measure.key} onSelectionChange={(k) => k != null && setMeasureKey(String(k))} xstyle={styles.picker}>
            {measures.map((m) => (
              <SelectItem key={m.key} id={m.key}>
                {m.label}
              </SelectItem>
            ))}
          </Select>)}
          {field('Slice', <Select size="sm" aria-label="Slice by" selectedKey={slice.key} onSelectionChange={(k) => k != null && setSliceKey(String(k))} xstyle={styles.picker}>
            {dimensions.map((d) => (
              <SelectItem key={d.key} id={d.key}>
                {d.label}
              </SelectItem>
            ))}
          </Select>)}
          {field('Segment', <Select size="sm" aria-label="Segment by" selectedKey={seg?.key ?? NONE} onSelectionChange={(k) => { if (k != null) { setSegKey(String(k)); setHidden(new Set()); } }} xstyle={styles.picker}>
            {[
              <SelectItem key={NONE} id={NONE}>
                No segments
              </SelectItem>,
              ...dimensions.filter((d) => d.key !== slice.key).map((d) => (
                <SelectItem key={d.key} id={d.key}>
                  {d.label}
                </SelectItem>
              )),
            ]}
          </Select>)}
        </div>
      <div {...stylex.props(styles.tile)}>
        {grand === 0 ? (
          <p {...stylex.props(styles.empty)}>Nothing to show for this view.</p>
        ) : (
          <ChartFrame label={chartLabel} height={height}>
            {({ width, height: h, bind }) => {
              const left = 4;
              const top = 8;
              const bottom = 26;
              const innerW = Math.max(10, width - left - 36);
              const innerH = Math.max(10, h - top - bottom);
              const max = Math.max(0, ...slice.values.map(total));
              const nice = niceTicks(max, 4);
              const y = (v: number) => top + innerH - (v / (nice.domain[1] || 1)) * innerH;
              const band = innerW / slice.values.length;
              const bw = Math.min(20, band * 0.3);
              return (
                <>
                  <g aria-hidden="true">
                    {nice.ticks.map((t) => (
                      <g key={t}>
                        <line x1={left} x2={left + innerW} y1={y(t)} y2={y(t)} strokeDasharray={t === 0 ? undefined : '3 4'} {...stylex.props(svgText.grid)} />
                        <text x={left + innerW + 8} y={y(t)} dy="0.32em" textAnchor="start" {...stylex.props(svgText.axis)}>
                          {fmt.compact(t)}
                        </text>
                      </g>
                    ))}
                    {slice.values.map((s, i) => (
                      <text key={s} x={left + band * i + band / 2} y={top + innerH + 17} textAnchor="middle" {...stylex.props(svgText.axis)}>
                        {s}
                      </text>
                    ))}
                  </g>
                  {slice.values.map((s, i) => {
                    const x0 = left + band * i + (band - bw) / 2;
                    let acc = 0;
                    const dim = active != null && active !== s;
                    const rows = segValues
                      .filter((g) => cell(s, g) > 0)
                      .map((g) => ({ label: g, value: unitText(cell(s, g)), tone: toneOf(g) }));
                    const b = bind(
                      { title: `${s}: ${unitText(total(s))}`, rows: seg ? rows : undefined },
                      `${s}: ${unitText(total(s))}`,
                    );
                    return (
                      <g key={s} style={{ animationDelay: `${staggerDelay(i, slice.values.length)}ms` }} {...stylex.props(chartMotion.grow)}>
                        {segValues.map((g) => {
                          const v = cell(s, g);
                          const y1 = y(acc + v);
                          const hh = y(acc) - y1;
                          acc += v;
                          return (
                            <rect
                              key={g}
                              width={1}
                              height={1}
                              aria-hidden="true"
                              data-dim={dim ? '' : undefined}
                              style={{ '--oniva-x': `${x0}px`, '--oniva-y': `${y1}px`, '--oniva-w': bw, '--oniva-h': Math.max(0, hh) } as CSSProperties}
                              {...stylex.props(toneStyle(toneOf(g)), styles.bar)}
                            />
                          );
                        })}
                        <rect
                          x={left + band * i}
                          y={top}
                          width={band}
                          height={innerH}
                          fill="transparent"
                          {...b}
                          onPointerEnter={() => setActive(s)}
                          onPointerLeave={() => {
                            b.onPointerLeave();
                            setActive(null);
                          }}
                          onFocus={(e) => {
                            b.onFocus(e);
                            setActive(s);
                          }}
                          onBlur={() => {
                            b.onBlur();
                            setActive(null);
                          }}
                          {...stylex.props(svgText.hit)}
                        />
                      </g>
                    );
                  })}
                </>
              );
            }}
          </ChartFrame>
        )}
      </div>

      {seg && (
        <ul aria-label={`${seg.label} legend`} {...stylex.props(styles.legend)}>
          {seg.values.map((g) => (
            <li key={g}>
              <ToggleButton
                size="sm"
                isSelected={!hidden.has(g)}
                onChange={(on) =>
                  setHidden((prev) => {
                    const next = new Set(prev);
                    if (on) next.delete(g);
                    else next.add(g);
                    return next;
                  })
                }
                xstyle={styles.chip}
              >
                <span aria-hidden="true" {...stylex.props(toneStyle(toneOf(g)), styles.swatch)} />
                {g}
              </ToggleButton>
            </li>
          ))}
        </ul>
      )}

      <div role="region" aria-label={`${title} table`} tabIndex={0} {...stylex.props(styles.scroll)}>
        <table {...stylex.props(styles.table)}>
          <caption {...stylex.props(styles.sr)}>
            {measure.label} by {slice.label}
          </caption>
          <thead>
            <tr>
              <th scope="col" {...stylex.props(styles.th, styles.thFirst)}>
                {slice.label}
              </th>
              {seg &&
                segValues.map((g) => (
                  <th key={g} scope="col" {...stylex.props(styles.th)}>
                    <span {...stylex.props(styles.dot)}>
                      <span aria-hidden="true" {...stylex.props(toneStyle(toneOf(g)), styles.swatch)} />
                      {g}
                    </span>
                  </th>
                ))}
              <th scope="col" {...stylex.props(styles.th)}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {slice.values.map((s) => (
              <tr key={s} data-active={active === s ? '' : undefined} onPointerEnter={() => setActive(s)} onPointerLeave={() => setActive(null)} {...stylex.props(styles.tr)}>
                <th scope="row" {...stylex.props(styles.td, styles.tdFirst)}>
                  {s}
                </th>
                {seg && segValues.map((g) => (
                  <td key={g} {...stylex.props(styles.td)}>
                    {fmt.number(cell(s, g))}
                  </td>
                ))}
                <td {...stylex.props(styles.td, styles.totalCol)}>{fmt.number(total(s))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
