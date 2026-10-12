import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import { AlertCircle, Check, FileText, UploadCloud, X } from 'lucide-react';
import { useId, useState, type ReactNode, type Ref } from 'react';
import { Button, DropZone, FileTrigger, Text, type DropZoneProps } from 'react-aria-components';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { cx, ff } from '../../internal/forms-field';
import { fp } from '../../internal/forms-popover';

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 12,
    width: '100%',
  },
  zone: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'dashed',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
    paddingBlock: 28,
    paddingInline: 20,
    textAlign: 'center',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color',
  },
  zoneActive: {
    backgroundColor: colors['--oniva-color-accent-tint'],
    borderColor: colors['--oniva-color-focus-ring'],
  },
  zoneDisabled: { opacity: 0.5 },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
    color: colors['--oniva-color-icon-muted'],
    display: 'flex',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
  },
  browse: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-accent-soft-fg'],
    cursor: 'pointer',
    font: 'inherit',
    padding: 0,
    textDecoration: { default: 'none', ':hover': { default: null, [media.hover]: 'underline' } },
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  row: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
    boxSizing: 'border-box',
    display: 'flex',
    gap: 12,
    padding: 10,
  },
  rowError: { borderColor: colors['--oniva-color-error-border'] },
  fileIcon: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-text-on-tertiary'],
    display: 'flex',
    flexShrink: 0,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  meta: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 },
  name: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  ringWrap: {
    alignItems: 'center',
    display: 'flex',
    flexShrink: 0,
    height: 28,
    justifyContent: 'center',
    position: 'relative',
    width: 28,
  },
  ok: { color: colors['--oniva-color-success-solid'] },
  bad: { color: colors['--oniva-color-text-error'] },
});

export interface UploadFile {
  id: string;
  name: string;
  /** Bytes. */
  size: number;
  /** 0-100. 100 means done. */
  progress: number;
  /** Error text; renders the row in an error state. */
  error?: string;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

const ringTrack = stylex.create({
  track: { stroke: colors['--oniva-color-chart-track'] },
  bar: {
    stroke: accent['--oniva-accent-500'],
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'stroke-dashoffset',
  },
});

/** Circular progress indicator (SVG ring). */
export function ProgressRing({ value, label }: { value: number; label: string }) {
  const r = 11;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <span
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(v)}
      {...stylex.props(styles.ringWrap)}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <circle
          cx="14"
          cy="14"
          r={r}
          fill="none"
          strokeWidth="3"
          {...stylex.props(ringTrack.track)}
        />
        <circle
          cx="14"
          cy="14"
          r={r}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * v) / 100}
          transform="rotate(-90 14 14)"
          {...stylex.props(ringTrack.bar)}
        />
      </svg>
    </span>
  );
}

export interface FileUploadProps extends Omit<
  DropZoneProps,
  'className' | 'style' | 'children' | 'onDrop'
> {
  /** Controlled file list (progress is up to the caller). */
  files?: UploadFile[];
  /** Called with newly picked / dropped files. */
  onFilesAdded?: (files: File[]) => void;
  onRemove?: (id: string) => void;
  /** MIME types or extensions, e.g. ['application/pdf', '.csv']. */
  accept?: string[];
  multiple?: boolean;
  title?: ReactNode;
  /** Text of the browse button. Default `Choose files` (`Choose file` when `multiple` is false). */
  browseLabel?: string;
  /** Override built-in strings (localisation). */
  labels?: {
    uploadFailed?: string;
    uploadComplete?: string;
    list?: string;
    remove?: (name: string) => string;
    uploading?: (name: string) => string;
  };
  hint?: ReactNode;
  isDisabled?: boolean;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function FileUpload({
  files,
  onFilesAdded,
  onRemove,
  accept,
  multiple = true,
  title = 'Drag files here or',
  browseLabel,
  labels,
  hint,
  isDisabled,
  className,
  xstyle,
  ref,
  ...rest
}: FileUploadProps) {
  const [own, setOwn] = useState<UploadFile[]>([]);
  const uid = useId();
  const list = files ?? own;

  const add = (picked: File[]) => {
    const fs = multiple ? picked : picked.slice(0, 1);
    if (fs.length === 0) return;
    if (files === undefined) {
      setOwn((cur) => [
        ...(multiple ? cur : []),
        ...fs.map((f, i) => ({
          id: `${uid}-${Date.now()}-${i}`,
          name: f.name,
          size: f.size,
          progress: 100,
        })),
      ]);
    }
    onFilesAdded?.(fs);
  };
  const remove = (id: string) => {
    if (files === undefined) setOwn((cur) => cur.filter((f) => f.id !== id));
    onRemove?.(id);
  };

  const matches = (f: File) =>
    !accept ||
    accept.some((a) =>
      a.startsWith('.')
        ? f.name.toLowerCase().endsWith(a.toLowerCase())
        : a.endsWith('/*')
          ? f.type.startsWith(a.slice(0, -1))
          : f.type === a,
    );

  return (
    <div
      aria-disabled={isDisabled || undefined}
      {...stylex.props(styles.root, xstyle)}
      className={cx(stylex.props(styles.root, xstyle).className, className)}
    >
      <DropZone
        {...rest}
        ref={ref}
        isDisabled={isDisabled}
        onDrop={async (e) => {
          const items = e.items.filter((i) => i.kind === 'file');
          const got = await Promise.all(items.map((i) => (i.kind === 'file' ? i.getFile() : null)));
          add(got.filter((f): f is File => f != null && matches(f)));
        }}
        className={({ isDropTarget, isFocusVisible }) =>
          stylex.props(
            styles.zone,
            isDropTarget && styles.zoneActive,
            isFocusVisible && ff.focusRing,
            isDisabled && styles.zoneDisabled,
          ).className ?? ''
        }
      >
        <span aria-hidden="true" {...stylex.props(styles.iconWrap)}>
          <UploadCloud size={20} />
        </span>
        <Text slot="label" {...stylex.props(styles.title)}>
          {title}{' '}
          <FileTrigger
            acceptedFileTypes={accept}
            allowsMultiple={multiple}
            onSelect={(fl) => add(fl ? Array.from(fl) : [])}
          >
            <Button isDisabled={isDisabled} {...stylex.props(styles.browse)}>
              {browseLabel ?? (multiple ? 'Choose files' : 'Choose file')}
            </Button>
          </FileTrigger>
        </Text>
        {hint != null && <span {...stylex.props(ff.description)}>{hint}</span>}
      </DropZone>
      {list.length > 0 && (
        <ul aria-label={labels?.list ?? 'Uploaded files'} {...stylex.props(styles.list)}>
          {list.map((f) => {
            const done = f.progress >= 100 && !f.error;
            return (
              <li key={f.id} {...stylex.props(styles.row, f.error != null && styles.rowError)}>
                <span aria-hidden="true" {...stylex.props(styles.fileIcon)}>
                  <FileText size={18} />
                </span>
                <span {...stylex.props(styles.meta)}>
                  <span title={f.name} {...stylex.props(styles.name)}>{f.name}</span>
                  <span {...stylex.props(f.error ? ff.error : ff.description, ff.tabular)}>
                    {f.error ??
                      (done
                        ? formatBytes(f.size)
                        : `${formatBytes(f.size)} · ${Math.round(f.progress)}%`)}
                  </span>
                </span>
                {f.error ? (
                  <AlertCircle size={20} role="img" aria-label={labels?.uploadFailed ?? 'Upload failed'} {...stylex.props(styles.bad)} />
                ) : done ? (
                  <Check size={20} role="img" aria-label={labels?.uploadComplete ?? 'Upload complete'} {...stylex.props(styles.ok)} />
                ) : (
                  <ProgressRing value={f.progress} label={labels?.uploading ? labels.uploading(f.name) : `Uploading ${f.name}`} />
                )}
                <Button
                  aria-label={labels?.remove ? labels.remove(f.name) : `Remove ${f.name}`}
                  onPress={() => remove(f.id)}
                  {...stylex.props(fp.iconButton)}
                >
                  <X size={14} aria-hidden="true" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
