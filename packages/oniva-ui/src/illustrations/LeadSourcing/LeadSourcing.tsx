import * as stylex from '@stylexjs/stylex';
import { Mail, Search, Sparkles } from 'lucide-react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { BeamPath, Tile, fillSvg, type IllustrationItem } from '../../internal/w7-parts';
import { useReducedMotion } from '../../internal/motion-hooks';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { Scene, loop, type IllustrationProps } from '../../internal/w7-scene';

const rise = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(6px) scale(0.96)', filter: 'blur(3px)' },
  to: { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
});
/** The source tiles nudge when the travelling shine reaches them (7s loop, shine lands at ~72%). */
const receive = stylex.keyframes({
  '0%, 66%, 100%': { transform: 'scale(1)' },
  '74%': { transform: 'scale(1.07)' },
  '84%': { transform: 'scale(1)' },
});
const halo = stylex.keyframes({
  '0%, 100%': { opacity: 0.25, transform: 'scale(0.92)' },
  '50%': { opacity: 0.7, transform: 'scale(1.06)' },
});

const styles = stylex.create({
  enter: {
    animationDuration: motion['--oniva-motion-dur-sheet'],
    animationFillMode: 'backwards',
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  inner: {
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    transform: { default: 'none', [media.hover]: 'translateY(-4%)' },
  },
  receive: {
    animationDuration: '7s',
    animationName: { default: receive, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  haloRing: {
    animationDuration: '3.6s',
    animationName: { default: halo, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: '30%',
    filter: 'blur(10px)',
    inset: '-12%',
    position: 'absolute',
    zIndex: -1,
  },
  wrap: { position: 'relative' },
  svg: { inset: 0, position: 'absolute' },
  node: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2cqw',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  },
  name: {
    color: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: '2.2cqw',
    fontWeight: 500,
  },
  at: (x: number, y: number) => ({ left: `${x}%`, top: `${y}%` }),
});

export interface LeadSourcingProps extends IllustrationProps {
  /** Three tiles: the hub on the left, then the two sources it pulls from. */
  items?: [IllustrationItem, IllustrationItem, IllustrationItem];
}

const DEFAULT: [IllustrationItem, IllustrationItem, IllustrationItem] = [
  { name: 'Assistant', icon: <Sparkles {...stylex.props(fillSvg.svg)} /> },
  { name: 'Mail', icon: <Mail {...stylex.props(fillSvg.svg)} /> },
  { name: 'Web search', icon: <Search {...stylex.props(fillSvg.svg)} /> },
];

/** An assistant tile linked to two lead sources, with a shine that runs along the connection and rests between passes. */
export function LeadSourcing({ items = DEFAULT, label, ...rest }: LeadSourcingProps) {
  const [hub, a, b] = items;
  const reduced = useReducedMotion();
  return (
    <Scene
      ratio="3 / 2"
      label={label ?? `${hub.name} connected to ${a.name} and ${b.name} to source leads`}
      {...rest}
    >
      <svg viewBox="0 0 100 66.67" preserveAspectRatio="none" aria-hidden="true" {...stylex.props(styles.svg, fillSvg.svg)}>
        <BeamPath d="M28 33.3 C48 33.3 48 15 72 15" delay={0} duration={7} isStatic={reduced} />
        <BeamPath d="M28 33.3 C48 33.3 48 51.6 72 51.6" delay={0.5} duration={7} isStatic={reduced} />
      </svg>
      <Hub item={hub} x={22} y={50} size={20} order={0} source />
      <Hub item={a} x={78} y={22.5} size={15} order={1} receiveDelay={0} />
      <Hub item={b} x={78} y={77.5} size={15} order={2} receiveDelay={0.5} />
    </Scene>
  );
}

function Hub({
  item,
  x,
  y,
  size,
  order,
  source,
  receiveDelay,
}: {
  item: IllustrationItem;
  x: number;
  y: number;
  size: number;
  order: number;
  source?: boolean;
  receiveDelay?: number;
}) {
  return (
    <span aria-hidden="true" {...stylex.props(styles.node, styles.at(x, y))}>
      <span {...stylex.props(styles.enter,)} style={{ animationDelay: `${order * 80}ms` }}>
        <span {...stylex.props(styles.wrap, styles.inner)}>
          {source && <span {...stylex.props(styles.haloRing, loop.run)} />}
          <span
            {...stylex.props(styles.wrap, receiveDelay != null && styles.receive, receiveDelay != null && loop.run, receiveDelay != null && loop.delay(receiveDelay))}
            style={{ display: 'inline-flex' }}
          >
            <Tile item={item} size={size} />
          </span>
        </span>
      </span>
      <span {...stylex.props(styles.name)}>{item.name}</span>
    </span>
  );
}
