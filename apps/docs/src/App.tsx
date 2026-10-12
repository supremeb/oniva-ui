import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider, type AccentName, type ThemeMode } from 'oniva-ui';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { ComponentsIndex } from './pages/ComponentsIndex';
import { ComponentPage } from './pages/ComponentPage';

const styles = stylex.create({
  shell: { minHeight: '100vh' },
  main: { marginInline: 'auto', maxWidth: 1120, paddingBlock: 32, paddingInline: 24 },
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  // Keep <body> in sync so overscroll / page background match the theme.
  useEffect(() => {
    document.documentElement.style.colorScheme = theme === 'system' ? 'light dark' : theme;
  }, [theme]);

  return (
    <ThemeProvider theme={theme} accent={accent} xstyle={styles.shell}>
      <Header theme={theme} onThemeChange={setTheme} accent={accent} onAccentChange={setAccent} />
      <main id="main" {...stylex.props(styles.main)}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/components" element={<ComponentsIndex />} />
          <Route path="/components/:slug" element={<ComponentPage />} />
          <Route path="*" element={<ComponentsIndex />} />
        </Routes>
      </main>
    </ThemeProvider>
  );
}
