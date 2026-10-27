import type { DemoModule } from '../../internal/demo';
import { PromptLibrary, type SavedPrompt } from './PromptLibrary';

const prompts: SavedPrompt[] = [
  { id: '1', name: 'Summarize a meeting', tags: ['Notes'], template: 'Summarize the {meeting} in five bullets. List owners and due dates for every action item.', variables: { meeting: { description: 'meeting' } } },
  { id: '2', name: 'Write release notes', tags: ['Product'], template: 'Write release notes for {product} {version} for {audience}. Keep the tone {tone} and group the changes into New, Improved and Fixed.', variables: { product: { default: 'Relay' }, tone: { default: 'friendly' } } },
  { id: '3', name: 'Explain an error', tags: ['Debug'], template: 'Explain this {language} error in plain words and suggest the most likely fix.' },
  { id: '4', name: 'Draft a cold email', tags: ['Sales'], template: 'Draft a short email to {contact} at {company} about {offer}. End with one clear question.' },
];

const demo: DemoModule = {
  meta: {
    title: 'Prompt library',
    slug: 'prompt-library',
    category: 'AI & Agent',
    description: 'Saved prompts with search, {variable} inputs, a live-filled preview with token estimate, copy and use.',
  },
  demos: [
    {
      name: 'Split view',
      code: `<PromptLibrary variant="split" defaultSelectedId="2" prompts={prompts} onUse={(prompt, filled) => insert(filled)} />`,
      Component: () => (
        <div style={{ maxWidth: 720, width: '100%' }}>
          <PromptLibrary variant="split" defaultSelectedId="2" prompts={prompts} />
        </div>
      ),
    },
    {
      name: 'Saved prompts',
      code: `<PromptLibrary prompts={prompts} onUse={(prompt, filled) => insert(filled)} />`,
      Component: () => (
        <div style={{ maxWidth: 560, width: '100%' }}>
          <PromptLibrary prompts={prompts} />
        </div>
      ),
    },
    {
      name: 'Required variables with defaults',
      code: `<PromptLibrary requireAll prompts={[{ id: 'rn', name: 'Release notes', template: 'Write release notes for {product} v{version}.', variables: { product: { default: 'Ledger' } } }]} />`,
      Component: () => (
        <div style={{ maxWidth: 560, width: '100%' }}>
          <PromptLibrary
            requireAll
            prompts={[
              { id: 'rn', name: 'Release notes', tags: ['product'], template: 'Write release notes for {product} v{version}. Group changes by area and keep it under 150 words.', variables: { product: { default: 'Ledger' }, version: { description: 'e.g. 2.4' } } },
              { id: 'out', name: 'Outreach email', tags: ['sales'], template: 'Draft a short email to {contact} at {company} about renewing their plan before {date}.' },
            ]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
