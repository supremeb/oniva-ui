import { LanguagesIcon, ListMinusIcon, SpellCheckIcon, SparklesIcon } from '../../icons/IconSet';
import type { DemoModule } from '../../internal/demo';
import { SelectionActions, type SelectionAction, type SelectionRewrite } from './SelectionActions';

const text = 'Pistachio holds the top slot all weekend. Churn it first thing Saturday so the batch has time to firm up before the afternoon rush.';
const start = text.indexOf('Churn');

const actions: SelectionAction[] = [
  { id: 'improve', label: 'Improve', icon: <SparklesIcon size={16} aria-hidden="true" />, pendingLabel: 'Improving…' },
  { id: 'shorten', label: 'Shorten', icon: <ListMinusIcon size={16} aria-hidden="true" />, pendingLabel: 'Shortening…' },
  { id: 'tone', label: 'Tone', icon: <LanguagesIcon size={16} aria-hidden="true" />, pendingLabel: 'Changing tone…' },
  { id: 'grammar', label: 'Grammar', icon: <SpellCheckIcon size={16} aria-hidden="true" />, pendingLabel: 'Fixing grammar…' },
];

const canned: Record<string, string> = {
  improve: 'Churn pistachio first thing Saturday so the batch has time to fully firm up before the afternoon rush.',
  shorten: 'Churn it Saturday morning so it sets before the rush.',
  tone: 'Let’s churn it first thing Saturday, so the batch is perfectly firm before the afternoon crowd arrives.',
  grammar: 'Churn it first thing on Saturday so that the batch has time to firm up before the afternoon rush.',
};

/** A fake agent: a string result is streamed word by word by the component. */
const rewrite: SelectionRewrite = async ({ actionId, instruction, text: passage }) => {
  await new Promise((r) => setTimeout(r, 700));
  if (actionId === 'custom') return `${passage.replace(/\.$/, '')}, ${instruction?.toLowerCase().replace(/\.$/, '')}.`;
  return canned[actionId] ?? passage;
};

/** Same thing as a real stream of chunks. */
const streamed: SelectionRewrite = ({ actionId, text: passage }) =>
  (async function* () {
    await new Promise((r) => setTimeout(r, 500));
    for (const chunk of (canned[actionId] ?? passage).match(/.{1,9}/g) ?? []) {
      yield chunk;
      await new Promise((r) => setTimeout(r, 70));
    }
  })();

const demo: DemoModule = {
  meta: {
    title: 'Selection actions',
    slug: 'selection-actions',
    category: 'AI & Agent',
    description: 'Highlight a passage and hand it to the agent to rewrite. A floating pill offers quick actions and a free-form instruction, then streams the new text into place.',
  },
  demos: [
    {
      name: 'Rewrite a passage',
      code: `<SelectionActions
  defaultText={text}
  actions={[{ id: 'improve', label: 'Improve', pendingLabel: 'Improving…' }, …]}
  rewrite={async ({ actionId, text }) => callAgent(actionId, text)}
/>`,
      Component: () => (
        <div style={{ minHeight: 190, paddingBlockStart: 24, maxWidth: 560 }}>
          <SelectionActions defaultText={text} defaultSelection={{ start, end: text.length }} actions={actions} rewrite={rewrite} />
        </div>
      ),
    },
    {
      name: 'Streaming chunks',
      code: `<SelectionActions
  defaultText={text}
  actions={actions}
  rewrite={({ actionId, text }) => streamFromAgent(actionId, text)} // AsyncIterable<string>
/>`,
      Component: () => (
        <div style={{ minHeight: 190, paddingBlockStart: 24, maxWidth: 560 }}>
          <SelectionActions defaultText={text} actions={actions} rewrite={streamed} />
          <p style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, marginBlockStart: 80 }}>Select any words above to try it.</p>
        </div>
      ),
    },
  ],
};

export default demo;
