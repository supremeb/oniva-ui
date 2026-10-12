import * as stylex from '@stylexjs/stylex';
import {
  Bot,
  Columns3,
  Home,
  Landmark,
  Settings as SettingsIcon,
  HeartPulse,
  LifeBuoy,
  type LucideIcon,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarMenu,
  SidebarSection,
  SidebarAccount,
} from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { templates } from '../lib/site';

const styles = stylex.create({
  title: {
    fontSize: font['--oniva-font-size-18'],
    fontWeight: font['--oniva-font-weight-semibold'],
    margin: 0,
  },
  sub: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  headRow: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    gap: 12,
    justifyContent: 'space-between',
    minWidth: 0,
  },
});

const icons: Record<string, LucideIcon> = {
  dashboard: Landmark,
  'ai-chat': Bot,
  'project-board': Columns3,
  'medical-report': HeartPulse,
  settings: SettingsIcon,
};

/** Shared nav sidebar for the non-chat templates: links between every template. */
export function TemplateSidebar({
  active,
  workspace,
  account,
}: {
  active: string;
  workspace: string;
  account: { name: string; email: string };
}) {
  return (
    <Sidebar aria-label="Template navigation">
      <SidebarHeader name={workspace} />
      <SidebarContent>
        <SidebarSection>
          {templates.map((t) => {
            const I = icons[t.slug] ?? Home;
            return (
              <SidebarItem
                key={t.slug}
                href={`#/templates/${t.slug}`}
                icon={<I size={18} />}
                isActive={t.slug === active}
              >
                {t.title}
              </SidebarItem>
            );
          })}
        </SidebarSection>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarItem href="#/components" icon={<LifeBuoy size={18} />}>
            Components
          </SidebarItem>
        </SidebarMenu>
        <SidebarAccount name={account.name} email={account.email} />
      </SidebarFooter>
    </Sidebar>
  );
}

export function PageTitle({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  return (
    <div {...stylex.props(styles.headRow)}>
      <div>
        <h1 {...stylex.props(styles.title)}>{title}</h1>
        {sub ? <div {...stylex.props(styles.sub)}>{sub}</div> : null}
      </div>
      {children}
    </div>
  );
}
