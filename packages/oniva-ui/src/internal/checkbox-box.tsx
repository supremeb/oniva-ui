import * as stylex from '@stylexjs/stylex';
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
    position: 'relative',
    transform: { default: 'none', '[data-pressed]': `scale(${motion['--oniva-motion-press-scale']})` },
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'background-color, border-color, box-shadow, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 16,
  },
  svg: { display: 'block', height: 16, left: -1, position: 'absolute', top: -1, width: 16 },
  stroke: {
    fill: 'none',
    stroke: 'currentColor',
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 2.25,
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'stroke-dashoffset',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  strokeOn: {
    strokeDashoffset: 0,
    transitionDelay: '60ms',
    transitionDuration: motion['--oniva-motion-dur-base'],
  },
  compact: { marginTop: 0 },
  hover: { borderColor: colors['--oniva-color-border-active'] },
  on: {
    backgroundImage: `linear-gradient(180deg, ${accent['--oniva-accent-solid']}, ${accent['--oniva-accent-solid-end']})`,
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
  /** Pointer-pressed (not keyboard): box scales to the press-scale token. */
  isPressed?: boolean;
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
  isPressed,
  density = 'default',
}: CheckboxBoxProps) {
  const on = isSelected || isIndeterminate;
  return (
    <span
      aria-hidden="true"
      data-pressed={isPressed ? '' : undefined}
      {...stylex.props(
        styles.box,
        density === 'compact' && styles.compact,
        isHovered && !on && styles.hover,
        on && styles.on,
        isInvalid && styles.invalid,
        isFocusVisible && ff.focusRing,
      )}
    >
      <svg viewBox="0 0 16 16" {...stylex.props(styles.svg)}>
        <path
          d="M4 8.5l2.75 2.75L12 5"
          pathLength={1}
          {...stylex.props(styles.stroke, isSelected && !isIndeterminate && styles.strokeOn)}
        />
        <path
          d="M4.5 8h7"
          pathLength={1}
          {...stylex.props(styles.stroke, isIndeterminate && styles.strokeOn)}
        />
      </svg>
    </span>
  );
}
