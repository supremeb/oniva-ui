import * as stylex from '@stylexjs/stylex';
import { ExternalLinkIcon } from '../../icons/IconSet';
import type { ReactNode, Ref } from 'react';
import { Link } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { hostOf, safeUrl } from '../../internal/ai-motion';
import { aib } from '../../internal/aib-styles';
import { focus } from '../../internal/focus';
import { sxClass } from '../../internal/sx';
import { HoverCard, HoverCardContent } from '../../components/HoverCard';

const styles = stylex.create({
  cite: {
    alignItems: 'center',
    backgroundColor: {
      default: colors['--oniva-color-accent-soft'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-accent-soft-hover'] },
    },
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-accent-soft-fg'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-11'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    height: 18,
    justifyContent: 'center',
    marginInlineEnd: 0,
    marginInlineStart: 3,
    minWidth: 18,
    paddingInline: 5,
    textDecoration: 'none',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    verticalAlign: 'baseline',
  },
  inert: { cursor: 'default' },
  card: { display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 300, overflowWrap: 'anywhere' },
  snippet: { margin: 0 },
  open: {
    alignItems: 'center',
    color: {
      default: colors['--oniva-color-accent-fg'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-text'] },
    },
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 4,
    textDecoration: { default: 'none', ':hover': { default: null, [media.hover]: 'underline' } },
  },
});

export interface InlineCitationProps {
  /** Footnote number shown in the pill. */
  index: number;
  title: string;
  url: string;
  /** Excerpt shown in the hover card. */
  snippet?: string;
  /** e.g. `Oct 2, 2026`. */
  date?: string;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLAnchorElement>;
}

/** Numbered footnote pill. Hover or focus opens a preview card with the source title, host and excerpt. */
export function InlineCitation({ index, title, url, snippet, date, xstyle, ref }: InlineCitationProps) {
  const href = safeUrl(url);
  const source = [href && /^https?:/i.test(href) ? hostOf(href) : '', date ?? ''].filter(Boolean).join(' · ');
  return (
    <HoverCard delay={150}>
      <Link ref={ref} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Source ${index}: ${title}`} className={() => sxClass(stylex.props(styles.cite, focus.ring, !href && styles.inert, xstyle))}>
        {index}
      </Link>
      <HoverCardContent aria-label={`Source ${index} preview`}>
        <div {...stylex.props(styles.card)}>
          <p {...stylex.props(aib.name)}>{title}</p>
          {source && <p {...stylex.props(aib.meta)}>{source}</p>}
          {snippet && <p {...stylex.props(aib.meta, styles.snippet)}>{snippet}</p>}
          {href && (
            <a href={href} target="_blank" rel="noopener noreferrer" {...stylex.props(styles.open, focus.ring)}>
              Open source <ExternalLinkIcon size={12} aria-hidden />
            </a>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
