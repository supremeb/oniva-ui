import * as stylex from '@stylexjs/stylex';
import type { DemoModule } from '../../internal/demo';
import { demoStyles } from '../../internal/nav-demo';
import { Flex } from './Flex';

const demo: DemoModule = {
  meta: {
    title: 'Flex',
    slug: 'flex',
    category: 'Layout',
    description:
      'Flexbox primitive. gap, padding, align and justify map to the space tokens; no inline styles needed.',
  },
  demos: [
    {
      name: 'Row with space-between',
      code: `<Flex align="center" justify="between" gap={12}>
  <span>Q3 revenue</span>
  <strong>$128,430</strong>
</Flex>`,
      Component: () => (
        <Flex
          align="center"
          justify="between"
          gap={12}
          xstyle={demoStyles.tile}
          style={{ maxWidth: 360 }}
        >
          <span>Q3 revenue</span>
          <strong style={{ fontVariantNumeric: 'tabular-nums' }}>$128,430</strong>
        </Flex>
      ),
    },
    {
      name: 'Wrapping tags',
      code: `<Flex wrap gap={8}>{['Design', 'Billing', 'Growth', 'Support', 'Infra']}</Flex>`,
      Component: () => (
        <Flex wrap gap={8} style={{ maxWidth: 260 }}>
          {['Design', 'Billing', 'Growth', 'Support', 'Infra'].map((t) => (
            <span key={t} {...stylex.props(demoStyles.tile)}>
              {t}
            </span>
          ))}
        </Flex>
      ),
    },
  ],
};
export default demo;
