import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Switch } from './Switch';

const col = { display: 'flex', flexDirection: 'column', gap: 12 } as const;

const demo: DemoModule = {
  meta: {
    title: 'Switch',
    slug: 'switch',
    category: 'Forms',
    description: 'Binary toggle built on React Aria Switch with gradient accent track.',
  },
  demos: [
    {
      name: 'Basic',
      code: `<Switch defaultSelected>Email notifications</Switch>
<Switch>Push notifications</Switch>
<Switch isDisabled>Disabled</Switch>`,
      Component: () => (
        <div style={col}>
          <Switch defaultSelected>Email notifications</Switch>
          <Switch>Push notifications</Switch>
          <Switch isDisabled>Disabled</Switch>
        </div>
      ),
    },
    {
      name: 'Sizes and controlled',
      code: `const [on, setOn] = useState(true);
<Switch size="sm" isSelected={on} onChange={setOn}>Small</Switch>
<Switch size="md" isSelected={on} onChange={setOn}>Medium</Switch>
<Switch size="lg" isSelected={on} onChange={setOn}>Large</Switch>`,
      Component: function Controlled() {
        const [on, setOn] = useState(true);
        return (
          <div style={col}>
            <Switch size="sm" isSelected={on} onChange={setOn}>
              Small
            </Switch>
            <Switch size="md" isSelected={on} onChange={setOn}>
              Medium
            </Switch>
            <Switch size="lg" isSelected={on} onChange={setOn}>
              Large
            </Switch>
          </div>
        );
      },
    },
  ],
};

export default demo;
