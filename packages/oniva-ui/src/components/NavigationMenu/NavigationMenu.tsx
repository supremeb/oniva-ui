import * as stylex from '@stylexjs/stylex';
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Link as AriaLink,
  Popover as AriaPopover,
  type LinkProps as AriaLinkProps,
} from 'react-aria-components';
import { ChevronDown } from 'lucide-react';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '../../internal/nav-cx';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  root: { fontFamily: font.sans },
  list: { alignItems: 'center', display: 'flex', gap: 4, listStyle: 'none', margin: 0, padding: 0 },
  trigger: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceInset, ':is([data-pressed])': colors.surfaceInsetHover },
    borderRadius: radius.lg,
    borderWidth: 0,
    boxSizing: 'border-box',
    color: { default: colors.textMuted, ':hover': colors.text },
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font.sans,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    gap: 4,
    height: 36,
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingInline: 12,
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, color',
  },
  chevron: { transitionDuration: motion.durBase, transitionProperty: 'transform' },
  chevronOpen: { transform: 'rotate(180deg)' },
  link: {
    alignItems: 'center',
    borderRadius: radius.lg,
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    height: 36,
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineWidth: 2,
    paddingInline: 12,
    textDecoration: 'none',
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, color',
  },
  linkFocus: { outlineStyle: 'solid' },
  linkNoFocus: { outlineStyle: 'none' },
  linkIdle: {
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceInset },
    color: { default: colors.textMuted, ':hover': colors.text },
  },
  linkActive: { backgroundColor: colors.surfaceInsetHover, color: colors.text },
  popover: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.dropdown,
    boxSizing: 'border-box',
    fontFamily: font.sans,
    minWidth: 280,
    padding: 8,
  },
  dialog: { outlineStyle: 'none' },
  panel: { display: 'grid', gap: 2, gridTemplateColumns: '1fr' },
  panelLink: {
    borderRadius: radius.lg,
    boxSizing: 'border-box',
    color: colors.text,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    outlineColor: colors.focusRing,
    outlineOffset: -2,
    outlineWidth: 2,
    padding: 10,
    textDecoration: 'none',
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color',
  },
  panelHover: { backgroundColor: colors.surfaceInset },
  panelFocus: { outlineStyle: 'solid' },
  panelNoFocus: { outlineStyle: 'none' },
  panelTitle: { fontSize: font.size14, fontWeight: font.weightMedium, lineHeight: font.lh14 },
  panelDesc: { color: colors.textMuted, fontSize: font.size13, lineHeight: font.lh13 },
});

export interface NavigationMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'className'> {
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/** Horizontal site menu. Children: `NavigationMenuLink` and `NavigationMenuTrigger`. */
export function NavigationMenu({ children, 'aria-label': ariaLabel = 'Main', className, style, xstyle, ref, ...rest }: NavigationMenuProps) {
  const sx = stylex.props(styles.root, xstyle);
  return (
    <nav {...rest} ref={ref} aria-label={ariaLabel} {...mergeSx(sx, className, style)}>
      <ul {...stylex.props(styles.list)}>{children}</ul>
    </nav>
  );
}

export interface NavigationMenuLinkProps extends Omit<AriaLinkProps, 'className' | 'style' | 'children'> {
  isActive?: boolean;
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLAnchorElement>;
}

/** Top-level link in the bar. */
export function NavigationMenuLink({ isActive = false, children, className, xstyle, ref, ...rest }: NavigationMenuLinkProps) {
  return (
    <li>
      <AriaLink
        {...rest}
        ref={ref}
        aria-current={isActive ? 'page' : undefined}
        className={(s) =>
          cx(
            stylex.props(
              styles.link,
              s.isFocusVisible ? styles.linkFocus : styles.linkNoFocus,
              isActive ? styles.linkActive : styles.linkIdle,
              xstyle,
            ),
            className,
          )
        }
      >
        {children}
      </AriaLink>
    </li>
  );
}

export interface NavigationMenuTriggerProps {
  /** Button label. */
  label: ReactNode;
  /** Panel content: usually `NavigationMenuItemLink`s. */
  children?: ReactNode;
  /** Accessible name of the panel. */
  panelLabel?: string;
  xstyle?: stylex.StyleXStyles;
}

/** Menu item that opens a panel of links. Click, Enter or Space opens; Esc closes. */
export function NavigationMenuTrigger({ label, children, panelLabel, xstyle }: NavigationMenuTriggerProps) {
  return (
    <li>
      <AriaDialogTrigger>
        <AriaButton {...stylex.props(styles.trigger, xstyle)}>
          {({ isPressed }) => (
            <>
              {label}
              <ChevronDown size={14} aria-hidden="true" {...stylex.props(styles.chevron, isPressed && styles.chevronOpen)} />
            </>
          )}
        </AriaButton>
        <AriaPopover placement="bottom start" offset={6} {...stylex.props(styles.popover)}>
          <AriaDialog aria-label={panelLabel ?? (typeof label === 'string' ? label : 'Menu')} {...stylex.props(styles.dialog)}>
            <div {...stylex.props(styles.panel)}>{children}</div>
          </AriaDialog>
        </AriaPopover>
      </AriaDialogTrigger>
    </li>
  );
}

export interface NavigationMenuItemLinkProps extends Omit<AriaLinkProps, 'className' | 'style' | 'children'> {
  title: string;
  description?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLAnchorElement>;
}

/** Title + description link used inside a trigger panel. */
export function NavigationMenuItemLink({ title, description, className, xstyle, ref, ...rest }: NavigationMenuItemLinkProps) {
  return (
    <AriaLink
      {...rest}
      ref={ref}
      className={(s) =>
        cx(
          stylex.props(
            styles.panelLink,
            s.isHovered && styles.panelHover,
            s.isFocusVisible ? styles.panelFocus : styles.panelNoFocus,
            xstyle,
          ),
          className,
        )
      }
    >
      <span {...stylex.props(styles.panelTitle)}>{title}</span>
      {description && <span {...stylex.props(styles.panelDesc)}>{description}</span>}
    </AriaLink>
  );
}
