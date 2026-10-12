import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import {
  Popover as AriaPopover,
  PreviewTrigger,
  type PopoverProps as AriaPopoverProps,
  type PreviewTriggerProps,
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
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-dropdown'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-14'],
    outline: 'none',
    padding: 16,
    width: 280,
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
});

export interface HoverCardProps extends Omit<PreviewTriggerProps, 'children'> {
  /** A focusable trigger (Link, Button…) followed by a `HoverCardContent`. */
  children: ReactNode;
}

/** Opens a rich, interactive card on hover, focus or long-press. Unlike Tooltip, content may contain links/buttons. */
export function HoverCard({ delay = 500, closeDelay = 150, ...props }: HoverCardProps) {
  return <PreviewTrigger delay={delay} closeDelay={closeDelay} {...props} />;
}

export interface HoverCardContentProps extends Omit<
  AriaPopoverProps,
  'className' | 'style' | 'children'
> {
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function HoverCardContent({
  children,
  className,
  xstyle,
  ref,
  placement = 'bottom start',
  offset = 8,
  ...rest
}: HoverCardContentProps) {
  return (
    <AriaPopover
      {...rest}
      ref={ref}
      placement={placement}
      offset={offset}
      className={({ isEntering, isExiting }) =>
        mergeSx(
          stylex.props(
            styles.card,
            originStyles.aware,
            isEntering && styles.entering,
            isExiting && styles.exiting,
            xstyle,
          ),
          className,
        ).className
      }
    >
      {children}
    </AriaPopover>
  );
}
