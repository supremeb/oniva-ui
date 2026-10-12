import type { DemoModule } from '../../internal/demo';
import { RollingText } from './RollingText';

const demo: DemoModule = {
  meta: {
    title: "Rolling text",
    slug: "rolling-text",
    category: 'Motion',
    description: "Per-character reel roll on hover or focus (250ms, 30ms stagger).",
  },
  demos: [
    {
      name: "Link label",
      code: "<a href=\"#/components/rolling-text\" style={{ fontSize: 18, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}><RollingText text=\"View all customers\" /></a>",
      Component: () => (
        <a href="#/components/rolling-text" style={{ fontSize: 18, fontWeight: 500, color: 'inherit', textDecoration: 'none' }}><RollingText text="View all customers" /></a>
      ),
    },
  ],
};
export default demo;
