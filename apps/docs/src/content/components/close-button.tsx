import { CloseButton } from 'oniva-ui';
import type { DocPage } from '../types';

const page: DocPage = {
  slug: 'close-button',
  status: 'Stable',
  version: '0.1.0',
  importName: 'CloseButton',
  group: ['Components', 'Actions'],
  sourcePath: 'components/CloseButton',
  lede: 'A compact dismiss control with a built-in "Close" label. It handles the corner of alerts, tags, dialogs and toasts where a full button would be too loud.',
  anatomy: {
    intro: 'Two parts. Both are always present. The label is invisible and comes from aria-label.',
    Render: () => <CloseButton size="md" aria-label="Close panel" />,
    parts: [
      { name: 'Hit area', description: 'Native button, 32px square at md (24px at sm), 8px radius at md (6px at sm). No border, transparent until hovered.', selector: 'button' },
      { name: 'X icon', description: 'Lucide X, 16px at md and 14px at sm, muted icon colour that moves to full text colour on hover. aria-hidden.', selector: 'button svg' },
    ],
  },
  usage: {
    use: ['Dismissing alerts, toasts and banners.', 'The corner control of dialogs, drawers and popovers.', 'Removing a tag or chip.'],
    avoid: [
      { text: 'A labelled Cancel or Discard action in a footer.', instead: { slug: 'button', label: 'Button' } },
      { text: 'Any icon that is not an X, such as a menu or download.', instead: { slug: 'icon-button', label: 'IconButton' } },
      { text: 'Collapsing a section without removing it.', instead: { slug: 'collapsible', label: 'Collapsible' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md'] },
      { kind: 'text', key: 'label', label: 'Accessible label', presets: ['Close', 'Close panel', 'Dismiss alert', 'Remove tag'] },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { size: 'sm', label: 'Close', isDisabled: false },
    render: (p, ev) => <CloseButton size={p.size as 'sm'} aria-label={String(p.label)} isDisabled={Boolean(p.isDisabled)} onPress={() => ev('onPress')} />,
    code: (p) => {
      const attrs = [p.size !== 'sm' && `size="${p.size}"`, p.label !== 'Close' && `aria-label="${p.label}"`, p.isDisabled && 'isDisabled'].filter(Boolean).join(' ');
      return `<CloseButton${attrs ? ' ' + attrs : ''} onPress={dismiss} />`;
    },
  },
  states: [
    { name: 'Small (default)', description: '24px square, 14px icon. For alerts, tags and toasts.', Render: () => <CloseButton /> },
    { name: 'Medium', description: '32px square, 16px icon. For dialogs and drawers.', Render: () => <CloseButton size="md" aria-label="Close panel" /> },
    { name: 'Disabled', description: 'Not pressable. Use while a dismiss is saving.', Render: () => <CloseButton isDisabled /> },
    {
      name: 'Focus-visible',
      description: 'Keyboard focus draws a 2px accent ring, 1px offset. Shown with a forced outline; tab to a live one on any page.',
      Render: () => <CloseButton size="md" aria-label="Close panel" style={{ outline: '2px solid var(--oniva-color-focus-ring)', outlineOffset: 1 }} />,
    },
  ],
  sections: [
    {
      type: 'rules', id: 'rules', title: 'Rules',
      items: [
        { title: 'Top end corner', body: 'Place it at the top end of the container, 8 to 12px from each edge, so it sits in the same spot across alerts and dialogs.' },
        { title: 'Name what closes', body: 'Default label is "Close". When several close buttons share a screen, name the target: "Dismiss payment alert".' },
        { title: 'Size follows density', body: 'sm in inline alerts and tags (row height 40px or less). md in dialogs, drawers and bottom sheets.' },
      ],
    },
    {
      type: 'itemTypes', id: 'sizes', title: 'Sizes', intro: 'Two sizes. Both keep the icon centred.',
      items: [
        { name: 'sm', description: '24px, 6px radius, 14px icon.', Render: () => <CloseButton size="sm" /> },
        { name: 'md', description: '32px, 8px radius, 16px icon.', Render: () => <CloseButton size="md" /> },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Label is a verb phrase', body: 'Close, Dismiss alert, Remove tag. It is read aloud and never shown.' },
      { title: 'Match the action', body: 'Use "Remove" when the item is deleted, "Dismiss" when it can come back, "Close" for panels.' },
      { title: 'No tooltip needed', body: 'The X is universal. Skip the tooltip unless the action is not obvious.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Enter', 'Space'], action: 'Activates the button.' },
      { keys: ['Tab'], action: 'Moves focus to or past the button.' },
    ],
    notes: [
      'Native button with aria-label defaulting to "Close". The X glyph is aria-hidden.',
      'Focus ring is 2px, 1px offset, visible for keyboard focus only.',
      'Touch target: 24px at sm is below the 44px guideline. Put sm buttons inside a 44px-tall row or switch to md on touch layouts.',
      'Hover styles only apply on hover-capable pointers, so touch never shows a stuck hover.',
    ],
    reducedMotion: 'The press scale (0.97) is the only motion and is a 150ms transform. Keep it; it is not parallax.',
  },
  props: [
    { name: 'size', type: "'sm' | 'md'", default: "'sm'", description: '24px or 32px square.' },
    { name: 'aria-label', type: 'string', default: "'Close'", description: 'Accessible name.' },
    { name: 'onPress', type: '(e: PressEvent) => void', description: 'Fires for pointer, keyboard and touch.' },
    { name: 'isDisabled', type: 'boolean', default: 'false', description: 'Disables interaction.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'StyleX overrides, applied last.' },
    { name: 'className / style', type: 'string / CSSProperties', description: 'Escape hatches. Also accepts the other React Aria Button props.' },
    { name: 'ref', type: 'Ref<HTMLButtonElement>', description: 'Forwarded to the button.' },
  ],
  related: ['alert', 'toast', 'tag', 'dialog', 'icon-button'],
};
export default page;
