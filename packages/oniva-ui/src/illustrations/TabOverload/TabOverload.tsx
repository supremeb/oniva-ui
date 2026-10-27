import * as stylex from '@stylexjs/stylex';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { useState } from 'react';
import { loop, Scene, type IllustrationProps } from '../../internal/w7-scene';

const shimmer = stylex.keyframes({
  '0%, 100%': { opacity: 0.5 },
  '50%': { opacity: 1 },
});

const styles = stylex.create({
  win: {
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-xl'],
    boxShadow: `${shadow['--oniva-shadow-md']}, 0 0 0 1px ${colors['--oniva-color-border']}`,
    boxSizing: 'border-box',
    height: '56%',
    overflow: 'hidden',
    position: 'absolute',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'box-shadow, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '62%',
  },
  pos: (l: number, t: number, z: number) => ({ left: `${l}%`, top: `${t}%`, zIndex: z }),
  active: {
    boxShadow: `${shadow['--oniva-shadow-md']}, 0 0 0 1.5px ${accent['--oniva-accent-solid']}`,
    transform: 'translateY(-1cqw)',
  },
  glow: {
    backgroundImage: `linear-gradient(90deg, ${accent['--oniva-accent-300']}, ${accent['--oniva-accent-500']})`,
    borderRadius: radius['--oniva-radius-xl'],
    filter: 'blur(3.5cqw)',
    inset: '-1cqw 4cqw auto -1cqw',
    height: '14cqw',
    opacity: { default: 0, ':is([data-on="true"])': 0.4 },
    pointerEvents: 'none',
    position: 'absolute',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  content: {
    opacity: { default: 0.35, ':is([data-on="true"])': 1 },
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  bar: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    display: 'flex',
    gap: '1.1cqw',
    height: '6.4cqw',
    padding: '0 2cqw',
  },
  dot: {
    backgroundColor: colors['--oniva-color-border-hover'],
    borderRadius: radius['--oniva-radius-full'],
    height: '1.5cqw',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
    width: '1.5cqw',
  },
  dotR: { backgroundColor: colors['--oniva-color-danger-solid'] },
  dotY: { backgroundColor: colors['--oniva-color-warning-solid'] },
  dotG: { backgroundColor: colors['--oniva-color-success-solid'] },
  tab: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-sm'],
    height: '3.4cqw',
    marginLeft: '1cqw',
    width: '11cqw',
  },
  body: { display: 'grid', gap: '1.6cqw', gridTemplateColumns: '1fr 2fr', padding: '2.4cqw' },
  block: {
    animationDuration: '2.4s',
    animationName: { default: shimmer, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-md'],
    height: '7cqw',
  },
  tall: { gridRow: 'span 2', height: 'auto' },
});

const WINDOWS = [
  { l: 4, t: 7, z: 1 },
  { l: 19, t: 22, z: 2 },
  { l: 34, t: 37, z: 3 },
] as const;

export type TabOverloadProps = IllustrationProps;

/** Three overlapping browser windows; the highlight follows the hovered window and returns to the front one. */
export function TabOverload({
  label = 'Three overlapping browser windows with too many tabs open',
  ...rest
}: TabOverloadProps) {
  const [hover, setHover] = useState<number | null>(null);
  const active = hover ?? WINDOWS.length - 1;
  return (
    <Scene ratio="4 / 3" label={label} onPointerLeave={() => setHover(null)} {...rest}>
      {WINDOWS.map((w, i) => {
        const on = active === i;
        return (
          <div
            key={i}
            aria-hidden="true"
            onPointerEnter={(e) => e.pointerType !== 'touch' && setHover(i)}
            {...stylex.props(styles.win, styles.pos(w.l, w.t, w.z), on && styles.active)}
          >
            <div {...stylex.props(styles.bar)}>
              <span {...stylex.props(styles.dot, on && styles.dotR)} />
              <span {...stylex.props(styles.dot, on && styles.dotY)} />
              <span {...stylex.props(styles.dot, on && styles.dotG)} />
              {[0, 1, 2].map((t) => (
                <span key={t} {...stylex.props(styles.tab)} />
              ))}
            </div>
            <span data-on={on ? 'true' : 'false'} {...stylex.props(styles.glow)} />
            <div data-on={on ? 'true' : 'false'} {...stylex.props(styles.body, styles.content)}>
              <span {...stylex.props(styles.block, styles.tall, loop.run, loop.delay(i * 0.4))} />
              <span {...stylex.props(styles.block, loop.run, loop.delay(i * 0.4 + 0.5))} />
              <span {...stylex.props(styles.block, loop.run, loop.delay(i * 0.4 + 1))} />
            </div>
          </div>
        );
      })}
    </Scene>
  );
}
