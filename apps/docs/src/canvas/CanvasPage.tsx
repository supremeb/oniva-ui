import * as stylex from '@stylexjs/stylex';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { IconButton, type ThemeMode } from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import {
  DEFAULT_CAMERA,
  TILE_ZOOM,
  anchorFor,
  cameraFromAnchor,
  clampCamera,
  easeOutCubic,
  fitRect,
  lerpCamera,
  loadCamera,
  panBy,
  rectsIntersect,
  saveCamera,
  visibleWorldRect,
  zoomAt,
  type Camera,
  type Insets,
  type Size,
} from './camera';
import { catalog } from './catalog';
import { GroupFrame } from './GroupFrame';
import { computeLayout, type LayoutResult } from './layout';
import { SearchBar } from './SearchBar';

const MAX_LIVE = 14;
const VIEW_MARGIN = 0.6;
const ANIM_MS = 450;
/** Space kept clear of floating controls when framing. */
const PAD: Insets = { top: 72, right: 32, bottom: 128, left: 32 };

const styles = stylex.create({
  viewport: {
    backgroundColor: colors['--oniva-color-bg'],
    cursor: 'grab',
    inset: 0,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: -2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    overflow: 'hidden',
    overscrollBehavior: 'none',
    position: 'fixed',
  },
  panning: { cursor: 'grabbing' },
  world: { height: 0, left: 0, position: 'absolute', top: 0, transformOrigin: '0 0', width: 0 },
  section: {
    color: colors['--oniva-color-text'],
    fontWeight: font['--oniva-font-weight-semibold'],
    left: 0,
    letterSpacing: '-0.01em',
    lineHeight: 1.1,
    margin: 0,
    position: 'absolute',
    top: 0,
    whiteSpace: 'nowrap',
  },
  sectionCount: { color: colors['--oniva-color-text-muted'], fontWeight: font['--oniva-font-weight-regular'] },
  corner: { position: 'fixed', top: 16, zIndex: 30 },
  left: { insetInlineStart: 16 },
  right: { insetInlineEnd: 16 },
});

interface View {
  key: string;
  render: { id: string; mode: 'live' | 'tile'; paused: boolean }[];
  sections: string[];
  tileFont: number;
}
const EMPTY_VIEW: View = { key: '', render: [], sections: [], tileFont: 14 };

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const isEditable = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  return !!el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);
};

/** True when `el` (or an ancestor below `stop`) can still scroll natively in the wheel direction. */
function canScrollInside(el: Element | null, stop: Element, dx: number, dy: number): boolean {
  for (let n = el; n && n !== stop; n = n.parentElement) {
    const cs = getComputedStyle(n);
    const y = /(auto|scroll)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight + 1;
    const x = /(auto|scroll)/.test(cs.overflowX) && n.scrollWidth > n.clientWidth + 1;
    if (y && dy < 0 && n.scrollTop > 0) return true;
    if (y && dy > 0 && n.scrollTop + n.clientHeight < n.scrollHeight - 1) return true;
    if (x && dx < 0 && n.scrollLeft > 0) return true;
    if (x && dx > 0 && n.scrollLeft + n.clientWidth < n.scrollWidth - 1) return true;
  }
  return false;
}

interface Api {
  fit: () => void;
  reset: () => void;
  frame: (id: string) => void;
  focusViewport: () => void;
  observe: (el: HTMLElement) => () => void;
}

export interface CanvasPageProps {
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
}

export function CanvasPage({ theme, onThemeChange }: CanvasPageProps) {
  const navigate = useNavigate();
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const api = useRef<Api | null>(null);
  const [view, setView] = useState<View>(EMPTY_VIEW);
  const [layout, setLayout] = useState<LayoutResult>(() => computeLayout(catalog.sections, (id) => catalog.map.get(id)!.estimate));
  const [highlight, setHighlight] = useState<string | null>(null);
  const [panning, setPanning] = useState(false);
  const reducedMotion = useMemo(prefersReducedMotion, []);

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches);

  const observe = useCallback((el: HTMLElement) => api.current?.observe(el) ?? (() => undefined), []);

  useLayoutEffect(() => {
    const el = viewportRef.current!;
    const world = worldRef.current!;
    const vp: Size = { w: el.clientWidth, h: el.clientHeight };
    const measured = new Map<string, number>();
    const heightOf = (id: string) => measured.get(id) ?? catalog.map.get(id)!.estimate;
    let L = computeLayout(catalog.sections, heightOf);
    const stored = loadCamera();
    let cam: Camera = stored ? cameraFromAnchor(stored, vp, L.groups) : DEFAULT_CAMERA;
    const save = () => saveCamera(cam, anchorFor(cam, vp, L.groups));
    let raf = 0;
    let anim: { from: Camera; target: () => Camera; start: number; ms: number; done?: () => void } | null = null;
    let pending: { id: string; until: number } | null = null;
    let persistTimer = 0;
    let highlightTimer = 0;
    let viewKey = '';
    let pan: { id: number; x: number; y: number } | null = null;
    let touch: { owned: boolean; cx: number; cy: number; d: number } | null = null;
    const cleanups: (() => void)[] = [];
    const on = <T extends EventTarget>(t: T, type: string, fn: (e: never) => void, opts?: AddEventListenerOptions) => {
      t.addEventListener(type, fn as EventListener, opts);
      cleanups.push(() => t.removeEventListener(type, fn as EventListener, opts));
    };

    const clamp = () => {
      cam = clampCamera(cam, vp, L.bounds);
    };

    const updateView = () => {
      const near = visibleWorldRect(cam, vp, VIEW_MARGIN);
      const vis = visibleWorldRect(cam, vp, 0);
      const cx = vis.x + vis.w / 2;
      const cy = vis.y + vis.h / 2;
      const cand: { id: string; visible: boolean; d: number }[] = [];
      for (const [id, r] of L.groups) {
        if (!rectsIntersect(r, near)) continue;
        cand.push({ id, visible: rectsIntersect(r, vis), d: Math.hypot(r.x + r.w / 2 - cx, r.y + r.h / 2 - cy) });
      }
      const liveIds = new Set<string>();
      if (cam.k >= TILE_ZOOM) {
        cand
          .slice()
          .sort((a, b) => Number(b.visible) - Number(a.visible) || a.d - b.d)
          .slice(0, MAX_LIVE)
          .forEach((c) => liveIds.add(c.id));
      }
      const render = cand.map((c) => ({
        id: c.id,
        mode: liveIds.has(c.id) ? ('live' as const) : ('tile' as const),
        paused: liveIds.has(c.id) && !c.visible,
      }));
      const sections: string[] = [];
      for (const [id, r] of L.sections) if (rectsIntersect(r, near)) sections.push(id);
      const q = Math.max(1, 1 / cam.k);
      const tileFont = Math.min(100, Math.round(14 * Math.pow(2, Math.round(Math.log2(q) * 0.75 * 2) / 2)));
      const key = `${render.map((r) => `${r.id}:${r.mode[0]}${r.paused ? 'p' : ''}`).join(',')}|${sections.join(',')}|${tileFont}`;
      if (key === viewKey) return;
      viewKey = key;
      setView({ key, render, sections, tileFont });
    };

    const apply = () => {
      world.style.transform = `translate(${cam.x}px, ${cam.y}px) scale(${cam.k})`;
      el.dataset.camera = `${Math.round(cam.x)},${Math.round(cam.y)},${cam.k.toFixed(3)}`;
    };

    const frame = (now: number) => {
      raf = 0;
      if (anim) {
        const t = Math.min(1, (now - anim.start) / anim.ms);
        cam = lerpCamera(anim.from, anim.target(), easeOutCubic(t), vp);
        if (t >= 1) {
          const done = anim.done;
          anim = null;
          done?.();
        }
      }
      clamp();
      apply();
      updateView();
      window.clearTimeout(persistTimer);
      persistTimer = window.setTimeout(save, 250);
      if (anim) schedule();
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const stopAnim = () => {
      anim = null;
      pending = null;
    };

    const animateTo = (target: () => Camera, done?: () => void) => {
      if (prefersReducedMotion()) {
        stopAnim();
        cam = target();
        done?.();
        schedule();
        return;
      }
      anim = { from: cam, target, start: performance.now(), ms: ANIM_MS, done };
      schedule();
    };

    const frameOf = (id: string) => () => fitRect(L.groups.get(id)!, vp, PAD, 1);
    const fitAll = () => fitRect(L.bounds, vp, PAD, 1);

    const relayout = () => {
      const old = L;
      const vis = visibleWorldRect(cam, vp, 0);
      const mid = { x: vis.x + vis.w / 2, y: vis.y + vis.h / 2 };
      // Anchor: the group under the view centre (else the nearest), so reflow never moves what you are looking at.
      let anchor: string | null = null;
      let best = Infinity;
      for (const [id, r] of old.groups) {
        const d = Math.hypot(Math.max(r.x - mid.x, 0, mid.x - r.x - r.w), Math.max(r.y - mid.y, 0, mid.y - r.y - r.h));
        if (d < best) {
          best = d;
          anchor = id;
        }
      }
      L = computeLayout(catalog.sections, heightOf);
      if (anchor && !anim) {
        const a = old.groups.get(anchor)!;
        const b = L.groups.get(anchor)!;
        cam = panBy(cam, -(b.x - a.x) * cam.k, -(b.y - a.y) * cam.k);
      }
      flushSync(() => setLayout(L));
      viewKey = '';
      clamp();
      apply();
      updateView();
      schedule();
    };

    const ro = new ResizeObserver((entries) => {
      let changed: string[] = [];
      for (const e of entries) {
        const id = (e.target as HTMLElement).dataset.canvasGroup;
        if (!id) continue;
        const h = Math.round(e.borderBoxSize?.[0]?.blockSize ?? e.contentRect.height);
        if (h > 0 && measured.get(id) !== h) {
          measured.set(id, h);
          changed = [...changed, id];
        }
      }
      if (!changed.length) return;
      relayout();
      if (pending && performance.now() < pending.until && changed.includes(pending.id)) {
        const id = pending.id;
        pending = null;
        animateTo(frameOf(id));
      }
    });

    api.current = {
      fit: () => animateTo(fitAll),
      reset: () => animateTo(() => DEFAULT_CAMERA),
      frame: (id) => {
        if (!L.groups.has(id)) return;
        animateTo(frameOf(id), () => {
          pending = { id, until: performance.now() + 1500 };
          setHighlight(id);
          window.clearTimeout(highlightTimer);
          highlightTimer = window.setTimeout(() => setHighlight(null), 1500);
        });
      },
      focusViewport: () => el.focus({ preventScroll: true }),
      observe: (n) => {
        ro.observe(n);
        return () => ro.unobserve(n);
      },
    };

    // ---- wheel / trackpad
    on(el, 'wheel', (e: WheelEvent) => {
      if ((e.target as Element).closest('[data-canvas-ui]')) return;
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? vp.h : 1;
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        stopAnim();
        const dy = Math.max(-40, Math.min(40, e.deltaY * unit));
        const r = el.getBoundingClientRect();
        cam = zoomAt(cam, Math.exp(-dy * 0.006), e.clientX - r.left, e.clientY - r.top);
        schedule();
        return;
      }
      let dx = e.deltaX * unit;
      let dy = e.deltaY * unit;
      if (e.shiftKey && dx === 0) [dx, dy] = [dy, 0];
      if (canScrollInside(e.target as Element, el, dx, dy)) return;
      e.preventDefault();
      stopAnim();
      cam = panBy(cam, -dx, -dy);
      schedule();
    }, { passive: false });

    // ---- mouse / pen drag on empty space
    const endPan = () => {
      if (!pan) return;
      const id = pan.id;
      pan = null;
      try {
        if (el.hasPointerCapture(id)) el.releasePointerCapture(id);
      } catch {
        /* capture already gone */
      }
      setPanning(false);
    };
    on(el, 'pointerdown', (e: PointerEvent) => {
      if (e.pointerType === 'touch' || (e.button !== 0 && e.button !== 1)) return;
      const t = e.target as Element;
      if (t.closest('[data-canvas-preview],[data-canvas-ui]')) return;
      stopAnim();
      pan = { id: e.pointerId, x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
      setPanning(true);
      e.preventDefault(); // no text-selection drag from empty space
      (document.activeElement as HTMLElement | null)?.blur?.();
      el.focus({ preventScroll: true });
    });
    on(el, 'pointermove', (e: PointerEvent) => {
      if (!pan || e.pointerId !== pan.id) return;
      cam = panBy(cam, e.clientX - pan.x, e.clientY - pan.y);
      pan.x = e.clientX;
      pan.y = e.clientY;
      schedule();
    });
    on(el, 'pointerup', (e: PointerEvent) => pan && e.pointerId === pan.id && endPan());
    on(el, 'pointercancel', (e: PointerEvent) => pan && e.pointerId === pan.id && endPan());
    on(el, 'lostpointercapture', (e: PointerEvent) => pan && e.pointerId === pan.id && endPan());
    on(window, 'blur', () => {
      endPan();
      touch = null;
    });
    on(document, 'visibilitychange', () => {
      if (document.hidden) {
        endPan();
        touch = null;
      }
    });

    // ---- touch: pan + pinch on empty space (native gestures stay inside previews and the controls)
    const centroid = (ts: TouchList) => {
      let x = 0;
      let y = 0;
      for (const t of Array.from(ts)) {
        x += t.clientX;
        y += t.clientY;
      }
      return { x: x / ts.length, y: y / ts.length };
    };
    const spread = (ts: TouchList) =>
      ts.length < 2 ? 0 : Math.hypot(ts[0]!.clientX - ts[1]!.clientX, ts[0]!.clientY - ts[1]!.clientY);
    const resync = (ts: TouchList) => {
      if (!touch) return;
      if (!ts.length) {
        touch = null;
        return;
      }
      const c = centroid(ts);
      touch.cx = c.x;
      touch.cy = c.y;
      touch.d = spread(ts);
    };
    on(el, 'touchstart', (e: TouchEvent) => {
      if (!touch) {
        const owned = !(e.target as Element).closest('[data-canvas-preview],[data-canvas-ui]');
        touch = { owned, cx: 0, cy: 0, d: 0 };
        if (owned) stopAnim();
      }
      resync(e.touches);
    }, { passive: true });
    on(el, 'touchmove', (e: TouchEvent) => {
      if (!touch?.owned) return;
      e.preventDefault();
      const c = centroid(e.touches);
      const d = spread(e.touches);
      const r = el.getBoundingClientRect();
      cam = panBy(cam, c.x - touch.cx, c.y - touch.cy);
      if (d > 0 && touch.d > 0) cam = zoomAt(cam, d / touch.d, c.x - r.left, c.y - r.top);
      touch.cx = c.x;
      touch.cy = c.y;
      touch.d = d;
      schedule();
    }, { passive: false });
    const touchEnd = (e: TouchEvent) => resync(e.touches);
    on(el, 'touchend', touchEnd);
    on(el, 'touchcancel', touchEnd);

    // ---- keyboard camera (only when the canvas itself has focus, never stealing keys from previews)
    on(el, 'keydown', (e: KeyboardEvent) => {
      if (e.target !== el || e.metaKey || e.ctrlKey || e.altKey) return;
      const step = e.shiftKey ? 480 : 120;
      let handled = true;
      stopAnim();
      switch (e.key) {
        case 'ArrowLeft': cam = panBy(cam, step, 0); break;
        case 'ArrowRight': cam = panBy(cam, -step, 0); break;
        case 'ArrowUp': cam = panBy(cam, 0, step); break;
        case 'ArrowDown': cam = panBy(cam, 0, -step); break;
        case '+': case '=': cam = zoomAt(cam, 1.25, vp.w / 2, vp.h / 2); break;
        case '-': case '_': cam = zoomAt(cam, 0.8, vp.w / 2, vp.h / 2); break;
        case '0': animateTo(() => DEFAULT_CAMERA); break;
        case 'f': case 'F': animateTo(fitAll); break;
        default: handled = false;
      }
      if (handled) {
        e.preventDefault();
        schedule();
      }
    });

    // ---- reveal offscreen keyboard focus; native focus-scrolling must never move the canvas
    on(el, 'scroll', () => {
      if (el.scrollTop || el.scrollLeft) el.scrollTo(0, 0);
    });
    on(el, 'focusin', (e: FocusEvent) => {
      const t = e.target as HTMLElement;
      if (t === el || !world.contains(t)) return;
      requestAnimationFrame(() => {
        if (el.scrollTop || el.scrollLeft) el.scrollTo(0, 0);
        const r = t.getBoundingClientRect();
        const v = el.getBoundingClientRect();
        const s = { l: v.left + PAD.left, r: v.right - PAD.right, t: v.top + PAD.top, b: v.bottom - PAD.bottom };
        let dx = 0;
        let dy = 0;
        if (r.left < s.l || r.width > s.r - s.l) dx = s.l - r.left;
        else if (r.right > s.r) dx = s.r - r.right;
        if (r.top < s.t || r.height > s.b - s.t) dy = s.t - r.top;
        else if (r.bottom > s.b) dy = s.b - r.bottom;
        if (dx || dy) {
          stopAnim();
          cam = panBy(cam, dx, dy);
          schedule();
        }
      });
    });

    // ---- global shortcuts for search: "/" and Cmd/Ctrl+K, never while typing in a preview
    on(window, 'keydown', (e: KeyboardEvent) => {
      const t = e.target as Element | null;
      const inPreview = !!t?.closest?.('[data-canvas-preview],[role="dialog"],[role="listbox"],[role="menu"]');
      const isSlash = e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey;
      const isK = e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey) && !e.altKey;
      if (!(isSlash || isK)) return;
      if (isSlash && (isEditable(t) || inPreview)) return;
      if (isK && isEditable(t) && inPreview) return;
      e.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.select();
    });

    // ---- links in previews/portals are handled by the host: external opens a new tab, in-canvas hashes pan
    on(document, 'click', (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || a.closest('[data-canvas-ui]')) return;
      e.preventDefault();
      e.stopPropagation();
      const href = a.getAttribute('href') ?? '';
      const m = /^#group-(.+)$/.exec(href);
      if (m) {
        const hit = catalog.entries.find((x) => x.slug === m[1]);
        if (hit) api.current?.frame(hit.id);
      } else if (/^https?:/i.test(href)) {
        window.open(a.href, '_blank', 'noopener,noreferrer');
      } // other (router/hash/relative) links would leave the canvas: ignored
    }, { capture: true });

    const vpObserver = new ResizeObserver(() => {
      vp.w = el.clientWidth;
      vp.h = el.clientHeight;
      schedule();
    });
    vpObserver.observe(el);

    clamp();
    apply();
    updateView();

    return () => {
      cleanups.forEach((fn) => fn());
      ro.disconnect();
      vpObserver.disconnect();
      endPan();
      cancelAnimationFrame(raf);
      window.clearTimeout(persistTimer);
      window.clearTimeout(highlightTimer);
      save();
      api.current = null;
    };
  }, []);

  // Lock page scroll/zoom chrome while the canvas is mounted.
  useLayoutEffect(() => {
    const prev = [document.documentElement.style.overflow, document.body.style.overflow];
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev[0]!;
      document.body.style.overflow = prev[1]!;
    };
  }, []);

  const q = Math.max(1, view.tileFont / 14);
  const sectionFont = Math.min(160, Math.round(28 * q));

  return (
    <>
      <style>{`[data-canvas-paused="true"] *,[data-canvas-paused="true"] *::before,[data-canvas-paused="true"] *::after{animation-play-state:paused !important}`}</style>
      <div
        ref={viewportRef}
        tabIndex={0}
        role="region"
        aria-label="Component canvas. Arrow keys pan, plus and minus zoom, 0 resets the view, F fits all."
        data-testid="canvas-viewport"
        {...stylex.props(styles.viewport, panning && styles.panning)}
      >
        <div ref={worldRef} data-testid="canvas-world" {...stylex.props(styles.world)}>
          {view.sections.map((id) => {
            const r = layout.sections.get(id);
            const s = catalog.sections.find((x) => x.id === id);
            if (!r || !s) return null;
            return (
              <h2
                key={id}
                {...stylex.props(styles.section)}
                style={{ fontSize: sectionFont, transform: `translate(${r.x}px, ${r.y + 40}px) translateY(-100%)` }}
              >
                {s.label} <span {...stylex.props(styles.sectionCount)}>{s.ids.length}</span>
              </h2>
            );
          })}
          {view.render.map(({ id, mode, paused }) => {
            const entry = catalog.map.get(id)!;
            const r = layout.groups.get(id)!;
            return (
              <GroupFrame
                key={id}
                entry={entry}
                x={r.x}
                y={r.y}
                height={r.h}
                mode={mode}
                paused={paused}
                highlighted={highlight === id}
                reducedMotion={reducedMotion}
                tileFont={view.tileFont}
                observe={observe}
              />
            );
          })}
        </div>
      </div>
      <div data-canvas-ui {...stylex.props(styles.corner, styles.left)}>
        <IconButton aria-label="Back to docs" variant="secondary" size="sm" onPress={() => navigate('/components')}>
          <ArrowLeft size={16} />
        </IconButton>
      </div>
      <div data-canvas-ui {...stylex.props(styles.corner, styles.right)}>
        <IconButton
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          variant="secondary"
          size="sm"
          data-testid="theme-toggle"
          onPress={() => onThemeChange(isDark ? 'light' : 'dark')}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </IconButton>
      </div>
      <SearchBar
        items={catalog.entries}
        inputRef={searchRef}
        onSelect={(id) => {
          api.current?.frame(id);
          searchRef.current?.blur();
          api.current?.focusViewport();
        }}
        onFit={() => api.current?.fit()}
        onReset={() => api.current?.reset()}
        onEscape={() => {
          searchRef.current?.blur();
          api.current?.focusViewport();
        }}
      />
    </>
  );
}
