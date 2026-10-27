import * as stylex from '@stylexjs/stylex';
import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import { ArrowDownToLine, ArrowRight, BadgePercent, Plus, Repeat, X } from 'lucide-react';
import { useId, useMemo, useRef, useState, type ReactNode, type Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { Button } from '../Button';
import { DatePicker } from '../DatePicker';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { useGlideHeight } from '../../internal/m5-glide';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '../DropdownMenu';
import { NumberField } from '../NumberField';
import { Select, SelectItem } from '../Select';
import { VisuallyHidden } from '../VisuallyHidden';

const rowIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(-6px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const rowFade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const dateFade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

const styles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    overflow: 'hidden',
    color: colors['--oniva-color-text'],
    containerType: 'inline-size',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 0,
    width: '100%',
  },
  head: { display: 'flex', flexDirection: 'column', gap: 6, paddingBlockEnd: 16, paddingBlockStart: 20, paddingInline: 20 },
  title: { fontSize: font['--oniva-font-size-16'], fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  sub: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: font['--oniva-font-size-14'],
    gap: 8,
  },
  subName: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  section: { paddingBlockEnd: 20, paddingInline: 20 },
  bar: {
    alignItems: 'center',
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    paddingBlock: 12,
    paddingInline: 20,
  },
  barEnd: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  extras: {
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    paddingBlock: 16,
    paddingInline: 20,
  },
  foot: {
    alignItems: 'baseline',
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    paddingBlock: 16,
    paddingInline: 20,
  },
  footItem: {
    alignItems: 'baseline',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-14'],
    gap: 8,
  },
  footValue: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-20'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
  },
  repeatCell: { alignItems: 'center', color: colors['--oniva-color-text'], display: 'inline-flex', gap: 10 },
  repeatIcon: { color: colors['--oniva-color-icon-muted'] },
  priceMain: { fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-medium'] },
  priceUnit: { color: colors['--oniva-color-text-muted'], fontWeight: font['--oniva-font-weight-regular'] },
  priceNote: { color: colors['--oniva-color-text-muted'], display: 'block', fontSize: font['--oniva-font-size-13'], marginBlockStart: 4 },
  tableWrap: { overflowX: 'auto' },
  gridHalf: { display: 'grid', gap: 12, gridTemplateColumns: { default: 'repeat(2, minmax(0, 1fr))', '@container (max-width: 480px)': 'minmax(0, 1fr)' } },
  table: { borderCollapse: 'collapse', fontSize: font['--oniva-font-size-14'], width: '100%' },
  th: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: '0.06em',
    paddingBlock: 12,
    paddingInline: 20,
    textAlign: 'start',
    textTransform: 'uppercase',
  },
  thNum: { textAlign: 'end' },
  trHead: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderBlockColor: colors['--oniva-color-border'],
    borderBlockStyle: 'solid',
    borderBlockWidth: 1,
  },
  tr: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'backwards',
    animationName: { default: rowIn, [media.reducedMotion]: rowFade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
  },
  td: { paddingBlock: 16, paddingInline: 20, verticalAlign: 'middle' },
  tdNum: {
    fontVariantNumeric: 'tabular-nums',
    paddingBlock: 16,
    paddingInline: 20,
    textAlign: 'end',
    whiteSpace: 'nowrap',
  },
  narrow: { width: 112 },
  qtyField: { width: 104 },
  priceField: { width: 136 },
  name: { fontWeight: font['--oniva-font-weight-medium'] },
  empty: { color: colors['--oniva-color-text-muted'], paddingBlock: 20, textAlign: 'center' },
  remove: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-icon-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  endDate: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: dateFade, [media.reducedMotion]: 'none' },
  },
});

export type BillingRepeat = 'once' | 'monthly' | 'quarterly' | 'yearly';

export interface BillingCatalogItem {
  id: string;
  name: string;
  repeat: BillingRepeat;
  /** Unit price in `currency`. */
  price: number;
}
export interface BillingLine {
  id: string;
  name: string;
  repeat: BillingRepeat;
  price: number;
  quantity: number;
}
export interface BillingScheduleValue {
  phase: string;
  /** ISO date, yyyy-mm-dd. */
  start: string;
  durationMonths: number;
  lines: BillingLine[];
  discountPercent: number;
  minimum: number;
}
export interface BillingTotals {
  occurrences: Record<string, number>;
  lineTotals: Record<string, number>;
  subtotal: number;
  discount: number;
  /** Top-up added to reach the minimum commitment. */
  minimumTopUp: number;
  total: number;
  endDate: string;
}

const PERIOD: Record<BillingRepeat, number> = { once: 0, monthly: 1, quarterly: 3, yearly: 12 };
const REPEAT_LABEL: Record<BillingRepeat, string> = {
  once: 'One time',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
};

/** How many invoices a line produces in the phase (billed in advance). */
export function billingOccurrences(repeat: BillingRepeat, durationMonths: number): number {
  return repeat === 'once' ? 1 : Math.max(1, Math.ceil(durationMonths / PERIOD[repeat]));
}

/** Pure totals for a schedule: subtotal, percentage discount, minimum top-up and the end date. */
export function computeBilling(v: BillingScheduleValue): BillingTotals {
  const occurrences: Record<string, number> = {};
  const lineTotals: Record<string, number> = {};
  let subtotal = 0;
  for (const l of v.lines) {
    const n = billingOccurrences(l.repeat, v.durationMonths);
    occurrences[l.id] = n;
    lineTotals[l.id] = l.price * l.quantity * n;
    subtotal += lineTotals[l.id]!;
  }
  const discount = Math.round(subtotal * (v.discountPercent / 100) * 100) / 100;
  const net = subtotal - discount;
  const minimumTopUp = Math.max(0, v.minimum - net);
  const [y, m, d] = v.start.split('-').map(Number) as [number, number, number];
  const end = new CalendarDate(y, m, d).add({ months: v.durationMonths }).subtract({ days: 1 });
  return { occurrences, lineTotals, subtotal, discount, minimumTopUp, total: net + minimumTopUp, endDate: end.toString() };
}

export interface BillingScheduleProps {
  title?: ReactNode;
  /** Starting phase name (editable). */
  phase?: string;
  /** ISO 4217 code used for all amounts. Default `USD`. */
  currency?: string;
  /** Products offered under Add product. */
  catalog?: BillingCatalogItem[];
  defaultLines?: BillingLine[];
  /** yyyy-mm-dd. Default today. */
  defaultStart?: string;
  defaultDurationMonths?: number;
  defaultDiscountPercent?: number;
  defaultMinimum?: number;
  /** Show quantity and price steppers on each line instead of the read-only summary. Default false. */
  editableLines?: boolean;
  onChange?: (schedule: BillingScheduleValue, totals: BillingTotals) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const DURATIONS = [3, 6, 12, 24, 36];

/** Build one billing phase: start date, duration, product lines with repeat, discount, minimum and live totals. */
export function BillingSchedule({
  title = 'Create a billing schedule',
  phase = 'Build-out phase',
  currency = 'USD',
  catalog = [],
  defaultLines = [],
  defaultStart,
  defaultDurationMonths = 12,
  defaultDiscountPercent = 0,
  defaultMinimum = 0,
  editableLines = false,
  onChange,
  className,
  xstyle,
  ref,
}: BillingScheduleProps) {
  const fmt = useFormatters();
  const uid = useId();
  const seq = useRef(0);
  const [value, setValue] = useState<BillingScheduleValue>(() => ({
    phase,
    start: defaultStart ?? new CalendarDate(2026, 1, 1).toString(),
    durationMonths: defaultDurationMonths,
    lines: defaultLines,
    discountPercent: defaultDiscountPercent,
    minimum: defaultMinimum,
  }));
  const [announce, setAnnounce] = useState('');
  const [showDiscount, setShowDiscount] = useState(defaultDiscountPercent > 0);
  const [showMinimum, setShowMinimum] = useState(defaultMinimum > 0);
  const totals = useMemo(() => computeBilling(value), [value]);
  const money = (n: number) => fmt.currency(n, currency);
  const rolling = (n: number) => <AnimatedNumber value={n} format={{ style: 'currency', currency }} />;
  const tableRef = useRef<HTMLDivElement>(null);
  useGlideHeight(tableRef);

  const update = (patch: Partial<BillingScheduleValue>) => {
    const next = { ...value, ...patch };
    setValue(next);
    const t = computeBilling(next);
    onChange?.(next, t);
    setAnnounce(`Total ${money(t.total)}`);
  };
  const setLine = (id: string, patch: Partial<BillingLine>) =>
    update({ lines: value.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
  const addLine = (c: BillingCatalogItem) =>
    update({
      lines: [...value.lines, { id: `${uid}-${seq.current++}`, name: c.name, repeat: c.repeat, price: c.price, quantity: 1 }],
    });

  const [sy, sm, sd] = value.start.split('-').map(Number) as [number, number, number];
  const endLabel = fmt.date(new CalendarDate(...(totals.endDate.split('-').map(Number) as [number, number, number])).toDate(getLocalTimeZone()));

  const firstInvoice =
    Math.round(value.lines.reduce((n, l) => n + l.price * l.quantity, 0) * (1 - value.discountPercent / 100) * 100) / 100;
  const UNIT: Record<BillingRepeat, string> = { once: 'once', monthly: 'month', quarterly: 'quarter', yearly: 'year' };

  return (
    <div ref={ref} {...mergeSx(stylex.props(styles.root, xstyle), className)}>
      <div {...stylex.props(styles.head)}>
        <h3 {...stylex.props(styles.title)}>{title}</h3>
        <div {...stylex.props(styles.sub)}>
          <span {...stylex.props(styles.subName)}>{value.phase || 'Phase'}</span>
          <span aria-hidden="true">·</span>
          <span>{fmt.date(new CalendarDate(sy, sm, sd).toDate(getLocalTimeZone()))}</span>
          <ArrowRight size={14} aria-hidden="true" />
          <span key={totals.endDate} {...stylex.props(styles.endDate)}>
            {endLabel}
          </span>
        </div>
      </div>
      <div {...stylex.props(styles.section)}>
        <div {...stylex.props(styles.gridHalf)}>
          <DatePicker
            label="Start date"
            value={new CalendarDate(sy, sm, sd)}
            onChange={(d) => d && update({ start: d.toString() })}
          />
          <Select
            label="Duration"
            selectedKey={String(value.durationMonths)}
            onSelectionChange={(k) => update({ durationMonths: Number(k) })}
          >
            {DURATIONS.map((n) => (
              <SelectItem key={n} id={String(n)}>
                {fmt.plural(n, { one: '# month', other: '# months' })}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <div ref={tableRef} {...stylex.props(styles.tableWrap)}>
        <div>
          <table {...stylex.props(styles.table)}>
            <caption>
              <VisuallyHidden>Billing lines</VisuallyHidden>
            </caption>
            <thead>
              <tr {...stylex.props(styles.trHead)}>
                <th scope="col" {...stylex.props(styles.th)}>Name</th>
                <th scope="col" {...stylex.props(styles.th)}>Repeats</th>
                {editableLines && <th scope="col" {...stylex.props(styles.th, styles.thNum)}>Qty</th>}
                <th scope="col" {...stylex.props(styles.th, styles.thNum)}>Price</th>
                <th scope="col" {...stylex.props(styles.th)}>
                  <VisuallyHidden>Remove</VisuallyHidden>
                </th>
              </tr>
            </thead>
            <tbody>
              {value.lines.length === 0 && (
                <tr>
                  <td colSpan={editableLines ? 5 : 4} {...stylex.props(styles.empty)}>
                    No products yet. Add one to start the schedule.
                  </td>
                </tr>
              )}
              {value.lines.map((l) => (
                <tr key={l.id} {...stylex.props(styles.tr)}>
                  <td {...stylex.props(styles.td, styles.name)}>
                    {l.name}
                    {!editableLines && l.quantity > 1 && (
                      <span {...stylex.props(styles.priceUnit)}> × {fmt.number(l.quantity)}</span>
                    )}
                  </td>
                  <td {...stylex.props(styles.td)}>
                    <span {...stylex.props(styles.repeatCell)}>
                      <Repeat size={16} aria-hidden="true" {...stylex.props(styles.repeatIcon)} />
                      {l.repeat === 'once' ? 'Once' : `${REPEAT_LABEL[l.repeat]} × ${fmt.number(totals.occurrences[l.id] ?? 0)}`}
                    </span>
                  </td>
                  {editableLines && (
                    <td {...stylex.props(styles.td, styles.narrow)}>
                      <NumberField
                        aria-label={`Quantity for ${l.name}`}
                        xstyle={styles.qtyField}
                        size="sm"
                        minValue={1}
                        value={l.quantity}
                        onChange={(q) => Number.isFinite(q) && setLine(l.id, { quantity: q })}
                      />
                    </td>
                  )}
                  {editableLines ? (
                    <td {...stylex.props(styles.td)}>
                      <NumberField
                        aria-label={`Price for ${l.name}`}
                        xstyle={styles.priceField}
                        size="sm"
                        minValue={0}
                        value={l.price}
                        formatOptions={{ style: 'currency', currency }}
                        onChange={(p) => Number.isFinite(p) && setLine(l.id, { price: p })}
                      />
                    </td>
                  ) : (
                    <td {...stylex.props(styles.tdNum)}>
                      <span {...stylex.props(styles.priceMain)}>
                        {money(l.price * l.quantity)}
                        <span {...stylex.props(styles.priceUnit)}> / {UNIT[l.repeat]}</span>
                      </span>
                      <span {...stylex.props(styles.priceNote)}>Billed in advance</span>
                    </td>
                  )}
                  <td {...stylex.props(styles.td)}>
                    <AriaButton
                      aria-label={`Remove ${l.name}`}
                      onPress={() => update({ lines: value.lines.filter((x) => x.id !== l.id) })}
                      {...stylex.props(styles.remove, focus.ring)}
                    >
                      <X size={14} aria-hidden="true" />
                    </AriaButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div {...stylex.props(styles.bar)}>
        {catalog.length > 0 ? (
          <DropdownMenu>
            <Button variant="secondary" size="sm" startIcon={<Plus size={14} aria-hidden="true" />}>
              Add product
            </Button>
            <DropdownMenuContent
              aria-label="Add product"
              onAction={(k) => {
                const c = catalog.find((x) => x.id === k);
                if (c) addLine(c);
              }}
            >
              {catalog.map((c) => (
                <DropdownMenuItem key={c.id} id={c.id} textValue={c.name}>
                  {c.name} · {money(c.price)} {c.repeat === 'once' ? '' : REPEAT_LABEL[c.repeat].toLowerCase()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span />
        )}
        <div {...stylex.props(styles.barEnd)}>
          {!showDiscount && (
            <Button variant="secondary" size="sm" startIcon={<BadgePercent size={14} aria-hidden="true" />} onPress={() => setShowDiscount(true)}>
              Add discount
            </Button>
          )}
          {!showMinimum && (
            <Button variant="secondary" size="sm" startIcon={<ArrowDownToLine size={14} aria-hidden="true" />} onPress={() => setShowMinimum(true)}>
              Add minimum
            </Button>
          )}
        </div>
      </div>

      {(showDiscount || showMinimum) && (
        <div {...stylex.props(styles.extras)}>
          <div {...stylex.props(styles.gridHalf)}>
            {showDiscount && (
              <NumberField
                label="Discount"
                minValue={0}
                maxValue={100}
                value={value.discountPercent / 100}
                formatOptions={{ style: 'percent' }}
                onChange={(p) => update({ discountPercent: Number.isFinite(p) ? Math.round(p * 1000) / 10 : 0 })}
              />
            )}
            {showMinimum && (
              <NumberField
                label="Minimum commitment"
                minValue={0}
                value={value.minimum}
                formatOptions={{ style: 'currency', currency }}
                onChange={(m) => update({ minimum: Number.isFinite(m) ? m : 0 })}
              />
            )}
          </div>
        </div>
      )}

      <div {...stylex.props(styles.foot)}>
        <span {...stylex.props(styles.footItem)}>
          First invoice <span {...stylex.props(styles.footValue)}>{rolling(firstInvoice)}</span>
        </span>
        <span {...stylex.props(styles.footItem)}>
          Phase total <span {...stylex.props(styles.footValue)}>{rolling(totals.total)}</span>
        </span>
      </div>
      <VisuallyHidden>
        <span role="status" aria-live="polite">
          {announce}
        </span>
      </VisuallyHidden>
    </div>
  );
}
