/** "5 minutes ago" / "in 2 days" from a Date/number/ISO string, locale-aware. */
export function formatRelative(value: Date | number | string, locale: string, now = Date.now()): string {
  const t = new Date(value).getTime();
  const diff = Math.round((t - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const abs = Math.abs(diff);
  if (abs < 45) return rtf.format(0, 'second');
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), 'day');
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(t);
}
