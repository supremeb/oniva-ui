import * as stylex from '@stylexjs/stylex';
import { ArrowLeft, Folder as FolderIcon, MoreHorizontal, Share2, Upload } from 'lucide-react';
import type { Ref } from 'react';
import { FOLDER_FILES, FileCard, type FileItem } from '../../internal/s1-files';
import { NORTHWIND_PROJECTS, NORTHWIND_WHATS_NEW } from '../../internal/s1-frame';
import { m8, step, useExitList } from '../../internal/m8-motion';
import { colors } from '../../tokens/colors.stylex';
import { Breadcrumb, Breadcrumbs } from '../../components/Breadcrumbs';
import { Button } from '../../components/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '../../components/DropdownMenu';
import { EmptyState } from '../../components/EmptyState';
import { AppShell, type AppShellProps } from '../AppShell';

const styles = stylex.create({
  page: {
    boxSizing: 'border-box',
    containerType: 'inline-size',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    margin: 0,
    maxWidth: 1080,
    padding: { default: 24, '@container (max-width: 520px)': 16 },
  },
  reset: { listStyle: 'none', margin: 0, padding: 0 },
  grid: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: {
      default: 'repeat(4, minmax(0, 1fr))',
      '@container (max-width: 600px)': 'repeat(2, minmax(0, 1fr))',
      '@container (max-width: 360px)': 'minmax(0, 1fr)',
    },
  },
  titleRow: { alignItems: 'center', display: 'inline-flex', gap: 8 },
  glyph: { color: colors['--oniva-color-accent-text'], display: 'inline-flex' },
});

export interface FolderProps extends Omit<AppShellProps, 'children' | 'title' | 'panel'> {
  /** Folder that is open: the title, crumbs and files follow it. */
  folder?: string;
  /** Files in the folder. Defaults to the demo files for `folder`; an empty list shows the empty state. */
  files?: FileItem[];
  onOpenFile?: (id: string) => void;
  onShare?: () => void;
  onUpload?: () => void;
  /** Called with the menu action id: `rename`, `move`, `delete`. */
  onFolderAction?: (action: string) => void;
  ref?: Ref<HTMLDivElement>;
}

/** Inside one folder: breadcrumbs, file cards with previews, and an empty state. */
export function Folder({
  folder = 'Q3 Campaign',
  files,
  onOpenFile,
  onShare,
  onUpload,
  onFolderAction,
  active,
  projects = NORTHWIND_PROJECTS,
  whatsNew = NORTHWIND_WHATS_NEW,
  onNavigate,
  ...shell
}: FolderProps) {
  const list = files ?? FOLDER_FILES[folder] ?? [];
  const listRows = useExitList(list, (f) => f.id);
  return (
    <AppShell
      {...shell}
      title={
        <span {...stylex.props(styles.titleRow)}>
          <span aria-hidden="true" {...stylex.props(styles.glyph)}>
            <FolderIcon size={16} />
          </span>
          {folder}
        </span>
      }
      active={active ?? folder}
      projects={projects}
      whatsNew={whatsNew}
      onNavigate={onNavigate}
      actions={
        <>
          <DropdownMenu>
            <Button variant="ghost" size="sm" isIconOnly aria-label="Folder actions">
              <MoreHorizontal size={16} />
            </Button>
            <DropdownMenuContent
              aria-label="Folder actions"
              onAction={(k) => onFolderAction?.(String(k))}
            >
              <DropdownMenuItem id="rename">Rename</DropdownMenuItem>
              <DropdownMenuItem id="move">Move</DropdownMenuItem>
              <DropdownMenuItem id="delete" variant="danger">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="secondary" size="sm" startIcon={<Share2 size={14} />} onPress={onShare}>
            Share
          </Button>
          <Button size="sm" startIcon={<Upload size={14} />} onPress={onUpload}>
            Upload file
          </Button>
        </>
      }
    >
      <div {...stylex.props(styles.page)}>
        <Breadcrumbs aria-label="Breadcrumb">
          <Breadcrumb onPress={() => onNavigate?.('Folders')}>Files</Breadcrumb>
          <Breadcrumb>{folder}</Breadcrumb>
        </Breadcrumbs>
        <div>
          <Button variant="ghost" size="sm" startIcon={<ArrowLeft size={14} />} onPress={() => onNavigate?.('Folders')}>
            Files
          </Button>
        </div>
        {list.length === 0 ? (
          <EmptyState
            bordered
            xstyle={m8.pop}
            icon={<FolderIcon size={20} />}
            title="This folder is empty"
            description="Upload files or save chat outputs here so your assistant can use them."
            actions={
              <Button size="sm" startIcon={<Upload size={14} />} onPress={onUpload}>
                Upload file
              </Button>
            }
          />
        ) : (
          <ul {...stylex.props(styles.reset, styles.grid)}>
            {listRows.map(({ item: f, exiting }, i) => (
              <li
                key={f.id}
                aria-hidden={exiting || undefined}
                inert={exiting || undefined}
                {...stylex.props(exiting ? m8.exit : m8.rise)}
                style={step(i)}
              >
                <FileCard file={f} onOpen={onOpenFile} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
