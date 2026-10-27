import * as stylex from '@stylexjs/stylex';
import { Button as AriaButton } from 'react-aria-components';
import { Folder as FolderIcon, Lock, Users } from 'lucide-react';
import type { ReactNode } from 'react';
import { focus } from './focus';
import { useFormatters } from './format';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { media } from '../tokens/media.stylex';

export type FileKind = 'pdf' | 'sheet' | 'doc';
export interface FileItem {
  id: string;
  name: string;
  kind: FileKind;
  /** Ready-to-show meta, e.g. "2 hours ago" or an owner. */
  meta: string;
  shared?: boolean;
}
export interface FolderItem {
  id: string;
  name: string;
  shared: boolean;
  files: number;
}

export const KIND_LABEL: Record<FileKind, string> = { pdf: 'PDF', sheet: 'Spreadsheet', doc: 'Document' };
const BADGE: Record<FileKind, string> = { pdf: 'PDF', sheet: 'XLS', doc: 'DOC' };

const styles = stylex.create({
  folder: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: colors['--oniva-color-surface'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    gap: 10,
    minWidth: 0,
    paddingBlock: 8,
    paddingInline: 10,
    textAlign: 'start',
    transform: {
      default: 'none',
      ':hover': { default: null, [media.hover]: 'translateY(-2px)' },
      '[data-pressed]': `scale(${motion['--oniva-motion-press-scale']})`,
    },
    transitionDuration: `${motion['--oniva-motion-dur-base']}, ${motion['--oniva-motion-dur-base']}, ${motion['--oniva-motion-dur-press']}`,
    transitionProperty: 'background-color, border-color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  folderIcon: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  text: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  name: {
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  sub: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-11'],
    fontVariantNumeric: 'tabular-nums',
    gap: 4,
  },
  file: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 8,
    minWidth: 0,
    padding: 0,
    textAlign: 'start',
    width: '100%',
  },
  preview: {
    alignItems: 'center',
    aspectRatio: '3 / 2',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: {
      default: colors['--oniva-color-border'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-border-hover'] },
    },
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    transform: {
      default: 'none',
      ':hover': { default: null, [media.hover]: 'translateY(-2px)' },
    },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'border-color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  sheetBack: {
    borderRadius: radius['--oniva-radius-md'],
    height: '52%',
    insetBlockStart: '24%',
    position: 'absolute',
    transform: 'translateX(14px) rotate(7deg)',
    width: '26%',
  },
  sheetFront: {
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    height: '56%',
    padding: 8,
    position: 'relative',
    width: '28%',
    boxSizing: 'border-box',
    backgroundColor: colors['--oniva-color-surface'],
  },
  line: {
    backgroundColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-full'],
    height: 3,
  },
  badge: {
    borderRadius: radius['--oniva-radius-xs'],
    fontSize: font['--oniva-font-size-11'],
    fontWeight: font['--oniva-font-weight-bold'],
    insetBlockEnd: -6,
    insetInlineEnd: -10,
    lineHeight: 1,
    paddingBlock: 3,
    paddingInline: 5,
    position: 'absolute',
  },
  pdf: { backgroundColor: colors['--oniva-color-danger-bg'] },
  sheet: { backgroundColor: colors['--oniva-color-success-bg'] },
  doc: { backgroundColor: colors['--oniva-color-info-bg'] },
  pdfBadge: { backgroundColor: colors['--oniva-color-danger-solid'], color: colors['--oniva-color-danger-on-solid'] },
  sheetBadge: { backgroundColor: colors['--oniva-color-success-solid'], color: colors['--oniva-color-success-on-solid'] },
  docBadge: { backgroundColor: colors['--oniva-color-info-solid'], color: colors['--oniva-color-info-on-solid'] },
  fileName: {
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

export function FolderCard({ folder, onOpen }: { folder: FolderItem; onOpen?: (name: string) => void }) {
  const { plural } = useFormatters();
  const count = plural(folder.files, { one: '# file', other: '# files' });
  return (
    <AriaButton onPress={() => onOpen?.(folder.name)} {...stylex.props(styles.folder, focus.ring)}>
      <span aria-hidden="true" {...stylex.props(styles.folderIcon)}>
        <FolderIcon size={18} />
      </span>
      <span {...stylex.props(styles.text)}>
        <span {...stylex.props(styles.name)}>{folder.name}</span>
        <span {...stylex.props(styles.sub)}>
          {folder.shared ? <Users size={12} aria-hidden="true" /> : <Lock size={12} aria-hidden="true" />}
          {folder.shared ? 'Shared' : 'Private'} · {count}
        </span>
      </span>
    </AriaButton>
  );
}

export function FileCard({ file, onOpen, extra }: { file: FileItem; onOpen?: (id: string) => void; extra?: ReactNode }) {
  return (
    <AriaButton
      aria-label={`${file.name}, ${KIND_LABEL[file.kind]}, ${file.meta}`}
      onPress={() => onOpen?.(file.id)}
      {...stylex.props(styles.file, focus.ring)}
    >
      <span aria-hidden="true" {...stylex.props(styles.preview)}>
        <span {...stylex.props(styles.sheetBack, styles[file.kind])} />
        <span {...stylex.props(styles.sheetFront)}>
          <span {...stylex.props(styles.line)} />
          <span {...stylex.props(styles.line)} />
          <span {...stylex.props(styles.line)} />
          <span {...stylex.props(styles.badge, styles[`${file.kind}Badge`])}>{BADGE[file.kind]}</span>
        </span>
      </span>
      <span {...stylex.props(styles.text)}>
        <span {...stylex.props(styles.fileName)}>{file.name}</span>
        <span {...stylex.props(styles.sub)}>
          {KIND_LABEL[file.kind]} · {file.meta}
          {extra}
        </span>
      </span>
    </AriaButton>
  );
}

export const FOLDERS: FolderItem[] = [
  { id: 'brand', name: 'Brand assets', shared: true, files: 3 },
  { id: 'hiring', name: 'Hiring', shared: false, files: 4 },
  { id: 'q3', name: 'Q3 Campaign', shared: true, files: 5 },
  { id: 'research', name: 'Research', shared: false, files: 2 },
];
export const TEMPLATES: (FileItem & { owner: 'mine' | 'other' })[] = [
  { id: 't1', name: 'Brand-Guidelines', kind: 'pdf', meta: 'Jonas Weber', shared: true, owner: 'other' },
  { id: 't2', name: 'Campaign-Budget', kind: 'sheet', meta: 'Jonas Weber', shared: true, owner: 'other' },
  { id: 't3', name: 'Design-Book', kind: 'doc', meta: 'Alex Morgan', shared: false, owner: 'mine' },
  { id: 't4', name: 'Weekly-Report', kind: 'sheet', meta: 'Alex Morgan', shared: false, owner: 'mine' },
];
export const FOLDER_FILES: Record<string, FileItem[]> = {
  'Q3 Campaign': [
    { id: 'f1', name: 'Campaign-Brief', kind: 'doc', meta: '2 hours ago' },
    { id: 'f2', name: 'Launch-Plan', kind: 'pdf', meta: 'Yesterday' },
    { id: 'f3', name: 'Media-Budget', kind: 'sheet', meta: 'Yesterday' },
    { id: 'f4', name: 'Ad-Copy', kind: 'doc', meta: '3 days ago' },
    { id: 'f5', name: 'Results-Q2', kind: 'sheet', meta: 'Last week' },
  ],
  'Brand assets': [
    { id: 'b1', name: 'Logo-Usage', kind: 'pdf', meta: 'Today' },
    { id: 'b2', name: 'Color-Palette', kind: 'doc', meta: 'Yesterday' },
    { id: 'b3', name: 'Asset-Inventory', kind: 'sheet', meta: 'Last week' },
  ],
  Research: [
    { id: 'r1', name: 'Interview-Notes', kind: 'doc', meta: '4 days ago' },
    { id: 'r2', name: 'Survey-Results', kind: 'sheet', meta: 'Last week' },
  ],
};
