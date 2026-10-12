import * as stylex from '@stylexjs/stylex';
import { InlineSelect, type SelectOption } from '../../internal/data-table-select';
import { tableStyles as s } from '../../internal/data-table-styles';
import { radius } from '../../tokens/radius.stylex';
import { Avatar } from '../Avatar';
import { Badge, type BadgeVariant } from '../Badge';

export function CustomerCell({ name, src, email }: { name: string; src?: string; email?: string }) {
  return (
    <span {...stylex.props(s.customer)}>
      <Avatar name={name} src={src} size="sm" />
      <span>
        {name}
        {email && <span {...stylex.props(s.muted)}> {email}</span>}
      </span>
    </span>
  );
}

export interface StatusSelectCellProps {
  value: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
  'aria-label'?: string;
}

/** Inline select with a colored dot, label and chevron. */
export function StatusSelectCell({
  value,
  options,
  onChange,
  'aria-label': label = 'Status',
}: StatusSelectCellProps) {
  return (
    <InlineSelect
      size="sm"
      aria-label={label}
      value={value}
      options={options}
      onChange={(v) => onChange?.(v)}
    />
  );
}

const chip = stylex.create({
  square: { borderRadius: radius['--oniva-radius-sm'], paddingInline: 8 },
});

export function StatusBadgeCell({
  label,
  variant = 'neutral',
}: {
  label: string;
  variant?: BadgeVariant;
}) {
  return (
    <Badge variant={variant} shape="square" xstyle={chip.square}>
      {label}
    </Badge>
  );
}

export function DateCell({ value, locale = 'en-US' }: { value: Date | string; locale?: string }) {
  const d = typeof value === 'string' ? new Date(value) : value;
  const text = d.toLocaleDateString(locale, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
  return <time dateTime={d.toISOString()}>{text}</time>;
}

export function PriceCell({
  value,
  currency = 'USD',
  locale = 'en-US',
}: {
  value: number;
  currency?: string;
  locale?: string;
}) {
  return (
    <span {...stylex.props(s.pricePill)}>
      {value.toLocaleString(locale, { style: 'currency', currency })}
    </span>
  );
}
