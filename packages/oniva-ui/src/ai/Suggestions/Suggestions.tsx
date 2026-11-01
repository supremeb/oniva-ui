import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { motionStyles } from '../../internal/motion-styles';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { Stagger } from '../../motion/Stagger';

const styles = stylex.create({
  wrap: { minWidth: 0 },
  row: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    // Inline padding (cancelled by the negative margin) keeps the focus ring of the first and last chip from being clipped.
    marginInline: -4,
    paddingBlock: 4,
    paddingInline: 4,
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': { display: 'none' },
  },
  item: { flexShrink: 0, maxWidth: '100%', minWidth: 0 },
  chip: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: colors['--oniva-color-surface'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderColor: {
      default: colors['--oniva-color-border'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-border-hover'] },
    },
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    height: 32,
    maxWidth: '100%',
    minWidth: 0,
    paddingInline: 14,
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'background-color, border-color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    whiteSpace: 'nowrap',
  },
  label: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' },
});

export interface SuggestionsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'onSelect'> {
  suggestions: string[];
  onSelect?: (suggestion: string) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Horizontally scrolling row of prompt chips. Chips rise in with a short stagger on mount; a label wider than the row truncates. */
export function Suggestions({ suggestions, onSelect, className, xstyle, ref, 'aria-label': ariaLabel, ...rest }: SuggestionsProps) {
  const sx = stylex.props(styles.wrap, xstyle);
  const itemClass = stylex.props(styles.item).className;
  return (
    <div {...rest} ref={ref} role="group" aria-label={ariaLabel ?? 'Suggestions'} {...mergeSx(sx, className)}>
      {suggestions.length > 0 && (
        <Stagger xstyle={styles.row} itemClassName={itemClass}>
          {suggestions.map((s, i) => (
            <button
              key={`${i}:${s}`}
              type="button"
              title={s}
              onClick={() => onSelect?.(s)}
              {...stylex.props(motionStyles.pressScale, styles.chip, focus.ring)}
            >
              <span {...stylex.props(styles.label)}>{s}</span>
            </button>
          ))}
        </Stagger>
      )}
    </div>
  );
}
