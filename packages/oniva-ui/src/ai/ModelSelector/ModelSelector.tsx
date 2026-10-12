import * as stylex from '@stylexjs/stylex';
import { ChevronDown, Sparkles } from 'lucide-react';
import type { Ref } from 'react';
import { Button } from '../../components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../components/DropdownMenu';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';

const styles = stylex.create({
  desc: { color: colors.textMuted, fontSize: font.size12, fontWeight: font.weightRegular },
  chevron: { color: colors.iconMuted },
});

export interface ModelOption {
  id: string;
  name: string;
  description?: string;
}

export interface ModelSelectorProps {
  models: ModelOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  isDisabled?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

/** Model picker: a compact ghost button that opens a single-select menu. */
export function ModelSelector({ models, value, defaultValue, onChange, isDisabled, xstyle, ref }: ModelSelectorProps) {
  const selected = value ?? undefined;
  const current = models.find((m) => m.id === (selected ?? defaultValue)) ?? models[0];
  return (
    <DropdownMenu>
      <Button
        ref={ref}
        variant="ghost"
        size="sm"
        isDisabled={isDisabled}
        aria-label={`Model: ${current?.name ?? ''}`}
        startIcon={<Sparkles size={14} aria-hidden="true" />}
        endIcon={<ChevronDown size={14} aria-hidden="true" {...stylex.props(styles.chevron)} />}
        xstyle={xstyle}
      >
        {current?.name}
      </Button>
      <DropdownMenuContent
        placement="top start"
        aria-label="Choose model"
        selectionMode="single"
        selectedKeys={new Set<string>(current ? [current.id] : [])}
        onSelectionChange={(keys) => {
          const k = [...keys][0];
          if (k != null) onChange?.(String(k));
        }}
      >
        {models.map((m) => (
          <DropdownMenuItem key={m.id} id={m.id} textValue={m.name}>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <span>{m.name}</span>
              {m.description && <span {...stylex.props(styles.desc)}>{m.description}</span>}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
