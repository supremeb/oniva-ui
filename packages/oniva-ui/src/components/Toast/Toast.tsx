import * as stylex from '@stylexjs/stylex';
import { focus } from '../../internal/focus';
import {
  Button as AriaButton,
  Text as AriaText,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastRegion as AriaToastRegion,
  type QueuedToast,
} from 'react-aria-components';
import { AlertTriangle, CheckCircle2, Info, Loader2, X, XCircle } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { OnivaToastQueue } from '../../internal/overlays-toast';
import { mergeSx } from '../../internal/sx';
import { useReducedMotion } from '../../internal/motion-hooks';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { Button } from '../Button';

const spin = stylex.keyframes({ to: { transform: 'rotate(360deg)' } });
const swapIn = stylex.keyframes({
  from: { filter: 'blur(2px)', opacity: 0, transform: 'scale(0.8)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'scale(1)' },
});
const swapFade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const textIn = stylex.keyframes({
  from: { filter: 'blur(2px)', opacity: 0, transform: 'translateY(3px)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0)' },
});

/** Layout constants (px). Sonner-style stacking. */
const GAP = 12;
const PEEK = 14;
const SCALE_STEP = 0.05;
const INSET = 16;
const SWIPE_VELOCITY = 0.11; // px/ms
const SWIPE_RATIO = 0.45;

const styles = stylex.create({
  region: {
    boxSizing: 'border-box',
    height: 0,
    outline: 'none',
    pointerEvents: 'none',
    position: 'fixed',
    width: 392,
    maxWidth: '100%',
    zIndex: 200,
  },
  bottom: { bottom: 0 },
  top: { top: 0 },
  left: { left: 0 },
  right: { right: 0 },
  centerX: { left: '50%', transform: 'translateX(-50%)' },
  /** Positioned/transformed slot. Layout vars are written inline: --ty --s --sx. */
  slot: {
    left: INSET,
    position: 'absolute',
    right: INSET,
    touchAction: 'pan-y',
    transform: 'translate3d(var(--sx, 0px), var(--ty, 0px), 0) scale(var(--s, 1))',
    transitionDuration: `${motion['--oniva-motion-dur-sheet']}, ${motion['--oniva-motion-dur-base']}, ${motion['--oniva-motion-dur-sheet']}`,
    transitionProperty: {
      default: 'transform, opacity, clip-path',
      [media.reducedMotion]: 'opacity, clip-path',
    },
    transitionTimingFunction: motion['--oniva-motion-ease-drawer'],
    // pointer hit area across the gap so the stack does not collapse mid-hover
    '::before': {
      content: '""',
      height: GAP + 2,
      left: 0,
      position: 'absolute',
      right: 0,
    },
  },
  slotBottom: { bottom: INSET, '::before': { top: '100%' } },
  slotTop: { top: INSET, '::before': { bottom: '100%' } },
  slotSwiping: { transitionProperty: 'opacity, clip-path', userSelect: 'none' },
  slotExiting: {
    transitionDuration: `${motion['--oniva-motion-dur-slow']}, ${motion['--oniva-motion-dur-base']}, ${motion['--oniva-motion-dur-slow']}`,
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  slotHidden: { pointerEvents: 'none' },
  toast: {
    alignItems: 'flex-start',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-elevation-floating'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    gap: 10,
    padding: 12,
    pointerEvents: 'auto',
    width: '100%',
  },
  behind: { pointerEvents: 'auto' },
  icon: { display: 'inline-flex', flexShrink: 0, height: 20, marginTop: 0, width: 20 },
  iconSuccess: { color: colors['--oniva-color-success-solid'] },
  iconWarning: { color: colors['--oniva-color-warning-solid'] },
  iconDanger: { color: colors['--oniva-color-danger-solid'] },
  iconInfo: { color: colors['--oniva-color-info-solid'] },
  iconLoading: {
    animationDuration: '800ms',
    animationIterationCount: 'infinite',
    animationName: spin,
    animationTimingFunction: 'linear',
    color: colors['--oniva-color-text-muted'],
  },
  fadeable: {
    opacity: 1,
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  fadedOut: { opacity: 0 },
  iconSwap: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: swapIn, [media.reducedMotion]: swapFade },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
  },
  textSwap: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: textIn, [media.reducedMotion]: swapFade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  content: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 },
  title: {
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
    margin: 0,
  },
  description: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
    margin: 0,
  },
  actionRow: { marginTop: 8 },
  close: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: { default: colors['--oniva-color-text-muted'], ':hover': { default: null, [media.hover]: colors['--oniva-color-text'] } },
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    height: 24,
    justifyContent: 'center',
    marginInlineEnd: -4,
    marginTop: -2,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color',
    width: 24,
  },
});

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'loading';

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
  /**
   * Auto-dismiss delay in ms. Default 5000, except toasts with an `action` or a `danger`/`warning`
   * variant, which stay until dismissed. Use `Infinity` for a persistent toast.
   */
  duration?: number;
  onClose?: () => void;
}

/** Shared queue used by the imperative `toast()` API and `ToastProvider`. */
export const toastQueue = new OnivaToastQueue<ToastData>({ maxVisibleToasts: 5 });

type ToastInput = ReactNode | (ToastOptions & { title: ReactNode });

function normalize(titleOrData: ToastInput, options: ToastOptions = {}, variant?: ToastVariant) {
  const isData =
    typeof titleOrData === 'object' &&
    titleOrData !== null &&
    !Array.isArray(titleOrData) &&
    'title' in (titleOrData as object) &&
    !('$$typeof' in (titleOrData as object));
  const merged = isData
    ? (titleOrData as ToastOptions & { title: ReactNode })
    : { ...options, title: titleOrData as ReactNode };
  const { duration, onClose, ...data } = merged;
  const resolvedVariant = data.variant ?? variant ?? 'default';
  // Toasts the user must read or act on never run on a timer (WCAG 2.2.1).
  const sticky = data.action != null || resolvedVariant === 'danger' || resolvedVariant === 'warning';
  const ms = duration ?? (sticky ? Infinity : 5000);
  return {
    content: { ...data, variant: resolvedVariant } as ToastData,
    timeout: Number.isFinite(ms) ? ms : undefined,
    onClose,
  };
}

function add(titleOrData: ToastInput, options: ToastOptions = {}, variant?: ToastVariant): string {
  const { content, timeout, onClose } = normalize(titleOrData, options, variant);
  return toastQueue.add(content, { timeout, onClose });
}

type PromiseMessage<V> = ToastInput | ((value: V) => ToastInput);
export interface ToastPromiseOptions<T> extends ToastOptions {
  loading: ToastInput;
  success: PromiseMessage<T>;
  error: PromiseMessage<unknown>;
}

function promiseToast<T>(promise: Promise<T>, opts: ToastPromiseOptions<T>): string {
  const { loading, success, error, ...shared } = opts;
  const key = add(loading, { ...shared, duration: Infinity }, 'loading');
  const settle = <V,>(msg: PromiseMessage<V>, value: V, variant: ToastVariant) => {
    const resolved = typeof msg === 'function' ? (msg as (v: V) => ToastInput)(value) : msg;
    const { content, timeout } = normalize(resolved, shared, variant);
    toastQueue.update(key, content, timeout);
  };
  promise.then(
    (v) => settle(success, v, 'success'),
    (e) => settle(error, e, 'danger'),
  );
  return key;
}

/**
 * Imperative API. `toast('Saved')`, `toast.success('Invoice sent', { description })`,
 * `toast({ title, action: { label: 'Undo', onPress } })`,
 * `toast.promise(save(), { loading, success, error })`. Requires one `<ToastProvider>` mounted.
 */
export const toast = Object.assign(
  (titleOrData: ToastInput, options?: ToastOptions) => add(titleOrData, options),
  {
    success: (title: ReactNode, options?: ToastOptions) => add(title, options, 'success'),
    warning: (title: ReactNode, options?: ToastOptions) => add(title, options, 'warning'),
    danger: (title: ReactNode, options?: ToastOptions) => add(title, options, 'danger'),
    error: (title: ReactNode, options?: ToastOptions) => add(title, options, 'danger'),
    info: (title: ReactNode, options?: ToastOptions) => add(title, options, 'info'),
    loading: (title: ReactNode, options?: ToastOptions) =>
      add(title, { duration: Infinity, ...options }, 'loading'),
    promise: promiseToast,
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
  loading: <Loader2 size={20} />,
} as const;
const variantTone = {
  default: undefined,
  success: 'iconSuccess',
  warning: 'iconWarning',
  danger: 'iconDanger',
  info: 'iconInfo',
  loading: 'iconLoading',
} as const;

interface Layout {
  index: number; // position among live (non-exiting) toasts; -1 when exiting
  ty: number; // signed px offset toward the stack interior
  scale: number;
  clipEdge: number; // px clipped off the far edge when collapsed behind the front toast
  hidden: boolean; // beyond maxVisible
  peek: boolean; // behind the front toast while collapsed
}

function ToastItem({
  item,
  layout,
  exiting,
  top,
  side,
  expanded,
  onHeight,
  queue,
}: {
  item: QueuedToast<ToastData>;
  layout: Layout;
  exiting: boolean;
  top: boolean;
  side: 'left' | 'right' | 'centerX';
  expanded: boolean;
  onHeight: (key: string, h: number) => void;
  queue: OnivaToastQueue<ToastData>;
}) {
  const { title, description, variant = 'default', action, icon } = item.content;
  const iconNode = icon === undefined ? variantIcon[variant] : icon;
  const tone = variantTone[variant];
  const slotRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [swiping, setSwiping] = useState(false);
  const swipedOut = useRef(0);
  const drag = useRef<{
    x: number;
    id: number;
    lastX: number;
    lastT: number;
    v: number;
    moved: boolean;
  } | null>(null);
  const dir = top ? 1 : -1;

  useLayoutEffect(() => {
    const el = slotRef.current;
    if (!el) return;
    onHeight(item.key, el.offsetHeight);
    const ro = new ResizeObserver(() => onHeight(item.key, el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [item.key, onHeight]);

  useEffect(() => {
    // Two frames so the first paint commits the "from" state and the transition actually runs.
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setMounted(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, []);

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || exiting) return;
    if ((e.target as HTMLElement).closest('button, a, input, textarea, select')) return;
    drag.current = { x: e.clientX, id: e.pointerId, lastX: e.clientX, lastT: e.timeStamp, v: 0, moved: false };
  };
  const allowed = side === 'right' ? 1 : side === 'left' ? -1 : 0;
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = slotRef.current;
    if (!d || !el || d.id !== e.pointerId) return;
    let dx = e.clientX - d.x;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      d.moved = true;
      el.setPointerCapture(e.pointerId);
      setSwiping(true);
    }
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    // rubber-band against the non-dismiss direction
    if (allowed !== 0 && Math.sign(dx) !== allowed) dx *= 0.15;
    el.style.setProperty('--sx', `${dx}px`);
  };
  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = slotRef.current;
    drag.current = null;
    if (!d || !el || !d.moved) return;
    setSwiping(false);
    const dx = e.clientX - d.x;
    const fast = Math.abs(d.v) > SWIPE_VELOCITY && Math.abs(dx) > 10;
    const far = Math.abs(dx) > el.offsetWidth * SWIPE_RATIO;
    const okDir = allowed === 0 || Math.sign(dx) === allowed;
    if (okDir && (fast || far)) {
      const sign = Math.sign(dx) || 1;
      swipedOut.current = sign;
      el.style.setProperty('--sx', `${sign * (el.offsetWidth + INSET * 2)}px`);
      queue.close(item.key);
    } else {
      el.style.setProperty('--sx', '0px');
    }
  };

  const reduced = useReducedMotion();
  const swipedSign = swipedOut.current;
  const exitTy = reduced || swipedSign ? layout.ty : layout.ty - dir * 0.6 * 70;
  const enterTy = reduced ? layout.ty : -dir * 70;
  const ty = !mounted ? enterTy : exiting ? exitTy : layout.ty;
  const scale = !mounted || reduced ? 1 : layout.scale;
  const opacity = !mounted || exiting || layout.hidden ? 0 : 1;
  const clip = !mounted || expanded || layout.clipEdge <= 0 ? 0 : layout.clipEdge;
  const clipPath = top
    ? `inset(-24px -24px ${clip || -24}px -24px)`
    : `inset(${clip || -24}px -24px -24px -24px)`;
  const style = {
    '--ty': `${ty}px`,
    '--s': scale,
    opacity,
    clipPath,
    transformOrigin: top ? 'top center' : 'bottom center',
    zIndex: 100 - Math.max(layout.index, 0),
  } as CSSProperties;

  return (
    <div
      ref={slotRef}
      data-state={exiting ? 'exiting' : mounted ? 'open' : 'entering'}
      data-front={layout.index === 0 || undefined}
      data-swiping={swiping || undefined}
      style={style}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      {...stylex.props(
        styles.slot,
        top ? styles.slotTop : styles.slotBottom,
        swiping && styles.slotSwiping,
        exiting && styles.slotExiting,
        layout.hidden && styles.slotHidden,
      )}
    >
      <AriaToast
        toast={item}
        {...stylex.props(styles.toast, focus.ring, layout.peek && styles.behind)}
        data-variant={variant}
      >
        {iconNode && (
          <span
            key={variant}
            data-swap=""
            {...stylex.props(
              styles.icon,
              mounted && styles.iconSwap,
              tone && styles[tone],
              styles.fadeable,
              layout.peek && styles.fadedOut,
            )}
            aria-hidden="true"
          >
            {iconNode}
          </span>
        )}
        <AriaToastContent
          {...stylex.props(styles.content, styles.fadeable, layout.peek && styles.fadedOut)}
        >
          <AriaText slot="title" key={typeof title === 'string' ? title : undefined} {...stylex.props(styles.title, mounted && styles.textSwap)}>
            {title}
          </AriaText>
          {description != null && (
            <AriaText slot="description" key={typeof description === 'string' ? description : undefined} {...stylex.props(styles.description, mounted && styles.textSwap)}>
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
        <AriaButton
          slot="close"
          aria-label="Dismiss notification"
          {...stylex.props(styles.close, styles.fadeable, layout.peek && styles.fadedOut)}
        >
          <X size={14} aria-hidden="true" />
        </AriaButton>
      </AriaToast>
    </div>
  );
}

export interface ToastProviderProps {
  children?: ReactNode;
  placement?: ToastPlacement;
  /** Alias of `placement` (Sonner naming). */
  position?: ToastPlacement;
  /** How many toasts are visible in the stack at once. Default 3 (the queue holds up to 5). */
  maxVisible?: number;
  /** Use a custom queue instead of the shared one behind `toast()`. */
  queue?: OnivaToastQueue<ToastData>;
  /** Accessible landmark label. */
  'aria-label'?: string;
  /** `KeyboardEvent.key` or `.code` that moves focus to the newest toast (and fans the stack out). `null` disables. Default `F8`. */
  hotkey?: string | null;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Mount once near the app root (inside `ThemeProvider` so toasts inherit the theme).
 * Renders `children` plus the live region that displays `toast()` notifications as a stack:
 * newest in front, older toasts peek behind (scaled/offset), and hovering or focusing the stack
 * expands it to full height-aware spacing. Timers pause on hover, focus and window blur.
 * Swipe a toast toward its edge to dismiss.
 */
export function ToastProvider({
  children,
  placement,
  position,
  maxVisible = 3,
  queue = toastQueue,
  hotkey = 'F8',
  'aria-label': ariaLabel = 'Notifications',
  className,
  xstyle,
  ref,
}: ToastProviderProps) {
  const place = placement ?? position ?? 'bottom-right';
  const top = place.startsWith('top');
  const side = place.endsWith('left') ? 'left' : place.endsWith('right') ? 'right' : 'centerX';
  const dir = top ? 1 : -1;

  useSyncExternalStore(queue.subscribeExit, queue.getExitVersion, queue.getExitVersion);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const [hovered, setHovered] = useState(false);
  const [focusedIn, setFocusedIn] = useState(false);
  const expanded = hovered || focusedIn;
  const frozen = useRef<Record<string, Layout>>({});
  const expandedRef = useRef(false);
  const setRegion = useCallback(
    (el: HTMLDivElement | null) => {
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as { current: HTMLDivElement | null }).current = el;
      regionEl.current = el;
      setRegionNode(el);
    },
    [ref],
  );
  const regionEl = useRef<HTMLDivElement | null>(null);
  const [regionNode, setRegionNode] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = regionNode;
    if (!el) return;
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    const fin = () => setFocusedIn(true);
    const fout = (e: FocusEvent) => {
      if (!el.contains(e.relatedTarget as Node | null)) setFocusedIn(false);
    };
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('focusin', fin);
    el.addEventListener('focusout', fout);
    return () => {
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointerleave', leave);
      el.removeEventListener('focusin', fin);
      el.removeEventListener('focusout', fout);
    };
  }, [regionNode]);

  // Hotkey: jump to the newest toast so keyboard users can reach actions before the timer ends.
  useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== hotkey && e.code !== hotkey) return;
      const target = regionEl.current?.querySelector<HTMLElement>('[role="alertdialog"], [role="alert"], [tabindex="0"]');
      if (!target) return;
      e.preventDefault();
      target.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [hotkey]);

  const onHeight = useCallback((key: string, h: number) => {
    setHeights((prev) => (prev[key] === h ? prev : { ...prev, [key]: h }));
  }, []);

  // Pause timers when the window loses focus or the tab is hidden; resume when it returns.
  useEffect(() => {
    const pause = () => queue.pauseAll();
    const resume = () => {
      if (!document.hidden && !expandedRef.current) queue.resumeAll();
    };
    const onVis = () => (document.hidden ? pause() : resume());
    window.addEventListener('blur', pause);
    window.addEventListener('focus', resume);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('blur', pause);
      window.removeEventListener('focus', resume);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [queue]);
  expandedRef.current = expanded;

  const renderToast = (t: QueuedToast<ToastData>) => {
    const live = queue.visibleToasts.filter((x) => !queue.exiting.has(x.key));
    const exiting = queue.exiting.has(t.key);
    const index = live.findIndex((x) => x.key === t.key);
    let layout: Layout;
    if (exiting || index < 0) {
      layout = frozen.current[t.key] ?? {
        index: 0,
        ty: 0,
        scale: 1,
        clipEdge: 0,
        hidden: false,
        peek: false,
      };
    } else {
      const frontH = heights[live[0]!.key] ?? 0;
      const h = heights[t.key] ?? frontH;
      let offset = 0;
      for (let j = 0; j < index; j++) offset += (heights[live[j]!.key] ?? 0) + GAP;
      const peekOffset = index * PEEK;
      layout = {
        index,
        ty: dir * (expanded ? offset : peekOffset),
        scale: expanded ? 1 : 1 - index * SCALE_STEP,
        clipEdge: Math.max(0, h - frontH),
        hidden: index >= maxVisible,
        peek: !expanded && index > 0,
      };
      frozen.current[t.key] = layout;
    }
    return (
      <ToastItem
        item={t}
        layout={layout}
        exiting={exiting}
        top={top}
        side={side}
        expanded={expanded}
        onHeight={onHeight}
        queue={queue}
      />
    );
  };

  return (
    <>
      {children}
      <AriaToastRegion<ToastData>
        queue={queue}
        aria-label={ariaLabel}
        ref={setRegion}
        {...mergeSx(
          stylex.props(styles.region, top ? styles.top : styles.bottom, styles[side], xstyle),
          className,
        )}
      >
        {({ toast: t }) => renderToast(t)}
      </AriaToastRegion>
    </>
  );
}
