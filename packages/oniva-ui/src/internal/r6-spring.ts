import { useEffect, useRef } from 'react';

/**
 * Tunable spring with velocity (R6). Like w7-spring but stiffness/damping-ratio can change per move and
 * a throw can start with a velocity (units per second), so a flick keeps turning before it locks on.
 * `apply` writes straight to the DOM each frame.
 */
export function useTunedSpring(initial: number, apply: (value: number) => void, onRest?: () => void) {
  const s = useRef({ pos: initial, vel: 0, target: initial, k: 140, ratio: 0.68, raf: 0, last: 0 });
  const applyRef = useRef(apply);
  applyRef.current = apply;
  const restRef = useRef(onRest);
  restRef.current = onRest;

  const api = useRef<{
    get: () => number;
    to: (target: number, o?: { k?: number; ratio?: number; vel?: number; instant?: boolean }) => void;
    drag: (value: number, vel?: number) => void;
    velocity: () => number;
    stop: () => void;
  } | null>(null);

  if (!api.current) {
    const st = s.current;
    const stop = () => {
      cancelAnimationFrame(st.raf);
      st.raf = 0;
    };
    const tick = (t: number) => {
      const dt = Math.min(0.032, Math.max(0.001, (t - (st.last || t - 16)) / 1000));
      st.last = t;
      const c = 2 * Math.sqrt(st.k) * st.ratio;
      st.vel += ((st.target - st.pos) * st.k - st.vel * c) * dt;
      st.pos += st.vel * dt;
      if (Math.abs(st.vel) < 0.01 && Math.abs(st.target - st.pos) < 0.0008) {
        st.pos = st.target;
        st.vel = 0;
        st.raf = 0;
        st.last = 0;
        applyRef.current(st.pos);
        restRef.current?.();
        return;
      }
      applyRef.current(st.pos);
      st.raf = requestAnimationFrame(tick);
    };
    api.current = {
      get: () => st.pos,
      velocity: () => st.vel,
      to(target, o = {}) {
        st.target = target;
        if (o.k != null) st.k = o.k;
        if (o.ratio != null) st.ratio = o.ratio;
        if (o.vel != null) st.vel = o.vel;
        if (o.instant) {
          stop();
          st.pos = target;
          st.vel = 0;
          st.last = 0;
          applyRef.current(target);
          restRef.current?.();
          return;
        }
        if (!st.raf) {
          st.last = 0;
          st.raf = requestAnimationFrame(tick);
        }
      },
      drag(value, vel = 0) {
        stop();
        st.pos = value;
        st.target = value;
        st.vel = vel;
        st.last = 0;
        applyRef.current(value);
      },
      stop,
    };
  }
  useEffect(() => {
    applyRef.current(s.current.pos);
    return () => api.current?.stop();
  }, []);
  return api.current;
}
