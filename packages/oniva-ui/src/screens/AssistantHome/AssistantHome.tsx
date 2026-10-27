import * as stylex from '@stylexjs/stylex';
import { Button as AriaButton } from 'react-aria-components';
import { BarChart3, BookOpen, FileText, FolderOpen, Image, Presentation, Table2, Telescope, UserPlus } from 'lucide-react';
import { useState, type Ref } from 'react';
import { focus } from '../../internal/focus';
import { NORTHWIND_PROJECTS, NORTHWIND_WHATS_NEW } from '../../internal/s1-frame';
import { m8, step } from '../../internal/m8-motion';
import { TextReveal } from '../../motion/TextReveal';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { Composer } from '../../ai/Composer';
import { Button } from '../../components/Button';
import { AppShell, type AppShellProps } from '../AppShell';

const styles = stylex.create({
  page: {
    alignItems: 'center',
    boxSizing: 'border-box',
    containerType: 'inline-size',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    justifyContent: 'center',
    minHeight: '100%',
    paddingBlock: 32,
    paddingInline: 16,
  },
  inner: { display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560, width: '100%' },
  greeting: {
    color: colors['--oniva-color-text'],
    fontSize: { default: font['--oniva-font-size-20'], '@container (max-width: 480px)': font['--oniva-font-size-18'] },
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-32'],
    margin: 0,
    marginBlockEnd: 8,
    textAlign: 'center',
    textWrap: 'balance',
  },
  meta: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: font['--oniva-font-size-12'],
    gap: 8,
    justifyContent: 'space-between',
    paddingInline: 8,
  },
  metaBtn: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-12'],
    gap: 6,
    padding: 4,
  },
  apps: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  appMark: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-sm'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-11'],
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  suggestions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    listStyle: 'none',
    margin: 0,
    marginBlockStart: 8,
    padding: 0,
  },
  chip: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: colors['--oniva-color-surface'], ':hover': colors['--oniva-color-surface-hover'] },
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-12'],
    gap: 6,
    paddingBlock: 6,
    paddingInline: 12,
  },
  chipIcon: { color: colors['--oniva-color-text-muted'], display: 'inline-flex', flexShrink: 0 },
});

const MODELS = [
  { id: 'nova-pro', name: 'Nova Pro', description: 'Fast and capable for everyday work' },
  { id: 'atlas-2', name: 'Atlas 2', description: 'Most capable, slower' },
  { id: 'lumen-fast', name: 'Lumen Fast', description: 'Lightweight and instant' },
];
const DEFAULT_SUGGESTIONS = [
  'Summarize last week’s support tickets',
  'Draft a launch announcement',
  'Create a pricing comparison table',
  'Plan the Q3 campaign',
  'Visualize signups by channel',
  'Research competitor onboarding',
  'Generate a hero image',
];
const CHIP_ICONS = [BookOpen, FileText, Presentation, Table2, Image, Telescope, BarChart3];
const DEFAULT_APPS = ['Mail', 'Chat', 'Docs', 'Calendar'];

export interface AssistantHomeProps extends Omit<AppShellProps, 'children' | 'title' | 'panel'> {
  /** Greeting above the prompt box. Default depends on the time of day. */
  greeting?: string;
  suggestions?: string[];
  /** Names of connected apps shown as small marks next to "Connect apps". */
  apps?: string[];
  /** Called with the prompt text when it is sent. */
  onSubmit?: (value: string) => void;
  onConnectApps?: () => void;
  onInvite?: () => void;
  /** Called when "Work in a folder" is pressed. */
  onPickFolder?: () => void;
  /** Called with the label of a suggestion that was chosen (it also fills the prompt box). */
  onSuggestion?: (label: string) => void;
  ref?: Ref<HTMLDivElement>;
}

function defaultGreeting() {
  const h = new Date().getHours();
  const part = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening';
  return `Good ${part}! What’s next on your list?`;
}

/** AI assistant start page: greeting, prompt box with tools, connected apps and suggestions inside the app shell. */
export function AssistantHome({
  greeting,
  suggestions = DEFAULT_SUGGESTIONS,
  apps = DEFAULT_APPS,
  onSubmit,
  onConnectApps,
  onInvite,
  onPickFolder,
  onSuggestion,
  headingLevel = 1,
  active = 'New chat',
  projects = NORTHWIND_PROJECTS,
  whatsNew = NORTHWIND_WHATS_NEW,
  actions,
  ...shell
}: AssistantHomeProps) {
  const [value, setValue] = useState('');
  const [model, setModel] = useState('nova-pro');
  const H = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <AppShell
      {...shell}
      headingLevel={headingLevel}
      active={active}
      projects={projects}
      whatsNew={whatsNew}
      actions={
        actions ?? (
          <Button variant="ghost" size="sm" startIcon={<UserPlus size={14} />} onPress={onInvite}>
            Invite people
          </Button>
        )
      }
    >
      <div {...stylex.props(styles.page)}>
        <div {...stylex.props(styles.inner)}>
          <H {...stylex.props(styles.greeting)}>
            <TextReveal text={greeting ?? defaultGreeting()} staggerMs={45} />
          </H>
          <div {...stylex.props(m8.rise)} style={step(3)}>
          <Composer
            value={value}
            onValueChange={setValue}
            onSubmit={(v) => {
              onSubmit?.(v);
              setValue('');
            }}
            placeholder="Help me brainstorm ideas for…"
            models={MODELS}
            model={model}
            onModelChange={setModel}
            hideEffort
            hidePermissions
          />
          </div>
          <div {...stylex.props(styles.meta, m8.rise)} style={step(4)}>
            <AriaButton onPress={() => onPickFolder?.()} {...stylex.props(styles.metaBtn, focus.ring)}>
              <FolderOpen size={14} aria-hidden="true" />
              Work in a folder
            </AriaButton>
            <AriaButton onPress={() => onConnectApps?.()} {...stylex.props(styles.metaBtn, focus.ring)}>
              Connect apps
              <span aria-hidden="true" {...stylex.props(styles.apps)}>
                {apps.map((a, ai) => (
                  <span key={a} {...stylex.props(styles.appMark, m8.pop)} style={{ animationDelay: `${300 + ai * 50}ms` }}>
                    {a.slice(0, 1)}
                  </span>
                ))}
              </span>
            </AriaButton>
          </div>
          <ul aria-label="Suggestions" {...stylex.props(styles.suggestions, m8.rise)} style={step(5)}>
            {suggestions.map((label, li) => {
              const Icon = CHIP_ICONS[li % CHIP_ICONS.length]!;
              return (
                <li key={label}>
                  <AriaButton
                    onPress={() => {
                      setValue(label);
                      onSuggestion?.(label);
                    }}
                    {...stylex.props(styles.chip, focus.ring)}
                  >
                    <span aria-hidden="true" {...stylex.props(styles.chipIcon)}>
                      <Icon size={13} />
                    </span>
                    {label}
                  </AriaButton>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}
