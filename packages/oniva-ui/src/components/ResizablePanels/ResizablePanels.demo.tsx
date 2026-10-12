import * as stylex from '@stylexjs/stylex';
import type { DemoModule } from '../../internal/demo';
import { demoStyles } from '../../internal/nav-demo';
import { ResizablePanel, ResizablePanels } from './ResizablePanels';

const box = { height: 260 } as const;

const demo: DemoModule = {
  meta: {
    title: 'Resizable panels',
    slug: 'resizable-panels',
    category: 'Layout',
    description:
      'Split layout with draggable handles. Drag with a pointer or focus a handle and use the arrow keys.',
  },
  demos: [
    {
      name: 'Two panels',
      code: `<ResizablePanels>
  <ResizablePanel defaultSize={30} minSize={20} aria-label="Inbox">…</ResizablePanel>
  <ResizablePanel aria-label="Message">…</ResizablePanel>
</ResizablePanels>`,
      Component: () => (
        <div style={box}>
          <ResizablePanels aria-label="Mail">
            <ResizablePanel defaultSize={30} minSize={20} aria-label="Inbox">
              <div {...stylex.props(demoStyles.tile)} style={{ height: '100%' }}>
                <strong>Inbox</strong>
                <div {...stylex.props(demoStyles.muted)}>Aylin Demir: Q3 forecast</div>
                <div {...stylex.props(demoStyles.muted)}>Marcus Hale: Invoice 2041</div>
              </div>
            </ResizablePanel>
            <ResizablePanel aria-label="Message">
              <div {...stylex.props(demoStyles.tile)} style={{ height: '100%' }}>
                <strong>Q3 forecast</strong>
                <p {...stylex.props(demoStyles.muted)}>
                  Revenue is tracking $128,430 against a $120,000 plan.
                </p>
              </div>
            </ResizablePanel>
          </ResizablePanels>
        </div>
      ),
    },
    {
      name: 'Three panels, nested vertical',
      code: `<ResizablePanels>
  <ResizablePanel defaultSize={20}>…</ResizablePanel>
  <ResizablePanel>
    <ResizablePanels direction="vertical">…</ResizablePanels>
  </ResizablePanel>
</ResizablePanels>`,
      Component: () => (
        <div style={box}>
          <ResizablePanels aria-label="Workspace">
            <ResizablePanel defaultSize={22} aria-label="Projects">
              <div {...stylex.props(demoStyles.tile)} style={{ height: '100%' }}>
                Projects
              </div>
            </ResizablePanel>
            <ResizablePanel aria-label="Main">
              <ResizablePanels direction="vertical" aria-label="Main split">
                <ResizablePanel defaultSize={65} aria-label="Board">
                  <div {...stylex.props(demoStyles.tile)} style={{ height: '100%' }}>
                    Board
                  </div>
                </ResizablePanel>
                <ResizablePanel aria-label="Activity">
                  <div {...stylex.props(demoStyles.tile)} style={{ height: '100%' }}>
                    Activity
                  </div>
                </ResizablePanel>
              </ResizablePanels>
            </ResizablePanel>
          </ResizablePanels>
        </div>
      ),
    },
  ],
};
export default demo;
