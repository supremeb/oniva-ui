import * as stylex from '@stylexjs/stylex';
import { AlertTriangle, Info } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { Dialog as AriaDialog } from 'react-aria-components';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { Button } from '../Button';
import { DialogDescription, DialogTitle, Modal } from '../Dialog';
import { DialogTrigger } from '../Dialog';

const styles = stylex.create({
  dialog: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    outline: 'none',
    padding: 24,
  },
  top: { alignItems: 'flex-start', display: 'flex', gap: 14 },
  badge: {
    alignItems: 'center',
    borderRadius: 9999,
    display: 'inline-flex',
    flexShrink: 0,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  badgeDefault: {
    backgroundColor: colors['--oniva-color-info-bg'],
    color: colors['--oniva-color-info-fg'],
  },
  badgeDanger: {
    backgroundColor: colors['--oniva-color-danger-bg'],
    color: colors['--oniva-color-danger-fg'],
  },
  text: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, paddingTop: 2 },
  footer: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
  fontBase: { fontFamily: font['--oniva-font-sans'] },
});

export interface AlertDialogProps {
  title: ReactNode;
  /** Explanatory body text. */
  children?: ReactNode;
  /** `danger` swaps the confirm button + icon to destructive styling. */
  variant?: 'default' | 'danger';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  /** Override the leading icon. */
  icon?: ReactNode;
  /** Controlled open state (otherwise use inside `DialogTrigger`). */
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/**
 * Confirmation dialog (`role="alertdialog"`). Not dismissable by outside click; initial focus lands on Cancel.
 * Use inside a `DialogTrigger`, or control it with `isOpen`.
 */
export function AlertDialog({
  title,
  children,
  variant = 'default',
  confirmLabel = variant === 'danger' ? 'Delete' : 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  icon,
  isOpen,
  onOpenChange,
  className,
  xstyle,
  ref,
}: AlertDialogProps) {
  return (
    <Modal size="sm" isDismissable={false} isOpen={isOpen} onOpenChange={onOpenChange}>
      <AriaDialog
        role="alertdialog"
        ref={ref}
        {...mergeSx(stylex.props(styles.dialog, styles.fontBase, xstyle), className)}
      >
        <div {...stylex.props(styles.top)}>
          <span
            {...stylex.props(
              styles.badge,
              variant === 'danger' ? styles.badgeDanger : styles.badgeDefault,
            )}
            aria-hidden="true"
          >
            {icon ?? (variant === 'danger' ? <AlertTriangle size={20} /> : <Info size={20} />)}
          </span>
          <div {...stylex.props(styles.text)}>
            <DialogTitle>{title}</DialogTitle>
            {children != null && <DialogDescription>{children}</DialogDescription>}
          </div>
        </div>
        <div {...stylex.props(styles.footer)}>
          <Button slot="close" variant="secondary" autoFocus onPress={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            slot="close"
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onPress={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </AriaDialog>
    </Modal>
  );
}

export { DialogTrigger as AlertDialogTrigger };
