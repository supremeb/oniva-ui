import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import { AlertCircle, Check, FileText, UploadCloud, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { Button, DropZone, FileTrigger, Text, type DropZoneProps } from 'react-aria-components';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { cx, ff } from '../../internal/forms-field';
import { fp } from '../../internal/forms-popover';
import { shakeStyles } from '../../internal/controls-motion';
import { VisuallyHidden } from '../VisuallyHidden';

const rowIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(6px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const rowOut = stylex.keyframes({
  from: { opacity: 1, transform: 'scaleY(1)' },
  to: { opacity: 0, transform: 'scaleY(0.9)' },
});
const fade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const checkPop = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.6)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

const motionStyles = stylex.create({
  rowIn: {
    animationDelay: 'calc(var(--oniva-i, 0) * var(--oniva-motion-stagger, 35ms))',
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'backwards',
    animationName: { default: rowIn, [media.reducedMotion]: fade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  rowOut: {
    animationDuration: motion['--oniva-motion-dur-fast'],
    animationFillMode: 'forwards',
    animationName: { default: rowOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    opacity: { default: null, [media.reducedMotion]: 0 },
    pointerEvents: 'none',
    transformOrigin: 'top center',
  },
  checkPop: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: checkPop, [media.reducedMotion]: fade },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
  },
  zoneIcon: { position: 'relative', zIndex: 1 },
  ghost: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-icon-muted'],
    display: 'flex',
    height: 40,
    insetBlockStart: 0,
    insetInlineStart: 0,
    justifyContent: 'center',
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    transform: 'translate(0, 0) rotate(0deg) scale(0.9)',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
    width: 40,
    zIndex: 0,
  },
  ghostL: { opacity: 1, transform: 'translate(-22px, -2px) rotate(-14deg) scale(1)' },
  ghostR: { opacity: 1, transform: 'translate(22px, -2px) rotate(14deg) scale(1)' },
  iconLift: {
    transform: { default: 'none', '[data-lift]': 'translateY(-3px)' },
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
  },
  iconHost: { position: 'relative' },
});

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
    boxShadow: 'none',
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
    boxShadow: 'none',
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
  retry: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: colors['--oniva-color-accent-text'],
    cursor: 'pointer',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    paddingInline: 6,
    textDecoration: 'underline',
  },
  ok: { color: colors['--oniva-color-success-solid'] },
  bad: { color: colors['--oniva-color-text-error'] },
});

const panel = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    gap: 0,
    padding: 10,
  },
  zone: { paddingBlock: 20 },
  list: { gap: 0, marginBlockStart: 6 },
  row: {
    alignItems: 'flex-start',
    borderRadius: 0,
    borderWidth: 0,
    borderBlockStartColor: colors['--oniva-color-border'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: { default: 1, ':first-child': 0 },
    boxShadow: 'none',
    gap: 10,
    paddingBlock: 12,
    paddingInline: 4,
  },
  fileIcon: {
    backgroundColor: 'transparent',
    color: colors['--oniva-color-icon-muted'],
    height: 20,
    marginBlockStart: 1,
    width: 20,
  },
  bar: {
    backgroundColor: colors['--oniva-color-chart-track'],
    borderRadius: radius['--oniva-radius-full'],
    height: 3,
    marginBlockStart: 6,
    overflow: 'hidden',
  },
  barFill: {
    display: 'block',
    backgroundColor: accent['--oniva-accent-500'],
    borderRadius: radius['--oniva-radius-full'],
    height: '100%',
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: 'width',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  footer: {
    borderBlockStartColor: colors['--oniva-color-border'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    marginBlockStart: 2,
    paddingBlockStart: 12,
    paddingInline: 4,
  },
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
  /** Extra text after the size in the `panel` variant, e.g. `2s left`. */
  note?: string;
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
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: 'stroke-dashoffset',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
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
  /** Largest allowed file in bytes. Bigger files get a "Too large" error row instead of being added. */
  maxSize?: number;
  /** Called with files that were refused (wrong type or too large) and why. */
  onFilesRejected?: (rejected: { file: File; reason: 'type' | 'size' }[]) => void;
  /** Shows a Retry button on failed rows; called with the row id. */
  onRetry?: (id: string) => void;
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
    retry?: (name: string) => string;
    tooLarge?: (max: string) => string;
    wrongType?: string;
    uploading?: (name: string) => string;
  };
  hint?: ReactNode;
  /**
   * `panel` puts the dropzone and a divided file list (thin progress bars, no rings) in one bordered card, with an
   * optional `footer` summary line. Default `cards`.
   */
  variant?: 'cards' | 'panel';
  /** Summary line under the list (panel variant). */
  footer?: ReactNode;
  isDisabled?: boolean;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function FileUpload({
  files,
  onFilesAdded,
  onRemove,
  maxSize,
  onFilesRejected,
  onRetry,
  accept,
  multiple = true,
  title = 'Drag files here or',
  browseLabel,
  labels,
  hint,
  variant = 'cards',
  footer,
  isDisabled,
  className,
  xstyle,
  ref,
  ...rest
}: FileUploadProps) {
  const [own, setOwn] = useState<UploadFile[]>([]);
  const uid = useId();
  const list = files ?? own;

  // Drop count: read from the native drag event (RAC does not expose it).
  const [dragCount, setDragCount] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const on = (e: DragEvent) => {
      const n = Array.from(e.dataTransfer?.items ?? []).filter((i) => i.kind === 'file').length;
      if (n) setDragCount(n);
    };
    const off = () => setDragCount(0);
    el.addEventListener('dragenter', on);
    el.addEventListener('dragover', on);
    el.addEventListener('dragleave', (e) => {
      if (!el.contains(e.relatedTarget as Node | null)) off();
    });
    el.addEventListener('drop', off);
    return () => {
      el.removeEventListener('dragenter', on);
      el.removeEventListener('dragover', on);
      el.removeEventListener('drop', off);
    };
  }, []);

  // Removed rows linger briefly as inert ghosts so they can fold away.
  const prevList = useRef<UploadFile[]>(list);
  const [ghosts, setGhosts] = useState<{ file: UploadFile; index: number }[]>([]);
  useEffect(() => {
    const ids = new Set(list.map((f) => f.id));
    const gone = prevList.current
      .map((file, index) => ({ file, index }))
      .filter((g) => !ids.has(g.file.id));
    prevList.current = list;
    if (gone.length === 0) return;
    setGhosts((cur) => [...cur, ...gone]);
    const t = setTimeout(
      () => setGhosts((cur) => cur.filter((g) => !gone.some((x) => x.file.id === g.file.id))),
      140,
    );
    return () => clearTimeout(t);
  }, [list]);
  const rows: { file: UploadFile; ghost: boolean; i: number }[] = list.map((file, i) => ({ file, ghost: false, i }));
  for (const g of ghosts) rows.splice(Math.min(g.index, rows.length), 0, { file: g.file, ghost: true, i: g.index });

  const [announce, setAnnounce] = useState('');
  const matches = (f: File) =>
    !accept ||
    accept.some((a) =>
      a.startsWith('.')
        ? f.name.toLowerCase().endsWith(a.toLowerCase())
        : a.endsWith('/*')
          ? f.type.startsWith(a.slice(0, -1))
          : f.type === a,
    );

  const add = (picked: File[]) => {
    const fs = multiple ? picked : picked.slice(0, 1);
    if (fs.length === 0) return;
    const okFiles: File[] = [];
    const rejected: { file: File; reason: 'type' | 'size' }[] = [];
    for (const f of fs) {
      if (!matches(f)) rejected.push({ file: f, reason: 'type' });
      else if (maxSize != null && f.size > maxSize) rejected.push({ file: f, reason: 'size' });
      else okFiles.push(f);
    }
    if (files === undefined) {
      const rows: UploadFile[] = [
        ...okFiles.map((f, i) => ({ id: `${uid}-${Date.now()}-${i}`, name: f.name, size: f.size, progress: 100 })),
        ...rejected.map((r, i) => ({
          id: `${uid}-${Date.now()}-x${i}`,
          name: r.file.name,
          size: r.file.size,
          progress: 0,
          error:
            r.reason === 'size'
              ? (labels?.tooLarge?.(formatBytes(maxSize ?? 0)) ?? `Too large (max ${formatBytes(maxSize ?? 0)})`)
              : (labels?.wrongType ?? 'File type not accepted'),
        })),
      ];
      setOwn((cur) => [...(multiple ? cur : []), ...rows]);
    }
    if (rejected.length) {
      onFilesRejected?.(rejected);
      setAnnounce(`${rejected.length} file${rejected.length === 1 ? '' : 's'} could not be added`);
    } else setAnnounce(`${okFiles.length} file${okFiles.length === 1 ? '' : 's'} added`);
    if (okFiles.length) onFilesAdded?.(okFiles);
  };
  const remove = (id: string) => {
    if (files === undefined) setOwn((cur) => cur.filter((f) => f.id !== id));
    onRemove?.(id);
  };

  const isPanel = variant === 'panel';
  const rootSx = stylex.props(styles.root, isPanel && panel.root, xstyle);
  return (
    <div
      ref={rootRef}
      aria-disabled={isDisabled || undefined}
      {...rootSx}
      className={cx(rootSx.className, className)}
    >
      <DropZone
        {...rest}
        ref={ref}
        isDisabled={isDisabled}
        onDrop={async (e) => {
          const items = e.items.filter((i) => i.kind === 'file');
          const got = await Promise.all(items.map((i) => (i.kind === 'file' ? i.getFile() : null)));
          add(got.filter((f): f is File => f != null));
        }}
        className={({ isDropTarget, isFocusVisible }) =>
          stylex.props(
            styles.zone,
            isPanel && panel.zone,
            isDropTarget && styles.zoneActive,
            isFocusVisible && ff.focusRing,
            isDisabled && styles.zoneDisabled,
          ).className ?? ''
        }
      >
        {(({ over }) => (
          <span aria-hidden="true" {...stylex.props(motionStyles.iconHost)}>
            <span {...stylex.props(motionStyles.ghost, over && motionStyles.ghostL)}>
              <FileText size={18} />
            </span>
            <span {...stylex.props(motionStyles.ghost, over && motionStyles.ghostR)}>
              <FileText size={18} />
            </span>
            <span data-lift={over ? '' : undefined} {...stylex.props(styles.iconWrap, motionStyles.zoneIcon, motionStyles.iconLift)}>
              <UploadCloud size={20} />
            </span>
          </span>
        ))({ over: dragCount > 0 })}
        <Text slot="label" {...stylex.props(styles.title)}>
          {dragCount > 0 ? `Drop ${dragCount} file${dragCount === 1 ? '' : 's'}` : title}{' '}
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
      <VisuallyHidden>
        <span role="status" aria-live="polite">
          {announce}
        </span>
      </VisuallyHidden>
      {list.length > 0 && (
        <ul aria-label={labels?.list ?? 'Uploaded files'} {...stylex.props(styles.list, isPanel && panel.list)}>
          {rows.map(({ file: f, ghost, i }) => {
            const done = f.progress >= 100 && !f.error;
            return (
              <li
                key={f.id}
                aria-hidden={ghost || undefined}
                inert={ghost || undefined}
                style={{ '--oniva-i': Math.min(i, 6) } as CSSProperties}
                {...stylex.props(
                  styles.row,
                  isPanel && panel.row,
                  f.error != null && styles.rowError,
                  f.error != null && shakeStyles.shake,
                  ghost ? motionStyles.rowOut : motionStyles.rowIn,
                )}
              >
                <span aria-hidden="true" {...stylex.props(styles.fileIcon, isPanel && panel.fileIcon)}>
                  <FileText size={18} />
                </span>
                <span {...stylex.props(styles.meta)}>
                  <span title={f.name} {...stylex.props(styles.name)}>{f.name}</span>
                  <span {...stylex.props(f.error ? ff.error : ff.description, ff.tabular)}>
                    {f.error ??
                      (done
                        ? formatBytes(f.size)
                        : isPanel
                          ? `${formatBytes((f.size * f.progress) / 100)} of ${formatBytes(f.size)}${f.note ? ` · ${f.note}` : ''}`
                          : `${formatBytes(f.size)} · ${Math.round(f.progress)}%`)}
                  </span>
                  {isPanel && !f.error && !done && (
                    <span
                      role="progressbar"
                      aria-label={labels?.uploading ? labels.uploading(f.name) : `Uploading ${f.name}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(f.progress)}
                      {...stylex.props(panel.bar)}
                    >
                      <span style={{ width: `${Math.max(0, Math.min(100, f.progress))}%` }} {...stylex.props(panel.barFill)} />
                    </span>
                  )}
                </span>
                {isPanel && !done && !f.error ? null : f.error ? (
                  <AlertCircle size={20} role="img" aria-label={labels?.uploadFailed ?? 'Upload failed'} {...stylex.props(styles.bad)} />
                ) : done ? (
                  <Check size={20} role="img" aria-label={labels?.uploadComplete ?? 'Upload complete'} {...stylex.props(styles.ok, motionStyles.checkPop)} />
                ) : (
                  <ProgressRing value={f.progress} label={labels?.uploading ? labels.uploading(f.name) : `Uploading ${f.name}`} />
                )}
                {f.error != null && onRetry && (
                  <Button
                    aria-label={labels?.retry ? labels.retry(f.name) : `Retry ${f.name}`}
                    onPress={() => onRetry(f.id)}
                    {...stylex.props(styles.retry)}
                  >
                    Retry
                  </Button>
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
      {isPanel && footer != null && <div {...stylex.props(panel.footer)}>{footer}</div>}
    </div>
  );
}
