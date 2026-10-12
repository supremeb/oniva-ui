import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  card: {
    boxSizing: 'border-box',
    color: colors.text,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: 4,
  },
  inset: {
    backgroundColor: colors.surfaceInset,
    borderRadius: radius.card,
    padding: 8,
  },
  outline: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.xs,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    paddingBlock: 6,
    paddingInline: 8,
  },
  headerText: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  title: {
    color: colors.textMuted,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    lineHeight: font.lh14,
    margin: 0,
  },
  description: {
    color: colors.textMuted,
    fontSize: font.size12,
    lineHeight: font.lh12,
    margin: 0,
  },
  content: { display: 'flex', flexDirection: 'column', gap: 8 },
  footer: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
    paddingBlock: 6,
    paddingInline: 8,
  },
  tile: {
    backgroundColor: colors.surfaceInner,
    borderRadius: radius.lg,
    boxShadow: shadow.xs,
    boxSizing: 'border-box',
  },
  tileNone: { padding: 0 },
  tileSm: { padding: 8 },
  tileMd: { padding: 12 },
  tileLg: { padding: 16 },
});

type DivProps = Omit<HTMLAttributes<HTMLDivElement>, 'style'> & {
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
};

function Div({
  sx: base,
  xstyle,
  className,
  ref,
  as: Tag = 'div',
  ...rest
}: DivProps & { sx: stylex.StyleXStyles[]; as?: 'div' | 'section' | 'footer' | 'header' }) {
  const sx = stylex.props(...base, xstyle);
  return (
    <Tag
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    />
  );
}

export interface CardProps extends DivProps {
  /** `inset` is the BoardUI-style gray outer card that holds white `Tile`s. */
  variant?: 'inset' | 'outline';
}

export function Card({ variant = 'inset', ...props }: CardProps) {
  return <Div as="section" sx={[styles.card, styles[variant]]} {...props} />;
}

export function CardHeader(props: DivProps) {
  return <Div as="header" sx={[styles.header]} {...props} />;
}

export function CardTitle({
  as: Tag = 'h3',
  xstyle,
  className,
  ref,
  ...rest
}: Omit<HTMLAttributes<HTMLHeadingElement>, 'style'> & {
  /** Heading level; pick the one that fits the page outline. */
  as?: 'h2' | 'h3' | 'h4' | 'h5' | 'div';
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLHeadingElement>;
}) {
  const sx = stylex.props(styles.title, xstyle);
  return (
    <Tag
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    />
  );
}

export function CardDescription({
  xstyle,
  className,
  ref,
  ...rest
}: Omit<HTMLAttributes<HTMLParagraphElement>, 'style'> & {
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLParagraphElement>;
}) {
  const sx = stylex.props(styles.description, xstyle);
  return (
    <p
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    />
  );
}

/** Groups header text (title + description) so an action can sit on the right of `CardHeader`. */
export function CardHeaderText(props: DivProps) {
  return <Div sx={[styles.headerText]} {...props} />;
}

export function CardContent(props: DivProps) {
  return <Div sx={[styles.content]} {...props} />;
}

export function CardFooter(props: DivProps) {
  return <Div as="footer" sx={[styles.footer]} {...props} />;
}

export interface TileProps extends DivProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/** White inner surface that sits inside an inset `Card`. */
export function Tile({ padding = 'md', ...props }: TileProps) {
  const pad = { none: styles.tileNone, sm: styles.tileSm, md: styles.tileMd, lg: styles.tileLg }[
    padding
  ];
  return <Div sx={[styles.tile, pad]} {...props} />;
}
