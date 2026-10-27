import type { DemoModule } from '../../internal/demo';
import { ClientContext } from './ClientContext';

const demo: DemoModule = {
  meta: {
    title: 'Client context',
    slug: 'client-context',
    category: 'Blocks',
    description: 'A client workspace: live KPIs plus a shared context timeline. Switch clients, search, filter, mention reports with @ and add notes or files.',
  },
  demos: [
    { name: 'Default', code: `<ClientContext />`, Component: () => <ClientContext /> },
    { name: 'With author', code: `<ClientContext me={{ name: 'Sam Lee' }} />`, Component: () => <ClientContext me={{ name: 'Sam Lee' }} /> },
  ],
};
export default demo;
