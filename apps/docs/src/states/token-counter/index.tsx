import { TokenCounter } from 'oniva-ui';
import type { StateModule } from '../types';

const mod: StateModule = {
  slug: 'token-counter',
  title: 'Token counter',
  width: 420,
  groups: [
    {
      label: 'Tokens only',
      states: [
        { id: 'zero', label: 'zero', render: () => <TokenCounter tokens={0} /> },
        { id: 'small', label: 'small count', render: () => <TokenCounter tokens={842} /> },
        { id: 'typical', label: 'typical', render: () => <TokenCounter tokens={48210} /> },
        { id: 'large', label: 'seven digits', render: () => <TokenCounter tokens={1284930} /> },
      ],
    },
    {
      label: 'With limit',
      states: [
        { id: 'max', label: 'with max', render: () => <TokenCounter tokens={48210} max={200000} /> },
        { id: 'max-near', label: 'near the limit', render: () => <TokenCounter tokens={196480} max={200000} /> },
        { id: 'max-over', label: 'over the limit', render: () => <TokenCounter tokens={204310} max={200000} /> },
        { id: 'max-large', label: 'million-token window', render: () => <TokenCounter tokens={412650} max={1000000} /> },
      ],
    },
    {
      label: 'With cost',
      states: [
        { id: 'cost', label: 'with cost', render: () => <TokenCounter tokens={48210} cost={0.14463} /> },
        { id: 'cost-zero', label: 'zero cost', render: () => <TokenCounter tokens={0} cost={0} /> },
        { id: 'cost-tiny', label: 'sub-cent cost', render: () => <TokenCounter tokens={842} cost={0.0025} /> },
        { id: 'cost-large', label: 'large cost', render: () => <TokenCounter tokens={1284930} cost={38.5479} /> },
        { id: 'max-cost', label: 'max and cost', render: () => <TokenCounter tokens={48210} max={200000} cost={0.14463} /> },
      ],
    },
  ],
  missing: [
    'Streaming / live update (value is a prop; the roll only plays on change, so a still frame cannot show it)',
    'Over-limit warning styling (the component does not change appearance when tokens exceed max)',
    'Loading / unknown count (tokens is required)',
  ],
};
export default mod;
