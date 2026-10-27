import * as stylex from '@stylexjs/stylex';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { Button } from '../../components/Button/Button';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { focus } from '../../internal/focus';
import { paletteAt } from '../../internal/w7-parts';
import { useReducedMotion } from '../../internal/motion-hooks';
import { Scene, type IllustrationProps } from '../../internal/w7-scene';
import { useFlingSpring } from '../../internal/r4-spring';

const riseNext = stylex.keyframes({
  from: { filter: 'blur(3px)', opacity: 0, transform: 'translate(14px, 4px)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'translate(0, 0)' },
});
const risePrev = stylex.keyframes({
  from: { filter: 'blur(3px)', opacity: 0, transform: 'translate(-14px, 4px)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'translate(0, 0)' },
});
const enter = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(8px) scale(0.97)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});

const styles = stylex.create({
  stage: {
    cursor: 'grab',
    inset: '0 0 24% 0',
    perspective: '120cqw',
    position: 'absolute',
    touchAction: 'pan-y',
    userSelect: 'none',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'both',
    animationName: { default: enter, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  lifter: {
    inset: 0,
    position: 'absolute',
    transform: 'translateY(0)',
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  lifterOn: {
    transform: { default: 'translateY(0)', ':hover': { default: null, [media.hover]: 'translateY(-1.2cqw)' } },
  },
  drift: {
    inset: '0 -8%',
    position: 'absolute',
    transform: 'translateX(calc(var(--w7-d, 0) * -5%))',
  },
  sheen: {
    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.28), transparent 45%)',
    borderRadius: radius['--oniva-radius-xl'],
    inset: 0,
    opacity: 'calc(var(--w7-t, 0) * 0.9)' as unknown as number,
    pointerEvents: 'none',
    position: 'absolute',
    transform: 'scaleX(var(--w7-sg, 1))',
    zIndex: 2,
  },
  dim: {
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-xl'],
    inset: 0,
    opacity: 'calc(var(--w7-t, 0) * 0.3)' as unknown as number,
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 1,
  },
  ground: {
    backgroundColor: colors['--oniva-color-text'],
    borderRadius: radius['--oniva-radius-full'],
    bottom: -3,
    filter: 'blur(5px)',
    height: 8,
    left: '10%',
    opacity: 'calc(0.16 * (1 - var(--w7-t, 0) * 0.7))' as unknown as number,
    pointerEvents: 'none',
    position: 'absolute',
    right: '10%',
  },
  grabbing: { cursor: 'grabbing' },
  cover: {
    left: '50%',
    marginLeft: 'calc(var(--w7-cw) / -2)',
    position: 'absolute',
    top: '50%',
    marginTop: 'calc(var(--w7-ch) / -1.6)',
    transformStyle: 'preserve-3d',
    willChange: 'transform, opacity',
  },
  size: (w: number, h: number) => ({ '--w7-cw': `${w}px`, '--w7-ch': `${h}px`, height: h, width: w }),
  face: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    boxShadow: `${shadow['--oniva-shadow-lg']}, 0 0 0 1px ${colors['--oniva-color-border']}`,
    borderRadius: radius['--oniva-radius-xl'],
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  img: { display: 'block', height: '100%', objectFit: 'cover', width: '100%' },
  reflection: {
    height: '100%',
    left: 0,
    maskImage: 'linear-gradient(to bottom, transparent 62%, rgba(0,0,0,0.28))',
    opacity: 0.55,
    pointerEvents: 'none',
    position: 'absolute',
    top: 'calc(100% + 2px)',
    transform: 'scaleY(-1)',
    width: '100%',
  },
  fallback: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    fontSize: '9cqw',
    fontWeight: 700,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  caption: {
    alignItems: 'center',
    bottom: '2%',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6cqw',
    left: '10%',
    position: 'absolute',
    right: '10%',
  },
  row: { alignItems: 'center', display: 'flex', gap: '2cqw', justifyContent: 'center' },
  text: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'both',
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    minWidth: '30cqw',
    textAlign: 'center',
  },
  textNext: { animationName: { default: riseNext, [media.reducedMotion]: 'none' } },
  textPrev: { animationName: { default: risePrev, [media.reducedMotion]: 'none' } },
  title: { display: 'block', fontSize: '2.8cqw', fontWeight: 600 },
  subtitle: { color: colors['--oniva-color-text-muted'], display: 'block', fontSize: '2.2cqw' },
  ticks: { display: 'flex', gap: '0.2cqw', marginTop: '0.2cqw' },
  tick: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderStyle: 'none',
    borderWidth: 0,
    cursor: 'pointer',
    display: 'flex',
    height: '2.4cqw',
    justifyContent: 'center',
    padding: 0,
    width: '2.6cqw',
  },
  pill: {
    backgroundColor: colors['--oniva-color-border-control'],
    clipPath: 'inset(0 0.8cqw round 999px)',
    height: '1cqw',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'clip-path, background-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '2.6cqw',
  },
  pillHover: {
    backgroundColor: { default: colors['--oniva-color-border-control'], ':hover': { default: null, [media.hover]: colors['--oniva-color-text-muted'] } },
  },
  pillOn: { backgroundColor: colors['--oniva-color-text'], clipPath: 'inset(0 0 round 999px)' },
});

export interface CoverFlowItem {
  id: string;
  title?: string;
  subtitle?: string;
  /** Image URL. */
  image?: string;
  alt?: string;
  /** Any node as the cover (wins over `image`). */
  cover?: ReactNode;
}

export interface CoverFlowProps extends IllustrationProps {
  items?: CoverFlowItem[];
  /** Front cover (controlled). */
  index?: number;
  /** Starting cover when uncontrolled. Defaults to the middle one. */
  defaultIndex?: number;
  /** Called whenever a different cover reaches the front, also while dragging. */
  onIndexChange?: (index: number) => void;
  /** Clicking the front cover or pressing Enter. */
  onSelect?: (item: CoverFlowItem, index: number) => void;
  /** Cover width in px. The row scales down in narrow containers (to half at most). */
  itemWidth?: number;
  itemHeight?: number;
  /** How far the side covers turn away, in degrees. */
  angle?: number;
  reflection?: boolean;
  caption?: boolean;
  renderCaption?: (item: CoverFlowItem, index: number) => ReactNode;
  /** Previous / next buttons beside the caption. */
  controls?: boolean;
  /** Position ticks under the caption. */
  ticks?: boolean;
  'aria-label'?: string;
}

const TITLES: [string, string][] = [
  ['Northern Lights', 'Kestrel Quartet'],
  ['Paper Cities', 'Mara Ellison'],
  ['Slow Orbit', 'The Lumen Set'],
  ['Harbor Radio', 'Juno & Pine'],
  ['Afterglow', 'Sable Coast'],
  ['Field Notes', 'Orla Vance'],
  ['Low Tide', 'Cobalt Hours'],
];
const DEFAULT: CoverFlowItem[] = TITLES.map(([title, subtitle], i) => ({ id: `c${i}`, title, subtitle }));

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const rubber = (p: number, n: number) => (p < 0 ? p * 0.35 : p > n - 1 ? n - 1 + (p - (n - 1)) * 0.35 : p);

/**
 * Browse covers in 3D. Drag, flick or scrub the row and it springs to the nearest cover; arrow keys, buttons and ticks work too.
 * Covers turn, recede and dim with distance and rubber-band at the ends. Under reduced motion covers jump into place.
 */
export function CoverFlow({
  items = DEFAULT,
  index: controlled,
  defaultIndex,
  onIndexChange,
  onSelect,
  itemWidth = 280,
  itemHeight = 280,
  angle = 50,
  reflection = true,
  caption = true,
  renderCaption,
  controls = true,
  ticks = true,
  'aria-label': ariaLabel = 'Cover flow',
  label,
  ...rest
}: CoverFlowProps) {
  const n = items.length;
  const start = clamp(controlled ?? defaultIndex ?? Math.floor((n - 1) / 2), 0, Math.max(0, n - 1));
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;
  const root = useRef<HTMLDivElement>(null);
  const covers = useRef<(HTMLDivElement | null)[]>([]);
  const [width, setWidth] = useState(0);
  const [current, setCurrent] = useState(start);
  const [dragging, setDragging] = useState(false);
  const last = useRef(start);
  const dir = useRef(1);
  const drag = useRef({ active: false, x: 0, t: 0, v: 0, moved: 0 });
  const scale = width ? clamp(width / (itemWidth * 3.3), 0.5, 1) : 1;
  const w = itemWidth * scale;
  const h = itemHeight * scale;
  const geo = useRef({ w, angle });
  geo.current = { w, angle };

  const apply = useCallback(
    (pos: number) => {
      const { w: cw, angle: a } = geo.current;
      for (let i = 0; i < n; i++) {
        const el = covers.current[i];
        if (!el) continue;
        const d = i - pos;
        const ad = Math.abs(d);
        const sg = Math.sign(d);
        const x = ad <= 1 ? d * 0.5 * cw : sg * (0.5 * cw + (ad - 1) * 0.24 * cw);
        const z = -Math.min(ad, 1) * 0.3 * cw - Math.max(ad - 1, 0) * 0.08 * cw;
        const rot = -clamp(d, -1, 1) * a;
        const sc = 1 - Math.min(ad, 3) * 0.035;
        el.style.transform = `translate3d(${x}px, 0, ${z}px) rotateY(${rot}deg) scale(${sc})`;
        el.style.opacity = String(Math.max(0.2, 1 - Math.max(ad - 2, 0) * 0.4));
        el.style.zIndex = String(100 - Math.round(ad * 10));
        el.style.setProperty('--w7-t', Math.min(ad, 1).toFixed(3));
        el.style.setProperty('--w7-d', clamp(d, -1.5, 1.5).toFixed(3));
        el.style.setProperty('--w7-sg', d < 0 ? '1' : '-1');
      }
      const idx = clamp(Math.round(pos), 0, n - 1);
      if (idx !== last.current) {
        dir.current = idx > last.current ? 1 : -1;
        last.current = idx;
        setCurrent(idx);
        onIndexChange?.(idx);
      }
    },
    [n, onIndexChange],
  );
  const spring = useFlingSpring(start, apply);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => spring.refresh(), [w, angle, spring]);
  useEffect(() => {
    if (controlled !== undefined && clamp(controlled, 0, n - 1) !== last.current) {
      spring.to(clamp(controlled, 0, n - 1), reducedRef.current);
    }
  }, [controlled, n, spring]);

  const go = (i: number) => spring.to(clamp(i, 0, n - 1), reduced);
  const step = () => w * 0.5;

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    drag.current = { active: true, x: e.clientX, t: performance.now(), v: 0, moved: 0 };
    setDragging(true);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const dr = drag.current;
    if (!dr.active) return;
    const now = performance.now();
    const moved = -(e.clientX - dr.x) / step();
    dr.moved += Math.abs(e.clientX - dr.x);
    dr.v = 0.7 * dr.v + 0.3 * (moved / Math.max(1, now - dr.t)) * 1000;
    dr.x = e.clientX;
    dr.t = now;
    spring.drag(rubber(spring.get() + moved, n));
  };
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const dr = drag.current;
    if (!dr.active) return;
    dr.active = false;
    setDragging(false);
    const p = spring.get();
    if (dr.moved < 4) {
      // a click: the front cover selects, a side cover comes to the front
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const off = (e.clientX - (rect.left + rect.width / 2)) / step();
      const target = Math.abs(off) < 0.5 ? Math.round(p) : clamp(Math.round(p + Math.sign(off) * Math.max(1, Math.round(Math.abs(off) - 0.2))), 0, n - 1);
      if (target === Math.round(p)) onSelect?.(items[target]!, target);
      else go(target);
      return;
    }
    let target = Math.round(p + dr.v * 0.25);
    if (Math.abs(dr.v) > 2 && target === Math.round(p)) target += Math.sign(dr.v);
    spring.to(clamp(target, 0, n - 1), reduced, reduced ? 0 : dr.v);
  };
  const wheelTimer = useRef(0);
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    // Native non-passive listener so a sideways swipe scrubs the row without also navigating back; vertical scroll stays with the page.
    const onWheel = (e: globalThis.WheelEvent) => {
      const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
      if (Math.abs(dx) <= Math.abs(e.deltaY) && !e.shiftKey) return;
      e.preventDefault();
      spring.drag(rubber(spring.get() + dx / step() / 1.5, n));
      window.clearTimeout(wheelTimer.current);
      // Settle in the direction of the swipe
      wheelTimer.current = window.setTimeout(() => go(Math.round(spring.get() + Math.sign(dx) * 0.3)), 110);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
      window.clearTimeout(wheelTimer.current);
    };
  });
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = last.current;
    if (e.target !== e.currentTarget) return;
    if (e.key === 'ArrowRight') go(i + 1);
    else if (e.key === 'ArrowLeft') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(n - 1);
    else if (e.key === 'Enter' || e.key === ' ') onSelect?.(items[i]!, i);
    else return;
    e.preventDefault();
  };

  const item = items[current]!;
  const face = (it: CoverFlowItem, i: number) =>
    it.cover ?? (it.image ? (
      <img src={it.image} alt="" draggable={false} {...stylex.props(styles.img)} />
    ) : (
      <span {...stylex.props(styles.fallback, paletteAt(i))}>{(it.title ?? '?').charAt(0)}</span>
    ));

  return (
    <Scene
      ratio="16 / 10"
      role="group"
      label={label ?? ariaLabel}
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      xstyle={focus.ring}
      {...rest}
      ref={(node) => {
        root.current = node;
        const r = rest.ref;
        if (typeof r === 'function') r(node);
        else if (r) (r as { current: HTMLDivElement | null }).current = node;
      }}
    >
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        ref={stageRef}
        {...stylex.props(styles.stage, dragging && styles.grabbing)}
      >
        {items.map((it, i) => (
          <div
            key={it.id}
            ref={(el) => {
              covers.current[i] = el;
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${n}${it.title ? `: ${it.title}` : ''}`}
            aria-hidden={i === current ? undefined : true}
            {...stylex.props(styles.cover, styles.size(w, h))}
          >
            <span aria-hidden="true" {...stylex.props(styles.ground)} />
            <div {...stylex.props(styles.lifter, i === current && styles.lifterOn)}>
              <div {...stylex.props(styles.face)}>
                <div {...stylex.props(styles.drift)}>{face(it, i)}</div>
                <span aria-hidden="true" {...stylex.props(styles.dim)} />
                <span aria-hidden="true" {...stylex.props(styles.sheen)} />
              </div>
              {reflection && (
                <div aria-hidden="true" {...stylex.props(styles.reflection)}>
                  <div {...stylex.props(styles.face)}>
                    <div {...stylex.props(styles.drift)}>{face(it, i)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {caption && (
        <div {...stylex.props(styles.caption)}>
          <div {...stylex.props(styles.row)}>
            {controls && (
              <Button isIconOnly size="sm" variant="ghost" aria-label="Previous cover" isDisabled={current === 0} onPress={() => go(current - 1)}>
                <ChevronLeft size={16} />
              </Button>
            )}
            <div key={current} aria-live="polite" {...stylex.props(styles.text, dir.current > 0 ? styles.textNext : styles.textPrev)} data-dir={dir.current}>
              {renderCaption ? (
                renderCaption(item, current)
              ) : (
                <>
                  <span {...stylex.props(styles.title)}>{item.title}</span>
                  {item.subtitle && <span {...stylex.props(styles.subtitle)}>{item.subtitle}</span>}
                </>
              )}
            </div>
            {controls && (
              <Button isIconOnly size="sm" variant="ghost" aria-label="Next cover" isDisabled={current === n - 1} onPress={() => go(current + 1)}>
                <ChevronRight size={16} />
              </Button>
            )}
          </div>
          {ticks && (
            <div {...stylex.props(styles.ticks)}>
              {items.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  tabIndex={-1}
                  aria-label={`Go to ${it.title ?? i + 1}`}
                  aria-current={i === current ? 'true' : undefined}
                  onClick={() => go(i)}
                  {...stylex.props(styles.tick)}
                >
                  <span {...stylex.props(styles.pill, styles.pillHover, i === current && styles.pillOn)} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Scene>
  );
}
