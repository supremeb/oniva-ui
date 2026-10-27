import type { DemoModule } from '../../internal/demo';
import { AppDirectory } from './AppDirectory';

const demo: DemoModule = {
  meta: {
    title: 'App directory',
    slug: 'app-directory',
    category: 'Blocks',
    description: 'Browse, search and connect integrations: categories, a status filter and app cards with a connect flow. Neutral monogram tiles, no brand logos.',
  },
  demos: [
    { name: 'Default', code: `<AppDirectory defaultCategory="essentials" />`, Component: () => <AppDirectory defaultCategory="essentials" /> },
    { name: 'Custom heading', code: `<AppDirectory title="Connected tools" subtitle="Manage what your workspace can reach." />`, Component: () => <AppDirectory title="Connected tools" subtitle="Manage what your workspace can reach." /> },
  ],
};
export default demo;
