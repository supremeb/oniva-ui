import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { UNSAFE_PortalProvider } from 'react-aria';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from 'oniva-ui';
import { Callout, Curve, Dim, easeAt, easeWords, firstEasing, type Held, markClass, Moments, Overlay, r1, SpecPage, Timeline, U, useCrisp, useDrawingScale, useTransitionSpec, Ut, VDim, within } from '../kit/spec-kit';
import styles from '../kit/spec.module.css';
import type { SpecProps } from '../types';

// DropdownMenu (components/DropdownMenu, styles internal/overlays-menu.ts): the popover surface runs a one-shot enter
// keyframe (popIn, scale 0.96 -> 1 with opacity 0 -> 1) and an exit keyframe (popOut), both with transform-origin
// var(--trigger-anchor-point) set by react-aria's Popover. Everything below is read from the running menu: the enter
// and exit are each measured from their real animation (the exit by opening, closing and reading the exiting popover
// before the poster's own run), the origin from the popover's computed transform-origin.
//
// Driver notes (references/drivers.md): the menu is portalled into a host inside the subject (UNSAFE_PortalProvider)
// so the moments copy it; the subject is scaled with a transform in a sized box (not zoom); the library can't be
// rendered non-modal from here, so the page is handed back (aria-hidden undone, outside presses kept off the menu).

const FRACTIONS = [0, 0.1, 1] as const; // closed (first frame), early in the enter where the scale still shows, settled
// Subject box in layout px: the trigger and the menu under it (the menu's minWidth is 200; 197 high at 6px gap under a
// 36px trigger), so the callouts and dimensions sit outside it.
const W = 200;
const H = 197;
const CONTAINER_PAD = 24; // > react-aria's containerPadding (12), so the menu isn't pushed in from the trigger's edge

type Exit = { duration: number; easing: string; from: number; to: number };
type Base = {
  triggerW: number; triggerH: number; triggerX: number; triggerY: number;
  menuX: number; menuY: number; menuW: number; menuH: number;
  originX: number; originY: number; gap: number; enterFrom: number; enterTo: number; exit: Exit;
};
type Read = { scale: number; opacity: number };

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const until = async (test: () => boolean, cap = 1500) => {
  const t0 = performance.now();
  while (!test() && performance.now() - t0 < cap) await frame();
  return test();
};
const scaleOfMatrix = (t: string) => (t && t !== 'none' ? new DOMMatrixReadOnly(t).a : 1);
const scaleIn = (k: Keyframe | ComputedKeyframe) => Number(scaleOfMatrix(String(k.transform ?? 'none')).toFixed(3));
const popOf = (root: HTMLElement) => root.querySelector<HTMLElement>('[data-placement]');

function Drawing({ m, z: Z }: { m: Held<Base, Read>; z: number }) {
  const { ref, snap } = useCrisp();
  const ox = m.originX * Z, oy = m.originY * Z;
  const mx = m.menuX * Z, my = m.menuY * Z, mw = m.menuW * Z, mh = m.menuH * Z;
  const tx = m.triggerX * Z, ty = m.triggerY * Z, tw = m.triggerW * Z, th = m.triggerH * Z;
  return (
    <Overlay w={W * Z} h={H * Z} svgRef={ref}>
      {/* the menu's resting box (the held frame is a little smaller while it scales) and the trigger's */}
      <rect x={snap(mx, 'x')} y={snap(my, 'y')} width={snap(mx + mw, 'x') - snap(mx, 'x')} height={snap(my + mh, 'y') - snap(my, 'y')} className={markClass.ghost} data-part="n2 n3" />
      <rect x={snap(tx, 'x')} y={snap(ty, 'y')} width={snap(tx + tw, 'x') - snap(tx, 'x')} height={snap(ty + th, 'y') - snap(ty, 'y')} className={markClass.ghost} data-part="n1" />
      {/* the transform origin: a reference cross, with its gap under the trigger and the menu's reach from it */}
      <g className={markClass.reference} data-part="n1">
        <path d={`M${snap(ox, 'x')} ${oy - 9}V${oy + 9}M${ox - 9} ${snap(oy, 'y')}H${ox + 9}`} />
        <circle cx={snap(ox, 'x')} cy={snap(oy, 'y')} r={5} />
      </g>
      <VDim snap={snap} y1={ty + th} y2={oy} x={tx - 21} from={tx} left label={m.gap} part="n1" />
      <Dim snap={snap} x1={ox} x2={mx + mw} y={my + mh + 21} from={my + mh} label={m.menuW} below part="n1" />
      <Callout n={1} x={ox} y={oy} dir="sw" len={34} />
      <Callout n={2} x={mx + mw} y={my + mh * 0.3} dir="e" len={34} />
      <Callout n={3} x={mx + mw} y={my + mh * 0.8} dir="e" len={34} />
    </Overlay>
  );
}

export function PopoverSpec({ theme }: SpecProps) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const scaler = useRef<HTMLDivElement>(null);
  const [key, setKey] = useState(0);
  const Z = useDrawingScale(1.5);
  // (see setup: react-aria places the menu from screen-scaled rects, so it is placed with the subject at screen scale)
  const screen = () => {
    // The scale the host really has on screen (the poster's, the strip's, any zoom, and this subject's own), divided out.
    const el = host!, now = parseFloat(scaler.current!.style.transform.replace(/[^\d.]/g, '')) || 1;
    scaler.current!.style.transform = `scale(${now / (el.getBoundingClientRect().width / el.offsetWidth)})`;
  };
  const drawn = () => { scaler.current!.style.transform = `scale(${Z})`; };
  const hold = useRef({ screen, drawn });
  hold.current = { screen, drawn };
  const drv = useTransitionSpec<Base, Read>({
    fractions: FRACTIONS,
    setup: async (root, { stale }) => {
      // Start from a closed menu: a run that finds one still open (a re-run, a hot reload) remounts it first.
      if (popOf(root)) {
        setKey((k) => k + 1);
        await frame();
        await frame();
        if (stale()) throw new Error('stale');
      }
      const button = root.querySelector<HTMLButtonElement>('button[aria-haspopup]')!;
      // react-aria's Popover places the menu from getBoundingClientRect() but writes the offsets in layout px, so inside
      // the poster's scale it lands in the wrong place (11px under the trigger instead of 6, shifted sideways). Open it
      // with the subject at screen scale 1, then put the subject back at the drawing's fixed scale: the offsets stay.
      screen();
      // 1. Probe the exit: open, then watch the popover for the moment it starts exiting (however it is closed: other posters
      // on the page may take focus, which closes it) and read its real exit animation then. Escape closes it otherwise.
      let enterEasing = '';
      let exit: Exit | null = null;
      for (let attempt = 0; attempt < 3 && !exit; attempt++) {
        screen();
        button.click();
        if (!(await until(() => !!popOf(root)))) throw new Error('menu did not open');
        const first = popOf(root)!;
        if (!enterEasing) enterEasing = firstEasing(getComputedStyle(first).animationTimingFunction);
        const seen = new MutationObserver(() => {
          if (exit || !first.hasAttribute('data-exiting')) return;
          void getComputedStyle(first).opacity;
          const out = first.getAnimations()[0];
          if (!out) return;
          const kf = (out.effect as KeyframeEffect).getKeyframes();
          exit = {
            duration: Math.round(Number(out.effect!.getComputedTiming().duration)),
            easing: firstEasing(getComputedStyle(first).animationTimingFunction),
            from: scaleIn(kf[0]!), to: scaleIn(kf[kf.length - 1]!),
          };
        });
        seen.observe(first, { attributes: true });
        await until(() => !first.hasAttribute('data-entering') || first.hasAttribute('data-exiting'), 1000);
        if (stale()) { seen.disconnect(); throw new Error('stale'); }
        if (first.isConnected && !first.hasAttribute('data-exiting')) {
          first.querySelector('[role="menu"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        }
        await until(() => !!exit || !first.isConnected, 1000);
        seen.disconnect();
        await until(() => !first.isConnected, 1500);
        await frame();
        if (stale()) throw new Error('stale');
      }
      if (!exit) throw new Error('exit animation not seen');
      const exitRead: Exit = exit;
      // 2. The run itself: the component's own handler opens it.
      const enterOf = () => popOf(root)!;
      return {
        easing: enterEasing,
        trigger: async () => {
          screen();
          button.click();
          await until(() => !!popOf(root));
          drawn();
        },
        pick: (all) => all.filter((a) => (a.effect as KeyframeEffect | null)?.target === enterOf()),
        base: () => {
          const pop = enterOf(), a = pop.getAnimations().find((x) => (x.effect as KeyframeEffect | null)?.target === pop);
          const kf = a ? (a.effect as KeyframeEffect).getKeyframes() : [];
          const t = within(root, button);
          const [ox, oy] = getComputedStyle(pop).transformOrigin.split(' ').map(parseFloat);
          // (the position react-aria wrote, exact where offsetLeft/offsetTop round; the host sits CONTAINER_PAD out)
          const menuX = parseFloat(pop.style.left) - CONTAINER_PAD, menuY = parseFloat(pop.style.top) - CONTAINER_PAD;
          return {
            triggerW: t.w, triggerH: t.h, triggerX: t.x, triggerY: t.y,
            menuX, menuY, menuW: pop.offsetWidth, menuH: pop.offsetHeight,
            originX: menuX + ox!, originY: menuY + oy!, gap: r1(menuY - (t.y + t.h)),
            enterFrom: kf.length ? scaleIn(kf[0]!) : 1, enterTo: kf.length ? scaleIn(kf[kf.length - 1]!) : 1, exit: exitRead,
          };
        },
        read: () => {
          const c = getComputedStyle(enterOf());
          return { scale: scaleOfMatrix(c.transform), opacity: parseFloat(c.opacity) };
        },
      };
    },
  });
  const readyRef = useRef(false), retryRef = useRef(() => {});
  readyRef.current = drv.ready;
  retryRef.current = drv.retry;
  useLayoutEffect(() => { scaler.current!.style.transform = `scale(${Z})`; }, [Z]);
  const m = drv.m;

  // The library renders its menu modal; this poster shares a page with the toolbar and other posters, so hand the page back.
  useEffect(() => {
    const root = drv.root.current;
    if (!root) return;
    const poster = root.closest('[data-poster]');
    // Outside presses on this poster's own moment buttons must not close the menu (react-aria listens on the document).
    const keep = (e: Event) => {
      const t = e.target as Node;
      if (poster?.contains(t) && !root.contains(t)) {
        e.stopImmediatePropagation();
        // (and a press on a moment button keeps focus in the menu: the popover also closes when focus leaves it)
        if (e.type === 'mousedown') e.preventDefault();
      }
    };
    const types = ['pointerdown', 'pointerup', 'mousedown', 'mouseup'];
    // (the popover also closes when focus leaves it, as it does when a moment button takes focus)
    const keepFocus = (e: FocusEvent) => {
      const to = e.relatedTarget as Node | null;
      if (to && poster?.contains(to) && !root.contains(to) && root.contains(e.target as Node)) e.stopImmediatePropagation();
    };
    types.forEach((t) => document.addEventListener(t, keep, true));
    document.addEventListener('focusout', keepFocus, true);
    // react-aria places the menu again on every window resize: let it measure at screen scale then too, or it drifts
    // (this capture listener runs before its own), and put the drawing's scale back a couple of frames later.
    let back = 0;
    const onResize = () => {
      if (!popOf(root)) return;
      hold.current.screen();
      cancelAnimationFrame(back);
      back = requestAnimationFrame(() => { back = requestAnimationFrame(() => hold.current.drawn()); });
    };
    window.addEventListener('resize', onResize, true);
    // A modal popover hides the rest of the page (aria-hidden) and makes it inert while it is open; the toolbar and the
    // other posters must stay usable. Undo each change react-aria makes to an attribute (changes only: attributes set
    // when the page renders are not touched) outside the subject.
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        const el = r.target as Element;
        if (r.oldValue !== null || root.contains(el) || el.contains(root)) continue;
        if (el.hasAttribute(r.attributeName!)) el.removeAttribute(r.attributeName!);
      }
    });
    // If the menu is closed anyway (Tab out of it, say), the poster has nothing live to hold: capture it again.
    const gone = new MutationObserver(() => { if (readyRef.current && !popOf(root)) retryRef.current(); });
    const hostEl = root.querySelector('[data-pop-host]');
    if (hostEl) gone.observe(hostEl, { childList: true });
    mo.observe(document.body, { attributes: true, attributeFilter: ['aria-hidden', 'inert'], attributeOldValue: true, subtree: true });
    return () => { types.forEach((t) => document.removeEventListener(t, keep, true)); document.removeEventListener('focusout', keepFocus, true); window.removeEventListener('resize', onResize, true); cancelAnimationFrame(back); mo.disconnect(); gone.disconnect(); };
  }, [drv.root, host]);

  const enterEase = (t: number) => (m ? easeAt(Math.min(1, t / m.duration), m.easing) : 0);
  const exitEase = (t: number) => (m ? 1 - easeAt(Math.min(1, t / m.exit.duration), m.exit.easing) : 0);
  return (
    <SpecPage
      accent="popover" label="Dropdown menu specification" name="Dropdown menu" theme={theme}
      ready={drv.ready} error={drv.error} onRetry={drv.retry}
      drawing={<>
        <div className={styles.subject} style={{ width: W * Z, height: H * Z, position: 'relative' }} data-subject-root>
          <div ref={scaler} style={{ transformOrigin: '0 0', width: W, height: H }}>
            <div ref={drv.root} style={{ position: 'relative', width: W, height: H }}>
              {/* (react-aria keeps a popover CONTAINER_PAD px inside its container, so the host reaches past the trigger on every side) */}
              <div ref={setHost} data-pop-host style={{ position: 'absolute', inset: -CONTAINER_PAD }} />
              {/* (the modal popover's full-window underlay would stretch the moments' frames to the whole window) */}
              <style>{'[data-pop-host] [data-testid="underlay"] { display: none; }'}</style>
              {host && (
                <UNSAFE_PortalProvider getContainer={() => host}>
                  <DropdownMenu key={key}>
                    <Button variant="secondary">Account</Button>
                    <DropdownMenuContent placement="bottom start">
                      <DropdownMenuItem id="profile" shortcut="⌘P">Profile</DropdownMenuItem>
                      <DropdownMenuItem id="settings" shortcut="⌘,">Settings</DropdownMenuItem>
                      <DropdownMenuItem id="billing">Billing</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem id="out" variant="danger">Sign out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </UNSAFE_PortalProvider>
              )}
            </div>
          </div>
        </div>
        {m && !m.reduced && <Drawing m={m} z={Z} />}
      </>}
      moments={m && !m.reduced && <Moments crop={{ x: Math.min(m.triggerX, m.menuX) - 10, y: m.triggerY - 10, w: Math.max(m.triggerW, m.menuW) + 20, h: m.menuY + m.menuH - m.triggerY + 20 }} height={110} snapshots={drv.snapshots} labels={['Closed', 'Opening', 'Open']} selected={drv.selected} onSelect={drv.select}
        timeline={<Timeline value={m.elapsed} max={m.duration} f={enterEase} marks={FRACTIONS.map((f) => f * m.duration)} selected={drv.selected} label={<Ut v={m.elapsed} u="ms" />} />} />}
      notes={m ? [
        { part: 'n1', head: 'It grows from the trigger.', body: <>The origin ({r1(m.originX - m.menuX)}, {r1(m.originY - m.menuY)} in the menu) sits {r1(m.originX - m.triggerX)} from the trigger&apos;s left edge and {m.gap} under it, so the menu opens out of the button, not out of its own middle.</> },
        { part: 'n2', head: 'Small scale, plus a fade.', body: <>It starts at {m.enterFrom.toFixed(2)} and settles at {m.enterTo} while opacity runs 0 to 1 on one clock. Now: {m.scale.toFixed(3)} scale, {Math.round(m.opacity * 100)}% opaque.</> },
        { part: 'n3', head: 'Closing is quicker.', body: <>The grey curve is the exit. It takes {m.exit.duration}ms against {m.duration}ms in, {Math.round((m.exit.duration / m.duration) * 100)}% of the enter, on the same ease-out, back to {m.exit.to.toFixed(2)}.</> },
      ] : []}
      spec={m ? [
        ['Trigger', 'Press the button', 'none'],
        ['Animates', 'transform scale, opacity', 'n2'],
        ['Origin', <><U v={r1(m.originX - m.menuX)} u="px" />, <U v={r1(m.originY - m.menuY)} u="px" /> in the menu</>, 'n1'],
        ['Gap', <><U v={m.gap} u="px" /> under the trigger</>, 'none'],
        ['Enter', m.reduced ? 'None' : <><U v={m.duration} u="ms" />, {easeWords(m.easing)}</>, 'curve'],
        ['Exit', m.reduced ? 'None' : <><U v={m.exit.duration} u="ms" />, {easeWords(m.exit.easing)}</>, 'n3'],
        ['Reduced motion', 'The menu appears and goes with no scale or fade', 'none'],
      ] : []}
      fig2={m && !m.reduced ? { node: <Curve x={m.elapsed} max={m.duration} series={[{ f: enterEase }, { f: exitEase, className: styles.easeAlt }]} end={<Ut v={m.duration} u="ms" />} unit="ms" /> } : undefined}
      units={`Dimensions in px at 1×, drawn at ${Z}×`}
    />
  );
}
