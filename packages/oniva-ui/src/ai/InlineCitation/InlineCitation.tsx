import * as stylex from '@stylexjs/stylex';
import { ExternalLink } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { Link } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { hostOf, safeUrl } from '../../internal/ai-motion';
import { aib } from '../../internal/aib-styles';
import { sxClass } from '../../internal/sx';
import { HoverCard, HoverCardContent } from '../../components/HoverCard';

const styles = stylex.create({
  cite: {
    alignItems: 'center',
    backgroundColor: {
      default: colors['--oniva-color-accent-soft'],
      ':hover': colors['--oniva-color-accent-soft-hover'],
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
    marginInline: 2,
    minWidth: 18,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingInline: 5,
    textDecoration: 'none',
    verticalAlign: 'baseline',
  },
  card: { display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 300 },
  snippet: { margin: 0 },
  open: { alignItems: 'center', color: colors['--oniva-color-accent-fg'], display: 'inline-flex', fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-medium'], gap: 4, textDecoration: 'none' },
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
  return (
    <HoverCard delay={150}>
      <Link ref={ref} href={href} target="_blank" rel="noreferrer" aria-label={`Source ${index}: ${title}`} className={() => sxClass(stylex.props(styles.cite, xstyle))}>
        {index}
      </Link>
      <HoverCardContent>
        <div {...stylex.props(styles.card)}>
          <p {...stylex.props(aib.name)}>{title}</p>
          <p {...stylex.props(aib.meta)}>{hostOf(url)}{date ? ` · ${date}` : ''}</p>
          {snippet && <p {...stylex.props(aib.meta, styles.snippet)}>{snippet}</p>}
          {href && (
            <a href={href} target="_blank" rel="noreferrer" {...stylex.props(styles.open)}>
              Open source <ExternalLink size={12} />
            </a>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
