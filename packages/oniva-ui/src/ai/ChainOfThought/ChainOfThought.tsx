import * as stylex from '@stylexjs/stylex';
import { Check, ChevronRight, ListTree } from 'lucide-react';
import { useId, useState, type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { hostOf, safeUrl } from '../../internal/ai-motion';
import { mergeSx } from '../../internal/sx';
import { AnimatedHeight } from '../../motion/AnimatedHeight';

const stepIn = stylex.keyframes({
  from: { opacity: 0, transform: `translateY(${motion['--oniva-motion-travel']})` },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const ping = stylex.keyframes({
  '0%': { opacity: 0.5, transform: 'scale(1)' },
  '100%': { opacity: 0, transform: 'scale(2.4)' },
});

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'] },
  trigger: { color: colors['--oniva-color-text-muted'], gap: 6, paddingBlock: 4, width: 'auto', alignSelf: 'flex-start' },
  list: { display: 'flex', flexDirection: 'column', listStyle: 'none', margin: 0, paddingBlock: 8, paddingInline: 0 },
  step: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: stepIn, [media.reducedMotion]: 'none' },
    animationDelay: 'calc(var(--oniva-i, 0) * 60ms)',
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'grid',
    gap: 12,
    gridTemplateColumns: '16px 1fr',
    position: 'relative',
  },
  rail: { alignItems: 'center', display: 'flex', flexDirection: 'column' },
  line: {
    backgroundColor: colors['--oniva-color-border'],
    flexGrow: 1,
    minHeight: 12,
    width: 2,
  },
  dot: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-full'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-on-solid'],
    display: 'flex',
    flexShrink: 0,
    height: 16,
    justifyContent: 'center',
    marginBlockStart: 2,
    position: 'relative',
    width: 16,
  },
  dotComplete: { backgroundColor: colors['--oniva-color-success-solid'] },
  dotActive: { backgroundColor: colors['--oniva-color-accent-soft-fg'] },
  dotPending: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border-control'],
    borderStyle: 'solid',
    borderWidth: 2,
  },
  halo: {
    animationDuration: '1400ms',
    animationIterationCount: 'infinite',
    animationName: { default: ping, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-accent-soft-fg'],
    borderRadius: radius['--oniva-radius-full'],
    inset: 0,
    position: 'absolute',
  },
  body: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, paddingBlockEnd: 14 },
  label: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], lineHeight: font['--oniva-font-lh-18'] },
  labelPending: { color: colors['--oniva-color-text-subtle'] },
  desc: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], lineHeight: font['--oniva-font-lh-16'], margin: 0 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 6,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingBlock: 2,
    paddingInline: 8,
    textDecoration: 'none',
  },
  chipHost: { color: colors['--oniva-color-text-muted'] },
  images: { display: 'flex', gap: 8 },
  img: { borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-md'], borderStyle: 'solid', borderWidth: 1, height: 64, objectFit: 'cover', width: 96 },
});

export type ChainOfThoughtStatus = 'complete' | 'active' | 'pending';
export interface ChainOfThoughtStep {
  id: string;
  label: string;
  status: ChainOfThoughtStatus;
  description?: ReactNode;
  results?: { title: string; url: string }[];
  images?: { src: string; alt: string }[];
}

export interface ChainOfThoughtProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  steps: ChainOfThoughtStep[];
  /** Header text. Default "Chain of thought". */
  title?: string;
  defaultOpen?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Collapsible timeline of agent reasoning steps with status dots, search-result chips and images. */
export function ChainOfThought({ steps, title = 'Chain of thought', defaultOpen = true, className, xstyle, ref, ...rest }: ChainOfThoughtProps) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <button type="button" aria-expanded={open} aria-controls={uid} onClick={() => setOpen((o) => !o)} {...stylex.props(aiStyles.triggerReset, styles.trigger)}>
        <ListTree size={14} aria-hidden="true" />
        <span>{title}</span>
        <ChevronRight size={14} aria-hidden="true" {...stylex.props(aiStyles.chevron, open && aiStyles.chevronOpen)} />
      </button>
      <AnimatedHeight isOpen={open} id={uid}>
        <ol {...stylex.props(styles.list)}>
          {steps.map((s, i) => (
            <li
              key={s.id}
              aria-current={s.status === 'active' ? 'step' : undefined}
              style={{ '--oniva-i': Math.min(i, 6) } as CSSProperties}
              {...stylex.props(styles.step)}
            >
              <div {...stylex.props(styles.rail)}>
                <span
                  {...stylex.props(styles.dot, s.status === 'complete' && styles.dotComplete, s.status === 'active' && styles.dotActive, s.status === 'pending' && styles.dotPending)}
                >
                  {s.status === 'active' && <span aria-hidden="true" {...stylex.props(styles.halo)} />}
                  {s.status === 'complete' && <Check size={10} strokeWidth={3} aria-hidden="true" />}
                </span>
                {i < steps.length - 1 && <span aria-hidden="true" {...stylex.props(styles.line)} />}
              </div>
              <div {...stylex.props(styles.body)}>
                <span {...stylex.props(styles.label, s.status === 'pending' && styles.labelPending)}>
                  {s.label}
                  <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}> ({s.status})</span>
                </span>
                {s.description && <p {...stylex.props(styles.desc)}>{s.description}</p>}
                {s.results && s.results.length > 0 && (
                  <div {...stylex.props(styles.chips)}>
                    {s.results.map((r) => (
                      <a key={r.url} href={safeUrl(r.url)} target="_blank" rel="noopener noreferrer" {...stylex.props(styles.chip)}>
                        {r.title}
                        <span {...stylex.props(styles.chipHost)}>{hostOf(r.url)}</span>
                      </a>
                    ))}
                  </div>
                )}
                {s.images && s.images.length > 0 && (
                  <div {...stylex.props(styles.images)}>
                    {s.images.map((im) => (
                      <img key={im.src} src={im.src} alt={im.alt} {...stylex.props(styles.img)} />
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </AnimatedHeight>
    </div>
  );
}
