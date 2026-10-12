import { ArrowUpRight } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { LinkButton } from './LinkButton';

const row = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } as const;

const demo: DemoModule = {
  meta: {
    title: 'LinkButton',
    slug: 'link-button',
    category: 'Actions',
    description: 'A link that looks like a Button, for navigation CTAs.',
  },
  demos: [
    {
      name: 'Variants',
      code: `<LinkButton href="#" variant="primary">View statement</LinkButton>
<LinkButton href="#">Download PDF</LinkButton>
<LinkButton href="#" variant="soft">Contact sales</LinkButton>
<LinkButton href="#" variant="ghost">Docs</LinkButton>`,
      Component: () => (
        <div style={row}>
          <LinkButton href="#/components/link-button" variant="primary">View statement</LinkButton>
          <LinkButton href="#/components/link-button">Download PDF</LinkButton>
          <LinkButton href="#/components/link-button" variant="soft">Contact sales</LinkButton>
          <LinkButton href="#/components/link-button" variant="ghost">Docs</LinkButton>
        </div>
      ),
    },
    {
      name: 'Sizes and icon',
      code: `<LinkButton href="#" size="sm" endIcon={<ArrowUpRight size={14} />}>Open dashboard</LinkButton>
<LinkButton href="#" size="lg">Get started</LinkButton>`,
      Component: () => (
        <div style={row}>
          <LinkButton href="#/components/link-button" size="sm" endIcon={<ArrowUpRight size={14} />}>
            Open dashboard
          </LinkButton>
          <LinkButton href="#/components/link-button" size="lg" variant="primary">Get started</LinkButton>
        </div>
      ),
    },
  ],
};
export default demo;
