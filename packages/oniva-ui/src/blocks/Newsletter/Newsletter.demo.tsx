import type { DemoModule } from '../../internal/demo';
import { Newsletter } from './Newsletter';

const demo: DemoModule = {
  meta: {
    title: 'Newsletter',
    slug: 'newsletter',
    category: 'Blocks',
    description: 'Inline newsletter signup card with confirmation message.',
  },
  demos: [{ name: 'Default', code: `<Newsletter onSubscribe={(email) => console.log(email)} />`, Component: () => <Newsletter /> }],
};
export default demo;
