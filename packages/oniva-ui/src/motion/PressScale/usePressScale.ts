import { useCallback, useState } from 'react';
import type { PointerEvent } from 'react';

export interface UsePressScaleOptions {
  isDisabled?: boolean;
}

/**
 * Press feedback for non-button elements (cards, rows). Sets `data-pressed` only for real pointer
 * presses (mouse/touch/pen), never for keyboard, so high-frequency keyboard use does not animate.
 * Pair with `motionStyles.pressScaleData`. Native buttons can use `motionStyles.pressScale` (`:active`) instead.
 */
export function usePressScale({ isDisabled }: UsePressScaleOptions = {}) {
  const [isPressed, setPressed] = useState(false);
  const down = useCallback(
    (e: PointerEvent) => {
      if (isDisabled || (e.pointerType === 'mouse' && e.button !== 0)) return;
      setPressed(true);
    },
    [isDisabled],
  );
  const up = useCallback(() => setPressed(false), []);
  return {
    isPressed,
    pressProps: {
      onPointerDown: down,
      onPointerUp: up,
      onPointerCancel: up,
      onPointerLeave: up,
      'data-pressed': isPressed ? '' : undefined,
    },
  };
}
