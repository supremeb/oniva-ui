import type { DemoModule } from '../../internal/demo';
import { Text } from '../Text';
import { Link } from './Link';

const demo: DemoModule = {
  meta: {
    title: 'Link',
    slug: 'link',
    category: 'Actions',
    description: 'Inline text link built on React Aria Link with hover underline and focus ring.',
  },
  demos: [
    {
      name: 'Inline',
      code: `<Text>Your plan renews on Nov 1. <Link href="#billing">Manage billing</Link></Text>`,
      Component: () => (
        <Text as="p">
          Your plan renews on Nov 1, 2026. <Link href="#/components/link">Manage billing</Link>
        </Text>
      ),
    },
    {
      name: 'Tones',
      code: `<Link href="#">Accent</Link>
<Link href="#" tone="muted" underline>Muted underlined</Link>
<Link href="#" isDisabled>Disabled</Link>`,
      Component: () => (
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="#/components/link">Accent</Link>
          <Link href="#/components/link" tone="muted" underline>
            Muted underlined
          </Link>
          <Link isDisabled>Disabled</Link>
        </div>
      ),
    },
  ],
};
export default demo;
