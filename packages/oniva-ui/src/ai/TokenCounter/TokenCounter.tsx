import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { mergeSx } from '../../internal/sx';
import { AnimatedNumber } from '../../motion/AnimatedNumber';

const styles = stylex.create({
  root: {
    alignItems: 'baseline',
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
  },
  muted: { color: colors['--oniva-color-text-muted'], fontWeight: font['--oniva-font-weight-regular'] },
});

export interface TokenCounterProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  tokens: number;
  /** Optional context limit, rendered as "/ 200,000". */
  max?: number;
  /** Optional running cost in USD. */
  cost?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Live token / cost readout with rolling digits. */
export function TokenCounter({ tokens, max, cost, className, xstyle, ref, ...rest }: TokenCounterProps) {
  const sx = stylex.props(styles.root, xstyle);
  return (
    <span {...rest} ref={ref} {...mergeSx(sx, className)}>
      <AnimatedNumber value={tokens} />
      {max !== undefined && <span {...stylex.props(styles.muted)}>/ {new Intl.NumberFormat().format(max)}</span>}
      <span {...stylex.props(styles.muted)}>tokens</span>
      {cost !== undefined && (
        <span {...stylex.props(styles.muted)}>
          ·{' '}
          <AnimatedNumber value={cost} format={{ style: 'currency', currency: 'USD', minimumFractionDigits: 3, maximumFractionDigits: 3 }} />
        </span>
      )}
    </span>
  );
}
