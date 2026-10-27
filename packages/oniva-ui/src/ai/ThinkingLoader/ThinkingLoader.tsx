import * as stylex from '@stylexjs/stylex';
import { useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { mergeSx } from '../../internal/sx';

const ray = stylex.keyframes({ '0%': { opacity: 1 }, '100%': { opacity: 0.18 } });
const rollIn = stylex.keyframes({
  from: { filter: 'blur(2px)', opacity: 0, transform: 'translateY(10px)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0)' },
});
const rollOut = stylex.keyframes({
  from: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0)' },
  to: { filter: 'blur(2px)', opacity: 0, transform: 'translateY(-10px)' },
});
const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });
const draw = stylex.keyframes({ from: { strokeDashoffset: 1 }, to: { strokeDashoffset: 0 } });
const sweep = stylex.keyframes({
  from: { backgroundPosition: '150% 0' },
  to: { backgroundPosition: '-50% 0' },
});

const styles = stylex.create({
  root: {
    alignItems: 'center',
    boxSizing: 'border-box',
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    verticalAlign: 'middle',
  },
  md: { fontSize: font['--oniva-font-size-13'], height: 32, paddingInlineEnd: 10, paddingInlineStart: 8 },
  sm: { fontSize: font['--oniva-font-size-12'], height: 26, paddingInlineEnd: 8, paddingInlineStart: 6 },
  pill: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-card'],
  },
  plain: { height: 'auto', paddingInline: 0 },
  icon: { display: 'inline-grid', flexShrink: 0, height: 16, width: 16 },
  glyph: {
    gridArea: '1 / 1',
    height: '100%',
    overflow: 'visible',
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  spinner: {
    color: colors['--oniva-color-accent-text'],
    opacity: 1,
    transform: 'scale(1)',
  },
  spinnerDone: { opacity: 0, transform: 'scale(0.6)' },
  line: {
    animationDuration: '800ms',
    animationIterationCount: { default: 'infinite', [media.reducedMotion]: 0 },
    animationName: ray,
    animationTimingFunction: 'linear',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeWidth: 1.2,
  },
  check: {
    color: colors['--oniva-color-accent-text'],
    fill: 'none',
    opacity: 0,
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.4,
    transform: 'scale(0.6)',
  },
  checkDone: { opacity: 1, transform: 'scale(1)' },
  checkPath: { strokeDasharray: 1, strokeDashoffset: 1 },
  checkPathDone: {
    animationDelay: '120ms',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'forwards',
    animationName: draw,
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    strokeDashoffset: { default: 1, [media.reducedMotion]: 0 },
  },
  // Opt-in size exception (same as CrossFade morph): the label box glides to the new phase width so the pill follows.
  text: {
    display: 'inline-grid',
    lineHeight: 1.4,
    overflow: 'hidden',
    paddingBlock: 1,
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: { default: 'width', [media.reducedMotion]: 'none' },
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
    width: 'var(--oniva-tl-w, auto)',
  },
  label: { gridArea: '1 / 1', justifySelf: 'start', whiteSpace: 'nowrap' },
  in: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'both',
    animationName: { default: rollIn, [media.reducedMotion]: fadeIn },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  out: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'both',
    animationName: { default: rollOut, [media.reducedMotion]: fadeOut },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    pointerEvents: 'none',
  },
  shine: {
    animationDuration: '2200ms',
    animationIterationCount: { default: 'infinite', [media.reducedMotion]: 0 },
    animationName: sweep,
    animationTimingFunction: 'linear',
    backgroundClip: 'text',
    backgroundImage: `linear-gradient(100deg, ${colors['--oniva-color-text-muted']} 35%, ${colors['--oniva-color-text']} 50%, ${colors['--oniva-color-text-muted']} 65%)`,
    backgroundSize: '250% 100%',
    color: 'transparent',
    WebkitBackgroundClip: 'text',
  },
  doneLabel: { color: colors['--oniva-color-text'] },
});

const DEFAULT_PHASES = ['Thinking', 'Searching the web', 'Reading sources', 'Writing response'];
const RAYS = Array.from({ length: 8 }, (_, i) => i);

export interface ThinkingLoaderProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  /** Labels to walk through, one after another. Keep them to 2-4 words. */
  phases?: string[];
  /** Time per phase in ms when `phase` is not controlled. Default 2200. */
  interval?: number;
  /** Controlled index into `phases`; stops the timer. */
  phase?: number;
  /** Start over after the last phase instead of holding it. */
  loop?: boolean;
  /** Spinner becomes a check and the label becomes `doneLabel`. Setting it back to false starts over. */
  isDone?: boolean;
  /** Label once done; a function receives the seconds since the loader started. */
  doneLabel?: string | ((seconds: number) => string);
  size?: 'sm' | 'md';
  variant?: 'pill' | 'plain';
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Working pill for AI replies: eight-ray spinner and a shimmering label that rolls through phases and settles on a check. */
export function ThinkingLoader({
  phases = DEFAULT_PHASES,
  interval = 2200,
  phase,
  loop = false,
  isDone = false,
  doneLabel = (s) => `Thought for ${s}s`,
  size = 'md',
  variant = 'pill',
  className,
  xstyle,
  ref,
  ...rest
}: ThinkingLoaderProps) {
  const [step, setStep] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const startedAt = useRef(0);

  useEffect(() => {
    if (isDone) return;
    startedAt.current = Date.now();
    setStep(0);
  }, [isDone]);

  useEffect(() => {
    if (isDone || phase !== undefined || phases.length < 2) return;
    const id = setInterval(() => setStep((s) => (s + 1 < phases.length ? s + 1 : loop ? 0 : s)), interval);
    return () => clearInterval(id);
  }, [isDone, phase, phases.length, interval, loop]);

  useEffect(() => {
    if (isDone) setSeconds(Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)));
  }, [isDone]);

  const index = Math.min(Math.max(phase ?? step, 0), Math.max(phases.length - 1, 0));
  const label = isDone ? (typeof doneLabel === 'function' ? doneLabel(seconds) : doneLabel) : (phases[index] ?? '');

  const [shown, setShown] = useState({ key: 0, text: label });
  const [leaving, setLeaving] = useState<{ key: number; text: string } | null>(null);
  if (label !== shown.text) {
    setLeaving(shown);
    setShown({ key: shown.key + 1, text: label });
  }
  useEffect(() => {
    if (!leaving) return;
    const id = setTimeout(() => setLeaving(null), 220);
    return () => clearTimeout(id);
  }, [leaving]);

  const textRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const w = labelRef.current?.offsetWidth;
    if (w) textRef.current?.style.setProperty('--oniva-tl-w', `${w}px`);
  }, [shown.text, size]);
  const sx = stylex.props(styles.root, size === 'sm' ? styles.sm : styles.md, variant === 'pill' ? styles.pill : styles.plain, xstyle);
  return (
    <span {...rest} ref={ref} role="status" aria-live="polite" data-done={isDone || undefined} {...mergeSx(sx, className)}>
      <span aria-hidden="true" {...stylex.props(styles.icon)}>
        <svg viewBox="0 0 16 16" {...stylex.props(styles.glyph, styles.spinner, isDone && styles.spinnerDone)}>
          {RAYS.map((i) => (
            <line
              key={i}
              x1="8"
              y1="1.75"
              x2="8"
              y2="4.75"
              transform={`rotate(${i * 45} 8 8)`}
              {...stylex.props(styles.line)}
              style={{ animationDelay: `${(i - 8) * 100}ms` }}
            />
          ))}
        </svg>
        <svg viewBox="0 0 16 16" {...stylex.props(styles.glyph, styles.check, isDone && styles.checkDone)}>
          <path d="M3.5 8.4 6.6 11.3 12.5 4.9" pathLength={1} {...stylex.props(styles.checkPath, isDone && styles.checkPathDone)} />
        </svg>
      </span>
      <span ref={textRef} {...stylex.props(styles.text)}>
        {leaving && (
          <span key={leaving.key} aria-hidden="true" {...stylex.props(styles.label, styles.out)}>
            {leaving.text}
          </span>
        )}
        <span key={shown.key} ref={labelRef} {...stylex.props(styles.label, shown.key > 0 && styles.in, isDone ? styles.doneLabel : styles.shine)}>
          {shown.text}
        </span>
      </span>
    </span>
  );
}
