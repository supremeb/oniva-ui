import { useCallback, useEffect, useRef } from 'react';

/**
 * Tiny imperative spring for illustrations that move many elements per frame (CoverFlow, ModelWheel).
 * `apply` receives the current value each frame and writes transforms straight to the DOM (no React renders).
 * Slightly under-damped, so it overshoots a touch and locks on like a magnet.
 */
export function useSpring(initial: number, apply: (value: number) => void) {
  const s = useRef({ pos: initial, vel: 0, target: initial, raf: 0, last: 0 });
  const applyRef = useRef(apply);
  applyRef.current = apply;

  const stop = useCallback(() => {
    cancelAnimationFrame(s.current.raf);
    s.current.raf = 0;
  }, []);

  const tick = useCallback(
    (t: number) => {
      const st = s.current;
      const dt = Math.min(0.032, Math.max(0.001, (t - (st.last || t - 16)) / 1000));
      st.last = t;
      const k = 190;
      const c = 2 * Math.sqrt(k) * 0.78;
      st.vel += ((st.target - st.pos) * k - st.vel * c) * dt;
      st.pos += st.vel * dt;
      if (Math.abs(st.vel) < 0.002 && Math.abs(st.target - st.pos) < 0.0015) {
        st.pos = st.target;
        st.vel = 0;
        st.raf = 0;
        st.last = 0;
        applyRef.current(st.pos);
        return;
      }
      applyRef.current(st.pos);
      st.raf = requestAnimationFrame(tick);
    },
    [],
  );

  const api = {
    get: () => s.current.pos,
    /** Spring to `target`; `instant` jumps (reduced motion). */
    to(target: number, instant = false) {
      const st = s.current;
      st.target = target;
      if (instant) {
        stop();
        st.pos = target;
        st.vel = 0;
        st.last = 0;
        applyRef.current(target);
        return;
      }
      if (!st.raf) {
        st.last = 0;
        st.raf = requestAnimationFrame(tick);
      }
    },
    /** Follow the pointer 1:1 (cancels any running spring). */
    drag(value: number) {
      const st = s.current;
      stop();
      st.pos = value;
      st.target = value;
      st.vel = 0;
      applyRef.current(value);
    },
    /** Reapply the current value (after a resize). */
    refresh: () => applyRef.current(s.current.pos),
    stop,
  };
  const ref = useRef(api);
  ref.current = api;

  useEffect(() => {
    applyRef.current(s.current.pos);
    return stop;
  }, [stop]);

  return ref.current;
}

export const mod = (n: number, m: number) => ((n % m) + m) % m;
