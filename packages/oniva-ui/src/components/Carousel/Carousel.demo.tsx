import * as stylex from '@stylexjs/stylex';
import type { DemoModule } from '../../internal/demo';
import { Card } from '../Card';
import { Carousel } from './Carousel';

const s = stylex.create({ slide: { minHeight: 120, padding: 4 }, h: { margin: 0, marginBottom: 4 }, p: { margin: 0 } });

const items = [
  ['Stripe', 'Sync invoices and payouts every 15 minutes. 2,184 workspaces connected.'],
  ['Slack', 'Post deploy and billing alerts to #ops. Threaded replies supported.'],
  ['Linear', 'Create issues from failed webhooks with one click.'],
  ['Snowflake', 'Nightly warehouse export, 38 tables, incremental by default.'],
];

const demo: DemoModule = {
  meta: {
    title: 'Carousel',
    slug: 'carousel',
    category: 'Data display',
    description:
      'Snap-scroll carousel with previous/next, dots, arrow keys, and autoplay that pauses on hover/focus and is disabled under reduced motion.',
  },
  demos: [
    {
      name: 'Integrations',
      code: `<Carousel aria-label="Featured integrations" autoPlay={6000}>
  <Card>…</Card>
  <Card>…</Card>
</Carousel>`,
      Component: () => (
        <Carousel aria-label="Featured integrations" autoPlay={6000}>
          {items.map(([t, d]) => (
            <div key={t} {...stylex.props(s.slide)}>
              <Card>
                <h3 {...stylex.props(s.h)}>{t}</h3>
                <p {...stylex.props(s.p)}>{d}</p>
              </Card>
            </div>
          ))}
        </Carousel>
      ),
    },
  ],
};
export default demo;
