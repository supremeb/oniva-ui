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
import { useCallback, useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import {
  DISMISS_VELOCITY,
  SHEET_EASE,
  SHEET_OUT_MS,
  SHEET_SETTLE_MS,
  VelocityTracker,
  isInteractiveTarget,
  isScrolledInside,
  rubberBand,
  sheetMs,
} from '../../internal/overlays-drag';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });
// One-sided keyframes: the other end is the panel's current (snap) transform.
const slideIn = stylex.keyframes({ from: { transform: 'translate3d(0, 100%, 0)' } });
const slideOut = stylex.keyframes({ to: { transform: 'translate3d(0, 100%, 0)' } });

const styles = stylex.create({
  overlay: {
    backgroundColor: colors['--oniva-color-overlay'],
    bottom: 0,
    left: 0,
    position: 'fixed',
    top: 0,
    right: 0,
    zIndex: 100,
  },
  overlayEntering: {
    animationDuration: motion['--oniva-motion-dur-sheet'],
    animationFillMode: 'both',
    animationName: { default: fadeIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-drawer'],
  },
  overlayExiting: {
    animationDuration: { default: '300ms', [media.reducedMotion]: '0.01ms' },
    animationFillMode: 'both',
    animationName: { default: fadeOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-drawer'],
  },
  panel: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: `${radius['--oniva-radius-card']} ${radius['--oniva-radius-card']} 0 0`,
    borderStyle: 'solid',
    borderWidth: 0,
    borderTopWidth: 1,
    bottom: 0,
    boxShadow: shadow['--oniva-elevation-overlay'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    left: 0,
    maxWidth: 640,
    marginInline: 'auto',
    outline: 'none',
    overscrollBehavior: 'contain',
    position: 'fixed',
    right: 0,
    touchAction: 'pan-y',
    width: '100%',
  },
  entering: {
    animationDuration: motion['--oniva-motion-dur-sheet'],
    animationFillMode: 'both',
    animationName: { default: slideIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-drawer'],
  },
  exiting: {
    animationDuration: { default: '300ms', [media.reducedMotion]: '0.01ms' },
    animationFillMode: 'both',
    animationName: { default: slideOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-drawer'],
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
  grab: {
    alignItems: 'flex-start',
    cursor: 'grab',
    display: 'flex',
    flexShrink: 0,
    height: 28,
    justifyContent: 'center',
    paddingTop: 8,
  },
  pill: {
    backgroundColor: colors['--oniva-color-border'],
    borderRadius: 999,
    height: 4,
    width: 36,
  },
  body: { display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 },
  scroll: { overflowY: 'auto' },
  noScroll: { overflowY: 'hidden' },
});

export interface BottomSheetProps extends Omit<
  AriaModalOverlayProps,
  'className' | 'style' | 'children'
> {
  /**
   * Visible heights as fractions of the viewport (0-1), ascending. Default `[0.4, 0.9]`.
   * Drag between them; flick down from the lowest snap to dismiss.
   */
  snapPoints?: number[];
  /** Controlled snap index. */
  snap?: number;
  defaultSnap?: number;
  onSnapChange?: (index: number) => void;
  /** Show the grab handle. Default true. */
  showHandle?: boolean;
  children?: AriaDialogProps['children'] | ReactNode;
  'aria-label'?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const DEFAULT_SNAPS = [0.4, 0.9];

/**
 * Modal bottom sheet with snap points and Vaul-style drag (pointer + velocity, rubber-banding past
 * the top snap, backdrop tied to drag progress). Inner content scrolls only at the top snap.
 */
export function BottomSheet({
  snapPoints = DEFAULT_SNAPS,
  snap,
  defaultSnap = 0,
  onSnapChange,
  showHandle = true,
  children,
  className,
  xstyle,
  ref,
  isDismissable = true,
  'aria-label': ariaLabel,
  ...rest
}: BottomSheetProps) {
  const snaps = [...snapPoints].sort((a, b) => a - b);
  const maxSnap = snaps[snaps.length - 1] ?? 1;
  const [inner, setInner] = useState(defaultSnap);
  const index = Math.min(snap ?? inner, snaps.length - 1);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const setPanel = (el: HTMLDivElement | null) => {
    panelRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as { current: HTMLDivElement | null }).current = el;
  };
  const [vh, setVh] = useState(() => (typeof window === 'undefined' ? 800 : window.innerHeight));
  useEffect(() => {
    const on = () => setVh(window.innerHeight);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  const H = Math.round(maxSnap * vh);
  const offsets = snaps.map((s) => Math.round((maxSnap - s) * vh));
  const setIndex = useCallback(
    (i: number) => {
      setInner(i);
      onSnapChange?.(i);
    },
    [onSnapChange],
  );

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
        ref={setPanel}
        style={{ height: H, transform: `translate3d(0, ${offsets[index] ?? 0}px, 0)` }}
        className={({ isEntering, isExiting }) =>
          mergeSx(
            stylex.props(
              styles.panel,
              isEntering && styles.entering,
              isExiting && styles.exiting,
              xstyle,
            ),
            className,
          ).className
        }
      >
        <AriaDialog aria-label={ariaLabel} {...stylex.props(styles.dialog)}>
          {(opts) => (
            <>
              <SheetDrag
                panelRef={panelRef}
                offsets={offsets}
                height={H}
                index={index}
                dismissable={isDismissable}
                onIndex={setIndex}
                close={opts.close}
              />
              {showHandle && (
                <div data-sheet-handle="" {...stylex.props(styles.grab)}>
                  <span aria-hidden="true" {...stylex.props(styles.pill)} />
                </div>
              )}
              <div
                {...stylex.props(
                  styles.body,
                  index === snaps.length - 1 ? styles.scroll : styles.noScroll,
                )}
              >
                {typeof children === 'function' ? children(opts) : children}
              </div>
            </>
          )}
        </AriaDialog>
      </AriaModal>
    </AriaModalOverlay>
  );
}

function SheetDrag({
  panelRef,
  offsets,
  height,
  index,
  dismissable,
  onIndex,
  close,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  offsets: number[];
  height: number;
  index: number;
  dismissable: boolean;
  onIndex: (i: number) => void;
  close: () => void;
}) {
  const live = useRef({ offsets, height, index, dismissable, onIndex, close });
  live.current = { offsets, height, index, dismissable, onIndex, close };

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const overlay = panel.parentElement as HTMLElement | null;
    const vt = new VelocityTracker();
    let start: { y: number; id: number; base: number } | null = null;
    let dragging = false;
    let pos = 0;

    const tf = (y: number) => `translate3d(0, ${y}px, 0)`;
    const backdrop = (y: number) => {
      if (!overlay) return;
      const { offsets: o, height: h } = live.current;
      const low = o[0] ?? 0;
      const p = Math.min(1, Math.max(0, (y - low) / Math.max(1, h - low)));
      overlay.style.backgroundColor = `color-mix(in srgb, var(--oniva-color-overlay) ${(1 - p) * 100}%, transparent)`;
    };

    const down = (e: PointerEvent) => {
      if (e.button !== 0 || isInteractiveTarget(e.target)) return;
      const onHandle = !!(e.target as HTMLElement).closest('[data-sheet-handle]');
      const { index: i, offsets: o } = live.current;
      const atTop = i === o.length - 1;
      if (!onHandle) {
        if ((e.target as HTMLElement).closest('button, a')) return;
        // body scrolls (not drags) when fully open and scrolled
        if (atTop && isScrolledInside(e.target, panel, 'y')) return;
      }
      start = { y: e.clientY, id: e.pointerId, base: o[i] ?? 0 };
      vt.reset();
      vt.push(e.clientY, e.timeStamp);
    };
    const move = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.id) return;
      const dy = e.clientY - start.y;
      if (!dragging) {
        if (Math.abs(dy) < 6) return;
        dragging = true;
        panel.setPointerCapture(e.pointerId);
        panel.style.transition = 'none';
        panel.style.animation = 'none';
        panel.style.willChange = 'transform';
        if (overlay) overlay.style.transition = 'none';
        window.getSelection()?.removeAllRanges();
      }
      vt.push(e.clientY, e.timeStamp);
      const raw = start.base + dy;
      pos = raw >= 0 ? raw : rubberBand(raw);
      panel.style.transform = tf(pos);
      backdrop(pos);
    };
    const up = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.id) return;
      const s = start;
      start = null;
      if (!dragging) return;
      dragging = false;
      const { offsets: o, height: h, dismissable: canDismiss, onIndex: setIdx, close: doClose } =
        live.current;
      const v = vt.velocity; // px/ms, + = downward
      // candidate positions: each snap, plus "closed"
      const targets = canDismiss ? [...o, h] : [...o];
      let target = 0;
      if (Math.abs(v) > DISMISS_VELOCITY) {
        const cur = live.current.index;
        const next = v > 0 ? cur - 1 : cur + 1;
        target = next < 0 ? (canDismiss ? o.length : 0) : Math.min(next, o.length - 1);
        // a hard flick skips ahead only from the current snap, never past the neighbour
      } else {
        let best = Infinity;
        targets.forEach((t, i) => {
          const dist = Math.abs(t - pos);
          if (dist < best) {
            best = dist;
            target = i;
          }
        });
      }
      void s;
      const closing = target >= o.length;
      const ms = sheetMs(closing ? SHEET_OUT_MS : SHEET_SETTLE_MS);
      panel.style.transition = `transform ${ms}ms ${SHEET_EASE}`;
      if (overlay) overlay.style.transition = `background-color ${ms}ms ${SHEET_EASE}`;
      const dest = closing ? h : (o[target] ?? 0);
      panel.style.transform = tf(dest);
      backdrop(closing ? h : (o[0] ?? 0));
      if (closing) {
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          doClose();
        };
        panel.addEventListener('transitionend', finish, { once: true });
        setTimeout(finish, ms + 50);
      } else {
        setIdx(target);
        const reset = () => {
          panel.style.transition = '';
          panel.style.animation = '';
          panel.style.willChange = '';
          if (overlay) {
            overlay.style.transition = '';
            overlay.style.backgroundColor = '';
          }
        };
        panel.addEventListener('transitionend', reset, { once: true });
        if (ms === 0) reset();
      }
      const swallow = (ev: Event) => ev.stopPropagation();
      panel.addEventListener('click', swallow, { capture: true, once: true });
      setTimeout(() => panel.removeEventListener('click', swallow, { capture: true }), 0);
    };

    panel.addEventListener('pointerdown', down);
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
    return () => {
      panel.removeEventListener('pointerdown', down);
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
    };
  }, [panelRef]);

  // keep the DOM in sync when the snap changes programmatically (controlled `snap`)
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.style.transition = `transform ${sheetMs(SHEET_SETTLE_MS)}ms ${SHEET_EASE}`;
  }, [index, panelRef]);

  return null;
}

export { DialogTrigger as BottomSheetTrigger };
