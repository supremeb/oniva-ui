import * as stylex from '@stylexjs/stylex';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { IconButton } from '../../components/IconButton';
import { mergeSx } from '../../internal/sx';

const fromRight = stylex.keyframes({
  from: { opacity: 0, transform: 'translateX(16px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
});
const fromLeft = stylex.keyframes({
  from: { opacity: 0, transform: 'translateX(-16px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
});
const fade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'], gap: 8 },
  stage: { overflow: 'hidden' },
  slide: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  next: { animationName: { default: fromRight, [media.reducedMotion]: fade } },
  prev: { animationName: { default: fromLeft, [media.reducedMotion]: fade } },
  switcher: { alignItems: 'center', alignSelf: 'flex-start', display: 'inline-flex', gap: 2 },
  count: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    minWidth: 32,
    textAlign: 'center',
  },
});

export interface MessageBranchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'onChange'> {
  /** One node per response version. */
  branches: ReactNode[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Version switcher for regenerated responses: ‹ 2/3 ›. Content slides in from the direction of travel. */
export function MessageBranch({ branches, index, defaultIndex = 0, onIndexChange, className, xstyle, ref, ...rest }: MessageBranchProps) {
  const [inner, setInner] = useState(defaultIndex);
  const cur = Math.min(Math.max(index ?? inner, 0), Math.max(branches.length - 1, 0));
  const dir = useRef<'next' | 'prev' | null>(null);
  const go = (to: number) => {
    if (to < 0 || to >= branches.length) return;
    dir.current = to > cur ? 'next' : 'prev';
    setInner(to);
    onIndexChange?.(to);
  };
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.stage)}>
        <div key={cur} {...stylex.props(dir.current && styles.slide, dir.current === 'next' && styles.next, dir.current === 'prev' && styles.prev)}>
          {branches[cur]}
        </div>
      </div>
      {branches.length > 1 && (
        <div role="group" aria-label="Response versions" {...stylex.props(styles.switcher)}>
          <IconButton size="xs" variant="ghost" aria-label="Previous version" isDisabled={cur === 0} onPress={() => go(cur - 1)}>
            <ChevronLeft size={14} />
          </IconButton>
          <span aria-live="polite" {...stylex.props(styles.count)}>
            {cur + 1}/{branches.length}
          </span>
          <IconButton size="xs" variant="ghost" aria-label="Next version" isDisabled={cur === branches.length - 1} onPress={() => go(cur + 1)}>
            <ChevronRight size={14} />
          </IconButton>
        </div>
      )}
    </div>
  );
}
