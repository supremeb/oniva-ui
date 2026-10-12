import * as stylex from '@stylexjs/stylex';
import type { Ref } from 'react';
import { Link } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { hostOf, safeUrl } from '../../internal/ai-motion';
import { Tooltip } from '../../components/Tooltip';

const styles = stylex.create({
  base: {
    alignItems: 'center',
    backgroundColor: { default: colors.surfaceTertiary, ':hover': colors.accentSoft },
    borderRadius: radius.full,
    boxSizing: 'border-box',
    color: { default: colors.textOnTertiary, ':hover': colors.accentSoftFg },
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font.sans,
    fontSize: font.size11,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font.weightSemibold,
    height: 18,
    justifyContent: 'center',
    marginInline: 2,
    minWidth: 18,
    outlineColor: colors.focusRing,
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingInline: 5,
    textDecoration: 'none',
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, color',
    verticalAlign: 'text-top',
  },
  tip: { display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 240 },
  tipHost: { opacity: 0.7 },
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
  return (
    <Tooltip
      content={
        <span {...stylex.props(styles.tip)}>
          <strong>{title}</strong>
          <span {...stylex.props(styles.tipHost)}>{hostOf(url)}</span>
        </span>
      }
    >
      <Link
        ref={ref}
        href={safeUrl(url)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Source ${index}: ${title}`}
        className={() => stylex.props(styles.base, xstyle).className ?? ''}
      >
        {index}
      </Link>
    </Tooltip>
  );
}
