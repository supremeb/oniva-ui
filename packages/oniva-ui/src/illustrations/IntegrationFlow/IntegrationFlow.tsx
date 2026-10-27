import * as stylex from '@stylexjs/stylex';
import { BarChart3, CheckSquare, Database, KeyRound, LifeBuoy, MessageSquare } from 'lucide-react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { useRef } from 'react';
import { BeamPath, fillSvg, surface, type IllustrationItem } from '../../internal/w7-parts';
import { Scene, loop, useScene, useTicker, type IllustrationProps } from '../../internal/w7-scene';
import { useIsoLayoutEffect } from '../../internal/r5-beam-engine';

/* Clean-room implementation from the public Integration Flow description (no third-party source). */

const drift = stylex.keyframes({
  '0%, 100%': { opacity: 0.45, transform: 'translate(0, 0) scale(1)' },
  '50%': { opacity: 0.65, transform: 'translate(4cqw, -3cqw) scale(1.12)' },
});
const arrive = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const charge = stylex.keyframes({
  '0%': { opacity: 0, transform: 'scale(0.9)' },
  '45%': { opacity: 0.8 },
  '100%': { opacity: 0, transform: 'scale(1.35)' },
});
/* The beam lands at ~2.4s of each 3.4s cycle: the hub pops and its glow lights up, then settles */
const hubPop = stylex.keyframes({
  '0%, 68%': { transform: 'scale(1)' },
  '76%': { transform: 'scale(1.045)' },
  '100%': { transform: 'scale(1)' },
});
const hubGlow = stylex.keyframes({
  '0%, 68%': { opacity: 0, transform: 'scale(0.96)' },
  '78%': { opacity: 0.85, transform: 'scale(1)' },
  '100%': { opacity: 0, transform: 'scale(1.12)' },
});

const glass = `color-mix(in srgb, ${accent['--oniva-accent-950']} 55%, transparent)`;
const glassRim = `inset 0 0 0 1px color-mix(in srgb, ${colors['--oniva-color-accent-fg']} 16%, transparent)`;

const styles = stylex.create({
  /* Stage: warm accent wash, like a sunset, fading to deep at the foot */
  stage: {
    backgroundImage: `linear-gradient(165deg, ${accent['--oniva-accent-300']}, ${accent['--oniva-accent-500']} 45%, ${accent['--oniva-accent-800']})`,
  },
  foot: {
    backgroundImage: `linear-gradient(to bottom, transparent, ${accent['--oniva-accent-950']})`,
    bottom: 0,
    height: '30%',
    left: 0,
    opacity: 0.7,
    position: 'absolute',
    right: 0,
  },
  blob: {
    animationDuration: '16s',
    animationName: { default: drift, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    borderRadius: radius['--oniva-radius-full'],
    filter: 'blur(36px)',
    opacity: 0.55,
    position: 'absolute',
  },
  blobA: { backgroundColor: accent['--oniva-accent-200'], height: '36cqw', left: '-4%', top: '-6cqw', width: '36cqw' },
  blobB: { backgroundColor: accent['--oniva-accent-400'], height: '30cqw', right: '-2%', top: '24cqw', width: '30cqw' },
  svg: { inset: 0, position: 'absolute' },
  arc: {
    fill: 'none',
    stroke: colors['--oniva-color-accent-fg'],
    strokeDasharray: '0.8 1.2',
    strokeOpacity: 0.5,
    strokeWidth: 0.26,
  },
  pill: {
    alignItems: 'center',
    animationDuration: '400ms',
    animationName: { default: arrive, [media.reducedMotion]: 'none' },
    backgroundColor: glass,
    borderRadius: radius['--oniva-radius-full'],
    boxShadow: `${glassRim}, ${shadow['--oniva-shadow-lg']}`,
    boxSizing: 'border-box',
    color: colors['--oniva-color-accent-fg'],
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    gap: '1.5cqw',
    height: '8.7cqw',
    left: 0,
    marginLeft: '-13.7cqw',
    marginTop: '-4.35cqw',
    padding: '0 1.6cqw 0 1.6cqw',
    position: 'absolute',
    top: 0,
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: 'opacity, background-color, box-shadow',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '27.4cqw',
  },
  slot: (x: number, y: number) => ({ translate: `${x}cqw ${y}cqw` }),
  hidden: { opacity: 0 },
  lit: { opacity: 1 },
  dim: { backgroundColor: `color-mix(in srgb, ${accent['--oniva-accent-950']} 28%, transparent)`, opacity: 0.8 },
  far: { opacity: 0.35 },
  glyph: {
    alignItems: 'center',
    backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-accent-fg']} 16%, transparent)`,
    borderRadius: radius['--oniva-radius-full'],
    boxShadow: glassRim,
    display: 'inline-flex',
    flexShrink: 0,
    height: '5.4cqw',
    justifyContent: 'center',
    width: '5.4cqw',
  },
  glyphIcon: { height: '52%', width: '52%' },
  texts: { display: 'flex', flexDirection: 'column', gap: '0.2cqw', minWidth: 0 },
  name: { fontSize: '2.2cqw', fontWeight: 500, lineHeight: 1.15, overflow: 'hidden', textOverflow: 'ellipsis' },
  sub: {
    fontSize: '2cqw',
    lineHeight: 1.15,
    opacity: 0.7,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  halo: {
    animationDelay: '0.7s',
    animationDuration: '1.4s',
    animationFillMode: 'both',
    animationName: { default: charge, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: accent['--oniva-accent-200'],
    borderRadius: radius['--oniva-radius-full'],
    filter: 'blur(10px)',
    inset: '-1cqw',
    position: 'absolute',
    zIndex: -1,
  },
  hub: {
    animationDuration: '3.4s',
    animationName: { default: hubPop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    height: '8.7cqw',
    left: '7.5cqw',
    marginLeft: 0,
    marginTop: 0,
    padding: '0 1.6cqw 0 3cqw',
    top: '23.8cqw',
    width: '35.5cqw',
    flexDirection: 'row-reverse',
    textAlign: 'right',
  },
  hubGlow: {
    animationDuration: '3.4s',
    animationFillMode: 'both',
    animationName: { default: hubGlow, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: accent['--oniva-accent-200'],
    borderRadius: radius['--oniva-radius-full'],
    filter: 'blur(12px)',
    height: '8.7cqw',
    left: '7.5cqw',
    opacity: 0,
    position: 'absolute',
    top: '23.8cqw',
    width: '35.5cqw',
  },
});

export interface IntegrationFlowItem extends IllustrationItem {
  /** Short title shown instead of `name` in the pill. */
  title?: string;
}

export interface IntegrationFlowProps extends IllustrationProps {
  /** Integrations that rotate through the pills (five or more). */
  items?: IntegrationFlowItem[];
  /** Name of the hub the beam lands in. */
  hubLabel?: string;
  /** Second line under the hub name. */
  hubDescription?: string;
  /** Small first line on every pill (default `Integration`). */
  kind?: string;
}

const ic = (I: typeof KeyRound) => <I {...stylex.props(fillSvg.svg)} />;
const DEFAULT: IntegrationFlowItem[] = [
  { name: 'Identity', icon: ic(KeyRound) },
  { name: 'Data', icon: ic(Database) },
  { name: 'Chat', icon: ic(MessageSquare) },
  { name: 'Tasks', icon: ic(CheckSquare) },
  { name: 'Support', icon: ic(LifeBuoy) },
];

const SLOTS = [-2, -1, 0, 1, 2];
const CYCLE = 3400; // pills glide 0.9s, centre charges, beam sweeps 1.1s, hub lights up
const GLIDE = 900;
const arcX = (s: number) => 70.3 + 4.4 * Math.abs(s) ** 1.5;
const arcY = (s: number) => 28.55 + s * 15.5;
const mod = (n: number, m: number) => ((n % m) + m) % m;

function FlowBody({ items, hubLabel, hubDescription, kind }: { items: IntegrationFlowItem[]; hubLabel: string; hubDescription: string; kind: string }) {
  const n = items.length;
  const tick = useTicker(CYCLE);
  const { reduced } = useScene();
  const pills = useRef<(HTMLElement | null)[]>([]);
  const prevTick = useRef(tick);
  // Each pill travels along the dashed arc (not a straight line) to its next slot; the one leaving fades out as it slides on
  useIsoLayoutEffect(() => {
    if (tick === prevTick.current) return;
    prevTick.current = tick;
    if (reduced) return;
    items.forEach((_, i) => {
      const el = pills.current[i];
      if (!el || typeof el.animate !== 'function') return;
      const prev = mod(i - (tick - 1) + 2, n) - 2;
      const next = mod(i - tick + 2, n) - 2;
      let from: number;
      let to: number;
      if (next === prev - 1 && prev >= -2 && prev <= 2) {
        from = prev;
        to = next;
      } else if (prev === -2 && next === 2) {
        from = -2; // wrapped: leaves to the left, the entrance below takes over
        to = -3;
      } else if (next === 2) {
        from = 3;
        to = 2;
      } else return;
      const frames = Array.from({ length: 9 }, (_, k) => {
        const s = from + ((to - from) * k) / 8;
        return { translate: `${arcX(s)}cqw ${arcY(s)}cqw` };
      });
      // A pill that wraps around is already at the far end: animate the entrance instead of the exit
      if (prev === -2 && next === 2) {
        const enter = Array.from({ length: 9 }, (_, k) => {
          const s = 3 - k / 8;
          return { translate: `${arcX(s)}cqw ${arcY(s)}cqw`, opacity: k / 8 };
        });
        el.animate(enter, { duration: GLIDE, easing: 'cubic-bezier(0.77, 0, 0.175, 1)', delay: 0 });
        return;
      }
      el.animate(frames, { duration: GLIDE, easing: 'cubic-bezier(0.77, 0, 0.175, 1)' });
    });
  }, [tick]);
  return (
    <>
      <span aria-hidden="true" {...stylex.props(styles.blob, styles.blobA, loop.run)} />
      <span aria-hidden="true" {...stylex.props(styles.blob, styles.blobB, loop.run, loop.delay(-6))} />
      <span aria-hidden="true" {...stylex.props(styles.foot)} />
      <svg viewBox="0 0 100 57.14" preserveAspectRatio="none" aria-hidden="true" {...stylex.props(styles.svg)}>
        <path d="M75.95 -5.5 Q47.05 28.55 75.95 62.6" {...stylex.props(styles.arc)} />
        <BeamPath key={tick} d="M56.6 28.55 L43.6 28.55" delay={1.3} duration={1.1} once isStatic={reduced && false} />
      </svg>
      {items.map((it, i) => {
        const rel = mod(i - tick + 2, n) - 2;
        const wraps = Math.floor((tick - i + 2) / n);
        const visible = SLOTS.includes(rel);
        const s = Math.max(-2, Math.min(2, rel));
        const centre = rel === 0;
        return (
          <span
            key={`${i}-${wraps}`}
            ref={(el) => {
              pills.current[i] = el;
            }}
            aria-hidden="true"
            {...stylex.props(
              surface.pill,
              styles.pill,
              styles.slot(arcX(s) , arcY(s)),
              centre ? styles.lit : styles.dim,
              Math.abs(rel) === 2 && styles.far,
              !visible && styles.hidden,
            )}
          >
            {centre && <span key={tick} {...stylex.props(styles.halo)} />}
            <span {...stylex.props(styles.glyph)}>
              <span {...stylex.props(styles.glyphIcon)}>{it.icon ?? it.name.charAt(0)}</span>
            </span>
            <span {...stylex.props(styles.texts)}>
              <span {...stylex.props(styles.name)}>{kind}</span>
              <span {...stylex.props(styles.sub)}>{it.title ?? it.name}</span>
            </span>
          </span>
        );
      })}
      <span key={`glow-${tick}`} aria-hidden="true" {...stylex.props(styles.hubGlow, loop.once)} />
      <span key={`hub-${tick}`} aria-hidden="true" {...stylex.props(surface.pill, styles.pill, styles.hub, loop.once)}>
        <span {...stylex.props(styles.glyph)}>
          <BarChart3 {...stylex.props(styles.glyphIcon)} />
        </span>
        <span {...stylex.props(styles.texts)}>
          <span {...stylex.props(styles.name)}>{hubLabel}</span>
          <span {...stylex.props(styles.sub)}>{hubDescription}</span>
        </span>
      </span>
    </>
  );
}

/**
 * Integration pills rotating along a dashed arc, each beaming its data into a central hub. The pill in the middle charges and
 * lights up, a beam sweeps to the hub. Pauses off-screen; stands still in the centre state under reduced motion.
 */
export function IntegrationFlow({ items = DEFAULT, hubLabel = 'Data analysis', hubDescription = 'Central processing', kind = 'Integration', label, ...rest }: IntegrationFlowProps) {
  return (
    <Scene
      ratio="7 / 4"
      label={label ?? `Integrations like ${items.slice(0, 3).map((i) => i.name).join(', ')} feeding a ${hubLabel} hub`}
      clip
      xstyle={styles.stage}
      {...rest}
    >
      <FlowBody items={items} hubLabel={hubLabel} hubDescription={hubDescription} kind={kind} />
    </Scene>
  );
}
