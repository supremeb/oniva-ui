import type { DocPage } from './types';

const mods = import.meta.glob('./components/*.tsx', { eager: true }) as Record<
  string,
  { default?: DocPage; page?: DocPage }
>;

/** Doc pages keyed by slug. Add `components/<slug>.tsx` with a default `DocPage` export; nothing else to register. */
export const docPages: Record<string, DocPage> = {};
for (const m of Object.values(mods)) {
  const p = m.default ?? m.page;
  if (p) docPages[p.slug] = p;
}
export const getDocPage = (slug?: string) => (slug ? docPages[slug] : undefined);

/** Dev-time contract check: every playground control must have an `initial` value. */
if (import.meta.env.DEV) {
  for (const p of Object.values(docPages)) {
    for (const c of p.playground.controls) {
      if (p.playground.initial[c.key] === undefined) console.error(`[docs] ${p.slug}: control "${c.key}" has no initial value`);
    }
  }
}
