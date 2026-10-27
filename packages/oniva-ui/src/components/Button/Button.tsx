import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import { focus } from '../../internal/focus';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import { Loader2 } from 'lucide-react';
import { useLayoutEffect, useRef, type CSSProperties, type ReactNode, type Ref } from 'react';
import { useObjectRef } from 'react-aria';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { motion } from '../../tokens/motion.stylex';
import { controlIconSize, controlStyles } from '../../internal/feedback-control';
import { mergeSx } from '../../internal/sx';
import type { ButtonSize } from '../../internal/types';

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

/** Reduced motion: no rotation, a slow opacity pulse instead (matches Spinner). */
const pulse = stylex.keyframes({ '0%, 100%': { opacity: 0.4 }, '50%': { opacity: 1 } });

const sweep = stylex.keyframes({
  from: { backgroundPosition: '150% 0' },
  to: { backgroundPosition: '-50% 0' },
});

const blurIn = stylex.keyframes({
  from: { filter: 'blur(3px)', opacity: 0, transform: 'translateY(2px)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0)' },
});
const swapFade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const iconIn = stylex.keyframes({
  from: { filter: 'blur(2px)', opacity: 0, transform: 'scale(0.8)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  /** Label / icon swaps replay a soft blur-in (keyed remount). */
  labelIn: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: blurIn, [media.reducedMotion]: swapFade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'inline-block',
  },
  iconSwap: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: iconIn, [media.reducedMotion]: swapFade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'inline-flex',
  },
  /** Shimmer loading: label stays readable, a light band sweeps across it. */
  shimmerLabel: {
    animationDuration: '1600ms',
    animationIterationCount: 'infinite',
    animationName: { default: sweep, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    backgroundClip: 'text',
    backgroundImage: {
      default:
        'linear-gradient(100deg, currentColor 0%, currentColor 38%, transparent 50%, currentColor 62%, currentColor 100%)',
      [media.reducedMotion]: 'none',
    },
    backgroundSize: '250% 100%',
    color: { default: 'transparent', [media.reducedMotion]: 'inherit' },
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: { default: 'transparent', [media.reducedMotion]: 'currentColor' },
  },
  shimmerDim: { opacity: 0.85 },
  pending: { cursor: 'progress' },
  content: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  // opacity (not visibility) keeps the accessible name while the spinner shows
  contentHidden: { opacity: 0 },
  spinner: {
    alignItems: 'center',
    display: 'flex',
    inset: 0,
    justifyContent: 'center',
    position: 'absolute',
  },
  spinIcon: {
    animationDuration: { default: '800ms', [media.reducedMotion]: '1200ms' },
    animationIterationCount: 'infinite',
    animationName: { default: spin, [media.reducedMotion]: pulse },
    animationTimingFunction: { default: 'linear', [media.reducedMotion]: 'ease-in-out' },
  },
});

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger';
export type { ButtonSize };

export interface ButtonProps extends Omit<AriaButtonProps, 'className' | 'style' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Square button for a single icon. Provide `aria-label`. */
  isIconOnly?: boolean;
  /** Shows a spinner, keeps width, and blocks presses (maps to RAC `isPending`). */
  isLoading?: boolean;
  /**
   * How loading is shown. `spinner` (default) hides the label behind a centered spinner;
   * `shimmer` keeps the label readable, swaps the start icon for a spinner and sweeps a band across the label.
   */
  loadingStyle?: 'spinner' | 'shimmer';
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** StyleX overrides, applied last. */
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isIconOnly = false,
  isLoading = false,
  loadingStyle = 'spinner',
  startIcon,
  endIcon,
  children,
  className,
  style,
  xstyle,
  ref,
  ...rest
}: ButtonProps) {
  const shimmer = isLoading && loadingStyle === 'shimmer';
  const btnRef = useObjectRef(ref);
  const lastW = useRef<number | null>(null);
  const labelKey = typeof children === 'string' || typeof children === 'number' ? String(children) : undefined;
  // Width glides to the new label size (out-of-flow neighbours reflow with it; WAAPI, interruptible).
  useLayoutEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    const prev = lastW.current;
    const next = el.offsetWidth;
    lastW.current = next;
    if (prev == null || prev === next || labelKey === undefined || isIconOnly) return;
    if (prefersReducedMotion() || typeof el.animate !== 'function') return;
    const a = el.animate([{ width: `${prev}px` }, { width: `${next}px` }], {
      duration: 220,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    });
    return () => a.cancel();
  }, [labelKey, isIconOnly, btnRef]);
  const sx = stylex.props(
    controlStyles.base,
    focus.ring,
    controlStyles[variant],
    controlStyles[size],
    isIconOnly && controlStyles[controlIconSize[size]],
    isLoading && styles.pending,
    shimmer && styles.shimmerDim,
    xstyle,
  );
  return (
    <AriaButton
      {...rest}
      ref={btnRef}
      isPending={isLoading || rest.isPending}
      {...mergeSx(sx, className, style)}
    >
      <span {...stylex.props(styles.content, isLoading && !shimmer && styles.contentHidden)}>
        {shimmer ? (
          <Loader2 size={size === 'xs' ? 12 : 16} aria-hidden="true" {...stylex.props(styles.spinIcon)} />
        ) : startIcon != null ? (
          <span key={shimmer ? 's' : 'i'} {...stylex.props(styles.iconSwap)}>
            {startIcon}
          </span>
        ) : null}
        {shimmer && children != null ? (
          <span {...stylex.props(styles.shimmerLabel)}>{children}</span>
        ) : labelKey !== undefined ? (
          <span key={labelKey} {...stylex.props(styles.labelIn)}>
            {children}
          </span>
        ) : (
          children
        )}
        {endIcon}
      </span>
      {isLoading && !shimmer && (
        <span {...stylex.props(styles.spinner)} aria-hidden="true">
          <Loader2 size={size === 'xs' ? 12 : 16} {...stylex.props(styles.spinIcon)} />
        </span>
      )}
    </AriaButton>
  );
}
