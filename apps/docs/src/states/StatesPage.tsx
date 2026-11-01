import * as stylex from '@stylexjs/stylex';
import { useEffect, useMemo, type ReactNode } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import type { ThemeMode } from 'oniva-ui';
import type { StateModule } from './types';

// Throwaway workbench: the whole `states/` folder and its one route in App.tsx are deleted together.
// The switcher is deliberately plain (monospace, fixed greys) so it reads as outside the design system.

const modules = Object.values(
  import.meta.glob('./*/index.tsx', { eager: true, import: 'default' }) as Record<string, StateModule>,
)
  .filter((m) => m && m.slug && m.groups)
  .sort((a, b) => a.slug.localeCompare(b.slug));

const s = stylex.create({
  page: { display: 'flex', minHeight: '100vh', alignItems: 'flex-start' },
  rail: {
    position: 'sticky',
    top: 0,
    width: 220,
    flexShrink: 0,
    height: '100vh',
    overflowY: 'auto',
    boxSizing: 'border-box',
    padding: 12,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: 12,
    lineHeight: 1.5,
    color: '#222',
    backgroundColor: '#ecece6',
    borderRightWidth: 1,
    borderRightStyle: 'dashed',
    borderRightColor: '#999',
  },
  railTitle: { fontWeight: 700, marginBottom: 8 },
  group: { marginTop: 12, marginBottom: 2, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 10 },
  link: { display: 'block', paddingBlock: 2, paddingInline: 6, color: '#222', textDecoration: 'none', borderRadius: 2 },
  active: { backgroundColor: '#222', color: '#ecece6' },
  hint: { marginTop: 16, color: '#666', fontSize: 11 },
  missing: { marginTop: 4, color: '#8a4b00' },
  btn: {
    fontFamily: 'inherit',
    fontSize: 11,
    marginTop: 8,
    paddingBlock: 2,
    paddingInline: 6,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#999',
    backgroundColor: '#fafaf7',
    color: '#222',
    cursor: 'pointer',
  },
  stage: { flexGrow: 1, minWidth: 0, padding: 32, boxSizing: 'border-box' },
  frame: { marginInline: 'auto', maxWidth: '100%' },
  frameWidth: (w: number | string) => ({ width: w }),
  label: { fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 11, color: '#888', marginBottom: 12 },
  index: { padding: 32, fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 13 },
});

export function StatesPage({ theme, onThemeChange }: { theme: ThemeMode; onThemeChange: (t: ThemeMode) => void }) {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const mod = modules.find((m) => m.slug === slug);
  const flat = useMemo(() => mod?.groups.flatMap((g) => g.states) ?? [], [mod]);
  const current = flat.find((st) => st.id === params.get('__state')) ?? flat[0];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const i = current ? flat.indexOf(current) : 0;
      let next: number | null = null;
      if (e.key === 'j' || e.key === ']') next = Math.min(flat.length - 1, i + 1);
      if (e.key === 'k' || e.key === '[') next = Math.max(0, i - 1);
      if (e.key === 't') onThemeChange(theme === 'dark' ? 'light' : 'dark');
      const target = next === null ? undefined : flat[next];
      if (target) {
        e.preventDefault();
        setParams({ __state: target.id });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flat, current, setParams, theme, onThemeChange]);

  if (!mod) {
    return (
      <div {...stylex.props(s.index)}>
        <p>State workbench ({modules.length} components)</p>
        <ul>
          {modules.map((m) => (
            <li key={m.slug}>
              <Link to={`/states/${m.slug}`}>{m.slug}</Link> ({m.groups.reduce((n, g) => n + g.states.length, 0)} states)
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div {...stylex.props(s.page)} data-states-page="">
      <nav {...stylex.props(s.rail)} aria-label="States">
        <div {...stylex.props(s.railTitle)}>{mod.title}</div>
        {mod.groups.map((g) => (
          <div key={g.label}>
            <div {...stylex.props(s.group)}>{g.label}</div>
            {g.states.map((st) => (
              <Link
                key={st.id}
                to={`/states/${mod.slug}?__state=${st.id}`}
                data-state-link={st.id}
                aria-current={st.id === current?.id ? 'page' : undefined}
                {...stylex.props(s.link, st.id === current?.id && s.active)}
              >
                {st.label}
              </Link>
            ))}
          </div>
        ))}
        {mod.missing?.length ? (
          <>
            <div {...stylex.props(s.group)}>Missing in code</div>
            {mod.missing.map((m) => (
              <div key={m} {...stylex.props(s.missing)}>
                {m}
              </div>
            ))}
          </>
        ) : null}
        <button type="button" {...stylex.props(s.btn)} onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}>
          theme: {theme}
        </button>
        <div {...stylex.props(s.hint)}>j / k: next / prev · t: theme</div>
      </nav>
      <main {...stylex.props(s.stage)} id="main">
        <div {...stylex.props(s.label)}>__state={current?.id}</div>
        <div {...stylex.props(s.frame, s.frameWidth(mod.width ?? 720))} data-state-frame={current?.id}>
          {current ? <StateView key={current.id} render={current.render} /> : null}
        </div>
      </main>
    </div>
  );
}

function StateView({ render }: { render: () => ReactNode }) {
  return <>{render()}</>;
}
