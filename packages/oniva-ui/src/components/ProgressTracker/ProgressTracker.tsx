import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { Checkbox as AriaCheckbox } from 'react-aria-components';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { sxClass, mergeSx } from '../../internal/sx';
import { useReducedMotion } from '../../internal/motion-hooks';
import { w4, w4Motion } from '../../internal/w4-styles';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { ProgressBar } from '../ProgressBar';

const draw = stylex.keyframes({ from: { strokeDashoffset: 16 }, to: { strokeDashoffset: 0 } });
const ringPop = stylex.keyframes({
  '0%': { transform: 'scale(0.8)' },
  '60%': { transform: 'scale(1.12)' },
  '100%': { transform: 'scale(1)' },
});

const sweepAnim = stylex.keyframes({
  from: { transform: 'translateX(-100%)', opacity: 0 },
  '20%': { opacity: 1 },
  '80%': { opacity: 1 },
  to: { transform: 'translateX(100%)', opacity: 0 },
});
const cardIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(6px) scale(0.985)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});

const styles = stylex.create({
  card: {
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: cardIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    maxWidth: 340,
    paddingBlock: '14px 6px',
    paddingInline: 6,
    width: '100%',
  },
  headPad: { paddingInline: 10 },
  barPad: { marginInline: 10 },
  barWrap: { borderRadius: radius['--oniva-radius-full'], overflow: 'hidden', position: 'relative' },
  sweep: {
    animationDuration: '900ms',
    animationFillMode: 'both',
    animationName: { default: sweepAnim, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)',
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
  },
  head: { alignItems: 'baseline', display: 'flex', gap: 12, justifyContent: 'space-between' },
  count: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 0, listStyle: 'none', margin: 0, padding: 0 },
  step: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-md'],
    cursor: 'pointer',
    display: 'flex',
    gap: 10,
    minHeight: 32,
    paddingInline: 10,
  },
  box: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-accent-fg'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 16,
    justifyContent: 'center',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 16,
  },
  boxOn: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: ringPop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
    backgroundColor: accent['--oniva-accent-500'],
    borderColor: accent['--oniva-accent-500'],
    color: colors['--oniva-color-on-solid'],
  },
  tick: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: draw, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    strokeDasharray: 16,
  },
  label: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-20'],
    minWidth: 0,
    overflow: 'hidden',
    backgroundImage: 'linear-gradient(currentColor, currentColor)',
    backgroundPosition: '0 58%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '0% 1px',
    textOverflow: 'ellipsis',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'color, background-size',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    whiteSpace: 'nowrap',
  },
  labelOn: {
    backgroundSize: '100% 1px',
    color: colors['--oniva-color-text-muted'],
  },
  icon: { color: colors['--oniva-color-icon-muted'], display: 'inline-flex', flexShrink: 0, marginInlineStart: 'auto' },
});

export interface ProgressStep {
  id: string;
  label: string;
  done?: boolean;
  icon?: ReactNode;
}

export interface ProgressTrackerProps {
  steps: ProgressStep[];
  title?: string;
  /** Ticks the open steps one by one and starts over. Stops on any click or key press. */
  autoPlay?: boolean;
  /** Pause between two automatic steps, in ms. */
  interval?: number;
  /** Called with every step and its state. */
  onChange?: (steps: ProgressStep[]) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/** Onboarding checklist with an animated bar, ticks that draw themselves and optional auto play. */
export function ProgressTracker({
  steps: initial,
  title = 'Getting started',
  autoPlay = false,
  interval = 2200,
  onChange,
  className,
  xstyle,
  ref,
}: ProgressTrackerProps) {
  const fmt = useFormatters();
  const reduced = useReducedMotion();
  const [done, setDone] = useState(() => new Set(initial.filter((s) => s.done).map((s) => s.id)));
  const [playing, setPlaying] = useState(autoPlay);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const emit = (next: Set<string>) =>
    onChangeRef.current?.(initial.map((s) => ({ ...s, done: next.has(s.id) })));

  const toggle = (id: string, on: boolean) => {
    setDone((d) => {
      const next = new Set(d);
      if (on) next.add(id);
      else next.delete(id);
      emit(next);
      return next;
    });
  };

  // Auto play: tick the next open step, start over when everything is done. Off for reduced motion.
  useEffect(() => {
    if (!playing || reduced) return;
    const t = window.setTimeout(() => {
      setDone((d) => {
        const open = initial.find((s) => !d.has(s.id));
        const next = open ? new Set(d).add(open.id) : new Set<string>();
        emit(next);
        return next;
      });
    }, interval);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, reduced, done, interval]);

  const total = initial.length;
  const count = initial.filter((s) => done.has(s.id)).length;
  const prevCount = useRef(count);
  const [sweep, setSweep] = useState(0);
  useEffect(() => {
    if (count > prevCount.current) setSweep((n) => n + 1);
    prevCount.current = count;
  }, [count]);

  return (
    <section
      ref={ref}
      aria-label={title}
      onPointerDownCapture={() => setPlaying(false)}
      onKeyDownCapture={() => setPlaying(false)}
      {...mergeSx(stylex.props(w4.card, styles.card, xstyle), className)}
    >
      <div {...stylex.props(styles.head, styles.headPad)}>
        <h3 {...stylex.props(w4.trayTitle)}>{title}</h3>
        <span aria-hidden="true" {...stylex.props(styles.count)}>
          <AnimatedNumber value={count} /> / {fmt.number(total)}
        </span>
      </div>
      <div {...stylex.props(styles.barWrap, styles.barPad)}>
      <ProgressBar
        aria-label={title}
        value={count}
        minValue={0}
        maxValue={Math.max(total, 1)}
        valueLabel={`${fmt.number(count)} of ${fmt.number(total)} done`}
        size="sm"
        tone="accent"
      />
      {sweep > 0 && <span key={sweep} aria-hidden="true" {...stylex.props(styles.sweep)} />}
      </div>
      <ul {...stylex.props(styles.list)}>
        {initial.map((step, i) => (
          <li key={step.id} {...stylex.props(w4Motion.fadeUp)} style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
            <AriaCheckbox
              isSelected={done.has(step.id)}
              onChange={(on) => toggle(step.id, on)}
              className={() => sxClass(stylex.props(styles.step, w4.rowHover, focus.ring))}
            >
              {({ isSelected }) => (
                <>
                  <span aria-hidden="true" {...stylex.props(styles.box, isSelected && styles.boxOn)}>
                    {isSelected && (
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3.5 8.5l3 3 6-7" {...stylex.props(styles.tick)} />
                      </svg>
                    )}
                  </span>
                  <span title={step.label} {...stylex.props(styles.label, isSelected && styles.labelOn)}>
                    {step.label}
                  </span>
                  {step.icon && (
                    <span aria-hidden="true" {...stylex.props(styles.icon)}>
                      {step.icon}
                    </span>
                  )}
                </>
              )}
            </AriaCheckbox>
          </li>
        ))}
      </ul>
    </section>
  );
}

