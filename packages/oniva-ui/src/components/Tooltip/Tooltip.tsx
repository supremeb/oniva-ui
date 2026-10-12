import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import {
  OverlayArrow,
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipProps as AriaTooltipProps,
  type TooltipTriggerComponentProps,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const fadeIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.96)' },
  to: { opacity: 1, transform: 'scale(1)' },
});
const fadeOut = stylex.keyframes({
  from: { opacity: 1, transform: 'scale(1)' },
  to: { opacity: 0, transform: 'scale(0.96)' },
});

const styles = stylex.create({
  tooltip: {
    // inverted surface: dark in light mode, light in dark mode
    backgroundColor: colors['--oniva-color-text'],
    borderRadius: radius['--oniva-radius-md'],
    boxShadow: shadow['--oniva-shadow-md'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-bg'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-caption'],
    lineHeight: font['--oniva-font-lh-12'],
    maxWidth: 260,
    paddingBlock: 6,
    paddingInline: 10,
  },
  entering: {
    animationDuration: motion['--oniva-motion-dur-fast'],
    animationFillMode: 'both',
    animationName: { default: fadeIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  exiting: {
    animationDuration: motion['--oniva-motion-dur-fast'],
    animationFillMode: 'both',
    animationName: { default: fadeOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-in'],
  },
  arrow: { display: 'block', fill: colors['--oniva-color-text'] },
  arrowBottom: { transform: 'rotate(180deg)' },
  arrowLeft: { transform: 'rotate(-90deg)' },
  arrowRight: { transform: 'rotate(90deg)' },
});

export interface TooltipProps
  extends
    Omit<AriaTooltipProps, 'className' | 'style' | 'children'>,
    Pick<TooltipTriggerComponentProps, 'delay' | 'closeDelay' | 'isDisabled' | 'trigger'> {
  /** Tooltip text/content. */
  content: ReactNode;
  /** The trigger element. Must be focusable/pressable (e.g. Button, Link). */
  children: ReactNode;
  showArrow?: boolean;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Short text hint on hover/focus. `<Tooltip content="Copy link"><Button …/></Tooltip>` */
export function Tooltip({
  content,
  children,
  delay = 300,
  closeDelay = 100,
  isDisabled,
  trigger,
  showArrow = true,
  placement = 'top',
  offset = 6,
  className,
  xstyle,
  ref,
  ...rest
}: TooltipProps) {
  return (
    <AriaTooltipTrigger
      delay={delay}
      closeDelay={closeDelay}
      isDisabled={isDisabled}
      trigger={trigger}
    >
      {children}
      <AriaTooltip
        {...rest}
        ref={ref}
        placement={placement}
        offset={showArrow ? offset + 2 : offset}
        className={({ isEntering, isExiting }) =>
          mergeSx(
            stylex.props(
              styles.tooltip,
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
            {({ placement: p }) => (
              <svg
                width={8}
                height={8}
                viewBox="0 0 8 8"
                {...stylex.props(
                  styles.arrow,
                  p === 'bottom' && styles.arrowBottom,
                  p === 'left' && styles.arrowLeft,
                  p === 'right' && styles.arrowRight,
                )}
              >
                <path d="M0 0 L4 4 L8 0" />
              </svg>
            )}
          </OverlayArrow>
        )}
        {content}
      </AriaTooltip>
    </AriaTooltipTrigger>
  );
}
