import type { SheetColumn } from './types';

export function parseDate(v: unknown): Date | null {
  if (v instanceof Date) return v;
  if (typeof v === 'number') return new Date(v);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v ?? ''));
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(String(v ?? ''));
  return Number.isNaN(d.getTime()) ? null : d;
}

function isoDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function isColEditable(col: SheetColumn | undefined, sheetEditable: boolean): boolean {
  return sheetEditable && !!col && col.editable !== false;
}

/** Raw text shown in an editor for a value. */
export function editText(value: unknown, col: SheetColumn): string {
  if (value === undefined || value === null) return '';
  if (col.type === 'date') {
    const d = parseDate(value);
    return d ? isoDate(d) : String(value);
  }
  return String(value);
}

export type ParsedCell = { ok: true; value: unknown } | { ok: false };

/** Validate + convert user text for a column. Empty text clears the cell. */
export function parseCellInput(text: string, col: SheetColumn): ParsedCell {
  const t = text.trim();
  switch (col.type) {
    case 'number': {
      if (t === '') return { ok: true, value: undefined };
      const n = Number(t.replace(/,/g, ''));
      return Number.isFinite(n) ? { ok: true, value: n } : { ok: false };
    }
    case 'date': {
      if (t === '') return { ok: true, value: undefined };
      const d = parseDate(t);
      return d ? { ok: true, value: isoDate(d) } : { ok: false };
    }
    case 'tag': {
      if (t === '') return { ok: true, value: undefined };
      if (col.options) {
        const hit = col.options.find((o) => o.toLowerCase() === t.toLowerCase());
        return hit ? { ok: true, value: hit } : { ok: false };
      }
      return { ok: true, value: t };
    }
    default:
      return { ok: true, value: text === '' ? undefined : text };
  }
}
