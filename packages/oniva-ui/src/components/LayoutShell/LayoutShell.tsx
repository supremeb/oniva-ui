import * as stylex from '@stylexjs/stylex';
import { focus } from '../../internal/focus';
import { Button as AriaButton } from 'react-aria-components';
import { Menu } from 'lucide-react';
import { useState, type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const MOBILE = '@media (max-width: 767px)';

const styles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    gap: 12,
    height: '100%',
    minHeight: 0,
    padding: { default: 12, [MOBILE]: 0 },
    position: 'relative',
    width: '100%',
  },
  sidebar: {
    display: 'flex',
    flexShrink: 0,
    height: '100%',
    insetBlock: { default: 'auto', [MOBILE]: 0 },
    insetInlineStart: { default: 'auto', [MOBILE]: 0 },
    padding: { default: 0, [MOBILE]: 8 },
    position: { default: 'static', [MOBILE]: 'fixed' },
    transform: { default: 'none', [MOBILE]: 'translateX(-110%)' },
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
    zIndex: { default: 'auto', [MOBILE]: 40 },
    boxSizing: 'border-box',
  },
  sidebarOpen: { transform: { default: 'none', [MOBILE]: 'translateX(0)' } },
  scrim: {
    backgroundColor: colors['--oniva-color-overlay'],
    display: { default: 'none', [MOBILE]: 'block' },
    inset: 0,
    position: 'fixed',
    zIndex: 30,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    gap: 12,
    minHeight: 0,
    minWidth: 0,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexShrink: 0,
    gap: 8,
    minHeight: 56,
    paddingInline: 16,
  },
  headerContent: { alignItems: 'center', display: 'flex', flexGrow: 1, gap: 12, minWidth: 0 },
  menuBtn: {
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
    display: { default: 'none', [MOBILE]: 'inline-flex' },
    flexShrink: 0,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  content: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    flexGrow: 1,
    minHeight: 0,
    overflow: 'auto',
    padding: 24,
  },
});

export interface LayoutShellProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'style' | 'className' | 'children'
> {
  /** Usually a `Sidebar`. Becomes an off-canvas drawer below 768px. */
  sidebar?: ReactNode;
  /** Content of the top bar (breadcrumbs, title, actions). */
  header?: ReactNode;
  /** Main page content. */
  children?: ReactNode;
  /** Controlled mobile drawer state. */
  sidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** App frame: sidebar + header + scrollable content. Collapses the sidebar into a drawer on small screens. */
export function LayoutShell({
  sidebar,
  header,
  children,
  sidebarOpen,
  onSidebarOpenChange,
  className,
  style,
  xstyle,
  ref,
  ...rest
}: LayoutShellProps) {
  const [inner, setInner] = useState(false);
  const open = sidebarOpen ?? inner;
  const setOpen = (o: boolean) => {
    if (sidebarOpen === undefined) setInner(o);
    onSidebarOpenChange?.(o);
  };
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className, style)}>
      {sidebar && (
        <>
          {open && (
            <div
              aria-hidden="true"
              onClick={() => setOpen(false)}
              {...stylex.props(styles.scrim)}
            />
          )}
          <div
            data-open={open || undefined}
            {...stylex.props(styles.sidebar, open && styles.sidebarOpen)}
          >
            {sidebar}
          </div>
        </>
      )}
      <div {...stylex.props(styles.main)}>
        {(header || sidebar) && (
          <header {...stylex.props(styles.header)}>
            {sidebar && (
              <AriaButton
                aria-label={open ? 'Close navigation' : 'Open navigation'}
                aria-expanded={open}
                onPress={() => setOpen(!open)}
                {...stylex.props(styles.menuBtn, focus.ring)}
              >
                <Menu size={18} />
              </AriaButton>
            )}
            <div {...stylex.props(styles.headerContent)}>{header}</div>
          </header>
        )}
        <main tabIndex={-1} {...stylex.props(styles.content, focus.inset)}>
          {children}
        </main>
      </div>
    </div>
  );
}
