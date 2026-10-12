import { ChevronDown } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { ButtonGroup } from './ButtonGroup';

const demo: DemoModule = {
  meta: {
    title: 'ButtonGroup',
    slug: 'button-group',
    category: 'Actions',
    description: 'Attach related buttons into a single cluster with shared borders.',
  },
  demos: [
    {
      name: 'Secondary cluster',
      code: `<ButtonGroup aria-label="Invoice actions">
  <Button variant="secondary">Send</Button>
  <Button variant="secondary">Print</Button>
  <Button variant="secondary">Archive</Button>
</ButtonGroup>`,
      Component: () => (
        <ButtonGroup aria-label="Invoice actions">
          <Button variant="secondary">Send</Button>
          <Button variant="secondary">Print</Button>
          <Button variant="secondary">Archive</Button>
        </ButtonGroup>
      ),
    },
    {
      name: 'Split button',
      code: `<ButtonGroup aria-label="Publish">
  <Button>Publish report</Button>
  <IconButton aria-label="More options" variant="primary"><ChevronDown size={16} /></IconButton>
</ButtonGroup>`,
      Component: () => (
        <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
          <ButtonGroup aria-label="Publish">
            <Button>Publish report</Button>
            <IconButton aria-label="More options" variant="primary"><ChevronDown size={16} /></IconButton>
          </ButtonGroup>
          <ButtonGroup aria-label="Stacked" orientation="vertical">
            <Button variant="secondary">Day</Button>
            <Button variant="secondary">Week</Button>
            <Button variant="secondary">Month</Button>
          </ButtonGroup>
        </div>
      ),
    },
  ],
};
export default demo;
