import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  root: {
    backgroundColor: colors.surfaceInset,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: 8,
    padding: 8,
  },
  title: {
    color: colors.textMuted,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    lineHeight: font.lh14,
    margin: 0,
    paddingBlock: 4,
    paddingInline: 8,
  },
  list: { display: 'grid', gap: 8, margin: 0 },
  col1: { gridTemplateColumns: '1fr' },
  col2: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
  item: {
    alignItems: 'center',
    backgroundColor: colors.surfaceInner,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.xs,
    boxSizing: 'border-box',
    display: 'flex',
    gap: 12,
    margin: 0,
    minHeight: 56,
    paddingBlock: 10,
    paddingInline: 12,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.surfaceInset,
    borderRadius: radius.md,
    color: colors.iconMuted,
    display: 'inline-flex',
    flexShrink: 0,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  text: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  term: {
    color: colors.textMuted,
    fontSize: font.size12,
    fontWeight: font.weightMedium,
    letterSpacing: font.trackCaption,
    lineHeight: font.lh12,
  },
  value: {
    color: colors.text,
    fontSize: font.size14,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font.weightMedium,
    lineHeight: font.lh14,
    margin: 0,
  },
});

export interface DescriptionListProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'style' | 'title'
> {
  /** Optional heading above the tiles. */
  title?: ReactNode;
  /** Number of tile columns. Default 1. */
  columns?: 1 | 2;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Key/value rows on white tiles inside a gray inset card. Use `DescriptionItem` children. */
export function DescriptionList({
  title,
  columns = 1,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: DescriptionListProps) {
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      {title && <h3 {...stylex.props(styles.title)}>{title}</h3>}
      <dl {...stylex.props(styles.list, columns === 2 ? styles.col2 : styles.col1)}>{children}</dl>
    </div>
  );
}

export interface DescriptionItemProps {
  /** Term (key). */
  label: ReactNode;
  /** Leading icon shown in a small inset square. */
  icon?: ReactNode;
  /** Description (value). */
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
}

export function DescriptionItem({ label, icon, children, xstyle }: DescriptionItemProps) {
  return (
    <div {...stylex.props(styles.item, xstyle)}>
      {icon && (
        <span aria-hidden="true" {...stylex.props(styles.icon)}>
          {icon}
        </span>
      )}
      <span {...stylex.props(styles.text)}>
        <dt {...stylex.props(styles.term)}>{label}</dt>
        <dd {...stylex.props(styles.value)}>{children}</dd>
      </span>
    </div>
  );
}
