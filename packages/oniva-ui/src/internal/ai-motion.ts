/** Shared helper: reduced-motion media string used across AI components. */
export const REDUCED = '@media (prefers-reduced-motion: reduce)';

/** Formats seconds as `12s` / `1m 05s`. */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;
}

/** Display host for a URL, without `www.`; falls back to the raw input. */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** Only allow navigable, non-script URLs. Returns `undefined` for anything else. */
export function safeUrl(href: string | undefined): string | undefined {
  if (!href) return undefined;
  const t = href.trim();
  if (t.startsWith('#') || t.startsWith('/')) return t;
  try {
    const u = new URL(t);
    return ['http:', 'https:', 'mailto:'].includes(u.protocol) ? t : undefined;
  } catch {
    return undefined;
  }
}

/** 820000 -> `820k`, 1000000 -> `1M`. */
export function compactNumber(n: number): string {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${+(n / 1_000).toFixed(n >= 100_000 ? 0 : 1)}k`;
  return String(n);
}
