import { Carousel } from 'oniva-ui';
import type { DocPage } from '../types';

const slides = [
  ['Stripe', 'Accept cards and bank debits.'],
  ['Slack', 'Send alerts to a channel.'],
  ['Linear', 'Create issues from events.'],
  ['Notion', 'Sync records to a database.'],
];
const Demo = (p: { loop?: boolean; autoPlay?: number; count?: number; onEvent?: (n: string) => void }) => (
  <div style={{ width: 360 }}>
    <Carousel aria-label="Featured integrations" loop={p.loop} autoPlay={p.autoPlay || undefined} onIndexChange={() => p.onEvent?.('onIndexChange')}>
      {slides.slice(0, p.count ?? 4).map(([t, d]) => (
        <div key={t} style={{ padding: 24, background: 'var(--oniva-color-surface-inset)', borderRadius: 12 }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>{t}</div>
          <div style={{ color: 'var(--oniva-color-text-muted)', fontSize: 14 }}>{d}</div>
        </div>
      ))}
    </Carousel>
  </div>
);

const page: DocPage = {
  slug: 'carousel',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Carousel',
  group: ['Components', 'Data display'],
  sourcePath: 'components/Carousel',
  lede: 'A scroll-snapping row of full-width slides with previous and next buttons, dot pagination and optional autoplay.',
  anatomy: {
    intro: 'Four parts. Slides and dots are always present; the autoplay toggle shows only with autoPlay.',
    Render: () => <Demo autoPlay={0} />,
    parts: [
      { name: 'Viewport', description: 'Focusable scroll container, 12px radius, horizontal scroll snap, smooth scrolling (instant under reduced motion). Left and right arrows change slide.', selector: '[role="group"][tabindex="0"]' },
      { name: 'Slide', description: 'Each slide is 100% wide, labelled "N of total". Off-screen slides are inert.', selector: '[aria-roledescription="slide"]:first-child' },
      { name: 'Arrow buttons', description: 'Two sm secondary icon buttons with 16px chevrons. Disabled at the ends when loop is off.', selector: 'button[aria-label="Next slide"]' },
      { name: 'Dots', description: '8px dots in 24px hit areas, 2px apart. Active dot is accent and scaled 1.25.', selector: 'button[aria-current="true"]' },
    ],
  },
  usage: {
    use: ['Featured items where each slide stands alone.', 'Image or card galleries on narrow layouts.', 'Onboarding tips that are optional to read.'],
    avoid: [
      { text: 'Content users must compare or all read.', instead: { slug: 'list', label: 'List' } },
      { text: 'Switching between peer views.', instead: { slug: 'tabs', label: 'Tabs' } },
      { text: 'Steps in a required flow.', instead: { slug: 'stepper', label: 'Stepper' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'loop', label: 'Loop' },
      { kind: 'number', key: 'autoPlay', label: 'Autoplay ms (0 = off)', min: 0, max: 10000, step: 1000 },
      { kind: 'number', key: 'count', label: 'Slides', min: 1, max: 4, step: 1 },
    ],
    initial: { loop: true, autoPlay: 0, count: 4 },
    render: (p, onEvent) => <Demo loop={Boolean(p.loop)} autoPlay={Number(p.autoPlay)} count={Number(p.count)} onEvent={onEvent} />,
    code: (p) => `<Carousel aria-label="Featured integrations"${p.loop ? '' : ' loop={false}'}${Number(p.autoPlay) ? ` autoPlay={${p.autoPlay}}` : ''}>\n  <Slide />\n  <Slide />\n</Carousel>`,
  },
  states: [
    { name: 'Looping', description: 'Previous and next are always enabled.', Render: () => <Demo /> },
    { name: 'No loop, first slide', description: 'Previous is disabled.', Render: () => <Demo loop={false} /> },
    { name: 'Autoplay', description: 'Adds a pause button; pauses on hover and focus.', Render: () => <Demo autoPlay={5000} /> },
    { name: 'Single slide', description: 'Controls remain; prefer no carousel for one item.', Render: () => <Demo count={1} /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Autoplay off by default', body: 'Moving content competes with reading. If you enable it, 5 seconds or more, and keep the pause control.' },
      { title: 'Four to six slides', body: 'Past that, dots become noise. Use a List or grid.' },
      { title: 'No critical content', body: 'Anything a user must see goes outside the carousel.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With cards', body: 'Each slide holds one Card; keep heights equal to avoid layout shift.' },
      { title: 'With onIndexChange', body: 'Track which slide was seen for analytics or to lazy-load media.' },
    ] },
  ],
  content: { rules: [
    { title: 'aria-label', body: 'Required. Name the collection: "Featured integrations".' },
    { title: 'Slide titles', body: 'Start each slide with a short heading, under 30 characters.' },
    { title: 'Pause label', body: 'Built in: "Pause autoplay" and "Start autoplay".' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['←'], action: 'Previous slide (viewport focused).' },
      { keys: ['→'], action: 'Next slide (viewport focused).' },
      { keys: ['Tab'], action: 'Moves between viewport, arrows, dots and pause.' },
      { keys: ['Enter', 'Space'], action: 'Activates the focused button or dot.' },
    ],
    notes: ['Root is role="region" with aria-roledescription="carousel"; slides are groups "N of total".', 'Inactive slides are inert so hidden content cannot take focus.', 'Live region is polite when stopped and off while autoplay runs.', 'Dots expose aria-current on the active slide.'],
    reducedMotion: 'Autoplay never starts and scrolling is instant.',
  },
  props: [
    { name: 'aria-label', type: 'string', description: 'Required accessible name.' },
    { name: 'children', type: 'ReactNode', description: 'One child per slide.' },
    { name: 'autoPlay', type: 'number', description: 'Interval in ms. Off when omitted.' },
    { name: 'loop', type: 'boolean', default: 'true', description: 'Wrap at the ends.' },
    { name: 'onIndexChange', type: '(index: number) => void', description: 'Fires when the active slide changes.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['tabs', 'list', 'stepper', 'accordion'],
};
export default page;
