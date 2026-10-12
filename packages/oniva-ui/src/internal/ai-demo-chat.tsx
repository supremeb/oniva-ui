import { useEffect, useState } from 'react';
import { AgentProgress } from '../ai/AgentProgress';
import { AgentThinking } from '../ai/AgentThinking';
import { ChatContainer } from '../ai/ChatContainer';
import { Citation } from '../ai/Citation';
import { Composer } from '../ai/Composer';
import { FeedbackBar } from '../ai/FeedbackBar';
import { Markdown } from '../ai/Markdown';
import { Message } from '../ai/Message';
import { ResponseStream } from '../ai/ResponseStream';
import { ToolCallCard } from '../ai/ToolCallCard';
import { WebSearchTrail } from '../ai/WebSearchTrail';
import type { TaskItem } from '../ai/TaskList';
import { Button } from '../components/Button';

const SOURCES = [
  { title: 'SaaS growth benchmarks, Q3 2026', url: 'https://www.bvp.com/atlas/q3-2026-benchmarks' },
  { title: 'Net revenue retention by segment', url: 'https://www.saastr.com/nrr-by-segment' },
  {
    title: 'Q3 earnings roundup: software',
    url: 'https://www.reuters.com/markets/software-q3-2026',
  },
];

const ANSWER = `## Q3 2026 revenue: $4.82M (+14.2% QoQ)

Revenue beat the $4.55M plan by **5.9%**. Enterprise renewals drove most of the lift, and the median B2B SaaS peer grew about 9% this quarter [1](${SOURCES[0]!.url}).

| Segment | Q2 | Q3 | Change |
|---|--:|--:|--:|
| Enterprise | $2.61M | $3.02M | +15.7% |
| Mid-market | $1.30M | $1.42M | +9.2% |
| Self-serve | $0.36M | $0.38M | +5.6% |

**What stands out**

- Enterprise net revenue retention hit **118%**, ahead of the 112% peer median [2](${SOURCES[1]!.url}).
- Self-serve churn rose to 3.1% in September, the only soft spot.
- Peers reported similar enterprise strength this quarter [3](${SOURCES[2]!.url}).

Here is the query I used, in case you want to rerun it:

\`\`\`sql
select segment, sum(amount) as q3_revenue
from deals
where closed_at between '2026-07-01' and '2026-09-30'
group by 1
order by 2 desc;
\`\`\`
`;

const REASONING = `The user wants Q3 revenue by segment compared to benchmarks.
1. Query the deals table for closed-won amounts in Jul-Sep.
2. Compare to Q2 and the $4.55M plan.
3. Search for peer benchmarks so the comparison has context.`;

/** Timeline: phase index -> ms since start. */
const TIMELINE = [0, 500, 2600, 4200, 5600, 7400, 9000];

function statuses(phase: number): TaskItem[] {
  const labels = [
    'Query the deals table',
    'Group revenue by segment',
    'Search for peer benchmarks',
    'Compare against plan and Q2',
    'Write the summary',
  ];
  const doneCount =
    phase <= 1
      ? 0
      : phase === 2
        ? 0
        : phase === 3
          ? 2
          : phase === 4
            ? 2
            : phase === 5
              ? 3
              : phase === 6
                ? 4
                : 5;
  return labels.map((label, i) => ({
    id: String(i),
    label,
    status: i < doneCount ? 'done' : i === doneCount ? 'running' : 'pending',
  }));
}

/** Scripted, auto-playing multi-turn analysis chat used by the AI docs demos. */
export function AiChatDemo({ height = 640 }: { height?: number }) {
  const [run, setRun] = useState(0);
  return <Playback key={run} height={height} onReplay={() => setRun((r) => r + 1)} />;
}

function Playback({ height, onReplay }: { height: number; onReplay: () => void }) {
  const [phase, setPhase] = useState(0);
  const [model, setModel] = useState('sonnet-5');
  useEffect(() => {
    const ids = TIMELINE.map((ms, i) => setTimeout(() => setPhase(i + 1), ms));
    return () => ids.forEach(clearTimeout);
  }, []);
  const [streamDone, setStreamDone] = useState(false);
  const working = !(phase >= 7 && streamDone);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        height,
        width: '100%',
        maxWidth: 760,
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          border: '1px solid var(--oniva-border, #ebebeb)',
          borderRadius: 16,
        }}
      >
        <ChatContainer>
          <Message role="user" name="Bala" timestamp="10:42 AM">
            Analyze Q3 revenue by segment and compare it to industry benchmarks.
          </Message>

          {phase >= 2 && (
            <Message role="assistant" name="Oniva">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <AgentThinking isThinking={phase < 3} defaultExpanded={false}>
                  {REASONING}
                </AgentThinking>
                <AgentProgress items={statuses(phase)} defaultExpanded />
                {phase >= 3 && (
                  <ToolCallCard
                    name="query_warehouse"
                    args={{ table: 'deals', quarter: 'Q3' }}
                    status={phase >= 4 ? 'success' : 'running'}
                    duration={phase >= 4 ? '1.2s' : undefined}
                  >
                    {'412 rows · $4,820,310 total\nsegments: enterprise, mid-market, self-serve'}
                  </ToolCallCard>
                )}
                {phase >= 4 && (
                  <WebSearchTrail
                    queries={[
                      {
                        id: '1',
                        query: 'B2B SaaS Q3 2026 revenue growth benchmarks',
                        status: phase >= 5 ? 'done' : 'searching',
                        resultCount: phase >= 5 ? 8 : undefined,
                      },
                      ...(phase >= 5
                        ? [
                            {
                              id: '2',
                              query: 'net revenue retention median enterprise SaaS',
                              status: phase >= 6 ? ('done' as const) : ('searching' as const),
                              resultCount: phase >= 6 ? 6 : undefined,
                            },
                          ]
                        : []),
                    ]}
                    sources={phase >= 6 ? SOURCES : []}
                  />
                )}
                {phase >= 6 && (
                  <ResponseStream
                    text={ANSWER}
                    speed={14}
                    intervalMs={20}
                    onComplete={() => setStreamDone(true)}
                    render={(visible) => (
                      <Markdown
                        renderLink={({ href, children, text }) => {
                          const n = Number(text);
                          const src = SOURCES[n - 1];
                          return Number.isInteger(n) && src && href ? (
                            <Citation index={n} title={src.title} url={src.url} />
                          ) : (
                            <a href={href}>{children}</a>
                          );
                        }}
                      >
                        {visible}
                      </Markdown>
                    )}
                  />
                )}
                {phase >= 7 && streamDone && <FeedbackBar />}
              </div>
            </Message>
          )}
        </ChatContainer>
      </div>
      <Composer
        placeholder="Ask a follow-up…"
        models={[
          { id: 'sonnet-5', name: 'Sonnet 5', description: 'Fast and capable' },
          { id: 'opus-5', name: 'Opus 5', description: 'Most intelligent' },
        ]}
        model={model}
        onModelChange={setModel}
        isStreaming={working}
        onStop={() => setStreamDone(true)}
        onAttach={() => {}}
      />
      <div>
        <Button size="sm" variant="secondary" onPress={onReplay}>
          Replay
        </Button>
      </div>
    </div>
  );
}
