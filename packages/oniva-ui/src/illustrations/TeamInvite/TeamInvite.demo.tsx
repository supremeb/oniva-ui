import type { DemoModule } from '../../internal/demo';
import { TeamInvite } from './TeamInvite';

const demo: DemoModule = {
  meta: {
    title: "Team invite illustration",
    slug: "team-invite",
    category: 'Illustrations',
    description: "Connected teammates: a cursor drags a new one into the empty slot, the line turns solid and they go online. A 4.4 second loop.",
  },
  demos: [
    {
      name: "Default",
      code: `<TeamInvite />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <TeamInvite />
        </div>
      ),
    },
    {
      name: "Custom people",
      code: `<TeamInvite
  avatars={[{ name: 'Ana Silva' }, { name: 'Ben Okafor' }, { name: 'Chloe Martin' }]}
/>`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <TeamInvite
            avatars={[{ name: 'Ana Silva' }, { name: 'Ben Okafor' }, { name: 'Chloe Martin' }]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
