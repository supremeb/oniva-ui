import { Copy, Download, FolderOpen, Pencil, Star, Trash2 } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { DropdownMenuItem, DropdownMenuSeparator } from '../DropdownMenu';
import { ContextMenu } from './ContextMenu';

const area = {
  alignItems: 'center',
  background: 'var(--oniva-color-surface-inset)',
  border: '1px dashed var(--oniva-color-border-hover)',
  borderRadius: 16,
  color: 'var(--oniva-color-text-muted)',
  display: 'flex',
  fontSize: 14,
  height: 140,
  justifyContent: 'center',
  userSelect: 'none',
} as const;

const demo: DemoModule = {
  meta: {
    title: 'Context menu',
    slug: 'context-menu',
    category: 'Overlays',
    description:
      'Right-click menu anchored at the pointer. Reuses Dropdown Menu items, so icons, shortcuts, sections and submenus all work.',
  },
  demos: [
    {
      name: 'File actions',
      code: `<ContextMenu
  menuLabel="File actions"
  onAction={(k) => …}
  menu={<>
    <DropdownMenuItem id="open" icon={<FolderOpen size={16} />}>Open</DropdownMenuItem>
    <DropdownMenuItem id="rename" icon={<Pencil size={16} />} shortcut="F2">Rename</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem id="delete" icon={<Trash2 size={16} />} variant="danger">Delete</DropdownMenuItem>
  </>}
>
  <div>Right-click Q3-board-deck.pdf</div>
</ContextMenu>`,
      Component: () => (
        <ContextMenu
          menuLabel="File actions"
          menu={
            <>
              <DropdownMenuItem id="open" icon={<FolderOpen size={16} />}>
                Open
              </DropdownMenuItem>
              <DropdownMenuItem id="star" icon={<Star size={16} />}>
                Add to starred
              </DropdownMenuItem>
              <DropdownMenuItem id="copy" icon={<Copy size={16} />} shortcut="⌘C">
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem id="download" icon={<Download size={16} />}>
                Download
              </DropdownMenuItem>
              <DropdownMenuItem id="rename" icon={<Pencil size={16} />} shortcut="F2">
                Rename
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem id="delete" icon={<Trash2 size={16} />} variant="danger">
                Delete
              </DropdownMenuItem>
            </>
          }
        >
          <div style={area}>Right-click Q3-board-deck.pdf</div>
        </ContextMenu>
      ),
    },
  ],
};

export default demo;
