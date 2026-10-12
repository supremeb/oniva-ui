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
import {
  createContext,
  use,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { mergeSx, sxClass } from '../../internal/sx';
import { HoverPill, useAttrKey } from '../../internal/controls-motion';
import { SlidingIndicator } from '../../motion/SlidingIndicator';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { Avatar } from '../Avatar';

const Ctx = createContext<{ collapsed: boolean; toggle: () => void }>({
  collapsed: false,
  toggle: () => {},
});

/** Read the sidebar collapsed state from custom children. */
export function useSidebar() {
  return use(Ctx);
}

const focusRing = {
  outlineColor: colors['--oniva-color-focus-ring'],
  outlineOffset: 2,
  outlineStyle: 'none',
  outlineWidth: 2,
} as const;

const styles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xxxl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-float'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    fontFamily: font['--oniva-font-sans'],
    gap: 12,
    height: '100%',
    overflow: 'hidden',
    padding: 12,
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'width',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
    width: 260,
  },
  rootCollapsed: { alignItems: 'stretch', width: 68 },
  header: { alignItems: 'center', display: 'flex', gap: 4, justifyContent: 'space-between' },
  headerCollapsed: { flexDirection: 'column', gap: 8 },
  switcher: {
    ...focusRing,
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-inset'] },
    borderRadius: radius['--oniva-radius-xl'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    flexGrow: 1,
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 10,
    minWidth: 0,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    padding: 4,
    textAlign: 'start',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
  },
  switcherName: { flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  chevrons: { color: colors['--oniva-color-icon-muted'], flexShrink: 0 },
  iconBtn: {
    ...focusRing,
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--oniva-color-surface-inset-hover'],
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-icon-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    height: 32,
    justifyContent: 'center',
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
    width: 32,
  },
  search: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: {
      default: colors['--oniva-color-border'],
      ':focus-within': colors['--oniva-color-focus-ring'],
    },
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: {
      default: 'none',
      ':focus-within': `0 0 0 3px ${colors['--oniva-color-accent-tint']}`,
    },
    boxSizing: 'border-box',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    gap: 8,
    height: 40,
    paddingInline: 10,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'border-color, box-shadow',
  },
  searchInput: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    flexGrow: 1,
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    minWidth: 0,
    outlineStyle: 'none',
    padding: 0,
    '::placeholder': { color: colors['--oniva-color-text-placeholder'] },
  },
  kbd: {
    backgroundColor: colors['--oniva-color-kbd-bg'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-text-on-tertiary'],
    flexShrink: 0,
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-12'],
    paddingBlock: 2,
    paddingInline: 8,
  },
  searchIconBtn: { alignSelf: 'center', height: 40, width: 40 },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    gap: 12,
    minHeight: 0,
    overflowY: 'auto',
  },
  contentPos: { position: 'relative' },
  section: { display: 'flex', flexDirection: 'column', gap: 2 },
  sectionTitle: {
    ...focusRing,
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: colors['--oniva-color-text-muted'],
    cursor: 'default',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    justifyContent: 'space-between',
    letterSpacing: font['--oniva-font-track-label'],
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    paddingBlock: 6,
    paddingInline: 10,
    textAlign: 'start',
    textTransform: 'uppercase',
    width: '100%',
  },
  sectionToggle: { cursor: 'pointer' },
  sectionRule: { backgroundColor: colors['--oniva-color-separator'], height: 1, marginBlock: 4 },
  chevron: {
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
  },
  chevronClosed: { transform: 'rotate(-90deg)' },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    ...focusRing,
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-lg'],
    boxSizing: 'border-box',
    cursor: { default: 'pointer', ':is([data-disabled])': 'not-allowed' },
    display: 'flex',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 10,
    height: 40,
    lineHeight: font['--oniva-font-lh-14'],
    paddingInline: 10,
    position: 'relative',
    textDecoration: 'none',
    touchAction: 'manipulation',
    transform: {
      default: 'none',
      ':active:not([data-disabled])': `scale(${motion['--oniva-motion-press-scale']})`,
    },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    zIndex: 1,
    userSelect: 'none',
  },
  itemFocus: { outlineStyle: 'solid' },
  pillActive: {
    backgroundColor: 'transparent',
    backgroundImage: `linear-gradient(180deg, ${accent['--oniva-accent-500']}, ${accent['--oniva-accent-600']})`,
    borderRadius: radius['--oniva-radius-lg'],
    boxShadow: shadow['--oniva-shadow-accent-inset'],
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  pillHover: { backgroundColor: colors['--oniva-color-surface-inset'], borderRadius: radius['--oniva-radius-lg'] },
  itemCollapsed: { justifyContent: 'center', paddingInline: 0 },
  itemIdle: {
    color: { default: colors['--oniva-color-text-muted'], ':hover': colors['--oniva-color-text'] },
  },
  itemActive: {
    color: colors['--oniva-color-accent-fg'],
  },
  itemDisabled: { color: colors['--oniva-color-text-disabled'] },
  itemIcon: { alignItems: 'center', display: 'inline-flex', flexShrink: 0 },
  itemLabel: { flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  badge: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-text-on-tertiary'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-12'],
    paddingBlock: 2,
    paddingInline: 8,
  },
  badgeActive: {
    backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-accent-fg']} 22%, transparent)`,
    color: colors['--oniva-color-accent-fg'],
  },
  footer: { display: 'flex', flexDirection: 'column', gap: 4 },
  account: {
    ...focusRing,
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: colors['--oniva-color-surface-inset'],
      ':hover': colors['--oniva-color-surface-inset-hover'],
    },
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    gap: 10,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    padding: 8,
    textAlign: 'start',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
    width: '100%',
  },
  accountCollapsed: { justifyContent: 'center', padding: 6 },
  accountText: { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 },
  accountName: {
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  accountSub: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    lineHeight: font['--oniva-font-lh-12'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

export interface SidebarProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'style' | 'className' | 'children'
> {
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
      <aside
        {...rest}
        ref={ref}
        data-collapsed={collapsed || undefined}
        {...mergeSx(sx, className, style)}
      >
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

export function SidebarHeader({
  name,
  avatarSrc,
  onSwitch,
  toggleLabel,
  xstyle,
  className,
}: SidebarHeaderProps) {
  const { collapsed, toggle } = use(Ctx);
  return (
    <div
      className={sxClass(
        stylex.props(styles.header, collapsed && styles.headerCollapsed, xstyle),
        className,
      )}
    >
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

export interface SidebarSearchProps extends Omit<
  AriaSearchFieldProps,
  'className' | 'style' | 'children'
> {
  placeholder?: string;
  /** Keyboard hint shown at the end (plain text). */
  hint?: string;
  xstyle?: stylex.StyleXStyles;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function SidebarSearch({
  placeholder = 'Quick Search',
  hint = '⌘L',
  xstyle,
  className,
  ref,
  ...rest
}: SidebarSearchProps) {
  const { collapsed } = use(Ctx);
  if (collapsed) {
    return (
      <AriaButton
        aria-label={placeholder}
        {...stylex.props(styles.iconBtn, styles.searchIconBtn, xstyle)}
      >
        <Search size={18} />
      </AriaButton>
    );
  }
  return (
    <AriaSearchField
      aria-label={placeholder}
      {...rest}
      ref={ref}
      className={sxClass(stylex.props(styles.search, xstyle), className)}
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

export interface SidebarContentProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'style' | 'className'
> {
  className?: string;
  xstyle?: stylex.StyleXStyles;
}

/** Scrollable navigation region. */
export function SidebarContent({
  className,
  xstyle,
  'aria-label': ariaLabel = 'Main',
  children,
  ...rest
}: SidebarContentProps) {
  const ref = useRef<HTMLElement>(null);
  const activeKey = useAttrKey(ref, 'aria-current');
  return (
    <nav
      aria-label={ariaLabel}
      {...rest}
      ref={ref}
      className={sxClass(stylex.props(styles.content, styles.contentPos, xstyle), className)}
    >
      <HoverPill
        containerRef={ref}
        itemSelector='li > a, li > [role="link"]'
        skipSelector='[aria-current="page"], [aria-disabled="true"], [data-disabled]'
        xstyle={styles.pillHover}
      />
      <SlidingIndicator
        containerRef={ref}
        activeKey={activeKey}
        selector='[aria-current="page"]'
        xstyle={styles.pillActive}
      />
      {children}
    </nav>
  );
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

export function SidebarSection({
  title,
  collapsible = false,
  defaultOpen = true,
  children,
  xstyle,
  className,
}: SidebarSectionProps) {
  const { collapsed } = use(Ctx);
  const [open, setOpen] = useState(defaultOpen);
  const show = collapsed || !collapsible || open;
  return (
    <div className={sxClass(stylex.props(styles.section, xstyle), className)}>
      {title &&
        !collapsed &&
        (collapsible ? (
          <AriaButton
            aria-expanded={open}
            onPress={() => setOpen((o) => !o)}
            {...stylex.props(styles.sectionTitle, styles.sectionToggle)}
          >
            {title}
            <ChevronDown
              size={14}
              {...stylex.props(styles.chevron, !open && styles.chevronClosed)}
            />
          </AriaButton>
        ) : (
          <div {...stylex.props(styles.sectionTitle)}>{title}</div>
        ))}
      {title && collapsed && <div role="presentation" {...stylex.props(styles.sectionRule)} />}
      {show && <SidebarMenu>{children}</SidebarMenu>}
    </div>
  );
}

export function SidebarMenu({
  children,
  xstyle,
}: {
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
}) {
  return <ul {...stylex.props(styles.menu, xstyle)}>{children}</ul>;
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

export function SidebarItem({
  icon,
  badge,
  isActive = false,
  children,
  className,
  style,
  xstyle,
  ref,
  ...rest
}: SidebarItemProps) {
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
          sxClass(
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
        {!collapsed && badge !== undefined && (
          <span {...stylex.props(styles.badge, isActive && styles.badgeActive)}>{badge}</span>
        )}
      </AriaLink>
    </li>
  );
}

export function SidebarFooter({
  children,
  xstyle,
  className,
}: {
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  className?: string;
}) {
  return <div className={sxClass(stylex.props(styles.footer, xstyle), className)}>{children}</div>;
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
