import * as stylex from '@stylexjs/stylex';
import {
  Button as AriaButton,
  Separator as AriaSeparator,
  ToggleButton as AriaToggleButton,
  Toolbar as AriaToolbar,
  type ButtonProps as AriaButtonProps,
  type ToggleButtonProps as AriaToggleButtonProps,
  type ToolbarProps as AriaToolbarProps,
} from 'react-aria-components';
import { createContext, use, type CSSProperties, type ReactNode, type Ref } from 'react';
import { cx } from '../../internal/nav-cx';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const Ctx = createContext<'horizontal' | 'vertical'>('horizontal');

const styles = stylex.create({
  root: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.xs,
    boxSizing: 'border-box',
    display: 'inline-flex',
    fontFamily: font.sans,
    gap: 2,
    padding: 4,
  },
  vertical: { alignItems: 'stretch', flexDirection: 'column' },
  btn: {
    alignItems: 'center',
    appearance: 'none',
    borderRadius: radius.md,
    borderWidth: 0,
    cursor: { default: 'pointer', ':is([data-disabled])': 'not-allowed' },
    display: 'inline-flex',
    fontFamily: font.sans,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    gap: 6,
    height: 32,
    justifyContent: 'center',
    minWidth: 32,
    outlineColor: colors.focusRing,
    outlineOffset: 1,
    outlineWidth: 2,
    paddingInline: 8,
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, color',
    transitionTimingFunction: motion.easeStandard,
  },
  focus: { outlineStyle: 'solid' },
  noFocus: { outlineStyle: 'none' },
  idle: {
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceInsetHover },
    color: { default: colors.textMuted, ':hover': colors.text },
  },
  on: { backgroundColor: accent.accent100, color: accent.accent700 },
  disabled: { color: colors.textDisabled },
  sep: { alignSelf: 'stretch', backgroundColor: colors.separator, flexShrink: 0 },
  sepH: { marginInline: 4, width: 1 },
  sepV: { height: 1, marginBlock: 4 },
});

export interface ToolbarProps extends Omit<AriaToolbarProps, 'className' | 'style'> {
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Grouped controls with roving arrow-key focus (React Aria Toolbar). Requires `aria-label`. */
export function Toolbar({ orientation = 'horizontal', className, style, xstyle, ref, ...rest }: ToolbarProps) {
  return (
    <Ctx value={orientation}>
      <AriaToolbar
        {...rest}
        ref={ref}
        orientation={orientation}
        style={style}
        className={cx(stylex.props(styles.root, orientation === 'vertical' && styles.vertical, xstyle), className)}
      />
    </Ctx>
  );
}

export interface ToolbarButtonProps extends Omit<AriaButtonProps, 'className' | 'style' | 'children'> {
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

export function ToolbarButton({ children, className, xstyle, ref, ...rest }: ToolbarButtonProps) {
  return (
    <AriaButton
      {...rest}
      ref={ref}
      className={(s) =>
        cx(
          stylex.props(
            styles.btn,
            s.isFocusVisible ? styles.focus : styles.noFocus,
            s.isDisabled ? styles.disabled : styles.idle,
            xstyle,
          ),
          className,
        )
      }
    >
      {children}
    </AriaButton>
  );
}

export interface ToolbarToggleButtonProps extends Omit<AriaToggleButtonProps, 'className' | 'style' | 'children'> {
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

export function ToolbarToggleButton({ children, className, xstyle, ref, ...rest }: ToolbarToggleButtonProps) {
  return (
    <AriaToggleButton
      {...rest}
      ref={ref}
      className={(s) =>
        cx(
          stylex.props(
            styles.btn,
            s.isFocusVisible ? styles.focus : styles.noFocus,
            s.isDisabled ? styles.disabled : s.isSelected ? styles.on : styles.idle,
            xstyle,
          ),
          className,
        )
      }
    >
      {children}
    </AriaToggleButton>
  );
}

export function ToolbarSeparator({ xstyle }: { xstyle?: stylex.StyleXStyles }) {
  const o = use(Ctx);
  // The separator runs perpendicular to the toolbar's axis.
  const orientation = o === 'horizontal' ? 'vertical' : 'horizontal';
  return (
    <AriaSeparator
      orientation={orientation}
      {...stylex.props(styles.sep, orientation === 'vertical' ? styles.sepH : styles.sepV, xstyle)}
    />
  );
}
