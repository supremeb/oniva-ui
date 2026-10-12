import * as stylex from '@stylexjs/stylex';
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { Button, ToggleButton, ToggleButtonGroup, type Key } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { Badge } from '../../components/Badge';
import { Card, CardHeader, CardHeaderText, CardTitle, Tile } from '../../components/Card';

const styles = stylex.create({
  valueRow: { alignItems: 'baseline', display: 'flex', flexWrap: 'wrap', gap: 8 },
  value: {
    color: colors.text,
    fontFamily: font.sans,
    fontSize: font.size24,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font.weightMedium,
    letterSpacing: font.trackHero,
    lineHeight: font.lh24,
  },
  unit: {
    color: colors.textMuted,
    fontFamily: font.sans,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
  },
  deltaIcon: { height: 12, width: 12 },
  actions: { alignItems: 'center', display: 'flex', gap: 8 },
  legend: { paddingBlock: 6, paddingInline: 8 },
  tileBody: { padding: 8 },
  switcher: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    boxShadow: shadow.xs,
    display: 'inline-flex',
    fontFamily: font.sans,
    height: 36,
    padding: 2,
  },
  navBtn: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceHover },
    borderRadius: radius.md,
    borderWidth: 0,
    color: colors.textMuted,
    cursor: 'pointer',
    display: 'inline-flex',
    height: 32,
    justifyContent: 'center',
    outline: 'none',
    transitionDuration: '150ms',
    transitionProperty: 'background-color, color',
    width: 28,
    boxShadow: { default: 'none', ':focus-visible': `0 0 0 2px ${colors.focusRing}` },
    opacity: { default: 1, ':disabled': 0.4 },
  },
  navLabel: {
    color: colors.text,
    fontSize: font.size14,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font.weightMedium,
    minWidth: 96,
    textAlign: 'center',
  },
  toggleGroup: {
    backgroundColor: colors.surfaceInsetHover,
    borderRadius: radius.lg,
    display: 'inline-flex',
    gap: 2,
    padding: 2,
  },
  toggle: {
    backgroundColor: {
      default: 'transparent',
      ':is([data-selected])': colors.surface,
    },
    borderRadius: radius.md,
    borderWidth: 0,
    boxShadow: {
      default: 'none',
      ':is([data-selected])': shadow.xs,
      ':focus-visible': `0 0 0 2px ${colors.focusRing}`,
    },
    color: { default: colors.textMuted, ':is([data-selected])': colors.text },
    cursor: 'pointer',
    fontFamily: font.sans,
    fontSize: font.size13,
    fontWeight: font.weightMedium,
    height: 28,
    outline: 'none',
    paddingInline: 10,
    transitionDuration: '150ms',
    transitionProperty: 'background-color, color, box-shadow',
  },
});

export interface ChartDelta {
  /** Display text, e.g. "12.4%". */
  label: string;
  trend: 'up' | 'down';
  /** Set when "down" is good (e.g. churn). */
  invert?: boolean;
}

export interface ChartCardProps {
  title: ReactNode;
  /** Big headline number. */
  value?: ReactNode;
  /** Small muted text after the value ("total steps"). */
  unit?: ReactNode;
  delta?: ChartDelta;
  /** Right side of the header: `ChartPeriodSwitcher`, `ChartRangeToggle`, buttons… */
  actions?: ReactNode;
  /** Usually a `ChartLegend`; rendered under the tile. */
  legend?: ReactNode;
  /** Wrap the chart in a white `Tile` (default). */
  tile?: boolean;
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/** BoardUI-style chart card: gray outer card, title + big value + delta, white tile for the plot, legend below. */
export function ChartCard({
  title,
  value,
  unit,
  delta,
  actions,
  legend,
  tile = true,
  children,
  className,
  xstyle,
  ref,
}: ChartCardProps) {
  const good = delta ? (delta.trend === 'up') !== !!delta.invert : true;
  return (
    <Card ref={ref as Ref<HTMLDivElement>} className={className} xstyle={xstyle}>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>{title}</CardTitle>
          {(value != null || delta) && (
            <div {...stylex.props(styles.valueRow)}>
              {value != null && <span {...stylex.props(styles.value)}>{value}</span>}
              {unit != null && <span {...stylex.props(styles.unit)}>{unit}</span>}
              {delta && (
                <Badge variant={good ? 'success' : 'danger'} size="sm">
                  {delta.trend === 'up' ? (
                    <ArrowUpRight aria-hidden="true" {...stylex.props(styles.deltaIcon)} />
                  ) : (
                    <ArrowDownRight aria-hidden="true" {...stylex.props(styles.deltaIcon)} />
                  )}

                  {delta.label}
                </Badge>
              )}
            </div>
          )}
        </CardHeaderText>
        {actions && <div {...stylex.props(styles.actions)}>{actions}</div>}
      </CardHeader>
      {tile ? (
        <Tile padding="none">
          <div {...stylex.props(styles.tileBody)}>{children}</div>
        </Tile>
      ) : (
        children
      )}
      {legend && <div {...stylex.props(styles.legend)}>{legend}</div>}
    </Card>
  );
}

export interface ChartPeriodSwitcherProps {
  /** Current label, e.g. "29 Jun – 5 Jul". */
  label: string;
  onPrevious?: () => void;
  onNext?: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  xstyle?: stylex.StyleXStyles;
}

/** Prev / label / next control used in BoardUI chart headers. */
export function ChartPeriodSwitcher({
  label,
  onPrevious,
  onNext,
  previousDisabled,
  nextDisabled,
  xstyle,
}: ChartPeriodSwitcherProps) {
  return (
    <div role="group" aria-label="Period" {...stylex.props(styles.switcher, xstyle)}>
      <Button
        aria-label="Previous period"
        isDisabled={previousDisabled}
        onPress={onPrevious}
        {...stylex.props(styles.navBtn)}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </Button>
      <span aria-live="polite" {...stylex.props(styles.navLabel)}>
        {label}
      </span>
      <Button
        aria-label="Next period"
        isDisabled={nextDisabled}
        onPress={onNext}
        {...stylex.props(styles.navBtn)}
      >
        <ChevronRight size={16} aria-hidden="true" />
      </Button>
    </div>
  );
}

export interface ChartRangeToggleProps {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  'aria-label'?: string;
  xstyle?: stylex.StyleXStyles;
}

/** Single-select Weekly / Monthly / Yearly toggle. */
export function ChartRangeToggle({
  options,
  value,
  onChange,
  'aria-label': ariaLabel = 'Range',
  xstyle,
}: ChartRangeToggleProps) {
  return (
    <ToggleButtonGroup
      aria-label={ariaLabel}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={new Set<Key>([value])}
      onSelectionChange={(keys) => {
        const k = [...keys][0];
        if (k != null) onChange(String(k));
      }}
      {...stylex.props(styles.toggleGroup, xstyle)}
    >
      {options.map((o) => (
        <ToggleButton key={o.id} id={o.id} {...stylex.props(styles.toggle)}>
          {o.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
