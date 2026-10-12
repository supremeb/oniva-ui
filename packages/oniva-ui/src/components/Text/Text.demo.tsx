import type { DemoModule } from '../../internal/demo';
import { Text } from './Text';

const col = { display: 'flex', flexDirection: 'column', gap: 8 } as const;

const demo: DemoModule = {
  meta: {
    title: 'Text',
    slug: 'text',
    category: 'Typography',
    description:
      'Body copy and captions on the token type scale: caption, body, headline, title, display.',
  },
  demos: [
    {
      name: 'Scale',
      code: `<Text variant="display">$48,290</Text>
<Text variant="title">Revenue overview</Text>
<Text variant="headline">Q3 payouts</Text>
<Text>Payouts settle within 2 business days.</Text>
<Text variant="caption" tone="muted">Updated Oct 12, 2026</Text>`,
      Component: () => (
        <div style={col}>
          <Text variant="display" tabular>
            $48,290
          </Text>
          <Text variant="title">Revenue overview</Text>
          <Text variant="headline">Q3 payouts</Text>
          <Text>Payouts settle within 2 business days.</Text>
          <Text variant="caption" tone="muted">
            Updated Oct 12, 2026
          </Text>
        </div>
      ),
    },
    {
      name: 'Tabular numerals and tones',
      code: `<Text tabular>1,111.00</Text>
<Text tabular>8,888.00</Text>
<Text tone="error">Card declined</Text>`,
      Component: () => (
        <div style={col}>
          <Text tabular>1,111.00</Text>
          <Text tabular>8,888.00</Text>
          <Text tone="error">Card declined</Text>
          <Text tone="accent">View invoice</Text>
        </div>
      ),
    },
  ],
};
export default demo;
