import { AgentLimits } from 'oniva-ui';
import type { AgentLimit } from 'oniva-ui';
import type { StateModule } from '../types';

type Segments = NonNullable<React.ComponentProps<typeof AgentLimits>['context']>['segments'];

const segments: Segments = [
  { id: 'sys', label: 'System', value: 42_000, display: '42k', color: 'c5' },
  { id: 'msg', label: 'Messages', value: 468_000, display: '468k', color: 'c4' },
  { id: 'tool', label: 'Tool results', value: 270_000, display: '270k', color: 'c1' },
  { id: 'files', label: 'Files', value: 40_000, display: '40k', color: 'c8' },
];
const context = { max: 1_000_000, segments };

const limits: AgentLimit[] = [
  { id: '5h', label: '5-hour limit', resetsIn: 'Resets in 2 hr 46 min', percent: 38 },
  { id: 'wk', label: 'Weekly limit', resetsIn: 'Resets Fri 9:00 AM', percent: 74 },
  { id: 'deep', label: 'Quill Reasoner weekly limit', resetsIn: 'Resets Fri 9:00 AM', percent: 93 },
];

const mod: StateModule = {
  slug: 'agent-limits',
  title: 'Agent limits',
  width: 420,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'empty (no context, no limits)', render: () => <AgentLimits plan="Max (5x)" /> },
        { id: 'typical', label: 'context + limits + plan', render: () => <AgentLimits plan="Max (5x)" context={context} limits={limits} /> },
        { id: 'context-only', label: 'context only', render: () => <AgentLimits context={context} /> },
        { id: 'limits-only', label: 'limits only, with plan', render: () => <AgentLimits plan="Pro" limits={limits.slice(0, 2)} /> },
        { id: 'limits-no-plan', label: 'limits, no plan chip', render: () => <AgentLimits limits={limits.slice(0, 2)} /> },
        { id: 'one-limit', label: 'one limit', render: () => <AgentLimits plan="Free" limits={limits.slice(0, 1)} /> },
      ],
    },
    {
      label: 'Context',
      states: [
        {
          id: 'context-custom-title',
          label: 'custom title',
          render: () => <AgentLimits context={{ ...context, title: 'Atlas 2 context' }} />,
        },
        {
          id: 'context-zero',
          label: 'zero tokens used',
          render: () => (
            <AgentLimits
              context={{ max: 200_000, segments: [{ id: 'sys', label: 'System', value: 0, display: '0' }] }}
            />
          ),
        },
        {
          id: 'context-no-segments',
          label: 'no segments',
          render: () => <AgentLimits context={{ max: 200_000, segments: [] }} />,
        },
        {
          id: 'context-full',
          label: 'exactly full',
          render: () => (
            <AgentLimits
              context={{
                max: 200_000,
                segments: [
                  { id: 'msg', label: 'Messages', value: 120_000, display: '120k', color: 'c4' },
                  { id: 'tool', label: 'Tool results', value: 80_000, display: '80k', color: 'c1' },
                ],
              }}
            />
          ),
        },
        {
          id: 'context-over',
          label: 'over capacity',
          render: () => (
            <AgentLimits
              context={{
                max: 200_000,
                segments: [
                  { id: 'msg', label: 'Messages', value: 150_000, display: '150k', color: 'c4' },
                  { id: 'tool', label: 'Tool results', value: 95_000, display: '95k', color: 'c1' },
                ],
              }}
            />
          ),
        },
        {
          id: 'context-max-zero',
          label: 'max 0',
          render: () => <AgentLimits context={{ max: 0, segments }} />,
        },
        {
          id: 'context-many',
          label: 'many segments (legend wraps)',
          render: () => (
            <AgentLimits
              context={{
                max: 1_000_000,
                segments: [
                  { id: 'sys', label: 'System prompt', value: 12_400, display: '12.4k' },
                  { id: 'tools', label: 'Tool definitions', value: 31_800, display: '31.8k' },
                  { id: 'msg', label: 'Messages', value: 214_000, display: '214k' },
                  { id: 'res', label: 'Tool results', value: 188_000, display: '188k' },
                  { id: 'files', label: 'Attached files', value: 96_500, display: '96.5k' },
                  { id: 'mem', label: 'Memory', value: 8_200, display: '8.2k' },
                  { id: 'sum', label: 'Summaries', value: 41_000, display: '41k' },
                ],
              }}
            />
          ),
        },
        {
          id: 'context-default-colors',
          label: 'no segment colors set',
          render: () => (
            <AgentLimits
              context={{
                max: 1_000_000,
                segments: [
                  { id: 'a', label: 'Messages', value: 320_000 },
                  { id: 'b', label: 'Tools', value: 180_000 },
                  { id: 'c', label: 'Files', value: 60_000 },
                ],
              }}
            />
          ),
        },
      ],
    },
    {
      label: 'Usage tone',
      states: [
        {
          id: 'tones',
          label: 'accent / warning / danger',
          render: () => (
            <AgentLimits
              plan="Max (20x)"
              limits={[
                { id: 'a', label: '5-hour limit', resetsIn: 'Resets in 4 hr 12 min', percent: 69 },
                { id: 'b', label: 'Weekly limit', resetsIn: 'Resets Fri 9:00 AM', percent: 70 },
                { id: 'c', label: 'Quill Reasoner weekly limit', resetsIn: 'Resets Fri 9:00 AM', percent: 89 },
                { id: 'd', label: 'Nova Pro weekly limit', resetsIn: 'Resets Fri 9:00 AM', percent: 90 },
              ]}
            />
          ),
        },
        {
          id: 'zero-and-full',
          label: '0% and 100%',
          render: () => (
            <AgentLimits
              plan="Pro"
              limits={[
                { id: 'a', label: '5-hour limit', resetsIn: 'Resets in 5 hr', percent: 0 },
                { id: 'b', label: 'Weekly limit', resetsIn: 'Resets Fri 9:00 AM', percent: 100 },
              ]}
            />
          ),
        },
        {
          id: 'out-of-range',
          label: 'out of range (-5, 112)',
          render: () => (
            <AgentLimits
              plan="Pro"
              limits={[
                { id: 'a', label: '5-hour limit', percent: -5 },
                { id: 'b', label: 'Weekly limit', percent: 112 },
              ]}
            />
          ),
        },
        {
          id: 'fractional',
          label: 'fractional percent',
          render: () => (
            <AgentLimits
              plan="Pro"
              limits={[
                { id: 'a', label: '5-hour limit', resetsIn: 'Resets in 1 hr 3 min', percent: 69.5 },
                { id: 'b', label: 'Weekly limit', resetsIn: 'Resets Fri 9:00 AM', percent: 89.6 },
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
          id: 'no-reset',
          label: 'no reset time',
          render: () => (
            <AgentLimits
              plan="Free"
              limits={[
                { id: 'a', label: 'Daily messages', percent: 40 },
                { id: 'b', label: 'Monthly file uploads', percent: 12 },
              ]}
            />
          ),
        },
        {
          id: 'long-label',
          label: 'long label and reset',
          render: () => (
            <AgentLimits
              plan="Northwind Labs Enterprise (annual, 250 seats)"
              limits={[
                {
                  id: 'a',
                  label: 'Quill Reasoner extended thinking requests per rolling five-hour window',
                  resetsIn: 'Resets in 2 hr 46 min, then again on the first of next month at 9:00 AM',
                  percent: 81,
                },
                { id: 'b', label: 'northwind-labs-shared-workspace-with-a-very-long-unbroken-name-weekly-limit', percent: 22 },
              ]}
            />
          ),
        },
        {
          id: 'many-limits',
          label: 'many limits',
          render: () => (
            <AgentLimits
              plan="Max (5x)"
              limits={Array.from({ length: 8 }, (_, i): AgentLimit => ({
                id: `l${i}`,
                label: ['5-hour limit', 'Weekly limit', 'Atlas 2 weekly limit', 'Nova Pro weekly limit', 'Lumen Fast daily limit', 'Quill Reasoner weekly limit', 'File uploads', 'Connector calls'][i]!,
                resetsIn: 'Resets Fri 9:00 AM',
                percent: [12, 38, 55, 71, 84, 93, 100, 6][i]!,
              }))}
            />
          ),
        },
      ],
    },
  ],
  missing: [
    'Loading / pending usage (no loading prop; data is either present or absent)',
    'Error fetching limits (no error prop or message slot)',
    'Disabled / read-only (display-only component)',
    'Size or variant (component exposes no size or variant prop)',
  ],
};
export default mod;
