import { Copy, HelpCircle, Trash2 } from 'lucide-react';
import { Button } from '../Button';
import type { DemoModule } from '../../internal/demo';
import { Tooltip } from './Tooltip';

const row = { display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Tooltip',
    slug: 'tooltip',
    category: 'Overlays',
    description:
      'Short text hint shown on hover or keyboard focus, with a shared warm-up delay. Built on React Aria TooltipTrigger.',
  },
  demos: [
    {
      name: 'Icon buttons',
      code: `<Tooltip content="Copy invoice link">
  <Button isIconOnly variant="secondary" aria-label="Copy link"><Copy size={16} /></Button>
</Tooltip>`,
      Component: () => (
        <div style={row}>
          <Tooltip content="Copy invoice link">
            <Button isIconOnly variant="secondary" aria-label="Copy link">
              <Copy size={16} />
            </Button>
          </Tooltip>
          <Tooltip content="Delete draft">
            <Button isIconOnly variant="secondary" aria-label="Delete draft">
              <Trash2 size={16} />
            </Button>
          </Tooltip>
          <Tooltip content="Net revenue after refunds and fees">
            <Button isIconOnly variant="ghost" aria-label="About net revenue">
              <HelpCircle size={16} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
    {
      name: 'Placements',
      code: `<Tooltip content="Below" placement="bottom"><Button variant="secondary">Bottom</Button></Tooltip>`,
      Component: () => (
        <div style={row}>
          {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
            <Tooltip key={p} content={`Placed ${p}`} placement={p} delay={0}>
              <Button variant="secondary" size="sm">
                {p}
              </Button>
            </Tooltip>
          ))}
        </div>
      ),
    },
  ],
};

export default demo;
