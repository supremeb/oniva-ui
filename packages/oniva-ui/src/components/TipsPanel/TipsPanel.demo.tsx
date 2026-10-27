import type { DemoModule } from '../../internal/demo';
import { Kbd } from '../Kbd';
import { TipsPanel, type Tip } from './TipsPanel';

const tips: Tip[] = [
  { id: 'invite', title: 'Invite your team', description: 'Work on projects together and keep feedback in one place.', action: 'Invite' },
  {
    id: 'search',
    title: 'Quick search',
    description: (
      <>
        Press <Kbd size="sm">⌘K</Kbd> to jump to any page, project or setting.
      </>
    ),
    action: 'Try it',
  },
  { id: 'digest', title: 'Weekly digest', description: 'Get a short summary of what changed every Monday morning.', action: 'Turn on' },
  { id: 'chat', title: 'Connect chat', description: 'Post an update to a channel when something needs your attention.', action: 'Connect' },
  { id: 'mobile', title: 'Mobile app', description: "Check activity and approve requests while you're on the go.", action: 'Get the app' },
  { id: 'plans', title: 'Ready for more?', description: 'Unlimited projects, priority support and advanced analytics.', action: 'See plans', primary: true },
  { id: 'views', title: 'Saved views', description: 'Pin the filters you use every week.', action: 'Create a view' },
  { id: 'shortcuts', title: 'Shortcuts', description: 'Learn the keys that make navigation faster.', action: 'Show me' },
  { id: 'theme', title: 'Dark theme', description: 'Switch themes any time from settings.', action: 'Enable' },
];

const demo: DemoModule = {
  meta: {
    title: 'Tips panel',
    slug: 'tips-panel',
    category: 'Data display',
    description: 'Fluid grid of short tips with one action each. Taken tips turn into a done state.',
  },
  demos: [
    {
      name: 'With close',
      code: `<TipsPanel
  tips={[
    { id: 'search', title: 'Quick search', description: 'Press ⌘K to jump anywhere.', action: 'Try it' },
    { id: 'plans', title: 'Ready for more?', description: 'Unlimited projects.', action: 'See plans', primary: true },
  ]}
  onClose={() => setOpen(false)}
/>`,
      Component: () => <TipsPanel tips={tips} onClose={() => undefined} />,
    },
    {
      name: 'Two tips',
      code: `<TipsPanel title="What's new" tips={tips.slice(0, 2)} />`,
      Component: () => <TipsPanel title="What's new" tips={tips.slice(0, 2)} />,
    },
  ],
};

export default demo;
