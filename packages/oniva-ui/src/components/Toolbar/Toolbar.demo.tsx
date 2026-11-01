import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, ItalicIcon, LinkIcon, RedoIcon, UnderlineIcon, UndoIcon } from '../../icons/IconSet';
import type { DemoModule } from '../../internal/demo';
import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggleButton } from './Toolbar';

const demo: DemoModule = {
  meta: {
    title: 'Toolbar',
    slug: 'toolbar',
    category: 'Navigation',
    description:
      'A set of related controls with a single tab stop and arrow-key navigation (React Aria Toolbar).',
  },
  demos: [
    {
      name: 'Text formatting',
      code: `<Toolbar aria-label="Text formatting">
  <ToolbarButton aria-label="Undo"><UndoIcon size={16} /></ToolbarButton>
  <ToolbarButton aria-label="Redo"><RedoIcon size={16} /></ToolbarButton>
  <ToolbarSeparator />
  <ToolbarToggleButton aria-label="Bold"><BoldIcon size={16} /></ToolbarToggleButton>
  …
</Toolbar>`,
      Component: () => (
        <Toolbar aria-label="Text formatting">
          <ToolbarButton aria-label="Undo">
            <UndoIcon size={16} />
          </ToolbarButton>
          <ToolbarButton aria-label="Redo">
            <RedoIcon size={16} />
          </ToolbarButton>
          <ToolbarSeparator />
          <ToolbarToggleButton aria-label="Bold" defaultSelected>
            <BoldIcon size={16} />
          </ToolbarToggleButton>
          <ToolbarToggleButton aria-label="Italic">
            <ItalicIcon size={16} />
          </ToolbarToggleButton>
          <ToolbarToggleButton aria-label="Underline">
            <UnderlineIcon size={16} />
          </ToolbarToggleButton>
          <ToolbarSeparator />
          <ToolbarButton aria-label="Insert link">
            <LinkIcon size={16} />
          </ToolbarButton>
        </Toolbar>
      ),
    },
    {
      name: 'Vertical alignment',
      code: `<Toolbar orientation="vertical" aria-label="Alignment">…</Toolbar>`,
      Component: () => (
        <Toolbar orientation="vertical" aria-label="Alignment">
          <ToolbarToggleButton aria-label="Align left" defaultSelected>
            <AlignLeftIcon size={16} />
          </ToolbarToggleButton>
          <ToolbarToggleButton aria-label="Align center">
            <AlignCenterIcon size={16} />
          </ToolbarToggleButton>
          <ToolbarToggleButton aria-label="Align right">
            <AlignRightIcon size={16} />
          </ToolbarToggleButton>
        </Toolbar>
      ),
    },
  ],
};
export default demo;
