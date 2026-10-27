import * as stylex from '@stylexjs/stylex';
import { useEffect, useState, type CSSProperties, type KeyboardEvent, type Ref } from 'react';
import { Button } from '../../components/Button';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl';
import { chartMotion, svgText, toneStyle } from '../../internal/charts-styles';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { surface } from '../../internal/w6-surface';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { useInView } from '../../motion/InView/useInView';
import { useRetained } from '../../internal/w8-exit';
import { w4Parts } from '../../internal/w4-parts';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { ChartFrame } from '../../charts/_shared/ChartFrame';

const nudge = stylex.keyframes({
  '0%': { transform: 'translateX(0)' },
  '35%': { transform: 'translateX(-2px)' },
  '70%': { transform: 'translateX(1px)' },
  '100%': { transform: 'translateX(0)' },
});

const styles = stylex.create({
  head: { flexWrap: 'wrap', rowGap: 6 },
  sub: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  bigRow: { alignItems: 'baseline', display: 'flex', flexWrap: 'wrap', gap: 6 },
  big: {
    fontSize: font['--oniva-font-size-32'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: '-0.02em',
    lineHeight: 1.1,
  },
  of: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    fontVariantNumeric: 'tabular-nums',
  },
  state: {
    alignItems: 'center',
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    marginInlineStart: 'auto',
  },
  stateDot: { backgroundColor: 'currentColor', borderRadius: 9999, height: 8, width: 8 },
  warn: { color: colors['--oniva-color-warning-fg'] },
  limitTone: { color: colors['--oniva-color-danger-fg'] },
  bar: {
    backgroundColor: colors['--oniva-color-chart-track'],
    borderRadius: 9999,
    height: 12,
    overflow: 'hidden',
    position: 'relative',
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
    cursor: 'default',
  },
  focusBar: { borderRadius: 9999 },
  barWrap: { position: 'relative' },
  tip: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    bottom: 'calc(100% + 6px)',
    boxShadow: 'none',
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    left: 0,
    opacity: { default: 0, '[data-show]': 1 },
    paddingBlock: 3,
    paddingInline: 8,
    pointerEvents: 'none',
    position: 'absolute',
    transform: 'translateX(calc(var(--oniva-tip-x, 0) * 1px)) translateX(-50%)',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: { default: 'transform, opacity', [media.reducedMotion]: 'none' },
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
    whiteSpace: 'nowrap',
    zIndex: 1,
  },
  legendItem: {
    display: 'grid',
    gridTemplateRows: { default: '1fr', '[data-exit]': '0fr' },
    opacity: { default: 1, '[data-exit]': 0 },
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: { default: 'grid-template-rows, opacity', [media.reducedMotion]: 'none' },
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  legendInner: { minHeight: 0, overflow: 'hidden' },
  legend: { display: 'grid', gap: 2, listStyle: 'none', margin: 0, padding: 0 },
  legendRow: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      '[data-active]': colors['--oniva-color-surface-hover'],
    },
    borderRadius: 8,
    columnGap: 8,
    display: 'grid',
    fontSize: font['--oniva-font-size-13'],
    gridTemplateColumns: '10px minmax(0, 1fr) auto 40px',
    minHeight: 28,
    opacity: { default: 1, '[data-dim]': 0.5 },
    paddingInline: 6,
    transitionDuration: motion['--oniva-motion-dur-instant'],
    transitionProperty: 'background-color, opacity',
  },
  swatch: { backgroundColor: 'currentColor', borderRadius: 3, height: 8, width: 8 },
  val: { color: colors['--oniva-color-text'], fontVariantNumeric: 'tabular-nums' },
  section: { display: 'flex', flexDirection: 'column', gap: 6 },
  limits: {
    display: 'grid',
    gap: 10,
    gridTemplateColumns: {
      default: 'repeat(auto-fit, minmax(112px, 1fr))',
      '@container (max-width: 400px)': '1fr',
    },
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  limitHead: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: font['--oniva-font-size-13'],
    gap: 2,
  },
  limitLabel: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    gap: 6,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  limitDot: { backgroundColor: colors['--oniva-color-warning-solid'], borderRadius: 9999, flexShrink: 0, height: 6, width: 6 },
  limitFull: { backgroundColor: colors['--oniva-color-danger-solid'] },
  limitVal: {
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  chip: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: 6,
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    marginInlineStart: 'auto',
    paddingBlock: 2,
    paddingInline: 6,
  },
  chipAfterState: { marginInlineStart: 0 },
  pctCol: {
    color: colors['--oniva-color-text-muted'],
    fontVariantNumeric: 'tabular-nums',
    minWidth: 36,
    textAlign: 'end',
  },
  perDayHead: { alignItems: 'baseline', display: 'flex', gap: 8, justifyContent: 'space-between' },
  eyebrow: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-11'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  avg: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  avgNum: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  thin: {
    backgroundColor: colors['--oniva-color-chart-track'],
    borderRadius: 9999,
    height: 6,
    overflow: 'hidden',
  },
  thinFill: {
    backgroundColor: {
      default: colors['--oniva-color-accent-text'],
      '[data-warn]': colors['--oniva-color-warning-solid'],
      '[data-full]': colors['--oniva-color-danger-solid'],
    },
    borderRadius: 9999,
    height: '100%',
    transform: 'scaleX(var(--oniva-fill, 0))',
    transformOrigin: '0 50%',
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: { default: 'transform', [media.reducedMotion]: 'none' },
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
    width: '100%',
  },
  striped: {
    backgroundImage: `repeating-linear-gradient(135deg, ${colors['--oniva-color-border-hover']} 0 3px, transparent 3px 7px)`,
    height: '100%',
  },
  footer: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    paddingBlock: 2,
  },
  hint: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  nudge: {
    animationDuration: motion['--oniva-motion-dur-slower'],
    animationName: { default: nudge, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  period: { flexShrink: 0, width: { default: null, '@container (max-width: 400px)': '100%' } },
});

export interface UsageCategory {
  label: string;
  value: number;
  /** 1-based palette index (1..10). Defaults to the category's position. */
  tone?: number;
}

export interface UsageLimit {
  label: string;
  used: number;
  /** Leave out (or `null`) for unlimited: shown as "of ∞" on a striped track. */
  total?: number | null;
  unit?: string;
  /** Fraction digits for the numbers. Default 0 for whole numbers, 1 otherwise. */
  decimals?: number;
}

export interface UsageDay {
  label: string;
  /** `null` for days still to come (a flat stub). */
  value: number | null;
}

export interface UsagePeriod {
  id: string;
  label: string;
}

export type UsageState = 'ok' | 'warn' | 'limit';

export interface UsageOverviewProps {
  /** Card title, e.g. the workspace or product name. Default `Usage`. */
  title?: string;
  /** Plan name in front of the reset date. */
  plan?: string;
  /** Credits included in the plan: the bar's full width. */
  total: number;
  /** What the credits went into in the shown period. */
  used: UsageCategory[];
  limits?: UsageLimit[];
  periods?: UsagePeriod[];
  period?: string;
  defaultPeriod?: string;
  onPeriodChange?: (id: string) => void;
  /** When the credits reset: shown as "Resets in 9 days", the date on hover. */
  resetAt?: Date | string | number;
  /** Reference time for the reset countdown (tests and SSR). Default now. */
  now?: Date | number;
  /** Usage per day for the sparkline. */
  daily?: UsageDay[];
  /** Called by the button with the current state. */
  onUpgrade?: (state: UsageState) => void;
  /** Unit of the main meter. Default `credits`. */
  unit?: string;
  /** Share (0 to 1) from which the meter and the limits warn. Default 0.8. */
  warnAt?: number;
  /** Button text while there is room left. Default `Upgrade`. */
  upgradeLabel?: string;
  /** Button text near and at the limit. Default `Add credits`. */
  topUpLabel?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/**
 * Plan usage and AI credits: a stacked credits meter by category, a daily sparkline, thin limit meters and a button that
 * speaks up near the limit. Numbers count up on first view; the bar and segments glide with transform only. Keyboard:
 * the bar steps through categories with Left/Right (Esc clears), the sparkline steps through days. Amber is never the only
 * signal: a polite live region and the visible state label say it too.
 */
export function UsageOverview({
  title = 'Usage',
  plan,
  total,
  used,
  limits,
  periods,
  period,
  defaultPeriod,
  onPeriodChange,
  resetAt,
  now,
  daily,
  onUpgrade,
  unit = 'credits',
  warnAt = 0.8,
  upgradeLabel = 'Upgrade',
  topUpLabel = 'Add credits',
  className,
  xstyle,
  ref,
}: UsageOverviewProps) {
  const fmt = useFormatters();
  const [innerPeriod, setInnerPeriod] = useState(defaultPeriod ?? periods?.[0]?.id ?? '');
  const current = period ?? innerPeriod;
  const [hover, setHover] = useState<number | null>(null);
  const [step, setStep] = useState<number | null>(null);
  const active = hover ?? step;
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [barEl, setBarEl] = useState<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [inView]);
  const rows = useRetained(used, (u) => u.label, 240);

  const sum = used.reduce((n, u) => n + u.value, 0);
  const ratio = total > 0 ? sum / total : 0;
  const state: UsageState = ratio >= 1 ? 'limit' : ratio >= warnAt ? 'warn' : 'ok';
  const pct = fmt.percent(Math.min(1, ratio));
  const valueText = `${fmt.number(sum)} of ${fmt.number(total)} ${unit}`;

  let reset: { text: string; title: string } | null = null;
  if (resetAt != null) {
    const at = new Date(resetAt);
    const base = now != null ? new Date(now).getTime() : Date.now();
    const days = Math.max(0, Math.ceil((at.getTime() - base) / 86_400_000));
    const rtf = new Intl.RelativeTimeFormat(fmt.locale, { numeric: 'auto' });
    reset = { text: `Resets ${rtf.format(days, 'day')}`, title: fmt.date(at) };
  }

  let cursor = 0;
  const segs = rows.map(({ item: u, exiting }, i) => {
    const w =
      !exiting && total > 0 ? Math.min(u.value, Math.max(0, total - cursor * total)) / total : 0;
    const x = ready ? cursor : 0;
    cursor += w;
    return { u, i, x, w: ready ? w : 0, exiting };
  });
  const tipSeg = active != null ? segs[active] : undefined;
  const barW = barEl?.offsetWidth ?? 0;
  const tipX = tipSeg
    ? Math.min(Math.max((tipSeg.x + tipSeg.w / 2) * barW, 48), Math.max(48, barW - 48))
    : 0;

  const onBarKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') return setStep(null);
    if (!used.length) return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const next = e.key === (rtl ? 'ArrowLeft' : 'ArrowRight') || e.key === 'ArrowDown';
    const prev = e.key === (rtl ? 'ArrowRight' : 'ArrowLeft') || e.key === 'ArrowUp';
    if (next) setStep((s) => Math.min(used.length - 1, (s ?? -1) + 1));
    else if (prev) setStep((s) => Math.max(0, (s ?? used.length) - 1));
    else if (e.key === 'Home') setStep(0);
    else if (e.key === 'End') setStep(used.length - 1);
    else return;
    e.preventDefault();
  };

  const readout =
    active != null && used[active]
      ? `${used[active]!.label}: ${fmt.number(used[active]!.value)} ${unit}, ${fmt.percent(total ? used[active]!.value / total : 0)}`
      : '';
  const announce =
    state === 'limit'
      ? `Limit reached: ${valueText}`
      : state === 'warn'
        ? `Running low: ${pct} of ${unit} used`
        : '';
  const sx = stylex.props(surface.tray, xstyle);
  const dayVals = (daily ?? []).filter((d) => d.value != null).map((d) => d.value as number);
  const avgDay = dayVals.length ? Math.round(dayVals.reduce((a, b) => a + b, 0) / dayVals.length) : null;
  const left = Math.max(0, total - sum);

  return (
    <section ref={ref as Ref<HTMLElement>} aria-label={title} {...mergeSx(sx, className)}>
      <header {...stylex.props(surface.head, styles.head)}>
        <div>
          <h3 {...stylex.props(surface.title)}>{title}</h3>
          {(plan || reset) && (
            <div {...stylex.props(styles.sub)}>
              {plan}
              {plan && reset ? ' · ' : ''}
              {reset && <span title={reset.title}>{reset.text}</span>}
            </div>
          )}
        </div>
        {periods && periods.length > 0 && (
          <SegmentedControl
            size="sm"
            aria-label="Period"
            value={current}
            isDraggable={false}
            onChange={(v) => {
              setInnerPeriod(v);
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

      <div {...stylex.props(surface.card)}>
        <div {...stylex.props(styles.bigRow)}>
          <span {...stylex.props(styles.big)}>
            <AnimatedNumber value={sum} countIn duration={800} locale={fmt.locale} />
          </span>
          <span {...stylex.props(styles.of)}>
            of {fmt.number(total)} {unit}
          </span>
          {state !== 'ok' && (
            <span
              key={state}
              {...stylex.props(styles.state, state === 'limit' ? styles.limitTone : styles.warn)}
            >
              <span aria-hidden="true" {...stylex.props(styles.stateDot, w4Parts.pop)} />
              {state === 'limit' ? 'Limit reached' : 'Running low'}
            </span>
          )}
          <span aria-hidden="true" {...stylex.props(styles.chip, state !== 'ok' && styles.chipAfterState)}>
            {pct}
          </span>
        </div>

        <div {...stylex.props(styles.barWrap)}>
          <span
            aria-hidden="true"
            data-show={tipSeg && !tipSeg.exiting ? '' : undefined}
            style={{ '--oniva-tip-x': tipX } as CSSProperties}
            {...stylex.props(styles.tip)}
          >
            {tipSeg ? `${tipSeg.u.label} · ${fmt.number(tipSeg.u.value)}` : ''}
          </span>
          <div
            ref={(n) => {
              viewRef(n);
              setBarEl(n);
            }}
            role="meter"
            tabIndex={0}
            aria-label={`${unit.charAt(0).toUpperCase()}${unit.slice(1)} used`}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={Math.min(sum, total)}
            aria-valuetext={valueText}
            onKeyDown={onBarKey}
            onBlur={() => setStep(null)}
            {...stylex.props(styles.bar, focus.ring, styles.focusBar)}
          >
            <svg
              viewBox="0 0 1 1"
              preserveAspectRatio="none"
              aria-hidden="true"
              {...stylex.props(styles.svg)}
            >
              {segs.map(({ u, i, x, w, exiting }) => (
                <rect
                  key={u.label}
                  pointerEvents={exiting ? 'none' : undefined}
                  width={1}
                  height={1}
                  data-dim={active != null && active !== i ? '' : undefined}
                  onPointerEnter={() => setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  style={{ '--oniva-x': x, '--oniva-w': w } as CSSProperties}
                  {...stylex.props(toneStyle(segs[i]?.u.tone ?? i + 1), styles.seg)}
                />
              ))}
            </svg>
          </div>
        </div>

        <ul aria-label="Usage by category" {...stylex.props(styles.legend)}>
          {rows.map(({ item: u, exiting }, i) => (
            <li
              key={u.label}
              data-exit={exiting ? '' : undefined}
              data-active={active === i ? '' : undefined}
              {...stylex.props(styles.legendItem)}
            >
              <div {...stylex.props(styles.legendInner)}>
                <div
                  data-active={active === i ? '' : undefined}
                  data-dim={active != null && active !== i ? '' : undefined}
                  onPointerEnter={() => !exiting && setHover(i)}
                  onPointerLeave={() => setHover(null)}
                  {...stylex.props(styles.legendRow)}
                >
                  <span
                    aria-hidden="true"
                    {...stylex.props(toneStyle(u.tone ?? i + 1), styles.swatch)}
                  />
                  <span {...stylex.props(surface.ellipsis)}>{u.label}</span>
                  <span {...stylex.props(styles.val)}>
                    <AnimatedNumber value={u.value} locale={fmt.locale} duration={600} />
                  </span>
                  <span aria-hidden="true" {...stylex.props(styles.pctCol)}>
                    {fmt.percent(sum ? u.value / sum : 0)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {daily && daily.length > 0 && (
          <div {...stylex.props(styles.section)}>
            <div {...stylex.props(styles.perDayHead)}>
              <span {...stylex.props(styles.eyebrow)}>Per day</span>
              {avgDay != null && (
                <span {...stylex.props(styles.avg)}>
                  Avg <span {...stylex.props(styles.avgNum)}>{fmt.number(avgDay)}</span> / day
                </span>
              )}
            </div>
            <ChartFrame
              label={`Daily ${unit} usage, ${daily[0]?.label} to ${daily[daily.length - 1]?.label}`}
              height={44}
            >
              {({ width, height: h, bind }) => {
                const max = Math.max(1, ...daily.map((d) => d.value ?? 0));
                const slot = width / daily.length;
                const bw = Math.max(2, Math.min(14, slot - 3));
                return (
                  <>
                    {daily.map((d, i) => {
                      const bh = d.value == null ? 2 : Math.max(2, (d.value / max) * (h - 4));
                      const x = i * slot + (slot - bw) / 2;
                      const b = bind(
                        {
                          title: d.label,
                          rows: [
                            {
                              label: d.value == null ? 'No data yet' : unit,
                              value: d.value == null ? '' : fmt.number(d.value),
                            },
                          ],
                        },
                        `${d.label}: ${d.value == null ? 'no data yet' : `${fmt.number(d.value)} ${unit}`}`,
                      );
                      return (
                        <g key={d.label} {...stylex.props(chartMotion.fade)}>
                          <rect
                            x={x}
                            y={h - bh}
                            width={bw}
                            height={bh}
                            rx={Math.min(3, bw / 2)}
                            fill="currentColor"
                            aria-hidden="true"
                            opacity={d.value == null ? 0.35 : 1}
                            {...stylex.props(toneStyle(1))}
                          />
                          <rect
                            x={i * slot}
                            y={0}
                            width={slot}
                            height={h}
                            fill="transparent"
                            {...b}
                            {...stylex.props(svgText.hit)}
                          />
                        </g>
                      );
                    })}
                  </>
                );
              }}
            </ChartFrame>
          </div>
        )}

        {limits && limits.length > 0 && (
          <ul aria-label="Plan limits" {...stylex.props(styles.limits)}>
            {limits.map((l) => {
              const dec =
                l.decimals ?? (Number.isInteger(l.used) && Number.isInteger(l.total ?? 0) ? 0 : 1);
              const n = (v: number) =>
                fmt.number(v, { minimumFractionDigits: dec, maximumFractionDigits: dec });
              const unlimited = l.total == null;
              const r = unlimited ? 0 : l.total! > 0 ? l.used / l.total! : 0;
              const u = l.unit ? ` ${l.unit}` : '';
              const text = unlimited
                ? `${n(l.used)}${u} of ∞`
                : `${n(l.used)} of ${n(l.total!)}${u}`;
              return (
                <li key={l.label} {...stylex.props(styles.section)}>
                  <div {...stylex.props(styles.limitHead)}>
                    <span {...stylex.props(styles.limitLabel)}>
                      {l.label}
                      {!unlimited && r >= warnAt && (
                        <span aria-hidden="true" {...stylex.props(styles.limitDot, r >= 1 && styles.limitFull)} />
                      )}
                    </span>
                    <span {...stylex.props(styles.limitVal)}>{text}</span>
                  </div>
                  {unlimited ? (
                    <div aria-hidden="true" {...stylex.props(styles.thin)}>
                      <div {...stylex.props(styles.striped)} />
                    </div>
                  ) : (
                    <div
                      role="meter"
                      aria-label={l.label}
                      aria-valuemin={0}
                      aria-valuemax={l.total!}
                      aria-valuenow={Math.min(l.used, l.total!)}
                      aria-valuetext={text}
                      {...stylex.props(styles.thin)}
                    >
                      <div
                        data-warn={r >= warnAt && r < 1 ? '' : undefined}
                        data-full={r >= 1 ? '' : undefined}
                        style={{ '--oniva-fill': ready ? Math.min(1, r) : 0 } as CSSProperties}
                        {...stylex.props(styles.thinFill)}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div {...stylex.props(styles.footer, surface.footer)}>
        <span {...stylex.props(styles.hint)}>
          {left > 0 ? `${fmt.number(left)} ${unit} left` : `${pct} used`}
        </span>
        <Button
          size="sm"
          variant={state === 'ok' ? 'secondary' : 'primary'}
          onPress={() => onUpgrade?.(state)}
          xstyle={state === 'ok' ? undefined : styles.nudge}
          key={state}
        >
          {state === 'ok' ? upgradeLabel : topUpLabel}
        </Button>
      </div>
      <span role="status" aria-live="polite" {...stylex.props(surface.sr)}>
        {readout || announce}
      </span>
    </section>
  );
}
