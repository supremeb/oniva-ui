import { AlignCenter, AlignLeft, AlignRight, Bold, Italic } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { ToggleButton } from '../ToggleButton';
import { ToggleButtonGroup } from './ToggleButtonGroup';

const col = { display: 'grid', gap: 16, justifyItems: 'start' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Toggle button group',
    slug: 'toggle-button-group',
    category: 'Actions',
    description:
      'Single or multiple selection across a set of toggle buttons, with a segmented track style.',
  },
  demos: [
    {
      name: 'Segmented (single)',
      code: `<ToggleButtonGroup aria-label="Date range" selectionMode="single" defaultSelectedKeys={['30d']}>
  <ToggleButton id="7d">7 days</ToggleButton>
  <ToggleButton id="30d">30 days</ToggleButton>
  <ToggleButton id="90d">90 days</ToggleButton>
</ToggleButtonGroup>`,
      Component: () => (
        <ToggleButtonGroup
          aria-label="Date range"
          selectionMode="single"
          defaultSelectedKeys={['30d']}
        >
          <ToggleButton id="7d">7 days</ToggleButton>
          <ToggleButton id="30d">30 days</ToggleButton>
          <ToggleButton id="90d">90 days</ToggleButton>
        </ToggleButtonGroup>
      ),
    },
    {
      name: 'Multiple with icons',
      code: `<ToggleButtonGroup aria-label="Text style" selectionMode="multiple" variant="secondary" size="sm">
  <ToggleButton id="b" isIconOnly aria-label="Bold"><Bold size={14} /></ToggleButton>
  <ToggleButton id="i" isIconOnly aria-label="Italic"><Italic size={14} /></ToggleButton>
</ToggleButtonGroup>`,
      Component: () => (
        <div style={col}>
          <ToggleButtonGroup
            aria-label="Text style"
            selectionMode="multiple"
            variant="secondary"
            size="sm"
          >
            <ToggleButton id="b" isIconOnly aria-label="Bold">
              <Bold size={14} />
            </ToggleButton>
            <ToggleButton id="i" isIconOnly aria-label="Italic">
              <Italic size={14} />
            </ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            aria-label="Alignment"
            selectionMode="single"
            defaultSelectedKeys={['l']}
            size="sm"
          >
            <ToggleButton id="l" isIconOnly aria-label="Left">
              <AlignLeft size={14} />
            </ToggleButton>
            <ToggleButton id="c" isIconOnly aria-label="Center">
              <AlignCenter size={14} />
            </ToggleButton>
            <ToggleButton id="r" isIconOnly aria-label="Right">
              <AlignRight size={14} />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      ),
    },
  ],
};
export default demo;
