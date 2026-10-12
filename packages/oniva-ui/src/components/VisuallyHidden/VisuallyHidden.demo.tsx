import { Bell } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../Button';
import { VisuallyHidden } from './VisuallyHidden';

const demo: DemoModule = {
  meta: {
    title: 'Visually hidden',
    slug: 'visually-hidden',
    category: 'Utilities',
    description: 'Hides content visually while keeping it readable by screen readers.',
  },
  demos: [
    {
      name: 'Icon-only label',
      code: `<Button variant="secondary" isIconOnly>
  <Bell size={16} />
  <VisuallyHidden>3 unread notifications</VisuallyHidden>
</Button>`,
      Component: () => (
        <Button variant="secondary" isIconOnly>
          <Bell size={16} />
          <VisuallyHidden>3 unread notifications</VisuallyHidden>
        </Button>
      ),
    },
  ],
};
export default demo;
