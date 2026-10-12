import * as stylex from '@stylexjs/stylex';
import { Component, lazy, Suspense, useMemo, useRef, useState, type ReactNode } from 'react';
import { accent } from '@oniva-tokens/accent.stylex';
import { colors } from '@oniva-tokens/colors.stylex';
import { canTryShader, useLiveInView, usePalette, usePrefersReducedMotion, type Palette } from './gate';

export interface ShaderSceneProps {
  palette: Palette;
  fillProps: { className?: string; style?: React.CSSProperties };
  onReady: () => void;
  onUnavailable: () => void;
  /** 0..1 — showcase only: how "lit" the stage is. */
  energy?: number;
}

// All shader code (the `shaders` package + WebGPU engine) lives behind these dynamic imports,
// so it never touches first paint or the main bundle.
const HeroShader = lazy(() => import('./HeroShader'));
const StageShader = lazy(() => import('./StageShader'));

class Boundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const styles = stylex.create({
  root: { inset: 0, overflow: 'hidden', pointerEvents: 'none', position: 'absolute' },
  posterHero: {
    backgroundColor: colors['--oniva-color-bg'],
    // eslint-disable-next-line @stylexjs/valid-styles -- gradients fed from runtime CSS vars
    backgroundImage: [
      `radial-gradient(60% 70% at 78% 108%, ${accent['--oniva-accent-500']} 0%, transparent 62%)`,
      `radial-gradient(48% 60% at 18% 112%, ${accent['--oniva-accent-700']} 0%, transparent 66%)`,
      `radial-gradient(40% 50% at 52% 118%, ${accent['--oniva-accent-300']} 0%, transparent 70%)`,
    ].join(', '),
    inset: 0,
    position: 'absolute',
  },
  posterStage: {
    backgroundColor: colors['--oniva-color-bg'],
    // eslint-disable-next-line @stylexjs/valid-styles -- gradients fed from runtime CSS vars
    backgroundImage: [
      `radial-gradient(70% 55% at 50% -8%, color-mix(in srgb, ${accent['--oniva-accent-400']} 70%, transparent) 0%, transparent 70%)`,
      `radial-gradient(50% 50% at 15% 100%, color-mix(in srgb, ${accent['--oniva-accent-700']} 45%, transparent) 0%, transparent 70%)`,
    ].join(', '),
    inset: 0,
    position: 'absolute',
  },
  fadeIn: {
    inset: 0,
    opacity: { default: 0, ':is([data-ready="true"])': 1 },
    position: 'absolute',
    transitionDuration: '700ms',
    transitionProperty: 'opacity',
    transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
  },
  // Cap the effective pixel ratio (~1.5): render the canvas at k x size and scale it back up.
  scaled: (k: number) => ({
    height: `${k * 100}%`,
    transform: `scale(${1 / k})`,
    transformOrigin: '0 0',
    width: `${k * 100}%`,
  }),
  fill: { height: '100%', width: '100%' },
});

interface Props {
  kind: 'hero' | 'stage';
  /** Extra gate (e.g. showcase only renders while its section is active). */
  energy?: number;
  /** Fired when the live canvas state flips, so the parent can tweak scrims. */
  onLiveChange?: (live: boolean) => void;
}

/**
 * Decorative shader layer. Always paints a CSS poster; the live WebGPU canvas fades in over it only when
 * WebGPU exists, motion is allowed, the layer is in view, and init succeeded. Anything else keeps the poster.
 */
export function ShaderLayer({ kind, energy, onLiveChange }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const palette = usePalette(ref);
  const inView = useLiveInView(ref);
  const reduced = usePrefersReducedMotion();
  const [dead, setDead] = useState(false);
  const [ready, setReady] = useState(false);
  const can = useMemo(() => canTryShader(), []);
  const mount = can && !reduced && !dead && inView;
  const k = useMemo(
    () => Math.min(1, 1.5 / (typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1)),
    [],
  );
  const fail = () => {
    setDead(true);
    setReady(false);
    onLiveChange?.(false);
  };
  const fillProps = stylex.props(styles.fill) as ShaderSceneProps['fillProps'];
  const Scene = kind === 'hero' ? HeroShader : StageShader;
  return (
    <div ref={ref} aria-hidden="true" data-shader-layer={kind} data-shader-live={mount && ready} {...stylex.props(styles.root)}>
      <div {...stylex.props(kind === 'hero' ? styles.posterHero : styles.posterStage)} />
      {mount ? (
        <div data-ready={ready} {...stylex.props(styles.fadeIn)}>
          <div {...stylex.props(styles.scaled(k))}>
            <Boundary onError={fail}>
              <Suspense fallback={null}>
                <Scene
                  palette={palette}
                  fillProps={fillProps}
                  energy={energy}
                  onReady={() => {
                    setReady(true);
                    onLiveChange?.(true);
                  }}
                  onUnavailable={fail}
                />
              </Suspense>
            </Boundary>
          </div>
        </div>
      ) : null}
    </div>
  );
}
