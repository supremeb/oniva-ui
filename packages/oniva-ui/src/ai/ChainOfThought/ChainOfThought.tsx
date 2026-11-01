import * as stylex from '@stylexjs/stylex';
import { CheckIcon, ChevronRightIcon, SparklesIcon } from '../../icons/IconSet';
import { useEffect, useId, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { focus } from '../../internal/focus';
import { formatDuration, hostOf, safeUrl } from '../../internal/ai-motion';
import { pluralize } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { Shimmer } from '../../motion/Shimmer';
import { TextReveal } from '../../motion/TextReveal';

const stepIn = stylex.keyframes({
  from: { opacity: 0, transform: `translateY(${motion['--oniva-motion-travel']})` },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const fadeIn = stylex.keyframes({ from: { filter: 'blur(2px)', opacity: 0 }, to: { filter: 'blur(0)', opacity: 1 } });
const ping = stylex.keyframes({
  '0%': { opacity: 0.5, transform: 'scale(1)' },
  '100%': { opacity: 0, transform: 'scale(2.4)' },
});
const dotPop = stylex.keyframes({
  '0%': { transform: 'scale(0.7)' },
  '60%': { transform: 'scale(1.12)' },
  '100%': { transform: 'scale(1)' },
});
const checkDraw = stylex.keyframes({ from: { strokeDashoffset: 24 }, to: { strokeDashoffset: 0 } });
const chipPop = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.95)' },
  to: { opacity: 1, transform: 'scale(1)' },
});
const twinkle = stylex.keyframes({
  '0%, 100%': { opacity: 1, transform: 'scale(1) rotate(0deg)' },
  '50%': { opacity: 0.55, transform: 'scale(0.82) rotate(18deg)' },
});

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'] },
  trigger: { color: colors['--oniva-color-text-muted'], gap: 6, paddingBlock: 4, width: 'auto', alignSelf: 'flex-start' },
  lead: { display: 'inline-flex', flexShrink: 0 },
  leadLive: {
    animationDuration: '1600ms',
    animationIterationCount: 'infinite',
    animationName: { default: twinkle, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-in-out'],
    color: colors['--oniva-color-text-muted'],
  },
  // Re-keyed on every label change, so the text always arrives with a short blur-fade instead of snapping.
  label: {
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: fadeIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    fontVariantNumeric: 'tabular-nums',
  },
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
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'background-color, border-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 16,
  },
  dotComplete: {
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationName: { default: dotPop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderColor: colors['--oniva-color-border-control'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text-muted'],
  },
  dotActive: {
    backgroundColor: colors['--oniva-color-text-muted'],
    borderColor: colors['--oniva-color-text-muted'],
    borderStyle: 'solid',
    borderWidth: 2,
  },
  dotPending: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border-control'],
    borderStyle: 'solid',
    borderWidth: 2,
  },
  check: {
    animationDelay: '60ms',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: checkDraw, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    strokeDasharray: 24,
  },
  halo: {
    animationDuration: '1400ms',
    animationIterationCount: 'infinite',
    animationName: { default: ping, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-text-muted'],
    borderRadius: radius['--oniva-radius-full'],
    inset: 0,
    position: 'absolute',
  },
  body: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, paddingBlockEnd: 14 },
  label2: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-18'],
    overflowWrap: 'anywhere',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'color',
  },
  labelPending: { color: colors['--oniva-color-text-subtle'] },
  desc: {
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: fadeIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    lineHeight: font['--oniva-font-lh-16'],
    margin: 0,
    overflowWrap: 'anywhere',
  },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip: {
    alignItems: 'center',
    animationDelay: 'calc(var(--oniva-j, 0) * 70ms + 80ms)',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: chipPop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: {
      default: colors['--oniva-color-surface'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 6,
    maxWidth: '100%',
    minWidth: 0,
    paddingBlock: 2,
    paddingInline: 8,
    textDecoration: 'none',
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'background-color',
  },
  chipTitle: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  chipHost: { color: colors['--oniva-color-text-muted'], flexShrink: 0 },
  images: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  img: {
    animationDelay: 'calc(var(--oniva-j, 0) * 90ms + 100ms)',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: chipPop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    height: 64,
    objectFit: 'cover',
    width: 96,
  },
  sr: {
    borderWidth: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
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
  /** Header text when idle. Default "Chain of thought". */
  title?: string;
  defaultOpen?: boolean;
  /** Live run: the header shimmers ("Thinking…"), the sparkle pulses and active descriptions stream in word by word. */
  isStreaming?: boolean;
  /** Seconds the run took. Once streaming ends the header reads "Thought for N seconds". */
  durationSeconds?: number;
  /** Header text while `isStreaming`. Default "Thinking…". */
  streamingLabel?: string;
  /** Collapse the timeline `closeDelayMs` after streaming ends (a manual toggle wins). Default `false`. */
  autoCollapse?: boolean;
  closeDelayMs?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Collapsible timeline of agent reasoning steps. Steps arrive with a staggered rise, dots morph pending -> active -> done
 * (pulse halo, then a drawn check), and the header crossfades between "Thinking…" and
 * "Thought for N seconds". Appending steps while `isStreaming` animates only the new ones.
 */
export function ChainOfThought({
  steps,
  title = 'Chain of thought',
  defaultOpen = true,
  isStreaming = false,
  durationSeconds,
  streamingLabel = 'Thinking…',
  autoCollapse = false,
  closeDelayMs = 900,
  className,
  xstyle,
  ref,
  ...rest
}: ChainOfThoughtProps) {
  const [open, setOpen] = useState(defaultOpen);
  const uid = useId();
  const touched = useRef(false);
  const was = useRef(isStreaming);
  // Steps present at first paint stagger in together; steps appended later arrive on their own, without delay.
  const initialCount = useRef(steps.length);

  useEffect(() => {
    if (isStreaming) {
      was.current = true;
      return;
    }
    if (!was.current || !autoCollapse) return;
    was.current = false;
    const id = setTimeout(() => {
      if (!touched.current) setOpen(false);
    }, closeDelayMs);
    return () => clearTimeout(id);
  }, [isStreaming, autoCollapse, closeDelayMs]);

  const label = isStreaming
    ? streamingLabel
    : durationSeconds != null && durationSeconds > 0
      ? `Thought for ${durationSeconds < 60 ? pluralize(durationSeconds, { one: '# second', other: '# seconds' }) : formatDuration(durationSeconds)}`
      : title;

  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={uid}
        onClick={() => {
          touched.current = true;
          setOpen((o) => !o);
        }}
        {...stylex.props(aiStyles.triggerReset, styles.trigger, focus.ring)}
      >
        <span aria-hidden="true" {...stylex.props(styles.lead, isStreaming && styles.leadLive)}>
          <SparklesIcon size={14} />
        </span>
        <span role="status" {...stylex.props(styles.label)} key={label}>
          {isStreaming ? <Shimmer>{label}</Shimmer> : label}
        </span>
        <ChevronRightIcon size={14} aria-hidden="true" {...stylex.props(aiStyles.chevron, open && aiStyles.chevronOpen)} />
      </button>
      <AnimatedHeight isOpen={open && steps.length > 0} id={uid}>
        <ol {...stylex.props(styles.list)}>
          {steps.map((s, i) => {
            const fresh = i >= initialCount.current;
            const done = s.status === 'complete';
            return (
              <li
                key={s.id}
                aria-current={s.status === 'active' ? 'step' : undefined}
                style={{ '--oniva-i': fresh ? 0 : Math.min(i, 6) } as CSSProperties}
                {...stylex.props(styles.step)}
              >
                <div {...stylex.props(styles.rail)}>
                  <span {...stylex.props(styles.dot, done && styles.dotComplete, s.status === 'active' && styles.dotActive, s.status === 'pending' && styles.dotPending)}>
                    {s.status === 'active' && <span aria-hidden="true" {...stylex.props(styles.halo)} />}
                    {done && <CheckIcon size={10} strokeWidth={2.25} aria-hidden="true" {...stylex.props(styles.check)} />}
                  </span>
                  {i < steps.length - 1 && (
                    <span aria-hidden="true" {...stylex.props(styles.line)} />
                  )}
                </div>
                <div {...stylex.props(styles.body)}>
                  <span {...stylex.props(styles.label2, s.status === 'pending' && styles.labelPending)}>
                    {s.status === 'active' && isStreaming ? <Shimmer>{s.label}</Shimmer> : s.label}
                    <span {...stylex.props(styles.sr)}> ({s.status})</span>
                  </span>
                  {s.description && (
                    <p key={s.status} {...stylex.props(styles.desc)}>
                      {isStreaming && s.status === 'active' && typeof s.description === 'string' ? <TextReveal text={s.description} staggerMs={40} /> : s.description}
                    </p>
                  )}
                  {s.results && s.results.length > 0 && (
                    <div {...stylex.props(styles.chips)}>
                      {s.results.map((r, j) => (
                        <a key={r.url} href={safeUrl(r.url)} target="_blank" rel="noopener noreferrer" title={r.title} style={{ '--oniva-j': j } as CSSProperties} {...stylex.props(styles.chip, focus.ring)}>
                          <span {...stylex.props(styles.chipTitle)}>{r.title}</span>
                          <span {...stylex.props(styles.chipHost)}>{hostOf(r.url)}</span>
                        </a>
                      ))}
                    </div>
                  )}
                  {s.images && s.images.length > 0 && (
                    <div {...stylex.props(styles.images)}>
                      {s.images.map((im, j) => (
                        <img key={im.src} src={im.src} alt={im.alt} style={{ '--oniva-j': j } as CSSProperties} {...stylex.props(styles.img)} />
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </AnimatedHeight>
    </div>
  );
}
