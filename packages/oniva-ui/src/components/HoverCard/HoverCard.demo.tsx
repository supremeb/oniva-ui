import { CalendarDays, MapPin } from 'lucide-react';
import { Link } from 'react-aria-components';
import { Avatar } from '../Avatar';
import type { DemoModule } from '../../internal/demo';
import { HoverCard, HoverCardContent } from './HoverCard';

const linkStyle = {
  color: 'inherit',
  fontWeight: 500,
  textDecoration: 'underline',
  cursor: 'pointer',
} as const;
const meta = {
  alignItems: 'center',
  color: 'var(--textMuted, #6b6b6b)',
  display: 'flex',
  fontSize: 12,
  gap: 6,
} as const;

const demo: DemoModule = {
  meta: {
    title: 'Hover Card',
    slug: 'hover-card',
    category: 'Overlays',
    description:
      'Rich preview that opens on hover, keyboard focus or long press. Unlike a tooltip, the card can hold interactive content.',
  },
  demos: [
    {
      name: 'Customer preview',
      code: `<HoverCard>
  <Link href="#">Maria Chen</Link>
  <HoverCardContent>…</HoverCardContent>
</HoverCard>`,
      Component: () => (
        <p style={{ fontSize: 14, margin: 0 }}>
          Invoice INV-2041 was approved by{' '}
          <HoverCard delay={200}>
            <Link href="#maria" style={linkStyle}>
              Maria Chen
            </Link>
            <HoverCardContent>
              <div style={{ display: 'flex', gap: 12 }}>
                <Avatar name="Maria Chen" />
                <div style={{ display: 'grid', gap: 6 }}>
                  <div style={{ fontWeight: 600 }}>Maria Chen</div>
                  <div style={{ color: 'var(--textMuted, #6b6b6b)', fontSize: 13 }}>
                    Controller at Northwind Traders. Approves invoices over $2,500.
                  </div>
                  <div style={meta}>
                    <MapPin size={14} /> Austin, TX
                  </div>
                  <div style={meta}>
                    <CalendarDays size={14} /> Customer since Mar 2024
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>{' '}
          on Oct 8.
        </p>
      ),
    },
  ],
};

export default demo;
