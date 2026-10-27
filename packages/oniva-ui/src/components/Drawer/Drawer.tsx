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
import { useEffect, useRef, type ReactNode, type Ref, type RefObject } from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { DialogCloseButton } from '../Dialog';
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
    borderStyle: 'solid',
    borderWidth: 0,
    boxShadow: shadow['--oniva-elevation-overlay'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    outline: 'none',
    overscrollBehavior: 'contain',
    position: 'fixed',
  },
  draggable: { touchAction: 'pan-y' },
  draggableX: { touchAction: 'pan-x' },
  handle: {
    backgroundColor: colors['--oniva-color-border'],
    borderRadius: 999,
    height: 4,
    left: '50%',
    marginLeft: -18,
    pointerEvents: 'none',
    position: 'absolute',
    top: 8,
    width: 36,
    zIndex: 1,
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
    animationDuration: motion['--oniva-motion-dur-sheet'],
    animationFillMode: 'both',
    animationName: { default: inRight, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-drawer'],
  },
  exitRight: {
    animationDuration: { default: '300ms', [media.reducedMotion]: '0.01ms' },
    animationFillMode: 'both',
    animationName: { default: outRight, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-drawer'],
  },
  enterLeft: {
    animationDuration: motion['--oniva-motion-dur-sheet'],
    animationFillMode: 'both',
    animationName: { default: inLeft, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-drawer'],
  },
  exitLeft: {
    animationDuration: { default: '300ms', [media.reducedMotion]: '0.01ms' },
    animationFillMode: 'both',
    animationName: { default: outLeft, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-drawer'],
  },
  enterBottom: {
    animationDuration: motion['--oniva-motion-dur-sheet'],
    animationFillMode: 'both',
    animationName: { default: inBottom, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-drawer'],
  },
  exitBottom: {
    animationDuration: { default: '300ms', [media.reducedMotion]: '0.01ms' },
    animationFillMode: 'both',
    animationName: { default: outBottom, [media.reducedMotion]: 'none' },
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
  /** Drag the panel toward its edge (pointer + velocity) to dismiss. Default true when dismissable. */
  isDragDismissable?: boolean;
  /**
   * Bottom drawers only: scale the page behind (Vaul-style). Pass `true` to target
   * `[data-oniva-drawer-wrapper]`, or a CSS selector. The target must not contain fixed descendants.
   */
  scaleBackground?: boolean | string;
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
  isDragDismissable = true,
  scaleBackground = false,
  isDismissable = true,
  'aria-label': ariaLabel,
  ...rest
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const setPanel = (el: HTMLDivElement | null) => {
    panelRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as { current: HTMLDivElement | null }).current = el;
  };
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
        className={({ isEntering, isExiting }) =>
          mergeSx(
            stylex.props(
              styles.panel,
              isDismissable && isDragDismissable && (side === 'bottom' ? styles.draggable : styles.draggableX),
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
              {isDismissable && isDragDismissable && (
                <DragController
                  panelRef={panelRef}
                  side={side}
                  close={opts.close}
                  scaleBackground={side === 'bottom' ? scaleBackground : false}
                />
              )}
              {side === 'bottom' && <span aria-hidden="true" {...stylex.props(styles.handle)} />}
              {showCloseButton && <DialogCloseButton />}
              {typeof children === 'function' ? children(opts) : children}
            </>
          )}
        </AriaDialog>
      </AriaModal>
    </AriaModalOverlay>
  );
}

const AXIS = { right: 'x', left: 'x', bottom: 'y' } as const;
const SIGN = { right: 1, left: -1, bottom: 1 } as const;

/** Attaches Vaul-style drag-to-dismiss to the (already rendered) modal panel. Renders nothing. */
function DragController({
  panelRef,
  side,
  close,
  scaleBackground,
}: {
  panelRef: RefObject<HTMLDivElement | null>;
  side: DrawerSide;
  close: () => void;
  scaleBackground: boolean | string;
}) {
  const closeRef = useRef(close);
  closeRef.current = close;

  // background scale (bottom drawers, opt-in)
  useEffect(() => {
    if (!scaleBackground) return;
    const sel = scaleBackground === true ? '[data-oniva-drawer-wrapper]' : scaleBackground;
    const el = document.querySelector<HTMLElement>(sel);
    if (!el || prefersReducedMotionSafe()) return;
    const prev = {
      transform: el.style.transform,
      transition: el.style.transition,
      radius: el.style.borderRadius,
      origin: el.style.transformOrigin,
    };
    el.style.transformOrigin = 'top center';
    el.style.transition = `transform ${SHEET_SETTLE_MS}ms ${SHEET_EASE}, border-radius ${SHEET_SETTLE_MS}ms ${SHEET_EASE}`;
    requestAnimationFrame(() => {
      el.style.transform = 'scale(0.94) translateY(8px)';
      el.style.borderRadius = '12px';
    });
    return () => {
      el.style.transition = `transform ${SHEET_OUT_MS}ms ${SHEET_EASE}, border-radius ${SHEET_OUT_MS}ms ${SHEET_EASE}`;
      el.style.transform = prev.transform;
      el.style.borderRadius = prev.radius;
      setTimeout(() => {
        el.style.transition = prev.transition;
        el.style.transformOrigin = prev.origin;
      }, SHEET_OUT_MS);
    };
  }, [scaleBackground]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const overlay = panel.parentElement as HTMLElement | null;
    const axis = AXIS[side];
    const sign = SIGN[side];
    const vt = new VelocityTracker();
    let start: { p: number; id: number } | null = null;
    let dragging = false;
    let size = 1;
    let offset = 0;

    const translate = (d: number) =>
      axis === 'y' ? `translate3d(0, ${d}px, 0)` : `translate3d(${d}px, 0, 0)`;
    const pos = (e: PointerEvent) => (axis === 'y' ? e.clientY : e.clientX);
    const setBackdrop = (progress: number) => {
      if (!overlay) return;
      overlay.style.backgroundColor = `color-mix(in srgb, var(--oniva-color-overlay) ${Math.max(0, 1 - progress) * 100}%, transparent)`;
    };
    const clear = () => {
      panel.style.transition = '';
      panel.style.transform = '';
      panel.style.willChange = '';
      panel.style.animation = '';
      if (overlay) {
        overlay.style.transition = '';
        overlay.style.backgroundColor = '';
      }
    };

    const down = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (isInteractiveTarget(e.target) || isScrolledInside(e.target, panel, axis)) return;
      if ((e.target as HTMLElement).closest('button, a')) return;
      start = { p: pos(e), id: e.pointerId };
      vt.reset();
      vt.push(pos(e) * sign, e.timeStamp);
    };
    const move = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.id) return;
      const d = (pos(e) - start.p) * sign;
      if (!dragging) {
        if (Math.abs(d) < 6) return;
        dragging = true;
        size = axis === 'y' ? panel.offsetHeight : panel.offsetWidth;
        panel.setPointerCapture(e.pointerId);
        panel.style.transition = 'none';
        panel.style.willChange = 'transform';
        panel.style.animation = 'none';
        if (overlay) overlay.style.transition = 'none';
        window.getSelection()?.removeAllRanges();
      }
      vt.push(pos(e) * sign, e.timeStamp);
      offset = d >= 0 ? d : rubberBand(d);
      panel.style.transform = translate(offset * sign);
      setBackdrop(Math.min(1, Math.max(0, offset) / size));
    };
    const up = (e: PointerEvent) => {
      if (!start || e.pointerId !== start.id) return;
      start = null;
      if (!dragging) return;
      dragging = false;
      const v = vt.velocity;
      const dismiss = (v > DISMISS_VELOCITY && offset > 8) || offset > size * 0.4;
      const ms = sheetMs(dismiss ? SHEET_OUT_MS : SHEET_SETTLE_MS);
      panel.style.transition = `transform ${ms}ms ${SHEET_EASE}`;
      if (overlay) overlay.style.transition = `background-color ${ms}ms ${SHEET_EASE}`;
      if (dismiss) {
        panel.style.transform = translate(size * sign);
        setBackdrop(1);
        let done = false;
        const finish = () => {
          if (done) return;
          done = true;
          closeRef.current();
        };
        panel.addEventListener('transitionend', finish, { once: true });
        setTimeout(finish, ms + 50);
      } else {
        panel.style.transform = translate(0);
        setBackdrop(0);
        const reset = () => clear();
        panel.addEventListener('transitionend', reset, { once: true });
      }
      // block the click that follows a drag
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
  }, [panelRef, side]);

  return null;
}

function prefersReducedMotionSafe() {
  return typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export { DialogTrigger as DrawerTrigger };
