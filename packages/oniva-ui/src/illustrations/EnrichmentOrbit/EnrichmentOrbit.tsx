import * as stylex from '@stylexjs/stylex';
import { Database, Mail, Sparkles, UserRound } from 'lucide-react';
import { motion } from '../../tokens/motion.stylex';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { Tile, fillSvg, type IllustrationItem } from '../../internal/w7-parts';
import { loop, Scene, type IllustrationProps } from '../../internal/w7-scene';

const spin = stylex.keyframes({ to: { transform: 'rotate(360deg)' } });
const drawRing = stylex.keyframes({ from: { strokeDashoffset: 1 }, to: { strokeDashoffset: 0 } });
const popIn = stylex.keyframes({ from: { opacity: 0, transform: 'scale(0.86)' } });
const breatheRing = stylex.keyframes({ '0%, 100%': { opacity: 0.4 }, '50%': { opacity: 0.9 } });
const spinBack = stylex.keyframes({ to: { transform: 'rotate(-360deg)' } });

const styles = stylex.create({
  svg: { inset: 0, position: 'absolute' },
  ring: {
    animationDuration: '900ms',
    animationFillMode: 'backwards',
    animationName: { default: drawRing, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out-expo'],
    fill: 'none',
    stroke: colors['--oniva-color-border-hover'],
    strokeDasharray: 1,
    strokeWidth: 0.25,
  },
  ringOuter: { animationDelay: '120ms' },
  centerPop: {
    animationDelay: '300ms',
    animationDuration: motion['--oniva-motion-dur-sheet'],
    animationFillMode: 'backwards',
    animationName: { default: popIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
    display: 'block',
    transform: { default: 'scale(1)', ':hover': { default: null, [media.hover]: 'scale(1.06)' } },
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  nodePop: {
    animationDuration: motion['--oniva-motion-dur-sheet'],
    animationFillMode: 'backwards',
    animationName: { default: popIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
    display: 'block',
    transform: { default: 'scale(1)', ':hover': { default: null, [media.hover]: 'scale(1.12)' } },
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  nodePopAt: (i: number) => ({ animationDelay: `${520 + i * 120}ms` }),
  halo: {
    animationDuration: '4.5s',
    animationName: { default: breatheRing, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    fill: 'none',
    stroke: accent['--oniva-accent-solid'],
    strokeWidth: 0.5,
  },
  comet: {
    fill: 'none',
    stroke: accent['--oniva-accent-solid'],
    strokeDasharray: '12 88',
    strokeLinecap: 'round',
    strokeWidth: 0.6,
    transformBox: 'view-box',
    transformOrigin: '50% 50%',
  },
  cometGlow: { filter: 'blur(2px)', strokeWidth: 1.4, opacity: 0.6 },
  cw: { animationDuration: '7s', animationName: { default: spin, [media.reducedMotion]: 'none' }, animationTimingFunction: 'linear' },
  ccw: { animationDuration: '7s', animationName: { default: spinBack, [media.reducedMotion]: 'none' }, animationTimingFunction: 'linear' },
  center: { left: '50%', position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)' },
  orbit: {
    animationDuration: '22s',
    animationName: { default: spin, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    inset: 0,
    position: 'absolute',
  },
  slot: { height: 0, left: '50%', position: 'absolute', top: '50%', width: 0 },
  slotAt: (deg: number) => ({ transform: `rotate(${deg}deg)` }),
  arm: { left: 0, position: 'absolute', top: 0, transform: 'translate(-50%, -40cqw)' },
  upright: (deg: number) => ({ transform: `rotate(${-deg}deg)` }),
  counter: {
    animationDuration: '22s',
    animationName: { default: spinBack, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    display: 'block',
  },
});

export interface EnrichmentOrbitProps extends IllustrationProps {
  /** The tile in the middle (your product or the enrichment engine). */
  center?: IllustrationItem;
  /** Three data nodes that orbit the outer ring. */
  nodes?: [IllustrationItem, IllustrationItem, IllustrationItem];
}

const icon = (n: React.ReactNode) => n;
const DEFAULT_CENTER: IllustrationItem = { name: 'Enrichment', icon: icon(<Sparkles {...stylex.props(fillSvg.svg)} />) };
const DEFAULT_NODES: [IllustrationItem, IllustrationItem, IllustrationItem] = [
  { name: 'Contacts', icon: <UserRound {...stylex.props(fillSvg.svg)} /> },
  { name: 'Mail', icon: <Mail {...stylex.props(fillSvg.svg)} /> },
  { name: 'Warehouse', icon: <Database {...stylex.props(fillSvg.svg)} /> },
];

/** A tile inside two rings. Comets circle the rings in opposite directions while three data nodes orbit and stay upright. */
export function EnrichmentOrbit({ center = DEFAULT_CENTER, nodes = DEFAULT_NODES, label, ...rest }: EnrichmentOrbitProps) {
  return (
    <Scene
      ratio="1 / 1"
      label={label ?? `${center.name} tile with ${nodes.map((n) => n.name).join(', ')} orbiting around it`}
      {...rest}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true" {...stylex.props(styles.svg, fillSvg.svg)}>
        <circle cx="50" cy="50" r="24" pathLength={1} {...stylex.props(styles.ring)} />
        <circle cx="50" cy="50" r="40" pathLength={1} {...stylex.props(styles.ring, styles.ringOuter)} />
        <circle cx="50" cy="50" r="31" {...stylex.props(styles.halo, loop.run)} strokeDasharray="0.6 2.2" strokeLinecap="round" />
        <circle cx="50" cy="50" r="24" pathLength={100} {...stylex.props(styles.comet, styles.cometGlow, styles.cw, loop.run)} />
        <circle cx="50" cy="50" r="24" pathLength={100} {...stylex.props(styles.comet, styles.cw, loop.run)} />
        <circle cx="50" cy="50" r="40" pathLength={100} {...stylex.props(styles.comet, styles.cometGlow, styles.ccw, loop.run)} />
        <circle cx="50" cy="50" r="40" pathLength={100} {...stylex.props(styles.comet, styles.ccw, loop.run)} />
      </svg>
      <span aria-hidden="true" {...stylex.props(styles.center)}>
        <span {...stylex.props(styles.centerPop)}>
          <Tile item={center} size={18} />
        </span>
      </span>
      <span aria-hidden="true" {...stylex.props(styles.orbit, loop.run)}>
        {nodes.map((n, i) => {
          const deg = i * 120;
          return (
            <span key={n.name} {...stylex.props(styles.slot, styles.slotAt(deg))}>
              <span {...stylex.props(styles.arm)}>
                <span {...stylex.props(styles.counter, loop.run)}>
                  <span {...stylex.props(styles.upright(deg))}>
                    <span {...stylex.props(styles.nodePop, styles.nodePopAt(i))}>
                      <Tile item={n} size={11} tone={i} />
                    </span>
                  </span>
                </span>
              </span>
            </span>
          );
        })}
      </span>
    </Scene>
  );
}
