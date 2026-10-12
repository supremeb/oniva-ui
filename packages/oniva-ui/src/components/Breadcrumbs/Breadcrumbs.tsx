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
import { sxClass } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  list: {
    alignItems: 'center',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    gap: 8,
    lineHeight: font['--oniva-font-lh-14'],
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: { alignItems: 'center', display: 'inline-flex', gap: 8 },
  link: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-sm'],
    color: { default: colors['--oniva-color-text-muted'], ':hover': colors['--oniva-color-text'] },
    cursor: 'pointer',
    display: 'inline-flex',
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: 'none',
    outlineWidth: 2,
    textDecoration: 'none',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'color',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
  },
  linkFocus: { outlineStyle: 'solid' },
  current: { color: colors['--oniva-color-text'], cursor: 'default' },
  sep: { color: colors['--oniva-color-icon-subtle'], display: 'inline-flex' },
});

export interface BreadcrumbsProps<T extends object> extends Omit<
  AriaBreadcrumbsProps<T>,
  'className' | 'style'
> {
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLOListElement>;
}

export function Breadcrumbs<T extends object>({
  className,
  style,
  xstyle,
  ref,
  ...rest
}: BreadcrumbsProps<T>) {
  return (
    <AriaBreadcrumbs
      {...rest}
      ref={ref}
      style={style}
      className={sxClass(stylex.props(styles.list, xstyle), className)}
    />
  );
}

export interface BreadcrumbProps extends Omit<
  AriaBreadcrumbProps,
  'className' | 'style' | 'children'
> {
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

export function Breadcrumb({
  href,
  onPress,
  icon,
  separator,
  children,
  className,
  style,
  xstyle,
  ref,
  ...rest
}: BreadcrumbProps) {
  return (
    <AriaBreadcrumb
      {...rest}
      ref={ref}
      style={style}
      className={sxClass(stylex.props(styles.item, xstyle), className)}
    >
      {({ isCurrent, isDisabled }) => (
        <>
          <AriaLink
            href={href}
            onPress={onPress}
            isDisabled={isDisabled}
            className={(s) =>
              sxClass(
                stylex.props(
                  styles.link,
                  s.isFocusVisible && styles.linkFocus,
                  isCurrent && styles.current,
                ),
              )
            }
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
