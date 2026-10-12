import { useRef } from 'react';
import type { AccentName, ThemeMode } from 'oniva-ui';
import { Hero } from '../landing/Hero';
import { Showcase } from '../landing/Showcase';
import { Agents, Bento, Cta, Footer, Index, MotionStrip, Theming } from '../landing/Sections';
import { usePalette } from '../landing/gate';

export interface HomeProps {
  theme: ThemeMode;
  accent: AccentName;
  onAccentChange: (a: AccentName) => void;
  onThemeChange: (t: ThemeMode) => void;
  isDark: boolean;
}

export function Home({ accent, onAccentChange, theme, onThemeChange, isDark }: HomeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const palette = usePalette(ref);
  return (
    <div ref={ref}>
      <Hero accent={accent} onAccentChange={onAccentChange} hex={palette.a500} />
      <Showcase />
      <Bento />
      <MotionStrip />
      <Theming accent={accent} onAccentChange={onAccentChange} theme={theme} isDark={isDark} onThemeChange={onThemeChange} />
      <Agents />
      <Index />
      <Cta />
      <Footer />
    </div>
  );
}
