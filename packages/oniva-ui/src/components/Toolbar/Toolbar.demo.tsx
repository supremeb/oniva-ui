import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Link2, Redo2, Underline, Undo2 } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggleButton } from './Toolbar';

const demo: DemoModule = {
  meta: {
    title: 'Toolbar',
    slug: 'toolbar',
    category: 'Navigation',
    description: 'A set of related controls with a single tab stop and arrow-key navigation (React Aria Toolbar).',
  },
  demos: [
    {
      name: 'Text formatting',
      code: `<Toolbar aria-label="Text formatting">
  <ToolbarButton aria-label="Undo"><Undo2 size={16} /></ToolbarButton>
  <ToolbarButton aria-label="Redo"><Redo2 size={16} /></ToolbarButton>
  <ToolbarSeparator />
  <ToolbarToggleButton aria-label="Bold"><Bold size={16} /></ToolbarToggleButton>
  …
</Toolbar>`,
      Component: () => (
        <Toolbar aria-label="Text formatting">
          <ToolbarButton aria-label="Undo"><Undo2 size={16} /></ToolbarButton>
          <ToolbarButton aria-label="Redo"><Redo2 size={16} /></ToolbarButton>
          <ToolbarSeparator />
          <ToolbarToggleButton aria-label="Bold" defaultSelected><Bold size={16} /></ToolbarToggleButton>
          <ToolbarToggleButton aria-label="Italic"><Italic size={16} /></ToolbarToggleButton>
          <ToolbarToggleButton aria-label="Underline"><Underline size={16} /></ToolbarToggleButton>
          <ToolbarSeparator />
          <ToolbarButton aria-label="Insert link"><Link2 size={16} /></ToolbarButton>
        </Toolbar>
      ),
    },
    {
      name: 'Vertical alignment',
      code: `<Toolbar orientation="vertical" aria-label="Alignment">…</Toolbar>`,
      Component: () => (
        <Toolbar orientation="vertical" aria-label="Alignment">
          <ToolbarToggleButton aria-label="Align left" defaultSelected><AlignLeft size={16} /></ToolbarToggleButton>
          <ToolbarToggleButton aria-label="Align center"><AlignCenter size={16} /></ToolbarToggleButton>
          <ToolbarToggleButton aria-label="Align right"><AlignRight size={16} /></ToolbarToggleButton>
        </Toolbar>
      ),
    },
  ],
};
export default demo;
