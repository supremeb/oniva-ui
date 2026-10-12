import * as stylex from '@stylexjs/stylex';
import {
  Button as AriaButton,
  Text as AriaText,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  type QueuedToast,
} from 'react-aria-components';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { Button } from '../Button';

const fromBottom = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(12px) scale(0.98)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});
const fromTop = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(-12px) scale(0.98)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});

const styles = stylex.create({
  region: {
    boxSizing: 'border-box',
    display: 'flex',
    gap: 8,
    maxHeight: '100vh',
    outline: 'none',
    padding: 16,
    pointerEvents: 'none',
    position: 'fixed',
    width: 392,
    maxWidth: '100vw',
    zIndex: 200,
  },
  stackBottom: { flexDirection: 'column-reverse' },
  stackTop: { flexDirection: 'column' },
  bottom: { bottom: 0 },
  top: { top: 0 },
  left: { left: 0 },
  right: { right: 0 },
  centerX: { left: '50%', marginLeft: -196 },
  toast: {
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.dropdown,
    boxSizing: 'border-box',
    color: colors.text,
    display: 'flex',
    fontFamily: font.sans,
    gap: 10,
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    padding: 12,
    pointerEvents: 'auto',
    width: '100%',
  },
  enterBottom: {
    animationDuration: motion.durSlow,
    animationFillMode: 'both',
    animationName: { default: fromBottom, '@media (prefers-reduced-motion: reduce)': 'none' },
    animationTimingFunction: motion.easeOut,
  },
  enterTop: {
    animationDuration: motion.durSlow,
    animationFillMode: 'both',
    animationName: { default: fromTop, '@media (prefers-reduced-motion: reduce)': 'none' },
    animationTimingFunction: motion.easeOut,
  },
  icon: { display: 'inline-flex', flexShrink: 0, height: 20, marginTop: 0, width: 20 },
  iconSuccess: { color: colors.successSolid },
  iconWarning: { color: colors.warningSolid },
  iconDanger: { color: colors.dangerSolid },
  iconInfo: { color: colors.infoSolid },
  content: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 },
  title: {
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    lineHeight: font.lh14,
    margin: 0,
  },
  description: {
    color: colors.textMuted,
    fontSize: font.size13,
    lineHeight: font.lh13,
    margin: 0,
  },
  actionRow: { marginTop: 8 },
  close: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceInsetHover },
    borderRadius: radius.sm,
    borderWidth: 0,
    color: { default: colors.textMuted, ':hover': colors.text },
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    height: 24,
    justifyContent: 'center',
    marginInlineEnd: -4,
    marginTop: -2,
    outlineColor: colors.focusRing,
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, color',
    width: 24,
  },
});

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface ToastAction {
  label: string;
  onPress?: () => void;
}

export interface ToastData {
  title: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  action?: ToastAction;
  /** Override the variant icon. Pass `null` to hide it. */
  icon?: ReactNode | null;
}

export interface ToastOptions extends Omit<ToastData, 'title'> {
  /** Auto-dismiss delay in ms. Default 5000. Use `Infinity` for a persistent toast. */
  duration?: number;
  onClose?: () => void;
}

/** Shared queue used by the imperative `toast()` API and `ToastProvider`. */
export const toastQueue = new ToastQueue<ToastData>({ maxVisibleToasts: 5 });

function add(
  titleOrData: ReactNode | (ToastOptions & { title: ReactNode }),
  options: ToastOptions = {},
  variant?: ToastVariant,
): string {
  const isData =
    typeof titleOrData === 'object' &&
    titleOrData !== null &&
    !Array.isArray(titleOrData) &&
    'title' in (titleOrData as object) &&
    !('$$typeof' in (titleOrData as object));
  const merged = isData
    ? (titleOrData as ToastOptions & { title: ReactNode })
    : { ...options, title: titleOrData as ReactNode };
  const { duration = 5000, onClose, ...data } = merged;
  return toastQueue.add({ ...data, variant: data.variant ?? variant ?? 'default' } as ToastData, {
    timeout: Number.isFinite(duration) ? duration : undefined,
    onClose,
  });
}

/**
 * Imperative API. `toast('Saved')`, `toast.success('Invoice sent', { description })`,
 * `toast({ title, action: { label: 'Undo', onPress } })`. Requires one `<ToastProvider>` mounted.
 */
export const toast = Object.assign(
  (titleOrData: ReactNode | (ToastOptions & { title: ReactNode }), options?: ToastOptions) =>
    add(titleOrData, options),
  {
    success: (title: ReactNode, options?: ToastOptions) => add(title, options, 'success'),
    warning: (title: ReactNode, options?: ToastOptions) => add(title, options, 'warning'),
    danger: (title: ReactNode, options?: ToastOptions) => add(title, options, 'danger'),
    error: (title: ReactNode, options?: ToastOptions) => add(title, options, 'danger'),
    info: (title: ReactNode, options?: ToastOptions) => add(title, options, 'info'),
    dismiss: (key: string) => toastQueue.close(key),
    clear: () => toastQueue.clear(),
  },
);

export type ToastPlacement =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

const variantIcon = {
  default: null,
  success: <CheckCircle2 size={20} />,
  warning: <AlertTriangle size={20} />,
  danger: <XCircle size={20} />,
  info: <Info size={20} />,
} as const;
const variantTone = {
  default: undefined,
  success: 'iconSuccess',
  warning: 'iconWarning',
  danger: 'iconDanger',
  info: 'iconInfo',
} as const;

function ToastItem({
  item,
  top,
  queue,
}: {
  item: QueuedToast<ToastData>;
  top: boolean;
  queue: typeof toastQueue;
}) {
  const { title, description, variant = 'default', action, icon } = item.content;
  const iconNode = icon === undefined ? variantIcon[variant] : icon;
  const tone = variantTone[variant];
  return (
    <AriaToast
      toast={item}
      {...stylex.props(styles.toast, top ? styles.enterTop : styles.enterBottom)}
      data-variant={variant}
    >
      {iconNode && (
        <span {...stylex.props(styles.icon, tone && styles[tone])} aria-hidden="true">
          {iconNode}
        </span>
      )}
      <AriaToastContent {...stylex.props(styles.content)}>
        <AriaText slot="title" {...stylex.props(styles.title)}>
          {title}
        </AriaText>
        {description != null && (
          <AriaText slot="description" {...stylex.props(styles.description)}>
            {description}
          </AriaText>
        )}
        {action && (
          <div {...stylex.props(styles.actionRow)}>
            <Button
              size="xs"
              variant="secondary"
              onPress={() => {
                action.onPress?.();
                queue.close(item.key);
              }}
            >
              {action.label}
            </Button>
          </div>
        )}
      </AriaToastContent>
      <AriaButton slot="close" aria-label="Dismiss notification" {...stylex.props(styles.close)}>
        <X size={14} aria-hidden="true" />
      </AriaButton>
    </AriaToast>
  );
}

export interface ToastProviderProps {
  children?: ReactNode;
  placement?: ToastPlacement;
  /** Use a custom queue instead of the shared one behind `toast()`. */
  queue?: typeof toastQueue;
  /** Accessible landmark label. */
  'aria-label'?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Mount once near the app root (inside `ThemeProvider` so toasts inherit the theme).
 * Renders `children` plus the live region that displays `toast()` notifications.
 */
export function ToastProvider({
  children,
  placement = 'bottom-right',
  queue = toastQueue,
  'aria-label': ariaLabel = 'Notifications',
  className,
  xstyle,
  ref,
}: ToastProviderProps) {
  const top = placement.startsWith('top');
  const side = placement.endsWith('left')
    ? 'left'
    : placement.endsWith('right')
      ? 'right'
      : 'centerX';
  return (
    <>
      {children}
      <AriaToastRegion<ToastData>
        queue={queue}
        aria-label={ariaLabel}
        ref={ref}
        {...mergeSx(
          stylex.props(
            styles.region,
            top ? styles.top : styles.bottom,
            top ? styles.stackTop : styles.stackBottom,
            styles[side],
            xstyle,
          ),
          className,
        )}
      >
        {({ toast: t }) => <ToastItem item={t} top={top} queue={queue} />}
      </AriaToastRegion>
    </>
  );
}
