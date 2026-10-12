import { useMemo } from 'react';
import { useLocale } from 'react-aria';

/**
 * Locale-aware formatting + pluralisation shared by every component.
 * Never hard-code `en-US`, `$` or `=== 1 ? '' : 's'` in components; use these.
 * Locale comes from React Aria's I18nProvider (falls back to the browser locale).
 */

export interface PluralForms {
  one: string;
  other: string;
  zero?: string;
  two?: string;
  few?: string;
  many?: string;
}

/** `pluralize(3, { one: '# source', other: '# sources' })` → "3 sources". `#` is replaced by the formatted count. */
export function pluralize(count: number, forms: PluralForms, locale = 'en-US'): string {
  if (count === 0 && forms.zero) return forms.zero.replace('#', '0');
  const rule = new Intl.PluralRules(locale).select(count) as keyof PluralForms;
  const template = forms[rule] ?? forms.other;
  return template.replace('#', new Intl.NumberFormat(locale).format(count));
}

export interface Formatters {
  locale: string;
  number: (n: number, opts?: Intl.NumberFormatOptions) => string;
  compact: (n: number) => string;
  percent: (ratio: number, digits?: number) => string;
  currency: (n: number, currency?: string, opts?: Intl.NumberFormatOptions) => string;
  date: (d: Date | number, opts?: Intl.DateTimeFormatOptions) => string;
  plural: (count: number, forms: PluralForms) => string;
}

export function createFormatters(locale: string): Formatters {
  return {
    locale,
    number: (n, opts) => new Intl.NumberFormat(locale, opts).format(n),
    compact: (n) => new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(n),
    percent: (ratio, digits = 0) =>
      new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: digits }).format(ratio),
    currency: (n, currency = 'USD', opts) =>
      new Intl.NumberFormat(locale, { style: 'currency', currency, ...opts }).format(n),
    date: (d, opts = { month: 'short', day: 'numeric', year: 'numeric' }) =>
      new Intl.DateTimeFormat(locale, opts).format(d),
    plural: (count, forms) => pluralize(count, forms, locale),
  };
}

/** Hook form: picks up the active React Aria locale. */
export function useFormatters(): Formatters {
  const { locale } = useLocale();
  return useMemo(() => createFormatters(locale), [locale]);
}
