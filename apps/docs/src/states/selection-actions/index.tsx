import { SelectionActions, LanguagesIcon, ListMinusIcon, SpellCheckIcon, SparklesIcon } from 'oniva-ui';
import type { SelectionAction, SelectionRewrite } from 'oniva-ui';
import type { ReactNode } from 'react';
import type { StateModule } from '../types';

/** The pill floats below the selection (out of flow), so the frame needs room under the text to show it. */
const Room = ({ children }: { children: ReactNode }) => (
  <div style={{ paddingBlockEnd: 72 }}>{children}</div>
);

const icon = (Icon: typeof SparklesIcon) => <Icon size={16} aria-hidden="true" />;

const four: SelectionAction[] = [
  { id: 'improve', label: 'Improve', icon: icon(SparklesIcon), pendingLabel: 'Improving…' },
  { id: 'shorten', label: 'Shorten', icon: icon(ListMinusIcon), pendingLabel: 'Shortening…' },
  { id: 'tone', label: 'Tone', icon: icon(LanguagesIcon), pendingLabel: 'Changing tone…' },
  { id: 'grammar', label: 'Grammar', icon: icon(SpellCheckIcon), pendingLabel: 'Fixing grammar…' },
];

const plain: SelectionAction[] = [
  { id: 'improve', label: 'Improve' },
  { id: 'shorten', label: 'Shorten' },
  { id: 'tone', label: 'Tone' },
  { id: 'grammar', label: 'Grammar' },
];

const many: SelectionAction[] = [
  ...four,
  { id: 'translate', label: 'Translate to German', icon: icon(LanguagesIcon) },
  { id: 'expand', label: 'Expand with examples', icon: icon(SparklesIcon) },
  { id: 'bullets', label: 'Turn into bullet points', icon: icon(ListMinusIcon) },
  { id: 'cite', label: 'Add citations', icon: icon(SpellCheckIcon) },
];

const text =
  'Pistachio holds the top slot all weekend. Churn it first thing Saturday so the batch has time to firm up before the afternoon rush.';
const long =
  'The Northwind Labs quarterly review covers three themes. First, the retry scheduler now backs off with decorrelated jitter, which cut duplicate deliveries by 38% across the eu-west and us-east regions during the March load test. Second, the audit log export moved from a nightly job to a streaming pipeline, so compliance teams see changes within about 40 seconds instead of the next morning. Third, the onboarding checklist was rebuilt around the five questions new admins ask most often, and median time to first deployment dropped from 4 days to 1.5 days.';
const unbroken =
  'Config lives in packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts and the dashboard at https://status.northwind.example/regions/eu-west-1/queues/retry-scheduler/overview?window=24h&group=worker.';

const noop: SelectionRewrite = (req) => req.text;

const at = (src: string, needle: string, end?: string) => {
  const start = src.indexOf(needle);
  return { start, end: end ? src.indexOf(end) + end.length : start + needle.length };
};

const mod: StateModule = {
  slug: 'selection-actions',
  title: 'Selection actions',
  width: 560,
  groups: [
    {
      label: 'Selection',
      states: [
        {
          id: 'no-selection',
          label: 'no selection',
          render: () => (
            <Room>
              <SelectionActions defaultText={text} actions={four} rewrite={noop} />
            </Room>
          ),
        },
        {
          id: 'selected',
          label: 'selected, more collapsed',
          render: () => (
            <Room>
              <SelectionActions
                defaultText={text}
                defaultSelection={{ start: text.indexOf('Churn'), end: text.length }}
                actions={four}
                rewrite={noop}
              />
            </Room>
          ),
        },
        {
          id: 'selected-start',
          label: 'selection at the start of the text',
          render: () => (
            <Room>
              <SelectionActions
                defaultText={text}
                defaultSelection={{ start: 0, end: 9 }}
                actions={four}
                rewrite={noop}
              />
            </Room>
          ),
        },
        {
          id: 'selected-end',
          label: 'selection at the end of the text',
          render: () => (
            <Room>
              <SelectionActions
                defaultText={text}
                defaultSelection={at(text, 'afternoon rush.')}
                actions={four}
                rewrite={noop}
              />
            </Room>
          ),
        },
        {
          id: 'selected-multiline',
          label: 'selection across several lines',
          render: () => (
            <Room>
              <SelectionActions
                defaultText={long}
                defaultSelection={at(long, 'Second,', 'next morning.')}
                actions={four}
                rewrite={noop}
              />
            </Room>
          ),
        },
        {
          id: 'selected-unbroken',
          label: 'long path and URL selected',
          render: () => (
            <Room>
              <SelectionActions
                defaultText={unbroken}
                defaultSelection={at(unbroken, 'packages/', 'worker.ts')}
                actions={four}
                rewrite={noop}
              />
            </Room>
          ),
        },
      ],
    },
    {
      label: 'Actions',
      states: [
        {
          id: 'actions-all-visible',
          label: 'all actions visible, no chevron',
          render: () => (
            <Room>
              <SelectionActions
                defaultText={text}
                defaultSelection={at(text, 'Churn it first thing Saturday')}
                actions={four}
                visibleActions={4}
                rewrite={noop}
              />
            </Room>
          ),
        },
        {
          id: 'actions-two',
          label: 'two actions, no chevron',
          render: () => (
            <Room>
              <SelectionActions
                defaultText={text}
                defaultSelection={at(text, 'Churn it first thing Saturday')}
                actions={four.slice(0, 2)}
                rewrite={noop}
              />
            </Room>
          ),
        },
        {
          id: 'actions-one',
          label: 'one action',
          render: () => (
            <Room>
              <SelectionActions
                defaultText={text}
                defaultSelection={at(text, 'Churn it first thing Saturday')}
                actions={four.slice(0, 1)}
                rewrite={noop}
              />
            </Room>
          ),
        },
        {
          id: 'actions-none',
          label: 'no actions, instruction field only',
          render: () => (
            <Room>
              <SelectionActions
                defaultText={text}
                defaultSelection={at(text, 'Churn it first thing Saturday')}
                actions={[]}
                rewrite={noop}
              />
            </Room>
          ),
        },
        {
          id: 'actions-no-icons',
          label: 'text-only actions',
          render: () => (
            <Room>
              <SelectionActions
                defaultText={text}
                defaultSelection={at(text, 'Churn it first thing Saturday')}
                actions={plain}
                rewrite={noop}
              />
            </Room>
          ),
        },
        {
          id: 'actions-many',
          label: 'eight actions, long labels',
          render: () => (
            <Room>
              <SelectionActions
                defaultText={long}
                defaultSelection={at(long, 'Third,', '1.5 days.')}
                actions={many}
                visibleActions={3}
                rewrite={noop}
              />
            </Room>
          ),
        },
        {
          id: 'placeholder',
          label: 'custom placeholder',
          render: () => (
            <Room>
              <SelectionActions
                defaultText={text}
                defaultSelection={at(text, 'Churn it first thing Saturday')}
                actions={four}
                placeholder="Tell Atlas 2 what to change"
                rewrite={noop}
              />
            </Room>
          ),
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'empty-text',
          label: 'empty text',
          render: () => (
            <Room>
              <SelectionActions
                defaultText=""
                defaultSelection={{ start: 0, end: 4 }}
                actions={four}
                rewrite={noop}
              />
            </Room>
          ),
        },
        {
          id: 'short-text',
          label: 'one short word selected',
          render: () => (
            <Room>
              <SelectionActions
                defaultText="Churn it."
                defaultSelection={{ start: 0, end: 5 }}
                actions={four}
                rewrite={noop}
              />
            </Room>
          ),
        },
        {
          id: 'long-text',
          label: 'long text, no selection',
          render: () => (
            <Room>
              <SelectionActions defaultText={long} actions={four} rewrite={noop} />
            </Room>
          ),
        },
      ],
    },
  ],
  missing: [
    'running (progress pill with spinner, caret and streamed text): only reachable by pressing an action; the component has no prop to start in it',
    'settled (highlight flash after an applied edit): only reachable after a rewrite completes',
    'instruction typed (arrow send button): only reachable by typing in the field',
    'more actions expanded: only reachable by pressing the chevron',
    'rewrite error: the component silently cancels back to idle; there is no error UI',
  ],
};

export default mod;
