import { Bell, SlidersHorizontal } from 'lucide-react';
import { Button } from '../Button';
import type { DemoModule } from '../../internal/demo';
import { Popover, PopoverTrigger } from './Popover';

const label = { fontSize: 13, fontWeight: 500 } as const;
const muted = { fontSize: 12, color: 'var(--oniva-color-text-muted)', margin: 0 } as const;

const demo: DemoModule = {
  meta: {
    title: 'Popover',
    slug: 'popover',
    category: 'Overlays',
    description:
      'Floating panel anchored to a trigger. Closes on outside press or Esc and returns focus to the trigger.',
  },
  demos: [
    {
      name: 'Filter panel',
      code: `<PopoverTrigger>
  <Button variant="secondary" startIcon={<SlidersHorizontal size={16} />}>Filters</Button>
  <Popover aria-label="Filters" placement="bottom start">…</Popover>
</PopoverTrigger>`,
      Component: () => (
        <PopoverTrigger>
          <Button variant="secondary" startIcon={<SlidersHorizontal size={16} />}>
            Filters
          </Button>
          <Popover aria-label="Filters" placement="bottom start">
            {({ close }) => (
              <div style={{ display: 'grid', gap: 12, width: 260 }}>
                <div style={label}>Invoice status</div>
                <div style={{ display: 'grid', gap: 6, fontSize: 14 }}>
                  <label>
                    <input type="checkbox" defaultChecked /> Paid (128)
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked /> Pending (24)
                  </label>
                  <label>
                    <input type="checkbox" /> Overdue (7)
                  </label>
                </div>
                <Button size="sm" onPress={close}>
                  Apply filters
                </Button>
              </div>
            )}
          </Popover>
        </PopoverTrigger>
      ),
    },
    {
      name: 'With arrow',
      code: `<Popover showArrow aria-label="Notifications" placement="top">…</Popover>`,
      Component: () => (
        <PopoverTrigger>
          <Button variant="secondary" isIconOnly aria-label="Notifications">
            <Bell size={16} />
          </Button>
          <Popover showArrow aria-label="Notifications" placement="top">
            <div style={{ display: 'grid', gap: 4 }}>
              <div style={label}>Payout sent</div>
              <p style={muted}>$12,480.00 to Chase ••4821 · 2 min ago</p>
            </div>
          </Popover>
        </PopoverTrigger>
      ),
    },
  ],
};

export default demo;
