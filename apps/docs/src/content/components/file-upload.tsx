import { FileUpload } from 'oniva-ui';
import type { UploadFile } from 'oniva-ui';
import type { DocPage } from '../types';

const files: UploadFile[] = [
  { id: '1', name: 'Q3-statement.pdf', size: 1_840_000, progress: 100 },
  { id: '2', name: 'vendor-list.csv', size: 420_000, progress: 62 },
  { id: '3', name: 'contract-final.zip', size: 58_400_000, progress: 100, error: 'File is over the 50 MB limit.' },
];

type P = {
  multiple?: boolean;
  isDisabled?: boolean;
  withFiles?: boolean;
  hint?: string;
  title?: string;
  onAdd?: () => void;
};

const Basic = (p: P) => (
  <div style={{ width: 420 }}>
    <FileUpload
      accept={['.pdf', '.csv', '.zip']}
      multiple={p.multiple}
      isDisabled={p.isDisabled}
      hint={p.hint ?? 'PDF, CSV or ZIP up to 50 MB'}
      title={p.title}
      files={p.withFiles ? files : undefined}
      onFilesAdded={p.onAdd}
      onRemove={() => p.onAdd?.()}
    />
  </div>
);

const page: DocPage = {
  slug: 'file-upload',
  status: 'Stable',
  version: '0.1.0',
  importName: 'FileUpload',
  group: ['Components', 'Forms'],
  sourcePath: 'components/FileUpload',
  lede: 'A drop zone with a browse button and a list of files. It handles four moments: waiting for files, uploading, finished, and failed.',
  anatomy: {
    intro: 'Six parts. The drop zone, icon and browse button are always present. The hint and file list appear when set.',
    Render: () => <Basic withFiles />,
    parts: [
      { name: 'Drop zone', description: 'Dashed 1px border, 16px radius, 28px vertical and 20px horizontal padding. Highlights while a file is dragged over it.', selector: 'div[data-rac]:has(> span[slot="label"])', fallback: { x: 50, y: 25 } },
      { name: 'Icon tile', description: '40px rounded tile (10px radius) with an upload icon. Decorative.', selector: 'div[data-rac] > span:nth-child(2)', fallback: { x: 50, y: 12 } },
      { name: 'Title', description: '14px medium. Default "Drag files here or browse". Change it with title.', selector: 'span[slot="label"]' },
      { name: 'Browse button', description: 'Opens the system picker. Text is "Choose files", or "Choose file" when multiple is false.', selector: 'span[slot="label"] > button' },
      { name: 'Hint', description: 'Accepted types and size limit, 13px muted. Say the limits before the user picks.', selector: 'div[data-rac] > span:last-child' },
      { name: 'File row', description: '10px padding, 10px radius. 36px type tile, name at 14px medium, size, a progress ring while uploading and a 28px remove button.', selector: 'ul > li:first-child' },
    ],
  },
  usage: {
    use: ['Attaching documents: statements, receipts, contracts.', 'Bulk import from CSV with visible progress.', 'Drag and drop for desktop users, with a button for everyone.', 'Showing per-file errors without blocking other files.'],
    avoid: [
      { text: 'A single small image like an avatar.', instead: { slug: 'button', label: 'Button' } },
      { text: 'Pasting short text.', instead: { slug: 'textarea', label: 'Textarea' } },
      { text: 'Choosing from files already uploaded.', instead: { slug: 'combobox', label: 'Combobox' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'hint', label: 'Hint', presets: ['PDF, CSV or ZIP up to 50 MB', 'PDF only, 10 MB each', 'Images up to 5 MB'] },
      { kind: 'text', key: 'title', label: 'Title', presets: ['Drag files here or browse', 'Drop your statement', 'Add receipts'] },
      { kind: 'toggle', key: 'multiple', label: 'Multiple' },
      { kind: 'toggle', key: 'withFiles', label: 'Show files' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { hint: 'PDF, CSV or ZIP up to 50 MB', title: 'Drag files here or browse', multiple: true, withFiles: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic hint={String(p.hint)} title={String(p.title)} multiple={Boolean(p.multiple)} withFiles={Boolean(p.withFiles)} isDisabled={Boolean(p.isDisabled)} onAdd={() => onEvent('onFilesAdded / onRemove')} />
    ),
    code: (p) => `<FileUpload accept={['.pdf', '.csv', '.zip']} hint="${p.hint}"${p.title !== 'Drag files here or browse' ? ` title="${p.title}"` : ''}${p.multiple ? ' multiple' : ''}${p.withFiles ? ' files={files}' : ''}${p.isDisabled ? ' isDisabled' : ''} onFilesAdded={add} onRemove={remove} />`,
  },
  states: [
    { name: 'Empty', description: 'Zone, hint and browse button.', Render: () => <Basic /> },
    { name: 'Progress, done and error', description: 'A row each: 62% uploading, complete, and failed with a message.', Render: () => <Basic withFiles /> },
    { name: 'Single file', description: 'multiple is false: the button reads "Choose file".', Render: () => <Basic multiple={false} hint="PDF up to 10 MB" /> },
    { name: 'Disabled', description: 'Muted zone, button disabled, drops ignored.', Render: () => <Basic isDisabled hint="Uploads are locked for closed periods." /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'Validate before upload where you can, and report per file.',
      items: [
        { title: 'Tell the limits first', body: 'Put types and size in the hint. A rule found after failing is a bad rule.' },
        { title: 'Filter with accept', body: 'accept lists extensions or MIME types; the picker and drops use it. Re-check on the server, because accept can be bypassed.' },
        { title: 'Check size on add', body: 'In onFilesAdded, reject files over the limit and set the row error: "File is over the 50 MB limit."' },
        { title: 'Fail one file, not the batch', body: 'An error on one row must not stop the others. Each row has its own error.' },
        { title: 'Make retry obvious', body: 'A failed row keeps a remove button. Say how to fix it: "Upload a PDF under 50 MB."' },
      ],
    },
    {
      type: 'rules',
      id: 'lifecycle',
      title: 'Lifecycle',
      items: [
        { title: 'Progress is yours', body: 'The component is controlled. You pass files with progress 0 to 100; 100 means done.' },
        { title: 'Show progress at once', body: 'Add the row on pick with progress 0, so the user sees something within 100ms.' },
        { title: 'Announce results', body: 'Completion and failure are announced to screen readers via the built-in status text; override with labels for other languages.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Title', body: 'A direct instruction: "Drag files here or browse".' },
      { title: 'Hint', body: 'Types then limit: "PDF, CSV or ZIP up to 50 MB".' },
      { title: 'Errors', body: 'State the rule and the fix: "File is over the 50 MB limit."' },
      { title: 'File names', body: 'Show the original name; truncate in the middle for long names.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Focuses the browse button, then the remove buttons in the list.' },
      { keys: ['Enter', 'Space'], action: 'On the browse button, opens the system file picker.' },
      { keys: ['Enter', 'Space'], action: 'On a remove button, removes that file.' },
    ],
    notes: [
      'Built on React Aria DropZone with a native file input behind the button.',
      'Keyboard users never need drag and drop; the button is the full alternative.',
      'The list has an accessible name (labels.list). Remove buttons are named "Remove <file name>".',
      'Progress is exposed as text and a progress ring; completion is announced as "Upload complete".',
      'Errors appear next to the file name so they are read in context.',
    ],
    reducedMotion: 'The drag highlight and progress ring animation are shortened.',
  },
  props: [
    { name: 'files', type: 'UploadFile[]', description: 'Controlled list. Each has id, name, size (bytes), progress (0 to 100) and optional error.' },
    { name: 'onFilesAdded', type: '(files: File[]) => void', description: 'New files from the picker or a drop.' },
    { name: 'onRemove', type: '(id: string) => void', description: 'Remove button pressed.' },
    { name: 'accept', type: 'string[]', description: 'MIME types or extensions.' },
    { name: 'multiple', type: 'boolean', default: 'true', description: 'Allow more than one file.' },
    { name: 'title', type: 'ReactNode', description: 'Zone headline.' },
    { name: 'hint', type: 'ReactNode', description: 'Accepted types and limits.' },
    { name: 'browseLabel', type: 'string', default: "'Choose files'", description: 'Button text.' },
    { name: 'labels', type: '{ uploadFailed, uploadComplete, list, remove(name), uploading(name) }', description: 'Override built-in strings for localisation.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disable picking and dropping.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Root style override.' },
  ],
  related: ['form', 'progress-bar', 'button', 'field'],
};
export default page;
