import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { motionStyles } from '../../internal/motion-styles';
import { mergeSx } from '../../internal/sx';
import { Stagger } from '../../motion/Stagger';

const styles = stylex.create({
  wrap: { minWidth: 0 },
  row: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    paddingBlock: 4,
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': { display: 'none' },
  },
  chip: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: colors['--oniva-color-surface'], ':hover': colors['--oniva-color-surface-hover'] },
    borderColor: { default: colors['--oniva-color-border'], ':hover': colors['--oniva-color-border-hover'] },
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    height: 32,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingInline: 14,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    whiteSpace: 'nowrap',
  },
});

export interface SuggestionsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'onSelect'> {
  suggestions: string[];
  onSelect?: (suggestion: string) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Horizontally scrolling row of prompt chips. Chips rise in with a short stagger on mount. */
export function Suggestions({ suggestions, onSelect, className, xstyle, ref, ...rest }: SuggestionsProps) {
  const sx = stylex.props(styles.wrap, xstyle);
  return (
    <div {...rest} ref={ref} role="group" {...mergeSx(sx, className)}>
      <Stagger xstyle={styles.row}>
        {suggestions.map((s) => (
          <button key={s} type="button" onClick={() => onSelect?.(s)} {...stylex.props(styles.chip, motionStyles.pressScale)}>
            {s}
          </button>
        ))}
      </Stagger>
    </div>
  );
}
