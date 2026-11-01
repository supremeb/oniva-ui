import * as stylex from '@stylexjs/stylex';
import type { Ref } from 'react';
import { Link } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { hostOf, safeUrl } from '../../internal/ai-motion';
import { focus } from '../../internal/focus';
import { Tooltip } from '../../components/Tooltip';

const styles = stylex.create({
  base: {
    alignItems: 'center',
    backgroundColor: {
      default: colors['--oniva-color-surface-tertiary'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-accent-soft'] },
      ':focus-visible': colors['--oniva-color-accent-soft'],
    },
    borderRadius: radius['--oniva-radius-full'],
    boxSizing: 'border-box',
    color: {
      default: colors['--oniva-color-text-on-tertiary'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-accent-soft-fg'] },
      ':focus-visible': colors['--oniva-color-accent-soft-fg'],
    },
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-11'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 18,
    justifyContent: 'center',
    marginInlineEnd: 1,
    marginInlineStart: 3,
    minWidth: 18,
    paddingInline: 5,
    textDecoration: 'none',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    verticalAlign: 'text-top',
  },
  inert: { cursor: 'default' },
  tip: { display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 240, overflowWrap: 'anywhere' },
  tipHost: { opacity: 0.75 },
});

export interface CitationProps {
  /** 1-based source number. */
  index: number;
  title: string;
  url: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLAnchorElement>;
}

/** Inline numbered citation pill; hover/focus reveals the source title and host. */
export function Citation({ index, title, url, xstyle, ref }: CitationProps) {
  const href = safeUrl(url);
  return (
    <Tooltip
      content={
        <span {...stylex.props(styles.tip)}>
          <strong>{title}</strong>
          {href ? <span {...stylex.props(styles.tipHost)}>{hostOf(href)}</span> : null}
        </span>
      }
    >
      <Link
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Source ${index}: ${title}`}
        className={() =>
          stylex.props(styles.base, focus.ring, !href && styles.inert, xstyle).className ?? ''
        }
      >
        {index}
      </Link>
    </Tooltip>
  );
}
