import * as stylex from '@stylexjs/stylex';
import { Database, FileText, Kanban, Mail, MessageSquare, Layers, Contact } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { ToggleButton } from 'react-aria-components';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { Tile, fillSvg, type IllustrationItem } from '../../internal/w7-parts';
import { Scene, useScene, type IllustrationProps } from '../../internal/w7-scene';
import { useBeamEngine, useIsoLayoutEffect } from '../../internal/r5-beam-engine';


const chipIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(6px)', filter: 'blur(2px)' },
  to: { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
});
const dotBreathe = stylex.keyframes({
  '0%, 100%': { boxShadow: `0 0 0 0 transparent` },
  '50%': { boxShadow: `0 0 0 3px ${colors['--oniva-color-accent-soft']}` },
});

const NARROW = '@container (max-width: 459px)';

const styles = stylex.create({
  root: { position: 'relative', width: '100%' },
  svg: { height: '100%', inset: 0, overflow: 'visible', pointerEvents: 'none', position: 'absolute', width: '100%' },
  line: {
    fill: 'none',
    stroke: colors['--oniva-color-border'],
    strokeLinecap: 'round',
    strokeWidth: 1.5,
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'stroke, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  lineDim: { opacity: 0.35 },
  lineHot: { stroke: colors['--oniva-color-border-hover'] },
  lineOff: { opacity: 0.75, strokeDasharray: '2 5' },
  pulse: { opacity: 0, transitionDuration: motion['--oniva-motion-dur-slow'], transitionProperty: 'opacity' },
  pulsePath: {
    fill: 'none',
    strokeLinecap: 'round',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  glow: { opacity: 0.45, strokeWidth: 6 },
  core: { strokeWidth: 2 },
  pathDim: { opacity: 0.2 },
  scene: {
    alignItems: 'center',
    display: 'grid',
    gridTemplateAreas: { default: '"in . hub . out"', [NARROW]: '"in" "hub" "out"' },
    gridTemplateColumns: { default: 'auto minmax(40px, 1fr) auto minmax(40px, 1fr) auto', [NARROW]: '1fr' },
    justifyItems: { default: 'normal', [NARROW]: 'center' },
    paddingBlock: { default: 14, [NARROW]: 14 },
    paddingInline: { default: 14, [NARROW]: 0 },
    rowGap: { default: 0, [NARROW]: 78 },
    position: 'relative',
  },
  group: {
    display: 'flex',
    flexDirection: { default: 'column', [NARROW]: 'row' },
    gap: { default: 32, [NARROW]: 'clamp(14px, 7cqw, 34px)' },
  },
  groupIn: { gridArea: 'in' },
  groupOut: { gridArea: 'out' },
  tool: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'none',
    borderWidth: 0,
    cursor: 'pointer',
    display: 'block',
    flexShrink: 0,
    height: 56,
    margin: 0,
    padding: 0,
    position: 'relative',
    transform: { default: 'scale(1)', ':active': 'scale(0.96)' },
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 56,
    '--oniva-ib-icon': { default: 'scale(1)', [media.hover]: { default: 'scale(1)', ':hover': 'scale(1.08)' } },
  },
  dimmed: { opacity: 0.55 },
  tile: {
    borderRadius: radius['--oniva-radius-xl'],
    fontSize: 22,
    height: 56,
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'background-color, box-shadow',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 56,
  },
  tileOff: { backgroundColor: colors['--oniva-color-surface-tertiary'] },
  icon: {
    alignItems: 'center',
    display: 'inline-flex',
    height: '50%',
    justifyContent: 'center',
    transform: 'var(--oniva-ib-icon, scale(1))',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform, filter, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '50%',
  },
  iconOff: { filter: 'grayscale(1)', opacity: 0.4 },
  ring: {
    borderRadius: 'inherit',
    boxShadow: `0 0 0 3px ${colors['--oniva-color-accent-soft']}, 0 0 22px 2px ${accent['--oniva-accent-solid']}`,
    inset: 0,
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
  },
  name: {
    color: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: 12,
    fontWeight: 500,
    left: '50%',
    lineHeight: '16px',
    position: 'absolute',
    textDecorationLine: 'none',
    top: 'calc(100% + 4px)',
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
  },
  paused: { textDecorationLine: 'line-through' },
  hub: { gridArea: 'hub', height: 80, position: 'relative', width: 80 },
  hubTile: {
    backgroundImage: `linear-gradient(145deg, ${accent['--oniva-accent-600']}, ${accent['--oniva-accent-800']})`,
    borderRadius: radius['--oniva-radius-xxl'],
    boxShadow: `${shadow['--oniva-shadow-xl']}, 0 0 0 1px ${colors['--oniva-color-border']}`,
    color: colors['--oniva-color-accent-fg'],
    fontSize: 30,
    height: 80,
    position: 'relative',
    width: 80,
    zIndex: 1,
  },
  hubRing: { borderRadius: radius['--oniva-radius-xxl'], zIndex: 2 },
  chip: {
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-full'],
    boxShadow: `${shadow['--oniva-shadow-sm']}, 0 0 0 1px ${colors['--oniva-color-border']}`,
    display: 'block',
    height: 26,
    left: '50%',
    overflow: 'hidden',
    position: 'absolute',
    top: 'calc(100% + 12px)',
    transform: 'translateX(-50%)',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'width',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  chipInner: {
    alignItems: 'center',
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: 12,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    gap: 7,
    height: 26,
    paddingInline: '10px 11px',
    whiteSpace: 'nowrap',
    width: 'max-content',
  },
  chipText: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'both',
    animationName: { default: chipIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'inline-block',
  },
  chipDot: {
    backgroundColor: colors['--oniva-color-success-solid'],
    borderRadius: radius['--oniva-radius-full'],
    height: 6,
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'background-color',
    width: 6,
  },
  chipDotIdle: { backgroundColor: colors['--oniva-color-text-muted'] },
  chipSync: {
    animationDuration: '1.1s',
    animationIterationCount: 'infinite',
    animationName: { default: dotBreathe, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundColor: accent['--oniva-accent-solid'],
  },
  sr: {
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
});


export interface IntegrationBeamProps extends IllustrationProps {
  /** Tools that send data in (three look best). On narrow widths they stack above the hub. */
  left?: IllustrationItem[];
  /** Tools that receive data. On narrow widths they stack below the hub. */
  right?: IllustrationItem[];
  /** Your product in the middle. */
  center?: IllustrationItem;
  /** Chip texts under the hub: while syncing, and when idle. Defaults to "Syncing…" and "{n} connected". */
  statusLabels?: { syncing: string; idle: string };
}

const ic = (I: typeof Mail) => <I {...stylex.props(fillSvg.svg)} />;
const LEFT: IllustrationItem[] = [
  { name: 'Mail', icon: ic(Mail) },
  { name: 'Docs', icon: ic(FileText) },
  { name: 'Chat', icon: ic(MessageSquare) },
];
const RIGHT: IllustrationItem[] = [
  { name: 'CRM', icon: ic(Contact) },
  { name: 'Boards', icon: ic(Kanban) },
  { name: 'Warehouse', icon: ic(Database) },
];

function BeamBody({
  left,
  right,
  center,
  statusLabels,
}: Required<Pick<IntegrationBeamProps, 'left' | 'right' | 'center'>> & Pick<IntegrationBeamProps, 'statusLabels'>) {
  const uid = 'oniva-ib' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const tools = [...left, ...right];
  const n = tools.length;
  const nLeft = left.length;
  const { live, reduced } = useScene();
  const [off, setOff] = useState<ReadonlySet<number>>(() => new Set());
  const [spot, setSpot] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [announce, setAnnounce] = useState('');
  const offRef = useRef(off);
  offRef.current = off;

  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hubRef = useRef<HTMLSpanElement>(null);
  const hubRingRef = useRef<HTMLSpanElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const chipInnerRef = useRef<HTMLSpanElement>(null);
  const toolRefs = useRef<(HTMLElement | null)[]>([]);
  const ringRefs = useRef<(HTMLElement | null)[]>([]);
  const lineRefs = useRef<(SVGPathElement | null)[]>([]);
  const pulseRefs = useRef<(SVGGElement | null)[]>([]);
  const gradRefs = useRef<(SVGLinearGradientElement | null)[]>([]);

  const connected = n - off.size;
  const active = syncing && connected > 0;
  const text =
    connected === 0
      ? 'All paused'
      : active
        ? (statusLabels?.syncing ?? 'Syncing…')
        : (statusLabels?.idle ?? `${connected} connected`);

  useBeamEngine(
    { root: rootRef, svg: svgRef, hub: hubRef, hubRing: hubRingRef, tools: toolRefs, rings: ringRefs, lines: lineRefs, pulses: pulseRefs, grads: gradRefs },
    { n, nLeft, live, reduced, off: offRef, onSyncing: setSyncing },
  );

  // The status chip glides to the width of its new text
  useIsoLayoutEffect(() => {
    const chip = chipRef.current;
    const inner = chipInnerRef.current;
    if (chip && inner) chip.style.width = `${inner.offsetWidth}px`;
  }, [text]);

  const toggle = (i: number, paused: boolean) => {
    const next = new Set(offRef.current);
    if (paused) next.add(i);
    else next.delete(i);
    setOff(next);
    setAnnounce(`${tools[i]!.name} ${paused ? 'paused' : 'connected'}. ${n - next.size} of ${n} connected.`);
  };

  const tool = (item: IllustrationItem, i: number) => {
    const isPaused = off.has(i);
    return (
      <ToggleButton
        key={i}
        ref={(el) => {
          toolRefs.current[i] = el;
        }}
        aria-label={`${item.name}: pause sync`}
        isSelected={isPaused}
        onChange={(v) => toggle(i, v)}
        onHoverChange={(h) => setSpot((s) => (h ? i : s === i ? null : s))}
        onFocusChange={(f) => setSpot((s) => (f ? i : s === i ? null : s))}
        {...mergeSx(stylex.props(styles.tool, focus.ring, spot !== null && spot !== i && styles.dimmed))}
      >
        <Tile item={item} size={0} xstyle={[styles.tile, isPaused && styles.tileOff]}>
          <span {...stylex.props(styles.icon, isPaused && styles.iconOff)}>
            {item.icon ?? <span aria-hidden="true">{item.name.trim().charAt(0).toUpperCase()}</span>}
          </span>
        </Tile>
        <span
          aria-hidden="true"
          ref={(el) => {
            ringRefs.current[i] = el;
          }}
          {...stylex.props(styles.ring)}
        />
        <span {...stylex.props(styles.name, isPaused && styles.paused)}>{item.name}</span>
      </ToggleButton>
    );
  };

  return (
    <div ref={rootRef} {...stylex.props(styles.root)}>
      <svg ref={svgRef} aria-hidden="true" {...stylex.props(styles.svg)}>
        <defs>
          <filter id={`${uid}-blur`} filterUnits="userSpaceOnUse" x="-100" y="-100" width="10000" height="10000">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          {tools.map((_, i) => (
            <linearGradient
              key={i}
              id={`${uid}-g${i}`}
              gradientUnits="userSpaceOnUse"
              ref={(el) => {
                gradRefs.current[i] = el;
              }}
            >
              <stop offset="0" style={{ stopColor: 'var(--oniva-accent-solid)', stopOpacity: 0 }} />
              <stop offset="0.6" style={{ stopColor: 'var(--oniva-accent-solid)', stopOpacity: 0.9 }} />
              <stop offset="1" style={{ stopColor: 'color-mix(in srgb, var(--oniva-accent-solid) 45%, white)', stopOpacity: 1 }} />
            </linearGradient>
          ))}
        </defs>
        {tools.map((_, i) => (
          <path
            key={`l${i}`}
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
            {...stylex.props(styles.line, spot !== null && spot !== i && styles.lineDim, spot === i && !off.has(i) && styles.lineHot, off.has(i) && styles.lineOff)}
          />
        ))}
        {tools.map((_, i) => (
          <g
            key={`p${i}`}
            ref={(el) => {
              pulseRefs.current[i] = el;
            }}
            {...stylex.props(styles.pulse)}
          >
            <path stroke={`url(#${uid}-g${i})`} filter={`url(#${uid}-blur)`} {...stylex.props(styles.pulsePath, styles.glow, spot !== null && spot !== i && styles.pathDim)} />
            <path stroke={`url(#${uid}-g${i})`} {...stylex.props(styles.pulsePath, styles.core, spot !== null && spot !== i && styles.pathDim)} />
          </g>
        ))}
      </svg>
      <div {...stylex.props(styles.scene)}>
        <div {...stylex.props(styles.group, styles.groupIn)}>{left.map((it, i) => tool(it, i))}</div>
        <span ref={hubRef} aria-hidden="true" {...stylex.props(styles.hub)}>
          <Tile item={center} size={0} xstyle={styles.hubTile} />
          <span ref={hubRingRef} {...stylex.props(styles.ring, styles.hubRing)} />
          <span ref={chipRef} {...stylex.props(styles.chip)}>
            <span ref={chipInnerRef} {...stylex.props(styles.chipInner)}>
              <span {...stylex.props(styles.chipDot, connected === 0 && styles.chipDotIdle, active && styles.chipSync)} />
              <span key={text} {...stylex.props(styles.chipText)}>
                {text}
              </span>
            </span>
          </span>
        </span>
        <div {...stylex.props(styles.group, styles.groupOut)}>{right.map((it, i) => tool(it, nLeft + i))}</div>
      </div>
      <span aria-live="polite" {...stylex.props(styles.sr)}>
        {announce}
      </span>
    </div>
  );
}

/**
 * Your product between the tools it connects. In sync cycles, light pulses leave the left tools, travel the
 * measured beams into the hub (which glows on arrival) and on out to the right tools. Hover or focus a tool to
 * spotlight its beam, press it to pause. Below 460px of container width the tools stack above and below the hub and
 * the curves morph into place. The loop pauses off-screen; under reduced motion the beams are static.
 */
export function IntegrationBeam({
  left = LEFT,
  right = RIGHT,
  center = { name: 'Oniva', icon: ic(Layers) },
  statusLabels,
  label,
  ...rest
}: IntegrationBeamProps) {
  return (
    <Scene
      ratio="auto"
      role="group"
      label={label ?? `${center.name} connected to ${[...left, ...right].map((i) => i.name).join(', ')}`}
      {...rest}
    >
      <BeamBody left={left} right={right} center={center} statusLabels={statusLabels} />
    </Scene>
  );
}
