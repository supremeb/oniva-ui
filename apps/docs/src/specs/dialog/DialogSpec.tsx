import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { UNSAFE_PortalProvider } from 'react-aria';
import { Button, Dialog, DialogBody, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Modal } from 'oniva-ui';
import { Callout, Curve, Dim, easeAt, easeWords, firstEasing, type Held, markClass, Moments, Overlay, r1, SpecPage, Timeline, U, useCrisp, useDrawingScale, useTransitionSpec, Ut, within } from '../kit/spec-kit';
import styles from '../kit/spec.module.css';
import type { SpecProps } from '../types';

// Dialog (components/Dialog). Two real keyframe animations run together when it opens: the backdrop (react-aria's
// ModalOverlay, class overlay + overlayEntering: fadeIn, opacity 0 -> 1) and the panel inside it (Modal, modalEntering:
// scaleIn, scale 0.96 -> 1 with opacity 0 -> 1, transform-origin the panel's centre). Everything is read from those two
// running animations; the exit is read from the real exit (opened, closed with the dialog's own X, and read while it
// exits). The sheet variant only exists under a 640px-wide window, so it cannot run in this one: its numbers are read
// from the component's own stylesheet rules for that media query (the CSSOM), not run, and the poster says so.
//
// Driver notes (references/drivers.md): the dialog is portalled into a host inside the subject (UNSAFE_PortalProvider) and
// its fixed backdrop is made absolute there; the subject is scaled with a transform in a sized box; the library renders
// it modal, so the page is handed back (aria-hidden/inert undone, focus returned to where it was, outside presses kept
// off the dialog).

const FRACTIONS = [0, 0.12, 1] as const; // closed (first frame), early in the enter where scale and scrim both show, settled
// The subject: the page under the backdrop. The panel is 480 wide (size md) and sits in the backdrop's 16px padding.
const W = 560;
const H = 270;
// 640: the component's own mobile breakpoint (`MOBILE` in Dialog.tsx), a source constant; the CSSOM rules are matched on it.
const MOBILE_PX = 640;

type Fade = { duration: number; easing: string };
type Exit = Fade & { scaleTo: number };
type Sheet = { inMs: number; inEasing: string; outMs: number; outEasing: string; fromY: string };
type Base = {
  panelX: number; panelY: number; panelW: number; panelH: number; originX: number; originY: number;
  scaleFrom: number; scaleTo: number; scrimMax: number; scrim: Fade; exit: Exit; scrimExit: Fade; sheet: Sheet; reducedPanel: string[];
};
type Read = { scale: number; panelOpacity: number; scrimOpacity: number; insetX: number };

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const until = async (test: () => boolean, cap = 1500) => {
  const t0 = performance.now();
  while (!test() && performance.now() - t0 < cap) await frame();
  return test();
};
const scaleOfMatrix = (t: string) => (t && t !== 'none' ? new DOMMatrixReadOnly(t).a : 1);
const scaleIn = (k: Keyframe | ComputedKeyframe) => Number(scaleOfMatrix(String(k.transform ?? 'none')).toFixed(3));
const alphaOf = (c: string) => {
  const m = c.match(/\/\s*([\d.]+)%?\s*\)$/) ?? c.match(/rgba?\([^)]*,\s*([\d.]+)\)$/);
  return m ? Number(m[1]) / (c.match(/\/\s*[\d.]+%/) ? 100 : 1) : 1;
};
const dialogOf = (root: HTMLElement) => root.querySelector<HTMLElement>('[role="dialog"]');
// react-aria's Modal is the dialog's parent, its ModalOverlay (the backdrop) the Modal's
const partsOf = (root: HTMLElement) => {
  const dlg = dialogOf(root);
  const panel = dlg?.parentElement as HTMLElement | null;
  const scrim = panel?.parentElement as HTMLElement | null;
  return panel && scrim ? { panel, scrim } : null;
};

// The sheet variant, read from the component's stylesheet: the rules under the 640px media query that apply to this
// element's classes (StyleX writes one class per property), with their var()s resolved on the element.
function sheetOf(el: HTMLElement) {
  const classes = new Set(el.className.split(/\s+/).filter(Boolean));
  const found: Record<string, string> = {};
  const walk = (rules: CSSRuleList, mobile: boolean) => {
    for (const r of Array.from(rules)) {
      if (r instanceof CSSStyleRule) {
        const cls = r.selectorText.match(/^\.([\w-]+)/)?.[1];
        if (mobile && cls && classes.has(cls)) for (const p of ['animation-name', 'animation-duration', 'animation-timing-function']) { const v = r.style.getPropertyValue(p); if (v) found[p] = v; }
      } else if ('cssRules' in r) {
        const text = 'media' in r ? (r as CSSMediaRule).media.mediaText : '';
        walk((r as CSSGroupingRule).cssRules, mobile || (text.includes(String(MOBILE_PX)) && !text.includes('prefers-reduced-motion')));
      }
    }
  };
  for (const s of Array.from(document.styleSheets)) { try { walk(s.cssRules, false); } catch { /* cross-origin sheet */ } }
  const cs = getComputedStyle(el);
  const resolve = (v: string) => v.replace(/var\((--[\w-]+)\)/g, (_, n: string) => cs.getPropertyValue(n).trim());
  const name = found['animation-name'];
  let keyframes: CSSKeyframesRule | null = null;
  for (const s of Array.from(document.styleSheets)) { try { for (const r of Array.from(s.cssRules)) if (r instanceof CSSKeyframesRule && r.name === name) keyframes = r; } catch { /* skip */ } }
  const ms = (v: string) => parseFloat(v) * (v.trim().endsWith('ms') ? 1 : 1000);
  if (!name || !keyframes || !found['animation-duration'] || !found['animation-timing-function']) return null;
  const stop = (i: number) => Array.from(keyframes!.cssRules)[i] as CSSKeyframeRule;
  const t = (i: number) => stop(i).style.getPropertyValue('transform');
  return { ms: ms(resolve(found['animation-duration'])), easing: firstEasing(resolve(found['animation-timing-function'])), fromY: (t(0) || t(keyframes.cssRules.length - 1)).match(/translate3d\([^,]+,\s*([^,]+),/)?.[1] ?? "" };
}

// What the element animates under reduced motion, read from the stylesheet (this window is not in reduced motion, so
// it cannot run): the keyframes its highest-specificity animation-name rule picks there, and the properties they set.
function reducedOf(el: HTMLElement) {
  const classes = new Set(el.className.split(/\s+/).filter(Boolean));
  const applies = (text: string) => {
    const t = text.trim();
    if (t.includes('prefers-reduced-motion')) return /\bnot\b/.test(t) ? false : true;
    return matchMedia(t).matches;
  };
  let best: { name: string; rank: number } | null = null;
  // (StyleX may nest the media query inside the class rule: the nested rules inherit that rule's class)
  const walk = (rules: CSSRuleList, on: boolean, inherited?: string, inheritedRank = 0) => {
    for (const r of Array.from(rules)) {
      const style = (r as CSSStyleRule).style as CSSStyleDeclaration | undefined;
      if (style) {
        // (a nested declaration block has no selector of its own)
        const sel = (r as CSSStyleRule).selectorText;
        const cls = sel?.match(/^\.([\w-]+)/)?.[1] ?? inherited;
        const rank = sel ? (sel.match(/:not\(/g) ?? []).length : inheritedRank;
        const name = style.getPropertyValue('animation-name');
        if (on && cls && classes.has(cls) && name && (!best || rank >= best.rank)) best = { name, rank };
        const nested = (r as CSSStyleRule).cssRules;
        if (nested?.length) walk(nested, on, cls, rank);
      } else if ('cssRules' in r) walk((r as CSSGroupingRule).cssRules, on && ('media' in r ? applies((r as CSSMediaRule).media.mediaText) : true), inherited, inheritedRank);
    }
  };
  for (const s of Array.from(document.styleSheets)) { try { walk(s.cssRules, true); } catch { /* cross-origin sheet */ } }
  const name = (best as { name: string } | null)?.name;
  const props = new Set<string>();
  if (name && name !== 'none') {
    for (const s of Array.from(document.styleSheets)) {
      try { for (const r of Array.from(s.cssRules)) if (r instanceof CSSKeyframesRule && r.name === name) for (const k of Array.from(r.cssRules)) for (const p of Array.from((k as CSSKeyframeRule).style)) props.add(p); } catch { /* skip */ }
    }
  }
  return Array.from(props);
}

function Drawing({ m, z: Z }: { m: Held<Base, Read>; z: number }) {
  const { ref, snap } = useCrisp();
  const px = m.panelX * Z, py = m.panelY * Z, pw = m.panelW * Z, ph = m.panelH * Z;
  const ox = m.originX * Z, oy = m.originY * Z;
  return (
    <Overlay w={W * Z} h={H * Z} svgRef={ref}>
      {/* the panel's resting box (the held frame is a little smaller while it scales) */}
      <rect x={snap(px, 'x')} y={snap(py, 'y')} width={snap(px + pw, 'x') - snap(px, 'x')} height={snap(py + ph, 'y') - snap(py, 'y')} className={markClass.ghost} data-part="n2" />
      {/* the transform origin: a reference cross at the panel's centre */}
      <g className={markClass.reference} data-part="n2">
        <path d={`M${snap(ox, 'x')} ${oy - 9}V${oy + 9}M${ox - 9} ${snap(oy, 'y')}H${ox + 9}`} />
        <circle cx={snap(ox, 'x')} cy={snap(oy, 'y')} r={5} />
      </g>
      <Dim snap={snap} x1={px} x2={px + pw} y={H * Z + 21} from={py + ph} label={m.panelW} below part="n2" />
      <Callout n={1} x={W * Z - 22} y={30} dir="e" len={34} />
      <Callout n={2} x={px} y={py + ph * 0.3} dir="w" len={Math.max(34, px + 12)} />
      <Callout n={3} x={px + pw} y={py + ph * 0.68} dir="e" len={Math.max(34, (W * Z - px - pw) + 12)} />
      <Callout n={4} x={px} y={py + ph} dir="w" len={px + 34} />
    </Overlay>
  );
}

export function DialogSpec({ theme }: SpecProps) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const scaler = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);
  const Z = useDrawingScale(1);
  const drv = useTransitionSpec<Base, Read>({
    fractions: FRACTIONS,
    setup: async (root, { stale }) => {
      // Start from a closed dialog: a run that finds one still open (a re-run, a hot reload) remounts it first.
      if (dialogOf(root)) {
        setKey((k) => k + 1);
        await frame();
        await frame();
        if (stale()) throw new Error('stale');
      }
      const trigger = root.querySelector<HTMLButtonElement>('[data-dialog-trigger] button')!;
      // 1. Probe the exit: open, wait for the enter to finish, close with the dialog's own X, and read the exiting
      // panel and backdrop at the moment react-aria marks them exiting.
      let exit: Exit | null = null, scrimExit: Fade | null = null, sheet: Sheet | null = null, sheetIn: { ms: number; easing: string; fromY: string } | null = null;
      let enterEasing = '';
      for (let attempt = 0; attempt < 3 && !(exit && scrimExit); attempt++) {
        trigger.click();
        if (!(await until(() => !!partsOf(root)))) throw new Error('dialog did not open');
        const first = partsOf(root)!;
        if (!enterEasing) enterEasing = firstEasing(getComputedStyle(first.panel).animationTimingFunction);
        if (!sheetIn) sheetIn = sheetOf(first.panel);
        const seen = new MutationObserver(() => {
          if (exit || !first.panel.hasAttribute('data-exiting')) return;
          void getComputedStyle(first.panel).opacity;
          const a = first.panel.getAnimations()[0], b = first.scrim.getAnimations()[0];
          if (!a || !b) return;
          const kf = (a.effect as KeyframeEffect).getKeyframes();
          exit = { duration: Math.round(Number(a.effect!.getComputedTiming().duration)), easing: firstEasing(getComputedStyle(first.panel).animationTimingFunction), scaleTo: scaleIn(kf[kf.length - 1]!) };
          scrimExit = { duration: Math.round(Number(b.effect!.getComputedTiming().duration)), easing: firstEasing(getComputedStyle(first.scrim).animationTimingFunction) };
          const out = sheetOf(first.panel);
          if (out && sheetIn) sheet = { inMs: sheetIn.ms, inEasing: sheetIn.easing, outMs: out.ms, outEasing: out.easing, fromY: sheetIn.fromY };
        });
        seen.observe(first.panel, { attributes: true });
        await until(() => !first.panel.hasAttribute('data-entering') || first.panel.hasAttribute('data-exiting'), 1000);
        if (stale()) { seen.disconnect(); throw new Error('stale'); }
        if (first.panel.isConnected && !first.panel.hasAttribute('data-exiting')) {
          root.querySelector<HTMLButtonElement>('button[aria-label="Close"]')?.click();
        }
        await until(() => !!exit || !first.panel.isConnected, 1000);
        seen.disconnect();
        await until(() => !first.panel.isConnected, 1500);
        await frame();
        if (stale()) throw new Error('stale');
      }
      if (!exit || !scrimExit) throw new Error('exit animation not seen');
      if (!sheet) throw new Error('sheet rules not found');
      const exitRead: Exit = exit, scrimExitRead: Fade = scrimExit, sheetRead: Sheet = sheet;
      // 2. The run itself: the component's own trigger opens it.
      return {
        easing: enterEasing,
        trigger: async () => {
          trigger.click();
          await until(() => !!partsOf(root));
        },
        pick: (all) => {
          const p = partsOf(root);
          return all.filter((a) => { const t = (a.effect as KeyframeEffect | null)?.target; return !!p && (t === p.panel || t === p.scrim); });
        },
        base: () => {
          const { panel, scrim } = partsOf(root)!;
          const pa = panel.getAnimations().find((x) => (x.effect as KeyframeEffect | null)?.target === panel);
          const sa = scrim.getAnimations().find((x) => (x.effect as KeyframeEffect | null)?.target === scrim);
          if (!pa || !sa) throw new Error('enter animations not running');
          const kf = (pa.effect as KeyframeEffect).getKeyframes();
          const sk = (sa.effect as KeyframeEffect).getKeyframes();
          // the channels must share one clock: same duration and easing, or the poster shows its error state
          const pe = firstEasing(getComputedStyle(panel).animationTimingFunction), se = firstEasing(getComputedStyle(scrim).animationTimingFunction);
          if (pe !== se || pa.effect!.getComputedTiming().duration !== sa.effect!.getComputedTiming().duration) throw new Error('channels disagree');
          const [ox, oy] = getComputedStyle(panel).transformOrigin.split(' ').map(parseFloat);
          // (the panel's layout box: unaffected by its transform; the scrim fills the host, so offsets are in the subject's px)
          const px = panel.offsetLeft, py = panel.offsetTop;
          // the scrim colour's own alpha (the backdrop fades as a whole, panel inside it)
          const scrimColour = getComputedStyle(scrim).backgroundColor;
          return {
            panelX: px, panelY: py, panelW: panel.offsetWidth, panelH: panel.offsetHeight, originX: px + ox!, originY: py + oy!,
            scaleFrom: scaleIn(kf[0]!), scaleTo: scaleIn(kf[kf.length - 1]!), scrimMax: Number((alphaOf(scrimColour) * Number(sk[sk.length - 1]!.opacity ?? 1)).toFixed(2)),
            scrim: { duration: Math.round(Number(sa.effect!.getComputedTiming().duration)), easing: se },
            exit: exitRead, scrimExit: scrimExitRead, sheet: sheetRead, reducedPanel: reducedOf(panel),
          };
        },
        read: () => {
          const { panel, scrim } = partsOf(root)!;
          const c = getComputedStyle(panel);
          const box = within(root, panel);
          return { scale: scaleOfMatrix(c.transform), panelOpacity: parseFloat(c.opacity), scrimOpacity: parseFloat(getComputedStyle(scrim).opacity), insetX: r1(panel.offsetLeft - box.x) };
        },
      };
    },
  });
  const readyRef = useRef(false), retryRef = useRef(() => {});
  readyRef.current = drv.ready;
  retryRef.current = drv.retry;
  useLayoutEffect(() => { scaler.current!.style.transform = `scale(${Z})`; }, [Z]);
  const m = drv.m;

  // The library renders its dialog modal: it hides the rest of the page and traps focus. This poster shares a page with the
  // toolbar and the other posters, so hand the page back.
  useEffect(() => {
    const root = drv.root.current;
    if (!root) return;
    const poster = root.closest('[data-poster]');
    // Outside presses on this poster's own moment buttons must not dismiss the dialog (react-aria listens on the document).
    const keep = (e: Event) => {
      const t = e.target as Node;
      if (poster?.contains(t) && !root.contains(t)) {
        e.stopImmediatePropagation();
        if (e.type === 'mousedown') e.preventDefault();
      }
    };
    const types = ['pointerdown', 'pointerup', 'mousedown', 'mouseup'];
    // focus leaving the dialog (to a moment button, the toolbar) must not pull it back or close it
    const keepFocus = (e: FocusEvent) => {
      const to = e.relatedTarget as Node | null;
      if (to && !root.contains(to) && root.contains(e.target as Node)) e.stopImmediatePropagation();
    };
    types.forEach((t) => document.addEventListener(t, keep, true));
    document.addEventListener('focusout', keepFocus, true);
    // react-aria hides everything outside the dialog (aria-hidden, and inert in newer versions): undo each change it makes
    // to an attribute outside the subject (changes only: attributes set when the page renders are left alone).
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        const el = r.target as Element;
        if (r.oldValue !== null || root.contains(el) || el.contains(root)) continue;
        if (el.hasAttribute(r.attributeName!)) el.removeAttribute(r.attributeName!);
      }
    });
    // If the dialog is closed anyway (Escape, say), the poster has nothing live to hold: capture it again.
    const gone = new MutationObserver(() => { if (readyRef.current && !dialogOf(root)) retryRef.current(); });
    const hostEl = root.querySelector('[data-dlg-host]');
    if (hostEl) gone.observe(hostEl, { childList: true });
    mo.observe(document.body, { attributes: true, attributeFilter: ['aria-hidden', 'inert'], attributeOldValue: true, subtree: true });
    return () => { types.forEach((t) => document.removeEventListener(t, keep, true)); document.removeEventListener('focusout', keepFocus, true); mo.disconnect(); gone.disconnect(); };
  }, [drv.root, host]);

  const clock = (t: number) => (m ? easeAt(Math.min(1, t / m.duration), m.easing) : 0);
  const scrimEase = (t: number) => (m ? easeAt(Math.min(1, t / m.scrim.duration), m.scrim.easing) : 0);
  // (the panel's scale as progress from its start to its end: 0 at the start value, 1 at rest)
  const scaleEase = (t: number) => (m ? easeAt(Math.min(1, t / m.duration), m.easing) : 0);
  return (
    <SpecPage
      accent="dialog" label="Dialog specification" name="Dialog" theme={theme}
      ready={drv.ready} error={drv.error} onRetry={drv.retry}
      drawing={<>
        <div className={styles.subject} style={{ width: W * Z, height: H * Z, position: 'relative' }} data-subject-root>
          <div ref={scaler} style={{ transformOrigin: '0 0', width: W, height: H }}>
            <div ref={drv.root} style={{ position: 'relative', width: W, height: H, overflow: 'hidden' }}>
              {/* the page under the backdrop: a stand-in, with the dialog's real trigger */}
              <div data-dlg-page style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', border: '1px solid var(--oniva-color-border)', display: 'flex', flexDirection: 'column', gap: 12, padding: 20, background: 'var(--oniva-color-bg)' }}>
                <div data-dialog-trigger>{host && <UNSAFE_PortalProvider getContainer={() => host}><DialogTrigger key={key}><Button variant="secondary">New project</Button>
                  <Modal>
                    <Dialog>
                      <DialogHeader>
                        <DialogTitle>Create project</DialogTitle>
                        <DialogDescription>Name it now; you can change it later.</DialogDescription>
                      </DialogHeader>
                      <DialogBody>Projects keep your agents, datasets and runs together.</DialogBody>
                      <DialogFooter>
                        <Button variant="secondary">Cancel</Button>
                        <Button>Create</Button>
                      </DialogFooter>
                    </Dialog>
                  </Modal>
                </DialogTrigger></UNSAFE_PortalProvider>}</div>
                <div style={{ height: 10, width: '70%', borderRadius: 5, background: 'var(--oniva-color-surface-inset)' }} />
                <div style={{ height: 10, width: '55%', borderRadius: 5, background: 'var(--oniva-color-surface-inset)' }} />
                <div style={{ height: 10, width: '62%', borderRadius: 5, background: 'var(--oniva-color-surface-inset)' }} />
                <div style={{ flex: 1, borderRadius: 8, background: 'var(--oniva-color-surface-inset)' }} />
              </div>
              {/* the portal host: the dialog's fixed backdrop is made absolute here, so it covers the subject and not the window */}
              <div ref={setHost} data-dlg-host style={{ position: 'absolute', inset: 0 }} />
              <style>{'[data-dlg-host] > div { position: absolute !important; }'}</style>
            </div>
          </div>
        </div>
        {m && !m.reduced && <Drawing m={m} z={Z} />}
      </>}
      moments={m && !m.reduced && <Moments height={90} snapshots={drv.snapshots} labels={['Closed', 'Entering', 'Open']} selected={drv.selected} onSelect={drv.select}
        timeline={<Timeline value={m.elapsed} max={m.duration} f={clock} marks={FRACTIONS.map((f) => f * m.duration)} selected={drv.selected} label={<Ut v={m.elapsed} u="ms" />} />} />}
      notes={m ? [
        { part: 'n1', head: 'The scrim fades in.', body: <>The backdrop goes from 0 to {Math.round(m.scrimMax * 100)}% over {m.scrim.duration}ms. Now: {Math.round(m.scrimOpacity * 100)}% of the way.</> },
        { part: 'n2', head: 'The panel grows from its centre.', body: <>Scale {m.scaleFrom.toFixed(2)} to {m.scaleTo} about the middle of the {m.panelW} wide panel, never from a trigger, never from 0. Now: {m.scale.toFixed(3)}. It rides the scrim's {m.duration}ms clock: the curves in figure 2 coincide.</> },
        { part: 'n3', head: 'It leaves quicker.', body: <>Out takes {m.exit.duration}ms against {m.duration}ms in, {Math.round((m.exit.duration / m.duration) * 100)}% of the enter, back to {m.exit.scaleTo.toFixed(2)}.</> },
        { part: 'n4', head: 'Narrow screens get a sheet.', body: <>Under {MOBILE_PX}px it rises from {m.sheet.fromY} of its own height below rest, on the drawer curve, {m.sheet.inMs}ms in and {m.sheet.outMs}ms out (read from the stylesheet, not run here).</> },
      ] : []}
      spec={m ? [
        ['Trigger', 'Press the trigger', 'none'],
        ['Animates', 'scrim opacity, panel scale and opacity', 'n1'],
        ['Origin', <>Panel centre, <U v={r1(m.originX - m.panelX)} u="px" />, <U v={r1(m.originY - m.panelY)} u="px" /></>, 'n2'],
        ['Enter', m.reduced ? 'None' : <><U v={m.duration} u="ms" />, {easeWords(m.easing)}</>, 'curve'],
        ['Exit', m.reduced ? 'None' : <><U v={m.exit.duration} u="ms" />, {easeWords(m.exit.easing)}</>, 'n3'],
        ['Sheet', <><U v={m.sheet.inMs} u="ms" /> in, <U v={m.sheet.outMs} u="ms" /> out, {easeWords(m.sheet.inEasing)}</>, 'n4'],
        ['Reduced motion', <>Panel animates {m.reducedPanel.join(', ') || 'nothing'} only (stylesheet); scrim not read</>, 'none'],
      ] : []}
      fig2={m && !m.reduced ? { node: <Curve x={m.elapsed} max={m.duration} series={[{ f: scrimEase }, { f: scaleEase, className: styles.easeAlt }]} end={<Ut v={m.duration} u="ms" />} unit="ms" /> } : undefined}
      units={`Dimensions in px at 1×, drawn at ${Z}×`}
    />
  );
}
