import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { Popover, PopoverTrigger } from '../../components/Popover';
import { RingProgress } from '../../components/RingProgress';
import { compactNumber } from '../../internal/ai-motion';
import { mergeSx } from '../../internal/sx';
import { motionStyles } from '../../internal/motion-styles';
import { AnimatedNumber } from '../../motion/AnimatedNumber';

const styles = stylex.create({
  trigger: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] },
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
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingBlock: 4,
    paddingInline: 6,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, transform',
  },
  panel: { display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'], gap: 12, minWidth: 260 },
  title: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  sub: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  bar: { backgroundColor: colors['--oniva-color-chart-track'], borderRadius: radius['--oniva-radius-full'], display: 'flex', gap: 2, height: 8, overflow: 'hidden' },
  seg: { height: '100%', minWidth: 2 },
  list: { display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', margin: 0, padding: 0 },
  row: { alignItems: 'center', color: colors['--oniva-color-text'], display: 'flex', fontSize: font['--oniva-font-size-12'], gap: 8 },
  swatch: { borderRadius: radius['--oniva-radius-xs'], flexShrink: 0, height: 8, width: 8 },
  grow: { flexGrow: 1 },
  num: { color: colors['--oniva-color-text-muted'], fontVariantNumeric: 'tabular-nums' },
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
  const used = breakdown.reduce((n, b) => n + b.tokens, 0);
  const pct = Math.min(100, (used / max) * 100);
  const tone = pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : 'accent';
  const sx = stylex.props(styles.panel, xstyle);
  return (
    <div {...rest} ref={ref} style={{ display: 'inline-flex' }} className={className}>
      <PopoverTrigger>
        <AriaButton aria-label={`Context ${Math.round(pct)}% used`} {...stylex.props(styles.trigger, motionStyles.pressScale)}>
          <RingProgress aria-label="Context used" value={pct} diameter={20} strokeWidth={3} tone={tone}>{null}</RingProgress>
          <span>{Math.round(pct)}%</span>
        </AriaButton>
        <Popover aria-label="Context usage" placement="top end">
          <div {...mergeSx(sx)}>
            <div>
              <h4 {...stylex.props(styles.title)}>Context window</h4>
              <span {...stylex.props(styles.sub)}>
                {compactNumber(used)} of {compactNumber(max)} tokens{model ? ` · ${model}` : ''}
              </span>
            </div>
            <div aria-hidden="true" {...stylex.props(styles.bar)}>
              {breakdown.map((b, i) => (
                <span key={b.label} style={{ width: `${(b.tokens / max) * 100}%` }} {...stylex.props(styles.seg, swatches[i % swatches.length])} />
              ))}
            </div>
            <ul {...stylex.props(styles.list)}>
              {breakdown.map((b, i) => (
                <li key={b.label} {...stylex.props(styles.row)}>
                  <span aria-hidden="true" {...stylex.props(styles.swatch, swatches[i % swatches.length])} />
                  <span {...stylex.props(styles.grow)}>{b.label}</span>
                  <span {...stylex.props(styles.num)}>{b.tokens.toLocaleString('en-US')}</span>
                </li>
              ))}
            </ul>
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
