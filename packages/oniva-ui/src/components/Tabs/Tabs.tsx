import * as stylex from '@stylexjs/stylex';
import {
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  type TabListProps as AriaTabListProps,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps as AriaTabProps,
  type TabsProps as AriaTabsProps,
} from 'react-aria-components';
import { createContext, use, type CSSProperties, type ReactNode, type Ref } from 'react';
import { sxClass } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

export type TabsVariant = 'line' | 'pill';
export type TabsSize = 'sm' | 'md';

const Ctx = createContext<{ variant: TabsVariant; size: TabsSize; vertical: boolean }>({
  variant: 'line',
  size: 'md',
  vertical: false,
});

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'] },
  rootV: { flexDirection: 'row', gap: 16 },
  list: { alignItems: 'center', display: 'flex', gap: 4 },
  listV: { alignItems: 'stretch', flexDirection: 'column' },
  listLine: {
    alignSelf: 'stretch',
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    gap: 20,
  },
  listLineV: {
    borderBottomWidth: 0,
    borderRightColor: colors['--oniva-color-border'],
    borderRightStyle: 'solid',
    borderRightWidth: 1,
    gap: 4,
    paddingInlineEnd: 4,
  },
  listPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    padding: 3,
  },
  tab: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: 0,
    boxSizing: 'border-box',
    cursor: { default: 'pointer', ':is([data-disabled])': 'not-allowed' },
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    justifyContent: 'center',
    lineHeight: font['--oniva-font-lh-14'],
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: 'none',
    outlineWidth: 2,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color, box-shadow, border-color',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  focus: { outlineStyle: 'solid' },
  tabMd: { height: 36, paddingInline: 4 },
  tabSm: { height: 32, paddingInline: 2 },
  line: {
    borderBottomColor: 'transparent',
    borderBottomWidth: 2,
    marginBottom: -1,
    paddingInline: 2,
  },
  lineV: {
    borderBottomWidth: 0,
    borderRightColor: 'transparent',
    borderRightWidth: 2,
    justifyContent: 'flex-start',
    marginBottom: 0,
    marginRight: -1,
    paddingInline: 12,
  },
  lineSelected: {
    borderBottomColor: accent['--oniva-accent-500'],
    borderRightColor: accent['--oniva-accent-500'],
    color: colors['--oniva-color-text'],
  },
  lineIdle: {
    color: { default: colors['--oniva-color-text-muted'], ':hover': colors['--oniva-color-text'] },
  },
  pill: { borderRadius: radius['--oniva-radius-lg'], paddingInline: 12 },
  pillSm: { borderRadius: radius['--oniva-radius-md'], paddingInline: 10 },
  pillSelected: {
    backgroundColor: colors['--oniva-color-surface'],
    boxShadow: shadow['--oniva-shadow-sm'],
    color: colors['--oniva-color-text'],
  },
  pillIdle: {
    color: { default: colors['--oniva-color-text-muted'], ':hover': colors['--oniva-color-text'] },
  },
  disabled: { color: colors['--oniva-color-text-disabled'] },
  badge: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-text-on-tertiary'],
    fontSize: font['--oniva-font-size-11'],
    fontVariantNumeric: 'tabular-nums',
    lineHeight: font['--oniva-font-lh-11'],
    paddingInline: 6,
  },
  panel: {
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: 'none',
    outlineWidth: 2,
  },
  panelFocus: { outlineStyle: 'solid' },
  panelGrow: { flexGrow: 1, minWidth: 0 },
});

export interface TabsProps extends Omit<AriaTabsProps, 'className' | 'style'> {
  /** `line` = underline tabs, `pill` = segmented tabs on an inset track. */
  variant?: TabsVariant;
  size?: TabsSize;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function Tabs({
  variant = 'line',
  size = 'md',
  className,
  style,
  xstyle,
  ref,
  ...rest
}: TabsProps) {
  const vertical = rest.orientation === 'vertical';
  return (
    <Ctx value={{ variant, size, vertical }}>
      <AriaTabs
        {...rest}
        ref={ref}
        style={style}
        className={sxClass(stylex.props(styles.root, vertical && styles.rootV, xstyle), className)}
      />
    </Ctx>
  );
}

export interface TabListProps<T extends object> extends Omit<
  AriaTabListProps<T>,
  'className' | 'style'
> {
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function TabList<T extends object>({
  className,
  style,
  xstyle,
  ref,
  ...rest
}: TabListProps<T>) {
  const { variant, vertical: v } = use(Ctx);
  return (
    <AriaTabList
      {...rest}
      ref={ref}
      style={style}
      className={() => {
        return sxClass(
          stylex.props(
            styles.list,
            v && styles.listV,
            variant === 'line' && (v ? styles.listLineV : styles.listLine),
            variant === 'pill' && styles.listPill,
            xstyle,
          ),
          className,
        );
      }}
    />
  );
}

export interface TabProps extends Omit<AriaTabProps, 'className' | 'style' | 'children'> {
  children?: ReactNode;
  /** Optional count shown in a small badge. */
  count?: number | string;
  icon?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function Tab({ children, count, icon, className, style, xstyle, ref, ...rest }: TabProps) {
  const { variant, size, vertical: v } = use(Ctx);
  return (
    <AriaTab
      {...rest}
      ref={ref}
      style={style}
      className={(s) => {
        return sxClass(
          stylex.props(
            styles.tab,
            size === 'sm' ? styles.tabSm : styles.tabMd,
            s.isFocusVisible && styles.focus,
            variant === 'line' && styles.line,
            variant === 'line' && v && styles.lineV,
            variant === 'line' && (s.isSelected ? styles.lineSelected : styles.lineIdle),
            variant === 'pill' && (size === 'sm' ? styles.pillSm : styles.pill),
            variant === 'pill' && (s.isSelected ? styles.pillSelected : styles.pillIdle),
            s.isDisabled && styles.disabled,
            xstyle,
          ),
          className,
        );
      }}
    >
      {icon}
      {children}
      {count !== undefined && <span {...stylex.props(styles.badge)}>{count}</span>}
    </AriaTab>
  );
}

export interface TabPanelProps extends Omit<AriaTabPanelProps, 'className' | 'style'> {
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function TabPanel({ className, style, xstyle, ref, ...rest }: TabPanelProps) {
  return (
    <AriaTabPanel
      {...rest}
      ref={ref}
      style={style}
      className={(s) =>
        sxClass(
          stylex.props(
            styles.panel,
            styles.panelGrow,
            s.isFocusVisible && styles.panelFocus,
            xstyle,
          ),
          className,
        )
      }
    />
  );
}
