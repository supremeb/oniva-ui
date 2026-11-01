import * as stylex from '@stylexjs/stylex';
import { CheckIcon, ChevronDownIcon, SearchIcon, SparklesIcon } from '../../icons/IconSet';
import { useEffect, useId, useRef, useState, type CSSProperties, type HTMLAttributes, type Ref } from 'react';
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
import { VisuallyHidden } from '../../components/VisuallyHidden';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { Shimmer } from '../../motion/Shimmer';
import { TextReveal } from '../../motion/TextReveal';

const rise = stylex.keyframes({
  from: { opacity: 0, transform: `translateY(${motion['--oniva-motion-travel']})` },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const fadeIn = stylex.keyframes({ from: { filter: 'blur(2px)', opacity: 0 }, to: { filter: 'blur(0)', opacity: 1 } });
const twinkle = stylex.keyframes({
  '0%, 100%': { opacity: 1, transform: 'scale(1) rotate(0deg)' },
  '50%': { opacity: 0.55, transform: 'scale(0.8) rotate(20deg)' },
});
const checkDraw = stylex.keyframes({ from: { strokeDashoffset: 24 }, to: { strokeDashoffset: 0 } });

const styles = stylex.create({
  root: { alignItems: 'flex-start', display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'], maxWidth: '100%' },
  trigger: {
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-text-muted'],
    gap: 8,
    marginInline: -6,
    maxWidth: '100%',
    minWidth: 0,
    paddingBlock: 4,
    paddingInline: 6,
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'background-color',
    width: 'auto',
    backgroundColor: { default: 'transparent', ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] } },
  },
  spark: { color: colors['--oniva-color-icon-subtle'], display: 'inline-flex', flexShrink: 0 },
  sparkLive: {
    animationDuration: '1600ms',
    animationIterationCount: 'infinite',
    animationName: { default: twinkle, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-in-out'],
    color: colors['--oniva-color-accent-soft-fg'],
  },
  label: {
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: fadeIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  chevron: {
    color: colors['--oniva-color-icon-muted'],
    flexShrink: 0,
    transform: { default: 'rotate(0deg)', '[data-open]': 'rotate(180deg)' },
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  body: { marginBlockStart: 4, marginInlineStart: 5, paddingInlineStart: 16, position: 'relative' },
  // The hairline grows down the left edge while the panel opens (transform only).
  rail: {
    backgroundColor: colors['--oniva-color-border'],
    bottom: 4,
    insetInlineStart: 3,
    position: 'absolute',
    top: -6,
    transform: { default: 'scaleY(0)', '[data-open]': 'scaleY(1)' },
    transformOrigin: 'top',
    transitionDuration: motion['--oniva-motion-dur-slower'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 1,
  },
  list: { display: 'flex', flexDirection: 'column', gap: 4, listStyle: 'none', margin: 0, paddingBlock: 4, paddingInline: 0 },
  row: {
    alignItems: 'center',
    animationDelay: 'calc(var(--oniva-i, 0) * 120ms)',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    borderRadius: radius['--oniva-radius-sm'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    minHeight: 28,
    minWidth: 0,
    paddingBlock: 2,
    paddingInline: 6,
    textDecoration: 'none',
  },
  srcRow: { paddingInline: 0 },
  link: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-sm'],
    color: 'inherit',
    display: 'flex',
    flexGrow: 1,
    gap: 8,
    minWidth: 0,
    paddingBlock: 2,
    paddingInline: 6,
    textDecoration: 'none',
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'background-color',
    backgroundColor: { default: 'transparent', ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] } },
  },
  textRow: {
    alignItems: 'flex-start',
    color: colors['--oniva-color-text-muted'],
    lineHeight: font['--oniva-font-lh-20'],
    paddingInline: 6,
  },
  wrap: { minWidth: 0, overflowWrap: 'anywhere' },
  verb: { flexShrink: 0 },
  icon: { color: colors['--oniva-color-icon-subtle'], flexShrink: 0 },
  check: {
    animationDelay: 'calc(var(--oniva-i, 0) * 120ms + 120ms)',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: checkDraw, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    strokeDasharray: 24,
  },
  main: { fontWeight: font['--oniva-font-weight-medium'], minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  mono: {
    color: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-12'],
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  meta: { color: colors['--oniva-color-text-muted'], flexShrink: 0, fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  host: { color: colors['--oniva-color-text-muted'], flexShrink: 0, fontSize: font['--oniva-font-size-12'] },
  add: { color: colors['--oniva-color-success-fg'], flexShrink: 0, fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  del: { color: colors['--oniva-color-danger-fg'], flexShrink: 0, fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  more: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  tile: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-on-chart'],
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: 9,
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 16,
    justifyContent: 'center',
    textTransform: 'uppercase',
    width: 16,
  },
  tone1: { backgroundColor: colors['--oniva-color-chart-1'] },
  tone2: { backgroundColor: colors['--oniva-color-chart-2'] },
  tone3: { backgroundColor: colors['--oniva-color-chart-3'] },
  tone4: { backgroundColor: colors['--oniva-color-chart-4'] },
  tone5: { backgroundColor: colors['--oniva-color-chart-5'] },
});
const tones = [styles.tone1, styles.tone2, styles.tone3, styles.tone4, styles.tone5];
const toneFor = (s: string) => tones[[...s].reduce((n, c) => n + c.charCodeAt(0), 0) % tones.length];

export type ThinkingTraceItem =
  | { kind: 'step'; id: string; label: string; detail?: string }
  | { kind: 'text'; id: string; text: string }
  | { kind: 'query'; id: string; query: string }
  | { kind: 'source'; id: string; title: string; url: string }
  | { kind: 'tool'; id: string; verb: string; target: string; added?: number; removed?: number }
  | { kind: 'more'; id: string; count: number };

export interface ThinkingTraceProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  items: ThinkingTraceItem[];
  /** Header text. Defaults to "Thinking…" while streaming, "Thought for N seconds" after, else "Thought process". */
  label?: string;
  isStreaming?: boolean;
  durationSeconds?: number;
  defaultOpen?: boolean;
  /** Collapse `closeDelayMs` after streaming ends (a manual toggle wins). Default `false`. */
  autoCollapse?: boolean;
  closeDelayMs?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Expandable trace of what the model did: plain steps, reasoning text, web searches with sources, or tool runs.
 * One shape (`items`), four looks. Opening grows the hairline rail and rises rows in on a 120ms stagger (replayed on
 * every open); rows appended while `isStreaming` arrive alone. The header label blur-fades between states.
 */
export function ThinkingTrace({
  items,
  label,
  isStreaming = false,
  durationSeconds,
  defaultOpen = false,
  autoCollapse = false,
  closeDelayMs = 900,
  className,
  xstyle,
  ref,
  ...rest
}: ThinkingTraceProps) {
  const [open, setOpen] = useState(defaultOpen);
  // Bumped on every open so the rows remount and replay their entrance.
  const [openCount, setOpenCount] = useState(defaultOpen ? 1 : 0);
  const uid = useId();
  const touched = useRef(false);
  const was = useRef(isStreaming);
  const staggerUntil = useRef(items.length);

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

  const text =
    label ??
    (isStreaming
      ? 'Thinking…'
      : durationSeconds != null && durationSeconds > 0
        ? `Thought for ${durationSeconds < 60 ? pluralize(durationSeconds, { one: '# second', other: '# seconds' }) : formatDuration(durationSeconds)}`
        : 'Thought process');

  const toggle = () => {
    touched.current = true;
    if (!open) {
      staggerUntil.current = items.length;
      setOpenCount((c) => c + 1);
    }
    setOpen(!open);
  };

  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <button type="button" aria-expanded={open} aria-controls={uid} onClick={toggle} {...stylex.props(aiStyles.triggerReset, styles.trigger)}>
        <span aria-hidden="true" {...stylex.props(styles.spark, isStreaming && styles.sparkLive)}>
          <SparklesIcon size={16} />
        </span>
        <span key={text} {...stylex.props(styles.label)}>
          {isStreaming && label == null ? <Shimmer>{text}</Shimmer> : text}
        </span>
        <span data-open={open ? '' : undefined} aria-hidden="true" {...stylex.props(styles.chevron)}>
          <ChevronDownIcon size={14} />
        </span>
      </button>
      <VisuallyHidden role="status">{text}</VisuallyHidden>
      <AnimatedHeight isOpen={open} id={uid}>
        <div {...stylex.props(styles.body)}>
          <span aria-hidden="true" data-open={open ? '' : undefined} {...stylex.props(styles.rail)} />
          <ul key={openCount} {...stylex.props(styles.list)}>
            {items.map((it, i) => {
              const delay = i < staggerUntil.current ? Math.min(i, 8) : 0;
              const vars = { '--oniva-i': delay } as CSSProperties;
              const isLast = i === items.length - 1;
              switch (it.kind) {
                case 'step':
                  return (
                    <li key={it.id} style={vars} {...stylex.props(styles.row)}>
                      <CheckIcon size={14} strokeWidth={1.875} aria-hidden="true" {...stylex.props(styles.icon, styles.check)} />
                      <span title={it.label} {...stylex.props(styles.main)}>
                        {it.label}
                      </span>
                      {it.detail && <span {...stylex.props(styles.meta)}>{it.detail}</span>}
                    </li>
                  );
                case 'text':
                  return (
                    <li key={it.id} style={vars} {...stylex.props(styles.row, styles.textRow)}>
                      <span {...stylex.props(styles.wrap)}>
                        {isStreaming && isLast ? <TextReveal text={it.text} staggerMs={35} /> : it.text}
                      </span>
                    </li>
                  );
                case 'query':
                  return (
                    <li key={it.id} style={vars} {...stylex.props(styles.row)}>
                      <SearchIcon size={14} aria-hidden="true" {...stylex.props(styles.icon)} />
                      <span title={it.query} {...stylex.props(styles.main)}>
                        {it.query}
                      </span>
                    </li>
                  );
                case 'source': {
                  const href = safeUrl(it.url);
                  const host = hostOf(it.url);
                  const inner = (
                    <>
                      <span aria-hidden="true" {...stylex.props(styles.tile, toneFor(host))}>
                        {(host || it.title).charAt(0)}
                      </span>
                      <span title={it.title} {...stylex.props(styles.main)}>
                        {it.title}
                      </span>
                      {host && <span {...stylex.props(styles.host)}>{host}</span>}
                    </>
                  );
                  return (
                    <li key={it.id} style={vars} {...stylex.props(styles.row, styles.srcRow)}>
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" {...stylex.props(styles.link, focus.inset)}>
                          {inner}
                        </a>
                      ) : (
                        <span {...stylex.props(styles.link)}>{inner}</span>
                      )}
                    </li>
                  );
                }
                case 'tool':
                  return (
                    <li key={it.id} style={vars} {...stylex.props(styles.row)}>
                      <span {...stylex.props(styles.main, styles.verb)}>{it.verb}</span>
                      <span title={it.target} {...stylex.props(styles.mono)}>
                        {it.target}
                      </span>
                      {it.added != null && <span {...stylex.props(styles.add)}>+{it.added}</span>}
                      {it.removed != null && <span {...stylex.props(styles.del)}>−{it.removed}</span>}
                    </li>
                  );
                case 'more':
                  return (
                    <li key={it.id} style={vars} {...stylex.props(styles.row, styles.more)}>
                      +{it.count} more
                    </li>
                  );
              }
            })}
          </ul>
        </div>
      </AnimatedHeight>
    </div>
  );
}
