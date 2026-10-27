import * as stylex from '@stylexjs/stylex';
import { useEffect, useId, useRef, useState, type ReactNode, type Ref } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import {
  Button as AriaButton,
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
} from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import { useControllable } from '../../internal/w4-hooks';
import { w4 } from '../../internal/w4-styles';
import { DrawnCheck, w4Parts } from '../../internal/w4-parts';
import { toneColor, type CardTone } from '../../internal/w4-tone';
import { Button } from '../Button';
import { SegmentedControl, SegmentedControlItem } from '../SegmentedControl';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { AnimatedNumber } from '../../motion/AnimatedNumber';

export type ExperimentTone = CardTone;

export interface ExperimentMetric {
  id: string;
  label: string;
  /** Text formatter; for rolling digits pass `formatOptions` instead. */
  format?: (n: number) => string;
  /** `Intl.NumberFormat` options: rolls digits when the metric changes. Wins over `format`. */
  formatOptions?: Intl.NumberFormatOptions;
  /** A drop counts as the lead (e.g. latency, churn). */
  lowerIsBetter?: boolean;
}

export interface ExperimentVariant {
  id: string;
  /** Short letter in the badge. */
  key: string;
  name: string;
  /** One number per metric id. */
  values: Record<string, number>;
  control?: boolean;
  visitors?: number;
  /** Confidence (0-100) per metric id; pass what your stats engine gives you. */
  confidence?: Record<string, number>;
}

const fillIn = stylex.create({
  x: (v: number) => ({ transform: `scaleX(${v})` }),
  y: (v: number) => ({ transform: `scaleY(${v})` }),
  grow: (v: number) => ({ flexGrow: v }),
});

const styles = stylex.create({
  root: {
    containerType: 'inline-size',
    fontFamily: font['--oniva-font-sans'],
    maxWidth: 340,
    overflow: 'hidden',
    width: '100%',
  },
  head: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    borderWidth: 0,
    boxSizing: 'border-box',
    color: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    gap: 12,
    padding: 12,
    textAlign: 'start',
    width: '100%',
  },
  main: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 4, minWidth: 0 },
  title: {
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-18'],
  },
  sub: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 6,
  },
  note: {
    display: { default: 'inline', '@container (max-width: 299px)': 'none' },
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-accent-text'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  pill: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-sm'],
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 4,
    paddingBlock: 1,
    paddingInline: 6,
  },
  leader: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-success-fg'],
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 4,
    paddingBlock: 4,
    paddingInline: 8,
  },
  deltaPill: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-sm'],
    minWidth: 0,
    paddingBlock: 1,
    paddingInline: 6,
  },
  chart: { alignItems: 'flex-end', display: 'flex', flexShrink: 0, gap: 3, height: 32, width: 56 },
  chartHidden: { display: 'none' },
  col: {
    alignSelf: 'stretch',
    display: 'flex',
    flexBasis: 0,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    minWidth: 6,
    opacity: 1,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity, flex-grow',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  colDim: { opacity: 0.35 },
  colBar: {
    backgroundColor: colors['--oniva-color-chart-track'],
    borderRadius: radius['--oniva-radius-xs'],
    height: '100%',
    transformOrigin: 'bottom',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform, background-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  colBarLead: { backgroundColor: colors['--oniva-color-accent-text'] },
  body: {
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 10,
  },
  rows: { display: 'flex', flexDirection: 'column', gap: 4 },
  row: {
    alignItems: 'stretch',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    borderColor: 'transparent',
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    gap: 6,
    minHeight: { default: 44, '@media (pointer: coarse)': 56 },
    padding: 8,
    textAlign: 'start',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color',
    width: '100%',
  },
  rowOn: { borderColor: colors['--oniva-color-accent-text'] },
  rowTop: { alignItems: 'center', display: 'flex', gap: 8 },
  badge: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-sm'],
    color: colors['--oniva-color-text-on-tertiary'],
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-11'],
    fontWeight: font['--oniva-font-weight-bold'],
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  badgeOn: {
    backgroundColor: colors['--oniva-color-accent-text'],
    color: colors['--oniva-color-text-inverse'],
  },
  name: { flexGrow: 1, minWidth: 0 },
  value: { fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-semibold'] },
  delta: {
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    minWidth: 44,
    textAlign: 'end',
  },
  good: { color: colors['--oniva-color-success-fg'] },
  bad: { color: colors['--oniva-color-danger-fg'] },
  neutral: { color: colors['--oniva-color-text-muted'] },
  track: {
    backgroundColor: colors['--oniva-color-chart-track'],
    borderRadius: radius['--oniva-radius-full'],
    height: 4,
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: colors['--oniva-color-chart-4'],
    borderRadius: radius['--oniva-radius-full'],
    height: '100%',
    transformOrigin: 'left',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  fillLead: { backgroundColor: colors['--oniva-color-accent-text'] },
  conf: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
  },
  tray: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    minHeight: 44,
    paddingInline: 12,
  },
  trayLine: { display: 'inline-block', maxWidth: '100%', verticalAlign: 'top' },
  actionIn: { display: 'inline-flex', flexShrink: 0 },
  hint: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    minWidth: 0,
  },
});

export interface ExperimentCardProps {
  title: string;
  variants: ExperimentVariant[];
  metrics?: ExperimentMetric[];
  metric?: string;
  defaultMetric?: string;
  onMetricChange?: (id: string) => void;
  /** Id of the picked winner (controlled). */
  winner?: string | null;
  defaultWinner?: string | null;
  onWinnerChange?: (id: string | null) => void;
  status?: { label: string; tone?: ExperimentTone };
  /** Short text next to the status, e.g. "Day 9 of 14". */
  note?: string;
  /** Button on the tray once a winner is picked. */
  action?: {
    label: string | ((variant: ExperimentVariant) => string);
    onClick: (variant: ExperimentVariant) => void;
  };
  /** Line on the tray while nothing is hovered or picked. */
  hint?: ReactNode;
  trigger?: 'hover' | 'click';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const DEFAULT_METRIC: ExperimentMetric = { id: 'value', label: 'Value' };

/** A/B test in two lines that unfolds on hover: variants linked to a tiny chart, a metric switch and a winner pick. */
export function ExperimentCard({
  title,
  variants,
  metrics = [DEFAULT_METRIC],
  metric: metricProp,
  defaultMetric,
  onMetricChange,
  winner: winnerProp,
  defaultWinner = null,
  onWinnerChange,
  status,
  note,
  action,
  hint = 'Pick a winner',
  trigger = 'hover',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  xstyle,
  ref,
}: ExperimentCardProps) {
  const fmt = useFormatters();
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const [metricId, setMetricId] = useControllable(
    metricProp,
    defaultMetric ?? metrics[0]?.id ?? '',
    onMetricChange,
  );
  const [winner, setWinner] = useControllable<string | null>(
    winnerProp,
    defaultWinner,
    onWinnerChange,
  );
  const [hot, setHot] = useState<string | null>(null);

  const m = metrics.find((x) => x.id === metricId) ?? metrics[0] ?? DEFAULT_METRIC;
  const control = variants.find((v) => v.control) ?? variants[0];
  const val = (v: ExperimentVariant) => v.values[m.id] ?? 0;
  const max = Math.max(...variants.map(val), 0) || 1;
  const baseline = control ? val(control) : 0;

  const stats = variants.map((v) => {
    const delta = baseline ? ((val(v) - baseline) / baseline) * 100 : 0;
    const lead = v !== control && (m.lowerIsBetter ? delta < 0 : delta > 0);
    return { v, delta, lead };
  });
  const best = stats.reduce<(typeof stats)[number] | undefined>(
    (a, s) => (s.lead && (!a || (m.lowerIsBetter ? s.delta < a.delta : s.delta > a.delta)) ? s : a),
    undefined,
  );

  const text = (n: number) =>
    m.formatOptions ? fmt.number(n, m.formatOptions) : m.format ? m.format(n) : fmt.number(n);
  const signed = (d: number) =>
    `${d > 0 ? '+' : d < 0 ? '−' : ''}${fmt.number(Math.abs(d), { maximumFractionDigits: 1 })}%`;

  useEffect(() => {
    if (!open) setHot(null);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (
        !rootRef.current?.contains(e.target as Node) &&
        (trigger === 'click' || e.pointerType !== 'mouse')
      )
        setOpen(false);
    };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, trigger]);

  const picked = variants.find((v) => v.id === winner);
  const hotV = variants.find((v) => v.id === hot);
  const tray = hotV
    ? `${hotV.key}: ${hotV.name}${hotV.visitors != null ? ` · ${fmt.plural(hotV.visitors, { one: '# visitor', other: '# visitors' })}` : ''}`
    : picked
      ? `${picked.key} picked as winner`
      : hint;
  const actionLabel =
    picked && action
      ? typeof action.label === 'function'
        ? action.label(picked)
        : action.label
      : null;

  const accessible = [title, status?.label, best ? `${best.v.key} ahead` : null]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as { current: HTMLDivElement | null }).current = el;
      }}
      onPointerEnter={(e) => {
        if (trigger === 'hover' && e.pointerType === 'mouse') setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (
          trigger === 'hover' &&
          e.pointerType === 'mouse' &&
          !rootRef.current?.contains(document.activeElement)
        )
          setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          setOpen(false);
          rootRef.current?.querySelector<HTMLElement>('[data-card-head]')?.focus();
        }
      }}
      {...mergeSx(stylex.props(w4.card, styles.root, xstyle), className)}
    >
      <AriaButton
        data-card-head=""
        aria-expanded={open}
        aria-controls={`${uid}-body`}
        aria-label={accessible}
        onPress={(e) => setOpen(trigger === 'hover' && e.pointerType === 'mouse' ? true : !open)}
        className={() => sxClass(stylex.props(styles.head, focus.inset))}
      >
        <span aria-hidden="true" {...stylex.props(styles.icon)}>
          <BarChart3 size={20} />
        </span>
        <span {...stylex.props(styles.main)}>
          <span title={title} {...stylex.props(styles.title, w4.clamp1)}>
            {title}
          </span>
          <span {...stylex.props(styles.sub)}>
            {status && (
              <span {...stylex.props(styles.pill)}>
                <span aria-hidden="true" {...stylex.props(toneColor[status.tone ?? 'gray'])}>
                  ●
                </span>
                {status.label}
              </span>
            )}
            {note && <span {...stylex.props(styles.note)}>{note}</span>}
          </span>
        </span>
        {best && (
          <span aria-hidden="true" {...stylex.props(styles.leader)}>
            {best.v.key}
            <TrendingUp size={14} />
            {signed(best.delta)}
          </span>
        )}
        <span aria-hidden="true" {...stylex.props(styles.chart, best && styles.chartHidden)}>
          {stats.map(({ v, lead }) => (
            <span
              key={v.id}
              {...stylex.props(
                styles.col,
                fillIn.grow(hot === v.id ? 2 : 1),
                hot !== null && hot !== v.id && styles.colDim,
              )}
            >
              <span
                {...stylex.props(
                  styles.colBar,
                  (lead || v.id === winner) && styles.colBarLead,
                  fillIn.y(Math.max(val(v) / max, 0.06)),
                )}
              />
            </span>
          ))}
        </span>
      </AriaButton>

      <AnimatedHeight isOpen={open} id={`${uid}-body`}>
        <div {...stylex.props(styles.body)}>
          {metrics.length > 1 && (
            <SegmentedControl
              aria-label="Metric"
              size="sm"
              value={m.id}
              onChange={setMetricId}
            >
              {metrics.map((x) => (
                <SegmentedControlItem key={x.id} value={x.id}>
                  {x.label}
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
          )}
          <AriaToggleButtonGroup
            aria-label="Pick a winner"
            selectionMode="single"
            disallowEmptySelection={false}
            selectedKeys={winner ? [winner] : []}
            onSelectionChange={(keys) =>
              setWinner([...keys][0] != null ? String([...keys][0]) : null)
            }
            {...stylex.props(styles.rows)}
          >
            {stats.map(({ v, delta, lead }) => {
              const conf = v.confidence?.[m.id];
              const isWinner = winner === v.id;
              const deltaText = v === control ? 'baseline' : signed(delta);
              return (
                <AriaToggleButton
                  key={v.id}
                  id={v.id}
                  aria-label={`${v.key}: ${v.name}, ${text(val(v))}, ${deltaText}`}
                  onHoverChange={(h) => setHot(h ? v.id : null)}
                  onFocusChange={(f) => setHot(f ? v.id : null)}
                  className={({ isSelected }) =>
                    sxClass(stylex.props(styles.row, focus.ring, isSelected && styles.rowOn))
                  }
                >
                  <span {...stylex.props(styles.rowTop)}>
                    <span
                      aria-hidden="true"
                      {...stylex.props(styles.badge, isWinner && styles.badgeOn, isWinner && w4Parts.pop)}
                    >
                      {isWinner ? <DrawnCheck size={13} strokeWidth={2.6} /> : v.key}
                    </span>
                    <span {...stylex.props(styles.name, w4.clamp1)}>{v.name}</span>
                    <span aria-hidden="true" {...stylex.props(styles.value)}>
                      {m.formatOptions ? (
                        <AnimatedNumber value={val(v)} format={m.formatOptions} />
                      ) : (
                        text(val(v))
                      )}
                    </span>
                    <span
                      aria-hidden="true"
                      {...stylex.props(
                        styles.delta,
                        styles.deltaPill,
                        v === control ? styles.neutral : lead ? styles.good : styles.bad,
                      )}
                    >
                      {v === control ? 'Base' : signed(delta)}
                    </span>
                  </span>
                  <span aria-hidden="true" {...stylex.props(styles.track)}>
                    <span
                      {...stylex.props(
                        styles.fill,
                        lead && styles.fillLead,
                        fillIn.x(Math.max(val(v) / max, 0.02)),
                      )}
                    />
                  </span>
                  {conf != null && (
                    <span aria-hidden="true" {...stylex.props(styles.conf)}>
                      {fmt.percent(conf / 100)} confidence
                    </span>
                  )}
                </AriaToggleButton>
              );
            })}
          </AriaToggleButtonGroup>
        </div>
        <div {...stylex.props(styles.tray)}>
          <span aria-live="polite" {...stylex.props(styles.hint, w4.clamp1)}>
            <span key={String(tray)} {...stylex.props(w4Parts.rise, styles.trayLine)}>
              {tray}
            </span>
          </span>
          {picked && action && actionLabel && (
            <span key="action" {...stylex.props(w4Parts.pop, styles.actionIn)}>
              <Button size="sm" variant="primary" onPress={() => action.onClick(picked)}>
                {actionLabel}
              </Button>
            </span>
          )}
        </div>
      </AnimatedHeight>
    </div>
  );
}
