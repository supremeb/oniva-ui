import type { DemoModule } from '../../internal/demo';
import { ScreenFrame } from '../../internal/s1-frame';
import { Evals } from './Evals';

const demo: DemoModule = {
  meta: {
    title: 'Evals screen',
    slug: 'evals',
    category: 'Screens',
    description:
      'Prompt evaluation dashboard: pass rate by version, a reviewable prompt diff (Y accepts, N rejects) and test cases you can filter, inspect and re-run.',
  },
  demos: [
    {
      name: 'Support agent evals',
      code: `<ScreenFrame>
  <Evals workspace="Northwind Labs" onRun={() => api.runEval()} onSelectCase={(id) => setCase(id)} />
</ScreenFrame>`,
      Component: () => (
        <ScreenFrame>
          <Evals workspace="Northwind Labs" />
        </ScreenFrame>
      ),
    },
  ],
};
export default demo;
