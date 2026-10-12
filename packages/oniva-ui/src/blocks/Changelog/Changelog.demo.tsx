import type { DemoModule } from '../../internal/demo';
import { Changelog } from './Changelog';

const demo: DemoModule = {
  meta: {
    title: 'Changelog',
    slug: 'changelog',
    category: 'Blocks',
    description: 'Release notes timeline with version, date and change-type badges. Entries fade in as they scroll into view.',
  },
  demos: [{ name: 'Default', code: `<Changelog />`, Component: () => <Changelog /> }],
};
export default demo;
