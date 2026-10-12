import * as stylex from '@stylexjs/stylex';
import { UNSAFE_PortalProvider } from 'react-aria';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type Ref,
} from 'react';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { accentThemes, darkShadowTheme, darkTheme, type AccentName } from './themes';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const styles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-bg'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-14'],
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textRendering: 'optimizeLegibility',
  },
  light: { colorScheme: 'light' },
  dark: { colorScheme: 'dark' },
});

export interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  accent: AccentName;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: AccentName) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Access the nearest ThemeProvider. Falls back to a static light/blue value outside one. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  return (
    ctx ?? {
      theme: 'light',
      resolvedTheme: 'light',
      accent: 'blue',
      setTheme: () => {},
      setAccent: () => {},
    }
  );
}

const DARK_QUERY = '(prefers-color-scheme: dark)';

/** Reads the OS color scheme synchronously on the first client render (no light-mode flash). */
function useSystemDark(enabled: boolean): boolean {
  const subscribe = useCallback(
    (cb: () => void) => {
      if (!enabled || typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mq = window.matchMedia(DARK_QUERY);
      mq.addEventListener('change', cb);
      return () => mq.removeEventListener('change', cb);
    },
    [enabled],
  );
  return useSyncExternalStore(
    subscribe,
    () =>
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia(DARK_QUERY).matches
        : false,
    () => false,
  );
}

export interface ThemeProviderProps {
  /** Color mode. Controlled by the `theme` prop; `setTheme` from `useTheme` mirrors it into local state. */
  theme?: ThemeMode;
  accent?: AccentName;
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Applies the theme classes to a wrapper `div` and routes React Aria portals (popovers, modals,
 * tooltips) into it, so overlays inherit the same tokens.
 */
export function ThemeProvider({
  theme: themeProp = 'light',
  accent: accentProp = 'blue',
  children,
  className,
  xstyle,
  ref,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(themeProp);
  const [accent, setAccentState] = useState<AccentName>(accentProp);
  useEffect(() => {
    setThemeState(themeProp);
  }, [themeProp]);
  useEffect(() => {
    setAccentState(accentProp);
  }, [accentProp]);

  const systemDark = useSystemDark(theme === 'system');
  const resolvedTheme: ResolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      setNode(el);
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as { current: HTMLDivElement | null }).current = el;
    },
    [ref],
  );

  const value = useMemo<ContextValueInternal>(
    () => ({
      theme,
      resolvedTheme,
      accent,
      setTheme: setThemeState,
      setAccent: setAccentState,
    }),
    [theme, resolvedTheme, accent],
  );

  const props = stylex.props(
    styles.root,
    resolvedTheme === 'dark' ? [styles.dark, darkTheme, darkShadowTheme] : styles.light,
    accentThemes[accent],
    xstyle,
  );

  return (
    <ThemeContext.Provider value={value}>
      <div
        {...props}
        ref={setRef}
        className={[props.className, className].filter(Boolean).join(' ')}
        data-oniva-theme={resolvedTheme}
        data-oniva-accent={accent}
      >
        <UNSAFE_PortalProvider getContainer={() => node}>{children}</UNSAFE_PortalProvider>
      </div>
    </ThemeContext.Provider>
  );
}

type ContextValueInternal = ThemeContextValue;

/** Same base styles as ThemeProvider, without theming. For apps that theme at a higher level. */
export function OnivaRoot({
  children,
  className,
  xstyle,
}: Omit<ThemeProviderProps, 'theme' | 'accent' | 'ref'>) {
  const props = stylex.props(styles.root, xstyle);
  return (
    <div {...props} className={[props.className, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
