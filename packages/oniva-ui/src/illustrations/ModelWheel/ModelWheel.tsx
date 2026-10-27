import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MutableRefObject, type PointerEvent, type ReactNode } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { Tile, type IllustrationItem } from '../../internal/w7-parts';
import { Scene, useScene, type IllustrationProps } from '../../internal/w7-scene';
import { useTunedSpring } from '../../internal/r6-spring';
import { mod } from '../../internal/w7-spring';

const styles = stylex.create({
  wheel: {
    cursor: 'grab',
    inset: 0,
    maskImage: 'linear-gradient(to bottom, transparent, #000 28%, #000 72%, transparent)',
    perspective: '80cqw',
    perspectiveOrigin: '50% 50%',
    position: 'absolute',
    touchAction: 'none',
    userSelect: 'none',
  },
  grabbing: { cursor: 'grabbing' },
  pill: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-xl'],
    height: '10cqw',
    left: '50%',
    marginLeft: '-25cqw',
    marginTop: '-5cqw',
    position: 'absolute',
    top: '50%',
    transformOrigin: '50% 50%',
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '50cqw',
  },
  pillScale: (s: number) => ({ transform: `scaleX(${s})` }),
  row: {
    alignItems: 'center',
    color: {
      default: colors['--oniva-color-text-muted'],
      ':is([data-active])': colors['--oniva-color-text'],
    },
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: '4cqw',
    fontWeight: 600,
    gap: '2cqw',
    height: '10cqw',
    justifyContent: 'center',
    left: 0,
    marginTop: '-5cqw',
    position: 'absolute',
    right: 0,
    top: '50%',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    visibility: 'hidden',
    whiteSpace: 'nowrap',
    willChange: 'transform, opacity',
  },
  sr: {
    borderStyle: 'none',
    borderWidth: 0,
    clipPath: 'inset(50%)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
});

export interface ModelWheelItem extends IllustrationItem {
  icon?: ReactNode;
}

export interface ModelWheelProps extends IllustrationProps {
  /** Models on the wheel (fictional names by default). Seven or more keep the drum full. */
  models?: ModelWheelItem[];
  /** Milliseconds a model stays in the middle. */
  hold?: number;
}

const DEFAULT: ModelWheelItem[] = [
  'Atlas 2',
  'Atlas 2 Mini',
  'Nova Pro',
  'Lumen Fast',
  'Quill Reasoner',
  'Orion Vision',
  'Cobalt 3',
  'Sable Lite',
].map((name) => ({ name }));

const STEP = 26; // degrees between rows
const R = '21.65cqw'; // row height / (2 * tan(STEP / 2))

/**
 * AI model names on a turning drum: rows tilt away, shrink and fade toward the top and bottom, and each model lands on a
 * soft grey fill. Drag or flick to spin, use arrow keys, or let it run. Turns by itself only while on screen and not under reduced motion.
 */
export function ModelWheel({ models = DEFAULT, hold = 1500, label, ...rest }: ModelWheelProps) {
  const ctl = useRef<((delta: number) => void) | null>(null);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const delta = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    ctl.current?.(delta);
  };
  return (
    <Scene
      ratio="5 / 4"
      role="group"
      label={label ?? `AI models on a turning wheel: ${models.map((m) => m.name).join(', ')}`}
      xstyle={focus.ring}
      tabIndex={0}
      aria-roledescription="model wheel"
      onKeyDown={onKeyDown}
      {...rest}
    >
      <Wheel models={models} hold={hold} ctl={ctl} />
    </Scene>
  );
}

function Wheel({ models, hold, ctl }: { models: ModelWheelItem[]; hold: number; ctl: MutableRefObject<((delta: number) => void) | null> }) {
  const n = models.length;
  const { live, reduced } = useScene();
  const [hovered, setHovered] = useState(false);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const wheel = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ active: false, y: 0, t: 0, v: 0, raw: 0 });
  const lastIdx = useRef(0);

  // Rows are moved imperatively (many per frame, driven by the spring), never through React state.
  const apply = useCallback(
    (pos: number) => {
      for (let i = 0; i < n; i++) {
        const el = rows.current[i];
        if (!el) continue;
        const d = mod(pos - i + n / 2, n) - n / 2;
        const ad = Math.abs(d);
        if (ad > 2.9) {
          el.style.visibility = 'hidden';
          continue;
        }
        el.style.visibility = 'visible';
        el.style.transform = `translateZ(-${R}) rotateX(${-d * STEP}deg) translateZ(${R})`;
        el.style.opacity = String(Math.max(0, Math.cos((d * STEP * Math.PI) / 180)) ** 1.6);
      }
      const idx = mod(Math.round(pos), n);
      if (idx !== lastIdx.current) {
        lastIdx.current = idx;
        setCurrent(idx);
      }
    },
    [n],
  );
  const spring = useTunedSpring(0, apply);

  // turns by itself
  useEffect(() => {
    if (!live || reduced || dragging || hovered || n < 2) return;
    // slow, soft spring to the next row (hover holds the wheel)
    const id = window.setTimeout(() => spring.to(Math.round(spring.get()) + 1, { k: 70, ratio: 0.66 }), hold);
    return () => window.clearTimeout(id);
  }, [live, reduced, dragging, hovered, hold, n, spring, current]);

  const rowPx = () => (rows.current[0]?.offsetHeight ?? 40) * 0.92;
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    wheel.current?.setPointerCapture(e.pointerId);
    spring.drag(spring.get());
    drag.current = { active: true, y: e.clientY, t: performance.now(), v: 0, raw: spring.get() };
    setDragging(true);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const dr = drag.current;
    if (!dr.active) return;
    const now = performance.now();
    const moved = (e.clientY - dr.y) / rowPx();
    // smoothed speed (rows per second) so a quick flick keeps turning after release
    dr.v = 0.6 * dr.v + 0.4 * (moved / Math.max(0.008, (now - dr.t) / 1000));
    dr.raw += moved;
    dr.y = e.clientY;
    dr.t = now;
    // detents: each row pulls the wheel in a little, so it ticks from model to model
    spring.drag(dr.raw - Math.sin(2 * Math.PI * dr.raw) * 0.07);
  };
  const onUp = () => {
    const dr = drag.current;
    if (!dr.active) return;
    dr.active = false;
    setDragging(false);
    const p = spring.get();
    // throw: the swing carries on a little, then the magnet locks the closest row
    const target = Math.round(p + dr.v * 0.22);
    spring.to(target, { k: 140, ratio: 0.68, vel: reduced ? 0 : dr.v * 0.5, instant: reduced });
  };
  useEffect(() => {
    ctl.current = (delta) => spring.to(Math.round(spring.get()) + delta, { k: 140, ratio: 0.68, instant: reduced });
  });

  const maxLen = Math.max(...models.map((m) => m.name.length));
  const pillScale = (models[current]!.name.length + 8) / (maxLen + 8);
  return (
    <>
      <span aria-hidden="true" {...stylex.props(styles.pill, styles.pillScale(pillScale))} />
      <div
        ref={wheel}
        aria-hidden="true"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerEnter={(e) => setHovered(e.pointerType !== 'touch')}
        onPointerLeave={() => setHovered(false)}
        {...stylex.props(styles.wheel, dragging && styles.grabbing)}
      >
        {models.map((m, i) => (
          <div
            key={m.name + i}
            ref={(el) => {
              rows.current[i] = el;
            }}
            data-active={i === current ? '' : undefined}
            {...stylex.props(styles.row)}
          >
            <Tile item={m} size={5.4} round tone={i} />
            {m.name}
          </div>
        ))}
      </div>
      <span aria-live="polite" {...stylex.props(styles.sr)}>
        {models[current]!.name}
      </span>
    </>
  );
}
