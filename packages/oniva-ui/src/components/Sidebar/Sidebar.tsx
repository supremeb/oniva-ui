import * as stylex from '@stylexjs/stylex';
import {
  Button as AriaButton,
  Input as AriaInput,
  Link as AriaLink,
  SearchField as AriaSearchField,
  type LinkProps as AriaLinkProps,
  type SearchFieldProps as AriaSearchFieldProps,
} from 'react-aria-components';
import { ChevronDown, ChevronsUpDown, PanelLeft, Search } from 'lucide-react';
import { createContext, use, useState, type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { cx } from '../../internal/nav-cx';
import { mergeSx } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { Avatar } from '../Avatar';

const Ctx = createContext<{ collapsed: boolean; toggle: () => void }>({ collapsed: false, toggle: () => {} });

/** Read the sidebar collapsed state from custom children. */
export function useSidebar() {
  return use(Ctx);
}

const focusRing = {
  outlineColor: colors.focusRing,
  outlineOffset: 2,
  outlineStyle: 'none',
  outlineWidth: 2,
} as const;

const styles = stylex.create({
  root: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xxxl,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.float,
    boxSizing: 'border-box',
    color: colors.text,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    fontFamily: font.sans,
    gap: 12,
    height: '100%',
    overflow: 'hidden',
    padding: 12,
    transitionDuration: motion.durSlow,
    transitionProperty: 'width',
    transitionTimingFunction: motion.easeStandard,
    width: 260,
  },
  rootCollapsed: { alignItems: 'stretch', width: 68 },
  header: { alignItems: 'center', display: 'flex', gap: 4, justifyContent: 'space-between' },
  headerCollapsed: { flexDirection: 'column', gap: 8 },
  switcher: {
    ...focusRing,
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceInset },
    borderRadius: radius.xl,
    borderWidth: 0,
    color: colors.text,
    cursor: 'pointer',
    display: 'flex',
    flexGrow: 1,
    fontFamily: font.sans,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    gap: 10,
    minWidth: 0,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    padding: 4,
    textAlign: 'start',
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color',
  },
  switcherName: { flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  chevrons: { color: colors.iconMuted, flexShrink: 0 },
  iconBtn: {
    ...focusRing,
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceInsetHover },
    borderRadius: radius.md,
    borderWidth: 0,
    color: colors.iconMuted,
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    height: 32,
    justifyContent: 'center',
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color',
    width: 32,
  },
  search: {
    alignItems: 'center',
    backgroundColor: colors.surfaceInset,
    borderColor: { default: colors.border, ':focus-within': colors.focusRing },
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: { default: 'none', ':focus-within': `0 0 0 3px ${colors.accentTint}` },
    boxSizing: 'border-box',
    color: colors.textMuted,
    display: 'flex',
    gap: 8,
    height: 40,
    paddingInline: 10,
    transitionDuration: motion.durBase,
    transitionProperty: 'border-color, box-shadow',
  },
  searchInput: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors.text,
    flexGrow: 1,
    fontFamily: font.sans,
    fontSize: font.size14,
    minWidth: 0,
    outlineStyle: 'none',
    padding: 0,
    '::placeholder': { color: colors.textPlaceholder },
  },
  kbd: {
    backgroundColor: colors.kbdBg,
    borderRadius: radius.full,
    color: colors.textOnTertiary,
    flexShrink: 0,
    fontFamily: font.sans,
    fontSize: font.size12,
    fontWeight: font.weightMedium,
    lineHeight: font.lh12,
    paddingBlock: 2,
    paddingInline: 8,
  },
  searchIconBtn: { alignSelf: 'center', height: 40, width: 40 },
  content: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 12, minHeight: 0, overflowY: 'auto' },
  section: { display: 'flex', flexDirection: 'column', gap: 2 },
  sectionTitle: {
    ...focusRing,
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius.sm,
    borderWidth: 0,
    color: colors.textMuted,
    cursor: 'default',
    display: 'flex',
    fontFamily: font.sans,
    fontSize: font.size12,
    fontWeight: font.weightMedium,
    justifyContent: 'space-between',
    letterSpacing: font.trackLabel,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    paddingBlock: 6,
    paddingInline: 10,
    textAlign: 'start',
    textTransform: 'uppercase',
    width: '100%',
  },
  sectionToggle: { cursor: 'pointer' },
  sectionRule: { backgroundColor: colors.separator, height: 1, marginBlock: 4 },
  chevron: { transitionDuration: motion.durBase, transitionProperty: 'transform' },
  chevronClosed: { transform: 'rotate(-90deg)' },
  menu: { display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', margin: 0, padding: 0 },
  item: {
    ...focusRing,
    alignItems: 'center',
    borderRadius: radius.lg,
    boxSizing: 'border-box',
    cursor: { default: 'pointer', ':is([data-disabled])': 'not-allowed' },
    display: 'flex',
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    gap: 10,
    height: 40,
    lineHeight: font.lh14,
    paddingInline: 10,
    textDecoration: 'none',
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, color, box-shadow',
    transitionTimingFunction: motion.easeStandard,
    userSelect: 'none',
  },
  itemFocus: { outlineStyle: 'solid' },
  itemCollapsed: { justifyContent: 'center', paddingInline: 0 },
  itemIdle: {
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceInset },
    color: { default: colors.textMuted, ':hover': colors.text },
  },
  itemActive: {
    backgroundImage: `linear-gradient(180deg, ${accent.accent500}, ${accent.accent600})`,
    boxShadow: shadow.accentInset,
    color: colors.accentFg,
  },
  itemDisabled: { color: colors.textDisabled },
  itemIcon: { alignItems: 'center', display: 'inline-flex', flexShrink: 0 },
  itemLabel: { flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  badge: {
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radius.full,
    color: colors.textOnTertiary,
    fontSize: font.size12,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font.weightMedium,
    lineHeight: font.lh12,
    paddingBlock: 2,
    paddingInline: 8,
  },
  badgeActive: {
    backgroundColor: `color-mix(in srgb, ${colors.accentFg} 22%, transparent)`,
    color: colors.accentFg,
  },
  footer: { display: 'flex', flexDirection: 'column', gap: 4 },
  account: {
    ...focusRing,
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: colors.surfaceInset, ':hover': colors.surfaceInsetHover },
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors.text,
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font.sans,
    gap: 10,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    padding: 8,
    textAlign: 'start',
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color',
    width: '100%',
  },
  accountCollapsed: { justifyContent: 'center', padding: 6 },
  accountText: { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 },
  accountName: { fontSize: font.size14, fontWeight: font.weightMedium, lineHeight: font.lh14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  accountSub: { color: colors.textMuted, fontSize: font.size12, lineHeight: font.lh12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
});

export interface SidebarProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'className' | 'children'> {
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Sidebar({
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  children,
  className,
  style,
  xstyle,
  ref,
  ...rest
}: SidebarProps) {
  const [inner, setInner] = useState(defaultCollapsed);
  const collapsed = collapsedProp ?? inner;
  const toggle = () => {
    const next = !collapsed;
    if (collapsedProp === undefined) setInner(next);
    onCollapsedChange?.(next);
  };
  const sx = stylex.props(styles.root, collapsed && styles.rootCollapsed, xstyle);
  return (
    <Ctx value={{ collapsed, toggle }}>
      <aside {...rest} ref={ref} data-collapsed={collapsed || undefined} {...mergeSx(sx, className, style)}>
        {children}
      </aside>
    </Ctx>
  );
}

export interface SidebarHeaderProps {
  /** Workspace or account name. */
  name: string;
  avatarSrc?: string;
  /** Fires when the switcher is pressed (open your workspace menu). */
  onSwitch?: () => void;
  /** Label for the collapse toggle. */
  toggleLabel?: string;
  xstyle?: stylex.StyleXStyles;
  className?: string;
}

export function SidebarHeader({ name, avatarSrc, onSwitch, toggleLabel, xstyle, className }: SidebarHeaderProps) {
  const { collapsed, toggle } = use(Ctx);
  return (
    <div className={cx(stylex.props(styles.header, collapsed && styles.headerCollapsed, xstyle), className)}>
      <AriaButton
        aria-label={collapsed ? `Switch workspace, ${name}` : undefined}
        onPress={onSwitch}
        {...stylex.props(styles.switcher)}
      >
        <Avatar name={name} src={avatarSrc} size="md" />
        {!collapsed && (
          <>
            <span {...stylex.props(styles.switcherName)}>{name}</span>
            <ChevronsUpDown size={16} aria-hidden="true" {...stylex.props(styles.chevrons)} />
          </>
        )}
      </AriaButton>
      <AriaButton
        aria-label={toggleLabel ?? (collapsed ? 'Expand sidebar' : 'Collapse sidebar')}
        aria-expanded={!collapsed}
        onPress={toggle}
        {...stylex.props(styles.iconBtn)}
      >
        <PanelLeft size={18} />
      </AriaButton>
    </div>
  );
}

export interface SidebarSearchProps extends Omit<AriaSearchFieldProps, 'className' | 'style' | 'children'> {
  placeholder?: string;
  /** Keyboard hint shown at the end (plain text). */
  hint?: string;
  xstyle?: stylex.StyleXStyles;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function SidebarSearch({ placeholder = 'Quick Search', hint = '⌘L', xstyle, className, ref, ...rest }: SidebarSearchProps) {
  const { collapsed } = use(Ctx);
  if (collapsed) {
    return (
      <AriaButton aria-label={placeholder} {...stylex.props(styles.iconBtn, styles.searchIconBtn, xstyle)}>
        <Search size={18} />
      </AriaButton>
    );
  }
  return (
    <AriaSearchField
      aria-label={placeholder}
      {...rest}
      ref={ref}
      className={cx(stylex.props(styles.search, xstyle), className)}
    >
      <Search size={16} aria-hidden="true" />
      <AriaInput placeholder={placeholder} {...stylex.props(styles.searchInput)} />
      {hint && (
        <span aria-hidden="true" {...stylex.props(styles.kbd)}>
          {hint}
        </span>
      )}
    </AriaSearchField>
  );
}

export interface SidebarContentProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'className'> {
  className?: string;
  xstyle?: stylex.StyleXStyles;
}

/** Scrollable navigation region. */
export function SidebarContent({ className, xstyle, 'aria-label': ariaLabel = 'Main', ...rest }: SidebarContentProps) {
  return <nav aria-label={ariaLabel} {...rest} className={cx(stylex.props(styles.content, xstyle), className)} />;
}

export interface SidebarSectionProps {
  title?: string;
  /** Let users collapse the section by pressing its title. */
  collapsible?: boolean;
  defaultOpen?: boolean;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  className?: string;
}

export function SidebarSection({ title, collapsible = false, defaultOpen = true, children, xstyle, className }: SidebarSectionProps) {
  const { collapsed } = use(Ctx);
  const [open, setOpen] = useState(defaultOpen);
  const show = collapsed || !collapsible || open;
  return (
    <div className={cx(stylex.props(styles.section, xstyle), className)}>
      {title && !collapsed &&
        (collapsible ? (
          <AriaButton
            aria-expanded={open}
            onPress={() => setOpen((o) => !o)}
            {...stylex.props(styles.sectionTitle, styles.sectionToggle)}
          >
            {title}
            <ChevronDown size={14} {...stylex.props(styles.chevron, !open && styles.chevronClosed)} />
          </AriaButton>
        ) : (
          <div {...stylex.props(styles.sectionTitle)}>{title}</div>
        ))}
      {title && collapsed && <div role="presentation" {...stylex.props(styles.sectionRule)} />}
      {show && <SidebarMenu>{children}</SidebarMenu>}
    </div>
  );
}

export function SidebarMenu({ children, xstyle }: { children?: ReactNode; xstyle?: stylex.StyleXStyles }) {
  return (
    <ul {...stylex.props(styles.menu, xstyle)}>{children}</ul>
  );
}

export interface SidebarItemProps extends Omit<AriaLinkProps, 'className' | 'style' | 'children'> {
  icon?: ReactNode;
  /** Count or tag (e.g. 152, "NEW") shown at the end. */
  badge?: ReactNode;
  /** Current page: solid accent pill with white text. */
  isActive?: boolean;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLAnchorElement>;
}

export function SidebarItem({ icon, badge, isActive = false, children, className, style, xstyle, ref, ...rest }: SidebarItemProps) {
  const { collapsed } = use(Ctx);
  const label = typeof children === 'string' ? children : undefined;
  return (
    <li>
      <AriaLink
        {...rest}
        ref={ref}
        style={style}
        aria-current={isActive ? 'page' : undefined}
        aria-label={collapsed ? (rest['aria-label'] ?? label) : rest['aria-label']}
        className={(s) =>
          cx(
            stylex.props(
              styles.item,
              collapsed && styles.itemCollapsed,
              isActive ? styles.itemActive : styles.itemIdle,
              s.isDisabled && styles.itemDisabled,
              s.isFocusVisible && styles.itemFocus,
              xstyle,
            ),
            className,
          )
        }
      >
        {icon && (
          <span aria-hidden="true" {...stylex.props(styles.itemIcon)}>
            {icon}
          </span>
        )}
        {!collapsed && <span {...stylex.props(styles.itemLabel)}>{children}</span>}
        {!collapsed && badge !== undefined && <span {...stylex.props(styles.badge, isActive && styles.badgeActive)}>{badge}</span>}
      </AriaLink>
    </li>
  );
}

export function SidebarFooter({ children, xstyle, className }: { children?: ReactNode; xstyle?: stylex.StyleXStyles; className?: string }) {
  return <div className={cx(stylex.props(styles.footer, xstyle), className)}>{children}</div>;
}

export interface SidebarAccountProps {
  name: string;
  email?: string;
  avatarSrc?: string;
  onPress?: () => void;
  xstyle?: stylex.StyleXStyles;
}

/** Footer account card (avatar, name, email, up/down chevrons). */
export function SidebarAccount({ name, email, avatarSrc, onPress, xstyle }: SidebarAccountProps) {
  const { collapsed } = use(Ctx);
  return (
    <AriaButton
      aria-label={collapsed ? `Account menu, ${name}` : undefined}
      onPress={onPress}
      {...stylex.props(styles.account, collapsed && styles.accountCollapsed, xstyle)}
    >
      <Avatar name={name} src={avatarSrc} size="md" />
      {!collapsed && (
        <>
          <span {...stylex.props(styles.accountText)}>
            <span {...stylex.props(styles.accountName)}>{name}</span>
            {email && <span {...stylex.props(styles.accountSub)}>{email}</span>}
          </span>
          <ChevronsUpDown size={16} aria-hidden="true" {...stylex.props(styles.chevrons)} />
        </>
      )}
    </AriaButton>
  );
}
