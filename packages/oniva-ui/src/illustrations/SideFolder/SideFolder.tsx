import * as stylex from '@stylexjs/stylex';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { Scene, useHover, type IllustrationProps } from '../../internal/w7-scene';

const styles = stylex.create({
  stage: { inset: 0, perspective: '120cqw', perspectiveOrigin: '40% 50%', position: 'absolute' },
  folder: {
    height: '74%',
    left: '14%',
    position: 'absolute',
    top: '13%',
    transform: { default: 'scale(1)', ':is([data-open])': 'scale(1.03)' },
    transformStyle: 'preserve-3d',
    transitionDuration: motion['--oniva-motion-dur-sheet'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '56%',
  },
  back: {
    backgroundImage: `linear-gradient(160deg, ${accent['--oniva-accent-400']}, ${accent['--oniva-accent-600']})`,
    borderRadius: radius['--oniva-radius-xxl'],
    boxShadow: `${shadow['--oniva-shadow-lg']}, inset 0 0.3cqw 0 ${colors['--oniva-color-on-solid']}`,
    inset: 0,
    position: 'absolute',
  },
  doc: {
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-md'],
    boxShadow: shadow['--oniva-shadow-sm'],
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1cqw',
    left: '10%',
    padding: '2cqw',
    position: 'absolute',
    transitionDuration: motion['--oniva-motion-dur-sheet'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '84%',
  },
  docPos: (top: number, height: number, out: number, open: boolean, r0: number, r1: number, dy: number, delay: number) => ({
    height: `${height}%`,
    top: `${top}%`,
    transform: open
      ? `translate(${out}cqw, ${dy}cqw) rotate(${r1}deg)`
      : `translate(${out * 0.12}cqw, 0) rotate(${r0}deg)`,
    // each document leaves on its own beat; they settle together on close
    transitionDelay: open ? `${delay}ms` : '0ms',
  }),
  line: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-full'],
    height: '0.9cqw',
  },
  pocket: {
    backdropFilter: 'blur(10px)',
    backgroundColor: `color-mix(in srgb, ${accent['--oniva-accent-300']} 52%, transparent)`,
    borderRadius: radius['--oniva-radius-xxl'],
    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${colors['--oniva-color-on-solid']} 50%, transparent), ${shadow['--oniva-shadow-md']}`,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    transformOrigin: '0% 50%',
    transitionDuration: motion['--oniva-motion-dur-sheet'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '72%',
  },
  pocketOpen: { transform: 'translateZ(3cqw) rotateY(-14deg)' },
  tab: {
    backgroundColor: `color-mix(in srgb, ${accent['--oniva-accent-200']} 70%, transparent)`,
    borderRadius: radius['--oniva-radius-md'],
    bottom: '14%',
    height: '16%',
    position: 'absolute',
    right: '-9%',
    width: '16%',
  },
});

const DOCS = [
  { top: 8, height: 34, out: 18, r0: 3, r1: 6, dy: -0.8, delay: 0 },
  { top: 24, height: 34, out: 24, r0: -2, r1: 0, dy: 0.3, delay: 40 },
  { top: 40, height: 34, out: 30, r0: 4, r1: 7, dy: 1.2, delay: 80 },
] as const;

export type SideFolderProps = IllustrationProps;

/** A glassy folder on its side. Hover: the frosted pocket swings forward and each document slides out to the right. */
export function SideFolder({
  label = 'Blue folder on its side, with three documents peeking out behind a frosted front pocket',
  ...rest
}: SideFolderProps) {
  const { hovered, handlers } = useHover();
  return (
    <Scene ratio="3 / 2" label={label} {...handlers} {...rest}>
      <div aria-hidden="true" {...stylex.props(styles.stage)}>
        <div data-open={hovered ? '' : undefined} {...stylex.props(styles.folder)}>
          <span {...stylex.props(styles.back)} />
          {DOCS.map((d, i) => (
            <span key={i} {...stylex.props(styles.doc, styles.docPos(d.top, d.height, d.out, hovered, d.r0, d.r1, d.dy, d.delay))}>
              <span {...stylex.props(styles.line)} />
              <span {...stylex.props(styles.line)} />
            </span>
          ))}
          <span {...stylex.props(styles.pocket, hovered && styles.pocketOpen)}>
            <span {...stylex.props(styles.tab)} />
          </span>
        </div>
      </div>
    </Scene>
  );
}
