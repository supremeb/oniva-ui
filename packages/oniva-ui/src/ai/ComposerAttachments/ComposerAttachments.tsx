import * as stylex from '@stylexjs/stylex';
import { AlertCircle, FileText, Image as ImageIcon, X } from 'lucide-react';
import type { HTMLAttributes, Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { RingProgress } from '../../components/RingProgress';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  root: { display: 'flex', flexWrap: 'wrap', gap: 8, listStyle: 'none', margin: 0, padding: 0 },
  tile: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    boxSizing: 'border-box',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    gap: 8,
    height: 44,
    maxWidth: 220,
    paddingInlineEnd: 28,
    paddingInlineStart: 6,
    position: 'relative',
  },
  error: { borderColor: colors['--oniva-color-error-border'] },
  thumb: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-icon-muted'],
    display: 'flex',
    flexShrink: 0,
    height: 32,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 32,
  },
  img: { height: '100%', objectFit: 'cover', width: '100%' },
  meta: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  name: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-12'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  sub: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-11'],
    fontVariantNumeric: 'tabular-nums',
    lineHeight: font['--oniva-font-lh-11'],
  },
  subError: { color: colors['--oniva-color-text-error'] },
  remove: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-tertiary'] },
    borderRadius: radius['--oniva-radius-full'],
    borderWidth: 0,
    color: colors['--oniva-color-icon-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    height: 20,
    insetBlockStart: 4,
    insetInlineEnd: 4,
    justifyContent: 'center',
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    position: 'absolute',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
    width: 20,
  },
  ringWrap: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors['--oniva-color-overlay'],
  },
});

export interface AttachmentFile {
  id: string;
  name: string;
  /** Bytes. */
  size?: number;
  /** MIME type; `image/*` shows an image icon or preview. */
  type?: string;
  /** Object/data URL for an image preview. */
  previewUrl?: string;
  /** 0-100 while uploading; omit when complete. */
  progress?: number;
  status?: 'uploading' | 'done' | 'error';
}

export interface ComposerAttachmentsProps extends Omit<
  HTMLAttributes<HTMLUListElement>,
  'style' | 'children'
> {
  files: AttachmentFile[];
  onRemove?: (id: string) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLUListElement>;
}

function formatSize(b?: number) {
  if (b == null) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${Math.round(b / 1024)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

/** File tiles for a composer; uploading files show a circular progress ring. */
export function ComposerAttachments({
  files,
  onRemove,
  className,
  xstyle,
  ref,
  ...rest
}: ComposerAttachmentsProps) {
  const sx = stylex.props(styles.root, xstyle);
  return (
    <ul aria-label="Attachments" {...rest} ref={ref} {...mergeSx(sx, className)}>
      {files.map((f) => {
        const uploading =
          f.status === 'uploading' ||
          (f.progress != null && f.progress < 100 && f.status !== 'error');
        const isImg = f.type?.startsWith('image/');
        return (
          <li key={f.id} {...stylex.props(styles.tile, f.status === 'error' && styles.error)}>
            <span {...stylex.props(styles.thumb)}>
              {isImg && f.previewUrl ? (
                <img src={f.previewUrl} alt="" {...stylex.props(styles.img)} />
              ) : f.status === 'error' ? (
                <AlertCircle size={16} aria-hidden="true" />
              ) : isImg ? (
                <ImageIcon size={16} aria-hidden="true" />
              ) : (
                <FileText size={16} aria-hidden="true" />
              )}
              {uploading && (
                <span {...stylex.props(styles.ringWrap)}>
                  <RingProgress
                    diameter={24}
                    strokeWidth={3}
                    aria-label={`Uploading ${f.name}`}
                    value={f.progress ?? 0}
                  >
                    {''}
                  </RingProgress>
                </span>
              )}
            </span>
            <span {...stylex.props(styles.meta)}>
              <span {...stylex.props(styles.name)}>{f.name}</span>
              <span {...stylex.props(styles.sub, f.status === 'error' && styles.subError)}>
                {f.status === 'error'
                  ? 'Upload failed'
                  : uploading
                    ? `${Math.round(f.progress ?? 0)}%`
                    : formatSize(f.size)}
              </span>
            </span>
            {onRemove && (
              <AriaButton
                aria-label={`Remove ${f.name}`}
                onPress={() => onRemove(f.id)}
                className={() => stylex.props(styles.remove).className ?? ''}
              >
                <X size={12} aria-hidden="true" />
              </AriaButton>
            )}
          </li>
        );
      })}
    </ul>
  );
}
