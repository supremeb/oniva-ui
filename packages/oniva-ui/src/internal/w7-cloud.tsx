import * as stylex from '@stylexjs/stylex';
import { useEffect, useId, useRef, type PointerEvent } from 'react';
import { accent } from '../tokens/accent.stylex';
import { colors } from '../tokens/colors.stylex';
import { Scene, useScene, type IllustrationProps } from './w7-scene';

/** Shared creature for FrostCloud and GlowCloud: floats, glances around, blinks, follows the pointer, bounces and winks on click. */

export type CloudColor = 'blue' | 'orange';


const styles = stylex.create({
  sky: { inset: 0, position: 'absolute' },
  blue: {
    backgroundImage: `linear-gradient(165deg, ${accent['--oniva-accent-500']}, ${colors['--oniva-color-cyan-bg']})`,
  },
  orange: {
    backgroundImage: `linear-gradient(165deg, ${colors['--oniva-color-danger-solid']}, ${colors['--oniva-color-orange-bg']})`,
  },
  stage: { inset: 0, position: 'absolute' },
  floating: {
    inset: 0,
    position: 'absolute',
  },
  tiltBase: {
    inset: 0,
    position: 'absolute',
    willChange: 'transform',
  },
  svg: { display: 'block', height: '100%', overflow: 'visible', width: '100%' },
  shadow: {
    backgroundColor: colors['--oniva-color-on-solid-light'],
    borderRadius: '50%',
    bottom: '8%',
    filter: 'blur(6px)',
    height: '4.5%',
    left: '27%',
    opacity: 0.3,
    position: 'absolute',
    width: '46%',
  },
  bounce: { inset: 0, position: 'absolute', transformOrigin: '50% 90%' },
  white: { fill: colors['--oniva-color-on-solid'] },
  ink: { fill: colors['--oniva-color-on-solid-light'] },
  frost: { opacity: 0.86 },
  glowBody: { opacity: 0.95 },
  halo: { filter: 'blur(9px)', opacity: 0.85 },
  shine: {
    fill: colors['--oniva-color-on-solid'],
    opacity: 0.3,
  },
  frostShine: { fill: colors['--oniva-color-on-solid'], filter: 'blur(4px)', opacity: 0.55 },
  eye: {
    transformBox: 'fill-box',
    transformOrigin: '50% 50%',
  },
  skyStopA: { stopColor: colors['--oniva-color-on-solid'], stopOpacity: 0.96 },
  skyStopB: { stopColor: colors['--oniva-color-on-solid'], stopOpacity: 0.62 },
  bodyBlueA: { stopColor: accent['--oniva-accent-400'] },
  bodyBlueB: { stopColor: `color-mix(in srgb, ${accent['--oniva-accent-400']} 50%, ${colors['--oniva-color-cyan-bg']})` },
  bodyOrangeA: { stopColor: colors['--oniva-color-orange-bg'] },
  bodyOrangeB: { stopColor: colors['--oniva-color-danger-solid'] },
});

/** Idle glances: straight, left, right, up and to the side, down and to the side. */
const GLANCES = [
  { x: 0, y: 0 },
  { x: -1, y: 0.05 },
  { x: 1, y: -0.05 },
  { x: 0, y: 0 },
  { x: 0.65, y: -0.55 },
  { x: -0.7, y: 0.35 },
] as const;

const blinkScale = (since: number, length = 0.16) =>
  since < 0 || since > length ? 1 : 1 - 0.9 * Math.sin((since / length) * Math.PI);

export interface CloudSceneProps extends IllustrationProps {
  variant: 'frost' | 'glow';
  color?: CloudColor;
  /** Fill the box with the sky gradient. */
  background?: boolean;
  /** Eyes follow the pointer while it is over the scene. */
  followPointer?: boolean;
}

export function CloudScene({
  variant,
  color = 'blue',
  background = true,
  followPointer = true,
  label,
  ...rest
}: CloudSceneProps) {
  return (
    <Scene ratio="1 / 1" label={label ?? `A friendly ${variant === 'frost' ? 'frosted white' : 'glowing'} cloud with eyes on a ${color === 'blue' ? 'blue' : 'red and orange'} sky`} {...rest} clip={background}>
      <Cloud variant={variant} color={color} background={background} followPointer={followPointer} />
    </Scene>
  );
}

function Cloud({
  variant,
  color,
  background,
  followPointer,
}: {
  variant: 'frost' | 'glow';
  color: CloudColor;
  background: boolean;
  followPointer: boolean;
}) {
  const id = 'w7c' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const { live, reduced } = useScene();
  const floatRef = useRef<HTMLDivElement>(null);
  const turnRef = useRef<HTMLDivElement>(null);
  const bounceRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const shineRef = useRef<SVGEllipseElement>(null);
  const eyeL = useRef<SVGRectElement>(null);
  const eyeR = useRef<SVGRectElement>(null);
  const shadowRef = useRef<HTMLSpanElement>(null);
  const sim = useRef({
    look: { x: 0, y: 0, vx: 0, vy: 0 },
    target: { x: 0, y: 0 },
    squish: { p: 0, v: 0 },
    pointer: false,
    time: 0,
    nextGlance: 1.2,
    nextBlink: 1.8,
    blinkAt: -1,
    blinkTwice: false,
    winkAt: -1,
    kickUntil: 0,
    wake: () => {},
  });

  useEffect(() => {
    const st = sim.current;
    let frame = 0;
    let last = 0;
    const draw = () => {
      const { look, squish } = st;
      const still = reduced;
      const fl = still ? 0 : Math.sin(st.time * 1.1) * 4.5;
      const breathe = still ? 0 : Math.sin(st.time * 1.1 + Math.PI / 2) * 0.012;
      const sy = 1 + breathe - squish.p * 0.12;
      const sx = 1 - breathe + squish.p * 0.1;
      if (floatRef.current) floatRef.current.style.transform = `translateY(${fl.toFixed(2)}%)`;
      if (bounceRef.current) bounceRef.current.style.transform = `scale(${sx.toFixed(4)}, ${sy.toFixed(4)})`;
      if (turnRef.current)
        turnRef.current.style.transform = `translate(${(look.x * 2).toFixed(2)}%, ${(look.y * 1).toFixed(2)}%) rotate(${(look.x * 2.5).toFixed(2)}deg) scaleX(${(1 - Math.abs(look.x) * 0.025).toFixed(4)})`;
      eyesRef.current?.setAttribute('transform', `translate(${(look.x * 6).toFixed(2)} ${(look.y * 4).toFixed(2)})`);
      shineRef.current?.setAttribute('transform', `translate(${(-look.x * 5).toFixed(2)} ${(-look.y * 2).toFixed(2)})`);
      const both = st.blinkAt < 0 ? 1 : Math.min(blinkScale(st.time - st.blinkAt), st.blinkTwice ? blinkScale(st.time - st.blinkAt - 0.26) : 1);
      const wink = blinkScale(st.time - st.winkAt, 0.34);
      if (eyeL.current) eyeL.current.style.transform = `scaleY(${both.toFixed(3)})`;
      if (eyeR.current) eyeR.current.style.transform = `scaleY(${Math.min(both, wink).toFixed(3)})`;
      const lift = (fl + 4.5) / 9;
      if (shadowRef.current) {
        shadowRef.current.style.transform = `scaleX(${(1 - lift * 0.18).toFixed(3)})`;
        shadowRef.current.style.opacity = (0.3 - lift * 0.16).toFixed(3);
      }
    };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      st.time += dt;
      const { look, target, squish } = st;
      if (!st.pointer && st.time > st.nextGlance) {
        const g = GLANCES[Math.floor(Math.random() * GLANCES.length)]!;
        target.x = g.x;
        target.y = g.y;
        st.nextGlance = st.time + 1.4 + Math.random() * 2.2;
      }
      if (!reduced && st.time > st.nextBlink) {
        st.blinkAt = st.time;
        st.blinkTwice = Math.random() < 0.25;
        st.nextBlink = st.time + 2.4 + Math.random() * 3;
      }
      look.vx += ((target.x - look.x) * 70 - look.vx * 13) * dt;
      look.vy += ((target.y - look.y) * 70 - look.vy * 13) * dt;
      look.x += look.vx * dt;
      look.y += look.vy * dt;
      squish.v += (-squish.p * 220 - squish.v * 9) * dt;
      squish.p += squish.v * dt;
      draw();
      if (reduced && performance.now() > st.kickUntil) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (frame) return;
      last = 0;
      frame = requestAnimationFrame(tick);
    };
    st.wake = start;
    draw();
    if (live && !reduced) start();
    return () => {
      cancelAnimationFrame(frame);
      frame = 0;
      st.wake = () => {};
    };
  }, [live, reduced]);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!followPointer || e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    const st = sim.current;
    st.pointer = true;
    st.target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2.4));
    st.target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2.4));
    if (reduced) {
      st.kickUntil = performance.now() + 900;
      st.wake();
    }
  };
  const onLeave = () => {
    const st = sim.current;
    st.pointer = false;
    st.target.x = 0;
    st.target.y = 0;
    st.nextGlance = st.time + 1.2;
    if (reduced) {
      st.kickUntil = performance.now() + 900;
      st.wake();
    }
  };
  const onDown = () => {
    const st = sim.current;
    st.squish.p = 0.9;
    st.squish.v = 0;
    st.winkAt = st.time + 0.12;
    st.kickUntil = performance.now() + 1200;
    st.wake();
  };

  const bodyA = color === 'blue' ? styles.bodyBlueA : styles.bodyOrangeA;
  const bodyB = color === 'blue' ? styles.bodyBlueB : styles.bodyOrangeB;

  const shape = (cls: Array<stylex.StyleXStyles | false | undefined>, fill?: string) => (
    <g {...stylex.props(...cls)} fill={fill}>
      <rect x="24" y="84" width="152" height="50" rx="25" />
      <circle cx="68" cy="84" r="30" />
      <circle cx="108" cy="64" r="44" />
      <circle cx="152" cy="88" r="26" />
    </g>
  );
  const eyeRects = (cls: Array<stylex.StyleXStyles | false | undefined>) => (
    <g ref={eyesRef}>
      <rect ref={eyeL} x="80" y="86" width="12" height="22" rx="6" {...stylex.props(styles.eye, ...cls)} />
      <rect ref={eyeR} x="118" y="86" width="12" height="22" rx="6" {...stylex.props(styles.eye, ...cls)} />
    </g>
  );

  return (
    <div onPointerMove={onMove} onPointerLeave={onLeave} onPointerDown={onDown} {...stylex.props(styles.stage)} data-cloud={variant}>
      {background && <span aria-hidden="true" {...stylex.props(styles.sky, color === 'blue' ? styles.blue : styles.orange)} />}
      <span ref={shadowRef} aria-hidden="true" {...stylex.props(styles.shadow)} />
      <div ref={floatRef} aria-hidden="true" {...stylex.props(styles.floating)}>
        <div ref={turnRef} {...stylex.props(styles.tiltBase)}>
          <div ref={bounceRef} {...stylex.props(styles.bounce)}>
            <svg viewBox="0 0 200 160" {...stylex.props(styles.svg)}>
              <defs>
                <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" {...stylex.props(styles.skyStopA)} />
                  <stop offset="1" {...stylex.props(styles.skyStopB)} />
                </linearGradient>
                <linearGradient id={`${id}-body`} gradientUnits="userSpaceOnUse" x1="30" y1="20" x2="170" y2="140">
                  <stop offset="0" {...stylex.props(bodyA)} />
                  <stop offset="1" {...stylex.props(bodyB)} />
                </linearGradient>
                <mask id={`${id}-cut`} maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="160">
                  {shape([styles.white])}
                  <g transform="translate(0 0)">{eyeRects([styles.ink])}</g>
                </mask>
              </defs>
              {variant === 'frost' ? (
                <>
                  {!background && <g {...stylex.props(styles.halo)}>{shape([styles.white])}</g>}
                  <g mask={`url(#${id}-cut)`} {...stylex.props(styles.frost)}>
                    <rect x="0" y="0" width="200" height="160" fill={`url(#${id}-sky)`} />
                    <ellipse ref={shineRef} cx="86" cy="58" rx="26" ry="10" {...stylex.props(styles.frostShine)} />
                  </g>
                </>
              ) : (
                <>
                  <g {...stylex.props(styles.halo)} transform="translate(100 80) scale(1.1) translate(-100 -80)">
                    {shape([styles.white])}
                  </g>
                  <g {...stylex.props(styles.glowBody)}>{shape([], `url(#${id}-body)`)}</g>
                  <ellipse ref={shineRef} cx="86" cy="62" rx="22" ry="9" {...stylex.props(styles.shine)} />
                  {eyeRects([styles.white])}
                </>
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
