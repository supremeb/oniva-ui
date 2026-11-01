import { ChatContainer, Message, ScrollToBottomButton } from 'oniva-ui';
import type { ReactNode } from 'react';
import type { StateModule } from '../types';

const turns: { role: 'user' | 'assistant'; name: string; time: string; text: string }[] = [
  { role: 'user', name: 'Priya', time: '9:41 AM', text: 'How did Q3 revenue compare with Q2 across segments?' },
  { role: 'assistant', name: 'Atlas 2', time: '9:41 AM', text: 'Q3 revenue was $4.82M, up 12.4% on Q2. Enterprise grew 18% to $2.9M, Mid-market was flat at $1.3M and Self-serve grew 6% to $0.62M.' },
  { role: 'user', name: 'Priya', time: '9:43 AM', text: 'Which accounts drove the Enterprise growth?' },
  { role: 'assistant', name: 'Atlas 2', time: '9:43 AM', text: 'Three accounts account for 71% of the increase: Northwind Labs (+$214k), Harbor & Finch (+$168k) and Tessellate Freight (+$121k).' },
  { role: 'user', name: 'Priya', time: '9:46 AM', text: 'Any churn risk in the Mid-market group?' },
  { role: 'assistant', name: 'Atlas 2', time: '9:46 AM', text: 'Nine accounts show falling weekly usage for four weeks in a row. Combined they represent $212k in annual recurring revenue; two renew before November 30.' },
  { role: 'user', name: 'Priya', time: '9:50 AM', text: 'Draft a short note for the account team.' },
  { role: 'assistant', name: 'Atlas 2', time: '9:51 AM', text: 'Done. The note lists the nine accounts, their renewal dates and a suggested outreach order, starting with the two renewing this month.' },
];

function messages(n: number): ReactNode {
  return turns.slice(0, n).map((t, i) => (
    <Message key={i} role={t.role} name={t.name} timestamp={t.time}>
      {t.text}
    </Message>
  ));
}

const longPath =
  'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';
const longUrl =
  'https://reports.northwind.example/exports/q3-revenue-by-segment/2026/10/accounts-with-falling-usage-four-weeks-running.csv?token=abcdef0123456789abcdef0123456789';

function Frame({ height = 420, children }: { height?: number; children: ReactNode }) {
  return <div style={{ height }}>{children}</div>;
}

const many = Array.from({ length: 24 }, (_, i) => turns[i % turns.length]!);

const mod: StateModule = {
  slug: 'chat-container',
  title: 'Chat container',
  width: 720,
  groups: [
    {
      label: 'Data',
      states: [
        {
          id: 'empty',
          label: 'empty',
          render: () => (
            <Frame>
              <ChatContainer />
            </Frame>
          ),
        },
        {
          id: 'one-message',
          label: 'one message',
          render: () => (
            <Frame>
              <ChatContainer>{messages(1)}</ChatContainer>
            </Frame>
          ),
        },
        {
          id: 'fits',
          label: 'typical, fits without scrolling',
          render: () => (
            <Frame height={640}>
              <ChatContainer>{messages(4)}</ChatContainer>
            </Frame>
          ),
        },
        {
          id: 'overflow',
          label: 'long thread, pinned to latest',
          render: () => (
            <Frame>
              <ChatContainer>
                {many.map((t, i) => (
                  <Message key={i} role={t.role} name={t.name} timestamp={t.time}>
                    {t.text}
                  </Message>
                ))}
              </ChatContainer>
            </Frame>
          ),
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-unbroken',
          label: 'long path and URL',
          render: () => (
            <Frame>
              <ChatContainer>
                <Message role="user" name="Priya" timestamp="2:14 PM">
                  {`Open ${longPath} and check the retry schedule.`}
                </Message>
                <Message role="assistant" name="Atlas 2" timestamp="2:14 PM">
                  {`The export is at ${longUrl}`}
                </Message>
                <Message role="user" name="Priya" timestamp="2:15 PM">
                  {longUrl}
                </Message>
              </ChatContainer>
            </Frame>
          ),
        },
        {
          id: 'narrow',
          label: 'narrow column (320)',
          render: () => (
            <div style={{ height: 420, width: 320 }}>
              <ChatContainer>{messages(6)}</ChatContainer>
            </div>
          ),
        },
      ],
    },
    {
      label: 'Props',
      states: [
        {
          id: 'threshold-0',
          label: 'threshold 0',
          render: () => (
            <Frame>
              <ChatContainer threshold={0}>{messages(8)}</ChatContainer>
            </Frame>
          ),
        },
        {
          id: 'threshold-400',
          label: 'threshold 400',
          render: () => (
            <Frame>
              <ChatContainer threshold={400}>{messages(8)}</ChatContainer>
            </Frame>
          ),
        },
      ],
    },
    {
      label: 'Jump button',
      states: [
        {
          id: 'jump-button',
          label: 'ScrollToBottomButton alone',
          render: () => (
            <div style={{ height: 120, position: 'relative' }}>
              <ScrollToBottomButton onPress={() => undefined} />
            </div>
          ),
        },
      ],
    },
  ],
  missing: [
    'Scrolled-away state with the jump button (needs a user scroll; no prop exposes it)',
    'Streaming / loading (the container renders only its children; no status prop)',
  ],
};
export default mod;
