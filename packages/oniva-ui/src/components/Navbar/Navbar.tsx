import * as stylex from '@stylexjs/stylex';
import { Link as AriaLink, type LinkProps as AriaLinkProps } from 'react-aria-components';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from '../../internal/nav-cx';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  root: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    boxSizing: 'border-box',
    color: colors.text,
    display: 'flex',
    fontFamily: font.sans,
    gap: 24,
    height: 56,
    paddingInline: 16,
    width: '100%',
  },
  floating: {
    borderColor: colors.border,
    borderRadius: radius.xxl,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.float,
  },
  sticky: { position: 'sticky', top: 0, zIndex: 10 },
  brand: { alignItems: 'center', display: 'flex', flexShrink: 0, fontSize: font.size16, fontWeight: font.weightSemibold, gap: 8 },
  links: { alignItems: 'center', display: 'flex', flexGrow: 1, gap: 4, listStyle: 'none', margin: 0, padding: 0 },
  end: { alignItems: 'center', display: 'flex', flexShrink: 0, gap: 8, marginInlineStart: 'auto' },
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
    transitionTimingFunction: motion.easeStandard,
  },
  linkFocus: { outlineStyle: 'solid' },
  linkNoFocus: { outlineStyle: 'none' },
  linkIdle: {
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceInset },
    color: { default: colors.textMuted, ':hover': colors.text },
  },
  linkActive: { backgroundColor: colors.surfaceInsetHover, color: colors.text },
});

export interface NavbarProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'className' | 'children'> {
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
  const sx = stylex.props(styles.root, floating && styles.floating, sticky && styles.sticky, xstyle);
  return (
    <header {...rest} ref={ref} {...mergeSx(sx, className, style)}>
      {brand && <div {...stylex.props(styles.brand)}>{brand}</div>}
      <nav aria-label={ariaLabel} style={{ flexGrow: 1 }}>
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

export function NavbarLink({ isActive = false, children, className, xstyle, ref, ...rest }: NavbarLinkProps) {
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
