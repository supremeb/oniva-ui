import type { DemoModule } from '../../internal/demo';
import { CopyButton } from './CopyButton';

const demo: DemoModule = {
  meta: {
    title: "Copy button",
    slug: "copy-button",
    category: 'Motion',
    description: "Icon-only copy button; copy swaps with a check (scale from 0.25, blur 2px, 250ms).",
  },
  demos: [
    {
      name: "API key",
      code: "<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><code style={{ fontSize: 13 }}>sk_live_4f9a…c21b</code><CopyButton value=\"sk_live_4f9a8d7c21b\" aria-label=\"Copy API key\" size=\"sm\" /></div>",
      Component: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><code style={{ fontSize: 13 }}>sk_live_4f9a…c21b</code><CopyButton value="sk_live_4f9a8d7c21b" aria-label="Copy API key" size="sm" /></div>
      ),
    },
  ],
};
export default demo;
