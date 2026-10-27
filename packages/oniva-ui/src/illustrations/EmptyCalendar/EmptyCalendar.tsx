import * as stylex from '@stylexjs/stylex';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { loop, Scene, type IllustrationProps } from '../../internal/w7-scene';
import { surface } from '../../internal/w7-parts';

const breathe = stylex.keyframes({
  '0%, 100%': { opacity: 0.5, transform: 'scale(0.94)' },
  '50%': { opacity: 0.95, transform: 'scale(1.04)' },
});
const deal = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(6cqw) scale(0.9)' },
});
const dealFront = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(8cqw) scale(0.96)' },
});
const chipPop = stylex.keyframes({
  '0%': { opacity: 0, transform: 'scale(0.8)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});
const pulse = stylex.keyframes({
  '0%, 100%': { opacity: 0.45 },
  '50%': { opacity: 1 },
});
const shimmer = stylex.keyframes({
  '0%, 100%': { opacity: 0.45 },
  '50%': { opacity: 1 },
});

const styles = stylex.create({
  card: {
    height: '60%',
    left: '14%',
    overflow: 'hidden',
    padding: '3.2cqw 3.6cqw',
    position: 'absolute',
    top: '22%',
    transformOrigin: '50% 100%',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '72%',
    // Cards deal in once (backwards fill only, so the hover transitions take over afterwards).
    animationDelay: 'var(--w7-delay, 0s)',
    animationDuration: motion['--oniva-motion-dur-sheet'],
    animationFillMode: 'backwards',
    animationName: { default: deal, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  dealFront: { animationName: { default: dealFront, [media.reducedMotion]: 'none' } },
  back2: {
    opacity: 0.7,
    transform: { default: 'translateY(-13cqw) scale(0.84)', ':hover': { default: null, [media.hover]: 'translateY(-15cqw) scale(0.84)' } },
  },
  back1: {
    opacity: 0.9,
    transform: { default: 'translateY(-6.5cqw) scale(0.92)', ':hover': { default: null, [media.hover]: 'translateY(-9cqw) scale(0.92)' } },
  },
  front: {
    transform: {
      default: 'translateY(2cqw)',
      ':hover': { default: null, [media.hover]: 'translateY(0.2cqw) rotate(-1.2deg)' },
      ':active': { default: null, [media.hover]: 'translateY(0.6cqw) rotate(-0.6deg) scale(0.99)' },
    },
  },
  glow: {
    animationDuration: '4.5s',
    animationName: { default: breathe, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundImage: `radial-gradient(closest-side, ${accent['--oniva-accent-400']}, transparent)`,
    borderRadius: radius['--oniva-radius-full'],
    bottom: '2%',
    filter: 'blur(14px)',
    height: '18%',
    left: '24%',
    opacity: 0.6,
    pointerEvents: 'none',
    position: 'absolute',
    width: '52%',
  },
  head: { alignItems: 'center', display: 'flex', justifyContent: 'space-between' },
  month: {
    fontSize: '2.7cqw',
    fontWeight: 600,
    letterSpacing: '-0.01em',
  },
  chipPop: {
    animationDelay: '480ms',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: chipPop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
  },
  chipDot: {
    animationDuration: '2.4s',
    animationName: { default: pulse, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundColor: colors['--oniva-color-accent-soft-fg'],
    borderRadius: radius['--oniva-radius-full'],
    display: 'inline-block',
    height: '0.8cqw',
    marginRight: '0.8cqw',
    verticalAlign: 'middle',
    width: '0.8cqw',
  },
  chip: {
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-accent-soft-fg'],
    fontSize: '1.9cqw',
    fontWeight: 600,
    padding: '0.5cqw 1.6cqw',
  },
  grid: {
    display: 'grid',
    gap: '0.9cqw 0.6cqw',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginTop: '2.2cqw',
  },
  dow: {
    color: colors['--oniva-color-text-muted'],
    fontSize: '1.6cqw',
    fontWeight: 600,
    textAlign: 'center',
  },
  day: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexDirection: 'column',
    fontSize: '1.8cqw',
    fontVariantNumeric: 'tabular-nums',
    gap: '0.6cqw',
    height: '5.4cqw',
  },
  slot: {
    animationDuration: '3.4s',
    animationName: { default: shimmer, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-full'],
    height: '0.9cqw',
    width: '70%',
  },
  empty: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderRadius: radius['--oniva-radius-full'],
    boxShadow: `0 0 0 1px ${colors['--oniva-color-border']}`,
    display: 'flex',
    fontSize: '2cqw',
    fontWeight: 600,
    gap: '1cqw',
    left: '50%',
    padding: '1.2cqw 2.6cqw',
    position: 'absolute',
    top: '56%',
    transform: 'translate(-50%, -50%)',
  },
  dot: {
    backgroundColor: colors['--oniva-color-icon-subtle'],
    borderRadius: radius['--oniva-radius-full'],
    height: '1.1cqw',
    width: '1.1cqw',
  },
});

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export interface EmptyCalendarProps extends IllustrationProps {
  /** Month name on the front card. */
  month?: string;
  /** Pill in the middle of the front card. */
  emptyLabel?: string;
}

/** Stack of calendar cards marked empty. The front card lifts on hover; the glow and placeholder bars breathe while on screen. */
export function EmptyCalendar({
  month = 'March',
  emptyLabel = 'No events',
  label = 'Stacked calendar cards marked empty, with nothing scheduled',
  ...rest
}: EmptyCalendarProps) {
  return (
    <Scene ratio="4 / 3" label={label} {...rest}>
      <span aria-hidden="true" {...stylex.props(styles.glow, loop.run)} />
      {(['back2', 'back1'] as const).map((k, i) => (
        <span key={k} aria-hidden="true" {...stylex.props(surface.card, styles.card, styles[k], loop.delay(i * 0.08))} />
      ))}
      <div aria-hidden="true" {...stylex.props(surface.card, styles.card, styles.dealFront, styles.front, loop.delay(0.16))}>
        <div {...stylex.props(styles.head)}>
          <span {...stylex.props(styles.month)}>{month}</span>
          <span {...stylex.props(styles.chip, styles.chipPop)}>
            <span {...stylex.props(styles.chipDot, loop.run)} />
            {emptyLabel}
          </span>
        </div>
        <div {...stylex.props(styles.grid)}>
          {DOW.map((d, i) => (
            <span key={i} {...stylex.props(styles.dow)}>
              {d}
            </span>
          ))}
          {Array.from({ length: 28 }, (_, i) => (
            <span key={i} {...stylex.props(styles.day)}>
              {i + 1}
              <span {...stylex.props(styles.slot, loop.run, loop.delay(((i % 7) + Math.floor(i / 7)) * 0.25))} />
            </span>
          ))}
        </div>
      </div>
    </Scene>
  );
}
