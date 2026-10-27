import { useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Badge, Button, Card, CardDescription, CardHeader, CardHeaderText, CardTitle, EmptyState, Input, Select, SelectItem, Slider, Switch } from 'oniva-ui';
import { Check, Search, Settings, Plus, Inbox, Sparkles, X, ArrowRight } from 'lucide-react';
import { CodeBlock } from '../components/CodeBlock';
import { counts } from '../lib/site';
import { DoDont, RuleCards } from '../components/doc/primitives';
import { ColorRules, ContrastRatios, HueRamps, SemanticTokens, TypeRules, TypeScale, TypeTokens, Weights } from './foundations';

export interface StaticPage {
  path: string;
  group: 'getting-started' | 'foundations' | 'patterns';
  title: string;
  lede: string;
  sections: { id: string; title: string; Render: ComponentType }[];
}

const mono = { fontFamily: 'var(--oniva-font-mono)', fontSize: 12 } as const;
const box = { background: 'var(--oniva-color-surface-inset)', border: '1px solid var(--oniva-color-border)', borderRadius: 12, padding: 16 } as const;
const grid = { display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' } as const;
const P = ({ children }: { children: ReactNode }) => <p style={{ color: 'var(--oniva-color-text-muted)', fontSize: 14, lineHeight: 1.55, margin: '0 0 16px', maxWidth: 640 }}>{children}</p>;

/* ---- runtime token reading: follows theme + accent because it reads computed values ---- */
function useCssVar(name: string, deps: unknown[] = []) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState('');
  useLayoutEffect(() => {
    const read = () => ref.current && setV(getComputedStyle(ref.current).getPropertyValue(name).trim());
    read();
    const t = setTimeout(read, 320);
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['class', 'data-theme', 'data-accent'] });
    return () => { clearTimeout(t); mo.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return [ref, v] as const;
}
function rgb(c: string): [number, number, number] | null {
  const el = document.createElement('canvas').getContext('2d');
  if (!el) return null;
  el.fillStyle = '#000'; el.fillStyle = c;
  const m = el.fillStyle.match(/^#(..)(..)(..)$/);
  return m ? [parseInt(m[1]!, 16), parseInt(m[2]!, 16), parseInt(m[3]!, 16)] : null;
}
const lum = ([r, g, b]: [number, number, number]) => { const f = (x: number) => { const v = x / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
function ratio(a: string, b: string) {
  // resolve color-mix / var via a probe element
  const pa = rgb(a); const pb = rgb(b);
  if (!pa || !pb) return null;
  const [x, y] = [lum(pa), lum(pb)].sort((m, n) => n - m);
  return ((x! + 0.05) / (y! + 0.05));
}

function Swatch({ token, fg, bg }: { token: string; fg?: string; bg?: string }) {
  const [ref, val] = useCssVar(token);
  const [bgRef, bgVal] = useCssVar(bg ?? '--oniva-color-bg');
  const r = fg ? null : val.startsWith('#') && bgVal ? ratio(val, bgVal) : null;
  return (
    <div style={{ minWidth: 0 }}>
      <span ref={ref} style={{ display: 'none' }} />
      <span ref={bgRef} style={{ display: 'none' }} />
      <div style={{ background: `var(${token})`, border: '1px solid var(--oniva-color-border)', borderRadius: 8, height: 44 }} />
      <div style={{ ...mono, marginTop: 6, overflowWrap: 'anywhere' }}>{token.replace('--oniva-', '')}</div>
      <div style={{ ...mono, color: 'var(--oniva-color-text-muted)' }}>{val}{r ? ` · ${r.toFixed(1)}:1` : ''}</div>
    </div>
  );
}

const ACCENT_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const Color = () => (
  <>
    <div style={grid}>{ACCENT_STEPS.map((n) => <Swatch key={n} token={`--oniva-accent-${n}`} />)}</div>
  </>
);
const SPACES = [1, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64, 96];
const Space = () => (
  <div style={{ display: 'grid', gap: 8 }}>
    {SPACES.map((n) => (
      <div key={n} style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
        <span style={{ ...mono, flex: '0 0 96px' }}>space-{n}</span>
        <span style={{ ...mono, color: 'var(--oniva-color-text-muted)', flex: '0 0 40px' }}>{n}px</span>
        <span style={{ background: 'var(--oniva-accent-500)', borderRadius: 2, height: 12, width: `var(--oniva-space-${n})` }} />
      </div>
    ))}
  </div>
);
const RADII = ['xs', 'sm', 'md', 'lg', 'xl', 'card', 'xxl', 'xxxl', 'full'];
const Radius = () => (
  <div style={grid}>
    {RADII.map((n) => (
      <div key={n}>
        <div style={{ background: 'var(--oniva-color-surface-tertiary)', border: '1px solid var(--oniva-color-border-hover)', borderRadius: `var(--oniva-radius-${n})`, height: 64 }} />
        <div style={{ ...mono, marginTop: 6 }}>radius-{n}</div>
      </div>
    ))}
  </div>
);
const LEVELS: { id: string; name: string; token: string; meaning: string; use: string }[] = [
  { id: 'flat', name: 'Flat', token: 'none', meaning: 'A surface. It differs from its neighbour by fill and a 1px border, never by shadow.', use: 'Card, KpiStrip tile, Alert, DataGrid, EmptyState tile' },
  { id: 'recessed', name: 'Recessed', token: '--oniva-elevation-recessed', meaning: 'A channel that holds something. A 2px inner shadow at the top edge, no outer shadow.', use: 'Input, Select trigger, Switch and Slider track, ProgressBar, Tabs pill and Segmented track' },
  { id: 'raised', name: 'Raised', token: '--oniva-elevation-raised', meaning: 'An object you grab or press, sitting on a surface. Hairline, contact and soft ambient. Hover lifts a touch; press flattens and never adds shadow.', use: 'Switch knob, Slider thumb, selected Tabs pill, secondary Button' },
  { id: 'floating', name: 'Floating', token: '--oniva-elevation-floating', meaning: 'A separate layer above the page. Hairline, a key shadow and a wide ambient one.', use: 'Menu, Popover, Select list, Tooltip, Toast' },
  { id: 'overlay', name: 'Overlay', token: '--oniva-elevation-overlay', meaning: 'The modal layer. The largest shadow, always paired with a scrim.', use: 'Dialog, AlertDialog, Drawer, BottomSheet' },
];
const LevelCell = ({ id, children }: { id: string; children: ReactNode }) => {
  const l = LEVELS.find((x) => x.id === id)!;
  return (
    <div style={{ ...box, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: 96 }}>{children}</div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{l.name}</div>
        <div style={{ ...mono, color: 'var(--oniva-color-text-muted)', marginTop: 2 }}>{l.token}</div>
        <p style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, lineHeight: 1.5, margin: '8px 0 4px' }}>{l.meaning}</p>
        <p style={{ color: 'var(--oniva-color-text-subtle)', fontSize: 12, lineHeight: 1.5, margin: 0 }}>{l.use}</p>
      </div>
    </div>
  );
};
const floatSurface = { background: 'var(--oniva-color-surface)', borderRadius: 12, fontSize: 13, padding: '8px 12px', width: 150 } as const;
const Depth = () => (
  <div>
    <P>Depth means one thing per level. One light source sits above the page, so every shadow falls down and every inner shadow sits at the top edge. In dark mode shadows barely read, so a level becomes a lighter surface with a 1px top rim and a hairline ring.</P>
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
      <LevelCell id="flat">
        <div style={{ width: 200 }}><Card variant="outline">
          <CardHeader>
            <CardHeaderText>
              <CardTitle>Monthly revenue</CardTitle>
              <CardDescription>$48,210</CardDescription>
            </CardHeaderText>
          </CardHeader>
        </Card></div>
      </LevelCell>
      <LevelCell id="recessed">
        <div style={{ width: 200 }}><Input aria-label="Email" defaultValue="priya@northwind.example" /></div>
      </LevelCell>
      <LevelCell id="raised">
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Switch defaultSelected>Notifications</Switch>
          <div style={{ width: 200 }}><Slider aria-label="Budget" defaultValue={60} /></div>
          <Button variant="secondary" size="sm">Cancel</Button>
        </div>
      </LevelCell>
      <LevelCell id="floating">
        <div style={{ ...floatSurface, boxShadow: 'var(--oniva-elevation-floating)' }}>Rename<br />Duplicate<br />Archive</div>
      </LevelCell>
      <LevelCell id="overlay">
        <div style={{ ...floatSurface, boxShadow: 'var(--oniva-elevation-overlay)', padding: 16 }}>
          <div style={{ fontWeight: 600 }}>Delete invoice?</div>
          <div style={{ color: 'var(--oniva-color-text-muted)', marginTop: 4 }}>This cannot be undone.</div>
        </div>
      </LevelCell>
    </div>
  </div>
);
const DepthRules = () => R([
  ['Never stack levels', 'No raised plus recessed on one element, and no ring plus bevel. A control is one level.'],
  ['Small colour is flat', 'Solid fills under 32px (switch track on, checkbox and radio checked, badges) are a flat colour. No gradient, no inner highlight.'],
  ['Press never adds shadow', 'Raised goes to pressed on press: the ambient shadow drops out. Hover may lift, only where hover exists.'],
  ['Cards are flat', 'A card in a tray differs by fill and a hairline border. Only things you can pick up are raised.'],
])();
const Elevation = () => (
  <div>
    <P>Legacy shadow names still resolve. shadow-sm is an alias of raised, shadow-dropdown of floating and shadow-xl of overlay. New code uses the elevation tokens.</P>
    <div style={{ ...grid, background: 'var(--oniva-color-surface-inset)', borderRadius: 12, padding: 24 }}>
      {['raised', 'raised-hover', 'pressed', 'recessed', 'floating', 'overlay'].map((n) => (
        <div key={n}>
          <div style={{ background: 'var(--oniva-color-surface)', borderRadius: 12, boxShadow: `var(--oniva-elevation-${n})`, height: 72 }} />
          <div style={{ ...mono, marginTop: 8 }}>elevation-{n}</div>
        </div>
      ))}
    </div>
  </div>
);
const ICONS = [Search, Settings, Plus, Inbox, Sparkles, Check, X, ArrowRight];
const Icons = () => (
  <>
    <P>Icons are lucide-react. Default to 16px at stroke 2 inside controls, 20px in empty states and nav, 14px in dense rows. Never mix stroke widths in one view. Icon-only buttons need an aria-label.</P>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {[14, 16, 20, 24].map((sz) => (
        <div key={sz} style={{ ...box, alignItems: 'center', display: 'flex', gap: 10 }}>
          {ICONS.map((I, i) => <I key={i} size={sz} aria-hidden="true" />)}
          <span style={{ ...mono, color: 'var(--oniva-color-text-muted)' }}>{sz}px</span>
        </div>
      ))}
    </div>
    <CodeBlock code={`import { Search } from 'lucide-react';\n\n<Button startIcon={<Search size={16} />}>Search</Button>`} />
  </>
);

/* ---- Getting started ---- */
const Install = () => (
  <>
    <CodeBlock code={`npm install oniva-ui react react-dom react-aria-components lucide-react`} />
    <P>Import the stylesheet once, then wrap the app in ThemeProvider. StyleX is only needed if you author your own styles or pass xstyle.</P>
    <CodeBlock code={`import 'oniva-ui/styles.css';\nimport { ThemeProvider } from 'oniva-ui';\n\n<ThemeProvider theme="system" accent="blue">\n  <App />\n</ThemeProvider>`} />
  </>
);
const Vars = () => (
  <>
    <P>Every token is a public CSS variable named --oniva-*. Use them in any CSS, no build step required. Themes swap values, never names.</P>
    <CodeBlock code={`.card {\n  background: var(--oniva-color-surface);\n  border: 1px solid var(--oniva-color-border);\n  border-radius: var(--oniva-radius-xl);\n  padding: var(--oniva-space-16);\n}`} />
  </>
);
const principles: [string, string][] = [
  ['Tokens, not values', 'No hex, no pixel radius in a component. If a token is missing, add the token.'],
  ['Behavior from React Aria', 'Focus, keyboard and ARIA come from react-aria-components. We style it, we do not rebuild it.'],
  ['Under 300ms', 'UI motion stays under 300ms with ease-out. Keyboard-driven actions do not animate.'],
  ['Contrast is a token problem', 'Fix a failing ratio at the token, then every component inherits the fix.'],
  ['One name per idea', `size, tone, variant and is* booleans mean the same on all ${counts.total} components.`],
  ['Docs are part of the component', 'A component ships with anatomy, usage, states, keyboard and props, or it is not done.'],
];
const Principles = () => <RuleCards numbered items={principles.map(([title, body]) => ({ title, body }))} />;
const Loop = () => (
  <RuleCards numbered items={[
    { title: 'Plan', body: 'Write docs/plans/<date>-<loop>.md. Read docs/solutions first.' },
    { title: 'Work', body: 'One folder per component: Name.tsx, index.ts, Name.test.tsx, Name.demo.tsx. Never edit src/index.ts by hand.' },
    { title: 'Review', body: 'Typecheck, lint, test, build, then e2e with axe in real Chromium.' },
    { title: 'Compound', body: 'Anything non-obvious goes into docs/solutions/<topic>.md so the next loop is easier.' },
  ]} />
);
const DocsContract = () => (
  <>
    <P>Every component gets a page at apps/docs/src/content/components/&lt;slug&gt;.tsx that default-exports a DocPage. Pages are discovered by glob, nothing to register. The full contract and voice guide live in docs/plans/docs-authoring-guide.md.</P>
    <CodeBlock code={`import type { DocPage } from '../types';\n\nconst page: DocPage = { slug: 'button', status: 'Stable', /* ... */ };\nexport default page;`} />
  </>
);

/* ---- Patterns ---- */
const row = { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12 } as const;
const AiPattern = () => (
  <DoDont items={[
    { kind: 'do', caption: 'Say what the model did and let the user undo it.', example: () => <Alert variant="info" title="Summarised 3 documents">Edited from your notes. <a href="#undo" onClick={(e) => e.preventDefault()}>Undo</a></Alert> },
    { kind: 'dont', caption: 'Never present generated output as final, verified fact.', text: '“Your policy is definitely approved.”' },
  ]} />
);
const EmptyPattern = () => (
  <DoDont items={[
    { kind: 'do', caption: 'One sentence of why, one primary action.', example: () => <EmptyState title="No invoices yet" description="Create one to start tracking payments." /> },
    { kind: 'dont', caption: 'Do not leave a blank panel or say “No data”.', text: 'No data.' },
  ]} />
);
const FormsPattern = () => (
  <DoDont items={[
    { kind: 'do', caption: 'Validate on blur, explain the fix next to the field.', example: () => <div style={{ width: 240 }}><Input label="Email" isInvalid errorMessage="Add an @ and a domain, like name@company.com." defaultValue="bala" /></div> },
    { kind: 'dont', caption: 'Do not validate while typing, or say “Invalid input”.', text: 'Error: Invalid input' },
  ]} />
);
const HandoffPattern = () => (
  <>
    <P>Hand developers tokens and component names, not pixels. A spec that says “radius-xl, space-16, text-muted” survives theme and accent changes. A spec that says “12px, #595959” does not.</P>
    <div style={row}><Select aria-label="Handoff format" defaultSelectedKey="tokens" ><SelectItem id="tokens">Token names</SelectItem><SelectItem id="px">Raw values</SelectItem></Select><Badge variant="success">Use tokens</Badge></div>
  </>
);

const R = (items: [string, string][], numbered = false) => () => <RuleCards numbered={numbered} items={items.map(([title, body]) => ({ title, body }))} />;
const AiSources = R([['Show sources', 'Link every claim to the document, row or message it came from. “Based on 3 documents” with a way to open them.'], ['Say how sure', 'Use plain words (“Likely”, “Needs review”), not percentages the model cannot back up.'], ['Mark what is generated', 'Label AI text and AI edits with a small badge. Do not mix them into human content unmarked.']]);
const AiStream = R([['Show progress at once', 'Start streaming or show a skeleton within 300ms. A silent pause reads as a crash.'], ['Let people stop', 'A Stop button stays visible while the model works and keeps the partial result.'], ['Never move the target', 'Do not shift buttons or scroll position while text streams in.'], ['Respect reduced motion', 'Replace typing animation with a plain fade or an instant render.']], true);
const AiApply = R([['Preview first', 'Show the diff or draft before it changes anything. Apply is a separate, explicit action.'], ['Make it undoable', 'Every applied change gets Undo for at least 10 seconds, and a history entry afterwards.'], ['Confirm the irreversible', 'Sending, paying or deleting always needs a human confirm, even when the model is sure.']], true);
const AiFail = R([['Say what failed', 'Name the step that failed and what is safe to retry.'], ['Offer a human path', 'Give a link to docs, search or support. Never leave only “Try again”.'], ['Keep the input', 'The prompt and attachments stay in the composer after an error.']]);
const EmptyNoResults = R([['Echo the query', 'No results for “quarterly”. Repeat what was typed so a typo is easy to spot.'], ['Offer a next step', 'Clear filters, search everywhere, or create it. One primary action.'], ['Keep the layout', 'Hold the height of the results area so the page does not jump.']], true);
const EmptyDone = R([['Celebrate lightly', 'Inbox zero deserves one calm line, not confetti.'], ['Say what comes next', 'Tell people when new items will appear or how to add one.'], ['Do not look broken', 'Keep the heading and toolbar; only the list is empty.']]);
const EmptyVsError = () => <DoDont items={[
  { kind: 'do', caption: 'Empty is a state of success. Explain and invite.', example: () => <EmptyState title="No invoices yet" description="Create one to start tracking payments." /> },
  { kind: 'dont', caption: 'Do not use the error style for an empty list.', example: () => <Alert variant="danger" title="Error">No invoices found.</Alert> },
]} />;
const EmptyWriting = R([['Title: what is missing', 'No invoices yet. Under 5 words, no punctuation.'], ['Description: why and how', 'One sentence. “Create one to start tracking payments.”'], ['Action: a verb and object', 'Create invoice. Not “Get started” or “Click here”.']]);
const FormWhen = R([['On blur, not on type', 'Validate when the user leaves a field. Live checks only for availability and strength meters.'], ['On submit, summarise', 'List every error at the top, link each to its field, and move focus to the first.'], ['Clear on fix', 'Remove an error the moment the value becomes valid.']], true);
const FormRequired = R([['Mark the exception', 'If most fields are required, label the optional ones “Optional”. Do not use red asterisks alone.'], ['Ask for less', 'Every extra field costs completions. Cut anything you can derive.'], ['Group and order', 'Put related fields together, in the order people think of them.']]);
const FormSubmit = R([['Button says the action', 'Create invoice, not Submit. It shows isLoading while pending.'], ['Keep the data', 'On error nothing the user typed is cleared. Ever.'], ['Confirm success', 'A toast for quick saves, a page change for creations. Say what was created.']]);
const FormLong = R([['Save drafts', 'Autosave long forms and say so: “Saved 2 minutes ago”.'], ['Warn on leave', 'Prompt only when there are unsaved changes.'], ['Use steps sparingly', 'A Stepper helps above about 8 fields. Otherwise one page.']]);
const HandoffWhat = R([['Tokens first', 'Name color, space, radius and type tokens. Never raw hex or pixel values.'], ['Component names', 'Use the oniva-ui name and props: Button variant=secondary size=sm.'], ['Behavior, not pictures', 'Describe what happens on hover, press, error and empty, with a link to the docs page.']], true);
const HandoffStates = R([['All states', 'Default, hover, focus, pressed, disabled, loading, error and empty for each interactive piece.'], ['All themes', 'Check light and dark and one non-blue accent before handing off.'], ['Long content', 'Show the longest realistic label and a right-to-left example if you ship it.']]);
const HandoffNaming = R([['Layers match code', 'Name Figma layers after components and props so devs search the same words.'], ['One source of truth', 'If Figma and the docs disagree, the docs page wins. Fix Figma.'], ['No orphan styles', 'Every fill and text style maps to a token. Delete the rest.']]);
const HandoffReview = R([['Review in the browser', 'Compare the built page against the design at 1440 and 390 wide, in both themes.'], ['Check the keyboard', 'Tab through the flow. Every action reachable, focus always visible.'], ['Run axe', 'Zero serious or critical issues before the ticket closes.']], true);

const sec = (id: string, title: string, Render: ComponentType) => ({ id, title, Render });
export const staticPages: StaticPage[] = [
  { path: '/getting-started/introduction', group: 'getting-started', title: 'Introduction', lede: `oniva-ui is ${counts.total} React components on React Aria and StyleX. Install it, wrap your app in ThemeProvider, ship.`, sections: [sec('install', 'Install', Install), sec('css-variables', 'CSS variables', Vars)] },
  { path: '/getting-started/principles', group: 'getting-started', title: 'Principles', lede: 'Six rules we argue from when a decision is unclear.', sections: [sec('principles', 'The six', Principles)] },
  { path: '/getting-started/contributing', group: 'getting-started', title: 'Contributing', lede: 'Plan, work, review, compound. Each loop leaves the next one easier.', sections: [sec('the-loop', 'The compound loop', Loop), sec('docs-contract', 'Docs contract', DocsContract)] },
  { path: '/foundations/color', group: 'foundations', title: 'Color', lede: 'Eleven accent steps and semantic tokens that swap per theme. Ratios update when you switch light, dark or accent.', sections: [sec('hue-ramps', 'Hue ramps', HueRamps), sec('active-accent', 'Active accent', Color), sec('semantic-tokens', 'Semantic tokens', SemanticTokens), sec('contrast', 'Contrast ratios', ContrastRatios), sec('principles', 'Rules', ColorRules)] },
  { path: '/foundations/typography', group: 'foundations', title: 'Typography', lede: 'Fourteen sizes from 11px to 72px, three weights, one mono face.', sections: [sec('scale', 'Type scale', TypeScale), sec('tokens', 'Size tokens', TypeTokens), sec('weights', 'Weights and mono', Weights), sec('rules', 'Rules', TypeRules)] },
  { path: '/foundations/spacing', group: 'foundations', title: 'Spacing', lede: 'Fifteen steps from 1px to 96px. Pick the token, never the number.', sections: [sec('scale', 'Scale', Space)] },
  { path: '/foundations/radius', group: 'foundations', title: 'Radius', lede: 'Nine radii. Controls use md (10px), cards xl, pills full.', sections: [sec('scale', 'Scale', Radius)] },
  { path: '/foundations/elevation', group: 'foundations', title: 'Depth', lede: 'Five levels: flat, recessed, raised, floating and overlay. Each means one thing, and most surfaces are flat.', sections: [sec('levels', 'The five levels', Depth), sec('rules', 'Rules', DepthRules), sec('tokens', 'Elevation tokens', Elevation)] },
  { path: '/foundations/iconography', group: 'foundations', title: 'Iconography', lede: 'lucide-react only. 16px at stroke 2 is the default.', sections: [sec('sizes', 'Sizes and usage', Icons)] },
  { path: '/patterns/ai-assistance', group: 'patterns', title: 'AI assistance', lede: 'Show what the model did, how sure it is, and how to undo it.', sections: [sec('disclose', 'Disclose and allow undo', AiPattern), sec('sources', 'Sources and confidence', AiSources), sec('streaming', 'Streaming and waiting', AiStream), sec('apply', 'Preview, apply, undo', AiApply), sec('failure', 'When it fails', AiFail)] },
  { path: '/patterns/empty-states', group: 'patterns', title: 'Empty states', lede: 'An empty state is the first thing a new user sees. Make it a next step.', sections: [sec('first-use', 'First use', EmptyPattern), sec('no-results', 'No results', EmptyNoResults), sec('all-done', 'All done', EmptyDone), sec('empty-vs-error', 'Empty is not an error', EmptyVsError), sec('writing', 'Writing an empty state', EmptyWriting)] },
  { path: '/patterns/forms-and-validation', group: 'patterns', title: 'Forms & validation', lede: 'Validate on blur, say how to fix it, keep what the user typed.', sections: [sec('errors', 'Error messages', FormsPattern), sec('when', 'When to validate', FormWhen), sec('required', 'Required, optional, order', FormRequired), sec('submit', 'Submitting', FormSubmit), sec('long-forms', 'Long forms', FormLong)] },
  { path: '/patterns/design-handoff', group: 'patterns', title: 'Design handoff', lede: 'Specify with token names so the build follows theme and accent.', sections: [sec('tokens', 'Tokens over pixels', HandoffPattern), sec('what', 'What to hand off', HandoffWhat), sec('states', 'States and themes', HandoffStates), sec('naming', 'Naming and sources', HandoffNaming), sec('review', 'Review', HandoffReview)] },
];
export { Link };
