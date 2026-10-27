import * as stylex from '@stylexjs/stylex';
import { Sparkles } from 'lucide-react';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { Tile, type IllustrationItem } from '../../internal/w7-parts';
import { loop, Scene, type IllustrationProps } from '../../internal/w7-scene';

const spin = stylex.keyframes({ to: { transform: 'rotate(360deg)' } });
const spinBack = stylex.keyframes({ to: { transform: 'rotate(-360deg)' } });
const pop = stylex.keyframes({
  from: { opacity: 0, transform: 'translate(-50%, 0) scale(0.2)' },
  '35%': { opacity: 1 },
  to: { opacity: 1, transform: 'translate(-50%, -34cqw) scale(1)' },
});
const appear = stylex.keyframes({
  from: { opacity: 0, transform: 'translate(-50%, -50%) scale(0.6)' },
  to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const styles = stylex.create({
  disc: {
    alignItems: 'center',
    animationDuration: '420ms',
    animationName: { default: appear, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-full'],
    boxShadow: `${shadow['--oniva-shadow-lg']}, 0 0 0 1px ${colors['--oniva-color-border']}`,
    color: colors['--oniva-color-text'],
    display: 'flex',
    height: '22cqw',
    justifyContent: 'center',
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '22cqw',
    zIndex: 2,
  },
  discIcon: { height: '9cqw', width: '9cqw' },
  orbit: {
    animationDuration: '48s',
    animationName: { default: spin, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    inset: 0,
    position: 'absolute',
  },
  slot: { height: 0, left: '50%', position: 'absolute', top: '50%', width: 0 },
  slotAt: (deg: number) => ({ transform: `rotate(${deg}deg)` }),
  arm: {
    animationDuration: '700ms',
    animationName: { default: pop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
    left: 0,
    position: 'absolute',
    top: 0,
    transform: 'translate(-50%, -34cqw)',
  },
  counter: {
    animationDuration: '48s',
    animationName: { default: spinBack, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    display: 'block',
  },
  upright: (deg: number) => ({ display: 'block', transform: `rotate(${-deg}deg)` }),
  bubble: {
    display: 'block',
    transform: { default: 'scale(1)', ':hover': { default: null, [media.hover]: 'scale(1.12)' }, ':active': 'scale(0.96)' },
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
  },
  tile: {
    boxShadow: {
      default: `${shadow['--oniva-shadow-md']}, 0 0 0 1px ${colors['--oniva-color-border']}`,
      ':hover': { default: null, [media.hover]: `${shadow['--oniva-shadow-xl']}, 0 0 0 1px ${colors['--oniva-color-border']}` },
    },
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'box-shadow',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
});

export interface LogoClusterProps extends IllustrationProps {
  /** Logos or tools around the ring (4 to 10 look best). */
  logos?: IllustrationItem[];
  /** Mark in the middle disc. */
  mark?: IllustrationItem;
}

const DEFAULT_LOGOS: IllustrationItem[] = ['Docs', 'Mail', 'Chat', 'CRM', 'Billing', 'Support', 'Drive', 'Calendar'].map(
  (name) => ({ name }),
);

/** Your mark on a disc in the middle; company logos bounce out and settle around it, then the ring turns slowly with every logo upright. */
export function LogoCluster({ logos = DEFAULT_LOGOS, mark, label, ...rest }: LogoClusterProps) {
  const n = Math.max(logos.length, 1);
  // The ring starts turning once the last logo has landed (orbit and counter-turn share the same delay so logos stay upright)
  const settle = 0.5 + (n - 1) * 0.09 + 0.75;
  return (
    <Scene
      ratio="1 / 1"
      label={label ?? `${mark?.name ?? 'Your product'} surrounded by ${logos.map((l) => l.name).join(', ')}`}
      {...rest}
    >
      <span aria-hidden="true" {...stylex.props(styles.disc)}>
        {mark ? (
          mark.icon ?? mark.name
        ) : (
          <Sparkles {...stylex.props(styles.discIcon)} />
        )}
      </span>
      <span aria-hidden="true" {...stylex.props(styles.orbit, loop.run, loop.delay(settle))}>
        {logos.map((logo, i) => {
          const deg = (360 / n) * i;
          return (
            <span key={`${logo.name}-${i}`} {...stylex.props(styles.slot, styles.slotAt(deg))}>
              <span {...stylex.props(styles.arm, loop.once, loop.delay(0.5 + i * 0.09))}>
                <span {...stylex.props(styles.counter, loop.run, loop.delay(settle))}>
                  <span {...stylex.props(styles.upright(deg))}>
                    <span {...stylex.props(styles.bubble)}>
                      <Tile item={logo} size={13} tone={i} round xstyle={styles.tile} />
                    </span>
                  </span>
                </span>
              </span>
            </span>
          );
        })}
      </span>
    </Scene>
  );
}
