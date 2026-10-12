import * as stylex from '@stylexjs/stylex';
import type { ReactNode, Ref } from 'react';
import { Dialog, DialogHeader, DialogTitle, Modal } from '../../components/Dialog';
import { Tab, TabList, TabPanel, Tabs } from '../../components/Tabs';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';

const styles = stylex.create({
  modal: { width: 760 },
  dialog: { padding: 0 },
  tabs: { display: 'grid', gap: 0, gridTemplateColumns: '200px 1fr', minHeight: 420 },
  nav: {
    alignSelf: 'stretch',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderInlineEndColor: colors['--oniva-color-border'],
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: 1,
    boxSizing: 'border-box',
    padding: 12,
  },
  tab: { justifyContent: 'flex-start' },
  panel: { boxSizing: 'border-box', minWidth: 0, overflowY: 'auto', padding: 24 },
  heading: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-18'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-18'],
    margin: 0,
    marginBottom: 16,
  },
});

export interface SettingsPage {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Page heading; defaults to the label. */
  heading?: string;
  content: ReactNode;
}

export interface SettingsModalProps {
  pages: SettingsPage[];
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  defaultPage?: string;
  page?: string;
  onPageChange?: (id: string) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Multi-page settings dialog with a sidebar nav. Control with `isOpen` or place inside a `DialogTrigger`. */
export function SettingsModal({
  pages,
  title = 'Settings',
  defaultPage,
  page,
  onPageChange,
  isOpen,
  defaultOpen,
  onOpenChange,
  xstyle,
  ref,
}: SettingsModalProps) {
  return (
    <Modal
      ref={ref}
      size="lg"
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      xstyle={xstyle ?? styles.modal}
    >
      <Dialog aria-label={title} xstyle={styles.dialog}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Tabs
          orientation="vertical"
          variant="pill"
          defaultSelectedKey={defaultPage ?? pages[0]?.id}
          selectedKey={page}
          onSelectionChange={(k) => onPageChange?.(String(k))}
          xstyle={styles.tabs}
        >
          <TabList aria-label={`${title} sections`} xstyle={styles.nav}>
            {pages.map((p) => (
              <Tab key={p.id} id={p.id} icon={p.icon} xstyle={styles.tab}>
                {p.label}
              </Tab>
            ))}
          </TabList>
          {pages.map((p) => (
            <TabPanel key={p.id} id={p.id} xstyle={styles.panel}>
              <h3 {...stylex.props(styles.heading)}>{p.heading ?? p.label}</h3>
              {p.content}
            </TabPanel>
          ))}
        </Tabs>
      </Dialog>
    </Modal>
  );
}
