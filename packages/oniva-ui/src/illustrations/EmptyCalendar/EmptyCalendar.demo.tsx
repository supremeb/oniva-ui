import type { DemoModule } from '../../internal/demo';
import { EmptyCalendar } from './EmptyCalendar';

const demo: DemoModule = {
  meta: {
    title: "Empty calendar illustration",
    slug: "empty-calendar",
    category: 'Illustrations',
    description: "Stacked calendar cards marked empty. The front card lifts on hover while the glow and placeholder bars breathe.",
  },
  demos: [
    {
      name: "Default",
      code: `<EmptyCalendar />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <EmptyCalendar />
        </div>
      ),
    },
    {
      name: "Custom copy",
      code: `<EmptyCalendar month="October" emptyLabel="Nothing booked" />`,
      Component: () => (
        <div style={{ margin: '0 auto', maxWidth: 1120, width: '100%' }}>
          <EmptyCalendar month="October" emptyLabel="Nothing booked" />
        </div>
      ),
    },
  ],
};

export default demo;
