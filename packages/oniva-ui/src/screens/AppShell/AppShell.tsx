import * as stylex from '@stylexjs/stylex';
import { Button as AriaButton } from 'react-aria-components';
import { useMove } from 'react-aria';
import {
  ChevronDown,
  FolderOpen,
  Search,
  Globe,
  NotebookPen,
  PanelLeft,
  PanelRight,
  Plug,
  SquarePen,
  SquareTerminal,
  X,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { m8, step } from '../../internal/m8-motion';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { Presence } from '../../motion/Presence/Presence';
import { media } from '../../tokens/media.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { Avatar } from '../../components/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../components/DropdownMenu';

const NARROW = '@container (max-width: 719px)';
const WIDE = '@container (min-width: 720px)';

const styles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    containerType: 'inline-size',
    fontFamily: font['--oniva-font-sans'],
    height: '100%',
    minHeight: 0,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  rootFlat: { backgroundColor: colors['--oniva-color-surface'] },
  frame: {
    boxSizing: 'border-box',
    display: 'flex',
    height: '100%',
    minWidth: 0,
    width: '100%',
  },
  frameInset: { padding: { default: 8, [NARROW]: 0 } },
  scrim: {
    backgroundColor: colors['--oniva-color-overlay'],
    display: { default: 'none', [NARROW]: 'block' },
    inset: 0,
    position: 'absolute',
    zIndex: 30,
  },
  /* ---- sidebar / panel columns ---- */
  side: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    gap: 8,
    height: '100%',
    insetBlock: { default: 'auto', [NARROW]: 0 },
    minHeight: 0,
    padding: 8,
    position: { default: 'relative', [NARROW]: 'absolute' },
    width: { default: 'min(var(--oniva-as-sw), 28cqw)', [NARROW]: 'min(300px, 85%)' },
    zIndex: { default: 'auto', [NARROW]: 40 },
    transitionDuration: motion['--oniva-motion-dur-sheet'],
    transitionProperty: 'transform, visibility',
    transitionTimingFunction: motion['--oniva-motion-ease-drawer'],
  },
  sideFlat: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: 1,
    boxShadow: { default: 'none', [NARROW]: shadow['--oniva-elevation-overlay'] },
  },
  sideInset: {
    backgroundColor: { default: 'transparent', [NARROW]: colors['--oniva-color-surface-inset'] },
    boxShadow: { default: 'none', [NARROW]: shadow['--oniva-elevation-overlay'] },
    paddingInlineEnd: { default: 4, [NARROW]: 12 },
  },
  sideStart: {
    insetInlineStart: { default: 'auto', [NARROW]: 0 },
    transform: { default: 'none', [NARROW]: 'translateX(-105%)' },
  },
  sideStartOpen: { transform: 'none', visibility: 'visible' },
  sideEnd: {
    insetInlineEnd: { default: 'auto', [NARROW]: 0 },
    transform: { default: 'none', [NARROW]: 'translateX(105%)' },
    width: { default: 'min(var(--oniva-as-pw), 34cqw)', [NARROW]: 'min(360px, 92%)' },
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 1,
    boxShadow: { default: 'none', [NARROW]: shadow['--oniva-elevation-overlay'] },
  },
  sideEndInset: {
    backgroundColor: { default: 'transparent', [NARROW]: colors['--oniva-color-surface'] },
    borderWidth: 0,
    marginInlineStart: { default: 4, [NARROW]: 0 },
    height: '100%',
  },
  /** Wide screens, mid fold: the column leaves the flow but stays painted while it slides out (transform only). */
  sideLeaving: {
    height: { default: 'auto', [NARROW]: null },
    insetBlock: 0,
    pointerEvents: 'none',
    position: { default: 'absolute', [NARROW]: null },
    zIndex: { default: 4, [NARROW]: null },
  },
  sideLeavingInsetBlock: { insetBlock: { default: 8, [NARROW]: null } },
  sideLeavingStart: { insetInlineStart: { default: 0, [NARROW]: null }, transform: 'none' },
  sideLeavingEnd: { insetInlineEnd: { default: 0, [NARROW]: null }, transform: 'none' },
  sideLeavingInsetStart: { insetInlineStart: { default: 8, [NARROW]: null } },
  sideLeavingInsetEnd: { insetInlineEnd: { default: 8, [NARROW]: null } },
  /** Wide screens: a folded column leaves the flow. Narrow: it slides off-canvas. */
  sideClosedWide: { display: { default: null, [WIDE]: 'none' } },
  sideHiddenNarrow: { visibility: { default: null, [NARROW]: 'hidden' } },
  /* ---- sidebar content ---- */
  brandRow: { alignItems: 'center', display: 'flex', gap: 2, justifyContent: 'space-between' },
  /** Flat: thin bar above the workspace row, aligned with the page header. */
  topBar: {
    alignItems: 'center',
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'space-between',
    marginBlockStart: -8,
    marginInline: -8,
    minHeight: 44,
    paddingInline: 10,
  },
  topBarPanel: { justifyContent: 'space-between', paddingInlineStart: 14 },
  iconSm: { height: 28, width: 28 },
  floatBar: {
    display: 'flex',
    gap: 4,
    insetBlockStart: 8,
    insetInline: 8,
    justifyContent: 'space-between',
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 3,
  },
  floatBtn: { pointerEvents: 'auto' },
  titleChevron: { color: colors['--oniva-color-icon-muted'], flexShrink: 0, marginInlineStart: 4, verticalAlign: 'middle' },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-icon-muted'],
    display: 'flex',
    flexShrink: 0,
    gap: 8,
    minHeight: 30,
    paddingInline: 8,
  },
  searchInput: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    flexGrow: 1,
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-12'],
    minWidth: 0,
    outline: 'none',
    padding: 0,
  },
  panelCard: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
  },
  panelCardInset: { backgroundColor: colors['--oniva-color-surface'] },
  panelDivided: {
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
  },
  panelStack: { display: 'flex', flexDirection: 'column', gap: 12 },
  brand: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderRadius: radius['--oniva-radius-lg'],
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    flexGrow: 1,
    font: 'inherit',
    gap: 8,
    minWidth: 0,
    paddingBlock: 6,
    paddingInline: 6,
    textAlign: 'start',
  },
  logo: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-text'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-bg'],
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  brandName: {
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-semibold'],
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  chevron: { color: colors['--oniva-color-icon-muted'], flexShrink: 0 },
  iconBtn: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-icon-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    height: 32,
    justifyContent: 'center',
    width: 32,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color',
  },
  narrowOnly: { display: { default: 'none', [NARROW]: 'inline-flex' } },
  scroll: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    gap: 12,
    minHeight: 0,
    overflowY: 'auto',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', margin: 0, padding: 0 },
  groupLabel: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-label'],
    margin: 0,
    paddingBlock: 4,
    paddingInline: 8,
  },
  item: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text-muted'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 8,
    minHeight: 28,
    paddingBlock: 4,
    paddingInline: 8,
    textAlign: 'start',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color',
    width: '100%',
  },
  itemActive: {
    backgroundColor: colors['--oniva-color-surface-active'],
    color: colors['--oniva-color-text'],
  },
  itemIcon: { color: colors['--oniva-color-icon-muted'], display: 'inline-flex', flexShrink: 0 },
  itemLabel: { flexGrow: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  count: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
  },
  dot: {
    backgroundColor: colors['--oniva-color-accent-text'],
    borderRadius: radius['--oniva-radius-full'],
    flexShrink: 0,
    height: 6,
    marginInline: 5,
    opacity: 0.7,
    width: 6,
  },
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    gap: 4,
    padding: 12,
    position: 'relative',
  },
  cardTitle: {
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-semibold'],
    margin: 0,
    paddingInlineEnd: 24,
  },
  cardBody: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    lineHeight: font['--oniva-font-lh-16'],
    margin: 0,
  },
  cardLink: {
    alignSelf: 'flex-start',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-accent-text'],
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    marginBlockStart: 4,
    padding: 0,
    textDecoration: { default: 'none', ':hover': 'underline' },
  },
  cardClose: { height: 24, insetBlockStart: 6, insetInlineEnd: 6, position: 'absolute', width: 24 },
  account: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderRadius: radius['--oniva-radius-lg'],
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    flexShrink: 0,
    font: 'inherit',
    gap: 8,
    padding: 6,
    textAlign: 'start',
    width: '100%',
  },
  accountName: {
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  /* ---- main ---- */
  mainCol: { display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0, minWidth: 0, position: 'relative' },
  mainColInset: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: { default: radius['--oniva-radius-xl'], [NARROW]: 0 },
    borderStyle: { default: 'solid', [NARROW]: 'none' },
    borderWidth: 1,
    boxShadow: { default: 'none', [NARROW]: 'none' },
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexShrink: 0,
    gap: 8,
    minHeight: 44,
    paddingInline: 12,
  },
  headerFlat: { backgroundColor: colors['--oniva-color-surface'] },
  title: {
    flexGrow: 1,
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-20'],
    margin: 0,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  actions: { alignItems: 'center', display: 'flex', flexShrink: 0, gap: 8 },
  main: {
    backgroundColor: colors['--oniva-color-surface'],
    boxSizing: 'border-box',
    flexGrow: 1,
    minHeight: 0,
    minWidth: 0,
    overflow: 'auto',
    position: 'relative',
  },
  /* ---- separators ---- */
  sep: {
    alignSelf: 'stretch',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    cursor: 'col-resize',
    display: { default: 'block', [NARROW]: 'none' },
    flexShrink: 0,
    margin: 0,
    marginInline: -3,
    padding: 0,
    position: 'relative',
    touchAction: 'none',
    width: 6,
    zIndex: 5,
    '::after': {
      backgroundColor: {
        default: 'transparent',
        ':hover': { default: null, [media.hover]: colors['--oniva-color-border-hover'] },
        ':focus-visible': colors['--oniva-color-focus-ring'],
      },
      borderRadius: 2,
      content: '""',
      insetBlock: 0,
      insetInline: '2px',
      position: 'absolute',
      transitionDuration: motion['--oniva-motion-dur-base'],
      transitionProperty: 'background-color',
    },
  },
  sepDragging: { '::after': { backgroundColor: colors['--oniva-color-accent-text'] } },
  sepHidden: { display: 'none' },
  /* ---- workspace panel ---- */
  panelHead: { alignItems: 'center', display: 'flex', justifyContent: 'space-between', minHeight: 28, paddingInline: 4 },
  panelTitle: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  panelRow: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    minHeight: 30,
    paddingBlock: 4,
    paddingInline: 8,
    textAlign: 'start',
    width: '100%',
  },
  srcMain: { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 },
  srcSub: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  kbd: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
  },
  mark: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-sm'],
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  wnWrap: { flexShrink: 0 },
  panelBody: { flexGrow: 1, minHeight: 0, overflow: 'auto' },
});

/* ------------------------------------------------------------------ types */

export type AppShellLayout = 'flat' | 'inset';

export interface ShellNavItem {
  label: string;
  icon?: ReactNode;
  /** Small trailing number (unread, items). */
  count?: number;
}
export interface ShellGroup {
  label: string;
  items: string[];
}
export interface WorkspaceTool {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
}
export interface WorkspaceSource {
  id: string;
  title: string;
  source: string;
  /** One or two letters shown in a small tile. */
  mark?: string;
}
export interface ShellWidth {
  default?: number;
  min?: number;
  max?: number;
}
export interface ShellWhatsNew {
  title: string;
  description: string;
  /** Label of the link under the text. */
  action?: string;
}

export interface AppShellProps {
  /** The page shown next to the sidebar. */
  children?: ReactNode;
  /** `flat`: gray sidebar and an edge-to-edge page split by a hairline. `inset`: the page is a card on a gray frame. */
  layout?: AppShellLayout;
  /** Page title shown in the header (the screen's heading). */
  title?: ReactNode;
  /** Header actions, on the right of the title. */
  actions?: ReactNode;
  /** Hide the header bar entirely. Fold toggles float over the page instead. */
  hideHeader?: boolean;
  /** Show a small chevron after the title (it opens a page menu in your app). */
  titleMenu?: boolean;
  /** Called by the search icon in the sidebar top row. */
  onSearch?: () => void;
  /** `1` (default) or `2` when the shell sits inside a page that has its own h1. */
  headingLevel?: 1 | 2;
  /** Label of the open menu item or project. */
  active?: string;
  onNavigate?: (label: string) => void;
  workspace?: string;
  /** Other workspaces; when given, the workspace name opens a switcher menu. */
  workspaces?: string[];
  onWorkspaceChange?: (name: string) => void;
  user?: { name: string; avatar?: string };
  onUserPress?: () => void;
  nav?: ShellNavItem[];
  projects?: string[];
  /** Lists under the menu instead of Projects (Tools, Pipelines, ...). */
  groups?: ShellGroup[];
  /** Dismissible card at the bottom of the sidebar. */
  whatsNew?: ShellWhatsNew | false;
  onDismissWhatsNew?: () => void;
  onWhatsNewAction?: () => void;
  sidebarWidth?: ShellWidth;
  /** Controlled sidebar fold (wide screens). */
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  /** Work area on the right. `true` shows tools/sources; a node replaces them. Omit for none. */
  panel?: ReactNode;
  panelTitle?: string;
  panelWidth?: ShellWidth;
  panelOpen?: boolean;
  onPanelOpenChange?: (open: boolean) => void;
  tools?: WorkspaceTool[];
  sources?: WorkspaceSource[];
  onOpen?: (id: string) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const DEFAULT_NAV: ShellNavItem[] = [
  { label: 'New chat', icon: <SquarePen size={16} /> },
  { label: 'Folders', icon: <FolderOpen size={16} /> },
  { label: 'Integrations', icon: <Plug size={16} /> },
];
const DEFAULT_TOOLS: WorkspaceTool[] = [
  { id: 'terminal', label: 'Terminal', icon: <SquareTerminal size={16} />, shortcut: '⌘J' },
  { id: 'browser', label: 'Browser', icon: <Globe size={16} />, shortcut: '⌘B' },
  { id: 'notes', label: 'Notes', icon: <NotebookPen size={16} />, shortcut: '⌘E' },
];

/* ------------------------------------------------------------ fold motion */

type FoldPhase = 'open' | 'leaving' | 'gone';
const DRAWER_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const FOLD_MS = 280;

/**
 * Wide-screen fold of a side column. The column stays painted (out of flow, `leaving`) while it slides off with
 * transform; the page column glides into the freed space with a translate (start column) or a clip reveal (end column).
 * Layout is final from the first frame, so nothing reflows mid-animation. Narrow screens use the drawer transition instead.
 */
function useFoldMotion(
  folded: boolean,
  edge: 'start' | 'end',
  rootRef: { current: HTMLElement | null },
  colRef: { current: HTMLElement | null },
  pageRef: { current: HTMLElement | null },
) {
  const [phase, setPhase] = useState<FoldPhase>(folded ? 'gone' : 'open');
  const prev = useRef(folded);
  const pending = useRef<'out' | 'in' | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useLayoutEffect(() => {
    if (prev.current === folded) return;
    prev.current = folded;
    clearTimeout(timer.current);
    const narrow = (rootRef.current?.clientWidth ?? 1200) < 720;
    if (narrow || prefersReducedMotion() || typeof colRef.current?.animate !== 'function') {
      setPhase(folded ? 'gone' : 'open');
      return;
    }
    pending.current = folded ? 'out' : 'in';
    setPhase(folded ? 'leaving' : 'open');
  }, [folded, rootRef, colRef]);
  useLayoutEffect(() => {
    const a = pending.current;
    const col = colRef.current;
    // Once the column has left the flow, drop the held end state of its exit so a later entrance starts clean.
    if (phase === 'gone') col?.getAnimations?.().forEach((x) => x.cancel());
    if (!a || !col) return;
    if (a === 'in') col.getAnimations?.().forEach((x) => x.cancel());
    pending.current = null;
    const page = pageRef.current;
    const w = col.offsetWidth;
    const rtl = rootRef.current ? getComputedStyle(rootRef.current).direction === 'rtl' : false;
    // sign: +1 when the column sits at the physical left
    const sign = (edge === 'start' ? 1 : -1) * (rtl ? -1 : 1);
    const opts = { duration: FOLD_MS, easing: DRAWER_EASE } as const;
    const off = `translateX(${-sign * 100}%)`;
    if (a === 'out') {
      col.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: off }], { ...opts, fill: 'forwards' });
      if (edge === 'start') page?.animate([{ transform: `translateX(${sign * w}px)` }, { transform: 'none' }], opts);
      else page?.animate([{ clipPath: `inset(0 ${rtl ? 0 : w}px 0 ${rtl ? w : 0}px)` }, { clipPath: 'inset(0 0 0 0)' }], opts);
      timer.current = setTimeout(() => setPhase('gone'), FOLD_MS + 30);
    } else {
      col.animate([{ opacity: 0.4, transform: off }, { opacity: 1, transform: 'none' }], opts);
      if (edge === 'start') page?.animate([{ transform: `translateX(${-sign * w}px)` }, { transform: 'none' }], opts);
    }
  }, [phase, edge, rootRef, colRef, pageRef]);
  useEffect(() => () => clearTimeout(timer.current), []);
  return phase;
}

/* --------------------------------------------------------------- splitter */

interface SplitterArgs {
  value: number;
  min: number;
  max: number;
  initial: number;
  /** +1 when dragging toward the inline end grows the column (sidebar), -1 for the end column. */
  dir: 1 | -1;
  onChange: (n: number) => void;
}

function useSplitter({ value, min, max, initial, dir, onChange }: SplitterArgs) {
  const [dragging, setDragging] = useState(false);
  const clamp = useCallback((n: number) => Math.min(max, Math.max(min, Math.round(n))), [min, max]);
  const rtl = typeof document !== 'undefined' && document.dir === 'rtl';
  const sign = rtl ? -dir : dir;
  const latest = useRef(value);
  latest.current = value;
  const { moveProps } = useMove({
    onMoveStart: () => setDragging(true),
    onMove: (e) => {
      if (e.pointerType === 'keyboard') return;
      latest.current = clamp(latest.current + e.deltaX * sign);
      onChange(latest.current);
    },
    onMoveEnd: () => setDragging(false),
  });
  // Keyboard is handled below (Shift steps, Home/End); drop useMove's own arrow handling.
  const { onKeyDown: _ignored, ...pointerProps } = moveProps;
  void _ignored;
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const step = e.shiftKey ? 64 : 16;
    let next: number | null = null;
    if (e.key === 'ArrowRight') next = value + step * sign;
    else if (e.key === 'ArrowLeft') next = value - step * sign;
    else if (e.key === 'Home') next = min;
    else if (e.key === 'End') next = max;
    if (next === null) return;
    e.preventDefault();
    onChange(clamp(next));
  };
  return {
    dragging,
    props: {
      ...pointerProps,
      onKeyDown,
      onDoubleClick: () => onChange(clamp(initial)),
      role: 'separator' as const,
      'aria-orientation': 'vertical' as const,
      'aria-valuemin': min,
      'aria-valuemax': max,
      'aria-valuenow': value,
      tabIndex: 0,
    },
  };
}

function Splitter({
  label,
  controls,
  hidden,
  ...args
}: SplitterArgs & { label: string; controls: string; hidden?: boolean }) {
  const { props, dragging } = useSplitter(args);
  return (
    <div
      {...props}
      aria-label={label}
      aria-controls={controls}
      {...stylex.props(styles.sep, focus.ring, dragging && styles.sepDragging, hidden && styles.sepHidden)}
    />
  );
}

/* ------------------------------------------------------------------ parts */

function NavButton({
  label,
  icon,
  count,
  active,
  onPress,
  dot,
  index = 0,
}: {
  label: string;
  icon?: ReactNode;
  count?: number;
  active: boolean;
  onPress: () => void;
  dot?: boolean;
  index?: number;
}) {
  return (
    <li {...stylex.props(m8.rise)} style={step(index)}>
      <AriaButton
        aria-current={active ? 'page' : undefined}
        onPress={onPress}
        {...stylex.props(styles.item, focus.ring, active && styles.itemActive)}
      >
        {dot ? (
          <span aria-hidden="true" {...stylex.props(styles.dot)} />
        ) : icon ? (
          <span aria-hidden="true" {...stylex.props(styles.itemIcon)}>
            {icon}
          </span>
        ) : null}
        <span {...stylex.props(styles.itemLabel)}>{label}</span>
        {count !== undefined && <span {...stylex.props(styles.count)}>{count}</span>}
      </AriaButton>
    </li>
  );
}

/**
 * App frame: resizable, collapsible sidebar with nav, projects and a dismissible "what's new" card,
 * a header with title and actions, the page, and an optional resizable work area on the right.
 * Below 720px of container width both columns become drawers.
 */
export function AppShell({
  children,
  layout = 'inset',
  title,
  actions,
  hideHeader = false,
  titleMenu = false,
  onSearch,
  headingLevel = 1,
  active,
  onNavigate,
  workspace = 'Northwind Labs',
  workspaces,
  onWorkspaceChange,
  user = { name: 'Alex Morgan' },
  onUserPress,
  nav = DEFAULT_NAV,
  projects,
  groups,
  whatsNew = false,
  onDismissWhatsNew,
  onWhatsNewAction,
  sidebarWidth,
  sidebarOpen,
  onSidebarOpenChange,
  panel,
  panelTitle = 'Workspace',
  panelWidth,
  panelOpen,
  onPanelOpenChange,
  tools = DEFAULT_TOOLS,
  sources,
  onOpen,
  className,
  xstyle,
  ref,
}: AppShellProps) {
  const uid = useId();
  const sideId = `${uid}-side`;
  const panelId = `${uid}-panel`;
  const flat = layout === 'flat';
  const hasPanel = panel !== undefined && panel !== false && panel !== null;

  const sw = { default: 232, min: 200, max: 380, ...sidebarWidth };
  const pw = { default: 360, min: 280, max: 560, ...panelWidth };
  const [sideW, setSideW] = useState(sw.default);
  const [panelW, setPanelW] = useState(pw.default);

  // wide: fold state. narrow: drawer state. Two flags, one source of truth each.
  const [innerSide, setInnerSide] = useState(true);
  const sideFolded = !(sidebarOpen ?? innerSide);
  const [drawer, setDrawer] = useState<'side' | 'panel' | null>(null);
  const [innerPanel, setInnerPanel] = useState(true);
  const panelFolded = !(panelOpen ?? innerPanel);
  const [wnDismissed, setWnDismissed] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sideRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const sidePhase = useFoldMotion(sideFolded, 'start', rootRef, sideRef, pageRef);
  const panelPhase = useFoldMotion(panelFolded, 'end', rootRef, panelRef, pageRef);
  // Page swap: the page area softly re-enters when the open item changes (no remount, so page state survives).
  const lastActive = useRef(active);
  useEffect(() => {
    if (lastActive.current === active) return;
    lastActive.current = active;
    const el = mainRef.current;
    if (!el || prefersReducedMotion() || typeof el.animate !== 'function') return;
    el.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  }, [active]);

  const setSide = (o: boolean) => {
    if (sidebarOpen === undefined) setInnerSide(o);
    onSidebarOpenChange?.(o);
  };
  const setPanel = (o: boolean) => {
    if (panelOpen === undefined) setInnerPanel(o);
    onPanelOpenChange?.(o);
  };
  const isNarrow = () => (rootRef.current?.clientWidth ?? 1200) < 720;
  const toggleSide = () => {
    if (isNarrow()) setDrawer(drawer === 'side' ? null : 'side');
    else setSide(sideFolded);
  };
  const togglePanel = () => {
    if (isNarrow()) setDrawer(drawer === 'panel' ? null : 'panel');
    else setPanel(panelFolded);
  };
  const go = (label: string) => {
    onNavigate?.(label);
    setDrawer(null);
  };

  const H: ElementType = headingLevel === 1 ? 'h1' : 'h2';
  const sideNarrowOpen = drawer === 'side';
  const panelNarrowOpen = drawer === 'panel';
  const sideLabel = sideFolded ? 'Show sidebar' : 'Hide sidebar';

  const sx = stylex.props(styles.root, flat && styles.rootFlat, xstyle);
  const merged = mergeSx(sx, className, {
    '--oniva-as-sw': `${sideW}px`,
    '--oniva-as-pw': `${panelW}px`,
  } as CSSProperties);

  const brand = (
    <>
      <span aria-hidden="true" {...stylex.props(styles.logo)}>
        {workspace.slice(0, 1).toUpperCase()}
      </span>
      <span {...stylex.props(styles.brandName)}>{workspace}</span>
      {workspaces && <ChevronDown size={14} aria-hidden="true" {...stylex.props(styles.chevron)} />}
    </>
  );

  const sideToggle = (
    <AriaButton
      aria-label="Hide sidebar"
      aria-controls={sideId}
      onPress={() => (sideNarrowOpen ? setDrawer(null) : setSide(false))}
      {...stylex.props(styles.iconBtn, styles.iconSm, focus.ring)}
    >
      <PanelLeft size={16} aria-hidden="true" />
    </AriaButton>
  );
  const searchBtn = (
    <AriaButton aria-label="Search" onPress={() => onSearch?.()} {...stylex.props(styles.iconBtn, styles.iconSm, focus.ring)}>
      <Search size={16} aria-hidden="true" />
    </AriaButton>
  );
  const panelToggle = (
    <AriaButton
      aria-label={`Hide ${panelTitle.toLowerCase()}`}
      onPress={() => (panelNarrowOpen ? setDrawer(null) : setPanel(false))}
      {...stylex.props(styles.iconBtn, styles.iconSm, focus.ring)}
    >
      <PanelRight size={16} aria-hidden="true" />
    </AriaButton>
  );

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      data-layout={layout}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && drawer) {
          setDrawer(null);
        }
      }}
      {...merged}
    >
      <div {...stylex.props(styles.frame, !flat && styles.frameInset)}>
        {/* ---------------- sidebar ---------------- */}
        <aside
          id={sideId}
          ref={sideRef}
          aria-label={`${workspace} sidebar`}
          {...stylex.props(
            styles.side,
            flat ? styles.sideFlat : styles.sideInset,
            styles.sideStart,
            sideNarrowOpen && styles.sideStartOpen,
            !sideNarrowOpen && styles.sideHiddenNarrow,
            sidePhase === 'gone' && styles.sideClosedWide,
            sidePhase === 'leaving' && styles.sideLeaving,
            sidePhase === 'leaving' && styles.sideLeavingStart,
            sidePhase === 'leaving' && !flat && styles.sideLeavingInsetBlock,
            sidePhase === 'leaving' && !flat && styles.sideLeavingInsetStart,
          )}
        >
          {flat && (
            <div {...stylex.props(styles.topBar)}>
              {sideToggle}
              {searchBtn}
            </div>
          )}
          <div {...stylex.props(styles.brandRow)}>
            {workspaces ? (
              <DropdownMenu>
                <AriaButton aria-label={`Workspace: ${workspace}`} {...stylex.props(styles.brand, focus.ring)}>
                  {brand}
                </AriaButton>
                <DropdownMenuContent
                  aria-label="Switch workspace"
                  onAction={(k) => {
                    onWorkspaceChange?.(String(k));
                  }}
                >
                  {workspaces.map((w) => (
                    <DropdownMenuItem key={w} id={w}>
                      {w}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div {...stylex.props(styles.brand)}>{brand}</div>
            )}
            {!flat && (
              <>
                {searchBtn}
                {sideToggle}
              </>
            )}
          </div>

          <nav aria-label="Main" {...stylex.props(styles.scroll)}>
            <ul {...stylex.props(styles.list)}>
              {nav.map((n, ni) => (
                <NavButton
                  index={ni}
                  key={n.label}
                  {...n}
                  active={active === n.label}
                  onPress={() => go(n.label)}
                />
              ))}
            </ul>
            {projects && projects.length > 0 && (
              <section aria-labelledby={`${uid}-projects`}>
                <h2 id={`${uid}-projects`} {...stylex.props(styles.groupLabel)}>
                  Projects
                </h2>
                <ul {...stylex.props(styles.list)}>
                  {projects.map((p, pi) => (
                    <NavButton index={nav.length + pi} key={p} label={p} icon={<FolderOpen size={16} />} active={active === p} onPress={() => go(p)} />
                  ))}
                </ul>
              </section>
            )}
            {groups?.map((g, i) => (
              <section key={g.label} aria-labelledby={`${uid}-g${i}`}>
                <h2 id={`${uid}-g${i}`} {...stylex.props(styles.groupLabel)}>
                  {g.label}
                </h2>
                <ul {...stylex.props(styles.list)}>
                  {g.items.map((p, pi) => (
                    <NavButton index={nav.length + pi} key={p} label={p} icon={<FolderOpen size={16} />} active={active === p} onPress={() => go(p)} />
                  ))}
                </ul>
              </section>
            ))}
          </nav>

          {whatsNew && (
            <Presence isPresent={!wnDismissed} preset="slide" initial={false} xstyle={styles.wnWrap}>
            <section aria-label="What's new" {...stylex.props(styles.card)}>
              <h2 {...stylex.props(styles.cardTitle)}>{whatsNew.title}</h2>
              <p {...stylex.props(styles.cardBody)}>{whatsNew.description}</p>
              {whatsNew.action && (
                <AriaButton onPress={() => onWhatsNewAction?.()} {...stylex.props(styles.cardLink, focus.ring)}>
                  {whatsNew.action}
                </AriaButton>
              )}
              <AriaButton
                aria-label="Dismiss what's new"
                onPress={() => {
                  setWnDismissed(true);
                  onDismissWhatsNew?.();
                }}
                {...stylex.props(styles.iconBtn, styles.cardClose, focus.ring)}
              >
                <X size={14} aria-hidden="true" />
              </AriaButton>
            </section>
            </Presence>
          )}

          <AriaButton aria-label={`Account: ${user.name}`} onPress={() => onUserPress?.()} {...stylex.props(styles.account, focus.ring)}>
            <Avatar name={user.name} src={user.avatar} size="sm" />
            <span {...stylex.props(styles.accountName)}>{user.name}</span>
          </AriaButton>
        </aside>

        <Splitter
          label="Resize sidebar"
          controls={sideId}
          hidden={sideFolded}
          value={sideW}
          min={sw.min}
          max={sw.max}
          initial={sw.default}
          dir={1}
          onChange={setSideW}
        />

        {/* ---------------- page ---------------- */}
        <div ref={pageRef} {...stylex.props(styles.mainCol, !flat && styles.mainColInset)}>
          {!hideHeader && (
            <header {...stylex.props(styles.header, flat && styles.headerFlat)}>
              <AriaButton
                aria-label={sideLabel}
                aria-controls={sideId}
                aria-expanded={sideNarrowOpen || !sideFolded}
                onPress={toggleSide}
                {...stylex.props(
                  styles.iconBtn,
                  !sideFolded && !sideNarrowOpen && styles.narrowOnly,
                  focus.ring,
                )}
              >
                <PanelLeft size={16} aria-hidden="true" />
              </AriaButton>
              {title !== undefined && (
                <H {...stylex.props(styles.title)}>
                  {title}
                  {titleMenu && <ChevronDown size={14} aria-hidden="true" {...stylex.props(styles.titleChevron)} />}
                </H>
              )}
              {title === undefined && <span {...stylex.props(styles.title)} />}
              <div {...stylex.props(styles.actions)}>
                {actions}
                {hasPanel && (
                  <AriaButton
                    aria-label={panelFolded ? `Show ${panelTitle.toLowerCase()}` : `Hide ${panelTitle.toLowerCase()}`}
                    aria-controls={panelId}
                    aria-expanded={panelNarrowOpen || !panelFolded}
                    onPress={togglePanel}
                    {...stylex.props(styles.iconBtn, !panelFolded && !panelNarrowOpen && styles.narrowOnly, focus.ring)}
                  >
                    <PanelRight size={16} aria-hidden="true" />
                  </AriaButton>
                )}
              </div>
            </header>
          )}
          {hideHeader && (sideFolded || hasPanel) && (
            <div {...stylex.props(styles.floatBar)}>
              <AriaButton
                aria-label={sideLabel}
                aria-controls={sideId}
                aria-expanded={sideNarrowOpen || !sideFolded}
                onPress={toggleSide}
                {...stylex.props(styles.iconBtn, styles.iconSm, styles.floatBtn, !sideFolded && !sideNarrowOpen && styles.narrowOnly, focus.ring)}
              >
                <PanelLeft size={16} aria-hidden="true" />
              </AriaButton>
              {hasPanel && (
                <AriaButton
                  aria-label={`Show ${panelTitle.toLowerCase()}`}
                  aria-controls={panelId}
                  aria-expanded={panelNarrowOpen || !panelFolded}
                  onPress={togglePanel}
                  {...stylex.props(styles.iconBtn, styles.iconSm, styles.floatBtn, !panelFolded && !panelNarrowOpen && styles.narrowOnly, focus.ring)}
                >
                  <PanelRight size={16} aria-hidden="true" />
                </AriaButton>
              )}
            </div>
          )}
          <main ref={mainRef} tabIndex={-1} {...stylex.props(styles.main, focus.inset)}>
            {children}
          </main>
        </div>

        {/* ---------------- work area ---------------- */}
        {hasPanel && (
          <>
            <Splitter
              label={`Resize ${panelTitle.toLowerCase()}`}
              controls={panelId}
              hidden={panelFolded}
              value={panelW}
              min={pw.min}
              max={pw.max}
              initial={pw.default}
              dir={-1}
              onChange={setPanelW}
            />
            <aside
              id={panelId}
              ref={panelRef}
              aria-label={panelTitle}
              {...stylex.props(
                styles.side,
                styles.sideEnd,
                !flat && styles.sideEndInset,
                panelNarrowOpen && styles.sideStartOpen,
                !panelNarrowOpen && styles.sideHiddenNarrow,
                panelPhase === 'gone' && styles.sideClosedWide,
                panelPhase === 'leaving' && styles.sideLeaving,
                panelPhase === 'leaving' && styles.sideLeavingEnd,
                panelPhase === 'leaving' && !flat && styles.sideLeavingInsetBlock,
                panelPhase === 'leaving' && !flat && styles.sideLeavingInsetEnd,
              )}
            >
              <div {...stylex.props(styles.panelHead, flat && styles.topBar, flat && styles.topBarPanel)}>
                <h2 {...stylex.props(styles.panelTitle)}>{panelTitle}</h2>
                {panelToggle}
              </div>
              <div {...stylex.props(styles.panelBody)}>
                {panel === true ? (
                  <div {...stylex.props(styles.panelStack)}>
                    <label {...stylex.props(styles.searchBox)}>
                      <Search size={14} aria-hidden="true" />
                      <input type="text" aria-label="Search or enter URL" placeholder="Search or enter URL" {...stylex.props(styles.searchInput)} />
                    </label>
                    <section aria-labelledby={`${uid}-tools`}>
                      <h3 id={`${uid}-tools`} {...stylex.props(styles.groupLabel)}>
                        Tools
                      </h3>
                      <ul {...stylex.props(styles.list, styles.panelCard, !flat && styles.panelCardInset)}>
                        {tools.map((t, ti) => (
                          <li key={t.id} {...stylex.props(ti > 0 && styles.panelDivided)}>
                            <AriaButton onPress={() => onOpen?.(t.id)} {...stylex.props(styles.panelRow, focus.ring)}>
                              <span aria-hidden="true" {...stylex.props(styles.itemIcon)}>
                                {t.icon}
                              </span>
                              <span {...stylex.props(styles.itemLabel)}>{t.label}</span>
                              {t.shortcut && <kbd {...stylex.props(styles.kbd)}>{t.shortcut}</kbd>}
                            </AriaButton>
                          </li>
                        ))}
                      </ul>
                    </section>
                    {sources && sources.length > 0 && (
                      <section aria-labelledby={`${uid}-src`}>
                        <h3 id={`${uid}-src`} {...stylex.props(styles.groupLabel)}>
                          Suggested
                        </h3>
                        <ul {...stylex.props(styles.list, styles.panelCard, !flat && styles.panelCardInset)}>
                          {sources.map((s, si) => (
                            <li key={s.id} {...stylex.props(si > 0 && styles.panelDivided)}>
                              <AriaButton onPress={() => onOpen?.(s.id)} {...stylex.props(styles.panelRow, focus.ring)}>
                                <span aria-hidden="true" {...stylex.props(styles.mark)}>
                                  {s.mark ?? s.title.slice(0, 1)}
                                </span>
                                <span {...stylex.props(styles.srcMain)}>
                                  <span {...stylex.props(styles.itemLabel)}>{s.title}</span>
                                  <span {...stylex.props(styles.srcSub)}>{s.source}</span>
                                </span>
                              </AriaButton>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                ) : (
                  panel
                )}
              </div>
            </aside>
          </>
        )}

        <Presence isPresent={drawer !== null} preset="fade" initial aria-hidden="true" onClick={() => setDrawer(null)} xstyle={styles.scrim} />
      </div>
    </div>
  );
}
