import * as stylex from '@stylexjs/stylex';
import { Moon, Search, Sun } from 'lucide-react';
import { GithubIcon } from './GithubIcon';
import { useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button as RacButton } from 'react-aria-components';
import {
  Button,
  CommandPalette,
  Kbd,
  accentNames,
  accentSwatches,
  type AccentName,
  type CommandGroup,
  type ThemeMode,
} from 'oniva-ui';
import { accent as accentTokens } from '@oniva-tokens/accent.stylex';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';
import { demoModules, groupByCategory } from '../demos';
import { SITE, templates } from '../lib/site';
import { OnivaMark } from "./OnivaMark";

const styles = stylex.create({
  header: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-bg'],
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    gap: { default: 4, '@media (min-width: 700px)': 8 },
    insetBlockStart: 0,
    paddingBlock: 10,
    paddingInline: { default: 12, '@media (min-width: 800px)': 24 },
    position: 'sticky',
    zIndex: 20,
  },
  logo: {
    alignItems: 'center',
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-semibold'],
    gap: 8,
    letterSpacing: '-0.01em',
    textDecoration: 'none',
  },
  mark: { alignItems: 'center', color: accentTokens['--oniva-accent-500'], display: 'inline-flex', flexShrink: 0 },
  logoText: { display: { default: 'none', '@media (min-width: 700px)': 'inline' } },
  logoMuted: { color: colors['--oniva-color-text-muted'] },
  logoFont: { fontFamily: '"Outfit", ui-sans-serif, system-ui, sans-serif', fontWeight: 800, letterSpacing: '-0.01em' },
  // minWidth 0 + overflow lets the nav scroll instead of pushing the header past 390px (CI mobile overflow).
  nav: {
    alignItems: 'center',
    display: 'flex',
    gap: 2,
    marginInlineStart: { default: 0, '@media (min-width: 700px)': 8 },
    minWidth: 0,
    overflowX: 'auto',
    paddingBlock: 2,
    scrollbarWidth: 'none',
  },
  noShrink: { flexShrink: 0 },
  linkNoWrap: { flexShrink: 0, whiteSpace: 'nowrap' },
  link: {
    borderRadius: radius['--oniva-radius-lg'],
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--oniva-color-surface-inset-hover'],
    },
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    paddingBlock: 6,
    paddingInline: { default: 7, '@media (min-width: 700px)': 10 },
    textDecoration: 'none',
  },
  linkActive: { backgroundColor: colors['--oniva-color-surface-inset'] },
  hideSm: { display: { default: 'none', '@media (min-width: 900px)': 'flex' } },
  hideMd: { display: { default: 'none', '@media (min-width: 1100px)': 'flex' } },
  spacer: { flexGrow: 1 },
  search: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    gap: 8,
    height: 36,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingInline: 10,
    width: { default: 'auto', '@media (min-width: 900px)': 220 },
  },
  searchLabel: {
    display: { default: 'none', '@media (min-width: 900px)': 'inline' },
    flexGrow: 1,
    textAlign: 'start',
  },
  dots: { alignItems: 'center', gap: 6 },
  dot: {
    borderColor: colors['--oniva-color-bg'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 2,
    cursor: 'pointer',
    height: 20,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    padding: 0,
    width: 20,
  },
  dotActive: { boxShadow: `0 0 0 2px ${colors['--oniva-color-text']}` },
  dotColor: (c: string) => ({ backgroundColor: c }),
});

export interface HeaderProps {
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  accent: AccentName;
  onAccentChange: (a: AccentName) => void;
}

export function HeaderUtilities({ theme, onThemeChange, accent, onAccentChange }: HeaderProps) {
  const navigate = useNavigate();
  // The command-palette demo page owns ⌘K; avoid two palettes opening at once.
  const { pathname } = useLocation();
  const headerHotkey = pathname !== '/components/command-palette';
  const [open, setOpen] = useState(false);
  const groups = useMemo<CommandGroup[]>(
    () => [
      {
        id: 'pages',
        title: 'Pages',
        items: [
          { id: '/', label: 'Home' },
          { id: '/components', label: 'All components' },
          { id: '/charts', label: 'Charts gallery' },
          { id: '/canvas', label: 'Component canvas' },
          ...templates.map((t) => ({ id: `/templates/${t.slug}`, label: `Template: ${t.title}` })),
        ],
      },
      ...groupByCategory(demoModules).map(([cat, mods]) => ({
        id: cat,
        title: cat,
        items: mods.map((m) => ({
          id: `/components/${m.meta.slug}`,
          label: m.meta.title,
          keywords: [m.meta.slug],
        })),
      })),
    ],
    [],
  );
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  return (
    <>
      <button
        type="button"
        aria-label="Quick search"
        onClick={() => setOpen(true)}
        {...stylex.props(styles.search, styles.noShrink)}
      >
        <Search size={16} />
        <span {...stylex.props(styles.searchLabel)}>Quick search</span>
        <span {...stylex.props(styles.hideSm)}>
          <Kbd>⌘K</Kbd>
        </span>
      </button>
      <CommandPalette
        groups={groups}
        isOpen={open}
        onOpenChange={setOpen}
        hotkey={headerHotkey}
        placeholder="Jump to a component, chart or template…"
        onSelect={(item) => navigate(item.id)}
      />
      <div role="group" aria-label="Accent color" {...stylex.props(styles.dots, styles.hideMd)}>
        {accentNames.map((name) => (
          <RacButton
            key={name}
            aria-label={`${name} accent`}
            aria-pressed={accent === name}
            onPress={() => onAccentChange(name)}
            {...stylex.props(
              styles.dot,
              styles.dotColor(accentSwatches[name]),
              accent === name && styles.dotActive,
            )}
          />
        ))}
      </div>
      <Button
        variant="secondary"
        isIconOnly
        size="sm"
        aria-label="GitHub repository"
        onPress={() => window.open(SITE.github, '_blank', 'noopener')}
        xstyle={styles.hideMd}
      >
        <GithubIcon size={16} />
      </Button>
      <Button
        variant="secondary"
        isIconOnly
        size="sm"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onPress={() => onThemeChange(isDark ? 'light' : 'dark')}
        data-testid="theme-toggle"
        xstyle={styles.noShrink}
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
    </>
  );
}

export function Header({ theme, onThemeChange, accent, onAccentChange }: HeaderProps) {
  const navCls = ({ isActive }: { isActive: boolean }) =>
    stylex.props(styles.link, styles.linkNoWrap, isActive && styles.linkActive).className ?? '';
  return (
    <header {...stylex.props(styles.header)}>
      <Link to="/" {...stylex.props(styles.logo, styles.noShrink)} aria-label="oniva/ui home">
        <span {...stylex.props(styles.mark)}><OnivaMark size={22} /></span>
        <span {...stylex.props(styles.logoText, styles.logoFont)}>
          oniva<span {...stylex.props(styles.logoMuted)}>/ui</span>
        </span>
      </Link>
      <nav aria-label="Primary" {...stylex.props(styles.nav)}>
        <NavLink to="/components" className={navCls}>
          Components
        </NavLink>
        <NavLink to="/charts" className={navCls}>
          Charts
        </NavLink>
        <NavLink to="/canvas" className={navCls}>
          Canvas
        </NavLink>
        <NavLink to="/specs" className={navCls}>
          Specs
        </NavLink>
        <NavLink to="/foundations/motion" className={navCls}>
          Motion
        </NavLink>
        <NavLink to="/templates/dashboard" className={navCls}>
          Templates
        </NavLink>
        <a href={SITE.github} {...stylex.props(styles.link, styles.linkNoWrap, styles.hideSm)} rel="noreferrer">
          GitHub
        </a>
      </nav>
      <div {...stylex.props(styles.spacer)} />
      <HeaderUtilities theme={theme} onThemeChange={onThemeChange} accent={accent} onAccentChange={onAccentChange} />
    </header>
  );
}
