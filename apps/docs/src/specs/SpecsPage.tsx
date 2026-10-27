import { useParams, Link } from 'react-router-dom';
import type { ThemeMode } from 'oniva-ui';
import { SpecStrip } from './kit/spec-strip';
import { findPoster, posters } from './registry';

export interface SpecsPageProps {
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
}

// Full-page layout, no docs header (like /canvas). The docs theme (light | dark | system) is resolved to the kit's
// light | dark; the strip's toolbar toggle writes back into the docs' persisted theme.
function useResolved(theme: ThemeMode): 'light' | 'dark' {
  return theme === 'dark' || (theme === 'system' && typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}

export function SpecsPage({ theme, onThemeChange }: SpecsPageProps) {
  const resolved = useResolved(theme);
  return (
    <SpecStrip theme={resolved} onTheme={onThemeChange} label="Component blueprints">
      {posters.map(({ slug, Component }) => (
        <Component key={`${slug}-${resolved}`} theme={resolved} />
      ))}
    </SpecStrip>
  );
}

export function SpecPosterPage({ theme }: Pick<SpecsPageProps, 'theme'>) {
  const { slug = '' } = useParams();
  const resolved = useResolved(theme);
  const poster = findPoster(slug);
  if (!poster) return <p style={{ padding: 24 }}>No blueprint called "{slug}". <Link to="/specs">All blueprints</Link></p>;
  const { Component } = poster;
  return <Component key={resolved} theme={resolved} />;
}
