import type * as stylex from '@stylexjs/stylex';
import type { ReactNode, Ref } from 'react';

export type SheetColumnType = 'title' | 'tag' | 'link' | 'number' | 'date' | 'text';

export interface SheetColumn {
  key: string;
  label: string;
  icon?: ReactNode;
  width?: number;
  type?: SheetColumnType;
  editable?: boolean;
  /** Tag choices (fixed set when provided). */
  options?: string[];
  format?: (value: unknown) => string;
}

export interface SheetRow {
  id: string;
  logo?: ReactNode;
  [key: string]: unknown;
}

export type TagTone = 'blue' | 'violet' | 'pink' | 'green' | 'amber' | 'gray';

export interface DataSheetProps {
  title: string;
  icon?: ReactNode;
  columns: SheetColumn[];
  /** Initial rows (uncontrolled). */
  rows: SheetRow[];
  tagTones?: Record<string, TagTone>;
  /** Default true. */
  editable?: boolean;
  onRowsChange?: (rows: SheetRow[]) => void;
  onSelectionChange?: (ids: string[]) => void;
  addRowLabel?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}
