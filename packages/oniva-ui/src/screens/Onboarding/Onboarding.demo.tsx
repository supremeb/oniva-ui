import type { DemoModule } from '../../internal/demo';
import { ScreenFrame } from '../../internal/s1-frame';
import { Onboarding } from './Onboarding';

const demo: DemoModule = {
  meta: {
    title: 'Onboarding screen',
    slug: 'onboarding',
    category: 'Screens',
    description:
      'First-run flow: workspace setup, tool connections, team invites and a first agent, with a getting-started checklist that moves below the card on narrow panels.',
  },
  demos: [
    {
      name: 'Connect tools',
      code: `<ScreenFrame>
  <Onboarding defaultStep={2} workspace="Northwind Labs" onComplete={(values) => api.finishOnboarding(values)} />
</ScreenFrame>`,
      Component: () => (
        <ScreenFrame>
          <Onboarding defaultStep={2} workspace="Northwind Labs" />
        </ScreenFrame>
      ),
    },
    {
      name: 'Last step',
      code: `<ScreenFrame>
  <Onboarding defaultStep={4} workspace="Northwind Labs" />
</ScreenFrame>`,
      Component: () => (
        <ScreenFrame>
          <Onboarding defaultStep={4} workspace="Northwind Labs" />
        </ScreenFrame>
      ),
    },
  ],
};
export default demo;
