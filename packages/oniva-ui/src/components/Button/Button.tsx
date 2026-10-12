import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import { focus } from '../../internal/focus';
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import { Loader2 } from 'lucide-react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { controlIconSize, controlStyles } from '../../internal/feedback-control';
import { mergeSx } from '../../internal/sx';
import type { ButtonSize } from '../../internal/types';

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

/** Reduced motion: no rotation, a slow opacity pulse instead (matches Spinner). */
const pulse = stylex.keyframes({ '0%, 100%': { opacity: 0.4 }, '50%': { opacity: 1 } });

const styles = stylex.create({
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
  startIcon,
  endIcon,
  children,
  className,
  style,
  xstyle,
  ref,
  ...rest
}: ButtonProps) {
  const sx = stylex.props(
    controlStyles.base,
    focus.ring,
    controlStyles[variant],
    controlStyles[size],
    isIconOnly && controlStyles[controlIconSize[size]],
    isLoading && styles.pending,
    xstyle,
  );
  return (
    <AriaButton
      {...rest}
      ref={ref}
      isPending={isLoading || rest.isPending}
      {...mergeSx(sx, className, style)}
    >
      <span {...stylex.props(styles.content, isLoading && styles.contentHidden)}>
        {startIcon}
        {children}
        {endIcon}
      </span>
      {isLoading && (
        <span {...stylex.props(styles.spinner)} aria-hidden="true">
          <Loader2 size={size === 'xs' ? 12 : 16} {...stylex.props(styles.spinIcon)} />
        </span>
      )}
    </AriaButton>
  );
}
