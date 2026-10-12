import * as stylex from '@stylexjs/stylex';
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
const scaleIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.96) translateY(4px)' },
  to: { opacity: 1, transform: 'scale(1) translateY(0)' },
});
const scaleOut = stylex.keyframes({
  from: { opacity: 1, transform: 'scale(1) translateY(0)' },
  to: { opacity: 0, transform: 'scale(0.98) translateY(2px)' },
});

const styles = stylex.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: colors.overlay,
    boxSizing: 'border-box',
    display: 'flex',
    height: '100vh',
    justifyContent: 'center',
    left: 0,
    padding: 16,
    position: 'fixed',
    top: 0,
    width: '100vw',
    zIndex: 100,
  },
  overlayEntering: {
    animationDuration: motion.durBase,
    animationFillMode: 'both',
    animationName: { default: fadeIn, '@media (prefers-reduced-motion: reduce)': 'none' },
    animationTimingFunction: motion.easeOut,
  },
  overlayExiting: {
    animationDuration: motion.durBase,
    animationFillMode: 'both',
    animationName: { default: fadeOut, '@media (prefers-reduced-motion: reduce)': 'none' },
    animationTimingFunction: motion.easeIn,
  },
  modal: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.xl,
    boxSizing: 'border-box',
    color: colors.text,
    fontFamily: font.sans,
    maxHeight: '100%',
    maxWidth: '100%',
    outline: 'none',
    overflow: 'hidden',
    width: 480,
  },
  sm: { width: 400 },
  md: { width: 480 },
  lg: { width: 640 },
  modalEntering: {
    animationDuration: motion.durSlow,
    animationFillMode: 'both',
    animationName: { default: scaleIn, '@media (prefers-reduced-motion: reduce)': 'none' },
    animationTimingFunction: motion.easeOut,
  },
  modalExiting: {
    animationDuration: motion.durBase,
    animationFillMode: 'both',
    animationName: { default: scaleOut, '@media (prefers-reduced-motion: reduce)': 'none' },
    animationTimingFunction: motion.easeIn,
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
    color: colors.text,
    fontSize: font.size18,
    fontWeight: font.weightSemibold,
    letterSpacing: font.trackCaption,
    lineHeight: font.lh18,
    margin: 0,
  },
  description: {
    color: colors.textMuted,
    fontSize: font.size14,
    lineHeight: font.lh14,
    margin: 0,
  },
  body: {
    color: colors.text,
    flexGrow: 1,
    fontSize: font.size14,
    lineHeight: font.lh14,
    overflowY: 'auto',
    paddingBlock: 0,
    paddingInline: 24,
  },
  footer: {
    alignItems: 'center',
    backgroundColor: colors.surfaceInset,
    borderTopColor: colors.border,
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
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceInsetHover },
    borderRadius: radius.md,
    borderWidth: 0,
    color: { default: colors.textMuted, ':hover': colors.text },
    cursor: 'pointer',
    display: 'inline-flex',
    height: 28,
    justifyContent: 'center',
    outlineColor: colors.focusRing,
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    position: 'absolute',
    right: 16,
    top: 16,
    transitionDuration: motion.durBase,
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
