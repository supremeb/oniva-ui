import type { DemoModule } from '../../internal/demo';
import { PressScale } from './PressScale';

const demo: DemoModule = {
  meta: {
    title: 'Press scale',
    slug: 'press-scale',
    category: 'Motion',
    description:
      'Tactile press feedback: scale 0.97 in 120ms ease-out, pointer only. Use `usePressScale` + `motionStyles.pressScaleData` on custom elements, or `motionStyles.pressScale` (:active) on native buttons.',
  },
  demos: [
    {
      name: 'Card',
      code: `const { pressProps } = usePressScale();
<div {...pressProps} {...stylex.props(motionStyles.pressScaleData)} />
// or simply:
<PressScale>Press me</PressScale>`,
      Component: () => (
        <PressScale tabIndex={0} role="button">
          <div style={{ padding: 24, width: 240, borderRadius: 16, border: '1px solid var(--oniva-color-border)', background: 'var(--oniva-color-surface)', cursor: 'pointer', userSelect: 'none' }}>
            Press and hold me
          </div>
        </PressScale>
      ),
    },
  ],
};
export default demo;
