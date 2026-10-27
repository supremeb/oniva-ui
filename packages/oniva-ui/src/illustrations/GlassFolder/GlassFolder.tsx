import * as stylex from '@stylexjs/stylex';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { useRef, type PointerEvent } from 'react';
import { media } from '../../tokens/media.stylex';
import { useReducedMotion } from '../../internal/motion-hooks';
import { loop, Scene, useHover, type IllustrationProps } from '../../internal/w7-scene';

/* Clean-room implementation from the public Glass Folder description (no third-party source). */

/** Spring with a small overshoot, as a CSS `linear()` easing (settles by ~500ms). */
const SPRING =
  'linear(0, 0.18 5%, 0.58 12%, 0.92 20%, 1.06 28%, 1.07 33%, 1.03 42%, 0.995 55%, 1.002 70%, 1)';

const rise = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(4cqw) scale(0.94)' } });
const bob = stylex.keyframes({
  '0%, 100%': { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-0.7cqw)' },
});

const styles = stylex.create({
  stage: {
    inset: 0,
    perspective: '110cqw',
    position: 'absolute',
    transform: 'rotateX(var(--r4-rx, 0deg)) rotateY(var(--r4-ry, 0deg))',
    transformStyle: 'preserve-3d',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  bob: {
    animationDuration: '6s',
    animationName: { default: bob, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    inset: 0,
    position: 'absolute',
    transformStyle: 'preserve-3d',
  },
  sheen: {
    backgroundImage:
      'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)',
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
    transform: 'translateX(-120%)',
    transitionDuration: '700ms',
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  sheenOn: { transform: 'translateX(120%)' },
  intro: {
    animationDelay: 'var(--w7-delay, 0s)',
    animationDuration: motion['--oniva-motion-dur-sheet'],
    animationFillMode: 'backwards',
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  stagger: (i: number) => ({ transitionDelay: `${i * 35}ms` }),
  folder: {
    height: '70%',
    left: '10%',
    position: 'absolute',
    top: '20%',
    transformStyle: 'preserve-3d',
    width: '80%',
  },
  back: {
    backgroundImage: `linear-gradient(180deg, ${accent['--oniva-accent-500']}, ${accent['--oniva-accent-700']})`,
    borderRadius: radius['--oniva-radius-xxl'],
    boxShadow: shadow['--oniva-shadow-lg'],
    inset: 0,
    position: 'absolute',
  },
  tab: {
    backgroundColor: accent['--oniva-accent-500'],
    borderRadius: `${radius['--oniva-radius-lg']} ${radius['--oniva-radius-lg']} 0 0`,
    height: '10%',
    left: 0,
    position: 'absolute',
    top: '-8%',
    width: '40%',
  },
  doc: {
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-md'],
    boxShadow: shadow['--oniva-shadow-sm'],
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1cqw',
    height: '82%',
    padding: '2cqw',
    position: 'absolute',
    top: '4%',
    transformOrigin: '50% 100%',
    transitionDuration: motion['--oniva-motion-dur-slower'],
    transitionProperty: 'transform',
    transitionTimingFunction: SPRING,
    width: '56%',
  },
  docPos: (left: number, open: number, lift: number) => ({
    left: `${left}%`,
    transform: `translateY(${-lift}cqw) rotate(${open}deg)`,
  }),
  line: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-full'],
    height: '0.9cqw',
  },
  pocket: {
    backdropFilter: 'blur(10px)',
    backgroundColor: `color-mix(in srgb, ${accent['--oniva-accent-400']} 55%, transparent)`,
    borderRadius: radius['--oniva-radius-xxl'],
    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${colors['--oniva-color-on-solid']} 50%, transparent), ${shadow['--oniva-shadow-md']}`,
    bottom: 0,
    height: '72%',
    left: 0,
    position: 'absolute',
    transform: 'rotateX(0deg)',
    transformOrigin: '50% 100%',
    overflow: 'hidden',
    transitionDuration: motion['--oniva-motion-dur-slower'],
    transitionProperty: 'transform',
    transitionTimingFunction: SPRING,
    width: '100%',
  },
  open: { transform: 'rotateX(-16deg)' },
});

const DOCS = [
  { left: 6, rest: -3, open: -9, lift: 0.5 },
  { left: 22, rest: 0, open: 1, lift: 1.5 },
  { left: 38, rest: 3, open: 10, lift: 0.5 },
] as const;

export type GlassFolderProps = IllustrationProps;

/** A glassy blue folder holding documents behind a frosted pocket. Hover: the pocket tips forward and each document shifts and turns. */
export function GlassFolder({
  label = 'Blue folder holding three documents behind a frosted front pocket',
  ...rest
}: GlassFolderProps) {
  const { hovered, handlers } = useHover();
  const reduced = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  // Pointer follow: the whole folder leans a few degrees toward the cursor (no re-render, transform only).
  const lean = (e: PointerEvent<HTMLDivElement>) => {
    const el = stage.current;
    if (!el || reduced || e.pointerType === 'touch') return;
    const b = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5;
    const y = (e.clientY - b.top) / b.height - 0.5;
    el.style.setProperty('--r4-ry', `${(x * 7).toFixed(2)}deg`);
    el.style.setProperty('--r4-rx', `${(-y * 5).toFixed(2)}deg`);
  };
  const settle = () => {
    stage.current?.style.removeProperty('--r4-rx');
    stage.current?.style.removeProperty('--r4-ry');
  };
  return (
    <Scene
      ratio="4 / 3"
      label={label}
      {...handlers}
      onPointerMove={lean}
      onPointerLeave={(e) => {
        handlers.onPointerLeave();
        settle();
        void e;
      }}
      {...rest}
    >
      <div ref={stage} aria-hidden="true" {...stylex.props(styles.stage)}>
        <div {...stylex.props(styles.bob, loop.run)}>
          <div {...stylex.props(styles.folder)}>
            <span {...stylex.props(styles.back)} />
            <span {...stylex.props(styles.tab)} />
            {DOCS.map((d, i) => (
              <span
                key={i}
                {...stylex.props(
                  styles.doc,
                  styles.intro,
                  loop.delay(0.1 + i * 0.09),
                  styles.stagger(i),
                  styles.docPos(d.left, hovered ? d.open : d.rest, hovered ? d.lift + 3 : d.lift),
                )}
              >
                <span {...stylex.props(styles.line)} />
                <span {...stylex.props(styles.line)} />
              </span>
            ))}
            <span {...stylex.props(styles.pocket, hovered && styles.open)}>
              <span {...stylex.props(styles.sheen, hovered && styles.sheenOn)} />
            </span>
          </div>
        </div>
      </div>
    </Scene>
  );
}
