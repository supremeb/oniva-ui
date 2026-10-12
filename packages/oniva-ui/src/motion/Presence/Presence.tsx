import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { AnimationEvent, HTMLAttributes, ReactNode, Ref } from 'react';
import { enterExit, type EnterExitPreset } from '../../internal/motion-styles';
import { mergeSx } from '../../internal/sx';

export type PresenceState = 'entering' | 'entered' | 'exiting';

export interface UsePresenceOptions {
  /** Skip the enter animation when first rendered already present. Default `true` (animate). */
  initial?: boolean;
  /** Safety net: unmount this long after exit starts if `animationend` never fires. Default 500ms. */
  exitTimeoutMs?: number;
}

/**
 * Mount/unmount with an exit phase for non-RAC conditionals (tags, list rows, banners).
 * Spread `presenceProps` on the animated element; render only while `mounted`.
 * Interruptible: re-presenting during an exit flips back to `entering` without remounting.
 */
export function usePresence(isPresent: boolean, { initial = true, exitTimeoutMs = 500 }: UsePresenceOptions = {}) {
  const [mounted, setMounted] = useState(isPresent);
  const [state, setState] = useState<PresenceState>(isPresent ? (initial ? 'entering' : 'entered') : 'exiting');
  const ref = useRef<HTMLElement | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    clearTimeout(timer.current);
    if (isPresent) {
      setMounted(true);
      setState((s) => (s === 'entered' ? s : 'entering'));
      return;
    }
    setState((s) => (s === 'exiting' ? s : 'exiting'));
    // No running animation (reduced motion with animation:none, or no CSS): unmount right away.
    const el = ref.current;
    if (el && typeof el.getAnimations === 'function') {
      requestAnimationFrame(() => {
        if (el.getAnimations().length === 0) setMounted(false);
      });
    }
    timer.current = setTimeout(() => setMounted(false), exitTimeoutMs);
    return () => clearTimeout(timer.current);
  }, [isPresent, exitTimeoutMs]);

  const onAnimationEnd = useCallback(
    (e: AnimationEvent<HTMLElement>) => {
      if (e.target !== e.currentTarget) return;
      if (!isPresent) setMounted(false);
      else setState('entered');
    },
    [isPresent],
  );

  const presenceProps = {
    'data-state': state,
    onAnimationEnd,
    ref: (n: HTMLElement | null) => void (ref.current = n),
  };
  return { mounted, state, presenceProps };
}

export interface PresenceProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Controls mount. When it flips to `false` the exit animation plays, then children unmount. */
  isPresent: boolean;
  /** Enter/exit preset. Default `'fade'`. */
  preset?: EnterExitPreset;
  /** `false` skips the enter animation on first render. */
  initial?: boolean;
  exitTimeoutMs?: number;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Wrapper that keeps children mounted during their exit animation. Preset keyframes live in `enterExit`. */
export function Presence({
  isPresent,
  preset = 'fade',
  initial,
  exitTimeoutMs,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: PresenceProps) {
  const { mounted, presenceProps } = usePresence(isPresent, { initial, exitTimeoutMs });
  if (!mounted) return null;
  const sx = stylex.props(enterExit[preset], xstyle);
  const { ref: innerRef, ...pp } = presenceProps;
  return (
    <div
      {...rest}
      {...pp}
      ref={(n) => {
        innerRef(n);
        if (typeof ref === 'function') ref(n);
        else if (ref) ref.current = n;
      }}
      {...mergeSx(sx, className)}
    >
      {children}
    </div>
  );
}
