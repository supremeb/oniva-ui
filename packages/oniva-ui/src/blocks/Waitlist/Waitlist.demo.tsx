import type { DemoModule } from '../../internal/demo';
import { Waitlist } from './Waitlist';

const demo: DemoModule = {
  meta: {
    title: 'Waitlist',
    slug: 'waitlist',
    category: 'Blocks',
    description: 'Email capture that resolves to an animated success check (badge pops in, check draws).',
  },
  demos: [{ name: 'Default', code: `<Waitlist onJoin={(email) => console.log(email)} />`, Component: () => <Waitlist /> }],
};
export default demo;
