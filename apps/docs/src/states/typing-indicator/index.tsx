import { TypingIndicator } from 'oniva-ui';
import type { StateModule } from '../types';

const mod: StateModule = {
  slug: 'typing-indicator',
  title: 'Typing indicator',
  width: 420,
  groups: [
    {
      label: 'Label',
      states: [
        { id: 'default', label: 'default label', render: () => <TypingIndicator /> },
        { id: 'custom-label', label: 'custom label', render: () => <TypingIndicator label="Atlas 2 is composing a reply" /> },
        {
          id: 'long-label',
          label: 'long label',
          render: () => (
            <TypingIndicator label="Nova Pro is reading northwind-labs-quarterly-report-final-v3.example and drafting a summary" />
          ),
        },
      ],
    },
  ],
  missing: ['Size or tone variants (the component has none)', 'Stopped or hidden state (the parent unmounts it)'],
};

export default mod;
