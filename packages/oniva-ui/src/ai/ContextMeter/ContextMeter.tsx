import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { Popover, PopoverTrigger } from '../../components/Popover';
import { RingProgress } from '../../components/RingProgress';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { media } from '../../tokens/media.stylex';
import { mergeSx } from '../../internal/sx';
import { motionStyles } from '../../internal/motion-styles';
import { AnimatedNumber } from '../../motion/AnimatedNumber';

const styles = stylex.create({
  root: { display: 'inline-flex' },
  trigger: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    paddingBlock: 4,
    paddingInline: 6,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, transform',
  },
  panel: { display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'], gap: 12, maxWidth: 360, minWidth: 260 },
  title: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  sub: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    overflowWrap: 'anywhere',
  },
  ring: { display: 'inline-flex' },
  empty: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], margin: 0 },
  bar: { backgroundColor: colors['--oniva-color-chart-track'], borderRadius: radius['--oniva-radius-full'], display: 'flex', gap: 2, height: 8, overflow: 'hidden' },
  seg: { height: '100%', minWidth: 2 },
  list: { display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', margin: 0, padding: 0 },
  row: {
    alignItems: 'center',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 8,
    minWidth: 0,
  },
  swatch: { borderRadius: radius['--oniva-radius-xs'], flexShrink: 0, height: 8, width: 8 },
  grow: { flexGrow: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  num: { color: colors['--oniva-color-text-muted'], flexShrink: 0, fontVariantNumeric: 'tabular-nums' },
  cost: {
    alignItems: 'center',
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    fontSize: font['--oniva-font-size-12'],
    justifyContent: 'space-between',
    paddingBlockStart: 10,
  },
  c1: { backgroundColor: colors['--oniva-color-chart-1'] },
  c2: { backgroundColor: colors['--oniva-color-chart-2'] },
  c3: { backgroundColor: colors['--oniva-color-chart-3'] },
  c4: { backgroundColor: colors['--oniva-color-chart-4'] },
  c5: { backgroundColor: colors['--oniva-color-chart-5'] },
});
const swatches = [styles.c1, styles.c2, styles.c3, styles.c4, styles.c5];

export interface ContextBreakdownItem {
  label: string;
  tokens: number;
}

export interface ContextMeterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  /** Token breakdown by source (system prompt, tools, messages…). Total used = sum. */
  breakdown: ContextBreakdownItem[];
  /** Model context window. */
  max: number;
  /** Session cost in USD. */
  cost?: number;
  /** Model name shown in the popover. */
  model?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Ring showing context-window usage. Click for a breakdown by source and the session cost. */
export function ContextMeter({ breakdown, max, cost, model, className, xstyle, ref, ...rest }: ContextMeterProps) {
  const f = useFormatters();
  const items = breakdown.map((b) => ({ ...b, tokens: Number.isFinite(b.tokens) ? Math.max(0, b.tokens) : 0 }));
  const used = items.reduce((n, b) => n + b.tokens, 0);
  const hasMax = Number.isFinite(max) && max > 0;
  const pct = hasMax ? Math.min(100, (used / max) * 100) : used > 0 ? 100 : 0;
  const tone = pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : 'accent';
  // Segments scale to the window, or to the total once usage passes it, so the bar never overflows.
  const scale = hasMax ? Math.max(max, used) : used;
  const pctLabel = f.percent(Math.round(pct) / 100);
  const sx = stylex.props(styles.panel, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(styles.root), className)}>
      <PopoverTrigger>
        <AriaButton aria-label={`Context ${pctLabel} used`} {...stylex.props(styles.trigger, focus.ring, motionStyles.pressScale)}>
          <span aria-hidden="true" {...stylex.props(styles.ring)}>
            <RingProgress aria-label="Context used" value={pct} diameter={20} strokeWidth={3} tone={tone}>{''}</RingProgress>
          </span>
          <span>{pctLabel}</span>
        </AriaButton>
        <Popover aria-label="Context usage" placement="top end">
          <div {...mergeSx(sx)}>
            <div>
              <h4 {...stylex.props(styles.title)}>Context window</h4>
              <span {...stylex.props(styles.sub)}>
                {hasMax ? `${f.compact(used)} of ${f.compact(max)} tokens` : `${f.compact(used)} tokens`}
                {model ? ` · ${model}` : ''}
              </span>
            </div>
            <div aria-hidden="true" {...stylex.props(styles.bar)}>
              {items.map((b, i) =>
                b.tokens > 0 ? (
                  <span key={b.label} style={{ width: `${(b.tokens / scale) * 100}%` }} {...stylex.props(styles.seg, swatches[i % swatches.length])} />
                ) : null,
              )}
            </div>
            {items.length === 0 ? (
              <p {...stylex.props(styles.empty)}>Nothing in context yet.</p>
            ) : (
              <ul {...stylex.props(styles.list)}>
                {items.map((b, i) => (
                  <li key={b.label} {...stylex.props(styles.row)}>
                    <span aria-hidden="true" {...stylex.props(styles.swatch, swatches[i % swatches.length])} />
                    <span title={b.label} {...stylex.props(styles.grow)}>{b.label}</span>
                    <span {...stylex.props(styles.num)}>{f.number(b.tokens)}</span>
                  </li>
                ))}
              </ul>
            )}
            {cost !== undefined && (
              <div {...stylex.props(styles.cost)}>
                <span {...stylex.props(styles.sub)}>Session cost</span>
                <AnimatedNumber value={cost} format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 2 }} />
              </div>
            )}
          </div>
        </Popover>
      </PopoverTrigger>
    </div>
  );
}
