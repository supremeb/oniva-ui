/** Realistic demo data shared by the dashboard-extras demos. */
export const people = [
  { id: 'pn', name: 'Priya Nair' },
  { id: 'mo', name: 'Marcus Okafor' },
  { id: 'ls', name: 'Lena Schmidt' },
  { id: 'dk', name: 'Daniel Kim' },
  { id: 'ar', name: 'Aisha Rahman' },
  { id: 'tb', name: 'Tomás Barros' },
] as const;

export function personName(id: string): string {
  return people.find((p) => p.id === id)?.name ?? id;
}

/** Formats a number with Intl; shared by DataGrid + KpiStrip + InvoiceCard. */
export function fmt(value: number, kind: 'number' | 'currency' | 'percent' | 'compact' = 'number') {
  const opts: Intl.NumberFormatOptions =
    kind === 'currency'
      ? { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }
      : kind === 'percent'
        ? { style: 'percent', maximumFractionDigits: 1 }
        : kind === 'compact'
          ? { notation: 'compact', maximumFractionDigits: 1 }
          : { maximumFractionDigits: 2 };
  return new Intl.NumberFormat('en-US', opts).format(value);
}
