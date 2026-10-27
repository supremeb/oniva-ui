import * as stylex from '@stylexjs/stylex';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Button, InView, Switch } from 'oniva-ui';
import { accent } from '@oniva-tokens/accent.stylex';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';
import { shadow } from '@oniva-tokens/shadow.stylex';
import craft from 'virtual:oniva-craft';
import { mq } from '../mq.stylex';
import { ui } from '../ui';
import { HDim, U, VDim, d } from './draft';
import { bezierAt, durMs, num, parseBezier, ratio, sameColour, tail, type Vars } from './live';

/**
 * The foundations, shown as details on real components: the real Switch and Button with dimension lines drawn from
 * what they measured, the five depth levels as specimens, the type and space scales, and the accent ramp with live
 * contrast ratios. Everything re-reads when `vars` changes (theme, accent).
 */

const s = stylex.create({
  grid: {
    columnGap: 40,
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [mq.BP]: 'repeat(2, minmax(0, 1fr))' },
    marginBlockEnd: 0,
    marginBlockStart: 48,
    marginInline: 0,
    paddingBlock: 0,
    paddingInline: 0,
    rowGap: 56,
  },
  li: { display: 'flex', listStyle: 'none', minWidth: 0 },
  reveal: { display: 'flex', width: '100%' },
  wide: { gridColumn: { default: 'auto', [mq.BP]: '1 / -1' } },
  cell: {
    borderBlockStartColor: colors['--oniva-color-text'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minWidth: 0,
    paddingBlockStart: 16,
  },
  n: { color: colors['--oniva-color-text-muted'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  title: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-18'], fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.3, margin: 0 },
  body: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'], lineHeight: 1.55, margin: 0, maxWidth: 520, textWrap: 'pretty' },
  stage: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    marginBlockStart: 16,
    minWidth: 0,
    overflow: 'hidden',
    paddingBlock: 20,
    paddingInline: { default: 12, [mq.BP]: 20 },
  },
  plot: { marginInline: 'auto', maxWidth: 320, position: 'relative', width: '100%' },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBlockStart: 14 },
  chip: {
    alignItems: 'baseline',
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    gap: 6,
    lineHeight: 1.4,
    paddingBlock: 2,
    paddingInline: 10,
  },
  chipVal: { color: colors['--oniva-color-text'] },
  chipPass: { color: colors['--oniva-color-accent-text'] },
  chipFail: { color: colors['--oniva-color-text-error'] },
  // depth
  tray: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-card'],
    display: 'grid',
    gap: { default: 20, [mq.BP]: 24 },
    gridTemplateColumns: { default: 'repeat(2, minmax(0, 1fr))', '@media (min-width: 640px)': 'repeat(5, minmax(0, 1fr))' },
    marginBlockStart: 16,
    padding: { default: 16, [mq.BP]: 24 },
  },
  level: { display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 },
  tile: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-lg'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-11'],
    fontVariantNumeric: 'tabular-nums',
    height: 72,
    justifyContent: 'center',
  },
  tFlat: { borderColor: colors['--oniva-color-border'], borderStyle: 'solid', borderWidth: 1 },
  tRecessed: { backgroundColor: colors['--oniva-color-surface-tertiary'], boxShadow: shadow['--oniva-elevation-recessed'] },
  tRaised: { boxShadow: shadow['--oniva-elevation-raised'] },
  tFloating: { boxShadow: shadow['--oniva-elevation-floating'] },
  tOverlay: { boxShadow: shadow['--oniva-elevation-overlay'] },
  lvlName: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-14'], fontWeight: 500, margin: 0 },
  lvlTok: { color: colors['--oniva-color-text-muted'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-11'], lineHeight: 1.4, margin: 0, overflowWrap: 'anywhere' },
  // type + space
  typeRow: { alignItems: 'flex-end', display: 'flex', flexWrap: 'wrap', gap: '16px 18px' },
  glyph: { display: 'flex', flexDirection: 'column', gap: 6 },
  aa: { color: colors['--oniva-color-text'], fontFamily: mq.DISPLAY, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1 },
  cap: { color: colors['--oniva-color-text-muted'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-11'], fontVariantNumeric: 'tabular-nums', lineHeight: 1 },
  spaceGrid: { columnGap: 24, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', margin: 0, padding: 0, rowGap: 10 },
  spaceRow: { alignItems: 'center', display: 'grid', gap: 10, gridTemplateColumns: '22px minmax(0, 1fr)', listStyle: 'none' },
  bar: { backgroundColor: accent['--oniva-accent-solid'], borderRadius: 1, height: 6 },
  // ramp
  ramp: { display: 'grid', gap: 4, gridTemplateColumns: 'repeat(11, minmax(0, 1fr))', margin: 0, padding: 0 },
  step: { display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', minWidth: 0 },
  sw: { borderRadius: radius['--oniva-radius-sm'], boxShadow: 'inset 0 0 0 1px #0000000f', height: { default: 40, [mq.BP]: 56 } },
  stepNo: { color: colors['--oniva-color-text-muted'], fontFamily: font['--oniva-font-mono'], fontSize: 10, lineHeight: 1 },
  stepRatio: { fontFamily: font['--oniva-font-mono'], fontSize: 10, fontVariantNumeric: 'tabular-nums', lineHeight: 1 },
  mark: { color: colors['--oniva-color-accent-text'], fontFamily: font['--oniva-font-mono'], fontSize: 10, lineHeight: 1, minHeight: 10 },
  legend: { color: colors['--oniva-color-text-muted'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], lineHeight: 1.5, margin: 0, marginBlockStart: 14 },
});

const f1 = (n: number) => n.toFixed(1);
const fmtRatio = (n: number) => `${n.toFixed(n >= 10 ? 1 : 2)}`;

function Cell({ n, title, body, wide, children }: { n: string; title: string; body: ReactNode; wide?: boolean; children: ReactNode }) {
  return (
    <li {...stylex.props(s.li, wide && s.wide)}>
      <InView preset="slide" xstyle={s.reveal}>
        <div {...stylex.props(s.cell)} style={{ width: '100%' }}>
          <span {...stylex.props(s.n)} aria-hidden="true">
            {n}
          </span>
          <h3 {...stylex.props(s.title)}>{title}</h3>
          <p {...stylex.props(s.body)}>{body}</p>
          {children}
        </div>
      </InView>
    </li>
  );
}

function Chip({ k, v, tone }: { k: string; v: ReactNode; tone?: 'pass' | 'fail' }) {
  return (
    <span {...stylex.props(s.chip)}>
      {k}
      <span {...stylex.props(s.chipVal, tone === 'pass' && s.chipPass, tone === 'fail' && s.chipFail)}>{v}</span>
    </span>
  );
}

// ---------------------------------------------------------------- 01 Switch

interface SwitchRead {
  w: number;
  h: number;
  kw: number;
  gap: number;
  ease: ReturnType<typeof parseBezier>;
  dur: number;
  reduced: boolean;
}

const KS = 4;

function SwitchDetail({ vars }: { vars: Vars | null }) {
  const stage = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [m, setM] = useState<SwitchRead | null>(null);
  useLayoutEffect(() => {
    const track = stage.current?.querySelector<HTMLElement>('label > span[aria-hidden]');
    const knob = track?.firstElementChild as HTMLElement | undefined;
    if (!track || !knob || !vars) return;
    const cs = getComputedStyle(knob);
    const live = parseFloat(cs.transitionDuration) * (cs.transitionDuration.includes('ms') ? 1 : 1000);
    const reduced = !(live >= 1);
    setM({
      w: track.offsetWidth,
      h: track.offsetHeight,
      kw: knob.offsetWidth,
      gap: knob.offsetLeft,
      ease: parseBezier(cs.transitionTimingFunction),
      dur: reduced ? durMs(vars, '--oniva-motion-dur-slow') : live,
      reduced,
    });
  }, [vars]);

  const ox = 28;
  const oy = 34;
  let peak = 0;
  let peakAt = 0;
  const pts: [number, number][] = [];
  if (m?.ease) {
    for (let i = 0; i <= 120; i++) {
      const y = bezierAt(m.ease, i / 120);
      pts.push([i / 120, y]);
      if (y > peak) {
        peak = y;
        peakAt = i / 120;
      }
    }
  }
  const travel = m ? m.w - m.kw - 2 * m.gap : 0;
  const past = Math.max(0, (peak - 1) * travel);
  const tx = ox;
  const tw = (m?.w ?? 0) * KS;
  const th = (m?.h ?? 0) * KS;
  const stopX = tx + ((m?.gap ?? 0) + travel) * KS;
  const kd = (m?.kw ?? 0) * KS;
  const by = oy + th + 24;

  // easing plot
  const PW = 320;
  const base = 74;
  const unit = 46;
  const px = (t: number) => 4 + t * (PW - 8);
  const py = (v: number) => base - v * unit;
  const path = pts.map(([t, v], i) => `${i ? 'L' : 'M'}${px(t).toFixed(1)} ${py(v).toFixed(1)}`).join('');

  return (
    <div {...stylex.props(s.stage)}>
      <div {...stylex.props(s.plot)} ref={stage} style={{ height: oy + th + 52 || 176 }}>
        <div style={{ left: ox, position: 'absolute', top: oy, transform: `scale(${KS})`, transformOrigin: '0 0' }}>
          <Switch aria-label="Notifications" isSelected={on} onChange={setOn} />
        </div>
        {m && (
          <svg viewBox={`0 0 320 ${oy + th + 52}`} {...stylex.props(d.svg)} style={{ inset: 0, pointerEvents: 'none', position: 'absolute' }} aria-hidden="true">
            <HDim x1={tx} x2={tx + tw} y={oy - 16} from={oy} label={<U v={`${m.w} × ${m.h}`} u="px" />} />
            <VDim y1={oy} y2={oy + th} x={tx + tw + 16} from={tx + tw} label={<U v={m.h} u="px" />} />
            <HDim x1={tx + m.gap * KS} x2={tx + m.gap * KS + kd} y={by} from={oy + th} label={<U v={m.kw} u="px" />} below />
            <HDim x1={tx} x2={tx + m.gap * KS} y={by} from={oy + th} hide />
            <text x={tx + (m.gap * KS) / 2} y={by + 14} textAnchor="middle" {...stylex.props(d.text)}>
              {m.gap}
            </text>
            {/* where the knob stops when on, and how far past it the spring carries it */}
            <circle cx={stopX + kd / 2} cy={oy + th / 2} r={kd / 2} {...stylex.props(d.ghost)} />
            {past > 0.05 && (
              <>
                <path d={`M${stopX + kd + past * KS} ${oy + th / 2 - 8}V${oy + th / 2 + 8}`} {...stylex.props(d.ink)} />
                <HDim x1={stopX + kd} x2={stopX + kd + past * KS} y={by} from={oy + th} label={<U v={`+${f1(past)}`} u="px" />} below />
              </>
            )}
          </svg>
        )}
      </div>
      {m?.ease && (
        <svg viewBox={`0 0 ${PW} 96`} {...stylex.props(d.svg)} style={{ marginInline: 'auto', marginBlockStart: 8, maxWidth: 320 }} role="img" aria-label={`Knob easing, ${Math.round(m.dur)} milliseconds, passes the stop by ${f1(past)} pixels`}>
          <path d={`M4 ${py(0)}H${PW - 4}`} {...stylex.props(d.faint)} />
          <path d={`M4 ${py(1)}H${PW - 4}`} {...stylex.props(d.dash)} />
          <path d={path} {...stylex.props(d.ink)} />
          <circle cx={px(peakAt)} cy={py(peak)} r={3} {...stylex.props(d.inkFill)} />
          <text x={4} y={py(0) + 14} {...stylex.props(d.text, d.mono)}>
            0
          </text>
          <text x={PW - 4} y={py(0) + 14} textAnchor="end" {...stylex.props(d.text, d.mono)}>
            <U v={Math.round(m.dur)} u="ms" />
          </text>
          <text x={4} y={11} {...stylex.props(d.num, d.mono)}>
            <U v={Math.round(m.dur)} u="ms" /> · past the stop <U v={f1(past)} u="px" />
          </text>
        </svg>
      )}
      <div {...stylex.props(s.chips)} style={{ justifyContent: 'center' }}>
        <Chip k="ease" v={tail('--oniva-motion-ease-spring', 'motion-ease')} />
        <Chip k="duration" v={tail('--oniva-motion-dur-slow', 'motion-dur')} />
        {m?.reduced && <Chip k="reduced motion" v="read from tokens" />}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- 02 Button

interface ButtonRead {
  w: number;
  h: number;
  r: number;
}
const KB = 2.4;

function ButtonDetail({ vars }: { vars: Vars | null }) {
  const stage = useRef<HTMLDivElement>(null);
  const [m, setM] = useState<ButtonRead | null>(null);
  useLayoutEffect(() => {
    const b = stage.current?.querySelector('button');
    if (!b || !vars) return;
    setM({ w: b.offsetWidth, h: b.offsetHeight, r: parseFloat(getComputedStyle(b).borderTopLeftRadius) });
  }, [vars]);
  const k = m ? Math.min(KB, 210 / m.w) : KB;
  const ox = 24;
  const y1 = 34;
  const w = (m?.w ?? 0) * k;
  const h = (m?.h ?? 0) * k;
  const y2 = y1 + h + 44;
  const H = y2 + h + 28;
  const press = num(vars?.['--oniva-motion-press-scale']);
  const pressDur = vars ? durMs(vars, '--oniva-motion-dur-press') : 0;
  const rTok = vars && m ? craft.tokens.radius.find((n) => num(vars[n]) === m.r) : undefined;
  return (
    <div {...stylex.props(s.stage)}>
      <div {...stylex.props(s.plot)} ref={stage} style={{ height: H }}>
        <div style={{ left: ox, position: 'absolute', top: y1, transform: `scale(${k})`, transformOrigin: '0 0' }}>
          <Button>Continue</Button>
        </div>
        {m && press > 0 && (
          <div aria-hidden="true" inert style={{ height: m.h, left: ox + (w * (1 - press)) / 2, pointerEvents: 'none', position: 'absolute', top: y2 + (h * (1 - press)) / 2, transform: `scale(${k * press})`, transformOrigin: '0 0', width: m.w }}>
            <Button style={{ pointerEvents: 'none' }}>
              Continue
            </Button>
          </div>
        )}
        {m && (
          <svg viewBox={`0 0 320 ${H}`} {...stylex.props(d.svg)} style={{ inset: 0, pointerEvents: 'none', position: 'absolute' }} aria-hidden="true">
            <HDim x1={ox} x2={ox + w} y={y1 - 16} from={y1} label={<U v={m.w} u="px" />} />
            <VDim y1={y1} y2={y1 + h} x={ox + w + 16} from={ox + w} label={<U v={m.h} u="px" />} />
            <text x={ox} y={y1 + h + 18} {...stylex.props(d.text, d.mono)}>
              rest
            </text>
            <rect x={ox} y={y2} width={w} height={h} rx={m.r * k} {...stylex.props(d.ghost)} />
            <text x={ox} y={y2 + h + 18} {...stylex.props(d.text, d.mono)}>
              pressed
            </text>
            <text x={ox + w + 12} y={y2 + h / 2 - 2} {...stylex.props(d.num, d.mono)}>
              ×{press}
            </text>
            <text x={ox + w + 12} y={y2 + h / 2 + 12} {...stylex.props(d.text, d.mono)}>
              <U v={Math.round(pressDur)} u="ms" />
            </text>
          </svg>
        )}
      </div>
      <div {...stylex.props(s.chips)} style={{ justifyContent: 'center' }}>
        <Chip k="radius" v={rTok ? `${tail(rTok, 'radius')} · ${m?.r}px` : `${m?.r ?? 0}px`} />
        <Chip k="press" v="--oniva-motion-press-scale" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- 03 Depth

const LEVELS: { name: string; token?: string; sx: stylex.StyleXStyles; note: string; example: string }[] = [
  { name: 'Flat', sx: s.tFlat, note: 'hairline only', example: 'Card' },
  { name: 'Recessed', token: '--oniva-elevation-recessed', sx: s.tRecessed, note: 'holds something', example: 'Input' },
  { name: 'Raised', token: '--oniva-elevation-raised', sx: s.tRaised, note: 'you grab it', example: 'Knob' },
  { name: 'Floating', token: '--oniva-elevation-floating', sx: s.tFloating, note: 'its own layer', example: 'Menu' },
  { name: 'Overlay', token: '--oniva-elevation-overlay', sx: s.tOverlay, note: 'with a scrim', example: 'Dialog' },
];

function DepthDetail() {
  return (
    <div {...stylex.props(s.tray)}>
      {LEVELS.map((l) => (
        <div key={l.name} {...stylex.props(s.level)}>
          <div data-tile {...stylex.props(s.tile, l.sx)}>
            {l.example}
          </div>
          <div>
            <p {...stylex.props(s.lvlName)}>{l.name}</p>
            <p {...stylex.props(s.lvlTok)}>{l.token ? tail(l.token, 'elevation').replace(/^/, 'elevation-') : 'no shadow token'}</p>
            <p {...stylex.props(s.lvlTok)}>{l.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- 04 Type, 05 Space

function TypeDetail({ vars }: { vars: Vars | null }) {
  const sizes = craft.tokens.fontSize;
  return (
    <div {...stylex.props(s.stage)}>
      <div {...stylex.props(s.typeRow)}>
        {sizes.map((n) => {
          const step = n.replace('--oniva-font-size-', '');
          const lh = vars?.[`--oniva-font-lh-${step}`];
          return (
            <div key={n} {...stylex.props(s.glyph)}>
              <span {...stylex.props(s.aa)} style={{ fontSize: `var(${n})` }} aria-hidden="true">
                Aa
              </span>
              <span {...stylex.props(s.cap)}>
                {num(vars?.[n])}
                <span>/{num(lh)}</span>
              </span>
            </div>
          );
        })}
      </div>
      <div {...stylex.props(s.chips)}>
        <Chip k="sizes" v={sizes.length} />
        <Chip k="range" v={`${num(vars?.[sizes[0]!])} to ${num(vars?.[sizes[sizes.length - 1]!])}px`} />
        <Chip k="reads" v="size / line-height" />
      </div>
    </div>
  );
}

function SpaceDetail({ vars }: { vars: Vars | null }) {
  const steps = craft.tokens.space.filter((n) => num(vars?.[n]) > 0 || !vars);
  return (
    <div {...stylex.props(s.stage)}>
      <ul {...stylex.props(s.spaceGrid)} style={{ gridAutoFlow: 'column', gridTemplateRows: `repeat(${Math.ceil(steps.length / 2)}, auto)` }}>
        {steps.map((n) => (
          <li key={n} {...stylex.props(s.spaceRow)}>
            <span {...stylex.props(s.cap)}>{tail(n, 'space')}</span>
            <span {...stylex.props(s.bar)} style={{ width: num(vars?.[n]) }} />
          </li>
        ))}
      </ul>
      <div {...stylex.props(s.chips)}>
        <Chip k="steps" v={steps.length} />
        <Chip k="bar" v="width = token value" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- 06 Ramp

function RampDetail({ vars }: { vars: Vars | null }) {
  const [rows, setRows] = useState<{ n: string; r: number; mark: string }[]>([]);
  const [pairs, setPairs] = useState<{ k: string; r: number; min: number }[]>([]);
  useLayoutEffect(() => {
    if (!vars) return;
    const surface = vars['--oniva-color-surface']!;
    const solid = vars['--oniva-accent-solid']!;
    const text = vars['--oniva-color-accent-text']!;
    setRows(
      craft.tokens.ramp.map((n) => ({
        n: tail(n, 'accent'),
        r: ratio(vars[n]!, surface),
        mark: sameColour(vars[n]!, solid) ? 'solid' : sameColour(vars[n]!, text) ? 'text' : '',
      })),
    );
    setPairs([
      { k: 'accent-fg on accent-solid', r: ratio(vars['--oniva-color-accent-fg']!, solid), min: 4.5 },
      { k: 'accent-text on surface', r: ratio(text, surface), min: 4.5 },
      { k: 'accent-soft-fg on accent-soft', r: ratio(vars['--oniva-color-accent-soft-fg']!, vars['--oniva-color-accent-soft']!), min: 4.5 },
    ]);
  }, [vars]);
  return (
    <div {...stylex.props(s.stage)}>
      <ul {...stylex.props(s.ramp)}>
        {craft.tokens.ramp.map((n, i) => {
          const row = rows[i];
          return (
            <li key={n} {...stylex.props(s.step)}>
              <span {...stylex.props(s.sw)} style={{ backgroundColor: `var(${n})` }} />
              <span {...stylex.props(s.stepNo)}>{tail(n, 'accent')}</span>
              <span {...stylex.props(s.stepRatio)} style={{ color: row && row.r >= 4.5 ? 'var(--oniva-color-text)' : 'var(--oniva-color-text-muted)', fontWeight: row && row.r >= 4.5 ? 600 : 400 }}>
                {row ? f1(row.r) : ''}
              </span>
              <span {...stylex.props(s.mark)}>{row?.mark}</span>
            </li>
          );
        })}
      </ul>
      <p {...stylex.props(s.legend)}>Each step against the surface. Bold figures pass 4.5:1 for text.</p>
      <div {...stylex.props(s.chips)}>
        {pairs.map((p) => (
          <Chip key={p.k} k={p.k} v={`${fmtRatio(p.r)}:1`} tone={p.r >= p.min ? 'pass' : 'fail'} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- section

export function Foundations({ vars }: { vars: Vars | null }) {
  return (
    <section {...stylex.props(ui.wrap, ui.section)} aria-labelledby="foundations-title" style={{ paddingBlockStart: 0 }}>
      <InView preset="slide">
        <p {...stylex.props(ui.eyebrow)}>The foundations</p>
        <h2 id="foundations-title" {...stylex.props(ui.h2)}>
          Measured on the real thing.
        </h2>
        <p {...stylex.props(ui.lead)}>
          These are the components on this page, read as they render. Change the accent or the theme and every figure re-reads.
        </p>
      </InView>
      <ol {...stylex.props(s.grid)}>
        <Cell n="01" title="A switch, to the pixel" body="Track, knob and gap come from the DOM. The curve is the knob's own timing function, and it runs past its stop on purpose.">
          <SwitchDetail vars={vars} />
        </Cell>
        <Cell n="02" title="A button, at rest and pressed" body="Height and radius are measured. The pressed state is the real press-scale token, and it flattens the shadow instead of adding one.">
          <ButtonDetail vars={vars} />
        </Cell>
        <Cell wide n="03" title="Five levels of depth" body="Each level means one thing. Most of a screen is flat, and only what you can pick up is raised.">
          <DepthDetail />
        </Cell>
        <Cell n="04" title="Type" body="One scale, each size paired with its own line height.">
          <TypeDetail vars={vars} />
        </Cell>
        <Cell n="05" title="Space" body="A 4px rhythm with a few fine steps. Pick the token, never the number.">
          <SpaceDetail vars={vars} />
        </Cell>
        <Cell wide n="06" title="Accent, with its ratios" body="Eleven steps per accent. The solid and the text step are picked so the pairs below pass in every accent and both themes.">
          <RampDetail vars={vars} />
        </Cell>
      </ol>
    </section>
  );
}
