import * as stylex from '@stylexjs/stylex';
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  Link as AriaLink,
  type BreadcrumbProps as AriaBreadcrumbProps,
  type BreadcrumbsProps as AriaBreadcrumbsProps,
} from 'react-aria-components';
import { ChevronRight } from 'lucide-react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { cx } from '../../internal/nav-cx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  list: {
    alignItems: 'center',
    display: 'flex',
    fontFamily: font.sans,
    fontSize: font.size14,
    gap: 8,
    lineHeight: font.lh14,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: { alignItems: 'center', display: 'inline-flex', gap: 8 },
  link: {
    alignItems: 'center',
    borderRadius: radius.sm,
    color: { default: colors.textMuted, ':hover': colors.text },
    cursor: 'pointer',
    display: 'inline-flex',
    fontWeight: font.weightMedium,
    gap: 6,
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineStyle: 'none',
    outlineWidth: 2,
    textDecoration: 'none',
    transitionDuration: motion.durBase,
    transitionProperty: 'color',
    transitionTimingFunction: motion.easeStandard,
  },
  linkFocus: { outlineStyle: 'solid' },
  current: { color: colors.text, cursor: 'default' },
  sep: { color: colors.iconSubtle, display: 'inline-flex' },
});

export interface BreadcrumbsProps<T extends object> extends Omit<AriaBreadcrumbsProps<T>, 'className' | 'style'> {
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLOListElement>;
}

export function Breadcrumbs<T extends object>({ className, style, xstyle, ref, ...rest }: BreadcrumbsProps<T>) {
  return <AriaBreadcrumbs {...rest} ref={ref} style={style} className={cx(stylex.props(styles.list, xstyle), className)} />;
}

export interface BreadcrumbProps extends Omit<AriaBreadcrumbProps, 'className' | 'style' | 'children'> {
  /** Link target. The last (current) breadcrumb renders as plain text. */
  href?: string;
  onPress?: () => void;
  icon?: ReactNode;
  /** Custom separator; defaults to a chevron. */
  separator?: ReactNode;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLLIElement>;
}

export function Breadcrumb({ href, onPress, icon, separator, children, className, style, xstyle, ref, ...rest }: BreadcrumbProps) {
  return (
    <AriaBreadcrumb {...rest} ref={ref} style={style} className={cx(stylex.props(styles.item, xstyle), className)}>
      {({ isCurrent, isDisabled }) => (
        <>
          <AriaLink
            href={href}
            onPress={onPress}
            isDisabled={isDisabled}
            className={(s) => cx(stylex.props(styles.link, s.isFocusVisible && styles.linkFocus, isCurrent && styles.current))}
          >
            {icon}
            {children}
          </AriaLink>
          {!isCurrent && (
            <span aria-hidden="true" {...stylex.props(styles.sep)}>
              {separator ?? <ChevronRight size={14} />}
            </span>
          )}
        </>
      )}
    </AriaBreadcrumb>
  );
}
