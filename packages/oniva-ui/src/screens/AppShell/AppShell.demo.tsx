import { Ellipsis, Share2 } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { NORTHWIND_PROJECTS, NORTHWIND_WHATS_NEW, ScreenFrame } from '../../internal/s1-frame';
import { Button } from '../../components/Button';
import { AppShell } from './AppShell';

const Page = ({ text }: { text: string }) => (
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      height: '100%',
      justifyContent: 'center',
      padding: 24,
      textAlign: 'center',
    }}
  >
    <h2 style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>Your page goes here</h2>
    <p style={{ color: 'var(--oniva-color-text-muted)', fontSize: 12, margin: 0, maxWidth: 320 }}>{text}</p>
  </div>
);
const text = 'The shell brings the sidebar and the scroll container. Put any screen inside; below 720px the sidebar becomes a drawer.';
const actions = (
  <>
    <Button variant='ghost' size='sm' aria-label="Share" startIcon={<Share2 size={14} />} />
    <Button variant='ghost' size='sm' aria-label="More" startIcon={<Ellipsis size={14} />} />
  </>
);
const sources = [
  { id: 'geo', title: 'GEO: Generative Engine Optimization', source: 'arxiv.org', mark: 'A' },
  { id: 'tokens', title: 'Design tokens, a naming guide', source: 'docs.northwind.example', mark: 'N' },
  { id: 'launch', title: 'Q3 launch checklist', source: 'linear.app', mark: 'L' },
];

const demo: DemoModule = {
  meta: {
    title: 'App shell',
    slug: 'app-shell',
    category: 'Screens',
    description:
      'The frame every screen sits in: resizable, collapsible sidebar with workspace, nav, projects and a dismissible what’s new card; a header with title and actions; and an optional work area on the right. Flat or inset.',
  },
  demos: [
    {
      name: 'Flat',
      code: `<AppShell
  layout="flat"
  title="New chat"
  active="New chat"
  projects={['Q3 Campaign', 'Onboarding revamp']}
  whatsNew={{ title: 'What’s new', description: '…', action: 'See what changed' }}
  actions={<Button size="sm">Share</Button>}
>
  <Page />
</AppShell>`,
      Component: () => (
        <ScreenFrame>
          <AppShell
            layout="flat"
            title="New chat"
            titleMenu
            active="New chat"
            projects={NORTHWIND_PROJECTS}
            whatsNew={NORTHWIND_WHATS_NEW}
            actions={actions}
            headingLevel={2}
          >
            <Page text={text} />
          </AppShell>
        </ScreenFrame>
      ),
    },
    {
      name: 'Inset',
      code: `<AppShell layout="inset" hideHeader active="New chat" projects={projects} whatsNew={whatsNew}>
  <Page />
</AppShell>`,
      Component: () => (
        <ScreenFrame>
          <AppShell
            layout="inset"
            hideHeader
            active="New chat"
            projects={NORTHWIND_PROJECTS}
            whatsNew={NORTHWIND_WHATS_NEW}
            headingLevel={2}
          >
            <Page text={text} />
          </AppShell>
        </ScreenFrame>
      ),
    },
    {
      name: 'Workspace, flat',
      code: `<AppShell
  layout="flat"
  titleMenu
  panel
  sources={sources}
  workspaces={['Northwind Labs', 'Northwind Design']}
  onOpen={(id) => openTool(id)}
>
  <Page />
</AppShell>`,
      Component: () => (
        <ScreenFrame>
          <AppShell
            layout="flat"
            title="New chat"
            active="New chat"
            titleMenu
            actions={actions}
            projects={NORTHWIND_PROJECTS}
            whatsNew={NORTHWIND_WHATS_NEW}
            workspaces={['Northwind Labs', 'Northwind Design']}
            panel
            sources={sources}
            headingLevel={2}
          >
            <Page text={text} />
          </AppShell>
        </ScreenFrame>
      ),
    },
    {
      name: 'Workspace, inset',
      code: `<AppShell layout="inset" hideHeader panel sources={sources} workspaces={workspaces}>
  <Page />
</AppShell>`,
      Component: () => (
        <ScreenFrame>
          <AppShell
            layout="inset"
            hideHeader
            active="New chat"
            projects={NORTHWIND_PROJECTS}
            whatsNew={NORTHWIND_WHATS_NEW}
            workspaces={['Northwind Labs', 'Northwind Design']}
            panel
            sources={sources}
            headingLevel={2}
          >
            <Page text={text} />
          </AppShell>
        </ScreenFrame>
      ),
    },
  ],
};
export default demo;
