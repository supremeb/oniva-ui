import * as stylex from '@stylexjs/stylex';
import { FileCodeIcon, FileTextIcon, ImageIcon, XIcon } from '../../icons/IconSet';
import { useState } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { mergeSx } from '../../internal/sx';
import { useLeaving } from '../../internal/aib-leave';
import { Presence } from '../../motion/Presence';

const styles = stylex.create({
  list: { display: 'flex', flexWrap: 'wrap', gap: 8, listStyleType: 'none', margin: 0, padding: 0 },
  item: { maxWidth: '100%', minWidth: 0 },
  chip: { alignItems: 'center', display: 'flex', gap: 8, maxWidth: 240, padding: 6, paddingInlineEnd: 4 },
  thumb: {
    borderRadius: radius['--oniva-radius-md'],
    flexShrink: 0,
    height: 32,
    objectFit: 'cover',
    width: 32,
  },
  sizeLine: { display: 'block' },
  nameRow: { display: 'flex', minWidth: 0 },
  stem: { minWidth: 0 },
  ext: { flexShrink: 0 },
  pdf: { color: colors['--oniva-color-danger-fg'] },
  code: { color: colors['--oniva-color-info-fg'] },
  image: { color: colors['--oniva-color-success-fg'] },
});

export interface Attachment {
  id: string;
  name: string;
  kind: 'pdf' | 'image' | 'code';
  /** e.g. `2.4 MB`. */
  size?: string;
  /** Image URL for thumbnails. */
  previewUrl?: string;
}

export interface AttachmentPreviewProps extends Omit<HTMLAttributes<HTMLUListElement>, 'style'> {
  attachments: Attachment[];
  onRemove?: (id: string) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLUListElement>;
}

const icons = { pdf: FileTextIcon, image: ImageIcon, code: FileCodeIcon } as const;

/** Split `report.final.pdf` into `report.final` + `.pdf` so a truncated name keeps its extension visible. */
function splitName(name: string): [string, string] {
  const dot = name.lastIndexOf('.');
  if (dot <= 0 || name.length - dot > 8) return [name, ''];
  return [name.slice(0, dot), name.slice(dot)];
}

function Thumb({ attachment: a }: { attachment: Attachment }) {
  const [failed, setFailed] = useState(false);
  const Icon = icons[a.kind];
  if (a.kind === 'image' && a.previewUrl && !failed) {
    return <img src={a.previewUrl} alt="" onError={() => setFailed(true)} {...stylex.props(styles.thumb)} />;
  }
  return (
    <span {...stylex.props(aib.iconBox, styles[a.kind])}>
      <Icon size={16} aria-hidden />
    </span>
  );
}

/** Chips for attached pdf / image / code files, with thumbnails and animated removal. */
export function AttachmentPreview({ attachments, onRemove, className, xstyle, ref, ...rest }: AttachmentPreviewProps) {
  const { leaving, leave } = useLeaving(onRemove);
  return (
    <ul {...rest} ref={ref} aria-label={rest['aria-label'] ?? 'Attachments'} {...mergeSx(stylex.props(styles.list, xstyle), className)}>
      {attachments.map((a) => {
        const [stem, ext] = splitName(a.name);
        return (
          <li key={a.id} {...stylex.props(styles.item)}>
            <Presence isPresent={!leaving.has(a.id)} preset="scale" title={a.name} xstyle={[aiStyles.tile, styles.chip]}>
              <Thumb attachment={a} />
              <span {...stylex.props(aib.grow)}>
                <span {...stylex.props(aib.name, styles.nameRow)}>
                  <span {...stylex.props(aib.clamp, styles.stem)}>{stem}</span>
                  {ext && <span {...stylex.props(styles.ext)}>{ext}</span>}
                </span>
                {a.size && <span {...stylex.props(aib.meta, aiStyles.num, styles.sizeLine)}>{a.size}</span>}
              </span>
              {onRemove && (
                <button type="button" aria-label={`Remove ${a.name}`} onClick={() => leave(a.id)} {...stylex.props(aib.mini)}>
                  <XIcon size={14} aria-hidden />
                </button>
              )}
            </Presence>
          </li>
        );
      })}
    </ul>
  );
}
