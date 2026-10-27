import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import { CalendarDate, getLocalTimeZone, startOfMonth, startOfYear, today } from '@internationalized/date';
import type { DateValue, RangeValue } from 'react-aria-components';
import { useRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { DateRangePicker } from '../DateRangePicker';
import { RangeCalendar } from '../RangeCalendar';
import { dash } from '../../internal/dash-styles';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

export type PresetId = 'today' | 'last7' | 'mtd' | 'qtd' | 'ytd' | 'custom';
export type DateRange = RangeValue<DateValue>;

export const PRESETS: { id: Exclude<PresetId, 'custom'>; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'last7', label: 'Last 7 days' },
  { id: 'mtd', label: 'Month to date' },
  { id: 'qtd', label: 'Quarter to date' },
  { id: 'ytd', label: 'Year to date' },
];

/** Resolves a preset to a concrete range relative to `now`. */
export function presetRange(id: Exclude<PresetId, 'custom'>, now: CalendarDate): RangeValue<CalendarDate> {
  switch (id) {
    case 'today':
      return { start: now, end: now };
    case 'last7':
      return { start: now.subtract({ days: 6 }), end: now };
    case 'mtd':
      return { start: startOfMonth(now), end: now };
    case 'qtd':
      return { start: new CalendarDate(now.year, Math.floor((now.month - 1) / 3) * 3 + 1, 1), end: now };
    case 'ytd':
      return { start: startOfYear(now), end: now };
  }
}

/** Which preset (if any) a range corresponds to. */
export function matchPreset(value: DateRange | null | undefined, now: CalendarDate): PresetId | null {
  if (!value) return null;
  for (const p of PRESETS) {
    const r = presetRange(p.id, now);
    if (value.start.compare(r.start) === 0 && value.end.compare(r.end) === 0) return p.id;
  }
  return 'custom';
}

const styles = stylex.create({
  root: { alignItems: 'flex-start', display: 'flex', flexWrap: 'wrap', gap: 16 },
  list: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-xl'],
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 168,
    padding: 6,
  },
  item: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    font: 'inherit',
    fontWeight: font['--oniva-font-weight-medium'],
    height: 32,
    paddingInline: 10,
    textAlign: 'start',
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'background-color',
  },
  selected: {
    backgroundColor: colors['--oniva-color-surface'],
    boxShadow: 'none',
  },
  main: { display: 'flex', flexDirection: 'column', gap: 12 },
});

export interface DateRangePresetsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'onChange'> {
  value: DateRange | null;
  onChange: (value: DateRange | null) => void;
  /** Reference date for presets. Defaults to today in the local zone. */
  now?: CalendarDate;
  label?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function DateRangePresets({ value, onChange, now, label = 'Date range', className, xstyle, ref, ...rest }: DateRangePresetsProps) {
  const ref0 = now ?? today(getLocalTimeZone());
  const calRef = useRef<HTMLDivElement>(null);
  const current = matchPreset(value, ref0);
  const sx = stylex.props(dash.root, styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div role="group" aria-label="Presets" {...stylex.props(styles.list)}>
        {PRESETS.map((p) => (
          <button key={p.id} type="button" aria-pressed={current === p.id} onClick={() => onChange(presetRange(p.id, ref0))} {...stylex.props(styles.item, focus.ring, current === p.id && styles.selected)}>
            {p.label}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={current === 'custom'}
          onClick={() => {
            calRef.current?.querySelector<HTMLElement>('td [tabindex="0"]')?.focus();
          }}
          {...stylex.props(styles.item, focus.ring, current === 'custom' && styles.selected)}
        >
          Custom
        </button>
      </div>
      <div {...stylex.props(styles.main)}>
        <DateRangePicker label={label} value={value} onChange={onChange} />
        <div ref={calRef}>
          <RangeCalendar aria-label={`${label} calendar`} value={value} onChange={onChange} bordered />
        </div>
      </div>
    </div>
  );
}
