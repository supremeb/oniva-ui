import * as stylex from '@stylexjs/stylex';
import { getLocalTimeZone, isSameDay, today } from '@internationalized/date';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Button,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
} from 'react-aria-components';
import { accent } from '../tokens/accent.stylex';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';
import { ff } from './forms-field';
import { fp } from './forms-popover';

export const fc = stylex.create({
  root: {
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    padding: 12,
    width: 'fit-content',
  },
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  heading: {
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-14'],
    margin: 0,
  },
  grid: { borderCollapse: 'collapse', borderSpacing: 0 },
  dow: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    height: 28,
    lineHeight: font['--oniva-font-lh-12'],
    textAlign: 'center',
  },
  td: { padding: 0 },
  cell: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-md'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontSize: font['--oniva-font-size-14'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    height: 36,
    justifyContent: 'center',
    lineHeight: font['--oniva-font-lh-14'],
    outline: 'none',
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'background-color, color',
    width: 36,
  },
  hover: { backgroundColor: colors['--oniva-color-surface-hover'] },
  today: {
    color: colors['--oniva-color-accent-soft-fg'],
    fontWeight: font['--oniva-font-weight-semibold'],
  },
  outside: { color: colors['--oniva-color-text-subtle'] },
  disabled: { color: colors['--oniva-color-text-disabled'], cursor: 'not-allowed' },
  unavailable: { color: colors['--oniva-color-text-error'], textDecoration: 'line-through' },
  selected: {
    backgroundImage: `linear-gradient(180deg, ${accent['--oniva-accent-500']}, ${accent['--oniva-accent-600']})`,
    boxShadow: shadow['--oniva-shadow-accent-inset'],
    color: colors['--oniva-color-accent-fg'],
  },
  rangeMid: {
    backgroundColor: colors['--oniva-color-accent-tint'],
    borderRadius: 0,
    color: colors['--oniva-color-text'],
  },
  rangeStart: {
    borderEndStartRadius: radius['--oniva-radius-md'],
    borderStartStartRadius: radius['--oniva-radius-md'],
  },
  rangeEnd: {
    borderEndEndRadius: radius['--oniva-radius-md'],
    borderStartEndRadius: radius['--oniva-radius-md'],
  },
  gridWrap: { display: 'flex', gap: 16 },
});

/** Previous / heading / next + one grid. Used by Calendar and RangeCalendar. */
export function CalendarBody({
  range,
  visibleDuration,
}: {
  range?: boolean;
  visibleDuration?: number;
}) {
  const grids = Array.from({ length: visibleDuration ?? 1 }, (_, i) => i);
  return (
    <>
      <header {...stylex.props(fc.header)}>
        <Button slot="previous" aria-label="Previous month" {...stylex.props(fp.iconButton)}>
          <ChevronLeft size={16} aria-hidden="true" />
        </Button>
        <Heading {...stylex.props(fc.heading)} />
        <Button slot="next" aria-label="Next month" {...stylex.props(fp.iconButton)}>
          <ChevronRight size={16} aria-hidden="true" />
        </Button>
      </header>
      <div {...stylex.props(fc.gridWrap)}>
        {grids.map((i) => (
          <CalendarGrid key={i} offset={{ months: i }} {...stylex.props(fc.grid)}>
            <CalendarGridHeader>
              {(day) => <CalendarHeaderCell {...stylex.props(fc.dow)}>{day}</CalendarHeaderCell>}
            </CalendarGridHeader>
            <CalendarGridBody>
              {(date) => (
                <CalendarCell
                  date={date}
                  className={({
                    isSelected,
                    isHovered,
                    isSelectionStart,
                    isSelectionEnd,
                    isDisabled,
                    isOutsideMonth,
                    isUnavailable,
                    isFocusVisible,
                  }) => {
                    const edge = range && (isSelectionStart || isSelectionEnd);
                    const mid = range && isSelected && !edge;
                    return (
                      stylex.props(
                        fc.cell,
                        isSameDay(date, today(getLocalTimeZone())) && fc.today,
                        isOutsideMonth && fc.outside,
                        isHovered && !isSelected && !isDisabled && fc.hover,
                        isDisabled && fc.disabled,
                        isUnavailable && fc.unavailable,
                        isSelected && !mid && fc.selected,
                        mid && fc.rangeMid,
                        edge && isSelectionStart && fc.rangeStart,
                        edge && isSelectionEnd && fc.rangeEnd,
                        isFocusVisible && ff.focusRing,
                      ).className ?? ''
                    );
                  }}
                />
              )}
            </CalendarGridBody>
          </CalendarGrid>
        ))}
      </div>
    </>
  );
}
