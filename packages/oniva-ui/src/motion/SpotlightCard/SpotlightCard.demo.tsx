import type { DemoModule } from '../../internal/demo';
import { SpotlightCard } from './SpotlightCard';

const demo: DemoModule = {
  meta: {
    title: "Spotlight card",
    slug: "spotlight-card",
    category: 'Motion',
    description: "Border and surface light up beneath the pointer.",
  },
  demos: [
    {
      name: "Cards",
      code: "<div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, 1fr)' }}><SpotlightCard><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Deploys</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>42 this week, 0 failed</div></div></SpotlightCard><SpotlightCard><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Latency</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>p95 182ms · down 12%</div></div></SpotlightCard></div>",
      Component: () => (
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, 1fr)' }}><SpotlightCard><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Deploys</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>42 this week, 0 failed</div></div></SpotlightCard><SpotlightCard><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Latency</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>p95 182ms · down 12%</div></div></SpotlightCard></div>
      ),
    },
  ],
};
export default demo;
