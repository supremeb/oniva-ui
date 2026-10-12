import { Calendar, Columns3, Home, Landmark } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import type { DemoModule } from '../../internal/demo';
import { demoStyles } from '../../internal/nav-demo';
import { Breadcrumb, Breadcrumbs } from '../Breadcrumbs';
import { Grid } from '../Grid';
import {
  Sidebar,
  SidebarAccount,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
} from '../Sidebar';
import { LayoutShell } from './LayoutShell';

const demo: DemoModule = {
  meta: {
    title: 'Layout shell',
    slug: 'layout-shell',
    category: 'Layout',
    description:
      'Application frame with sidebar, header and scrollable content. Below 768px the sidebar becomes an off-canvas drawer.',
  },
  demos: [
    {
      name: 'Dashboard frame',
      code: `<LayoutShell
  sidebar={<Sidebar>…</Sidebar>}
  header={<Breadcrumbs aria-label="Breadcrumb">…</Breadcrumbs>}
>
  <Grid columns={3}>…</Grid>
</LayoutShell>`,
      Component: () => (
        <div
          style={{
            height: 520,
            overflow: 'hidden',
            position: 'relative',
            transform: 'translateZ(0)',
          }}
        >
          <LayoutShell
            sidebar={
              <Sidebar aria-label="App">
                <SidebarHeader name="Acme Finance" />
                <SidebarContent>
                  <SidebarSection>
                    <SidebarItem href="#" icon={<Home size={18} />} isActive badge="12">
                      Overview
                    </SidebarItem>
                    <SidebarItem href="#" icon={<Landmark size={18} />}>
                      Accounts
                    </SidebarItem>
                    <SidebarItem href="#" icon={<Columns3 size={18} />}>
                      Pipeline
                    </SidebarItem>
                    <SidebarItem href="#" icon={<Calendar size={18} />}>
                      Schedule
                    </SidebarItem>
                  </SidebarSection>
                </SidebarContent>
                <SidebarFooter>
                  <SidebarAccount name="Aylin Demir" email="aylin@acme.co" />
                </SidebarFooter>
              </Sidebar>
            }
            header={
              <Breadcrumbs aria-label="Breadcrumb">
                <Breadcrumb href="#">Acme Finance</Breadcrumb>
                <Breadcrumb>Overview</Breadcrumb>
              </Breadcrumbs>
            }
          >
            <Grid columns={3} gap={12}>
              {[
                ['Revenue', '$128,430'],
                ['Active customers', '2,481'],
                ['Churn', '1.8%'],
              ].map(([l, v]) => (
                <div key={l} {...stylex.props(demoStyles.tile)}>
                  <div {...stylex.props(demoStyles.muted)}>{l}</div>
                  <div {...stylex.props(demoStyles.strong)}>{v}</div>
                </div>
              ))}
            </Grid>
          </LayoutShell>
        </div>
      ),
    },
  ],
};
export default demo;
