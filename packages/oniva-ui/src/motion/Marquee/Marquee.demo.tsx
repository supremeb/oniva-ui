import type { DemoModule } from '../../internal/demo';
import { Marquee } from './Marquee';

const demo: DemoModule = {
  meta: {
    title: "Marquee",
    slug: "marquee",
    category: 'Motion',
    description: "Infinite CSS marquee. Pauses on hover/focus and offscreen; static and scrollable under reduced motion.",
  },
  demos: [
    {
      name: "Logo row",
      code: "<Marquee duration={24}>{['Stripe', 'Linear', 'Vercel', 'Ramp', 'Notion', 'Figma', 'Mercury'].map((n) => (<span key={n} style={{ padding: '8px 16px', border: '1px solid var(--oniva-color-border)', borderRadius: 10, fontWeight: 500 }}>{n}</span>))}</Marquee>",
      Component: () => (
        <Marquee duration={24}>{['Stripe', 'Linear', 'Vercel', 'Ramp', 'Notion', 'Figma', 'Mercury'].map((n) => (<span key={n} style={{ padding: '8px 16px', border: '1px solid var(--oniva-color-border)', borderRadius: 10, fontWeight: 500 }}>{n}</span>))}</Marquee>
      ),
    },
    {
      name: "Reverse, no fade",
      code: "<Marquee reverse fade={false} duration={18}>{['Shipped billing v2', 'SOC 2 Type II complete', '99.99% uptime in Q3', '1.2M events per day'].map((n) => (<span key={n} style={{ color: 'var(--oniva-color-text-muted)', fontSize: 14 }}>{n}</span>))}</Marquee>",
      Component: () => (
        <Marquee reverse fade={false} duration={18}>{['Shipped billing v2', 'SOC 2 Type II complete', '99.99% uptime in Q3', '1.2M events per day'].map((n) => (<span key={n} style={{ color: 'var(--oniva-color-text-muted)', fontSize: 14 }}>{n}</span>))}</Marquee>
      ),
    },
  ],
};
export default demo;
