import * as stylex from '@stylexjs/stylex';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { useInView } from '../motion/InView';
import { useReducedMotion } from './motion-hooks';
import { mergeSx } from './sx';
import { colors } from '../tokens/colors.stylex';
import { radius } from '../tokens/radius.stylex';

/**
 * Shared frame for the Illustrations group. A scene is a responsive, container-sized box that
 * reports whether it is on screen (`live`), so loops can pause off-screen. CSS loops read the
 * inherited `--w7-play` custom property through `loop.run`; JS loops read `useScene().live`.
 */

export interface SceneContextValue {
  /** Scene is on screen (or `alwaysLive`). JS timers should only advance while live. */
  live: boolean;
  /** `prefers-reduced-motion: reduce` is active. */
  reduced: boolean;
}

const SceneContext = createContext<SceneContextValue>({ live: true, reduced: false });
export const useScene = () => useContext(SceneContext);

export interface IllustrationProps {
  /** Accessible description of the scene. */
  label?: string;
  /** Hide the scene from assistive tech (purely decorative use). */
  isDecorative?: boolean;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const styles = stylex.create({
  /* The stage: a full-width, softly filled, rounded panel. The scene itself sits in `box`, centred, at its own ratio. */
  root: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-xxxl'],
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    maxWidth: '100%',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  box: {
    boxSizing: 'border-box',
    containerType: 'inline-size',
    display: 'block',
    maxWidth: '100%',
    position: 'relative',
    width: '100%',
  },
  boxFit: { height: '100%', width: 'auto' },
  boxClip: { overflow: 'hidden' },
  live: { '--w7-play': 'running' },
  idle: { '--w7-play': 'paused' },
  ratio: (value: string) => ({ aspectRatio: value }),
});

/** Animation helpers: spread next to a per-element `animationName`/`animationDuration`. */
export const loop = stylex.create({
  run: {
    animationDelay: 'var(--w7-delay, 0s)',
    animationFillMode: 'both',
    animationIterationCount: 'infinite',
    // `var()` is the only way to pause a whole subtree from the scene root without per-element props.
    // eslint-disable-next-line @stylexjs/valid-styles
    animationPlayState: 'var(--w7-play, running)',
  },
  once: {
    animationDelay: 'var(--w7-delay, 0s)',
    animationFillMode: 'both',
    animationIterationCount: 1,
    // `var()` is the only way to pause a whole subtree from the scene root without per-element props.
    // eslint-disable-next-line @stylexjs/valid-styles
    animationPlayState: 'var(--w7-play, running)',
  },
  fill: { inset: 0, position: 'absolute' },
  svgFill: { display: 'block', height: '100%', inset: 0, position: 'absolute', width: '100%' },
  /** Delay as a CSS variable so a single style object serves every item: `delay(0.4)`. */
  delay: (seconds: number) => ({ '--w7-delay': `${seconds}s` }),
});

export interface SceneProps
  extends IllustrationProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'className'> {
  /** CSS aspect-ratio of the scene, e.g. `'3 / 2'`. */
  ratio: string;
  /** `img` for passive scenes; `group` when the scene contains focusable controls. */
  role?: 'img' | 'group';
  /** Keep loops running off-screen. */
  alwaysLive?: boolean;
  /** Clip children to the box. */
  clip?: boolean;
  children?: ReactNode;
}

/** Stage aspect: never narrower than a wide panel, so square or portrait scenes sit centred inside it. */
const STAGE_MIN = 43 / 25;
function stageRatio(ratio: string): string {
  if (ratio === 'auto') return 'auto';
  const [a, b] = ratio.split('/').map((n) => parseFloat(n));
  const r = a && b ? a / b : a || 1;
  return r >= STAGE_MIN ? ratio : String(STAGE_MIN);
}

export function Scene({
  ratio,
  label,
  isDecorative,
  role = 'img',
  alwaysLive,
  clip,
  className,
  xstyle,
  ref,
  children,
  ...rest
}: SceneProps) {
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ once: false, threshold: 0.05 });
  const reduced = useReducedMotion();
  const live = alwaysLive || inView;
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      viewRef(node);
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as { current: HTMLDivElement | null }).current = node;
    },
    [ref, viewRef],
  );
  const sx = stylex.props(
    styles.root,
    styles.ratio(stageRatio(ratio)),
    live ? styles.live : styles.idle,
    xstyle,
  );
  const boxSx = stylex.props(styles.box, ratio !== 'auto' && styles.boxFit, styles.ratio(ratio), clip && styles.boxClip);
  const a11y = isDecorative
    ? ({ 'aria-hidden': true } as const)
    : ({ role, 'aria-label': label } as const);
  return (
    <SceneContext.Provider value={{ live: !!live, reduced }}>
      <div {...rest} {...a11y} ref={setRef} data-live={live ? 'true' : 'false'} {...mergeSx(sx, className)}>
        <div data-scene-box="" {...boxSx}>
          {children}
        </div>
      </div>
    </SceneContext.Provider>
  );
}

/**
 * Drives a step timeline. `delays[i]` is how long step `i` is held before moving on.
 * Stops when the scene is off screen; under reduced motion it rests on `rest` (default: last step).
 */
export function useSteps(
  delays: readonly number[],
  { loop: repeat = true, rest = delays.length - 1, paused = false }: { loop?: boolean; rest?: number; /** Freeze on the current step (no jump). */ paused?: boolean } = {},
): number {
  const { live, reduced } = useScene();
  const [step, setStep] = useState(reduced ? rest : 0);
  const key = delays.join(',');
  const delaysRef = useRef(delays);
  delaysRef.current = delays;
  useEffect(() => {
    if (reduced) {
      setStep(rest);
      return;
    }
    if (!live || paused) return;
    const ds = delaysRef.current;
    const id = window.setTimeout(() => {
      setStep((s) => (s + 1 < ds.length ? s + 1 : repeat ? 0 : s));
    }, ds[Math.min(step, ds.length - 1)]);
    return () => window.clearTimeout(id);
  }, [live, reduced, paused, step, repeat, rest, key]);
  return step;
}

/** Cycles an index through `count` entries while the scene is live. Returns `[index, setIndex]`. */
export function useCycle(count: number, interval: number, enabled = true) {
  const { live, reduced } = useScene();
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!live || reduced || !enabled || count < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => window.clearInterval(id);
  }, [live, reduced, enabled, count, interval]);
  return [index, setIndex] as const;
}

/** Hover state for a whole scene (mouse and pen only, so taps never leave it stuck). Spread `handlers` onto the Scene. */
export function useHover() {
  const [hovered, setHovered] = useState(false);
  const handlers = {
    onPointerEnter: (e: { pointerType: string }) => setHovered(e.pointerType !== 'touch'),
    onPointerLeave: () => setHovered(false),
  };
  return { hovered, handlers };
}

/** Integer counter that increments every `interval` ms while the scene is live (stays 0 under reduced motion). */
export function useTicker(interval: number, enabled = true) {
  const { live, reduced } = useScene();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!live || reduced || !enabled) return;
    const id = window.setInterval(() => setN((v) => v + 1), interval);
    return () => window.clearInterval(id);
  }, [live, reduced, enabled, interval]);
  return n;
}
