import * as stylex from '@stylexjs/stylex';
import { Download, Undo2 } from 'lucide-react';
import { useState } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { Button } from '../../components/Button/Button';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { NumberField } from '../../components/NumberField/NumberField';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl/SegmentedControl';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { w8 } from '../../internal/w8-styles';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const NARROW = '@container (max-width: 560px)';

const drawCheck = stylex.keyframes({ from: { strokeDashoffset: 1 }, to: { strokeDashoffset: 0 } });
const popIn = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(4px) scale(0.96)' }, to: { opacity: 1, transform: 'translateY(0) scale(1)' } });

const styles = stylex.create({
  checkPath: {
    animationDelay: '80ms',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: drawCheck, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    fill: 'none',
    stroke: 'currentColor',
    strokeDasharray: 1,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2.5,
  },
  issuedIn: { animationDuration: motion['--oniva-motion-dur-enter'], animationName: { default: popIn, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-out'] },
  switch: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginBottom: 16 },
  stack: { display: 'grid', isolation: 'isolate' },
  sheet: {
    // inner surface is translucent in dark mode; paint it over the opaque page color so stacked sheets don't show through
    backgroundColor: colors['--oniva-color-bg'],
    backgroundImage: `linear-gradient(${colors['--oniva-color-surface-inner']}, ${colors['--oniva-color-surface-inner']})`,
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    gridArea: '1 / 1',
    minWidth: 0,
    padding: { default: 32, [NARROW]: 16 },
    transformOrigin: 'top center',
    transitionDuration: { default: motion['--oniva-motion-dur-slow'], [media.reducedMotion]: '0.01ms' },
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  front: { opacity: 1, transform: 'translateY(0) scale(1)', zIndex: 2 },
  back: { opacity: 0.55, pointerEvents: 'none', transform: 'translateY(-14px) scale(0.97)', userSelect: 'none', zIndex: 1 },
  parties: { display: 'grid', gap: 24, gridTemplateColumns: { default: 'repeat(2, minmax(0, 1fr))', [NARROW]: 'minmax(0, 1fr)' } },
  party: { fontSize: font['--oniva-font-size-13'], lineHeight: 1.6, overflowWrap: 'anywhere' },
  label: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-regular'] },
  partyLabel: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-semibold'], marginBottom: 8 },
  big: { fontSize: font['--oniva-font-size-40'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-semibold'], letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 },
  headRow: { alignItems: 'flex-start', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  due: { alignItems: 'baseline', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-13'], gap: 16, marginTop: 8 },
  brand: { alignItems: 'center', display: 'inline-flex', fontSize: font['--oniva-font-size-14'], gap: 8, paddingBlockStart: 8 },
  brandDot: { backgroundColor: colors['--oniva-color-accent-text'], borderRadius: radius['--oniva-radius-full'], boxShadow: `inset 0 0 0 5px ${colors['--oniva-color-accent-text']}, inset 0 0 0 7px ${colors['--oniva-color-surface-inner']}`, height: 22, width: 22 },
  toolRight: { alignItems: 'center', display: 'flex', gap: 8 },
  terms: { display: 'grid', columnGap: 24, gridTemplateColumns: 'minmax(96px, 160px) minmax(0, 1fr)', margin: 0, rowGap: 6 },
  termRow: { display: 'contents' },
  termV: { fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums', margin: 0 },
  table: { borderCollapse: 'collapse', fontSize: font['--oniva-font-size-13'], width: '100%' },
  th: { borderBottomColor: colors['--oniva-color-border'], borderBottomStyle: 'solid', borderBottomWidth: 1, color: colors['--oniva-color-text-muted'], fontWeight: font['--oniva-font-weight-medium'], padding: '6px 4px', textAlign: 'start' },
  td: { borderBottomColor: colors['--oniva-color-separator'], borderBottomStyle: 'solid', borderBottomWidth: 1, fontVariantNumeric: 'tabular-nums', padding: '8px 4px', verticalAlign: 'top' },
  dd: { margin: 0 },
  right: { textAlign: 'end' },
  hideNarrow: { display: { default: 'table-cell', [NARROW]: 'none' } },
  group: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-semibold'], padding: '10px 4px 2px', textAlign: 'start' },
  totals: { alignSelf: 'flex-end', display: 'grid', gap: 4, gridTemplateColumns: 'auto auto', fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums', margin: 0, minWidth: 220, maxWidth: '100%' },
  grand: { fontSize: font['--oniva-font-size-16'], fontWeight: font['--oniva-font-weight-semibold'] },
  fieldset: { borderWidth: 0, margin: 0, minWidth: 0, padding: 0 },
  tray: { display: 'flex', flexDirection: 'column', gap: 10 },
  trayRow: { alignItems: 'center', columnGap: 12, display: 'grid', gridTemplateColumns: { default: 'minmax(0, 1fr) 140px auto', [NARROW]: 'minmax(0, 1fr) 120px' }, rowGap: 6 },
  trayTotal: { display: { default: 'block', [NARROW]: 'none' }, fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums', textAlign: 'end' },
  actions: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  issued: { alignItems: 'center', color: colors['--oniva-color-success-fg'], display: 'inline-flex', fontSize: font['--oniva-font-size-13'], gap: 6 },
});

export interface InvoiceLine {
  id: string;
  name: string;
  qty: number;
  rate: number;
  /** Tax ratio, e.g. `0.2` for 20%. */
  tax: number;
  /** Lines with a group are listed under that heading. */
  group?: string;
}
export interface InvoiceParty {
  name: string;
  lines: string[];
}

export interface InvoiceCreditProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'onSelect'> {
  seller?: InvoiceParty;
  buyer?: InvoiceParty;
  invoiceNo?: string;
  creditNo?: string;
  invoiceDate?: string;
  dueDate?: string;
  period?: string;
  lines?: InvoiceLine[];
  /** ISO currency. Default `USD`. */
  currency?: string;
  /** Called when the credit note is issued, with the credited amount (ex tax) per line id and the total incl. tax. */
  onIssue?: (credits: Record<string, number>, total: number) => void;
  /** Called by the PDF button; defaults to the browser print dialog. */
  onDownload?: () => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

const defaultLines: InvoiceLine[] = [
  { id: 'l1', name: 'Team plan, 12 seats', qty: 12, rate: 99, tax: 0.08, group: 'Subscription' },
  { id: 'l2', name: 'Extra traced runs (100k)', qty: 3, rate: 40, tax: 0.08, group: 'Subscription' },
  { id: 'l3', name: 'Onboarding workshop', qty: 1, rate: 1200, tax: 0.08, group: 'Services' },
  { id: 'l4', name: 'Priority support, quarterly', qty: 1, rate: 450, tax: 0.08, group: 'Services' },
];

export function InvoiceCredit({
  seller = { name: 'Oniva Inc.', lines: ['410 Market Street', 'Atlanta, GA 30303'] },
  buyer = { name: 'Northwind Labs', lines: ['Attn: Accounts payable', '88 Harbor Way, Savannah, GA 31401'] },
  invoiceNo = 'INV-2026-0418',
  creditNo = 'CN-2026-0047',
  invoiceDate = '2026-10-01',
  dueDate = '2026-10-31',
  period = 'Oct 2026',
  lines = defaultLines,
  currency = 'USD',
  onIssue,
  onDownload,
  className,
  xstyle,
  ref,
  ...rest
}: InvoiceCreditProps) {
  const { currency: money, date } = useFormatters();
  const [view, setView] = useState<'invoice' | 'credit'>('invoice');
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [issued, setIssued] = useState(false);
  const fmt = (n: number) => money(n, currency);
  const d = (iso: string) => date(new Date(`${iso}T00:00:00`), { month: 'short', day: 'numeric', year: 'numeric' });
  const lineTotal = (l: InvoiceLine) => l.qty * l.rate;
  const sub = lines.reduce((a, l) => a + lineTotal(l), 0);
  const tax = lines.reduce((a, l) => a + lineTotal(l) * l.tax, 0);
  const creditSub = lines.reduce((a, l) => a + (picked[l.id] ?? 0), 0);
  const creditTax = lines.reduce((a, l) => a + (picked[l.id] ?? 0) * l.tax, 0);
  const creditTotal = creditSub + creditTax;
  const sx = stylex.props(w8.root, xstyle);
  const groups = [...new Set(lines.map((l) => l.group ?? ''))];

  const parties = (
    <div {...stylex.props(styles.parties)}>
      {[
        ['From', seller],
        ['To', buyer],
      ].map(([k, p]) => (
        <div key={k as string} {...stylex.props(styles.party)}>
          <div {...stylex.props(styles.partyLabel)}>{k as string}</div>
          <div>{(p as InvoiceParty).name}</div>
          {(p as InvoiceParty).lines.map((x) => (
            <div key={x}>{x}</div>
          ))}
        </div>
      ))}
    </div>
  );
  const terms = (no: string, label: string) => (
    <dl {...stylex.props(styles.terms)}>
      {[
        [label, no],
        ['Issue date', d(invoiceDate)],
        ['Due date', d(dueDate)],
        ['Billing period', period],
      ].map(([k, v]) => (
        <div key={k} {...stylex.props(styles.termRow)}>
          <dt {...stylex.props(styles.label)}>{k}</dt>
          <dd {...stylex.props(styles.termV)}>{v}</dd>
        </div>
      ))}
    </dl>
  );

  return (
    <section ref={ref} aria-label="Invoice and credit note" {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.switch)}>
        <SegmentedControl size="sm" aria-label="Document" value={view} onChange={(v) => setView(v as 'invoice' | 'credit')}>
          <SegmentedControlItem value="invoice">Invoice</SegmentedControlItem>
          <SegmentedControlItem value="credit">Credit note</SegmentedControlItem>
        </SegmentedControl>
        <div {...stylex.props(styles.toolRight)}>
          <Button size="sm" variant="secondary" startIcon={<Download size={14} aria-hidden="true" />} onPress={() => (onDownload ? onDownload() : typeof window !== 'undefined' && window.print?.())}>
            PDF
          </Button>
          <Button size="sm" variant="secondary" startIcon={<Undo2 size={14} aria-hidden="true" />} isDisabled={view === 'credit'} onPress={() => setView('credit')}>
            Credit invoice
          </Button>
        </div>
      </div>
      <div {...stylex.props(styles.stack)}>
        <article aria-label={`Invoice ${invoiceNo}`} aria-hidden={view !== 'invoice' || undefined} inert={view !== 'invoice'} {...stylex.props(styles.sheet, view === 'invoice' ? styles.front : styles.back)}>
          <h2 {...stylex.props(w8.srOnly)}>Invoice</h2>
          <div {...stylex.props(styles.headRow)}>
            <div>
              <p {...stylex.props(styles.big)}>{fmt(sub + tax)}</p>
              <p {...stylex.props(styles.due)}>Due {d(dueDate)}</p>
            </div>
            <span {...stylex.props(styles.brand)}>
              <span aria-hidden="true" {...stylex.props(styles.brandDot)} />
              {seller.name}
            </span>
          </div>
          {parties}
          {terms(invoiceNo, 'Invoice no')}
          <table {...stylex.props(styles.table)}>
            <caption {...stylex.props(w8.srOnly)}>Invoice lines</caption>
            <thead>
              <tr>
                <th scope="col" {...stylex.props(styles.th)}>Item</th>
                <th scope="col" {...stylex.props(styles.th, styles.right)}>Qty</th>
                <th scope="col" {...stylex.props(styles.th, styles.right, styles.hideNarrow)}>Rate</th>
                <th scope="col" {...stylex.props(styles.th, styles.right, styles.hideNarrow)}>Tax</th>
                <th scope="col" {...stylex.props(styles.th, styles.right)}>Amount</th>
              </tr>
            </thead>
            {groups.map((g) => (
              <tbody key={g}>
                {g && (
                  <tr>
                    <th colSpan={5} scope="colgroup" {...stylex.props(styles.group)}>{g}</th>
                  </tr>
                )}
                {lines.filter((l) => (l.group ?? '') === g).map((l) => (
                  <tr key={l.id}>
                    <td {...stylex.props(styles.td)}>{l.name}</td>
                    <td {...stylex.props(styles.td, styles.right)}>{l.qty}</td>
                    <td {...stylex.props(styles.td, styles.right, styles.hideNarrow)}>{fmt(l.rate)}</td>
                    <td {...stylex.props(styles.td, styles.right, styles.hideNarrow)}>{Math.round(l.tax * 100)}%</td>
                    <td {...stylex.props(styles.td, styles.right)}>{fmt(lineTotal(l))}</td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
          <dl {...stylex.props(styles.totals)}>
            <dt>Subtotal</dt>
            <dd {...stylex.props(styles.right, styles.dd)}>{fmt(sub)}</dd>
            <dt>Tax</dt>
            <dd {...stylex.props(styles.right, styles.dd)}>{fmt(tax)}</dd>
            <dt {...stylex.props(styles.grand)}>Total</dt>
            <dd {...stylex.props(styles.right, styles.grand, styles.dd)}>{fmt(sub + tax)}</dd>
          </dl>
        </article>
        <article aria-label={`Credit note ${creditNo}`} aria-hidden={view !== 'credit' || undefined} inert={view !== 'credit'} {...stylex.props(styles.sheet, view === 'credit' ? styles.front : styles.back)}>
          <h2 {...stylex.props(w8.title)}>Credit note</h2>
          {parties}
          {terms(creditNo, 'Credit no.')}
          <fieldset {...stylex.props(styles.tray, styles.fieldset)} disabled={issued}>
            <legend {...stylex.props(w8.h3)}>Lines to credit</legend>
            {lines.map((l) => {
              const on = picked[l.id] !== undefined;
              return (
                <div key={l.id} {...stylex.props(styles.trayRow)}>
                  <Checkbox
                    isSelected={on}
                    onChange={(sel) =>
                      setPicked((p) => {
                        const n = { ...p };
                        if (sel) n[l.id] = lineTotal(l);
                        else delete n[l.id];
                        return n;
                      })
                    }
                  >
                    {l.name}
                  </Checkbox>
                  <NumberField
                    aria-label={`Credit amount for ${l.name}`}
                    size="sm"
                    isDisabled={!on || issued}
                    minValue={0}
                    maxValue={lineTotal(l)}
                    value={picked[l.id] ?? 0}
                    onChange={(v) => setPicked((p) => (p[l.id] === undefined ? p : { ...p, [l.id]: Number.isNaN(v) ? 0 : Math.min(lineTotal(l), Math.max(0, v)) }))}
                    formatOptions={{ style: 'currency', currency }}
                  />
                  <span {...stylex.props(styles.trayTotal)}>{fmt(lineTotal(l))}</span>
                </div>
              );
            })}
          </fieldset>
          <div {...stylex.props(styles.actions)}>
            <span role="status" {...stylex.props(styles.grand, w8.num)}>
              Credit total <AnimatedNumber value={creditTotal} format={{ style: 'currency', currency }} />
            </span>
            {issued ? (
              <span {...stylex.props(styles.issued, styles.issuedIn)}>
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M4 12.5l5 5L20 6.5" pathLength={1} {...stylex.props(styles.checkPath)} />
                </svg>{' '}
                Issued as {creditNo}
              </span>
            ) : (
              <Button
                isDisabled={creditSub <= 0}
                onPress={() => {
                  setIssued(true);
                  onIssue?.(picked, creditTotal);
                }}
              >
                Issue credit note
              </Button>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
