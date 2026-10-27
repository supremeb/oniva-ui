import * as stylex from '@stylexjs/stylex';
import { ArrowUpDown, Filter, LayoutGrid, List, Lock, Plus, Users } from 'lucide-react';
import { useMemo, useRef, useState, type Ref } from 'react';
import {
  FOLDERS,
  KIND_LABEL,
  TEMPLATES,
  FileCard,
  FolderCard,
  type FileKind,
  type FolderItem,
} from '../../internal/s1-files';
import { NORTHWIND_PROJECTS, NORTHWIND_WHATS_NEW } from '../../internal/s1-frame';
import { m8, step, useExitList } from '../../internal/m8-motion';
import { useLayoutGlide } from '../../motion/LayoutGlide';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { Button } from '../../components/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '../../components/DropdownMenu';
import { EmptyState } from '../../components/EmptyState';
import { SearchField } from '../../components/SearchField';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl';
import { ToggleButton } from '../../components/ToggleButton';
import { ToggleButtonGroup } from '../../components/ToggleButtonGroup';
import { AppShell, type AppShellProps } from '../AppShell';

const styles = stylex.create({
  page: {
    boxSizing: 'border-box',
    containerType: 'inline-size',
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    margin: 0,
    maxWidth: 1080,
    padding: { default: 24, '@container (max-width: 520px)': 16 },
  },
  lead: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    margin: 0,
  },
  section: { display: 'flex', flexDirection: 'column', gap: 12 },
  h2: {
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-semibold'],
    margin: 0,
  },
  bar: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  tools: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 },
  search: { width: { default: 200, '@container (max-width: 520px)': '100%' } },
  reset: { listStyle: 'none', margin: 0, padding: 0 },
  grid: {
    display: 'grid',
    gap: 10,
    gridTemplateColumns: {
      default: 'repeat(4, minmax(0, 1fr))',
      '@container (max-width: 600px)': 'repeat(2, minmax(0, 1fr))',
      '@container (max-width: 360px)': 'minmax(0, 1fr)',
    },
  },
  list: { display: 'grid', gap: 8, gridTemplateColumns: 'minmax(0, 1fr)' },
  fileGrid: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: {
      default: 'repeat(4, minmax(0, 1fr))',
      '@container (max-width: 600px)': 'repeat(2, minmax(0, 1fr))',
      '@container (max-width: 360px)': 'minmax(0, 1fr)',
    },
  },
});

type FolderTab = 'all' | 'shared' | 'private';
type TemplateTab = 'all' | 'mine' | 'shared';
type Sort = 'name' | 'files';

export interface FoldersProps extends Omit<AppShellProps, 'children' | 'title' | 'panel'> {
  folders?: FolderItem[];
  /** Called with the folder name when a folder is opened. */
  onOpenFolder?: (name: string) => void;
  onOpenFile?: (id: string) => void;
  onCreateFolder?: () => void;
  onAddTemplate?: () => void;
  ref?: Ref<HTMLDivElement>;
}

/** Folder overview: tabs, search, sort and grid/list toggle for folders, plus a filterable list of file templates. */
export function Folders({
  folders = FOLDERS,
  onOpenFolder,
  onOpenFile,
  onCreateFolder,
  onAddTemplate,
  active = 'Folders',
  projects = NORTHWIND_PROJECTS,
  whatsNew = NORTHWIND_WHATS_NEW,
  onNavigate,
  ...shell
}: FoldersProps) {
  const [fTab, setFTab] = useState<FolderTab>('all');
  const [fQuery, setFQuery] = useState('');
  const [fSort, setFSort] = useState<Sort>('name');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [tTab, setTTab] = useState<TemplateTab>('all');
  const [tQuery, setTQuery] = useState('');
  const [tType, setTType] = useState<FileKind | 'all'>('all');

  const shownFolders = useMemo(() => {
    const q = fQuery.trim().toLowerCase();
    return folders
      .filter((f) => (fTab === 'all' ? true : fTab === 'shared' ? f.shared : !f.shared))
      .filter((f) => f.name.toLowerCase().includes(q))
      .sort((a, b) => (fSort === 'name' ? a.name.localeCompare(b.name) : b.files - a.files));
  }, [folders, fTab, fQuery, fSort]);
  const shownTemplates = useMemo(() => {
    const q = tQuery.trim().toLowerCase();
    return TEMPLATES.filter((t) =>
      tTab === 'all'
        ? true
        : tTab === 'mine'
          ? t.owner === 'mine'
          : t.shared && t.owner === 'other',
    )
      .filter((t) => (tType === 'all' ? true : t.kind === tType))
      .filter((t) => t.name.toLowerCase().includes(q));
  }, [tTab, tQuery, tType]);

  const foldersUl = useRef<HTMLUListElement | null>(null);
  const foldersRows = useExitList(shownFolders, (f) => f.id);
  const templateRows = useExitList(shownTemplates, (t) => t.id);
  const templatesUl = useRef<HTMLUListElement | null>(null);
  // Filtering, sorting and the grid/list switch glide the remaining cards to their new place (transform only).
  useLayoutGlide(foldersUl, { enter: false });
  useLayoutGlide(templatesUl, { enter: false });

  return (
    <AppShell
      {...shell}
      title="Files"
      active={active}
      projects={projects}
      whatsNew={whatsNew}
      onNavigate={onNavigate}
    >
      <div {...stylex.props(styles.page)}>
        <p {...stylex.props(styles.lead)}>
          See files you recently used in chats and manage files saved in folders.
        </p>

        <section aria-labelledby="folders-h" {...stylex.props(styles.section)}>
          <h2 id="folders-h" {...stylex.props(styles.h2)}>
            Folders
          </h2>
          <div {...stylex.props(styles.bar)}>
            <SegmentedControl
              size="sm"
              aria-label="Filter folders"
              value={fTab}
              onChange={(v) => setFTab(v as FolderTab)}
            >
              <SegmentedControlItem value="all">All</SegmentedControlItem>
              <SegmentedControlItem value="shared">Shared</SegmentedControlItem>
              <SegmentedControlItem value="private">Private</SegmentedControlItem>
            </SegmentedControl>
            <div {...stylex.props(styles.tools)}>
              <DropdownMenu>
                <Button variant="secondary" size="sm" isIconOnly aria-label="Sort folders">
                  <ArrowUpDown size={14} />
                </Button>
                <DropdownMenuContent
                  aria-label="Sort folders"
                  selectionMode="single"
                  selectedKeys={[fSort]}
                  onSelectionChange={(k) => {
                    const v = [...k][0];
                    if (v) setFSort(v as Sort);
                  }}
                >
                  <DropdownMenuItem id="name">Name</DropdownMenuItem>
                  <DropdownMenuItem id="files">Most files</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <ToggleButtonGroup
                variant="segmented"
                size="sm"
                aria-label="View"
                selectionMode="single"
                disallowEmptySelection
                selectedKeys={[view]}
                onSelectionChange={(k) => {
                  const v = [...k][0];
                  if (v) setView(v as 'grid' | 'list');
                }}
              >
                <ToggleButton id="grid" aria-label="Grid view">
                  <LayoutGrid size={14} />
                </ToggleButton>
                <ToggleButton id="list" aria-label="List view">
                  <List size={14} />
                </ToggleButton>
              </ToggleButtonGroup>
              <SearchField
                aria-label="Search folders"
                placeholder="Search folders…"
                size="sm"
                shortcut={null}
                value={fQuery}
                onChange={setFQuery}
                xstyle={styles.search}
              />
              <Button
                size="sm"
                startIcon={<Plus size={14} />}
                onPress={onCreateFolder}
              >
                Create folder
              </Button>
            </div>
          </div>
          {shownFolders.length === 0 ? (
            <EmptyState
              bordered
              title="No folders match"
              description="Try another tab or clear the search."
            />
          ) : (
            <ul
              ref={foldersUl}
              {...stylex.props(styles.reset, view === 'grid' ? styles.grid : styles.list)}
            >
              {foldersRows.map(({ item: f, exiting }, i) => (
                <li
                  key={f.id}
                  data-glide-id={f.id}
                  aria-hidden={exiting || undefined}
                  inert={exiting || undefined}
                  {...stylex.props(exiting ? m8.exit : m8.rise)}
                  style={step(i)}
                >
                  <FolderCard
                    folder={f}
                    onOpen={(n) => {
                      onOpenFolder?.(n);
                      onNavigate?.(n);
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="templates-h" {...stylex.props(styles.section)}>
          <h2 id="templates-h" {...stylex.props(styles.h2)}>
            File templates
          </h2>
          <div {...stylex.props(styles.bar)}>
            <SegmentedControl
              size="sm"
              aria-label="Filter templates"
              value={tTab}
              onChange={(v) => setTTab(v as TemplateTab)}
            >
              <SegmentedControlItem value="all">All</SegmentedControlItem>
              <SegmentedControlItem value="mine">Mine</SegmentedControlItem>
              <SegmentedControlItem value="shared">Shared with me</SegmentedControlItem>
            </SegmentedControl>
            <div {...stylex.props(styles.tools)}>
              <DropdownMenu>
                <Button variant="secondary" size="sm" startIcon={<Filter size={14} />}>
                  {tType === 'all' ? 'Type' : KIND_LABEL[tType]}
                </Button>
                <DropdownMenuContent
                  aria-label="Filter by type"
                  selectionMode="single"
                  selectedKeys={[tType]}
                  onSelectionChange={(k) => {
                    const v = [...k][0];
                    if (v) setTType(v as FileKind | 'all');
                  }}
                >
                  <DropdownMenuItem id="all">All types</DropdownMenuItem>
                  <DropdownMenuItem id="pdf">PDF</DropdownMenuItem>
                  <DropdownMenuItem id="sheet">Spreadsheet</DropdownMenuItem>
                  <DropdownMenuItem id="doc">Document</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <SearchField
                aria-label="Search templates"
                placeholder="Search templates…"
                size="sm"
                shortcut={null}
                value={tQuery}
                onChange={setTQuery}
                xstyle={styles.search}
              />
              <Button
                size="sm"
                variant="secondary"
                startIcon={<Plus size={14} />}
                onPress={onAddTemplate}
              >
                Add template
              </Button>
            </div>
          </div>
          {shownTemplates.length === 0 ? (
            <EmptyState
              bordered
              title="No templates match"
              description="Try another type or clear the search."
            />
          ) : (
            <ul ref={templatesUl} {...stylex.props(styles.reset, styles.fileGrid)}>
              {templateRows.map(({ item: t, exiting }, i) => (
                <li
                  key={t.id}
                  data-glide-id={t.id}
                  aria-hidden={exiting || undefined}
                  inert={exiting || undefined}
                  {...stylex.props(exiting ? m8.exit : m8.rise)}
                  style={step(i)}
                >
                  <FileCard
                    file={t}
                    onOpen={onOpenFile}
                    extra={
                      <>
                        {' · '}
                        {t.shared ? <Users size={11} aria-hidden="true" /> : <Lock size={11} aria-hidden="true" />}
                        {t.shared ? 'Shared' : 'Private'}
                      </>
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
