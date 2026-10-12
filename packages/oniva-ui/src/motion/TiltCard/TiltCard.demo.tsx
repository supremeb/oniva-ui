import type { DemoModule } from '../../internal/demo';
import { TiltCard } from './TiltCard';

const demo: DemoModule = {
  meta: {
    title: "Tilt card",
    slug: "tilt-card",
    category: 'Motion',
    description: "3D hover tilt with perspective 1000, 400ms follow, 1000ms return. Pointer tracked on a flat outer wrapper.",
  },
  demos: [
    {
      name: "Card",
      code: "<div style={{ maxWidth: 280 }}><TiltCard><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Founders pass</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>Lifetime access, limited to 200 seats.</div></div></TiltCard></div>",
      Component: () => (
        <div style={{ maxWidth: 280 }}><TiltCard><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Founders pass</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>Lifetime access, limited to 200 seats.</div></div></TiltCard></div>
      ),
    },
    {
      name: "Subtle, no glare",
      code: "<div style={{ maxWidth: 280 }}><TiltCard maxTilt={4} glare={false}><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Roadmap</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>Q4 priorities and owners.</div></div></TiltCard></div>",
      Component: () => (
        <div style={{ maxWidth: 280 }}><TiltCard maxTilt={4} glare={false}><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Roadmap</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>Q4 priorities and owners.</div></div></TiltCard></div>
      ),
    },
  ],
};
export default demo;
