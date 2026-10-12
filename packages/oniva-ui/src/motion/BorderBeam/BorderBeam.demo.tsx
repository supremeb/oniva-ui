import type { DemoModule } from '../../internal/demo';
import { BorderBeam } from './BorderBeam';

const demo: DemoModule = {
  meta: {
    title: "Border beam",
    slug: "border-beam",
    category: 'Motion',
    description: "A light beam orbiting a card border. Pauses offscreen, static ring under reduced motion.",
  },
  demos: [
    {
      name: "Card",
      code: "<BorderBeam><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Pro plan</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>Priority support, SSO and audit logs.</div></div></BorderBeam>",
      Component: () => (
        <BorderBeam><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Pro plan</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>Priority support, SSO and audit logs.</div></div></BorderBeam>
      ),
    },
    {
      name: "Thicker, slower",
      code: "<BorderBeam borderWidth={2} duration={12}><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Team workspace</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>14 members, 3 projects active.</div></div></BorderBeam>",
      Component: () => (
        <BorderBeam borderWidth={2} duration={12}><div style={{ padding: 20, minWidth: 220 }}><div style={{ fontWeight: 600, fontSize: 15 }}>Team workspace</div><div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginTop: 4 }}>14 members, 3 projects active.</div></div></BorderBeam>
      ),
    },
  ],
};
export default demo;
