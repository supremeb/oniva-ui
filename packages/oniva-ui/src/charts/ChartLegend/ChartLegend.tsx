import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { toneStyle } from '../../internal/charts-styles';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';

const styles = stylex.create({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    fontFamily: font.sans,
    fontSize: font.size13,
    gap: 16,
    lineHeight: font.lh13,
    margin: 0,
    padding: 0,
  },
  vertical: { alignItems: 'stretch', flexDirection: 'column', gap: 8 },
  item: {
    alignItems: 'center',
    color: colors.text,
    display: 'inline-flex',
    gap: 6,
    listStyle: 'none',
  },
  swatch: {
    backgroundColor: 'currentColor',
    borderRadius: 3,
    flexShrink: 0,
    height: 10,
    width: 10,
  },
  swatchRound: { borderRadius: 9999 },
  label: { color: colors.textMuted, fontWeight: font.weightMedium },
  value: {
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font.weightSemibold,
    marginInlineStart: 'auto',
  },
});

export interface ChartLegendItem {
  label: ReactNode;
  /** 1-based palette index. */
  tone?: number;
  value?: ReactNode;
}

export interface ChartLegendProps extends Omit<HTMLAttributes<HTMLUListElement>, 'style'> {
  items: ChartLegendItem[];
  orientation?: 'horizontal' | 'vertical';
  shape?: 'square' | 'round';
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLUListElement>;
}

export function ChartLegend({
  items,
  orientation = 'horizontal',
  shape = 'square',
  className,
  xstyle,
  ref,
  ...rest
}: ChartLegendProps) {
  const sx = stylex.props(styles.root, orientation === 'vertical' && styles.vertical, xstyle);
  return (
    <ul {...rest} ref={ref} {...sx} className={[sx.className, className].filter(Boolean).join(' ')}>
      {items.map((it, i) => (
        <li key={i} {...stylex.props(styles.item)}>
          <span
            aria-hidden="true"
            {...stylex.props(
              toneStyle(it.tone ?? i + 1),
              styles.swatch,
              shape === 'round' && styles.swatchRound,
            )}
          />
          <span {...stylex.props(styles.label)}>{it.label}</span>
          {it.value != null && <span {...stylex.props(styles.value)}>{it.value}</span>}
        </li>
      ))}
    </ul>
  );
}
