import * as stylex from '@stylexjs/stylex';
import type { DemoModule } from '../../internal/demo';
import { demoStyles } from '../../internal/nav-demo';
import { Stack } from './Stack';
import { Flex } from '../Flex';

const demo: DemoModule = {
  meta: {
    title: 'Stack',
    slug: 'stack',
    category: 'Layout',
    description: 'Vertical (or horizontal) flex stack with token-mapped gap and padding.',
  },
  demos: [
    {
      name: 'Vertical',
      code: `<Stack gap={8}>
  <div>Invoice #2041, paid</div>
  <div>Invoice #2042, pending</div>
  <div>Invoice #2043, overdue</div>
</Stack>`,
      Component: () => (
        <Stack gap={8} style={{ maxWidth: 280 }}>
          <div {...stylex.props(demoStyles.tile)}>Invoice #2041, paid</div>
          <div {...stylex.props(demoStyles.tile)}>Invoice #2042, pending</div>
          <div {...stylex.props(demoStyles.tile)}>Invoice #2043, overdue</div>
        </Stack>
      ),
    },
    {
      name: 'Horizontal',
      code: `<Stack horizontal gap={16} align="center">…</Stack>`,
      Component: () => (
        <Stack horizontal gap={16} align="center">
          <div {...stylex.props(demoStyles.tile)}>Aylin Demir</div>
          <div {...stylex.props(demoStyles.tile)}>Marcus Hale</div>
          <Flex xstyle={demoStyles.tile}>Priya Nair</Flex>
        </Stack>
      ),
    },
  ],
};
export default demo;
