import * as stylex from '@stylexjs/stylex';
import { ChevronDown, Menu, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Kbd, type AccentName, type ThemeMode } from 'oniva-ui';
import { Link } from 'react-router-dom';
import { accent as accentTokens } from '@oniva-tokens/accent.stylex';
import { HeaderUtilities } from '../components/Header';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';
import { buildNav, type NavGroup, type NavItem } from './nav';
import { OnThisPage } from './OnThisPage';
import { OnivaMark } from '../components/OnivaMark';

const s = stylex.create({
  frame: { display: 'grid', gridTemplateColumns: { default: 'minmax(0, 1fr)', '@media (min-width: 1024px)': '296px minmax(0, 1fr)' }, alignItems: 'start' },
  sidebar: {
    backgroundColor: colors['--oniva-color-bg'], borderInlineEndColor: colors['--oniva-color-border'], borderInlineEndStyle: 'solid', borderInlineEndWidth: 1,
    display: 'flex', flexDirection: 'column', height: '100vh', insetBlockStart: 0, position: 'sticky',
  },
  drawer: { display: 'flex', flexDirection: 'column', height: '100%' },
  mobileOnly: { display: { default: 'inline-flex', '@media (min-width: 1024px)': 'none' }, marginInlineEnd: 'auto' },
  desktopOnly: { display: { default: 'none', '@media (min-width: 1024px)': 'flex' } },
  scrim: { backgroundColor: colors['--oniva-color-overlay'], inset: 0, position: 'fixed', zIndex: 40 },
  drawerPanel: { backgroundColor: colors['--oniva-color-bg'], height: '100%', insetBlockStart: 0, insetInlineStart: 0, maxWidth: '86vw', position: 'fixed', width: 320, zIndex: 41 },
  brand: { alignItems: 'center', color: colors['--oniva-color-text'], display: 'flex', gap: 12, padding: '20px 20px 14px', textDecoration: 'none' },
  mark: { alignItems: 'center', color: accentTokens['--oniva-accent-500'], display: 'inline-flex', flexShrink: 0, height: 36, justifyContent: 'center', width: 36 },
  brandName: { display: 'block', fontFamily: '"Outfit", ui-sans-serif, system-ui, sans-serif', fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.2 },
  brandSub: { color: colors['--oniva-color-text-muted'], display: 'block', fontSize: font['--oniva-font-size-13'], lineHeight: 1.3, marginBlockStart: 2 },
  searchWrap: { margin: '0 16px 8px', position: 'relative' },
  search: {
    backgroundColor: colors['--oniva-color-surface-inset'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-lg'], borderStyle: 'solid', borderWidth: 1,
    color: colors['--oniva-color-text'], fontFamily: 'inherit', fontSize: font['--oniva-font-size-14'], height: 40, paddingInlineEnd: 40, paddingInlineStart: 32, width: '100%',
  },
  searchIcon: { color: colors['--oniva-color-icon-muted'], insetBlockStart: 13, insetInlineStart: 12, pointerEvents: 'none', position: 'absolute' },
  hotkey: { insetBlockStart: 9, insetInlineEnd: 8, pointerEvents: 'none', position: 'absolute' },
    scroller: { flexGrow: 1, flexShrink: 1, flexBasis: '0%', minHeight: 0, overflowY: 'auto', padding: '4px 12px 32px', scrollbarWidth: 'thin',
    // No track background; thumb only appears while the nav is hovered or scrolled with the keyboard.
    scrollbarColor: { default: 'transparent transparent', ':hover': 'var(--oniva-color-border-hover) transparent', ':focus-within': 'var(--oniva-color-border-hover) transparent' },
    scrollbarGutter: 'stable', backgroundColor: 'transparent' },
  groupBtn: {
    alignItems: 'center', appearance: 'none', backgroundColor: 'transparent', borderRadius: radius['--oniva-radius-md'], borderWidth: 0, color: colors['--oniva-color-text-subtle'], cursor: 'pointer', display: 'flex',
    fontFamily: 'inherit', fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-medium'], justifyContent: 'space-between', letterSpacing: '0.12em', marginBlockStart: 22,
    padding: '6px 8px', textTransform: 'uppercase', width: '100%',
  },
  chev: { opacity: { default: 0, ':is(button:hover *)': 1, ':is(button:focus-visible *)': 1 } },
  subLabel: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-medium'], margin: '14px 8px 4px' },
  link: {
    alignItems: 'center', borderRadius: radius['--oniva-radius-lg'], color: { default: colors['--oniva-color-text-muted'], ':hover': colors['--oniva-color-text'] }, display: 'flex', fontSize: font['--oniva-font-size-14'], gap: 8, justifyContent: 'space-between', minHeight: 36,
    paddingInline: 10, textDecoration: 'none', backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-inset-hover'] },
  },
  linkOn: { backgroundColor: colors['--oniva-color-surface-tertiary'], color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  badge: { borderRadius: radius['--oniva-radius-full'], fontSize: font['--oniva-font-size-11'], fontWeight: font['--oniva-font-weight-medium'], paddingBlock: 1, paddingInline: 7 },
  badgeNew: { backgroundColor: colors['--oniva-color-success-bg'], color: colors['--oniva-color-success-fg'] },
  badgeAi: { backgroundColor: colors['--oniva-color-purple-bg'], color: colors['--oniva-color-purple-fg'] },
  content: { minWidth: 0, paddingBlockEnd: 96, paddingBlockStart: 8, paddingInline: { default: 16, '@media (min-width: 800px)': 40, '@media (min-width: 1180px)': 64 } },
  // Rail is position:fixed beside the nav, so the content column no longer reserves space for it.
  contentRow: { marginInline: 'auto', maxWidth: 880 },
  topbar: { alignItems: 'center', backgroundColor: colors['--oniva-color-bg'], display: 'flex', gap: 8, insetBlockStart: 0, justifyContent: 'flex-end', minHeight: 56, paddingInline: { default: 12, '@media (min-width: 800px)': 24 }, position: 'sticky', zIndex: 15 },
  none: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], padding: 12 },
  menuBtn: {
    alignItems: 'center', appearance: 'none', backgroundColor: colors['--oniva-color-surface'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-md'], borderStyle: 'solid', borderWidth: 1,
    color: colors['--oniva-color-text'], cursor: 'pointer', display: 'inline-flex', fontFamily: 'inherit', fontSize: font['--oniva-font-size-13'], gap: 6, height: 32, paddingInline: 10,
  },
});

function Badge({ b }: { b: 'New' | 'AI' }) {
  return <span {...stylex.props(s.badge, b === 'New' ? s.badgeNew : s.badgeAi)}>{b}</span>;
}

function Nav({ onNavigate, q, setQ, inputRef }: { onNavigate: () => void; q: string; setQ: (v: string) => void; inputRef: React.RefObject<HTMLInputElement | null> }) {
  const nav = useMemo(buildNav, []);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const scroller = useRef<HTMLDivElement>(null);
  const [closed, setClosed] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(sessionStorage.getItem('docs-nav-closed') ?? '{}') as Record<string, boolean>; } catch { return {}; }
  });
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = Number(sessionStorage.getItem('docs-nav-scroll') ?? 0);
  }, []);
  useEffect(() => {
    scroller.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest' });
  }, [pathname]);
  const needle = q.trim().toLowerCase();
  const match = (i: NavItem) => !needle || i.label.toLowerCase().includes(needle);
  const filtered: NavGroup[] = nav
    .map((g) => ({ ...g, items: g.items.filter(match), sub: g.sub?.map((x) => ({ ...x, items: x.items.filter(match) })).filter((x) => x.items.length) }))
    .filter((g) => g.items.length || g.sub?.length);
  const first = filtered.flatMap((g) => [...g.items, ...(g.sub?.flatMap((x) => x.items) ?? [])])[0];
  const toggle = (id: string) => setClosed((c) => { const n = { ...c, [id]: !c[id] }; sessionStorage.setItem('docs-nav-closed', JSON.stringify(n)); return n; });
  const renderLink = (i: NavItem) => (
    <NavLink key={i.to} to={i.to} end onClick={onNavigate} {...stylex.props(s.link)} className={({ isActive }) => (isActive ? stylex.props(s.link, s.linkOn).className ?? '' : stylex.props(s.link).className ?? '')}>
      {i.label}
      {i.badge ? <Badge b={i.badge} /> : null}
    </NavLink>
  );
  return (
    <>
      <Link to="/" {...stylex.props(s.brand)} aria-label="oniva/ui home">
        <span {...stylex.props(s.mark)}><OnivaMark size={30} /></span>
        <span><span {...stylex.props(s.brandName)}>oniva/ui</span><span {...stylex.props(s.brandSub)}>Design system docs</span></span>
      </Link>
      <div {...stylex.props(s.searchWrap)}>
        <Search size={14} {...stylex.props(s.searchIcon)} aria-hidden="true" />
        <input
          ref={inputRef} type="search" aria-label="Search docs" placeholder="Search docs" value={q} {...stylex.props(s.search)}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && first) { navigate(first.to); setQ(''); onNavigate(); }
            if (e.key === 'Escape') { setQ(''); e.currentTarget.blur(); }
          }}
        />
        <span {...stylex.props(s.hotkey)} aria-hidden="true"><Kbd>/</Kbd></span>
      </div>
      <nav aria-label="Docs" ref={scroller} {...stylex.props(s.scroller)} onScroll={(e) => sessionStorage.setItem('docs-nav-scroll', String(e.currentTarget.scrollTop))}>
        {filtered.length === 0 ? <p {...stylex.props(s.none)}>No matches for “{q}”.</p> : null}
        {filtered.map((g) => {
          const open = needle ? true : !closed[g.id];
          return (
            <div key={g.id}>
              <button type="button" aria-expanded={open} aria-controls={`nav-${g.id}`} {...stylex.props(s.groupBtn)} onClick={() => toggle(g.id)}>
                {g.label}
                <ChevronDown size={14} aria-hidden="true" {...stylex.props(s.chev)} style={{ transform: open ? undefined : 'rotate(-90deg)' }} />
              </button>
              {open ? (
                <div id={`nav-${g.id}`}>
                  {g.items.map(renderLink)}
                  {g.sub?.map((x) => (
                    <div key={x.label}>
                      <p {...stylex.props(s.subLabel)}>{x.label}</p>
                      {x.items.map(renderLink)}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </>
  );
}

export interface DocsShellProps { children: ReactNode; theme: ThemeMode; onThemeChange: (t: ThemeMode) => void; accent: AccentName; onAccentChange: (a: AccentName) => void }

export function DocsShell({ children, theme, onThemeChange, accent, onAccentChange }: DocsShellProps) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !(t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) && !t?.isContentEditable) {
        e.preventDefault();
        if (window.matchMedia('(max-width: 1023px)').matches) setOpen(true);
        setTimeout(() => input.current?.focus(), 30);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  return (
    <div {...stylex.props(s.frame)}>
      <aside aria-label="Sidebar" {...stylex.props(s.sidebar, s.desktopOnly)}>
        {!open ? <Nav onNavigate={() => undefined} q={q} setQ={setQ} inputRef={input} /> : null}
      </aside>
      <div style={{ minWidth: 0 }}>
        <div {...stylex.props(s.topbar)} data-testid="docs-utilities">
          <button type="button" {...stylex.props(s.menuBtn, s.mobileOnly)} aria-expanded={open} aria-label="Open navigation" onClick={() => setOpen(true)}><Menu size={16} /> Menu</button>
          <HeaderUtilities theme={theme} onThemeChange={onThemeChange} accent={accent} onAccentChange={onAccentChange} />
        </div>
        <main id="main" {...stylex.props(s.content)}>
          <div {...stylex.props(s.contentRow)}>
            <OnThisPage />
            <div style={{ minWidth: 0 }}>{children}</div>
          </div>
        </main>
      </div>
      {open ? (
        <>
          <div {...stylex.props(s.scrim)} onClick={() => setOpen(false)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" aria-label="Navigation" {...stylex.props(s.drawerPanel)}>
            <div {...stylex.props(s.drawer)}>
              <button type="button" {...stylex.props(s.menuBtn)} style={{ margin: 12, alignSelf: 'flex-end' }} aria-label="Close navigation" onClick={() => setOpen(false)}><X size={16} /></button>
              <Nav onNavigate={() => setOpen(false)} q={q} setQ={setQ} inputRef={input} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
