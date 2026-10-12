import type * as stylex from '@stylexjs/stylex';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Ref } from 'react';
import { Badge, type BadgeProps } from '../../components/Badge';

export interface DeltaBadgeProps extends Omit<BadgeProps, 'children' | 'variant' | 'dot'> {
  /** Change as a signed number (e.g. 14.8 means +14.8). */
  value: number;
  /** Suffix, default `%`. */
  suffix?: string;
  /** Fraction digits, default 1. */
  digits?: number;
  /** When lower is better (e.g. churn, latency), a negative delta is shown as good. */
  invert?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Signed change chip: green up / red down / neutral flat, with trend arrow. */
export function DeltaBadge({
  value,
  suffix = '%',
  digits = 1,
  invert = false,
  xstyle,
  ...rest
}: DeltaBadgeProps) {
  const flat = Math.abs(value) < 10 ** -digits / 2;
  const good = invert ? value < 0 : value > 0;
  const variant = flat ? 'neutral' : good ? 'success' : 'danger';
  const Icon = flat ? ArrowRight : value > 0 ? ArrowUpRight : ArrowDownRight;
  const text = `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(digits)}${suffix}`;
  return (
    <Badge variant={variant} shape="pill" xstyle={xstyle} {...rest}>
      <Icon size={12} aria-hidden="true" />
      {text}
    </Badge>
  );
}
