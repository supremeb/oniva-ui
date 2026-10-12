import * as stylex from '@stylexjs/stylex';
import type { AnchorHTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { hostOf, safeUrl } from '../../internal/ai-motion';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  base: {
    alignItems: 'center',
    backgroundColor: { default: colors.surface, ':hover': colors.surfaceHover },
    borderColor: { default: colors.border, ':hover': colors.borderHover },
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.xs,
    boxSizing: 'border-box',
    color: colors.text,
    display: 'inline-flex',
    fontFamily: font.sans,
    fontSize: font.size12,
    fontWeight: font.weightMedium,
    gap: 6,
    height: 28,
    lineHeight: font.lh12,
    maxWidth: 240,
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingInlineEnd: 10,
    paddingInlineStart: 4,
    textDecoration: 'none',
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, border-color',
    transitionTimingFunction: motion.easeStandard,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.full,
    color: colors.accentSoftFg,
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font.size11,
    fontWeight: font.weightSemibold,
    height: 20,
    justifyContent: 'center',
    textTransform: 'uppercase',
    width: 20,
  },
  title: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  host: { color: colors.textMuted, flexShrink: 0, fontWeight: font.weightRegular },
});

export interface SourceChipProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'style' | 'title' | 'href'> {
  title: string;
  url: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLAnchorElement>;
}

/** Compact pill linking to a web source: initial badge, title, host. */
export function SourceChip({ title, url, className, xstyle, ref, ...rest }: SourceChipProps) {
  const host = hostOf(url);
  const sx = stylex.props(styles.base, xstyle);
  return (
    <a
      {...rest}
      ref={ref}
      href={safeUrl(url)}
      target="_blank"
      rel="noopener noreferrer"
      {...mergeSx(sx, className)}
    >
      <span aria-hidden="true" {...stylex.props(styles.icon)}>
        {host.charAt(0)}
      </span>
      <span {...stylex.props(styles.title)}>{title}</span>
      <span {...stylex.props(styles.host)}>{host}</span>
    </a>
  );
}
