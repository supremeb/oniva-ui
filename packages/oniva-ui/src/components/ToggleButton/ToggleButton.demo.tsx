import { Bell, BellOff, Star } from 'lucide-react';
import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { ToggleButton } from './ToggleButton';

const row = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } as const;

function Mute() {
  const [on, setOn] = useState(false);
  return (
    <ToggleButton isSelected={on} onChange={setOn} startIcon={on ? <BellOff size={16} /> : <Bell size={16} />}>
      {on ? 'Muted' : 'Mute alerts'}
    </ToggleButton>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'ToggleButton',
    slug: 'toggle-button',
    category: 'Actions',
    description: 'A two-state button (aria-pressed) sharing Button sizes.',
  },
  demos: [
    {
      name: 'Variants',
      code: `<ToggleButton defaultSelected>Secondary</ToggleButton>
<ToggleButton variant="ghost" defaultSelected>Ghost</ToggleButton>
<ToggleButton variant="soft" defaultSelected>Soft</ToggleButton>`,
      Component: () => (
        <div style={row}>
          <ToggleButton defaultSelected>Secondary</ToggleButton>
          <ToggleButton variant="ghost" defaultSelected>Ghost</ToggleButton>
          <ToggleButton variant="soft" defaultSelected>Soft</ToggleButton>
          <ToggleButton>Off</ToggleButton>
        </div>
      ),
    },
    {
      name: 'Controlled with icon',
      code: `const [on, setOn] = useState(false);
<ToggleButton isSelected={on} onChange={setOn}
  startIcon={on ? <BellOff size={16} /> : <Bell size={16} />}>
  {on ? 'Muted' : 'Mute alerts'}
</ToggleButton>`,
      Component: Mute,
    },
    {
      name: 'Icon only',
      code: `<ToggleButton isIconOnly aria-label="Favorite" defaultSelected><Star size={16} /></ToggleButton>`,
      Component: () => (
        <div style={row}>
          <ToggleButton isIconOnly aria-label="Favorite" defaultSelected><Star size={16} /></ToggleButton>
          <ToggleButton isIconOnly aria-label="Favorite 2" size="sm"><Star size={14} /></ToggleButton>
        </div>
      ),
    },
  ],
};
export default demo;
