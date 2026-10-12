import * as stylex from '@stylexjs/stylex';
import { FileCode2, FileText, Image as ImageIcon, X } from 'lucide-react';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { mergeSx } from '../../internal/sx';
import { useLeaving } from '../../internal/aib-leave';
import { Presence } from '../../motion/Presence';

const styles = stylex.create({
  list: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: { alignItems: 'center', display: 'flex', gap: 8, maxWidth: 240, padding: 6, paddingInlineEnd: 4 },
  thumb: {
    borderRadius: radius['--oniva-radius-md'],
    flexShrink: 0,
    height: 32,
    objectFit: 'cover',
    width: 32,
  },
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

const icons = { pdf: FileText, image: ImageIcon, code: FileCode2 } as const;

/** Chips for attached pdf / image / code files, with thumbnails and animated removal. */
export function AttachmentPreview({ attachments, onRemove, className, xstyle, ref, ...rest }: AttachmentPreviewProps) {
  const { leaving, leave } = useLeaving(onRemove);
  return (
    <ul {...rest} ref={ref} aria-label={rest['aria-label'] ?? 'Attachments'} {...mergeSx(stylex.props(styles.list, xstyle), className)} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {attachments.map((a) => {
        const Icon = icons[a.kind];
        return (
          <li key={a.id} style={{ display: 'contents' }}>
            <Presence isPresent={!leaving.has(a.id)} preset="scale" xstyle={[aiStyles.tile, styles.chip]}>
              {a.kind === 'image' && a.previewUrl ? (
                <img src={a.previewUrl} alt="" {...stylex.props(styles.thumb)} />
              ) : (
                <span {...stylex.props(aib.iconBox, styles[a.kind])}>
                  <Icon size={16} />
                </span>
              )}
              <span {...stylex.props(aib.grow)}>
                <span {...stylex.props(aib.name, aib.clamp)} style={{ display: 'block' }}>{a.name}</span>
                {a.size && <span {...stylex.props(aib.meta, aiStyles.num)}>{a.size}</span>}
              </span>
              {onRemove && (
                <button type="button" aria-label={`Remove ${a.name}`} onClick={() => leave(a.id)} {...stylex.props(aib.mini)}>
                  <X size={14} />
                </button>
              )}
            </Presence>
          </li>
        );
      })}
    </ul>
  );
}
