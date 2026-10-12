import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import {
  Dialog as AriaDialog,
  DialogTrigger,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type DialogProps as AriaDialogProps,
  type ModalOverlayProps as AriaModalOverlayProps,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { DialogCloseButton } from '../Dialog';

const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });
const inRight = stylex.keyframes({
  from: { transform: 'translateX(100%)' },
  to: { transform: 'translateX(0)' },
});
const outRight = stylex.keyframes({
  from: { transform: 'translateX(0)' },
  to: { transform: 'translateX(100%)' },
});
const inLeft = stylex.keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(0)' },
});
const outLeft = stylex.keyframes({
  from: { transform: 'translateX(0)' },
  to: { transform: 'translateX(-100%)' },
});
const inBottom = stylex.keyframes({
  from: { transform: 'translateY(100%)' },
  to: { transform: 'translateY(0)' },
});
const outBottom = stylex.keyframes({
  from: { transform: 'translateY(0)' },
  to: { transform: 'translateY(100%)' },
});

const styles = stylex.create({
  overlay: {
    backgroundColor: colors['--oniva-color-overlay'],
    height: '100vh',
    left: 0,
    position: 'fixed',
    top: 0,
    width: '100vw',
    zIndex: 100,
  },
  overlayEntering: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'both',
    animationName: { default: fadeIn, [media.reducedMotion]: 'none' },
  },
  overlayExiting: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'both',
    animationName: { default: fadeOut, [media.reducedMotion]: 'none' },
  },
  panel: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderStyle: 'solid',
    borderWidth: 0,
    boxShadow: shadow['--oniva-shadow-xl'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    outline: 'none',
    position: 'fixed',
  },
  right: {
    borderLeftWidth: 1,
    borderRadius: `${radius['--oniva-radius-card']} 0 0 ${radius['--oniva-radius-card']}`,
    bottom: 0,
    height: '100%',
    right: 0,
    top: 0,
  },
  left: {
    borderRadius: `0 ${radius['--oniva-radius-card']} ${radius['--oniva-radius-card']} 0`,
    borderRightWidth: 1,
    bottom: 0,
    height: '100%',
    left: 0,
    top: 0,
  },
  bottom: {
    borderRadius: `${radius['--oniva-radius-card']} ${radius['--oniva-radius-card']} 0 0`,
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    maxHeight: '85%',
    right: 0,
    width: '100%',
  },
  sizeSm: { maxWidth: '100%', width: 320 },
  sizeMd: { maxWidth: '100%', width: 420 },
  sizeLg: { maxWidth: '100%', width: 560 },
  enterRight: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'both',
    animationName: { default: inRight, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  exitRight: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'both',
    animationName: { default: outRight, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-in'],
  },
  enterLeft: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'both',
    animationName: { default: inLeft, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  exitLeft: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'both',
    animationName: { default: outLeft, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-in'],
  },
  enterBottom: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'both',
    animationName: { default: inBottom, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  exitBottom: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'both',
    animationName: { default: outBottom, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-in'],
  },
  dialog: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    minHeight: 0,
    minWidth: 0,
    outline: 'none',
    overflow: 'hidden',
    position: 'relative',
  },
});

export type DrawerSide = 'left' | 'right' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg';

const enter = { right: 'enterRight', left: 'enterLeft', bottom: 'enterBottom' } as const;
const exit = { right: 'exitRight', left: 'exitLeft', bottom: 'exitBottom' } as const;
const sizeKey = { sm: 'sizeSm', md: 'sizeMd', lg: 'sizeLg' } as const;

export interface DrawerProps extends Omit<
  AriaModalOverlayProps,
  'className' | 'style' | 'children'
> {
  side?: DrawerSide;
  /** Width for left/right drawers (ignored for bottom). */
  size?: DrawerSize;
  children?: AriaDialogProps['children'] | ReactNode;
  /** Accessible name when the content has no `DialogTitle`. */
  'aria-label'?: string;
  showCloseButton?: boolean;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Sheet that slides in from an edge. Compose its content with `DialogHeader`, `DialogBody`,
 * `DialogFooter` from the Dialog component. Use inside a `DrawerTrigger` or control with `isOpen`.
 */
export function Drawer({
  side = 'right',
  size = 'md',
  children,
  className,
  xstyle,
  ref,
  showCloseButton = true,
  isDismissable = true,
  'aria-label': ariaLabel,
  ...rest
}: DrawerProps) {
  return (
    <AriaModalOverlay
      isDismissable={isDismissable}
      {...rest}
      className={({ isEntering, isExiting }) =>
        stylex.props(
          styles.overlay,
          isEntering && styles.overlayEntering,
          isExiting && styles.overlayExiting,
        ).className ?? ''
      }
    >
      <AriaModal
        ref={ref}
        className={({ isEntering, isExiting }) =>
          mergeSx(
            stylex.props(
              styles.panel,
              styles[side],
              side !== 'bottom' && styles[sizeKey[size]],
              isEntering && styles[enter[side]],
              isExiting && styles[exit[side]],
              xstyle,
            ),
            className,
          ).className
        }
      >
        <AriaDialog aria-label={ariaLabel} {...stylex.props(styles.dialog)}>
          {(opts) => (
            <>
              {showCloseButton && <DialogCloseButton />}
              {typeof children === 'function' ? children(opts) : children}
            </>
          )}
        </AriaDialog>
      </AriaModal>
    </AriaModalOverlay>
  );
}

export { DialogTrigger as DrawerTrigger };
