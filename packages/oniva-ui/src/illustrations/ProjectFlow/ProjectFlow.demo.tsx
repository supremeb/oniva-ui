import type { DemoModule } from '../../internal/demo';
import { ProjectFlow } from './ProjectFlow';

const demo: DemoModule = {
  meta: {
    title: "Project flow",
    slug: "project-flow",
    category: 'Illustrations',
    description: "A client task branching into subtasks, notes and assigned roles. Cards build up one after another and a cursor drags the subtasks in.",
  },
  demos: [
    {
      name: "Default",
      code: `<ProjectFlow />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <ProjectFlow />
        </div>
      ),
    },
    {
      name: "Inverted cards",
      code: `<ProjectFlow isInverted client="Harbor Pay" task="Launch the pricing page" />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <ProjectFlow isInverted client="Harbor Pay" task="Launch the pricing page" />
        </div>
      ),
    },
  ],
};

export default demo;
