import * as stylex from '@stylexjs/stylex';
import { Check, Minus } from 'lucide-react';
import { accent } from '../tokens/accent.stylex';
import { colors } from '../tokens/colors.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';
import { ff } from './forms-field';

const styles = stylex.create({
  box: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-xs'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-accent-fg'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 16,
    justifyContent: 'center',
    marginTop: 2,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
    width: 16,
  },
  compact: { marginTop: 0 },
  hover: { borderColor: colors['--oniva-color-border-active'] },
  on: {
    backgroundImage: `linear-gradient(180deg, ${accent['--oniva-accent-500']}, ${accent['--oniva-accent-600']})`,
    borderColor: 'transparent',
    boxShadow: shadow['--oniva-shadow-accent-inset'],
  },
  invalid: { borderColor: colors['--oniva-color-error-border'] },
});

export interface CheckboxBoxProps {
  isSelected?: boolean;
  isIndeterminate?: boolean;
  isFocusVisible?: boolean;
  isHovered?: boolean;
  isInvalid?: boolean;
  /** `compact` drops the label-alignment offset (table selection cells). */
  density?: 'default' | 'compact';
}

/** The one checkbox visual, shared by `Checkbox` and the table selection checkbox. */
export function CheckboxBox({
  isSelected,
  isIndeterminate,
  isFocusVisible,
  isHovered,
  isInvalid,
  density = 'default',
}: CheckboxBoxProps) {
  const on = isSelected || isIndeterminate;
  return (
    <span
      aria-hidden="true"
      {...stylex.props(
        styles.box,
        density === 'compact' && styles.compact,
        isHovered && !on && styles.hover,
        on && styles.on,
        isInvalid && styles.invalid,
        isFocusVisible && ff.focusRing,
      )}
    >
      {isIndeterminate ? (
        <Minus size={12} strokeWidth={3} />
      ) : isSelected ? (
        <Check size={12} strokeWidth={3} />
      ) : null}
    </span>
  );
}
