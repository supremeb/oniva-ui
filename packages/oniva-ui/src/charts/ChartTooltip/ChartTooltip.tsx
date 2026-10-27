import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { toneStyle } from '../../internal/charts-styles';
import { AnimatedNumber } from '../../motion/AnimatedNumber/AnimatedNumber';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  base: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-elevation-floating'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    gap: 4,
    lineHeight: font['--oniva-font-lh-12'],
    minWidth: 120,
    padding: 8,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    zIndex: 5,
  },
  floating: {
    insetInlineStart: 0,
    insetBlockStart: 0,
    position: 'absolute',
    transitionDuration: { default: '70ms', [media.reducedMotion]: '0.01ms' },
    transitionProperty: 'translate',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  center: { transform: 'translate(-50%, calc(-100% - 12px))' },
  left: { transform: 'translate(-12px, calc(-100% - 12px))' },
  right: { transform: 'translate(calc(-100% + 12px), calc(-100% - 12px))' },
  title: {
    color: colors['--oniva-color-text-muted'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
  row: { alignItems: 'center', display: 'flex', gap: 12, justifyContent: 'space-between' },
  label: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    gap: 6,
  },
  swatch: { backgroundColor: 'currentColor', borderRadius: 3, height: 8, width: 8 },
  value: { fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-semibold'] },
});

export interface ChartTooltipRow {
  label: ReactNode;
  value: ReactNode;
  /** 1-based palette index for the swatch. */
  tone?: number;
  /** When set, `value` is ignored and this number rolls via AnimatedNumber using `numberFormat`. */
  raw?: number;
  numberFormat?: Intl.NumberFormatOptions;
}

export interface ChartTooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  title?: ReactNode;
  rows?: ChartTooltipRow[];
  /** Pixel position inside a `position: relative` parent. Omit to render inline (static preview). */
  x?: number;
  y?: number;
  align?: 'center' | 'left' | 'right';
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Floating card used by every chart for hover/focus details. Pointer-transparent. */
export function ChartTooltip({
  title,
  rows,
  x,
  y,
  align = 'center',
  children,
  className,
  style,
  xstyle,
  ref,
  ...rest
}: ChartTooltipProps) {
  const floating = x !== undefined && y !== undefined;
  const sx = stylex.props(
    styles.base,
    floating && styles.floating,
    floating && styles[align],
    xstyle,
  );
  const pos = floating ? { translate: `${x}px ${y}px` } : undefined;
  return (
    <div
      role="tooltip"
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
      style={{ ...(sx.style as CSSProperties), ...style, ...pos }}
    >
      {title != null && <div {...stylex.props(styles.title)}>{title}</div>}
      {rows?.map((r, i) => (
        <div key={i} {...stylex.props(styles.row)}>
          <span {...stylex.props(styles.label)}>
            {r.tone != null && (
              <span aria-hidden="true" {...stylex.props(toneStyle(r.tone), styles.swatch)} />
            )}
            {r.label}
          </span>
          <span {...stylex.props(styles.value)}>
            {r.raw != null ? <AnimatedNumber value={r.raw} format={r.numberFormat} /> : r.value}
          </span>
        </div>
      ))}
      {children}
    </div>
  );
}
