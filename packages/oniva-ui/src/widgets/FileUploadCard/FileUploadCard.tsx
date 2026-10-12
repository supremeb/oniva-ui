import * as stylex from '@stylexjs/stylex';
import type { Ref } from 'react';
import {
  Card,
  CardHeader,
  CardHeaderText,
  CardTitle,
  CardDescription,
  Tile,
} from '../../components/Card';
import { FileUpload, formatBytes, type UploadFile } from '../../components/FileUpload';
import { ProgressBar } from '../../components/ProgressBar';

const styles = stylex.create({
  storage: { display: 'flex', flexDirection: 'column', gap: 8 },
});

export interface FileUploadCardProps {
  files: UploadFile[];
  onFilesAdded?: (files: File[]) => void;
  onRemove?: (id: string) => void;
  title?: string;
  description?: string;
  accept?: string[];
  /** Storage used / total in bytes; shows a usage bar when both are set. */
  usedBytes?: number;
  totalBytes?: number;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Upload card: drop zone + file progress list + storage quota meter. */
export function FileUploadCard({
  files,
  onFilesAdded,
  onRemove,
  title = 'Upload files',
  description = 'PDF, PNG or CSV up to 25 MB each.',
  accept,
  usedBytes,
  totalBytes,
  className,
  xstyle,
  ref,
}: FileUploadCardProps) {
  const showQuota = usedBytes !== undefined && totalBytes !== undefined && totalBytes > 0;
  return (
    <Card ref={ref} className={className} xstyle={xstyle}>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeaderText>
      </CardHeader>
      <Tile padding="sm">
        <FileUpload
          files={files}
          onFilesAdded={onFilesAdded}
          onRemove={onRemove}
          accept={accept}
          multiple
        />
      </Tile>
      {showQuota && (
        <Tile padding="sm">
          <div {...stylex.props(styles.storage)}>
            <ProgressBar
              aria-label="Storage used"
              label="Storage"
              value={usedBytes}
              maxValue={totalBytes}
              valueLabel={`${formatBytes(usedBytes)} of ${formatBytes(totalBytes)}`}
              showValue
              size="sm"
            />
          </div>
        </Tile>
      )}
    </Card>
  );
}
