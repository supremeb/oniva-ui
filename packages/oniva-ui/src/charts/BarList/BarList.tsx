import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { makeFormatter, type ValueFormat } from '../../internal/charts-math';
import { chartMotion, toneStyle } from '../../internal/charts-styles';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  list: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: 6,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  row: {
    alignItems: 'center',
    borderRadius: radius.md,
    boxSizing: 'border-box',
    display: 'flex',
    gap: 12,
    height: 36,
    justifyContent: 'space-between',
    paddingInline: 10,
    position: 'relative',
  },
  fill: {
    backgroundColor: 'currentColor',
    borderRadius: radius.md,
    bottom: 0,
    left: 0,
    opacity: 0.2,
    position: 'absolute',
    top: 0,
  },
  name: {
    color: colors.text,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    minWidth: 0,
    overflow: 'hidden',
    position: 'relative',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  link: {
    color: 'inherit',
    textDecoration: { default: 'none', ':hover': 'underline' },
    outline: 'none',
    boxShadow: { default: 'none', ':focus-visible': `0 0 0 2px ${colors.focusRing}` },
    borderRadius: radius.xs,
  },
  value: {
    color: colors.text,
    fontSize: font.size14,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font.weightSemibold,
    position: 'relative',
  },
  rank: { color: colors.textMuted, fontVariantNumeric: 'tabular-nums', marginInlineEnd: 8 },
});

export interface BarListItem {
  name: string;
  value: number;
  href?: string;
  icon?: ReactNode;
  tone?: number;
}

export interface BarListProps extends Omit<HTMLAttributes<HTMLUListElement>, 'style'> {
  items: BarListItem[];
  tone?: number;
  valueFormat?: ValueFormat;
  /** Sort descending by value (default true). */
  sort?: boolean;
  /** Show 1..n rank numbers. */
  ranked?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLUListElement>;
}

/** Ranked horizontal bars with the name inside the bar and the value on the right. */
export function BarList({
  items,
  tone = 6,
  valueFormat = 'number',
  sort = true,
  ranked = false,
  className,
  xstyle,
  ref,
  ...rest
}: BarListProps) {
  const fmt = makeFormatter(valueFormat);
  const list = sort ? [...items].sort((a, b) => b.value - a.value) : items;
  const max = Math.max(1, ...list.map((i) => i.value));
  const sx = stylex.props(styles.list, xstyle);
  return (
    <ul {...rest} ref={ref} {...sx} className={[sx.className, className].filter(Boolean).join(' ')}>
      {list.map((it, i) => (
        <li key={it.name} {...stylex.props(styles.row, toneStyle(it.tone ?? tone))}>
          <span
            aria-hidden="true"
            {...stylex.props(styles.fill, chartMotion.growX)}
            style={{ animationDelay: `${i * 50}ms`, width: `${(it.value / max) * 100}%` }}
          />
          <span {...stylex.props(styles.name)}>
            {ranked && <span {...stylex.props(styles.rank)}>{i + 1}</span>}
            {it.icon}
            {it.href ? (
              <a href={it.href} {...stylex.props(styles.link)}>
                {it.name}
              </a>
            ) : (
              it.name
            )}
          </span>
          <span {...stylex.props(styles.value)}>{fmt(it.value)}</span>
        </li>
      ))}
    </ul>
  );
}
