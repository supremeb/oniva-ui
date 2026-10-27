import type { DemoModule } from '../../internal/demo';
import { DecisionTree, type Decision } from './DecisionTree';

const decisions: Decision[] = [
  {
    id: 'dupes',
    question: '3 customers have two active subscriptions. How should I proceed?',
    context: 'All three signed up twice during the checkout outage on Oct 14.',
    agent: 'Billing agent',
    model: 'Atlas 2',
    risk: 'high',
    options: [
      { label: 'Cancel the newer ones', pick: true, effects: ['Cancels 3 subscriptions · reversible', 'Sends 3 emails'] },
      { label: 'Refund the newer ones', effects: [['Refunds ', { text: '$147 · not reversible', note: 'One of the charges is two billing cycles old.', source: 'Billing policy 4.2' }]] },
      { label: 'Ask the customers', effects: ['Sends 3 emails · waits for answers'] },
    ],
  },
  {
    id: 'backup',
    question: 'The nightly backup is 40 minutes late. Run it now or wait?',
    agent: 'Ops agent',
    model: 'Nova Pro',
    risk: 'medium',
    options: [
      { label: 'Run it now', effects: ['Slows checkout by about 8% for 25 minutes'] },
      { label: 'Wait for the quiet window', pick: true, effects: ['Runs at 02:00 · risk of a 26-hour gap'] },
    ],
  },
];

const demo: DemoModule = {
  meta: {
    title: 'Decision tree',
    slug: 'decision-tree',
    category: 'AI & Agent',
    description: 'An agent stuck on a fork lays out its options with consequences and its own pick. Choose a path with 1 to 4 or write your own instruction.',
  },
  demos: [
    {
      name: 'Two decisions',
      code: `<DecisionTree
  decisions={decisions}
  onChoose={async (decision, choice) => {
    if ('other' in choice) return await agent.instruct(decision.id, choice.other);
    await agent.resume(decision.id, choice.option.label);
  }}
/>`,
      Component: () => <DecisionTree decisions={decisions} onChoose={async (_d, c) => ('other' in c ? 'Understood, I will do that first and report back.' : undefined)} />,
    },
    {
      name: 'No custom instruction',
      code: `<DecisionTree decisions={decisions.slice(1)} allowOther={false} />`,
      Component: () => <DecisionTree decisions={decisions.slice(1)} allowOther={false} />,
    },
  ],
};

export default demo;
