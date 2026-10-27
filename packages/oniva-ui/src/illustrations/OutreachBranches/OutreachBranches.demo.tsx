import type { DemoModule } from '../../internal/demo';
import { OutreachBranches } from './OutreachBranches';

const demo: DemoModule = {
  meta: {
    title: "Outreach branches",
    slug: "outreach-branches",
    category: 'Illustrations',
    description: "One outreach source branching out to three channels, with short coloured pulses flowing down each line.",
  },
  demos: [
    {
      name: "Default",
      code: `<OutreachBranches />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <OutreachBranches />
        </div>
      ),
    },
    {
      name: "Custom channels",
      code: `<OutreachBranches
  source={{ name: 'Launch' }}
  channels={[{ name: 'Email' }, { name: 'Social' }, { name: 'Events' }]}
/>`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <OutreachBranches
            source={{ name: 'Launch' }}
            channels={[{ name: 'Email' }, { name: 'Social' }, { name: 'Events' }]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
