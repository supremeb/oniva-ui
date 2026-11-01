import { TextShimmer } from 'oniva-ui';
import type { StateModule } from '../types';

const mod: StateModule = {
  slug: 'text-shimmer',
  title: 'Text shimmer',
  width: 420,
  groups: [
    {
      label: 'Content',
      states: [
        {
          id: 'thinking',
          label: 'thinking label',
          render: () => (
            <div style={{ fontSize: 15, fontWeight: 500 }}>
              <TextShimmer>Thinking…</TextShimmer>
            </div>
          ),
        },
        {
          id: 'status-line',
          label: 'status line',
          render: () => (
            <div style={{ fontSize: 14 }}>
              <TextShimmer>Searching the web for Q3 revenue benchmarks</TextShimmer>
            </div>
          ),
        },
        {
          id: 'long-wrapping',
          label: 'long text wraps',
          render: () => (
            <div style={{ fontSize: 14, lineHeight: 1.5 }}>
              <TextShimmer>
                Reading 4 sources: Northwind Labs quarterly filings, the retry scheduler design notes, the Atlas 2
                release checklist and the incident review from last Tuesday
              </TextShimmer>
            </div>
          ),
        },
        {
          id: 'long-unbroken',
          label: 'long unbroken path',
          render: () => (
            <div style={{ fontSize: 14 }}>
              <TextShimmer>
                packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts
              </TextShimmer>
            </div>
          ),
        },
        {
          id: 'with-number',
          label: 'with counts',
          render: () => (
            <div style={{ fontSize: 14 }}>
              <TextShimmer>Generating summary · 1,284 tokens · 12.4s</TextShimmer>
            </div>
          ),
        },
      ],
    },
    {
      label: 'Size',
      states: [
        {
          id: 'small',
          label: '12px caption',
          render: () => (
            <div style={{ fontSize: 12 }}>
              <TextShimmer>Reading 4 sources</TextShimmer>
            </div>
          ),
        },
        {
          id: 'large',
          label: '24px heading',
          render: () => (
            <div style={{ fontSize: 24, fontWeight: 600 }}>
              <TextShimmer>Drafting the reply…</TextShimmer>
            </div>
          ),
        },
      ],
    },
  ],
  missing: [
    'empty (no children): renders no box at all, so there is nothing to look at',
    'paused / static (isActive=false): Shimmer supports it but TextShimmer does not expose the prop',
    'custom duration: Shimmer supports it but TextShimmer does not expose the prop',
    'reduced motion static fallback: an OS setting, not reachable via props',
  ],
};

export default mod;
