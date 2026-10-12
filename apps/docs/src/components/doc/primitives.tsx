import * as stylex from '@stylexjs/stylex';
import { Check, Copy, Link2, X } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Input, Kbd, SegmentedControl, SegmentedControlItem, Select, SelectItem, Switch, Tag, TagGroup } from 'oniva-ui';
import { accent } from '@oniva-tokens/accent.stylex';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';
import { CodeBlock } from '../CodeBlock';
import { getDemo } from '../../demos';
import type { AnatomyPart, ControlDef, DocPage, DoDontItem, PlayProps, PropDef, RuleItem } from '../../content/types';

const s = stylex.create({
  h2: {
    fontSize: font['--oniva-font-size-24'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: '-0.015em',
    lineHeight: 1.2,
    margin: '72px 0 12px',
    scrollMarginTop: 72,
  },
  intro: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-16'], lineHeight: 1.6, margin: '0 0 28px', maxWidth: 680, textWrap: 'pretty' },
  meta: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, margin: '4px 0 0' },
  pill: {
    alignItems: 'center', appearance: 'none', backgroundColor: colors['--oniva-color-surface-inset'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-lg'], borderStyle: 'solid', borderWidth: 1,
    color: colors['--oniva-color-text'], display: 'inline-flex', fontFamily: 'inherit', fontSize: font['--oniva-font-size-14'], gap: 8, height: 36, paddingInline: 12, textDecoration: 'none',
  },
  pillBtn: {
    cursor: 'pointer',
    backgroundColor: { default: colors['--oniva-color-surface-inset'], ':hover': colors['--oniva-color-surface-inset-hover'] },
    outlineColor: colors['--oniva-color-focus-ring'], outlineOffset: 2, outlineStyle: { default: 'none', ':focus-visible': 'solid' }, outlineWidth: 2,
  },
  monoPill: { fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-13'] },
  dot: { borderRadius: radius['--oniva-radius-full'], height: 8, width: 8 },
  dotStable: { backgroundColor: colors['--oniva-color-success-solid'] },
  dotBeta: { backgroundColor: colors['--oniva-color-warning-solid'] },
  dotNew: { backgroundColor: accent['--oniva-accent-500'] },
  stage: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    backgroundImage: `radial-gradient(${colors['--oniva-color-border']} 1px, transparent 1px)`,
    backgroundSize: '16px 16px', borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-xxl'], borderStyle: 'solid', borderWidth: 1,
    overflow: 'hidden', position: 'relative',
  },
  stageInner: { alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: 320, padding: '48px 64px' },
  // Stage always gets the full content width (wide components were clipped next to a side legend); legend flows below.
  anatomyGrid: { display: 'flex', flexDirection: 'column', gap: 28 },
  legend: { columnGap: 32, display: 'grid', gridTemplateColumns: { default: 'minmax(0, 1fr)', '@media (min-width: 720px)': 'repeat(2, minmax(0, 1fr))' }, listStyle: 'none', margin: 0, padding: 0, rowGap: 4 },
  legendItem: {
    alignItems: 'flex-start', borderRadius: radius['--oniva-radius-lg'], display: 'flex', gap: 12, padding: '8px 10px', margin: '0 -10px', textAlign: 'start',
    outlineColor: colors['--oniva-color-focus-ring'], outlineStyle: { default: 'none', ':focus-visible': 'solid' }, outlineWidth: 2,
  },
  legendOn: { backgroundColor: colors['--oniva-color-surface-inset'] },
  num: {
    alignItems: 'center', backgroundColor: accent['--oniva-accent-500'], borderColor: colors['--oniva-color-bg'], borderRadius: radius['--oniva-radius-full'], borderStyle: 'solid', borderWidth: 2, boxSizing: 'content-box', color: colors['--oniva-color-accent-fg'],
    display: 'inline-flex', flexShrink: 0, fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-semibold'], height: 22, justifyContent: 'center', width: 22,
  },
  marker: { cursor: 'default', position: 'absolute', transform: 'translate(-50%, -50%)', transitionDuration: '120ms', transitionProperty: 'transform', zIndex: 2 },
  markerOn: { transform: 'translate(-50%, -50%) scale(1.18)' },
  leader: { backgroundColor: colors['--oniva-color-text-subtle'], height: 1, opacity: 0.55, position: 'absolute', transformOrigin: 'left center', zIndex: 1 },
  leaderOn: { backgroundColor: accent['--oniva-accent-500'], opacity: 1 },
  leaderEnd: { backgroundColor: colors['--oniva-color-text-subtle'], borderRadius: radius['--oniva-radius-full'], height: 5, position: 'absolute', transform: 'translate(-50%, -50%)', width: 5, zIndex: 1 },
  ring: {
    borderColor: accent['--oniva-accent-500'], borderRadius: radius['--oniva-radius-md'], borderStyle: 'solid', borderWidth: 2, pointerEvents: 'none', position: 'absolute', transitionDuration: '120ms', transitionProperty: 'opacity', zIndex: 1,
  },
  partName: { color: colors['--oniva-color-text'], display: 'block', fontSize: 15, fontWeight: font['--oniva-font-weight-semibold'], lineHeight: 1.35 },
  partDesc: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'], lineHeight: 1.5, margin: '2px 0 0' },
  cards2: { display: 'grid', gap: 16, gridTemplateColumns: { default: 'minmax(0, 1fr)', '@media (min-width: 700px)': 'repeat(2, minmax(0, 1fr))' } },
  cards3: { display: 'grid', gap: 16, gridTemplateColumns: { default: 'minmax(0, 1fr)', '@media (min-width: 700px)': 'repeat(3, minmax(0, 1fr))' } },
  cardsAuto: { display: 'grid', gap: 16, gridTemplateColumns: { default: 'minmax(0, 1fr)', '@media (min-width: 700px)': 'repeat(auto-fit, minmax(240px, 1fr))' } },
  card: { backgroundColor: colors['--oniva-color-surface'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-xxl'], borderStyle: 'solid', borderWidth: 1, minWidth: 0, padding: 24 },
  cardHead: { alignItems: 'center', display: 'flex', gap: 10, margin: '0 0 14px' },
  cardTitle: { fontSize: font['--oniva-font-size-16'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  icoGood: { alignItems: 'center', backgroundColor: colors['--oniva-color-success-bg'], borderRadius: radius['--oniva-radius-full'], color: colors['--oniva-color-success-fg'], display: 'inline-flex', flexShrink: 0, height: 22, justifyContent: 'center', width: 22 },
  icoBad: { alignItems: 'center', backgroundColor: colors['--oniva-color-danger-bg'], borderRadius: radius['--oniva-radius-full'], color: colors['--oniva-color-danger-fg'], display: 'inline-flex', flexShrink: 0, height: 22, justifyContent: 'center', width: 22 },
  list: { color: colors['--oniva-color-text-muted'], display: 'flex', flexDirection: 'column', fontSize: 15, gap: 10, lineHeight: 1.5, margin: 0, paddingInlineStart: 20 },
  ruleNum: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface-tertiary'], borderRadius: radius['--oniva-radius-md'], display: 'inline-flex', fontSize: font['--oniva-font-size-14'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-medium'], height: 30, justifyContent: 'center', marginBlockEnd: 20, width: 30 },
  ruleTitle: { fontSize: font['--oniva-font-size-16'], fontWeight: font['--oniva-font-weight-semibold'], lineHeight: 1.35, margin: '0 0 8px' },
  ruleBody: { color: colors['--oniva-color-text-muted'], fontSize: 15, lineHeight: 1.55, margin: 0, textWrap: 'pretty' },
  table: { borderCollapse: 'collapse', fontSize: font['--oniva-font-size-14'], width: '100%' },
  th: { borderBlockEndColor: colors['--oniva-color-border'], borderBlockEndStyle: 'solid', borderBlockEndWidth: 1, color: colors['--oniva-color-text-subtle'], fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-medium'], letterSpacing: '0.1em', padding: '10px 16px 10px 0', textAlign: 'start', textTransform: 'uppercase' },
  td: { borderBlockEndColor: colors['--oniva-color-border'], borderBlockEndStyle: 'solid', borderBlockEndWidth: 1, color: colors['--oniva-color-text-muted'], lineHeight: 1.5, padding: '14px 16px 14px 0', verticalAlign: 'top' },
  tdName: { color: colors['--oniva-color-text'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-13'], whiteSpace: 'nowrap' },
  mono: { fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-13'] },
  scroll: { overflowX: 'auto' },
  play: {
    borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-xxl'], borderStyle: 'solid', borderWidth: 1, display: 'grid', gridTemplateColumns: { default: 'minmax(0, 1fr)', '@media (min-width: 900px)': 'minmax(0, 1fr) 320px' }, overflow: 'hidden',
  },
  // Interactive, so never scaled: wide components scroll; 'safe center' keeps the start edge reachable.
  playStage: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface-inset'], backgroundImage: `radial-gradient(${colors['--oniva-color-border']} 1px, transparent 1px)`, backgroundSize: '16px 16px', display: 'flex', justifyContent: 'safe center', minHeight: 420, minWidth: 0, overflowX: 'auto', overflowY: 'hidden', padding: 40 },
  panel: { backgroundColor: colors['--oniva-color-surface'], borderBlockStartColor: colors['--oniva-color-border'], borderBlockStartStyle: 'solid', borderBlockStartWidth: { default: 1, '@media (min-width: 900px)': 0 }, borderInlineStartColor: colors['--oniva-color-border'], borderInlineStartStyle: 'solid', borderInlineStartWidth: { default: 0, '@media (min-width: 900px)': 1 }, display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0, padding: 24 },
  group: { display: 'flex', flexDirection: 'column', gap: 12 },
  eyebrow: { color: colors['--oniva-color-text-subtle'], fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-medium'], letterSpacing: '0.12em', margin: 0, textTransform: 'uppercase' },
  ctlLabel: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  ctl: { display: 'flex', flexDirection: 'column', gap: 8 },
  switchRow: { alignItems: 'center', display: 'flex', fontSize: 15, justifyContent: 'space-between' },
  event: { backgroundColor: colors['--oniva-color-surface-inset'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-lg'], borderStyle: 'solid', borderWidth: 1, color: colors['--oniva-color-text-muted'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-13'], overflowWrap: 'anywhere', padding: '12px 14px' },
  codeWrap: { backgroundColor: colors['--oniva-color-surface-inner'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-xl'], borderStyle: 'solid', borderWidth: 1, marginBlockStart: 16, position: 'relative' },
  codePre: { color: colors['--oniva-color-text'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-14'], lineHeight: 1.6, margin: 0, overflowX: 'auto', padding: '20px 112px 20px 24px' },
  copyBtn: { insetBlockStart: 12, insetInlineEnd: 12, position: 'absolute' },
  stageGrow: { display: 'flex', flexDirection: 'column', flexGrow: 1 },
  statesGrid: { display: 'grid', gap: 24, gridTemplateColumns: { default: 'minmax(0, 1fr)', '@media (min-width: 900px)': 'repeat(2, minmax(0, 1fr))' } },
  stateCell: { display: 'flex', flexDirection: 'column', gap: 12, margin: 0, minWidth: 0 },
  stateStage: { alignItems: 'center', display: 'flex', flexGrow: 1, justifyContent: 'center', minHeight: 140, overflow: 'hidden', padding: 24 },
  caption: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'], lineHeight: 1.5, margin: '2px 0 0' },
  relCard: {
    backgroundColor: { default: colors['--oniva-color-surface'], ':hover': colors['--oniva-color-surface-hover'] }, borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-xxl'], borderStyle: 'solid', borderWidth: 1, color: colors['--oniva-color-text'],
    display: 'block', padding: 20, textDecoration: 'none',
  },
});

export function SectionH2({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id} {...stylex.props(s.h2)}>{children}</h2>;
}
export const Intro = ({ children }: { children: ReactNode }) => <p {...stylex.props(s.intro)}>{children}</p>;

function useCopy() {
  const [done, setDone] = useState(false);
  const copy = useCallback((text: string) => {
    void navigator.clipboard?.writeText(text).catch(() => undefined);
    setDone(true);
    setTimeout(() => setDone(false), 1400);
  }, []);
  return [done, copy] as const;
}

export function MetaStrip({ page }: { page: DocPage }) {
  const [done, copy] = useCopy();
  const [linked, copyLink] = useCopy();
  const dot = page.status === 'Stable' ? s.dotStable : page.status === 'Beta' ? s.dotBeta : s.dotNew;
  return (
    <div {...stylex.props(s.meta)} data-testid="meta-strip">
      <span {...stylex.props(s.pill)}><span {...stylex.props(s.dot, dot)} aria-hidden="true" />{page.status}</span>
      <span {...stylex.props(s.pill)}>v{page.version}</span>
      <button type="button" {...stylex.props(s.pill, s.pillBtn, s.monoPill)} aria-label={`Copy import: import { ${page.importName} } from 'oniva-ui'`} onClick={() => copy(`import { ${page.importName} } from 'oniva-ui';`)}>
        {`<${page.importName}>`} {done ? <Check size={14} aria-hidden="true" /> : null}
      </button>
      <a {...stylex.props(s.pill, s.pillBtn)} href={`https://github.com/supremeb/oniva-ui/tree/main/packages/oniva-ui/src/${page.sourcePath}`} target="_blank" rel="noreferrer">Source ↗</a>
      <button type="button" {...stylex.props(s.pill, s.pillBtn)} onClick={() => copyLink(window.location.href)}>
        {linked ? <Check size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />} {linked ? 'Copied' : 'Copy link'}
      </button>
    </div>
  );
}

/* ----------------------------------- FitBox ----------------------------------- */

/**
 * Renders a locked (inert) example at its natural size and scales it down to fit the available width, so wide
 * components (tables, boards, sidebars) are always fully visible. Transforms keep getBoundingClientRect accurate,
 * so anatomy markers still land on the scaled parts. Styles are applied imperatively to avoid a render loop.
 */
export function FitBox({ children, min = 0.4, innerRef, onFit }: { children: ReactNode; min?: number; innerRef?: React.RefObject<HTMLDivElement | null>; onFit?: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const own = useRef<HTMLDivElement>(null);
  const rt = innerRef ?? own;
  const last = useRef('');
  const fit = useCallback(() => {
    const b = box.current;
    const r = rt.current;
    if (!b || !r) return;
    r.style.transform = '';
    r.style.width = '';
    r.style.maxWidth = '100%';
    b.style.height = '';
    const avail = b.clientWidth;
    const child = r.firstElementChild as HTMLElement | null;
    const natural = Math.max(r.scrollWidth, child?.scrollWidth ?? 0);
    if (avail > 0 && natural > avail + 1) {
      const k = Math.max(min, avail / natural);
      r.style.maxWidth = 'none';
      r.style.width = `${natural}px`;
      r.style.transform = `scale(${k})`;
      b.style.height = `${r.offsetHeight * k}px`;
    }
    // Only notify when the fit actually changed, so observers can't ping-pong.
    const sig = `${avail}|${r.style.width}|${r.style.transform}|${b.style.height}`;
    if (sig !== last.current) { last.current = sig; onFit?.(); }
  }, [min, onFit, rt]);
  useLayoutEffect(() => { fit(); }, [fit]);
  useEffect(() => {
    let raf = 0;
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); };
    const ro = new ResizeObserver(schedule);
    if (box.current?.parentElement) ro.observe(box.current.parentElement);
    const child = rt.current?.firstElementChild;
    if (child) ro.observe(child);
    const t = window.setTimeout(schedule, 300);
    return () => { ro.disconnect(); clearTimeout(t); cancelAnimationFrame(raf); };
  }, [fit, rt]);
  return (
    <div ref={box} style={{ display: 'flex', justifyContent: 'center', minWidth: 0, width: '100%' }}>
      <div ref={rt} inert style={{ flexShrink: 0, maxWidth: '100%', transformOrigin: 'top center' }}>{children}</div>
    </div>
  );
}

/* ---------------------------------- Anatomy ---------------------------------- */

interface Placed { x: number; y: number; ex: number; ey: number; box: { l: number; t: number; w: number; h: number } | null }

export function AnatomyStage({ intro, Render, parts }: { intro: string; Render: React.ComponentType; parts: AnatomyPart[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [hot, setHot] = useState<number | null>(null);

  const measure = useCallback(() => {
    const st = stage.current;
    const rt = root.current;
    if (!st || !rt) return;
    const sr = st.getBoundingClientRect();
    const cr = (rt.firstElementChild ?? rt).getBoundingClientRect();
    const cx = cr.left + cr.width / 2 - sr.left;
    type Raw = { side: 'left' | 'right'; midY: number; l: number; t: number; w: number; h: number } | null;
    const raws: Raw[] = parts.map((p) => {
      const el = rt.querySelector(p.selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const l = r.left - sr.left;
      const t = r.top - sr.top;
      const isContainer = r.width >= cr.width * 0.95 && r.height >= cr.height * 0.9;
      return { side: isContainer ? 'left' : l + r.width / 2 < cx ? 'left' : 'right', midY: isContainer ? t + 14 : t + r.height / 2, l, t, w: r.width, h: r.height };
    });
    // Per side, order markers by target height so leaders never cross, then keep them 32px apart.
    const ys = new Map<number, number>();
    for (const side of ['left', 'right'] as const) {
      const idx = raws.map((r, i) => (r && r.side === side ? i : -1)).filter((i) => i >= 0).sort((a, b) => raws[a]!.midY - raws[b]!.midY);
      let prev = -Infinity;
      for (const i of idx) { const y = Math.max(raws[i]!.midY, prev + 32); ys.set(i, y); prev = y; }
    }
    const next = parts.map((p, i): Placed => {
      const r = raws[i];
      if (!r) {
        const f = p.fallback ?? { x: 50, y: 50 };
        const x = (f.x / 100) * sr.width;
        const y = (f.y / 100) * sr.height;
        return { x: x - 30, y, ex: x, ey: y, box: null };
      }
      const mx = r.side === 'left' ? cr.left - sr.left - 44 : cr.right - sr.left + 44;
      return { x: mx, y: ys.get(i)!, ex: r.side === 'left' ? r.l : r.l + r.w, ey: r.midY, box: { l: r.l, t: r.t, w: r.w, h: r.h } };
    });
    setPlaced((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, [parts]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);
  useEffect(() => {
    let raf = 0;
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    const ro = new ResizeObserver(schedule);
    if (stage.current) ro.observe(stage.current);
    // FitBox restyles the root itself; only content changes inside it should trigger a re-measure.
    const mo = new MutationObserver((recs) => { if (recs.some((r) => r.target !== root.current)) schedule(); });
    if (root.current) mo.observe(root.current, { subtree: true, childList: true, attributes: true });
    // theme / accent switches change metrics after transitions
    const t = window.setTimeout(schedule, 300);
    return () => { ro.disconnect(); mo.disconnect(); clearTimeout(t); cancelAnimationFrame(raf); };
  }, [measure]);

  return (
    <div>
      <Intro>{intro}</Intro>
      <div {...stylex.props(s.anatomyGrid)}>
        <div ref={stage} {...stylex.props(s.stage)} data-testid="anatomy-stage">
          <div {...stylex.props(s.stageInner)}>
            <FitBox innerRef={root} onFit={measure}>
              <Render />
            </FitBox>
          </div>
          {placed.map((p, i) => {
            const len = Math.hypot(p.ex - p.x, p.ey - p.y);
            const ang = Math.atan2(p.ey - p.y, p.ex - p.x);
            return (
              <div key={parts[i]!.name} aria-hidden="true">
                {p.box ? (
                  <span {...stylex.props(s.ring)} style={{ left: p.box.l - 2, top: p.box.t - 2, width: p.box.w + 4, height: p.box.h + 4, opacity: hot === i ? 1 : 0 }} />
                ) : null}
                <span {...stylex.props(s.leader, hot === i && s.leaderOn)} style={{ left: p.x, top: p.y, width: len, transform: `rotate(${ang}rad)` }} />
                <span {...stylex.props(s.leaderEnd)} style={{ left: p.ex, top: p.ey }} />
                <span {...stylex.props(s.marker, hot === i && s.markerOn)} style={{ left: p.x, top: p.y }} onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)}>
                  <span {...stylex.props(s.num)}>{i + 1}</span>
                </span>
              </div>
            );
          })}
        </div>
        <ol {...stylex.props(s.legend)} aria-label="Parts">
          {parts.map((p, i) => (
            <li key={p.name}>
              <div tabIndex={0} {...stylex.props(s.legendItem, hot === i && s.legendOn)} onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(i)} onBlur={() => setHot(null)}>
                <span {...stylex.props(s.num)} aria-hidden="true">{i + 1}</span>
                <span style={{ minWidth: 0 }}>
                  <span {...stylex.props(s.partName)}>{p.name}</span>
                  <p {...stylex.props(s.partDesc)}>{p.description}</p>
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/* ----------------------------------- Usage ----------------------------------- */

export function UsageCards({ usage }: { usage: DocPage['usage'] }) {
  return (
    <div {...stylex.props(s.cards2)}>
      <div {...stylex.props(s.card)}>
        <div {...stylex.props(s.cardHead)}><span {...stylex.props(s.icoGood)}><Check size={14} aria-hidden="true" /></span><h3 {...stylex.props(s.cardTitle)}>Use it for</h3></div>
        <ul {...stylex.props(s.list)}>{usage.use.map((u) => <li key={u}>{u}</li>)}</ul>
      </div>
      <div {...stylex.props(s.card)}>
        <div {...stylex.props(s.cardHead)}><span {...stylex.props(s.icoBad)}><X size={14} aria-hidden="true" /></span><h3 {...stylex.props(s.cardTitle)}>Don’t use it for</h3></div>
        <ul {...stylex.props(s.list)}>
          {usage.avoid.map((a) => (
            <li key={a.text}>
              {a.text}
              {a.instead ? <> Use <Link to={`/components/${a.instead.slug}`}>{a.instead.label}</Link> instead.</> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* --------------------------------- Playground --------------------------------- */

/** Every control gets a value: `initial` first, then a safe fallback. Exported for the content check. */
export function resolveInitial(controls: ControlDef[], initial: PlayProps): PlayProps {
  const out: PlayProps = { ...initial };
  for (const c of controls) {
    if (out[c.key] !== undefined) continue;
    out[c.key] = c.kind === 'toggle' ? false : c.kind === 'number' ? (c.min ?? 0) : c.kind === 'text' ? '' : (c.options[0] ?? '');
  }
  return out;
}

const GROUP_BY_KIND: Record<ControlDef['kind'], string> = { segmented: 'State', select: 'State', text: 'Content', number: 'Content', toggle: 'Options' };

function Control({ c, v, set }: { c: ControlDef; v: string | number | boolean | undefined; set: (v: string | number | boolean) => void }) {
  if (c.kind === 'segmented') {
    return (
      <SegmentedControl size="sm" aria-label={c.label} value={String(v)} onChange={(x) => set(x)}>
        {c.options.map((o) => <SegmentedControlItem key={o} value={o}>{o}</SegmentedControlItem>)}
      </SegmentedControl>
    );
  }
  if (c.kind === 'select') {
    return (
      <Select aria-label={c.label} selectedKey={String(v)} onSelectionChange={(k) => k != null && set(String(k))}>
        {c.options.map((o) => <SelectItem key={o} id={o}>{o}</SelectItem>)}
      </Select>
    );
  }
  if (c.kind === 'text') {
    return (
      <>
        <Input aria-label={c.label} value={String(v ?? '')} onChange={(x) => set(x)} />
        {c.presets ? (
          <TagGroup aria-label={`${c.label} presets`} selectionMode="single" selectedKeys={new Set([String(v)])} onSelectionChange={(keys) => { const k = [...keys][0]; if (k != null) set(String(k)); }}>
            {c.presets.map((p) => <Tag key={p} id={p}>{p}</Tag>)}
          </TagGroup>
        ) : null}
      </>
    );
  }
  if (c.kind === 'number') {
    return <Input aria-label={c.label} type="number" value={String(v ?? 0)} onChange={(x) => set(Number(x))} />;
  }
  return null;
}

export function Playground({ pg }: { pg: DocPage['playground'] }) {
  const [props, setProps] = useState<PlayProps>(() => resolveInitial(pg.controls, pg.initial));
  const [last, setLast] = useState('Nothing yet. Interact with the component.');
  const [done, copy] = useCopy();
  const set = (k: string, v: string | number | boolean) => setProps((p) => ({ ...p, [k]: v }));
  const code = pg.code(props);
  const groups: { name: string; items: ControlDef[] }[] = [];
  for (const c of pg.controls) {
    const name = c.group ?? GROUP_BY_KIND[c.kind];
    const g = groups.find((x) => x.name === name);
    if (g) g.items.push(c); else groups.push({ name, items: [c] });
  }
  const order = ['State', 'Query', 'Content', 'Options'];
  groups.sort((a, b) => (order.indexOf(a.name) + 1 || 9) - (order.indexOf(b.name) + 1 || 9));
  return (
    <div>
      <div {...stylex.props(s.play)}>
        <div {...stylex.props(s.playStage)} data-testid="playground-stage">{pg.render(props, (e) => setLast(e))}</div>
        <div {...stylex.props(s.panel)}>
          {groups.map((g) => (
            <div key={g.name} {...stylex.props(s.group)} role="group" aria-label={g.name}>
              <p {...stylex.props(s.eyebrow)}>{g.name}</p>
              {g.items.map((c) =>
                c.kind === 'toggle' ? (
                  <div key={c.key} {...stylex.props(s.switchRow)}>
                    <span id={`pg-${c.key}`}>{c.label}</span>
                    <Switch aria-labelledby={`pg-${c.key}`} isSelected={Boolean(props[c.key])} onChange={(x) => set(c.key, x)} />
                  </div>
                ) : (
                  <div key={c.key} {...stylex.props(s.ctl)}>
                    {g.items.length > 1 ? <span {...stylex.props(s.ctlLabel)}>{c.label}</span> : null}
                    <Control c={c} v={props[c.key]} set={(v) => set(c.key, v)} />
                  </div>
                ),
              )}
            </div>
          ))}
          <div {...stylex.props(s.group)}>
            <p {...stylex.props(s.eyebrow)}>Last event</p>
            <output {...stylex.props(s.event)} aria-live="polite">{last}</output>
          </div>
        </div>
      </div>
      <div {...stylex.props(s.codeWrap)}>
        <pre {...stylex.props(s.codePre)} tabIndex={0}><code>{code}</code></pre>
        <button type="button" {...stylex.props(s.pill, s.pillBtn, s.copyBtn)} onClick={() => copy(code)}>
          {done ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />} {done ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ States, rules, etc ------------------------------ */

export function StateGallery({ states }: { states: DocPage['states'] }) {
  return (
    <div {...stylex.props(s.statesGrid)}>
      {states.map((st) => (
        <figure key={st.name} {...stylex.props(s.stateCell)}>
          <div {...stylex.props(s.stage, s.stageGrow)}>
            <div {...stylex.props(s.stateStage)}><FitBox min={0.5}><st.Render /></FitBox></div>
          </div>
          <figcaption>
            <span {...stylex.props(s.partName)}>{st.name}</span>
            <p {...stylex.props(s.caption)}>{st.description}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function RuleCards({ items, numbered }: { items: RuleItem[]; numbered?: boolean }) {
  const grid = items.length % 3 === 0 ? s.cards3 : items.length === 2 || items.length === 4 ? s.cards2 : s.cardsAuto;
  return (
    <div {...stylex.props(grid)}>
      {items.map((r, i) => (
        <div key={r.title} {...stylex.props(s.card)}>
          {numbered ? <span {...stylex.props(s.ruleNum)} aria-hidden="true">{i + 1}</span> : null}
          <h3 {...stylex.props(s.ruleTitle)}>{r.title}</h3>
          <div {...stylex.props(s.ruleBody)}>{r.body}</div>
        </div>
      ))}
    </div>
  );
}

export function DoDont({ items }: { items: DoDontItem[] }) {
  return (
    <div {...stylex.props(s.cards2)}>
      {items.map((it) => (
        <div key={it.caption} {...stylex.props(s.card)}>
          <div {...stylex.props(s.cardHead)}>
            <span {...stylex.props(it.kind === 'do' ? s.icoGood : s.icoBad)}>{it.kind === 'do' ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}</span>
            <h3 {...stylex.props(s.cardTitle)}>{it.kind === 'do' ? 'Do' : 'Don’t'}</h3>
          </div>
          {it.example ? <div {...stylex.props(s.stage)} style={{ marginBottom: 16 }}><div {...stylex.props(s.stateStage)}><FitBox min={0.5}><it.example /></FitBox></div></div> : null}
          {it.text ? <p {...stylex.props(s.ruleBody)} style={{ marginBottom: 12 }}>{it.text}</p> : null}
          <p {...stylex.props(s.partName)} style={{ fontWeight: 500 }}>{it.caption}</p>
        </div>
      ))}
    </div>
  );
}

export function PropsTable({ props }: { props: PropDef[] }) {
  return (
    <div {...stylex.props(s.scroll)} tabIndex={0} role="region" aria-label="Props">
      <table {...stylex.props(s.table)}>
        <thead><tr><th {...stylex.props(s.th)}>Prop</th><th {...stylex.props(s.th)}>Type</th><th {...stylex.props(s.th)}>Default</th><th {...stylex.props(s.th)}>Description</th></tr></thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name}>
              <td {...stylex.props(s.td, s.tdName)}>{p.name}</td>
              <td {...stylex.props(s.td, s.mono)}>{p.type}</td>
              <td {...stylex.props(s.td, s.mono)}>{p.default ?? '–'}</td>
              <td {...stylex.props(s.td)}>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function KeyboardTable({ rows }: { rows: DocPage['accessibility']['keyboard'] }) {
  return (
    <div {...stylex.props(s.scroll)}>
      <table {...stylex.props(s.table)}>
        <thead><tr><th {...stylex.props(s.th)} style={{ width: '34%' }}>Keys</th><th {...stylex.props(s.th)}>Action</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.keys.join('+') + r.action}>
              <td {...stylex.props(s.td)}><span style={{ alignItems: 'center', display: 'inline-flex', gap: 6 }}>{r.keys.map((k, i) => <span key={k + i} style={{ alignItems: 'center', display: 'inline-flex', gap: 6 }}>{i > 0 && r.keys.length > 1 && !['↑', '↓', '←', '→'].includes(k) ? <span aria-hidden="true">+</span> : null}<Kbd>{k}</Kbd></span>)}</span></td>
              <td {...stylex.props(s.td)}>{r.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Related({ slugs }: { slugs: string[] }) {
  return (
    <div {...stylex.props(s.cardsAuto)}>
      {slugs.map((slug) => {
        const m = getDemo(slug);
        if (!m) return null;
        return (
          <Link key={slug} to={`/components/${slug}`} {...stylex.props(s.relCard)}>
            <span {...stylex.props(s.partName)}>{m.meta.title}</span>
            <p {...stylex.props(s.caption)}>{m.meta.description}</p>
          </Link>
        );
      })}
    </div>
  );
}

export const docStyles = s;
export { CodeBlock };
