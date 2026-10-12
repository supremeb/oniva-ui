import * as stylex from '@stylexjs/stylex';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { HTMLAttributes, Ref } from 'react';
import { Sparkline } from '../../charts/Sparkline';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { dash } from '../../internal/dash-styles';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

export interface KpiItem {
  id: string;
  label: string;
  value: number;
  /** `Intl.NumberFormat` options for the value. */
  format?: Intl.NumberFormatOptions;
  /** Fractional change vs previous period (0.124 = +12.4%). */
  delta?: number;
  /** When lower is better (churn, latency), a negative delta renders as good. */
  invertDelta?: boolean;
  spark?: number[];
}

const styles = stylex.create({
  strip: {
    display: 'grid',
    gap: 8,
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  cell: {
    appearance: 'none',
    backgroundColor: {
      default: colors['--oniva-color-surface'],
      ':hover': colors['--oniva-color-surface-hover'],
    },
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
    boxSizing: 'border-box',
    color: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    font: 'inherit',
    gap: 6,
    padding: 14,
    textAlign: 'start',
    transform: { default: 'scale(1)', ':active': 'scale(0.98)' }, // matches --oniva-motion-press-scale; pointer-only
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'transform, background-color',
    width: '100%',
  },
  static: { cursor: 'default', transform: 'none' },
  value: {
    fontSize: font['--oniva-font-size-24'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-24'],
  },
  foot: { alignItems: 'flex-end', display: 'flex', gap: 8, justifyContent: 'space-between' },
  delta: {
    alignItems: 'center',
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 2,
  },
  good: { color: colors['--oniva-color-success-fg'] },
  bad: { color: colors['--oniva-color-danger-fg'] },
});

export interface KpiStripProps extends Omit<HTMLAttributes<HTMLUListElement>, 'style'> {
  items: KpiItem[];
  /** Makes each metric a button; called with the metric id. */
  onDrilldown?: (id: string) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLUListElement>;
}

const pct = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 });

export function KpiStrip({ items, onDrilldown, className, xstyle, ref, ...rest }: KpiStripProps) {
  const sx = stylex.props(dash.root, styles.strip, xstyle);
  return (
    <ul {...rest} ref={ref} {...mergeSx(sx, className)}>
      {items.map((it) => {
        const up = (it.delta ?? 0) >= 0;
        const good = it.invertDelta ? !up : up;
        const body = (
          <>
            <span {...stylex.props(dash.label)}>{it.label}</span>
            <span {...stylex.props(styles.value, dash.num)}>
              <AnimatedNumber value={it.value} format={it.format} />
            </span>
            <span {...stylex.props(styles.foot)}>
              {it.delta != null ? (
                <span {...stylex.props(styles.delta, good ? styles.good : styles.bad)}>
                  {up ? <ArrowUpRight size={14} aria-hidden="true" /> : <ArrowDownRight size={14} aria-hidden="true" />}
                  <span {...stylex.props(dash.sr)}>{up ? 'Up' : 'Down'}</span>
                  <span {...stylex.props(dash.num)}>{pct.format(Math.abs(it.delta))}</span>
                </span>
              ) : (
                <span />
              )}
              {it.spark && (
                <Sparkline data={it.spark} variant="area" tone={good ? 3 : 5} width={72} height={28} label={`${it.label} trend`} />
              )}
            </span>
          </>
        );
        return (
          <li key={it.id}>
            {onDrilldown ? (
              <button type="button" onClick={() => onDrilldown(it.id)} {...stylex.props(styles.cell, focus.ring)}>
                {body}
              </button>
            ) : (
              <div {...stylex.props(styles.cell, styles.static)}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
