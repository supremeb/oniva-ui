import * as stylex from '@stylexjs/stylex';
import { MessageSquare, Plus } from 'lucide-react';
import { useState } from 'react';
import {
  AgentProgress,
  AgentThinking,
  ChatContainer,
  Composer,
  LayoutShell,
  Markdown,
  Message,
  Sidebar,
  SidebarAccount,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarSearch,
  SidebarSection,
  ToolCallCard,
  type TaskItem,
} from 'oniva-ui';
import { PageTitle } from './shared';

const styles = stylex.create({
  col: { display: 'flex', flexDirection: 'column', gap: 12, height: '100%', minHeight: 0 },
  log: { flexGrow: 1, minHeight: 0, position: 'relative' },
  composer: { marginInline: 'auto', maxWidth: 760, width: '100%' },
  stack: { display: 'flex', flexDirection: 'column', gap: 12 },
});

const models = [
  { id: 'sonnet-5', name: 'Sonnet 5', description: 'Fast and capable for everyday work' },
  { id: 'opus-5', name: 'Opus 5', description: 'Most intelligent, slower' },
];

const plan: TaskItem[] = [
  { id: '1', label: 'Query the deals table', status: 'done' },
  { id: '2', label: 'Group revenue by segment', status: 'done' },
  { id: '3', label: 'Compare against plan and Q2', status: 'done' },
  { id: '4', label: 'Write the summary', status: 'running' },
];

const answer = `## Q3 revenue: $4.82M (+14.2% QoQ)

Revenue beat the $4.55M plan by **5.9%**. Enterprise renewals drove most of the lift.

| Segment | Q2 | Q3 | Change |
|---|--:|--:|--:|
| Enterprise | $2.61M | $3.02M | +15.7% |
| Mid-market | $1.30M | $1.42M | +9.2% |
| Self-serve | $0.36M | $0.38M | +5.6% |

Self-serve churn rose to 3.1% in September, the only soft spot.`;

const threads = [
  ['Q3 revenue by segment', true],
  ['Draft the board update', false],
  ['Churn cohort analysis', false],
  ['Pricing page copy review', false],
  ['Vendor contract summary', false],
  ['Onboarding email sequence', false],
] as const;

export function AiChat() {
  const [model, setModel] = useState('sonnet-5');
  const [value, setValue] = useState('');
  return (
    <LayoutShell
      sidebar={
        <Sidebar aria-label="Conversations">
          <SidebarHeader name="Oniva Agent" />
          <SidebarSearch hint="⌘K" />
          <SidebarContent>
            <SidebarSection title="New">
              <SidebarItem href="#/templates/ai-chat" icon={<Plus size={18} />}>
                New chat
              </SidebarItem>
            </SidebarSection>
            <SidebarSection title="Recent">
              {threads.map(([t, active]) => (
                <SidebarItem
                  key={t}
                  href="#/templates/ai-chat"
                  icon={<MessageSquare size={18} />}
                  isActive={active}
                >
                  {t}
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarContent>
          <SidebarFooter>
            <SidebarAccount name="Bala R." email="bala@oniva.ai" />
          </SidebarFooter>
        </Sidebar>
      }
      header={<PageTitle title="Q3 revenue by segment" sub="Sonnet 5 · 4 tool calls" />}
    >
      <div {...stylex.props(styles.col)}>
        <div {...stylex.props(styles.log)}>
          <ChatContainer>
            <Message role="user" name="Bala" timestamp="10:42 AM">
              Analyze Q3 revenue by segment and compare it with plan.
            </Message>
            <Message role="assistant" name="Oniva" copyText="Q3 revenue closed at $4.82M.">
              <div {...stylex.props(styles.stack)}>
                <AgentThinking seconds={9}>
                  Load closed-won deals for Jul to Sep, group by segment, compare with Q2 and the
                  $4.55M plan.
                </AgentThinking>
                <AgentProgress items={plan} />
                <ToolCallCard
                  name="query_warehouse"
                  status="success"
                  duration="1.2s"
                  args={{ table: 'deals', from: '2026-07-01', to: '2026-09-30' }}
                >
                  {'412 rows · $4,820,310 total\nsegments: enterprise, mid-market, self-serve'}
                </ToolCallCard>
                <ToolCallCard
                  name="compare_to_plan"
                  status="success"
                  duration="0.4s"
                  args={{ plan: 4550000 }}
                >
                  {'+5.9% vs plan'}
                </ToolCallCard>
                <Markdown>{answer}</Markdown>
              </div>
            </Message>
            <Message role="user" name="Bala" timestamp="10:44 AM">
              Which accounts drove the enterprise lift?
            </Message>
          </ChatContainer>
        </div>
        <Composer
          xstyle={styles.composer}
          placeholder="Ask a follow-up…"
          hidePermissions
          models={models}
          model={model}
          onModelChange={setModel}
          value={value}
          onValueChange={setValue}
          onSubmit={() => setValue('')}
        />
      </div>
    </LayoutShell>
  );
}
