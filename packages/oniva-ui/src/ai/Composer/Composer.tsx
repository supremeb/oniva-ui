import * as stylex from '@stylexjs/stylex';
import { ArrowUp, ChevronDown, Gauge, Paperclip, ShieldCheck, Square } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { TextArea as AriaTextArea } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Tooltip } from '../../components/Tooltip';
import { Slider } from '../../components/Slider';
import { Kbd } from '../../components/Kbd';
import { Popover, PopoverTrigger } from '../../components/Popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '../../components/DropdownMenu';
import { ComposerLoader } from '../ComposerLoader';
import { ComposerAttachments, type AttachmentFile } from '../ComposerAttachments';
import { ModelSelector, type ModelOption } from '../ModelSelector';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  root: { fontFamily: font['--oniva-font-sans'], width: '100%' },
  body: { boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 8, padding: 12 },
  area: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-16'],
    maxHeight: 220,
    minHeight: 44,
    outlineStyle: 'none',
    overflowY: 'auto',
    padding: 4,
    resize: 'none',
    width: '100%',
    '::placeholder': { color: colors['--oniva-color-text-placeholder'] },
  },
  bar: { alignItems: 'center', display: 'flex', gap: 2 },
  spacer: { flexGrow: 1 },
  hint: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 4,
    marginInlineEnd: 6,
  },
  effort: { display: 'flex', flexDirection: 'column', gap: 8, width: 220 },
  effortLabels: {
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-12'],
    justifyContent: 'space-between',
  },
  effortTitle: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
});

export type ComposerEffort = 'faster' | 'balanced' | 'smarter';
const efforts: ComposerEffort[] = ['faster', 'balanced', 'smarter'];
const effortLabel: Record<ComposerEffort, string> = {
  faster: 'Faster',
  balanced: 'Balanced',
  smarter: 'Smarter',
};

export interface PermissionMode {
  id: string;
  label: string;
}
const defaultModes: PermissionMode[] = [
  { id: 'ask', label: 'Ask before acting' },
  { id: 'auto-edit', label: 'Auto-accept edits' },
  { id: 'plan', label: 'Plan mode' },
];

export interface ComposerProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  /** Called on Enter (without Shift) or the send button. */
  onSubmit?: (value: string) => void;
  /** The agent is running: the send button becomes Stop and the border light orbits. */
  isStreaming?: boolean;
  onStop?: () => void;
  placeholder?: string;
  isDisabled?: boolean;

  models?: ModelOption[];
  model?: string;
  onModelChange?: (id: string) => void;

  effort?: ComposerEffort;
  onEffortChange?: (e: ComposerEffort) => void;
  /** Hide the Faster ↔ Smarter control. */
  hideEffort?: boolean;

  permissionModes?: PermissionMode[];
  permissionMode?: string;
  onPermissionModeChange?: (id: string) => void;
  hidePermissions?: boolean;

  attachments?: AttachmentFile[];
  onRemoveAttachment?: (id: string) => void;
  /** Files picked with the attach button. Omit to hide the button. */
  onAttach?: (files: File[]) => void;

  /** Extra controls rendered after the built-in ones. */
  actions?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Chat input: auto-growing textarea, attachments, model / permission / effort controls, send & stop. */
export function Composer({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onSubmit,
  isStreaming = false,
  onStop,
  placeholder = 'Ask anything…',
  isDisabled,
  models,
  model,
  onModelChange,
  effort: effortProp,
  onEffortChange,
  hideEffort,
  permissionModes = defaultModes,
  permissionMode: modeProp,
  onPermissionModeChange,
  hidePermissions,
  attachments = [],
  onRemoveAttachment,
  onAttach,
  actions,
  className,
  xstyle,
  ref,
}: ComposerProps) {
  const [inner, setInner] = useState(defaultValue);
  const value = valueProp ?? inner;
  const setValue = (v: string) => {
    if (valueProp === undefined) setInner(v);
    onValueChange?.(v);
  };
  const [effortInner, setEffortInner] = useState<ComposerEffort>('balanced');
  const effort = effortProp ?? effortInner;
  const [modeInner, setModeInner] = useState(permissionModes[0]?.id ?? '');
  const mode = modeProp ?? modeInner;
  const area = useRef<HTMLTextAreaElement>(null);
  const file = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const canSend = !isDisabled && (value.trim().length > 0 || attachments.length > 0);
  const submit = () => {
    if (!canSend || isStreaming) return;
    onSubmit?.(value);
    setValue('');
  };
  const currentMode = permissionModes.find((m) => m.id === mode) ?? permissionModes[0];
  const sx = stylex.props(styles.root, xstyle);

  return (
    <div ref={ref} {...mergeSx(sx, className)}>
      <ComposerLoader active={isStreaming}>
        <div {...stylex.props(styles.body)}>
          {attachments.length > 0 && (
            <ComposerAttachments files={attachments} onRemove={onRemoveAttachment} />
          )}
          <AriaTextArea
            ref={area}
            aria-label="Message"
            rows={1}
            value={value}
            placeholder={placeholder}
            disabled={isDisabled}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
            {...stylex.props(styles.area)}
          />
          <div {...stylex.props(styles.bar)}>
            {onAttach && (
              <>
                <input
                  ref={file}
                  type="file"
                  multiple
                  hidden
                  tabIndex={-1}
                  aria-hidden="true"
                  data-testid="composer-file-input"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (files.length) onAttach(files);
                    e.target.value = '';
                  }}
                />
                <Tooltip content="Attach files">
                  <IconButton
                    variant="ghost"
                    size="sm"
                    aria-label="Attach files"
                    isDisabled={isDisabled}
                    onPress={() => file.current?.click()}
                  >
                    <Paperclip size={16} aria-hidden="true" />
                  </IconButton>
                </Tooltip>
              </>
            )}
            {models && models.length > 0 && (
              <ModelSelector
                models={models}
                value={model ?? models[0]!.id}
                onChange={onModelChange}
                isDisabled={isDisabled}
              />
            )}
            {!hidePermissions && currentMode && (
              <DropdownMenu>
                <Button
                  variant="ghost"
                  size="sm"
                  isDisabled={isDisabled}
                  aria-label={`Permissions: ${currentMode.label}`}
                  startIcon={<ShieldCheck size={14} aria-hidden="true" />}
                  endIcon={<ChevronDown size={14} aria-hidden="true" />}
                >
                  {currentMode.label}
                </Button>
                <DropdownMenuContent
                  placement="top start"
                  aria-label="Permission mode"
                  selectionMode="single"
                  selectedKeys={new Set<string>([currentMode.id])}
                  onSelectionChange={(keys) => {
                    const k = [...keys][0];
                    if (k == null) return;
                    setModeInner(String(k));
                    onPermissionModeChange?.(String(k));
                  }}
                >
                  {permissionModes.map((m) => (
                    <DropdownMenuItem key={m.id} id={m.id}>
                      {m.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!hideEffort && (
              <PopoverTrigger>
                <Button
                  variant="ghost"
                  size="sm"
                  isDisabled={isDisabled}
                  aria-label={`Effort: ${effortLabel[effort]}`}
                  startIcon={<Gauge size={14} aria-hidden="true" />}
                >
                  {effortLabel[effort]}
                </Button>
                <Popover aria-label="Effort" placement="top start">
                  <div {...stylex.props(styles.effort)}>
                    <span {...stylex.props(styles.effortTitle)}>Effort</span>
                    <Slider
                      aria-label="Effort"
                      hideOutput
                      minValue={0}
                      maxValue={2}
                      step={1}
                      value={efforts.indexOf(effort)}
                      onChange={(v) => {
                        const e = efforts[v as number] ?? 'balanced';
                        setEffortInner(e);
                        onEffortChange?.(e);
                      }}
                    />
                    <div {...stylex.props(styles.effortLabels)} aria-hidden="true">
                      <span>Faster</span>
                      <span>Smarter</span>
                    </div>
                  </div>
                </Popover>
              </PopoverTrigger>
            )}
            {actions}
            <span {...stylex.props(styles.spacer)} />
            {!isStreaming && value.length > 0 && (
              <span {...stylex.props(styles.hint)}>
                <Kbd size="sm">↵</Kbd> send
              </span>
            )}
            {isStreaming ? (
              <IconButton
                size="sm"
                variant="secondary"
                aria-label="Stop generating"
                onPress={onStop}
              >
                <Square size={14} fill="currentColor" aria-hidden="true" />
              </IconButton>
            ) : (
              <IconButton
                size="sm"
                variant="primary"
                aria-label="Send message"
                isDisabled={!canSend}
                onPress={submit}
              >
                <ArrowUp size={16} aria-hidden="true" />
              </IconButton>
            )}
          </div>
        </div>
      </ComposerLoader>
    </div>
  );
}
