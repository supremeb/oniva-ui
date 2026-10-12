import * as stylex from '@stylexjs/stylex';
import { ChevronRight } from 'lucide-react';
import { useId, useState, type HTMLAttributes, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { hostOf, safeUrl } from '../../internal/ai-motion';
import { mergeSx } from '../../internal/sx';
import { AnimatedHeight } from '../../motion/AnimatedHeight';

const styles = stylex.create({
  root: { fontFamily: font['--oniva-font-sans'] },
  trigger: { color: colors['--oniva-color-text-muted'], gap: 8, paddingBlock: 4, width: 'auto' },
  stack: { display: 'inline-flex' },
  fav: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 2,
    boxSizing: 'border-box',
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'inline-flex',
    fontSize: 9,
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 18,
    justifyContent: 'center',
    marginInlineStart: -6,
    textTransform: 'uppercase',
    width: 18,
  },
  favFirst: { marginInlineStart: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', margin: 0, paddingBlock: 6, paddingInline: 0 },
  link: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] },
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 10,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: -2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingBlock: 6,
    paddingInline: 8,
    textDecoration: 'none',
    transitionDuration: motion['--oniva-motion-dur-instant'],
    transitionProperty: 'background-color',
  },
  num: { color: colors['--oniva-color-text-subtle'], fontVariantNumeric: 'tabular-nums', minWidth: 14 },
  name: { flexGrow: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  host: { color: colors['--oniva-color-text-muted'], flexShrink: 0, fontSize: font['--oniva-font-size-12'] },
  img: { borderRadius: radius['--oniva-radius-full'], height: 16, width: 16 },
});

export interface SourceItem {
  title: string;
  url: string;
  /** Optional favicon image URL; falls back to the host initial. */
  favicon?: string;
}

export interface SourcesProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  sources: SourceItem[];
  defaultOpen?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

function Fav({ s }: { s: SourceItem }) {
  return s.favicon ? <img src={s.favicon} alt="" {...stylex.props(styles.img)} /> : <>{hostOf(s.url).charAt(0)}</>;
}

/** "Used 6 sources" disclosure: stacked favicons in the trigger, numbered link list in the panel. */
export function Sources({ sources, defaultOpen = false, className, xstyle, ref, ...rest }: SourcesProps) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <button type="button" aria-expanded={open} aria-controls={uid} onClick={() => setOpen((o) => !o)} {...stylex.props(aiStyles.triggerReset, styles.trigger)}>
        <span aria-hidden="true" {...stylex.props(styles.stack)}>
          {sources.slice(0, 4).map((s, i) => (
            <span key={s.url} {...stylex.props(styles.fav, i === 0 && styles.favFirst)}>
              <Fav s={s} />
            </span>
          ))}
        </span>
        <span>
          Used {sources.length} {sources.length === 1 ? 'source' : 'sources'}
        </span>
        <ChevronRight size={14} aria-hidden="true" {...stylex.props(aiStyles.chevron, open && aiStyles.chevronOpen)} />
      </button>
      <AnimatedHeight isOpen={open} id={uid}>
        <ol {...stylex.props(styles.list)}>
          {sources.map((s, i) => (
            <li key={s.url}>
              <a href={safeUrl(s.url)} target="_blank" rel="noopener noreferrer" {...stylex.props(styles.link)}>
                <span {...stylex.props(styles.num)}>{i + 1}</span>
                <span aria-hidden="true" {...stylex.props(styles.fav, styles.favFirst)}>
                  <Fav s={s} />
                </span>
                <span {...stylex.props(styles.name)}>{s.title}</span>
                <span {...stylex.props(styles.host)}>{hostOf(s.url)}</span>
              </a>
            </li>
          ))}
        </ol>
      </AnimatedHeight>
    </div>
  );
}
