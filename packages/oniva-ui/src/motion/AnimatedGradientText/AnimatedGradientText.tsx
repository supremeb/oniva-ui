import * as stylex from '@stylexjs/stylex';
import { createElement, useEffect, useState } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { useInView } from '../InView/useInView';

// Layers: soft blob A, soft blob B, two-colour base. The base flows one full period; the blobs drift across and back.
const flow = stylex.keyframes({
  '0%': { backgroundPosition: '0% 50%, 100% 50%, 0% 50%' },
  '50%': { backgroundPosition: '100% 50%, 0% 50%, 100% 50%' },
  '100%': { backgroundPosition: '0% 50%, 100% 50%, 200% 50%' },
});

const styles = stylex.create({
  root: {
    animationDuration: 'var(--oniva-gt-dur, 6s)',
    animationIterationCount: 'infinite',
    animationName: { default: flow, [media.reducedMotion]: 'none' },
    animationPlayState: { default: 'running', '[data-paused]': 'paused' },
    animationTimingFunction: 'linear',
    backgroundClip: 'text',
    backgroundImage: `radial-gradient(closest-side, color-mix(in srgb, ${accent['--oniva-accent-200']} 75%, transparent), transparent), radial-gradient(closest-side, color-mix(in srgb, ${accent['--oniva-accent-700']} 75%, transparent), transparent), linear-gradient(90deg, ${accent['--oniva-accent-600']}, ${accent['--oniva-accent-400']}, ${accent['--oniva-accent-200']}, ${accent['--oniva-accent-400']}, ${accent['--oniva-accent-600']})`,
    backgroundRepeat: 'no-repeat, no-repeat, repeat',
    backgroundSize: '55% 180%, 45% 180%, 200% 100%',
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'inline-block',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  // Sweep: before the text is first seen it is fully clipped; once seen the colour wipes in left to right (clip-path transition), then keeps flowing.
  sweep: {
    clipPath: { default: 'inset(-0.25em -0.1em -0.25em 0)', [media.reducedMotion]: 'none' },
    transitionDuration: motion['--oniva-motion-dur-slower'],
    transitionProperty: { default: 'clip-path', [media.reducedMotion]: 'none' },
    transitionTimingFunction: motion['--oniva-motion-ease-out-expo'],
  },
  pending: { clipPath: { default: 'inset(-0.25em 100% -0.25em 0)', [media.reducedMotion]: 'none' } },
});

export interface AnimatedGradientTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  children?: ReactNode;
  /** Gradient colours (2 to 5 CSS colours). Default is the active accent ramp, so it follows accent themes and dark mode. */
  colors?: string[];
  /** Seconds per flow cycle. `0` freezes the gradient. Default `6`. */
  speed?: number;
  /** Wipe the colour in from left to right the first time the text is 60% visible. Default `false`. */
  sweep?: boolean;
  /** Element to render. Default `span`. */
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Headline text with a slowly flowing accent gradient (6s loop). Pauses offscreen; `sweep` wipes the colour in once on first view.
 * Under reduced motion it shows the finished gradient, standing still. The text stays real, selectable text.
 */
export function AnimatedGradientText({
  className,
  xstyle,
  ref,
  children,
  colors: custom,
  speed,
  sweep = false,
  as = 'span',
  ...rest
}: AnimatedGradientTextProps) {
  const { ref: viewRef, inView } = useInView<HTMLSpanElement>({ once: false, threshold: sweep ? 0.6 : 0.1 });
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (inView) setSeen(true);
  }, [inView]);
  const stops = custom && custom.length >= 2 ? custom.slice(0, 5) : null;
  const vars = {
    ...(stops && {
      backgroundImage: `radial-gradient(closest-side, color-mix(in srgb, ${stops[0]} 75%, transparent), transparent), radial-gradient(closest-side, color-mix(in srgb, ${stops[stops.length - 1]} 75%, transparent), transparent), linear-gradient(90deg, ${[...stops, ...stops.slice(0, -1).reverse()].join(', ')})`,
    }),
    ...(speed != null && speed > 0 && { '--oniva-gt-dur': `${speed}s` }),
    ...(speed === 0 && { animationName: 'none' }),
  } as CSSProperties;
  const sx = stylex.props(styles.root, sweep && styles.sweep, sweep && !seen && styles.pending, xstyle);
  return createElement(
    as,
    {
      ...rest,
      ref: mergeRefs(viewRef, ref),
      'data-paused': inView ? undefined : '',
      ...mergeSx(sx, className, vars),
    } as Record<string, unknown>,
    children,
  );
}
