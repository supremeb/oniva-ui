import * as stylex from '@stylexjs/stylex';
import type { DemoModule } from '../../internal/demo';
import { demoStyles } from '../../internal/nav-demo';
import { Grid } from './Grid';

const demo: DemoModule = {
  meta: {
    title: 'Grid',
    slug: 'grid',
    category: 'Layout',
    description:
      'CSS grid primitive with fixed columns or responsive auto-fit columns, token-mapped gap.',
  },
  demos: [
    {
      name: 'Fixed columns',
      code: `<Grid columns={3} gap={12}>
  <Stat label="MRR" value="$48,210" />…
</Grid>`,
      Component: () => (
        <Grid columns={3} gap={12}>
          {[
            ['MRR', '$48,210'],
            ['Active users', '12,480'],
            ['Churn', '1.8%'],
          ].map(([l, v]) => (
            <div key={l} {...stylex.props(demoStyles.tile)}>
              <div {...stylex.props(demoStyles.muted)}>{l}</div>
              <div {...stylex.props(demoStyles.strong)}>{v}</div>
            </div>
          ))}
        </Grid>
      ),
    },
    {
      name: 'Responsive auto-fit',
      code: `<Grid minColumnWidth={160} gap={12}>…</Grid>`,
      Component: () => (
        <Grid minColumnWidth={160} gap={12}>
          {['Starter $12', 'Team $39', 'Business $99', 'Enterprise $249'].map((p) => (
            <div key={p} {...stylex.props(demoStyles.tile)}>
              {p}
            </div>
          ))}
        </Grid>
      ),
    },
  ],
};
export default demo;
