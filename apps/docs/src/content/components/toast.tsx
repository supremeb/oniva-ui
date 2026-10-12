import { AlertTriangle, CheckCircle2, Info, Loader2, XCircle } from 'lucide-react';
import { Button } from 'oniva-ui';
import type { DocPage } from '../types';

// Toasts render in a fixed live region. The stage draws the same toast (12px radius, 12px padding, 10px gap,
// 20px icon, 24px close) as an inline card, with the real Button as the action.
type V = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'loading';
const icons: Record<V, React.ReactNode> = {
  default: null,
  success: <CheckCircle2 size={20} color="var(--oniva-color-success-solid)" />,
  warning: <AlertTriangle size={20} color="var(--oniva-color-warning-solid)" />,
  danger: <XCircle size={20} color="var(--oniva-color-danger-solid)" />,
  info: <Info size={20} color="var(--oniva-color-info-fg)" />,
  loading: <Loader2 size={20} />,
};
const T = ({ variant = 'success', title = 'Invoice sent', description = 'INV-1042 went to maya@northwind.co.', action }: { variant?: V; title?: string; description?: string; action?: string }) => (
  <div role="status" style={{ alignItems: 'flex-start', background: 'var(--oniva-color-surface)', border: '1px solid var(--oniva-color-border)', borderRadius: 12, boxShadow: 'var(--oniva-shadow-dropdown)', boxSizing: 'border-box', display: 'flex', gap: 10, padding: 12, width: 360 }}>
    {icons[variant] && <span data-part="icon" style={{ display: 'inline-flex', height: 20, width: 20 }}>{icons[variant]}</span>}
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 }}>
      <p data-part="title" style={{ fontSize: 14, fontWeight: 500, lineHeight: '20px', margin: 0 }}>{title}</p>
      {description && <p style={{ color: 'var(--oniva-color-text-muted)', fontSize: 13, lineHeight: '18px', margin: 0 }}>{description}</p>}
      {action && <div data-part="action" style={{ marginTop: 8 }}><Button size="sm" variant="secondary">{action}</Button></div>}
    </div>
    <button type="button" aria-label="Dismiss" data-part="close" style={{ background: 'transparent', border: 0, borderRadius: 6, color: 'var(--oniva-color-text-muted)', height: 24, marginInlineEnd: -4, marginTop: -2, width: 24 }}>×</button>
  </div>
);
const Stack = () => (
  <div style={{ height: 150, position: 'relative', width: 360 }}>
    <div style={{ left: 0, position: 'absolute', top: 40, transform: 'scale(.9)', transformOrigin: 'bottom', opacity: 0.8 }}><T title="Report ready" description="" /></div>
    <div style={{ left: 0, position: 'absolute', top: 70 }}><T /></div>
  </div>
);

const page: DocPage = {
  slug: 'toast',
  status: 'Stable',
  version: '0.1.0',
  importName: 'ToastProvider',
  group: ['Components', 'Overlays'],
  sourcePath: 'components/Toast',
  lede: 'A short message that confirms something happened without interrupting. Call toast() from anywhere; a stack in the corner shows it, pauses on hover and clears itself unless the user needs to act.',
  anatomy: {
    intro: 'Five parts. The container and title are always present; icon, description and action depend on the message.',
    Render: () => <T action="View invoice" />,
    parts: [
      { name: 'Toast', description: '12px radius, 1px border, dropdown shadow, 12px padding, 10px gap, role status in an aria-live region.', selector: '[role="status"]' },
      { name: 'Icon', description: '20px, by variant: success, warning, danger, info, spinner. Default has none; icon={null} hides it.', selector: '[data-part="icon"]' },
      { name: 'Title', description: '14px medium. A complete short sentence about the outcome.', selector: '[data-part="title"]' },
      { name: 'Action', description: 'Optional small secondary Button 8px below the text. Presence makes the toast persistent.', selector: '[data-part="action"]' },
      { name: 'Close', description: '24px square, 6px radius, nudged 4px into the padding.', selector: '[data-part="close"]' },
    ],
  },
  usage: {
    use: ['Confirming a background or completed action: saved, sent, copied.', 'Undo for reversible actions like archive.', 'Reporting async results with toast.promise.'],
    avoid: [
      { text: 'Errors the user must fix in a form.', instead: { slug: 'field', label: 'Field error text' } },
      { text: 'Messages that belong to the page and must stay.', instead: { slug: 'alert', label: 'Alert' } },
      { text: 'Confirming a destructive action before it happens.', instead: { slug: 'alert-dialog', label: 'AlertDialog' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'variant', label: 'Variant', options: ['default', 'success', 'warning', 'danger', 'info', 'loading'] },
      { kind: 'text', key: 'title', label: 'Title', presets: ['Invoice sent', 'Payment declined', 'Customer archived'] },
      { kind: 'toggle', key: 'action', label: 'Action (Undo)' },
      { kind: 'number', key: 'duration', label: 'Duration (ms)', min: 1000, max: 10000, step: 1000 },
    ],
    initial: { variant: 'success', title: 'Invoice sent', action: false, duration: 5000 },
    render: (p, ev) => <div onClick={() => ev('toast(' + p.variant + ')')}><T variant={p.variant as V} title={String(p.title)} action={p.action ? 'Undo' : undefined} /></div>,
    code: (p) => {
      const call = p.variant === 'default' ? 'toast' : `toast.${p.variant}`;
      const opts = [p.action ? `action: { label: 'Undo', onPress: undo }` : '', Number(p.duration) !== 5000 ? `duration: ${p.duration}` : ''].filter(Boolean).join(', ');
      return `${call}('${p.title}'${opts ? `, { ${opts} }` : ''});`;
    },
  },
  states: [
    { name: 'Success', description: 'Auto-dismisses after 5s.', Render: () => <T /> },
    { name: 'Danger', description: 'Persists until dismissed, no timer.', Render: () => <T variant="danger" title="Payment declined" description="Try another card." /> },
    { name: 'With action', description: 'Action toasts persist so the action can be reached.', Render: () => <T variant="default" title="Customer archived" description="" action="Undo" /> },
    { name: 'Loading', description: 'Spinner, no timer; settles into success or error.', Render: () => <T variant="loading" title="Exporting report" description="" /> },
    { name: 'Stacked', description: 'Newest in front; older toasts peek 14px behind, scaled 5% each.', Render: Stack },
  ],
  sections: [
    { type: 'text', id: 'choosing-an-overlay', title: 'Choosing an overlay', body: <>Toasts are passive and transient. For modal, anchored and persistent options see the <a href="#/components/dialog">comparison on Dialog</a>.</> },
    {
      type: 'rules', id: 'toast-behavior', title: 'Stacking and duration',
      items: [
        { title: 'Stacking', body: 'Three toasts are visible by default (maxVisible); the queue holds five. Hover or focus expands the stack and pauses every timer.' },
        { title: 'Durations', body: '5000ms by default. Pass duration to change it, or Infinity to keep it.' },
        { title: 'Must persist', body: 'Toasts with an action, and danger or warning variants, never time out (WCAG 2.2.1). Loading toasts persist until their promise settles.' },
        { title: 'Dismiss', body: 'Close button, Esc, or swipe toward the edge (about 0.11px/ms or 45% of width).' },
      ],
    },
    {
      type: 'numbered', id: 'promise-toasts', title: 'Promise toasts',
      intro: 'toast.promise(promise, { loading, success, error }) shows one toast that updates in place.',
      items: [
        { title: 'Loading', body: 'Appears immediately and persists: Exporting report.' },
        { title: 'Success', body: 'Replaces the loading toast and gets the 5s timer. success can be a function of the result: (r) => ({ title: `${r.rows} rows exported` }).' },
        { title: 'Error', body: 'Becomes a danger toast that persists. Say what to do next: Try another card.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Past tense, short', body: 'Invoice sent, Link copied. Under 40 characters.' },
      { title: 'Errors say what to do', body: 'Payment declined. Try another card. Never just Error.' },
      { title: 'Action is one word', body: 'Undo, View, Retry. Match it to the outcome.' },
      { title: 'No exclamation marks, no periods in titles', body: 'Descriptions may be full sentences with a period.' },
      { title: 'One message per event', body: 'Do not stack five toasts from one bulk action; summarise: 12 invoices sent.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['F6'], action: 'Moves focus into the toast region.' },
      { keys: ['Tab'], action: 'Moves between the action and close buttons of the focused toast.' },
      { keys: ['Esc'], action: 'Dismisses the focused toast.' },
      { keys: ['Enter', 'Space'], action: 'Runs the focused action or close button.' },
    ],
    notes: ['The region is a landmark labelled by aria-label; messages are announced politely.', 'Hover, focus and window blur pause timers so nothing disappears while being read.', 'Persisting action and error toasts satisfy WCAG 2.2.1 timing.', 'Mount one ToastProvider near the root, inside the ThemeProvider.'],
    reducedMotion: 'Stack transitions and enter/exit slides are removed; toasts appear and leave without movement.',
  },
  props: [
    { name: 'toast(title, options)', type: '(ReactNode | ToastOptions & { title }, ToastOptions?) => string', description: 'Shows a toast and returns its key. Also toast.success, warning, danger, error, info, loading.' },
    { name: 'toast.promise', type: '(promise, { loading, success, error, ...options }) => string', description: 'Loading to success or error in place.' },
    { name: 'toast.dismiss / toast.clear', type: '(key) => void / () => void', description: 'Close one or all.' },
    { name: 'options.description', type: 'ReactNode', description: '13px muted line under the title.' },
    { name: 'options.variant', type: "'default' | 'success' | 'warning' | 'danger' | 'info' | 'loading'", default: "'default'", description: 'Icon and persistence.' },
    { name: 'options.action', type: '{ label: string; onPress?: () => void }', description: 'Inline button; makes the toast persistent.' },
    { name: 'options.icon', type: 'ReactNode | null', description: 'Override or hide the icon.' },
    { name: 'options.duration', type: 'number', default: '5000', description: 'ms; Infinity keeps it. Persistent variants default to Infinity.' },
    { name: 'options.onClose', type: '() => void', description: 'Fires on dismiss or timeout.' },
    { name: 'ToastProvider.placement / position', type: 'ToastPlacement', default: "'bottom-right'", description: 'top|bottom + left|center|right.' },
    { name: 'ToastProvider.maxVisible', type: 'number', default: '3', description: 'Toasts shown in the stack.' },
    { name: 'ToastProvider.queue', type: 'OnivaToastQueue', description: 'Custom queue instead of the shared one.' },
    { name: 'ToastProvider.aria-label', type: 'string', description: 'Region label.' },
  ],
  related: ['alert', 'alert-dialog', 'dialog', 'spinner'],
};
export default page;
