import type { DemoModule } from '../../internal/demo';
import { Ripple } from './Ripple';

const demo: DemoModule = {
  meta: {
    title: "Ripple",
    slug: "ripple",
    category: 'Motion',
    description: "Radial click ripple from the pointer. Skipped under reduced motion.",
  },
  demos: [
    {
      name: "Surface",
      code: "<Ripple><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Click anywhere</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>A 600ms ripple expands from the pointer.</div></div></Ripple>",
      Component: () => (
        <Ripple><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Click anywhere</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>A 600ms ripple expands from the pointer.</div></div></Ripple>
      ),
    },
  ],
};
export default demo;
