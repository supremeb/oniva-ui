import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider, type AccentName, type ThemeMode } from 'oniva-ui';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { ComponentPage } from './pages/ComponentPage';
import { ChartsGallery } from './pages/ChartsGallery';
import { TemplatePage } from './pages/TemplatePage';
import { MotionFoundations } from './pages/MotionFoundations';
import { StaticPageView } from './pages/StaticPageView';
import { DocsShell } from './shell/DocsShell';

const styles = stylex.create({
  shell: { minHeight: '100vh' },
  wide: {
    marginInline: 'auto',
    maxWidth: 1280,
    paddingBlock: 32,
    paddingInline: { default: 16, '@media (min-width: 800px)': 24 },
  },
});

function usePersisted<T extends string>(
  key: string,
  initial: T,
  valid: readonly T[],
): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key) as T | null;
      return stored && valid.includes(stored) ? stored : initial;
    } catch {
      return initial;
    }
  });
  const set = (v: T) => {
    setValue(v);
    try {
      localStorage.setItem(key, v);
    } catch {
      /* ignore */
    }
  };
  return [value, set];
}

const THEMES = ['light', 'dark', 'system'] as const;
const ACCENTS = ['blue', 'violet', 'pink', 'red', 'amber', 'emerald', 'cyan', 'indigo'] as const;

export function App() {
  const [theme, setTheme] = usePersisted<ThemeMode>('oniva-theme', 'light', THEMES);
  const [accent, setAccent] = usePersisted<AccentName>('oniva-accent', 'blue', ACCENTS);
  const { pathname } = useLocation();
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches);

  const isDocsRoute = !(pathname === '/' || pathname === '/charts' || pathname.startsWith('/templates/'));
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  // Keep <body> in sync so overscroll / page background match the theme.
  useEffect(() => {
    document.documentElement.style.colorScheme = theme === 'system' ? 'light dark' : theme;
  }, [theme]);

  return (
    <ThemeProvider theme={theme} accent={accent} xstyle={styles.shell}>
      {!isDocsRoute ? <Header theme={theme} onThemeChange={setTheme} accent={accent} onAccentChange={setAccent} /> : null}
      <Routes>
        <Route
          path="/"
          element={
            <main id="main">
              <Home
                theme={theme}
                accent={accent}
                isDark={isDark}
                onAccentChange={setAccent}
                onThemeChange={setTheme}
              />
            </main>
          }
        />
        <Route
          path="/templates/:slug"
          element={
            <main id="main">
              <TemplatePage />
            </main>
          }
        />
        <Route
          path="/charts"
          element={
            <main id="main" {...stylex.props(styles.wide)}>
              <ChartsGallery />
            </main>
          }
        />
        <Route
          path="*"
          element={
            <DocsShell theme={theme} onThemeChange={setTheme} accent={accent} onAccentChange={setAccent}>
              <Routes>
                <Route path="/getting-started/:slug" element={<StaticPageView />} />
                <Route path="/foundations/motion" element={<MotionFoundations />} />
                <Route path="/foundations/:slug" element={<StaticPageView />} />
                <Route path="/patterns/:slug" element={<StaticPageView />} />
                <Route path="/components" element={<ComponentsIndex />} />
                <Route path="/components/:slug" element={<ComponentPage />} />
                <Route path="*" element={<ComponentsIndex />} />
              </Routes>
            </DocsShell>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}
