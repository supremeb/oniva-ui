import { useCallback, useEffect, useRef } from 'react';

/**
 * Imperative spring that can be thrown: `to(target, instant, velocity)` keeps the release velocity of a flick
 * (units per second) so the row travels with the gesture before it settles. Damping ratio sits just under
 * critical (0.86): lands with a faint give. Same surface as `w7-spring`'s `useSpring`.
 */
export function useFlingSpring(initial: number, apply: (value: number) => void, damping = 0.86) {
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
      const c = 2 * Math.sqrt(k) * damping;
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
    [damping],
  );

  const api = {
    get: () => s.current.pos,
    to(target: number, instant = false, velocity = 0) {
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
      st.vel = velocity;
      if (!st.raf) {
        st.last = 0;
        st.raf = requestAnimationFrame(tick);
      }
    },
    drag(value: number) {
      const st = s.current;
      stop();
      st.pos = value;
      st.target = value;
      st.vel = 0;
      applyRef.current(value);
    },
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
