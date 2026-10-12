import * as stylex from '@stylexjs/stylex';
import { DateInput, DateSegment } from 'react-aria-components';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { radius } from '../tokens/radius.stylex';

export const fd = stylex.create({
  input: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    fontSize: font['--oniva-font-size-14'],
    fontVariantNumeric: 'tabular-nums',
    lineHeight: font['--oniva-font-lh-14'],
    minWidth: 0,
  },
  segment: {
    borderRadius: radius['--oniva-radius-xs'],
    color: colors['--oniva-color-text'],
    outline: 'none',
    paddingInline: 2,
  },
  segFocused: {
    backgroundColor: colors['--oniva-color-focus-ring'],
    color: colors['--oniva-color-accent-fg'],
  },
  segPlaceholder: { color: colors['--oniva-color-text-placeholder'] },
  segDisabled: { color: colors['--oniva-color-text-disabled'] },
  sep: { color: colors['--oniva-color-text-muted'], paddingInline: 6 },
  popoverPad: { padding: 0 },
});

export function Segments({ slot }: { slot?: string }) {
  return (
    <DateInput slot={slot} {...stylex.props(fd.input)}>
      {(segment) => (
        <DateSegment
          segment={segment}
          className={({ isFocused, isPlaceholder, isDisabled }) =>
            stylex.props(
              fd.segment,
              isPlaceholder && fd.segPlaceholder,
              isDisabled && fd.segDisabled,
              isFocused && fd.segFocused,
            ).className ?? ''
          }
        />
      )}
    </DateInput>
  );
}
