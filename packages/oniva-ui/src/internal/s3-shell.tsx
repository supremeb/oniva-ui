import * as stylex from '@stylexjs/stylex';
import {
  Activity,
  BarChart3,
  Bot,
  FlaskConical,
  Home,
  MessageSquare,
  Plug,
  Settings,
} from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { AppShell } from '../screens/AppShell';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { radius } from '../tokens/radius.stylex';

/** Shared frame for the loop-7 screens (S3): sidebar + header + a container-query page. */

export interface ScreenUser {
  name: string;
  avatar?: string;
}

const NAV = [
  { label: 'Home', icon: Home },
  { label: 'Chat', icon: MessageSquare },
  { label: 'Agents', icon: Bot },
  { label: 'Runs', icon: Activity },
  { label: 'Evals', icon: FlaskConical },
  { label: 'Integrations', icon: Plug },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
] as const;

export type ScreenNavLabel = (typeof NAV)[number]['label'];

export const s3 = stylex.create({
  /** Query container for the main area. */
  page: {
    boxSizing: 'border-box',
    containerType: 'inline-size',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    minWidth: 0,
    padding: 24,
    position: 'relative',
    width: '100%',
  },
  card: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 12,
    minWidth: 0,
    padding: 16,
  },
  h: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-20'],
    margin: 0,
  },
  muted: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-18'],
    margin: 0,
  },
  num: { fontVariantNumeric: 'tabular-nums' },
  row: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 },
  between: { alignItems: 'center', display: 'flex', gap: 12, justifyContent: 'space-between' },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  mono: { fontFamily: font['--oniva-font-mono'] },
  srOnly: {
    borderWidth: 0,
    clipPath: 'inset(50%)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
});

export interface ScreenShellProps {
  workspace: string;
  user: ScreenUser;
  /** Sidebar label shown as the current page. */
  active: ScreenNavLabel;
  /** Page title in the top bar. */
  title: ReactNode;
  /** Top bar buttons, right-aligned. */
  actions?: ReactNode;
  headingLevel?: 1 | 2;
  onNavigate?: (label: string) => void;
  className?: string;
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

export function ScreenShell({
  workspace,
  user,
  active,
  title,
  actions,
  headingLevel = 1,
  onNavigate,
  className,
  ref,
  children,
}: ScreenShellProps) {
  return (
    <AppShell
      ref={ref}
      className={className}
      layout="flat"
      workspace={workspace}
      user={user}
      active={active}
      nav={NAV.map(({ label, icon: Icon }) => ({ label, icon: <Icon size={16} /> }))}
      projects={[]}
      whatsNew={false}
      title={title}
      actions={actions}
      headingLevel={headingLevel}
      onNavigate={onNavigate}
    >
      <div {...stylex.props(s3.page)}>{children}</div>
    </AppShell>
  );
}

/** Frame used by demos: bordered app window ~720px tall. */
export { ScreenFrame } from './s1-frame';
