import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import type { DemoModule } from '../../internal/demo';
import { SuccessCheck } from './SuccessCheck';

function CheckDemo() {
  const [st, setSt] = useState<'idle' | 'loading' | 'success'>('loading');
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <SuccessCheck status={st} size={48} />
      <Button size="sm" variant="secondary" onPress={() => setSt(st === 'success' ? 'loading' : 'success')}>{st === 'success' ? 'Reset' : 'Complete'}</Button>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: "Success check",
    slug: "success-check",
    category: 'Motion',
    description: "Spinner that morphs into a drawn check (500ms). Static check under reduced motion.",
  },
  demos: [
    {
      name: "Toggle",
      code: "function CheckDemo() {\n  const [st, setSt] = useState<'idle' | 'loading' | 'success'>('loading');\n  return (\n    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>\n      <SuccessCheck status={st} size={48} />\n      <Button size=\"sm\" variant=\"secondary\" onPress={() => setSt(st === 'success' ? 'loading' : 'success')}>{st === 'success' ? 'Reset' : 'Complete'}</Button>\n    </div>\n  );\n}\n\n<CheckDemo />",
      Component: () => (
        <CheckDemo />
      ),
    },
  ],
};
export default demo;
