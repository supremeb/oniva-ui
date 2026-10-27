import * as stylex from '@stylexjs/stylex';
import { useRef, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl';
import { toneStyle } from '../../internal/charts-styles';
import { useFormatters } from '../../internal/format';
import { useRetained } from '../../internal/w8-exit';
import { flat, surface } from '../../internal/w6-surface';
import { mergeSx } from '../../internal/sx';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { DeltaBadge } from '../../widgets/DeltaBadge';

const styles = stylex.create({
  big: {
    fontSize: font['--oniva-font-size-24'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
  },
  bigRow: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 },
  sub: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], minHeight: 18 },
  bar: {
    borderRadius: 9999,
    height: 4,
    overflow: 'hidden',
    width: '100%',
  },
  svg: { display: 'block', height: '100%', width: '100%' },
  seg: {
    fill: 'currentColor',
    opacity: { default: 1, '[data-dim]': 0.3 },
    stroke: colors['--oniva-color-surface-inner'],
    strokeWidth: 2,
    transform: 'translate(calc(var(--oniva-x) * 1px), 0) scale(var(--oniva-w), 1)',
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: { default: 'transform, opacity', [media.reducedMotion]: 'none' },
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
    vectorEffect: 'non-scaling-stroke',
  },
  list: {
    '--oniva-row-h': { default: '32px', '@media (pointer: coarse)': '44px' },
    listStyle: 'none',
    margin: 0,
    padding: 0,
    position: 'relative',
  },
  row: {
    alignItems: 'center',
    borderRadius: 8,
    boxSizing: 'border-box',
    display: 'grid',
    gap: 8,
    gridTemplateColumns: '10px minmax(0, 1fr) auto auto',
    height: 'var(--oniva-row-h, 32px)',
    insetInline: 0,
    opacity: { default: 1, '[data-dim]': 0.45, '[data-exit]': 0 },
    outlineColor: { default: colors['--oniva-color-focus-ring'], [media.forcedColors]: 'Highlight' },
    outlineOffset: -2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingInline: 6,
    position: 'absolute',
    pointerEvents: { default: 'auto', '[data-exit]': 'none' },
    scale: { default: 1, '[data-exit]': 0.96 },
    transform: 'translateY(calc(var(--oniva-rank) * var(--oniva-row-h, 32px)))',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: { default: 'transform, opacity, background-color, scale', [media.reducedMotion]: 'none' },
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
    backgroundColor: { default: 'transparent', '[data-active]': colors['--oniva-color-surface-hover'] },
  },
  swatch: { backgroundColor: 'currentColor', borderRadius: 2, height: 8, width: 8 },
  share: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    textAlign: 'end',
    width: 40,
    display: { default: 'block', '@container (max-width: 250px)': 'none' },
  },
  val: { fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-medium'] },
  period: { flexShrink: 0 },
});

export interface BreakdownItem {
  /** Keep the same id (or label) for a part across periods so rows and bar segments animate instead of being replaced. */
  id?: string;
  label: string;
  value: number;
  /** 1-based palette index (1..10). Defaults to the part's stable position. */
  tone?: number;
}

export interface CompactBreakdownPeriod {
  id: string;
  label: string;
}

export interface CompactBreakdownProps {
  items: BreakdownItem[];
  /** Heading of the card. Default `Breakdown`. */
  title?: string;
  /** Options of the period switch; no switch when left out. */
  periods?: CompactBreakdownPeriod[];
  period?: string;
  defaultPeriod?: string;
  onPeriodChange?: (id: string) => void;
  /** Change against the previous period in percent (12.4 or -3). */
  delta?: number;
  /** `Intl.NumberFormat` options for every value (currency, compact, ...). Default whole numbers. */
  format?: Intl.NumberFormatOptions;
  /** Line under the big number while nothing is hovered. Default `Total`. */
  totalLabel?: string;
  /** Replaces the footer line (default `Largest: <part>`); `null` hides it. */
  footer?: ReactNode | null;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

const idOf = (i: BreakdownItem) => i.id ?? i.label;

/**
 * A total split into its parts in one small card: numbers roll, the bar glides (transform only) and the ranked rows
 * trade places when the period changes. Hovering or focusing a part dims the rest and rolls the big number to it.
 * The bar is decorative: every value and share is in the list.
 */
export function CompactBreakdown({
  items,
  title = 'Breakdown',
  periods,
  period,
  defaultPeriod,
  onPeriodChange,
  delta,
  format,
  totalLabel = 'Total',
  footer,
  className,
  xstyle,
  ref,
}: CompactBreakdownProps) {
  const fmt = useFormatters();
  const [inner, setInner] = useState(defaultPeriod ?? periods?.[0]?.id ?? '');
  const current = period ?? inner;
  const [active, setActive] = useState<string | null>(null);
  // Stable bar order and colour: first-seen order of ids, so a part keeps its place and colour across periods.
  const order = useRef<string[]>([]);
  for (const it of items) if (!order.current.includes(idOf(it))) order.current.push(idOf(it));

  const total = items.reduce((n, i) => n + i.value, 0);
  const ranked = [...items].sort((a, b) => b.value - a.value);
  const rank = new Map(ranked.map((it, i) => [idOf(it), i]));
  const rows = useRetained(items, idOf, 240);
  const hovered = items.find((i) => idOf(i) === active);
  const shown = hovered ? hovered.value : total;
  const toneOf = (it: BreakdownItem) => it.tone ?? (order.current.indexOf(idOf(it)) % 10) + 1;
  const share = (v: number) => fmt.percent(total ? v / total : 0);
  const num = (v: number) => new Intl.NumberFormat(fmt.locale, format).format(v);

  let cursor = 0;
  const bar = order.current.map((id) => {
    const it = items.find((i) => idOf(i) === id);
    const w = it && total ? it.value / total : 0;
    const x = cursor;
    cursor += w;
    return { id, it, x, w };
  });
  const largest = ranked[0];
  const summary = `${totalLabel} ${num(total)}${delta != null ? `, ${delta >= 0 ? 'up' : 'down'} ${Math.abs(delta)}% versus the previous period` : ''}`;
  const sx = stylex.props(flat.box, xstyle);

  return (
    <section ref={ref as Ref<HTMLElement>} aria-label={title} {...mergeSx(sx, className)}>
      <div {...stylex.props(flat.body)}>
      <header {...stylex.props(flat.head)}>
        <h3 {...stylex.props(flat.title)}>{title}</h3>
        {periods && periods.length > 0 && (
          <SegmentedControl
            size="sm"
            aria-label="Period"
            value={current}
            isDraggable={false}
            onChange={(v) => {
              setInner(v);
              onPeriodChange?.(v);
            }}
            xstyle={styles.period}
          >
            {periods.map((p) => (
              <SegmentedControlItem key={p.id} value={p.id}>
                {p.label}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        )}
      </header>
        <div>
          <div {...stylex.props(styles.bigRow)}>
            <span {...stylex.props(styles.big)}>
              <AnimatedNumber value={shown} format={format} locale={fmt.locale} duration={600} />
            </span>
            {delta != null && !hovered && <DeltaBadge value={delta} />}
          </div>
          <div {...stylex.props(styles.sub)}>{hovered ? `${hovered.label} · ${share(hovered.value)}` : totalLabel}</div>
        </div>
        <span {...stylex.props(surface.sr)} role="status">
          {summary}
        </span>
        <div aria-hidden="true" {...stylex.props(styles.bar)}>
          <svg viewBox="0 0 1 1" preserveAspectRatio="none" {...stylex.props(styles.svg)}>
            {bar.map((b) => (
              <rect
                key={b.id}
                width={1}
                height={1}
                data-dim={active != null && active !== b.id ? '' : undefined}
                style={{ '--oniva-x': b.x, '--oniva-w': b.w } as CSSProperties}
                {...stylex.props(b.it ? toneStyle(toneOf(b.it)) : surface.num, styles.seg)}
              />
            ))}
          </svg>
        </div>
        <ul
          aria-label={`${title}, ranked`}
          {...mergeSx(stylex.props(styles.list), undefined, { height: `calc(${items.length} * var(--oniva-row-h, 32px))` })}
        >
          {rows.map(({ item: it, exiting }, ri) => {
            const id = idOf(it);
            return (
              <li
                key={id}
                tabIndex={exiting ? -1 : 0}
                aria-hidden={exiting ? true : undefined}
                data-exit={exiting ? '' : undefined}
                data-active={active === id ? '' : undefined}
                data-dim={active != null && active !== id ? '' : undefined}
                onPointerEnter={() => setActive(id)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(id)}
                onBlur={() => setActive(null)}
                style={{ '--oniva-rank': rank.get(id) ?? ri } as CSSProperties}
                {...stylex.props(styles.row)}
              >
                <span aria-hidden="true" {...stylex.props(toneStyle(toneOf(it)), styles.swatch)} />
                <span {...stylex.props(surface.ellipsis)}>{it.label}</span>
                <span {...stylex.props(styles.val)}>
                  <AnimatedNumber value={it.value} format={format} locale={fmt.locale} duration={600} />
                </span>
                <span {...stylex.props(styles.share, surface.num)}>{share(it.value)}</span>
              </li>
            );
          })}
        </ul>
      </div>
      {footer !== null && (
        <div {...stylex.props(flat.foot)}>
          {footer ??
            (largest ? (
              <>
                Largest: <span {...stylex.props(flat.strong)}>{largest.label}</span>
              </>
            ) : null)}
        </div>
      )}
    </section>
  );
}
