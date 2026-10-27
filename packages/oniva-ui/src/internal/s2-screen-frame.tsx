import type * as stylex from '@stylexjs/stylex';
import { BarChart3, Bot, Building2, Plug, Settings } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { AppShell, type ShellNavItem } from '../screens/AppShell';

export interface ScreenUser {
  name: string;
  avatar?: string;
}

/** Sidebar entries shared by the Northwind Labs demo screens. */
export const NORTHWIND_NAV: ShellNavItem[] = [
  { label: 'Agents', icon: <Bot size={18} aria-hidden="true" /> },
  { label: 'Integrations', icon: <Plug size={18} aria-hidden="true" /> },
  { label: 'CRM', icon: <Building2 size={18} aria-hidden="true" /> },
  { label: 'Analytics', icon: <BarChart3 size={18} aria-hidden="true" /> },
  { label: 'Settings', icon: <Settings size={18} aria-hidden="true" /> },
];

export interface ScreenFrameProps {
  workspace: string;
  user: ScreenUser;
  /** Label of the current sidebar item. */
  active: string;
  /** Page title (the screen's heading). */
  title: string;
  headingLevel?: 1 | 2;
  onNavigate?: (label: string) => void;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Shared frame of the Northwind demo screens: screens/AppShell with the Northwind navigation. */
export function ScreenFrame({ children, ...rest }: ScreenFrameProps) {
  return (
    <AppShell layout="inset" nav={NORTHWIND_NAV} whatsNew={false} {...rest}>
      {children}
    </AppShell>
  );
}
