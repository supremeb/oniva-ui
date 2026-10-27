import * as stylex from '@stylexjs/stylex';
import { BarChart3, Mail, Search } from 'lucide-react';
import { useEffect, useRef, useState, type Ref } from 'react';
import { AgentAvatar } from '../../ai/AgentAvatar';
import { type AgentStatus } from '../../ai/AgentStatusPill';
import { ChatContainer } from '../../ai/ChatContainer';
import { Composer } from '../../ai/Composer';
import { Message } from '../../ai/Message';
import { ToolCallCard } from '../../ai/ToolCallCard';
import { Button } from '../../components/Button';
import { Heading } from '../../components/Heading';
import { Radio, RadioGroup } from '../../components/RadioGroup';
import { Input } from '../../components/Input';
import { Text } from '../../components/Text';
import { Textarea } from '../../components/Textarea';
import { ScreenFrame, type ScreenUser } from '../../internal/s2-screen-frame';
import { m8, step } from '../../internal/m8-motion';
import { CrossFade } from '../../motion/CrossFade';
import { Presence } from '../../motion/Presence/Presence';
import { Shimmer } from '../../motion/Shimmer';
import { colors } from '../../tokens/colors.stylex';
import { radius } from '../../tokens/radius.stylex';

const STACK = '@container (max-width: 760px)';

const styles = stylex.create({
  wrap: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    containerType: 'inline-size',
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(0, 1fr) 280px', [STACK]: 'minmax(0, 1fr)' },
    minWidth: 0,
    overflow: 'hidden',
  },
  chat: { display: 'flex', flexDirection: 'column', height: 640, minHeight: 0, minWidth: 0 },
  chatBody: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    gap: 16,
    minHeight: 0,
    paddingBlock: 20,
    paddingInline: 24,
  },
  composer: { flexShrink: 0, paddingBlock: 0, paddingInline: 24, paddingBottom: 16 },
  working: { display: 'flex', flexDirection: 'column', gap: 8 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8, listStyle: 'none', margin: 0, padding: 0 },
  chip: {
    alignItems: 'center',
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'inline-flex',
    gap: 6,
    minWidth: 0,
    paddingBlock: 2,
    paddingInline: 8,
  },
  side: {
    borderColor: colors['--oniva-color-border'],
    borderInlineStartStyle: { default: 'solid', [STACK]: 'none' },
    borderInlineStartWidth: 1,
    borderTopStyle: { default: 'none', [STACK]: 'solid' },
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  sideHead: {
    alignItems: 'center',
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    flexShrink: 0,
    minHeight: 48,
    paddingInline: 16,
  },
  block: {
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 16,
  },
  h: { margin: 0 },
  foot: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    marginTop: 'auto',
    padding: 16,
  },
  saved: { display: 'block', minHeight: 20 },
});

export interface AgentChatAgent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  task: string;
}

export interface AgentChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export const NORTHWIND_AGENTS: AgentChatAgent[] = [
  { id: 'a1', name: 'Scout', role: 'Research', status: 'working', task: 'Comparing three renewal offers' },
  { id: 'a2', name: 'Ledger', role: 'Finance', status: 'idle', task: 'Waiting for the Q3 export' },
  { id: 'a3', name: 'Quill', role: 'Writing', status: 'waiting', task: 'Needs approval on the draft' },
];

const INITIAL: AgentChatMessage[] = [
  { id: 'm1', role: 'user', text: 'Prepare a renewal brief for Harbor & Vale. Their contract ends Nov 3.' },
  {
    id: 'm2',
    role: 'assistant',
    text: 'On it. I asked Scout to pull usage and support history, and Quill to draft the outline. I will fill in the brief on the right as results arrive.',
  },
];

export interface AgentChatScreenProps {
  /** Agents shown in the "Agents at work" list. */
  agents?: AgentChatAgent[];
  /** Initial conversation (uncontrolled). */
  defaultMessages?: AgentChatMessage[];
  workspace?: string;
  user?: ScreenUser;
  /** Called with the label of a sidebar item. */
  onNavigate?: (label: string) => void;
  /** Called with the text of a message the person sends. */
  onSend?: (text: string) => void;
  /** Called with the brief fields when "Save brief" is pressed. */
  onSaveBrief?: (brief: { title: string; notes: string }) => void;
  /** Render the title as h2 when the screen sits inside a page that already has an h1. */
  headingLevel?: 1 | 2;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Chat with an orchestrating agent, the agents at work, and a brief to fill in beside it. */
export function AgentChatScreen({
  agents = NORTHWIND_AGENTS,
  defaultMessages = INITIAL,
  workspace = 'Northwind Labs',
  user = { name: 'Alex Morgan' },
  onNavigate,
  onSend,
  onSaveBrief,
  headingLevel = 1,
  className,
  xstyle,
  ref,
}: AgentChatScreenProps) {
  const [messages, setMessages] = useState(defaultMessages);
  const [draft, setDraft] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [title, setTitle] = useState('Harbor & Vale renewal');
  const [notes, setNotes] = useState('Usage is up 18% since May. Two open support tickets. Ask about the second workspace.');
  const [saved, setSaved] = useState(false);
  const [approach, setApproach] = useState('value');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const sub = (headingLevel + 1) as 2 | 3;

  const send = (text: string) => {
    const t = text.trim();
    if (!t || streaming) return;
    const id = `m${Date.now()}`;
    setMessages((m) => [...m, { id, role: 'user', text: t }]);
    setDraft('');
    setStreaming(true);
    onSend?.(t);
    timer.current = window.setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: `${id}-r`, role: 'assistant', text: 'Got it. I added that to the brief and asked Quill to update the draft.' },
      ]);
      setStreaming(false);
    }, 900);
  };

  return (
    <ScreenFrame
      ref={ref}
      className={className}
      xstyle={xstyle}
      workspace={workspace}
      user={user}
      active="Agents"
      title="Renewal brief"
      headingLevel={headingLevel}
      onNavigate={onNavigate}
    >
      <div {...stylex.props(styles.wrap)}>
        <section aria-label="Conversation" {...stylex.props(styles.chat)}>
          <ChatContainer role="log" aria-label="Messages" aria-live="polite" xstyle={styles.chatBody}>
            {messages.map((m) => (
              <Message key={m.id} role={m.role} name={m.role === 'user' ? user.name : 'Orchestrator'} copyText={m.text} xstyle={m8.rise}>
                {m.text}
              </Message>
            ))}
            <ToolCallCard
              xstyle={m8.rise}
              name="query_usage"
              icon={<BarChart3 size={13} />}
              summary="Pulled 12 months of usage"
              status="success"
              durationMs={1180}
              args={{ account: 'harbor-vale', months: 12 }}
              result={{ seats: 240, active_rate: 0.82, growth: 0.18 }}
            />
            <ToolCallCard
              xstyle={m8.rise}
              name="search_tickets"
              icon={<Search size={13} />}
              summary="Found 2 open support tickets"
              status="success"
              durationMs={640}
              args={{ account: 'harbor-vale', status: 'open' }}
              result={{ count: 2 }}
            />
            <ToolCallCard
              xstyle={m8.rise}
              name="draft_email"
              icon={<Mail size={13} />}
              summary={streaming ? 'Updating the draft…' : 'Drafted the renewal email'}
              status={streaming ? 'running' : 'success'}
              args={{ to: 'ops@harborvale.example', template: 'renewal' }}
            />
            <Presence isPresent={streaming} preset="slide" initial={false} aria-hidden={!streaming}>
              <Text tone="muted" variant="caption">
                <Shimmer>Orchestrator is writing…</Shimmer>
              </Text>
            </Presence>
            <section aria-labelledby="s2-agents" {...stylex.props(styles.working)}>
              <Text id="s2-agents" tone="muted" variant="caption">
                Agents at work
              </Text>
              <ul {...stylex.props(styles.chips)}>
                {agents.map((a, ai) => (
                  <li key={a.id} style={step(ai)} title={a.task} {...stylex.props(styles.chip, m8.rise)}>
                    <AgentAvatar name={a.name} status={a.status} size={20} />
                    <Text variant="caption">
                      {a.name} · {a.role}
                    </Text>
                  </li>
                ))}
              </ul>
            </section>
          </ChatContainer>
          <div {...stylex.props(styles.composer)}>
            <Composer
              value={draft}
              onValueChange={setDraft}
              onSubmit={send}
              isStreaming={streaming}
              onStop={() => {
                window.clearTimeout(timer.current);
                setStreaming(false);
              }}
              placeholder="Ask the orchestrator…"
              hideEffort
              hidePermissions
            />
          </div>
        </section>
        <form
          aria-labelledby="s2-brief"
          {...stylex.props(styles.side)}
          onSubmit={(e) => {
            e.preventDefault();
            setSaved(true);
            onSaveBrief?.({ title, notes });
          }}
        >
          <div {...stylex.props(styles.sideHead)}>
            <Heading id="s2-brief" level={sub} variant="headline" xstyle={styles.h}>
              Brief
            </Heading>
          </div>
          <div {...stylex.props(styles.block)}>
            <Input
              label="Title"
              value={title}
              onChange={(v) => {
                setTitle(v);
                setSaved(false);
              }}
            />
            <Textarea
              label="Notes"
              rows={4}
              value={notes}
              onChange={(v) => {
                setNotes(v);
                setSaved(false);
              }}
            />
          </div>
          <div {...stylex.props(styles.block)}>
            <RadioGroup label="Approach" value={approach} onChange={setApproach}>
              <Radio value="value" description="Lead with the 18% usage growth">
                Value-led
              </Radio>
              <Radio value="risk" description="Address the two open tickets first">
                Risk-first
              </Radio>
              <Radio value="expand" description="Pitch the second workspace">
                Expansion
              </Radio>
            </RadioGroup>
          </div>
          <div {...stylex.props(styles.block)}>
            <Text tone="muted" variant="caption">
              Recipients
            </Text>
            <ul {...stylex.props(styles.chips)}>
              {['Ops lead', 'Finance', 'Account owner'].map((r) => (
                <li key={r} {...stylex.props(styles.chip)}>
                  <Text variant="caption">{r}</Text>
                </li>
              ))}
            </ul>
          </div>
          <div {...stylex.props(styles.foot)}>
            <Text tone="muted" variant="caption" xstyle={styles.saved}>
              <span role="status">
                <CrossFade as="span" contentKey={saved ? 'saved' : 'idle'} duration={200} blur={2}>
                  {saved ? 'Brief saved' : ''}
                </CrossFade>
              </span>
            </Text>
            <Button type="submit" size="sm">
              Save brief
            </Button>
          </div>
        </form>
      </div>
    </ScreenFrame>
  );
}
