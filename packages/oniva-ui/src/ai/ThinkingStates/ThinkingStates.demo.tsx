import { AtSign, FileText, Globe, Hash } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { ThinkingStates } from './ThinkingStates';

const demo: DemoModule = {
  meta: {
    title: 'Thinking states',
    slug: 'thinking-states',
    category: 'AI & Agent',
    description: 'Rotating status line, or a collapsible panel with a live timer, sources and steps that appear one by one.',
  },
  demos: [
    {
      name: 'Steps card',
      code: `<ThinkingStates
  variant="card"
  steps={[
    { kind: 'search', label: 'Searched', sources: [{ label: 'Chat · #team-offsite', icon: <Hash size={12} /> }, …] },
    { label: 'Reading 7 sources about the trip' },
    { label: 'Comparing flights and hotels' },
  ]}
/>`,
      Component: () => (
        <ThinkingStates
          variant="card"
          stepMs={1600}
          steps={[
            {
              kind: 'search',
              label: 'Searched',
              sources: [
                { label: 'Chat · #team-offsite', icon: <Hash size={12} /> },
                { label: 'Feed · @harborguide', icon: <AtSign size={12} /> },
                { label: 'Notes · Offsite plan', icon: <FileText size={12} /> },
                { label: 'Wiki · Harbor City', icon: <Globe size={12} /> },
                { label: 'Calendar · Q4' },
                { label: 'Maps · Venues' },
                { label: 'Mail · Quotes' },
              ],
            },
            { label: 'Reading 7 sources about the trip' },
            { label: 'Comparing flights and hotels' },
          ]}
        />
      ),
    },
    {
      name: 'Data analyst agent',
      code: `<ThinkingStates loop messages={['Reading the sales export…', 'Joining with the CRM accounts…', 'Computing cohort retention…', 'Drafting the summary…']} />`,
      Component: () => (
        <ThinkingStates
          loop
          messages={[
            'Reading the sales export…',
            'Joining with the CRM accounts…',
            'Computing cohort retention…',
            'Drafting the summary…',
          ]}
        />
      ),
    },
    {
      name: 'Fast cadence',
      code: `<ThinkingStates holdMs={1200} messages={['Cloning repo…', 'Running tests…', 'Writing review…']} />`,
      Component: () => <ThinkingStates holdMs={1200} loop messages={['Cloning repo…', 'Running tests…', 'Writing review…']} />,
    },
    {
      name: 'Steps panel',
      code: `<ThinkingStates
  steps={[
    { kind: 'search', label: 'Searched', sources: [{ label: 'docs.example.com' }, { label: 'status.example.com' }] },
    { label: 'Reading the sources' },
    { label: 'Drafting your answer' },
  ]}
  onDone={(seconds) => console.log(seconds)}
/>`,
      Component: () => (
        <ThinkingStates
          steps={[
            { kind: 'search', label: 'Searched', sources: [{ label: 'docs.example.com' }, { label: 'status.example.com' }, { label: 'changelog.example.com' }, { label: 'forum.example.com' }] },
            { label: 'Reading the sources' },
            { label: 'Drafting your answer' },
          ]}
        />
      ),
    },
  ],
};

export default demo;
