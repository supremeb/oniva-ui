import * as stylex from '@stylexjs/stylex';
import { focus } from '../../internal/focus';
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
import { mergeSx, sxClass } from '../../internal/sx';
import { media } from '../../tokens/media.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  root: { fontFamily: font['--oniva-font-sans'] },
  list: { alignItems: 'center', display: 'flex', gap: 4, listStyle: 'none', margin: 0, padding: 0 },
  trigger: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset'] },
      ':is([data-pressed])': colors['--oniva-color-surface-inset-hover'],
    },
    borderRadius: radius['--oniva-radius-lg'],
    borderWidth: 0,
    boxSizing: 'border-box',
    color: { default: colors['--oniva-color-text-muted'], ':hover': { default: null, [media.hover]: colors['--oniva-color-text'] } },
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 4,
    height: 36,
    paddingInline: 12,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color',
  },
  chevron: {
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: { default: 'transform', [media.reducedMotion]: 'none' },
  },
  chevronOpen: { transform: 'rotate(180deg)' },
  link: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-lg'],
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    height: 36,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineWidth: 2,
    paddingInline: 12,
    textDecoration: 'none',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color',
  },
  linkFocus: { outlineStyle: 'solid' },
  linkNoFocus: { outlineStyle: 'none' },
  linkIdle: {
    backgroundColor: { default: 'transparent', ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset'] } },
    color: { default: colors['--oniva-color-text-muted'], ':hover': { default: null, [media.hover]: colors['--oniva-color-text'] } },
  },
  linkActive: {
    backgroundColor: colors['--oniva-color-surface-inset-hover'],
    color: colors['--oniva-color-text'],
  },
  popover: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-elevation-floating'],
    boxSizing: 'border-box',
    fontFamily: font['--oniva-font-sans'],
    minWidth: 280,
    padding: 8,
  },
  dialog: { outlineStyle: 'none' },
  panel: { display: 'grid', gap: 2, gridTemplateColumns: '1fr' },
  panelLink: {
    borderRadius: radius['--oniva-radius-lg'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: -2,
    outlineWidth: 2,
    padding: 10,
    textDecoration: 'none',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
  },
  panelHover: { backgroundColor: colors['--oniva-color-surface-inset'] },
  panelFocus: { outlineStyle: 'solid' },
  panelNoFocus: { outlineStyle: 'none' },
  panelTitle: {
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
  },
  panelDesc: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
  },
});

export interface NavigationMenuProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'style' | 'className'
> {
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/** Horizontal site menu. Children: `NavigationMenuLink` and `NavigationMenuTrigger`. */
export function NavigationMenu({
  children,
  'aria-label': ariaLabel = 'Main',
  className,
  style,
  xstyle,
  ref,
  ...rest
}: NavigationMenuProps) {
  const sx = stylex.props(styles.root, xstyle);
  return (
    <nav {...rest} ref={ref} aria-label={ariaLabel} {...mergeSx(sx, className, style)}>
      <ul {...stylex.props(styles.list)}>{children}</ul>
    </nav>
  );
}

export interface NavigationMenuLinkProps extends Omit<
  AriaLinkProps,
  'className' | 'style' | 'children'
> {
  isActive?: boolean;
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLAnchorElement>;
}

/** Top-level link in the bar. */
export function NavigationMenuLink({
  isActive = false,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: NavigationMenuLinkProps) {
  return (
    <li>
      <AriaLink
        {...rest}
        ref={ref}
        aria-current={isActive ? 'page' : undefined}
        className={(s) =>
          sxClass(
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
export function NavigationMenuTrigger({
  label,
  children,
  panelLabel,
  xstyle,
}: NavigationMenuTriggerProps) {
  return (
    <li>
      <AriaDialogTrigger>
        <AriaButton {...stylex.props(styles.trigger, focus.ring, xstyle)}>
          {({ isPressed }) => (
            <>
              {label}
              <ChevronDown
                size={14}
                aria-hidden="true"
                {...stylex.props(styles.chevron, isPressed && styles.chevronOpen)}
              />
            </>
          )}
        </AriaButton>
        <AriaPopover placement="bottom start" offset={6} {...stylex.props(styles.popover)}>
          <AriaDialog
            aria-label={panelLabel ?? (typeof label === 'string' ? label : 'Menu')}
            {...stylex.props(styles.dialog)}
          >
            <div {...stylex.props(styles.panel)}>{children}</div>
          </AriaDialog>
        </AriaPopover>
      </AriaDialogTrigger>
    </li>
  );
}

export interface NavigationMenuItemLinkProps extends Omit<
  AriaLinkProps,
  'className' | 'style' | 'children'
> {
  title: string;
  description?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLAnchorElement>;
}

/** Title + description link used inside a trigger panel. */
export function NavigationMenuItemLink({
  title,
  description,
  className,
  xstyle,
  ref,
  ...rest
}: NavigationMenuItemLinkProps) {
  return (
    <AriaLink
      {...rest}
      ref={ref}
      className={(s) =>
        sxClass(
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
