import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import {
  Dialog as AriaDialog,
  DialogTrigger,
  OverlayArrow,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { originStyles } from '../../internal/overlays-menu';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const popIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.96)' },
  to: { opacity: 1, transform: 'scale(1)' },
});
const popOut = stylex.keyframes({
  from: { opacity: 1, transform: 'scale(1)' },
  to: { opacity: 0, transform: 'scale(0.96)' },
});

const styles = stylex.create({
  popover: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-elevation-floating'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-14'],
    maxWidth: 360,
    minWidth: 200,
    outline: 'none',
  },
  entering: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'both',
    animationName: { default: popIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  exiting: {
    animationDuration: motion['--oniva-motion-dur-fast'],
    animationFillMode: 'both',
    animationName: { default: popOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  dialog: { boxSizing: 'border-box', outline: 'none', padding: 16 },
  noPad: { padding: 0 },
  arrow: {
    display: 'block',
    fill: colors['--oniva-color-surface'],
    stroke: colors['--oniva-color-border'],
    strokeWidth: 1,
  },
  arrowBottom: { transform: 'rotate(180deg)' },
  arrowLeft: { transform: 'rotate(-90deg)' },
  arrowRight: { transform: 'rotate(90deg)' },
});

export interface PopoverProps extends Omit<AriaPopoverProps, 'className' | 'style' | 'children'> {
  children?: ReactNode | ((opts: { close: () => void }) => ReactNode);
  /** Accessible name for the popover dialog. */
  'aria-label'?: string;
  /** Show a pointer arrow towards the trigger. */
  showArrow?: boolean;
  /** Remove the default 16px content padding. */
  noPadding?: boolean;
  className?: string;
  /** StyleX overrides for the popover surface, applied last. */
  xstyle?: stylex.StyleXStyles;
  /** StyleX overrides for the inner dialog (padding etc). */
  contentXstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/**
 * Non-modal-looking floating panel anchored to its trigger. Place inside `PopoverTrigger`
 * (the first child must be pressable). Content is wrapped in a labelled dialog for focus management.
 */
export function Popover({
  children,
  showArrow = false,
  noPadding = false,
  className,
  xstyle,
  contentXstyle,
  'aria-label': ariaLabel,
  offset = 8,
  ref,
  ...rest
}: PopoverProps) {
  return (
    <AriaPopover
      offset={showArrow ? offset + 4 : offset}
      {...rest}
      ref={ref}
      className={({ isEntering, isExiting }) =>
        mergeSx(
          stylex.props(
            styles.popover,
            originStyles.aware,
            isEntering && styles.entering,
            isExiting && styles.exiting,
            xstyle,
          ),
          className,
        ).className
      }
    >
      {showArrow && (
        <OverlayArrow>
          {({ placement }) => (
            <svg
              width={12}
              height={12}
              viewBox="0 0 12 12"
              {...stylex.props(
                styles.arrow,
                placement === 'bottom' && styles.arrowBottom,
                placement === 'left' && styles.arrowLeft,
                placement === 'right' && styles.arrowRight,
              )}
            >
              <path d="M0 0 L6 6 L12 0" />
            </svg>
          )}
        </OverlayArrow>
      )}
      <AriaDialog
        aria-label={ariaLabel}
        {...stylex.props(styles.dialog, noPadding && styles.noPad, contentXstyle)}
      >
        {({ close }) => (typeof children === 'function' ? children({ close }) : children)}
      </AriaDialog>
    </AriaPopover>
  );
}

export { DialogTrigger as PopoverTrigger };
