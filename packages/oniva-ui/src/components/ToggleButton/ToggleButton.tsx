import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import { focus } from '../../internal/focus';
import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
} from 'react-aria-components';
import { use, type CSSProperties, type ReactNode, type Ref } from 'react';
import {
  controlIconSize,
  controlStyles,
  ToggleGroupStyleContext,
  type ButtonSize,
} from '../../internal/feedback-control';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  // selected states
  selectedSecondary: {
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderColor: colors['--oniva-color-accent-soft-fg'],
    color: colors['--oniva-color-accent-soft-fg'],
  },
  selectedGhost: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    color: colors['--oniva-color-text'],
  },
  selectedSoft: {
    backgroundColor: colors['--oniva-color-accent-soft-hover'],
    color: colors['--oniva-color-accent-soft-fg'],
  },
  // segmented (inside a ToggleButtonGroup track)
  segment: {
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    borderColor: 'transparent',
    boxShadow: 'none',
    color: colors['--oniva-color-text-muted'],
    zIndex: 1,
  },
  segmentSlide: { color: colors['--oniva-color-text'] },
  segmentSelected: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    boxShadow: shadow['--oniva-shadow-sm'],
    color: colors['--oniva-color-text'],
  },
});

export type ToggleButtonVariant = 'secondary' | 'ghost' | 'soft';

export interface ToggleButtonProps extends Omit<
  AriaToggleButtonProps,
  'className' | 'style' | 'children'
> {
  variant?: ToggleButtonVariant;
  size?: ButtonSize;
  isIconOnly?: boolean;
  startIcon?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

const selectedKey = {
  secondary: 'selectedSecondary',
  ghost: 'selectedGhost',
  soft: 'selectedSoft',
} as const;

export function ToggleButton({
  variant: variantProp,
  size: sizeProp,
  isIconOnly = false,
  startIcon,
  children,
  className,
  style,
  xstyle,
  ref,
  ...rest
}: ToggleButtonProps) {
  const group = use(ToggleGroupStyleContext);
  const size = sizeProp ?? group.size ?? 'md';
  const gv = group.variant;
  const segmented = gv === 'segmented';
  const variant =
    variantProp ?? (segmented ? 'ghost' : ((gv as ToggleButtonVariant) ?? 'secondary'));
  return (
    <AriaToggleButton
      {...rest}
      ref={ref}
      className={(s) => {
        const sx = stylex.props(
          controlStyles.base,
          focus.ring,
          controlStyles[variant],
          controlStyles[size],
          isIconOnly && controlStyles[controlIconSize[size]],
          segmented && styles.segment,
          s.isSelected && !segmented && styles[selectedKey[variant]],
          s.isSelected && segmented && (group.slide ? styles.segmentSlide : styles.segmentSelected),
          s.isDisabled && controlStyles.disabled,
          xstyle,
        );
        return mergeSx(sx, className, style).className;
      }}
      style={(() => {
        const sx = stylex.props(controlStyles.base, xstyle);
        return mergeSx(sx, undefined, style).style;
      })()}
    >
      {startIcon}
      {children}
    </AriaToggleButton>
  );
}
