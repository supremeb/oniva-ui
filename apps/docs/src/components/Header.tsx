import * as stylex from '@stylexjs/stylex';
import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button as RacButton } from 'react-aria-components';
import { Button, accentNames, accentSwatches, type AccentName, type ThemeMode } from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';
import { shadow } from '@oniva-tokens/shadow.stylex';

const styles = stylex.create({
  header: {
    alignItems: 'center',
    backgroundColor: colors.bg,
    boxShadow: shadow.float,
    display: 'flex',
    gap: 16,
    insetBlockStart: 0,
    paddingBlock: 10,
    paddingInline: 24,
    position: 'sticky',
    zIndex: 10,
  },
  logo: {
    color: colors.text,
    fontSize: font.size16,
    fontWeight: font.weightSemibold,
    letterSpacing: '-0.01em',
    textDecoration: 'none',
  },
  logoMuted: { color: colors.textMuted },
  nav: { display: 'flex', gap: 4, marginInlineStart: 16 },
  link: {
    borderRadius: radius.lg,
    color: { default: colors.text, ':hover': colors.text },
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceInsetHover },
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    paddingBlock: 6,
    paddingInline: 10,
    textDecoration: 'none',
  },
  spacer: { flexGrow: 1 },
  dots: { alignItems: 'center', display: 'flex', gap: 6 },
  dot: {
    borderColor: colors.bg,
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: 2,
    cursor: 'pointer',
    height: 20,
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    padding: 0,
    width: 20,
  },
  dotActive: { boxShadow: `0 0 0 2px ${colors.text}` },
  dotColor: (c: string) => ({ backgroundColor: c }),
});

export interface HeaderProps {
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  accent: AccentName;
  onAccentChange: (a: AccentName) => void;
}

export function Header({ theme, onThemeChange, accent, onAccentChange }: HeaderProps) {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  return (
    <header {...stylex.props(styles.header)}>
      <Link to="/" {...stylex.props(styles.logo)} aria-label="oniva/ui home">
        oniva<span {...stylex.props(styles.logoMuted)}>/ui</span>
      </Link>
      <nav aria-label="Primary" {...stylex.props(styles.nav)}>
        <Link to="/components" {...stylex.props(styles.link)}>
          Components
        </Link>
      </nav>
      <div {...stylex.props(styles.spacer)} />
      <div role="group" aria-label="Accent color" {...stylex.props(styles.dots)}>
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
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onPress={() => onThemeChange(isDark ? 'light' : 'dark')}
        data-testid="theme-toggle"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
    </header>
  );
}
