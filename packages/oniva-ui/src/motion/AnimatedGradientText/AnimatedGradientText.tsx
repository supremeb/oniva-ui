import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { useInView } from '../InView/useInView';

const flow = stylex.keyframes({ from: { backgroundPosition: '0% 50%' }, to: { backgroundPosition: '200% 50%' } });

const styles = stylex.create({
  root: {
    animationDuration: '6s',
    animationIterationCount: 'infinite',
    animationName: { default: flow, [media.reducedMotion]: 'none' },
    animationPlayState: { default: 'running', '[data-paused]': 'paused' },
    animationTimingFunction: 'linear',
    backgroundClip: 'text',
    backgroundImage: `linear-gradient(90deg, ${accent['--oniva-accent-600']}, ${accent['--oniva-accent-400']}, ${accent['--oniva-accent-200']}, ${accent['--oniva-accent-400']}, ${accent['--oniva-accent-600']})`,
    backgroundSize: '200% 100%',
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'inline-block',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
});

export interface AnimatedGradientTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Headline text with a slowly flowing accent gradient (6s loop). Pauses offscreen; a static gradient under reduced motion. */
export function AnimatedGradientText({ className, xstyle, ref, children, ...rest }: AnimatedGradientTextProps) {
  const { ref: viewRef, inView } = useInView<HTMLSpanElement>({ once: false });
  return (
    <span {...rest} ref={mergeRefs(viewRef, ref)} data-paused={inView ? undefined : ''} {...mergeSx(stylex.props(styles.root, xstyle), className)}>
      {children}
    </span>
  );
}
