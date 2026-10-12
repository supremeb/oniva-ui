import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { motion } from '../../tokens/motion.stylex';

export type DynamicIslandState = 'compact' | 'expanded' | 'split';

// Visual sizes. The shell is drawn once at the expanded size and *scaled* (transform) to the other states,
// so nothing animates width/height. Content lives in unscaled layers that blur-crossfade.
const FULL = { w: 340, h: 120 };
const COMPACT = { w: 120, h: 36 };
const SPLIT = { w: 190, h: 36, aside: 36, gap: 8 };
const shift = (SPLIT.aside + SPLIT.gap) / 2;

const T = `${motion['--oniva-motion-dur-slower']} ${motion['--oniva-motion-ease-spring']}`;

const styles = stylex.create({
  root: { height: FULL.h, margin: '0 auto', position: 'relative', width: FULL.w },
  shell: {
    backgroundColor: colors['--oniva-color-text'],
    borderRadius: 56,
    height: FULL.h,
    left: '50%',
    marginLeft: -FULL.w / 2,
    position: 'absolute',
    top: 0,
    transform: {
      default: `scale(${COMPACT.w / FULL.w}, ${COMPACT.h / FULL.h})`,
      '[data-state="expanded"]': 'scale(1, 1)',
      '[data-state="split"]': `translateX(${-shift}px) scale(${SPLIT.w / FULL.w}, ${SPLIT.h / FULL.h})`,
    },
    transformOrigin: 'top center',
    transition: `transform ${T}`,
    width: FULL.w,
    willChange: { default: 'auto', ':hover': 'transform', ':focus-within': 'transform' },
  },
  aside: {
    backgroundColor: colors['--oniva-color-text'],
    borderRadius: '50%',
    height: SPLIT.aside,
    left: '50%',
    marginLeft: -SPLIT.aside / 2,
    opacity: { default: 0, '[data-state="split"]': 1 },
    position: 'absolute',
    top: 0,
    transform: {
      default: 'translateX(0) scale(0.5)',
      '[data-state="split"]': `translateX(${SPLIT.w / 2 + SPLIT.gap / 2}px) scale(1)`,
    },
    transition: `transform ${T}, opacity ${motion['--oniva-motion-dur-slow']} ${motion['--oniva-motion-ease-out']}`,
    width: SPLIT.aside,
  },
  layer: {
    alignItems: 'center',
    color: colors['--oniva-color-bg'],
    display: 'flex',
    filter: { default: 'blur(2px)', '[data-active]': 'blur(0)' },
    justifyContent: 'center',
    left: '50%',
    opacity: { default: 0, '[data-active]': 1 },
    overflow: 'hidden',
    pointerEvents: { default: 'none', '[data-active]': 'auto' },
    position: 'absolute',
    top: 0,
    transitionDelay: { default: '0ms', '[data-active]': '120ms' },
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'opacity, filter',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  compact: { height: COMPACT.h, marginLeft: -COMPACT.w / 2, width: COMPACT.w },
  expanded: { height: FULL.h, marginLeft: -FULL.w / 2, width: FULL.w },
  splitMain: { height: SPLIT.h, marginLeft: -SPLIT.w / 2 - shift, width: SPLIT.w },
  splitAside: { height: SPLIT.aside, marginLeft: -SPLIT.aside / 2 + SPLIT.w / 2 + SPLIT.gap / 2, width: SPLIT.aside },
});

export interface DynamicIslandProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  /** Current state. Default `'compact'`. */
  state?: DynamicIslandState;
  /** Content for each state. */
  compact?: ReactNode;
  expanded?: ReactNode;
  split?: ReactNode;
  splitAside?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Morphing status pill: compact / expanded / split. Shell morphs by transform (spring 500ms), content blur-crossfades. Reduced motion: instant swap. */
export function DynamicIsland({ state: current = 'compact', compact, expanded, split, splitAside, className, xstyle, ref, ...rest }: DynamicIslandProps) {
  const layer = (s: DynamicIslandState, size: typeof styles.compact, node: ReactNode) => (
    <div
      data-active={current === s ? '' : undefined}
      aria-hidden={current === s ? undefined : true}
      inert={current !== s}
      {...stylex.props(styles.layer, size)}
    >
      {node}
    </div>
  );
  return (
    <div {...rest} ref={ref} data-state={current} {...mergeSx(stylex.props(styles.root, xstyle), className)}>
      <div data-state={current} aria-hidden="true" {...stylex.props(styles.shell)} />
      <div data-state={current} aria-hidden="true" {...stylex.props(styles.aside)} />
      {layer('compact', styles.compact, compact)}
      {layer('expanded', styles.expanded, expanded)}
      {layer('split', styles.splitMain, split)}
      <div
        data-active={current === 'split' ? '' : undefined}
        aria-hidden={current === 'split' ? undefined : true}
        inert={current !== 'split'}
        {...stylex.props(styles.layer, styles.splitAside)}
      >
        {splitAside}
      </div>
    </div>
  );
}
