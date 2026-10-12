import * as stylex from '@stylexjs/stylex';
import { Download } from 'lucide-react';
import type { HTMLAttributes, Ref } from 'react';
import { Badge, type BadgeVariant } from '../../components/Badge';
import { Button } from '../../components/Button';
import { dash } from '../../internal/dash-styles';
import { mergeSx } from '../../internal/sx';
import { createFormatters, useFormatters } from '../../internal/format';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

export type InvoiceStatus = 'paid' | 'due' | 'overdue' | 'draft';
export interface InvoiceLine {
  description: string;
  quantity: number;
  /** Unit price in major currency units. */
  unitPrice: number;
}
export interface Invoice {
  number: string;
  status: InvoiceStatus;
  /** ISO dates. */
  issued: string;
  due: string;
  billTo: { name: string; email: string; address?: string };
  lines: InvoiceLine[];
  /** Tax rate, e.g. 0.0825. */
  taxRate?: number;
  currency?: string;
}

const statusVariant: Record<InvoiceStatus, BadgeVariant> = { paid: 'success', due: 'info', overdue: 'danger', draft: 'neutral' };
const statusLabel: Record<InvoiceStatus, string> = { paid: 'Paid', due: 'Due', overdue: 'Overdue', draft: 'Draft' };

const styles = stylex.create({
  card: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-xxl'],
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxWidth: 440,
    padding: 8,
  },
  head: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between', padding: '4px 8px' },
  number: { fontSize: font['--oniva-font-size-16'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  tile: {
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-xl'],
    boxShadow: shadow['--oniva-shadow-xs'],
    padding: 16,
  },
  meta: { display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr', margin: 0 },
  dt: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], margin: 0 },
  dd: { margin: 0, marginTop: 2 },
  table: { borderCollapse: 'collapse', width: '100%' },
  th: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-medium'], paddingBlock: 6, textAlign: 'start' },
  td: { borderTopColor: colors['--oniva-color-separator'], borderTopStyle: 'solid', borderTopWidth: 1, paddingBlock: 8, verticalAlign: 'top' },
  r: { textAlign: 'end' },
  totals: { display: 'flex', flexDirection: 'column', gap: 6, margin: 0, marginTop: 8 },
  trow: { display: 'flex', justifyContent: 'space-between' },
  grand: { borderTopColor: colors['--oniva-color-border'], borderTopStyle: 'solid', borderTopWidth: 1, fontSize: font['--oniva-font-size-16'], fontWeight: font['--oniva-font-weight-semibold'], paddingTop: 8 },
  actions: { display: 'flex', gap: 8, padding: 4 },
  grow: { flexGrow: 1 },
  dd0: { margin: 0 },
});

function money(n: number, currency = 'USD', locale = 'en-US') {
  return createFormatters(locale).currency(n, currency);
}
function date(iso: string, locale = 'en-US') {
  const [y, m, d] = iso.split('-').map(Number);
  return createFormatters(locale).date(new Date(y!, m! - 1, d));
}

/** Totals helper (exported for tests). */
export function invoiceTotals(inv: Pick<Invoice, 'lines' | 'taxRate'>) {
  const subtotal = inv.lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const tax = Math.round(subtotal * (inv.taxRate ?? 0) * 100) / 100;
  return { subtotal, tax, total: subtotal + tax };
}

export interface InvoiceCardProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** BCP 47 locale for money/dates. Defaults to the active React Aria locale. */
  locale?: string;
  invoice: Invoice;
  onPay?: () => void;
  onDownload?: () => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function InvoiceCard({ invoice, onPay, onDownload, locale, className, xstyle, ref, ...rest }: InvoiceCardProps) {
  const loc = useFormatters().locale;
  const L = locale ?? loc;
  const { subtotal, tax, total } = invoiceTotals(invoice);
  const c = invoice.currency;
  const sx = stylex.props(dash.root, styles.card, xstyle);
  return (
    <article aria-label={`Invoice ${invoice.number}`} {...rest} ref={ref} {...mergeSx(sx, className)}>
      <header {...stylex.props(styles.head)}>
        <h3 {...stylex.props(styles.number, dash.num)}>Invoice {invoice.number}</h3>
        <Badge dot variant={statusVariant[invoice.status]}>
          {statusLabel[invoice.status]}
        </Badge>
      </header>
      <div {...stylex.props(styles.tile)}>
        <dl {...stylex.props(styles.meta)}>
          <div>
            <dt {...stylex.props(styles.dt)}>Billed to</dt>
            <dd {...stylex.props(styles.dd)}>
              <span {...stylex.props(dash.title)}>{invoice.billTo.name}</span>
              <br />
              {invoice.billTo.email}
            </dd>
          </div>
          <div>
            <dt {...stylex.props(styles.dt)}>Dates</dt>
            <dd {...stylex.props(styles.dd, dash.num)}>
              Issued {date(invoice.issued, L)}
              <br />
              Due {date(invoice.due, L)}
            </dd>
          </div>
        </dl>
      </div>
      <div {...stylex.props(styles.tile)}>
        <table {...stylex.props(styles.table)}>
          <thead>
            <tr>
              <th scope="col" {...stylex.props(styles.th)}>Item</th>
              <th scope="col" {...stylex.props(styles.th, styles.r)}>Qty</th>
              <th scope="col" {...stylex.props(styles.th, styles.r)}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lines.map((l) => (
              <tr key={l.description}>
                <td {...stylex.props(styles.td)}>{l.description}</td>
                <td {...stylex.props(styles.td, styles.r, dash.num)}>{l.quantity}</td>
                <td {...stylex.props(styles.td, styles.r, dash.num)}>{money(l.quantity * l.unitPrice, c, L)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl {...stylex.props(styles.totals, dash.num)}>
          <div {...stylex.props(styles.trow)}>
            <dt>Subtotal</dt>
            <dd {...stylex.props(styles.dd0)}>{money(subtotal, c, L)}</dd>
          </div>
          <div {...stylex.props(styles.trow)}>
            <dt>Tax{invoice.taxRate ? ` (${(invoice.taxRate * 100).toFixed(2).replace(/\.?0+$/, '')}%)` : ''}</dt>
            <dd {...stylex.props(styles.dd0)}>{money(tax, c, L)}</dd>
          </div>
          <div {...stylex.props(styles.trow, styles.grand)}>
            <dt>Total</dt>
            <dd {...stylex.props(styles.dd0)}>{money(total, c, L)}</dd>
          </div>
        </dl>
      </div>
      <div {...stylex.props(styles.actions)}>
        <Button variant="secondary" startIcon={<Download size={16} aria-hidden="true" />} onPress={onDownload}>
          Download PDF
        </Button>
        {invoice.status !== 'paid' && (
          <Button xstyle={styles.grow} onPress={onPay}>
            Pay {money(total, c, L)}
          </Button>
        )}
      </div>
    </article>
  );
}
