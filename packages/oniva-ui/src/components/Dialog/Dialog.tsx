import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger,
  Heading as AriaHeading,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type DialogProps as AriaDialogProps,
  type ModalOverlayProps as AriaModalOverlayProps,
} from 'react-aria-components';
import { X } from 'lucide-react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });
// Centered modals scale from the middle (never from a trigger). Opacity + scale only.
const scaleIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.96)' },
  to: { opacity: 1, transform: 'scale(1)' },
});
const scaleOut = stylex.keyframes({
  from: { opacity: 1, transform: 'scale(1)' },
  to: { opacity: 0, transform: 'scale(0.96)' },
});
// Mobile: present as a bottom sheet on the drawer curve.
const sheetIn = stylex.keyframes({ from: { transform: 'translate3d(0, 100%, 0)' } });
const sheetOut = stylex.keyframes({ to: { transform: 'translate3d(0, 100%, 0)' } });
const MOBILE = '@media (max-width: 640px)';

const styles = stylex.create({
  overlay: {
    alignItems: { default: 'center', [MOBILE]: 'flex-end' },
    backgroundColor: colors['--oniva-color-overlay'],
    boxSizing: 'border-box',
    display: 'flex',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    padding: { default: 16, [MOBILE]: 0 },
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 100,
  },
  overlayEntering: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'both',
    animationName: { default: fadeIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  overlayExiting: {
    animationDuration: { default: '140ms', [media.reducedMotion]: '0.01ms' },
    animationFillMode: 'both',
    animationName: { default: fadeOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  modal: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: {
      default: radius['--oniva-radius-card'],
      [MOBILE]: `${radius['--oniva-radius-card']} ${radius['--oniva-radius-card']} 0 0`,
    },
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-elevation-overlay'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    maxHeight: '100%',
    maxWidth: '100%',
    outline: 'none',
    overflow: 'hidden',
    overscrollBehavior: 'contain',
    width: 480,
  },
  sm: { width: { default: 400, [MOBILE]: '100%' } },
  md: { width: { default: 480, [MOBILE]: '100%' } },
  lg: { width: { default: 640, [MOBILE]: '100%' } },
  modalEntering: {
    animationDuration: {
      default: motion['--oniva-motion-dur-enter'],
      [MOBILE]: motion['--oniva-motion-dur-sheet'],
    },
    animationFillMode: 'both',
    animationName: {
      default: scaleIn,
      [MOBILE]: sheetIn,
      [media.reducedMotion]: fadeIn,
    },
    animationTimingFunction: {
      default: motion['--oniva-motion-ease-out'],
      [MOBILE]: motion['--oniva-motion-ease-drawer'],
    },
  },
  modalExiting: {
    animationDuration: {
      default: '140ms',
      [MOBILE]: '300ms',
      [media.reducedMotion]: '0.01ms',
    },
    animationFillMode: 'both',
    animationName: {
      default: scaleOut,
      [MOBILE]: sheetOut,
      [media.reducedMotion]: fadeOut,
    },
    animationTimingFunction: {
      default: motion['--oniva-motion-ease-out'],
      [MOBILE]: motion['--oniva-motion-ease-drawer'],
    },
  },
  dialog: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: 'inherit',
    outline: 'none',
    position: 'relative',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    paddingBlock: 20,
    paddingInline: 24,
    paddingInlineEnd: 56,
  },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-18'],
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: font['--oniva-font-track-caption'],
    lineHeight: font['--oniva-font-lh-18'],
    margin: 0,
  },
  description: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-14'],
    margin: 0,
  },
  body: {
    color: colors['--oniva-color-text'],
    flexGrow: 1,
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-14'],
    overflowY: 'auto',
    paddingBlock: 0,
    paddingInline: 24,
  },
  footer: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingBlock: 12,
    paddingInline: 24,
  },
  close: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: { default: colors['--oniva-color-text-muted'], ':hover': { default: null, [media.hover]: colors['--oniva-color-text'] } },
    cursor: 'pointer',
    display: 'inline-flex',
    height: 28,
    justifyContent: 'center',
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    position: 'absolute',
    insetInlineEnd: 16,
    top: 16,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color',
    width: 28,
  },
});

export type DialogSize = 'sm' | 'md' | 'lg';

export interface ModalProps extends Omit<
  AriaModalOverlayProps,
  'className' | 'style' | 'children'
> {
  size?: DialogSize;
  children?: ReactNode;
  className?: string;
  /** StyleX overrides for the dialog panel, applied last. */
  xstyle?: stylex.StyleXStyles;
  /** StyleX overrides for the backdrop. */
  overlayXstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Backdrop + animated panel. Place inside a `DialogTrigger` (or control with `isOpen`). */
export function Modal({
  size = 'md',
  children,
  className,
  xstyle,
  overlayXstyle,
  ref,
  isDismissable = true,
  ...rest
}: ModalProps) {
  return (
    <AriaModalOverlay
      isDismissable={isDismissable}
      {...rest}
      className={({ isEntering, isExiting }) =>
        stylex.props(
          styles.overlay,
          isEntering && styles.overlayEntering,
          isExiting && styles.overlayExiting,
          overlayXstyle,
        ).className ?? ''
      }
    >
      <AriaModal
        ref={ref}
        className={({ isEntering, isExiting }) =>
          mergeSx(
            stylex.props(
              styles.modal,
              styles[size],
              isEntering && styles.modalEntering,
              isExiting && styles.modalExiting,
              xstyle,
            ),
            className,
          ).className
        }
      >
        {children}
      </AriaModal>
    </AriaModalOverlay>
  );
}

export interface DialogProps extends Omit<AriaDialogProps, 'className' | 'style'> {
  className?: string;
  /** Shows the top-right close (X) button. Default true. */
  showCloseButton?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Dialog({
  className,
  showCloseButton = true,
  xstyle,
  ref,
  children,
  ...rest
}: DialogProps) {
  return (
    <AriaDialog {...rest} ref={ref} {...mergeSx(stylex.props(styles.dialog, xstyle), className)}>
      {(opts) => (
        <>
          {showCloseButton && <DialogCloseButton />}
          {typeof children === 'function' ? children(opts) : children}
        </>
      )}
    </AriaDialog>
  );
}

/** The X button. Uses RAC's `slot="close"` so it closes the enclosing dialog. */
export function DialogCloseButton({ 'aria-label': label = 'Close' }: { 'aria-label'?: string }) {
  return <CloseSlotButton label={label} />;
}

function CloseSlotButton({ label }: { label: string }) {
  return (
    <AriaButton slot="close" aria-label={label} {...stylex.props(styles.close)}>
      <X size={16} aria-hidden="true" />
    </AriaButton>
  );
}

type DivProps = Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'> & {
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
};

export function DialogHeader({ className, xstyle, ref, ...rest }: DivProps) {
  return <div {...rest} ref={ref} {...mergeSx(stylex.props(styles.header, xstyle), className)} />;
}

export function DialogTitle({
  className,
  xstyle,
  ...rest
}: {
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <AriaHeading
      {...rest}
      slot="title"
      level={2}
      {...mergeSx(stylex.props(styles.title, xstyle), className)}
    />
  );
}

export function DialogDescription({
  className,
  xstyle,
  ref,
  ...rest
}: HTMLAttributes<HTMLParagraphElement> & {
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLParagraphElement>;
}) {
  return (
    <p {...rest} ref={ref} {...mergeSx(stylex.props(styles.description, xstyle), className)} />
  );
}

export function DialogBody({ className, xstyle, ref, ...rest }: DivProps) {
  return <div {...rest} ref={ref} {...mergeSx(stylex.props(styles.body, xstyle), className)} />;
}

export function DialogFooter({ className, xstyle, ref, ...rest }: DivProps) {
  return <div {...rest} ref={ref} {...mergeSx(stylex.props(styles.footer, xstyle), className)} />;
}

export { DialogTrigger };
