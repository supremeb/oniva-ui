import * as stylex from '@stylexjs/stylex';
import { focus } from '../../internal/focus';
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
    backgroundColor: {
      default: colors['--oniva-color-surface'],
      ':hover': colors['--oniva-color-surface-hover'],
    },
    borderColor: {
      default: colors['--oniva-color-border'],
      ':hover': colors['--oniva-color-border-hover'],
    },
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    height: 28,
    lineHeight: font['--oniva-font-lh-12'],
    maxWidth: 240,
    paddingInlineEnd: 10,
    paddingInlineStart: 4,
    textDecoration: 'none',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-11'],
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 20,
    justifyContent: 'center',
    textTransform: 'uppercase',
    width: 20,
  },
  title: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  host: {
    color: colors['--oniva-color-text-muted'],
    flexShrink: 0,
    fontWeight: font['--oniva-font-weight-regular'],
  },
});

export interface SourceChipProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'style' | 'title' | 'href'
> {
  title: string;
  url: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLAnchorElement>;
}

/** Compact pill linking to a web source: initial badge, title, host. */
export function SourceChip({ title, url, className, xstyle, ref, ...rest }: SourceChipProps) {
  const host = hostOf(url);
  const sx = stylex.props(styles.base, focus.ring, xstyle);
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
