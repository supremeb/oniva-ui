import { useEffect, type RefObject } from 'react';

/**
 * Input modality for sliding indicators (same idea as `GlideSurface` in m5-glide): keyboard-initiated moves
 * are high-frequency, so the indicator snaps (`data-instant`); pointer moves glide. Keydown inside
 * `containerRef` sets the flag on the element returned by `getEl`; any pointer interaction clears it.
 * CSS-transitioned indicators get an inline `transition-duration: 0s`; WAAPI indicators check `hasAttribute('data-instant')`.
 */
export function useKeyboardInstant(
  containerRef: RefObject<HTMLElement | null>,
  getEl: () => HTMLElement | null | undefined,
) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key === 'Shift' || e.key === 'Meta' || e.key === 'Control' || e.key === 'Alt') return;
      const root = containerRef.current;
      if (!root || !(e.target instanceof Node) || !root.contains(e.target)) return;
      const el = getEl();
      el?.setAttribute('data-instant', '');
      // inline wins over the indicator's own atomic transition-duration class
      el?.style.setProperty('transition-duration', '0s');
    };
    const onPtr = () => {
      const el = getEl();
      if (!el?.hasAttribute('data-instant')) return;
      el.removeAttribute('data-instant');
      el.style.removeProperty('transition-duration');
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointerdown', onPtr, true);
    document.addEventListener('pointermove', onPtr, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointerdown', onPtr, true);
      document.removeEventListener('pointermove', onPtr, true);
    };
  }, [containerRef, getEl]);
}
