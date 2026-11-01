import { WritingAssistant } from 'oniva-ui';
import type { StateModule } from '../types';

const suggestions = ['Polish my email', 'Make it shorter', 'Fix the tone', 'Draft a reply'];

const mod: StateModule = {
  slug: 'writing-assistant',
  title: 'Writing assistant',
  width: 420,
  groups: [
    {
      label: 'Welcome',
      states: [
        { id: 'default', label: 'default, no suggestions', render: () => <WritingAssistant /> },
        { id: 'suggestions', label: 'with suggestions', render: () => <WritingAssistant suggestions={suggestions} /> },
        { id: 'empty-suggestions', label: 'empty suggestions list', render: () => <WritingAssistant suggestions={[]} /> },
        {
          id: 'many-suggestions',
          label: 'many suggestions wrap',
          render: () => (
            <WritingAssistant
              suggestions={[
                'Polish my email to the Northwind Labs procurement team',
                'Make it shorter',
                'Fix the tone',
                'Draft a reply to the Q3 vendor review thread',
                'Translate to French',
                'Turn these notes into a status update',
              ]}
            />
          ),
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'custom-copy',
          label: 'custom name, tagline, greeting, placeholder',
          render: () => (
            <WritingAssistant
              name="Atlas 2 Editor"
              tagline="Rewrites, tightens and checks tone."
              greeting="Paste a draft or tell me what to write."
              placeholder="Describe the document…"
              suggestions={suggestions.slice(0, 3)}
            />
          ),
        },
        {
          id: 'long-copy',
          label: 'long name, tagline, greeting',
          render: () => (
            <WritingAssistant
              name="Northwind Labs customer communications writing assistant"
              tagline="Drafts replies, release notes and incident updates in the voice of your support team, with approval from the on-call owner."
              greeting="Tell me who you are writing to, what they need to know, and which tone fits the moment, and I will draft it."
              suggestions={suggestions}
            />
          ),
        },
        {
          id: 'long-placeholder',
          label: 'long placeholder',
          render: () => (
            <WritingAssistant placeholder="Describe the email you want to write, including recipient, tone and any dates to mention…" />
          ),
        },
      ],
    },
    {
      label: 'Voice',
      states: [
        { id: 'speech-simulate', label: 'speech simulate (idle)', render: () => <WritingAssistant speech="simulate" suggestions={suggestions} /> },
      ],
    },
  ],
  missing: [
    'Conversation with user and assistant messages (messages are internal state, no initial-messages prop)',
    'Assistant typing / pending (reached only by sending a message)',
    'Streaming reply and finished reply',
    'Listening / dictating (reached only by pressing the mic)',
    'Draft text with Send button visible (draft is internal state)',
    'Reply error (respond rejection is unhandled; no error branch)',
    'Disabled / read-only (no prop)',
  ],
};
export default mod;
