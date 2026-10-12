import type { DemoModule } from '../../internal/demo';
import { HoverPill, HoverPillItem } from './HoverPill';

const demo: DemoModule = {
  meta: {
    title: "Hover pill",
    slug: "hover-pill",
    category: 'Motion',
    description: "A single background pill glides between hover targets in a nav or list. Keyboard focus snaps instantly.",
  },
  demos: [
    {
      name: "Nav",
      code: "<HoverPill role=\"navigation\" aria-label=\"Demo\">{['Overview', 'Customers', 'Invoices', 'Reports', 'Settings'].map((n) => (<a key={n} href=\"#/components/hover-pill\" data-hover-pill-item=\"\" style={{ display: 'inline-block', padding: '6px 12px', fontSize: 14, fontWeight: 500, color: 'inherit', textDecoration: 'none', position: 'relative', zIndex: 1 }}>{n}</a>))}</HoverPill>",
      Component: () => (
        <HoverPill role="navigation" aria-label="Demo">{['Overview', 'Customers', 'Invoices', 'Reports', 'Settings'].map((n) => (<a key={n} href="#/components/hover-pill" data-hover-pill-item="" style={{ display: 'inline-block', padding: '6px 12px', fontSize: 14, fontWeight: 500, color: 'inherit', textDecoration: 'none', position: 'relative', zIndex: 1 }}>{n}</a>))}</HoverPill>
      ),
    },
    {
      name: "List",
      code: "<HoverPill>{['Acme Corp', 'Globex', 'Initech'].map((n) => (<HoverPillItem key={n}><div style={{ padding: '8px 12px', fontSize: 14 }}>{n}</div></HoverPillItem>))}</HoverPill>",
      Component: () => (
        <HoverPill>{['Acme Corp', 'Globex', 'Initech'].map((n) => (<HoverPillItem key={n}><div style={{ padding: '8px 12px', fontSize: 14 }}>{n}</div></HoverPillItem>))}</HoverPill>
      ),
    },
  ],
};
export default demo;
