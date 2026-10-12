import * as stylex from '@stylexjs/stylex';
import { Link as AriaLink, type LinkProps as AriaLinkProps } from 'react-aria-components';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { mergeSx, sxClass } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  nav: { flexGrow: 1 },
  root: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    gap: 24,
    height: 56,
    paddingInline: 16,
    width: '100%',
  },
  floating: {
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xxl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-float'],
  },
  sticky: { position: 'sticky', top: 0, zIndex: 10 },
  brand: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-semibold'],
    gap: 8,
  },
  links: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    gap: 4,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  end: { alignItems: 'center', display: 'flex', flexShrink: 0, gap: 8, marginInlineStart: 'auto' },
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
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
  },
  linkFocus: { outlineStyle: 'solid' },
  linkNoFocus: { outlineStyle: 'none' },
  linkIdle: {
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-inset'] },
    color: { default: colors['--oniva-color-text-muted'], ':hover': colors['--oniva-color-text'] },
  },
  linkActive: {
    backgroundColor: colors['--oniva-color-surface-inset-hover'],
    color: colors['--oniva-color-text'],
  },
});

export interface NavbarProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'style' | 'className' | 'children'
> {
  /** Logo / product name block at the start. */
  brand?: ReactNode;
  /** Actions at the end (buttons, avatar). */
  end?: ReactNode;
  /** Navigation links: use `NavbarLink`. */
  children?: ReactNode;
  /** Rounded floating bar with shadow instead of a flat bottom border. */
  floating?: boolean;
  sticky?: boolean;
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Navbar({
  brand,
  end,
  children,
  floating = false,
  sticky = false,
  'aria-label': ariaLabel = 'Primary',
  className,
  style,
  xstyle,
  ref,
  ...rest
}: NavbarProps) {
  const sx = stylex.props(
    styles.root,
    floating && styles.floating,
    sticky && styles.sticky,
    xstyle,
  );
  return (
    <header {...rest} ref={ref} {...mergeSx(sx, className, style)}>
      {brand && <div {...stylex.props(styles.brand)}>{brand}</div>}
      <nav aria-label={ariaLabel} {...stylex.props(styles.nav)}>
        <ul {...stylex.props(styles.links)}>{children}</ul>
      </nav>
      {end && <div {...stylex.props(styles.end)}>{end}</div>}
    </header>
  );
}

export interface NavbarLinkProps extends Omit<AriaLinkProps, 'className' | 'style' | 'children'> {
  isActive?: boolean;
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLAnchorElement>;
}

export function NavbarLink({
  isActive = false,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: NavbarLinkProps) {
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
