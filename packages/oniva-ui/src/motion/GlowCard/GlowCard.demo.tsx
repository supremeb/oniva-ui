import type { DemoModule } from '../../internal/demo';
import { GlowCard } from './GlowCard';

const demo: DemoModule = {
  meta: {
    title: "Glow card",
    slug: "glow-card",
    category: 'Motion',
    description: "Soft accent glow that follows the pointer, driven by CSS variables without re-rendering.",
  },
  demos: [
    {
      name: "Cards",
      code: "<div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, 1fr)' }}><GlowCard><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>MRR</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>$48,210 · +6.2% vs last month</div></div></GlowCard><GlowCard><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Active seats</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>1,284 across 37 teams</div></div></GlowCard></div>",
      Component: () => (
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, 1fr)' }}><GlowCard><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>MRR</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>$48,210 · +6.2% vs last month</div></div></GlowCard><GlowCard><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Active seats</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>1,284 across 37 teams</div></div></GlowCard></div>
      ),
    },
  ],
};
export default demo;
