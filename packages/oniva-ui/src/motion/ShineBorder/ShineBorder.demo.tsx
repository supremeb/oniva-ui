import type { DemoModule } from '../../internal/demo';
import { ShineBorder } from './ShineBorder';

const demo: DemoModule = {
  meta: {
    title: "Shine border",
    slug: "shine-border",
    category: 'Motion',
    description: "A full gradient ring that slowly rotates around the border. Pauses offscreen.",
  },
  demos: [
    {
      name: "Card",
      code: "<ShineBorder><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Invoice #4821</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>$12,480.00 due Oct 28</div></div></ShineBorder>",
      Component: () => (
        <ShineBorder><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Invoice #4821</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>$12,480.00 due Oct 28</div></div></ShineBorder>
      ),
    },
    {
      name: "Static",
      code: "<ShineBorder isActive={false} borderWidth={2}><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Paused</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>isActive={false} keeps the gradient still.</div></div></ShineBorder>",
      Component: () => (
        <ShineBorder isActive={false} borderWidth={2}><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Paused</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>isActive={false} keeps the gradient still.</div></div></ShineBorder>
      ),
    },
  ],
};
export default demo;
