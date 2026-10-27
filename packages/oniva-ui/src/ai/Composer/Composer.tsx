import * as stylex from '@stylexjs/stylex';
import { ArrowUp, ChevronDown, Gauge, Hand, Mic, Paperclip, Plus, ShieldCheck, Square } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type Ref } from 'react';
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
import { ModelSelector, type ModelEffort, type ModelOption } from '../ModelSelector';
import { mergeSx } from '../../internal/sx';
import { m3 } from '../../internal/m3-motion';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { CrossFade } from '../../motion/CrossFade';
import { Presence } from '../../motion/Presence';

const styles = stylex.create({
  root: { containerType: 'inline-size', fontFamily: font['--oniva-font-sans'], width: '100%' },
  micWrap: { display: 'inline-flex', position: 'relative' },
  traceWrap: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'inline-flex', marginInlineEnd: 4 },
  micOn: { backgroundColor: colors['--oniva-color-text'], color: colors['--oniva-color-bg'] },
  sr: { borderWidth: 0, clip: 'rect(0 0 0 0)', height: 1, margin: -1, overflow: 'hidden', padding: 0, position: 'absolute', whiteSpace: 'nowrap', width: 1 },
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
  barTray: { gap: 6 },
  bodyTray: { gap: 6, paddingBlock: 14, paddingInline: 16 },
  areaTray: { fontSize: font['--oniva-font-size-16'], minHeight: 36, paddingInline: 0 },
  footer: {
    alignItems: 'center',
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-14'],
    gap: 8,
    paddingBlock: 10,
    paddingInline: 16,
  },
  spacer: { flexGrow: 1 },
  hintWrap: { display: 'inline-flex' },
  hint: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: { default: 'inline-flex', '@container (max-width: 340px)': 'none' },
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

type SpeechRec = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

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
  /** Extended thinking / web search / effort switches inside the model menu (see ModelSelector). */
  thinking?: boolean;
  onThinkingChange?: (on: boolean) => void;
  webSearch?: boolean;
  onWebSearchChange?: (on: boolean) => void;
  modelEffort?: ModelEffort;
  onModelEffortChange?: (effort: ModelEffort) => void;

  /** Shows a mic button. Uses browser speech recognition when available, otherwise types the sample take word by word. */
  showMic?: boolean;
  /** Sample sentence for simulated dictation. */
  dictation?: string;

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

  /**
   * `default`: controls in one toolbar row. `tray`: roomy single-line prompt, plus-button attach, outlined permission pill,
   * effort picker pushed to the right, and an optional `footer` strip below a hairline.
   */
  variant?: 'default' | 'tray';
  /** Strip under the toolbar, inside the card (e.g. a "Connect apps" row). Best with `variant="tray"`. */
  footer?: ReactNode;
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
  thinking,
  onThinkingChange,
  webSearch,
  onWebSearchChange,
  modelEffort,
  onModelEffortChange,
  showMic,
  dictation = 'Summarize the open invoices for October and flag anything overdue.',
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
  variant = 'default',
  footer,
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
  const [listening, setListening] = useState(false);
  const [sendCount, setSendCount] = useState(0);
  const stopMic = useRef<(() => void) | null>(null);
  useEffect(() => () => stopMic.current?.(), []);
  const toggleMic = () => {
    if (listening) {
      stopMic.current?.();
      stopMic.current = null;
      setListening(false);
      return;
    }
    const base = value ? value.trimEnd() + ' ' : '';
    setListening(true);
    const w = window as unknown as { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec };
    const Rec = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (Rec) {
      const r = new Rec();
      r.continuous = true;
      r.interimResults = true;
      r.lang = document.documentElement.lang || navigator.language;
      r.onresult = (e) => setValue(base + Array.from(e.results).map((x) => x[0]?.transcript ?? '').join(' '));
      r.onend = () => setListening(false);
      stopMic.current = () => { r.onend = null; r.stop(); };
      r.start();
    } else {
      const words = dictation.split(' ');
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        setValue(base + words.slice(0, i).join(' '));
        if (i >= words.length) {
          clearInterval(id);
          stopMic.current = null;
          setListening(false);
        }
      }, 130);
      stopMic.current = () => clearInterval(id);
    }
  };
  const file = useRef<HTMLInputElement>(null);
  // Keep the last attachments mounted while the tray folds closed.
  const lastFiles = useRef(attachments);
  if (attachments.length > 0) lastFiles.current = attachments;
  const shownFiles = attachments.length > 0 ? attachments : lastFiles.current;

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
    setSendCount((n) => n + 1);
    setValue('');
  };
  const currentMode = permissionModes.find((m) => m.id === mode) ?? permissionModes[0];
  const sx = stylex.props(styles.root, xstyle);
  const tray = variant === 'tray';
  const effortEl = (
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
    );

  return (
    <div ref={ref} {...mergeSx(sx, className)}>
      <ComposerLoader active={isStreaming}>
        <div
          {...stylex.props(styles.body, tray && styles.bodyTray)}
          onClick={(e) => {
            if (e.target === e.currentTarget) area.current?.focus();
          }}
        >
          <AnimatedHeight isOpen={attachments.length > 0}>
            {shownFiles.length > 0 && <ComposerAttachments files={shownFiles} onRemove={onRemoveAttachment} />}
          </AnimatedHeight>
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
            {...stylex.props(styles.area, tray && styles.areaTray)}
          />
          <div {...stylex.props(styles.bar, tray && styles.barTray)}>
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
                    {tray ? <Plus size={18} aria-hidden="true" /> : <Paperclip size={16} aria-hidden="true" />}
                  </IconButton>
                </Tooltip>
              </>
            )}
            {models && models.length > 0 && (
              <ModelSelector
                models={models}
                value={model ?? models[0]!.id}
                onChange={onModelChange}
                thinking={thinking}
                onThinkingChange={onThinkingChange}
                webSearch={webSearch}
                onWebSearchChange={onWebSearchChange}
                effort={modelEffort}
                onEffortChange={onModelEffortChange}
                isDisabled={isDisabled}
              />
            )}
            {!hidePermissions && currentMode && (
              <DropdownMenu>
                <Button
                  variant={tray ? 'secondary' : 'ghost'}
                  size="sm"
                  isDisabled={isDisabled}
                  aria-label={`Permission mode: ${currentMode.label}`}
                  startIcon={tray ? <Hand size={14} aria-hidden="true" /> : <ShieldCheck size={14} aria-hidden="true" />}
                  endIcon={tray ? undefined : <ChevronDown size={14} aria-hidden="true" />}
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
            {!hideEffort && !tray && effortEl}
            {actions}
            <span {...stylex.props(styles.spacer)} />
            {!hideEffort && tray && effortEl}
            {showMic && !isStreaming && (
              <>
                {listening && <span aria-hidden="true" {...stylex.props(styles.traceWrap)}><span {...stylex.props(m3.trace)} /></span>}
                <span {...stylex.props(styles.micWrap)}>
                  {listening && <span aria-hidden="true" {...stylex.props(m3.ring)} />}
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label={listening ? 'Stop dictation' : 'Start dictation'}
                    aria-pressed={listening}
                    isDisabled={isDisabled}
                    onPress={toggleMic}
                    xstyle={listening ? styles.micOn : undefined}
                  >
                    <Mic size={16} aria-hidden="true" />
                  </IconButton>
                </span>
              </>
            )}
            <Presence isPresent={!isStreaming && value.length > 0} preset="fade" initial={false} xstyle={styles.hintWrap}>
              <span {...stylex.props(styles.hint)}>
                <Kbd size="sm">↵</Kbd> send
              </span>
            </Presence>
            {isStreaming ? (
              <IconButton
                size="sm"
                variant="secondary"
                aria-label="Stop generating"
                onPress={onStop}
              >
                <CrossFade as="span" contentKey="stop" duration={200}>
                  <Square size={14} fill="currentColor" aria-hidden="true" />
                </CrossFade>
              </IconButton>
            ) : (
              <IconButton
                size="sm"
                variant="primary"
                aria-label="Send message"
                isDisabled={!canSend}
                onPress={submit}
              >
                <CrossFade as="span" contentKey="send" duration={200}>
                  <ArrowUp key={sendCount} size={16} aria-hidden="true" {...stylex.props(sendCount > 0 && m3.launch)} />
                </CrossFade>
              </IconButton>
            )}
          </div>
        </div>
        {footer && <div {...stylex.props(styles.footer)}>{footer}</div>}
      </ComposerLoader>
      <span role="status" aria-live="polite" {...stylex.props(styles.sr)}>
        {isStreaming ? 'Generating response' : listening ? 'Listening' : ''}
      </span>
    </div>
  );
}
