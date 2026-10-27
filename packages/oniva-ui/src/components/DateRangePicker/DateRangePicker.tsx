import * as stylex from '@stylexjs/stylex';
import { CalendarDays, ChevronDown } from 'lucide-react';
import {
  Button,
  DateRangePicker as AriaDateRangePicker,
  Dialog,
  FieldError,
  Group,
  Label,
  RangeCalendar as AriaRangeCalendar,
  Text,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateValue,
  type RangeValue,
  DateRangePickerStateContext,
  type ValidationResult,
} from 'react-aria-components';
import { type CalendarDate, endOfMonth, getLocalTimeZone, startOfMonth, startOfYear, today as todayFn } from '@internationalized/date';
import { use, useRef, useState, type MouseEvent, type ReactNode, type Ref } from 'react';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { cx, ff, type FieldSize } from '../../internal/forms-field';
import { CalendarBody, fc } from '../../internal/forms-calendar';
import { fd, Segments } from '../../internal/forms-date';
import { FormsPopover } from '../../internal/forms-listbox';
import { fp } from '../../internal/forms-popover';
import { Button as OnivaButton } from '../Button';

const styles = stylex.create({
  group: { paddingInlineEnd: 6 },
  dialog: { outline: 'none' },
  inputs: { alignItems: 'center', display: 'flex', flexGrow: 1, minWidth: 0 },
  presets: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    paddingBlockEnd: 4,
    paddingInline: 12,
    paddingBlockStart: 12,
  },
  chip: {
    appearance: 'none',
    backgroundColor: {
      default: colors['--oniva-color-surface-inset'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    borderColor: 'transparent',
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    height: 28,
    paddingInline: 12,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color',
  },
  trigger: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 8,
    height: 38,
    paddingInline: 12,
    width: 'fit-content',
  },
  triggerGroup: { display: 'inline-flex', width: 'fit-content' },
  panel: { display: 'flex', flexDirection: 'column' },
  panelTop: { display: 'flex', flexWrap: 'wrap' },
  presetCol: {
    borderInlineEndColor: colors['--oniva-color-separator'],
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 150,
    padding: 6,
  },
  presetItem: {
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    paddingBlock: 7,
    paddingInline: 10,
    textAlign: 'start',
  },
  presetOn: { backgroundColor: colors['--oniva-color-surface-active'], fontWeight: font['--oniva-font-weight-medium'] },
  presetCustom: { color: colors['--oniva-color-text-muted'] },
  panelFooter: {
    borderTopColor: colors['--oniva-color-separator'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 12,
  },
  summary: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'] },
  summaryMuted: { color: colors['--oniva-color-text-muted'], fontWeight: font['--oniva-font-weight-regular'], marginInlineStart: 8 },
  footRow: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  compareRow: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'inline-flex', fontSize: font['--oniva-font-size-13'], gap: 6 },
  actions: { display: 'inline-flex', gap: 8, marginInlineStart: 'auto' },
  chipOn: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-accent-text'],
    color: colors['--oniva-color-accent-text'],
  },
});

export interface DateRangePreset {
  id: string;
  label: string;
  /** Resolve the range relative to `today`. */
  range: (today: CalendarDate) => { start: CalendarDate; end: CalendarDate };
}

/** Sensible quick ranges: Today, Last 7 days, Last 30 days, Month to date, Year to date. */
export const defaultDateRangePresets: DateRangePreset[] = [
  { id: 'today', label: 'Today', range: (t) => ({ start: t, end: t }) },
  { id: 'last7', label: 'Last 7 days', range: (t) => ({ start: t.subtract({ days: 6 }), end: t }) },
  { id: 'last30', label: 'Last 30 days', range: (t) => ({ start: t.subtract({ days: 29 }), end: t }) },
  { id: 'mtd', label: 'Month to date', range: (t) => ({ start: startOfMonth(t), end: t }) },
  { id: 'ytd', label: 'Year to date', range: (t) => ({ start: startOfYear(t), end: t }) },
];

/** Preset column for `layout="panel"`: Today … Year to date, plus a trailing Custom entry for hand-picked ranges. */
export const panelDateRangePresets: DateRangePreset[] = [
  { id: 'today', label: 'Today', range: (t) => ({ start: t, end: t }) },
  { id: 'yesterday', label: 'Yesterday', range: (t) => ({ start: t.subtract({ days: 1 }), end: t.subtract({ days: 1 }) }) },
  { id: 'last7', label: 'Last 7 days', range: (t) => ({ start: t.subtract({ days: 6 }), end: t }) },
  { id: 'last30', label: 'Last 30 days', range: (t) => ({ start: t.subtract({ days: 29 }), end: t }) },
  { id: 'last90', label: 'Last 90 days', range: (t) => ({ start: t.subtract({ days: 89 }), end: t }) },
  { id: 'month', label: 'This month', range: (t) => ({ start: startOfMonth(t), end: endOfMonth(t) }) },
  { id: 'lastmonth', label: 'Last month', range: (t) => ({ start: startOfMonth(t.subtract({ months: 1 })), end: endOfMonth(t.subtract({ months: 1 })) }) },
  { id: 'quarter', label: 'This quarter', range: (t) => { const m = t.month - ((t.month - 1) % 3); const st = t.set({ month: m, day: 1 }); return { start: st, end: endOfMonth(st.add({ months: 2 })) }; } },
  { id: 'ytd', label: 'Year to date', range: (t) => ({ start: startOfYear(t), end: t }) },
];

export interface DateRangePickerProps<T extends DateValue> extends Omit<
  AriaDateRangePickerProps<T>,
  'className' | 'style' | 'children'
> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  size?: FieldSize;
  /** Quick-range chips above the calendar (pass `defaultDateRangePresets` for the usual set). */
  presets?: DateRangePreset[];
  /** Reference day for the presets (tests, screenshots). Defaults to today in the local zone. */
  today?: CalendarDate;
  /**
   * `panel` swaps the field for a compact range button and the popover for a presets column, two months and a
   * footer (range summary, optional compare, Cancel / Apply). Default `field`.
   */
  layout?: 'field' | 'panel';
  /** Panel only: show the Compare (Off / Previous period / Previous year) row. */
  compare?: boolean;
  onCompareChange?: (mode: 'off' | 'period' | 'year') => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function DateRangePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  size = 'md',
  presets,
  today,
  layout = 'field',
  compare,
  onCompareChange,
  className,
  xstyle,
  ref,
  ...rest
}: DateRangePickerProps<T>) {
  const root = stylex.props(ff.root, xstyle);
  const calRef = useRef<HTMLDivElement>(null);
  // Months slide in from the side you are moving to.
  const onNav = (e: MouseEvent<HTMLDivElement>) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[slot="previous"], [slot="next"]');
    if (!btn || prefersReducedMotion()) return;
    const dir = btn.getAttribute('slot') === 'next' ? 1 : -1;
    requestAnimationFrame(() =>
      calRef.current?.querySelectorAll<HTMLElement>('[role="grid"]').forEach((g) =>
        g.animate?.(
          [
            { opacity: 0, transform: `translateX(${dir * 14}px)` },
            { opacity: 1, transform: 'translateX(0)' },
          ],
          { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' },
        ),
      ),
    );
  };
  const [inner, setInner] = useState(rest.defaultValue ?? null);
  const panel = layout === 'panel';
  const presetList = presets ?? (panel ? panelDateRangePresets : undefined);
  const hasPresets = presetList != null && presetList.length > 0;
  const current = hasPresets ? (rest.value !== undefined ? rest.value : inner) : undefined;
  const now = today ?? todayFn(getLocalTimeZone());
  const presetProps = hasPresets
    ? {
        value: current,
        onChange: (v: RangeValue<DateValue> | null) => {
          setInner(v as RangeValue<T> | null);
          (rest.onChange as ((v: RangeValue<DateValue> | null) => void) | undefined)?.(v);
        },
      }
    : ({} as Record<string, never>);
  return (
    <AriaDateRangePicker {...rest} {...(presetProps as object)} ref={ref} className={cx(root.className, className)}>
      {({ isInvalid, isDisabled }) => (
        <>
          {label != null && <Label {...stylex.props(ff.label)}>{label}</Label>}
          {panel ? (
            <Group {...stylex.props(styles.triggerGroup)}>
            <Button {...stylex.props(styles.trigger, focus.ring)}>
              <CalendarDays size={16} aria-hidden="true" />
              <RangeText value={current ?? (rest.value as RangeValue<DateValue> | null | undefined) ?? inner} />
              <ChevronDown size={16} aria-hidden="true" />
            </Button>
            </Group>
          ) : (
          <Group
            {...stylex.props(
              ff.control,
              ff[size],
              styles.group,
              isInvalid && ff.invalid,
              isDisabled && ff.disabled,
            )}
          >
            <div {...stylex.props(styles.inputs)}>
              <Segments slot="start" />
              <span aria-hidden="true" {...stylex.props(fd.sep)}>
                –
              </span>
              <Segments slot="end" />
            </div>
            <Button aria-label="Open calendar" {...stylex.props(fp.iconButton)}>
              <CalendarDays size={16} aria-hidden="true" />
            </Button>
          </Group>
          )}
          {description != null && (
            <Text slot="description" {...stylex.props(ff.description)}>
              {description}
            </Text>
          )}
          <FieldError {...stylex.props(ff.error)}>{errorMessage}</FieldError>
          <FormsPopover auto>
            <Dialog {...stylex.props(styles.dialog, panel && styles.panel)}>
              {panel && (
                <div {...stylex.props(styles.panelTop)}>
                  <PresetColumn presets={presetList ?? []} now={now} current={current as RangeValue<DateValue> | null | undefined} />
                  <div ref={calRef} onClickCapture={onNav}>
                    <AriaRangeCalendar visibleDuration={{ months: 2 }} {...stylex.props(fc.root)}>
                      <CalendarBody range visibleDuration={2} />
                    </AriaRangeCalendar>
                  </div>
                </div>
              )}
              {panel && <PanelFooter compare={compare} onCompareChange={onCompareChange} />}
              {!panel && hasPresets && (
                <DatePresets
                  presets={presetList ?? []}
                  now={now}
                  current={current as RangeValue<DateValue> | null | undefined}
                />
              )}
              {!panel && (
                <div ref={calRef} onClickCapture={onNav}>
                  <AriaRangeCalendar visibleDuration={{ months: 2 }} {...stylex.props(fc.root)}>
                    <CalendarBody range visibleDuration={2} />
                  </AriaRangeCalendar>
                </div>
              )}
            </Dialog>
          </FormsPopover>
        </>
      )}
    </AriaDateRangePicker>
  );
}

function DatePresets({
  presets,
  now,
  current,
}: {
  presets: DateRangePreset[];
  now: CalendarDate;
  current: RangeValue<DateValue> | null | undefined;
}) {
  const state = use(DateRangePickerStateContext);
  return (
    <div role="group" aria-label="Quick ranges" {...stylex.props(styles.presets)}>
      {presets.map((p) => {
        const r = p.range(now);
        const on = !!current && current.start.compare(r.start) === 0 && current.end.compare(r.end) === 0;
        return (
          <button
            key={p.id}
            type="button"
            aria-pressed={on}
            onClick={() => state?.setValue(r)}
            {...stylex.props(styles.chip, focus.ring, on && styles.chipOn)}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

const fmt = (d: DateValue, year: boolean) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', ...(year ? { year: 'numeric' } : {}) }).format(
    d.toDate(getLocalTimeZone()),
  );

function rangeLabel(v: RangeValue<DateValue> | null | undefined): string | null {
  if (!v) return null;
  return `${fmt(v.start, false)} – ${fmt(v.end, true)}`;
}

function RangeText({ value }: { value: RangeValue<DateValue> | null | undefined }) {
  return <span>{rangeLabel(value) ?? 'Select dates'}</span>;
}

function PresetColumn({
  presets,
  now,
  current,
}: {
  presets: DateRangePreset[];
  now: CalendarDate;
  current: RangeValue<DateValue> | null | undefined;
}) {
  const state = use(DateRangePickerStateContext);
  const matches = presets.map((p) => {
    const r = p.range(now);
    return !!current && current.start.compare(r.start) === 0 && current.end.compare(r.end) === 0;
  });
  const custom = !!current && !matches.some(Boolean);
  return (
    <div role="group" aria-label="Quick ranges" {...stylex.props(styles.presetCol)}>
      {presets.map((p, i) => (
        <button
          key={p.id}
          type="button"
          aria-pressed={matches[i]}
          onClick={() => state?.setValue(p.range(now))}
          {...stylex.props(styles.presetItem, focus.ring, matches[i] && styles.presetOn)}
        >
          {p.label}
        </button>
      ))}
      <span aria-current={custom || undefined} {...stylex.props(styles.presetItem, styles.presetCustom, custom && styles.presetOn)}>
        Custom
      </span>
    </div>
  );
}

function PanelFooter({
  compare,
  onCompareChange,
}: {
  compare?: boolean;
  onCompareChange?: (mode: 'off' | 'period' | 'year') => void;
}) {
  const state = use(DateRangePickerStateContext);
  const initial = useRef((state?.value ?? null) as RangeValue<DateValue> | null);
  const [mode, setMode] = useState<'off' | 'period' | 'year'>('off');
  const v = state?.value as RangeValue<DateValue> | null | undefined;
  const days = v ? v.end.compare(v.start) + 1 : 0;
  const modes = [
    ['off', 'Off'],
    ['period', 'Previous period'],
    ['year', 'Previous year'],
  ] as const;
  return (
    <div {...stylex.props(styles.panelFooter)}>
      <div {...stylex.props(styles.summary)}>
        {rangeLabel(v) ?? 'No range selected'}
        {v && <span {...stylex.props(styles.summaryMuted)}>{days} {days === 1 ? 'day' : 'days'}</span>}
      </div>
      <div {...stylex.props(styles.footRow)}>
        {compare && (
          <div role="group" aria-label="Compare" {...stylex.props(styles.compareRow)}>
            Compare
            {modes.map(([id, text]) => (
              <button
                key={id}
                type="button"
                aria-pressed={mode === id}
                onClick={() => {
                  setMode(id);
                  onCompareChange?.(id);
                }}
                {...stylex.props(styles.chip, focus.ring, mode === id && styles.chipOn)}
              >
                {text}
              </button>
            ))}
          </div>
        )}
        <div {...stylex.props(styles.actions)}>
          <OnivaButton
            variant="secondary"
            size="sm"
            onPress={() => {
              state?.setValue(initial.current);
              state?.close();
            }}
          >
            Cancel
          </OnivaButton>
          <OnivaButton size="sm" onPress={() => state?.close()}>
            Apply
          </OnivaButton>
        </div>
      </div>
    </div>
  );
}
